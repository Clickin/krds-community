import { createEffect, createRoot, createSignal, type Component } from "solid-js";
import { render as solidRender } from "solid-js/web";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/html-vite";
import * as Components from "@krds-community/solid";

type StoryArgs = {
  signalValue?: string;
  signalChecked?: boolean;
};
type Story = StoryObj<StoryArgs>;

type FixtureGroup = {
  family: string;
  component: string;
  fixtureIds: readonly string[];
  states: readonly string[];
  props: Record<string, unknown>;
};

type FixtureCase = {
  fixtureId: string;
  family: string;
  component: string;
  states: readonly string[];
  props: Record<string, unknown>;
};

const mandatoryFixtureIds = [
  "accordion-line.default",
  "accordion.default.single",
  "accordion.line.single",
  "badge-number.default",
  "badge-size.default",
  "badge.default",
  "breadcrumb.default",
  "button-hierarchy.default",
  "button-icon.default",
  "button-size.default",
  "button-text.default",
  "button-with-icon.default",
  "button.primary.medium.default",
  "button.secondary.medium.default",
  "button.tertiary.medium.default",
  "calendar-range.default",
  "calendar.default",
  "carousel-banner.default",
  "carousel.default",
  "checkbox-chip.default",
  "checkbox-size.default",
  "checkbox.default.medium",
  "checkbox.default.large",
  "coach-mark.default",
  "contextual-help.default",
  "critical-alerts.default",
  "date-input.default",
  "disclosure.default",
  "favicon.default",
  "file-upload.default",
  "footer.default",
  "header.default",
  "help-panel.default",
  "identifier.default",
  "in-page-navigation.default",
  "language-switcher-page.default",
  "language-switcher.default",
  "link.default",
  "main-menu-mobile.default",
  "main-menu-pc.default",
  "masthead.default",
  "modal-sample.default",
  "modal.default",
  "pagination.default",
  "radio-button.default",
  "radio-chip.default",
  "radio-size.default",
  "radio.default.medium",
  "radio.default.large",
  "resize.default",
  "select-size.default",
  "select-sorting.default",
  "select-state.default",
  "select.default",
  "side-navigation.default",
  "skip-link.default",
  "spinner.default",
  "step-indicator.default",
  "structured-list-table.default",
  "structured-list.default",
  "switch.default.medium",
  "switch.default.large",
  "tab.default",
  "table.default",
  "tag-link.default",
  "tag.default",
  "text-input-icon.default",
  "text-input-size.default",
  "text-input-state.default",
  "text-input.default.medium",
  "text-input.error.medium",
  "text-input.success.medium",
  "text-input.information.medium",
  "text-list-ordered.default",
  "text-list.default",
  "textarea.default",
  "toggle-switch-size.default",
  "toggle-switch.default",
  "tooltip-box.default",
  "tooltip-vertical.default",
  "tooltip.default",
  "tts-icon.default",
  "tts-size.default",
  "tts.default",
  "tutorial-panel.default",
] as const;

const focusStates = ["default", "focus-visible"];
const choiceStates = ["default", "checked", "disabled", "focus-visible"];
const accordionStates = ["collapsed", "expanded", "focus-visible", "keyboard-toggle"];

const navItems = [
  { id: "home", label: "홈", title: "홈", href: "#home", current: true },
  { id: "service", label: "서비스 신청", title: "서비스 신청", href: "#service" },
  { id: "guide", label: "이용 안내", title: "이용 안내", href: "#guide" },
];
const options = [
  { value: "one", label: "첫 번째 항목" },
  { value: "two", label: "두 번째 항목" },
  { value: "three", label: "세 번째 항목" },
];
const languages = [
  { value: "ko", label: "한국어", href: "#", lang: "ko" },
  { value: "en", label: "English (영어)", href: "#", lang: "en" },
  { value: "zh", label: "中文 (중국어)", href: "#", lang: "zh" },
];
const accordionItems = [
  { id: "accordion-one", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
  { id: "accordion-two", title: "두 번째 아코디언", content: "두 번째 내용 영역" },
];
const slides = [
  { id: "slide-one", title: "타이틀 영역", description: "컨텐츠 영역 컨텐츠 영역", href: "#" },
  { id: "slide-two", title: "두 번째 타이틀", description: "두 번째 컨텐츠", href: "#" },
  { id: "slide-three", title: "세 번째 타이틀", description: "세 번째 컨텐츠", href: "#" },
  { id: "slide-four", title: "네 번째 타이틀", description: "네 번째 컨텐츠", href: "#" },
];
const steps = [
  { id: "step-one", label: "단계 레이블" },
  { id: "step-two", label: "단계 레이블" },
  { id: "step-three", label: "단계 레이블" },
  { id: "step-four", label: "단계 레이블" },
  { id: "step-five", label: "단계 레이블" },
];
const listItems = [
  {
    id: "level-one",
    label: "텍스트 목록 레벨1",
    children: [
      { id: "level-two-one", label: "텍스트 목록 레벨2" },
      {
        id: "level-two-two",
        label: "텍스트 목록 레벨2",
        children: [
          { id: "level-three-one", label: "텍스트 목록 레벨3" },
          { id: "level-three-two", label: "텍스트 목록 레벨3" },
        ],
      },
      { id: "level-two-three", label: "텍스트 목록 레벨2" },
    ],
  },
  {
    id: "level-one-two",
    label: "텍스트 목록 레벨1",
    children: [{ id: "level-two-four", label: "텍스트 목록 레벨2" }],
  },
  { id: "level-one-three", label: "텍스트 목록 레벨1" },
];
const tabs = [
  { id: "login-one", label: "타이틀 1" },
  { id: "login-two", label: "타이틀 2" },
];
const panels = { "login-one": "탭 1 영역", "login-two": "탭 2 영역" };
const calendarYears = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025", active: true },
  { value: "2026", label: "2026" },
];
const calendarMonths = [
  { value: "11", label: "11월" },
  { value: "12", label: "12월", active: true },
  { value: "01", label: "1월" },
];
const calendarWeeks = [
  [
    { label: "1", value: "2025-12-01" },
    { label: "2", value: "2025-12-02" },
    { label: "3", value: "2025-12-03" },
    { label: "4", value: "2025-12-04" },
    { label: "5", value: "2025-12-05" },
    { label: "6", value: "2025-12-06" },
    { label: "7", value: "2025-12-07" },
  ],
  [
    { label: "8", value: "2025-12-08" },
    { label: "9", value: "2025-12-09" },
    { label: "10", value: "2025-12-10" },
    { label: "11", value: "2025-12-11" },
    { label: "12", value: "2025-12-12" },
    { label: "13", value: "2025-12-13", disabled: true },
    { label: "14", value: "2025-12-14" },
  ],
  [
    { label: "15", value: "2025-12-15" },
    { label: "16", value: "2025-12-16" },
    { label: "17", value: "2025-12-17" },
    { label: "18", value: "2025-12-18" },
    { label: "19", value: "2025-12-19" },
    { label: "20", value: "2025-12-20" },
    { label: "21", value: "2025-12-21" },
  ],
  [
    { label: "22", value: "2025-12-22" },
    { label: "23", value: "2025-12-23" },
    { label: "24", value: "2025-12-24" },
    { label: "25", value: "2025-12-25" },
    { label: "26", value: "2025-12-26" },
    { label: "27", value: "2025-12-27" },
    { label: "28", value: "2025-12-28" },
  ],
  [
    { label: "29", value: "2025-12-29" },
    { label: "30", value: "2025-12-30" },
    { label: "31", value: "2025-12-31" },
    { label: "1", value: "2026-01-01" },
    { label: "2", value: "2026-01-02" },
    { label: "3", value: "2026-01-03" },
    { label: "4", value: "2026-01-04" },
  ],
];
const calendarActions = [
  { id: "calendar-cancel", label: "취소", variant: "tertiary" },
  { id: "calendar-confirm", label: "확인", variant: "primary" },
];
const calendarProps = {
  calendarLabel: "달력",
  previousLabel: "이전 달",
  nextLabel: "다음 달",
  yearLabel: "연도 선택",
  monthLabel: "월 선택",
  year: "2025",
  month: "12월",
  years: calendarYears,
  months: calendarMonths,
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  weeks: calendarWeeks,
  actions: calendarActions,
};

const desktopLastDepth = [
  { id: "last-one", label: "Last depth", href: "#" },
  { id: "last-two", label: "Last depth" },
  { id: "last-three", label: "Last depth" },
];
const desktopMenuBanner = { badge: "신규 서비스", label: "메뉴명" };
const desktopMenuItems = [
  {
    id: "desktop-depth-1",
    label: "1Depth",
    active: true,
    children: [
      {
        id: "desktop-depth-1-1",
        label: "2Depth",
        active: true,
        title: "2Depth title",
        titleHref: "#",
        titleLinkLabel: "바로가기",
        children: desktopLastDepth,
        banner: desktopMenuBanner,
      },
      {
        id: "desktop-depth-1-2",
        label: "2Depth",
        title: "2Depth title",
        titleHref: "#",
        titleLinkLabel: "바로가기",
        children: [
          { id: "desktop-depth-1-2-1", label: "Last depth", href: "#" },
          { id: "desktop-depth-1-2-2", label: "Last depth" },
          { id: "desktop-depth-1-2-3", label: "Last depth" },
        ],
        banner: desktopMenuBanner,
      },
      {
        id: "desktop-depth-1-3",
        label: "2Depth",
        title: "2Depth title",
        children: desktopLastDepth,
        banner: desktopMenuBanner,
      },
      { id: "desktop-depth-1-4", label: "2Depth", href: "#" },
      {
        id: "desktop-depth-1-5",
        label: "2Depth",
        href: "#",
        target: "_blank",
        title: "새 창 열림",
      },
    ],
  },
  {
    id: "desktop-depth-2",
    label: "1Depth",
    children: [
      {
        id: "desktop-depth-2-1",
        label: "2Depth",
        title: "2Depth title",
        descriptionItems: [
          {
            title: "3Depth title",
            description: "메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.",
            href: "#",
            target: "_blank",
            externalTitle: "새 창 열림",
          },
        ],
        banner: desktopMenuBanner,
      },
      {
        id: "desktop-depth-2-2",
        label: "2Depth",
        title: "2Depth title",
        descriptionItems: [
          {
            title: "3Depth title",
            description: "메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.",
            href: "#",
            target: "_blank",
            externalTitle: "새 창 열림",
          },
        ],
        banner: desktopMenuBanner,
      },
      { id: "desktop-depth-2-3", label: "2Depth", href: "#" },
      {
        id: "desktop-depth-2-4",
        label: "2Depth",
        href: "#",
        target: "_blank",
        title: "새 창 열림",
      },
    ],
  },
  {
    id: "desktop-depth-3",
    label: "1Depth",
    title: "2Depth title",
    children: [
      { id: "desktop-depth-3-1", label: "Last depth", href: "#" },
      { id: "desktop-depth-3-2", label: "Last depth", href: "#" },
      { id: "desktop-depth-3-3", label: "Last depth", href: "#" },
      { id: "desktop-depth-3-4", label: "Last depth", href: "#" },
    ],
    banner: desktopMenuBanner,
  },
  { id: "desktop-link-anchor", label: "링크(anchor)", href: "#" },
  { id: "desktop-link-button", label: "링크(button)", button: true },
];
const mobileMenuItems = [
  {
    id: "mGnb-anchor1",
    label: "1Depth",
    href: "#mGnb-anchor1",
    children: [
      { id: "m-depth-2-1-1", label: "2Depth", href: "#" },
      { id: "m-depth-2-1-2", label: "2Depth", href: "#" },
      { id: "m-depth-2-1-3", label: "2Depth", href: "#" },
    ],
  },
  {
    id: "mGnb-anchor2",
    label: "1Depth",
    href: "#mGnb-anchor2",
    children: [
      { id: "m-depth-2-2-1", label: "2Depth", href: "#" },
      { id: "m-depth-2-2-2", label: "2Depth", href: "#" },
      { id: "m-depth-2-2-3", label: "2Depth", href: "#" },
    ],
  },
  {
    id: "mGnb-anchor3",
    label: "1Depth",
    href: "#mGnb-anchor3",
    children: [
      { id: "m-depth-2-3-1", label: "2Depth", href: "#" },
      { id: "m-depth-2-3-2", label: "2Depth", href: "#" },
      { id: "m-depth-2-3-3", label: "2Depth", href: "#" },
      {
        id: "m-depth-2-3-4",
        label: "2Depth",
        href: "#",
        children: [
          {
            id: "m-depth-3-1",
            label: "3Depth",
            href: "#",
            title: "4Depth title",
            children: [
              { id: "m-depth-4-1", label: "depth title", href: "#" },
              { id: "m-depth-4-2", label: "depth title", href: "#" },
              { id: "m-depth-4-3", label: "depth title", href: "#" },
              { id: "m-depth-4-4", label: "depth title", href: "#" },
            ],
          },
          { id: "m-depth-3-2", label: "3Depth", href: "#" },
          { id: "m-depth-3-3", label: "3Depth", href: "#" },
        ],
      },
    ],
  },
  {
    id: "mGnb-anchor4",
    label: "1Depth",
    href: "#mGnb-anchor4",
    children: [
      { id: "m-depth-2-4-1", label: "2Depth", href: "#" },
      { id: "m-depth-2-4-2", label: "2Depth", href: "#" },
      { id: "m-depth-2-4-3", label: "2Depth", href: "#" },
    ],
  },
  {
    id: "mGnb-anchor5",
    label: "1Depth",
    href: "#mGnb-anchor5",
    children: [
      { id: "m-depth-2-5-1", label: "2Depth", href: "#" },
      { id: "m-depth-2-5-2", label: "2Depth", href: "#" },
      { id: "m-depth-2-5-3", label: "2Depth", href: "#" },
    ],
  },
];
const footerProps = {
  relatedSites: [
    { id: "related-1", label: "related_site", title: "related_site 레이어" },
    { id: "related-2", label: "related_site", title: "related_site 레이어" },
    { id: "related-3", label: "related_site", title: "related_site 레이어" },
    { id: "related-4", label: "related_site", title: "related_site 레이어" },
  ],
  logoLabel: "KRDS - Korea Design System",
  address: "(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단",
  contacts: [
    { title: "대표전화 1577-1000", description: "(유료, 평일 09시~18시)" },
    { title: "해외이용 82-33-811-2001", description: "(유료, 평일 09시~18시)" },
  ],
  links: [
    { label: "찾아오시는 길", href: "#" },
    { label: "이용안내", href: "#" },
    { label: "직원검색", href: "#" },
  ],
  socialLinks: [
    { label: "인스타그램", icon: "instagram", href: "#", target: "_blank", title: "새 창 열기" },
    { label: "유튜브", icon: "youtube", href: "#", target: "_blank", title: "새 창 열기" },
    { label: "X", icon: "sns-x", href: "#", target: "_blank", title: "새 창 열기" },
    { label: "페이스북", icon: "facebook", href: "#", target: "_blank", title: "새 창 열기" },
    { label: "블로그", icon: "blog", href: "#", target: "_blank", title: "새 창 열기" },
  ],
  policyLinks: [
    { label: "개인정보처리방침", href: "#", emphasis: true },
    { label: "저작권 정책", href: "#" },
    { label: "웹 접근성 품질인증 마크 획득", href: "#" },
  ],
  copyright: "© 2023 National Health Insurance Service. All rights reserved.",
  organization: "KRDS - Korea Design System",
  description: "이 누리집은 보건복지부 누리집입니다.",
};
const structuredTableColumns = [
  { key: "selected", label: "선택", width: "5%" },
  { key: "type", label: "유형", width: "10%" },
  { key: "title", label: "제목", width: "15%" },
  { key: "content", label: "내용", width: "30%" },
  { key: "download", label: "다운로드", visuallyHidden: true, width: "10%" },
  { key: "date", label: "게시일", width: "10%" },
];
const structuredTableRows = [
  {
    id: "1",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "2",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "3",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "4",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "5",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "6",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
  {
    id: "7",
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  },
];
const structuredTableProps = {
  className: "sample",
  selectAllLabel: "전체선택",
  actions: [
    { id: "action-1", label: "핵심버튼", icon: "down" },
    { id: "action-2", label: "핵심버튼", icon: "down" },
    { id: "action-3", label: "핵심버튼", icon: "down" },
    { id: "action-4", label: "핵심버튼", icon: "down" },
  ],
  countLabel: "목록 표시 개수",
  countOptions: ["10개", "9개"],
  sortLabel: "정렬기준",
  sortOptions: ["관련도순", "최신순", "인기순"],
  sortValue: "관련도순",
  caption: "000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.",
  columns: structuredTableColumns,
  rows: structuredTableRows,
  pagination: {
    current: 4,
    items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
    previousDisabled: true,
    previousLabel: "이전",
    nextLabel: "다음",
    currentLabel: "현재페이지",
  },
};
const tableProps = {
  caption:
    "000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.",
  columns: [
    { key: "title", label: "제목1", width: "30%" },
    { key: "content", label: "제목2" },
  ],
  rows: [
    { title: "제목1-1", content: "내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다." },
    { title: "제목1-2", content: "내용이 들어갑니다." },
    {
      title: "제목1-3",
      content: "내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.",
    },
  ],
};
const helpDescription =
  "전자문서지갑에서는 전자증명서 출력기능을 제공하지 않으며, 스마트폰 화면을 캡쳐하여 사용할 수 없습니다.";
const helpProps = {
  open: true,
  activeTab: "help",
  tabs: [
    { id: "helperTab01", label: "도움", panelId: "helperTabpanel01", value: "help" },
    { id: "helperTab02", label: "따라하기", panelId: "helperTabpanel02", value: "tutorial" },
  ],
  selectedLabel: "선택됨",
  helpTitle: "전자문서지갑",
  helpDescription,
  downloadLinks: [
    { label: "안드로이드 애플리케이션 다운로드", href: "#", target: "_blank", title: "새 창 열림" },
    { label: "iOS애플리케이션 다운로드", href: "#", target: "_blank", title: "새 창 열림" },
  ],
  relatedGroups: [
    {
      title: "관련서비스/민원",
      links: [
        { label: "영문 주민등록표등본", href: "#" },
        { label: "영문 주민등록표초본", href: "#" },
        { label: "주민등록표등본", href: "#" },
      ],
    },
    {
      title: "기타 문의/도움말",
      links: [
        { label: "민원신청 관련 문의 전화 번호 찾기", href: "#", icon: "call" },
        { label: "자주 묻는 질문 확인하기", href: "#", icon: "faq" },
      ],
    },
  ],
  tutorialTitle: "이사 전 살던 곳 정보 입력하기",
  tutorialBackTitle: "이전으로 돌아가기",
  backTitle: "이전으로 돌아가기",
  externalTitle: "새 창 열림",
  tasks: [
    {
      title: "Task 1: 이사 전에 살던 곳 주소 확인",
      current: true,
      summary: "전체 2단계",
      steps: ["단계1 : 주소조회", "단계2 : 조회 결과 확인"],
    },
    {
      title: "Task 2: 이사 갈 가족 구성원 선택하기",
      summary: "전체 1단계",
      steps: ["단계1 : 주소조회"],
    },
  ],
  stopLabel: "그만 따라하기",
  collapseLabel: "접어두기",
  label: "도움말",
  title: "도움말",
  children: helpDescription,
};

const fixtureGroups: FixtureGroup[] = [
  {
    family: "accordion-line",
    component: "AccordionLine",
    fixtureIds: ["accordion-line.default"],
    states: focusStates,
    props: { items: accordionItems },
  },
  {
    family: "accordion",
    component: "Accordion",
    fixtureIds: ["accordion.default.single"],
    states: accordionStates,
    props: { items: accordionItems, type: "default" },
  },
  {
    family: "accordion",
    component: "Accordion",
    fixtureIds: ["accordion.line.single"],
    states: accordionStates,
    props: { items: accordionItems, type: "line" },
  },
  {
    family: "badge-number",
    component: "BadgeNumber",
    fixtureIds: ["badge-number.default"],
    states: ["default"],
    props: { appearance: "solid", label: "5", number: true },
  },
  {
    family: "badge-size",
    component: "BadgeSize",
    fixtureIds: ["badge-size.default"],
    states: ["default"],
    props: { label: "Label", size: "large" },
  },
  {
    family: "badge",
    component: "Badge",
    fixtureIds: ["badge.default"],
    states: ["default"],
    props: { label: "Label" },
  },
  {
    family: "breadcrumb",
    component: "Breadcrumb",
    fixtureIds: ["breadcrumb.default"],
    states: focusStates,
    props: { items: navItems, label: "현재 경로" },
  },
  {
    family: "button-hierarchy",
    component: "ButtonHierarchy",
    fixtureIds: ["button-hierarchy.default"],
    states: focusStates,
    props: { variant: "primary", children: "버튼 : primary" },
  },
  {
    family: "button-icon",
    component: "ButtonIcon",
    fixtureIds: ["button-icon.default"],
    states: focusStates,
    props: { label: "검색", size: undefined },
  },
  {
    family: "button-size",
    component: "ButtonSize",
    fixtureIds: ["button-size.default"],
    states: focusStates,
    props: { size: "xsmall", children: "x-small 버튼" },
  },
  {
    family: "button-text",
    component: "ButtonText",
    fixtureIds: ["button-text.default"],
    states: focusStates,
    props: { className: "small", children: "텍스트 버튼" },
  },
  {
    family: "button-with-icon",
    component: "ButtonWithIcon",
    fixtureIds: ["button-with-icon.default"],
    states: focusStates,
    props: { className: "xsmall", children: "x-small 버튼" },
  },
  {
    family: "button",
    component: "Button",
    fixtureIds: ["button.primary.medium.default"],
    states: ["default", "hover", "focus-visible", "active", "disabled"],
    props: { variant: "primary", size: "medium", children: "버튼 : primary" },
  },
  {
    family: "button",
    component: "Button",
    fixtureIds: ["button.secondary.medium.default"],
    states: ["default", "focus-visible", "disabled"],
    props: { variant: "secondary", size: "medium", children: "버튼 : secondary" },
  },
  {
    family: "button",
    component: "Button",
    fixtureIds: ["button.tertiary.medium.default"],
    states: ["default", "focus-visible", "disabled"],
    props: { variant: "tertiary", size: "medium", children: "버튼 : tertiary" },
  },
  {
    family: "calendar-range",
    component: "CalendarRange",
    fixtureIds: ["calendar-range.default"],
    states: focusStates,
    props: { label: "기간 선택", ...calendarProps },
  },
  {
    family: "calendar",
    component: "Calendar",
    fixtureIds: ["calendar.default"],
    states: focusStates,
    props: { label: "레이블", ...calendarProps },
  },
  {
    family: "carousel-banner",
    component: "CarouselBanner",
    fixtureIds: ["carousel-banner.default"],
    states: focusStates,
    props: {
      slides: slides.slice(0, 2),
      previousLabel: "이전",
      nextLabel: "다음",
      moreLabel: "더 보기",
      imageLabel: "예시",
      playLabel: "슬라이드 재생",
      stopLabel: "슬라이드 멈춤",
    },
  },
  {
    family: "carousel",
    component: "Carousel",
    fixtureIds: ["carousel.default"],
    states: focusStates,
    props: {
      slides,
      previousLabel: "이전",
      nextLabel: "다음",
      moreLabel: "더 보기",
      imageLabel: "예시",
      actionLabel: "버튼 영역",
    },
  },
  {
    family: "checkbox-chip",
    component: "CheckboxChip",
    fixtureIds: ["checkbox-chip.default"],
    states: focusStates,
    props: { label: "chip 상태 : default", name: "chip-default" },
  },
  {
    family: "checkbox-size",
    component: "CheckboxSize",
    fixtureIds: ["checkbox-size.default"],
    states: focusStates,
    props: { label: "사이즈 : large", size: "large", name: "checkbox-size" },
  },
  {
    family: "checkbox",
    component: "Checkbox",
    fixtureIds: ["checkbox.default.medium"],
    states: ["default", "checked", "disabled", "disabled-checked", "focus-visible"],
    props: { label: "기본", name: "chk_1" },
  },
  {
    family: "checkbox",
    component: "Checkbox",
    fixtureIds: ["checkbox.default.large"],
    states: ["default", "checked", "disabled", "focus-visible"],
    props: { label: "사이즈 : large", name: "chk_2", size: "large" },
  },
  {
    family: "coach-mark",
    component: "CoachMark",
    fixtureIds: ["coach-mark.default"],
    states: focusStates,
    props: {
      title: "따라하기 가이드",
      stepTitle: "1단계 : 코치 마크",
      description: "1단계 코치 마크 내용입니다.",
      contentTitle: "코치 마크 내용",
      currentStep: "1",
      totalSteps: "4",
      stopLabel: "그만보기",
      currentStepLabel: "현재 단계",
      totalStepsLabel: "총 단계",
      nextLabel: "다음으로",
      children: "코치 마크 내용",
    },
  },
  {
    family: "contextual-help",
    component: "ContextualHelp",
    fixtureIds: ["contextual-help.default"],
    states: focusStates,
    props: {
      position: "top-left",
      label: "도움말",
      caption: "예시이미지(상단 왼쪽)",
      message: "도움말",
      title: "도움말 제목",
      description: "컴포넌트 주변의 상세 정보를 제공합니다.",
      children: "컴포넌트 주변의 상세 정보를 제공합니다.",
      linkLabel: "바로가기",
      href: "#",
      closeLabel: "닫기",
    },
  },
  {
    family: "critical-alerts",
    component: "CriticalAlerts",
    fixtureIds: ["critical-alerts.default"],
    states: focusStates,
    props: {
      items: [
        {
          id: "critical-one",
          label: "긴급 안내",
          badge: "danger",
          badgeLabel: "긴급",
          href: "#",
          linkLabel: "자세히 보기",
        },
        { id: "critical-two", label: "중요 안내" },
      ],
      actionLabel: "자세히 보기",
    },
  },
  {
    family: "date-input",
    component: "DateInput",
    fixtureIds: ["date-input.default"],
    states: focusStates,
    props: { label: "레이블", hint: "도움말", ...calendarProps },
  },
  {
    family: "disclosure",
    component: "Disclosure",
    fixtureIds: ["disclosure.default"],
    states: focusStates,
    props: {
      title: "신청 서비스안내",
      items: [
        "하나의 아이디로 안전하고 편리하게 여러 전자정부 서비스를 이용할 수 있는 서비스입니다.",
        "디지털원패스 이용문의 : 1533-3713 (평일9~18시, 공휴일제외)",
      ],
    },
  },
  {
    family: "favicon",
    component: "Favicon",
    fixtureIds: ["favicon.default"],
    states: ["default"],
    props: { href: "/favicon-32x32.png", type: "image/png", size: "32x32" },
  },
  {
    family: "file-upload",
    component: "FileUpload",
    fixtureIds: ["file-upload.default"],
    states: ["default", "focus-visible"],
    props: { label: "파일 첨부", title: "파일 업로드", hint: "첨부할 파일을 선택하세요." },
  },
  {
    family: "footer",
    component: "Footer",
    fixtureIds: ["footer.default"],
    states: focusStates,
    props: footerProps,
  },
  {
    family: "header",
    component: "Header",
    fixtureIds: ["header.default"],
    states: focusStates,
    props: {
      title: "서비스명",
      label: "주 메뉴",
      menuLabel: "메인 메뉴",
      nav: navItems,
      links: navItems,
    },
  },
  {
    family: "help-panel",
    component: "HelpPanel",
    fixtureIds: ["help-panel.default"],
    states: focusStates,
    props: helpProps,
  },
  {
    family: "identifier",
    component: "Identifier",
    fixtureIds: ["identifier.default"],
    states: ["default"],
    props: {
      organization: "KRDS - Korea Design System",
      description: "이 누리집은 보건복지부 누리집입니다.",
    },
  },
  {
    family: "in-page-navigation",
    component: "InPageNavigation",
    fixtureIds: ["in-page-navigation.default"],
    states: focusStates,
    props: {
      title: "이 페이지의 구성",
      pageTitle: "장애아동수당",
      actionLabel: "온라인 신청하기",
      actionInfo: "장애아동수당 외",
      actionCount: "1건",
      items: navItems,
    },
  },
  {
    family: "language-switcher-page",
    component: "LanguageSwitcherPage",
    fixtureIds: ["language-switcher-page.default"],
    states: focusStates,
    props: {
      languages,
      options: languages,
      selected: "ko",
      defaultValue: "ko",
      label: "언어 변경",
      selectedLabel: "선택됨",
      currentLabel: "현재 언어",
      text: "현재 언어",
      externalTitle: "새 창 열림",
    },
  },
  {
    family: "language-switcher",
    component: "LanguageSwitcher",
    fixtureIds: ["language-switcher.default"],
    states: focusStates,
    props: {
      languages,
      options: languages,
      selected: "ko",
      defaultValue: "ko",
      label: "언어 변경",
      selectedLabel: "선택됨",
      currentLabel: "현재 언어",
      text: "현재 언어",
      externalTitle: "새 창 열림",
    },
  },
  {
    family: "link",
    component: "Link",
    fixtureIds: ["link.default"],
    states: focusStates,
    props: {
      href: "#link",
      label: "기본 링크",
      children: "기본 링크",
      external: true,
      target: "_blank",
      size: "small",
      title: "새 창 열림",
    },
  },
  {
    family: "main-menu-mobile",
    component: "MainMenuMobile",
    fixtureIds: ["main-menu-mobile.default"],
    states: focusStates,
    props: {
      className: "sample",
      style: { display: "block", position: "static", visibility: "visible" },
      utilityItems: [
        { id: "utility-1", label: "메뉴명" },
        { id: "utility-2", label: "메뉴명" },
      ],
      loginLabel: "로그인을 해주세요",
      serviceItems: [
        { id: "service-1", label: "메뉴명", href: "#" },
        { id: "service-2", label: "메뉴명", href: "#" },
        { id: "service-3", label: "메뉴명", href: "#" },
        { id: "service-4", label: "메뉴명", href: "#" },
      ],
      searchPlaceholder: "찾고자 하는 메뉴명을 입력해 주세요",
      searchTitle: "찾고자 하는 메뉴명 입력",
      searchLabel: "검색",
      items: mobileMenuItems,
      previousLabel: "이전화면",
      closeLabel: "전체메뉴 닫기",
      bottomItems: [
        { label: "메뉴명", href: "#" },
        { label: "메뉴명", href: "#", target: "_blank", title: "새 창 열기" },
      ],
    },
  },
  {
    family: "main-menu-pc",
    component: "MainMenuPc",
    fixtureIds: ["main-menu-pc.default"],
    states: focusStates,
    props: { className: "sample", menuLabel: "메인 메뉴", items: desktopMenuItems },
  },
  {
    family: "masthead",
    component: "Masthead",
    fixtureIds: ["masthead.default"],
    states: ["default"],
    props: { message: "이 누리집은 대한민국 공식 전자정부 누리집입니다." },
  },
  {
    family: "modal-sample",
    component: "ModalSample",
    fixtureIds: ["modal-sample.default"],
    states: ["default", "focus-visible"],
    props: {
      id: "solid-modal-sample",
      open: true,
      title: "모달 제목",
      label: "닫기",
      description: "대화 상자 안내 내용입니다.",
    },
  },
  {
    family: "modal",
    component: "Modal",
    fixtureIds: ["modal.default"],
    states: ["default", "focus-visible"],
    props: {
      id: "solid-modal-default",
      open: true,
      title: "모달 제목",
      label: "닫기",
      description: "대화 상자는 중요한 정보를 안내합니다.",
    },
  },
  {
    family: "pagination",
    component: "Pagination",
    fixtureIds: ["pagination.default"],
    states: focusStates,
    props: {
      current: 4,
      items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
      title: "이전",
      label: "다음",
      message: "현재페이지",
      previousDisabled: true,
      previousLabel: "이전",
      nextLabel: "다음",
    },
  },
  {
    family: "radio-button",
    component: "RadioButton",
    fixtureIds: ["radio-button.default"],
    states: focusStates,
    props: { label: "기본", name: "rdo-button", value: "one" },
  },
  {
    family: "radio-chip",
    component: "RadioChip",
    fixtureIds: ["radio-chip.default"],
    states: focusStates,
    props: { label: "chip 상태 : default", name: "rdo-chip", value: "one" },
  },
  {
    family: "radio-size",
    component: "RadioSize",
    fixtureIds: ["radio-size.default"],
    states: focusStates,
    props: { label: "사이즈 : medium", name: "rdo-size", value: "one", size: "medium" },
  },
  {
    family: "radio",
    component: "Radio",
    fixtureIds: ["radio.default.medium"],
    states: choiceStates,
    props: { label: "기본", name: "rdo_1", value: "one" },
  },
  {
    family: "radio",
    component: "Radio",
    fixtureIds: ["radio.default.large"],
    states: choiceStates,
    props: { label: "사이즈 : large", name: "rdo_2", value: "one", size: "large" },
  },
  {
    family: "resize",
    component: "Resize",
    fixtureIds: ["resize.default"],
    states: focusStates,
    props: {
      label: "화면크기",
      selected: "md",
      defaultValue: "md",
      selectedLabel: "선택됨",
      resetLabel: "초기화",
      options: [
        { value: "sm", label: "작게" },
        { value: "md", label: "보통" },
        { value: "lg", label: "조금 크게" },
        { value: "xlg", label: "크게" },
        { value: "xxlg", label: "가장 크게" },
      ],
    },
  },
  {
    family: "select-size",
    component: "SelectSize",
    fixtureIds: ["select-size.default"],
    states: focusStates,
    props: { label: "레이블", hint: "도움말", title: "선택", size: "large", options },
  },
  {
    family: "select-sorting",
    component: "SelectSorting",
    fixtureIds: ["select-sorting.default"],
    states: focusStates,
    props: { label: "정렬 기준", hint: "도움말", title: "선택", options },
  },
  {
    family: "select-state",
    component: "SelectState",
    fixtureIds: ["select-state.default"],
    states: focusStates,
    props: { label: "레이블", hint: "도움말", title: "선택", state: "error", options },
  },
  {
    family: "select",
    component: "Select",
    fixtureIds: ["select.default"],
    states: focusStates,
    props: { label: "레이블", hint: "도움말", title: "선택", options },
  },
  {
    family: "side-navigation",
    component: "SideNavigation",
    fixtureIds: ["side-navigation.default"],
    states: focusStates,
    props: {
      title: "1Depth-title",
      items: [
        {
          id: "depth-2-1",
          label: "2Depth-menu",
          children: [
            {
              id: "depth-3-1",
              label: "3Depth-menu",
              description: "3Depth-title",
              children: [
                { id: "depth-4-1", label: "4Depth", href: "#" },
                { id: "depth-4-2", label: "4Depth", href: "#" },
                { id: "depth-4-3", label: "4Depth", href: "#" },
              ],
            },
            { id: "depth-3-link", label: "3Depth-link", href: "#", current: true },
          ],
        },
      ],
    },
  },
  {
    family: "skip-link",
    component: "SkipLink",
    fixtureIds: ["skip-link.default"],
    states: focusStates,
    props: { href: "#breadcrumb", label: "본문 바로가기", children: "본문 바로가기" },
  },
  {
    family: "spinner",
    component: "Spinner",
    fixtureIds: ["spinner.default"],
    states: ["default"],
    props: { label: "로딩 중" },
  },
  {
    family: "step-indicator",
    component: "StepIndicator",
    fixtureIds: ["step-indicator.default"],
    states: ["default"],
    props: { current: 3, label: "단계", message: "현재단계", steps },
  },
  {
    family: "structured-list-table",
    component: "StructuredListTable",
    fixtureIds: ["structured-list-table.default"],
    states: ["default", "focus-visible"],
    props: structuredTableProps,
  },
  {
    family: "structured-list",
    component: "StructuredList",
    fixtureIds: ["structured-list.default"],
    states: focusStates,
    props: { items: listItems },
  },
  {
    family: "switch",
    component: "Switch",
    fixtureIds: ["switch.default.medium"],
    states: choiceStates,
    props: { label: "switch : default", name: "switch-medium" },
  },
  {
    family: "switch",
    component: "Switch",
    fixtureIds: ["switch.default.large"],
    states: choiceStates,
    props: { label: "switch size : large", name: "switch-large", size: "large" },
  },
  {
    family: "tab",
    component: "Tab",
    fixtureIds: ["tab.default"],
    states: focusStates,
    props: {
      tabs,
      panels,
      defaultValue: "login-one",
      message: "선택됨",
      panelTitle: "탭 영역 타이틀",
    },
  },
  {
    family: "table",
    component: "Table",
    fixtureIds: ["table.default"],
    states: ["default"],
    props: tableProps,
  },
  {
    family: "tag-link",
    component: "TagLink",
    fixtureIds: ["tag-link.default"],
    states: focusStates,
    props: { href: "#", label: "태그" },
  },
  {
    family: "tag",
    component: "Tag",
    fixtureIds: ["tag.default"],
    states: focusStates,
    props: { label: "태그", removable: true, message: "삭제" },
  },
  {
    family: "text-input-icon",
    component: "TextInputIcon",
    fixtureIds: ["text-input-icon.default"],
    states: focusStates,
    props: {
      label: "레이블",
      type: "password",
      value: "1234567890",
      placeholder: "8-12자의 영문자, 숫자, 특수문자 조합",
    },
  },
  {
    family: "text-input-size",
    component: "TextInputSize",
    fixtureIds: ["text-input-size.default"],
    states: focusStates,
    props: {
      label: "레이블",
      hint: "도움말",
      placeholder: "플레이스홀더",
      size: "small",
      type: "text",
    },
  },
  {
    family: "text-input-state",
    component: "TextInputState",
    fixtureIds: ["text-input-state.default"],
    states: focusStates,
    props: {
      label: "레이블",
      error: "에러 메시지",
      hint: "에러 메시지",
      placeholder: "플레이스홀더",
      state: "error",
      type: "text",
      value: "에러",
    },
  },
  {
    family: "text-input",
    component: "TextInput",
    fixtureIds: ["text-input.default.medium"],
    states: ["default", "placeholder", "readonly", "disabled", "focus-visible"],
    props: {
      label: "레이블",
      hint: "도움말",
      placeholder: "플레이스홀더",
      type: "text",
      state: "default",
    },
  },
  {
    family: "text-input",
    component: "TextInput",
    fixtureIds: ["text-input.error.medium"],
    states: ["invalid", "focus-visible"],
    props: { label: "레이블", hint: "에러 메시지", state: "error", type: "text", value: "에러" },
  },
  {
    family: "text-input",
    component: "TextInput",
    fixtureIds: ["text-input.success.medium"],
    states: ["default", "focus-visible"],
    props: { label: "레이블", hint: "성공 메시지", state: "success", type: "text", value: "성공" },
  },
  {
    family: "text-input",
    component: "TextInput",
    fixtureIds: ["text-input.information.medium"],
    states: ["default", "focus-visible"],
    props: {
      label: "레이블",
      hint: "정보 메시지",
      state: "information",
      type: "text",
      value: "정보",
    },
  },
  {
    family: "text-list-ordered",
    component: "TextListOrdered",
    fixtureIds: ["text-list-ordered.default"],
    states: ["default"],
    props: { items: listItems },
  },
  {
    family: "text-list",
    component: "TextList",
    fixtureIds: ["text-list.default"],
    states: ["default"],
    props: { items: listItems },
  },
  {
    family: "textarea",
    component: "Textarea",
    fixtureIds: ["textarea.default"],
    states: ["default", "focus-visible"],
    props: { label: "레이블", hint: "도움말", placeholder: "플레이스홀더" },
  },
  {
    family: "toggle-switch-size",
    component: "ToggleSwitchSize",
    fixtureIds: ["toggle-switch-size.default"],
    states: focusStates,
    props: { label: "switch size : large", size: "large", name: "toggle-size" },
  },
  {
    family: "toggle-switch",
    component: "ToggleSwitch",
    fixtureIds: ["toggle-switch.default"],
    states: focusStates,
    props: { label: "switch : default", name: "toggle" },
  },
  {
    family: "tooltip-box",
    component: "TooltipBox",
    fixtureIds: ["tooltip-box.default"],
    states: focusStates,
    props: {
      label: "tooltip-box",
      message: "tooltip-box 툴팁은 150자 내외의 텍스트만 제공되어야 합니다.",
      children: "tooltip-box",
    },
  },
  {
    family: "tooltip-vertical",
    component: "TooltipVertical",
    fixtureIds: ["tooltip-vertical.default"],
    states: focusStates,
    props: {
      label: "tooltip-vertical",
      message: "tooltip-vertical 옵션입니다.",
      children: "tooltip-vertical",
    },
  },
  {
    family: "tooltip",
    component: "Tooltip",
    fixtureIds: ["tooltip.default"],
    states: focusStates,
    props: {
      label: "tooltip-horizontal",
      message: "툴팁의 기본 설정입니다.",
      children: "tooltip-horizontal",
    },
  },
  {
    family: "tts-icon",
    component: "TtsIcon",
    fixtureIds: ["tts-icon.default"],
    states: focusStates,
    props: { label: "읽어주기" },
  },
  {
    family: "tts-size",
    component: "TtsSize",
    fixtureIds: ["tts-size.default"],
    states: focusStates,
    props: { size: "xsmall", label: "Xsmall TTS", children: "Xsmall TTS" },
  },
  {
    family: "tts",
    component: "Tts",
    fixtureIds: ["tts.default"],
    states: focusStates,
    props: { label: "레이블", text: "화면의 안내를 음성으로 읽어줍니다.", children: "레이블" },
  },
  {
    family: "tutorial-panel",
    component: "TutorialPanel",
    fixtureIds: ["tutorial-panel.default"],
    states: focusStates,
    props: { ...helpProps, activeTab: "tutorial" },
  },
];

const fixtureCases: FixtureCase[] = fixtureGroups.flatMap((group) =>
  group.fixtureIds.map((fixtureId) => ({
    fixtureId,
    family: group.family,
    component: group.component,
    states: group.states,
    props: group.props,
  })),
);

const meta = {
  title: "SolidJS/Manifest fixtures",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    fixtureIds: mandatoryFixtureIds,
    fixtureFamilies: fixtureGroups.map((group) => group.family),
  },
  argTypes: {
    signalValue: { control: "text", description: "Signal-driven text input initial value" },
    signalChecked: { control: "boolean", description: "Signal-driven checkbox initial state" },
  },
} satisfies Meta<StoryArgs>;

export default meta;

const mount = (component: unknown, props: Record<string, unknown>, target: HTMLElement) => {
  solidRender(
    () => createComponent(component as Component<Record<string, unknown>>, props),
    target,
  );
};

const matrixStyles = "display:grid;gap:var(--krds-spacing-6, 1.5rem);max-width:64rem";

const renderFixtureCase = (fixture: FixtureCase) => {
  const section = document.createElement("section");
  section.dataset.fixtureId = fixture.fixtureId;
  section.dataset.fixtureFamily = fixture.family;
  section.style.cssText =
    "display:grid;gap:.5rem;padding:1rem;border:1px solid var(--krds-color-border)";

  const heading = document.createElement("h2");
  heading.textContent = `${fixture.family} · ${fixture.fixtureId}`;
  heading.style.cssText = "font-size:1rem;margin:0";
  section.append(heading);

  const stateText = document.createElement("p");
  stateText.textContent = `공식 상태: ${fixture.states.join(" · ")}`;
  stateText.style.cssText = "margin:0;color:var(--krds-color-text-secondary)";
  section.append(stateText);

  const stage = document.createElement("div");
  stage.setAttribute("aria-label", `${fixture.fixtureId} 렌더링`);
  section.append(stage);
  mount((Components as Record<string, unknown>)[fixture.component], fixture.props, stage);
  return section;
};

export const ManifestMatrix: Story = {
  name: "전체 manifest/public matrix · 85 fixtures",
  parameters: {
    a11y: { test: "error" },
    fixtureIds: mandatoryFixtureIds,
    fixtureStates: fixtureGroups.map((group) => ({ family: group.family, states: group.states })),
    docs: {
      description: {
        story:
          "conformance/manifests의 mandatory 85개 fixture를 public export 이름과 함께 한 행씩 탐색합니다. 각 행에는 공식 variant/state 계약이 표시되고 실제 Solid component가 mount됩니다.",
      },
    },
  },
  render: () => {
    const root = document.createElement("main");
    root.setAttribute("aria-label", "SolidJS manifest fixture matrix");
    root.style.cssText = matrixStyles;
    const intro = document.createElement("header");
    intro.style.cssText = "display:grid;gap:.5rem";
    const title = document.createElement("h1");
    title.textContent = "KRDS SolidJS · manifest fixture matrix";
    title.style.cssText = "margin:0";
    const description = document.createElement("p");
    description.textContent = `${fixtureCases.length} mandatory fixture rows · ${fixtureGroups.length} public families`;
    description.style.cssText = "margin:0;color:var(--krds-color-text-secondary)";
    intro.append(title, description);
    root.append(intro);
    fixtureCases.forEach((fixture) => root.append(renderFixtureCase(fixture)));
    return root;
  },
};

const renderSignalDrivenForm = (initialValue: string, initialChecked: boolean) => {
  const root = document.createElement("main");
  root.setAttribute("aria-label", "Solid signal driven form");
  root.style.cssText = "display:grid;gap:1rem;max-width:32rem";
  const title = document.createElement("h2");
  title.textContent = "Signal-driven Solid props";
  title.style.cssText = "margin:0";
  root.append(title);

  const form = document.createElement("form");
  form.setAttribute("aria-label", "프로필 입력");
  form.style.cssText = "display:grid;gap:1rem";
  const inputTarget = document.createElement("div");
  const checkboxTarget = document.createElement("div");
  const buttonTarget = document.createElement("div");
  const status = document.createElement("output");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const refIndicator = document.createElement("small");
  refIndicator.textContent = "native ref 연결 대기 중";
  form.append(inputTarget, checkboxTarget, buttonTarget, status, refIndicator);
  root.append(form);

  let inputRef: HTMLInputElement | undefined;
  createRoot(() => {
    const [value, setValue] = createSignal(initialValue);
    const [checked, setChecked] = createSignal(initialChecked);
    const [submitted, setSubmitted] = createSignal(false);

    createEffect(() => {
      const currentValue = value();
      status.textContent = `현재 값: ${currentValue || "비어 있음"} · 약관: ${checked() ? "동의" : "미동의"}${submitted() ? " · 제출 완료" : ""}`;
      if (inputRef) inputRef.dataset.signalValue = currentValue;
    });

    mount(
      Components.TextInput,
      {
        id: "solid-signal-input",
        name: "name",
        label: "이름",
        hint: "입력 값이 signal getter로 연결됩니다.",
        get value() {
          return value();
        },
        ref: (node: HTMLInputElement) => {
          inputRef = node;
          node.dataset.refBound = "true";
          refIndicator.textContent = `native ref 연결됨 · ${node.id}`;
        },
        onInput: (event: InputEvent & { currentTarget: HTMLInputElement }) => {
          setValue(event.currentTarget.value);
          setSubmitted(false);
        },
      },
      inputTarget,
    );
    mount(
      Components.Checkbox,
      {
        id: "solid-signal-terms",
        label: "약관에 동의합니다.",
        name: "terms",
        get checked() {
          return checked();
        },
        onChange: (event: Event & { currentTarget: HTMLInputElement }) => {
          setChecked(event.currentTarget.checked);
          setSubmitted(false);
        },
      },
      checkboxTarget,
    );
    mount(Components.Button, { type: "submit", children: "제출" }, buttonTarget);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (inputRef) inputRef.focus();
      setSubmitted(true);
    });
  });
  return root;
};

export const SignalDrivenForm: Story = {
  name: "Solid signals · refs · native form events",
  args: { signalValue: "", signalChecked: false },
  render: (args) => renderSignalDrivenForm(args.signalValue ?? "", args.signalChecked ?? false),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "이름" });
    await expect(input).toHaveAttribute("data-ref-bound", "true");
    await userEvent.type(input, "홍길동");
    await expect(canvas.getByRole("status")).toHaveTextContent("홍길동");
    const checkbox = canvas.getByRole("checkbox", { name: "약관에 동의합니다." });
    await userEvent.click(checkbox);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      args.signalChecked ? "미동의" : "동의",
    );
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("제출 완료");
  },
  parameters: {
    a11y: { test: "error" },
    fixtureIds: [
      "text-input.default.medium",
      "checkbox.default.medium",
      "button.primary.medium.default",
    ],
    fixtureStates: ["default", "focus-visible", "checked"],
    docs: {
      description: {
        story:
          "Solid props는 spread/destructure하지 않고 getter로 signal을 읽습니다. native ref, input/change/submit 이벤트, accessible form semantics를 한 흐름에서 확인합니다.",
      },
    },
  },
};

export const A11yInteractions: Story = {
  name: "A11y interactions · keyboard and dialog",
  render: () => {
    const root = document.createElement("main");
    root.setAttribute("aria-label", "Solid accessibility interactions");
    root.style.cssText = matrixStyles;
    const modalTarget = document.createElement("div");
    root.append(modalTarget);
    createRoot(() => {
      const [modalOpen, setModalOpen] = createSignal(true);
      mount(
        Components.Accordion,
        {
          items: [
            {
              id: "a11y-accordion",
              title: "접근성 아코디언",
              content: "키보드로 열 수 있는 내용입니다.",
            },
          ],
        },
        root,
      );
      mount(Components.Tab, { tabs, panels, defaultValue: "login-one", message: "선택됨" }, root);
      mount(
        Components.Modal,
        {
          id: "a11y-modal",
          get open() {
            return modalOpen();
          },
          onClose: () => setModalOpen(false),
          title: "접근성 모달",
          label: "닫기",
          description: "dialog 이름과 닫기 동작을 확인합니다.",
        },
        modalTarget,
      );
    });
    return root;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordionTrigger = canvas.getByRole("button", { name: "접근성 아코디언" });
    accordionTrigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(accordionTrigger).toHaveAttribute("aria-expanded", "true");
    const secondTab = canvas.getByRole("tab", { name: "타이틀 2" });
    secondTab.focus();
    await userEvent.keyboard("{Enter}");
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("dialog", { name: "접근성 모달" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
  parameters: {
    a11y: { test: "error" },
    fixtureIds: ["accordion.default.single", "tab.default", "modal.default"],
    fixtureStates: ["collapsed", "expanded", "keyboard-toggle", "focus-visible"],
    docs: {
      description: {
        story:
          "Accordion/Tab/Modal의 accessible name, expanded/selected semantics와 click/keyboard 경로를 play interaction으로 탐색합니다.",
      },
    },
  },
};
