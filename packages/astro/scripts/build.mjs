import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = join(root, "src");
const destination = join(root, "dist");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const name of await readdir(source)) {
  if (/\.(?:astro|css|js|ts)$/.test(name)) {
    await cp(join(source, name), join(destination, name));
  }
}
