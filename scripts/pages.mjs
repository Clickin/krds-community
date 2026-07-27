import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const docsDist = join(root, 'apps/docs/dist');
const storybookDist = join(root, 'storybook-static');
const conformanceViewerDist = join(root, 'apps/conformance-viewer/dist');
const pagesStorybook = join(docsDist, 'storybook');
const pagesConformanceReport = join(docsDist, 'conformance-report');

await Promise.all([
  rm(pagesStorybook, { recursive: true, force: true }),
  rm(pagesConformanceReport, { recursive: true, force: true }),
]);
await Promise.all([
  mkdir(pagesStorybook, { recursive: true }),
  mkdir(pagesConformanceReport, { recursive: true }),
]);
await Promise.all([
  cp(storybookDist, pagesStorybook, { recursive: true }),
  cp(conformanceViewerDist, pagesConformanceReport, { recursive: true }),
]);
console.log(`Copied Storybook portal to ${pagesStorybook}.`);
console.log(`Copied runtime conformance dashboard to ${pagesConformanceReport}.`);
