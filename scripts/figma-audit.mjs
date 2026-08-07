// Figma 컴포넌트 인벤토리 감사 + 구조 덤프 (반복 실행 가능)
//
// 사용법:
//   node scripts/figma-audit.mjs <fileKey> [--out reports/figma-audit]
//   node scripts/figma-audit.mjs <fileKey> --dump <setName>
//
// 토큰 해석 순서: --token <pat> > FIGMA_API_KEY > ~/.figma-token
// API: GET https://api.figma.com/v1/files/<fileKey> (X-Figma-Token 헤더)
// 원본 JSON은 디스크에 저장하지 않고 메모리에서 파싱한다 (최대 ~400MB).
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const parseArgs = () => {
  const argv = process.argv.slice(2);
  const fileKey = argv.find((arg) => !arg.startsWith("-"));
  const tokenArgIndex = argv.indexOf("--token");
  const token = tokenArgIndex >= 0 ? argv[tokenArgIndex + 1] : undefined;
  const outIndex = argv.indexOf("--out");
  const outDir = outIndex >= 0 ? argv[outIndex + 1] : "reports/figma-audit";
  const dumpIndex = argv.indexOf("--dump");
  const dumpSet = dumpIndex >= 0 ? argv[dumpIndex + 1] : undefined;
  return { fileKey, token, outDir, dumpSet };
};

const resolveToken = async (cliToken) => {
  if (cliToken) return cliToken;
  if (process.env.FIGMA_API_KEY) return process.env.FIGMA_API_KEY;
  try {
    const fileToken = await stat(join(homedir(), ".figma-token"));
    if (fileToken.isFile()) {
      const token = (await readFile(join(homedir(), ".figma-token"), "utf8")).trim();
      if (token) return token;
    }
  } catch {
    // fall through to error
  }
  return undefined;
};

const fetchDocument = async (fileKey, token) => {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { "X-Figma-Token": token },
  });
  if (response.status === 401) {
    throw new Error(
      "Figma API 401: 토큰이 유효하지 않습니다. --token <pat> 또는 FIGMA_API_KEY 또는 ~/.figma-token 을 확인하세요.",
    );
  }
  if (!response.ok) {
    throw new Error(`Figma API ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

const walk = (node, visitor) => {
  visitor(node);
  for (const child of node.children ?? []) walk(child, visitor);
};

const nodeTypeName = (node) => {
  if (node.type === "TEXT") return "TEXT";
  if (node.type === "INSTANCE" || node.type === "COMPONENT") return node.type;
  return node.type ?? "?";
};

const dumpTree = (node, depth = 0, lines = []) => {
  const indent = "  ".repeat(depth);
  const type = nodeTypeName(node);
  const name = node.name ?? "";
  if (type === "TEXT") {
    const characters = (node.characters ?? "").replace(/\n/g, "\\n").slice(0, 60);
    lines.push(`${indent}- TEXT "${characters}"`);
    return;
  }
  if (node.type === "INSTANCE") {
    const componentName = node.componentId ?? name;
    lines.push(`${indent}- INSTANCE ${name} (component: ${componentName})`);
    return;
  }
  lines.push(`${indent}- ${type} ${name}`);
  for (const child of node.children ?? []) dumpTree(child, depth + 1, lines);
  return lines;
};

const normalizeSetName = (name) =>
  name
    .split("__")[0]
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

const collectComponentSets = (document) => {
  const sets = new Map(); // normalized name -> { names: Set, count }
  let componentCount = 0;
  walk(document, (node) => {
    if (node.type === "COMPONENT") componentCount += 1;
    if (node.type === "COMPONENT_SET") {
      const normalized = normalizeSetName(node.name);
      if (!sets.has(normalized)) {
        sets.set(normalized, { names: new Set(), count: 0 });
      }
      sets.get(normalized).names.add(node.name);
      sets.get(normalized).count += 1;
    }
  });
  return { sets, componentCount };
};

const collectVariants = (setNode) => {
  const variants = (setNode.children ?? [])
    .filter((child) => child.type === "COMPONENT")
    .map((child) => child.name);
  return variants;
};

const findSet = (document, setName) => {
  const normalized = normalizeSetName(setName);
  let match;
  walk(document, (node) => {
    if (node.type === "COMPONENT_SET" && normalizeSetName(node.name) === normalized) {
      match = node;
    }
  });
  return match;
};

const renderDump = (setNode, setName) => {
  const variants = collectVariants(setNode);
  const firstVariant = (setNode.children ?? []).find((child) => child.type === "COMPONENT");
  const lines = [`# ${setNode.name} (normalized: ${normalizeSetName(setNode.name)})`, ""];
  lines.push(`## Variants (${variants.length})`);
  for (const variant of variants) lines.push(`- ${variant}`);
  lines.push("");
  lines.push(`## Layer tree (first variant: ${firstVariant?.name ?? "(none)"})`);
  if (firstVariant) {
    for (const line of dumpTree(firstVariant)) lines.push(line);
  }
  return lines.join("\n");
};

const audit = async (fileKey, token, outDir) => {
  const document = await fetchDocument(fileKey, token);
  const pages = (document.document?.children ?? []).map((page) => ({
    id: page.id,
    name: page.name,
    childCount: page.children?.length ?? 0,
  }));
  const { sets, componentCount } = collectComponentSets(document.document ?? {});
  const htmlDirectory = join(ROOT_DIR, "upstream/krds-html/html/code");
  const upstreamFiles = (await readdir(htmlDirectory)).filter((entry) => entry.endsWith(".html"));
  const upstreamBasenames = upstreamFiles.map((entry) => entry.replace(/\.html$/, ""));
  const missingFromHtml = [...sets.keys()].filter(
    (name) => !upstreamBasenames.some((basename) => basename.replace(/_/g, "-") === name),
  );
  const unmatchedUpstream = upstreamBasenames.filter(
    (basename) => !sets.has(basename.replace(/_/g, "-")),
  );
  const inventory = {
    fileKey,
    generatedAt: new Date().toISOString(),
    pages: pages.length,
    componentSetCount: sets.size,
    componentCount,
    componentSets: [...sets.entries()]
      .map(([name, info]) => ({
        name,
        figmaNames: [...info.names].sort(),
        variantCount: info.count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    missingFromHtml: missingFromHtml.sort(),
    unmatchedUpstream: unmatchedUpstream.sort(),
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "inventory.json"), JSON.stringify(inventory, null, 2));
  const pageRows = pages
    .map((page) => `| ${page.id} | ${page.name} | ${page.childCount} |`)
    .join("\n");
  const setRows = inventory.componentSets
    .map(
      (set) =>
        `| ${set.name} | ${set.variantCount} | ${set.figmaNames.join("<br>")} | ${
          missingFromHtml.includes(set.name) ? "HTML 키트에 없음" : "있음"
        } |`,
    )
    .join("\n");
  const report = `# KRDS Figma 감사 리포트

- 파일 키: \`${fileKey}\`
- 생성: ${inventory.generatedAt}
- 페이지 ${pages.length}개, COMPONENT_SET ${sets.size}개, COMPONENT ${componentCount}개
- HTML 키트: \`upstream/krds-html/html/code/\` (${upstreamFiles.length}개)

## 페이지

| id | 이름 | childCount |
|---|---|---|
${pageRows}

## COMPONENT_SET 대비 HTML 키트

| set (정규화) | 변형 수 | Figma 이름 | HTML 키트 |
|---|---|---|---|
${setRows}

## HTML 키트에 없는 Figma 컴포넌트 (${missingFromHtml.length})

${missingFromHtml.map((name) => `- \`${name}\``).join("\n")}

## Figma에 없는 HTML 키트 컴포넌트 (${unmatchedUpstream.length})

${unmatchedUpstream.map((name) => `- \`${name}\``).join("\n")}

> 주의: 이름 변형(textarea/text_area 등)으로 false positive가 있을 수 있습니다. 사람 검토 필요.
`;
  await writeFile(join(outDir, "report.md"), report);
  return { pages, sets, missingFromHtml, unmatchedUpstream, outDir };
};

const main = async () => {
  const { fileKey, token, outDir, dumpSet } = parseArgs();
  if (!fileKey) {
    console.error(
      "사용법: node scripts/figma-audit.mjs <fileKey> [--out reports/figma-audit] | [--dump <setName>]",
    );
    process.exit(1);
  }
  const resolvedToken = await resolveToken(token);
  if (!resolvedToken) {
    console.error(
      "Figma 토큰이 없습니다. --token <pat> 인자, FIGMA_API_KEY 환경변수, 또는 ~/.figma-token 파일을 제공하세요.",
    );
    process.exit(1);
  }
  try {
    if (dumpSet) {
      const document = await fetchDocument(fileKey, resolvedToken);
      const setNode = findSet(document.document ?? {}, dumpSet);
      if (!setNode) {
        console.error(`COMPONENT_SET "${dumpSet}"를 찾을 수 없습니다.`);
        process.exit(1);
      }
      console.log(renderDump(setNode, dumpSet));
      process.exit(0);
    }
    const result = await audit(fileKey, resolvedToken, resolve(ROOT_DIR, outDir));
    console.log(
      `완료: 페이지 ${result.pages.length}개, 세트 ${result.sets.size}개, missing-from-html ${result.missingFromHtml.length}개 → ${result.outDir}/`,
    );
    process.exit(0);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

await main();
