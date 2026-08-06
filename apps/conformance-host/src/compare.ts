// Side-by-side upstream-vs-framework comparison viewer for visual inspection.
//
// Served by the conformance host dev server at /compare.html?framework=react&fixture=<id>.
// Renders the literal upstream fixture HTML and the framework component in two
// labelled panels under the SAME layout context, with a state selector so you
// can visibly compare e.g. the `focus-visible` focus ring before training the
// pixel-equivalence threshold.
import "./host.css";
import type { FixtureCatalog, FixtureDefinition, FixtureState, Framework } from "./protocol";
import { fixtureRootAttributes } from "./protocol";
import { baseProps } from "./fixture-props";

declare global {
  interface Window {
    __COMPARE__?: { upEl: Element; fwEl: Element };
  }
}

const params = new URLSearchParams(window.location.search);
const framework = (params.get("framework") ?? "react") as Framework;
const requestedFixtureId = params.get("fixture") ?? undefined;

const catalog = (await (await fetch(`${import.meta.env.BASE_URL}fixtures.json`)).json()) as FixtureCatalog;

const select = document.querySelector<HTMLSelectElement>("#fixture-select");
const stateSelect = document.querySelector<HTMLSelectElement>("#state-select");
const upstreamPanel = document.querySelector<HTMLDivElement>("#upstream-panel");
const frameworkPanel = document.querySelector<HTMLDivElement>("#framework-panel");

const settle = async () => {
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};

// Official KRDS renders block components (accordion, tabs, menus) at full
// container width; `align-items:center` shrink-wraps them to their content
// width, which crushes padding-based geometry (e.g. the accordion arrow
// anchored to a `padding` offset overflows a one-line header). Stretch so
// the same normal block flow as the official site is reproduced.
const layoutRoot = (fixture: FixtureDefinition) => {
  const container = document.createElement("div");
  container.id = "fixture-root";
  for (const [name, value] of Object.entries(fixtureRootAttributes(fixture))) {
    container.setAttribute(name, String(value));
  }
  container.style.cssText =
    "display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;" +
    "min-width:0;min-height:0;width:100%;height:100%;";
  return container;
};

const stripPageWrapper = (sourceHtml: string): string => {
  const match = sourceHtml.match(/<div class="fieldset">([\s\S]*)<\/div>\s*(?:<!--[^]*?-->)?\s*$/);
  return match && match[1] ? match[1] : sourceHtml;
};

const interactiveSelector =
  'button, input, select, textarea, a[href], summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

const focusRoot = (root: Element | null) => {
  if (!root) return;
  const target = root.matches(interactiveSelector)
    ? root
    : root.querySelector(interactiveSelector);
  ((target ?? root) as HTMLElement).focus();
};

// Rewards keyboard-style focus so `:focus-visible` (the focus ring) renders.
const applyInputMode = () => {
  const style = document.createElement("style");
  style.textContent = "*:focus{outline:.2rem solid var(--krds-light-color-border-inverse);outline-offset:0;box-shadow:var(--krds-box-shadow-outline)}";
  document.head.appendChild(style);
  // Simulate keyboard interaction so :focus-visible matches (headless .focus() may not).
};

let adapter: { adapter: { mount: (target: HTMLElement, componentId: string, props: Record<string, unknown>) => Promise<{ dispose?: () => void }> } };

const loadFramework = async (fw: Framework) => {
  const mod = (await import(`./adapters/${fw}.ts`)) as {
    adapter: { mount: typeof adapter.adapter.mount };
  };
  adapter = mod as never;
  return adapter;
};

let mounted: { dispose?: () => void } | undefined;

const render = async (fixture: FixtureDefinition, state: FixtureState) => {
  upstreamPanel!.replaceChildren();
  frameworkPanel!.replaceChildren();
  mounted?.dispose?.();

  // upstream: inject shared styles + krds.min.js once, then the fixture HTML.
  const headLinks = () => {
    if (document.querySelector("#compare-style")) return;
    const style = document.createElement("link");
    style.id = "compare-style";
    style.rel = "stylesheet";
    style.href = `${import.meta.env.BASE_URL}../packages/styles/dist/index.css`;
    document.head.appendChild(style);
    const script = document.createElement("script");
    script.src = `${import.meta.env.BASE_URL}../upstream/krds-html/resources/cdn/krds.min.js`;
    document.head.appendChild(script);
  };
  headLinks();
  const raw = await (await fetch(`${import.meta.env.BASE_URL}../${fixture.sourcePath}`)).text();
  const upRoot = layoutRoot(fixture);
  upRoot.innerHTML = stripPageWrapper(raw);
  upstreamPanel!.appendChild(upRoot);
  window.dispatchEvent(new Event("DOMContentLoaded"));
  await settle();

  // framework: mount the adapter into its own layout root.
  const fwRoot = layoutRoot(fixture);
  frameworkPanel!.appendChild(fwRoot);
  const props = { ...baseProps(fixture), ...fixture.props, ...state.props };
  mounted = await adapter.adapter.mount(fwRoot, fixture.componentId, props);
  await settle();

  const upEl = upRoot.querySelector(fixture.sourceSelector) ?? upRoot;
  const fwEl = fwRoot.querySelector(fixture.sourceSelector) ?? fwRoot;
  window.__COMPARE__ = { upEl, fwEl };

  // Focus is exclusive (one element per document), so focus the framework by
  // default (matching the worker's framework capture) and expose per-side
  // focusing for visual inspection.
  focusRoot(fwEl);
  await settle();
  await settle();
};

const captionFor = (el: Element) => {
  const cs = getComputedStyle(el);
  return `:focus-visible=${el.matches(":focus-visible")} · box-shadow: ${cs.boxShadow} · outline: ${cs.outline} offset ${cs.outlineOffset}`;
};

const upCaption = document.querySelector<HTMLDivElement>("#up-caption");
const fwCaption = document.querySelector<HTMLDivElement>("#fw-caption");

const refreshCaptionsAndFocus = async (focusTarget: "up" | "fw") => {
  const els = window.__COMPARE__;
  if (!els) return;
  await settle();
  if (focusTarget === "up") focusRoot(els.upEl);
  else focusRoot(els.fwEl);
  await settle();
  await settle();
  if (upCaption) upCaption.textContent = captionFor(els.upEl);
  if (fwCaption) fwCaption.textContent = captionFor(els.fwEl);
};

const upFocusBtn = document.querySelector<HTMLButtonElement>("#focus-up");
const fwFocusBtn = document.querySelector<HTMLButtonElement>("#focus-fw");
upFocusBtn?.addEventListener("click", () => void refreshCaptionsAndFocus("up"));
fwFocusBtn?.addEventListener("click", () => void refreshCaptionsAndFocus("fw"));
// capture the ring caption once after the initial render
void (async () => {
  await settle();
  await refreshCaptionsAndFocus("fw");
})();

// populate the fixture list
for (const f of catalog.fixtures) {
  const option = document.createElement("option");
  option.value = f.id;
  option.textContent = f.id;
  select!.appendChild(option);
}
let initialFixtureId: string = catalog.fixtures[0]!.id;
if (requestedFixtureId && catalog.fixtures.some((f) => f.id === requestedFixtureId)) {
  initialFixtureId = requestedFixtureId;
}
select!.value = initialFixtureId;

const onFixtureChange = async () => {
  const fixture = catalog.fixtures.find((f) => f.id === select!.value);
  if (!fixture) return;
  stateSelect!.replaceChildren();
  for (const s of fixture.states) {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.id;
    stateSelect!.appendChild(option);
  }
  await loadFramework(framework);
  await render(fixture, fixture.states[0]!);
  stateSelect!.onchange = () => {
    const state = fixture.states.find((s) => s.id === stateSelect!.value) ?? fixture.states[0]!;
    void render(fixture, state);
  };
};

applyInputMode();
await onFixtureChange();
