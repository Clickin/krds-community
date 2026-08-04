import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
await mkdir(join(root, "dist"), { recursive: true });
await copyFile(join(root, "src/krds.css"), join(root, "dist/krds.css"));
await copyFile(join(root, "src/provenance.json"), join(root, "dist/provenance.json"));
