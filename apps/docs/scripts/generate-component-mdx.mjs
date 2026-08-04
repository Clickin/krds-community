// @ts-nocheck
/**
 * Generate MDX component page files from component-meta data.
 *
 * Reads the canonical component list from component-meta.ts (manually replicated
 * here to keep the script self-contained — see also apps/docs/src/data/component-meta.ts).
 * Creates one MDX file per component in the appropriate category directory under
 * apps/docs/src/content/docs/components/.
 *
 * Usage: node scripts/generate-component-mdx.mjs
 * Run from apps/docs/ (pnpm --filter @krds-community/docs generate:component-mdx)
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "..");

/** Full component list with category mapping (source: component-meta.ts) */
const components = [
  // identity
  { id: "masthead", title: "마스트헤드", category: "identity" },
  { id: "identifier", title: "식별 영역", category: "identity" },
  { id: "header", title: "헤더", category: "identity" },
  { id: "footer", title: "푸터", category: "identity" },
  // navigation
  { id: "skip-link", title: "건너뛰기 링크", category: "navigation" },
  { id: "main-menu-pc", title: "데스크톱 메인 메뉴", category: "navigation" },
  { id: "main-menu-mobile", title: "모바일 메인 메뉴", category: "navigation" },
  { id: "breadcrumb", title: "브레드크럼", category: "navigation" },
  { id: "side-navigation", title: "사이드 내비게이션", category: "navigation" },
  { id: "in-page-navigation", title: "페이지 내 탐색", category: "navigation" },
  { id: "pagination", title: "페이지네이션", category: "navigation" },
  // layout
  { id: "accordion", title: "아코디언", category: "layout" },
  { id: "accordion-line", title: "라인 아코디언", category: "layout" },
  { id: "badge", title: "배지", category: "layout" },
  { id: "badge-number", title: "숫자 배지", category: "layout" },
  { id: "badge-size", title: "배지 크기", category: "layout" },
  { id: "calendar", title: "달력", category: "layout" },
  { id: "calendar-range", title: "기간 달력", category: "layout" },
  { id: "carousel", title: "캐러셀", category: "layout" },
  { id: "carousel-banner", title: "배너 캐러셀", category: "layout" },
  { id: "critical-alerts", title: "긴급 공지", category: "layout" },
  { id: "disclosure", title: "디스클로저", category: "layout" },
  { id: "favicon", title: "파비콘", category: "layout" },
  { id: "modal", title: "모달", category: "layout" },
  { id: "modal-sample", title: "모달 예시", category: "layout" },
  { id: "structured-list", title: "구조화 목록", category: "layout" },
  { id: "structured-list-table", title: "구조화 목록 표", category: "layout" },
  { id: "tab", title: "탭", category: "layout" },
  { id: "table", title: "표", category: "layout" },
  { id: "text-list", title: "텍스트 목록", category: "layout" },
  { id: "text-list-ordered", title: "순서형 텍스트 목록", category: "layout" },
  // action
  { id: "link", title: "링크", category: "action" },
  { id: "button", title: "버튼", category: "action" },
  { id: "button-hierarchy", title: "버튼 계층", category: "action" },
  { id: "button-icon", title: "아이콘 버튼", category: "action" },
  { id: "button-size", title: "버튼 크기", category: "action" },
  { id: "button-text", title: "텍스트 버튼", category: "action" },
  { id: "button-with-icon", title: "아이콘 포함 버튼", category: "action" },
  // selection
  { id: "checkbox", title: "체크박스", category: "selection" },
  { id: "checkbox-chip", title: "체크박스 칩", category: "selection" },
  { id: "checkbox-size", title: "체크박스 크기", category: "selection" },
  { id: "radio", title: "라디오", category: "selection" },
  { id: "radio-button", title: "라디오 버튼", category: "selection" },
  { id: "radio-chip", title: "라디오 칩", category: "selection" },
  { id: "radio-size", title: "라디오 크기", category: "selection" },
  { id: "select", title: "셀렉트", category: "selection" },
  { id: "select-size", title: "셀렉트 크기", category: "selection" },
  { id: "select-sorting", title: "정렬 셀렉트", category: "selection" },
  { id: "select-state", title: "셀렉트 상태", category: "selection" },
  { id: "tag", title: "태그", category: "selection" },
  { id: "tag-link", title: "태그 링크", category: "selection" },
  { id: "switch", title: "스위치", category: "selection" },
  { id: "toggle-switch", title: "토글 스위치", category: "selection" },
  { id: "toggle-switch-size", title: "토글 스위치 크기", category: "selection" },
  // feedback
  { id: "step-indicator", title: "단계 표시기", category: "feedback" },
  { id: "spinner", title: "스피너", category: "feedback" },
  // help
  { id: "help-panel", title: "도움 패널", category: "help" },
  { id: "tutorial-panel", title: "튜토리얼 패널", category: "help" },
  { id: "contextual-help", title: "맥락 도움말", category: "help" },
  { id: "coach-mark", title: "코치 마크", category: "help" },
  { id: "tooltip", title: "툴팁", category: "help" },
  { id: "tooltip-box", title: "박스 툴팁", category: "help" },
  { id: "tooltip-vertical", title: "세로 툴팁", category: "help" },
  { id: "tts", title: "텍스트 읽기", category: "help" },
  { id: "tts-icon", title: "아이콘 텍스트 읽기", category: "help" },
  { id: "tts-size", title: "텍스트 읽기 크기", category: "help" },
  // input
  { id: "date-input", title: "날짜 입력", category: "input" },
  { id: "textarea", title: "텍스트 영역", category: "input" },
  { id: "text-input", title: "텍스트 입력", category: "input" },
  { id: "text-input-icon", title: "아이콘 텍스트 입력", category: "input" },
  { id: "text-input-size", title: "텍스트 입력 크기", category: "input" },
  { id: "text-input-state", title: "텍스트 입력 상태", category: "input" },
  { id: "file-upload", title: "파일 업로드", category: "input" },
  // settings
  { id: "language-switcher", title: "언어 선택", category: "settings" },
  { id: "language-switcher-page", title: "언어별 페이지 선택", category: "settings" },
  { id: "resize", title: "화면 크기 조절", category: "settings" },
];

/** Create the explicit six-framework MDX example owned by each component page. */
function generateMdx(comp) {
  const name = comp.id
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  const angularName = `Krds${name}Component`;
  const astroSlotProps =
    {
      accordion: ` type="default" items={[{ id: 'item-1', title: '첫 번째 항목', content: '첫 번째 항목의 내용입니다.' }]}`,
      "accordion-line": ` type="line" items={[{ id: 'item-1', title: '첫 번째 항목', content: '첫 번째 항목의 내용입니다.' }]}`,
      calendar: ` label="레이블" calendarLabel="달력" year={2024} month={3} years={[2023, 2024, 2025]} leadingDays={5} previousMonthDayCount={29} dayCount={31} weekdays={['일', '월', '화', '수', '목', '금', '토']}`,
      "calendar-range": ` label="기간 선택" calendarLabel="달력" year={2024} month={3} years={[2023, 2024, 2025]} leadingDays={5} previousMonthDayCount={29} dayCount={31} weekdays={['일', '월', '화', '수', '목', '금', '토']}`,
      carousel: ` slides={[{ id: 'slide-1', title: '콘텐츠 제목', description: '콘텐츠 설명', href: '#' }]} previousLabel="이전" nextLabel="다음" moreLabel="더 보기" actionLabel="콘텐츠 보기"`,
      "carousel-banner": ` slides={[{ id: 'slide-1', title: '배너 제목', description: '배너 설명', href: '#' }]} previousLabel="이전" nextLabel="다음" moreLabel="더 보기" playLabel="재생" stopLabel="정지"`,
      "help-panel": ` title="도움말" tabs={[{ id: 'help', label: '도움말', panelId: 'help-panel', value: 'help' }]} selectedLabel="선택됨" helpTitle="도움말" downloadLinks={[]} relatedGroups={[]} tutorialTitle="튜토리얼" tasks={[]} stopLabel="중지" collapseLabel="접기" label="도움 패널"`,
    }[comp.id] ?? "";
  return `---
title: ${comp.title}
description: KRDS ${comp.title} 컴포넌트의 React, Vue, Svelte, SolidJS, Angular, Astro 구현 예제와 설명
category: ${comp.category}
---

import FrameworkPreview from '@docs/FrameworkPreview.astro';
import { ${name} as React${name} } from '@krds-community/react';
import { ${name} as Vue${name} } from '@krds-community/vue';
import { ${name} as Svelte${name} } from '@krds-community/svelte';
import { ${name} as Solid${name} } from '@krds-community/solid';
import { Angular${name} } from '@docs/angular-previews.ts';
import { ${name} as Astro${name} } from '@krds-community/astro';

<FrameworkPreview title="${comp.title}">
  <React${name} slot="react" client:only="react" />
  <Vue${name} slot="vue" client:only="vue" />
  <Svelte${name} slot="svelte" client:only="svelte" />
  <Solid${name} slot="solid" client:only="solid-js" />
  <Angular${name} slot="angular" client:only="@analogjs/astro-angular" />
  <Astro${name} slot="astro"${astroSlotProps} />

  \`\`\`tsx fw=react
  import { ${name} } from '@krds-community/react';
  <${name} />
  \`\`\`
  \`\`\`vue fw=vue
  import { ${name} } from '@krds-community/vue';
  <${name} />
  \`\`\`
  \`\`\`svelte fw=svelte
  import { ${name} } from '@krds-community/svelte';
  <${name} />
  \`\`\`
  \`\`\`tsx fw=solid
  import { ${name} } from '@krds-community/solid';
  <${name} />
  \`\`\`
  \`\`\`ts fw=angular
  import { ${angularName} } from '@krds-community/angular';
  <krds-${comp.id} />
  \`\`\`
  \`\`\`astro fw=astro
  import { ${name} } from '@krds-community/astro';
  <${name} />
  \`\`\`
</FrameworkPreview>
`;
}

const contentDir = resolve(docsDir, "src/content/docs/components");
// Create category directories and write MDX files
const categoryDirs = new Set(components.map((c) => c.category));
for (const cat of categoryDirs) {
  const dir = resolve(contentDir, cat);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

let count = 0;
for (const comp of components) {
  const filePath = resolve(contentDir, comp.category, `${comp.id}.mdx`);
  writeFileSync(filePath, generateMdx(comp), "utf-8");
  count++;
  if (count % 10 === 0 || count === components.length) {
    console.log(`Generated ${count}/${components.length}: ${comp.id}`);
  }
}

console.log(`\nDone! Generated ${count} MDX files across ${categoryDirs.size} categories.`);
