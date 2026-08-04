import "./host.css";
import "@krds-community/styles";
import { baseProps } from "./fixture-props";
import { fixtureRootAttributes } from "./protocol";
import type {
  ConformanceRuntime,
  FixtureCatalog,
  FixtureAction,
  Framework,
  FrameworkAdapter,
  MountedFixture,
  RuntimeEvent,
} from "./protocol";

const target = document.querySelector<HTMLElement>("#fixture-root");
const framework = document.body.dataset.framework as Framework | undefined;
const search = new URLSearchParams(window.location.search);
const fixtureId = search.get("fixture");
const docsPreview = search.get("preview") === "docs";
const catalogName = search.get("catalog") ?? "fixtures.json";
if (!target || !framework || !fixtureId) {
  throw new Error("Conformance host requires a framework page and ?fixture=<id>.");
}

const catalogResponse = await fetch(`${import.meta.env.BASE_URL}${catalogName}`);
if (!catalogResponse.ok) throw new Error(`Fixture catalog unavailable: ${catalogResponse.status}`);
const catalog = (await catalogResponse.json()) as FixtureCatalog;
const fixture = catalog.fixtures.find((candidate) => candidate.id === fixtureId);
if (!fixture) throw new Error(`Unknown fixture: ${fixtureId}`);
for (const [name, value] of Object.entries(fixtureRootAttributes(fixture))) {
  target.setAttribute(name, value);
}

// The page chooses one framework at runtime; static imports would bundle all five runtimes together.
const adapterModule = (await import(`./adapters/${framework}.ts`)) as {
  adapter: FrameworkAdapter;
};
const events: RuntimeEvent[] = [];
const eventTypes = ["click", "input", "change", "submit"] as const;
for (const type of eventTypes) {
  target.addEventListener(type, (event) => {
    const element = event.target instanceof Element ? event.target : target;
    const control = element as HTMLInputElement;
    events.push({
      type,
      target:
        element.id || element.getAttribute("name") || element.tagName.toLocaleLowerCase("en-US"),
      ...("value" in control ? { value: String(control.value) } : {}),
      ...("checked" in control ? { checked: Boolean(control.checked) } : {}),
    });
  });
}

let mounted: MountedFixture | undefined;
const renderState = async (stateId: string): Promise<void> => {
  const state = fixture.states.find((candidate) => candidate.id === stateId);
  if (!state) throw new Error(`Unknown fixture state: ${fixture.id}/${stateId}`);
  const props = { ...baseProps(fixture), ...state.props };
  if (mounted) await mounted.update(props);
  else mounted = await adapterModule.adapter.mount(target, fixture.componentId, props);
};

const resolvePreviewTarget = (selector: string | undefined) => {
  if (!selector) return null;
  if (selector === "fixture") return target.firstElementChild;
  return target.querySelector(selector) ?? document.querySelector(selector);
};

const applyPreviewActions = async (actions: FixtureAction[]) => {
  for (const action of actions) {
    const element = resolvePreviewTarget(action.target);
    if (!(element instanceof Element)) continue;
    const value = action.value === undefined ? undefined : String(action.value);
    if (action.action === "click" && element instanceof HTMLElement) element.click();
    else if (action.action === "add-class" && value) element.classList.add(value);
    else if (action.action === "remove-class" && value) element.classList.remove(value);
    else if (action.action === "remove-attribute" && value) element.removeAttribute(value);
    else if (action.action === "keyboard-focus" && element instanceof HTMLElement) element.focus();
    await Promise.resolve();
  }
};

const initialStateId = search.get("state") ?? fixture.states[0]!.id;
await renderState(initialStateId);
if (docsPreview) {
  document.body.dataset.preview = "docs";
  await applyPreviewActions(
    fixture.states.find((candidate) => candidate.id === initialStateId)?.setup ?? [],
  );
}
const runtime: ConformanceRuntime = {
  ready: true,
  framework,
  fixture,
  upstream: catalog.upstream,
  rootSelector: "#fixture-root",
  async setState(stateId) {
    events.length = 0;
    await renderState(stateId);
    return fixture.states.find((state) => state.id === stateId)?.setup ?? [];
  },
  async reset() {
    events.length = 0;
    if (mounted) await mounted.dispose();
    mounted = undefined;
    target.replaceChildren();
    await renderState(fixture.states[0]!.id);
  },
  getEvents: () => [...events],
  async dispose() {
    if (mounted) await mounted.dispose();
    mounted = undefined;
  },
};
window.__KRDS_CONFORMANCE__ = runtime;
window.dispatchEvent(new CustomEvent("krds:fixture-ready", { detail: { framework, fixtureId } }));
