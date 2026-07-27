import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, type Component } from 'vue';
import * as Components from '@krds-community/vue';

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
const common = {
  label: '레이블',
  title: '제목',
  description: '설명입니다.',
  message: '도움말입니다.',
  href: '#example',
  open: true,
  current: 2,
  caption: '컴포넌트 예시 표',
  text: '읽어주기',
  previousLabel: '이전 슬라이드',
  nextLabel: '다음 슬라이드',
  moreLabel: '자세히 보기',
  imageLabel: '캐러셀 이미지',
  actionLabel: '자세히 보기',
  playLabel: '재생',
  stopLabel: '정지',
  closeLabel: '닫기',
  collapseLabel: '접기',
  resetLabel: '기본 크기',
  selectedLabel: '선택됨',
  selectLabel: '파일 선택',
  deleteAllLabel: '전체 삭제',
  calendarLabel: '날짜 선택',
  previousMonthLabel: '이전 달',
  nextMonthLabel: '다음 달',
  yearSelectLabel: '연도 선택',
  monthSelectLabel: '월 선택',
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  todayLabel: '오늘',
  eventLabel: '일정',
  cancelLabel: '취소',
  confirmLabel: '확인',
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
    { value: 'one', label: '첫 번째' },
    { value: 'two', label: '두 번째' },
  ],
  items: [
    { id: 'one', label: '첫 항목', title: '첫 항목', href: '#one' },
    { id: 'two', label: '두 번째', title: '두 번째', href: '#two' },
  ],
  links: [
    { id: 'one', label: '첫 항목', href: '#one' },
    { id: 'two', label: '두 번째', href: '#two' },
  ],
  slides: [
    { id: 'one', title: '첫 슬라이드', description: '캐러셀 내용', href: '#slide-one' },
    { id: 'two', title: '두 번째 슬라이드', href: '#slide-two' },
  ],
  steps: [
    { id: 'one', label: '첫 단계' },
    { id: 'two', label: '두 번째 단계' },
  ],
  columns: [
    { key: 'name', label: '이름' },
    { key: 'status', label: '상태' },
  ],
  rows: [
    { id: 'service', name: '서비스', status: '운영 중' },
    { id: 'docs', name: '문서', status: '검토 중' },
  ],
  tabs: [
    { id: 'one', label: '첫 탭', panelId: 'vue-help-panel-one' },
    { id: 'two', label: '두 번째 탭', panelId: 'vue-help-panel-two' },
  ],
  panels: { one: '첫 패널', two: '두 번째 패널' },
};
const contractSlides = [
  { id: 'contract-one', title: '첫 번째 슬라이드', description: '캐러셀 설명', href: '#slide-one' },
  { id: 'contract-two', title: '두 번째 슬라이드', href: '#slide-two' },
];
const contractNavigation = [
  { id: 'contract-one', label: '첫 메뉴', title: '첫 메뉴', href: '#menu-one' },
  { id: 'contract-two', label: '두 번째 메뉴', title: '두 번째 메뉴', href: '#menu-two' },
];
const slug = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const menuItems = (prefix: string) => [
  {
    id: `${prefix}-home`,
    label: '홈',
    href: `#${prefix}-home`,
    children: [
      { id: `${prefix}-guide`, label: '가이드', href: `#${prefix}-guide` },
      { id: `${prefix}-docs`, label: '문서', href: `#${prefix}-docs` },
    ],
  },
  {
    id: `${prefix}-service`,
    label: '서비스',
    href: `#${prefix}-service`,
    children: [{ id: `${prefix}-support`, label: '지원', href: `#${prefix}-support` }],
  },
];
const pageNavigationItems = [
  { id: 'page-overview', label: '개요', href: '#page-overview', current: true },
  { id: 'page-details', label: '상세 내용', href: '#page-details' },
];
const tabItems = [
  { id: 'one', label: '첫 탭' },
  { id: 'two', label: '두 번째 탭' },
];
const helpTabs = [
  { id: 'help', label: '도움말', panelId: 'vue-help-panel-one', value: 'help' },
  { id: 'related', label: '관련 서비스', panelId: 'vue-help-panel-two', value: 'related' },
];
const controlledKinds = new Set(['ContextualHelp', 'LanguageSwitcher', 'LanguageSwitcherPage', 'Resize']);
const labeledControls = new Set([
  'RadioChip',
  'Select',
  'SelectSize',
  'SelectSorting',
  'SelectState',
  'Textarea',
  'TextInputIcon',
  'TtsIcon',
]);
const inventoryProps = (name: string): Record<string, unknown> => {
  const id = `vue-inventory-${slug(name)}`;
  const props: Record<string, unknown> = {
    ...common,
    id,
    label: `${name} 레이블`,
    title: `${name} 제목`,
    name: `vue-${slug(name)}`,
    class: 'component-card',
  };
  if (labeledControls.has(name)) props['aria-label'] = `${name} 입력`;
  if (controlledKinds.has(name)) props['aria-controls'] = `${id}-controls`;

  switch (name) {
    case 'Breadcrumb':
      props.items = [
        { id: 'breadcrumb-home', label: '홈', href: '#breadcrumb-home' },
        { id: 'breadcrumb-current', label: '현재 페이지', href: '#breadcrumb-current' },
      ];
      break;
    case 'Calendar':
    case 'CalendarRange':
    case 'DateInput':
      props.calendarLabel = `${name} 달력`;
      props.rangeStartDay = 10;
      props.rangeEndDay = 18;
      break;
    case 'Carousel':
    case 'CarouselBanner':
      props.slides = contractSlides;
      break;
    case 'CoachMark':
      props.step = '1/2';
      props.stepTitle = '첫 단계';
      props.currentStep = '1';
      props.totalSteps = '2';
      props.contentTitle = '따라하기 안내';
      break;
    case 'ContextualHelp':
      props.description = '도움말 내용입니다.';
      props.linkLabel = '자세히 보기';
      break;
    case 'CriticalAlerts':
      props.items = [
        {
          id: 'critical-alert',
          badge: '긴급',
          badgeLabel: '긴급',
          tone: 'danger',
          text: '서비스 점검 안내',
          href: '#critical-alert-details',
          linkLabel: '자세히 보기',
        },
      ];
      break;
    case 'Disclosure':
      props.items = [{ id: 'disclosure-item', label: '상세 안내' }];
      break;
    case 'FileUpload':
      props.title = '파일 업로드';
      props.description = '문서 파일을 업로드합니다.';
      props.prompt = '업로드할 파일을 선택하세요.';
      props.files = [
        {
          id: 'vue-uploaded-file',
          name: '서비스 안내서.pdf',
          status: 'complete',
          statusLabel: '업로드 완료',
        },
      ];
      props.currentCount = 1;
      props.maxCount = 3;
      break;
    case 'Header':
      props.logoLabel = 'KRDS Community';
      props.logoHref = '#header-home';
      props.utilityItems = [{ id: 'header-utility', label: '이용 안내', href: '#header-utility' }];
      props.desktopItems = menuItems('header');
      props.searchTitle = '사이트 검색';
      props.searchLabel = '검색';
      props.loginHref = '#header-login';
      props.loginLabel = '로그인';
      props.joinLabel = '회원가입';
      props.allMenuLabel = '전체 메뉴';
      props.menuLabel = '인벤토리 헤더 주 메뉴';
      props.mobileMenu = {
        utilityItems: [{ id: 'header-mobile-utility', label: '이용 안내', href: '#header-utility' }],
        loginLabel: '로그인',
        serviceItems: [{ id: 'header-mobile-service', label: '서비스', href: '#header-service' }],
        searchPlaceholder: '검색어를 입력하세요',
        searchTitle: '사이트 검색',
        searchLabel: '검색',
        items: menuItems('header-mobile'),
        previousLabel: '이전 메뉴',
        closeLabel: '메뉴 닫기',
        bottomItems: [{ id: 'header-mobile-bottom', label: '사이트 안내', href: '#header-about' }],
      };
      break;
    case 'HelpPanel':
      props.open = true;
      props.tabs = helpTabs;
      props.activeTab = 'help';
      props.selectedLabel = '선택됨';
      props.helpTitle = '도움말';
      props.helpDescription = '도움말을 확인하세요.';
      props.downloadLinks = [{ label: '사용 안내서', href: '#help-guide' }];
      props.relatedGroups = [
        { title: '관련 서비스', links: [{ label: '서비스 안내', href: '#help-service' }] },
      ];
      break;
    case 'InPageNavigation':
      props.items = pageNavigationItems;
      props.actionLabel = '목차 열기';
      props.actionInfo = '전체 항목';
      props.actionCount = '2개';
      break;
    case 'LanguageSwitcher':
    case 'LanguageSwitcherPage':
      props.languages = [
        { value: 'ko', label: '한국어', href: '#language-ko', lang: 'ko' },
        { value: 'en', label: 'English', href: '#language-en', lang: 'en' },
      ];
      props.text = '새 창에서 열림';
      break;
    case 'MainMenuMobile':
      props.items = menuItems(`inventory-${slug(name)}`);
      props.menuLabel = '주 메뉴';
      props.previousLabel = '이전 메뉴';
      props.closeLabel = '메뉴 닫기';
      break;
    case 'MainMenuPc':
      props.items = menuItems(`inventory-${slug(name)}`);
      props.menuLabel = '주 메뉴';
      props['aria-label'] = '보조 주 메뉴';
      break;
    case 'Pagination':
      props.items = [1, 2, 'ellipsis', 4];
      props.previousLabel = '이전 페이지';
      props.nextLabel = '다음 페이지';
      props.message = '현재 페이지';
      break;
    case 'Resize':
      props.defaultValue = 'one';
      break;
    case 'SideNavigation':
      props.title = '서비스 메뉴';
      props.items = menuItems('side-navigation');
      break;
    case 'StepIndicator':
      props.current = 1;
      break;
    case 'Tab':
      props.id = 'vue-inventory-tab';
      props.tabs = tabItems;
      props.selected = 'one';
      break;
    case 'TextList':
    case 'TextListOrdered':
      props.items = ['첫 번째 항목', '두 번째 항목'];
      break;
    case 'TutorialPanel':
      props.open = true;
      props.tabs = [
        { id: 'tutorial', label: '튜토리얼', panelId: 'vue-tutorial-panel-one', value: 'tutorial' },
      ];
      props.activeTab = 'tutorial';
      props.tutorialTitle = '튜토리얼';
      props.tutorialBackTitle = '도움말로 돌아가기';
      props.tasks = [
        {
          title: '첫 단계',
          current: true,
          summary: '첫 단계를 확인합니다.',
          steps: ['안내를 읽습니다.'],
        },
      ];
      break;
    default:
      break;
  }
  return props;
};
const labelStructuredListActions = (vnode: unknown) => {
  if (
    typeof HTMLElement === 'undefined' ||
    !vnode ||
    typeof vnode !== 'object' ||
    !('el' in vnode) ||
    !(vnode.el instanceof HTMLElement)
  ) {
    return;
  }
  vnode.el.querySelectorAll<HTMLButtonElement>('.card-btn button').forEach((button, index) => {
    button.setAttribute('aria-label', index % 2 === 0 ? '공유' : '관심 등록');
  });
};
const labelInventorySearchInputs = (vnode: unknown) => {
  if (
    typeof HTMLElement === 'undefined' ||
    !vnode ||
    typeof vnode !== 'object' ||
    !('el' in vnode) ||
    !(vnode.el instanceof HTMLElement)
  ) {
    return;
  }
  vnode.el.querySelectorAll<HTMLInputElement>('.sch-input input').forEach((input) => {
    input.setAttribute('aria-label', '사이트 검색');
  });
};
const renderInventoryComponent = (name: string) => {
  const component = (Components as Record<string, unknown>)[name] as Component;
  const props = inventoryProps(name);
  if (name === 'Tab') {
    return h('div', { class: 'inventory-tab-example', style: 'min-width:0' }, [
      h(component, { ...props, 'aria-label': '인벤토리 탭' }),
    ]);
  }
  if (name === 'StructuredList') {
    return h(
      'div',
      { class: 'inventory-structured-list', style: 'min-width:0', onVnodeMounted: labelStructuredListActions },
      h(component, props),
    );
  }
  if (name === 'StructuredListTable') {
    return h('div', { class: 'inventory-structured-list-table', style: 'min-width:0' }, [
      h(component, props),
      h(
        'label',
        { for: 'vue-inventory-structured-list-table-service', class: 'sr-only' },
        '서비스 선택',
      ),
    ]);
  }
  if (controlledKinds.has(name)) {
    return h(
      'div',
      {
        id: `vue-inventory-${slug(name)}-controls`,
        class: 'inventory-controlled-component',
        style: 'min-width:0;max-width:100%',
      },
      h(component, props),
    );
  }
  return h(component, props);
};

const meta = { title: 'Vue/전체 컴포넌트', parameters: { layout: 'padded', a11y: { test: 'error' }, fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'] } } satisfies Meta;
export default meta;
export const Inventory: StoryObj<typeof meta> = {
  name: '전체 인벤토리',
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'],
  },
  render: () => ({
    setup() {
      return () =>
        h(
          'main',
          {
            id: 'vue-main-content',
            'aria-label': '컴포넌트 인벤토리',
            onVnodeMounted: labelInventorySearchInputs,
            style:
              'display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;overflow-x:clip',
          },
          [
            h('h1', { class: 'sr-only' }, 'Vue 컴포넌트 인벤토리'),
            h(Components.Button, { variant: 'primary' }, { default: () => '기본 계층 버튼' }),
            h(Components.Button, { variant: 'secondary' }, { default: () => '보조 계층 버튼' }),
            h(Components.Button, { variant: 'tertiary' }, { default: () => '취소 계층 버튼' }),
            h(Components.Carousel, {
              id: 'vue-carousel-contract',
              slides: contractSlides,
              actionLabel: '자세히 보기',
              previousLabel: '이전',
              nextLabel: '다음',
              moreLabel: '더 보기',
              imageLabel: '캐러셀 이미지',
            }),
            h(Components.CarouselBanner, {
              id: 'vue-carousel-banner-contract',
              slides: contractSlides,
              previousLabel: '이전',
              nextLabel: '다음',
              moreLabel: '더 보기',
              playLabel: '재생',
              stopLabel: '정지',
              imageLabel: '배너 이미지',
            }),
            h(Components.Footer, {
              id: 'krds-footer',
              logoLabel: 'KRDS Community',
              address: '서울특별시',
              relatedSites: [{ id: 'related', label: '관련 사이트' }],
              contacts: [{ title: '대표전화', description: '0000-0000' }],
              links: [{ id: 'footer-link', label: '서비스 안내', href: '#footer-link' }],
              socialLinks: [{ id: 'social', label: '소셜', href: '#social', icon: 'facebook' }],
              policyLinks: [
                { id: 'policy', label: '개인정보처리방침', href: '#policy', emphasis: true },
              ],
              copyright: '© KRDS Community',
            }),
            h(Components.Header, {
              id: 'krds-header',
              logoLabel: 'KRDS Community',
              logoHref: '#home',
              utilityItems: [{ id: 'utility', label: '이용 안내', href: '#utility', kind: 'link' }],
              desktopItems: contractNavigation,
              searchTitle: '검색',
              searchLabel: '검색',
              loginHref: '#login',
              loginLabel: '로그인',
              joinLabel: '회원가입',
              allMenuLabel: '전체 메뉴',
              menuLabel: '계약 헤더 주 메뉴',
              mobileMenu: {
                utilityItems: [{ id: 'mobile-utility', label: '이용 안내', href: '#utility' }],
                loginLabel: '로그인',
                serviceItems: [{ id: 'mobile-service', label: '서비스', href: '#service' }],
                searchPlaceholder: '검색어를 입력하세요',
                searchTitle: '사이트 검색',
                searchLabel: '검색',
                items: menuItems('contract-mobile'),
                previousLabel: '이전 메뉴',
                closeLabel: '메뉴 닫기',
                bottomItems: [{ id: 'mobile-about', label: '사이트 안내', href: '#about' }],
              },
            }),
            h(Components.Link, { href: '#vue-link-contract', label: '계층형 링크' }),
            h(Components.Masthead, {
              id: 'krds-masthead',
              message: '대한민국 공식 전자정부 누리집',
            }),
            h('div', { id: 'krds-skip-link' }, [
              h(Components.SkipLink, { href: '#vue-main-content', label: '본문 바로가기' }),
            ]),
            h(Components.Modal, {
              id: 'vue-modal-contract',
              title: '모달 제목',
              description: '모달 설명',
              open: true,
            }),
            h(Components.ModalSample, {
              id: 'vue-modal-sample-contract',
              title: '샘플 모달 제목',
              description: '샘플 모달 설명',
              open: true,
            }),
            h(Components.TextInputSize, {
              id: 'vue-text-input-size',
              label: '작은 텍스트',
              size: 'small',
              hint: '도움말',
            }),
            h(Components.TextInputState, {
              id: 'vue-text-input-state',
              label: '오류 텍스트',
              state: 'error',
              hint: '오류 안내',
            }),
            h(Components.TextInput, {
              id: 'vue-text-input-error',
              label: '오류 입력',
              hint: '오류 메시지',
              error: '오류 메시지',
              state: 'error',
            }),
            h(Components.TextInput, {
              id: 'vue-text-input-success',
              label: '성공 입력',
              hint: '사용할 수 있습니다.',
              state: 'success',
            }),
            h(Components.TextInput, {
              id: 'vue-text-input-information',
              label: '안내 입력',
              hint: '입력 안내입니다.',
              state: 'information',
            }),
            h(Components.Button, null, { default: () => '기본 버튼' }),
            h(Components.TextInput, {
              id: 'vue-text-input-default',
              label: '기본 텍스트',
              hint: '도움말',
            }),
            h(Components.Checkbox, { id: 'vue-checkbox-default', label: '체크박스', name: 'check' }),
            h(Components.Radio, {
              id: 'vue-radio-default',
              label: '라디오',
              name: 'radio',
              value: 'one',
            }),
            h(Components.Switch, { id: 'vue-switch-default', label: '스위치', name: 'switch' }),
            h(Components.Checkbox, {
              id: 'vue-checkbox-large',
              label: '큰 체크박스',
              name: 'check-large',
              size: 'large',
            }),
            h(Components.Radio, {
              id: 'vue-radio-large',
              label: '큰 라디오',
              name: 'radio-large',
              value: 'large',
              size: 'large',
            }),
            h(Components.Switch, {
              id: 'vue-switch-large',
              label: '큰 스위치',
              name: 'switch-large',
              size: 'large',
            }),
            h('h3', { class: 'sr-only' }, '추가 컴포넌트'),
            h('h4', { class: 'sr-only' }, '추가 컴포넌트 예시'),
            h(Components.AccordionLine, {
              id: 'vue-accordion-line',
              items: [{ id: 'line', title: '라인 아코디언', content: '라인 내용' }],
            }),
            h(Components.Accordion, {
              id: 'vue-accordion-default',
              items: [{ id: 'one', title: '아코디언', content: '내용' }],
            }),
            h('div', { class: 'krds-form-chip' }, [
              h(Components.RadioChip, {
                id: 'vue-radio-chip',
                label: '라디오 칩',
                name: 'vue-radio-chip',
                value: 'one',
                'aria-label': '라디오 칩',
              }),
            ]),
            h('div', { class: 'krds-table-wrap' }, [
              h(Components.StructuredListTable, {
                id: 'vue-structured-list-table',
                caption: '서비스 목록',
                columns: common.columns,
                rows: [{ id: 'vue-service', name: '서비스', status: '운영 중' }],
              }),
              h(
                'label',
                { for: 'vue-structured-list-table-vue-service', class: 'sr-only' },
                '서비스 선택',
              ),
            ]),
            h('div', { class: 'krds-table-wrap' }, [
              h(Components.Table, {
                id: 'vue-table',
                caption: '서비스 현황',
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
