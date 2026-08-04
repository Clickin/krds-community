import type {
  ConformanceRuntime,
  FixtureCatalog,
  FixtureDefinition,
  RuntimeEvent,
} from "@krds-community/conformance-host/protocol";

interface RuntimeData {
  fixture: FixtureDefinition;
  upstream: FixtureCatalog["upstream"];
  currentStateId: string;
  initialStateId: string;
}

const dataElement = document.querySelector<HTMLScriptElement>("#fixture-runtime-data");
const target = document.querySelector<HTMLElement>("#fixture-root");
if (!dataElement?.textContent || !target) {
  throw new Error("Astro conformance runtime data is unavailable.");
}
const data = JSON.parse(dataElement.textContent) as RuntimeData;

const events: RuntimeEvent[] = [];
const eventController = new AbortController();
const eventTypes = ["click", "input", "change", "submit"] as const;
for (const type of eventTypes) {
  target.addEventListener(
    type,
    (event) => {
      const element = event.target instanceof Element ? event.target : target;
      const control = element as HTMLInputElement;
      events.push({
        type,
        target:
          element.id || element.getAttribute("name") || element.tagName.toLocaleLowerCase("en-US"),
        ...("value" in control ? { value: String(control.value) } : {}),
        ...("checked" in control ? { checked: Boolean(control.checked) } : {}),
      });
    },
    { signal: eventController.signal },
  );
}

const navigateToState = (stateId: string) => {
  const state = data.fixture.states.find((candidate) => candidate.id === stateId);
  if (!state) throw new Error(`Unknown fixture state: ${data.fixture.id}/${stateId}`);
  const url = new URL(`../${encodeURIComponent(stateId)}/`, window.location.href);
  window.location.assign(url.href);
  return state.setup ?? [];
};

const runtime: ConformanceRuntime = {
  ready: true,
  framework: "astro",
  fixture: data.fixture,
  upstream: data.upstream,
  rootSelector: "#fixture-root",
  stateId: data.currentStateId,
  async setState(stateId) {
    events.length = 0;
    return navigateToState(stateId);
  },
  async reset() {
    events.length = 0;
    navigateToState(data.initialStateId);
  },
  getEvents: () => [...events],
  async dispose() {
    eventController.abort();
  },
};
window.__KRDS_CONFORMANCE__ = runtime;
window.dispatchEvent(
  new CustomEvent("krds:fixture-ready", {
    detail: {
      framework: "astro",
      fixtureId: data.fixture.id,
      stateId: data.currentStateId,
    },
  }),
);
