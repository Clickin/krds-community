import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';

const source = '../../reports/conformance-runtime.json';
const destination = 'public/reports/conformance-runtime.json';
const report = JSON.parse(await readFile(source, 'utf8'));
const frameworkEvidence =
  Array.isArray(report.frameworks) &&
  report.frameworks.length > 0 &&
  report.frameworks.every(
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      typeof entry.framework === 'string' &&
      Array.isArray(entry.fixtureResults),
  )
    ? report.frameworks
    : report.evidence;

if (
  typeof report.generatedAt !== 'string' ||
  typeof report.strictConformance !== 'boolean' ||
  !report.browser ||
  typeof report.upstream?.commit !== 'string' ||
  !Array.isArray(report.results) ||
  report.results.length === 0 ||
  !Array.isArray(frameworkEvidence) ||
  frameworkEvidence.length === 0
) {
  throw new Error(
    `${source} is not a detailed runtime evidence report; refusing to publish catalog-only status.`,
  );
}

await rm('public/reports', { recursive: true, force: true });
await mkdir('public/reports', { recursive: true });
await copyFile(source, destination);
console.log(`Copied runtime evidence report to ${destination}.`);
