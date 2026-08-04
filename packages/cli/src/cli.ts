#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import prompts from "prompts";
import {
  detectPackageManager,
  findProjectRoot,
  formatPackages,
  installDependencies,
  missingDependencies,
  packageManagers,
  requiredDependencies,
} from "./deps";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json") as { version: string };

export const frameworks = ["react", "vue", "svelte", "solid", "angular", "astro"];
const DEFAULT_SOURCE_VERSION = "1.1.0";
const PACKAGE_ROOT = resolve(fileURLToPath(new URL("../../../", import.meta.url)));

type InventoryKind = "official" | "extra";
type InventoryEntry = {
  id: string;
  kind: InventoryKind;
  sourceVersion: string;
  sourceFiles: string[];
};
type ComponentMetadata = {
  component: string;
  framework: string;
  sourceVersion: string;
  sourceFiles: string[];
  sourceHash: string;
};
type ParsedMetadata = {
  component?: string;
  framework?: string;
  sourceVersion?: string;
  sourceHash?: string;
  source?: string;
};
type WriteResult = { status: "written" | "noop"; metadata?: ParsedMetadata | undefined };

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
  "search-suggestions",
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

const fallbackSourceFiles: Record<string, string[]> = {
  accordion: [
    "upstream/krds-html/html/code/accordion.html",
    "upstream/krds-html/html/code/accordion_line.html",
  ],
  radio: [
    "upstream/krds-html/html/code/radio_button.html",
    "upstream/krds-html/html/code/radio_size.html",
  ],
  switch: ["upstream/krds-html/html/code/toggle_switch.html"],
  "search-suggestions": [
    "extra/search-suggestions/closed.html",
    "extra/search-suggestions/open.html",
    "extra/search-suggestions/active.html",
  ],
};

const fallbackEntry = (id: string): InventoryEntry => ({
  id,
  kind: fallbackSourceFiles[id] ? "extra" : "official",
  sourceVersion: DEFAULT_SOURCE_VERSION,
  sourceFiles: fallbackSourceFiles[id] ?? [
    `upstream/krds-html/html/code/${id.replaceAll("-", "_")}.html`,
  ],
});

const legacySnippets: Record<string, Record<string, string>> = {
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

// extra 컴포넌트 전용 사용 예시 스니펫. 공식 upstream HTML이 없으므로
// 컴포넌트 API(백엔드 배선: suggest / 정적 목록: suggestions)를 직접 보여준다.
const extraSnippets: Record<string, string> = {
  react: `<SearchSuggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  suggest={async (query) => {
    // 백엔드 배선: const response = await fetch(
    //   "/api/search?q=" + encodeURIComponent(query),
    // );
    // return response.json();
    return [
      { id: "1", label: "건강보험 자격 확인" },
      { id: "2", label: "건강검진 결과 조회" },
    ].filter((item) => item.label.includes(query));
  }}
  onSelect={(item) => console.log(item)}
/>`,
  vue: `<KrdsSearchSuggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  :suggest="suggest"
  @selected="onSelected"
/>

<script setup lang="ts">
import { KrdsSearchSuggestions, type KrdsSearchSuggestion } from "@krds-community/vue/extra";

const suggest = async (query: string): Promise<KrdsSearchSuggestion[]> => {
  // 백엔드 배선: const response = await fetch("/api/search?q=" + encodeURIComponent(query));
  // return response.json();
  return [
    { id: "1", label: "건강보험 자격 확인" },
    { id: "2", label: "건강검진 결과 조회" },
  ].filter((item) => item.label.includes(query));
};
const onSelected = (item: KrdsSearchSuggestion) => console.log(item);
</script>`,
  svelte: `<SearchSuggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  {suggest}
  onSelect={(item) => console.log(item)}
/>

<script lang="ts">
import { SearchSuggestions, type SearchSuggestion } from "@krds-community/svelte/extra";

const suggest = async (query: string): Promise<SearchSuggestion[]> => {
  // 백엔드 배선: const response = await fetch("/api/search?q=" + encodeURIComponent(query));
  // return response.json();
  return [
    { id: "1", label: "건강보험 자격 확인" },
    { id: "2", label: "건강검진 결과 조회" },
  ].filter((item) => item.label.includes(query));
};
</script>`,
  solid: `<SearchSuggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  suggest={async (query) => {
    // 백엔드 배선: const response = await fetch(
    //   "/api/search?q=" + encodeURIComponent(query),
    // );
    // return response.json();
    return [
      { id: "1", label: "건강보험 자격 확인" },
      { id: "2", label: "건강검진 결과 조회" },
    ].filter((item) => item.label.includes(query));
  }}
  onSelect={(item) => console.log(item)}
/>`,
  astro: `<SearchSuggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  suggestions={[
    { id: "1", label: "건강보험 자격 확인" },
    { id: "2", label: "건강검진 결과 조회" },
  ]}
  // 백엔드 배선: endpoint="/api/search" — 스크립트가 "/api/search?q=<검색어>"를 fetch한다.
/>`,
  angular: `<krds-search-suggestions
  label="검색어"
  placeholder="검색어를 입력하세요"
  [suggest]="suggest"
  (selected)="onSelected($event)"
></krds-search-suggestions>

// component에서:
// suggest = async (query: string): Promise<KrdsSearchSuggestion[]> => {
//   // 백엔드 배선: const response = await fetch("/api/search?q=" + encodeURIComponent(query));
//   // return response.json();
//   return [
//     { id: "1", label: "건강보험 자격 확인" },
//     { id: "2", label: "건강검진 결과 조회" },
//   ].filter((item) => item.label.includes(query));
// };
// onSelected = (item: KrdsSearchSuggestion) => console.log(item);`,
};

// extra 컴포넌트 2종(ValidatedInput, FilterableList) 사용 예시 스니펫.
const extraSnippetsV2: Record<string, string> = {
  react: `// 실시간 유효성 검사 — validate로 백엔드 검증 배선 가능
<ValidatedInput
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  validate={(value) =>
    value.trim().length >= 4
      ? { valid: true }
      : { valid: false, message: "4자 이상 입력해 주세요." }
  }
  successMessage="사용 가능한 아이디입니다."
/>

// 즉각 표시 필터·정렬 — 옵션 선택 즉시 목록 갱신
<FilterableList
  items={[
    { id: "1", label: "영유아 보육료 지원 신청", life: "infant" },
    { id: "2", label: "아이돌봄 서비스 이용 신청", life: "child" },
  ]}
  filters={[{ id: "life", label: "생애 주기", field: "life", options: [{ value: "infant", label: "영유아" }, { value: "child", label: "아동" }] }]}
  sort={{ id: "title", label: "이름순", field: "label" }}
/>`,
  vue: `<KrdsValidatedInput
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  :validate="validateId"
  success-message="사용 가능한 아이디입니다."
/>

<KrdsFilterableList
  :items="items"
  :filters="filters"
  :sort="{ id: 'title', label: '이름순', field: 'label' }"
/>`,
  svelte: `<ValidatedInput
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  {validateId}
  successMessage="사용 가능한 아이디입니다."
/>

<FilterableList {items} {filters} sort={{ id: 'title', label: '이름순', field: 'label' }} />`,
  solid: `<ValidatedInput
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  validate={(value) =>
    value.trim().length >= 4
      ? { valid: true }
      : { valid: false, message: "4자 이상 입력해 주세요." }
  }
  successMessage="사용 가능한 아이디입니다."
/>

<FilterableList
  items={[
    { id: "1", label: "영유아 보육료 지원 신청", life: "infant" },
    { id: "2", label: "아이돌봄 서비스 이용 신청", life: "child" },
  ]}
  filters={[{ id: "life", label: "생애 주기", field: "life", options: [{ value: "infant", label: "영유아" }, { value: "child", label: "아동" }] }]}
  sort={{ id: "title", label: "이름순", field: "label" }}
/>`,
  astro: `<ValidatedInput
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  validate="min-length:4"
  successMessage="사용 가능한 아이디입니다."
/>

<FilterableList
  items={[
    { id: "1", label: "영유아 보육료 지원 신청", life: "infant" },
    { id: "2", label: "아이돌봄 서비스 이용 신청", life: "child" },
  ]}
  filters={[{ id: "life", label: "생애 주기", field: "life", options: [{ value: "infant", label: "영유아" }, { value: "child", label: "아동" }] }]}
  sort={{ id: "title", label: "이름순", field: "label" }}
/>`,
  angular: `<krds-validated-input
  label="아이디"
  name="id"
  placeholder="아이디를 입력하세요"
  [validate]="validateId"
  successMessage="사용 가능한 아이디입니다."
></krds-validated-input>

<krds-filterable-list
  [items]="items"
  [filters]="filters"
  [sort]="sort"
></krds-filterable-list>`,
};

const readClipboard = (): string => {
  try {
    return execFileSync("pbpaste", { encoding: "utf8" });
  } catch {
    return "";
  }
};

const writeClipboard = (value: string): boolean => {
  try {
    execFileSync("pbcopy", { input: value });
    return true;
  } catch {
    return false;
  }
};

const normalizeContent = (value: string): string => String(value).replace(/\r\n?/g, "\n");

export const hashContent = (value: string): string =>
  createHash("sha256").update(normalizeContent(value), "utf8").digest("hex");

const stripYamlValue = (value: string): string => value.trim().replace(/^['"]|['"]$/g, "");

const parseManifest = (
  id: string,
  content: string,
): { id: string; sourceVersion: string; sourceFiles: string[] } => {
  const upstreamSection =
    content.match(/^upstream:[ \t]*\n?([\s\S]*?)(?=^errata:|^fixtures:|^contract:)/m)?.[1] ?? "";
  const version = upstreamSection.match(/^[ \t]+version:[ \t]*(.+)$/m)?.[1];
  const sourceFiles = [...upstreamSection.matchAll(/^[ \t]+-[ \t]+(.+)$/gm)].map((match) =>
    stripYamlValue(match[1] ?? ""),
  );
  return {
    id,
    sourceVersion: stripYamlValue(version ?? DEFAULT_SOURCE_VERSION),
    sourceFiles,
  };
};

const canRead = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const findRepositoryRoot = async (): Promise<string | undefined> => {
  const candidates = [process.env.KRDS_REPO_ROOT, process.cwd(), PACKAGE_ROOT].filter(
    (path): path is string => Boolean(path),
  );
  for (const candidate of new Set(candidates.map((path) => resolve(path)))) {
    if (await canRead(join(candidate, "conformance", "manifests"))) return candidate;
  }
  return undefined;
};

export const loadComponentInventory = async (root?: string): Promise<InventoryEntry[]> => {
  const repositoryRoot = root ? resolve(root) : await findRepositoryRoot();
  if (!repositoryRoot) {
    return fallbackComponents.map(fallbackEntry);
  }

  const manifests: InventoryEntry[] = [];
  const locations: Array<[string, InventoryKind]> = [
    [join(repositoryRoot, "conformance", "manifests"), "official"],
    [join(repositoryRoot, "extra", "manifests"), "extra"],
  ];
  for (const [directory, kind] of locations) {
    let files: string[];
    try {
      files = (await readdir(directory)).filter((file) => file.endsWith(".yaml"));
    } catch {
      continue; // extra/manifests는 게시된 폴백 컨텍스트에 없을 수 있다.
    }
    for (const file of files) {
      const id = basename(file, ".yaml");
      manifests.push({
        ...parseManifest(id, await readFile(join(directory, file), "utf8")),
        kind,
      });
    }
  }
  if (!manifests.length) {
    return fallbackComponents.map(fallbackEntry);
  }
  return manifests.sort((left, right) => left.id.localeCompare(right.id));
};

const pascalCase = (id: string): string =>
  id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const angularTag = (id: string): string => `krds-${id}`;

const generatedSnippet = (component: string, framework: string): string => {
  const name = pascalCase(component);
  const legacy = legacySnippets[framework]?.[component];
  if (legacy) return legacy;
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

const readCanonicalSource = async (
  entry: InventoryEntry,
  repositoryRoot: string | undefined,
): Promise<{ sourceFiles: string[]; content: string }> => {
  const sourceFiles = entry.sourceFiles.length
    ? entry.sourceFiles
    : [`upstream/krds-html/html/code/${entry.id.replaceAll("-", "_")}.html`];
  const chunks: string[] = [];
  for (const sourceFile of sourceFiles) {
    const sourcePath = repositoryRoot ? join(repositoryRoot, sourceFile) : undefined;
    const source =
      sourcePath && (await canRead(sourcePath)) ? await readFile(sourcePath, "utf8") : "";
    chunks.push(`--- ${sourceFile}\n${normalizeContent(source)}`);
  }
  return { sourceFiles, content: chunks.join("\n") };
};

const metadataHeader = (metadata: ComponentMetadata, framework: string): string => {
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

const componentMetadata = async (
  entry: InventoryEntry,
  framework: string,
  component: string,
  repositoryRoot: string | undefined,
): Promise<ComponentMetadata> => {
  const canonical = await readCanonicalSource(entry, repositoryRoot);
  return {
    component,
    framework,
    sourceVersion: entry.sourceVersion,
    sourceFiles: canonical.sourceFiles,
    sourceHash: hashContent(canonical.content),
  };
};

export const renderSnippet = (metadata: ComponentMetadata, body: string): string =>
  `${metadataHeader(metadata, metadata.framework)}\n${body.trim()}\n`;

const metadataLine =
  /^.*@krds-community\/(component|framework|source-version|source-hash|source):\s*(.*?)\s*(?:\*\/|-->)?$/;

export const parseMetadata = (content: string): ParsedMetadata | undefined => {
  const result: ParsedMetadata = {};
  for (const line of normalizeContent(content).split("\n")) {
    const match = line.match(metadataLine);
    if (!match) continue;
    const key = match[1];
    const value = (match[2] ?? "").trim();
    if (key === "component") result.component = value;
    else if (key === "framework") result.framework = value;
    else if (key === "source-version") result.sourceVersion = value;
    else if (key === "source-hash") result.sourceHash = value;
    else if (key === "source") result.source = value;
  }
  return Object.keys(result).length ? result : undefined;
};

const linesForDiff = (value: string): string[] => {
  const normalized = normalizeContent(value);
  if (!normalized) return [];
  const lines = normalized.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
};

export const createUnifiedDiff = (
  before: string,
  after: string,
  beforeLabel = "target",
  afterLabel = "source",
): string => {
  const oldLines = linesForDiff(before);
  const newLines = linesForDiff(after);
  if (oldLines.join("\n") === newLines.join("\n")) return "";

  const table = Array.from(
    { length: oldLines.length + 1 },
    () => new Uint32Array(newLines.length + 1),
  );
  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      table[oldIndex]![newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? table[oldIndex + 1]![newIndex + 1]! + 1
          : Math.max(table[oldIndex + 1]![newIndex]!, table[oldIndex]![newIndex + 1]!);
    }
  }

  const changes: string[] = [];
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
        table[oldIndex]![newIndex + 1]! >= table[oldIndex + 1]![newIndex]!)
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

const validComponentName = (name: string): boolean =>
  typeof name === "string" && /^[A-Za-z][A-Za-z0-9_-]*$/.test(name);

const replaceComponentMetadata = (content: string, component: string): string =>
  normalizeContent(content).replace(/(@krds-community\/component:\s*)[^\r\n*<]+/, `$1${component}`);

const snippetBody = (content: string): string => {
  const lines = normalizeContent(content).split("\n");
  const headerEnd = lines.findIndex(
    (line, index) => index > 0 && (line.includes("*/") || line.includes("-->")),
  );
  return headerEnd >= 0 ? lines.slice(headerEnd + 1).join("\n") : lines.join("\n");
};

const readExisting = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
};

const destinationSummary = (path: string, metadata: ParsedMetadata): string =>
  `Wrote ${path} (source-version ${metadata.sourceVersion}, source-hash ${metadata.sourceHash})`;

export const writeSafely = async (args: {
  path: string;
  content: string;
  force?: boolean;
}): Promise<WriteResult> => {
  const { path, content, force = false } = args;
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
    const error = new Error(message) as Error & { code: string };
    error.code = "EUNSAFE_OVERWRITE";
    throw error;
  }

  await writeFile(path, content, "utf8");
  return { status: "written", metadata: incoming };
};

const ensureFramework = (framework: string): string => {
  if (!frameworks.includes(framework)) {
    throw new Error(`Use a supported framework (${frameworks.join(", ")}).`);
  }
  return framework;
};

const ensureComponent = (inventory: InventoryEntry[], component: string): InventoryEntry => {
  if (!inventory.some((entry) => entry.id === component)) {
    throw new Error(
      `Use a supported component (${inventory.map((entry) => entry.id).join(", ")}).`,
    );
  }
  return inventory.find((entry) => entry.id === component)!;
};

const componentSource = async (
  entry: InventoryEntry,
  framework: string,
  component: string,
  repositoryRoot: string | undefined,
): Promise<string> => {
  const metadata = await componentMetadata(entry, framework, component, repositoryRoot);
  const body =
    entry.kind === "extra"
      ? component === "search-suggestions"
        ? extraSnippets[framework]!
        : (extraSnippetsV2[framework] ?? generatedSnippet(component, framework))
      : generatedSnippet(component, framework);
  return renderSnippet(metadata, body);
};

const defaultOutPath = (framework: string, component: string): string => {
  if (framework === "angular") return `src/app/${component}/${component}.component.html`;
  const extension = { vue: "vue", svelte: "svelte", astro: "astro" }[framework] ?? "tsx";
  return `src/components/${pascalCase(component)}.${extension}`;
};

const installMissingDependencies = async (args: {
  projectRoot: string | undefined;
  repositoryRoot: string | undefined;
  framework: string;
  kind: InventoryKind;
  manager: string | undefined;
}): Promise<void> => {
  const { projectRoot, repositoryRoot, framework, kind, manager } = args;
  const packages = requiredDependencies(framework, kind);
  if (!projectRoot) {
    console.log(
      "No package.json found — skipped dependency install. Install manually: pnpm add " +
        formatPackages("pnpm", packages).join(" "),
    );
    return;
  }
  if (repositoryRoot && resolve(projectRoot) === resolve(repositoryRoot)) {
    console.log(
      "Running inside the KRDS repository — dependencies are workspace packages, nothing to install.",
    );
    return;
  }
  const missing = await missingDependencies(projectRoot, packages);
  if (missing.length === 0) {
    console.log("Required dependencies are already installed.");
    return;
  }
  const effectiveManager = manager ?? (await detectPackageManager(projectRoot));
  if (!effectiveManager) {
    throw new Error(
      "Cannot detect a package manager (no lockfile found). Pass --package-manager <pnpm|npm|yarn|bun|deno> or --exclude-required-component.",
    );
  }
  console.log(`Installing ${missing.join(", ")} with ${effectiveManager}...`);
  try {
    await installDependencies({ projectRoot, packages: missing, manager: effectiveManager });
  } catch (error) {
    throw new Error(
      `Dependency install failed (${effectiveManager}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

type CopyOptions = {
  framework: string;
  out?: string;
  clipboard?: boolean;
  as?: string;
  force?: boolean;
  excludeRequiredComponent?: boolean;
  packageManager?: string;
};

const copyComponent = async (
  inventory: InventoryEntry[],
  component: string,
  options: CopyOptions,
  repositoryRoot: string | undefined,
): Promise<void> => {
  const entry = ensureComponent(inventory, component);
  const framework = ensureFramework(options.framework);
  const as = options.as;
  if (as && !validComponentName(as)) throw new Error("--as must be a valid component name.");
  const output = options.out;
  const metadataComponent = as ?? component;
  const content = await componentSource(entry, framework, metadataComponent, repositoryRoot);
  if (output) {
    const result = await writeSafely({
      path: output,
      content,
      force: options.force ?? false,
    });
    if (result.status === "noop") {
      console.log(`No-op: ${output} already uses source hash ${result.metadata?.sourceHash}.`);
    } else {
      console.log(destinationSummary(output, result.metadata!));
    }
  } else {
    process.stdout.write(content);
  }
  if (options.clipboard && !writeClipboard(content)) {
    console.error("Clipboard is unavailable; the snippet was still produced.");
  }
  const excludeRequired = options.excludeRequiredComponent ?? false;
  const packageManager = options.packageManager;
  if (packageManager && !packageManagers.includes(packageManager))
    throw new Error(`Unknown package manager: ${packageManager} (${packageManagers.join(", ")}).`);
  if (packageManager && excludeRequired)
    throw new Error("--package-manager conflicts with --exclude-required-component.");
  if (!excludeRequired) {
    const start = output ? dirname(resolve(output)) : process.cwd();
    await installMissingDependencies({
      projectRoot: await findProjectRoot(start),
      repositoryRoot,
      framework,
      kind: entry.kind,
      manager: packageManager,
    });
  }
};

type PasteOptions = {
  from?: string;
  clipboard?: boolean;
  out?: string;
  as?: string;
  force?: boolean;
};

const pasteComponent = async (options: PasteOptions): Promise<void> => {
  const sourcePath = options.from;
  const useClipboard = options.clipboard ?? false;
  if (sourcePath && useClipboard)
    throw new Error("Choose either --from <file> or --clipboard, not both.");
  const content = sourcePath ? await readFile(sourcePath, "utf8") : readClipboard();
  if (!content) throw new Error("No clipboard content. Use --from <file> or --clipboard.");
  const as = options.as;
  if (as && !validComponentName(as)) throw new Error("--as must be a valid component name.");
  const metadata = parseMetadata(content);
  if (as && !metadata?.component) {
    throw new Error("Cannot use --as without @krds-community metadata in the source.");
  }
  const outputContent = as ? replaceComponentMetadata(content, as) : normalizeContent(content);
  const output = options.out;
  if (!output) {
    process.stdout.write(outputContent);
    return;
  }
  const result = await writeSafely({
    path: output,
    content: outputContent,
    force: options.force ?? false,
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

const isInteractive = (): boolean => process.stdin.isTTY === true;

const abort: () => never = () => {
  throw new Error("중단되었습니다.");
};

const askSelect = async (message: string, options: string[]): Promise<string> => {
  const result = (await prompts(
    {
      type: "autocomplete",
      name: "value",
      message,
      choices: options.map((value) => ({ title: value, value })),
      initial: 0,
    },
    { onCancel: abort },
  )) as { value?: unknown };
  const value = result.value;
  if (typeof value !== "string" || value === "") abort();
  return value;
};

const askText = async (message: string, initial: string): Promise<string> => {
  const result = (await prompts(
    {
      type: "text",
      name: "value",
      message,
      initial,
    },
    { onCancel: abort },
  )) as { value?: unknown };
  const value = typeof result.value === "string" ? result.value.trim() : "";
  return value || initial;
};

const askConfirm = async (message: string, initial: boolean): Promise<boolean> => {
  const result = (await prompts(
    {
      type: "confirm",
      name: "value",
      message,
      initial,
    },
    { onCancel: abort },
  )) as { value?: unknown };
  return result.value === true;
};

const interactiveWizard = async (): Promise<void> => {
  const inventory = await loadComponentInventory();
  const repositoryRoot = await findRepositoryRoot();
  const framework = await askSelect("Target framework", frameworks);
  const component = await askSelect(
    "Component",
    inventory.map((entry) => entry.id),
  );
  const output = await askText("Output path", defaultOutPath(framework, component));
  const entry = ensureComponent(inventory, component);
  const content = await componentSource(entry, framework, component, repositoryRoot);
  let result: WriteResult | undefined;
  try {
    result = await writeSafely({ path: output, content, force: false });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      (error as Error & { code?: string }).code !== "EUNSAFE_OVERWRITE"
    )
      throw error;
    if (await askConfirm(`Overwrite ${output}?`, false))
      result = await writeSafely({ path: output, content, force: true });
  }
  if (!result) return;
  console.log(destinationSummary(output, result.metadata!));
  const projectRoot = await findProjectRoot(dirname(resolve(output)));
  if (projectRoot && repositoryRoot && resolve(projectRoot) === resolve(repositoryRoot)) {
    console.log(
      "Running inside the KRDS repository — dependencies are workspace packages, nothing to install.",
    );
    return;
  }
  if (projectRoot) {
    const installVerb: Record<string, string> = {
      pnpm: "add",
      npm: "install",
      yarn: "add",
      bun: "add",
      deno: "add",
    };
    const missing = await missingDependencies(
      projectRoot,
      requiredDependencies(framework, entry.kind),
    );
    if (missing.length) {
      let manager = await detectPackageManager(projectRoot);
      if (!manager)
        manager = await askSelect(
          "lockfile이 없습니다. 패키지 매니저를 선택하세요.",
          packageManagers,
        );
      if (
        await askConfirm(`누락된 의존성 ${missing.join(", ")}을(를) ${manager}로 설치할까요?`, true)
      ) {
        try {
          await installDependencies({ projectRoot, packages: missing, manager });
        } catch (error) {
          throw new Error(
            `의존성 설치 실패 (${manager}): ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      } else {
        console.error(
          `직접 설치: ${manager} ${installVerb[manager]} ${formatPackages(manager, missing).join(" ")}`,
        );
      }
    }
  }
};

type ListOptions = { framework?: string };

const program = new Command();
program
  .name("krds")
  .description("KRDS component CLI — copy KRDS components into your project")
  .version(packageJson.version, "-v, --version")
  .addHelpText(
    "after",
    [
      "",
      "Run `krds` with no arguments to start the interactive wizard.",
      "Missing @krds-community dependencies are installed automatically after copy; use",
      "--exclude-required-component to opt out, or --package-manager to choose the package manager.",
    ].join("\n"),
  );

const componentCommand = program.command("component").description("Manage KRDS components");

componentCommand
  .command("list")
  .description("List available components")
  .option("--framework <framework>", "Target framework (react, vue, svelte, solid, angular, astro)")
  .action(async (options: ListOptions) => {
    const inventory = await loadComponentInventory();
    const framework = options.framework;
    if (framework) {
      ensureFramework(framework);
      console.log(inventory.map((entry) => entry.id).join("\n"));
    } else {
      for (const currentFramework of frameworks) {
        const officialCount = inventory.filter((entry) => entry.kind !== "extra").length;
        const extraCount = inventory.length - officialCount;
        console.log(`${currentFramework} (${officialCount}, extra ${extraCount})`);
        console.log(
          inventory
            .map((entry) => `  ${entry.id}${entry.kind === "extra" ? "  [extra]" : ""}`)
            .join("\n"),
        );
      }
    }
  });

componentCommand
  .command("copy <component>")
  .description("Copy a component into your project")
  .option(
    "--framework <framework>",
    "Target framework (react, vue, svelte, solid, angular, astro)",
    "react",
  )
  .option("--out <file>", "Write output to a file instead of stdout")
  .option("--clipboard", "Write to (copy) the system clipboard")
  .option("--as <name>", "Override the component name in metadata and snippet")
  .option("--force", "Overwrite a file whose source hash differs")
  .option("--exclude-required-component", "Do not install missing @krds-community dependencies")
  .option(
    "--package-manager <pm>",
    "Package manager for installing missing dependencies (pnpm, npm, yarn, bun, deno)",
  )
  .action(async (component: string, options: CopyOptions) => {
    const repositoryRoot = await findRepositoryRoot();
    const inventory = await loadComponentInventory();
    await copyComponent(inventory, component, options, repositoryRoot);
  });

componentCommand
  .command("paste")
  .description("Paste a component from clipboard or file")
  .option("--from <file>", "Paste source file (alternative to --clipboard)")
  .option("--clipboard", "Read from (paste) the system clipboard")
  .option("--out <file>", "Write output to a file instead of stdout")
  .option("--as <name>", "Override the component name in metadata and snippet")
  .option("--force", "Overwrite a file whose source hash differs")
  .action(async (options: PasteOptions) => {
    await pasteComponent(options);
  });

export const main = async (argv = process.argv.slice(2)) => {
  if (argv.length === 0 || (argv.length === 1 && argv[0] === "component")) {
    if (isInteractive()) {
      await interactiveWizard();
      return;
    }
    program.help();
    return;
  }
  await program.parseAsync(argv, { from: "user" });
};

const entryPath = process.argv[1];
const isMainModule =
  entryPath !== undefined && resolve(entryPath) === resolve(fileURLToPath(import.meta.url));
if (isMainModule) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
