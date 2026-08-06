import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Full conformance execution under the in-browser (@web/test-runner) path.
//
// Every framework is captured and judged in the browser worker
// (browser-runner.mjs -> conformance-wtr-*.test.mjs -> judgeState), which is
// now the only assertion path. The legacy Node/Playwright runtime was removed.

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const browserRunnerPath = resolve(repositoryRoot, "scripts/conformance/browser-runner.mjs");
const frameworkIds = ["react", "vue", "svelte", "solid", "angular", "astro"];
const arguments_ = process.argv.slice(2);
let outputArgument;
let catalogArgument;

for (let index = 0; index < arguments_.length; index += 1) {
  const argument = arguments_[index];
  if (argument === "--catalog") {
    const value = arguments_[index + 1];
    if (!value || value.startsWith("--")) throw new Error("--catalog requires a file path");
    catalogArgument = value;
    index += 1;
    continue;
  }
  if (argument === "--output") {
    const value = arguments_[index + 1];
    if (!value || value.startsWith("--")) throw new Error("--output requires a file path");
    outputArgument = value;
    index += 1;
    continue;
  }
  throw new Error(
    `Unsupported option: ${argument}. Conformance always runs the full browser (WTR) evidence.`,
  );
}

const outputPath = resolve(repositoryRoot, outputArgument ?? "reports/conformance-runtime.json");
const temporaryOutputPath = `${outputPath}.${process.pid}.tmp`;
const runStartedAt = Date.now();
await Promise.all([rm(outputPath, { force: true }), rm(temporaryOutputPath, { force: true })]);

const catalog = JSON.parse(
  await readFile(
    resolve(repositoryRoot, catalogArgument ?? "apps/conformance-host/dist/fixtures.json"),
    "utf8",
  ),
);
if (!catalog.upstream || !Array.isArray(catalog.fixtures)) {
  throw new Error("The current conformance host build did not produce a valid fixture catalog");
}
const requiredFixtureCount = catalog.fixtures.length;

const expectedStateKeys = new Set();
for (const fixture of catalog.fixtures) {
  if (
    !fixture?.id ||
    !fixture.componentId ||
    !Array.isArray(fixture.states) ||
    !fixture.states.length
  ) {
    throw new Error(
      `${fixture?.id ?? "<missing>"}: executable component/state contract is incomplete`,
    );
  }
  for (const state of fixture.states) {
    if (!state?.id) throw new Error(`${fixture.id}: state id is missing`);
    expectedStateKeys.add(`${fixture.id}\0${state.id}`);
  }
}
const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "krds-conformance-"));

const runBrowserFramework = async (framework) => {
  const shardPath = resolve(temporaryDirectory, `${framework}.browser.json`);
  const args = [
    browserRunnerPath,
    "--framework",
    framework,
    "--output",
    shardPath,
    ...(catalogArgument ? ["--catalog", resolve(repositoryRoot, catalogArgument)] : []),
  ];
  let stderr = "";
  const code = await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.resume();
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (exitCode, signal) => {
      if (signal)
        reject(new Error(`[${framework}] browser worker received ${signal}\n${stderr.trim()}`));
      else resolvePromise(exitCode);
    });
  });
  let shard;
  try {
    shard = JSON.parse(await readFile(shardPath, "utf8"));
  } catch (error) {
    throw new Error(
      `[${framework}] browser worker did not produce a readable report: ${
        error instanceof Error ? error.message : String(error)
      }\n${stderr.trim()}`,
    );
  }
  return { shard, code };
};

try {
  // Browser workers each own their own collector + browser. Run them
  // sequentially: concurrent Chromium instances (one per @web/test-runner)
  // contend for memory and the weaker frameworks lose their browser process.
  const reports = (
    await Promise.resolve(
      (async () => {
        const collected = [];
        for (const framework of frameworkIds) {
          collected.push(await runBrowserFramework(framework));
        }
        return collected;
      })(),
    )
  ).map(({ shard }) => shard);
  if (
    reports.some(
      (report) =>
        report.browser.name !== reports[0].browser.name ||
        report.browser.version !== reports[0].browser.version,
    )
  ) {
    throw new Error("Framework workers did not execute with the same browser runtime");
  }

  const results = reports.flatMap((report) => report.results);
  const evidence = reports.flatMap((report) => report.evidence);
  const executedFixtures = new Set(
    results.map((result) => `${result.framework}\0${result.fixtureId}`),
  );
  const expectedEvidenceCount = requiredFixtureCount * frameworkIds.length;
  const failures = [
    ...results
      .filter((result) => result.status !== "passing")
      .map((result) => `${result.framework}/${result.fixtureId}/${result.state}`),
    ...evidence.flatMap((entry) => [
      ...entry.errors.map((error) => `${entry.framework}: ${error}`),
      ...entry.unresolvedSelectors.map(
        (selector) => `${entry.framework}: unresolved selector ${selector}`,
      ),
    ]),
  ];
  const uniqueFailures = [...new Set(failures)].sort();
  const strictConformance =
    evidence.length === frameworkIds.length &&
    evidence.reduce((sum, entry) => sum + entry.fixtureResults.length, 0) ===
      expectedEvidenceCount &&
    executedFixtures.size === expectedEvidenceCount &&
    results.every((result) => result.status === "passing") &&
    evidence.every(
      (entry) =>
        entry.status === "passing" &&
        entry.fixtureResults.every((result) => result.status === "passing") &&
        entry.unresolvedSelectors.length === 0 &&
        entry.errors.length === 0,
    ) &&
    uniqueFailures.length === 0;
  const unresolvedSelectors = [...new Set(evidence.flatMap((entry) => entry.unresolvedSelectors))];
  const errata = [...new Set(evidence.flatMap((entry) => entry.errata))];
  const report = {
    schemaVersion: 1,
    reportType: "runtime-strict-evidence",
    runStartedAt: new Date(runStartedAt).toISOString(),
    generatedAt: new Date().toISOString(),
    upstream: catalog.upstream,
    browser: reports[0].browser,
    frameworkIds,
    frameworks: evidence,
    fixtureCount: expectedEvidenceCount,
    evidenceCount: expectedEvidenceCount,
    executableFixtureCount: requiredFixtureCount,
    executedFixtureCount: executedFixtures.size,
    stateCount: results.length,
    unresolvedCount: unresolvedSelectors.length,
    errataCount: errata.length,
    failures: uniqueFailures,
    results,
    evidence,
    strictConformance,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(temporaryOutputPath, `${JSON.stringify(report, null, 2)}\n`);
  await rename(temporaryOutputPath, outputPath);
  const passingStates = results.filter((result) => result.status === "passing").length;
  console.log(
    `Runtime conformance ${strictConformance ? "passed" : "failed"}: ${passingStates}/${results.length} states and ${executedFixtures.size}/${expectedEvidenceCount} executable framework fixtures.`,
  );
  if (!strictConformance) process.exitCode = 1;
} finally {
  await Promise.all([
    rm(temporaryDirectory, { recursive: true, force: true }),
    rm(temporaryOutputPath, { force: true }),
  ]);
}
