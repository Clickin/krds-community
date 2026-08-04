import { cp, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("..", import.meta.url).pathname;
const packagesRoot = join(root, "packages");
for (const entry of await readdir(packagesRoot)) {
  const directory = join(packagesRoot, entry);
  try {
    if (!(await stat(directory)).isDirectory()) continue;
  } catch {
    continue;
  }
  try {
    await stat(join(directory, "dist"));
  } catch {
    continue;
  }
  await cp(join(root, "LICENSE"), join(directory, "dist/LICENSE"));
  await cp(join(root, "NOTICE"), join(directory, "dist/NOTICE"));
}
