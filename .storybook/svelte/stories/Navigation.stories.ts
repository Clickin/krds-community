import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import AdditionalShowcase from "./AdditionalShowcase.svelte";

const meta = {
  title: "Svelte/탐색·사이트 구조",
  component: AdditionalShowcase,
  parameters: { layout: "padded", a11y: { test: "error" } },
  argTypes: {
    component: {
      control: "select",
      options: [
        "Breadcrumb",
        "Footer",
        "Header",
        "InPageNavigation",
        "LanguageSwitcher",
        "LanguageSwitcherPage",
        "MainMenuMobile",
        "MainMenuPc",
        "SideNavigation",
      ],
    },
    componentProps: { control: "object" },
    eventLabel: { control: "text" },
  },
} satisfies Meta<AdditionalShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixtureParameters = (fixtureId: string, fixtureStates: string[]) => ({
  fixtureIds: [fixtureId],
  fixtureId,
  fixtureStates,
  a11y: { test: "error" },
});

const navigationItems = [
  { id: "one", label: "첫 번째 항목", title: "첫 번째 항목", href: "#one", current: true },
  { id: "two", label: "두 번째 항목", title: "두 번째 항목", href: "#two" },
];
const headerUtilityItems = [
  {
    id: "utility-external",
    kind: "link",
    label: "메뉴명",
    href: "#",
    target: "_blank",
    title: "새 창 열기",
  },
  {
    id: "utility-dropdown",
    kind: "dropdown",
    label: "메뉴명",
    items: [
      { id: "utility-dropdown-1", label: "메뉴명", href: "#" },
      { id: "utility-dropdown-2", label: "메뉴명", href: "#" },
    ],
  },
  {
    id: "utility-resize",
    kind: "resize",
    label: "메뉴명",
    items: ["sm", "md", "lg", "xlg", "xxlg"].map((className) => ({
      id: `utility-resize-${className}`,
      label: "메뉴명",
      className,
      selected: className === "md",
    })),
    selectedLabel: "선택됨",
    resetLabel: "초기화",
  },
  {
    id: "utility-external-dropdown",
    kind: "dropdown",
    label: "메뉴명",
    items: Array.from({ length: 3 }, (_, index) => ({
      id: `utility-external-${index + 1}`,
      label: "메뉴명",
      href: "#",
      target: "_blank",
      title: "새 창 열림",
      className: "ico-go",
    })),
  },
];

export const Breadcrumb: Story = {
  name: "Breadcrumb · three levels",
  args: {
    component: "Breadcrumb",
    componentProps: {
      id: "svelte-breadcrumb",
      items: [
        { id: "home", label: "홈", href: "#" },
        { id: "service", label: "서비스 신청", href: "#" },
        { id: "service-2", label: "서비스 신청2", href: "#" },
      ],
    },
    eventLabel: "브레드크럼",
  },
  parameters: { ...fixtureParameters("breadcrumb.default", ["default", "focus-visible"]) },
};

export const Header: Story = {
  name: "Header · navigation and search affordance",
  args: {
    component: "Header",
    componentProps: {
      id: "krds-header",
      menuLabel: "메인 메뉴",
      title: "서비스명",
      href: "#service",
      nav: navigationItems,
      links: navigationItems,
      items: navigationItems,
      open: false,
      utilityItems: headerUtilityItems,
      logoLabel: "KRDS - Korea Design System",
      logoHref: "#",
      searchLabel: "통합검색",
      searchTitle: "통합검색 레이어",
      loginLabel: "로그인",
      loginHref: "#",
      joinLabel: "회원가입",
      allMenuLabel: "전체메뉴",
      desktopItems: navigationItems,
    },
    eventLabel: "헤더",
  },
  parameters: { ...fixtureParameters("header.default", ["default", "focus-visible"]) },
};

export const InPageNavigation: Story = {
  name: "In-page navigation · service outline",
  args: {
    component: "InPageNavigation",
    componentProps: {
      id: "svelte-in-page-navigation",
      title: "이 페이지의 구성",
      pageTitle: "장애아동수당",
      actionLabel: "온라인 신청하기",
      actionInfo: "장애아동수당 외",
      actionCount: "1건",
      items: [
        { id: "section_01", label: "서비스 개요", href: "#section_01", current: true },
        { id: "section_02", label: "서비스 상세", href: "#section_02" },
        { id: "section_03", label: "신청 방법 및 절차", href: "#section_03" },
        { id: "section_04", label: "제출 서류", href: "#section_04" },
        { id: "section_05", label: "함께 신청할 수 있는 서비스", href: "#section_05" },
        { id: "section_06", label: "부가정보", href: "#section_06" },
        { id: "section_07", label: "정보 변경 내역", href: "#section_07" },
      ],
    },
    eventLabel: "페이지 내비게이션",
  },
  parameters: { ...fixtureParameters("in-page-navigation.default", ["default", "focus-visible"]) },
};

const languages = [
  { value: "ko", label: "한국어", href: "#", lang: "ko" },
  { value: "en", label: "English (영어)", href: "#", lang: "en" },
  { value: "zh", label: "中文 (중국어)", href: "#", lang: "zh" },
  { value: "ja", label: "日本語 (일본어)", href: "#", lang: "ja" },
  { value: "fr", label: "français (프랑스어)", href: "#", lang: "fr" },
];

const languageProps = {
  id: "svelte-language-switcher",
  languages,
  options: languages,
  selected: "ko",
  defaultValue: "ko",
  label: "언어 변경",
  selectedLabel: "선택됨",
  currentLabel: "현재 언어",
  text: "현재 언어",
  externalTitle: "새 창 열림",
};

export const LanguageSwitcher: Story = {
  name: "Language switcher · current Korean",
  args: { component: "LanguageSwitcher", componentProps: languageProps, eventLabel: "언어 선택" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /언어 변경/ }));
    await userEvent.click(canvas.getByRole("link", { name: "English (영어)" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("click");
  },
  parameters: { ...fixtureParameters("language-switcher.default", ["default", "focus-visible"]) },
};

export const LanguageSwitcherPage: Story = {
  name: "Language switcher · page links",
  args: {
    component: "LanguageSwitcherPage",
    componentProps: {
      ...languageProps,
      id: "svelte-language-switcher-page",
      title: "현재 언어",
      description: "한국어",
      message: "새 창 열림",
    },
    eventLabel: "페이지 언어 선택",
  },
  parameters: {
    ...fixtureParameters("language-switcher-page.default", ["default", "focus-visible"]),
  },
};

const lastDepth = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `last-${index + 1}`,
    label: "Last depth",
    href: index === 0 ? "#" : undefined,
  }));

const pcBanner = { badge: "신규 서비스", label: "메뉴명" };

const mainMenuPcItems = [
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
        children: lastDepth(2),
        banner: pcBanner,
      },
      {
        id: "desktop-depth-1-2",
        label: "2Depth",
        title: "2Depth title",
        titleHref: "#",
        titleLinkLabel: "바로가기",
        children: lastDepth(3),
        banner: pcBanner,
      },
      {
        id: "desktop-depth-1-3",
        label: "2Depth",
        title: "2Depth title",
        children: lastDepth(3),
        banner: pcBanner,
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
        banner: pcBanner,
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
        banner: pcBanner,
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
    children: lastDepth(10).map((item) => ({ ...item, href: "#" })),
    banner: pcBanner,
  },
  { id: "desktop-link-anchor", label: "링크(anchor)", href: "#" },
  { id: "desktop-link-button", label: "링크(button)", button: true },
];

export const MainMenuPc: Story = {
  name: "Main menu · desktop depth 1–3",
  args: {
    component: "MainMenuPc",
    componentProps: {
      id: "svelte-main-menu-pc",
      className: "sample",
      sample: true,
      menuLabel: "메인 메뉴",
      title: "메인 메뉴",
      items: mainMenuPcItems,
    },
    eventLabel: "PC 주 메뉴",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "메인 메뉴" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "링크(anchor)" })).toHaveAttribute("href", "#");
  },
  parameters: { ...fixtureParameters("main-menu-pc.default", ["default", "focus-visible"]) },
};

const mobileItems = Array.from({ length: 5 }, (_, index) => ({
  id: `mGnb-anchor${index + 1}`,
  label: "1Depth",
  href: `#mGnb-anchor${index + 1}`,
  children: Array.from({ length: index === 2 ? 4 : 3 }, (_, childIndex) => ({
    id: `m-depth-2-${index + 1}-${childIndex + 1}`,
    label: "2Depth",
    href: "#",
    children:
      index === 2 && childIndex === 3
        ? [
            {
              id: "m-depth-3-1",
              label: "3Depth",
              href: "#",
              title: "4Depth title",
              children: Array.from({ length: 4 }, (_, leafIndex) => ({
                id: `m-depth-4-${leafIndex + 1}`,
                label: "depth title",
                href: "#",
              })),
            },
            { id: "m-depth-3-2", label: "3Depth", href: "#" },
            { id: "m-depth-3-3", label: "3Depth", href: "#" },
          ]
        : undefined,
  })),
}));

const mobileSearchPlaceholder = "찾고자 하는 메뉴명을 입력해 주세요";
const mobileSearchTitle = "찾고자 하는 메뉴명 입력";
const mobileSearchLabel = "검색";

export const MainMenuMobile: Story = {
  name: "Main menu · mobile depth 1–4",
  args: {
    component: "MainMenuMobile",
    componentProps: {
      id: "svelte-main-menu-mobile",
      className: "sample",
      sample: true,
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
      searchPlaceholder: mobileSearchPlaceholder,
      searchTitle: mobileSearchTitle,
      searchLabel: mobileSearchLabel,
      items: mobileItems,
      previousLabel: "이전화면",
      closeLabel: "전체메뉴 닫기",
      bottomItems: [
        { label: "메뉴명", href: "#" },
        { label: "메뉴명", href: "#", target: "_blank", title: "새 창 열기" },
      ],
      placeholder: mobileSearchPlaceholder,
      message: mobileSearchTitle,
      actionLabel: mobileSearchLabel,
      label: "전체 메뉴",
    },
    eventLabel: "모바일 주 메뉴",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation")).toBeVisible();
    await expect(canvas.getByRole("search")).toBeVisible();
    await expect(canvas.getByRole("search").querySelector("input")).toHaveAttribute(
      "placeholder",
      mobileSearchPlaceholder,
    );
  },
  parameters: { ...fixtureParameters("main-menu-mobile.default", ["default", "focus-visible"]) },
};

const sideNavigationItems = Array.from({ length: 3 }, (_, topIndex) => ({
  id: `depth-2-${topIndex + 1}`,
  label: "2Depth-menu",
  children: [
    {
      id: `depth-3-menu-${topIndex + 1}`,
      label: "3Depth-menu",
      description: "3Depth-title",
      children: Array.from({ length: 3 }, (_, leafIndex) => ({
        id: `depth-4-${topIndex + 1}-${leafIndex + 1}`,
        label: "4Depth",
        href: "#",
      })),
    },
    { id: `depth-3-link-a-${topIndex + 1}`, label: "3Depth-link", href: "#" },
    {
      id: `depth-3-link-b-${topIndex + 1}`,
      label: "3Depth-link",
      href: "#",
      current: topIndex === 0,
    },
  ],
}));

export const SideNavigation: Story = {
  name: "Side navigation · nested current item",
  args: {
    component: "SideNavigation",
    componentProps: {
      id: "svelte-side-navigation",
      title: "1Depth-title",
      items: sideNavigationItems,
    },
    eventLabel: "사이드 내비게이션",
  },
  parameters: { ...fixtureParameters("side-navigation.default", ["default", "focus-visible"]) },
};

export const Footer: Story = {
  name: "Footer · official information architecture",
  args: {
    component: "Footer",
    componentProps: {
      id: "krds-footer",
      relatedSites: Array.from({ length: 4 }, (_, index) => ({
        id: `related-${index + 1}`,
        label: "related_site",
        title: "related_site 레이어",
      })),
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
        {
          label: "인스타그램",
          icon: "instagram",
          href: "#",
          target: "_blank",
          title: "새 창 열기",
        },
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
    },
    eventLabel: "푸터",
  },
  parameters: { ...fixtureParameters("footer.default", ["default", "focus-visible"]) },
};
