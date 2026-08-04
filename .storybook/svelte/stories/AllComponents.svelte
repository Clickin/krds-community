<script lang="ts">
  import * as Components from '@krds-community/svelte';
  import { Accordion, Button, Checkbox, Radio, Switch, TextInput } from '@krds-community/svelte';
  import { ACCORDION_ITEMS, ACCORDION_ITEM_SINGLE, ACCORDION_LINE_ITEMS, BUTTON_TEXT, CHECKBOX_LABEL_DEFAULT, CHECKBOX_LABEL_LARGE, RADIO_LABEL_DEFAULT, RADIO_LABEL_LARGE, TEXT_INPUT_PROPS, MODAL_PROPS } from '../../shared/story-props';

  const names = [
    'Badge', 'BadgeNumber', 'BadgeSize', 'Breadcrumb', 'ButtonHierarchy', 'ButtonIcon', 'ButtonSize', 'ButtonText', 'ButtonWithIcon',
    'Calendar', 'CalendarRange', 'Carousel', 'CarouselBanner', 'CheckboxChip', 'CheckboxSize', 'CoachMark', 'ContextualHelp', 'CriticalAlerts',
    'DateInput', 'Disclosure', 'Favicon', 'FileUpload', 'HelpPanel', 'Identifier', 'InPageNavigation', 'LanguageSwitcher',
    'LanguageSwitcherPage', 'Link', 'MainMenuMobile', 'MainMenuPc', 'Masthead', 'Modal', 'ModalSample', 'Pagination', 'RadioButton', 'RadioChip',
    'RadioSize', 'Resize', 'Select', 'SelectSize', 'SelectSorting', 'SelectState', 'SideNavigation', 'SkipLink', 'Spinner', 'StepIndicator',
    'StructuredList', 'StructuredListTable', 'Tab', 'Table', 'Tag', 'TagLink', 'Textarea', 'TextInputIcon', 'TextInputSize', 'TextInputState',
    'TextList', 'TextListOrdered', 'ToggleSwitch', 'ToggleSwitchSize', 'Tooltip', 'TooltipBox', 'TooltipVertical', 'Tts', 'TtsIcon', 'TtsSize',
    'TutorialPanel', 'AccordionLine',
  ];
  const kindOf = (name: string) =>
    name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '');

  const navigationItems = [
    {
      id: 'one',
      label: '첫 항목',
      title: '첫 항목',
      content: '첫 항목 내용',
      children: [
        {
          id: 'one-child',
          label: '첫 하위 항목',
          title: '첫 하위 항목',
          href: '/one-child',
          children: [{ id: 'one-leaf', label: '첫 세부 항목', href: '/one-leaf' }],
        },
      ],
    },
    {
      id: 'two',
      label: '두 번째',
      title: '두 번째',
      content: '두 번째 내용',
      children: [
        {
          id: 'two-child',
          label: '두 번째 하위 항목',
          title: '두 번째 하위 항목',
          href: '/two-child',
          children: [{ id: 'two-leaf', label: '두 번째 세부 항목', href: '/two-leaf' }],
        },
      ],
    },
  ];
  const accordionLineItems = [
    { id: 'line-one', title: '라인 첫 항목', content: '라인 첫 항목 내용' },
    { id: 'line-two', title: '라인 두 번째 항목', content: '라인 두 번째 내용' },
  ];
  const accordionItem = ACCORDION_ITEM_SINGLE;
  const alertItems = [
    { id: 'alert-one', tone: 'info', badgeLabel: '안내', message: '서비스 안내입니다.', linkLabel: '자세히 보기', href: '/notice' },
    { id: 'alert-two', tone: 'warning', badgeLabel: '주의', message: '확인이 필요한 안내입니다.', linkLabel: '확인하기', href: '/notice/important' },
  ];
  const paginationItems = [
    { id: 'page-one', label: '1' },
    { id: 'page-two', label: '2' },
    { id: 'page-three', label: '3' },
  ];
  const helpTabs = [
    { id: 'svelte-help-tab', label: '도움말', panelId: 'svelte-help-panel' },
    { id: 'svelte-help-tutorial-tab', label: '튜토리얼', panelId: 'svelte-help-panel' },
  ];
  const tutorialTabs = [
    { id: 'svelte-tutorial-help-tab', label: '도움말', panelId: 'svelte-tutorial-panel' },
    { id: 'svelte-tutorial-tab', label: '튜토리얼', panelId: 'svelte-tutorial-panel' },
  ];
  const tablePagination = {
    previousDisabled: true,
    previousLabel: '이전 페이지',
    items: paginationItems,
    current: '1',
    currentLabel: '현재 페이지',
    nextLabel: '다음 페이지',
  };
  const common = {
    label: '레이블',
    title: '제목',
    description: '설명입니다.',
    hint: '도움말입니다.',
    message: '도움말입니다.',
    href: '/example',
    open: false,
    modelValue: 'one',
    current: 1,
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
    collapseLabel: '접어두기',
    resetLabel: '기본 크기',
    selectedLabel: '선택됨',
    selectLabel: '파일 선택',
    deleteAllLabel: '전체 파일 삭제',
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
    items: navigationItems,
    links: [
      { id: 'home', label: '홈', href: '/' },
      { id: 'guide', label: '가이드', href: '/guide' },
    ],
    slides: [
      { id: 'slide-one', title: '첫 슬라이드', description: '캐러셀 내용', href: '/slides/one' },
      { id: 'slide-two', title: '두 번째 슬라이드', description: '두 번째 캐러셀 내용', href: '/slides/two' },
    ],
    steps: [
      { id: 'step-one', label: '첫 단계' },
      { id: 'step-two', label: '두 번째 단계' },
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
      { id: 'one', label: '첫 탭' },
      { id: 'two', label: '두 번째 탭' },
    ],
    panels: { one: '첫 패널', two: '두 번째 패널' },
    stepTitle: '1단계 안내',
    contentTitle: '코치 마크 내용',
    step: '1/2',
    currentStep: '1',
    totalSteps: '2',
    organization: '조직 내비게이션',
    logoLabel: 'KRDS Community',
    logoHref: '/',
    address: '서울특별시',
    copyright: '© KRDS Community',
    linkLabel: '자세히 보기',
    prompt: '업로드할 파일을 선택하세요.',
    currentCount: 1,
    maxCount: 3,
    countLabel: '표시 개수',
    countOptions: ['10개', '20개'],
    selectAllLabel: '전체 선택',
    sortLabel: '정렬 기준',
    sortOptions: ['관련도순', '최신순'],
    sortValue: '관련도순',
    actions: [{ label: '선택 삭제', icon: 'delete' }],
    pagination: tablePagination,
    utilityItems: [
      { id: 'utility-guide', kind: 'link', label: '이용 안내', href: '/guide' },
      {
        id: 'utility-size',
        kind: 'resize',
        label: '글자 크기',
        resetLabel: '기본 크기',
        items: [{ value: 'sm', label: '작게' }, { value: 'md', label: '보통' }],
      },
    ],
    serviceItems: [
      { id: 'service-home', label: '서비스 홈', href: '/' },
      { id: 'service-guide', label: '서비스 안내', href: '/guide' },
    ],
    bottomItems: [
      { id: 'bottom-help', label: '도움말', href: '/help' },
      { id: 'bottom-contact', label: '문의하기', href: '/contact' },
    ],
    desktopItems: navigationItems,
    mobileMenu: {
      closeLabel: '모바일 메뉴 닫기',
      loginLabel: '로그인',
      searchTitle: '메뉴 검색',
      searchPlaceholder: '메뉴 검색어',
      searchLabel: '검색',
      utilityItems: [{ id: 'mobile-guide', label: '이용 안내' }],
      serviceItems: [{ id: 'mobile-home', label: '서비스 홈', href: '/' }],
      bottomItems: [{ id: 'mobile-help', label: '도움말', href: '/help' }],
      items: navigationItems,
    },
    myMenu: {
      label: '내 메뉴',
      userName: '홍길동',
      timeLabel: '남은 시간',
      time: '30분',
      extendLabel: '연장',
      items: [{ id: 'my-profile', label: '내 정보', href: '/profile' }],
      logoutLabel: '로그아웃',
    },
    searchTitle: '검색',
    searchPlaceholder: '검색어를 입력하세요',
    searchLabel: '검색',
    loginHref: '/login',
    loginLabel: '로그인',
    joinLabel: '회원가입',
    allMenuLabel: '전체 메뉴',
    menuLabel: '주 메뉴',
    helpTitle: '도움말 제목',
    helpDescription: '도움말 내용입니다.',
    tutorialTitle: '튜토리얼 제목',
    tasks: [{ title: '첫 단계', label: '진행하기', steps: [{ label: '안내 읽기' }] }],
  };

  const propsFor = (name: string) => {
    if (name === 'AccordionLine') return { ...common, items: accordionLineItems };
    if (name === 'CriticalAlerts') return { ...common, items: alertItems };
    if (name === 'HelpPanel') return { ...common, open: true, tabs: helpTabs, activeTab: 'help' };
    if (name === 'TutorialPanel') return { ...common, open: true, tabs: tutorialTabs, activeTab: 'tutorial' };
    if (name === 'Pagination') return { ...common, items: paginationItems, current: 2 };
    if (name === 'StructuredListTable') return { ...common };
    if (name === 'TtsIcon') return { ...common, 'aria-label': '아이콘 읽기' };
    return common;
  };
</script>

<main
  aria-label="컴포넌트 인벤토리"
  style="display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;width:100%;max-width:45rem;min-width:0;box-sizing:border-box"
>
  <Button>기본 버튼</Button>
  <Button variant="primary">기본 계층 버튼</Button>
  <Button variant="secondary">보조 계층 버튼</Button>
  <Button variant="tertiary">취소 계층 버튼</Button>
  <TextInput label={TEXT_INPUT_PROPS.label} hint="도움말" />
  <TextInput id="svelte-text-input-error" label="오류 입력" hint="오류 메시지" state="error" />
  <TextInput id="svelte-text-input-success" label="성공 입력" hint="사용할 수 있습니다." state="success" />
  <TextInput id="svelte-text-input-information" label="안내 입력" hint="입력 안내입니다." state="information" />
  <Checkbox label={CHECKBOX_LABEL_DEFAULT} name="check" />
  <Checkbox label={CHECKBOX_LABEL_LARGE} name="check-large" size="large" />
  <Radio label={RADIO_LABEL_DEFAULT} name="radio" value="one" />
  <Radio label={RADIO_LABEL_LARGE} name="radio-large" value="large" size="large" />
  <Switch label="스위치" name="switch" />
  <Switch label="큰 스위치" name="switch-large" size="large" />
  <Accordion items={[accordionItem]} />
  <svelte:component this={Components.AccordionLine} kind="accordion-line" items={accordionLineItems} />
  <svelte:component
    this={Components.Carousel}
    kind="carousel"
    slides={common.slides}
    actionLabel="자세히 보기"
    previousLabel="이전"
    nextLabel="다음"
    moreLabel="더 보기"
    imageLabel="캐러셀 이미지"
  />
  <svelte:component
    this={Components.CarouselBanner}
    kind="carousel-banner"
    slides={common.slides}
    previousLabel="이전"
    nextLabel="다음"
    moreLabel="더 보기"
    playLabel="재생"
    stopLabel="정지"
    imageLabel="배너 이미지"
  />
  <svelte:component
    this={Components.Footer}
    kind="footer"
    id="krds-footer"
    logoLabel={common.logoLabel}
    logoHref={common.logoHref}
    address={common.address}
    organization={common.organization}
    links={common.links}
    policyLinks={common.links}
    copyright={common.copyright}
  />
  <svelte:component
    this={Components.Header}
    kind="header"
    id="krds-header"
    logoLabel={common.logoLabel}
    logoHref={common.logoHref}
    desktopItems={common.desktopItems}
    mobileMenu={common.mobileMenu}
    utilityItems={common.utilityItems}
    myMenu={common.myMenu}
    searchTitle={common.searchTitle}
    searchPlaceholder={common.searchPlaceholder}
    searchLabel={common.searchLabel}
    loginHref={common.loginHref}
    loginLabel={common.loginLabel}
    joinLabel={common.joinLabel}
    allMenuLabel={common.allMenuLabel}
    menuLabel={common.menuLabel}
  />
  <svelte:component this={Components.Link} kind="link" href="/svelte-link-contract" label="계층형 링크" />
  <svelte:component this={Components.Masthead} kind="masthead" id="krds-masthead" message="대한민국 공식 전자정부 누리집" />
  <div id="krds-skip-link">
    <svelte:component this={Components.SkipLink} kind="skip-link" href="#svelte-main-content" label="본문 바로가기" />
  </div>
  <div id="svelte-main-content" tabindex="-1"></div>
  <div class="krds-form-chip">
    <svelte:component this={Components.RadioChip} kind="radio-chip" label="라디오 칩" name="svelte-radio-chip" value="one" />
  </div>
  <div class="krds-table-wrap">
    <svelte:component
      this={Components.StructuredListTable}
      kind="structured-list-table"
      {...common}
      columns={common.columns}
      rows={[{ id: 'svelte-service', name: '서비스', status: '운영 중' }]}
    />
  </div>
  <div class="krds-table-wrap">
    <svelte:component this={Components.Table} kind="table" {...common} columns={common.columns} rows={common.rows} />
  </div>
  <svelte:component this={Components.Modal} kind="modal" open={false} role="dialog" title={MODAL_PROPS.title} description="모달 설명" cancelLabel="취소" confirmLabel="확인" closeLabel="닫기" />
  <svelte:component this={Components.ModalSample} kind="modal-sample" open={false} role="dialog" title="샘플 모달 제목" description="샘플 모달 설명" cancelLabel="취소" confirmLabel="확인" closeLabel="닫기" />
  {#each names as name}
    {@const Component = Components[name as keyof typeof Components] as any}
    <svelte:component this={Component} kind={kindOf(name)} {...propsFor(name)} label={name} title={name} />
  {/each}
</main>
