import type { Meta, StoryObj } from "@storybook/html-vite";
import { createComponent, type JSX } from "solid-js";
import { render } from "solid-js/web";
import * as Components from "@krds-community/solid";
import {
  ACCORDION_ITEMS,
  BUTTON_TEXT,
  CHECKBOX_LABEL_DEFAULT,
  CHECKBOX_LABEL_LARGE,
  RADIO_LABEL_DEFAULT,
  RADIO_LABEL_LARGE,
  TEXT_INPUT_PROPS,
} from "../../shared/story-props";

const names = [
  "Alert",
  "Badge",
  "BadgeNumber",
  "BadgeSize",
  "Breadcrumb",
  "BottomSheet",
  "ButtonHierarchy",
  "ButtonIcon",
  "ButtonSize",
  "ButtonText",
  "ButtonWithIcon",
  "Calendar",
  "CalendarRange",
  "Card",
  "Carousel",
  "CarouselBanner",
  "CheckboxChip",
  "CheckboxSize",
  "Chip",
  "CoachMark",
  "ContextualHelp",
  "CriticalAlerts",
  "DateInput",
  "Disclosure",
  "Favicon",
  "FileUpload",
  "Footer",
  "Header",
  "HelpPanel",
  "Identifier",
  "Infobox",
  "InPageNavigation",
  "LanguageSwitcher",
  "LanguageSwitcherPage",
  "Link",
  "MainMenuMobile",
  "MainMenuPc",
  "Masthead",
  "Modal",
  "ModalSample",
  "Pagination",
  "ProgressBar",
  "RadioButton",
  "RadioChip",
  "RadioSize",
  "Resize",
  "Search",
  "Select",
  "SelectSize",
  "SelectSorting",
  "SelectState",
  "SideNavigation",
  "SkipLink",
  "Snackbar",
  "Spinner",
  "StepIndicator",
  "StructuredList",
  "StructuredListTable",
  "Tab",
  "TabBar",
  "Table",
  "Tag",
  "TagLink",
  "Textarea",
  "TextInputIcon",
  "TextList",
  "TextListOrdered",
  "Toast",
  "ToggleSwitch",
  "ToggleSwitchSize",
  "Tooltip",
  "TooltipBox",
  "TooltipVertical",
  "TopButton",
  "Tts",
  "TtsIcon",
  "TtsSize",
  "TutorialPanel",
  "UserFeedback",
] as const;
type FixtureItem = {
  id?: string;
  label?: string;
  title?: string;
  href?: string;
  children?: FixtureItem[];
  [key: string]: unknown;
};

const scopeItems = (prefix: string, source: readonly FixtureItem[]): FixtureItem[] =>
  source.map((item) => {
    const id = item.id ? `${prefix}-${item.id}` : undefined;
    return {
      ...item,
      ...(id ? { id } : {}),
      ...(item.href && id ? { href: `#${id}` } : {}),
      ...(item.children ? { children: scopeItems(prefix, item.children) } : {}),
    };
  });

const navItems: FixtureItem[] = [
  { id: "home", label: "홈", title: "홈", href: "#home", current: true },
  { id: "guide", label: "가이드", title: "가이드", href: "#guide" },
];

const structuredItems: FixtureItem[] = [
  {
    id: "notice",
    label: "서비스 안내",
    title: "서비스 안내",
    href: "#notice",
    description: "서비스 이용 방법을 안내합니다.",
    dateLabel: "등록일",
    dateValue: "2026. 7. 27.",
    tags: ["안내"],
    actionLabel: "자세히 보기",
    shareLabel: "공유",
    favoriteLabel: "관심 등록",
  },
  {
    id: "update",
    label: "새 소식",
    title: "새 소식",
    href: "#update",
    description: "새로운 소식을 확인하세요.",
    dateLabel: "등록일",
    dateValue: "2026. 7. 26.",
    tags: ["소식"],
    actionLabel: "내용 보기",
    shareLabel: "공유",
    favoriteLabel: "관심 등록",
  },
];

const menuPcItems: FixtureItem[] = [
  {
    id: "service",
    label: "서비스",
    active: true,
    children: [
      {
        id: "service-overview",
        label: "서비스 안내",
        title: "서비스 메뉴",
        children: [
          { id: "service-guide", label: "이용 안내", href: "#service-guide" },
          { id: "service-apply", label: "온라인 신청", href: "#service-apply" },
        ],
      },
    ],
  },
  { id: "notice", label: "공지사항", href: "#notice" },
];

const menuMobileItems: FixtureItem[] = [
  { id: "mobile-home", label: "홈", href: "#mobile-home" },
  { id: "mobile-guide", label: "가이드", href: "#mobile-guide" },
];

const footerItems: FixtureItem[] = [
  { id: "related", label: "관련 사이트", title: "관련 사이트 열기", href: "#related" },
];

const slides = [
  {
    id: "one",
    title: "주요 소식",
    description: "서비스 업데이트 안내입니다.",
    href: "#slide-one",
  },
  { id: "two", title: "이용 안내", description: "이용 방법을 확인하세요.", href: "#slide-two" },
];

const tabs = [
  { id: "one", label: "첫 번째 탭", panelId: "panel-one" },
  { id: "two", label: "두 번째 탭", panelId: "panel-two" },
];

const common = {
  label: TEXT_INPUT_PROPS.label,
  title: "제목",
  description: "설명입니다.",
  message: "도움말입니다.",
  href: "#solid-main-content",
  target: "_blank",
  external: true,
  tone: "primary",
  appearance: "solid",
  variant: "primary",
  open: false,
  current: 2,
  selected: "one",
  defaultValue: "one",
  defaultStart: "2026-07-01",
  defaultEnd: "2026-07-27",
  name: "solid-field",
  value: "one",
  options: [
    { value: "one", label: "첫 번째" },
    { value: "two", label: "두 번째" },
  ],
  items: structuredItems,
  links: navItems,
  slides,
  steps: [
    { id: "one", label: "신청" },
    { id: "two", label: "확인" },
    { id: "three", label: "완료" },
  ],
  columns: [
    { key: "name", label: "이름" },
    { key: "status", label: "상태" },
  ],
  rows: [{ id: "service", name: "서비스", status: "운영 중" }],
  tabs,
  panels: { one: "첫 패널", two: "두 번째 패널" },
  panelTitle: "탭 패널",
  calendarLabel: "날짜 선택",
  previousLabel: "이전",
  nextLabel: "다음",
  playLabel: "재생",
  stopLabel: "정지",
  moreLabel: "더 보기",
  imageLabel: "콘텐츠 이미지",
  yearLabel: "연도 선택",
  monthLabel: "월 선택",
  year: "2026년",
  month: "7월",
  years: [{ label: "2026년", value: "2026", active: true }],
  months: [{ label: "7월", value: "07", active: true }],
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  weeks: [
    [
      { label: "1", value: "2026-07-01" },
      { label: "2", value: "2026-07-02" },
      { label: "3", value: "2026-07-03" },
      { label: "4", value: "2026-07-04" },
      { label: "5", value: "2026-07-05" },
      { label: "6", value: "2026-07-06" },
      { label: "7", value: "2026-07-07" },
    ],
  ],
  actions: [
    { id: "cancel", label: "취소", variant: "tertiary", icon: "close" },
    { id: "confirm", label: "확인", variant: "primary", icon: "check" },
  ],
  stepTitle: "현재 단계 안내",
  contentTitle: "코치마크 내용",
  currentStep: "1",
  totalSteps: "3",
  currentStepLabel: "현재 단계",
  totalStepsLabel: "전체 단계",
  linkLabel: "자세히 보기",
  closeLabel: "닫기",
  selectedLabel: "선택됨",
  resetLabel: "기본값으로 초기화",
  actionLabel: "자세히 보기",
  pageTitle: "페이지 내 이동",
  actionInfo: "전체",
  actionCount: "2건",
  helpTitle: "도움말",
  helpDescription: "도움말 패널 내용입니다.",
  externalTitle: "새 창 열기",
  backTitle: "이전으로 이동",
  activeTab: "help" as const,
  downloadLinks: [
    { id: "download", label: "사용 안내서", href: "#download", title: "사용 안내서" },
  ],
  relatedGroups: [
    {
      title: "관련 서비스",
      links: [{ id: "related-help", label: "자주 묻는 질문", href: "#faq" }],
    },
  ],
  tutorialTitle: "튜토리얼",
  tasks: [
    {
      title: "첫 번째 단계",
      summary: "기본 안내",
      steps: ["메뉴 확인", "내용 확인"],
      current: true,
    },
  ],
  collapseLabel: "도움말 접기",
  menuLabel: "주 메뉴",
  utilityItems: [{ id: "utility-home", label: "홈", href: "#utility-home", kind: "link" }],
  loginLabel: "로그인",
  serviceItems: [{ id: "service-help", label: "서비스 안내", href: "#service-help" }],
  searchPlaceholder: "검색어를 입력하세요.",
  searchTitle: "통합검색",
  searchLabel: "검색",
  bottomItems: [{ id: "privacy", label: "개인정보처리방침", href: "#privacy" }],
  relatedSites: footerItems,
  logoLabel: "KRDS Community",
  address: "서울특별시",
  contacts: [{ title: "대표전화", description: "0000-0000" }],
  policyLinks: [{ id: "policy", label: "개인정보처리방침", href: "#policy" }],
  socialLinks: [{ id: "social", label: "소셜 미디어", href: "#social", icon: "facebook" }],
  copyright: "© KRDS Community",
  organization: "KRDS Community",
  prompt: "파일을 첨부하세요.",
  inputId: "solid-file-input",
  selectLabel: "파일 선택",
  currentCount: 1,
  maxCount: 3,
  files: [
    {
      id: "file-one",
      name: "안내문.pdf",
      status: "deletable" as const,
      statusLabel: "업로드 완료",
      deleteLabel: "파일 삭제",
    },
  ],
  deleteAllLabel: "전체 삭제",
  caption: "서비스 목록",
  pagination: {
    current: 2,
    items: [1, 2, 3, "ellipsis", 5],
    previousLabel: "이전",
    nextLabel: "다음",
    currentLabel: "현재 페이지",
  },
  countLabel: "목록 표시 개수",
  countOptions: ["10개", "20개"],
  sortLabel: "정렬 기준",
  sortOptions: ["최신순", "인기순"],
  sortValue: "최신순",
  selectAllLabel: "전체 선택",
  dateLabel: "등록일",
  dateValue: "2026. 7. 27.",
  tags: ["안내", "공지"],
  shareLabel: "공유",
  favoriteLabel: "관심 등록",
  cancelLabel: "취소",
  confirmLabel: "확인",
  logoHref: "#solid-main-content",
  loginHref: "#solid-main-content",
  joinLabel: "회원가입",
  allMenuLabel: "전체 메뉴",
  desktopItems: menuPcItems,
  mobileMenu: {
    utilityItems: [{ id: "mobile-utility", label: "홈", href: "#mobile-utility", kind: "link" }],
    loginLabel: "로그인",
    serviceItems: [{ id: "mobile-service", label: "서비스 안내", href: "#mobile-service" }],
    searchPlaceholder: "검색어를 입력하세요.",
    searchTitle: "통합검색",
    searchLabel: "검색",
    items: menuMobileItems,
    previousLabel: "이전 메뉴",
    closeLabel: "메뉴 닫기",
    bottomItems: [{ id: "mobile-bottom", label: "개인정보처리방침", href: "#mobile-bottom" }],
  },
  bottomSize: "medium" as const,
  removable: true,
  maxLength: 200,
  ordered: false,
  myMenu: {
    label: "마이페이지",
    userName: "홍길동",
    timeLabel: "로그인 시간",
    time: "2026. 7. 27. 09:00",
    extendLabel: "연장",
    items: [{ id: "my-page", label: "내 정보", href: "#my-page" }],
    logoutLabel: "로그아웃",
  },
};

const scopeTabs = (prefix: string) =>
  tabs.map((tab) => ({
    ...tab,
    id: `${prefix}-${tab.id}`,
    panelId: `${prefix}-${tab.panelId}`,
  }));

const fixtureProps = (
  name: string,
  prefix = `solid-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, "")}`,
) => {
  const scopedItems = scopeItems(prefix, structuredItems);
  const scopedLinks = scopeItems(prefix, navItems);
  const scopedMenuPcItems = scopeItems(prefix, menuPcItems);
  const scopedMenuMobileItems = scopeItems(prefix, menuMobileItems);
  const scopedSlides = slides.map((slide) => ({
    ...slide,
    id: `${prefix}-${slide.id}`,
    href: `#${prefix}-${slide.id}`,
  }));
  const scopedSteps = common.steps.map((step) => ({ ...step, id: `${prefix}-${step.id}` }));
  const scopedRows = common.rows.map((row) => ({ ...row, id: `${prefix}-${row.id}` }));
  const scopedActions = common.actions.map((action) => ({
    ...action,
    id: `${prefix}-${action.id}`,
  }));
  const scopedTabs = scopeTabs(prefix);
  const scopedPanels = Object.fromEntries(scopedTabs.map((tab) => [tab.id, `${tab.label} 내용`]));
  const scopedProps: Record<string, unknown> = {
    ...common,
    id:
      name === "Footer" && prefix === "solid-footer"
        ? "krds-footer"
        : name === "Header"
          ? "krds-header"
          : name === "Masthead"
            ? "krds-masthead"
            : prefix,
    label: name,
    title: `${name} 예시`,
    name: `${prefix}-field`,
    inputId: `${prefix}-file-input`,
    ...(name === "RadioChip" ||
    name === "Textarea" ||
    name === "TextInputIcon" ||
    name === "TtsIcon"
      ? { "aria-label": `${name} 입력` }
      : {}),
    items: scopedItems,
    links: scopedLinks,
    slides: scopedSlides,
    steps: scopedSteps,
    rows: scopedRows,
    actions: scopedActions,
    tabs: scopedTabs,
    panels: scopedPanels,
    desktopItems: scopedMenuPcItems,
    utilityItems: scopeItems(prefix, common.utilityItems),
    serviceItems: scopeItems(prefix, common.serviceItems),
    bottomItems: scopeItems(prefix, common.bottomItems),
    relatedSites: scopeItems(prefix, common.relatedSites),
    policyLinks: scopeItems(prefix, common.policyLinks),
    socialLinks: scopeItems(prefix, common.socialLinks),
    mobileMenu: {
      ...common.mobileMenu,
      utilityItems: scopeItems(prefix, common.mobileMenu.utilityItems),
      serviceItems: scopeItems(prefix, common.mobileMenu.serviceItems),
      items: scopedMenuMobileItems,
      bottomItems: scopeItems(prefix, common.mobileMenu.bottomItems),
    },
    files: common.files.map((file) => ({ ...file, id: `${prefix}-${file.id}` })),
  };
  if (name === "Alert") {
    scopedProps.state = "danger";
    scopedProps.title = "오류가 발생했습니다.";
    scopedProps.message = "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (name === "BottomSheet") {
    scopedProps.title = "정렬 기준 선택";
    scopedProps.description = "원하는 정렬 기준을 선택하세요.";
  }
  if (name === "Card") {
    scopedProps.type = "vertical";
    scopedProps.title = "서비스 안내 카드";
    scopedProps.description = "서비스 이용 방법을 안내합니다.";
    scopedProps.badges = ["안내"];
    scopedProps.actions = [{ label: "자세히 보기" }];
  }
  if (name === "Chip") {
    scopedProps.options = [
      { value: "all", label: "전체" },
      { value: "notice", label: "공지" },
      { value: "event", label: "행사" },
    ];
    scopedProps.defaultSelected = "all";
    scopedProps.ariaLabel = "칩 선택";
  }
  if (name === "CriticalAlerts")
    scopedProps.items = scopeItems(prefix, [
      {
        id: "critical",
        label: "서비스 점검 안내",
        badge: "info",
        badgeLabel: "안내",
        linkLabel: "자세히 보기",
        href: "#critical",
      },
    ]);
  if (name === "MainMenuMobile") scopedProps.links = scopedMenuMobileItems;
  if (name === "MainMenuPc") scopedProps.links = scopedMenuPcItems;
  if (name === "Pagination") scopedProps.items = [1, 2, 3, "ellipsis", 5];
  if (name === "Tab") scopedProps.tabs = scopedTabs;
  if (name === "Header") scopedProps.menuLabel = "사이트 주 메뉴";
  if (name === "MainMenuPc") scopedProps.menuLabel = "보조 주 메뉴";
  if (name === "HelpPanel") {
    const helpPanelTabs = [
      {
        id: `${prefix}-help-tab`,
        label: "도움말",
        panelId: `${prefix}-help-content`,
        value: "help",
      },
      {
        id: `${prefix}-tutorial-tab`,
        label: "튜토리얼",
        panelId: `${prefix}-tutorial-content`,
        value: "tutorial",
      },
    ];
    scopedProps.tabs = helpPanelTabs;
    scopedProps.panels = Object.fromEntries(
      helpPanelTabs.map((tab) => [tab.id, `${tab.label} 내용`]),
    );
  }
  if (name === "Infobox") {
    scopedProps.type = "primary";
    scopedProps.message = "정부 서비스 이용에 도움이 되는 안내입니다.";
  }
  if (name === "ProgressBar") {
    scopedProps.value = 70;
    scopedProps.label = "처리 진행률";
  }
  if (name === "Search") {
    scopedProps.placeholder = "검색어를 입력해 주세요";
    scopedProps.onSearch = (value: string) => console.log("검색:", value);
  }
  if (name === "Snackbar") {
    scopedProps.open = true;
    scopedProps.message = "변경사항이 저장되었습니다.";
    scopedProps.actionLabel = "되돌리기";
    scopedProps.closeLabel = "닫기";
  }
  if (name === "TabBar") {
    scopedProps.items = [
      { id: "home", label: "홈" },
      { id: "guide", label: "가이드" },
      { id: "notice", label: "공지" },
    ];
    scopedProps.defaultSelected = "home";
  }
  if (name === "Toast") {
    delete scopedProps.open;
    scopedProps.message = "저장되었습니다.";
    scopedProps.defaultOpen = true;
    scopedProps.duration = 60000;
  }
  if (name === "TopButton") {
    scopedProps.onClick = () => console.log("맨 위로 이동");
  }
  if (name === "UserFeedback") {
    scopedProps.title = "이 페이지에 만족하시나요?";
    scopedProps.options = [
      { value: "satisfied", label: "만족" },
      { value: "dissatisfied", label: "불만족" },
    ];
    scopedProps.onSubmit = (value: string) => console.log("피드백:", value);
  }
  return scopedProps;
};

const renderComponent = (name: string, root: HTMLElement) => {
  root.style.cssText =
    "display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;box-sizing:border-box;overflow-wrap:anywhere";
  const props = fixtureProps(name);
  if (name === "BottomSheet") props.open = true;
  render(
    () =>
      createComponent(
        (Components as Record<string, unknown>)[name] as (
          props: Record<string, unknown>,
        ) => JSX.Element,
        props,
      ),
    root,
  );
  return root;
};

const meta = {
  title: "SolidJS/전체 컴포넌트",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
  },
} satisfies Meta;
export default meta;
export const Inventory: StoryObj<typeof meta> = {
  name: "전체 인벤토리",
  parameters: {
    a11y: { test: "error" },
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
  },
  render: () => {
    const root = document.createElement("main");
    root.id = "solid-main-content";
    root.setAttribute("aria-label", "컴포넌트 인벤토리");
    root.style.cssText =
      "display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;box-sizing:border-box;overflow-wrap:anywhere";
    const mount = (
      component: unknown,
      props: Record<string, unknown>,
      container: HTMLElement = root,
      className = "",
    ) => {
      const target = document.createElement("div");
      target.className = className;
      target.style.cssText =
        "width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere";
      container.append(target);
      render(
        () => createComponent(component as (props: Record<string, unknown>) => JSX.Element, props),
        target,
      );
      return target;
    };

    mount(Components.Button, { variant: "primary", children: BUTTON_TEXT.primary });
    mount(Components.Button, { variant: "secondary", children: "보조 계층 버튼" });
    mount(Components.Button, { variant: "tertiary", children: "취소 계층 버튼" });
    mount(
      Components.Footer,
      fixtureProps("Footer", "solid-footer-foundation"),
      root,
      "component-card",
    );
    mount(Components.TextInput, {
      id: "solid-text-input-error",
      label: TEXT_INPUT_PROPS.label,
      hint: "에러 메시지",
      state: "error",
    });
    mount(Components.TextInput, {
      id: "solid-text-input-success",
      label: TEXT_INPUT_PROPS.label,
      hint: "성공 메시지",
      state: "success",
    });
    mount(Components.TextInput, {
      id: "solid-text-input-information",
      label: TEXT_INPUT_PROPS.label,
      hint: "정보 메시지",
      state: "information",
    });
    mount(Components.Button, { children: BUTTON_TEXT.primary });
    mount(Components.TextInput, { label: TEXT_INPUT_PROPS.label, hint: TEXT_INPUT_PROPS.hint });
    mount(Components.Checkbox, { label: CHECKBOX_LABEL_DEFAULT, name: "check" });
    mount(Components.Checkbox, { label: CHECKBOX_LABEL_LARGE, name: "check-large", size: "large" });
    mount(Components.Radio, {
      label: RADIO_LABEL_LARGE,
      name: "radio-large",
      value: "large",
      size: "large",
    });
    mount(Components.Switch, { label: "큰 스위치", name: "switch-large", size: "large" });
    mount(Components.AccordionLine, {
      items: [{ id: "line", title: ACCORDION_ITEMS[0].title, content: ACCORDION_ITEMS[0].content }],
    });
    mount(Components.Radio, { label: RADIO_LABEL_DEFAULT, name: "radio", value: "one" });
    mount(Components.Switch, { label: "스위치", name: "switch" });
    mount(Components.Accordion, { items: [ACCORDION_ITEMS[0]] });
    mount(
      Components.RadioChip,
      {
        label: "라디오 칩",
        "aria-label": "라디오 칩",
        name: "solid-radio-chip",
        value: "one",
      },
      root,
      "krds-form-chip",
    );
    mount(
      Components.StructuredListTable,
      fixtureProps("StructuredListTable", "solid-structured-table-foundation"),
      root,
      "krds-table-wrap",
    );
    mount(
      Components.Table,
      fixtureProps("Table", "solid-table-foundation"),
      root,
      "krds-table-wrap",
    );
    const skipRoot = document.createElement("div");
    skipRoot.id = "krds-skip-link";
    root.append(skipRoot);
    mount(
      Components.SkipLink,
      { href: "#solid-main-content", children: "본문 바로가기" },
      skipRoot,
    );

    for (const name of names)
      mount(
        (Components as Record<string, unknown>)[name],
        fixtureProps(name),
        root,
        "component-card",
      );
    return root;
  },
};
// 컴포넌트별 개별 스토리
export const Alert: StoryObj<typeof meta> = {
  name: "알림",
  render: () => renderComponent("Alert", document.createElement("div")),
};
export const Badge: StoryObj<typeof meta> = {
  name: "배지",
  render: () => renderComponent("Badge", document.createElement("div")),
};
export const BadgeNumber: StoryObj<typeof meta> = {
  name: "배지 번호",
  render: () => renderComponent("BadgeNumber", document.createElement("div")),
};
export const BadgeSize: StoryObj<typeof meta> = {
  name: "배지 크기",
  render: () => renderComponent("BadgeSize", document.createElement("div")),
};
export const Breadcrumb: StoryObj<typeof meta> = {
  name: "브레드크럼",
  render: () => renderComponent("Breadcrumb", document.createElement("div")),
};
export const BottomSheet: StoryObj<typeof meta> = {
  name: "바텀 시트",
  render: () => renderComponent("BottomSheet", document.createElement("div")),
};
export const ButtonHierarchy: StoryObj<typeof meta> = {
  name: "버튼 계층",
  render: () => renderComponent("ButtonHierarchy", document.createElement("div")),
};
export const ButtonIcon: StoryObj<typeof meta> = {
  name: "아이콘 버튼",
  render: () => renderComponent("ButtonIcon", document.createElement("div")),
};
export const ButtonSize: StoryObj<typeof meta> = {
  name: "버튼 크기",
  render: () => renderComponent("ButtonSize", document.createElement("div")),
};
export const ButtonText: StoryObj<typeof meta> = {
  name: "텍스트 버튼",
  render: () => renderComponent("ButtonText", document.createElement("div")),
};
export const ButtonWithIcon: StoryObj<typeof meta> = {
  name: "아이콘이 있는 버튼",
  render: () => renderComponent("ButtonWithIcon", document.createElement("div")),
};
export const Calendar: StoryObj<typeof meta> = {
  name: "캘린더",
  render: () => renderComponent("Calendar", document.createElement("div")),
};
export const CalendarRange: StoryObj<typeof meta> = {
  name: "캘린더 범위",
  render: () => renderComponent("CalendarRange", document.createElement("div")),
};
export const Card: StoryObj<typeof meta> = {
  name: "카드",
  render: () => renderComponent("Card", document.createElement("div")),
};
export const Carousel: StoryObj<typeof meta> = {
  name: "캐러셀",
  render: () => renderComponent("Carousel", document.createElement("div")),
};
export const CarouselBanner: StoryObj<typeof meta> = {
  name: "배너 캐러셀",
  render: () => renderComponent("CarouselBanner", document.createElement("div")),
};
export const CheckboxChip: StoryObj<typeof meta> = {
  name: "체크박스 칩",
  render: () => renderComponent("CheckboxChip", document.createElement("div")),
};
export const CheckboxSize: StoryObj<typeof meta> = {
  name: "체크박스 크기",
  render: () => renderComponent("CheckboxSize", document.createElement("div")),
};
export const Chip: StoryObj<typeof meta> = {
  name: "칩",
  render: () => renderComponent("Chip", document.createElement("div")),
};
export const CoachMark: StoryObj<typeof meta> = {
  name: "코치마크",
  render: () => renderComponent("CoachMark", document.createElement("div")),
};
export const ContextualHelp: StoryObj<typeof meta> = {
  name: "컨텍스추얼 헬프",
  render: () => renderComponent("ContextualHelp", document.createElement("div")),
};
export const CriticalAlerts: StoryObj<typeof meta> = {
  name: "크리티컬 알림",
  render: () => renderComponent("CriticalAlerts", document.createElement("div")),
};
export const DateInput: StoryObj<typeof meta> = {
  name: "날짜 입력",
  render: () => renderComponent("DateInput", document.createElement("div")),
};
export const Disclosure: StoryObj<typeof meta> = {
  name: "디스클로저",
  render: () => renderComponent("Disclosure", document.createElement("div")),
};
export const Favicon: StoryObj<typeof meta> = {
  name: "파비콘",
  render: () => renderComponent("Favicon", document.createElement("div")),
};
export const FileUpload: StoryObj<typeof meta> = {
  name: "파일 업로드",
  render: () => renderComponent("FileUpload", document.createElement("div")),
};
export const Footer: StoryObj<typeof meta> = {
  name: "푸터",
  render: () => renderComponent("Footer", document.createElement("div")),
};
export const Header: StoryObj<typeof meta> = {
  name: "헤더",
  render: () => renderComponent("Header", document.createElement("div")),
};
export const HelpPanel: StoryObj<typeof meta> = {
  name: "헬프 패널",
  render: () => renderComponent("HelpPanel", document.createElement("div")),
};
export const Identifier: StoryObj<typeof meta> = {
  name: "식별자",
  render: () => renderComponent("Identifier", document.createElement("div")),
};
export const Infobox: StoryObj<typeof meta> = {
  name: "인포박스",
  render: () => renderComponent("Infobox", document.createElement("div")),
};
export const InPageNavigation: StoryObj<typeof meta> = {
  name: "페이지 내 네비게이션",
  render: () => renderComponent("InPageNavigation", document.createElement("div")),
};
export const LanguageSwitcher: StoryObj<typeof meta> = {
  name: "언어 전환",
  render: () => renderComponent("LanguageSwitcher", document.createElement("div")),
};
export const LanguageSwitcherPage: StoryObj<typeof meta> = {
  name: "언어 전환 페이지",
  render: () => renderComponent("LanguageSwitcherPage", document.createElement("div")),
};
export const Link: StoryObj<typeof meta> = {
  name: "링크",
  render: () => renderComponent("Link", document.createElement("div")),
};
export const MainMenuMobile: StoryObj<typeof meta> = {
  name: "모바일 메인 메뉴",
  render: () => renderComponent("MainMenuMobile", document.createElement("div")),
};
export const MainMenuPc: StoryObj<typeof meta> = {
  name: "PC 메인 메뉴",
  render: () => renderComponent("MainMenuPc", document.createElement("div")),
};
export const Masthead: StoryObj<typeof meta> = {
  name: "마스트헤드",
  render: () => renderComponent("Masthead", document.createElement("div")),
};
export const Pagination: StoryObj<typeof meta> = {
  name: "페이지네이션",
  render: () => renderComponent("Pagination", document.createElement("div")),
};
export const ProgressBar: StoryObj<typeof meta> = {
  name: "진행률",
  render: () => renderComponent("ProgressBar", document.createElement("div")),
};
export const RadioButton: StoryObj<typeof meta> = {
  name: "라디오 버튼",
  render: () => renderComponent("RadioButton", document.createElement("div")),
};
export const RadioChip: StoryObj<typeof meta> = {
  name: "라디오 칩",
  render: () => renderComponent("RadioChip", document.createElement("div")),
};
export const RadioSize: StoryObj<typeof meta> = {
  name: "라디오 크기",
  render: () => renderComponent("RadioSize", document.createElement("div")),
};
export const Resize: StoryObj<typeof meta> = {
  name: "크기 조절",
  render: () => renderComponent("Resize", document.createElement("div")),
};
export const Search: StoryObj<typeof meta> = {
  name: "검색",
  render: () => renderComponent("Search", document.createElement("div")),
};
export const Select: StoryObj<typeof meta> = {
  name: "셀렉트",
  render: () => renderComponent("Select", document.createElement("div")),
};
export const SelectSize: StoryObj<typeof meta> = {
  name: "셀렉트 크기",
  render: () => renderComponent("SelectSize", document.createElement("div")),
};
export const SelectSorting: StoryObj<typeof meta> = {
  name: "정렬 셀렉트",
  render: () => renderComponent("SelectSorting", document.createElement("div")),
};
export const SelectState: StoryObj<typeof meta> = {
  name: "셀렉트 상태",
  render: () => renderComponent("SelectState", document.createElement("div")),
};
export const SideNavigation: StoryObj<typeof meta> = {
  name: "사이드 네비게이션",
  render: () => renderComponent("SideNavigation", document.createElement("div")),
};
export const SkipLink: StoryObj<typeof meta> = {
  name: "스킵 링크",
  render: () => renderComponent("SkipLink", document.createElement("div")),
};
export const Snackbar: StoryObj<typeof meta> = {
  name: "스낵바",
  render: () => renderComponent("Snackbar", document.createElement("div")),
};
export const Spinner: StoryObj<typeof meta> = {
  name: "스피너",
  render: () => renderComponent("Spinner", document.createElement("div")),
};
export const StepIndicator: StoryObj<typeof meta> = {
  name: "단계 표시기",
  render: () => renderComponent("StepIndicator", document.createElement("div")),
};
export const StructuredList: StoryObj<typeof meta> = {
  name: "구조화된 목록",
  render: () => renderComponent("StructuredList", document.createElement("div")),
};
export const StructuredListTable: StoryObj<typeof meta> = {
  name: "구조화된 테이블",
  render: () => renderComponent("StructuredListTable", document.createElement("div")),
};
export const TabBar: StoryObj<typeof meta> = {
  name: "탭 바",
  render: () => renderComponent("TabBar", document.createElement("div")),
};
export const Table: StoryObj<typeof meta> = {
  name: "테이블",
  render: () => renderComponent("Table", document.createElement("div")),
};
export const Tag: StoryObj<typeof meta> = {
  name: "태그",
  render: () => renderComponent("Tag", document.createElement("div")),
};
export const TagLink: StoryObj<typeof meta> = {
  name: "태그 링크",
  render: () => renderComponent("TagLink", document.createElement("div")),
};
export const Textarea: StoryObj<typeof meta> = {
  name: "텍스트 영역",
  render: () => renderComponent("Textarea", document.createElement("div")),
};
export const TextInputIcon: StoryObj<typeof meta> = {
  name: "아이콘 텍스트 입력",
  render: () => renderComponent("TextInputIcon", document.createElement("div")),
};
export const TextList: StoryObj<typeof meta> = {
  name: "텍스트 목록",
  render: () => renderComponent("TextList", document.createElement("div")),
};
export const TextListOrdered: StoryObj<typeof meta> = {
  name: "순서 있는 텍스트 목록",
  render: () => renderComponent("TextListOrdered", document.createElement("div")),
};
export const Toast: StoryObj<typeof meta> = {
  name: "토스트",
  render: () => renderComponent("Toast", document.createElement("div")),
};
export const ToggleSwitch: StoryObj<typeof meta> = {
  name: "토글 스위치",
  render: () => renderComponent("ToggleSwitch", document.createElement("div")),
};
export const ToggleSwitchSize: StoryObj<typeof meta> = {
  name: "토글 스위치 크기",
  render: () => renderComponent("ToggleSwitchSize", document.createElement("div")),
};
export const Tooltip: StoryObj<typeof meta> = {
  name: "툴팁",
  render: () => renderComponent("Tooltip", document.createElement("div")),
};
export const TooltipBox: StoryObj<typeof meta> = {
  name: "툴팁 박스",
  render: () => renderComponent("TooltipBox", document.createElement("div")),
};
export const TooltipVertical: StoryObj<typeof meta> = {
  name: "수직 툴팁",
  render: () => renderComponent("TooltipVertical", document.createElement("div")),
};
export const TopButton: StoryObj<typeof meta> = {
  name: "상단 이동",
  render: () => renderComponent("TopButton", document.createElement("div")),
};
export const Tts: StoryObj<typeof meta> = {
  name: "TTS",
  render: () => renderComponent("Tts", document.createElement("div")),
};
export const TtsIcon: StoryObj<typeof meta> = {
  name: "TTS 아이콘",
  render: () => renderComponent("TtsIcon", document.createElement("div")),
};
export const TtsSize: StoryObj<typeof meta> = {
  name: "TTS 크기",
  render: () => renderComponent("TtsSize", document.createElement("div")),
};
export const TutorialPanel: StoryObj<typeof meta> = {
  name: "튜토리얼 패널",
  render: () => renderComponent("TutorialPanel", document.createElement("div")),
};
export const UserFeedback: StoryObj<typeof meta> = {
  name: "사용자 피드백",
  render: () => renderComponent("UserFeedback", document.createElement("div")),
};
