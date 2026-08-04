import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(docsRoot, "../..");
const publicRoot = resolve(docsRoot, "public");
const normalizedBase = `/${String(process.env.BASE_PATH ?? "")
  .split("/")
  .filter(Boolean)
  .join("/")}`.replace(/^\/$/, "");
const siteBase = normalizedBase ? `${normalizedBase}/` : "/";

/**
 * @param {string[]} args
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {Promise<void>}
 */
const run = (args, env = {}) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn("pnpm", args, {
      cwd: repositoryRoot,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`pnpm ${args.join(" ")} failed (${signal ?? code})`));
    });
  });

await run(["--filter", "@krds-community/conformance-host", "build"], {
  KRDS_CONFORMANCE_HOST_BASE: `${siteBase}host/`,
});
await run(["storybook:build"]);

await mkdir(publicRoot, { recursive: true });
for (const [source, destination] of [
  [resolve(repositoryRoot, "apps/conformance-host/dist"), resolve(publicRoot, "host")],
  [resolve(repositoryRoot, "storybook-static"), resolve(publicRoot, "storybook")],
]) {
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
}

console.log(`Prepared documentation previews for ${siteBase}`);
