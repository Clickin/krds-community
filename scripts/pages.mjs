import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const docsDist = join(root, "apps/docs/dist");
const storybookDist = join(root, "storybook-static");
const pagesStorybook = join(docsDist, "storybook");

await rm(pagesStorybook, { recursive: true, force: true });
await mkdir(pagesStorybook, { recursive: true });
await cp(storybookDist, pagesStorybook, { recursive: true });
console.log(`Copied Storybook portal to ${pagesStorybook}.`);
