import './host.css';
import '@krds-community/styles';
import { baseProps } from './fixture-props';
import { fixtureRootAttributes } from './protocol';
import type {
  ConformanceRuntime,
  FixtureCatalog,
  Framework,
  FrameworkAdapter,
  MountedFixture,
  RuntimeEvent,
} from './protocol';

const target = document.querySelector<HTMLElement>('#fixture-root');
const framework = document.body.dataset.framework as Framework | undefined;
const fixtureId = new URLSearchParams(window.location.search).get('fixture');
if (!target || !framework || !fixtureId) {
  throw new Error('Conformance host requires a framework page and ?fixture=<id>.');
}

const catalogResponse = await fetch(`${import.meta.env.BASE_URL}fixtures.json`);
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
const eventTypes = ['click', 'input', 'change', 'submit'] as const;
for (const type of eventTypes) {
  target.addEventListener(type, (event) => {
    const element = event.target instanceof Element ? event.target : target;
    const control = element as HTMLInputElement;
    events.push({
      type,
      target:
        element.id ||
        element.getAttribute('name') ||
        element.tagName.toLocaleLowerCase('en-US'),
      ...('value' in control ? { value: String(control.value) } : {}),
      ...('checked' in control ? { checked: Boolean(control.checked) } : {}),
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

await renderState(fixture.states[0]!.id);
const runtime: ConformanceRuntime = {
  ready: true,
  framework,
  fixture,
  upstream: catalog.upstream,
  rootSelector: '#fixture-root',
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
window.dispatchEvent(new CustomEvent('krds:fixture-ready', { detail: { framework, fixtureId } }));
