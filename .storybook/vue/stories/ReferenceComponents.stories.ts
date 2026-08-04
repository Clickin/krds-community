import { expect, userEvent, within } from "storybook/test";
import { h, ref, type Component } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  AccordionLine,
  Badge,
  BadgeNumber,
  BadgeSize,
  Breadcrumb,
  ButtonHierarchy,
  ButtonIcon,
  ButtonSize,
  ButtonText,
  ButtonWithIcon,
  Calendar,
  CalendarRange,
  Carousel,
  CarouselBanner,
  CheckboxChip,
  CheckboxSize,
  CoachMark,
  ContextualHelp,
  CriticalAlerts,
  DateInput,
  Disclosure,
  Favicon,
  FileUpload,
  Footer,
  Header,
  HelpPanel,
  Identifier,
  InPageNavigation,
  LanguageSwitcher,
  LanguageSwitcherPage,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Masthead,
  ModalSample,
  Pagination,
  RadioButton,
  RadioChip,
  RadioSize,
  Resize,
  Select,
  SelectSize,
  SelectSorting,
  SelectState,
  SideNavigation,
  SkipLink,
  Spinner,
  StepIndicator,
  StructuredList,
  StructuredListTable,
  Table,
  Tag,
  TagLink,
  Textarea,
  TextInputIcon,
  TextInputSize,
  TextInputState,
  TextList,
  TextListOrdered,
  ToggleSwitch,
  ToggleSwitchSize,
  Tooltip,
  TooltipBox,
  TooltipVertical,
  Tts,
  TtsIcon,
  TtsSize,
  TutorialPanel,
} from "@krds-community/vue";
import type { AdditionalProps, AdditionalValue } from "@krds-community/vue";

type MenuDescriptionItem = {
  title: string;
  description: string;
  href?: string;
  target?: string;
  externalTitle?: string;
};

type MenuBanner = { badge: string; label: string };

type MenuItem = {
  id?: string;
  label: string;
  href?: string;
  target?: string;
  title?: string;
  current?: boolean;
  active?: boolean;
  disabled?: boolean;
  button?: boolean;
  kind?: string;
  className?: string;
  selected?: boolean;
  selectedLabel?: string;
  resetLabel?: string;
  titleHref?: string;
  titleLinkLabel?: string;
  banner?: MenuBanner;
  descriptionItems?: MenuDescriptionItem[];
  items?: MenuItem[];
  children?: MenuItem[];
};

type TableColumn = {
  key: string;
  label: string;
  width?: string;
  visuallyHidden?: boolean;
};

type TableAction = { id: string; label: string; icon?: string };

type TablePagination = {
  current: number;
  items: Array<number | "ellipsis">;
  previousDisabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  currentLabel: string;
};

type FooterContact = { title: string; description: string };
type FooterLink = MenuItem & { icon?: string; emphasis?: boolean };
type StoryArgs = AdditionalProps & {
  slotContent?: string;
  ariaLabel?: string;
  onModelValue?: (value: AdditionalValue) => void;
  text?: string;
  multiple?: boolean;
  style?: string | Record<string, string>;
  className?: string;
  actions?: TableAction[];
  countLabel?: string;
  countOptions?: string[];
  sortLabel?: string;
  sortOptions?: string[];
  sortValue?: string;
  pagination?: TablePagination;
  menuLabel?: string;
};

type MenuStoryArgs = StoryArgs & {
  items: MenuItem[];
  utilityItems?: MenuItem[];
  serviceItems?: MenuItem[];
  bottomItems?: MenuItem[];
  loginLabel?: string;
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: string;
  className?: string;
  sample?: boolean;
};

type TableStoryArgs = Omit<StoryArgs, "columns" | "rows"> & {
  className?: string;
  selectAllLabel?: string;
  actions?: TableAction[];
  countLabel?: string;
  countOptions?: string[];
  sortLabel?: string;
  sortOptions?: string[];
  sortValue?: string;
  pagination?: TablePagination;
  columns?: TableColumn[];
  rows?: Array<Record<string, string | number | boolean>>;
};

type FooterStoryArgs = StoryArgs & {
  className?: string;
  relatedSites?: FooterLink[];
  logoLabel?: string;
  address?: string;
  contacts?: FooterContact[];
  socialLinks?: FooterLink[];
  policyLinks?: FooterLink[];
  copyright?: string;
};

type HeaderStoryArgs = StoryArgs & {
  utilityItems?: MenuItem[];
  logoLabel?: string;
  logoHref?: string;
  searchLabel?: string;
  searchTitle?: string;
  loginLabel?: string;
  loginHref?: string;
  joinLabel?: string;
  allMenuLabel?: string;
  myMenu?: {
    label: string;
    userName: string;
    timeLabel: string;
    time: string;
    extendLabel: string;
    items: MenuItem[];
    logoutLabel: string;
  };
  desktopItems?: MenuItem[];
  mobileMenu?: MenuStoryArgs;
};

type Story<T extends StoryArgs = StoryArgs> = StoryObj<T>;

type StoryOptions<T extends StoryArgs> = {
  states?: readonly string[];
  description?: string;
  play?: Story<T>["play"];
};

const meta = {
  title: "Vue/추가 컴포넌트 · reference",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
  argTypes: {
    label: { control: "text" },
    menuLabel: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    hint: { control: "text" },
    tone: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "gray",
        "point",
        "danger",
        "warning",
        "success",
        "information",
        "disabled",
      ],
    },
    appearance: { control: "select", options: ["outline", "solid", "light"] },
    variant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "text" },
    state: { control: "select", options: ["default", "error", "success", "information"] },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    modelValue: { control: "text" },
    items: { control: "object" },
    options: { control: "object" },
    slides: { control: "object" },
    tabs: { control: "object" },
    steps: { control: "object" },
    columns: { control: "object" },
    rows: { control: "object" },
    actions: { control: "object" },
    countOptions: { control: "object" },
    sortOptions: { control: "object" },
    pagination: { control: "object" },
    defaultValue: { control: "text" },
    current: { control: "number" },
    defaultCurrent: { control: "number" },
    selected: { control: "text" },
    defaultSelected: { control: "text" },
    defaultChecked: { control: "boolean" },
    slotContent: { control: "text", name: "default slot" },
    ariaLabel: { control: "text", name: "aria-label" },
    onModelValue: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

const renderAdditional = (component: Component, args: StoryArgs) => ({
  setup() {
    const model = ref<AdditionalValue | undefined>(args.modelValue ?? args.defaultValue);
    return () => {
      const { slotContent, ariaLabel, onModelValue, ...componentArgs } = args;
      const props: Record<string, unknown> = {
        ...componentArgs,
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        ...(model.value === undefined ? {} : { modelValue: model.value }),
        "onUpdate:modelValue": (value: AdditionalValue) => {
          model.value = value;
          onModelValue?.(value);
        },
      };
      return h(component, props, slotContent ? { default: () => slotContent } : undefined);
    };
  },
});

const makeStory = <T extends StoryArgs>(
  component: Component,
  fixtureId: string,
  name: string,
  args: T,
  options: StoryOptions<T> = {},
): Story<T> => ({
  name,
  args,
  render: (storyArgs) => renderAdditional(component, storyArgs),
  play: options.play,
  parameters: {
    fixtureId,
    fixtureStates: options.states ?? ["default"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          options.description ??
          "Vue public props, default slot, v-model event, and native semantics를 확인합니다.",
      },
    },
  },
});

const defaultAndFocus = ["default", "focus-visible"] as const;
const options = [
  { value: "one", label: "첫 번째" },
  { value: "two", label: "두 번째" },
  { value: "three", label: "세 번째" },
];
const slides = [
  {
    id: "slide-1",
    title: "정책 안내",
    description: "새로운 정책 소식을 확인하세요.",
    href: "#policy",
  },
  {
    id: "slide-2",
    title: "서비스 안내",
    description: "신청 방법을 한눈에 살펴보세요.",
    href: "#service",
  },
  { id: "slide-3", title: "도움말", description: "자주 묻는 질문을 확인하세요.", href: "#help" },
];

const desktopMenuBanner: MenuBanner = { badge: "신규 서비스", label: "메뉴명" };
const desktopLastDepth = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `last-${index + 1}`,
    label: "Last depth",
    href: index === 0 ? "#" : undefined,
  }));

const desktopMenuItems: MenuItem[] = [
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
        children: desktopLastDepth(2),
        banner: desktopMenuBanner,
      },
      {
        id: "desktop-depth-1-2",
        label: "2Depth",
        title: "2Depth title",
        titleHref: "#",
        titleLinkLabel: "바로가기",
        children: desktopLastDepth(3),
        banner: desktopMenuBanner,
      },
      {
        id: "desktop-depth-1-3",
        label: "2Depth",
        title: "2Depth title",
        children: desktopLastDepth(3),
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
    children: desktopLastDepth(10).map((item) => ({ ...item, href: "#" })),
    banner: desktopMenuBanner,
  },
  { id: "desktop-link-anchor", label: "링크(anchor)", href: "#" },
  { id: "desktop-link-button", label: "링크(button)", button: true },
];

const mobileMenuItems: MenuItem[] = Array.from({ length: 5 }, (_, index) => ({
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

export const AccordionLineDefault = makeStory(
  AccordionLine,
  "accordion-line.default",
  "AccordionLine · line details",
  {
    items: [{ id: "vue-accordion-line", title: "라인 아코디언", content: "라인 안내 내용입니다." }],
  },
  {
    states: ["default", "focus-visible"],
    description: "AccordionLine public export로 details/summary semantics를 구성합니다.",
  },
);

export const BadgeDefault = makeStory(
  Badge,
  "badge.default",
  "Badge · default",
  {
    label: "추천",
    tone: "success",
    appearance: "solid",
  },
  { states: ["default"], description: "Badge의 tone/appearance props와 텍스트 슬롯을 확인합니다." },
);

export const BadgeNumberDefault = makeStory(
  BadgeNumber,
  "badge-number.default",
  "BadgeNumber · number",
  {
    label: "3",
    number: true,
    tone: "primary",
  },
  { states: ["default"], description: "숫자 배지의 number 변형과 accessible text를 확인합니다." },
);

export const BadgeSizeDefault = makeStory(
  BadgeSize,
  "badge-size.default",
  "BadgeSize · large",
  {
    label: "신규",
    size: "large",
    tone: "point",
  },
  { states: ["default"] },
);

export const BreadcrumbDefault = makeStory(
  Breadcrumb,
  "breadcrumb.default",
  "Breadcrumb · navigation",
  {
    label: "현재 경로",
    items: [
      { id: "home", label: "홈", href: "#home" },
      { id: "guide", label: "이용 안내", href: "#guide" },
      { id: "current", label: "신청 방법", href: "#current" },
    ],
  },
  {
    states: defaultAndFocus,
    description: "items 배열로 breadcrumb navigation landmark와 링크를 구성합니다.",
  },
);

export const ButtonHierarchyDefault = makeStory(
  ButtonHierarchy,
  "button-hierarchy.default",
  "ButtonHierarchy · primary",
  {
    label: "저장",
    variant: "primary",
  },
  { states: defaultAndFocus },
);

export const ButtonIconDefault = makeStory(
  ButtonIcon,
  "button-icon.default",
  "ButtonIcon · search",
  {
    label: "검색",
    ariaLabel: "검색",
  },
  {
    states: defaultAndFocus,
    description: "아이콘 전용 버튼에 시각적으로 숨겨진 accessible name을 전달합니다.",
  },
);

export const ButtonSizeDefault = makeStory(
  ButtonSize,
  "button-size.default",
  "ButtonSize · large",
  {
    label: "계속",
    size: "large",
  },
  { states: defaultAndFocus },
);

export const ButtonTextDefault = makeStory(
  ButtonText,
  "button-text.default",
  "ButtonText · text action",
  {
    slotContent: "더 보기",
  },
  {
    states: defaultAndFocus,
    description: "default slot으로 ButtonText의 버튼 레이블을 전달합니다.",
  },
);

export const ButtonWithIconDefault = makeStory(
  ButtonWithIcon,
  "button-with-icon.default",
  "ButtonWithIcon · search",
  {
    label: "검색",
  },
  { states: defaultAndFocus },
);

export const CalendarDefault = makeStory(
  Calendar,
  "calendar.default",
  "Calendar · date input",
  {
    id: "vue-calendar",
    label: "날짜",
    hint: "날짜를 선택하세요.",
    defaultValue: "2026-07-01",
  },
  { states: defaultAndFocus, description: "Calendar의 날짜 입력과 hint/id 관계를 확인합니다." },
);

export const CalendarRangeDefault = makeStory(
  CalendarRange,
  "calendar-range.default",
  "CalendarRange · range",
  {
    id: "vue-calendar-range",
    label: "기간 선택",
    defaultValue: ["2026-07-01", "2026-07-31"],
  },
  {
    states: defaultAndFocus,
    description: "배열 defaultValue로 시작일/종료일을 함께 제어하는 range model을 확인합니다.",
  },
);

export const CarouselDefault = makeStory(
  Carousel,
  "carousel.default",
  "Carousel · banner",
  {
    slides,
    previousLabel: "이전 슬라이드",
    nextLabel: "다음 슬라이드",
    moreLabel: "더 보기",
    actionLabel: "자세히 보기",
    imageLabel: "정책 안내 이미지",
    href: "#policy",
  },
  {
    states: defaultAndFocus,
    description: "slides 데이터와 pageChange emit을 사용하는 Vue carousel입니다.",
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const next = canvas.getByRole("button", { name: "다음 슬라이드" });
      await userEvent.click(next);
      await expect(canvas.getByRole("button", { name: "다음 슬라이드" })).toBeInTheDocument();
    },
  },
);

export const CarouselBannerDefault = makeStory(
  CarouselBanner,
  "carousel-banner.default",
  "CarouselBanner · dense banner",
  {
    slides,
    previousLabel: "이전 배너",
    nextLabel: "다음 배너",
    moreLabel: "배너 더 보기",
    playLabel: "재생",
    stopLabel: "정지",
    imageLabel: "배너 이미지",
  },
  { states: defaultAndFocus },
);

export const CheckboxChipDefault = makeStory(
  CheckboxChip,
  "checkbox-chip.default",
  "CheckboxChip · model binding",
  {
    id: "vue-checkbox-chip",
    name: "topic",
    value: "policy",
    label: "정책 소식",
    defaultChecked: true,
  },
  {
    states: defaultAndFocus,
    description: "checkbox chip의 defaultChecked와 update:modelValue 이벤트를 확인합니다.",
  },
);

export const CheckboxSizeDefault = makeStory(
  CheckboxSize,
  "checkbox-size.default",
  "CheckboxSize · large",
  {
    id: "vue-checkbox-size",
    name: "topic-large",
    value: "service",
    label: "서비스 소식",
    size: "large",
  },
  { states: defaultAndFocus },
);

export const CoachMarkDefault = makeStory(
  CoachMark,
  "coach-mark.default",
  "CoachMark · step 1 of 3",
  {
    title: "서비스 둘러보기",
    stepTitle: "첫 번째 안내",
    description: "이 영역에서 주요 기능을 확인할 수 있습니다.",
    currentStep: "1",
    totalSteps: "3",
    stopLabel: "그만 보기",
    nextLabel: "다음",
    contentTitle: "신청 현황",
  },
  { states: defaultAndFocus },
);

export const ContextualHelpDefault = makeStory(
  ContextualHelp,
  "contextual-help.default",
  "ContextualHelp · disclosure",
  {
    id: "vue-contextual-help",
    label: "도움말 열기",
    title: "입력 안내",
    description: "입력 형식과 제출 시점을 안내합니다.",
    caption: "도움이 필요하신가요?",
    closeLabel: "도움말 닫기",
    defaultOpen: false,
  },
  {
    states: defaultAndFocus,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const trigger = canvas.getByRole("button", { name: "도움말 열기" });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    },
  },
);

export const CriticalAlertsDefault = makeStory(
  CriticalAlerts,
  "critical-alerts.default",
  "CriticalAlerts · alert list",
  {
    items: [
      {
        id: "alert-1",
        badge: "긴급",
        tone: "danger",
        text: "서비스 점검이 예정되어 있습니다.",
        linkLabel: "자세히 보기",
        href: "#notice",
      },
      { id: "alert-2", badge: "안내", tone: "info", text: "새로운 신청 안내를 확인하세요." },
    ],
  },
  { states: defaultAndFocus, description: "items 배열로 alert role과 각 안내 링크를 구성합니다." },
);

export const DateInputDefault = makeStory(
  DateInput,
  "date-input.default",
  "DateInput · native date",
  {
    id: "vue-date-input",
    label: "신청일",
    hint: "신청 날짜를 선택하세요.",
    defaultValue: "2026-07-27",
  },
  { states: defaultAndFocus },
);

export const DisclosureDefault = makeStory(
  Disclosure,
  "disclosure.default",
  "Disclosure · collapsed / expanded",
  {
    id: "vue-disclosure",
    title: "상세 안내",
    items: ["제출 서류를 준비하세요.", "신청 결과는 알림으로 안내합니다."],
    defaultOpen: false,
  },
  {
    states: defaultAndFocus,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const trigger = canvas.getByRole("button", { name: "상세 안내" });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    },
  },
);

export const FaviconDefault = makeStory(
  Favicon,
  "favicon.default",
  "Favicon · link metadata",
  {
    href: "/favicon.ico",
    sizes: "32x32",
    type: "image/x-icon",
  },
  {
    states: ["default"],
    description: 'Favicon public props로 link[rel="icon"] 메타데이터를 렌더링합니다.',
  },
);

export const FileUploadDefault = makeStory(
  FileUpload,
  "file-upload.default",
  "FileUpload · multiple files",
  {
    id: "vue-file-upload",
    title: "첨부 파일",
    description: "필요한 서류를 첨부하세요.",
    hint: "PDF 또는 이미지 파일을 추가할 수 있습니다.",
    label: "파일 선택",
    multiple: true,
    slotContent: "선택된 파일이 여기에 표시됩니다.",
  },
  {
    states: defaultAndFocus,
    description: "default slot으로 파일 목록을 구성하고 filesChange emit을 노출합니다.",
  },
);

const footerArgs: FooterStoryArgs = {
  className: "sample",
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
  links: ["찾아오시는 길", "이용안내", "직원검색"].map((label) => ({ label, href: "#" })),
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

export const FooterDefault = makeStory(
  Footer,
  "footer.default",
  "Footer · official subtree",
  footerArgs,
  {
    states: defaultAndFocus,
    description:
      "공식 fixture의 related sites, 연락처, 링크, social/policy 링크를 props로 전달합니다.",
  },
);

const headerUtilityItems: MenuItem[] = [
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

const headerArgs: HeaderStoryArgs = {
  menuLabel: "메인 메뉴",
  utilityItems: headerUtilityItems,
  logoLabel: "KRDS - Korea Design System",
  logoHref: "#",
  searchLabel: "통합검색",
  searchTitle: "통합검색 레이어",
  loginLabel: "로그인",
  loginHref: "#",
  joinLabel: "회원가입",
  allMenuLabel: "전체메뉴",
  myMenu: {
    label: "나의 GOV",
    userName: "홍길동님",
    timeLabel: "로그아웃까지 남은 시간",
    time: "12:00",
    extendLabel: "시간 연장",
    items: [
      { id: "my-1", label: "나의 GOV 홈", href: "#" },
      { id: "my-2", label: "나의 신청내역", href: "#" },
      { id: "my-3", label: "나의 생활정보", href: "#" },
      { id: "my-4", label: "나의 정보관리", href: "#" },
    ],
    logoutLabel: "로그아웃",
  },
  desktopItems: desktopMenuItems,
  nav: desktopMenuItems,
  mobileMenu: mobileMenuArgs,
  title: "서비스명",
  links: desktopMenuItems,
};

export const HeaderDefault = makeStory(
  Header,
  "header.default",
  "Header · full utility and navigation data",
  headerArgs,
  {
    states: defaultAndFocus,
    description:
      "공식 header fixture의 menuLabel, utility resize selected/reset labels, account/search controls, desktop/mobile menu data를 props로 전달합니다.",
  },
);

export const HelpPanelDefault = makeStory(
  HelpPanel,
  "help-panel.default",
  "HelpPanel · help / tutorial tabs",
  {
    id: "vue-help-panel",
    label: "도움말 패널",
    defaultOpen: true,
    activeTab: "help",
    tabs: [
      { id: "help", value: "help", label: "도움말", panelId: "help-panel-tab" },
      { id: "tutorial", value: "tutorial", label: "사용 방법", panelId: "tutorial-panel-tab" },
    ],
    selectedLabel: "선택됨",
    helpTitle: "도움말 다운로드",
    helpDescription: "서비스 이용에 필요한 자료를 내려받을 수 있습니다.",
    downloadLinks: [
      { label: "이용 안내서", href: "#guide", target: "_blank", title: "새 창 열기" },
      { label: "접근성 안내", href: "#a11y" },
    ],
    relatedGroups: [
      {
        title: "관련 서비스",
        links: [
          { label: "서비스 홈", href: "#home" },
          { label: "고객센터", href: "#support" },
        ],
      },
    ],
    collapseLabel: "접어두기",
  },
  {
    states: defaultAndFocus,
    description: "tabs/activeTab과 help content 데이터를 사용해 Vue 도움말 패널을 구성합니다.",
  },
);

export const IdentifierDefault = makeStory(
  Identifier,
  "identifier.default",
  "Identifier · organization",
  {
    organization: "KRDS - Korea Design System",
    description: "이 누리집은 보건복지부 누리집입니다.",
  },
  { states: ["default"] },
);

export const InPageNavigationDefault = makeStory(
  InPageNavigation,
  "in-page-navigation.default",
  "InPageNavigation · current section",
  {
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
  {
    states: defaultAndFocus,
    description: "현재 section과 action summary를 포함한 navigation landmark를 구성합니다.",
  },
);

export const LanguageSwitcherDefault = makeStory(
  LanguageSwitcher,
  "language-switcher.default",
  "LanguageSwitcher · selection",
  {
    id: "vue-language-switcher",
    label: "언어",
    defaultSelected: "ko",
    languages: [
      { value: "ko", label: "한국어", href: "#ko", lang: "ko" },
      { value: "en", label: "English", href: "#en", lang: "en" },
      { value: "zh", label: "中文", href: "#zh", lang: "zh" },
    ],
  },
  {
    states: defaultAndFocus,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await userEvent.click(canvas.getByRole("button", { name: "언어" }));
      await userEvent.click(canvas.getByRole("link", { name: /English/ }));
      await expect(canvas.getByRole("link", { name: /English/ })).toBeInTheDocument();
    },
  },
);

export const LanguageSwitcherPageDefault = makeStory(
  LanguageSwitcherPage,
  "language-switcher-page.default",
  "LanguageSwitcherPage · external links",
  {
    id: "vue-language-switcher-page",
    title: "현재 언어",
    label: "언어 선택",
    text: "새 창 열기",
    defaultSelected: "ko",
    languages: [
      { value: "ko", label: "한국어", href: "#ko", lang: "ko", external: true },
      { value: "en", label: "English", href: "#en", lang: "en", external: true },
    ],
  },
  {
    states: defaultAndFocus,
    description: "페이지 언어 전환의 현재 언어와 외부 링크 title을 함께 구성합니다.",
  },
);

export const LinkDefault = makeStory(
  Link,
  "link.default",
  "Link · external action",
  {
    href: "#guide",
    label: "이용 안내 보기",
    external: true,
    title: "새 창 열기",
    slotContent: "이용 안내 보기",
  },
  {
    states: defaultAndFocus,
    description: "default slot과 external link semantics를 사용하는 Vue Link입니다.",
  },
);

const pcMenuArgs: MenuStoryArgs = {
  className: "sample",
  sample: true,
  menuLabel: "메인 메뉴",
  label: "주 메뉴",
  items: desktopMenuItems,
};

export const MainMenuPcDefault = makeStory(
  MainMenuPc,
  "main-menu-pc.default",
  "MainMenuPc · nested desktop navigation",
  pcMenuArgs,
  {
    states: defaultAndFocus,
    description:
      "공식 PC fixture의 active/nested/title link/descriptionItems/banner/single link와 button item을 모두 items 데이터로 전달합니다.",
  },
);

const mobileMenuArgs: MenuStoryArgs = {
  className: "sample",
  sample: true,
  title: "전체 메뉴",
  label: "주 메뉴",
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
};

export const MainMenuMobileDefault = makeStory(
  MainMenuMobile,
  "main-menu-mobile.default",
  "MainMenuMobile · utility and depth navigation",
  mobileMenuArgs,
  {
    states: defaultAndFocus,
    description:
      "공식 mobile fixture의 utility/login/service/search, 5개 1Depth와 depth4, bottomItems/previous/close labels를 모두 props로 전달합니다.",
  },
);

export const MastheadDefault = makeStory(
  Masthead,
  "masthead.default",
  "Masthead · notice",
  {
    message: "새로운 누리집을 이용해 주세요.",
  },
  { states: ["default"] },
);

export const ModalSampleDefault = makeStory(
  ModalSample,
  "modal-sample.default",
  "ModalSample · open dialog",
  {
    id: "vue-modal-sample",
    title: "신청 완료",
    description: "신청 내용을 확인해 주세요.",
    defaultOpen: true,
    closeLabel: "닫기",
  },
  {
    states: defaultAndFocus,
    description:
      "defaultOpen과 slot/description으로 처음부터 열린 dialog를 구성하고 focus semantics를 확인합니다.",
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await expect(canvas.getByRole("dialog", { name: "신청 완료" })).toBeVisible();
      await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    },
  },
);

export const PaginationDefault = makeStory(
  Pagination,
  "pagination.default",
  "Pagination · current page",
  {
    id: "vue-pagination",
    defaultCurrent: 4,
    items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
    previousDisabled: true,
    previousLabel: "이전",
    nextLabel: "다음",
    message: "현재페이지",
  },
  {
    states: defaultAndFocus,
    description: "current/pageChange와 ellipsis item을 사용하는 navigation landmark입니다.",
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await userEvent.click(canvas.getByRole("link", { name: "5" }));
      await expect(canvas.getByRole("link", { name: "5" })).toHaveClass("active");
    },
  },
);

export const RadioButtonDefault = makeStory(
  RadioButton,
  "radio-button.default",
  "RadioButton · group",
  {
    id: "vue-radio-button",
    name: "vue-radio-button-group",
    value: "one",
    label: "첫 번째 선택지",
    defaultValue: "one",
  },
  { states: defaultAndFocus },
);

export const RadioChipDefault = makeStory(
  RadioChip,
  "radio-chip.default",
  "RadioChip · chip group",
  {
    id: "vue-radio-chip",
    name: "vue-radio-chip-group",
    value: "one",
    label: "첫 번째 선택지",
    defaultValue: "one",
  },
  { states: defaultAndFocus },
);

export const RadioSizeDefault = makeStory(
  RadioSize,
  "radio-size.default",
  "RadioSize · large",
  {
    id: "vue-radio-size",
    name: "vue-radio-size-group",
    value: "one",
    label: "큰 선택지",
    size: "large",
  },
  { states: defaultAndFocus },
);

export const ResizeDefault = makeStory(
  Resize,
  "resize.default",
  "Resize · scale selection",
  {
    id: "vue-resize",
    label: "화면 배율",
    options: [
      { value: "100", label: "100%" },
      { value: "120", label: "120%" },
      { value: "150", label: "150%" },
    ],
    defaultValue: "100",
    selectedLabel: "선택됨",
    resetLabel: "초기화",
  },
  {
    states: defaultAndFocus,
    description: "options와 update:modelValue를 사용하는 배율 선택 drop control입니다.",
  },
);

export const SelectDefault = makeStory(
  Select,
  "select.default",
  "Select · options",
  {
    id: "vue-select",
    label: "신청 유형",
    options,
    defaultSelected: "one",
  },
  { states: defaultAndFocus },
);

export const SelectSizeDefault = makeStory(
  SelectSize,
  "select-size.default",
  "SelectSize · large",
  {
    id: "vue-select-size",
    label: "표시 개수",
    options,
    size: "large",
    defaultSelected: "two",
  },
  { states: defaultAndFocus },
);

export const SelectSortingDefault = makeStory(
  SelectSorting,
  "select-sorting.default",
  "SelectSorting · sorting",
  {
    id: "vue-select-sorting",
    label: "정렬 기준",
    options: [
      { value: "relevance", label: "관련도순" },
      { value: "latest", label: "최신순" },
      { value: "popular", label: "인기순" },
    ],
    defaultSelected: "relevance",
  },
  { states: defaultAndFocus },
);

export const SelectStateDefault = makeStory(
  SelectState,
  "select-state.default",
  "SelectState · error",
  {
    id: "vue-select-state",
    label: "신청 상태",
    state: "error",
    options,
    defaultSelected: "one",
  },
  {
    states: defaultAndFocus,
    description: 'state="error"를 전달한 select의 invalid visual state를 확인합니다.',
  },
);

export const SideNavigationDefault = makeStory(
  SideNavigation,
  "side-navigation.default",
  "SideNavigation · nested links",
  {
    id: "vue-side-navigation",
    title: "서비스 메뉴",
    items: [
      {
        id: "side-1",
        label: "서비스 안내",
        children: [
          {
            id: "side-1-1",
            label: "신청 절차",
            children: [
              { id: "side-1-1-1", label: "준비 서류", href: "#documents" },
              { id: "side-1-1-2", label: "신청하기", href: "#apply", current: true },
            ],
          },
        ],
      },
    ],
  },
  { states: defaultAndFocus },
);

export const SkipLinkDefault = makeStory(
  SkipLink,
  "skip-link.default",
  "SkipLink · target link",
  {
    href: "#main-content",
    label: "본문 바로가기",
    slotContent: "본문 바로가기",
  },
  {
    states: defaultAndFocus,
    description: "skip link의 href와 default slot accessible name을 확인합니다.",
  },
);

export const SpinnerDefault = makeStory(
  Spinner,
  "spinner.default",
  "Spinner · loading status",
  {
    label: "불러오는 중",
  },
  {
    states: ["default"],
    description: 'role="status"와 visually hidden label을 사용하는 로딩 상태입니다.',
  },
);

export const StepIndicatorDefault = makeStory(
  StepIndicator,
  "step-indicator.default",
  "StepIndicator · current step",
  {
    label: "단계",
    message: "현재 단계",
    current: 1,
    steps: [
      { id: "step-1", label: "신청 정보" },
      { id: "step-2", label: "제출 서류" },
      { id: "step-3", label: "완료" },
    ],
  },
  { states: ["default"] },
);

const structuredTableArgs: TableStoryArgs = {
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
  columns: [
    { key: "selected", label: "선택", width: "5%" },
    { key: "type", label: "유형", width: "10%" },
    { key: "title", label: "제목", width: "15%" },
    { key: "content", label: "내용", width: "30%" },
    { key: "download", label: "다운로드", visuallyHidden: true, width: "10%" },
    { key: "date", label: "게시일", width: "10%" },
  ],
  rows: [
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
  ],
  pagination: {
    current: 4,
    items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
    previousDisabled: true,
    previousLabel: "이전",
    nextLabel: "다음",
    currentLabel: "현재페이지",
  },
};

export const StructuredListTableDefault = makeStory(
  StructuredListTable,
  "structured-list-table.default",
  "StructuredListTable · official data table",
  structuredTableArgs,
  {
    states: defaultAndFocus,
    description:
      "공식 fixture의 6개 column/7개 row와 action/count/sort/nested pagination 데이터를 모두 전달합니다.",
  },
);

export const StructuredListDefault = makeStory(
  StructuredList,
  "structured-list.default",
  "StructuredList · cards",
  {
    items: [
      {
        id: "card-1",
        title: "서비스 신청 안내",
        description: "신청 절차와 제출 서류를 확인하세요.",
        href: "#service",
        badge: "새 소식",
        tone: "primary",
        dateLabel: "게시일",
        date: "2025.12.17",
        actionLabel: "자세히 보기",
        tags: ["복지", "신청"],
      },
      {
        id: "card-2",
        title: "이용자 도움말",
        description: "자주 묻는 질문을 모았습니다.",
        href: "#help",
        badge: "안내",
        tone: "information",
        dateLabel: "게시일",
        date: "2025.12.16",
        actionLabel: "자세히 보기",
        tags: ["도움말"],
      },
    ],
    shareLabel: "공유",
    favoriteLabel: "즐겨찾기",
  },
  { states: defaultAndFocus },
);

export const TableDefault = makeStory(
  Table,
  "table.default",
  "Table · caption and rows",
  {
    caption:
      "000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.",
    columns: [
      { key: "title", label: "제목1", width: "30%" },
      { key: "content", label: "제목2" },
    ],
    rows: [
      { title: "제목1-1", content: "내용이 들어갑니다. ".repeat(13).trim() },
      { title: "제목1-2", content: "내용이 들어갑니다." },
      { title: "제목1-3", content: "내용이 들어갑니다. ".repeat(4).trim() },
    ],
  },
  {
    states: ["default"],
    description: "공식 fixture의 caption, 2개 column, 3개 row를 표 props로 전달합니다.",
  },
);

export const TagDefault = makeStory(
  Tag,
  "tag.default",
  "Tag · removable",
  {
    label: "복지",
    removable: true,
    message: "복지 태그 삭제",
  },
  {
    states: defaultAndFocus,
    description: "removable tag와 close emit을 사용하는 Vue slot component입니다.",
  },
);

export const TagLinkDefault = makeStory(
  TagLink,
  "tag-link.default",
  "TagLink · link",
  {
    href: "#policy",
    label: "정책",
    slotContent: "정책",
  },
  { states: defaultAndFocus },
);

export const TextInputIconDefault = makeStory(
  TextInputIcon,
  "text-input-icon.default",
  "TextInputIcon · accessible input",
  {
    id: "vue-text-input-icon",
    ariaLabel: "검색어",
    placeholder: "검색어를 입력하세요.",
    defaultValue: "KRDS",
  },
  {
    states: defaultAndFocus,
    description: "icon input에 aria-label과 model update 이벤트를 전달합니다.",
  },
);

export const TextInputSizeDefault = makeStory(
  TextInputSize,
  "text-input-size.default",
  "TextInputSize · size variant",
  {
    id: "vue-text-input-size",
    label: "이름",
    hint: "실명을 입력하세요.",
    size: "large",
    defaultValue: "홍길동",
  },
  { states: defaultAndFocus },
);

export const TextInputStateDefault = makeStory(
  TextInputState,
  "text-input-state.default",
  "TextInputState · error",
  {
    id: "vue-text-input-state",
    label: "이메일",
    hint: "이메일 주소를 확인하세요.",
    state: "error",
    error: "올바른 이메일 주소를 입력하세요.",
  },
  { states: defaultAndFocus },
);

export const TextListDefault = makeStory(
  TextList,
  "text-list.default",
  "TextList · nested list",
  {
    items: [
      {
        id: "level-1-1",
        label: "텍스트 목록 레벨1",
        children: [
          { id: "level-2-1", label: "텍스트 목록 레벨2" },
          {
            id: "level-2-2",
            label: "텍스트 목록 레벨2",
            children: [
              { id: "level-3-1", label: "텍스트 목록 레벨3" },
              { id: "level-3-2", label: "텍스트 목록 레벨3" },
            ],
          },
        ],
      },
      { id: "level-1-2", label: "텍스트 목록 레벨1" },
      { id: "level-1-3", label: "텍스트 목록 레벨1" },
    ],
  },
  { states: ["default"] },
);

export const TextListOrderedDefault = makeStory(
  TextListOrdered,
  "text-list-ordered.default",
  "TextListOrdered · nested ordered list",
  {
    items: [
      {
        id: "ordered-1",
        label: "텍스트 목록 레벨1",
        children: [
          { id: "ordered-2", label: "텍스트 목록 레벨2" },
          {
            id: "ordered-3",
            label: "텍스트 목록 레벨2",
            children: [{ id: "ordered-4", label: "텍스트 목록 레벨3" }],
          },
        ],
      },
      { id: "ordered-5", label: "텍스트 목록 레벨1" },
    ],
  },
  { states: ["default"] },
);

export const TextareaDefault = makeStory(
  Textarea,
  "textarea.default",
  "Textarea · model binding",
  {
    id: "vue-textarea",
    name: "message",
    placeholder: "의견을 입력하세요.",
    defaultValue: "서비스 이용 경험을 남겨 주세요.",
    ariaLabel: "의견",
  },
  { states: defaultAndFocus },
);

export const ToggleSwitchDefault = makeStory(
  ToggleSwitch,
  "toggle-switch.default",
  "ToggleSwitch · checked state",
  {
    id: "vue-toggle-switch",
    name: "notifications",
    label: "알림 받기",
    defaultChecked: true,
  },
  {
    states: defaultAndFocus,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const toggle = canvas.getByRole("checkbox", { name: "알림 받기" });
      await expect(toggle).toBeChecked();
      await userEvent.click(toggle);
      await expect(toggle).not.toBeChecked();
    },
  },
);

export const ToggleSwitchSizeDefault = makeStory(
  ToggleSwitchSize,
  "toggle-switch-size.default",
  "ToggleSwitchSize · large",
  {
    id: "vue-toggle-switch-size",
    name: "large-notifications",
    label: "큰 알림 스위치",
    size: "large",
  },
  { states: defaultAndFocus },
);

export const TooltipDefault = makeStory(
  Tooltip,
  "tooltip.default",
  "Tooltip · top",
  {
    label: "도움말",
    message: "추가 설명을 확인하세요.",
    position: "top",
  },
  { states: defaultAndFocus },
);

export const TooltipBoxDefault = makeStory(
  TooltipBox,
  "tooltip-box.default",
  "TooltipBox · boxed",
  {
    label: "상세 설명",
    message: "박스형 툴팁 설명입니다.",
    position: "top",
  },
  { states: defaultAndFocus },
);

export const TooltipVerticalDefault = makeStory(
  TooltipVertical,
  "tooltip-vertical.default",
  "TooltipVertical · vertical",
  {
    label: "세로 도움말",
    message: "세로 방향으로 표시되는 설명입니다.",
    position: "right",
  },
  { states: defaultAndFocus },
);

export const TtsDefault = makeStory(
  Tts,
  "tts.default",
  "Tts · play state",
  {
    text: "음성으로 듣기",
    label: "음성 재생",
    playing: false,
  },
  {
    states: defaultAndFocus,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const button = canvas.getByRole("button", { name: "음성으로 듣기" });
      await userEvent.click(button);
      await expect(button).toHaveAttribute("aria-pressed", "true");
    },
  },
);

export const TtsIconDefault = makeStory(
  TtsIcon,
  "tts-icon.default",
  "TtsIcon · icon only",
  {
    label: "음성 재생",
    iconOnly: true,
    playing: false,
    ariaLabel: "음성 재생",
  },
  { states: defaultAndFocus },
);

export const TtsSizeDefault = makeStory(
  TtsSize,
  "tts-size.default",
  "TtsSize · large",
  {
    text: "음성으로 듣기",
    label: "음성 재생",
    size: "large",
    playing: true,
  },
  { states: defaultAndFocus },
);

export const TutorialPanelDefault = makeStory(
  TutorialPanel,
  "tutorial-panel.default",
  "TutorialPanel · task list",
  {
    id: "vue-tutorial-panel",
    label: "튜토리얼 패널",
    defaultOpen: true,
    activeTab: "tutorial",
    tabs: [
      { id: "help", value: "help", label: "도움말", panelId: "tutorial-help-panel" },
      { id: "tutorial", value: "tutorial", label: "튜토리얼", panelId: "tutorial-task-panel" },
    ],
    tutorialTitle: "서비스 사용 방법",
    tutorialBackTitle: "도움말로 돌아가기",
    tasks: [
      {
        title: "첫 단계",
        current: true,
        summary: "기본 정보 입력",
        steps: ["이름을 입력합니다.", "저장 버튼을 누릅니다."],
      },
      {
        title: "두 번째 단계",
        summary: "서류 제출",
        steps: ["서류를 첨부합니다.", "신청을 완료합니다."],
      },
    ],
    stopLabel: "튜토리얼 종료",
    collapseLabel: "접어두기",
  },
  {
    states: defaultAndFocus,
    description: "tutorial tabs/tasks를 props로 전달하는 Vue 튜토리얼 패널입니다.",
  },
);

export const ModelBinding = {
  name: "Vue model binding · select / checkbox / tab",
  render: () => {
    const selected = ref<AdditionalValue>("one");
    const checked = ref<AdditionalValue>(false);
    const tab = ref<AdditionalValue>("first");
    return {
      setup: () => () =>
        h(
          "form",
          {
            "aria-label": "Vue model binding example",
            style: "display:grid;gap:1rem;max-width:32rem",
          },
          [
            h(Select, {
              id: "vue-model-select",
              label: "선택",
              options,
              modelValue: selected.value,
              "onUpdate:modelValue": (value: AdditionalValue) => (selected.value = value),
            }),
            h(CheckboxChip, {
              id: "vue-model-checkbox",
              name: "model-example",
              value: "accepted",
              label: "동의",
              modelValue: checked.value,
              "onUpdate:modelValue": (value: AdditionalValue) => (checked.value = value),
            }),
            h(
              "div",
              { role: "status", "aria-live": "polite" },
              `선택: ${String(selected.value)} / 동의: ${String(checked.value)}`,
            ),
            h("div", { "aria-label": "탭 model binding" }, [
              h(ToggleSwitch, {
                id: "vue-model-tab-switch",
                name: "tab-mode",
                label: "두 번째 탭으로 이동",
                modelValue: tab.value === "second",
                "onUpdate:modelValue": (value: AdditionalValue) => {
                  tab.value = value ? "second" : "first";
                },
              }),
              h("p", { role: "status" }, `현재 탭: ${String(tab.value)}`),
            ]),
          ],
        ),
    };
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "선택" }), "two");
    await userEvent.click(canvas.getByRole("checkbox", { name: "동의" }));
    await expect(canvas.getByText(/선택: two/)).toBeVisible();
  },
  parameters: {
    fixtureIds: ["select.default", "checkbox-chip.default", "toggle-switch.default"],
    fixtureStates: ["default", "focus-visible", "checked"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "Vue idiomatic modelValue/update:modelValue binding을 한 화면에서 확인합니다.",
      },
    },
  },
} satisfies Story;

export const FormControls = {
  name: "Vue form · date / select / textarea / upload",
  render: () => {
    const submitted = ref(false);
    const date = ref<AdditionalValue>("2026-07-27");
    const category = ref<AdditionalValue>("one");
    return {
      setup: () => () =>
        h(
          "form",
          {
            "aria-label": "신청 정보 입력",
            style: "display:grid;gap:1rem;max-width:36rem",
            onSubmit: (event: Event) => {
              event.preventDefault();
              submitted.value = true;
            },
          },
          [
            h(Calendar, {
              id: "vue-form-date",
              label: "신청일",
              modelValue: date.value,
              "onUpdate:modelValue": (value: AdditionalValue) => (date.value = value),
            }),
            h(Select, {
              id: "vue-form-category",
              label: "신청 유형",
              options,
              modelValue: category.value,
              "onUpdate:modelValue": (value: AdditionalValue) => (category.value = value),
            }),
            h(Textarea, {
              id: "vue-form-message",
              label: "의견",
              "aria-label": "의견",
              placeholder: "의견을 입력하세요.",
              required: true,
            }),
            h(FileUpload, {
              id: "vue-form-file",
              label: "파일 선택",
              title: "첨부 파일",
              multiple: true,
            }),
            h(ButtonHierarchy, { type: "submit", variant: "primary", label: "신청 제출" }),
            h("p", { role: "status", hidden: !submitted.value }, "신청 정보가 제출되었습니다."),
          ],
        ),
    };
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "신청 유형" }), "two");
    await userEvent.click(canvas.getByRole("button", { name: "신청 제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("제출되었습니다.");
  },
  parameters: {
    fixtureIds: [
      "calendar.default",
      "select.default",
      "textarea.default",
      "file-upload.default",
      "button-hierarchy.default",
    ],
    fixtureStates: ["default", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "Vue form submit, native controls, emits, and accessible status feedback example.",
      },
    },
  },
} satisfies Story;
