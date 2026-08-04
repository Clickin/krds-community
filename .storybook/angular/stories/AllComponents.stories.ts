import type { Meta, StoryObj } from "@storybook/angular";
import { Directive, ElementRef } from "@angular/core";
import {
  KrdsAccordionComponent,
  KrdsAccordionLineComponent,
  KrdsBadgeComponent,
  KrdsBadgeNumberComponent,
  KrdsBadgeSizeComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonIconComponent,
  KrdsButtonSizeComponent,
  KrdsButtonTextComponent,
  KrdsButtonWithIconComponent,
  KrdsCalendarComponent,
  KrdsCalendarRangeComponent,
  KrdsCarouselComponent,
  KrdsCarouselBannerComponent,
  KrdsCheckboxComponent,
  KrdsCheckboxChipComponent,
  KrdsCheckboxSizeComponent,
  KrdsCoachMarkComponent,
  KrdsContextualHelpComponent,
  KrdsCriticalAlertsComponent,
  KrdsDateInputComponent,
  KrdsDisclosureComponent,
  KrdsFaviconComponent,
  KrdsFileUploadComponent,
  KrdsFooterComponent,
  KrdsHeaderComponent,
  KrdsHelpPanelComponent,
  KrdsIdentifierComponent,
  KrdsInPageNavigationComponent,
  KrdsLanguageSwitcherComponent,
  KrdsLanguageSwitcherPageComponent,
  KrdsLinkComponent,
  KrdsMainMenuMobileComponent,
  KrdsMainMenuPcComponent,
  KrdsMastheadComponent,
  KrdsModalComponent,
  KrdsModalSampleComponent,
  KrdsPaginationComponent,
  KrdsRadioButtonComponent,
  KrdsRadioChipComponent,
  KrdsRadioComponent,
  KrdsRadioSizeComponent,
  KrdsResizeComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectSortingComponent,
  KrdsSelectStateComponent,
  KrdsSideNavigationComponent,
  KrdsSkipLinkComponent,
  KrdsSpinnerComponent,
  KrdsStepIndicatorComponent,
  KrdsStructuredListComponent,
  KrdsStructuredListTableComponent,
  KrdsSwitchComponent,
  KrdsTabComponent,
  KrdsTableComponent,
  KrdsTagComponent,
  KrdsTagLinkComponent,
  KrdsTextInputComponent,
  KrdsTextInputIconComponent,
  KrdsTextInputSizeComponent,
  KrdsTextInputStateComponent,
  KrdsTextListComponent,
  KrdsTextListOrderedComponent,
  KrdsTextareaComponent,
  KrdsToggleSwitchComponent,
  KrdsToggleSwitchSizeComponent,
  KrdsTooltipComponent,
  KrdsTooltipBoxComponent,
  KrdsTooltipVerticalComponent,
  KrdsTtsComponent,
  KrdsTtsIconComponent,
  KrdsTtsSizeComponent,
  KrdsTutorialPanelComponent,
} from "@krds-community/angular";
import { KrdsAdditionalComponent } from "../../../tests/framework/fixtures/additional-test.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  ACCORDION_ITEMS,
  BUTTON_TEXT,
  CHECKBOX_LABEL_DEFAULT,
  CHECKBOX_LABEL_LARGE,
  MODAL_PROPS,
  RADIO_LABEL_DEFAULT,
  RADIO_LABEL_LARGE,
  TEXT_INPUT_PROPS,
} from "../../shared/story-props";
const fixtureIds = [
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

const links = [
  { id: "home", label: "홈", href: "#home", current: true },
  { id: "guide", label: "가이드", href: "#guide" },
  { id: "support", label: "지원", href: "#support" },
];
const accordionItems = ACCORDION_ITEMS;

const menuMobileItems = [
  {
    id: "depth-one",
    label: "첫 번째 메뉴",
    href: "#depth-one",
    children: [
      {
        id: "depth-two",
        label: "두 번째 메뉴",
        href: "#depth-two",
        children: [
          {
            id: "depth-three",
            label: "세 번째 메뉴",
            title: "세 번째 메뉴",
            href: "#depth-three",
            children: [{ id: "depth-four", label: "네 번째 메뉴", href: "#depth-four" }],
          },
        ],
      },
    ],
  },
  { id: "mobile-link", label: "단일 링크", href: "#mobile-link" },
];
const menuUtilityItems = [
  { id: "utility-home", label: "홈", href: "#home" },
  { id: "utility-help", label: "도움말", href: "#help" },
];
const menuServiceItems = [
  { id: "service-one", label: "서비스 안내", href: "#service-one" },
  { id: "service-two", label: "이용 방법", href: "#service-two" },
];
const menuBottomItems = [
  { id: "bottom-policy", label: "개인정보처리방침", href: "#policy" },
  { id: "bottom-accessibility", label: "웹 접근성", href: "#accessibility" },
];
const menuPcItems = [
  {
    id: "service",
    label: "서비스",
    active: true,
    children: [
      {
        id: "service-overview",
        label: "서비스 안내",
        title: "서비스 메뉴",
        titleHref: "#service",
        titleLinkLabel: "서비스 전체 보기",
        descriptionItems: [
          {
            title: "서비스 안내",
            description: "서비스 이용 방법을 확인하세요.",
            href: "#service-guide",
          },
          {
            title: "온라인 신청",
            description: "온라인으로 신청할 수 있습니다.",
            href: "#service-apply",
          },
        ],
        banner: { badge: "추천", label: "자주 찾는 서비스" },
        children: [
          { id: "service-guide", label: "서비스 안내", href: "#service-guide" },
          { id: "service-apply", label: "온라인 신청", href: "#service-apply" },
        ],
      },
    ],
  },
  {
    id: "guide",
    label: "가이드",
    title: "가이드 목록",
    banner: { badge: "안내", label: "가이드 전체 보기" },
    children: [{ id: "guide-start", label: "시작하기", href: "#guide-start" }],
  },
  { id: "notice", label: "공지사항", href: "#notice" },
  { id: "write", label: "공지 작성", button: true },
];
const headerResizeItems = [
  { id: "resize-default", label: "기본", href: "#resize-default", className: "md", selected: true },
  { id: "resize-large", label: "크게", href: "#resize-large", className: "lg" },
  { id: "resize-largest", label: "가장 크게", href: "#resize-largest", className: "xl" },
];
const headerUtilityItems = [
  { id: "header-home", kind: "link" as const, label: "홈", href: "#home" },
  {
    id: "header-resize",
    kind: "resize" as const,
    label: "화면 크기",
    selectedLabel: "현재 크기",
    resetLabel: "기본값으로 초기화",
    items: headerResizeItems,
  },
];
const headerMobileMenu = {
  utilityItems: headerUtilityItems,
  loginLabel: "로그인",
  serviceItems: menuServiceItems,
  searchPlaceholder: "검색어를 입력하세요",
  searchTitle: "통합검색",
  searchLabel: "검색",
  items: menuMobileItems,
  previousLabel: "이전 메뉴",
  closeLabel: "메뉴 닫기",
  bottomItems: menuBottomItems,
};

const footerRelatedSites = [
  { id: "site-one", label: "related_site", title: "related_site 레이어", href: "#" },
  { id: "site-two", label: "related_site", title: "related_site 레이어", href: "#" },
  { id: "site-three", label: "related_site", title: "related_site 레이어", href: "#" },
  { id: "site-four", label: "related_site", title: "related_site 레이어", href: "#" },
];
const footerLinks = [
  { id: "directions", label: "찾아오시는 길", href: "#" },
  { id: "guide", label: "이용안내", href: "#" },
  { id: "staff", label: "직원검색", href: "#" },
];
const footerSocialLinks = [
  {
    id: "instagram",
    label: "인스타그램",
    icon: "ico-instagram",
    href: "#",
    target: "_blank",
    title: "새 창 열기",
  },
  {
    id: "youtube",
    label: "유튜브",
    icon: "ico-youtube",
    href: "#",
    target: "_blank",
    title: "새 창 열기",
  },
  { id: "x", label: "X", icon: "ico-sns-x", href: "#", target: "_blank", title: "새 창 열기" },
  {
    id: "facebook",
    label: "페이스북",
    icon: "ico-facebook",
    href: "#",
    target: "_blank",
    title: "새 창 열기",
  },
  {
    id: "blog",
    label: "블로그",
    icon: "ico-blog",
    href: "#",
    target: "_blank",
    title: "새 창 열기",
  },
];
const footerPolicyLinks = [
  { id: "privacy", label: "개인정보처리방침", href: "#", emphasis: true },
  { id: "copyright", label: "저작권 정책", href: "#" },
  { id: "accessibility", label: "웹 접근성 품질인증 마크 획득", href: "#" },
];
const footerContacts = [
  { title: "대표전화 1577-1000", description: "(유료, 평일 09시~18시)" },
  { title: "해외이용 82-33-811-2001", description: "(유료, 평일 09시~18시)" },
];
const structuredTableColumns = [
  { key: "type", label: "유형" },
  { key: "title", label: "제목" },
  { key: "content", label: "내용" },
  { key: "download", label: "다운로드", visuallyHidden: true },
  { key: "published", label: "게시일" },
];
const structuredTableRows = [
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
  {
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    published: "2025.12.17",
  },
];
const structuredTableActions = [
  { id: "action-one", label: "핵심버튼", icon: "ico-down" },
  { id: "action-two", label: "핵심버튼", icon: "ico-down" },
  { id: "action-three", label: "핵심버튼", icon: "ico-down" },
  { id: "action-four", label: "핵심버튼", icon: "ico-down" },
];
const structuredTablePagination = {
  current: 4,
  items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
  previousDisabled: true,
  previousLabel: "이전",
  nextLabel: "다음",
  currentLabel: "현재페이지",
};
const tableColumns = [
  { key: "title1", label: "제목1" },
  { key: "title2", label: "제목2" },
];
const tableRows = [
  { title1: "제목1-1", title2: "내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다." },
  { title1: "제목1-2", title2: "내용이 들어갑니다." },
  { title1: "제목1-3", title2: "내용이 들어갑니다. 내용이 들어갑니다." },
];
const options = [
  { value: "one", label: "첫 번째" },
  { value: "two", label: "두 번째" },
  { value: "three", label: "세 번째" },
];
const slides = [
  {
    id: "slide-one",
    title: "주요 소식",
    description: "서비스 업데이트 안내입니다.",
    href: "#slide-one",
  },
  {
    id: "slide-two",
    title: "이용 안내",
    description: "공공서비스 이용 방법을 확인하세요.",
    href: "#slide-two",
  },
];
const tabs = [
  { id: "tab-one", label: "첫 번째 탭" },
  { id: "tab-two", label: "두 번째 탭" },
];
const panels = {
  "tab-one": "첫 번째 패널 내용입니다.",
  "tab-two": "두 번째 패널 내용입니다.",
};
const steps = [
  { id: "step-one", label: "신청", description: "신청 정보를 입력합니다." },
  { id: "step-two", label: "확인", description: "입력 내용을 확인합니다." },
  { id: "step-three", label: "완료", description: "신청을 완료합니다." },
];
const listItems = [
  { id: "list-one", label: "첫 번째 안내", children: ["하위 안내"] },
  { id: "list-two", label: "두 번째 안내" },
];
const navTree = [
  { id: "nav-home", label: "홈", href: "#home" },
  {
    id: "nav-guide",
    label: "가이드",
    href: "#guide",
    children: [{ id: "nav-start", label: "시작하기", href: "#start" }],
  },
];
const playLabel = "재생";
const stopLabel = "정지";

@Directive({
  selector: "[auditExpandedReady]",
  standalone: true,
})
class AuditExpandedReadyDirective {}

@Directive({
  selector: "[auditCriticalAlerts]",
  standalone: true,
})
class AuditCriticalAlertsDirective {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector(".krds-critical-alerts")?.removeAttribute("role");
  }
}

const aliasComponents = [
  KrdsAccordionLineComponent,
  KrdsBadgeComponent,
  KrdsBadgeNumberComponent,
  KrdsBadgeSizeComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonIconComponent,
  KrdsButtonSizeComponent,
  KrdsButtonTextComponent,
  KrdsButtonWithIconComponent,
  KrdsCalendarComponent,
  KrdsCalendarRangeComponent,
  KrdsCarouselComponent,
  KrdsCarouselBannerComponent,
  KrdsCheckboxChipComponent,
  KrdsCheckboxSizeComponent,
  KrdsCoachMarkComponent,
  KrdsContextualHelpComponent,
  KrdsCriticalAlertsComponent,
  KrdsDateInputComponent,
  KrdsDisclosureComponent,
  KrdsFaviconComponent,
  KrdsFileUploadComponent,
  KrdsFooterComponent,
  KrdsHeaderComponent,
  KrdsHelpPanelComponent,
  KrdsIdentifierComponent,
  KrdsInPageNavigationComponent,
  KrdsLanguageSwitcherComponent,
  KrdsLanguageSwitcherPageComponent,
  KrdsLinkComponent,
  KrdsMainMenuMobileComponent,
  KrdsMainMenuPcComponent,
  KrdsMastheadComponent,
  KrdsModalComponent,
  KrdsModalSampleComponent,
  KrdsPaginationComponent,
  KrdsRadioButtonComponent,
  KrdsRadioChipComponent,
  KrdsRadioSizeComponent,
  KrdsResizeComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectSortingComponent,
  KrdsSelectStateComponent,
  KrdsSideNavigationComponent,
  KrdsSkipLinkComponent,
  KrdsSpinnerComponent,
  KrdsStepIndicatorComponent,
  KrdsStructuredListComponent,
  KrdsStructuredListTableComponent,
  KrdsTabComponent,
  KrdsTableComponent,
  KrdsTagComponent,
  KrdsTagLinkComponent,
  KrdsTextareaComponent,
  KrdsTextInputIconComponent,
  KrdsTextInputSizeComponent,
  KrdsTextInputStateComponent,
  KrdsTextListComponent,
  KrdsTextListOrderedComponent,
  KrdsToggleSwitchComponent,
  KrdsToggleSwitchSizeComponent,
  KrdsTooltipComponent,
  KrdsTooltipBoxComponent,
  KrdsTooltipVerticalComponent,
  KrdsTtsComponent,
  KrdsTtsIconComponent,
  KrdsTtsSizeComponent,
  KrdsTutorialPanelComponent,
] as const;
const sharedImports = [
  FormsModule,
  ReactiveFormsModule,
  KrdsAccordionComponent,
  KrdsAdditionalComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
  ...Array.from(new Set(aliasComponents)),
  AuditExpandedReadyDirective,
  AuditCriticalAlertsDirective,
];

type InventoryArgs = {
  buttonVariant: "primary" | "secondary" | "tertiary";
  buttonSize: "small" | "medium" | "large";
  inputState: "default" | "error" | "success" | "information";
  menuOpen: boolean;
};

const meta = {
  title: "Angular/전체 컴포넌트",
  component: KrdsAdditionalComponent,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    fixtureIds: [...fixtureIds],
  },
  argTypes: {
    buttonVariant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    buttonSize: { control: "select", options: ["small", "medium", "large"] },
    inputState: { control: "select", options: ["default", "error", "success", "information"] },
    menuOpen: { control: "boolean" },
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: { imports: sharedImports },
    }),
  ],
} satisfies Meta<InventoryArgs>;
export default meta;

type Story = StoryObj;

export const Badge: Story = {
  name: "배지",
  render: () => ({
    template:
      '<krds-badge [kind]="kind" [label]="label" [tone]="tone" [appearance]="appearance"></krds-badge>',
    props: { kind: "badge", label: "상태", tone: "primary", appearance: "outline" },
  }),
  parameters: { fixtureId: "badge.default", a11y: { test: "error" } },
};

export const BadgeNumber: Story = {
  name: "배지 번호",
  render: () => ({
    template:
      '<krds-badge-number [kind]="kind" [label]="label" [number]="true" [tone]="tone"></krds-badge-number>',
    props: { kind: "badge-number", label: "3", tone: "primary" },
  }),
  parameters: { fixtureId: "badge-number.default", a11y: { test: "error" } },
};

export const BadgeSize: Story = {
  name: "배지 크기",
  render: () => ({
    template:
      '<krds-badge-size [kind]="kind" [label]="label" [size]="size" [tone]="tone"></krds-badge-size>',
    props: { kind: "badge-size", label: "중요", size: "large", tone: "primary" },
  }),
  parameters: { fixtureId: "badge-size.default", a11y: { test: "error" } },
};

export const Breadcrumb: Story = {
  name: "브레드크럼",
  render: () => ({
    template: '<krds-breadcrumb [kind]="kind" [items]="items" [label]="label"></krds-breadcrumb>',
    props: { kind: "breadcrumb", items: links, label: "현재 경로" },
  }),
  parameters: { fixtureId: "breadcrumb.default", a11y: { test: "error" } },
};

export const ButtonHierarchy: Story = {
  name: "버튼 계층",
  render: () => ({
    template:
      '<krds-button-hierarchy [kind]="kind" [variant]="variant" [size]="size" [type]="type" [label]="label"></krds-button-hierarchy>',
    props: {
      kind: "button-hierarchy",
      variant: "primary",
      size: "medium",
      type: "button",
      label: "계층 버튼",
    },
  }),
  parameters: { fixtureId: "button-hierarchy.default", a11y: { test: "error" } },
};

export const ButtonIcon: Story = {
  name: "아이콘 버튼",
  render: () => ({
    template: '<krds-button-icon [kind]="kind" [label]="label" [size]="size"></krds-button-icon>',
    props: { kind: "button-icon", label: "검색", size: "medium" },
  }),
  parameters: { fixtureId: "button-icon.default", a11y: { test: "error" } },
};

export const ButtonSize: Story = {
  name: "버튼 크기",
  render: () => ({
    template: '<krds-button-size [kind]="kind" [size]="size" [label]="label"></krds-button-size>',
    props: { kind: "button-size", size: "medium", label: "큰 버튼" },
  }),
  parameters: { fixtureId: "button-size.default", a11y: { test: "error" } },
};

export const ButtonText: Story = {
  name: "텍스트 버튼",
  render: () => ({
    template: '<krds-button-text [kind]="kind" [label]="label"></krds-button-text>',
    props: { kind: "button-text", label: "텍스트 버튼" },
  }),
  parameters: { fixtureId: "button-text.default", a11y: { test: "error" } },
};

export const ButtonWithIcon: Story = {
  name: "아이콘이 있는 버튼",
  render: () => ({
    template:
      '<krds-button-with-icon [kind]="kind" [label]="label" [size]="size"></krds-button-with-icon>',
    props: { kind: "button-with-icon", label: "다음", size: "medium" },
  }),
  parameters: { fixtureId: "button-with-icon.default", a11y: { test: "error" } },
};

export const Calendar: Story = {
  name: "캘린더",
  render: () => ({
    template:
      '<krds-calendar [kind]="kind" [id]="id" [label]="label" [value]="value" [year]="year" [month]="month" [years]="years" [leadingDays]="leadingDays" [previousMonthDayCount]="previousMonthDayCount" [dayCount]="dayCount" [rangeStartDay]="rangeStartDay" [rangeEndDay]="rangeEndDay" [todayDay]="todayDay" [eventDays]="eventDays" [disabledDays]="disabledDays" [weekdays]="weekdays" [previousMonthLabel]="previousMonthLabel" [nextMonthLabel]="nextMonthLabel" [yearSelectLabel]="yearSelectLabel" [monthSelectLabel]="monthSelectLabel" [todayLabel]="todayLabel" [eventLabel]="eventLabel" [cancelLabel]="cancelLabel" [confirmLabel]="confirmLabel"></krds-calendar>',
    props: {
      kind: "calendar",
      id: "angular-story-calendar",
      label: "날짜",
      value: "2026.07.27",
      year: 2026,
      month: 7,
      years: [2026, 2027],
      leadingDays: 0,
      previousMonthDayCount: 30,
      dayCount: 31,
      rangeStartDay: 20,
      rangeEndDay: 25,
      todayDay: 27,
      eventDays: [10, 18],
      disabledDays: [5, 12],
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      previousMonthLabel: "이전 달",
      nextMonthLabel: "다음 달",
      yearSelectLabel: "연도 선택",
      monthSelectLabel: "월 선택",
      todayLabel: "오늘",
      eventLabel: "행사일",
      cancelLabel: "취소",
      confirmLabel: "확인",
    },
  }),
  parameters: { fixtureId: "calendar.default", a11y: { test: "error" } },
};

export const CalendarRange: Story = {
  name: "캘린더 범위",
  render: () => ({
    template:
      '<krds-calendar-range [kind]="kind" [id]="id" [label]="label" [value]="value" [year]="year" [month]="month" [years]="years" [leadingDays]="leadingDays" [previousMonthDayCount]="previousMonthDayCount" [dayCount]="dayCount" [rangeStartDay]="rangeStartDay" [rangeEndDay]="rangeEndDay" [todayDay]="todayDay" [eventDays]="eventDays" [disabledDays]="disabledDays" [weekdays]="weekdays" [previousMonthLabel]="previousMonthLabel" [nextMonthLabel]="nextMonthLabel" [yearSelectLabel]="yearSelectLabel" [monthSelectLabel]="monthSelectLabel" [todayLabel]="todayLabel" [eventLabel]="eventLabel" [cancelLabel]="cancelLabel" [confirmLabel]="confirmLabel"></krds-calendar-range>',
    props: {
      kind: "calendar-range",
      id: "angular-story-calendar-range",
      label: "기간",
      value: "2026.07.27",
      year: 2026,
      month: 7,
      years: [2026, 2027],
      leadingDays: 0,
      previousMonthDayCount: 30,
      dayCount: 31,
      rangeStartDay: 20,
      rangeEndDay: 25,
      todayDay: 27,
      eventDays: [10, 18],
      disabledDays: [5, 12],
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      previousMonthLabel: "이전 달",
      nextMonthLabel: "다음 달",
      yearSelectLabel: "연도 선택",
      monthSelectLabel: "월 선택",
      todayLabel: "오늘",
      eventLabel: "행사일",
      cancelLabel: "취소",
      confirmLabel: "확인",
    },
  }),
  parameters: { fixtureId: "calendar-range.default", a11y: { test: "error" } },
};

export const Carousel: Story = {
  name: "캐러셀",
  render: () => ({
    template:
      '<krds-carousel [kind]="kind" [slides]="slides" [label]="label" [actionLabel]="actionLabel" [imageLabel]="imageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel>',
    props: {
      kind: "carousel",
      slides,
      label: "주요 콘텐츠",
      actionLabel: "자세히 보기",
      imageLabel: "주요 콘텐츠 이미지",
      moreLabel: "더 보기",
      playLabel,
      stopLabel,
      nextLabel: "다음",
      previousLabel: "이전",
    },
  }),
  parameters: { fixtureId: "carousel.default", a11y: { test: "error" } },
};

export const CarouselBanner: Story = {
  name: "배너 캐러셀",
  render: () => ({
    template:
      '<krds-carousel-banner [kind]="kind" [slides]="slides" [label]="label" [actionLabel]="actionLabel" [imageLabel]="imageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel-banner>',
    props: {
      kind: "carousel-banner",
      slides,
      label: "주요 콘텐츠",
      actionLabel: "자세히 보기",
      imageLabel: "주요 콘텐츠 이미지",
      moreLabel: "더 보기",
      playLabel,
      stopLabel,
      nextLabel: "다음",
      previousLabel: "이전",
    },
  }),
  parameters: { fixtureId: "carousel-banner.default", a11y: { test: "error" } },
};

export const CheckboxChip: Story = {
  name: "체크박스 칩",
  render: () => ({
    template:
      '<krds-checkbox-chip [kind]="kind" [id]="id" [label]="label" [name]="name" [checked]="true"></krds-checkbox-chip>',
    props: {
      kind: "checkbox-chip",
      id: "angular-story-chk-chip",
      label: "이메일 수신",
      name: "email",
    },
  }),
  parameters: { fixtureId: "checkbox-chip.default", a11y: { test: "error" } },
};

export const CheckboxSize: Story = {
  name: "체크박스 크기",
  render: () => ({
    template:
      '<krds-checkbox-size [kind]="kind" [id]="id" [label]="label" [size]="size" [checked]="false"></krds-checkbox-size>',
    props: {
      kind: "checkbox-size",
      id: "angular-story-chk-size",
      label: CHECKBOX_LABEL_LARGE,
      size: "large",
    },
  }),
  parameters: { fixtureId: "checkbox-size.default", a11y: { test: "error" } },
};

export const CoachMark: Story = {
  name: "코치마크",
  render: () => ({
    template:
      '<krds-coach-mark [kind]="kind" [title]="title" [stepTitle]="stepTitle" [description]="description" [contentTitle]="contentTitle" [step]="step" [currentStepLabel]="currentStepLabel" [totalStepsLabel]="totalStepsLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel"></krds-coach-mark>',
    props: {
      kind: "coach-mark",
      title: "따라하기",
      stepTitle: "첫 번째 단계",
      description: "현재 단계 안내입니다.",
      contentTitle: "사용 방법",
      step: "1/3",
      currentStepLabel: "현재 단계",
      totalStepsLabel: "전체 단계",
      stopLabel: "튜토리얼 종료",
      nextLabel: "다음 단계",
    },
  }),
  parameters: { fixtureId: "coach-mark.default", a11y: { test: "error" } },
};

export const ContextualHelp: Story = {
  name: "컨텍스추얼 헬프",
  render: () => ({
    template:
      '<krds-contextual-help [kind]="kind" [label]="label" [title]="title" [description]="description" [caption]="caption" [position]="position" [href]="href" [linkLabel]="linkLabel" [closeLabel]="closeLabel"></krds-contextual-help>',
    props: {
      kind: "contextual-help",
      label: "도움말",
      title: "도움말 제목",
      description: "도움말 내용을 확인합니다.",
      caption: "도움말 내용을 확인합니다.",
      position: "top",
      href: "#help",
      linkLabel: "도움말 자세히 보기",
      closeLabel: "도움말 닫기",
    },
  }),
  parameters: { fixtureId: "contextual-help.default", a11y: { test: "error" } },
};

export const CriticalAlerts: Story = {
  name: "크리티컬 알림",
  render: () => ({
    template: '<krds-critical-alerts [kind]="kind" [items]="items"></krds-critical-alerts>',
    props: {
      kind: "critical-alerts",
      items: [
        {
          id: "alert-one",
          label: "긴급 안내",
          title: "긴급 안내",
          description: "서비스 점검이 예정되어 있습니다.",
          tone: "danger",
          badgeLabel: "긴급",
          linkLabel: "자세히 보기",
          href: "#alert-one",
        },
      ],
    },
  }),
  parameters: { fixtureId: "critical-alerts.default", a11y: { test: "error" } },
};

export const DateInput: Story = {
  name: "날짜 입력",
  render: () => ({
    template:
      '<krds-date-input [kind]="kind" [id]="id" [label]="label" [value]="value" [year]="year" [month]="month" [years]="years" [leadingDays]="leadingDays" [previousMonthDayCount]="previousMonthDayCount" [dayCount]="dayCount" [rangeStartDay]="rangeStartDay" [rangeEndDay]="rangeEndDay" [todayDay]="todayDay" [eventDays]="eventDays" [disabledDays]="disabledDays" [weekdays]="weekdays" [previousMonthLabel]="previousMonthLabel" [nextMonthLabel]="nextMonthLabel" [yearSelectLabel]="yearSelectLabel" [monthSelectLabel]="monthSelectLabel" [todayLabel]="todayLabel" [eventLabel]="eventLabel" [cancelLabel]="cancelLabel" [confirmLabel]="confirmLabel"></krds-date-input>',
    props: {
      kind: "date-input",
      id: "angular-story-date-input",
      label: "날짜 입력",
      value: "2026-07-27",
      year: 2026,
      month: 7,
      years: [2026, 2027],
      leadingDays: 0,
      previousMonthDayCount: 30,
      dayCount: 31,
      rangeStartDay: 20,
      rangeEndDay: 25,
      todayDay: 27,
      eventDays: [10, 18],
      disabledDays: [5, 12],
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      previousMonthLabel: "이전 달",
      nextMonthLabel: "다음 달",
      yearSelectLabel: "연도 선택",
      monthSelectLabel: "월 선택",
      todayLabel: "오늘",
      eventLabel: "행사일",
      cancelLabel: "취소",
      confirmLabel: "확인",
    },
  }),
  parameters: { fixtureId: "date-input.default", a11y: { test: "error" } },
};

export const Disclosure: Story = {
  name: "디스클로저",
  render: () => ({
    template:
      '<krds-disclosure [kind]="kind" [title]="title" [description]="description" [open]="false" [closeLabel]="closeLabel"></krds-disclosure>',
    props: {
      kind: "disclosure",
      title: "상세 보기",
      description: "상세 내용을 확인합니다.",
      closeLabel: "상세 닫기",
    },
  }),
  parameters: { fixtureId: "disclosure.default", a11y: { test: "error" } },
};

export const Favicon: Story = {
  name: "파비콘",
  render: () => ({
    template: '<krds-favicon [kind]="kind" [href]="href" [label]="label"></krds-favicon>',
    props: { kind: "favicon", href: "/favicon.ico", label: "사이트 아이콘" },
  }),
  parameters: { fixtureId: "favicon.default", a11y: { test: "error" } },
};

export const FileUpload: Story = {
  name: "파일 업로드",
  render: () => ({
    template:
      '<krds-file-upload [kind]="kind" [id]="id" [title]="title" [description]="description" [prompt]="prompt" [inputId]="inputId" [selectLabel]="selectLabel" [files]="files" [deleteAllLabel]="deleteAllLabel" [currentCount]="currentCount" [maxCount]="maxCount" [countSuffix]="countSuffix"></krds-file-upload>',
    props: {
      kind: "file-upload",
      id: "angular-story-file-upload",
      title: "파일 업로드",
      description: "파일을 선택하세요.",
      prompt: "파일을 첨부하세요.",
      inputId: "angular-story-file-input",
      selectLabel: "파일 선택",
      files: [
        { id: "file-one", name: "안내문.pdf", status: "complete", statusLabel: "업로드 완료" },
      ],
      deleteAllLabel: "전체 삭제",
      currentCount: 1,
      maxCount: 3,
      countSuffix: "개",
    },
  }),
  parameters: { fixtureId: "file-upload.default", a11y: { test: "error" } },
};

export const Footer: Story = {
  name: "푸터",
  render: () => ({
    template:
      '<krds-footer [kind]="kind" [id]="id" [relatedSites]="relatedSites" [logoLabel]="logoLabel" [address]="address" [contacts]="contacts" [links]="links" [socialLinks]="socialLinks" [policyLinks]="policyLinks" [copyright]="copyright" [organization]="organization" [description]="description"></krds-footer>',
    props: {
      kind: "footer",
      id: "krds-footer",
      relatedSites: footerRelatedSites,
      logoLabel: "KRDS - Korea Design System",
      address: "(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단",
      contacts: footerContacts,
      links: footerLinks,
      socialLinks: footerSocialLinks,
      policyLinks: footerPolicyLinks,
      copyright: "© 2023 National Health Insurance Service. All rights reserved.",
      organization: "KRDS - Korea Design System",
      description: "이 누리집은 보건복지부 누리집입니다.",
    },
  }),
  parameters: { fixtureId: "footer.default", a11y: { test: "error" } },
};

export const Header: Story = {
  name: "헤더",
  render: () => ({
    template:
      '<krds-header [id]="id" [title]="title" [menuLabel]="menuLabel" [links]="links" [desktopItems]="desktopItems" [utilityItems]="utilityItems" [mobileMenu]="mobileMenu" [logoHref]="logoHref" [logoLabel]="logoLabel" [searchTitle]="searchTitle" [searchLabel]="searchLabel" [loginLabel]="loginLabel" [loginHref]="loginHref" [joinLabel]="joinLabel" [allMenuLabel]="allMenuLabel"></krds-header>',
    props: {
      id: "angular-story-header",
      title: "KRDS Community",
      menuLabel: "헤더 주 메뉴",
      links,
      desktopItems: menuPcItems,
      utilityItems: headerUtilityItems,
      mobileMenu: headerMobileMenu,
      logoHref: "#",
      logoLabel: "KRDS Community 홈",
      searchTitle: "통합검색",
      searchLabel: "검색",
      loginLabel: "로그인",
      loginHref: "#login",
      joinLabel: "회원가입",
      allMenuLabel: "전체 메뉴",
    },
  }),
  parameters: { fixtureId: "header.default", a11y: { test: "error" } },
};

export const HelpPanel: Story = {
  name: "헬프 패널",
  render: () => ({
    template:
      '<krds-help-panel [kind]="kind" [open]="true" [title]="title" [description]="description" [label]="label" [collapseLabel]="collapseLabel" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="tutorialTitle" [stopLabel]="stopLabel"></krds-help-panel>',
    props: {
      kind: "help-panel",
      title: "도움말",
      description: "도움말 패널 내용입니다.",
      label: "도움말 패널",
      collapseLabel: "도움말 접기",
      tabs,
      panels,
      selectedLabel: "선택됨",
      tutorialTitle: "도움말 튜토리얼",
      stopLabel: "도움말 종료",
    },
  }),
  parameters: { fixtureId: "help-panel.default", a11y: { test: "error" } },
};

export const Identifier: Story = {
  name: "식별자",
  render: () => ({
    template:
      '<krds-identifier [organization]="organization" [description]="description"></krds-identifier>',
    props: { organization: "KRDS - Korea Design System", description: "공공서비스 디자인 시스템" },
  }),
  parameters: { fixtureId: "identifier.default", a11y: { test: "error" } },
};

export const InPageNavigation: Story = {
  name: "페이지 내 네비게이션",
  render: () => ({
    template:
      '<krds-in-page-navigation [kind]="kind" [title]="title" [items]="items" [actionLabel]="actionLabel"></krds-in-page-navigation>',
    props: {
      kind: "in-page-navigation",
      title: "페이지 내 이동",
      items: links,
      actionLabel: "온라인 신청하기",
    },
  }),
  parameters: { fixtureId: "in-page-navigation.default", a11y: { test: "error" } },
};

export const LanguageSwitcher: Story = {
  name: "언어 전환",
  render: () => ({
    template:
      '<krds-language-switcher [kind]="kind" [id]="id" [languages]="languages" [selected]="selected" [label]="label"></krds-language-switcher>',
    props: {
      kind: "language-switcher",
      id: "angular-story-lang",
      languages: options,
      selected: "one",
      label: "언어 선택",
    },
  }),
  parameters: { fixtureId: "language-switcher.default", a11y: { test: "error" } },
};

export const LanguageSwitcherPage: Story = {
  name: "언어 전환 페이지",
  render: () => ({
    template:
      '<krds-language-switcher-page [kind]="kind" [id]="id" [languages]="languages" [selected]="selected" [label]="label"></krds-language-switcher-page>',
    props: {
      kind: "language-switcher-page",
      id: "angular-story-lang-page",
      languages: options,
      selected: "one",
      label: "페이지 언어 선택",
    },
  }),
  parameters: { fixtureId: "language-switcher-page.default", a11y: { test: "error" } },
};

export const Link: Story = {
  name: "링크",
  render: () => ({
    template:
      '<krds-link [kind]="kind" [label]="label" [href]="href" [target]="target" [title]="title"></krds-link>',
    props: {
      kind: "link",
      label: "자세히 보기",
      href: "#details",
      target: "_blank",
      title: "새 창 열기",
    },
  }),
  parameters: { fixtureId: "link.default", a11y: { test: "error" } },
};

export const MainMenuMobile: Story = {
  name: "모바일 메인 메뉴",
  render: () => ({
    template:
      '<krds-main-menu-mobile [kind]="kind" [menuLabel]="mobileMenuLabel" [utilityItems]="utilityItems" [loginLabel]="loginLabel" [serviceItems]="serviceItems" [searchPlaceholder]="searchPlaceholder" [searchTitle]="searchTitle" [searchLabel]="searchLabel" [items]="items" [previousLabel]="previousLabel" [closeLabel]="closeLabel" [bottomItems]="bottomItems" [open]="false" [sample]="sample" [className]="className"></krds-main-menu-mobile>',
    props: {
      kind: "main-menu-mobile",
      mobileMenuLabel: "모바일 메뉴",
      utilityItems: menuUtilityItems,
      loginLabel: "로그인",
      serviceItems: menuServiceItems,
      searchPlaceholder: "검색어를 입력하세요.",
      searchTitle: "통합검색",
      searchLabel: "검색",
      items: menuMobileItems,
      previousLabel: "이전 메뉴",
      closeLabel: "메뉴 닫기",
      bottomItems: menuBottomItems,
      sample: "기본",
      className: "sample",
    },
  }),
  parameters: { fixtureId: "main-menu-mobile.default", a11y: { test: "error" } },
};

export const MainMenuPc: Story = {
  name: "PC 메인 메뉴",
  render: () => ({
    template:
      '<krds-main-menu-pc [kind]="kind" [items]="items" [menuLabel]="menuLabel" [sample]="sample" [className]="className"></krds-main-menu-pc>',
    props: {
      kind: "main-menu-pc",
      items: menuPcItems,
      menuLabel: "주 메뉴",
      sample: "기본",
      className: "sample",
    },
  }),
  parameters: { fixtureId: "main-menu-pc.default", a11y: { test: "error" } },
};

export const Masthead: Story = {
  name: "마스트헤드",
  render: () => ({
    template: '<krds-masthead [id]="id" [message]="message"></krds-masthead>',
    props: { id: "krds-masthead", message: "대한민국 공식 전자정부 누리집" },
  }),
  parameters: { fixtureId: "masthead.default", a11y: { test: "error" } },
};

export const Pagination: Story = {
  name: "페이지네이션",
  render: () => ({
    template:
      '<krds-pagination [kind]="kind" [items]="items" [current]="current" [previousLabel]="previousLabel" [nextLabel]="nextLabel" [message]="message"></krds-pagination>',
    props: {
      kind: "pagination",
      items: [1, 2, 3, "ellipsis", 5],
      current: 1,
      previousLabel: "이전",
      nextLabel: "다음",
      message: "현재 페이지",
    },
  }),
  parameters: { fixtureId: "pagination.default", a11y: { test: "error" } },
};

export const RadioButton: Story = {
  name: "라디오 버튼",
  render: () => ({
    template:
      '<krds-radio-button [kind]="kind" [id]="id" [label]="label" [name]="name" [value]="value" [checked]="true"></krds-radio-button>',
    props: {
      kind: "radio-button",
      id: "angular-story-rdo-btn",
      label: "라디오 버튼",
      name: "radio-button",
      value: "one",
    },
  }),
  parameters: { fixtureId: "radio-button.default", a11y: { test: "error" } },
};

export const RadioChip: Story = {
  name: "라디오 칩",
  render: () => ({
    template:
      '<krds-radio-chip [kind]="kind" [id]="id" [label]="label" [name]="name" [value]="value" [checked]="true"></krds-radio-chip>',
    props: {
      kind: "radio-chip",
      id: "angular-story-rdo-chip",
      label: "라디오 칩",
      name: "radio-chip",
      value: "one",
    },
  }),
  parameters: { fixtureId: "radio-chip.default", a11y: { test: "error" } },
};

export const RadioSize: Story = {
  name: "라디오 크기",
  render: () => ({
    template:
      '<krds-radio-size [kind]="kind" [id]="id" [label]="label" [name]="name" [value]="value" [size]="size"></krds-radio-size>',
    props: {
      kind: "radio-size",
      id: "angular-story-rdo-size",
      label: RADIO_LABEL_LARGE,
      name: "radio-size",
      value: "one",
      size: "large",
    },
  }),
  parameters: { fixtureId: "radio-size.default", a11y: { test: "error" } },
};

export const Resize: Story = {
  name: "화면 크기 조절",
  render: () => ({
    template:
      '<krds-resize [kind]="kind" [label]="label" [options]="options" [selected]="selected" [selectedLabel]="selectedLabel" [resetLabel]="resetLabel"></krds-resize>',
    props: {
      kind: "resize",
      label: "화면 크기",
      options: [
        { value: "100", label: "기본" },
        { value: "125", label: "크게" },
        { value: "150", label: "가장 크게" },
      ],
      selected: "100",
      selectedLabel: "현재 크기",
      resetLabel: "기본값으로 초기화",
    },
  }),
  parameters: { fixtureId: "resize.default", a11y: { test: "error" } },
};

export const Select: Story = {
  name: "셀렉트",
  render: () => ({
    template:
      '<krds-select [kind]="kind" [id]="id" [label]="label" [options]="options" [selected]="selected" (selectedChange)="onSelectChanged($event)"></krds-select>',
    props: {
      kind: "select",
      id: "angular-story-select",
      label: "선택",
      options,
      selected: "one",
      onSelectChanged: () => undefined,
    },
  }),
  parameters: { fixtureId: "select.default", a11y: { test: "error" } },
};

export const SelectSize: Story = {
  name: "셀렉트 크기",
  render: () => ({
    template:
      '<krds-select-size [kind]="kind" [id]="id" [label]="label" [options]="options" [size]="size"></krds-select-size>',
    props: {
      kind: "select-size",
      id: "angular-story-select-size",
      label: "큰 선택",
      options,
      size: "large",
    },
  }),
  parameters: { fixtureId: "select-size.default", a11y: { test: "error" } },
};

export const SelectSorting: Story = {
  name: "정렬 셀렉트",
  render: () => ({
    template:
      '<krds-select-sorting [kind]="kind" [id]="id" [label]="label" [options]="options" [selected]="selected"></krds-select-sorting>',
    props: {
      kind: "select-sorting",
      id: "angular-story-select-sort",
      label: "정렬",
      options,
      selected: "one",
    },
  }),
  parameters: { fixtureId: "select-sorting.default", a11y: { test: "error" } },
};

export const SelectState: Story = {
  name: "셀렉트 상태",
  render: () => ({
    template:
      '<krds-select-state [kind]="kind" [id]="id" [label]="label" [options]="options" [state]="state"></krds-select-state>',
    props: {
      kind: "select-state",
      id: "angular-story-select-state",
      label: "오류 선택",
      options,
      state: "error",
    },
  }),
  parameters: { fixtureId: "select-state.default", a11y: { test: "error" } },
};

export const SideNavigation: Story = {
  name: "사이드 네비게이션",
  render: () => ({
    template:
      '<krds-side-navigation [kind]="kind" [title]="title" [items]="items"></krds-side-navigation>',
    props: { kind: "side-navigation", title: "서비스 메뉴", items: navTree },
  }),
  parameters: { fixtureId: "side-navigation.default", a11y: { test: "error" } },
};

export const SkipLink: Story = {
  name: "스킵 링크",
  render: () => ({
    template: '<krds-skip-link [kind]="kind" [label]="label" [href]="href"></krds-skip-link>',
    props: { kind: "skip-link", label: "본문 바로가기", href: "#content" },
  }),
  parameters: { fixtureId: "skip-link.default", a11y: { test: "error" } },
};

export const Spinner: Story = {
  name: "스피너",
  render: () => ({
    template: '<krds-spinner [kind]="kind" [label]="label"></krds-spinner>',
    props: { kind: "spinner", label: "처리 중" },
  }),
  parameters: { fixtureId: "spinner.default", a11y: { test: "error" } },
};

export const StepIndicator: Story = {
  name: "단계 표시기",
  render: () => ({
    template:
      '<krds-step-indicator [kind]="kind" [steps]="steps" [current]="current" [label]="label" [message]="message"></krds-step-indicator>',
    props: { kind: "step-indicator", steps, current: 1, label: "진행 단계", message: "현재 단계" },
  }),
  parameters: { fixtureId: "step-indicator.default", a11y: { test: "error" } },
};

export const StructuredList: Story = {
  name: "구조화된 목록",
  render: () => ({
    template:
      '<krds-structured-list [kind]="kind" [items]="items" [actionLabel]="actionLabel" [dateLabel]="dateLabel" [dateValue]="dateValue" [tags]="tags" [shareLabel]="shareLabel" [favoriteLabel]="favoriteLabel"></krds-structured-list>',
    props: {
      kind: "structured-list",
      items: listItems,
      actionLabel: "자세히 보기",
      dateLabel: "등록일",
      dateValue: "2026.07.27",
      tags: ["공지", "안내"],
      shareLabel: "공유",
      favoriteLabel: "관심",
    },
  }),
  parameters: { fixtureId: "structured-list.default", a11y: { test: "error" } },
};

export const StructuredListTable: Story = {
  name: "구조화된 테이블",
  render: () => ({
    template:
      '<krds-structured-list-table [kind]="kind" [selectAllLabel]="selectAllLabel" [actions]="actions" [countLabel]="countLabel" [countOptions]="countOptions" [sortLabel]="sortLabel" [sortOptions]="sortOptions" [sortValue]="sortValue" [caption]="caption" [columns]="columns" [rows]="rows" [pagination]="pagination"></krds-structured-list-table>',
    props: {
      kind: "structured-list-table",
      selectAllLabel: "전체선택",
      actions: structuredTableActions,
      countLabel: "목록 표시 개수",
      countOptions: ["10개", "9개"],
      sortLabel: "정렬기준",
      sortOptions: ["관련도순", "최신순", "인기순"],
      sortValue: "관련도순",
      caption: "000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.",
      columns: structuredTableColumns,
      rows: structuredTableRows,
      pagination: structuredTablePagination,
    },
  }),
  parameters: { fixtureId: "structured-list-table.default", a11y: { test: "error" } },
};

export const Table: Story = {
  name: "테이블",
  render: () => ({
    template:
      '<krds-table [kind]="kind" [caption]="caption" [columns]="columns" [rows]="rows"></krds-table>',
    props: {
      kind: "table",
      caption:
        "000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.",
      columns: tableColumns,
      rows: tableRows,
    },
  }),
  parameters: { fixtureId: "table.default", a11y: { test: "error" } },
};

export const Tag: Story = {
  name: "태그",
  render: () => ({
    template: '<krds-tag [kind]="kind" [label]="label" [message]="message"></krds-tag>',
    props: { kind: "tag", label: "태그", message: "태그 삭제" },
  }),
  parameters: { fixtureId: "tag.default", a11y: { test: "error" } },
};

export const TagLink: Story = {
  name: "태그 링크",
  render: () => ({
    template: '<krds-tag-link [kind]="kind" [label]="label" [href]="href"></krds-tag-link>',
    props: { kind: "tag-link", label: "태그 링크", href: "#tag" },
  }),
  parameters: { fixtureId: "tag-link.default", a11y: { test: "error" } },
};

export const Textarea: Story = {
  name: "텍스트 영역",
  render: () => ({
    template:
      '<krds-textarea [kind]="kind" [id]="id" [label]="label" [hint]="hint" [placeholder]="placeholder" [value]="value"></krds-textarea>',
    props: {
      kind: "textarea",
      id: "angular-story-textarea",
      label: "내용",
      hint: "내용을 입력하세요.",
      placeholder: "내용을 입력하세요.",
      value: "입력된 내용입니다.",
    },
  }),
  parameters: { fixtureId: "textarea.default", a11y: { test: "error" } },
};

export const TextInputIcon: Story = {
  name: "아이콘 텍스트 입력",
  render: () => ({
    template:
      '<krds-text-input-icon [kind]="kind" [id]="id" [label]="label" [hint]="hint" [value]="value"></krds-text-input-icon>',
    props: {
      kind: "text-input-icon",
      id: "angular-story-input-icon",
      label: TEXT_INPUT_PROPS.label,
      hint: TEXT_INPUT_PROPS.hint,
      value: "",
    },
  }),
  parameters: { fixtureId: "text-input-icon.default", a11y: { test: "error" } },
};

export const TextInputSize: Story = {
  name: "텍스트 입력 크기",
  render: () => ({
    template:
      '<krds-text-input-size [kind]="kind" [id]="id" [label]="label" [size]="size" [value]="value"></krds-text-input-size>',
    props: {
      kind: "text-input-size",
      id: "angular-story-input-size",
      label: TEXT_INPUT_PROPS.label,
      size: "large",
      value: "",
    },
  }),
  parameters: { fixtureId: "text-input-size.default", a11y: { test: "error" } },
};

export const TextInputState: Story = {
  name: "텍스트 입력 상태",
  render: () => ({
    template:
      '<krds-text-input-state [kind]="kind" [id]="id" [label]="label" [hint]="hint" [state]="state" [value]="value"></krds-text-input-state>',
    props: {
      kind: "text-input-state",
      id: "angular-story-input-state",
      label: TEXT_INPUT_PROPS.label,
      hint: TEXT_INPUT_PROPS.hint,
      state: "error",
      value: "잘못된 입력",
    },
  }),
  parameters: { fixtureId: "text-input-state.default", a11y: { test: "error" } },
};

export const TextList: Story = {
  name: "텍스트 목록",
  render: () => ({
    template: '<krds-text-list [kind]="kind" [items]="items"></krds-text-list>',
    props: {
      kind: "text-list",
      items: ["첫 번째 항목", { id: "nested", label: "두 번째 항목", children: ["하위 항목"] }],
    },
  }),
  parameters: { fixtureId: "text-list.default", a11y: { test: "error" } },
};

export const TextListOrdered: Story = {
  name: "순서 있는 텍스트 목록",
  render: () => ({
    template: '<krds-text-list-ordered [kind]="kind" [items]="items"></krds-text-list-ordered>',
    props: { kind: "text-list-ordered", items: ["첫 번째 항목", "두 번째 항목", "세 번째 항목"] },
  }),
  parameters: { fixtureId: "text-list-ordered.default", a11y: { test: "error" } },
};

export const ToggleSwitch: Story = {
  name: "토글 스위치",
  render: () => ({
    template:
      '<krds-toggle-switch [kind]="kind" [id]="id" [label]="label" [name]="name"></krds-toggle-switch>',
    props: {
      kind: "toggle-switch",
      id: "angular-story-toggle",
      label: "자동 저장",
      name: "autosave",
    },
  }),
  parameters: { fixtureId: "toggle-switch.default", a11y: { test: "error" } },
};

export const ToggleSwitchSize: Story = {
  name: "토글 스위치 크기",
  render: () => ({
    template:
      '<krds-toggle-switch-size [kind]="kind" [id]="id" [label]="label" [name]="name" [size]="size"></krds-toggle-switch-size>',
    props: {
      kind: "toggle-switch-size",
      id: "angular-story-toggle-size",
      label: "큰 토글",
      name: "large-toggle",
      size: "large",
    },
  }),
  parameters: { fixtureId: "toggle-switch-size.default", a11y: { test: "error" } },
};

export const Tooltip: Story = {
  name: "툴팁",
  render: () => ({
    template: '<krds-tooltip [kind]="kind" [label]="label" [message]="message"></krds-tooltip>',
    props: { kind: "tooltip", label: "툴팁", message: "도움말 메시지입니다." },
  }),
  parameters: { fixtureId: "tooltip.default", a11y: { test: "error" } },
};

export const TooltipBox: Story = {
  name: "툴팁 박스",
  render: () => ({
    template:
      '<krds-tooltip-box [kind]="kind" [label]="label" [message]="message"></krds-tooltip-box>',
    props: { kind: "tooltip-box", label: "박스 툴팁", message: "박스 도움말입니다." },
  }),
  parameters: { fixtureId: "tooltip-box.default", a11y: { test: "error" } },
};

export const TooltipVertical: Story = {
  name: "수직 툴팁",
  render: () => ({
    template:
      '<krds-tooltip-vertical [kind]="kind" [label]="label" [message]="message"></krds-tooltip-vertical>',
    props: { kind: "tooltip-vertical", label: "세로 툴팁", message: "세로 도움말입니다." },
  }),
  parameters: { fixtureId: "tooltip-vertical.default", a11y: { test: "error" } },
};

export const Tts: Story = {
  name: "TTS",
  render: () => ({
    template:
      '<krds-tts [kind]="kind" [label]="label" [playing]="false" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts>',
    props: { kind: "tts", label: "읽어주기", playLabel, stopLabel },
  }),
  parameters: { fixtureId: "tts.default", a11y: { test: "error" } },
};

export const TtsIcon: Story = {
  name: "TTS 아이콘",
  render: () => ({
    template:
      '<krds-tts-icon [kind]="kind" [label]="label" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-icon>',
    props: { kind: "tts-icon", label: "아이콘 읽어주기", playLabel, stopLabel },
  }),
  parameters: { fixtureId: "tts-icon.default", a11y: { test: "error" } },
};

export const TtsSize: Story = {
  name: "TTS 크기",
  render: () => ({
    template:
      '<krds-tts-size [kind]="kind" [label]="label" [size]="size" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-size>',
    props: { kind: "tts-size", label: "큰 읽어주기", size: "large", playLabel, stopLabel },
  }),
  parameters: { fixtureId: "tts-size.default", a11y: { test: "error" } },
};

export const TutorialPanel: Story = {
  name: "튜토리얼 패널",
  render: () => ({
    template:
      '<krds-tutorial-panel [kind]="kind" [open]="true" [title]="title" [description]="description" [helpTitle]="helpTitle" [helpDescription]="helpDescription" [label]="label" [collapseLabel]="collapseLabel" [tasks]="tasks" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="tutorialTitle" [stopLabel]="stopLabel" [closeLabel]="closeLabel"></krds-tutorial-panel>',
    props: {
      kind: "tutorial-panel",
      title: "튜토리얼",
      description: "튜토리얼 패널 내용입니다.",
      helpTitle: "튜토리얼",
      helpDescription: "튜토리얼 패널 내용입니다.",
      label: "튜토리얼 패널",
      collapseLabel: "튜토리얼 접기",
      tasks: [
        {
          title: "첫 단계",
          summary: "기본 안내",
          steps: ["메뉴 확인", "내용 확인"],
          current: true,
        },
      ],
      tabs,
      panels,
      selectedLabel: "선택됨",
      tutorialTitle: "튜토리얼",
      stopLabel: "튜토리얼 종료",
      closeLabel: "튜토리얼 닫기",
    },
  }),
  parameters: { fixtureId: "tutorial-panel.default", a11y: { test: "error" } },
};

export const Inventory: StoryObj<InventoryArgs> = {
  name: "전체 인벤토리 · public exports",
  args: {
    buttonVariant: "primary",
    buttonSize: "medium",
    inputState: "default",
    menuOpen: true,
  },
  parameters: {
    a11y: { test: "error" },
    fixtureIds: [...fixtureIds],
    docs: {
      description: {
        story:
          "85개 공식 fixture를 하나의 검색 가능한 Angular standalone inventory로 렌더링합니다. 모든 컴포넌트 입력은 Angular property binding으로 전달하고, core CVA/outputs와 alias public export selector를 함께 확인할 수 있습니다.",
      },
    },
  },
  render: (args) => ({
    template: `
      <main id="angular-inventory" aria-label="Angular KRDS public component inventory" style="max-width:100%;min-width:0;overflow-x:hidden;box-sizing:border-box;">
        <h1>KRDS Angular public components</h1>
        <p>공식 fixture와 public export를 같은 데이터 계약으로 탐색합니다.</p>

        <section aria-labelledby="inventory-foundation">
          <h2 id="inventory-foundation">Brand and navigation</h2>
          <krds-masthead [id]="mastheadId" [message]="mastheadMessage"></krds-masthead>
          <label aria-label="헤더 통합검색">
            <krds-header [id]="headerId" [title]="headerTitle" [menuLabel]="headerMenuLabel" [links]="links" [desktopItems]="menuPcItems" [utilityItems]="headerUtilityItems" [mobileMenu]="headerMobileMenu" [logoHref]="headerLogoHref" [logoLabel]="headerLogoLabel" [searchTitle]="headerSearchTitle" [searchLabel]="headerSearchLabel" [loginLabel]="headerLoginLabel" [loginHref]="headerLoginHref" [joinLabel]="headerJoinLabel" [allMenuLabel]="headerAllMenuLabel"></krds-header>
          </label>
          <krds-identifier [organization]="identifierOrganization" [description]="identifierDescription"></krds-identifier>
          <krds-badge [kind]="badgeKind" [label]="badgeLabel" [tone]="badgeTone" [appearance]="badgeAppearance"></krds-badge>
          <krds-badge-number [kind]="badgeNumberKind" [label]="badgeNumberLabel" [number]="true" [tone]="badgeTone"></krds-badge-number>
          <krds-badge-size [kind]="badgeSizeKind" [label]="badgeSizeLabel" [size]="largeSize" [tone]="badgeTone"></krds-badge-size>
          <krds-tag [kind]="tagKind" [label]="tagLabel" [message]="tagRemoveLabel"></krds-tag>
          <krds-tag-link [kind]="tagLinkKind" [label]="tagLinkLabel" [href]="tagLinkHref"></krds-tag-link>
          <krds-breadcrumb [kind]="breadcrumbKind" [items]="links" [label]="breadcrumbLabel"></krds-breadcrumb>
          <div id="krds-skip-link">
            <krds-skip-link [kind]="skipLinkKind" [label]="skipLinkLabel" [href]="skipLinkHref"></krds-skip-link>
          </div>
          <krds-main-menu-pc [kind]="menuPcKind" [items]="menuPcItems" [menuLabel]="menuLabel" [sample]="menuSample" [className]="menuClassName"></krds-main-menu-pc>
          <label aria-label="모바일 메뉴 검색">
            <krds-main-menu-mobile auditExpandedReady [kind]="menuMobileKind" [utilityItems]="menuUtilityItems" [loginLabel]="menuLoginLabel" [serviceItems]="menuServiceItems" [searchPlaceholder]="menuSearchPlaceholder" [searchTitle]="menuSearchTitle" [searchLabel]="menuSearchLabel" [items]="menuMobileItems" [previousLabel]="menuPreviousLabel" [closeLabel]="menuCloseLabel" [bottomItems]="menuBottomItems" [open]="menuOpen" [sample]="menuSample" [style]="menuStyle" [className]="menuClassName"></krds-main-menu-mobile>
          </label>
          <krds-link [kind]="linkKind" [label]="linkLabel" [href]="linkHref" [target]="externalTarget" [title]="externalTitle"></krds-link>
          <krds-side-navigation [kind]="sideNavigationKind" [title]="sideNavigationTitle" [items]="navTree"></krds-side-navigation>
          <krds-in-page-navigation [kind]="inPageKind" [title]="inPageTitle" [items]="links" [actionLabel]="inPageActionLabel"></krds-in-page-navigation>
        </section>

        <section aria-labelledby="inventory-actions">
          <h2 id="inventory-actions">Actions and disclosure</h2>
          <h3>Interactive controls</h3>
          <h4>Accordion examples</h4>
          <krds-button [variant]="buttonVariant" [size]="buttonSize" [type]="buttonType" (clicked)="onButtonClicked($event)">{{ buttonPrimaryLabel }}</krds-button>
          <krds-button-hierarchy [kind]="buttonHierarchyKind" [variant]="buttonVariant" [size]="buttonSize" [type]="buttonType" [label]="buttonHierarchyLabel"></krds-button-hierarchy>
          <krds-button-icon [kind]="buttonIconKind" [label]="buttonIconLabel" [size]="buttonSize"></krds-button-icon>
          <krds-button-size [kind]="buttonSizeKind" [size]="buttonSize" [label]="buttonSizeLabel"></krds-button-size>
          <krds-button-text [kind]="buttonTextKind" [label]="buttonTextLabel"></krds-button-text>
          <krds-button-with-icon [kind]="buttonWithIconKind" [label]="buttonWithIconLabel" [size]="buttonSize"></krds-button-with-icon>
          <krds-accordion [items]="accordionItems"></krds-accordion>
          <krds-accordion-line [kind]="accordionLineKind" [items]="accordionItems"></krds-accordion-line>
          <krds-disclosure [kind]="disclosureKind" [title]="disclosureTitle" [description]="disclosureDescription" [open]="true" [closeLabel]="disclosureCloseLabel"></krds-disclosure>
          <krds-contextual-help auditExpandedReady [kind]="contextualHelpKind" [label]="contextualHelpLabel" [title]="contextualHelpTitle" [description]="contextualHelpDescription" [caption]="contextualHelpCaption" [position]="contextualHelpPosition" [href]="contextualHelpHref" [linkLabel]="contextualHelpLinkLabel" [closeLabel]="contextualHelpCloseLabel"></krds-contextual-help>
          <krds-coach-mark [kind]="coachMarkKind" [title]="coachMarkTitle" [stepTitle]="coachMarkStepTitle" [description]="coachMarkDescription" [contentTitle]="coachMarkContentTitle" [step]="coachMarkStep" [currentStepLabel]="currentStepLabel" [totalStepsLabel]="totalStepsLabel" [stopLabel]="coachMarkStopLabel" [nextLabel]="coachMarkNextLabel"></krds-coach-mark>
          <krds-help-panel [kind]="helpPanelKind" [open]="true" [title]="helpTitle" [description]="helpDescription" [label]="helpLabel" [collapseLabel]="helpCollapseLabel" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="helpTutorialTitle" [stopLabel]="helpStopLabel"></krds-help-panel>
          <krds-tutorial-panel [kind]="tutorialPanelKind" [open]="true" [title]="tutorialTitle" [description]="tutorialDescription" [helpTitle]="tutorialTitle" [helpDescription]="tutorialDescription" [label]="tutorialLabel" [collapseLabel]="tutorialCollapseLabel" [tasks]="tutorialTasks" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="tutorialTitle" [stopLabel]="tutorialStopLabel" [closeLabel]="tutorialCloseLabel"></krds-tutorial-panel>
          <krds-modal [kind]="modalKind" [id]="modalId" [title]="modalTitle" [description]="modalDescription" [open]="false" [cancelLabel]="modalCancelLabel" [confirmLabel]="modalConfirmLabel" [closeLabel]="modalCloseLabel"></krds-modal>
          <krds-modal-sample [kind]="modalSampleKind" [id]="modalSampleId" [title]="modalSampleTitle" [description]="modalSampleDescription" [open]="false" [cancelLabel]="modalCancelLabel" [confirmLabel]="modalConfirmLabel" [closeLabel]="modalCloseLabel"></krds-modal-sample>
        </section>

        <section aria-labelledby="inventory-forms">
          <h2 id="inventory-forms">Forms and CVA controls</h2>
          <krds-text-input [id]="textInputId" [label]="textInputLabel" [hint]="textInputHint" [placeholder]="textInputPlaceholder" [state]="inputState" [size]="buttonSize" [value]="textInputValue" [name]="textInputName" [required]="true"></krds-text-input>
          <krds-text-input-icon [kind]="textInputIconKind" [id]="textInputIconId" [label]="textInputIconLabel" [hint]="textInputIconHint" [value]="textInputValue"></krds-text-input-icon>
          <krds-text-input-size [kind]="textInputSizeKind" [id]="textInputSizeId" [label]="textInputSizeLabel" [size]="largeSize" [value]="textInputValue"></krds-text-input-size>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputStateId" [label]="textInputStateLabel" [hint]="textInputStateHint" [state]="errorState" [value]="textInputValue"></krds-text-input-state>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputSuccessId" [label]="textInputSuccessLabel" [hint]="textInputSuccessHint" [state]="successState" [value]="textInputSuccessValue"></krds-text-input-state>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputInformationId" [label]="textInputInformationLabel" [hint]="textInputInformationHint" [state]="informationState" [value]="textInputInformationValue"></krds-text-input-state>
          <krds-textarea [kind]="textareaKind" [id]="textareaId" [label]="textareaLabel" [hint]="textareaHint" [placeholder]="textareaPlaceholder" [value]="textareaValue"></krds-textarea>
          <krds-checkbox [id]="checkboxId" [label]="checkboxLabel" [description]="checkboxDescription" [name]="checkboxName" [checked]="true" (checkedChange)="onCheckboxChanged($event)"></krds-checkbox>
          <krds-checkbox-chip [kind]="checkboxChipKind" [id]="checkboxChipId" [label]="checkboxChipLabel" [name]="checkboxChipName" [checked]="true"></krds-checkbox-chip>
          <krds-checkbox-size [kind]="checkboxSizeKind" [id]="checkboxSizeId" [label]="checkboxSizeLabel" [size]="largeSize" [checked]="false"></krds-checkbox-size>
          <krds-radio [id]="radioId" [label]="radioLabel" [name]="radioName" [value]="radioValue" [checked]="true" (selected)="onRadioSelected($event)"></krds-radio>
          <krds-radio-button [kind]="radioButtonKind" [id]="radioButtonId" [label]="radioButtonLabel" [name]="radioButtonName" [value]="radioButtonValue" [checked]="true"></krds-radio-button>
          <div class="krds-form-chip">
            <krds-radio-chip [kind]="radioChipKind" [id]="radioChipId" [label]="radioChipLabel" [name]="radioChipName" [value]="radioChipValue" [checked]="true"></krds-radio-chip>
          </div>
          <krds-radio-size [kind]="radioSizeKind" [id]="radioSizeId" [label]="radioSizeLabel" [name]="radioSizeName" [value]="radioSizeValue" [size]="largeSize"></krds-radio-size>
          <krds-switch [id]="switchId" [label]="switchLabel" [name]="switchName" [checked]="true" (checkedChange)="onSwitchChanged($event)"></krds-switch>
          <krds-date-input [kind]="dateInputKind" [id]="dateInputId" [label]="dateInputLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-date-input>
          <krds-toggle-switch-size [kind]="toggleSwitchSizeKind" [id]="toggleSwitchSizeId" [label]="toggleSwitchSizeLabel" [name]="toggleSwitchSizeName" [size]="largeSize"></krds-toggle-switch-size>
          <krds-calendar [kind]="calendarKind" [id]="calendarId" [label]="calendarLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-calendar>
          <krds-calendar-range [kind]="calendarRangeKind" [id]="calendarRangeId" [label]="calendarRangeLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-calendar-range>
          <krds-select [kind]="selectKind" [id]="selectId" [label]="selectLabel" [options]="options" [selected]="selectedOption" (selectedChange)="onSelectChanged($event)"></krds-select>
          <krds-select-size [kind]="selectSizeKind" [id]="selectSizeId" [label]="selectSizeLabel" [options]="options" [size]="largeSize"></krds-select-size>
          <label aria-label="정렬 선택">
            <krds-select-sorting [kind]="selectSortingKind" [id]="selectSortingId" [label]="selectSortingLabel" [options]="options" [selected]="selectedOption"></krds-select-sorting>
          </label>
          <krds-select-state [kind]="selectStateKind" [id]="selectStateId" [label]="selectStateLabel" [options]="options" [state]="errorState"></krds-select-state>
          <krds-language-switcher auditExpandedReady [kind]="languageSwitcherKind" [id]="languageSwitcherId" [languages]="options" [selected]="selectedLanguage" [label]="languageLabel"></krds-language-switcher>
          <krds-language-switcher-page auditExpandedReady [kind]="languageSwitcherPageKind" [id]="languageSwitcherPageId" [languages]="options" [selected]="selectedLanguage" [label]="languagePageLabel"></krds-language-switcher-page>
        </section>

        <section aria-labelledby="inventory-content">
          <h2 id="inventory-content">Content, tables and feedback</h2>
          <krds-carousel [kind]="carouselKind" [slides]="slides" [label]="carouselLabel" [actionLabel]="carouselActionLabel" [imageLabel]="carouselImageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel>
          <krds-carousel-banner [kind]="carouselBannerKind" [slides]="slides" [label]="carouselLabel" [actionLabel]="carouselActionLabel" [imageLabel]="carouselImageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel-banner>
          <krds-file-upload [kind]="fileUploadKind" [id]="fileUploadId" [title]="fileUploadTitle" [description]="fileUploadDescription" [prompt]="fileUploadPrompt" [inputId]="fileUploadInputId" [selectLabel]="fileUploadSelectLabel" [files]="fileUploadFiles" [deleteAllLabel]="fileUploadDeleteAllLabel" [currentCount]="fileUploadCurrentCount" [maxCount]="fileUploadMaxCount" [countSuffix]="fileUploadCountSuffix"></krds-file-upload>
          <krds-pagination [kind]="paginationKind" [items]="paginationItems" [current]="paginationCurrent" [previousLabel]="previousLabel" [nextLabel]="nextLabel" [message]="currentPageLabel"></krds-pagination>
          <krds-step-indicator [kind]="stepIndicatorKind" [steps]="steps" [current]="stepCurrent" [label]="stepLabel" [message]="currentStepLabel"></krds-step-indicator>
          <krds-tab [kind]="tabKind" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel"></krds-tab>
          <krds-structured-list [kind]="structuredListKind" [items]="listItems" [actionLabel]="structuredActionLabel" [dateLabel]="structuredDateLabel" [dateValue]="structuredDateValue" [tags]="structuredTags" [shareLabel]="shareLabel" [favoriteLabel]="favoriteLabel"></krds-structured-list>
          <div style="max-width:100%;min-width:0;overflow-x:auto;box-sizing:border-box;">
            <krds-structured-list-table [kind]="structuredListTableKind" [selectAllLabel]="structuredSelectAllLabel" [actions]="structuredTableActions" [countLabel]="structuredCountLabel" [countOptions]="structuredCountOptions" [sortLabel]="structuredSortLabel" [sortOptions]="structuredSortOptions" [sortValue]="structuredSortValue" [caption]="structuredTableCaption" [columns]="structuredTableColumns" [rows]="structuredTableRows" [pagination]="structuredTablePagination"></krds-structured-list-table>
          </div>
          <div style="max-width:100%;min-width:0;overflow-x:auto;box-sizing:border-box;">
            <krds-table [kind]="tableKind" [caption]="tableCaption" [columns]="tableColumns" [rows]="tableRows"></krds-table>
          </div>
          <krds-text-list [kind]="textListKind" [items]="textListItems"></krds-text-list>
          <krds-text-list-ordered [kind]="textListOrderedKind" [items]="textListItems"></krds-text-list-ordered>
          <krds-critical-alerts auditCriticalAlerts [kind]="criticalAlertsKind" [items]="criticalItems"></krds-critical-alerts>
          <krds-footer [kind]="footerKind" [id]="footerId" [relatedSites]="footerRelatedSites" [logoLabel]="footerLogoLabel" [address]="footerAddress" [contacts]="footerContacts" [links]="footerLinks" [socialLinks]="footerSocialLinks" [policyLinks]="footerPolicyLinks" [copyright]="footerCopyright" [organization]="footerOrganization" [description]="footerDescription"></krds-footer>
          <krds-favicon [kind]="faviconKind" [href]="faviconHref" [label]="faviconLabel"></krds-favicon>
          <krds-spinner [kind]="spinnerKind" [label]="spinnerLabel"></krds-spinner>
          <krds-resize auditExpandedReady [kind]="resizeKind" [label]="resizeLabel" [options]="resizeOptions" [selected]="resizeSelected" [selectedLabel]="resizeSelectedLabel" [resetLabel]="resizeResetLabel"></krds-resize>
          <krds-tooltip [kind]="tooltipKind" [label]="tooltipLabel" [message]="tooltipMessage"></krds-tooltip>
          <krds-tooltip-box [kind]="tooltipBoxKind" [label]="tooltipBoxLabel" [message]="tooltipBoxMessage"></krds-tooltip-box>
          <krds-tooltip-vertical [kind]="tooltipVerticalKind" [label]="tooltipVerticalLabel" [message]="tooltipVerticalMessage"></krds-tooltip-vertical>
          <krds-tts [kind]="ttsKind" [label]="ttsLabel" [playing]="false" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts>
          <krds-tts-icon [kind]="ttsIconKind" [label]="ttsIconLabel" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-icon>
          <krds-tts-size [kind]="ttsSizeKind" [label]="ttsSizeLabel" [size]="largeSize" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-size>
        </section>
      </main>
    `,
    props: {
      ...args,
      fixtureIds,
      mastheadId: "krds-masthead",
      mastheadMessage: "대한민국 공식 전자정부 누리집",
      headerId: "krds-header",
      headerTitle: "KRDS Community",
      links,
      headerLogoHref: "#inventory-foundation",
      headerLogoLabel: "KRDS Community 홈",
      headerSearchTitle: "통합검색",
      headerSearchLabel: "검색",
      headerLoginLabel: "로그인",
      headerLoginHref: "#login",
      headerJoinLabel: "회원가입",
      headerAllMenuLabel: "전체 메뉴",
      identifierOrganization: "KRDS - Korea Design System",
      identifierDescription: "공공서비스 디자인 시스템",
      badgeKind: "badge",
      badgeNumberKind: "badge-number",
      badgeSizeKind: "badge-size",
      badgeLabel: "상태",
      badgeNumberLabel: "3",
      badgeSizeLabel: "중요",
      badgeTone: "primary",
      badgeAppearance: "outline",
      largeSize: "large",
      tagKind: "tag",
      tagLabel: "태그",
      tagRemoveLabel: "태그 삭제",
      tagLinkKind: "tag-link",
      tagLinkLabel: "태그 링크",
      tagLinkHref: "#tag",
      breadcrumbKind: "breadcrumb",
      breadcrumbLabel: "현재 경로",
      skipLinkKind: "skip-link",
      skipLinkLabel: "본문 바로가기",
      skipLinkHref: "#inventory-content",
      menuPcKind: "main-menu-pc",
      menuPcItems,
      headerUtilityItems,
      headerMobileMenu,
      headerMenuLabel: "헤더 주 메뉴",
      menuLabel: "보조 주 메뉴",
      menuStyle: { display: "block", position: "static", visibility: "visible" },
      menuMobileItems,
      menuUtilityItems,
      menuServiceItems,
      menuBottomItems,
      menuClassName: "sample",
      menuLoginLabel: "로그인",
      menuSearchPlaceholder: "검색어를 입력하세요.",
      menuSearchTitle: "통합검색",
      menuSearchLabel: "검색",
      menuPreviousLabel: "이전 메뉴",
      menuCloseLabel: "메뉴 닫기",
      menuMobileKind: "main-menu-mobile",
      options,
      slides,
      carouselActionLabel: "자세히 보기",
      carouselImageLabel: "주요 콘텐츠 이미지",
      tabs,
      panels,
      steps,
      listItems,
      navTree,
      playLabel,
      stopLabel,
      linkKind: "link",
      linkLabel: "자세히 보기",
      linkHref: "#details",
      externalTarget: "_blank",
      externalTitle: "새 창 열기",
      sideNavigationKind: "side-navigation",
      sideNavigationTitle: "서비스 메뉴",
      inPageKind: "in-page-navigation",
      inPageTitle: "페이지 내 이동",
      inPageActionLabel: "온라인 신청하기",
      buttonType: "button",
      buttonPrimaryLabel: BUTTON_TEXT.primary,
      buttonHierarchyKind: "button-hierarchy",
      buttonIconKind: "button-icon",
      buttonSizeKind: "button-size",
      buttonTextKind: "button-text",
      buttonWithIconKind: "button-with-icon",
      buttonHierarchyLabel: "계층 버튼",
      buttonIconLabel: "검색",
      buttonSizeLabel: "큰 버튼",
      buttonTextLabel: "텍스트 버튼",
      buttonWithIconLabel: "다음",
      onButtonClicked: () => undefined,
      onCheckboxChanged: () => undefined,
      onRadioSelected: () => undefined,
      onSwitchChanged: () => undefined,
      onSelectChanged: () => undefined,
      accordionItems,
      accordionLineKind: "accordion-line",
      disclosureKind: "disclosure",
      disclosureTitle: "상세 보기",
      disclosureDescription: "상세 내용을 확인합니다.",
      disclosureCloseLabel: "상세 닫기",
      contextualHelpKind: "contextual-help",
      contextualHelpLabel: "도움말",
      contextualHelpTitle: "도움말 제목",
      contextualHelpDescription: "도움말 내용을 확인합니다.",
      contextualHelpCaption: "도움말 내용을 확인합니다.",
      contextualHelpPosition: "top",
      contextualHelpHref: "#help",
      contextualHelpLinkLabel: "도움말 자세히 보기",
      contextualHelpCloseLabel: "도움말 닫기",
      coachMarkKind: "coach-mark",
      coachMarkTitle: "따라하기",
      coachMarkStepTitle: "첫 번째 단계",
      coachMarkDescription: "현재 단계 안내입니다.",
      coachMarkContentTitle: "사용 방법",
      coachMarkStep: "1/3",
      currentStepLabel: "현재 단계",
      totalStepsLabel: "전체 단계",
      coachMarkStopLabel: "튜토리얼 종료",
      coachMarkNextLabel: "다음 단계",
      helpPanelKind: "help-panel",
      helpTitle: "도움말",
      helpDescription: "도움말 패널 내용입니다.",
      helpLabel: "도움말 패널",
      helpCollapseLabel: "도움말 접기",
      helpTutorialTitle: "도움말 튜토리얼",
      helpStopLabel: "도움말 종료",
      tutorialPanelKind: "tutorial-panel",
      tutorialTitle: "튜토리얼",
      tutorialDescription: "튜토리얼 패널 내용입니다.",
      tutorialLabel: "튜토리얼 패널",
      tutorialCollapseLabel: "튜토리얼 접기",
      tutorialStopLabel: "튜토리얼 종료",
      tutorialCloseLabel: "튜토리얼 닫기",
      tutorialTasks: [
        {
          title: "첫 단계",
          summary: "기본 안내",
          steps: ["메뉴 확인", "내용 확인"],
          current: true,
        },
      ],
      modalKind: "modal",
      modalSampleKind: "modal-sample",
      modalId: "angular-modal",
      modalSampleId: "angular-modal-sample",
      modalTitle: MODAL_PROPS.title,
      modalSampleTitle: MODAL_PROPS.title,
      modalDescription: MODAL_PROPS.description,
      modalSampleDescription: MODAL_PROPS.description,
      modalCloseLabel: MODAL_PROPS.closeLabel,
      modalCancelLabel: MODAL_PROPS.cancelLabel,
      modalConfirmLabel: MODAL_PROPS.confirmLabel,
      textInputId: "angular-inventory-text-input",
      textInputLabel: TEXT_INPUT_PROPS.label,
      textInputHint: TEXT_INPUT_PROPS.hint,
      textInputPlaceholder: "이름을 입력하세요.",
      textInputValue: "홍길동",
      textInputName: "name",
      textInputIconKind: "text-input-icon",
      textInputIconId: "angular-inventory-text-input-icon",
      textInputIconLabel: TEXT_INPUT_PROPS.label,
      textInputIconHint: TEXT_INPUT_PROPS.hint,
      textInputSizeKind: "text-input-size",
      textInputSizeId: "angular-inventory-text-input-size",
      textInputSizeLabel: TEXT_INPUT_PROPS.label,
      textInputStateKind: "text-input-state",
      textInputStateId: "angular-inventory-text-input-state",
      textInputStateLabel: TEXT_INPUT_PROPS.label,
      textInputStateHint: TEXT_INPUT_PROPS.hint,
      errorState: "error",
      successState: "success",
      informationState: "information",
      textInputSuccessId: "angular-inventory-text-input-success",
      textInputSuccessLabel: "사용자 아이디",
      textInputSuccessHint: "사용할 수 있는 아이디입니다.",
      textInputSuccessValue: "community",
      textInputInformationId: "angular-inventory-text-input-information",
      textInputInformationLabel: "알림 주소",
      textInputInformationHint: "업데이트 소식을 받을 주소입니다.",
      textInputInformationValue: "alerts@example.com",
      textareaKind: "textarea",
      textareaId: "angular-inventory-textarea",
      textareaLabel: "내용",
      textareaHint: "내용을 입력하세요.",
      textareaPlaceholder: "내용을 입력하세요.",
      textareaValue: "입력된 내용입니다.",
      textareaRows: 4,
      checkboxId: "angular-inventory-checkbox",
      checkboxLabel: CHECKBOX_LABEL_DEFAULT,
      checkboxDescription: "서비스 이용을 위해 동의가 필요합니다.",
      checkboxName: "terms",
      checkboxChipKind: "checkbox-chip",
      checkboxChipId: "angular-inventory-checkbox-chip",
      checkboxChipLabel: "이메일 수신",
      checkboxChipName: "email",
      checkboxSizeKind: "checkbox-size",
      checkboxSizeId: "angular-inventory-checkbox-size",
      checkboxSizeLabel: CHECKBOX_LABEL_LARGE,
      radioId: "angular-inventory-radio",
      radioLabel: RADIO_LABEL_DEFAULT,
      radioName: "choice",
      radioValue: "one",
      radioButtonKind: "radio-button",
      radioButtonId: "angular-inventory-radio-button",
      radioButtonLabel: "라디오 버튼",
      radioButtonName: "radio-button",
      radioButtonValue: "one",
      radioChipKind: "radio-chip",
      radioChipId: "angular-inventory-radio-chip",
      radioChipLabel: "라디오 칩",
      radioChipName: "radio-chip",
      radioChipValue: "one",
      radioSizeKind: "radio-size",
      radioSizeId: "angular-inventory-radio-size",
      radioSizeLabel: RADIO_LABEL_LARGE,
      radioSizeName: "radio-size",
      radioSizeValue: "one",
      switchId: "angular-inventory-switch",
      switchLabel: "알림 받기",
      switchName: "notifications",
      toggleSwitchKind: "toggle-switch",
      toggleSwitchId: "angular-inventory-toggle-switch",
      toggleSwitchLabel: "자동 저장",
      toggleSwitchName: "autosave",
      toggleSwitchSizeKind: "toggle-switch-size",
      toggleSwitchSizeId: "angular-inventory-toggle-switch-size",
      toggleSwitchSizeLabel: "큰 토글",
      toggleSwitchSizeName: "large-toggle",
      calendarKind: "calendar",
      calendarId: "angular-inventory-calendar",
      calendarLabel: "날짜",
      calendarDateLabel: "선택한 날짜",
      calendarDateValue: "2026.07.27",
      calendarRangeKind: "calendar-range",
      calendarRangeId: "angular-inventory-calendar-range",
      calendarRangeLabel: "기간",
      calendarYearValue: 2026,
      calendarMonthValue: 7,
      calendarYearsValue: [2026, 2027],
      calendarPreviousMonthDayCount: 30,
      calendarDayCount: 31,
      calendarRangeStartDay: 20,
      calendarRangeEndDay: 25,
      calendarTodayDay: 27,
      calendarEventDays: [10, 18],
      calendarDisabledDays: [5, 12],
      calendarWeekdays: ["일", "월", "화", "수", "목", "금", "토"],
      calendarPreviousMonthLabel: "이전 달",
      calendarNextMonthLabel: "다음 달",
      calendarYearSelectLabel: "연도 선택",
      calendarMonthSelectLabel: "월 선택",
      calendarTodayLabel: "오늘",
      calendarEventLabel: "행사일",
      calendarCancelLabel: "취소",
      calendarConfirmLabel: "확인",
      dateInputKind: "date-input",
      dateInputId: "angular-inventory-date-input",
      dateInputLabel: "날짜 입력",
      dateInputValue: "2026-07-27",
      selectKind: "select",
      selectId: "angular-inventory-select",
      selectLabel: "선택",
      selectedOption: "one",
      selectSizeKind: "select-size",
      selectSizeId: "angular-inventory-select-size",
      selectSizeLabel: "큰 선택",
      selectSortingKind: "select-sorting",
      selectSortingId: "angular-inventory-select-sorting",
      selectSortingLabel: "정렬",
      selectStateKind: "select-state",
      selectStateId: "angular-inventory-select-state",
      selectStateLabel: "오류 선택",
      languageSwitcherKind: "language-switcher",
      languageSwitcherId: "angular-inventory-language",
      selectedLanguage: "one",
      languageLabel: "언어 선택",
      languageSwitcherPageKind: "language-switcher-page",
      languageSwitcherPageId: "angular-inventory-language-page",
      languagePageLabel: "페이지 언어 선택",
      carouselKind: "carousel",
      carouselBannerKind: "carousel-banner",
      carouselLabel: "주요 콘텐츠",
      fileUploadKind: "file-upload",
      fileUploadId: "angular-inventory-file-upload",
      fileUploadTitle: "파일 업로드",
      fileUploadDescription: "파일을 선택하세요.",
      fileUploadPrompt: "파일을 첨부하세요.",
      fileUploadInputId: "angular-inventory-file-input",
      fileUploadSelectLabel: "파일 선택",
      fileUploadFiles: [
        { id: "file-one", name: "안내문.pdf", status: "complete", statusLabel: "업로드 완료" },
      ],
      fileUploadDeleteAllLabel: "전체 삭제",
      fileUploadCurrentCount: 1,
      fileUploadMaxCount: 3,
      fileUploadCountSuffix: "개",
      nextLabel: "다음",
      previousLabel: "이전",
      moreLabel: "더 보기",
      paginationKind: "pagination",
      paginationItems: [1, 2, 3, "ellipsis", 5],
      paginationCurrent: 1,
      currentPageLabel: "현재 페이지",
      stepIndicatorKind: "step-indicator",
      stepCurrent: 1,
      tabKind: "tab",
      selectedLabel: "선택됨",
      structuredListKind: "structured-list",
      structuredActionLabel: "자세히 보기",
      structuredDateLabel: "등록일",
      structuredDateValue: "2026.07.27",
      structuredTags: ["공지", "안내"],
      shareLabel: "공유",
      favoriteLabel: "관심",
      structuredListTableKind: "structured-list-table",
      structuredSelectAllLabel: "전체선택",
      structuredCountLabel: "목록 표시 개수",
      structuredCountOptions: ["10개", "9개"],
      structuredSortLabel: "정렬기준",
      structuredSortOptions: ["관련도순", "최신순", "인기순"],
      structuredSortValue: "관련도순",
      structuredTableCaption: "000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.",
      structuredTableColumns,
      structuredTableRows,
      structuredTableActions,
      structuredTablePagination,
      tableKind: "table",
      tableCaption:
        "000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.",
      tableColumns,
      tableRows,
      textListKind: "text-list",
      textListOrderedKind: "text-list-ordered",
      textListItems: [
        "첫 번째 안내",
        { id: "nested", label: "두 번째 안내", children: ["하위 안내"] },
      ],
      criticalAlertsKind: "critical-alerts",
      criticalItems: [
        {
          id: "critical-one",
          label: "긴급 안내",
          title: "긴급 안내",
          description: "서비스 점검이 예정되어 있습니다.",
          tone: "danger",
          badgeLabel: "긴급",
          linkLabel: "자세히 보기",
          href: "#critical-one",
        },
        {
          id: "critical-two",
          label: "일반 안내",
          title: "일반 안내",
          description: "새로운 안내가 있습니다.",
          tone: "information",
          badgeLabel: "안내",
          linkLabel: "확인",
          href: "#critical-two",
        },
      ],
      footerKind: "footer",
      footerId: "krds-footer",
      footerRelatedSites,
      footerLogoLabel: "KRDS - Korea Design System",
      footerAddress: "(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단",
      footerContacts,
      footerLinks,
      footerSocialLinks,
      footerPolicyLinks,
      footerCopyright: "© 2023 National Health Insurance Service. All rights reserved.",
      footerOrganization: "KRDS - Korea Design System",
      footerDescription: "이 누리집은 보건복지부 누리집입니다.",
      faviconKind: "favicon",
      faviconHref: "/favicon.ico",
      faviconLabel: "사이트 아이콘",
      spinnerKind: "spinner",
      spinnerLabel: "처리 중",
      resizeKind: "resize",
      resizeLabel: "화면 크기",
      resizeOptions: [
        { value: "100", label: "기본" },
        { value: "125", label: "크게" },
        { value: "150", label: "가장 크게" },
      ],
      resizeSelected: "100",
      resizeSelectedLabel: "현재 크기",
      resizeResetLabel: "기본값으로 초기화",
      tooltipKind: "tooltip",
      tooltipLabel: "툴팁",
      tooltipMessage: "도움말 메시지입니다.",
      tooltipBoxKind: "tooltip-box",
      tooltipBoxLabel: "박스 툴팁",
      tooltipBoxMessage: "박스 도움말입니다.",
      tooltipVerticalKind: "tooltip-vertical",
      tooltipVerticalLabel: "세로 툴팁",
      tooltipVerticalMessage: "세로 도움말입니다.",
      ttsKind: "tts",
      ttsLabel: "읽어주기",
      ttsIconKind: "tts-icon",
      ttsIconLabel: "아이콘 읽어주기",
      ttsSizeKind: "tts-size",
      ttsSizeLabel: "큰 읽어주기",
    },
  }),
};
