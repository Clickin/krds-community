import { adapter } from "../../apps/conformance-host/src/adapters/solid.ts";
import { captureFixture, catalog, emitFixtureCapture } from "./conformance-worker.mjs";

describe("solid in-browser conformance capture", () => {
  for (const fixture of catalog.fixtures) {
    it(`captures ${fixture.id}`, async function () {
      this.timeout(120000);
      const records = await captureFixture("solid", adapter, fixture);
      await emitFixtureCapture("solid", fixture.id, records);
      const failed = records.filter((record) => record.status === "failing");
      if (failed.length) throw new Error(failed.map((record) => record.error).join(" | "));
    });
  }
});
