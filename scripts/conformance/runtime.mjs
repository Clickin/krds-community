import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { chromium } from "playwright";
import { parse as parseYaml } from "yaml";
import {
  SelectorResolutionError,
  captureDom,
  compareDom,
  inspectSemantics,
  resolveContractRoot,
  withCorrectedAttributes,
} from "./dom.mjs";
import * as conformanceServer from "./server.mjs";
import * as visual from "./visual.mjs";

const { createConformanceServer } = conformanceServer;
const { captureCanonicalScreenshot, captureVisualSignature, comparePixels } = visual;

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const directExecution =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const frameworkIds = ["react", "vue", "svelte", "solid", "angular", "astro"];
const arguments_ = directExecution ? process.argv.slice(2) : [];
const option = (name) => {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
};
const firstStructuralDifference = (expected, actual, path = "$") => {
  if (isDeepStrictEqual(expected, actual)) return undefined;
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return {
        path: `${path}.length`,
        expected: expected.length,
        actual: actual.length,
      };
    }
    if (
      expected.length === 2 &&
      actual.length === 2 &&
      typeof expected[0] === "string" &&
      expected[0] === actual[0]
    ) {
      return {
        path: `${path}.${expected[0]}`,
        expected: expected[1],
        actual: actual[1],
      };
    }
    for (let index = 0; index < expected.length; index += 1) {
      const difference = firstStructuralDifference(
        expected[index],
        actual[index],
        `${path}[${index}]`,
      );
      if (difference) return difference;
    }
  }
  if (
    expected !== null &&
    actual !== null &&
    typeof expected === "object" &&
    typeof actual === "object"
  ) {
    const keys = [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort();
    for (const key of keys) {
      if (!(key in expected) || !(key in actual)) {
        return {
          path: `${path}.${key}`,
          expected: key in expected ? expected[key] : "<missing>",
          actual: key in actual ? actual[key] : "<missing>",
        };
      }
      const difference = firstStructuralDifference(expected[key], actual[key], `${path}.${key}`);
      if (difference) return difference;
    }
  }
  return { path, expected, actual };
};

const visualErrorMessage = (error) => (error instanceof Error ? error.message : String(error));
const canonicalPaintGutter = 4;
const visualCoordinateTolerance = 1 / 64;
const fillsViewportWidth = (bounds, viewport) =>
  viewport &&
  Math.abs(bounds.x) <= visualCoordinateTolerance &&
  Math.abs(bounds.width - viewport.width) <= visualCoordinateTolerance;
const canonicalVisualOrigin = (bounds, viewport, requestedOrigin) => {
  if (requestedOrigin) return requestedOrigin;
  const usePaintGutter = fillsViewportWidth(bounds, viewport);
  return {
    x: usePaintGutter ? canonicalPaintGutter : bounds.x,
    // Clamp to the viewport top: flex-centered content taller than the
    // viewport sits at a negative y and re-centers when the capture expands
    // the viewport, which the geometry guard would reject. Translating both
    // sides to y=0 keeps the capture stable and the comparison fair.
    y: Math.max(0, bounds.y),
  };
};

export const compareVisualCaptures = async (upstreamCapture, frameworkCapture, enabled = true) => {
  const screenshots = { expected: null, actual: null };
  if (!enabled) {
    return {
      evidence: { passed: true, differingPixels: 0, skipped: true },
      screenshots,
    };
  }

  const rootErrors = [
    ...(upstreamCapture.rootError ? [`upstream visual root: ${upstreamCapture.rootError}`] : []),
    ...(frameworkCapture.rootError ? [`framework visual root: ${frameworkCapture.rootError}`] : []),
  ];
  if (rootErrors.length) {
    return {
      evidence: { passed: false, differingPixels: 0, errors: rootErrors },
      screenshots,
    };
  }

  const signatureErrors = [
    ...(upstreamCapture.signatureError
      ? [`upstream visual signature: ${upstreamCapture.signatureError}`]
      : upstreamCapture.signature === null
        ? ["upstream visual signature: unavailable"]
        : []),
    ...(frameworkCapture.signatureError
      ? [`framework visual signature: ${frameworkCapture.signatureError}`]
      : frameworkCapture.signature === null
        ? ["framework visual signature: unavailable"]
        : []),
  ];
  if (
    signatureErrors.length === 0 &&
    isDeepStrictEqual(upstreamCapture.signature, frameworkCapture.signature)
  ) {
    return {
      evidence: {
        passed: true,
        differingPixels: 0,
        skipped: true,
        comparison: "dom-style",
      },
      screenshots,
    };
  }

  const diagnostics = signatureErrors.length
    ? { comparison: "pixel-fallback", signatureErrors }
    : {
        signatureDifference: firstStructuralDifference(
          upstreamCapture.signature,
          frameworkCapture.signature,
        ),
      };
  const missingScreenshotCaptures = [
    ...(typeof upstreamCapture.captureScreenshot !== "function"
      ? ["upstream screenshot: capture unavailable"]
      : []),
    ...(typeof frameworkCapture.captureScreenshot !== "function"
      ? ["framework screenshot: capture unavailable"]
      : []),
  ];
  if (missingScreenshotCaptures.length) {
    return {
      evidence: {
        passed: false,
        differingPixels: 0,
        errors: missingScreenshotCaptures,
        ...diagnostics,
      },
      screenshots,
    };
  }

  const captured = await Promise.allSettled([
    Promise.resolve().then(() => upstreamCapture.captureScreenshot()),
    Promise.resolve().then(() => frameworkCapture.captureScreenshot()),
  ]);
  if (captured[0].status === "fulfilled") screenshots.expected = captured[0].value;
  if (captured[1].status === "fulfilled") screenshots.actual = captured[1].value;
  const screenshotErrors = captured.flatMap((result, index) =>
    result.status === "rejected"
      ? [
          `${index === 0 ? "upstream" : "framework"} screenshot: ${visualErrorMessage(
            result.reason,
          )}`,
        ]
      : [],
  );
  if (screenshotErrors.length) {
    return {
      evidence: {
        passed: false,
        differingPixels: 0,
        errors: screenshotErrors,
        ...diagnostics,
      },
      screenshots,
    };
  }

  try {
    return {
      evidence: {
        ...comparePixels(screenshots.expected, screenshots.actual),
        ...diagnostics,
      },
      screenshots,
    };
  } catch (error) {
    return {
      evidence: {
        passed: false,
        differingPixels: 0,
        errors: [`pixel comparison: ${visualErrorMessage(error)}`],
        ...diagnostics,
      },
      screenshots,
    };
  }
};
const fixtureFilter = option("--fixture");
const frameworkFilter = option("--framework");
const outputPath = resolve(
  repositoryRoot,
  option("--output") ?? "reports/conformance-runtime.json",
);
const diffDirectory = resolve(
  option("--diff-directory") ?? resolve(dirname(outputPath), "conformance-diffs"),
);
const visualEnabled = !arguments_.includes("--no-visual");
const selectedFrameworks = frameworkFilter ? [frameworkFilter] : frameworkIds;
if (selectedFrameworks.some((framework) => !frameworkIds.includes(framework))) {
  throw new Error(`Unknown framework: ${frameworkFilter}`);
}

const catalog = directExecution
  ? JSON.parse(
      await readFile(
        resolve(repositoryRoot, option("--catalog") ?? "apps/conformance-host/dist/fixtures.json"),
        "utf8",
      ),
    )
  : { fixtures: [], upstream: undefined };
const fixtures = fixtureFilter
  ? catalog.fixtures.filter((fixture) => fixture.id === fixtureFilter)
  : catalog.fixtures;
if (directExecution && !fixtures.length) {
  throw new Error(`No fixtures matched ${fixtureFilter ?? "catalog"}`);
}
const errataDirectory = resolve(repositoryRoot, "conformance/errata");
const errataEntries = directExecution
  ? new Map(
      await Promise.all(
        (await readdir(errataDirectory))
          .filter((name) => name.endsWith(".yaml"))
          .map(async (name) => {
            const erratum = parseYaml(await readFile(resolve(errataDirectory, name), "utf8"));
            return [erratum.id, erratum];
          }),
      ),
    )
  : new Map();
const isRewriteRule = (rule) =>
  rule?.operation === "rewrite" || Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue");
const isAccessibilityCorrectionRule = (rule) =>
  typeof rule?.attribute === "string" &&
  rule.attribute !== "data-listener-attached" &&
  rule.attribute !== "onclick";
const fixtureNormalization = (fixture) => {
  const rules = [];
  const errataIds = [];
  const accessibilityErrataIds = [];
  const accessibilityRules = [];
  for (const id of fixture.errata ?? []) {
    const erratum = errataEntries.get(id);
    if (!erratum || !Array.isArray(erratum.fixtures) || !erratum.fixtures.includes(fixture.id)) {
      continue;
    }
    const erratumRules = erratum.normalization?.whitelist ?? [];
    errataIds.push(id);
    if (erratumRules.some(isRewriteRule)) {
      accessibilityErrataIds.push(id);
      accessibilityRules.push(...erratumRules.filter(isAccessibilityCorrectionRule));
    }
    rules.push(...erratumRules);
  }
  rules.errataIds = errataIds;
  rules.accessibilityErrataIds = accessibilityErrataIds;
  rules.accessibilityRules = accessibilityRules;
  return rules;
};

let sourceMarkerSequence = 0;
const sourceLocator = async (page, fixture, side) => {
  const selector = fixture.sourceSelector;
  let candidates;
  let candidateCount;
  try {
    candidates = page.locator(selector);
    candidateCount = await candidates.count();
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: "source",
      side,
      selector,
      message: "Source selector could not be evaluated",
      cause,
    });
  }
  const sourceIndex = fixture.sourceIndex ?? 0;
  if (candidateCount <= sourceIndex) {
    throw new SelectorResolutionError({
      kind: "source",
      side,
      selector,
      message: `Source selector did not resolve sourceIndex ${sourceIndex} (${candidateCount})`,
    });
  }
  const source = candidates.nth(sourceIndex);
  if (!fixture.sourceAncestorSelector) return source;
  const ancestorSelector = fixture.sourceAncestorSelector;
  const marker = `source-${++sourceMarkerSequence}`;
  let found;
  try {
    found = await source.evaluate(
      (element, data) => {
        const ancestor = element.closest(data.selector);
        if (!ancestor) return false;
        ancestor.setAttribute("data-conformance-source-root", data.marker);
        return true;
      },
      { selector: ancestorSelector, marker },
    );
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: "source-ancestor",
      side,
      selector: ancestorSelector,
      message: "Source ancestor selector could not be evaluated",
      cause,
    });
  }
  if (!found) {
    throw new SelectorResolutionError({
      kind: "source-ancestor",
      side,
      selector: ancestorSelector,
      message: "Source ancestor selector did not resolve an ancestor",
    });
  }
  const ancestorLocator = page.locator(`[data-conformance-source-root="${marker}"]`);
  let ancestorCount;
  try {
    ancestorCount = await ancestorLocator.count();
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: "source-ancestor",
      side,
      selector: ancestorSelector,
      message: "Source ancestor selector result could not be counted",
      cause,
    });
  }
  if (ancestorCount !== 1) {
    throw new SelectorResolutionError({
      kind: "source-ancestor",
      side,
      selector: ancestorSelector,
      message: `Source ancestor selector did not resolve exactly one element (${ancestorCount})`,
    });
  }
  return ancestorLocator.nth(0);
};

const upstreamLocator = (page, fixture) => sourceLocator(page, fixture, "upstream");
const frameworkLocator = (page, fixture) => sourceLocator(page, fixture, "framework");

const interactiveSelector =
  'button, input, select, textarea, a[href], summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
const resolveTarget = async (root, target, action) => {
  if (target && target !== "fixture") return root.locator(target).first();
  if (["keyboard-focus", "press", "fill", "select-option", "check", "uncheck"].includes(action)) {
    const rootIsInteractive = await root.evaluate(
      (element, selector) => element.matches(selector),
      interactiveSelector,
    );
    return rootIsInteractive ? root : root.locator(interactiveSelector).first();
  }
  return root;
};
let visualMarkerSequence = 0;
const resolveVisualRoot = async (page, root, visualSelector, visualAncestorSelector) => {
  let selected = root;
  if (visualSelector) {
    const candidates = root.locator(visualSelector);
    const candidateCount = await candidates.count();
    if (candidateCount !== 1) {
      throw new Error(
        `Visual selector did not resolve exactly one element: ${visualSelector} (${candidateCount})`,
      );
    }
    selected = candidates.nth(0);
  }
  if (!visualAncestorSelector) return { locator: selected };
  const marker = `visual-${++visualMarkerSequence}`;
  const found = await selected.evaluate(
    (element, data) => {
      const ancestor = element.closest(data.selector);
      if (!ancestor) return false;
      ancestor.setAttribute("data-conformance-visual-root", data.marker);
      return true;
    },
    { selector: visualAncestorSelector, marker },
  );
  if (!found) {
    throw new Error(
      `Visual ancestor selector did not resolve an ancestor: ${visualAncestorSelector}`,
    );
  }
  const ancestorLocator = page.locator(`[data-conformance-visual-root="${marker}"]`);
  const ancestorCount = await ancestorLocator.count();
  if (ancestorCount !== 1) {
    throw new Error(
      `Visual ancestor selector did not resolve exactly one element: ${visualAncestorSelector} (${ancestorCount})`,
    );
  }
  return { locator: ancestorLocator.nth(0), marker };
};

const applyActions = async (page, root, actions) => {
  let pointerDown = false;
  const cleanup = async () => {
    if (pointerDown) {
      await page.mouse.up();
      pointerDown = false;
    }
  };
  try {
    for (const step of actions) {
      const target = await resolveTarget(root, step.target, step.action);
      if (step.action === "hover") {
        // Under heavy parallel load the hover can be scheduled but not yet
        // painted when the capture reads computed styles. Retry until the
        // element actually matches :hover.
        await target.hover();
        let hovered = false;
        for (let attempt = 0; attempt < 5 && !hovered; attempt += 1) {
          hovered = await target
            .evaluate((element) => element.matches(":hover"))
            .catch(() => false);
          if (!hovered) {
            await target.hover().catch(() => {});
            await page.evaluate(() => new Promise(requestAnimationFrame));
          }
        }
      } else if (step.action === "keyboard-focus") {
        // Some upstream visual fixtures declare a focus state despite having no
        // focusable descendant. Preserve that literal state without timing out.
        if ((await target.count()) > 0) await target.focus();
      } else if (step.action === "click") await target.click();
      else if (step.action === "press") await target.press(String(step.key ?? "Enter"));
      else if (step.action === "fill") await target.fill(String(step.value ?? ""));
      else if (step.action === "select-option") await target.selectOption(String(step.value ?? ""));
      else if (step.action === "check") await target.check();
      else if (step.action === "uncheck") await target.uncheck();
      else if (step.action === "submit") {
        await target.evaluate((element) => {
          const form = element instanceof HTMLFormElement ? element : element.closest("form");
          form?.requestSubmit();
        });
      } else if (step.action === "open") {
        await target.evaluate((element) => {
          if (element instanceof HTMLDetailsElement) element.open = true;
          else element.setAttribute("open", "");
        });
      } else if (step.action === "close") {
        await target.evaluate((element) => {
          if (element instanceof HTMLDetailsElement) element.open = false;
          else element.removeAttribute("open");
        });
      } else if (step.action === "pointer-down") {
        await target.hover();
        await page.mouse.down();
        pointerDown = true;
      } else if (step.action === "pointer-up") {
        await page.mouse.up();
        pointerDown = false;
      } else if (step.action === "add-class") {
        await target.evaluate((element, value) => element.classList.add(String(value)), step.value);
      } else if (step.action === "remove-class") {
        await target.evaluate(
          (element, value) => element.classList.remove(String(value)),
          step.value,
        );
      } else if (step.action === "set-attribute") {
        await target.evaluate(
          (element, pair) => element.setAttribute(String(pair.key), String(pair.value)),
          { key: step.key, value: step.value },
        );
      } else if (step.action === "remove-attribute") {
        await target.evaluate(
          (element, value) => element.removeAttribute(String(value)),
          step.value,
        );
      } else {
        throw new Error(`Unsupported fixture action: ${step.action}`);
      }
    }
    return cleanup;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

const stateActions = (state) => {
  const actions = [...(state.setup ?? [])];
  if (state.id === "hover" && !actions.some((step) => step.action === "hover")) {
    actions.push({ action: "hover", target: "fixture" });
  }
  if (state.id === "focus-visible" && !actions.some((step) => step.action === "keyboard-focus")) {
    actions.push({ action: "keyboard-focus", target: "fixture" });
  }
  if (state.id === "active" && !actions.some((step) => step.action === "pointer-down")) {
    actions.push({ action: "pointer-down", target: "fixture" });
  }
  return actions;
};

const applyStateProps = async (root, props = {}) => {
  const rootIsInteractive = await root.evaluate(
    (element, selector) => element.matches(selector),
    interactiveSelector,
  );
  const control = rootIsInteractive ? root : root.locator(interactiveSelector).first();
  if ((await control.count()) === 0) return;
  await control.evaluate((element, state) => {
    if ("disabled" in state && "disabled" in element) {
      element.disabled = Boolean(state.disabled);
      element.toggleAttribute("disabled", Boolean(state.disabled));
    }
    const readOnly = state.readOnly ?? state.readonly;
    if (readOnly !== undefined && "readOnly" in element) {
      element.readOnly = Boolean(readOnly);
      element.toggleAttribute("readonly", Boolean(readOnly));
    }
    if ("checked" in state && "checked" in element) {
      element.checked = Boolean(state.checked);
      element.toggleAttribute("checked", Boolean(state.checked));
    }
    if (state.value !== undefined && "value" in element) {
      element.value = String(state.value);
      element.setAttribute("value", String(state.value));
    }
  }, props);
};

const contractGroupSelectors = {
  button: 'button, [role="button"]',
  panel: '[role="region"], [aria-labelledby], .accordion-collapse, .krds-panel',
  input: "input",
  select: "select",
  label: "label",
  list: 'ul, ol, [role="list"]',
  tooltip: '[role="tooltip"], .krds-tooltip-popover, .krds-tooltip',
  link: 'link[rel~="icon"], a[href], [role="link"]',
  table: 'table, [role="table"]',
  textarea: "textarea",
};
const contractGroupsFor = (semanticElement) => {
  if (semanticElement === "button-and-region") return ["button", "panel"];
  if (semanticElement === "button-and-tooltip") return ["button", "tooltip"];
  if (semanticElement === "button-and-list") return ["button", "list"];
  if (semanticElement === "label-and-input") return ["label", "input"];
  if (semanticElement === "label-and-checkbox") return ["label", "input"];
  if (semanticElement === "label-and-radio") return ["label", "input"];
  if (semanticElement === "label-and-select") return ["label", "select"];
  if (semanticElement === "label-and-textarea") return ["label", "textarea"];
  if (semanticElement === "link[rel=icon]") return ["link"];
  if (semanticElement === "table") return ["table"];
  return [];
};

const capture = async (
  page,
  root,
  state,
  actions,
  framework,
  ignoredAttributes,
  contractSemanticElement,
  contractAncestorSelectors,
  visualSelector,
  visualAncestorSelector,
  visualCaptureEnabled = visualEnabled,
  requestedVisualOrigin,
  requestedVisualGutter,
) => {
  let actionCleanup = async () => {};
  let visualMarker;
  let contractMarker;
  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    try {
      if (contractMarker) {
        const markerRoot = page
          .locator(`[data-conformance-contract-root="${contractMarker}"]`)
          .first();
        if ((await markerRoot.count()) > 0) {
          await markerRoot.evaluate((element) =>
            element.removeAttribute("data-conformance-contract-root"),
          );
        }
      }
    } finally {
      try {
        if (visualMarker) {
          const markerRoot = page
            .locator(`[data-conformance-visual-root="${visualMarker}"]`)
            .first();
          if ((await markerRoot.count()) > 0) {
            await markerRoot.evaluate((element) =>
              element.removeAttribute("data-conformance-visual-root"),
            );
          }
        }
      } finally {
        await actionCleanup();
      }
    }
  };

  try {
    const viewport = page.viewportSize();
    if (viewport) await page.mouse.move(viewport.width - 1, viewport.height - 1);
    await applyStateProps(root, state.props);
    actionCleanup = await applyActions(page, root, actions);
    await page.evaluate(() => document.fonts.ready);
    // Let hover/focus paint settle: under heavy parallel load a single
    // animation frame can resolve before the style recalc, leaving the
    // element in its un-hovered state.
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const rootIsInteractive = await root.evaluate(
      (element, selector) => element.matches(selector),
      interactiveSelector,
    );
    const interactiveDescendant = root.locator(interactiveSelector).first();
    const semanticRoot =
      rootIsInteractive || (await interactiveDescendant.count()) === 0
        ? root
        : interactiveDescendant;
    const contractState = await resolveContractRoot(
      page,
      root,
      contractAncestorSelectors,
      framework ? "framework" : "upstream",
    );
    contractMarker = contractState.marker;
    const contractScope = contractState.locator;
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
      }[contractSemanticElement] ??
      (contractSemanticElement.includes("-and-") || contractSemanticElement.startsWith("input[")
        ? interactiveSelector
        : undefined);
    const contractDescendant = contractSelector
      ? contractScope.locator(contractSelector).first()
      : contractScope;
    const scopeMatchesContract = contractSelector
      ? await contractScope.evaluate(
          (element, selector) => element.matches(selector),
          contractSelector,
        )
      : true;
    const contractRoot =
      scopeMatchesContract || (await contractDescendant.count()) === 0
        ? contractScope
        : contractDescendant;
    let visualRoot = root;
    let visualRootError;
    let visualSignatureError;
    let visualOrigin;
    let visualGutter = 0;
    if (visualCaptureEnabled) {
      try {
        const visualState = await resolveVisualRoot(
          page,
          root,
          visualSelector,
          visualAncestorSelector,
        );
        visualMarker = visualState.marker;
        visualRoot = visualState.locator;
        await visualRoot.scrollIntoViewIfNeeded();
        const visualBounds = await visualRoot.boundingBox();
        if (!visualBounds) throw new Error("Visual root has no screenshot bounds");
        visualOrigin = canonicalVisualOrigin(
          visualBounds,
          page.viewportSize(),
          requestedVisualOrigin,
        );
        visualGutter =
          requestedVisualGutter ??
          (fillsViewportWidth(visualBounds, page.viewportSize()) ? canonicalPaintGutter : 0);
      } catch (error) {
        visualRootError = visualErrorMessage(error);
      }
    }
    const [
      dom,
      semantics,
      contractRootSemantics,
      literalAccessibility,
      visualSemantics,
      visualSignature,
    ] = await Promise.all([
      captureDom(root, ignoredAttributes, framework ? "framework" : "upstream"),
      inspectSemantics(semanticRoot),
      inspectSemantics(contractRoot),
      contractScope.ariaSnapshot(),
      inspectSemantics(visualRoot),
      visualCaptureEnabled && !visualRootError
        ? captureVisualSignature(visualRoot, { origin: visualOrigin }).catch((error) => {
            visualSignatureError = visualErrorMessage(error);
            return null;
          })
        : null,
    ]);
    const captureContractSemantics = async (rootSemantics) => {
      const result = {
        root: rootSemantics ?? (await inspectSemantics(contractRoot)),
        groups: {},
      };
      for (const group of contractGroupsFor(contractSemanticElement)) {
        const selector = contractGroupSelectors[group];
        const candidates = contractScope.locator(selector);
        const scopeMatchesGroup = await contractScope.evaluate(
          (element, candidateSelector) => element.matches(candidateSelector),
          selector,
        );
        const groupLocator = scopeMatchesGroup ? contractScope : candidates;
        const count = await groupLocator.count();
        result.groups[group] = count
          ? await Promise.all(
              Array.from({ length: count }, (_, index) =>
                inspectSemantics(groupLocator.nth(index)),
              ),
            )
          : [];
      }
      return result;
    };
    const literalContractSemantics = await captureContractSemantics(contractRootSemantics);
    const correctedEvidence = framework
      ? {
          accessibility: literalAccessibility,
          contractSemantics: literalContractSemantics,
        }
      : await withCorrectedAttributes(contractScope, ignoredAttributes, async () => {
          const [accessibility, contractSemantics] = await Promise.all([
            contractScope.ariaSnapshot(),
            captureContractSemantics(),
          ]);
          return { accessibility, contractSemantics };
        });
    const events = framework
      ? await page.evaluate(() => window.__KRDS_CONFORMANCE__?.getEvents() ?? [])
      : [];
    return {
      snapshot: {
        dom,
        semantics,
        accessibility: correctedEvidence.accessibility,
        literalAccessibility,
        contractSemantics: correctedEvidence.contractSemantics,
        literalContractSemantics,
        visualSemantics,
        events,
      },
      visualCapture: {
        signature: visualSignature,
        rootError: visualRootError,
        signatureError: visualSignatureError,
        origin: visualOrigin,
        gutter: visualGutter,
        captureScreenshot:
          visualCaptureEnabled && !visualRootError
            ? () =>
                captureCanonicalScreenshot(
                  visualRoot,
                  {
                    animations: "disabled",
                    caret: "hide",
                  },
                  { origin: visualOrigin, gutter: visualGutter },
                )
            : undefined,
      },
      cleanup,
    };
  } catch (error) {
    await cleanup();
    throw error;
  }
};

const contractChecks = (fixture, semantics) => {
  const errors = [];
  const root = semantics.root ?? semantics;
  const groups = semantics.groups ?? {};
  const nativeRole = (value) => {
    if (value.role) return value.role;
    if (value.tag === "button") return "button";
    if (value.tag === "a" && value.attributes.href) return "link";
    if (value.tag === "nav") return "navigation";
    if (value.tag === "footer") return "contentinfo";
    if (value.tag === "ul" || value.tag === "ol") return "list";
    if (value.tag === "table") return "table";
    if (value.tag === "select") return "combobox";
    if (value.tag === "textarea") return "textbox";
    if (value.tag === "input") {
      const type = value.attributes.type ?? "text";
      if (type === "checkbox" || type === "radio") return type;
      if (!["button", "submit", "reset", "hidden"].includes(type)) return "textbox";
    }
    return undefined;
  };
  const actualRole = nativeRole(root);
  const semanticElement = fixture.contract.semanticElement;
  const expectedRoles = {
    alert: "alert",
    button: "button",
    contentinfo: "contentinfo",
    dialog: "dialog",
    link: "link",
    list: "list",
    navigation: "navigation",
    table: "table",
  };
  const expectedTags = {
    "label-and-input": ["input"],
    "label-and-checkbox": ["input"],
    "label-and-radio": ["input"],
    "label-and-select": ["select"],
    "label-and-textarea": ["textarea"],
    "details-summary": ["details"],
  };
  const compositeContracts = new Set([
    "button-and-region",
    "button-and-tooltip",
    "button-and-list",
    "label-and-input",
    "label-and-checkbox",
    "label-and-radio",
    "label-and-select",
    "label-and-textarea",
  ]);
  if (semanticElement === "link[rel=icon]") {
    if (
      root.tag !== "link" ||
      !String(root.attributes.rel ?? "")
        .split(/\s+/)
        .includes("icon")
    ) {
      errors.push("semantic element: expected link[rel=icon]");
    }
    for (const attribute of ["href", "sizes", "type"]) {
      if (!root.attributes[attribute]) errors.push(`favicon attribute ${attribute} is missing`);
    }
  } else if (semanticElement === "native-element") {
    if (!root.tag || !root.attributes || typeof root.label !== "string") {
      errors.push("semantic element: native root metadata is missing");
    }
  } else if (!compositeContracts.has(semanticElement)) {
    const expectedRole = expectedRoles[semanticElement];
    const expectedTag = expectedTags[semanticElement];
    if (expectedRole && actualRole !== expectedRole) {
      errors.push(
        `semantic element: expected ${semanticElement}, received ${actualRole ?? root.tag}`,
      );
    } else if (expectedTag && !expectedTag.includes(root.tag)) {
      errors.push(`semantic element: expected ${semanticElement}, received ${root.tag}`);
    }
    if (
      semanticElement === "input[type=checkbox]" &&
      (root.tag !== "input" || root.attributes.type !== "checkbox")
    ) {
      errors.push("semantic element: expected input[type=checkbox]");
    }
  }
  if (fixture.contract.accessibleRole && actualRole !== fixture.contract.accessibleRole) {
    errors.push(`accessible role: expected ${fixture.contract.accessibleRole}`);
  }
  const checkRequirement = (label, target, requirement) => {
    const [name, inlineExpected] = String(requirement).split("=", 2);
    const actual = target.attributes[name];
    if (inlineExpected === undefined) {
      if (actual === undefined || actual === "") {
        errors.push(`${label}: required attribute ${name} is missing`);
      }
      return;
    }
    if (actual !== inlineExpected) {
      errors.push(
        `${label}: required attribute ${name}: expected ${inlineExpected}, received ${actual ?? "<missing>"}`,
      );
    }
  };
  for (const [rawName, expected] of Object.entries(fixture.contract.requiredAttributes ?? {})) {
    const targets = Array.isArray(groups[rawName]) ? groups[rawName] : [root];
    const requirements = Array.isArray(expected)
      ? expected
      : typeof expected === "boolean"
        ? expected
          ? [rawName]
          : []
        : typeof expected === "string" && !expected.includes("=")
          ? [`${rawName}=${expected}`]
          : [expected];
    if (targets.length === 0) {
      errors.push(`${rawName}: required element group is missing`);
      continue;
    }
    for (const [index, target] of targets.entries()) {
      for (const requirement of requirements) {
        checkRequirement(`${rawName}[${index}]`, target, requirement);
      }
    }
  }
  for (const requirement of fixture.contract.forbiddenAttributes ?? []) {
    const [name, forbiddenValue] = requirement.split("=", 2);
    const actual = root.attributes[name];
    if (actual !== undefined && (forbiddenValue === undefined || actual === forbiddenValue)) {
      errors.push(`forbidden attribute present: ${requirement}`);
    }
  }
  return errors;
};

const server = directExecution ? await createConformanceServer(repositoryRoot) : null;
const catalogName = option("--catalog") ? basename(option("--catalog")) : undefined;
const frameworkHostUrl = (framework, fixtureId, stateId) =>
  framework === "astro"
    ? `${server.baseUrl}/apps/conformance-host-astro/dist/${encodeURIComponent(fixtureId)}/${encodeURIComponent(stateId)}/`
    : `${server.baseUrl}/host/${framework}.html?fixture=${encodeURIComponent(fixtureId)}${catalogName ? `&catalog=${encodeURIComponent(catalogName)}` : ""}`;
const waitForFrameworkReady = (page, framework, fixtureId, stateId) =>
  page.waitForFunction(
    (expected) => {
      const runtime = window.__KRDS_CONFORMANCE__;
      return (
        runtime?.ready === true &&
        runtime.framework === expected.framework &&
        runtime.fixture.id === expected.fixtureId &&
        (expected.framework !== "astro" || runtime.stateId === expected.stateId)
      );
    },
    { framework, fixtureId, stateId },
    { timeout: 10_000 },
  );
const openFrameworkState = async (page, framework, fixtureId, stateId) => {
  const url = frameworkHostUrl(framework, fixtureId, stateId);
  const response = await page.goto(url, { waitUntil: "load" });
  if (!response?.ok()) {
    throw new Error(
      `${framework}/${fixtureId}/${stateId}: host request failed (${response?.status() ?? "no response"})`,
    );
  }
  await waitForFrameworkReady(page, framework, fixtureId, stateId);
};
const fixtureRootAttributesFor = (fixture) => {
  const layoutContext = fixture?.layoutContext;
  if (layoutContext === "content-inner") {
    return ' class="inner" data-layout-context="content-inner"';
  }
  if (layoutContext === "viewport-height") {
    return ' data-layout-context="viewport-height"';
  }
  return "";
};
// The manifest defines the component scope as the sourceSelector subtree (e.g.
// .form-group); the .fieldset wrapper in upstream example files is a page-level
// docs container. Render the component subtree directly so both sides sit under
// identical #fixture-root rules (the fieldset would otherwise shrink-wrap and
// distort the compared element's width).
const stripPageWrapper = (sourceHtml) => {
  const match = sourceHtml.match(/<div class="fieldset">([\s\S]*)<\/div>\s*(?:<!--[^]*?-->)?\s*$/);
  return match ? match[1] : sourceHtml;
};
const prepareUpstreamPage = async (page, sourceHtml, fixture) => {
  const documentHtml = `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${server.baseUrl}/packages/styles/dist/index.css"><style>*,*::before,*::after{animation:none!important;transition:none!important}#fixture-root{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;min-height:0;width:100%;height:100%}#fixture-root[data-layout-context="viewport-height"]{height:100%}#fixture-root>.krds-form-check,#fixture-root>.krds-form-chip{width:fit-content}</style></head><body><div id="fixture-root"${fixtureRootAttributesFor(fixture)}>${stripPageWrapper(sourceHtml)}</div><script src="${server.baseUrl}/upstream/krds-html/resources/cdn/krds.min.js"></script></body></html>`;
  server.setRuntimeDocument(documentHtml);
  await page.goto(`${server.baseUrl}/__upstream-runtime`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
};
const browser = directExecution ? await chromium.launch({ headless: true }) : null;
const results = [];
const unresolvedSelectorsByFramework = new Map(
  selectedFrameworks.map((framework) => [framework, new Set()]),
);
const browserVersion = browser?.version();
try {
  if (directExecution) {
    for (const fixture of fixtures) {
      const upstreamHtml = await readFile(resolve(repositoryRoot, fixture.sourcePath), "utf8");
      const upstreamPage = await browser.newPage({
        viewport: { width: fixture.viewport.width, height: fixture.viewport.height },
        reducedMotion: "reduce",
      });
      upstreamPage.setDefaultTimeout(3_000);
      await prepareUpstreamPage(upstreamPage, upstreamHtml, fixture);
      frameworkLoop: for (const framework of selectedFrameworks) {
        await prepareUpstreamPage(upstreamPage, upstreamHtml, fixture);
        const frameworkPage = await browser.newPage({
          viewport: { width: fixture.viewport.width, height: fixture.viewport.height },
          reducedMotion: "reduce",
        });
        frameworkPage.setDefaultTimeout(3_000);
        const runtimeErrors = [];
        frameworkPage.on("pageerror", (error) => runtimeErrors.push(error.message));
        frameworkPage.on("console", (message) => {
          if (message.type() === "error") runtimeErrors.push(message.text());
        });
        try {
          await openFrameworkState(frameworkPage, framework, fixture.id, fixture.states[0].id);
        } catch (error) {
          const cause = error instanceof Error ? error.message : String(error);
          const details = [cause, ...runtimeErrors].filter(Boolean).join(" | ");
          const message = `${framework}/${fixture.id}: fixture host failed to become ready: ${details}`;
          for (const state of fixture.states) {
            results.push({
              fixtureId: fixture.id,
              componentId: fixture.componentId,
              framework,
              state: state.id,
              status: "failing",
              checks: {
                render: { passed: false, errors: [message] },
                dom: { passed: false, errors: [message] },
                accessibility: { passed: false, errors: [message] },
                behavior: { passed: false, errors: [message], events: [] },
                form: { passed: false, errors: [message] },
                visual: { passed: false, errors: [message] },
                contract: { passed: false, errors: [message] },
              },
            });
          }
          await frameworkPage.close();
          continue frameworkLoop;
        }
        for (const [stateIndex, state] of fixture.states.entries()) {
          const runtimeErrorStart = stateIndex === 0 ? 0 : runtimeErrors.length;
          try {
            const activeCaptures = [];
            let cleanupFailureReason;
            try {
              if (stateIndex > 0) {
                const resetFramework =
                  framework === "astro"
                    ? openFrameworkState(frameworkPage, framework, fixture.id, state.id)
                    : framework === "angular"
                      ? frameworkPage
                          .reload({ waitUntil: "load" })
                          .then(() =>
                            frameworkPage.waitForFunction(
                              () => window.__KRDS_CONFORMANCE__?.ready === true,
                              undefined,
                              { timeout: 10_000 },
                            ),
                          )
                      : frameworkPage.evaluate(async () => {
                          await window.__KRDS_CONFORMANCE__?.reset();
                        });
                await Promise.all([
                  prepareUpstreamPage(upstreamPage, upstreamHtml, fixture),
                  resetFramework,
                ]);
              }
              if (framework !== "astro") {
                await frameworkPage.evaluate(async (stateId) => {
                  await window.__KRDS_CONFORMANCE__?.setState(stateId);
                }, state.id);
              }
              const frameworkRoot = await frameworkLocator(frameworkPage, fixture);
              const actions = stateActions(state);
              const currentUpstreamRoot = await upstreamLocator(upstreamPage, fixture);
              const normalization = fixtureNormalization(fixture);
              const accessibilityErrataIds = normalization.accessibilityErrataIds;
              const fixtureVisualEnabled = visualEnabled && fixture.comparisons?.visual !== "none";
              const upstreamCapture = await capture(
                upstreamPage,
                currentUpstreamRoot,
                state,
                actions,
                false,
                normalization,
                fixture.contract.semanticElement,
                fixture.contractAncestorSelector,
                fixture.visualSelector,
                fixture.visualAncestorSelector,
                fixtureVisualEnabled,
              );
              activeCaptures.push(upstreamCapture);
              const frameworkCapture = await capture(
                frameworkPage,
                frameworkRoot,
                state,
                actions,
                true,
                normalization,
                fixture.contract.semanticElement,
                fixture.contractAncestorSelector,
                fixture.visualSelector,
                fixture.visualAncestorSelector,
                fixtureVisualEnabled,
                upstreamCapture.visualCapture.origin,
                upstreamCapture.visualCapture.gutter,
              );
              activeCaptures.push(frameworkCapture);
              const upstream = upstreamCapture.snapshot;
              const frameworkSnapshot = frameworkCapture.snapshot;
              const dom = compareDom(upstream.dom, frameworkSnapshot.dom);
              const literalAccessibilityMatch = isDeepStrictEqual(
                upstream.literalAccessibility,
                frameworkSnapshot.literalAccessibility,
              );
              const correctedAccessibilityMatch = isDeepStrictEqual(
                upstream.accessibility,
                frameworkSnapshot.literalAccessibility,
              );
              if (framework === "astro") {
                const stateRuntimeErrors = runtimeErrors.slice(runtimeErrorStart);
                if (stateRuntimeErrors.length) {
                  throw new Error(
                    `${framework}/${fixture.id}/${state.id}: ${stateRuntimeErrors.join(" | ")}`,
                  );
                }
              }
              const accessibilityCorrected = !isDeepStrictEqual(
                upstream.literalAccessibility,
                upstream.accessibility,
              );
              const accessibility = {
                passed: correctedAccessibilityMatch,
                expected: upstream.accessibility,
                actual: frameworkSnapshot.literalAccessibility,
                literalPassed: literalAccessibilityMatch,
                ...(accessibilityCorrected
                  ? {
                      literalExpected: upstream.literalAccessibility,
                      correctedByErrata: accessibilityErrataIds,
                    }
                  : {}),
              };
              const behavior = {
                passed: actions.length === 0 || dom.passed,
                actions,
                events: frameworkSnapshot.events,
              };
              const expectedForm = upstream.semantics?.form ?? {};
              const actualForm = frameworkSnapshot.semantics?.form ?? {};
              const form = {
                passed: isDeepStrictEqual(expectedForm, actualForm),
                expected: expectedForm,
                actual: actualForm,
              };
              const visualComparison = await compareVisualCaptures(
                upstreamCapture.visualCapture,
                frameworkCapture.visualCapture,
                fixtureVisualEnabled,
              );
              const pixelResult = visualComparison.evidence;
              const visual = {
                ...pixelResult,
                expectedStyle: upstream.visualSemantics.computedStyle,
                actualStyle: frameworkSnapshot.visualSemantics.computedStyle,
              };
              if (
                fixtureVisualEnabled &&
                !pixelResult.passed &&
                arguments_.includes("--save-diffs")
              ) {
                const basename = `${fixture.id}-${framework}-${state.id}`.replace(
                  /[^a-z0-9.-]+/gi,
                  "-",
                );
                await mkdir(diffDirectory, { recursive: true });
                if (visualComparison.screenshots.expected && visualComparison.screenshots.actual) {
                  await Promise.all([
                    writeFile(
                      resolve(diffDirectory, `${basename}-expected.png`),
                      visualComparison.screenshots.expected,
                    ),
                    writeFile(
                      resolve(diffDirectory, `${basename}-actual.png`),
                      visualComparison.screenshots.actual,
                    ),
                  ]);
                }
              }
              const literalUpstreamContractErrors = contractChecks(
                fixture,
                upstream.literalContractSemantics,
              );
              const upstreamContractErrors = contractChecks(fixture, upstream.contractSemantics);
              const frameworkContractErrors = contractChecks(
                fixture,
                frameworkSnapshot.contractSemantics,
              );
              const contractErrors = [
                ...frameworkContractErrors.map((error) => `framework: ${error}`),
                ...upstreamContractErrors.map((error) => `upstream: ${error}`),
              ];
              const passed =
                dom.passed &&
                accessibility.passed &&
                behavior.passed &&
                form.passed &&
                visual.passed &&
                !contractErrors.length;
              results.push({
                fixtureId: fixture.id,
                componentId: fixture.componentId,
                framework,
                state: state.id,
                status: passed ? "passing" : "failing",
                checks: {
                  render: { passed: true },
                  dom,
                  accessibility,
                  behavior,
                  form,
                  visual,
                  contract: {
                    passed: contractErrors.length === 0,
                    errors: contractErrors,
                    literalUpstreamErrors: literalUpstreamContractErrors,
                    ...(!isDeepStrictEqual(
                      upstream.literalContractSemantics,
                      upstream.contractSemantics,
                    )
                      ? { correctedByErrata: accessibilityErrataIds }
                      : {}),
                  },
                },
              });
            } finally {
              const cleanupResults = await Promise.allSettled(
                [...activeCaptures].reverse().map(({ cleanup }) => cleanup()),
              );
              const cleanupFailure = cleanupResults.find((result) => result.status === "rejected");
              cleanupFailureReason = cleanupFailure?.reason;
            }
            if (cleanupFailureReason) throw cleanupFailureReason;
          } catch (error) {
            if (error instanceof SelectorResolutionError) {
              unresolvedSelectorsByFramework.get(framework)?.add(
                error.toEvidence({
                  fixtureId: fixture.id,
                  framework,
                  stateId: state.id,
                }),
              );
            }
            const cause = error instanceof Error ? error.message : String(error);
            const browserErrors =
              framework === "astro"
                ? runtimeErrors
                    .slice(runtimeErrorStart)
                    .filter((runtimeError) => !cause.includes(runtimeError))
                : [];
            const message = [cause, ...browserErrors].join(" | ");
            results.push({
              fixtureId: fixture.id,
              componentId: fixture.componentId,
              framework,
              state: state.id,
              status: "failing",
              checks: {
                render: { passed: false, errors: [message] },
                dom: { passed: false, errors: [message] },
                accessibility: { passed: false, errors: [message] },
                behavior: { passed: false, errors: [message], events: [] },
                form: { passed: false, errors: [message] },
                visual: { passed: false, errors: [message] },
                contract: { passed: false, errors: [message] },
              },
            });
          }
        }
        await frameworkPage.close();
      }
      await upstreamPage.close();
      console.log(`Checked ${fixture.id} across ${selectedFrameworks.length} framework(s).`);
    }
  }
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}

const frameworkEvidence = selectedFrameworks.map((framework) => {
  const frameworkResults = results.filter((result) => result.framework === framework);
  const unresolvedSelectors = [...(unresolvedSelectorsByFramework.get(framework) ?? [])].sort();
  const fixtureResults = fixtures.map((fixture) => {
    const states = frameworkResults.filter((result) => result.fixtureId === fixture.id);
    const errors = states
      .filter((state) => state.status !== "passing")
      .map(
        (state) =>
          `${state.state}: ${Object.entries(state.checks)
            .filter(([, check]) => check.passed === false)
            .map(([name]) => name)
            .join(", ")}`,
      );
    return {
      fixtureId: fixture.id,
      status: errors.length ? "failing" : "passing",
      ...(errors.length ? { errors } : {}),
    };
  });
  const errors = fixtureResults.flatMap((result) => result.errors ?? []);
  return {
    framework,
    status: errors.length || unresolvedSelectors.length ? "failing" : "passing",
    fixtureResults,
    unresolvedSelectors,
    errata: [],
    errors,
    source: "scripts/conformance/runtime.mjs",
  };
});
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  upstream: catalog.upstream,
  browser: { name: "chromium", version: browserVersion },
  fixtureCount: fixtures.length,
  stateCount: results.length,
  frameworks: selectedFrameworks,
  results,
  evidence: frameworkEvidence,
  strictConformance: frameworkEvidence.every((evidence) => evidence.status === "passing"),
};
if (directExecution) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `Runtime conformance ${report.strictConformance ? "passed" : "failed"}: ${results.filter((result) => result.status === "passing").length}/${results.length} states.`,
  );
  if (!report.strictConformance && !process.argv.includes("--no-exit-code")) process.exitCode = 1;
}
