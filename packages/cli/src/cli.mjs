#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

export const frameworks = ["react", "vue", "svelte", "solid", "angular", "astro"];
const DEFAULT_SOURCE_VERSION = "1.1.0";
const PACKAGE_ROOT = resolve(fileURLToPath(new URL("../../../", import.meta.url)));

// This fallback keeps the packaged binary useful outside of the monorepo. The
// normal path is generated from conformance/manifests at runtime.
const fallbackComponents = [
  "accordion",
  "accordion-line",
  "badge",
  "badge-number",
  "badge-size",
  "breadcrumb",
  "button",
  "button-hierarchy",
  "button-icon",
  "button-size",
  "button-text",
  "button-with-icon",
  "calendar",
  "calendar-range",
  "carousel",
  "carousel-banner",
  "checkbox",
  "checkbox-chip",
  "checkbox-size",
  "coach-mark",
  "contextual-help",
  "critical-alerts",
  "date-input",
  "disclosure",
  "favicon",
  "file-upload",
  "footer",
  "header",
  "help-panel",
  "identifier",
  "in-page-navigation",
  "language-switcher",
  "language-switcher-page",
  "link",
  "main-menu-mobile",
  "main-menu-pc",
  "masthead",
  "modal",
  "modal-sample",
  "pagination",
  "radio",
  "radio-button",
  "radio-chip",
  "radio-size",
  "resize",
  "select",
  "select-size",
  "select-sorting",
  "select-state",
  "side-navigation",
  "skip-link",
  "spinner",
  "step-indicator",
  "structured-list",
  "structured-list-table",
  "switch",
  "tab",
  "table",
  "tag",
  "tag-link",
  "text-input",
  "text-input-icon",
  "text-input-size",
  "text-input-state",
  "text-list",
  "text-list-ordered",
  "textarea",
  "toggle-switch",
  "toggle-switch-size",
  "tooltip",
  "tooltip-box",
  "tooltip-vertical",
  "tts",
  "tts-icon",
  "tts-size",
  "tutorial-panel",
];

const fallbackSourceFiles = {
  accordion: [
    "upstream/krds-html/html/code/accordion.html",
    "upstream/krds-html/html/code/accordion_line.html",
  ],
  radio: [
    "upstream/krds-html/html/code/radio_button.html",
    "upstream/krds-html/html/code/radio_size.html",
  ],
  switch: ["upstream/krds-html/html/code/toggle_switch.html"],
};

const fallbackEntry = (id) => ({
  id,
  sourceVersion: DEFAULT_SOURCE_VERSION,
  sourceFiles: fallbackSourceFiles[id] ?? [
    `upstream/krds-html/html/code/${id.replaceAll("-", "_")}.html`,
  ],
});
const legacySnippets = {
  react: {
    button: '<Button variant="primary">버튼</Button>',
    "text-input": '<TextInput label="레이블" hint="도움말" />',
    checkbox: '<Checkbox label="선택" name="choice" />',
    radio: '<Radio label="선택" name="choice" value="one" />',
    switch: '<Switch label="사용" name="enabled" />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  vue: {
    button: '<KrdsButton variant="primary">버튼</KrdsButton>',
    "text-input": '<KrdsTextInput v-model="value" label="레이블" hint="도움말" />',
    checkbox: '<KrdsCheckbox v-model="checked" label="선택" />',
    radio: '<KrdsRadio v-model="selected" name="choice" value="one" label="선택" />',
    switch: '<KrdsSwitch v-model="enabled" label="사용" />',
    accordion: "<KrdsAccordion :items=\"[{ id: 'one', title: '제목', content: '내용' }]\" />",
  },
  svelte: {
    button: '<Button variant="primary">버튼</Button>',
    "text-input": '<TextInput label="레이블" hint="도움말" bind:value />',
    checkbox: '<Checkbox label="선택" bind:checked />',
    radio: '<Radio label="선택" name="choice" value="one" bind:checked />',
    switch: '<Switch label="사용" bind:checked />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  solid: {
    button: '<Button variant="primary">버튼</Button>',
    "text-input": '<TextInput label="레이블" hint="도움말" />',
    checkbox: '<Checkbox label="선택" />',
    radio: '<Radio label="선택" name="choice" value="one" />',
    switch: '<Switch label="사용" />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  astro: {
    button: '<Button variant="primary">버튼</Button>',
    "text-input": '<TextInput label="레이블" hint="도움말" />',
    checkbox: '<Checkbox label="선택" />',
    radio: '<Radio label="선택" name="choice" value="one" />',
    switch: '<Switch label="사용" />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  angular: {
    button: '<krds-button variant="primary">버튼</krds-button>',
    "text-input": '<krds-text-input label="레이블" hint="도움말" />',
    checkbox: '<krds-checkbox label="선택" />',
    radio: '<krds-radio label="선택" name="choice" value="one" />',
    switch: '<krds-switch label="사용" />',
    accordion: "<krds-accordion [items]=\"[{ id: 'one', title: '제목', content: '내용' }]\" />",
  },
};

const readClipboard = () => {
  try {
    return execFileSync("pbpaste", { encoding: "utf8" });
  } catch {
    return "";
  }
};

const writeClipboard = (value) => {
  try {
    execFileSync("pbcopy", { input: value });
    return true;
  } catch {
    return false;
  }
};

const normalizeContent = (value) => String(value).replace(/\r\n?/g, "\n");

export const hashContent = (value) =>
  createHash("sha256").update(normalizeContent(value), "utf8").digest("hex");

const stripYamlValue = (value) => value.trim().replace(/^['"]|['"]$/g, "");

const parseManifest = (id, content) => {
  const upstreamSection =
    content.match(/^upstream:[ \t]*\n?([\s\S]*?)(?=^errata:|^fixtures:|^contract:)/m)?.[1] ?? "";
  const version = upstreamSection.match(/^[ \t]+version:[ \t]*(.+)$/m)?.[1];
  const sourceFiles = [...upstreamSection.matchAll(/^[ \t]+-[ \t]+(.+)$/gm)].map((match) =>
    stripYamlValue(match[1]),
  );
  return {
    id,
    sourceVersion: stripYamlValue(version ?? DEFAULT_SOURCE_VERSION),
    sourceFiles,
  };
};

const canRead = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const findRepositoryRoot = async () => {
  const candidates = [process.env.KRDS_REPO_ROOT, process.cwd(), PACKAGE_ROOT].filter(Boolean);
  for (const candidate of new Set(candidates.map((path) => resolve(path)))) {
    if (await canRead(join(candidate, "conformance", "manifests"))) return candidate;
  }
  return undefined;
};

export const loadComponentInventory = async (root = undefined) => {
  const repositoryRoot = root ? resolve(root) : await findRepositoryRoot();
  if (!repositoryRoot) {
    return fallbackComponents.map(fallbackEntry);
  }

  const manifestDirectory = join(repositoryRoot, "conformance", "manifests");
  const files = (await readdir(manifestDirectory)).filter((file) => file.endsWith(".yaml"));
  const manifests = [];
  for (const file of files) {
    const id = basename(file, ".yaml");
    manifests.push(parseManifest(id, await readFile(join(manifestDirectory, file), "utf8")));
  }
  if (!manifests.length) {
    return fallbackComponents.map(fallbackEntry);
  }
  return manifests.sort((left, right) => left.id.localeCompare(right.id));
};

const pascalCase = (id) =>
  id
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

const angularTag = (id) => `krds-${id}`;

const generatedSnippet = (component, framework) => {
  const name = pascalCase(component);
  if (legacySnippets[framework]?.[component]) return legacySnippets[framework][component];
  switch (framework) {
    case "react":
    case "vue":
    case "svelte":
    case "solid":
    case "astro":
      return `<${name} />`;
    case "angular":
      return `<${angularTag(component)}></${angularTag(component)}>`;
    default:
      return `<${name} />`;
  }
};

const readCanonicalSource = async (entry, repositoryRoot) => {
  const sourceFiles = entry.sourceFiles.length
    ? entry.sourceFiles
    : [`upstream/krds-html/html/code/${entry.id.replaceAll("-", "_")}.html`];
  const chunks = [];
  for (const sourceFile of sourceFiles) {
    const sourcePath = repositoryRoot ? join(repositoryRoot, sourceFile) : undefined;
    const source =
      sourcePath && (await canRead(sourcePath)) ? await readFile(sourcePath, "utf8") : "";
    chunks.push(`--- ${sourceFile}\n${normalizeContent(source)}`);
  }
  return { sourceFiles, content: chunks.join("\n") };
};

const metadataHeader = (metadata, framework) => {
  const lines = [
    `@krds-community/component: ${metadata.component}`,
    `@krds-community/framework: ${framework}`,
    `@krds-community/source-version: ${metadata.sourceVersion}`,
    `@krds-community/source-hash: ${metadata.sourceHash}`,
    `@krds-community/source: ${metadata.sourceFiles.join(", ")}`,
  ];
  if (framework === "react" || framework === "solid") {
    return [`/* ${lines[0]}`, ...lines.slice(1).map((line) => ` * ${line}`), " */"].join("\n");
  }
  return [`<!-- ${lines[0]}`, ...lines.slice(1).map((line) => `     ${line}`), "-->"].join("\n");
};

const componentMetadata = async (entry, framework, component, repositoryRoot) => {
  const canonical = await readCanonicalSource(entry, repositoryRoot);
  return {
    component,
    framework,
    sourceVersion: entry.sourceVersion,
    sourceFiles: canonical.sourceFiles,
    sourceHash: hashContent(canonical.content),
  };
};

export const renderSnippet = (metadata, body) =>
  `${metadataHeader(metadata, metadata.framework)}\n${body.trim()}\n`;

const metadataLine =
  /^.*@krds-community\/(component|framework|source-version|source-hash|source):\s*(.*?)\s*(?:\*\/|-->)?$/;

export const parseMetadata = (content) => {
  const result = {};
  for (const line of normalizeContent(content).split("\n")) {
    const match = line.match(metadataLine);
    if (!match) continue;
    const key = match[1];
    const value = match[2].trim();
    if (key === "component") result.component = value;
    else if (key === "framework") result.framework = value;
    else if (key === "source-version") result.sourceVersion = value;
    else if (key === "source-hash") result.sourceHash = value;
    else if (key === "source") result.source = value;
  }
  return Object.keys(result).length ? result : undefined;
};

const linesForDiff = (value) => {
  const normalized = normalizeContent(value);
  if (!normalized) return [];
  const lines = normalized.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
};

export const createUnifiedDiff = (before, after, beforeLabel = "target", afterLabel = "source") => {
  const oldLines = linesForDiff(before);
  const newLines = linesForDiff(after);
  if (oldLines.join("\n") === newLines.join("\n")) return "";

  const table = Array.from(
    { length: oldLines.length + 1 },
    () => new Uint32Array(newLines.length + 1),
  );
  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      table[oldIndex][newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? table[oldIndex + 1][newIndex + 1] + 1
          : Math.max(table[oldIndex + 1][newIndex], table[oldIndex][newIndex + 1]);
    }
  }

  const changes = [];
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (
      oldIndex < oldLines.length &&
      newIndex < newLines.length &&
      oldLines[oldIndex] === newLines[newIndex]
    ) {
      changes.push(` ${oldLines[oldIndex]}`);
      oldIndex += 1;
      newIndex += 1;
    } else if (
      newIndex < newLines.length &&
      (oldIndex === oldLines.length ||
        table[oldIndex][newIndex + 1] >= table[oldIndex + 1][newIndex])
    ) {
      changes.push(`+${newLines[newIndex]}`);
      newIndex += 1;
    } else {
      changes.push(`-${oldLines[oldIndex]}`);
      oldIndex += 1;
    }
  }

  const oldRange = oldLines.length ? `1,${oldLines.length}` : "0,0";
  const newRange = newLines.length ? `1,${newLines.length}` : "0,0";
  return [
    `--- ${beforeLabel}`,
    `+++ ${afterLabel}`,
    `@@ -${oldRange} +${newRange} @@`,
    ...changes,
  ].join("\n");
};

const validComponentName = (name) =>
  typeof name === "string" && /^[A-Za-z][A-Za-z0-9_-]*$/.test(name);

const replaceComponentMetadata = (content, component) =>
  normalizeContent(content).replace(/(@krds-community\/component:\s*)[^\r\n*<]+/, `$1${component}`);

const snippetBody = (content) => {
  const lines = normalizeContent(content).split("\n");
  const headerEnd = lines.findIndex(
    (line, index) => index > 0 && (line.includes("*/") || line.includes("-->")),
  );
  return headerEnd >= 0 ? lines.slice(headerEnd + 1).join("\n") : lines.join("\n");
};

const readExisting = async (path) => {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
};

const destinationSummary = (path, metadata) =>
  `Wrote ${path} (source-version ${metadata.sourceVersion}, source-hash ${metadata.sourceHash})`;

export const writeSafely = async ({ path, content, force = false }) => {
  const existing = await readExisting(path);
  if (existing === undefined) {
    await mkdir(dirname(resolve(path)), { recursive: true });
    await writeFile(path, content, "utf8");
    return { status: "written", metadata: parseMetadata(content) };
  }

  const incoming = parseMetadata(content);
  const target = parseMetadata(existing);
  const sameSource =
    incoming?.sourceHash &&
    target?.sourceHash === incoming.sourceHash &&
    target?.component === incoming.component &&
    target?.framework === incoming.framework &&
    hashContent(snippetBody(existing)) === hashContent(snippetBody(content));
  if (sameSource) return { status: "noop", metadata: incoming };

  if (!force) {
    const targetHash = target?.sourceHash ?? "unavailable (target has no community metadata)";
    const incomingHash = incoming?.sourceHash ?? "unavailable (source has no community metadata)";
    const diff = createUnifiedDiff(existing, content, path, "incoming component");
    const message = [
      `Refusing to overwrite ${path}.`,
      `Target source hash: ${targetHash}`,
      `Incoming source hash: ${incomingHash}`,
      diff,
      "Migration: review the diff, then re-run with --force to overwrite or use --as <name> with a new --out path.",
    ].join("\n");
    const error = new Error(message);
    error.code = "EUNSAFE_OVERWRITE";
    throw error;
  }

  await writeFile(path, content, "utf8");
  return { status: "written", metadata: incoming };
};

const parseOptions = (args) => {
  const values = new Map();
  const positionals = [];
  const booleans = new Set(["--clipboard", "--force"]);
  const valueOptions = new Set(["--framework", "--out", "--from", "--as"]);
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument.startsWith("--")) {
      positionals.push(argument);
      continue;
    }
    const equalsIndex = argument.indexOf("=");
    const name = equalsIndex >= 0 ? argument.slice(0, equalsIndex) : argument;
    if (!booleans.has(name) && !valueOptions.has(name)) throw new Error(`Unknown option: ${name}`);
    if (booleans.has(name)) {
      if (equalsIndex >= 0) throw new Error(`${name} does not take a value.`);
      values.set(name, true);
      continue;
    }
    const value = equalsIndex >= 0 ? argument.slice(equalsIndex + 1) : args[++index];
    if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
    if (values.has(name)) throw new Error(`${name} may only be provided once.`);
    values.set(name, value);
  }
  return { values, positionals };
};

const getOption = (parsed, name, fallback = undefined) => parsed.values.get(name) ?? fallback;

const ensureFramework = (framework) => {
  if (!frameworks.includes(framework)) {
    throw new Error(`Use a supported framework (${frameworks.join(", ")}).`);
  }
  return framework;
};

const ensureComponent = (inventory, component) => {
  if (!inventory.some((entry) => entry.id === component)) {
    throw new Error(
      `Use a supported component (${inventory.map((entry) => entry.id).join(", ")}).`,
    );
  }
  return inventory.find((entry) => entry.id === component);
};

const componentSource = async (entry, framework, component, repositoryRoot) => {
  const metadata = await componentMetadata(entry, framework, component, repositoryRoot);
  return renderSnippet(metadata, generatedSnippet(component, framework));
};

const copyComponent = async (inventory, parsed, repositoryRoot) => {
  const component = parsed.positionals[0];
  if (!component) throw new Error("Usage: component copy <component> --framework <framework>.");
  const entry = ensureComponent(inventory, component);
  const framework = ensureFramework(getOption(parsed, "--framework", "react"));
  if (getOption(parsed, "--from")) throw new Error("--from is only valid for component paste.");
  const as = getOption(parsed, "--as");
  if (as && !validComponentName(as)) throw new Error("--as must be a valid component name.");
  const output = getOption(parsed, "--out");
  const metadataComponent = as ?? component;
  const content = await componentSource(entry, framework, metadataComponent, repositoryRoot);
  if (output) {
    const result = await writeSafely({
      path: output,
      content,
      force: getOption(parsed, "--force", false),
      as,
    });
    if (result.status === "noop") {
      console.log(`No-op: ${output} already uses source hash ${result.metadata?.sourceHash}.`);
    } else {
      console.log(destinationSummary(output, result.metadata));
    }
  } else {
    process.stdout.write(content);
  }
  if (getOption(parsed, "--clipboard") && !writeClipboard(content)) {
    console.error("Clipboard is unavailable; the snippet was still produced.");
  }
};

const pasteComponent = async (parsed) => {
  const sourcePath = getOption(parsed, "--from");
  const useClipboard = getOption(parsed, "--clipboard", false);
  if (sourcePath && useClipboard)
    throw new Error("Choose either --from <file> or --clipboard, not both.");
  const content = sourcePath ? await readFile(sourcePath, "utf8") : readClipboard();
  if (!content) throw new Error("No clipboard content. Use --from <file> or --clipboard.");
  const as = getOption(parsed, "--as");
  if (as && !validComponentName(as)) throw new Error("--as must be a valid component name.");
  const metadata = parseMetadata(content);
  if (as && !metadata?.component) {
    throw new Error("Cannot use --as without @krds-community metadata in the source.");
  }
  const outputContent = as ? replaceComponentMetadata(content, as) : normalizeContent(content);
  const output = getOption(parsed, "--out");
  if (!output) {
    process.stdout.write(outputContent);
    return;
  }
  const result = await writeSafely({
    path: output,
    content: outputContent,
    force: getOption(parsed, "--force", false),
    as,
  });
  const outputMetadata = result.metadata ?? parseMetadata(outputContent);
  if (result.status === "noop") {
    console.log(
      `No-op: ${output} already uses source hash ${outputMetadata?.sourceHash ?? "unknown"}.`,
    );
  } else if (outputMetadata?.sourceHash && outputMetadata?.sourceVersion) {
    console.log(destinationSummary(output, outputMetadata));
  } else {
    console.log(`Wrote ${output}.`);
  }
};

const help = () =>
  [
    `krds — KRDS component CLI (version ${packageJson.version})`,
    "",
    "Usage:",
    "  krds component list [--framework <framework>]",
    "  krds component copy <component> --framework <framework> [--out <file>] [--clipboard] [--as <name>] [--force]",
    "  krds component paste [--from <file> | --clipboard] [--out <file>] [--as <name>] [--force]",
    "",
    "Options:",
    "  --framework <framework>  Target framework (react, vue, svelte, solid, angular, astro) — list/copy",
    "  --out <file>             Write output to a file instead of stdout — copy/paste",
    "  --clipboard              Write to (copy) or read from (paste) the system clipboard",
    "  --as <name>              Override the component name in metadata and snippet",
    "  --force                  Overwrite a file whose source hash differs",
    "  --from <file>            Paste source file (alternative to --clipboard)",
    "  -h, --help               Show this help",
    "  -v, --version            Print the package version",
  ].join("\n");

export const main = async (argv = process.argv.slice(2)) => {
  const [namespace, action, ...rest] = argv;
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(help());
    return;
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    console.log(packageJson.version);
    return;
  }
  if (namespace !== "component") {
    console.log(help());
    return;
  }
  if (rest.includes("--help") || rest.includes("-h")) {
    console.log(help());
    return;
  }
  if (rest.includes("--version") || rest.includes("-v")) {
    console.log(packageJson.version);
    return;
  }
  const parsed = parseOptions(rest);
  const inventory = await loadComponentInventory();
  const repositoryRoot = await findRepositoryRoot();
  if (action === "list") {
    const framework = getOption(parsed, "--framework");
    if (framework) {
      ensureFramework(framework);
      console.log(inventory.map((entry) => entry.id).join("\n"));
    } else {
      for (const currentFramework of frameworks) {
        console.log(`${currentFramework} (${inventory.length})`);
        console.log(inventory.map((entry) => `  ${entry.id}`).join("\n"));
      }
    }
    return;
  }
  if (action === "copy") {
    await copyComponent(inventory, parsed, repositoryRoot);
    return;
  }
  if (action === "paste") {
    await pasteComponent(parsed);
    return;
  }
  console.log(help());
};

const isMainModule =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMainModule) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
