import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const workspace = parse(await readFile(join(root, "pnpm-workspace.yaml"), "utf8"));
const catalog = workspace.catalog ?? {};
const manifestPaths = [
  join(root, "package.json"),
  ...(await collectWorkspaceManifests("packages")),
  ...(await collectWorkspaceManifests("apps")),
];
const failures = [];
const references = new Set();

if (await hasRootCatalogDefinition()) {
  failures.push(
    "package.json must not define catalog or catalogs; pnpm-workspace.yaml is the sole catalog authority",
  );
}

for (const manifestPath of manifestPaths) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const section of [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
  ]) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      const label = `${manifestPath}:${section}:${name}`;
      if (version === "catalog:") {
        references.add(name);
        if (!(name in catalog)) failures.push(`${label} references an undefined catalog entry`);
        continue;
      }
      if (name in catalog) {
        failures.push(`${label} must use catalog: for a centralized dependency`);
        continue;
      }
      if (section === "peerDependencies") continue;
      if (name.startsWith("@krds-community/")) {
        if (!version.startsWith("workspace:")) {
          failures.push(`${label} must use workspace: for an internal package`);
        }
      }
    }
  }
}

for (const name of Object.keys(catalog)) {
  if (!references.has(name)) failures.push(`catalog entry ${name} is unused`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Catalog policy passed: ${Object.keys(catalog).length} entries, ${references.size} references, ${manifestPaths.length} manifests.`,
  );
}

async function collectWorkspaceManifests(scope) {
  const entries = await readdir(join(root, scope), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, scope, entry.name, "package.json"));
}

async function hasRootCatalogDefinition() {
  const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  return "catalog" in manifest || "catalogs" in manifest;
}
