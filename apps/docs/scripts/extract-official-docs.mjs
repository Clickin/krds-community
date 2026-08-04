// @ts-nocheck
/**
 * extract-official-docs.mjs — provenance pipeline for official KRDS text.
 *
 * Reads the crawled official pages (audit-input/krds-official-html) and
 * Maintains marker-delimited markdown snippets in the docs, using MDX comment
 * syntax (see markOpen/markClose below).
 *
 * - component pages (implemented): `## 공식 문서` section after <FrameworkPreview>
 * - service pattern pages: `## 공식 개요` section before `## 구현 예제`
 * - live-only components: scaffolds src/content/docs/components/live-only/*.mdx
 * - design style pages: scaffolds src/content/docs/design/*.mdx
 *
 * Re-running is idempotent (marker replace) and fails loudly (exit != 0) when
 * a required heading or intro is missing — no silent garbage output.
 *
 * Usage: node apps/docs/scripts/extract-official-docs.mjs  (from repo root)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const inputRoot = resolve(repoRoot, "audit-input/krds-official-html");
const docsRoot = resolve(repoRoot, "apps/docs/src/content/docs");
const componentsRoot = resolve(docsRoot, "components");

// --- provenance constants (mirror of src/data/provenance.ts) ---
const provenanceSource = readFileSync(
  resolve(repoRoot, "apps/docs/src/data/provenance.ts"),
  "utf8",
);
const provenance = {
  ref: provenanceSource.match(/ref:\s*'([^']+)'/)?.[1],
  package: provenanceSource.match(/package:\s*'([^']+)'/)?.[1],
  retrieved: provenanceSource.match(/retrieved:\s*'([^']+)'/)?.[1],
  liveRetrieved: provenanceSource.match(/liveKrdsSource[\s\S]*?retrieved:\s*'([^']+)'/)?.[1],
};
for (const [key, value] of Object.entries(provenance)) {
  if (!value) throw new Error(`provenance.ts: ${key} not found`);
}
const liveOnlyWarning = `> 이 컴포넌트는 공식 웹사이트(${provenance.liveRetrieved} 확인)에 있으나 고정 스냅샷 ${provenance.ref}(${provenance.package})에 포함되지 않습니다. 커뮤니티 구현과 conformance 결과가 없습니다.`;

// --- official page -> docs mapping ---

const componentPageMap = {
  component_02_01: ["masthead"],
  component_02_02: ["identifier"],
  component_02_03: ["header"],
  component_02_04: ["footer"],
  component_03_01: ["skip-link"],
  component_03_02: ["main-menu-pc", "main-menu-mobile"],
  component_03_03: ["breadcrumb"],
  component_03_04: ["side-navigation"],
  component_03_05: ["in-page-navigation"],
  component_03_06: ["pagination"],
  component_04_01: ["structured-list", "structured-list-table"],
  component_04_02: ["critical-alerts"],
  component_04_03: ["calendar", "calendar-range"],
  component_04_04: ["disclosure"],
  component_04_05: ["modal", "modal-sample"],
  component_04_06: ["badge", "badge-number", "badge-size"],
  component_04_07: ["accordion", "accordion-line"],
  component_04_08: ["image"],
  component_04_09: ["carousel", "carousel-banner"],
  component_04_10: ["tab"],
  component_04_11: ["table"],
  component_04_13: ["text-list", "text-list-ordered"],
  component_04_14: ["favicon"],
  component_05_01: ["link"],
  component_05_02: [
    "button",
    "button-hierarchy",
    "button-icon",
    "button-size",
    "button-text",
    "button-with-icon",
  ],
  component_05_03: ["fab"],
  component_06_01: ["radio", "radio-button", "radio-chip", "radio-size"],
  component_06_02: ["checkbox", "checkbox-chip", "checkbox-size"],
  component_06_03: ["select", "select-size", "select-sorting", "select-state"],
  component_06_04: ["tag", "tag-link"],
  component_06_07: ["switch", "toggle-switch", "toggle-switch-size"],
  component_07_01: ["step-indicator"],
  component_07_02: ["spinner"],
  component_08_01: ["help-panel"],
  component_08_02: ["tutorial-panel"],
  component_08_03: ["contextual-help"],
  component_08_04: ["coach-mark"],
  component_08_05: ["tooltip", "tooltip-box", "tooltip-vertical"],
  component_08_06: ["tts", "tts-icon", "tts-size"],
  component_09_01: ["date-input"],
  component_09_02: ["textarea"],
  component_09_03: ["text-input", "text-input-icon", "text-input-size", "text-input-state"],
  component_09_04: ["file-upload"],
  component_10_01: ["language-switcher", "language-switcher-page"],
  component_10_02: ["resize"],
  component_11_01: ["accessible-media"],
  component_11_02: ["hidden-content"],
  component_12_01: ["range-slider"],
  component_12_02: ["back"],
  component_12_03: ["bottom-sheet"],
  component_12_04: ["quantity-toggle"],
  component_12_05: ["toast"],
  component_12_06: ["snackbar"],
  component_12_07: ["tab-bar"],
  component_12_08: ["splash-screen"],
};

const liveOnlyIds = new Set([
  "image",
  "fab",
  "accessible-media",
  "hidden-content",
  "range-slider",
  "back",
  "bottom-sheet",
  "quantity-toggle",
  "toast",
  "snackbar",
  "tab-bar",
  "splash-screen",
]);

const officialTitles = {
  image: "이미지",
  fab: "플로팅",
  "accessible-media": "접근 가능한 미디어",
  "hidden-content": "숨긴 콘텐츠",
  "range-slider": "범위 슬라이더",
  back: "뒤로가기",
  "bottom-sheet": "바텀시트",
  "quantity-toggle": "수량토글",
  toast: "토스트",
  snackbar: "스낵바",
  "tab-bar": "탭바",
  "splash-screen": "스플래시 스크린",
};

const servicePageMap = {
  service_01_01: "visit",
  service_02_01: "search",
  service_03_01: "login",
  service_04_01: "application",
  service_05_01: "policy",
};

const designPageMap = {
  style_01: { slug: "design-style-intro", title: "디자인 스타일 소개" },
  style_02: {
    slug: "colors",
    title: "색상",
    tokens: [
      "primitive.color.light",
      "primitive.color.high-contrast",
      "mode-light.color",
      "mode-high-contrast.color",
    ],
  },
  style_03: {
    slug: "typography",
    title: "타이포그래피",
    tokens: ["primitive.typo", "responsive-pc.font-size", "responsive-mobile.font-size"],
  },
  style_04: { slug: "shape", title: "형태" },
  style_05: { slug: "layout", title: "레이아웃" },
  style_06: { slug: "icons", title: "아이콘" },
  style_07: {
    slug: "design-tokens",
    title: "디자인 토큰",
    tokens: ["semantic", "mode-light", "responsive-pc", "responsive-mobile"],
  },
  style_08: { slug: "elevation", title: "엘리베이션" },
  style_09: { slug: "high-contrast-mode", title: "선명한 화면 모드" },
};

const componentSkipSections = new Set([
  "자주 묻는 질문",
  "정보 변경 내역",
  "궁금한 점이나 의견이 있으십니까?",
  "예시",
  "마크업 가이드",
  "컴포넌트 토큰 (css variable)",
]);
const serviceSkipSections = new Set([
  "사용성 가이드라인 체크리스트",
  "정보 변경 내역",
  "자주 묻는 질문",
  "궁금한 점이나 의견이 있으십니까?",
]);
const guideSkipSections = new Set([
  "자주 묻는 질문",
  "정보 변경 내역",
  "궁금한 점이나 의견이 있으십니까?",
]);

const normalize = (value) => value.replace(/\s+/g, " ").trim();

// --- parsing ---

const loadPage = (file) => {
  const html = readFileSync(resolve(inputRoot, file), "utf8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const contents = doc.querySelector("div.contents");
  if (!contents) throw new Error(`${file}: div.contents not found`);
  contents
    .querySelectorAll(".krds-breadcrumb-wrap, .krds-in-page-navigation-area, script, style")
    .forEach((n) => n.remove());
  return { doc, contents };
};

const headingText = (el) => normalize(el.textContent);

/** Collect sections: [{ level, title, nodes, skipped }] in document order.
 * Section nesting follows heading levels; a section inside a skipped section is skipped. */
const collectSections = (contents, skipSet) => {
  const isSectionHeading = (el) =>
    /^h[2-6]$/.test(el.tagName.toLowerCase()) &&
    (el.classList.contains("sec-tit") ||
      el.classList.contains("con-tit") ||
      el.classList.contains("g-flow-tit"));

  const intro = { level: 0, title: null, nodes: [], skipped: false };
  const sections = [intro];
  const stack = [intro];

  const visit = (node) => {
    for (const child of node.children) {
      const tag = child.tagName.toLowerCase();
      if (isSectionHeading(child)) {
        const level = Number(tag[1]);
        const title = headingText(child);
        while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
        const parentSkipped = stack[stack.length - 1].skipped;
        const section = { level, title, nodes: [], skipped: parentSkipped || skipSet.has(title) };
        stack.push(section);
        sections.push(section);
      } else if (child.querySelector("h2,h3,h4,h5,h6")) {
        visit(child);
      } else {
        stack[stack.length - 1].nodes.push(child);
      }
    }
  };
  visit(contents);
  return sections;
};

const inlineToMarkdown = (node) => {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return "";
  const tag = node.tagName.toLowerCase();
  if (tag === "br") return "\n";
  if (tag === "script" || tag === "style") return "";
  if (tag === "strong" || tag === "b") {
    const inner = collectText(node);
    return inner ? `**${inner}**` : "";
  }
  if (tag === "em" || tag === "i") {
    const inner = collectText(node);
    return inner ? `*${inner}*` : "";
  }
  if (tag === "code") return `\`${node.textContent}\``;
  if (tag === "a") {
    const href = node.getAttribute("href") ?? "";
    const text = collectText(node);
    if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) return `[${text}](${href})`;
    return text;
  }
  if (tag === "img") return "";
  if (tag === "ul" || tag === "ol") {
    return [...node.children].map((li) => `- ${collectText(li)}`).join(", ");
  }
  return collectText(node);
};

const collectText = (node) => {
  let out = "";
  for (const child of node.childNodes) out += inlineToMarkdown(child);
  return out
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\*\*([^*]+)\*\*(?=\S)/g, "**$1** ")
    .replace(/</g, "\\<")
    .replace(/>/g, "\\>")
    .trim();
};

const listToMarkdown = (list, depth) => {
  const ordered = list.tagName.toLowerCase() === "ol";
  const indent = "  ".repeat(depth);
  let index = 0;
  const lines = [];
  for (const li of list.children) {
    const text = collectText(li).replace(ordered ? /^\d+\.\s*/ : /^-\s*/, "");
    const marker = ordered ? `${++index}. ` : "- ";
    lines.push(`${indent}${marker}${text}`);
  }
  return lines;
};

const tableToMarkdown = (table) => {
  const rows = [];
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (thead) rows.push(...thead.querySelectorAll("tr"));
  if (tbody) rows.push(...tbody.querySelectorAll("tr"));
  if (!rows.length) rows.push(...table.querySelectorAll("tr"));
  if (!rows.length) return [];
  const cellText = (cell) => collectText(cell).replace(/\n/g, "<br />");
  const renderRow = (row, isHeader) => {
    const cells = [...row.children]
      .filter((c) => /^t[hd]$/.test(c.tagName.toLowerCase()))
      .map(cellText);
    if (isHeader && !cells.length) return null;
    return { cells, isHeader };
  };
  const first = renderRow(rows[0], true);
  const header = first && first.cells.length ? first : null;
  const body = (header ? [...rows].slice(1) : rows)
    .map((row) => renderRow(row, false))
    .filter(Boolean)
    .map((r) => r.cells);
  const width = Math.max(header ? header.cells.length : 0, ...body.map((r) => r.length));
  const pad = (cells) =>
    [...cells, ...Array(Math.max(0, width - cells.length)).fill("")].map((c) => c || " ");
  const lines = [];
  if (header) lines.push(`| ${pad(header.cells).join(" | ")} |`);
  lines.push(`| ${Array(width).fill("---").join(" | ")} |`);
  for (const row of body) lines.push(`| ${pad(row).join(" | ")} |`);
  return lines;
};

/** Convert a flow container's children to markdown lines. */
const flowBlocks = (container, depth = 0) => {
  const lines = [];
  const push = (block) => {
    if (block === null || block === undefined) return;
    if (Array.isArray(block)) {
      for (const line of block) push(line);
      return;
    }
    const value = String(block);
    if (value.trim()) lines.push(value);
  };

  for (const child of container.children) {
    const tag = child.tagName.toLowerCase();
    if (tag === "script" || tag === "style") continue;
    if (/^h[1-6]$/.test(tag)) {
      push(`${"#".repeat(Number(tag[1]) + depth)} ${headingText(child)}`);
      continue;
    }
    if (tag === "p") {
      if (child.classList.contains("g-tit") || child.classList.contains("caption")) {
        push(`**${collectText(child)}**`);
      } else if (child.classList.contains("g-desc")) {
        push(collectText(child));
      } else {
        push(collectText(child));
      }
      continue;
    }
    if (tag === "ul" || tag === "ol") {
      push(listToMarkdown(child, depth));
      continue;
    }
    if (tag === "table") {
      push(tableToMarkdown(child));
      continue;
    }
    if (tag === "pre") continue;
    if (tag === "img") continue;
    if (tag === "hr") {
      push("---");
      continue;
    }
    if (tag === "blockquote") {
      for (const line of flowBlocks(child, depth)) push(`> ${line}`);
      continue;
    }
    if (tag === "dl") {
      for (const dt of child.querySelectorAll(":scope > dt")) push(`**${collectText(dt)}**`);
      for (const dd of child.querySelectorAll(":scope > dd")) push(collectText(dd));
      continue;
    }
    if (tag === "div") {
      if (child.classList.contains("g-img-wrap")) {
        const caption = child.querySelector(".caption");
        if (caption) push(`**${normalize(caption.textContent)}**`);
        continue;
      }
      if (child.classList.contains("g-btn-area")) {
        push(collectText(child));
        continue;
      }
      push(flowBlocks(child, depth));
      continue;
    }
    // fallback: inline text
    const text = collectText(child);
    if (text) push(text);
  }
  return lines;
};

// --- snippet builders ---

const buildIntro = (contents) => {
  const titleArea = contents.querySelector(".page-title-wrap");
  const descs = titleArea
    ? [...titleArea.querySelectorAll("p.g-desc")]
    : [...contents.querySelectorAll(":scope > p.g-desc")];
  if (!descs.length) throw new Error("p.g-desc (소개) not found");
  return descs.map((d) => collectText(d));
};

const buildSectionMarkdown = (section) => {
  const body = flowBlocks({ children: [...section.nodes] });
  return body.join("\n").trim();
};

const assertSectionInOutput = (section, output, file) => {
  const heading = `${"#".repeat(section.level)} ${section.title}`;
  if (!output.includes(heading)) {
    throw new Error(`${file}: extracted section "${section.title}" missing from output`);
  }
};

/** Component/guide style snippet: intro paragraphs + kept sections. */
const buildDocsSnippet = ({
  file,
  markerId,
  skipSections,
  includeIntro = true,
  wrapperHeading = null,
  banner = null,
}) => {
  const { contents } = loadPage(file);
  const intro = buildIntro(contents);
  const sections = collectSections(contents, skipSections).filter((s) => s.title);
  const kept = sections.filter((s) => !s.skipped);
  const out = [];
  if (banner) out.push(banner);
  if (wrapperHeading) out.push(wrapperHeading);
  if (includeIntro) out.push(...intro.map((p) => p));
  for (const section of kept) {
    const heading = `${"#".repeat(section.level)} ${section.title}`;
    const body = buildSectionMarkdown(section);
    out.push("");
    out.push(heading);
    if (body) out.push(body);
  }
  const markdown = out.join("\n").trim();
  // assertions: every kept heading must appear in output; required ones must exist
  for (const section of kept) assertSectionInOutput(section, markdown, file);
  if (!kept.length) throw new Error(`${file}: no sections extracted`);
  return `${markOpen(markerId)}\n${markdown}\n${markClose(markerId)}`;
};

/** Service overview snippet: 유형 + 이용 상황별 플로(Flow) sections. */
const buildServiceSnippet = (file, markerId) => {
  const { contents } = loadPage(file);
  buildIntro(contents); // assert intro exists
  const sections = collectSections(contents, serviceSkipSections).filter(
    (s) => s.title && !s.skipped,
  );
  const titles = sections.map((s) => s.title);
  for (const required of ["유형", "이용 상황별 플로(Flow)"]) {
    if (!titles.includes(required))
      throw new Error(`${file}: required section "${required}" not found`);
  }
  const out = ["## 공식 개요"];
  for (const section of sections) {
    const body = buildSectionMarkdown(section);
    out.push("");
    out.push(`${"#".repeat(section.level)} ${section.title}`);
    if (body) out.push(body);
  }
  const markdown = out.join("\n").trim();
  for (const section of sections) assertSectionInOutput(section, markdown, file);
  return `${markOpen(markerId)}\n${markdown}\n${markClose(markerId)}`;
};

// --- marker-based idempotent insertion (MDX comment syntax; legacy `<!-- -->` also recognized) ---

const markOpen = (markerId) => `{/* krds-official:${markerId} */}`;
const markClose = (markerId) => `{/* /krds-official:${markerId} */}`;

const findMarked = (content, markerId) => {
  const opens = [`<!-- krds-official:${markerId} -->`, markOpen(markerId)];
  const closes = [`<!-- /krds-official:${markerId} -->`, markClose(markerId)];
  for (const open of opens) {
    const openIndex = content.indexOf(open);
    if (openIndex === -1) continue;
    let end = content.length;
    for (const close of closes) {
      const closeIndex = content.indexOf(close, openIndex);
      if (closeIndex !== -1) {
        end = closeIndex + close.length;
        break;
      }
    }
    return { start: openIndex, end };
  }
  return null;
};

const removeAllMarked = (content, markerId) => {
  let out = content;
  for (;;) {
    const marked = findMarked(out, markerId);
    if (!marked) break;
    out = `${out.slice(0, marked.start)}${out.slice(marked.end)}`;
  }
  return out;
};

const upsert = (filePath, markerId, block, anchor, insertAfter = false) => {
  const content = readFileSync(filePath, "utf8");
  const next = removeAllMarked(content, markerId);
  const index = next.indexOf(anchor);
  if (index === -1) throw new Error(`anchor not found: ${anchor}`);
  const at = insertAfter ? index + anchor.length : index;
  const prefix = insertAfter ? "\n\n" : "\n";
  writeFileSync(filePath, `${next.slice(0, at)}${prefix}${block}\n${next.slice(at)}`, "utf8");
  return next !== content;
};

// --- component page file lookup ---

const componentFileFor = (componentId) => {
  const found = [];
  for (const dir of [
    "identity",
    "navigation",
    "layout",
    "action",
    "selection",
    "feedback",
    "help",
    "input",
    "settings",
  ]) {
    const candidate = resolve(componentsRoot, dir, `${componentId}.mdx`);
    if (existsSync(candidate)) found.push(candidate);
  }
  if (found.length !== 1)
    throw new Error(`component file for ${componentId}: found ${found.length}`);
  return found[0];
};

const firstSentence = (text) => {
  const match = text.match(/^[^.!?。！？]*[.!?。！？]/);
  return match ? match[0].trim() : text.slice(0, 120);
};

// --- main ---

let updated = 0;

// 1) implemented component pages
for (const [officialId, componentIds] of Object.entries(componentPageMap)) {
  const file = `components/${officialId}.html`;
  const banner = liveOnlyIds.has(componentIds[0]) ? null : null;
  const block = buildDocsSnippet({
    file,
    markerId: officialId,
    skipSections: componentSkipSections,
    wrapperHeading: "## 공식 문서",
    banner,
  });
  for (const componentId of componentIds) {
    if (liveOnlyIds.has(componentId)) continue;
    const target = componentFileFor(componentId);
    const wasReplace = upsert(target, officialId, block, "</FrameworkPreview>", true);
    updated++;
    console.log(`${wasReplace ? "updated" : "inserted"} ${target.split("/content/docs/")[1]}`);
  }
}

// 2) service pattern pages
for (const [officialId, patternId] of Object.entries(servicePageMap)) {
  const block = buildServiceSnippet(`service-patterns/${officialId}.html`, officialId);
  const target = resolve(docsRoot, "service-patterns", `${patternId}.mdx`);
  if (!existsSync(target)) throw new Error(`missing service pattern page: ${patternId}`);
  const wasReplace = upsert(target, officialId, block, "## 구현 예제");
  updated++;
  console.log(`${wasReplace ? "updated" : "inserted"} service-patterns/${patternId}.mdx`);
}

// 3) live-only component pages (scaffold once, marker-based refresh)
mkdirSync(resolve(componentsRoot, "live-only"), { recursive: true });
for (const [officialId, componentIds] of Object.entries(componentPageMap)) {
  const componentId = componentIds[0];
  if (!liveOnlyIds.has(componentId)) continue;
  const intro = buildIntro(loadPage(`components/${officialId}.html`).contents)[0];
  const block = buildDocsSnippet({
    file: `components/${officialId}.html`,
    markerId: officialId,
    skipSections: componentSkipSections,
    wrapperHeading: "## 공식 문서",
    banner: liveOnlyWarning,
  });
  const target = resolve(componentsRoot, "live-only", `${componentId}.mdx`);
  const frontmatter = `---\ntitle: ${officialTitles[componentId]}\ndescription: ${firstSentence(intro)}\ncategory: live-only\n---\n\n`;
  if (!existsSync(target)) {
    writeFileSync(target, `${frontmatter}${block}\n`, "utf8");
    console.log(`created components/live-only/${componentId}.mdx`);
  } else {
    const content = readFileSync(target, "utf8");
    if (findMarked(content, officialId) === null)
      throw new Error(`live-only ${componentId}: marker missing`);
    writeFileSync(target, `${frontmatter}${block}\n`, "utf8");
    console.log(`updated components/live-only/${componentId}.mdx`);
  }
  updated++;
}

// 4) design style pages (scaffold once, marker-based refresh)
mkdirSync(resolve(docsRoot, "design"), { recursive: true });
for (const [officialId, spec] of Object.entries(designPageMap)) {
  const block = buildDocsSnippet({
    file: `guide/${officialId}.html`,
    markerId: officialId,
    skipSections: guideSkipSections,
    includeIntro: false,
  });
  const intro = buildIntro(loadPage(`guide/${officialId}.html`).contents)[0];
  const tokensSection = spec.tokens
    ? `\n## 디자인 토큰 실제 값\n\n<TokenSwatches groups={${JSON.stringify(spec.tokens)}} />\n`
    : "";
  const imports = spec.tokens ? `import TokenSwatches from '@docs/TokenSwatches.astro';\n\n` : "";
  const frontmatter = `---\ntitle: ${spec.title}\ndescription: ${firstSentence(intro)}\n---\n\n`;
  const target = resolve(docsRoot, "design", `${spec.slug}.mdx`);
  if (!existsSync(target)) {
    writeFileSync(target, `${frontmatter}${imports}${intro}\n\n${block}${tokensSection}\n`, "utf8");
    console.log(`created design/${spec.slug}.mdx`);
  } else {
    const content = readFileSync(target, "utf8");
    if (findMarked(content, officialId) === null)
      throw new Error(`design ${spec.slug}: marker missing`);
    writeFileSync(target, `${frontmatter}${imports}${intro}\n\n${block}${tokensSection}\n`, "utf8");
    console.log(`updated design/${spec.slug}.mdx`);
  }
  updated++;
}

console.log(`\nDone. ${updated} pages touched.`);
