import { spawn } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifests } from "../packages/conformance/dist/index.js";
import { startCollector, stopCollector, setConfig, getPayloads } from "./conformance/browser-collector.mjs";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const frameworkIds = ["react", "vue", "svelte", "solid", "angular"];
const packageSources = Object.fromEntries(
  frameworkIds.map((framework) => [
    framework,
    join(
      root,
      "packages",
      framework,
      "src",
      framework === "svelte" ? "index.js" : framework === "solid" ? "index.tsx" : "index.ts",
    ),
  ]),
);

const pascalCase = (value) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const unquote = (value) => value.trim().replace(/^['"]|['"]$/g, "");

const selectorTokens = (selector) => {
  const tokens = new Set();
  const tag = selector.match(/^[a-z][a-z0-9-]*/i)?.[0];
  if (tag) tokens.add(tag);
  for (const match of selector.matchAll(/[.#]([a-z][a-z0-9_-]*)/gi)) tokens.add(match[1]);
  for (const match of selector.matchAll(/\[([a-z][a-z0-9_-]*)(?:\s*[~|^$*]?=\s*([^\]]+))?\]/gi)) {
    tokens.add(match[1]);
    if (match[2]) tokens.add(unquote(match[2]));
  }
  return [...tokens].filter(Boolean);
};

const parseFixtureBlocks = (text) => {
  const fixturesText = text.split(/^fixtures:\s*$/m)[1]?.split(/^contract:\s*$/m)[0] ?? "";
  const matches = [...fixturesText.matchAll(/^ {2}- id:\s*([^\s]+)\s*$/gm)];
  return matches.map((match, index) => {
    const block = fixturesText.slice(match.index, matches[index + 1]?.index ?? fixturesText.length);
    const inlineStates = block.match(/^\s+states:\s*\[([^\]]*)\]/m)?.[1];
    const states = inlineStates
      ? inlineStates
          .split(",")
          .map((state) => state.trim())
          .filter(Boolean)
      : [...block.matchAll(/^ {6}- id:\s*([^\s]+)\s*$/gm)].map((state) => state[1]);
    return {
      id: match[1],
      sourceSelector: unquote(block.match(/^\s+sourceSelector:\s*(.+)$/m)?.[1] ?? ""),
      mandatory: /^\s+mandatory:\s*true\s*$/m.test(block),
      viewport: block.match(/^\s+viewport:\s*([^\s]+)\s*$/m)?.[1] ?? "",
      states,
    };
  });
};

const readFixtureData = async (manifest) => {
  const path = join(root, "conformance", "manifests", `${manifest.id}.yaml`);
  const text = await readFile(path, "utf8");
  return { text, fixtures: parseFixtureBlocks(text) };
};

const assertManifestContracts = async (manifests) => {
  const failures = [];
  const sourceCache = new Map();
  const referencedSources = new Set();
  const getSource = async (path) => {
    if (!sourceCache.has(path)) sourceCache.set(path, await readFile(path, "utf8"));
    return sourceCache.get(path);
  };

  for (const manifest of manifests) {
    const { text, fixtures } = await readFixtureData(manifest);
    if (manifest.status === "no-upstream") {
      if (manifest.fixtureCount !== 0) {
        failures.push(`${manifest.id}: no-upstream manifest must declare zero fixtures`);
      }
      if ((manifest.sourceFiles ?? []).length > 0) {
        failures.push(`${manifest.id}: no-upstream manifest must declare no upstream.files`);
      }
      if (!/^contract:\s*$/m.test(text) || !/^\s+semanticElement:\s*\S+/m.test(text)) {
        failures.push(`${manifest.id}: semantic contract is missing`);
      }
      if (!/^\s+accessibility:\s*\[/m.test(text)) {
        failures.push(`${manifest.id}: accessibility contract is missing`);
      }
      const componentName = pascalCase(manifest.id);
      for (const [framework, sourcePath] of Object.entries(packageSources)) {
        const source = await getSource(sourcePath);
        if (!source.includes(componentName)) {
          failures.push(`${manifest.id}: ${framework} export is missing (${componentName})`);
        }
      }
      continue;
    }
    if (manifest.status !== "passing") failures.push(`${manifest.id}: status=${manifest.status}`);
    if (manifest.schemaValid === false) {
      for (const error of manifest.validationErrors ?? []) {
        failures.push(`${manifest.id}: schema=${error}`);
      }
    }
    if (manifest.statusConsistent === false) {
      failures.push(`${manifest.id}: status is inconsistent with manifest evidence`);
    }
    for (const selector of manifest.unresolvedSelectors ?? []) {
      failures.push(`${manifest.id}: unresolved selector=${selector}`);
    }
    if (fixtures.length === 0) failures.push(`${manifest.id}: fixture is missing`);
    if (fixtures.some((fixture) => !fixture.mandatory)) {
      failures.push(`${manifest.id}: every fixture must be mandatory`);
    }
    if (
      fixtures.some(
        (fixture) => !fixture.sourceSelector || !fixture.viewport || !fixture.states.length,
      )
    ) {
      failures.push(`${manifest.id}: fixture contract is incomplete`);
    }
    if (!/^contract:\s*$/m.test(text) || !/^\s+semanticElement:\s*\S+/m.test(text)) {
      failures.push(`${manifest.id}: semantic contract is missing`);
    }
    if (!/^\s+accessibility:\s*\[/m.test(text)) {
      failures.push(`${manifest.id}: accessibility contract is missing`);
    }

    const upstreamFiles = [...text.matchAll(/^\s+- (upstream\/[^\n]+)$/gm)].map(
      (match) => match[1],
    );
    const upstreamText = [];
    upstreamFiles.forEach((relativePath) => referencedSources.add(relativePath));
    for (const relativePath of upstreamFiles) {
      const absolutePath = join(root, relativePath);
      try {
        upstreamText.push(await getSource(absolutePath));
      } catch {
        failures.push(`${manifest.id}: upstream source is missing: ${relativePath}`);
      }
    }
    const combinedSource = upstreamText.join("\n");
    for (const fixture of fixtures) {
      const missingSelectorToken = selectorTokens(fixture.sourceSelector).find(
        (token) => !combinedSource.includes(token),
      );
      if (missingSelectorToken) {
        failures.push(
          `${manifest.id}/${fixture.id}: sourceSelector not found upstream: ${fixture.sourceSelector}`,
        );
      }
    }

    const componentName = pascalCase(manifest.id);
    for (const [framework, sourcePath] of Object.entries(packageSources)) {
      const source = await getSource(sourcePath);
      if (!source.includes(componentName)) {
        failures.push(`${manifest.id}: ${framework} export is missing (${componentName})`);
      }
    }
  }
  const officialFixtureFiles = (await readdir(join(root, "upstream/krds-html/html/code")))
    .filter((entry) => entry.endsWith(".html"))
    .map((entry) => `upstream/krds-html/html/code/${entry}`);
  for (const source of officialFixtureFiles) {
    if (!referencedSources.has(source)) {
      failures.push(`official fixture is unmapped: ${source}`);
    }
  }
  return failures;
};

const findAxe = async () => {
  const candidates = [
    join(root, "node_modules", "axe-core", "axe.min.js"),
    join(root, "node_modules", ".pnpm", "node_modules", "axe-core", "axe.min.js"),
  ];
  for (const candidate of candidates) {
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // Continue through the package-manager layouts available in CI and local workspaces.
    }
  }
  throw new Error("axe-core is required for strict conformance checks");
};


// Runs the in-browser Storybook inventory audit via @web/test-runner + Chrome
// (no Playwright). The browser workers (tests/web-test-runner/storybook-audit.test.mjs)
// load each framework inventory in a same-origin iframe, run the rendering /
// accessibility / keyboard / axe / mobile-overflow checks, and POST findings to
// the HTTP collector. Node aggregates the collector payloads here.
const collectFixtureContracts = async (manifests) =>
  (
    await Promise.all(manifests.map(async (manifest) => (await readFixtureData(manifest)).fixtures))
  ).flat();

const checkRenderedInventories = async (manifests) => {
  const axeSource = await readFile(await findAxe(), "utf8");
  const fixtureContracts = await collectFixtureContracts(manifests);
  const failures = [];
  const fixtureFailures = Object.fromEntries(frameworkIds.map((framework) => [framework, {}]));
  const collectorHost = "127.0.0.1";
  const collectorPort = process.env.KRDS_BROWSER_COLLECTOR_PORT ?? "8123";
  const collectorBase = `http://${collectorHost}:${collectorPort}`;
  try {
    await startCollector();
    setConfig({
      fixtureContracts,
      manifestCount: manifests.length,
      axeContent: Buffer.from(axeSource, "utf8").toString("base64"),
    });
    const worker = resolve(root, "tests/web-test-runner/storybook-audit.test.mjs");
    let stderr = "";
    const wtrExit = await new Promise((resolvePromise, reject) => {
      const child = spawn(
        "pnpm",
        ["-w", "exec", "web-test-runner", "--files", worker],
        {
          cwd: root,
          env: {
            ...process.env,
            KRDS_BROWSER_COLLECTOR_PORT: collectorPort,
            VITE_STORYBOOK_COLLECTOR: collectorBase,
          },
          stdio: ["ignore", "inherit", "pipe"],
        },
      );
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.on("error", reject);
      child.on("close", (code, signal) => {
        if (signal) reject(new Error(`web-test-runner received ${signal}\n${stderr.trim()}`));
        else resolvePromise(code ?? 0);
      });
    });
    if (wtrExit !== 0) {
      throw new Error(`web-test-runner exited with ${wtrExit}\n${stderr.trim()}`);
    }
    const payloads = getPayloads();
    for (const payload of payloads) {
      if (payload?.kind !== "storybook-audit" || !payload.framework) continue;
      for (const message of payload.messages ?? []) {
        failures.push(message);
      }
    }
  } finally {
    await stopCollector().catch(() => {});
  }
  return { failures, fixtureFailures };
};


const main = async () => {
  const manifests = await loadManifests(join(root, "conformance", "manifests"));
  const manifestFailures = await assertManifestContracts(manifests);
  let runtimeFailures = [];
  try {
    runtimeFailures = (await checkRenderedInventories(manifests)).failures;
  } catch (error) {
    runtimeFailures = [`runtime: ${error instanceof Error ? error.message : String(error)}`];
  }
  const failures = [...manifestFailures, ...runtimeFailures].sort();
  if (failures.length) {
    console.error(`Storybook inventory audit failed (${failures.length} findings):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Storybook inventory audit passed for ${manifests.length} manifests across ${frameworkIds.length} frameworks.`,
  );
};

await main();
