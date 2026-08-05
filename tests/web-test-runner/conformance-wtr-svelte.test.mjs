import { adapter } from "../../apps/conformance-host/src/adapters/svelte.ts";
import { captureFixture, catalog, emitFixtureCapture } from "./conformance-worker.mjs";

describe("svelte in-browser conformance capture", () => {
  for (const fixture of catalog.fixtures) {
    it(`captures ${fixture.id}`, async function () {
      this.timeout(120000);
      const records = await captureFixture("svelte", adapter, fixture);
      await emitFixtureCapture("svelte", fixture.id, records);
      const failed = records.filter((record) => record.status === "failing");
      if (failed.length) throw new Error(failed.map((record) => record.error).join(" | "));
    });
  }
});
