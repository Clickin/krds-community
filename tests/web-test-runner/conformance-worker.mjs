// In-browser conformance capture worker for @web/test-runner (vite).
//
// For every catalog fixture x state it renders the *upstream* KRDS fixture
// HTML and the framework component (via apps/conformance-host adapters) inside
// one browser context, applies the state actions/props, and captures the same
// DOM / semantics / visual-signature snapshots the Node capture functions
// produce. Captures are POSTed to the local collector so scripts/conformance/
// parallel.mjs can consume them without large Node<->browser round-trips.
//
// The judgment (compareDom, visual signatures, contract checks) runs here; the
// Node runner only assembles the small verdict report.

import {
  captureDomTree,
  captureSemantics,
  captureVisualSignature,
  captureAccessibilityTree,
  rasterizeRootToImageData as rasterizeRootToImageDataBase,
  settle,
} from "../../scripts/conformance/browser-harness.mjs";
import { baseProps } from "../../apps/conformance-host/src/fixture-props.ts";
import {
  contractGroupSelectors,
  contractGroupsFor,
  compareVisualSignatures,
  judgeState,
  stateActionsOf,
} from "../../scripts/conformance/browser-judge.mjs";

const collectorOrigin = "http://127.0.0.1:8123";

const workerId = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
const metrics = {
  workerStarts: 1,
  upstreamCaptures: 0,
  upstreamCacheHits: 0,
  visualSignaturesCompared: 0,
  visualSignaturesMatched: 0,
  visualSignaturesMismatched: 0,
  pixelFallbacks: 0,
  rasterizations: 0,
};
globalThis.__KRDS_CONFORMANCE_METRICS__ = metrics;

const rasterizeRootToImageData = async (...args) => {
  metrics.rasterizations += 1;
  return rasterizeRootToImageDataBase(...args);
};

const upstreamCaptureCache = new Map();
const captureKey = (fixture, state) => `${fixture.id}\0${state.id}`;
const freezeCapture = (capture) => {
  const freeze = (value) => {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freeze(child);
    return Object.freeze(value);
  };
  return freeze({
    dom: capture.dom,
    semantics: capture.semantics,
    visualSignature: capture.visualSignature,
    accessibility: capture.accessibility,
    correctedAccessibility: capture.correctedAccessibility,
    contractSemantics: capture.contractSemantics,
    correctedContractSemantics: capture.correctedContractSemantics,
  });
};

const upstreamFiles = {
  ...import.meta.glob("/upstream/krds-html/html/code/*.html", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  ...import.meta.glob("/extra/**/*.html", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
};

const collectorConfig = await fetch(`${collectorOrigin}/config`)
  .then((response) => (response.ok ? response.json() : {}))
  .catch(() => ({}));
const catalogName = collectorConfig.catalog === "extra" ? "fixtures-extra.json" : "fixtures.json";
export const catalog = await fetch(`/apps/conformance-host/dist/${catalogName}`).then(
  (response) => {
    if (!response.ok) throw new Error(`catalog fetch failed: ${response.status}`);
    return response.json();
  },
);

const styleUrl = "/packages/styles/dist/index.css";
const scriptUrl = "/upstream/krds-html/resources/cdn/krds.min.js";

// Mirror the runtime fixture page viewport (desktop 1280x800): give
// document.body a definite box so #fixture-root's height:100% resolves to the
// Same layout context the runtime fixture page renders into. All catalog fixtures share this
// viewport.
const configureViewport = () => {
  const { documentElement, body } = document;
  documentElement.style.width = "1280px";
  documentElement.style.height = "800px";
  documentElement.style.margin = "0";
  body.style.width = "1280px";
  body.style.height = "800px";
  body.style.margin = "0";
  body.style.display = "block";
  body.style.boxSizing = "border-box";
};

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
  configureViewport();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = styleUrl;
  document.head.appendChild(link);
  // Mirror the runtime fixture page: disable animations/transitions so the
  // capture lands on the settled layout state, not a mid-transition frame.
  const style = document.createElement("style");
  style.textContent =
    "*,*::before,*::after{animation:none!important;transition:none!important}" +
    "#fixture-root{display:flex;flex-direction:column;align-items:center;justify-content:center;" +
    "min-width:0;min-height:0;width:100%;height:100%}" +
    '#fixture-root[data-layout-context="viewport-height"]{height:100%}' +
    "#fixture-root>.krds-form-check,#fixture-root>.krds-form-chip{width:fit-content}";
  document.head.appendChild(style);
  const script = document.createElement("script");
  script.src = scriptUrl;
  script.dataset.krdsLoaded = "false";
  script.addEventListener("load", () => {
    script.dataset.krdsLoaded = "true";
  });
  document.head.appendChild(script);
  krdsScript = script;
};

// The upstream init batch (accordion/tab/dropdown/help-panel wiring) listens
// for DOMContentLoaded once per script load. renderUpstream re-dispatches that
// event after injecting the fixture content, so the injected markup gets its
// runtime handlers — but only if the script has actually executed; a re-dispatch
// before the script loads is silently lost and the upstream fixture stays in
// its literal (uninitialized) state. Wait for the script before dispatching.
let krdsScript;
const waitForKrdsScript = async () => {
  if (!krdsScript) return;
  if (krdsScript.dataset.krdsLoaded === "true") return;
  await new Promise((resolve) => {
    krdsScript.addEventListener("load", resolve, { once: true });
  });
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
    throw new Error(`Source selector did not resolve sourceIndex ${sourceIndex} for ${fixture.id}`);
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
    return root.matches(interactiveSelector)
      ? root
      : (root.querySelector(interactiveSelector) ?? root);
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
        element.id || element.getAttribute("name") || element.tagName.toLocaleLowerCase("en-US"),
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
        element.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
        );
        element.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }));
        // Native activation: Enter/Space on a focused button fires a click.
        if ((key === "Enter" || key === " ") && element.matches("button, [role='button']")) {
          element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }
        // Synthetic keyboard events do not move focus. Preserve the observable
        // part of Tab for focusout-based validation fixtures.
        if (key === "Tab") element.blur();
        await settle();
      } else if (step.action === "fill") {
        element.focus();
        // React's value tracker ignores an input event after a direct
        // `element.value = ...` assignment. Use the native prototype setter so
        // every framework observes the same user-like value change.
        const valueSetter = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(element),
          "value",
        )?.set;
        valueSetter?.call(element, String(step.value ?? ""));
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        await settle();
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
  const semanticElement = fixture.contract?.semanticElement;
  // Mirror the runtime contract-root resolution: for composite contracts (e.g.
  // button-and-region) or input contracts, the compared root is the first
  // interactive descendant, not the containing wrapper — otherwise the
  // `accessibleRole` check would see a generic container instead of the
  // controlled control.
  const contractSelector =
    {
      alert: '[role="alert"]',
      button: 'button, [role="button"]',
      contentinfo: 'footer, [role="contentinfo"]',
      dialog: 'dialog, [role="dialog"]',
      "details-summary": "details",
      link: 'a[href], [role="link"]',
      list: 'ul, ol, [role="list"]',
      navigation: 'nav, [role="navigation"]',
      table: 'table, [role="table"]',
    }[semanticElement] ??
    (semanticElement?.includes("-and-") || semanticElement?.startsWith("input[")
      ? interactiveSelector
      : undefined);
  const scopeMatchesContract = contractSelector === undefined || root.matches(contractSelector);
  const contractDescendant = contractSelector ? [...root.querySelectorAll(contractSelector)] : [];
  // Some contract roots wrap the source subtree (e.g. critical-alerts: the
  // .main-urgent-wrap[role=alert] is the parent of the .krds-critical-alerts
  // list), so also climb to a self-or-ancestor match.
  const contractAncestor = contractSelector === undefined ? null : root.closest(contractSelector);
  const contractRoot =
    scopeMatchesContract || contractDescendant.length > 0
      ? scopeMatchesContract
        ? root
        : contractDescendant[0]
      : (contractAncestor ?? root);
  const rootSemantics = await captureSemantics(contractRoot);
  // Groups stay scoped to the source root (the runtime scopes them to the
  // contract scope), so sibling controls like panel/label/tooltip are still
  // found even when the compared root is an interior interactive descendant.
  const groups = {};
  for (const group of contractGroupsFor(semanticElement)) {
    const selector = contractGroupSelectors[group];
    const candidates = root.matches(selector) ? [root] : [...root.querySelectorAll(selector)];
    groups[group] = await Promise.all(candidates.map(captureSemantics));
  }
  return { root: rootSemantics, groups };
};

// Mirror of the runtime algorithm: apply the errata
// Mirror of the runtime algorithm: apply the errata
// accessibility rewrite rules to the live DOM, run `capture` under the
// corrected tree, then restore every touched attribute. Yields the
// "corrected upstream" snapshot (a11y tree and/or contract semantics) that
// judgeState accepts a framework against.
const withCorrectedAttributes = async (root, normalizationRules, capture) => {
  // Correction rules either rewrite an attribute to a concrete value or
  // relocate/omit it (e.g. `relocated-to-focusable-tab`, `omitted`,
  // `non-semantic-runtime-bookkeeping`). The latter remove the attribute from
  // the source element so the corrected snapshot reflects where it belongs.
  const corrections = (normalizationRules ?? []).filter(
    (rule) =>
      typeof rule?.selector === "string" &&
      typeof rule?.attribute === "string" &&
      rule.attribute !== "onclick",
  );
  const plans = corrections.map((rule) => {
    const isRewrite =
      rule?.operation === "rewrite" ||
      Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue");
    const ruleText = String(rule?.rule ?? "");
    // A stable/must-reference rule contributes a relationship, not a value
    // rewrite; leave the literal attribute alone (whitespace-normalized names
    // reconcile it). Bookkeeping attributes are dropped outright.
    const omit = isRewrite
      ? false
      : /relocated-to|omitted|non-semantic|bookkeeping|data-listener/.test(ruleText) ||
        rule.attribute === "data-listener-attached";
    const expected = isRewrite
      ? Object.prototype.hasOwnProperty.call(rule, "rewriteValue")
        ? rule.rewriteValue
        : rule.value
      : null;
    return { rule, omit, expected: omit ? null : expected };
  });
  const actionable = plans.filter(
    (plan) => plan.omit || (plan.expected !== undefined && plan.expected !== null),
  );
  if (actionable.length === 0) return capture();
  const restorations = [];
  try {
    for (const plan of actionable) {
      const { rule, omit, expected } = plan;
      const within = root.matches(rule.selector)
        ? [root, ...root.querySelectorAll(rule.selector)]
        : [...root.querySelectorAll(rule.selector)];
      const ancestor = root.closest(rule.selector);
      const matches = ancestor && !within.includes(ancestor) ? [ancestor, ...within] : within;
      for (const candidate of matches) {
        restorations.push({
          candidate,
          name: rule.attribute,
          existed: candidate.hasAttribute(rule.attribute),
          value: candidate.getAttribute(rule.attribute),
        });
        if (omit || expected === null) candidate.removeAttribute(rule.attribute);
        else candidate.setAttribute(rule.attribute, String(expected));
      }
    }
    return await capture();
  } finally {
    for (const { candidate, name, existed, value } of restorations) {
      if (existed) candidate.setAttribute(name, value);
      else candidate.removeAttribute(name);
    }
  }
};

const captureCorrectedAccessibility = async (root, normalizationRules) => {
  const rewrites = (normalizationRules ?? []).filter(
    (rule) =>
      typeof rule?.attribute === "string" &&
      rule.attribute !== "data-listener-attached" &&
      rule.attribute !== "onclick" &&
      (rule?.operation === "rewrite" ||
        Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue")),
  );
  if (rewrites.length === 0) return null;
  return withCorrectedAttributes(root, normalizationRules, () => captureAccessibilityTree(root));
};

// Side-agnostic accessibility normalization for the FRAMEWORK side. The DOM
// comparison applies `normalization.whitelist` omissions to BOTH sides (only
// rewrites are upstream-only); the accessibility capture previously normalized
// only the upstream side, so a framework that correctly implements an errata
// correction (e.g. an aria-label the whitelist declares a non-semantic
// addition) would fail against the omission-normalized upstream. Applying the
// same side-agnostic omissions to the framework's tree restores parity.
const captureAccessibilityWithOmissions = async (root, normalizationRules) => {
  // Reference/relationship and state attributes (aria-labelledby/describedby/
  // controls/owns, aria-expanded, for, headers) carry accessible names and
  // states in the accessibility tree; the whitelist omits them only to
  // reconcile the DOM's generated id TOKENS, and both sides expose them via
  // the runtime. Stripping them from the a11y tree would erase semantics the
  // corrected-upstream also keeps, so they are preserved. Only genuinely
  // non-semantic additions a framework puts on a control (e.g. an aria-label
  // the whitelist declares out-of-scope on a select) are normalized away, like
  // the DOM does on both sides.
  const preservedAttributes = new Set([
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-labelledby",
    "aria-owns",
    "for",
    "headers",
  ]);
  const isRewrite = (rule) =>
    rule?.operation === "rewrite" ||
    Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue");
  const isOmission = (rule) =>
    !isRewrite(rule) &&
    rule?.operation !== "ignore-element" &&
    rule?.operation !== "ignore-subtree" &&
    !preservedAttributes.has(rule?.attribute) &&
    (rule?.operation === "omit" ||
      (typeof rule?.attribute === "string" && typeof rule?.rule === "string"));
  const omitRules = (normalizationRules ?? []).filter(isOmission);
  if (omitRules.length === 0) return captureAccessibilityTree(root);
  const restorations = [];
  try {
    for (const rule of omitRules) {
      const within = root.matches(rule.selector)
        ? [root, ...root.querySelectorAll(rule.selector)]
        : [...root.querySelectorAll(rule.selector)];
      const ancestor = root.closest(rule.selector);
      const matches = ancestor && !within.includes(ancestor) ? [ancestor, ...within] : within;
      for (const candidate of matches) {
        restorations.push({
          candidate,
          name: rule.attribute,
          existed: candidate.hasAttribute(rule.attribute),
          value: candidate.getAttribute(rule.attribute),
        });
        candidate.removeAttribute(rule.attribute);
      }
    }
    return await captureAccessibilityTree(root);
  } finally {
    for (const { candidate, name, existed, value } of restorations) {
      if (existed) candidate.setAttribute(name, value);
      else candidate.removeAttribute(name);
    }
  }
};

const captureBundle = async (
  root,
  state,
  fixture,
  { side = "upstream", normalizationRules = [] } = {},
) => {
  let applied;
  try {
    applied = await applyActions(root, state);
    await settle();
    const dom = await captureDomTree(root, { normalizationRules, snapshotSide: side });
    const semantics = await captureSemantics(root);
    const visualSignature = await captureVisualSignature(root);
    const contractSemantics = await captureContractSemantics(root, fixture);
    // The framework side applies the side-agnostic whitelist omissions to match
    // how captureDomTree normalizes both sides; the upstream side stays raw and
    // gets its corrected tree computed separately (captureCorrectedAccessibility).
    const accessibility =
      side === "framework"
        ? await captureAccessibilityWithOmissions(root, normalizationRules)
        : await captureAccessibilityTree(root);
    return {
      dom,
      semantics,
      visualSignature,
      contractSemantics,
      accessibility,
      events: applied.events,
      actions: applied.actions,
    };
  } finally {
    applied?.cleanup();
  }
};

const mountFramework = async (adapter, fixture, state) => {
  const container = createFixtureContainer(fixture, {});
  const props = { ...baseProps(fixture), ...fixture.props, ...state.props };
  let mounted;
  try {
    mounted = await adapter.mount(container, fixture.componentId, props);
    await settle();
    await settle();
    return { container, mounted, props };
  } catch (error) {
    await mounted?.dispose();
    container.remove();
    throw error;
  }
};

// The astro components are compiled by the consumer's Astro pipeline, so
// instead of a client adapter this mount transplants the prebuilt SSG page
// (conformance-host-astro: one static page per fixture×state) into the worker
// document. The page's stylesheet is injected once; the #fixture-root markup
// goes into a fresh container styled by the same `#fixture-root` rules as the
// upstream side.
const injectedAstroStylesheets = new Set();
const injectAstroStylesheet = (href) =>
  new Promise((resolve, reject) => {
    if (injectedAstroStylesheets.has(href)) {
      resolve();
      return;
    }
    injectedAstroStylesheets.add(href);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener(
      "error",
      () => reject(new Error(`astro stylesheet failed to load: ${href}`)),
      { once: true },
    );
    document.head.appendChild(link);
  });

const mountAstroFixture = async (fixture, state) => {
  let container;
  try {
    // The vite dev server rewrites the SSG page's inline module scripts into
    // html-proxy modules it cannot serve standalone, so the raw page is fetched
    // from the Node collector (which serves the built dist untouched).
    const pageUrl = `${collectorOrigin}/astro-dist/${encodeURIComponent(fixture.id)}/${encodeURIComponent(state.id)}/index.html`;
    const response = await fetch(pageUrl);
    if (!response.ok) {
      throw new Error(`astro SSG page not found: ${pageUrl} (run pnpm conformance:build)`);
    }
    const parsed = new DOMParser().parseFromString(await response.text(), "text/html");
    const sourceRoot = parsed.querySelector("#fixture-root");
    if (!sourceRoot) {
      throw new Error(`astro SSG page has no #fixture-root: ${pageUrl}`);
    }
    const stylesheets = [...parsed.querySelectorAll('link[rel="stylesheet"][href]')].map((link) =>
      link.getAttribute("href"),
    );
    await Promise.all(stylesheets.map(injectAstroStylesheet));
    // Astro compiles each component's client script into a module inside the
    // component markup. The worker document serves the page through the vite
    // dev server, which rewrites inline module scripts into external
    // `?html-proxy` module srcs; both forms are handled here. innerHTML
    // insertion never executes scripts, so modules are re-injected through
    // createElement (which does execute them). Keep injected scripts as the
    // last child of the container: the accordion module locates its data
    // script via nextElementSibling.
    const moduleBodies = [...sourceRoot.querySelectorAll('script[type="module"]:not([src])')].map(
      (script) => script.textContent ?? "",
    );
    const moduleSrcs = [...sourceRoot.querySelectorAll('script[type="module"][src]')].map(
      (script) => script.getAttribute("src"),
    );
    container = document.createElement("div");
    container.id = "fixture-root";
    for (const attribute of sourceRoot.attributes) {
      container.setAttribute(attribute.name, attribute.value);
    }
    container.innerHTML = sourceRoot.innerHTML;
    document.body.appendChild(container);
    const injected = [];
    // Astro compiles component behavior into inline modules inside the markup.
    // Their document-scoped listeners would also fire for clicks on the
    // upstream fixture (mounting the framework side first means the module is
    // already listening while the upstream capture runs), toggling the wrong
    // accordion. Rewrite the two document-wide entry points (`addEventListener`,
    // load-time `querySelectorAll` init scans) to the injected container, so a
    // per-mount module only observes its own markup; document-level lookups
    // (getElementById, body classes, activeElement) stay untouched.
    const uid = `krds-astro-${Math.random().toString(36).slice(2)}`;
    for (const body of moduleBodies) {
      const scoped = body
        .replaceAll("document.addEventListener(", "container.addEventListener(")
        .replaceAll("document.querySelectorAll(", "container.querySelectorAll(");
      const script = document.createElement("script");
      script.type = "module";
      script.dataset.krdsAstroScope = uid;
      script.textContent = `(() => { const container = document.querySelector('[data-krds-astro-scope="${uid}"]')?.parentElement; if (!container) return; ${scoped} })()`;
      container.appendChild(script);
      injected.push(script);
    }
    for (const src of moduleSrcs) {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`astro module failed to load: ${src}`);
      const body = await response.text();
      const scoped = body
        .replaceAll("document.addEventListener(", "container.addEventListener(")
        .replaceAll("document.querySelectorAll(", "container.querySelectorAll(");
      const script = document.createElement("script");
      script.type = "module";
      script.dataset.krdsAstroScope = uid;
      script.textContent = `(() => { const container = document.querySelector('[data-krds-astro-scope="${uid}"]')?.parentElement; if (!container) return; ${scoped} })()`;
      container.appendChild(script);
      injected.push(script);
    }
    if (injected.length) {
      // Module scripts execute asynchronously (deferred semantics); wait for
      // src-based modules to load plus a couple of macrotask turns for the
      // inline ones before listeners are relied on.
      await Promise.all(injected.filter((entry) => entry instanceof Promise));
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return container;
  } catch (error) {
    container?.remove();
    throw error;
  }
};

const renderUpstream = async (fixture) => {
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
  // injected. Re-dispatch after the init script has executed so the injected
  // markup gets its event handlers and runtime state.
  await waitForKrdsScript();
  window.dispatchEvent(new Event("DOMContentLoaded"));
  return container;
};

const rasterizeLiveRoot = async (root, state) => {
  let applied;
  try {
    applied = await applyActions(root, state);
    await settle();
    return await rasterizeRootToImageData(root);
  } finally {
    applied?.cleanup();
  }
};

const rasterizeFreshPair = async (framework, adapter, fixture, state) => {
  let upstreamContainer;
  let frameworkContainer;
  let mountedState;
  try {
    upstreamContainer = await renderUpstream(fixture);
    await waitForKrdsReady();
    if (framework === "astro") {
      frameworkContainer = await mountAstroFixture(fixture, state);
    } else {
      mountedState = await mountFramework(adapter, fixture, state);
      frameworkContainer = mountedState.container;
    }
    const upstreamRoot = selectSourceSubtree(upstreamContainer, fixture);
    const frameworkRoot = selectSourceSubtree(frameworkContainer, fixture);
    // Focus, hover, active, and other live state is intentionally replayed on
    // fresh roots. Those roots never enter the immutable upstream cache.
    const upstreamPixels = await rasterizeLiveRoot(upstreamRoot, state);
    const frameworkPixels = await rasterizeLiveRoot(frameworkRoot, state);
    return { upstream: upstreamPixels, framework: frameworkPixels };
  } finally {
    await mountedState?.mounted?.dispose();
    upstreamContainer?.remove();
    frameworkContainer?.remove();
  }
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
    let mountedState;
    try {
      const normalizationRules = compiledErrata[fixture.id] ?? [];
      const key = captureKey(fixture, state);
      let upstream = upstreamCaptureCache.get(key);
      if (upstream) {
        metrics.upstreamCacheHits += 1;
      } else {
        upstreamContainer = await renderUpstream(fixture);
        await waitForKrdsReady();
        const upstreamRoot = selectSourceSubtree(upstreamContainer, fixture);
        const captured = await captureBundle(upstreamRoot, state, fixture, {
          side: "upstream",
          normalizationRules,
        });
        metrics.upstreamCaptures += 1;
        captured.correctedAccessibility = await captureCorrectedAccessibility(
          upstreamRoot,
          normalizationRules,
        );
        captured.correctedContractSemantics = await withCorrectedAttributes(
          upstreamRoot,
          normalizationRules,
          () => captureContractSemantics(upstreamRoot, fixture),
        );
        upstream = freezeCapture(captured);
        upstreamCaptureCache.set(key, upstream);
      }
      // The astro package ships .astro sources (compiled by the consumer's
      // Astro pipeline), so it has no browser adapter like the other
      // frameworks. Its framework side is the prebuilt SSG output of
      // conformance-host-astro: one static page per fixture×state. Fetch the
      // page, inject its stylesheet, and transplant its #fixture-root markup
      // into the worker document, then run the identical capture flow.
      if (framework === "astro") {
        frameworkContainer = await mountAstroFixture(fixture, state);
      } else {
        mountedState = await mountFramework(adapter, fixture, state);
        frameworkContainer = mountedState.container;
      }
      await settle();
      const frameworkRoot = selectSourceSubtree(frameworkContainer, fixture);
      const frameworkCapture = await captureBundle(frameworkRoot, state, fixture, {
        side: "framework",
        // Mirror the runtime: same errata normalization rules are applied to
        // both sides (omissions/stable-id normalization are side-agnostic;
        // rewrites stay upstream-only via snapshotSide).
        normalizationRules,
      });
      const visualVerdict = compareVisualSignatures(
        upstream.visualSignature,
        frameworkCapture.visualSignature,
      );
      let pixelData;
      if (!visualVerdict.passed) {
        await mountedState?.mounted?.dispose();
        mountedState = undefined;
        upstreamContainer?.remove();
        upstreamContainer = undefined;
        frameworkContainer?.remove();
        frameworkContainer = undefined;
        pixelData = await rasterizeFreshPair(framework, adapter, fixture, state);
      }
      const verdict = judgeState(fixture, state, {
        upstream,
        framework: frameworkCapture,
        frameworkEvents: frameworkCapture.events,
        pixelData,
        visualVerdict,
      });
      record.status = verdict.status;
      record.checks = verdict.checks;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      record.status = "failing";
      record.error = message;
    } finally {
      await mountedState?.mounted?.dispose();
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

export const compiledErrata = collectorConfig.errata ?? {};

export const emitFixtureCapture = async (framework, fixtureId, records) => {
  const payload = {
    catalog: catalog.upstream,
    framework,
    fixtureId,
    results: records,
    workerId,
    metrics: { ...metrics },
  };
  const response = await fetch(`${collectorOrigin}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`collector rejected captures: ${response.status}`);
};
