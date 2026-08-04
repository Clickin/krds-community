#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildReport,
  frameworks,
  loadManifests,
  readEvidence,
  toHtml,
  toJUnit,
  toMarkdown,
  writeReport,
  type Framework,
} from "./index.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const lock = JSON.parse(
  await readFile(join(packageRoot, "upstream/upstream.lock.json"), "utf8"),
) as {
  repository: string;
  ref: string;
  commit: string;
  packageVersion: string;
};
const manifestFlagIndex = process.argv.indexOf("--manifests");
const manifestArgument =
  manifestFlagIndex >= 0 ? process.argv[manifestFlagIndex + 1] : undefined;
const manifests = await loadManifests(
  resolve(packageRoot, manifestArgument ?? "conformance/manifests"),
);
const prefixFlagIndex = process.argv.indexOf("--prefix");
const reportPrefix =
  prefixFlagIndex >= 0 ? process.argv[prefixFlagIndex + 1] ?? "conformance" : "conformance";
const evidenceFlagIndex = process.argv.indexOf("--evidence");
const evidencePath =
  evidenceFlagIndex >= 0
    ? process.argv[evidenceFlagIndex + 1]
      ? resolve(packageRoot, process.argv[evidenceFlagIndex + 1]!)
      : undefined
    : undefined;
if (evidenceFlagIndex >= 0 && !evidencePath) {
  throw new Error("--evidence requires a deterministic runtime evidence JSON path");
}
const evidence = evidencePath ? await readEvidence(evidencePath) : undefined;
const report = buildReport(
  manifests,
  {
    repository: lock.repository,
    ref: lock.ref,
    commit: lock.commit,
    packageVersion: lock.packageVersion,
  },
  evidence,
);

const command = process.argv[2] ?? "report";
const strictRequested = process.argv.includes("--strict");
const requested =
  process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : undefined;
const framework = requested && frameworks.includes(requested as Framework) ? requested : undefined;
if (command === "inventory") {
  console.log(
    JSON.stringify(
      { reportType: "catalog", upstream: report.upstream, manifests: report.manifests },
      null,
      2,
    ),
  );
} else if (command === "check") {
  const selected = framework
    ? report.frameworks.filter((summary) => summary.framework === framework)
    : report.frameworks;
  console.log(
    JSON.stringify(
      {
        reportType: report.reportType,
        upstream: report.upstream,
        frameworks: selected,
        strictConformance: report.strictConformance,
        fixtureCount: report.fixtureCount,
        evidenceCount: report.evidenceCount,
        unresolvedCount: report.unresolvedCount,
        errataCount: report.errataCount,
      },
      null,
      2,
    ),
  );
  if (strictRequested && !report.strictConformance) process.exitCode = 1;
} else if (command === "diff-upstream") {
  console.log(
    JSON.stringify(
      { command: "pnpm upstream:diff", report: "reports/upstream-diff.json" },
      null,
      2,
    ),
  );
} else if (command === "report") {
  const formatFlagIndex = process.argv.indexOf("--format");
  const format = formatFlagIndex >= 0 ? process.argv[formatFlagIndex + 1] : "json";
  if (format === "markdown") console.log(toMarkdown(report));
  else if (format === "junit") console.log(toJUnit(report));
  else if (format === "html") console.log(toHtml(report));
  else console.log(JSON.stringify(report, null, 2));
  await writeReport(report, join(packageRoot, "reports"), reportPrefix);
} else {
  throw new Error(
    `Unknown command ${command}. Use inventory, check [--strict], diff-upstream, or report [--evidence <path>].`,
  );
}
