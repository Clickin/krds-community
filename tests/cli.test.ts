import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  baseDependencies,
  detectPackageManager,
  extraDependencies,
  formatPackages,
  missingDependencies,
  requiredDependencies,
} from "../packages/cli/src/deps";

const root = resolve(import.meta.dirname, "..");
const cli = resolve(root, "packages/cli/dist/cli.mjs");
const execFileAsync = promisify(execFile);

beforeAll(async () => {
  await execFileAsync("pnpm", ["--filter", "@krds-community/krds-cli", "build"], {
    cwd: root,
    encoding: "utf8",
  });
}, 120_000);

describe("component CLI framework support", () => {
  it("lists Astro with the complete 74-component inventory + 3 extras", async () => {
    const { stdout } = await execFileAsync(process.execPath, [cli, "component", "list"], {
      cwd: root,
      encoding: "utf8",
    });

    expect(stdout).toContain("astro (74, extra 3)");
    expect(stdout).toContain("search-suggestions  [extra]");
    expect(stdout).toContain("validated-input  [extra]");
    expect(stdout).toContain("filterable-list  [extra]");
  });

  it("generates a native Astro component snippet with traceable metadata", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "astro"],
      { cwd: root, encoding: "utf8" },
    );

    expect(stdout).toContain("@krds-community/framework: astro");
    expect(stdout).toContain('<Button variant="primary">버튼</Button>');
  });

  it("copies the extra search-suggestions component with backend wiring snippet", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "search-suggestions", "--framework", "react"],
      { cwd: root, encoding: "utf8" },
    );

    expect(stdout).toContain("@krds-community/component: search-suggestions");
    expect(stdout).toContain("@krds-community/source-version: extra-1.0.0");
    expect(stdout).toContain("suggest={async (query)");
  });
});

describe("interactive mode and dependency install", () => {
  const tempDirs: string[] = [];
  const makeTempDir = async () => {
    const dir = await mkdtemp(join(tmpdir(), "krds-cli-"));
    tempDirs.push(dir);
    return dir;
  };
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("krds with no arguments prints help on a non-TTY", async () => {
    const { stdout } = await execFileAsync(process.execPath, [cli], {
      cwd: root,
      encoding: "utf8",
    });
    expect(stdout).toContain("Usage:");
  });

  it("krds component with no action prints help on a non-TTY", async () => {
    const { stdout } = await execFileAsync(process.execPath, [cli, "component"], {
      cwd: root,
      encoding: "utf8",
    });
    expect(stdout).toContain("Usage:");
  });

  it("default auto-install rejects without a lockfile or --package-manager", async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, "package.json"), "{}\n");
    const error = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "react", "--out", "out.tsx"],
      { cwd: dir, encoding: "utf8" },
    ).then(
      () => null,
      (error) => error,
    );
    expect(error).toBeTruthy();
    expect(error!.stderr).toContain("Cannot detect a package manager");
    expect(error!.stderr).toContain("--exclude-required-component");
  });

  it("default auto-install is a no-op when dependencies are already present", async () => {
    const dir = await makeTempDir();
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        dependencies: { "@krds-community/styles": "0.1.0", "@krds-community/recipes": "0.1.0" },
      }),
    );
    await writeFile(join(dir, "pnpm-lock.yaml"), "");
    const { stdout } = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "react", "--out", "out.tsx"],
      { cwd: dir, encoding: "utf8" },
    );
    expect(stdout).toContain("already installed");
    await expect(readFile(join(dir, "out.tsx"), "utf8")).resolves.toContain(
      "@krds-community/component: button",
    );
  });

  it("--exclude-required-component opts out of the install step", async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, "package.json"), "{}\n");
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        cli,
        "component",
        "copy",
        "button",
        "--framework",
        "react",
        "--out",
        "out.tsx",
        "--exclude-required-component",
      ],
      { cwd: dir, encoding: "utf8" },
    );
    expect(stdout).not.toContain("Installing");
    expect(stdout).not.toContain("already installed");
    await expect(readFile(join(dir, "out.tsx"), "utf8")).resolves.toContain(
      "@krds-community/component: button",
    );
  });

  it("--package-manager conflicts with --exclude-required-component", async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, "package.json"), "{}\n");
    const error = await execFileAsync(
      process.execPath,
      [
        cli,
        "component",
        "copy",
        "button",
        "--framework",
        "react",
        "--out",
        "out.tsx",
        "--package-manager",
        "pnpm",
        "--exclude-required-component",
      ],
      { cwd: dir, encoding: "utf8" },
    ).then(
      () => null,
      (error) => error,
    );
    expect(error).toBeTruthy();
    expect(error!.stderr).toContain(
      "--package-manager conflicts with --exclude-required-component.",
    );
  });

  it("rejects an unknown package manager", async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, "package.json"), "{}\n");
    const error = await execFileAsync(
      process.execPath,
      [
        cli,
        "component",
        "copy",
        "button",
        "--framework",
        "react",
        "--out",
        "out.tsx",
        "--package-manager",
        "bogus",
      ],
      { cwd: dir, encoding: "utf8" },
    ).then(
      () => null,
      (error) => error,
    );
    expect(error).toBeTruthy();
    expect(error!.stderr).toContain("Unknown package manager");
  });

  it("default auto-install spawns the detected package manager", async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, "package.json"), "{}\n");
    await writeFile(join(dir, "pnpm-lock.yaml"), "");
    // pnpm add may succeed (packages published) or fail (unpublished/offline); either outcome is
    // outside the code-under-test's control. Assert only up to the spawn point: the
    // "Installing … with pnpm" line is printed before the child process runs, so this verifies
    // the detect → spawn wiring end-to-end. If the post-spawn result ever needs pinning, assert
    // rejection with "Dependency install failed (pnpm)" when the registry lacks the packages.
    const [result, error] = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "react", "--out", "out.tsx"],
      { cwd: dir, encoding: "utf8" },
    ).then(
      (result) => [result, null],
      (error) => [null, error],
    );
    const stdout = String(result?.stdout ?? error?.stdout ?? "");
    expect(stdout).toContain(
      "Installing @krds-community/styles, @krds-community/recipes with pnpm",
    );
  });

  it("skips install when running inside the KRDS repository", async () => {
    const dir = await makeTempDir();
    await mkdir(join(dir, "conformance", "manifests"), { recursive: true });
    await writeFile(join(dir, "package.json"), "{}\n");
    const env = { ...process.env };
    delete env.KRDS_REPO_ROOT;
    const { stdout } = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "react", "--out", "out.tsx"],
      { cwd: dir, encoding: "utf8", env },
    );
    expect(stdout).toContain("workspace packages");
    await expect(readFile(join(dir, "out.tsx"), "utf8")).resolves.toContain(
      "@krds-community/component: button",
    );
  });

  it("detectPackageManager maps lockfiles to package managers", async () => {
    const cases: Array<[string, string]> = [
      ["pnpm-lock.yaml", "pnpm"],
      ["package-lock.json", "npm"],
      ["yarn.lock", "yarn"],
      ["bun.lockb", "bun"],
      ["deno.lock", "deno"],
    ];
    for (const [lockfile, manager] of cases) {
      const dir = await makeTempDir();
      await writeFile(join(dir, lockfile), "");
      await expect(detectPackageManager(dir)).resolves.toBe(manager);
    }
    const empty = await makeTempDir();
    await expect(detectPackageManager(empty)).resolves.toBeUndefined();
  });

  it("requiredDependencies includes the framework package only for extras", () => {
    expect(requiredDependencies("react", "official")).toEqual([
      "@krds-community/styles",
      "@krds-community/recipes",
    ]);
    expect(requiredDependencies("react", "extra")).toEqual([
      "@krds-community/react",
      "@krds-community/styles",
      "@krds-community/recipes",
    ]);
    expect(extraDependencies("vue")).toEqual(["@krds-community/vue"]);
    expect(baseDependencies).toEqual(["@krds-community/styles", "@krds-community/recipes"]);
  });

  it("missingDependencies checks all manifest dependency fields", async () => {
    const dir = await makeTempDir();
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        dependencies: { "@krds-community/styles": "0.1.0" },
        devDependencies: { "@krds-community/recipes": "0.1.0" },
      }),
    );
    await expect(
      missingDependencies(dir, ["@krds-community/styles", "@krds-community/recipes"]),
    ).resolves.toEqual([]);
    const withoutRecipes = await makeTempDir();
    await writeFile(
      join(withoutRecipes, "package.json"),
      JSON.stringify({ dependencies: { "@krds-community/styles": "0.1.0" } }),
    );
    await expect(missingDependencies(withoutRecipes, ["@krds-community/recipes"])).resolves.toEqual(
      ["@krds-community/recipes"],
    );
  });

  it("formatPackages prefixes npm: only for deno", () => {
    expect(formatPackages("deno", ["@krds-community/styles"])).toEqual([
      "npm:@krds-community/styles",
    ]);
    expect(formatPackages("pnpm", ["@krds-community/styles"])).toEqual(["@krds-community/styles"]);
  });
});
