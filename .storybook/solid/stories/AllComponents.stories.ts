import type { Meta, StoryObj } from '@storybook/html-vite';
import { createComponent, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import * as Components from '@krds-community/solid';

const names = [
  'Badge',
  'BadgeNumber',
  'BadgeSize',
  'Breadcrumb',
  'ButtonHierarchy',
  'ButtonIcon',
  'ButtonSize',
  'ButtonText',
  'ButtonWithIcon',
  'Calendar',
  'CalendarRange',
  'Carousel',
  'CarouselBanner',
  'CheckboxChip',
  'CheckboxSize',
  'CoachMark',
  'ContextualHelp',
  'CriticalAlerts',
  'DateInput',
  'Disclosure',
  'Favicon',
  'FileUpload',
  'Footer',
  'Header',
  'HelpPanel',
  'Identifier',
  'InPageNavigation',
  'LanguageSwitcher',
  'LanguageSwitcherPage',
  'Link',
  'MainMenuMobile',
  'MainMenuPc',
  'Masthead',
  'Modal',
  'ModalSample',
  'Pagination',
  'RadioButton',
  'RadioChip',
  'RadioSize',
  'Resize',
  'Select',
  'SelectSize',
  'SelectSorting',
  'SelectState',
  'SideNavigation',
  'SkipLink',
  'Spinner',
  'StepIndicator',
  'StructuredList',
  'StructuredListTable',
  'Tab',
  'Table',
  'Tag',
  'TagLink',
  'Textarea',
  'TextInputIcon',
  'TextList',
  'TextListOrdered',
  'ToggleSwitch',
  'ToggleSwitchSize',
  'Tooltip',
  'TooltipBox',
  'TooltipVertical',
  'Tts',
  'TtsIcon',
  'TtsSize',
  'TutorialPanel',
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
  { id: 'home', label: '홈', title: '홈', href: '#home', current: true },
  { id: 'guide', label: '가이드', title: '가이드', href: '#guide' },
];

const structuredItems: FixtureItem[] = [
  {
    id: 'notice',
    label: '서비스 안내',
    title: '서비스 안내',
    href: '#notice',
    description: '서비스 이용 방법을 안내합니다.',
    dateLabel: '등록일',
    dateValue: '2026. 7. 27.',
    tags: ['안내'],
    actionLabel: '자세히 보기',
    shareLabel: '공유',
    favoriteLabel: '관심 등록',
  },
  {
    id: 'update',
    label: '새 소식',
    title: '새 소식',
    href: '#update',
    description: '새로운 소식을 확인하세요.',
    dateLabel: '등록일',
    dateValue: '2026. 7. 26.',
    tags: ['소식'],
    actionLabel: '내용 보기',
    shareLabel: '공유',
    favoriteLabel: '관심 등록',
  },
];

const menuPcItems: FixtureItem[] = [
  {
    id: 'service',
    label: '서비스',
    active: true,
    children: [
      {
        id: 'service-overview',
        label: '서비스 안내',
        title: '서비스 메뉴',
        children: [
          { id: 'service-guide', label: '이용 안내', href: '#service-guide' },
          { id: 'service-apply', label: '온라인 신청', href: '#service-apply' },
        ],
      },
    ],
  },
  { id: 'notice', label: '공지사항', href: '#notice' },
];

const menuMobileItems: FixtureItem[] = [
  { id: 'mobile-home', label: '홈', href: '#mobile-home' },
  { id: 'mobile-guide', label: '가이드', href: '#mobile-guide' },
];


const footerItems: FixtureItem[] = [
  { id: 'related', label: '관련 사이트', title: '관련 사이트 열기', href: '#related' },
];

const slides = [
  {
    id: 'one',
    title: '주요 소식',
    description: '서비스 업데이트 안내입니다.',
    href: '#slide-one',
  },
  { id: 'two', title: '이용 안내', description: '이용 방법을 확인하세요.', href: '#slide-two' },
];

const tabs = [
  { id: 'one', label: '첫 번째 탭', panelId: 'panel-one' },
  { id: 'two', label: '두 번째 탭', panelId: 'panel-two' },
];

const common = {
  label: '레이블',
  title: '제목',
  description: '설명입니다.',
  message: '도움말입니다.',
  href: '#solid-main-content',
  target: '_blank',
  external: true,
  tone: 'primary',
  appearance: 'solid',
  variant: 'primary',
  open: true,
  current: 2,
  selected: 'one',
  defaultValue: 'one',
  defaultStart: '2026-07-01',
  defaultEnd: '2026-07-27',
  name: 'solid-field',
  value: 'one',
  options: [
    { value: 'one', label: '첫 번째' },
    { value: 'two', label: '두 번째' },
  ],
  items: structuredItems,
  links: navItems,
  slides,
  steps: [
    { id: 'one', label: '신청' },
    { id: 'two', label: '확인' },
    { id: 'three', label: '완료' },
  ],
  columns: [
    { key: 'name', label: '이름' },
    { key: 'status', label: '상태' },
  ],
  rows: [{ id: 'service', name: '서비스', status: '운영 중' }],
  tabs,
  panels: { one: '첫 패널', two: '두 번째 패널' },
  panelTitle: '탭 패널',
  calendarLabel: '날짜 선택',
  previousLabel: '이전',
  nextLabel: '다음',
  playLabel: '재생',
  stopLabel: '정지',
  moreLabel: '더 보기',
  imageLabel: '콘텐츠 이미지',
  yearLabel: '연도 선택',
  monthLabel: '월 선택',
  year: '2026년',
  month: '7월',
  years: [{ label: '2026년', value: '2026', active: true }],
  months: [{ label: '7월', value: '07', active: true }],
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  weeks: [
    [
      { label: '1', value: '2026-07-01' },
      { label: '2', value: '2026-07-02' },
      { label: '3', value: '2026-07-03' },
      { label: '4', value: '2026-07-04' },
      { label: '5', value: '2026-07-05' },
      { label: '6', value: '2026-07-06' },
      { label: '7', value: '2026-07-07' },
    ],
  ],
  actions: [
    { id: 'cancel', label: '취소', variant: 'tertiary', icon: 'close' },
    { id: 'confirm', label: '확인', variant: 'primary', icon: 'check' },
  ],
  stepTitle: '현재 단계 안내',
  contentTitle: '코치마크 내용',
  currentStep: '1',
  totalSteps: '3',
  currentStepLabel: '현재 단계',
  totalStepsLabel: '전체 단계',
  linkLabel: '자세히 보기',
  closeLabel: '닫기',
  selectedLabel: '선택됨',
  resetLabel: '기본값으로 초기화',
  actionLabel: '자세히 보기',
  pageTitle: '페이지 내 이동',
  actionInfo: '전체',
  actionCount: '2건',
  helpTitle: '도움말',
  helpDescription: '도움말 패널 내용입니다.',
  externalTitle: '새 창 열기',
  backTitle: '이전으로 이동',
  activeTab: 'help' as const,
  downloadLinks: [{ id: 'download', label: '사용 안내서', href: '#download', title: '사용 안내서' }],
  relatedGroups: [
    {
      title: '관련 서비스',
      links: [{ id: 'related-help', label: '자주 묻는 질문', href: '#faq' }],
    },
  ],
  tutorialTitle: '튜토리얼',
  tasks: [
    { title: '첫 번째 단계', summary: '기본 안내', steps: ['메뉴 확인', '내용 확인'], current: true },
  ],
  collapseLabel: '도움말 접기',
  menuLabel: '주 메뉴',
  utilityItems: [{ id: 'utility-home', label: '홈', href: '#utility-home', kind: 'link' }],
  loginLabel: '로그인',
  serviceItems: [{ id: 'service-help', label: '서비스 안내', href: '#service-help' }],
  searchPlaceholder: '검색어를 입력하세요.',
  searchTitle: '통합검색',
  searchLabel: '검색',
  bottomItems: [{ id: 'privacy', label: '개인정보처리방침', href: '#privacy' }],
  relatedSites: footerItems,
  logoLabel: 'KRDS Community',
  address: '서울특별시',
  contacts: [{ title: '대표전화', description: '0000-0000' }],
  policyLinks: [{ id: 'policy', label: '개인정보처리방침', href: '#policy' }],
  socialLinks: [{ id: 'social', label: '소셜 미디어', href: '#social', icon: 'facebook' }],
  copyright: '© KRDS Community',
  organization: 'KRDS Community',
  prompt: '파일을 첨부하세요.',
  inputId: 'solid-file-input',
  selectLabel: '파일 선택',
  currentCount: 1,
  maxCount: 3,
  files: [
    {
      id: 'file-one',
      name: '안내문.pdf',
      status: 'deletable' as const,
      statusLabel: '업로드 완료',
      deleteLabel: '파일 삭제',
    },
  ],
  deleteAllLabel: '전체 삭제',
  caption: '서비스 목록',
  pagination: {
    current: 2,
    items: [1, 2, 3, 'ellipsis', 5],
    previousLabel: '이전',
    nextLabel: '다음',
    currentLabel: '현재 페이지',
  },
  countLabel: '목록 표시 개수',
  countOptions: ['10개', '20개'],
  sortLabel: '정렬 기준',
  sortOptions: ['최신순', '인기순'],
  sortValue: '최신순',
  selectAllLabel: '전체 선택',
  dateLabel: '등록일',
  dateValue: '2026. 7. 27.',
  tags: ['안내', '공지'],
  shareLabel: '공유',
  favoriteLabel: '관심 등록',
  cancelLabel: '취소',
  confirmLabel: '확인',
  logoHref: '#solid-main-content',
  loginHref: '#solid-main-content',
  joinLabel: '회원가입',
  allMenuLabel: '전체 메뉴',
  desktopItems: menuPcItems,
  mobileMenu: {
    utilityItems: [{ id: 'mobile-utility', label: '홈', href: '#mobile-utility', kind: 'link' }],
    loginLabel: '로그인',
    serviceItems: [{ id: 'mobile-service', label: '서비스 안내', href: '#mobile-service' }],
    searchPlaceholder: '검색어를 입력하세요.',
    searchTitle: '통합검색',
    searchLabel: '검색',
    items: menuMobileItems,
    previousLabel: '이전 메뉴',
    closeLabel: '메뉴 닫기',
    bottomItems: [{ id: 'mobile-bottom', label: '개인정보처리방침', href: '#mobile-bottom' }],
  },
  bottomSize: 'medium' as const,
  removable: true,
  maxLength: 200,
  ordered: false,
  myMenu: {
    label: '마이페이지',
    userName: '홍길동',
    timeLabel: '로그인 시간',
    time: '2026. 7. 27. 09:00',
    extendLabel: '연장',
    items: [{ id: 'my-page', label: '내 정보', href: '#my-page' }],
    logoutLabel: '로그아웃',
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
  prefix = `solid-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '')}`,
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
  const scopedActions = common.actions.map((action) => ({ ...action, id: `${prefix}-${action.id}` }));
  const scopedTabs = scopeTabs(prefix);
  const scopedPanels = Object.fromEntries(
    scopedTabs.map((tab) => [tab.id, `${tab.label} 내용`]),
  );
  const scopedProps: Record<string, unknown> = {
    ...common,
    id:
      name === 'Footer' && prefix === 'solid-footer'
        ? 'krds-footer'
        : name === 'Header'
          ? 'krds-header'
          : name === 'Masthead'
            ? 'krds-masthead'
            : prefix,
    label: name,
    title: `${name} 예시`,
    name: `${prefix}-field`,
    inputId: `${prefix}-file-input`,
    ...(name === 'RadioChip' ||
    name === 'Textarea' ||
    name === 'TextInputIcon' ||
    name === 'TtsIcon'
      ? { 'aria-label': `${name} 입력` }
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
  if (name === 'CriticalAlerts')
    scopedProps.items = scopeItems(prefix, [
      {
        id: 'critical',
        label: '서비스 점검 안내',
        badge: 'info',
        badgeLabel: '안내',
        linkLabel: '자세히 보기',
        href: '#critical',
      },
    ]);
  if (name === 'MainMenuMobile') scopedProps.links = scopedMenuMobileItems;
  if (name === 'MainMenuPc') scopedProps.links = scopedMenuPcItems;
  if (name === 'Pagination') scopedProps.items = [1, 2, 3, 'ellipsis', 5];
  if (name === 'Tab') scopedProps.tabs = scopedTabs;
  if (name === 'Header') scopedProps.menuLabel = '사이트 주 메뉴';
  if (name === 'MainMenuPc') scopedProps.menuLabel = '보조 주 메뉴';
  if (name === 'HelpPanel') {
    const helpPanelTabs = [
      {
        id: `${prefix}-help-tab`,
        label: '도움말',
        panelId: `${prefix}-help-content`,
        value: 'help',
      },
      {
        id: `${prefix}-tutorial-tab`,
        label: '튜토리얼',
        panelId: `${prefix}-tutorial-content`,
        value: 'tutorial',
      },
    ];
    scopedProps.tabs = helpPanelTabs;
    scopedProps.panels = Object.fromEntries(
      helpPanelTabs.map((tab) => [tab.id, `${tab.label} 내용`]),
    );
  }
  return scopedProps;
};

const meta = { title: 'SolidJS/전체 컴포넌트', parameters: { layout: 'padded', a11y: { test: 'error' }, fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'] } } satisfies Meta;
export default meta;
export const Inventory: StoryObj<typeof meta> = {
  name: '전체 인벤토리',
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: [
      'button.primary.medium.default',
      'text-input.default.medium',
      'checkbox.default.medium',
      'radio.default.medium',
      'switch.default.medium',
      'accordion.default.single',
    ],
  },
  render: () => {
    const root = document.createElement('main');
    root.id = 'solid-main-content';
    root.setAttribute('aria-label', '컴포넌트 인벤토리');
    root.style.cssText =
      'display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;box-sizing:border-box;overflow-wrap:anywhere';
    const mount = (
      component: unknown,
      props: Record<string, unknown>,
      container: HTMLElement = root,
      className = '',
    ) => {
      const target = document.createElement('div');
      target.className = className;
      target.style.cssText =
        'width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere';
      container.append(target);
      render(
        () => createComponent(component as (props: Record<string, unknown>) => JSX.Element, props),
        target,
      );
      return target;
    };

    mount(Components.Button, { variant: 'primary', children: '기본 계층 버튼' });
    mount(Components.Button, { variant: 'secondary', children: '보조 계층 버튼' });
    mount(Components.Button, { variant: 'tertiary', children: '취소 계층 버튼' });
    mount(Components.Footer, fixtureProps('Footer', 'solid-footer-foundation'), root, 'component-card');
    mount(Components.TextInput, {
      id: 'solid-text-input-error',
      label: '오류 입력',
      hint: '오류 메시지',
      state: 'error',
    });
    mount(Components.TextInput, {
      id: 'solid-text-input-success',
      label: '성공 입력',
      hint: '사용할 수 있습니다.',
      state: 'success',
    });
    mount(Components.TextInput, {
      id: 'solid-text-input-information',
      label: '안내 입력',
      hint: '입력 안내입니다.',
      state: 'information',
    });
    mount(Components.Button, { children: '기본 버튼' });
    mount(Components.TextInput, { label: '기본 텍스트', hint: '도움말' });
    mount(Components.Checkbox, { label: '체크박스', name: 'check' });
    mount(Components.Checkbox, { label: '큰 체크박스', name: 'check-large', size: 'large' });
    mount(Components.Radio, { label: '큰 라디오', name: 'radio-large', value: 'large', size: 'large' });
    mount(Components.Switch, { label: '큰 스위치', name: 'switch-large', size: 'large' });
    mount(Components.AccordionLine, {
      items: [{ id: 'line', title: '라인 아코디언', content: '라인 내용' }],
    });
    mount(Components.Radio, { label: '라디오', name: 'radio', value: 'one' });
    mount(Components.Switch, { label: '스위치', name: 'switch' });
    mount(Components.Accordion, { items: [{ id: 'one', title: '아코디언', content: '내용' }] });
    mount(
      Components.RadioChip,
      {
        label: '라디오 칩',
        'aria-label': '라디오 칩',
        name: 'solid-radio-chip',
        value: 'one',
      },
      root,
      'krds-form-chip',
    );
    mount(
      Components.StructuredListTable,
      fixtureProps('StructuredListTable', 'solid-structured-table-foundation'),
      root,
      'krds-table-wrap',
    );
    mount(
      Components.Table,
      fixtureProps('Table', 'solid-table-foundation'),
      root,
      'krds-table-wrap',
    );
    const skipRoot = document.createElement('div');
    skipRoot.id = 'krds-skip-link';
    root.append(skipRoot);
    mount(Components.SkipLink, { href: '#solid-main-content', children: '본문 바로가기' }, skipRoot);

    for (const name of names)
      mount(
        (Components as Record<string, unknown>)[name],
        fixtureProps(name),
        root,
        'component-card',
      );
    return root;
  },
};
