import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(docsRoot, "../..");
const astro = join(
  docsRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "astro.cmd" : "astro",
);

// Copy storybook-static and conformance host files into public/ so Astro
// serves them as static assets in dev mode (no proxy needed).
const prepare = spawn(process.execPath, [resolve(docsRoot, "scripts", "prepare-previews.mjs")], {
  cwd: repositoryRoot,
  stdio: "inherit",
});

const prepareExit = await new Promise((resolve) => {
  prepare.once("exit", (code) => resolve(code));
});

if (prepareExit !== 0) {
  throw new Error(`prepare-previews exited with ${prepareExit}`);
}

const astroDev = spawn(astro, ["dev", "--host", "0.0.0.0"], {
  cwd: docsRoot,
  env: process.env,
  stdio: "inherit",
});

let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  astroDev.kill("SIGTERM");
};

process.once("SIGINT", stop);
process.once("SIGTERM", stop);

const result = await new Promise((resolve) => {
  astroDev.once("error", (error) => resolve({ error }));
  astroDev.once("exit", (code, signal) => resolve({ code, signal }));
});

const interrupted = stopping;
stop();
if ("error" in result) throw result.error;
if (!interrupted && result.code !== 0) {
  throw new Error(`Astro dev exited with ${result.signal ?? result.code}.`);
}
