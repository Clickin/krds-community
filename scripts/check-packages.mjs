import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packagesRoot = join(root, "packages");
const entries = (await readdir(packagesRoot)).sort();
const failures = [];
const packageNames = new Set();
let checkedPackages = 0;

const requireFile = async (path, label) => {
  try {
    const details = await stat(path);
    if (!details.isFile()) failures.push(`${label}: expected a file`);
  } catch {
    failures.push(`${label}: file is missing`);
  }
};

// Solid libraries conventionally ship source (consumers compile via the solid
// Vite plugin); the prebuilt dist would embed client-only `delegateEvents`
// module calls that break SSR consumers (e.g. Astro docs prerender).
const sourceExportPackages = new Set(["@krds-community/solid"]);

const checkPublishTarget = async (directory, target, label, allowSource = false) => {
  if (typeof target === "string" && target.includes("*")) {
    const separator = target.lastIndexOf("/");
    const directoryTarget = separator >= 0 ? target.slice(0, separator) : ".";
    const filePattern = separator >= 0 ? target.slice(separator + 1) : target;
    const pattern = new RegExp(
      `^${filePattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`,
    );
    try {
      const entries = await readdir(join(directory, directoryTarget));
      if (!entries.some((entry) => pattern.test(entry))) {
        failures.push(`${label}: wildcard target has no matching files (${target})`);
      }
    } catch {
      failures.push(`${label}: wildcard target directory is missing (${target})`);
    }
    return;
  }
  if (typeof target === "string") {
    if (allowSource && target.startsWith("./src/")) {
      await requireFile(join(directory, target), `${label} -> ${target}`);
      return;
    }
    if (!target.startsWith("./dist/")) {
      failures.push(`${label}: publish target must be inside ./dist (${target})`);
      return;
    }
    await requireFile(join(directory, target), `${label} -> ${target}`);
    return;
  }
  if (Array.isArray(target)) {
    if (target.length === 0) failures.push(`${label}: fallback target list is empty`);
    for (const [index, candidate] of target.entries()) {
      await checkPublishTarget(directory, candidate, `${label}[${index}]`, allowSource);
    }
    return;
  }
  if (target && typeof target === "object") {
    const conditions = Object.entries(target);
    if (conditions.length === 0) failures.push(`${label}: conditional target is empty`);
    for (const [condition, candidate] of conditions) {
      await checkPublishTarget(directory, candidate, `${label}.${condition}`, allowSource);
    }
    return;
  }
  failures.push(`${label}: publish target is invalid`);
};

for (const entry of entries) {
  const directory = join(packagesRoot, entry);
  if (!(await stat(directory)).isDirectory()) continue;
  checkedPackages += 1;
  let packageJson;
  try {
    packageJson = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
  } catch (error) {
    failures.push(
      `${entry}: package.json is unreadable (${error instanceof Error ? error.message : String(error)})`,
    );
    continue;
  }

  if (!packageJson.name?.startsWith("@krds-community/")) {
    failures.push(`${entry}: invalid package name`);
  } else if (packageNames.has(packageJson.name)) {
    failures.push(`${entry}: duplicate package name ${packageJson.name}`);
  } else {
    packageNames.add(packageJson.name);
  }
  if (packageJson.private) failures.push(`${entry}: packages/* must be publishable, not private`);
  if (packageJson.license !== "Apache-2.0")
    failures.push(`${entry}: Apache-2.0 license is required`);
  if (!packageJson.scripts?.build) failures.push(`${entry}: build script is required`);
  if (!Array.isArray(packageJson.files) || !packageJson.files.includes("dist")) {
    failures.push(`${entry}: published files must include dist`);
  }

  for (const file of ["LICENSE", "NOTICE"]) {
    await requireFile(join(directory, "dist", file), `${entry}: dist/${file}`);
  }
  if (!packageJson.exports) {
    failures.push(`${entry}: exports is missing`);
  } else {
    await checkPublishTarget(
      directory,
      packageJson.exports,
      `${entry}: exports`,
      sourceExportPackages.has(packageJson.name),
    );
  }

  if (packageJson.bin) {
    const bins =
      typeof packageJson.bin === "string"
        ? { [packageJson.name.split("/").at(-1)]: packageJson.bin }
        : packageJson.bin;
    for (const [name, target] of Object.entries(bins)) {
      await checkPublishTarget(directory, target, `${entry}: bin[${name}]`);
    }
  }
}

if (checkedPackages === 0) failures.push("No publishable package directories were checked");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${checkedPackages} publishable workspace packages and every exported/bin artifact.`,
  );
}
