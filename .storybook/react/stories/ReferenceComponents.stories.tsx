import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type CSSProperties } from 'react';
import {
  Accordion,
  AccordionLine,
  Badge,
  BadgeNumber,
  BadgeSize,
  Breadcrumb,
  Button,
  ButtonHierarchy,
  ButtonIcon,
  ButtonSize,
  ButtonText,
  ButtonWithIcon,
  Calendar,
  CalendarRange,
  Carousel,
  CarouselBanner,
  Checkbox,
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
  Modal,
  ModalSample,
  Pagination,
  Radio,
  RadioButton,
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
  Switch,
  Tab,
  Table,
  Tag,
  TagLink,
  Textarea,
  TextInput,
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
} from '@krds-community/react';

type ReferenceArgs = {
  variant: 'primary' | 'secondary' | 'tertiary';
  buttonSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fieldSize: 'small' | 'medium' | 'large';
  choiceSize: 'medium' | 'large';
  tone:
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'point'
    | 'danger'
    | 'warning'
    | 'success'
    | 'information'
    | 'disabled';
  appearance: 'outline' | 'solid' | 'light';
  state: 'default' | 'error' | 'success' | 'information';
  disabled: boolean;
  open: boolean;
  current: number;
  autoPlay: boolean;
};

type Story = StoryObj<ReferenceArgs>;

const meta = {
  title: 'React/Reference fixtures',
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
  },
  args: {
    variant: 'primary',
    buttonSize: 'medium',
    fieldSize: 'medium',
    choiceSize: 'medium',
    tone: 'primary',
    appearance: 'outline',
    state: 'default',
    disabled: false,
    open: false,
    current: 4,
    autoPlay: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button hierarchy variant',
    },
    buttonSize: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: 'Button size contract',
    },
    fieldSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input/select size contract',
    },
    choiceSize: {
      control: 'inline-radio',
      options: ['medium', 'large'],
      description: 'Checkbox/radio/switch size contract',
    },
    tone: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'gray',
        'point',
        'danger',
        'warning',
        'success',
        'information',
        'disabled',
      ],
    },
    appearance: {
      control: 'inline-radio',
      options: ['outline', 'solid', 'light'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success', 'information'],
    },
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
    current: { control: { type: 'number', min: 1, max: 99, step: 1 } },
    autoPlay: { control: 'boolean' },
  },
} satisfies Meta<ReferenceArgs>;

export default meta;

const fixture = (fixtureIds: string | string[], fixtureStates: string[] = ['default', 'focus-visible']) => ({
  fixtureIds: Array.isArray(fixtureIds) ? fixtureIds : [fixtureIds],
  fixtureStates,
  a11y: { test: 'error' as const },
});

const stackStyle = { display: 'grid', gap: '1rem', maxWidth: 960 } as const;
const rowStyle = { display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' } as const;

type NavItem = {
  id?: string;
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  target?: string;
  title?: string;
  button?: boolean;
  children?: NavItem[];
};

type DesktopDescriptionItem = {
  title: string;
  description: string;
  href?: string;
  target?: string;
  externalTitle?: string;
};

type DesktopMenuItem = NavItem & {
  active?: boolean;
  titleHref?: string;
  titleLinkLabel?: string;
  descriptionItems?: DesktopDescriptionItem[];
  banner?: { badge: string; label: string };
};

type MobileMenuItem = NavItem & { title?: string; children?: MobileMenuItem[] };


const breadcrumbItems: NavItem[] = [
  { id: 'home', label: '홈', href: '#' },
  { id: 'service', label: '서비스 신청', href: '#' },
  { id: 'service-2', label: '서비스 신청2', href: '#' },
];

const sideNavigationItems: NavItem[] = Array.from({ length: 3 }, (_, topIndex) => ({
  id: `depth-2-${topIndex + 1}`,
  label: '2Depth-menu',
  children: [
    {
      id: `depth-3-menu-${topIndex + 1}`,
      label: '3Depth-menu',
      children: Array.from({ length: 3 }, (_, leafIndex) => ({
        id: `depth-4-${topIndex + 1}-${leafIndex + 1}`,
        label: '4Depth',
        href: '#',
      })),
    },
    { id: `depth-3-link-a-${topIndex + 1}`, label: '3Depth-link', href: '#' },
    {
      id: `depth-3-link-b-${topIndex + 1}`,
      label: '3Depth-link',
      href: '#',
      current: topIndex === 0,
    },
  ],
}));

const inPageItems: NavItem[] = [
  { id: 'section_01', label: '서비스 개요', href: '#section_01', current: true },
  { id: 'section_02', label: '서비스 상세', href: '#section_02' },
  { id: 'section_03', label: '신청 방법 및 절차', href: '#section_03' },
  { id: 'section_04', label: '제출 서류', href: '#section_04' },
  { id: 'section_05', label: '함께 신청할 수 있는 서비스', href: '#section_05' },
  { id: 'section_06', label: '부가정보', href: '#section_06' },
  { id: 'section_07', label: '정보 변경 내역', href: '#section_07' },
];

const languageOptions = [
  { value: 'ko', label: '한국어', href: '#', lang: 'ko' },
  { value: 'en', label: 'English (영어)', href: '#', lang: 'en' },
  { value: 'zh', label: '中文 (중국어)', href: '#', lang: 'zh' },
  { value: 'ja', label: '日本語 (일본어)', href: '#', lang: 'ja' },
  { value: 'fr', label: 'français (프랑스어)', href: '#', lang: 'fr' },
];

const selectOptions = ['항목1', '항목2', '항목3', '항목4'].map((label, index) => ({
  value: `item-${index + 1}`,
  label,
}));

const resizeOptions = [
  { value: 'sm', label: '작게' },
  { value: 'md', label: '보통' },
  { value: 'lg', label: '조금 크게' },
  { value: 'xlg', label: '크게' },
  { value: 'xxlg', label: '가장크게' },
];

const desktopLastDepth = (count: number): DesktopMenuItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `last-${index + 1}`,
    label: 'Last depth',
    href: index === 0 ? '#' : undefined,
  }));

const desktopBanner = { badge: '신규 서비스', label: '메뉴명' };

const desktopMenuItems: DesktopMenuItem[] = [
  {
    id: 'desktop-depth-1',
    label: '1Depth',
    active: true,
    children: [
      {
        id: 'desktop-depth-1-1',
        label: '2Depth',
        active: true,
        title: '2Depth title',
        titleHref: '#',
        titleLinkLabel: '바로가기',
        children: desktopLastDepth(2),
        banner: desktopBanner,
      },
      {
        id: 'desktop-depth-1-2',
        label: '2Depth',
        title: '2Depth title',
        titleHref: '#',
        titleLinkLabel: '바로가기',
        children: desktopLastDepth(3),
        banner: desktopBanner,
      },
      {
        id: 'desktop-depth-1-3',
        label: '2Depth',
        title: '2Depth title',
        children: desktopLastDepth(3),
        banner: desktopBanner,
      },
      { id: 'desktop-depth-1-4', label: '2Depth', href: '#' },
      {
        id: 'desktop-depth-1-5',
        label: '2Depth',
        href: '#',
        target: '_blank',
        title: '새 창 열림',
      },
    ],
  },
  {
    id: 'desktop-depth-2',
    label: '1Depth',
    children: [
      {
        id: 'desktop-depth-2-1',
        label: '2Depth',
        title: '2Depth title',
        descriptionItems: [
          {
            title: '3Depth title',
            description: '메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.',
            href: '#',
            target: '_blank',
            externalTitle: '새 창 열림',
          },
        ],
        banner: desktopBanner,
      },
      {
        id: 'desktop-depth-2-2',
        label: '2Depth',
        title: '2Depth title',
        descriptionItems: [
          {
            title: '3Depth title',
            description: '메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.',
            href: '#',
            target: '_blank',
            externalTitle: '새 창 열림',
          },
        ],
        banner: desktopBanner,
      },
      { id: 'desktop-depth-2-3', label: '2Depth', href: '#' },
      {
        id: 'desktop-depth-2-4',
        label: '2Depth',
        href: '#',
        target: '_blank',
        title: '새 창 열림',
      },
    ],
  },
  {
    id: 'desktop-depth-3',
    label: '1Depth',
    title: '2Depth title',
    children: desktopLastDepth(10).map((item) => ({ ...item, href: '#' })),
    banner: desktopBanner,
  },
  { id: 'desktop-link-anchor', label: '링크(anchor)', href: '#' },
  { id: 'desktop-link-button', label: '링크(button)', button: true },
];
const desktopMenuProps = {
  className: 'sample',
  sample: true,
  menuLabel: '메인 메뉴',
  items: desktopMenuItems,
};

const headerDesktopItems: DesktopMenuItem[] = [
  {
    id: 'header-depth-1',
    label: '1Depth',
    children: [
      {
        id: 'header-depth-1-1',
        label: '2Depth',
        title: '2Depth title',
        titleHref: '#',
        titleLinkLabel: '바로가기',
        children: [
          { id: 'header-last-1', label: 'Last depth', href: '#' },
          { id: 'header-last-2', label: 'Last depth', button: true },
        ],
        banner: desktopBanner,
      },
      {
        id: 'header-depth-1-2',
        label: '2Depth',
        title: '2Depth title',
        titleHref: '#',
        titleLinkLabel: '바로가기',
        children: [
          { id: 'header-last-3', label: 'Last depth', href: '#' },
          { id: 'header-last-4', label: 'Last depth', button: true },
          { id: 'header-last-5', label: 'Last depth', button: true },
        ],
        banner: desktopBanner,
      },
      { id: 'header-depth-1-3', label: '2Depth', href: '#' },
      {
        id: 'header-depth-1-4',
        label: '2Depth',
        href: '#',
        target: '_blank',
        title: '새 창 열림',
      },
    ],
  },
  {
    id: 'header-depth-2',
    label: '1Depth',
    children: [
      {
        id: 'header-depth-2-1',
        label: '2Depth',
        title: '2Depth title',
        descriptionItems: [
          {
            title: '3Depth title',
            description: '메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.',
            href: '#',
            target: '_blank',
            externalTitle: '새 창 열림',
          },
        ],
        banner: desktopBanner,
      },
      {
        id: 'header-depth-2-2',
        label: '2Depth',
        title: '2Depth title',
        descriptionItems: [
          {
            title: '3Depth title',
            description: '메뉴명과 메뉴에 관한 간략한 설명이 표시되는 스타일입니다.',
            href: '#',
            target: '_blank',
            externalTitle: '새 창 열림',
          },
        ],
        banner: desktopBanner,
      },
      { id: 'header-depth-2-3', label: '2Depth', href: '#' },
      {
        id: 'header-depth-2-4',
        label: '2Depth',
        href: '#',
        target: '_blank',
        title: '새 창 열림',
      },
    ],
  },
  {
    id: 'header-depth-3',
    label: '1Depth',
    title: '2Depth title',
    children: Array.from({ length: 9 }, (_, index) => ({
      id: `header-single-${index + 1}`,
      label: 'Last depth',
      href: '#',
    })),
    banner: desktopBanner,
  },
  { id: 'header-link-anchor', label: '링크(anchor)', href: '#' },
  { id: 'header-link-button', label: '링크(button)', button: true },
];
const mobileMenuItems: MobileMenuItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: `mGnb-anchor${index + 1}`,
  label: '1Depth',
  href: `#mGnb-anchor${index + 1}`,
  children: Array.from({ length: index === 2 ? 4 : 3 }, (_, childIndex) => ({
    id: `m-depth-2-${index + 1}-${childIndex + 1}`,
    label: '2Depth',
    href: '#',
    children:
      index === 2 && childIndex === 3
        ? [
            {
              id: 'm-depth-3-1',
              label: '3Depth',
              href: '#',
              title: '4Depth title',
              children: Array.from({ length: 4 }, (_, leafIndex) => ({
                id: `m-depth-4-${leafIndex + 1}`,
                label: 'depth title',
                href: '#',
              })),
            },
            { id: 'm-depth-3-2', label: '3Depth', href: '#' },
            { id: 'm-depth-3-3', label: '3Depth', href: '#' },
          ]
        : undefined,
  })),
}));
const headerMobileItems: MobileMenuItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: `mGnb-anchor${index + 1}`,
  label: '1Depth',
  href: `#mGnb-anchor${index + 1}`,
  children: Array.from({ length: index === 2 ? 4 : 3 }, (_, childIndex) => ({
    id: `header-m-depth-2-${index + 1}-${childIndex + 1}`,
    label: '2Depth',
    href: '#',
    children:
      index === 2 && childIndex === 3
        ? [
            {
              id: 'header-m-depth-3-1',
              label: '3Depth',
              href: '#',
              title: '4Depth title',
              children: Array.from({ length: 4 }, (_, leafIndex) => ({
                id: `header-m-depth-4-${leafIndex + 1}`,
                label: 'depth title',
                href: '#',
              })),
            },
            { id: 'header-m-depth-3-2', label: '3Depth', href: '#' },
            { id: 'header-m-depth-3-3', label: '3Depth', href: '#' },
          ]
        : undefined,
  })),
}));

type HeaderUtilityItem = NavItem & {
  kind?: 'link' | 'dropdown' | 'resize';
  items?: Array<NavItem & { className?: string; selected?: boolean }>;
  selectedLabel?: string;
  resetLabel?: string;
};

const headerUtilityItems: HeaderUtilityItem[] = [
  {
    id: 'utility-external',
    kind: 'link',
    label: '메뉴명',
    href: '#',
    target: '_blank',
    title: '새 창 열기',
  },
  {
    id: 'utility-dropdown',
    kind: 'dropdown',
    label: '메뉴명',
    items: [
      { id: 'utility-dropdown-1', label: '메뉴명', href: '#' },
      { id: 'utility-dropdown-2', label: '메뉴명', href: '#' },
    ],
  },
  {
    id: 'utility-resize',
    kind: 'resize',
    label: '메뉴명',
    items: ['sm', 'md', 'lg', 'xlg', 'xxlg'].map((className) => ({
      id: `utility-resize-${className}`,
      label: '메뉴명',
      className,
      selected: className === 'md',
    })),
    selectedLabel: '선택됨',
    resetLabel: '초기화',
  },
  {
    id: 'utility-external-dropdown',
    kind: 'dropdown',
    label: '메뉴명',
    items: Array.from({ length: 3 }, (_, index) => ({
      id: `utility-external-${index + 1}`,
      label: '메뉴명',
      href: '#',
      target: '_blank',
      title: '새 창 열기',
      className: 'ico-go',
    })),
  },
];

const headerData = {
  menuLabel: '메인 메뉴',
  utilityItems: headerUtilityItems,
  logoLabel: 'KRDS - Korea Design System',
  logoHref: '#',
  searchLabel: '통합검색',
  searchTitle: '통합검색 레이어',
  loginLabel: '로그인',
  loginHref: '#',
  joinLabel: '회원가입',
  allMenuLabel: '전체메뉴',
  myMenu: {
    label: '나의 GOV',
    userName: '홍길동님',
    timeLabel: '로그아웃까지 남은 시간',
    time: '12:00',
    extendLabel: '시간 연장',
    items: ['나의 GOV 홈', '나의 신청내역', '나의 생활정보', '나의 정보관리'].map(
      (label, index) => ({ id: `my-${index + 1}`, label, href: '#' }),
    ),
    logoutLabel: '로그아웃',
  },
  desktopItems: headerDesktopItems,
  nav: headerDesktopItems,
  mobileMenu: {
    utilityItems: [
      { id: 'mobile-utility-1', label: '메뉴명' },
      { id: 'mobile-utility-2', label: '메뉴명' },
    ],
    loginLabel: '로그인을 해주세요',
    serviceItems: Array.from({ length: 4 }, (_, index) => ({
      id: `mobile-service-${index + 1}`,
      label: '메뉴명',
      href: '#',
    })),
    searchPlaceholder: '찾고자 하는 메뉴명을 입력해 주세요',
    searchTitle: '찾고자 하는 메뉴명 입력',
    searchLabel: '검색',
    items: headerMobileItems,
    previousLabel: '이전화면',
    closeLabel: '전체메뉴 닫기',
    bottomItems: [
      { label: '메뉴명', href: '#' },
      { label: '메뉴명', href: '#', target: '_blank', title: '새 창 열기' },
    ],
  },
  title: '서비스명',
  links: headerDesktopItems,
};

const mobileMenuProps = {
  className: 'sample',
  sample: true,
  style: { display: 'block', position: 'static', visibility: 'visible' } satisfies CSSProperties,
  utilityItems: [
    { id: 'utility-1', label: '메뉴명' },
    { id: 'utility-2', label: '메뉴명' },
  ],
  loginLabel: '로그인을 해주세요',
  serviceItems: Array.from({ length: 4 }, (_, index) => ({
    id: `service-${index + 1}`,
    label: '메뉴명',
    href: '#',
  })),
  searchPlaceholder: '찾고자 하는 메뉴명을 입력해 주세요',
  searchTitle: '찾고자 하는 메뉴명 입력',
  searchLabel: '검색',
  items: mobileMenuItems,
  previousLabel: '이전화면',
  closeLabel: '전체메뉴 닫기',
  bottomItems: [
    { label: '메뉴명', href: '#' },
    { label: '메뉴명', href: '#', target: '_blank', title: '새 창 열기' },
  ],
};

const footerData = {
  relatedSites: Array.from({ length: 4 }, (_, index) => ({
    id: `related-${index + 1}`,
    label: 'related_site',
    title: 'related_site 레이어',
  })),
  logoLabel: 'KRDS - Korea Design System',
  address: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
  contacts: [
    { title: '대표전화 1577-1000', description: '(유료, 평일 09시~18시)' },
    { title: '해외이용 82-33-811-2001', description: '(유료, 평일 09시~18시)' },
  ],
  links: ['찾아오시는 길', '이용안내', '직원검색'].map((label) => ({ label, href: '#' })),
  socialLinks: [
    { label: '인스타그램', icon: 'instagram' },
    { label: '유튜브', icon: 'youtube' },
    { label: 'X', icon: 'sns-x' },
    { label: '페이스북', icon: 'facebook' },
    { label: '블로그', icon: 'blog' },
  ].map((item) => ({ ...item, href: '#', target: '_blank', title: '새 창 열기' })),
  policyLinks: [
    { label: '개인정보처리방침', href: '#', emphasis: true },
    { label: '저작권 정책', href: '#' },
    { label: '웹 접근성 품질인증 마크 획득', href: '#' },
  ],
  copyright: '© 2023 National Health Insurance Service. All rights reserved.',
  organization: 'KRDS - Korea Design System',
  description: '이 누리집은 보건복지부 누리집입니다.',
};

const calendarCommon = {
  years: Array.from({ length: 24 }, (_, index) => 2001 + index),
  disabledYears: [2003],
  leadingDays: 5,
  previousMonthDayCount: 30,
  dayCount: 31,
  calendarLabel: '달력',
  previousMonthLabel: '이전 달',
  nextMonthLabel: '다음 달',
  yearSelectLabel: '연도 선택',
  monthSelectLabel: '월 선택',
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  todayLabel: '오늘',
  cancelLabel: '취소',
  confirmLabel: '확인',
  eventLabel: '일정있음',
};

const carouselSlides = [
  { id: '1', title: '타이틀 영역', description: '컨텐츠 영역 컨텐츠 영역', href: '#' },
  { id: '2', title: '타이틀 영역', description: '컨텐츠 영역 컨텐츠 영역', href: '#' },
  { id: '3', title: '타이틀 영역', description: '컨텐츠 영역 컨텐츠 영역', href: '#' },
  { id: '4', title: '타이틀 영역', description: '컨텐츠 영역 컨텐츠 영역', href: '#' },
];
const carouselBannerSlides = [
  { id: 'one', title: '타이틀', description: '서브타이틀' },
  { id: 'two', title: '타이틀', description: '서브타이틀' },
];

const steps = [
  { id: '1', label: '단계 레이블' },
  { id: '2', label: '단계 레이블' },
  { id: '3', label: '단계 레이블' },
  { id: '4', label: '단계 레이블' },
  { id: '5', label: '단계 레이블' },
];
const tabs = [
  { id: 'login_01', label: '타이틀 1' },
  { id: 'login_02', label: '타이틀 2' },
];
const tabPanels = { login_01: '탭 1 영역', login_02: '탭 2 영역' };

const textListItems = [
  { id: 'level-1-1', label: '텍스트 목록 레벨1' },
  {
    id: 'level-1-2',
    label: '텍스트 목록 레벨1',
    children: [
      { id: 'level-2-1', label: '텍스트 목록 레벨2' },
      {
        id: 'level-2-2',
        label: '텍스트 목록 레벨2',
        children: [
          { id: 'level-3-1', label: '텍스트 목록 레벨3' },
          { id: 'level-3-2', label: '텍스트 목록 레벨3' },
        ],
      },
      { id: 'level-2-3', label: '텍스트 목록 레벨2' },
    ],
  },
  { id: 'level-1-3', label: '텍스트 목록 레벨1' },
];
const orderedTextListItems = [
  { id: 'level-1-1', label: '텍스트 목록 레벨1', marker: '1. ' },
  {
    id: 'level-1-2',
    label: '텍스트 목록 레벨1',
    marker: '2. ',
    children: [
      { id: 'level-2-1', label: '텍스트 목록 레벨2', marker: 'a. ' },
      {
        id: 'level-2-2',
        label: '텍스트 목록 레벨2',
        marker: 'b. ',
        children: [
          { id: 'level-3-1', label: '텍스트 목록 레벨3', marker: '①' },
          { id: 'level-3-2', label: '텍스트 목록 레벨3', marker: '②' },
        ],
      },
      { id: 'level-2-3', label: '텍스트 목록 레벨2', marker: 'c. ' },
    ],
  },
  { id: 'level-1-3', label: '텍스트 목록 레벨1', marker: '3. ' },
];

const structuredListItems = [
  {
    id: '1',
    title: '타이틀 영역',
    description:
      '간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는 영역입니다. 간단한 설명이 들어가는 영역입니다.',
    href: '#',
    badge: '뱃지',
    badgeClass: 'bg-light-primary',
  },
  {
    id: '2',
    title: '타이틀 영역',
    description:
      '간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는 영역입니다. 간단한 설명이 들어가는 영역입니다.',
    href: '#',
    badge: '뱃지',
    badgeClass: 'bg-light-success',
  },
  {
    id: '3',
    title: '타이틀 영역',
    description:
      '간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는 영역입니다. 간단한 설명이 들어가는 영역입니다.',
    href: '#',
    badge: '뱃지',
    badgeClass: 'bg-secondary',
  },
];

const structuredListTableData = {
  className: 'sample',
  selectAllLabel: '전체선택',
  actions: Array.from({ length: 4 }, (_, index) => ({
    id: `action-${index + 1}`,
    label: '핵심버튼',
    icon: 'down',
  })),
  countLabel: '목록 표시 개수',
  countOptions: ['10개', '9개'],
  sortLabel: '정렬기준',
  sortOptions: ['관련도순', '최신순', '인기순'],
  sortValue: '관련도순',
  caption: '000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.',
  columns: [
    { key: 'selected', label: '선택', width: '5%' },
    { key: 'type', label: '유형', width: '10%' },
    { key: 'title', label: '제목', width: '15%' },
    { key: 'content', label: '내용', width: '30%' },
    { key: 'download', label: '다운로드', visuallyHidden: true, width: '10%' },
    { key: 'date', label: '게시일', width: '10%' },
  ],
  rows: Array.from({ length: 7 }, (_, index) => ({
    id: String(index + 1),
    selected: false,
    type: '유형',
    title: '타이틀 영역',
    content: '간단한 내용이 들어간는 영역입니다.',
    download: '다운로드',
    date: '2025.12.17',
  })),
  pagination: {
    current: 4,
    items: [1, 2, 3, 4, 5, 6, 7, 8, 'ellipsis', 99],
    previousDisabled: true,
    previousLabel: '이전',
    nextLabel: '다음',
    currentLabel: '현재페이지',
  },
};

const tableData = {
  caption:
    '000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.',
  columns: [
    { key: 'title', label: '제목1', width: '30%' },
    { key: 'content', label: '제목2' },
  ],
  rows: [
    {
      title: '제목1-1',
      content: Array.from({ length: 13 }, () => '내용이 들어갑니다.').join(' '),
    },
    { title: '제목1-2', content: '내용이 들어갑니다.' },
    {
      title: '제목1-3',
      content: Array.from({ length: 4 }, () => '내용이 들어갑니다.').join(' '),
    },
  ],
};

const criticalAlertItems = [
  {
    id: 'danger',
    title: '긴급 공지 내용 표시',
    text: '긴급 공지 내용 표시',
    href: '#',
    badge: 'danger',
    tone: 'danger' as const,
    badgeLabel: '긴급',
    linkLabel: '자세히 보기',
  },
  {
    id: 'ok',
    title: '긴급 공지 내용 표시',
    text: '긴급 공지 내용 표시',
    href: '#',
    badge: 'ok',
    tone: 'ok' as const,
    badgeLabel: '안전',
    linkLabel: '자세히 보기',
  },
  {
    id: 'info',
    title: '긴급 공지 내용 표시',
    text: '긴급 공지 내용 표시',
    href: '#',
    badge: 'info',
    tone: 'info' as const,
    badgeLabel: '안내',
    linkLabel: '자세히 보기',
  },
];

function ActionReference({ args }: { args: ReferenceArgs }) {
  const [saved, setSaved] = useState(false);
  return (
    <section aria-label="Actions reference" style={stackStyle}>
      <div style={rowStyle}>
        <Badge tone={args.tone} appearance={args.appearance} size="medium" label="뱃지" />
        <BadgeNumber tone={args.tone} appearance="solid" label="3" />
        <BadgeSize tone={args.tone} appearance={args.appearance} size="large" label="사이즈" />
      </div>
      <div style={rowStyle}>
        <Button
          variant={args.variant}
          size={args.buttonSize}
          disabled={args.disabled}
          onClick={() => setSaved(true)}
        >
          {saved ? '저장됨' : '저장'}
        </Button>
        <ButtonHierarchy variant={args.variant} size={args.buttonSize} disabled={args.disabled}>
          계층 버튼
        </ButtonHierarchy>
        <ButtonIcon label="검색" size={args.fieldSize} disabled={args.disabled} />
        <ButtonSize size={args.buttonSize} disabled={args.disabled}>
          크기 버튼
        </ButtonSize>
        <ButtonText className="small" disabled={args.disabled}>텍스트 버튼</ButtonText>
        <ButtonWithIcon className="xsmall" disabled={args.disabled}>아이콘 버튼</ButtonWithIcon>
      </div>
      <div style={rowStyle}>
        <Link href="https://www.site_name.com/" external target="_blank">
          기본 링크
        </Link>
        <SkipLink href="#reference-main">본문 바로가기</SkipLink>
        <Tag tone={args.tone} onRemove={() => undefined} label="태그" />
        <TagLink href="#tag" label="태그 링크" />
      </div>
      {saved ? <p role="status">저장되었습니다.</p> : null}
    </section>
  );
}

export const ActionVariants: Story = {
  name: 'Actions · hierarchy, size, tone, and links',
  render: (args) => <ActionReference args={args} />,
  args: { buttonSize: 'xsmall' },
  parameters: {
    ...fixture(
      [
        'badge-number.default',
        'badge-size.default',
        'badge.default',
        'button-hierarchy.default',
        'button-icon.default',
        'button-size.default',
        'button-text.default',
        'button-with-icon.default',
        'button.primary.medium.default',
        'button.secondary.medium.default',
        'button.tertiary.medium.default',
        'link.default',
        'skip-link.default',
        'tag.default',
        'tag-link.default',
      ],
      ['default', 'hover', 'focus-visible', 'active', 'disabled'],
    ),
    docs: {
      description: {
        story:
          '공개된 React props로 버튼 계층/크기, 배지 tone/appearance, 링크의 native anchor 속성과 태그 제거 콜백을 한눈에 비교합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole('button', { name: '저장' });
    await userEvent.click(save);
    await expect(canvas.getByRole('status')).toHaveTextContent('저장되었습니다.');
  },
};

function ChoiceReference({ args }: { args: ReferenceArgs }) {
  return (
    <section aria-label="Choice controls reference" style={stackStyle}>
      <fieldset>
        <legend>체크박스와 스위치</legend>
        <div style={rowStyle}>
          <Checkbox
            id="reference-checkbox"
            name="reference-checkbox"
            label="기본"
            size={args.choiceSize}
            disabled={args.disabled}
            description="약관 선택 상태"
          />
          <CheckboxSize
            id="reference-checkbox-size"
            name="reference-checkbox-size"
            label="큰 체크박스"
            size="large"
            disabled={args.disabled}
          />
          <CheckboxChip id="reference-checkbox-chip" name="reference-checkbox-chip" label="체크 칩" />
          <Switch
            id="reference-switch"
            name="reference-switch"
            label="알림 받기"
            size={args.choiceSize}
            disabled={args.disabled}
          />
          <Switch
            id="reference-switch-large"
            name="reference-switch-large"
            label="큰 알림 받기"
            size="large"
            disabled={args.disabled}
          />
          <ToggleSwitch id="reference-toggle" name="reference-toggle" label="토글 스위치" />
          <ToggleSwitchSize
            id="reference-toggle-size"
            name="reference-toggle-size"
            label="큰 토글 스위치"
            size="large"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>라디오 그룹</legend>
        <div style={rowStyle}>
          <Radio id="reference-radio-one" name="reference-radio" value="one" label="기본" defaultChecked />
          <Radio
            id="reference-radio-large"
            name="reference-radio-large"
            value="large"
            label="큰 라디오"
            size="large"
          />
          <RadioButton id="reference-radio-button" name="reference-radio-button" value="button" label="라디오 버튼" />
          <RadioSize id="reference-radio-size" name="reference-radio-size" value="medium" label="라디오 사이즈" size="medium" />
        </div>
      </fieldset>
    </section>
  );
}

export const ChoiceVariants: Story = {
  name: 'Choices · native groups, chips, and switch sizes',
  render: (args) => <ChoiceReference args={args} />,
  parameters: {
    ...fixture(
      [
        'checkbox-chip.default',
        'checkbox-size.default',
        'checkbox.default.medium',
        'checkbox.default.large',
        'radio-button.default',
        'radio-chip.default',
        'radio-size.default',
        'radio.default.medium',
        'radio.default.large',
        'switch.default.medium',
        'switch.default.large',
        'toggle-switch-size.default',
        'toggle-switch.default',
      ],
      ['default', 'checked', 'disabled', 'disabled-checked', 'focus-visible'],
    ),
    docs: {
      description: {
        story:
          'label/name/value/id를 실제 native input에 전달하고 checked, disabled, size, chip 변형을 같은 폼 그룹에서 비교합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '체크 칩' });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    const radio = canvas.getByRole('radio', { name: '라디오 버튼' });
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
  },
};

function InputReference({ args }: { args: ReferenceArgs }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      aria-label="Input controls reference"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      style={{ ...stackStyle, maxWidth: 560 }}
    >
      <TextInput
        ref={inputRef}
        id="reference-text-input"
        name="name"
        label="이름"
        hint="실명을 입력하세요."
        state={args.state}
        size={args.fieldSize}
        placeholder="플레이스홀더"
        required
        disabled={args.disabled}
      />
      <TextInputSize
        id="reference-text-input-size"
        name="size"
        label="작은 입력"
        hint="도움말"
        size="small"
        placeholder="플레이스홀더"
      />
      <TextInputState
        id="reference-text-input-state"
        name="state"
        label="상태 입력"
        hint="에러 메시지"
        state="error"
        error="에러 메시지"
        defaultValue="에러"
      />
      <TextInputIcon
        id="reference-text-input-icon"
        name="password"
        label="비밀번호"
        hint="8-12자의 영문자, 숫자, 특수문자 조합"
        type="password"
        defaultValue="1234567890"
        placeholder="8-12자의 영문자, 숫자, 특수문자 조합"
      />
      <Textarea
        id="reference-textarea"
        name="description"
        label="설명"
        hint="도움말"
        placeholder="플레이스홀더"
        rows={4}
      />
      <Select
        id="reference-select"
        name="item"
        label="선택"
        hint="도움말"
        title="선택"
        options={selectOptions}
      />
      <SelectSize
        id="reference-select-size"
        name="size-item"
        label="크기 선택"
        hint="도움말"
        title="선택"
        size="large"
        options={selectOptions}
      />
      <SelectState
        id="reference-select-state"
        name="state-item"
        label="상태 선택"
        hint="에러 메시지"
        title="선택"
        state="error"
        options={selectOptions}
      />
      <SelectSorting
        id="reference-select-sorting"
        name="sort"
        label="정렬기준"
        title="선택"
        options={selectOptions}
      />
      <FileUpload id="reference-file-upload" name="attachment" label="파일 선택" accept=".pdf" />
      <div style={rowStyle}>
        <Button type="submit">제출</Button>
        <Button type="button" onClick={() => inputRef.current?.focus()}>
          이름 입력에 초점
        </Button>
      </div>
      {submitted ? <p role="status">제출되었습니다.</p> : null}
    </form>
  );
}

export const InputVariants: Story = {
  name: 'Inputs · states, sizes, native attrs, and file forms',
  render: (args) => <InputReference args={args} />,
  parameters: {
    ...fixture(
      [
        'file-upload.default',
        'select-size.default',
        'select-sorting.default',
        'select-state.default',
        'select.default',
        'text-input-icon.default',
        'text-input-size.default',
        'text-input-state.default',
        'text-input.default.medium',
        'text-input.error.medium',
        'text-input.success.medium',
        'text-input.information.medium',
        'textarea.default',
      ],
      ['default', 'placeholder', 'readonly', 'disabled', 'invalid', 'focus-visible'],
    ),
    docs: {
      description: {
        story:
          'TextInput/Select/Textarea의 controlled 계약과 native name, required, disabled, placeholder, ref, file change 이벤트를 실제 form 안에서 확인합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: '이름' }), '홍길동');
    await userEvent.click(canvas.getByRole('button', { name: '제출' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('제출되었습니다.');
  },
};

function ControlledReference() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('초기 값');
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState<string[]>([]);
  return (
    <form
      aria-label="Controlled and uncontrolled reference"
      onSubmit={(event) => event.preventDefault()}
      style={{ ...stackStyle, maxWidth: 560 }}
    >
      <TextInput
        ref={inputRef}
        id="controlled-input"
        label="controlled 입력"
        name="controlled"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        aria-describedby="controlled-help"
      />
      <p id="controlled-help">값은 React state로 관리됩니다.</p>
      <Checkbox
        id="controlled-checkbox"
        name="controlled-checkbox"
        label="controlled 체크박스"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <Accordion
        multiple
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'controlled-one', title: 'controlled 첫 항목', content: '첫 패널' },
          { id: 'controlled-two', title: 'controlled 두 번째 항목', content: '두 번째 패널' },
        ]}
      />
      <div style={rowStyle}>
        <Button type="button" onClick={() => inputRef.current?.focus()}>
          ref로 초점 이동
        </Button>
        <Button type="button" onClick={() => setValue('재설정')}>값 재설정</Button>
      </div>
      <output aria-live="polite">현재 값: {value}; 선택: {checked ? '예' : '아니오'}</output>
    </form>
  );
}

export const ControlledAndNativeContracts: Story = {
  name: 'Contracts · controlled state, refs, and native form semantics',
  render: () => <ControlledReference />,
  parameters: {
    ...fixture(
      ['text-input.default.medium', 'checkbox.default.medium', 'accordion.default.single'],
      ['default', 'checked', 'expanded', 'focus-visible', 'keyboard-toggle'],
    ),
    docs: {
      description: {
        story:
          'value/checked/open을 controlled로 연결하고 default 상태와 ref focus를 함께 보여 줍니다. 컴포넌트는 label/id/name/aria-describedby를 native 요소에 위임합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'controlled 입력' });
    await userEvent.clear(input);
    await userEvent.type(input, '변경 값');
    await expect(canvas.getByRole('textbox', { name: 'controlled 입력' })).toHaveValue('변경 값');
    const checkbox = canvas.getByRole('checkbox', { name: 'controlled 체크박스' });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    const accordion = canvas.getByRole('button', { name: 'controlled 첫 항목' });
    await userEvent.click(accordion);
    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
  },
};

function NavigationReference() {
  return (
    <div style={stackStyle}>
      <Masthead message="이 누리집은 보건복지부 누리집입니다." />
      <Header {...headerData} />
      <Identifier organization="KRDS - Korea Design System" description="이 누리집은 보건복지부 누리집입니다." />
      <Breadcrumb items={breadcrumbItems} />
      <section aria-label="Desktop main menu">
        <MainMenuPc {...desktopMenuProps} onItemChange={() => undefined} />
      </section>
      <section aria-label="Mobile main menu">
        <MainMenuMobile
          {...mobileMenuProps}
          onSearchChange={() => undefined}
          onSearch={() => undefined}
          onPrevious={() => undefined}
          onClose={() => undefined}
        />
      </section>
      <SideNavigation title="1Depth-title" items={sideNavigationItems} />
      <InPageNavigation
        title="이 페이지의 구성"
        pageTitle="장애아동수당"
        actionLabel="온라인 신청하기"
        actionInfo="장애아동수당 외"
        actionCount="1건"
        items={inPageItems}
      />
      <div style={rowStyle}>
        <LanguageSwitcher languages={languageOptions} label="언어 선택" currentLabel="현재 언어" defaultValue="ko" />
        <LanguageSwitcherPage
          languages={languageOptions}
          label="언어 선택"
          currentLabel="현재 언어"
          defaultValue="ko"
        />
      </div>
      <Footer {...footerData} onRelatedSite={() => undefined} />
    </div>
  );
}

export const NavigationAndShell: Story = {
  name: 'Navigation · full data-driven shell and menus',
  render: () => <NavigationReference />,
  parameters: {
    ...fixture(
      [
        'breadcrumb.default',
        'footer.default',
        'header.default',
        'identifier.default',
        'in-page-navigation.default',
        'language-switcher-page.default',
        'language-switcher.default',
        'main-menu-mobile.default',
        'main-menu-pc.default',
        'masthead.default',
        'side-navigation.default',
      ],
      ['default', 'expanded', 'collapsed', 'focus-visible', 'keyboard-toggle'],
    ),
    docs: {
      description: {
        story:
          '공식 fixture 데이터 구조를 그대로 props로 전달합니다. PC의 nested/title/link/button/banner/description 변형과 mobile utility/service/search/depth4/bottom 상태를 임의 markup 없이 탐색할 수 있습니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobile = canvas.getByRole('region', { name: 'Mobile main menu' });
    const menuButton = within(mobile).getByRole('button', { name: '메뉴' });
    await userEvent.click(menuButton);
    await expect(within(mobile).getByRole('navigation', { name: '모바일 주 메뉴' })).toBeVisible();
  },
};

function DataReference({ args }: { args: ReferenceArgs }) {
  const [page, setPage] = useState(args.current);
  const [selectedTab, setSelectedTab] = useState('login_01');
  return (
    <div style={stackStyle}>
      <section aria-label="Calendar family" style={stackStyle}>
        <Calendar
          {...calendarCommon}
          label="레이블"
          hint="도움말"
          year={2002}
          month={12}
          disabledMonths={[2]}
          rangeStartDay={7}
          rangeEndDay={7}
          todayDay={30}
          eventDays={[8]}
          disabledDays={[13]}
        />
        <CalendarRange
          {...calendarCommon}
          label="기간 선택"
          year={2011}
          month={2}
          disabledMonths={[1]}
          rangeStartDay={7}
          rangeEndDay={16}
          todayDay={20}
          eventDays={[6]}
          defaultStart="2011.02.07"
        />
        <DateInput
          {...calendarCommon}
          label="레이블"
          hint="도움말"
          year={2002}
          month={12}
          disabledMonths={[1]}
          rangeStartDay={7}
          rangeEndDay={16}
          todayDay={25}
          eventDays={[26]}
        />
      </section>
      <section aria-label="Carousel family" style={stackStyle}>
        <Carousel
          slides={carouselSlides}
          autoPlay={args.autoPlay}
          previousLabel="이전"
          nextLabel="다음"
          moreLabel="더 보기"
          imageLabel="예시"
          actionLabel="버튼 영역"
          label="콘텐츠 캐러셀"
        />
        <CarouselBanner
          slides={carouselBannerSlides}
          autoPlay={args.autoPlay}
          previousLabel="이전"
          nextLabel="다음"
          moreLabel="더 보기"
          imageLabel="예시"
          playLabel="슬라이드 재생"
          stopLabel="슬라이드 멈춤"
          label="배너 캐러셀"
        />
      </section>
      <section aria-label="Pagination and resize" style={rowStyle}>
        <Pagination
          current={page}
          items={[1, 2, 3, 4, 5, 6, 7, 8, 'ellipsis', 99]}
          previousDisabled={page <= 1}
          previousLabel="이전"
          nextLabel="다음"
          onPageChange={setPage}
        />
        <Resize label="화면크기" options={resizeOptions} defaultValue="md" resetLabel="초기화" />
      </section>
      <StepIndicator steps={steps} current={3} />
      <StructuredList
        items={structuredListItems}
        dateLabel="신청 기간"
        dateValue="2023.00.00-2024.00.00"
        tags={['태그', '태그']}
        actionLabel="신청하기"
        shareLabel="공유하기"
        favoriteLabel="찜하기"
        onShare={() => undefined}
        onFavorite={() => undefined}
      />
      <StructuredListTable
        {...structuredListTableData}
        onSelectionChange={() => undefined}
        onDownload={() => undefined}
      />
      <Table {...tableData} />
      <section aria-label="Tabs">
        <Tab tabs={tabs} panels={tabPanels} selected={selectedTab} onTabChange={setSelectedTab} />
      </section>
      <TextList items={textListItems} />
      <TextListOrdered items={orderedTextListItems} />
    </div>
  );
}

export const DataAndContent: Story = {
  name: 'Data · calendars, carousels, tables, lists, tabs',
  render: (args) => <DataReference args={args} />,
  parameters: {
    ...fixture(
      [
        'calendar-range.default',
        'calendar.default',
        'carousel-banner.default',
        'carousel.default',
        'date-input.default',
        'pagination.default',
        'resize.default',
        'step-indicator.default',
        'structured-list-table.default',
        'structured-list.default',
        'tab.default',
        'table.default',
        'text-list-ordered.default',
        'text-list.default',
      ],
      ['default', 'selected', 'expanded', 'collapsed', 'focus-visible', 'keyboard-toggle'],
    ),
    docs: {
      description: {
        story:
          '달력/캐러셀의 label과 날짜 데이터, 공식 table/list/pagination 데이터, controlled Tab/page 상태를 React props로 조합합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const secondTab = canvas.getByRole('tab', { name: '타이틀 2' });
    await userEvent.click(secondTab);
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  },
};

function FeedbackReference({ args }: { args: ReferenceArgs }) {
  const [accordionOpen, setAccordionOpen] = useState<string[]>(args.open ? ['one'] : []);
  const [disclosureOpen, setDisclosureOpen] = useState(args.open);
  const [contextualOpen, setContextualOpen] = useState(args.open);
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <div style={stackStyle}>
      <Accordion
        multiple
        open={accordionOpen}
        onOpenChange={setAccordionOpen}
        items={[
          { id: 'one', title: '아코디언 타이틀 영역', content: '아코디언 내용 영역' },
          { id: 'two', title: '아코디언 타이틀 영역', content: '아코디언 내용 영역' },
        ]}
      />
      <AccordionLine items={[{ id: 'line', title: '라인 아코디언', content: '라인 내용입니다.' }]} />
      <Disclosure
        title="상세 보기"
        open={disclosureOpen}
        onOpenChange={setDisclosureOpen}
        items={['상세 내용', '추가 안내']}
      />
      <ContextualHelp
        label="도움말"
        position="top-left"
        caption="도움말 캡션"
        title="도움말 제목"
        linkLabel="자세히 보기"
        closeLabel="닫기"
        open={contextualOpen}
        onOpenChange={setContextualOpen}
      >
        도움말 내용
      </ContextualHelp>
      <CoachMark
        title="튜토리얼"
        step="1 / 3"
        stepTitle="첫 번째 단계"
        description="현재 단계 안내"
        stopLabel="그만 보기"
        nextLabel="다음"
      >
        현재 단계
      </CoachMark>
      <CriticalAlerts items={criticalAlertItems} />
      <div style={rowStyle}>
        <Spinner label="로딩 중" />
        <Tooltip message="툴팁">툴팁</Tooltip>
        <TooltipBox message="박스 툴팁">박스 툴팁</TooltipBox>
        <TooltipVertical message="세로 툴팁">세로 툴팁</TooltipVertical>
        <Tts text="읽어주기" />
        <TtsIcon text="아이콘 읽어주기" />
        <TtsSize text="큰 읽어주기" size="large" />
      </div>
      <div style={rowStyle}>
        <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
        <Modal open={modalOpen} title="대화 상자" onClose={() => setModalOpen(false)}>
          모달 내용
        </Modal>
        <ModalSample open title="모달 샘플">
          샘플 내용
        </ModalSample>
      </div>
      <div style={rowStyle}>
        <HelpPanel open title="도움말">
          도움말 내용
        </HelpPanel>
        <TutorialPanel open title="튜토리얼">
          튜토리얼 내용
        </TutorialPanel>
        <Favicon href="/favicon.png" />
      </div>
    </div>
  );
}

export const FeedbackAndOverlays: Story = {
  name: 'Feedback · disclosure, alerts, tooltip, speech, and overlays',
  render: (args) => <FeedbackReference args={args} />,
  parameters: {
    ...fixture(
      [
        'accordion-line.default',
        'accordion.default.single',
        'accordion.line.single',
        'coach-mark.default',
        'contextual-help.default',
        'critical-alerts.default',
        'disclosure.default',
        'favicon.default',
        'help-panel.default',
        'modal-sample.default',
        'modal.default',
        'spinner.default',
        'tooltip-box.default',
        'tooltip-vertical.default',
        'tooltip.default',
        'tts-icon.default',
        'tts-size.default',
        'tts.default',
        'tutorial-panel.default',
      ],
      ['default', 'expanded', 'collapsed', 'focus-visible', 'keyboard-toggle'],
    ),
    docs: {
      description: {
        story:
          'Disclosure/Accordion/ContextualHelp의 controlled open 상태, native button keyboard semantics, accessible names와 Modal/HelpPanel/TTS/Tooltip 상태를 함께 확인합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disclosure = canvas.getByRole('button', { name: '상세 보기' });
    await userEvent.click(disclosure);
    await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    const dialog = canvas.getByRole('dialog', { name: '대화 상자' });
    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));
    await expect(dialog).not.toBeVisible();
    await expect(canvas.getByRole('button', { name: '모달 열기' })).toBeVisible();
  },
};
