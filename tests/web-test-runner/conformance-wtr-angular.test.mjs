import { adapter } from "../../apps/conformance-host/src/adapters/angular.ts";
import { captureFixture, catalog, emitFixtureCapture } from "./conformance-worker.mjs";

describe("angular in-browser conformance capture", () => {
  for (const fixture of catalog.fixtures) {
    it(`captures ${fixture.id}`, async function () {
      this.timeout(120000);
      const records = await captureFixture("angular", adapter, fixture);
      await emitFixtureCapture("angular", fixture.id, records);
      const failed = records.filter((record) => record.status === "failing");
      if (failed.length) throw new Error(failed.map((record) => record.error).join(" | "));
    });
  }
});
