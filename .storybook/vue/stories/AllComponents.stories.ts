import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref, type Component } from "vue";
import * as Components from "@krds-community/vue";
import {
  ACCORDION_ITEMS,
  BUTTON_HIERARCHY_TEXT,
  BUTTON_TEXT,
  CHECKBOX_LABEL_DEFAULT,
  CHECKBOX_LABEL_LARGE,
  MODAL_PROPS,
  MODAL_TRIGGER_TEXT,
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
const common = {
  label: "레이블",
  title: "제목",
  description: "설명입니다.",
  message: "도움말입니다.",
  href: "#example",
  open: true,
  current: 2,
  caption: "컴포넌트 예시 표",
  text: "읽어주기",
  previousLabel: "이전 슬라이드",
  nextLabel: "다음 슬라이드",
  moreLabel: "자세히 보기",
  imageLabel: "캐러셀 이미지",
  actionLabel: "자세히 보기",
  playLabel: "재생",
  stopLabel: "정지",
  closeLabel: "닫기",
  collapseLabel: "접기",
  resetLabel: "기본 크기",
  selectedLabel: "선택됨",
  selectLabel: "파일 선택",
  deleteAllLabel: "전체 삭제",
  calendarLabel: "날짜 선택",
  previousMonthLabel: "이전 달",
  nextMonthLabel: "다음 달",
  yearSelectLabel: "연도 선택",
  monthSelectLabel: "월 선택",
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  todayLabel: "오늘",
  eventLabel: "일정",
  cancelLabel: "취소",
  confirmLabel: "확인",
  years: [2024, 2025],
  year: 2024,
  month: 6,
  leadingDays: 6,
  previousMonthDayCount: 31,
  dayCount: 30,
  todayDay: 15,
  eventDays: [10, 21],
  disabledDays: [4, 28],
  options: [
    { value: "one", label: "첫 번째" },
    { value: "two", label: "두 번째" },
  ],
  items: [
    { id: "one", label: "첫 항목", title: "첫 항목", href: "#one" },
    { id: "two", label: "두 번째", title: "두 번째", href: "#two" },
  ],
  links: [
    { id: "one", label: "첫 항목", href: "#one" },
    { id: "two", label: "두 번째", href: "#two" },
  ],
  slides: [
    { id: "one", title: "첫 슬라이드", description: "캐러셀 내용", href: "#slide-one" },
    { id: "two", title: "두 번째 슬라이드", href: "#slide-two" },
  ],
  steps: [
    { id: "one", label: "첫 단계" },
    { id: "two", label: "두 번째 단계" },
  ],
  columns: [
    { key: "name", label: "이름" },
    { key: "status", label: "상태" },
  ],
  rows: [
    { id: "service", name: "서비스", status: "운영 중" },
    { id: "docs", name: "문서", status: "검토 중" },
  ],
  tabs: [
    { id: "one", label: "첫 탭", panelId: "vue-help-panel-one" },
    { id: "two", label: "두 번째 탭", panelId: "vue-help-panel-two" },
  ],
  panels: { one: "첫 패널", two: "두 번째 패널" },
};
const contractSlides = [
  { id: "contract-one", title: "첫 번째 슬라이드", description: "캐러셀 설명", href: "#slide-one" },
  { id: "contract-two", title: "두 번째 슬라이드", href: "#slide-two" },
];
const contractNavigation = [
  { id: "contract-one", label: "첫 메뉴", title: "첫 메뉴", href: "#menu-one" },
  { id: "contract-two", label: "두 번째 메뉴", title: "두 번째 메뉴", href: "#menu-two" },
];
const slug = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const menuItems = (prefix: string) => [
  {
    id: `${prefix}-home`,
    label: "홈",
    href: `#${prefix}-home`,
    children: [
      { id: `${prefix}-guide`, label: "가이드", href: `#${prefix}-guide` },
      { id: `${prefix}-docs`, label: "문서", href: `#${prefix}-docs` },
    ],
  },
  {
    id: `${prefix}-service`,
    label: "서비스",
    href: `#${prefix}-service`,
    children: [{ id: `${prefix}-support`, label: "지원", href: `#${prefix}-support` }],
  },
];
const pageNavigationItems = [
  { id: "page-overview", label: "개요", href: "#page-overview", current: true },
  { id: "page-details", label: "상세 내용", href: "#page-details" },
];
const tabItems = [
  { id: "one", label: "첫 탭" },
  { id: "two", label: "두 번째 탭" },
];
const helpTabs = [
  { id: "help", label: "도움말", panelId: "vue-help-panel-one", value: "help" },
  { id: "related", label: "관련 서비스", panelId: "vue-help-panel-two", value: "related" },
];
const controlledKinds = new Set([
  "ContextualHelp",
  "LanguageSwitcher",
  "LanguageSwitcherPage",
  "Resize",
]);
const labeledControls = new Set([
  "RadioChip",
  "Select",
  "SelectSize",
  "SelectSorting",
  "SelectState",
  "Textarea",
  "TextInputIcon",
  "TtsIcon",
]);
const inventoryProps = (name: string): Record<string, unknown> => {
  const id = `vue-inventory-${slug(name)}`;
  const props: Record<string, unknown> = {
    ...common,
    id,
    label: `${name} 레이블`,
    title: `${name} 제목`,
    name: `vue-${slug(name)}`,
    class: "component-card",
  };
  if (labeledControls.has(name)) props["aria-label"] = `${name} 입력`;
  if (controlledKinds.has(name)) props["aria-controls"] = `${id}-controls`;

  switch (name) {
    case "Alert":
      props.state = "danger";
      props.title = "오류가 발생했습니다.";
      props.message = "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      break;
    case "Breadcrumb":
      props.items = [
        { id: "breadcrumb-home", label: "홈", href: "#breadcrumb-home" },
        { id: "breadcrumb-current", label: "현재 페이지", href: "#breadcrumb-current" },
      ];
      break;
    case "BottomSheet":
      props.open = true;
      props.title = "정렬 기준 선택";
      props.description = "원하는 정렬 기준을 선택하세요.";
      break;
    case "Calendar":
    case "CalendarRange":
    case "DateInput":
      props.calendarLabel = `${name} 달력`;
      props.rangeStartDay = 10;
      props.rangeEndDay = 18;
      break;
    case "Card":
      props.type = "vertical";
      props.title = "서비스 안내 카드";
      props.description = "서비스 이용 방법을 안내합니다.";
      props.badges = ["안내"];
      props.actions = [{ label: "자세히 보기" }];
      break;
    case "Carousel":
    case "CarouselBanner":
      props.slides = contractSlides;
      break;
    case "Chip":
      props.options = [
        { value: "all", label: "전체" },
        { value: "notice", label: "공지" },
        { value: "event", label: "행사" },
      ];
      props.defaultSelected = "all";
      props.ariaLabel = "칩 선택";
      break;
    case "CoachMark":
      props.step = "1/2";
      props.stepTitle = "첫 단계";
      props.currentStep = "1";
      props.totalSteps = "2";
      props.contentTitle = "따라하기 안내";
      break;
    case "ContextualHelp":
      props.description = "도움말 내용입니다.";
      props.linkLabel = "자세히 보기";
      break;
    case "CriticalAlerts":
      props.items = [
        {
          id: "critical-alert",
          badge: "긴급",
          badgeLabel: "긴급",
          tone: "danger",
          text: "서비스 점검 안내",
          href: "#critical-alert-details",
          linkLabel: "자세히 보기",
        },
      ];
      break;
    case "Disclosure":
      props.items = [{ id: "disclosure-item", label: "상세 안내" }];
      break;
    case "FileUpload":
      props.title = "파일 업로드";
      props.description = "문서 파일을 업로드합니다.";
      props.prompt = "업로드할 파일을 선택하세요.";
      props.files = [
        {
          id: "vue-uploaded-file",
          name: "서비스 안내서.pdf",
          status: "complete",
          statusLabel: "업로드 완료",
        },
      ];
      props.currentCount = 1;
      props.maxCount = 3;
      break;
    case "Header":
      props.logoLabel = "KRDS Community";
      props.logoHref = "#header-home";
      props.utilityItems = [{ id: "header-utility", label: "이용 안내", href: "#header-utility" }];
      props.desktopItems = menuItems("header");
      props.searchTitle = "사이트 검색";
      props.searchLabel = "검색";
      props.loginHref = "#header-login";
      props.loginLabel = "로그인";
      props.joinLabel = "회원가입";
      props.allMenuLabel = "전체 메뉴";
      props.menuLabel = "인벤토리 헤더 주 메뉴";
      props.mobileMenu = {
        utilityItems: [
          { id: "header-mobile-utility", label: "이용 안내", href: "#header-utility" },
        ],
        loginLabel: "로그인",
        serviceItems: [{ id: "header-mobile-service", label: "서비스", href: "#header-service" }],
        searchPlaceholder: "검색어를 입력하세요",
        searchTitle: "사이트 검색",
        searchLabel: "검색",
        items: menuItems("header-mobile"),
        previousLabel: "이전 메뉴",
        closeLabel: "메뉴 닫기",
        bottomItems: [{ id: "header-mobile-bottom", label: "사이트 안내", href: "#header-about" }],
      };
      break;
    case "HelpPanel":
      props.open = true;
      props.tabs = helpTabs;
      props.activeTab = "help";
      props.selectedLabel = "선택됨";
      props.helpTitle = "도움말";
      props.helpDescription = "도움말을 확인하세요.";
      props.downloadLinks = [{ label: "사용 안내서", href: "#help-guide" }];
      props.relatedGroups = [
        { title: "관련 서비스", links: [{ label: "서비스 안내", href: "#help-service" }] },
      ];
      break;
    case "Infobox":
      props.type = "primary";
      props.message = "정부 서비스 이용에 도움이 되는 안내입니다.";
      break;
    case "InPageNavigation":
      props.items = pageNavigationItems;
      props.actionLabel = "목차 열기";
      props.actionInfo = "전체 항목";
      props.actionCount = "2개";
      break;
    case "LanguageSwitcher":
    case "LanguageSwitcherPage":
      props.languages = [
        { value: "ko", label: "한국어", href: "#language-ko", lang: "ko" },
        { value: "en", label: "English", href: "#language-en", lang: "en" },
      ];
      props.text = "새 창에서 열림";
      break;
    case "MainMenuMobile":
      props.items = menuItems(`inventory-${slug(name)}`);
      props.menuLabel = "주 메뉴";
      props.previousLabel = "이전 메뉴";
      props.closeLabel = "메뉴 닫기";
      break;
    case "MainMenuPc":
      props.items = menuItems(`inventory-${slug(name)}`);
      props.menuLabel = "주 메뉴";
      props["aria-label"] = "보조 주 메뉴";
      break;
    case "Pagination":
      props.items = [1, 2, "ellipsis", 4];
      props.previousLabel = "이전 페이지";
      props.nextLabel = "다음 페이지";
      props.message = "현재 페이지";
      break;
    case "ProgressBar":
      props.value = 70;
      props.label = "처리 진행률";
      break;
    case "Resize":
      props.defaultValue = "one";
      break;
    case "Search":
      props.placeholder = "검색어를 입력해 주세요";
      props.onSearch = (value: string) => console.log("검색:", value);
      break;
    case "SideNavigation":
      props.title = "서비스 메뉴";
      props.items = menuItems("side-navigation");
      break;
    case "Snackbar":
      props.open = true;
      props.message = "변경사항이 저장되었습니다.";
      props.actionLabel = "되돌리기";
      props.closeLabel = "닫기";
      break;
    case "StepIndicator":
      props.current = 1;
      break;
    case "Tab":
      props.id = "vue-inventory-tab";
      props.tabs = tabItems;
      props.selected = "one";
      break;
    case "TabBar":
      props.items = [
        { id: "home", label: "홈" },
        { id: "guide", label: "가이드" },
        { id: "notice", label: "공지" },
      ];
      props.defaultSelected = "home";
      break;
    case "TextList":
    case "TextListOrdered":
      props.items = ["첫 번째 항목", "두 번째 항목"];
      break;
    case "Toast":
      delete props.open;
      props.message = "저장되었습니다.";
      props.defaultOpen = true;
      props.duration = 60000;
      break;
    case "TopButton":
      props.onClick = () => console.log("맨 위로 이동");
      break;
    case "TutorialPanel":
      props.open = true;
      props.tabs = [
        { id: "tutorial", label: "튜토리얼", panelId: "vue-tutorial-panel-one", value: "tutorial" },
      ];
      props.activeTab = "tutorial";
      props.tutorialTitle = "튜토리얼";
      props.tutorialBackTitle = "도움말로 돌아가기";
      props.tasks = [
        {
          title: "첫 단계",
          current: true,
          summary: "첫 단계를 확인합니다.",
          steps: ["안내를 읽습니다."],
        },
      ];
      break;
    case "UserFeedback":
      props.title = "이 페이지에 만족하시나요?";
      props.options = [
        { value: "satisfied", label: "만족" },
        { value: "dissatisfied", label: "불만족" },
      ];
      props.onSubmit = (value: string) => console.log("피드백:", value);
      break;
    default:
      break;
  }
  return props;
};
const labelStructuredListActions = (vnode: unknown) => {
  if (
    typeof HTMLElement === "undefined" ||
    !vnode ||
    typeof vnode !== "object" ||
    !("el" in vnode) ||
    !(vnode.el instanceof HTMLElement)
  ) {
    return;
  }
  vnode.el.querySelectorAll<HTMLButtonElement>(".card-btn button").forEach((button, index) => {
    button.setAttribute("aria-label", index % 2 === 0 ? "공유" : "관심 등록");
  });
};
const labelInventorySearchInputs = (vnode: unknown) => {
  if (
    typeof HTMLElement === "undefined" ||
    !vnode ||
    typeof vnode !== "object" ||
    !("el" in vnode) ||
    !(vnode.el instanceof HTMLElement)
  ) {
    return;
  }
  vnode.el.querySelectorAll<HTMLInputElement>(".sch-input input").forEach((input) => {
    input.setAttribute("aria-label", "사이트 검색");
  });
};
const renderInventoryComponent = (name: string) => {
  const component = (Components as Record<string, unknown>)[name] as Component;
  const props = inventoryProps(name);
  if (name === "Tab") {
    return h("div", { class: "inventory-tab-example", style: "min-width:0" }, [
      h(component, { ...props, "aria-label": "인벤토리 탭" }),
    ]);
  }
  if (name === "StructuredList") {
    return h(
      "div",
      {
        class: "inventory-structured-list",
        style: "min-width:0",
        onVnodeMounted: labelStructuredListActions,
      },
      h(component, props),
    );
  }
  if (name === "CoachMark") {
    // 인벤토리 데모는 여러 컴포넌트를 한 DOM에 합성하므로, 코치마크의 h5/h6이
    // 이전 컴포넌트의 h3과 단계를 건너뛰지 않도록 react 스토리와 동일하게
    // sr-only h3/h4 스캐폴딩을 둔다 (heading-order 규칙).
    return h("div", { class: "inventory-coach-mark" }, [
      h("h3", { class: "sr-only" }, "단계별 안내"),
      h("h4", { class: "sr-only" }, "코치마크 예시"),
      h(component, props),
    ]);
  }
  if (name === "StructuredListTable") {
    return h("div", { class: "inventory-structured-list-table", style: "min-width:0" }, [
      h(component, props),
      h(
        "label",
        { for: "vue-inventory-structured-list-table-service", class: "sr-only" },
        "서비스 선택",
      ),
    ]);
  }
  if (controlledKinds.has(name)) {
    return h(
      "div",
      {
        id: `vue-inventory-${slug(name)}-controls`,
        class: "inventory-controlled-component",
        style: "min-width:0;max-width:100%",
      },
      h(component, props),
    );
  }
  return h(component, props);
};

const meta = {
  title: "Vue/전체 컴포넌트",
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
  render: () => ({
    setup() {
      const modalOpen = ref(false);
      const modalSampleOpen = ref(false);
      return () =>
        h(
          "main",
          {
            id: "vue-main-content",
            "aria-label": "컴포넌트 인벤토리",
            onVnodeMounted: labelInventorySearchInputs,
            style:
              "display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;overflow-x:clip",
          },
          [
            h("h1", { class: "sr-only" }, "Vue 컴포넌트 인벤토리"),
            h(Components.Button, { variant: "primary" }, { default: () => BUTTON_TEXT.primary }),
            h(
              Components.Button,
              { variant: "secondary" },
              { default: () => BUTTON_TEXT.secondary },
            ),
            h(Components.Button, { variant: "tertiary" }, { default: () => BUTTON_TEXT.tertiary }),
            h(Components.Carousel, {
              id: "vue-carousel-contract",
              slides: contractSlides,
              actionLabel: "자세히 보기",
              previousLabel: "이전",
              nextLabel: "다음",
              moreLabel: "더 보기",
              imageLabel: "캐러셀 이미지",
            }),
            h(Components.CarouselBanner, {
              id: "vue-carousel-banner-contract",
              slides: contractSlides,
              previousLabel: "이전",
              nextLabel: "다음",
              moreLabel: "더 보기",
              playLabel: "재생",
              stopLabel: "정지",
              imageLabel: "배너 이미지",
            }),
            h(Components.Footer, {
              id: "krds-footer",
              logoLabel: "KRDS Community",
              address: "서울특별시",
              relatedSites: [{ id: "related", label: "관련 사이트" }],
              contacts: [{ title: "대표전화", description: "0000-0000" }],
              links: [{ id: "footer-link", label: "서비스 안내", href: "#footer-link" }],
              socialLinks: [{ id: "social", label: "소셜", href: "#social", icon: "facebook" }],
              policyLinks: [
                { id: "policy", label: "개인정보처리방침", href: "#policy", emphasis: true },
              ],
              copyright: "© KRDS Community",
            }),
            h(Components.Header, {
              id: "krds-header",
              logoLabel: "KRDS Community",
              logoHref: "#home",
              utilityItems: [{ id: "utility", label: "이용 안내", href: "#utility", kind: "link" }],
              desktopItems: contractNavigation,
              searchTitle: "검색",
              searchLabel: "검색",
              loginHref: "#login",
              loginLabel: "로그인",
              joinLabel: "회원가입",
              allMenuLabel: "전체 메뉴",
              menuLabel: "계약 헤더 주 메뉴",
              mobileMenu: {
                utilityItems: [{ id: "mobile-utility", label: "이용 안내", href: "#utility" }],
                loginLabel: "로그인",
                serviceItems: [{ id: "mobile-service", label: "서비스", href: "#service" }],
                searchPlaceholder: "검색어를 입력하세요",
                searchTitle: "사이트 검색",
                searchLabel: "검색",
                items: menuItems("contract-mobile"),
                previousLabel: "이전 메뉴",
                closeLabel: "메뉴 닫기",
                bottomItems: [{ id: "mobile-about", label: "사이트 안내", href: "#about" }],
              },
            }),
            h(Components.Link, { href: "#vue-link-contract", label: "계층형 링크" }),
            h(Components.Masthead, {
              id: "krds-masthead",
              message: "대한민국 공식 전자정부 누리집",
            }),
            h("div", { id: "krds-skip-link" }, [
              h(Components.SkipLink, { href: "#vue-main-content", label: "본문 바로가기" }),
            ]),
            h("div", { style: "display:contents" }, [
              h(
                "button",
                {
                  class: "krds-btn",
                  onClick: () => {
                    modalOpen.value = true;
                  },
                },
                { default: () => MODAL_TRIGGER_TEXT },
              ),
              h(Components.Modal, {
                id: "vue-modal-contract",
                title: MODAL_PROPS.title,
                description: MODAL_PROPS.description,
                open: modalOpen.value,
              }),
            ]),
            h("div", { style: "display:contents" }, [
              h(
                "button",
                {
                  class: "krds-btn",
                  onClick: () => {
                    modalSampleOpen.value = true;
                  },
                },
                { default: () => "모달 샘플 열기" },
              ),
              h(Components.ModalSample, {
                id: "vue-modal-sample-contract",
                title: "샘플 모달 제목",
                description: "샘플 모달 설명",
                open: modalSampleOpen.value,
              }),
            ]),
            h(Components.TextInputSize, {
              id: "vue-text-input-size",
              label: TEXT_INPUT_PROPS.label,
              size: "small",
              hint: TEXT_INPUT_PROPS.hint,
            }),
            h(Components.TextInputState, {
              id: "vue-text-input-state",
              label: TEXT_INPUT_PROPS.label,
              state: "error",
              hint: TEXT_INPUT_PROPS.hint,
            }),
            h(Components.TextInput, {
              id: "vue-text-input-error",
              label: TEXT_INPUT_PROPS.label,
              hint: TEXT_INPUT_PROPS.hint,
              error: "에러 메시지",
              state: "error",
            }),
            h(Components.TextInput, {
              id: "vue-text-input-success",
              label: TEXT_INPUT_PROPS.label,
              hint: TEXT_INPUT_PROPS.hint,
              state: "success",
            }),
            h(Components.TextInput, {
              id: "vue-text-input-information",
              label: TEXT_INPUT_PROPS.label,
              hint: TEXT_INPUT_PROPS.hint,
              state: "information",
            }),
            h(Components.Button, null, { default: () => BUTTON_HIERARCHY_TEXT }),
            h(Components.TextInput, {
              id: "vue-text-input-default",
              label: TEXT_INPUT_PROPS.label,
              hint: TEXT_INPUT_PROPS.hint,
            }),
            h(Components.Checkbox, {
              id: "vue-checkbox-default",
              label: CHECKBOX_LABEL_DEFAULT,
              name: "check",
            }),
            h(Components.Radio, {
              id: "vue-radio-default",
              label: RADIO_LABEL_DEFAULT,
              name: "radio",
              value: "one",
            }),
            h(Components.Switch, { id: "vue-switch-default", label: "스위치", name: "switch" }),
            h(Components.Checkbox, {
              id: "vue-checkbox-large",
              label: CHECKBOX_LABEL_LARGE,
              name: "check-large",
              size: "large",
            }),
            h(Components.Radio, {
              id: "vue-radio-large",
              label: RADIO_LABEL_LARGE,
              name: "radio-large",
              value: "large",
              size: "large",
            }),
            h(Components.Switch, {
              id: "vue-switch-large",
              label: "큰 스위치",
              name: "switch-large",
              size: "large",
            }),
            h("h3", { class: "sr-only" }, "추가 컴포넌트"),
            h("h4", { class: "sr-only" }, "추가 컴포넌트 예시"),
            h(Components.AccordionLine, {
              id: "vue-accordion-line",
              items: ACCORDION_ITEMS,
            }),
            h(Components.Accordion, {
              id: "vue-accordion-default",
              items: ACCORDION_ITEMS,
            }),
            h("div", { class: "krds-form-chip" }, [
              h(Components.RadioChip, {
                id: "vue-radio-chip",
                label: "chip 상태 : default ",
                name: "vue-radio-chip",
                value: "one",
                "aria-label": "라디오 칩",
              }),
            ]),
            h("div", { class: "krds-table-wrap" }, [
              h(Components.StructuredListTable, {
                id: "vue-structured-list-table",
                caption: "서비스 목록",
                columns: common.columns,
                rows: [{ id: "vue-service", name: "서비스", status: "운영 중" }],
              }),
              h(
                "label",
                { for: "vue-structured-list-table-vue-service", class: "sr-only" },
                "서비스 선택",
              ),
            ]),
            h("div", { class: "krds-table-wrap" }, [
              h(Components.Table, {
                id: "vue-table",
                caption: "서비스 현황",
                columns: common.columns,
                rows: common.rows,
              }),
            ]),
            ...names.map((name) => renderInventoryComponent(name)),
          ],
        );
    },
  }),
};
export const Alert: StoryObj<typeof meta> = {
  name: "알림",
  render: () => renderInventoryComponent("Alert"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Badge: StoryObj<typeof meta> = {
  name: "배지",
  render: () => renderInventoryComponent("Badge"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BadgeNumber: StoryObj<typeof meta> = {
  name: "배지 번호",
  render: () => renderInventoryComponent("BadgeNumber"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BadgeSize: StoryObj<typeof meta> = {
  name: "배지 크기",
  render: () => renderInventoryComponent("BadgeSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Breadcrumb: StoryObj<typeof meta> = {
  name: "브레드크럼",
  render: () => renderInventoryComponent("Breadcrumb"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BottomSheet: StoryObj<typeof meta> = {
  name: "바텀 시트",
  render: () => renderInventoryComponent("BottomSheet"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonHierarchy: StoryObj<typeof meta> = {
  name: "버튼 계층",
  render: () => renderInventoryComponent("ButtonHierarchy"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonIcon: StoryObj<typeof meta> = {
  name: "아이콘 버튼",
  render: () => renderInventoryComponent("ButtonIcon"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonSize: StoryObj<typeof meta> = {
  name: "버튼 크기",
  render: () => renderInventoryComponent("ButtonSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonText: StoryObj<typeof meta> = {
  name: "텍스트 버튼",
  render: () => renderInventoryComponent("ButtonText"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonWithIcon: StoryObj<typeof meta> = {
  name: "아이콘이 있는 버튼",
  render: () => renderInventoryComponent("ButtonWithIcon"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Calendar: StoryObj<typeof meta> = {
  name: "캘린더",
  render: () => renderInventoryComponent("Calendar"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CalendarRange: StoryObj<typeof meta> = {
  name: "캘린더 범위",
  render: () => renderInventoryComponent("CalendarRange"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Card: StoryObj<typeof meta> = {
  name: "카드",
  render: () => renderInventoryComponent("Card"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Carousel: StoryObj<typeof meta> = {
  name: "캐러셀",
  render: () => renderInventoryComponent("Carousel"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CarouselBanner: StoryObj<typeof meta> = {
  name: "캐러셀 배너",
  render: () => renderInventoryComponent("CarouselBanner"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CheckboxChip: StoryObj<typeof meta> = {
  name: "체크박스 칩",
  render: () => renderInventoryComponent("CheckboxChip"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CheckboxSize: StoryObj<typeof meta> = {
  name: "체크박스 크기",
  render: () => renderInventoryComponent("CheckboxSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Chip: StoryObj<typeof meta> = {
  name: "칩",
  render: () => renderInventoryComponent("Chip"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CoachMark: StoryObj<typeof meta> = {
  name: "코치마크",
  render: () => renderInventoryComponent("CoachMark"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ContextualHelp: StoryObj<typeof meta> = {
  name: "컨텍스추얼 헬프",
  render: () => renderInventoryComponent("ContextualHelp"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CriticalAlerts: StoryObj<typeof meta> = {
  name: "크리티컬 알림",
  render: () => renderInventoryComponent("CriticalAlerts"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const DateInput: StoryObj<typeof meta> = {
  name: "날짜 입력",
  render: () => renderInventoryComponent("DateInput"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Disclosure: StoryObj<typeof meta> = {
  name: "디스클로저",
  render: () => renderInventoryComponent("Disclosure"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Favicon: StoryObj<typeof meta> = {
  name: "파비콘",
  render: () => renderInventoryComponent("Favicon"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const FileUpload: StoryObj<typeof meta> = {
  name: "파일 업로드",
  render: () => renderInventoryComponent("FileUpload"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Footer: StoryObj<typeof meta> = {
  name: "푸터",
  render: () => renderInventoryComponent("Footer"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Header: StoryObj<typeof meta> = {
  name: "헤더",
  render: () => renderInventoryComponent("Header"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const HelpPanel: StoryObj<typeof meta> = {
  name: "헬프 패널",
  render: () => renderInventoryComponent("HelpPanel"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Identifier: StoryObj<typeof meta> = {
  name: "식별자",
  render: () => renderInventoryComponent("Identifier"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Infobox: StoryObj<typeof meta> = {
  name: "인포박스",
  render: () => renderInventoryComponent("Infobox"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const InPageNavigation: StoryObj<typeof meta> = {
  name: "페이지 내 네비게이션",
  render: () => renderInventoryComponent("InPageNavigation"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const LanguageSwitcher: StoryObj<typeof meta> = {
  name: "언어 전환",
  render: () => renderInventoryComponent("LanguageSwitcher"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const LanguageSwitcherPage: StoryObj<typeof meta> = {
  name: "언어 전환 페이지",
  render: () => renderInventoryComponent("LanguageSwitcherPage"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Link: StoryObj<typeof meta> = {
  name: "링크",
  render: () => renderInventoryComponent("Link"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const MainMenuMobile: StoryObj<typeof meta> = {
  name: "모바일 메인 메뉴",
  render: () => renderInventoryComponent("MainMenuMobile"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const MainMenuPc: StoryObj<typeof meta> = {
  name: "PC 메인 메뉴",
  render: () => renderInventoryComponent("MainMenuPc"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Masthead: StoryObj<typeof meta> = {
  name: "마스트헤드",
  render: () => renderInventoryComponent("Masthead"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Pagination: StoryObj<typeof meta> = {
  name: "페이지네이션",
  render: () => renderInventoryComponent("Pagination"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ProgressBar: StoryObj<typeof meta> = {
  name: "진행률",
  render: () => renderInventoryComponent("ProgressBar"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioButton: StoryObj<typeof meta> = {
  name: "라디오 버튼",
  render: () => renderInventoryComponent("RadioButton"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioChip: StoryObj<typeof meta> = {
  name: "라디오 칩",
  render: () => renderInventoryComponent("RadioChip"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioSize: StoryObj<typeof meta> = {
  name: "라디오 크기",
  render: () => renderInventoryComponent("RadioSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Resize: StoryObj<typeof meta> = {
  name: "리사이즈",
  render: () => renderInventoryComponent("Resize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Search: StoryObj<typeof meta> = {
  name: "검색",
  render: () => renderInventoryComponent("Search"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Select: StoryObj<typeof meta> = {
  name: "셀렉트",
  render: () => renderInventoryComponent("Select"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectSize: StoryObj<typeof meta> = {
  name: "셀렉트 크기",
  render: () => renderInventoryComponent("SelectSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectSorting: StoryObj<typeof meta> = {
  name: "정렬 셀렉트",
  render: () => renderInventoryComponent("SelectSorting"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectState: StoryObj<typeof meta> = {
  name: "셀렉트 상태",
  render: () => renderInventoryComponent("SelectState"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SideNavigation: StoryObj<typeof meta> = {
  name: "사이드 네비게이션",
  render: () => renderInventoryComponent("SideNavigation"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SkipLink: StoryObj<typeof meta> = {
  name: "스킵 링크",
  render: () => renderInventoryComponent("SkipLink"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Snackbar: StoryObj<typeof meta> = {
  name: "스낵바",
  render: () => renderInventoryComponent("Snackbar"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Spinner: StoryObj<typeof meta> = {
  name: "스피너",
  render: () => renderInventoryComponent("Spinner"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StepIndicator: StoryObj<typeof meta> = {
  name: "단계 표시기",
  render: () => renderInventoryComponent("StepIndicator"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StructuredList: StoryObj<typeof meta> = {
  name: "구조화된 목록",
  render: () => renderInventoryComponent("StructuredList"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StructuredListTable: StoryObj<typeof meta> = {
  name: "구조화된 테이블",
  render: () => renderInventoryComponent("StructuredListTable"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TabBar: StoryObj<typeof meta> = {
  name: "탭 바",
  render: () => renderInventoryComponent("TabBar"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Table: StoryObj<typeof meta> = {
  name: "테이블",
  render: () => renderInventoryComponent("Table"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Tag: StoryObj<typeof meta> = {
  name: "태그",
  render: () => renderInventoryComponent("Tag"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TagLink: StoryObj<typeof meta> = {
  name: "태그 링크",
  render: () => renderInventoryComponent("TagLink"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Textarea: StoryObj<typeof meta> = {
  name: "텍스트 영역",
  render: () => renderInventoryComponent("Textarea"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputIcon: StoryObj<typeof meta> = {
  name: "아이콘 텍스트 입력",
  render: () => renderInventoryComponent("TextInputIcon"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputSize: StoryObj<typeof meta> = {
  name: "텍스트 입력 크기",
  render: () => renderInventoryComponent("TextInputSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputState: StoryObj<typeof meta> = {
  name: "텍스트 입력 상태",
  render: () => renderInventoryComponent("TextInputState"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextList: StoryObj<typeof meta> = {
  name: "텍스트 목록",
  render: () => renderInventoryComponent("TextList"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextListOrdered: StoryObj<typeof meta> = {
  name: "순서 있는 텍스트 목록",
  render: () => renderInventoryComponent("TextListOrdered"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Toast: StoryObj<typeof meta> = {
  name: "토스트",
  render: () => renderInventoryComponent("Toast"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ToggleSwitch: StoryObj<typeof meta> = {
  name: "토글 스위치",
  render: () => renderInventoryComponent("ToggleSwitch"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ToggleSwitchSize: StoryObj<typeof meta> = {
  name: "토글 스위치 크기",
  render: () => renderInventoryComponent("ToggleSwitchSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Tooltip: StoryObj<typeof meta> = {
  name: "툴팁",
  render: () => renderInventoryComponent("Tooltip"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TooltipBox: StoryObj<typeof meta> = {
  name: "툴팁 박스",
  render: () => renderInventoryComponent("TooltipBox"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TooltipVertical: StoryObj<typeof meta> = {
  name: "수직 툴팁",
  render: () => renderInventoryComponent("TooltipVertical"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TopButton: StoryObj<typeof meta> = {
  name: "상단 이동",
  render: () => renderInventoryComponent("TopButton"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const Tts: StoryObj<typeof meta> = {
  name: "TTS",
  render: () => renderInventoryComponent("Tts"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TtsIcon: StoryObj<typeof meta> = {
  name: "TTS 아이콘",
  render: () => renderInventoryComponent("TtsIcon"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TtsSize: StoryObj<typeof meta> = {
  name: "TTS 크기",
  render: () => renderInventoryComponent("TtsSize"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TutorialPanel: StoryObj<typeof meta> = {
  name: "튜토리얼 패널",
  render: () => renderInventoryComponent("TutorialPanel"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const UserFeedback: StoryObj<typeof meta> = {
  name: "사용자 피드백",
  render: () => renderInventoryComponent("UserFeedback"),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
