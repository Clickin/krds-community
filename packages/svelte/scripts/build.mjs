import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(fileURLToPath(new URL("..", import.meta.url)));
const dist = join(root, "dist");
await mkdir(dist, { recursive: true });
for (const file of await readdir(join(root, "src"))) {
  if (
    file.endsWith(".svelte") ||
    file === "index.js" ||
    file === "index.d.ts" ||
    file === "extra.js" ||
    file === "extra.d.ts" ||
    file === "styles.css"
  )
    await copyFile(join(root, "src", file), join(dist, file));
}
// Copy lib directory for shared modules
try {
  const libDir = join(root, "src", "lib");
  const libDist = join(dist, "lib");
  await mkdir(libDist, { recursive: true });
  for (const libFile of await readdir(libDir)) {
    await copyFile(join(libDir, libFile), join(libDist, libFile));
  }
} catch {}
if (process.argv.includes("--check"))
  console.log("svelte sources are packaged without browser evaluation");
