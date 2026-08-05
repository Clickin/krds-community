// In-browser conformance capture worker for @web/test-runner (vite).
//
// For every catalog fixture x state it renders the *upstream* KRDS fixture
// HTML and the framework component (via apps/conformance-host adapters) inside
// one browser context, applies the state actions/props, and captures the same
// DOM / semantics / visual-signature snapshots the Node capture functions
// produce. Captures are accumulated and emitted as a single framed JSON blob
// on stdout so scripts/conformance/parallel.mjs can consume them without any
// Node<->browser round-trips.
//
// The judgment (compareDom, compareVisualCaptures, contract checks, report
// assembly) stays in Node; this file only performs captures.

import { captureDomTree, captureSemantics, captureVisualSignature, captureAccessibilityTree, settle } from "../../scripts/conformance/browser-harness.mjs";
import { baseProps } from "../../apps/conformance-host/src/fixture-props.ts";
import {
  contractGroupSelectors,
  contractGroupsFor,
  judgeState,
  stateActionsOf,
} from "../../scripts/conformance/browser-judge.mjs";

const upstreamFiles = import.meta.glob("/upstream/krds-html/html/code/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const catalog = await fetch("/apps/conformance-host/dist/fixtures.json").then((response) => {
  if (!response.ok) throw new Error(`catalog fetch failed: ${response.status}`);
  return response.json();
});

const styleUrl = "/packages/styles/dist/index.css";
const scriptUrl = "/upstream/krds-html/resources/cdn/krds.min.js";

const waitForKrdsReady = async () => {
  // KRDS init script may need a tick to wire up behaviors; settle twice so
  // hover/focus paint and injected listeners are stable before capture.
  await settle();
  await settle();
};

const stripPageWrapper = (sourceHtml) => {
  const match = sourceHtml.match(/<div class="fieldset">([\s\S]*)<\/div>\s*(?:<!--[^]*?-->)?\s*$/);
  return match ? match[1] : sourceHtml;
};

const fixtureRootAttributes = ({ layoutContext }) => {
  if (layoutContext === "content-inner") {
    return { class: "inner", "data-layout-context": "content-inner" };
  }
  if (layoutContext === "viewport-height") {
    return { "data-layout-context": "viewport-height" };
  }
  return {};
};

// Inject the upstream KRDS stylesheet + init script once per document.
let upstreamAssetsInjected = false;
const ensureUpstreamAssets = () => {
  if (upstreamAssetsInjected) return;
  upstreamAssetsInjected = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = styleUrl;
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = scriptUrl;
  document.head.appendChild(script);
};

// A fresh, styled container that mirrors the Node upstream runtime document.
const createFixtureContainer = (fixture, layoutAttributes) => {
  const container = document.createElement("div");
  container.id = "fixture-root";
  const attrs = fixtureRootAttributes(layoutAttributes);
  for (const [name, value] of Object.entries(attrs)) {
    container.setAttribute(name, value);
  }
  container.style.cssText =
    "display:flex;flex-direction:column;align-items:center;justify-content:center;" +
    "min-width:0;min-height:0;width:100%;height:100%;";
  document.body.appendChild(container);
  return container;
};

const selectSourceSubtree = (root, fixture) => {
  if (!fixture.sourceSelector) return root;
  const candidates = [...root.querySelectorAll(fixture.sourceSelector)];
  const sourceIndex = fixture.sourceIndex ?? 0;
  if (candidates.length <= sourceIndex) {
    throw new Error(
      `Source selector did not resolve sourceIndex ${sourceIndex} for ${fixture.id}`,
    );
  }
  let selected = candidates[sourceIndex];
  if (fixture.sourceAncestorSelector) {
    const ancestor = selected.closest(fixture.sourceAncestorSelector);
    if (!ancestor) {
      throw new Error(`Source ancestor selector did not resolve for ${fixture.id}`);
    }
    selected = ancestor;
  }
  return selected;
};

const interactiveSelector =
  'button, input, select, textarea, a[href], summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

const resolveElement = (root, target, action) => {
  if (target && target !== "fixture" && target !== "root") {
    const found = root.querySelector(target);
    return found ?? root;
  }
  if (["keyboard-focus", "press", "fill", "select-option", "check", "uncheck"].includes(action)) {
    return root.matches(interactiveSelector) ? root : (root.querySelector(interactiveSelector) ?? root);
  }
  return target === "root" ? root : root;
};

const applyStateProps = (root, props = {}) => {
  const rootIsInteractive = root.matches(interactiveSelector);
  const control = rootIsInteractive ? root : root.querySelector(interactiveSelector);
  if (!control) return;
  if ("disabled" in props && "disabled" in control) {
    control.disabled = Boolean(props.disabled);
    control.toggleAttribute("disabled", Boolean(props.disabled));
  }
  const readOnly = props.readOnly ?? props.readonly;
  if (readOnly !== undefined && "readOnly" in control) {
    control.readOnly = Boolean(readOnly);
    control.toggleAttribute("readonly", Boolean(readOnly));
  }
  if ("checked" in props && "checked" in control) {
    control.checked = Boolean(props.checked);
    control.toggleAttribute("checked", Boolean(props.checked));
  }
  if (props.value !== undefined && "value" in control) {
    control.value = String(props.value);
    control.setAttribute("value", String(props.value));
  }
};

const applyActions = async (root, state) => {
  applyStateProps(root, state.props);
  const actions = stateActionsOf(state);
  const events = [];
  const eventTypes = ["click", "input", "change", "submit"];
  const capture = (type) => (event) => {
    const element = event.target instanceof Element ? event.target : root;
    const control = element;
    events.push({
      type,
      target:
        element.id ||
        element.getAttribute("name") ||
        element.tagName.toLocaleLowerCase("en-US"),
      ...("value" in control ? { value: String(control.value) } : {}),
      ...("checked" in control ? { checked: Boolean(control.checked) } : {}),
    });
  };
  const listeners = eventTypes.map((type) => [type, capture(type)]);
  for (const [type, handler] of listeners) root.addEventListener(type, handler);
  let pointerDown = false;
  const cleanup = () => {
    for (const [type, handler] of listeners) root.removeEventListener(type, handler);
    if (pointerDown) {
      document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      pointerDown = false;
    }
  };
  try {
    for (const step of actions) {
      const element = resolveElement(root, step.target, step.action);
      if (step.action === "hover") {
        element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
        element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        if (!element.matches(":hover")) {
          element.setAttribute("data-conformance-hovered", "");
        }
        await settle();
      } else if (step.action === "keyboard-focus") {
        element.focus();
        await settle();
      } else if (step.action === "click") {
        element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        // `element.click()` is trusted by both the upstream KRDS handlers and
        // framework synthetic event systems (React), where raw dispatchEvent
        // clicks are only honored by the framework.
        element.click();
        // Let framework-managed state commit before the next action or capture.
        await settle();
      } else if (step.action === "press") {
        const key = String(step.key ?? "Enter");
        element.focus();
        element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
        element.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }));
        // Native activation: Enter/Space on a focused button fires a click.
        if ((key === "Enter" || key === " ") && element.matches("button, [role='button']")) {
          element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }
        await settle();
      } else if (step.action === "fill") {
        element.focus();
        element.value = String(step.value ?? "");
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (step.action === "select-option") {
        const value = String(step.value ?? "");
        for (const option of element.options ?? []) {
          if (String(option.value) === value) {
            option.selected = true;
            element.dispatchEvent(new Event("change", { bubbles: true }));
            break;
          }
        }
        await settle();
      } else if (step.action === "check" || step.action === "uncheck") {
        if ("disabled" in element && element.disabled) {
          throw new Error(`Cannot ${step.action} a disabled control`);
        }
        const checked = step.action === "check";
        if (element.matches('input[type="checkbox"], input[type="radio"]')) {
          element.checked = checked;
          element.toggleAttribute("checked", checked);
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          element.setAttribute("aria-checked", String(checked));
        }
        await settle();
      } else if (step.action === "submit") {
        const form = element instanceof HTMLFormElement ? element : element.closest("form");
        form?.requestSubmit();
        await settle();
      } else if (step.action === "open") {
        if (element instanceof HTMLDetailsElement) element.open = true;
        else element.setAttribute("open", "");
        await settle();
      } else if (step.action === "close") {
        if (element instanceof HTMLDetailsElement) element.open = false;
        else element.removeAttribute("open");
        await settle();
      } else if (step.action === "pointer-down") {
        element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        pointerDown = true;
      } else if (step.action === "pointer-up") {
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        pointerDown = false;
      } else if (step.action === "add-class") {
        element.classList.add(String(step.value));
      } else if (step.action === "remove-class") {
        element.classList.remove(String(step.value));
      } else if (step.action === "set-attribute") {
        element.setAttribute(String(step.key), String(step.value));
      } else if (step.action === "remove-attribute") {
        element.removeAttribute(String(step.value));
      } else {
        throw new Error(`Unsupported fixture action: ${step.action}`);
      }
    }
    return { cleanup, events, actions };
  } catch (error) {
    cleanup();
    throw error;
  }
};

const captureContractSemantics = async (root, fixture) => {
  const rootSemantics = await captureSemantics(root);
  const groups = {};
  for (const group of contractGroupsFor(fixture.contract?.semanticElement)) {
    const selector = contractGroupSelectors[group];
    const candidates = root.matches(selector)
      ? [root]
      : [...root.querySelectorAll(selector)];
    groups[group] = await Promise.all(candidates.map(captureSemantics));
  }
  return { root: rootSemantics, groups };
};

const captureBundle = async (root, state, fixture, { side = "upstream", normalizationRules = [] } = {}) => {
  const { cleanup, events, actions } = await applyActions(root, state);
  await settle();
  const dom = await captureDomTree(root, { normalizationRules, snapshotSide: side });
  const semantics = await captureSemantics(root);
  const visualSignature = await captureVisualSignature(root);
  const contractSemantics = await captureContractSemantics(root, fixture);
  const accessibility = await captureAccessibilityTree(root);
  cleanup();
  return { dom, semantics, visualSignature, contractSemantics, accessibility, events, actions };
};

const mountFramework = async (adapter, fixture, state) => {
  const container = createFixtureContainer(fixture, {});
  const props = { ...baseProps(fixture), ...fixture.props, ...state.props };
  const mounted = await adapter.mount(container, fixture.componentId, props);
  await settle();
  await settle();
  return { container, mounted, props };
};

const renderUpstream = (fixture) => {
  ensureUpstreamAssets();
  const container = createFixtureContainer(fixture, { layoutContext: fixture.layoutContext });
  const sourcePath = `/${fixture.sourcePath.replace(/^\/+/, "")}`;
  const raw = upstreamFiles[sourcePath];
  if (typeof raw !== "string") {
    throw new Error(`upstream fixture source not found: ${sourcePath}`);
  }
  container.innerHTML = stripPageWrapper(raw);
  // KRDS initializes its interactive components (accordion, tabs, etc.) on
  // `window` DOMContentLoaded, which already fired before this content was
  // injected. Re-dispatch so the injected markup gets its event handlers.
  window.dispatchEvent(new Event("DOMContentLoaded"));
  return container;
};

export const captureFixture = async (framework, adapter, fixture) => {
  const records = [];
  for (const state of fixture.states) {
    const record = {
      fixtureId: fixture.id,
      componentId: fixture.componentId,
      framework,
      state: state.id,
      status: "passing",
    };
    let upstreamContainer;
    let frameworkContainer;
    try {
      upstreamContainer = renderUpstream(fixture);
      await waitForKrdsReady();
      const upstreamRoot = selectSourceSubtree(upstreamContainer, fixture);
      if (framework !== "astro") {
        const mountedState = await mountFramework(adapter, fixture, state);
        frameworkContainer = mountedState.container;
        await settle();
        let frameworkRoot;
        try {
          frameworkRoot = selectSourceSubtree(frameworkContainer, fixture);
        } catch (error) {
          mountedState.mounted.dispose();
          throw error;
        }
        const upstream = await captureBundle(upstreamRoot, state, fixture, {
          side: "upstream",
          normalizationRules: compiledErrata[fixture.id] ?? [],
        });
        const frameworkCapture = await captureBundle(frameworkRoot, state, fixture, {
          side: "framework",
          normalizationRules: [],
        });
        mountedState.mounted.dispose();
        const verdict = judgeState(fixture, state, {
          upstream,
          framework: frameworkCapture,
          frameworkEvents: frameworkCapture.events,
        });
        record.status = verdict.status;
        record.checks = verdict.checks;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      record.status = "failing";
      record.error = message;
    } finally {
      upstreamContainer?.remove();
      frameworkContainer?.remove();
    }
    if (record.status === "failing" && record.error) {
      record.checks = {
        render: { passed: false, errors: [record.error] },
        dom: { passed: false, errors: [record.error] },
        accessibility: { passed: false, errors: [record.error] },
        behavior: { passed: false, errors: [record.error], events: [] },
        form: { passed: false, errors: [record.error] },
        visual: { passed: false, errors: [record.error] },
        contract: { passed: false, errors: [record.error] },
      };
      delete record.error;
    }
    records.push(record);
  }
  return records;
};

const collectorOrigin = "http://127.0.0.1:8123";

export const compiledErrata = await fetch(`${collectorOrigin}/config`)
  .then((response) => response.json())
  .then((configValue) => configValue.errata ?? {})
  .catch(() => ({}));

export const emitFixtureCapture = async (framework, fixtureId, records) => {
  const payload = { catalog: catalog.upstream, framework, fixtureId, results: records };
  const response = await fetch(`${collectorOrigin}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`collector rejected captures: ${response.status}`);
};
