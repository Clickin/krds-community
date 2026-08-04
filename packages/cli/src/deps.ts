import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export const packageManagers = ["pnpm", "npm", "yarn", "bun", "deno"];
export const baseDependencies = ["@krds-community/styles", "@krds-community/recipes"];
export const extraDependencies = (framework: string): string[] => [`@krds-community/${framework}`];
export const requiredDependencies = (framework: string, kind: string): string[] =>
  kind === "extra" ? [...extraDependencies(framework), ...baseDependencies] : baseDependencies;
export const formatPackages = (manager: string, packages: string[]): string[] =>
  manager === "deno" ? packages.map((pkg) => `npm:${pkg}`) : packages;

const canRead = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const findProjectRoot = async (startDir: string): Promise<string | undefined> => {
  let current = resolve(startDir);
  for (;;) {
    if (await canRead(join(current, "package.json"))) return current;
    const parent = dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
};

export const detectPackageManager = async (projectRoot: string): Promise<string | undefined> => {
  const lockfiles: Array<[string, string]> = [
    ["pnpm-lock.yaml", "pnpm"],
    ["package-lock.json", "npm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
    ["bun.lock", "bun"],
    ["deno.lock", "deno"],
  ];
  for (const [file, manager] of lockfiles) {
    if (await canRead(join(projectRoot, file))) return manager;
  }
  return undefined;
};

type Manifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

export const missingDependencies = async (
  projectRoot: string,
  packages: string[],
): Promise<string[]> => {
  const raw = await readFile(join(projectRoot, "package.json"), "utf8");
  let manifest: Manifest;
  try {
    manifest = JSON.parse(raw) as Manifest;
  } catch (error) {
    throw new Error(
      `Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const present = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
    ...Object.keys(manifest.optionalDependencies ?? {}),
  ]);
  return packages.filter((pkg) => !present.has(pkg));
};

const installVerbs: Record<string, string> = {
  pnpm: "add",
  npm: "install",
  yarn: "add",
  bun: "add",
  deno: "add",
};

export const installDependencies = async (args: {
  projectRoot: string;
  packages: string[];
  manager: string;
}): Promise<void> => {
  const verb = installVerbs[args.manager]!;
  execFileSync(args.manager, [verb, ...formatPackages(args.manager, args.packages)], {
    cwd: args.projectRoot,
    stdio: "inherit",
  });
};
