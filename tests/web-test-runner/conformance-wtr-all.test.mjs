import { captureFixture, catalog, emitFixtureCapture } from "./conformance-worker.mjs";

const frameworks = ["react", "vue", "svelte", "solid", "angular", "astro"];

const adapterLoaders = {
  react: () => import("../../apps/conformance-host/dist/assets/react-adapter.mjs"),
  vue: () => import("../../apps/conformance-host/dist/assets/vue-adapter.mjs"),
  svelte: () => import("../../apps/conformance-host/dist/assets/svelte-adapter.mjs"),
  solid: () => import("../../apps/conformance-host/dist/assets/solid-adapter.mjs"),
  angular: () => import("../../apps/conformance-host/dist/assets/angular-adapter.mjs"),
};
const adapters = new Map();
const loadAdapter = async (framework) => {
  if (framework === "astro") return null;
  if (!adapters.has(framework)) {
    adapters.set(
      framework,
      adapterLoaders[framework]().then(({ adapter }) => adapter),
    );
  }
  return adapters.get(framework);
};

describe("integrated in-browser conformance capture", () => {
  for (const framework of frameworks) {
    for (const fixture of catalog.fixtures) {
      it(`${framework} captures ${fixture.id}`, async function () {
        this.timeout(120000);
        const adapter = await loadAdapter(framework);
        const records = await captureFixture(framework, adapter, fixture);
        await emitFixtureCapture(framework, fixture.id, records);
        const failed = records.filter((record) => record.status === "failing");
        if (failed.length) throw new Error(failed.map((record) => record.error).join(" | "));
      });
    }
  }
});
