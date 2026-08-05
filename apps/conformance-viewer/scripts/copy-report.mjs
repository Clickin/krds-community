import { access, copyFile, mkdir, readFile, rm } from "node:fs/promises";

const source = "../../reports/conformance-runtime.json";
const destination = "public/reports/conformance-runtime.json";

// The Pages deploy builds this workspace without a conformance run, so the
// report may legitimately be absent. The viewer is an SPA that fetches the
// report at runtime; a missing report builds fine and degrades to "no evidence"
// in the UI. Only copy/validate when CI has produced the report first.
let reportExists = true;
try {
  await access(source);
} catch {
  reportExists = false;
  await rm("public/reports", { recursive: true, force: true });
  console.log(`${source} not present; building viewer without runtime evidence.`);
}
if (!reportExists) process.exit(0);

const report = JSON.parse(await readFile(source, "utf8"));
const frameworkEvidence =
  Array.isArray(report.frameworks) &&
  report.frameworks.length > 0 &&
  report.frameworks.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      typeof entry.framework === "string" &&
      Array.isArray(entry.fixtureResults),
  )
    ? report.frameworks
    : report.evidence;

if (
  typeof report.generatedAt !== "string" ||
  typeof report.strictConformance !== "boolean" ||
  !report.browser ||
  typeof report.upstream?.commit !== "string" ||
  !Array.isArray(report.results) ||
  report.results.length === 0 ||
  !Array.isArray(frameworkEvidence) ||
  frameworkEvidence.length === 0
) {
  throw new Error(
    `${source} is not a detailed runtime evidence report; refusing to publish catalog-only status.`,
  );
}

await rm("public/reports", { recursive: true, force: true });
await mkdir("public/reports", { recursive: true });
await copyFile(source, destination);
console.log(`Copied runtime evidence report to ${destination}.`);
