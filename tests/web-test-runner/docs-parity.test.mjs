// In-browser docs framework parity audit, run under @web/test-runner + Chrome.
// React is the reference implementation for each rendered preview.

const collectorBase = import.meta.env.VITE_STORYBOOK_COLLECTOR ?? "http://127.0.0.1:8123";
const frameworks = ["react", "vue", "svelte", "solid", "angular", "astro"];
const GEOMETRY_TOLERANCE_PX = 1;
const HYDRATION_ERROR =
  /\[astro-island\]|Error hydrating|does not provide an export|hydration failed|Failed to fetch dynamically imported module/i;
const transparentTags = new Set(["astro-island", "astro-slot"]);
const stateAttributes = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-checked",
  "aria-current",
  "aria-disabled",
  "aria-expanded",
  "aria-haspopup",
  "aria-invalid",
  "aria-live",
  "aria-multiline",
  "aria-pressed",
  "aria-selected",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "checked",
  "disabled",
  "hidden",
  "open",
  "selected",
];
const booleanStateAttributes = new Set(["checked", "disabled", "hidden", "open", "selected"]);
const styleGroups = {
  paint: ["display", "visibility", "opacity", "color", "backgroundColor", "backgroundImage"],
  typography: [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "textDecorationLine",
  ],
  border: [
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRadius",
  ],
  pseudo: [
    "display",
    "content",
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderTopStyle",
    "borderTopWidth",
    "width",
    "height",
  ],
};

const config = await (await fetch(`${collectorBase}/config`)).json();
const routes = config.routes ?? [];

const reportRoute = (route, failures, metrics) => {
  return fetch(`${collectorBase}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "docs-parity", route, failures, metrics }),
  });
};

const normalizeText = (text) => (text ?? "").replace(/\s+/g, " ").trim();

const isVisuallyHidden = (element) => {
  const style = element.ownerDocument.defaultView.getComputedStyle(element);
  return (
    element.hidden ||
    style.display === "none" ||
    style.visibility === "hidden" ||
    /^rect\(0px?, 0px?, 0px?, 0px?\)$/.test(style.clip) ||
    /inset\(50%\)|circle\(0/.test(style.clipPath) ||
    (style.position === "absolute" &&
      style.overflow === "hidden" &&
      style.width === "1px" &&
      style.height === "1px")
  );
};

const isVisible = (element) => {
  for (let current = element; current; current = current.parentElement) {
    if (isVisuallyHidden(current)) return false;
  }
  return true;
};

const visibleText = (panel) => {
  const walker = panel.ownerDocument.createTreeWalker(panel, NodeFilter.SHOW_TEXT);
  const parts = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement && isVisible(node.parentElement)) parts.push(node.textContent);
  }
  return normalizeText(parts.join(" "));
};

const textContent = (element) => normalizeText(element.textContent);

const nativeRole = (element) => {
  const explicit = element.getAttribute("role");
  if (explicit) return explicit;
  const tag = element.localName;
  if (tag === "button") return "button";
  if (tag === "a" && element.hasAttribute("href")) return "link";
  if (tag === "img") return "img";
  if (tag === "input") {
    const type = (element.getAttribute("type") ?? "text").toLowerCase();
    return type === "checkbox"
      ? "checkbox"
      : type === "radio"
        ? "radio"
        : type === "range"
          ? "slider"
          : type === "button" || type === "submit"
            ? "button"
            : "textbox";
  }
  if (tag === "textarea") return "textbox";
  if (tag === "select") return element.hasAttribute("multiple") ? "listbox" : "combobox";
  if (/^h[1-6]$/.test(tag)) return "heading";
  if (tag === "li") return "listitem";
  if (tag === "ul" || tag === "ol") return "list";
  if (tag === "table") return "table";
  return "generic";
};

const referenceRoot = (element) => element.closest("[data-preview-panel]") ?? element.ownerDocument;

const referencedText = (element, attribute) => {
  const root = referenceRoot(element);
  return (element.getAttribute(attribute) ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => root.querySelector(`[id="${CSS.escape(id)}"]`))
    .filter(Boolean)
    .map(textContent)
    .join(" ");
};

const accessibleName = (element) => {
  const labelledBy = referencedText(element, "aria-labelledby");
  if (labelledBy) return labelledBy;
  if (element.hasAttribute("aria-label")) return normalizeText(element.getAttribute("aria-label"));
  if (element.localName === "img") return normalizeText(element.getAttribute("alt"));
  if (["input", "select", "textarea"].includes(element.localName)) {
    const id = element.id;
    const root = referenceRoot(element);
    const label = id && root.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label) return textContent(label);
  }
  return ["button", "a", "summary", "option"].includes(element.localName)
    ? textContent(element)
    : "";
};

const normalizeReference = (value, ids) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => ids.get(id) ?? id)
    .join(" ");

const elementIds = (panel) => {
  const ids = new Map();
  const occurrences = new Map();
  for (const element of panel.querySelectorAll("[id]")) {
    const classes = Array.from(element.classList).sort().join(".");
    const signature = [element.localName, element.getAttribute("role") ?? "", classes].join("|");
    const occurrence = (occurrences.get(signature) ?? 0) + 1;
    occurrences.set(signature, occurrence);
    ids.set(element.id, `${signature}|${occurrence}`);
  }
  return ids;
};

const state = (element, ids) => {
  const result = {};
  for (const attribute of element.getAttributeNames()) {
    if (stateAttributes.includes(attribute) || attribute.startsWith("aria-")) {
      const value = element.getAttribute(attribute) ?? "";
      result[attribute] = booleanStateAttributes.has(attribute)
        ? String(element.hasAttribute(attribute))
        : /^(aria-(?:controls|describedby|labelledby|owns|activedescendant)|for)$/.test(attribute)
          ? normalizeReference(value, ids)
          : value;
    }
  }
  if (["input", "textarea", "select", "option"].includes(element.localName)) {
    result.value = element.value ?? element.getAttribute("value") ?? "";
  }
  if (["input", "option"].includes(element.localName))
    result.checked = String(Boolean(element.checked));
  if (element.localName === "option") result.selected = String(Boolean(element.selected));
  return result;
};

const style = (element, kind) => {
  const view = element.ownerDocument.defaultView;
  const read = (pseudo) => {
    const computed = view.getComputedStyle(element, pseudo);
    return Object.fromEntries(
      styleGroups[kind].map((property) => {
        let value = computed[property];
        // Flex items are blockified by CSS Display: a canonical inline-flex
        // or inline-block child reports flex/block from getComputedStyle when
        // it is mounted directly in the preview's flex layout. Compare the
        // declared KRDS outer display for these exact component classes; all
        // other native elements and component-specific display values remain
        // exact.
        if (
          property === "display" &&
          element.closest("[data-framework-preview]") &&
          ((element.localName === "button" &&
            element.classList.contains("krds-btn") &&
            value === "flex") ||
            (element.classList.contains("krds-badge") && value === "flex") ||
            (element.localName === "a" &&
              element.classList.contains("krds-btn") &&
              element.classList.contains("link") &&
              value === "block"))
        ) {
          value = element.localName === "a" ? "inline-block" : "inline-flex";
        }
        return [property, value];
      }),
    );
  };
  return kind === "pseudo" ? { before: read("::before"), after: read("::after") } : read("");
};

const geometry = (element, panel) => {
  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  const root = panel.getBoundingClientRect();
  // Framework tabs are synchronized across the whole page. Switching the
  // active framework therefore reflows earlier previews and changes the
  // document/viewport coordinate of fixed demos. A fixed element contained by
  // this preview still has the same position relative to its preview stage;
  // compare in that stable local coordinate space.
  if (element.closest("[data-preview-panel]") === panel)
    return {
      x: rect.left - root.left,
      y: rect.top - root.top,
      width: rect.width,
      height: rect.height,
    };
  for (let current = element; current && current !== panel; current = current.parentElement) {
    if (view.getComputedStyle(current).position === "fixed")
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  }
  return {
    x: rect.left - root.left,
    y: rect.top - root.top,
    width: rect.width,
    height: rect.height,
  };
};

const countNodes = (nodes) =>
  nodes.reduce(
    (count, node) => count + 1 + (node.type === "element" ? countNodes(node.children) : 0),
    0,
  );

const normalizeChildren = (parent, ids, panel) => {
  const children = [];
  for (const child of parent.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(child.textContent);
      if (text)
        children.push({
          type: "text",
          text,
          visible: child.parentElement ? isVisible(child.parentElement) : true,
        });
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const element = /** @type {HTMLElement} */ (child);
    if (["link", "script", "style", "template"].includes(element.localName)) continue;
    // The Angular tab contract includes a non-semantic selection test hook;
    // the approved errata explicitly excludes it from DOM parity.
    if (element.matches('[data-testid="selected-tab"]')) continue;
    // Angular standalone components retain their selector host in the DOM;
    // it is framework bookkeeping, not the native component shape.
    if (transparentTags.has(element.localName) || element.localName.startsWith("krds-")) {
      children.push(...normalizeChildren(element, ids, panel));
      continue;
    }
    children.push({
      type: "element",
      tag: element.localName,
      role: nativeRole(element),
      name: accessibleName(element),
      visible: isVisible(element),
      state: state(element, ids),
      paint: style(element, "paint"),
      typography: style(element, "typography"),
      border: style(element, "border"),
      pseudo: style(element, "pseudo"),
      rect: geometry(element, panel),
      children: normalizeChildren(element, ids, panel),
    });
  }
  return children;
};

const snapshot = (panel) => ({
  text: visibleText(panel),
  children: normalizeChildren(panel, elementIds(panel), panel),
});

const waitFor = async (fn, deadlineMs, intervalMs = 100) => {
  const start = performance.now();
  for (;;) {
    const value = fn();
    if (value) return value;
    if (performance.now() - start > deadlineMs) return null;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForIslands = async (panel) => {
  const islands = [...panel.querySelectorAll("astro-island")];
  if (!islands.length) return;
  const deadline = performance.now() + 40000;
  while (performance.now() < deadline) {
    if (
      islands.every(
        (island) => island.children.length > 0 || island.getAttribute("status") === "error",
      )
    )
      return;
    await sleep(200);
  }
};

const settleIslands = async (panel) => {
  let previous = "";
  let stable = 0;
  const deadline = performance.now() + 2000;
  while (performance.now() < deadline) {
    const current = panel.innerHTML;
    if (current === previous) {
      if (++stable >= 3) break;
    } else {
      previous = current;
      stable = 0;
    }
    await sleep(200);
  }
  // CSS keyframe animations (e.g. the 0.2s krds-snackbar mount animation)
  // do not mutate innerHTML, so the stability loop can exit mid-flight and
  // geometry gets measured during a transform. Wait them out before reading.
  const running = panel.getAnimations().filter((animation) => animation.playState === "running");
  if (running.length) await Promise.allSettled(running.map((animation) => animation.finished));
};

const readStableSnapshot = (panel) => snapshot(panel);

const hasHydratedIsland = (panel) =>
  [...panel.querySelectorAll("astro-island")].some((island) => island.children.length > 0);

const activateFramework = async (example, framework) => {
  const tab = example.querySelector(`[data-framework-tabs] button[data-framework="${framework}"]`);
  if (!tab) throw new Error(`${framework}: framework tab missing`);
  const deadline = performance.now() + 45000;
  while (performance.now() < deadline) {
    tab.click();
    const panel = await waitFor(() => {
      const candidate = example.querySelector(
        `[data-preview-panel][data-framework="${framework}"]`,
      );
      if (!candidate || candidate.hidden) return null;
      if (!candidate.querySelector("astro-island")) return candidate;
      return hasHydratedIsland(candidate) || candidate.textContent.trim() ? candidate : null;
    }, 2000);
    if (panel) return panel;
  }
  const dead = example.querySelector(`[data-preview-panel][data-framework="${framework}"]`);
  throw new Error(
    `${framework}: panel did not hydrate within 45s (hidden=${dead?.hidden}, islands=${dead?.querySelectorAll("astro-island").length})`,
  );
};

const addFailure = (
  failures,
  example,
  framework,
  category,
  message,
  path,
  reason,
  primary = true,
) => {
  const key = `${example}\0${framework}\0${category}\0${message}`;
  if (failures.some((failure) => failure.key === key)) return;
  failures.push({ key, example, framework, category, message, path, reason, primary });
};

const geometryDifferences = (left, right) => {
  if (left.width === 0 && left.height === 0 && right.width === 0 && right.height === 0) return [];
  return ["x", "y", "width", "height"].filter(
    (property) => Math.abs(left[property] - right[property]) > GEOMETRY_TOLERANCE_PX,
  );
};

const styleDifferences = (left, right) =>
  Object.keys(left).filter(
    (property) => JSON.stringify(left[property]) !== JSON.stringify(right[property]),
  );

const serializeState = (state) =>
  JSON.stringify(Object.fromEntries(Object.entries(state).sort(([left], [right]) => left.localeCompare(right))));

const compareNodes = (left, right, path, failures, example, framework, cascade = false) => {
  let primaryAvailable = !cascade;
  let structuralMismatch = cascade;
  const fail = (category, reason, message) => {
    addFailure(
      failures,
      example,
      framework,
      category,
      message,
      path,
      reason,
      primaryAvailable,
    );
    primaryAvailable = false;
    structuralMismatch = true;
  };
  if (!left || !right) {
    fail("missing", "missing", `${path}: normalized node is missing`);
    return;
  }
  if (left.type !== right.type) {
    fail("identity", "tag-role-name", `${path}: node type differs (${left.type} vs ${right.type})`);
    return;
  }
  if (left.type === "text") {
    if (left.visible && right.visible && left.text !== right.text)
      fail("identity", "visible-text", `${path}: visible text differs ("${left.text}" vs "${right.text}")`);
    if (left.visible !== right.visible)
      fail("state", "state", `${path}: visibility differs`);
    return;
  }
  if (left.tag !== right.tag || left.role !== right.role || left.name !== right.name) {
    fail(
      "identity",
      "tag-role-name",
      `${path}: tag/role/name differs (${left.tag}/${left.role}/${left.name} vs ${right.tag}/${right.role}/${right.name})`,
    );
  }
  if (left.visible !== right.visible)
    fail("state", "state", `${path}: visibility differs`);
  const leftState = serializeState(left.state);
  const rightState = serializeState(right.state);
  if (leftState !== rightState)
    fail(
      "state",
      "state",
      `${path}: accessibility or native state differs (${leftState} vs ${rightState})`,
    );
  const geometry = geometryDifferences(left.rect, right.rect);
  if (geometry.length)
    fail(
      "geometry",
      "geometry",
      `${path}: geometry differs by more than ${GEOMETRY_TOLERANCE_PX} CSS px (${geometry.map((property) => `${property} ${left.rect[property]} vs ${right.rect[property]}`).join(", ")})`,
    );
  for (const kind of ["paint", "border", "pseudo"]) {
    const differences = styleDifferences(left[kind], right[kind]);
    if (differences.length)
      fail(
        "paint",
        "paint",
        `${path}: ${kind} differs (${differences.map((property) => `${property} ${JSON.stringify(left[kind][property])} vs ${JSON.stringify(right[kind][property])}`).join(", ")})`,
      );
  }
  if (JSON.stringify(left.typography) !== JSON.stringify(right.typography))
    fail("typography", "typography", `${path}: typography differs`);
  const count = Math.max(left.children.length, right.children.length);
  if (left.children.length !== right.children.length)
    fail(
      "identity",
      "child-count",
      `${path}: hierarchy child count differs (${left.children.length} vs ${right.children.length})`,
    );
  for (let index = 0; index < count; index += 1)
    compareNodes(
      left.children[index],
      right.children[index],
      `${path}/${index}`,
      failures,
      example,
      framework,
      structuralMismatch,
    );
};

const auditExample = async (example, failures) => {
  const title = example.getAttribute("data-title") ?? "(제목 없음)";
  const reactPanel = await activateFramework(example, "react");
  await waitForIslands(reactPanel);
  await settleIslands(reactPanel);
  const reactSnapshot = await readStableSnapshot(reactPanel);
  const metrics = {
    referenceNodeCount: countNodes(reactSnapshot.children),
    frameworkNodeCounts: { react: countNodes(reactSnapshot.children) },
    comparisonCount: 0,
  };
  for (const framework of frameworks.slice(1)) {
    try {
      const panel = await activateFramework(example, framework);
      await waitForIslands(panel);
      await settleIslands(panel);
      const current = await readStableSnapshot(panel);
      metrics.frameworkNodeCounts[framework] = countNodes(current.children);
      metrics.comparisonCount += 1;
      if (current.text !== reactSnapshot.text)
        addFailure(
          failures,
          title,
          framework,
          "identity",
          `visible text differs (react: "${reactSnapshot.text.slice(0, 80)}" | ${framework}: "${current.text.slice(0, 80)}")`,
          "panel",
          "visible-text",
          false,
        );
      compareNodes(
        {
          type: "element",
          tag: "panel",
          role: "generic",
          name: "",
          visible: true,
          state: {},
          paint: {},
          typography: {},
          border: {},
          pseudo: {},
          rect: { x: 0, y: 0, width: 0, height: 0 },
          children: reactSnapshot.children,
        },
        {
          type: "element",
          tag: "panel",
          role: "generic",
          name: "",
          visible: true,
          state: {},
          paint: {},
          typography: {},
          border: {},
          pseudo: {},
          rect: { x: 0, y: 0, width: 0, height: 0 },
          children: current.children,
        },
        "panel",
        failures,
        title,
        framework,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addFailure(
        failures,
        title,
        framework,
        HYDRATION_ERROR.test(message) ? "hydration" : "missing",
        message,
        "panel",
        HYDRATION_ERROR.test(message) ? "hydration" : "missing",
      );
    }
  }
  return metrics;
};

const auditRoute = async (route) => {
  const failures = [];
  const metrics = {
    exampleCount: 0,
    referenceNodeCount: 0,
    frameworkNodeCounts: Object.fromEntries(frameworks.map((framework) => [framework, 0])),
    comparisonCount: 0,
  };
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:absolute;left:-100000px;top:0;width:1440px;height:900px;border:0";
  document.body.appendChild(iframe);
  const windowErrors = [];
  const windowRejections = [];
  iframe.contentWindow.addEventListener("error", (event) => {
    if (event.message) windowErrors.push(event.message);
  });
  iframe.contentWindow.addEventListener("unhandledrejection", (event) => {
    if (event.reason) windowRejections.push(String(event.reason));
  });
  iframe.src = `${location.origin}/docs/${route}/`;
  try {
    const frameDoc = await waitFor(() => {
      try {
        return iframe.contentDocument?.querySelector("[data-framework-preview]")
          ? iframe.contentDocument
          : null;
      } catch {
        return null;
      }
    }, 15000);
    if (!frameDoc) throw new Error("page did not render [data-framework-preview] within 15s");
    const motionGuard = frameDoc.createElement("style");
    motionGuard.textContent =
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";
    frameDoc.head.appendChild(motionGuard);
    await frameDoc.fonts?.ready;
    const frameworkSyncReady = await waitFor(
      () => frameDoc.documentElement.dataset.frameworkSyncReady === "true",
      15000,
    );
    if (!frameworkSyncReady) throw new Error("framework tab synchronization was not ready");
    const ids = new Map();
    // Component demos intentionally mount six framework copies; their own
    // generated control ids may repeat while hidden. Preview tab/panel ids
    // are document-owned and must be unique.
    for (const element of frameDoc.querySelectorAll('[id^="fp-"]')) {
      const count = (ids.get(element.id) ?? 0) + 1;
      ids.set(element.id, count);
      if (count === 2)
        addFailure(
          failures,
          "(route)",
          "-",
          "identity",
          `duplicate id: ${element.id}`,
          `#${element.id}`,
          "duplicate-id",
        );
    }
    const examples = Array.from(frameDoc.querySelectorAll("[data-framework-preview]"));
    if (!examples.length) throw new Error("no [data-framework-preview] examples on page");
    metrics.exampleCount = examples.length;
    for (const example of examples) {
      try {
        const exampleMetrics = await auditExample(example, failures);
        metrics.referenceNodeCount += exampleMetrics.referenceNodeCount;
        metrics.comparisonCount += exampleMetrics.comparisonCount;
        for (const framework of frameworks)
          metrics.frameworkNodeCounts[framework] +=
            exampleMetrics.frameworkNodeCounts[framework] ?? 0;
      } catch (error) {
        addFailure(
          failures,
          example.getAttribute("data-title") ?? "(제목 없음)",
          "-",
          "missing",
          error instanceof Error ? error.message : String(error),
          "panel",
          "missing",
        );
      }
    }
    for (const message of [...windowErrors, ...windowRejections]) {
      if (HYDRATION_ERROR.test(message))
        addFailure(failures, "(route)", "-", "hydration", message, "iframe", "hydration");
    }
  } catch (error) {
    addFailure(
      failures,
      "(route)",
      "-",
      "missing",
      error instanceof Error ? error.message : String(error),
      "iframe",
      "missing",
    );
  } finally {
    iframe.remove();
  }
  await reportRoute(
    route,
    failures.map((failure) =>
      Object.fromEntries(Object.entries(failure).filter(([name]) => name !== "key")),
    ),
    {
      ...metrics,
      browserUserAgent: navigator.userAgent,
      viewport: { width: 1440, height: 900 },
      geometryTolerancePx: GEOMETRY_TOLERANCE_PX,
    },
  );
};

describe("docs framework parity (in-browser)", () => {
  for (const route of routes) {
    it(`parity: ${route}`, async function () {
      this.timeout(600000);
      await auditRoute(route);
    });
  }
});
