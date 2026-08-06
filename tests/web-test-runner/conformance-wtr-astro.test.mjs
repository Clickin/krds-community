import { captureFixture, catalog, emitFixtureCapture } from "./conformance-worker.mjs";

describe("astro in-browser conformance capture", () => {
  for (const fixture of catalog.fixtures) {
    it(`captures ${fixture.id}`, async function () {
      this.timeout(120000);
      const records = await captureFixture("astro", null, fixture);
      await emitFixtureCapture("astro", fixture.id, records);
      const failed = records.filter((record) => record.status === "failing");
      if (failed.length) throw new Error(failed.map((record) => record.error).join(" | "));
    });
  }
});
