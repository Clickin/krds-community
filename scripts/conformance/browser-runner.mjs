// Node orchestration for the in-browser (@web/test-runner + vite) conformance
// capture + judgment path.
//
// The browser workers (tests/web-test-runner/conformance-wtr-*.test.mjs) render
// the upstream fixture HTML and the framework component inside the browser, run
// the comparison/assertion (browser-judge.mjs: compareDom, visual signature,
// form, contract, accessibility, behavior) in-browser, and POST only the small
// `checks` verdicts to a local HTTP collector. This module spawns
// web-test-runner, pre-compiles the conformance errata for the workers to
// apply, reads the collector, and assembles a report with the same schema the
// Playwright path produced. No capture snapshots cross into Node.

import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { setConfig, startCollector, stopCollector } from "./browser-collector.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const frameworkIds = ["react", "vue", "svelte", "solid", "angular", "astro"];
const requiredChecks = ["render", "dom", "accessibility", "behavior", "form", "visual", "contract"];

const arguments_ = process.argv.slice(2);
const option = (name) => {
  const index = arguments_.indexOf(name);
  if (index === -1 || !arguments_[index + 1]) return undefined;
  const value = arguments_[index + 1];
  arguments_.splice(index, 2);
  return value;
};
let outputArgument = option("--output");
let catalogArgument = option("--catalog");
let frameworkArgument = option("--framework");
for (const argument of arguments_) {
  throw new Error(`Unsupported browser conformance option: ${argument}`);
}
if (frameworkArgument && !frameworkIds.includes(frameworkArgument)) {
  throw new Error(`Unknown framework: ${frameworkArgument}`);
}
const activeFrameworks = frameworkArgument ? [frameworkArgument] : frameworkIds;

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
const fixtureById = new Map(catalog.fixtures.map((fixture) => [fixture.id, fixture]));

const ownsCollector = process.env.KRDS_BROWSER_COLLECTOR_OWNER !== "0";
if (ownsCollector) await startCollector();

// Pre-compile the conformance errata so the browser workers can apply the
// upstream normalization rules (e.g. hidden-vs-collapse accordion panels)
// without a YAML parser in-browser.
{
  const errataDirectory = resolve(repositoryRoot, "conformance/errata");
  const errataEntries = new Map();
  for (const name of await readdir(errataDirectory)) {
    if (!name.endsWith(".yaml")) continue;
    const erratum = parseYaml(await readFile(resolve(errataDirectory, name), "utf8"));
    errataEntries.set(erratum.id, erratum);
  }
  const byFixture = new Map();
  for (const fixture of catalog.fixtures) {
    const rules = [];
    for (const id of fixture.errata ?? []) {
      const erratum = errataEntries.get(id);
      if (!erratum || !Array.isArray(erratum.fixtures) || !erratum.fixtures.includes(fixture.id)) {
        continue;
      }
      rules.push(...(erratum.normalization?.whitelist ?? []));
    }
    if (rules.length) byFixture.set(fixture.id, rules);
  }
  await setConfig({ errata: Object.fromEntries(byFixture) });
}

let wtrStderr = "";
let wtrExit;
let collectorPayloads;
try {
  wtrExit = await new Promise((resolvePromise, reject) => {
    const wtrArgs = [resolve(repositoryRoot, "node_modules/@web/test-runner/dist/bin.js")];
    if (frameworkArgument) {
      wtrArgs.push("--files", `tests/web-test-runner/conformance-wtr-${frameworkArgument}.test.mjs`);
    }
    const child = spawn(process.execPath, wtrArgs, {
        cwd: repositoryRoot,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    child.stdout.resume();
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      wtrStderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (signal) reject(new Error(`web-test-runner received ${signal}\n${wtrStderr.trim()}`));
      else resolvePromise(code);
    });
  });
  // Fetch captures while the collector is still accepting connections.
  collectorPayloads = await fetch("http://127.0.0.1:8123/dump").then((response) =>
    response.json(),
  );
} finally {
  if (ownsCollector) await stopCollector();
}

// ---- captures were POSTed to the local collector by the browser workers ----
const fixturesByFramework = new Map(activeFrameworks.map((framework) => [framework, new Map()]));
for (const payload of collectorPayloads ?? []) {
  const byFixture = fixturesByFramework.get(payload.framework);
  if (byFixture) byFixture.set(payload.fixtureId, payload.results ?? []);
}

const evidenceSource = "scripts/conformance/browser-runner.mjs";
const results = [];

// The browser worker already ran the judgment (dom/form/visual/contract +
// deferred accessibility/behavior) via browser-judge.mjs and shipped the small
// `checks` verdicts. Node only assembles the report here.
for (const framework of activeFrameworks) {
  if (framework === "astro") continue; // SSG output capture is deferred.
  const byFixture = fixturesByFramework.get(framework);
  if (!byFixture) continue;
  for (const [fixtureId, records] of byFixture) {
    const fixture = fixtureById.get(fixtureId);
    if (!fixture) continue;
    for (const record of records) {
      const checks = record.checks;
      if (!checks) {
        results.push({
          fixtureId,
          componentId: record.componentId,
          framework,
          state: record.state,
          status: "failing",
          checks: {
            render: { passed: false, errors: ["no browser verdict produced"] },
            dom: { passed: false, errors: ["no browser verdict produced"] },
            accessibility: { passed: false, errors: ["no browser verdict produced"] },
            behavior: { passed: false, errors: ["no browser verdict produced"], events: [] },
            form: { passed: false, errors: ["no browser verdict produced"] },
            visual: { passed: false, errors: ["no browser verdict produced"] },
            contract: { passed: false, errors: ["no browser verdict produced"] },
          },
        });
        continue;
      }
      const checksPass = requiredChecks.every((check) => checks[check]?.passed === true);
      results.push({
        fixtureId,
        componentId: record.componentId,
        framework,
        state: record.state,
        status: checksPass ? "passing" : "failing",
        checks,
      });
    }
  }
}

const frameworkEvidence = activeFrameworks
  .filter((framework) => framework !== "astro")
  .map((framework) => {
    const frameworkResults = results.filter((result) => result.framework === framework);
    const fixtureResults = [...fixtureById.values()].map((fixture) => {
      const states = frameworkResults.filter((result) => result.fixtureId === fixture.id);
      const errors = states
        .filter((state) => state.status !== "passing")
        .map(
          (state) =>
            `${state.state}: ${Object.entries(state.checks)
              .filter(([, check]) => check.passed === false)
              .map(([name]) => name)
              .join(", ")}`,
        );
      return {
        fixtureId: fixture.id,
        status: errors.length ? "failing" : "passing",
        ...(errors.length ? { errors } : {}),
      };
    });
    const errors = fixtureResults.flatMap((result) => result.errors ?? []);
    return {
      framework,
      status: errors.length ? "failing" : "passing",
      fixtureResults,
      unresolvedSelectors: [],
      errata: [],
      errors,
      source: evidenceSource,
    };
  });

const strictConformance =
  results.every((result) => result.status === "passing") &&
  frameworkEvidence.every((entry) => entry.status === "passing");
const report = {
  schemaVersion: 1,
  reportType: "runtime-strict-evidence-browser",
  runStartedAt: new Date(runStartedAt).toISOString(),
  generatedAt: new Date().toISOString(),
  upstream: catalog.upstream,
  browser: { name: "chromium", version: "in-browser" },
  frameworkIds,
  frameworks: frameworkEvidence,
  fixtureCount: results.length,
  stateCount: results.length,
  results,
  evidence: frameworkEvidence,
  strictConformance,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(temporaryOutputPath, `${JSON.stringify(report, null, 2)}\n`);
await rename(temporaryOutputPath, outputPath);
if (wtrExit !== 0) {
  throw new Error(`web-test-runner exited with ${wtrExit}\n${wtrStderr.trim()}`);
}
const passingStates = results.filter((result) => result.status === "passing").length;
console.log(
  `Browser conformance ${strictConformance ? "passed" : "failed"}: ${passingStates}/${results.length} states.`,
);
if (!strictConformance) process.exitCode = 1;

