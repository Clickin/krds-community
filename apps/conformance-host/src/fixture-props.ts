import type { FixtureDefinition } from './protocol';
const selectOptions = ['항목1', '항목2', '항목3', '항목4'].map((label) => ({
  value: '',
  label,
}));
const languages = [
  { value: 'ko', label: '한국어', href: '#', lang: 'ko' },
  { value: 'en', label: 'English (영어)', href: '#', lang: 'en' },
  { value: 'zh', label: '中文 (중국어)', href: '#', lang: 'zh' },
  { value: 'ja', label: '日本語 (일본어)', href: '#', lang: 'ja' },
  { value: 'fr', label: 'français (프랑스어)', href: '#', lang: 'fr' },
];
export const baseProps = (definition: FixtureDefinition): Record<string, unknown> => {
  const componentId = definition.componentId;
  let defaults: Record<string, unknown> = {};
  if (componentId === 'button') {
    const variant = String(definition.props.variant ?? 'primary');
    defaults = { children: `버튼 : ${variant}` };
  } else if (componentId === 'button-hierarchy') {
    defaults = { variant: 'primary', children: '버튼 : primary' };
  } else if (componentId === 'button-size') {
    defaults = { size: 'xsmall', children: 'x-small 버튼' };
  } else if (componentId === 'button-text') {
    defaults = { className: 'small', children: '텍스트 버튼' };
  } else if (componentId === 'button-with-icon') {
    defaults = { className: 'xsmall', children: 'x-small 버튼' };
  } else if (componentId === 'button-icon') {
    defaults = { label: '검색', size: undefined };
  } else if (componentId === 'link') {
    defaults = {
      href: 'https://www.site_name.com/',
      label: '기본 링크',
      children: '기본 링크',
      external: true,
      target: '_blank',
      size: 'small',
      title: '새 창 열림',
    };
  } else if (componentId === 'skip-link') {
    defaults = { href: '#breadcrumb', label: '본문 바로가기', children: '본문 바로가기' };
  } else if (componentId === 'accordion' || componentId === 'accordion-line') {
    defaults = {
      items: [
        { id: 'one', title: '아코디언 타이틀 영역', content: '아코디언 내용 영역' },
        { id: 'two', title: '아코디언 타이틀 영역', content: '아코디언 내용 영역' },
      ],
    };
  } else if (componentId === 'checkbox') {
    const large = definition.id.endsWith('.large');
    defaults = large
      ? { label: '사이즈 : large' }
      : { label: '기본', name: 'chk_1' };
  } else if (componentId === 'checkbox-chip') {
    defaults = { label: 'chip 상태 : default' };
  } else if (componentId === 'checkbox-size') {
    defaults = { label: '사이즈 : large', size: 'large' };
  } else if (componentId === 'radio') {
    const large = definition.id.endsWith('.large');
    defaults = {
      label: large ? '사이즈 : large' : '기본',
      name: large ? 'rdo_2-1' : 'rdo_1',
      value: undefined,
    };
  } else if (componentId === 'radio-button') {
    defaults = { label: '기본', name: 'rdo_1', value: undefined };
  } else if (componentId === 'radio-chip') {
    defaults = { label: 'chip 상태 : default ', name: 'rdo_chip', value: undefined };
  } else if (componentId === 'radio-size') {
    defaults = {
      label: '사이즈 : medium',
      name: 'rdo_2-1',
      value: undefined,
      size: 'medium',
    };
  } else if (componentId === 'toggle-switch-size') {
    defaults = { label: 'switch size : large', size: 'large' };
  } else if (['switch', 'toggle-switch'].includes(componentId)) {
    defaults = {
      label: definition.id.endsWith('.large') ? 'switch size : large' : 'switch : default',
    };
  } else if (componentId === 'text-input-icon') {
    defaults = {
      label: '레이블',
      type: 'password',
      value: '1234567890',
      placeholder: '8-12자의 영문자, 숫자, 특수문자 조합',
    };
  } else if (componentId === 'text-input') {
    const state = String(definition.props.state ?? 'default');
    const messages: Record<string, string> = {
      default: '도움말',
      error: '에러 메시지',
      success: '성공 메시지',
      information: '정보 메시지',
    };
    const values: Record<string, string | undefined> = {
      default: undefined,
      error: '에러',
      success: '성공',
      information: '정보',
    };
    defaults = {
      label: '레이블',
      hint: messages[state],
      placeholder: '플레이스홀더',
      type: 'text',
      value: values[state],
    };
  } else if (componentId === 'text-input-size') {
    defaults = {
      label: '레이블',
      hint: '도움말',
      placeholder: '플레이스홀더',
      size: 'small',
      type: 'text',
    };
  } else if (componentId === 'text-input-state') {
    defaults = {
      label: '레이블',
      error: '에러 메시지',
      hint: '에러 메시지',
      placeholder: '플레이스홀더',
      state: 'error',
      type: 'text',
      value: '에러',
    };
  } else if (componentId === 'textarea') {
    defaults = { label: '레이블', hint: '도움말', placeholder: '플레이스홀더' };
  } else if (componentId === 'select-size') {
    defaults = {
      label: '레이블',
      hint: '도움말',
      title: '선택',
      size: 'large',
      options: ['large', 'medium', 'small'].map((label) => ({ value: '', label })),
    };
  } else if (componentId === 'select-state') {
    defaults = {
      label: '레이블',
      hint: '도움말',
      title: '선택',
      state: 'error',
      options: selectOptions,
    };
  } else if (componentId === 'resize') {
    defaults = {
      label: '화면크기',
      selected: 'md',
      defaultValue: 'md',
      selectedLabel: '선택됨',
      resetLabel: '초기화',
      options: [
        { value: 'sm', label: '작게' },
        { value: 'md', label: '보통' },
        { value: 'lg', label: '조금 크게' },
        { value: 'xlg', label: '크게' },
        { value: 'xxlg', label: '가장크게' },
      ],
    };
  } else if (componentId === 'select-sorting') {
    defaults = {
      title: '선택',
      options: selectOptions,
    };
  } else if (componentId === 'select') {
    defaults = {
      label: '레이블',
      hint: '도움말',
      title: '선택',
      options: selectOptions,
    };
  } else if (['calendar', 'date-input', 'calendar-range'].includes(componentId)) {
    const common = {
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
    if (componentId === 'calendar') {
      defaults = {
        ...common,
        label: '레이블',
        hint: '도움말',
        displayYear: 2002,
        displayMonth: 12,
        selectedYear: 2002,
        selectedMonth: 12,
        year: 2002,
        month: 12,
        disabledMonths: [2],
        rangeStartDay: 7,
        rangeEndDay: 7,
        todayDay: 30,
        eventDays: [8],
        disabledDays: [13],
      };
    } else if (componentId === 'date-input') {
      defaults = {
        ...common,
        label: '레이블',
        hint: '도움말',
        displayYear: 2002,
        displayMonth: 12,
        selectedYear: 2002,
        selectedMonth: 12,
        year: 2002,
        month: 12,
        disabledMonths: [1],
        rangeStartDay: 7,
        rangeEndDay: 16,
        todayDay: 25,
        eventDays: [26],
      };
    } else {
      defaults = {
        ...common,
        label: '기간 선택',
        displayYear: 2011,
        displayMonth: 2,
        selectedYear: 2011,
        selectedMonth: 2,
        year: 2011,
        month: 2,
        disabledMonths: [1],
        rangeStartDay: 7,
        rangeEndDay: 16,
        todayDay: 20,
        eventDays: [6],
      };
    }
  } else if (componentId === 'breadcrumb') {
    defaults = {
      items: [
        { id: 'home', label: '홈', href: '#' },
        { id: 'service', label: '서비스 신청', href: '#' },
        { id: 'service-2', label: '서비스 신청2', href: '#' },
      ],
    };
  } else if (componentId === 'side-navigation') {
    defaults = {
      title: '1Depth-title',
      items: Array.from({ length: 3 }, (_, topIndex) => ({
        id: `depth-2-${topIndex + 1}`,
        label: '2Depth-menu',
        children: [
          {
            id: `depth-3-menu-${topIndex + 1}`,
            label: '3Depth-menu',
            description: '3Depth-title',
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
      })),
    };
  } else if (componentId === 'main-menu-pc') {
    const banner = { badge: '신규 서비스', label: '메뉴명' };
    const lastDepth = (count: number) =>
      Array.from({ length: count }, (_, index) => ({
        id: `last-${index + 1}`,
        label: 'Last depth',
        href: index === 0 ? '#' : undefined,
      }));
    defaults = {
      sample: true,
      items: [
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
              children: lastDepth(2),
              banner,
            },
            {
              id: 'desktop-depth-1-2',
              label: '2Depth',
              title: '2Depth title',
              titleHref: '#',
              titleLinkLabel: '바로가기',
              children: lastDepth(3),
              banner,
            },
            {
              id: 'desktop-depth-1-3',
              label: '2Depth',
              title: '2Depth title',
              children: lastDepth(3),
              banner,
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
              banner,
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
              banner,
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
          children: lastDepth(10).map((item) => ({ ...item, href: '#' })),
          banner,
        },
        { id: 'desktop-link-anchor', label: '링크(anchor)', href: '#' },
        { id: 'desktop-link-button', label: '링크(button)', button: true },
      ],
    };
  } else if (componentId === 'main-menu-mobile') {
    const mobileItems = Array.from({ length: 5 }, (_, index) => ({
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
    defaults = {
      sample: true,
      style: { display: 'block', position: 'static', visibility: 'visible' },
      utilityItems: Array.from({ length: 2 }, (_, index) => ({
        id: `utility-${index + 1}`,
        label: '메뉴명',
      })),
      loginLabel: '로그인을 해주세요',
      serviceItems: Array.from({ length: 4 }, (_, index) => ({
        id: `service-${index + 1}`,
        label: '메뉴명',
        href: '#',
      })),
      searchPlaceholder: '찾고자 하는 메뉴명을 입력해 주세요',
      searchTitle: '찾고자 하는 메뉴명 입력',
      searchLabel: '검색',
      items: mobileItems,
      previousLabel: '이전화면',
      closeLabel: '전체메뉴 닫기',
      bottomItems: [
        { label: '메뉴명', href: '#' },
        { label: '메뉴명', href: '#', target: '_blank', title: '새 창 열기' },
      ],
    };
  } else if (componentId === 'in-page-navigation') {
    defaults = {
      title: '이 페이지의 구성',
      pageTitle: '장애아동수당',
      actionLabel: '온라인 신청하기',
      actionInfo: '장애아동수당 외',
      actionCount: '1건',
      items: [
        { id: 'section_01', label: '서비스 개요', href: '#section_01', current: true },
        { id: 'section_02', label: '서비스 상세', href: '#section_02' },
        { id: 'section_03', label: '신청 방법 및 절차', href: '#section_03' },
        { id: 'section_04', label: '제출 서류', href: '#section_04' },
        {
          id: 'section_05',
          label: '함께 신청할 수 있는 서비스',
          href: '#section_05',
        },
        { id: 'section_06', label: '부가정보', href: '#section_06' },
        { id: 'section_07', label: '정보 변경 내역', href: '#section_07' },
      ],
    };
  } else if (componentId === 'header') {
    const banner = { badge: '신규 서비스', label: '메뉴명' };
    const desktopItems = [
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
            banner,
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
            banner,
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
            banner,
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
            banner,
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
        banner,
      },
      { id: 'header-link-anchor', label: '링크(anchor)', href: '#' },
      { id: 'header-link-button', label: '링크(anchor)', button: true },
    ];
    const mobileItems = Array.from({ length: 5 }, (_, index) => ({
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
    defaults = {
      utilityItems: [
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
            title: '새 창 열림',
            className: 'ico-go',
          })),
        },
      ],
      menuLabel: '메인 메뉴',
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
      desktopItems,
      nav: desktopItems,
      mobileMenu: {
        utilityItems: Array.from({ length: 2 }, (_, index) => ({
          id: `mobile-utility-${index + 1}`,
          label: '메뉴명',
        })),
        loginLabel: '로그인을 해주세요',
        serviceItems: Array.from({ length: 4 }, (_, index) => ({
          id: `mobile-service-${index + 1}`,
          label: '메뉴명',
          href: '#',
        })),
        searchPlaceholder: '찾고자 하는 메뉴명을 입력해 주세요',
        searchTitle: '찾고자 하는 메뉴명 입력',
        searchLabel: '검색',
        items: mobileItems,
        previousLabel: '이전화면',
        closeLabel: '전체메뉴 닫기',
        bottomItems: [
          { label: '메뉴명', href: '#' },
          { label: '메뉴명', href: '#', target: '_blank', title: '새 창 열기' },
        ],
      },
      title: '서비스명',
      links: desktopItems,
    };
  } else if (componentId === 'footer') {
    defaults = {
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
      links: ['찾아오시는 길', '이용안내', '직원검색'].map((label) => ({
        label,
        href: '#',
      })),
      socialLinks: [
        { label: '인스타그램', icon: 'instagram' },
        { label: '유튜브', icon: 'youtube' },
        { label: 'X', icon: 'sns-x' },
        { label: '페이스북', icon: 'facebook' },
        { label: '블로그', icon: 'blog' },
      ].map((item) => ({
        ...item,
        href: '#',
        target: '_blank',
        title: '새 창 열기',
      })),
      policyLinks: [
        { label: '개인정보처리방침', href: '#', emphasis: true },
        { label: '저작권 정책', href: '#' },
        { label: '웹 접근성 품질인증 마크 획득', href: '#' },
      ],
      copyright: '© 2023 National Health Insurance Service. All rights reserved.',
      organization: 'KRDS - Korea Design System',
      description: '이 누리집은 보건복지부 누리집입니다.',
    };
  } else if (componentId === 'identifier') {
    defaults = {
      organization: 'KRDS - Korea Design System',
      description: '이 누리집은 보건복지부 누리집입니다.',
    };
  } else if (componentId === 'carousel') {
    defaults = {
      slides: Array.from({ length: 4 }, (_, index) => ({
        id: String(index + 1),
        title: '타이틀 영역',
        description: '컨텐츠 영역 컨텐츠 영역',
        href: '#',
      })),
      previousLabel: '이전',
      nextLabel: '다음',
      moreLabel: '더 보기',
      imageLabel: '예시',
      actionLabel: '버튼 영역',
    };
  } else if (componentId === 'carousel-banner') {
    defaults = {
      slides: [
        { id: 'one', title: '타이틀', description: '서브타이틀' },
        { id: 'two', title: '타이틀', description: '서브타이틀' },
      ],
      previousLabel: '이전',
      nextLabel: '다음',
      moreLabel: '더 보기',
      imageLabel: '예시',
      playLabel: '슬라이드 재생',
      stopLabel: '슬라이드 멈춤',
    };
  } else if (componentId === 'critical-alerts') {
    defaults = {
      items: [
        {
          id: 'danger',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'danger',
          tone: 'danger',
          badgeLabel: '긴급',
          linkLabel: '자세히 보기',
        },
        {
          id: 'ok',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'ok',
          tone: 'ok',
          badgeLabel: '안전',
          linkLabel: '자세히 보기',
        },
        {
          id: 'info',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'info',
          tone: 'info',
          badgeLabel: '안내',
          linkLabel: '자세히 보기',
        },
      ],
    };
  } else if (componentId === 'structured-list') {
    const description =
      '간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는 영역입니다. 간단한 설명이 들어가는 영역입니다.';
    defaults = {
      items: Array.from({ length: 3 }, (_, index) => ({
        id: String(index + 1),
        title: '타이틀 영역',
        description,
        href: '#',
        badge: '뱃지',
        badgeClass: ['bg-light-primary', 'bg-light-success', 'bg-secondary'][index],
      })),
      dateLabel: '신청 기간',
      dateValue: '2023.00.00-2024.00.00',
      tags: ['태그', '태그'],
      actionLabel: '신청하기',
      shareLabel: '공유하기',
      favoriteLabel: '찜하기',
    };
  } else if (['text-list', 'text-list-ordered'].includes(componentId)) {
    const ordered = componentId === 'text-list-ordered';
    defaults = {
      ordered,
      items: [
        {
          id: 'level-1-1',
          label: '텍스트 목록 레벨1',
          marker: ordered ? '1. ' : undefined,
        },
        {
          id: 'level-1-2',
          label: '텍스트 목록 레벨1',
          marker: ordered ? '2. ' : undefined,
          children: [
            {
              id: 'level-2-1',
              label: '텍스트 목록 레벨2',
              marker: ordered ? 'a. ' : undefined,
            },
            {
              id: 'level-2-2',
              label: '텍스트 목록 레벨2',
              marker: ordered ? 'b. ' : undefined,
              children: [
                { id: 'level-3-1', label: '텍스트 목록 레벨3', marker: ordered ? '①' : undefined },
                { id: 'level-3-2', label: '텍스트 목록 레벨3', marker: ordered ? '②' : undefined },
              ],
            },
            {
              id: 'level-2-3',
              label: '텍스트 목록 레벨2',
              marker: ordered ? 'c. ' : undefined,
            },
          ],
        },
        {
          id: 'level-1-3',
          label: '텍스트 목록 레벨1',
          marker: ordered ? '3. ' : undefined,
        },
      ],
    };
  } else if (componentId === 'structured-list-table') {
    const caption = '000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.';
    defaults = {
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
      caption,
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
        selectionLabel: `${caption} ${index + 1} 선택`,
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
  } else if (componentId === 'table') {
    const repeatedContent = Array.from({ length: 13 }, () => '내용이 들어갑니다.').join(' ');
    defaults = {
      caption:
        '000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.',
      columns: [
        { key: 'title', label: '제목1', width: '30%' },
        { key: 'content', label: '제목2' },
      ],
      rows: [
        { title: '제목1-1', content: repeatedContent },
        { title: '제목1-2', content: '내용이 들어갑니다.' },
        {
          title: '제목1-3',
          content: Array.from({ length: 4 }, () => '내용이 들어갑니다.').join(' '),
        },
      ],
    };
  } else if (componentId === 'tab') {
    defaults = {
      tabs: [
        { id: 'login_01', label: '타이틀 1' },
        { id: 'login_02', label: '타이틀 2' },
      ],
      panels: { login_01: '탭 1 영역', login_02: '탭 2 영역' },
      defaultValue: 'login_01',
      message: '선택됨',
      panelTitle: '탭 영역 타이틀',
    };
  } else if (componentId === 'spinner') {
    defaults = { label: '로딩 중' };
  } else if (componentId === 'step-indicator') {
    defaults = {
      current: 3,
      label: '단계',
      message: '현재단계',
      steps: Array.from({ length: 5 }, (_, index) => ({
        id: String(index + 1),
        label: '단계 레이블',
      })),
    };
  } else if (componentId === 'pagination') {
    defaults = {
      current: 4,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 'ellipsis', 99],
      title: '이전',
      label: '다음',
      message: '현재페이지',
      navigationLabel: '페이지 이동',
      previousDisabled: true,
      previousLabel: '이전',
      nextLabel: '다음',
    };
  } else if (['language-switcher', 'language-switcher-page'].includes(componentId)) {
    defaults = {
      languages,
      options: languages,
      selected: 'ko',
      defaultValue: 'ko',
      selectedLabel: '선택됨',
      label: '언어 변경',
      currentLabel: '현재 언어',
      externalTitle: '새 창 열림',
    };
  } else if (componentId === 'modal') {
    const sentence =
      '대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함하거나 결정이 필요하거나 여러 작업을 포함할 수 있습니다.';
    const items = ['시작', ...Array.from({ length: 21 }, () => sentence), '끝'];
    defaults = {
      title: '모달 제목',
      description: items.join(' '),
      items,
      cancelLabel: '아니요',
      confirmLabel: '예',
      closeLabel: '닫기',
    };
  } else if (componentId === 'modal-sample') {
    const description =
      '대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함하거나 결정이 필요하거나 여러 작업을 포함할 수 있습니다.';
    defaults = {
      open: true,
      title: '모달 제목',
      description,
      children: description,
      cancelLabel: '아니요',
      confirmLabel: '예',
      closeLabel: '닫기',
    };
  } else if (['help-panel', 'tutorial-panel'].includes(componentId)) {
    const helpDescription =
      '전자문서지갑에서는 전자증명서 출력기능을 제공하지 않으며, 스마트폰 화면을 캡쳐하여 사용할 수 없습니다. 다만, 발급받은 전자증명서를 열람용으로 다운로드할 수는 있습니다.';
    defaults = {
      open: true,
      activeTab: componentId === 'tutorial-panel' ? 'tutorial' : 'help',
      tabs: [
        { id: 'helperTab01', label: '도움', panelId: 'helperTabpanel01', value: 'help' },
        {
          id: 'helperTab02',
          label: '따라하기',
          panelId: 'helperTabpanel02',
          value: 'tutorial',
        },
      ],
      selectedLabel: '선택됨',
      helpTitle: '전자문서지갑',
      helpDescription,
      downloadLinks: [
        {
          label: '안드로이드 애플리케이션 다운로드',
          href: '#',
          target: '_blank',
          title: '새 창 열림',
        },
        {
          label: 'iOS애플리케이션 다운로드',
          href: '#',
          target: '_blank',
          title: '새 창 열림',
        },
      ],
      relatedGroups: [
        {
          title: '관련서비스/민원',
          links: ['영문 주민등록표등본', '영문 주민등록표초본', '주민등록표등본'].map(
            (label) => ({ label, href: '#' }),
          ),
        },
        {
          title: '기타 문의/도움말',
          links: [
            { label: '민원신청 관련 문의 전화 번호 찾기', href: '#', icon: 'call' },
            { label: '자주 묻는 질문 확인하기', href: '#', icon: 'faq' },
          ],
        },
      ],
      tutorialTitle: '이사 전 살던 곳 정보 입력하기',
      tutorialBackTitle: '이전으로 돌아가기',
      backTitle: '이전으로 돌아가기',
      externalTitle: '새 창 열림',
      tasks: [
        {
          title: 'Task 1: 이사 전에 살던 곳 주소 확인',
          current: true,
          summary: '전체 2단계',
          steps: ['단계1 : 주소조회', '단계2 : 조회 결과 확인'],
        },
        {
          title: 'Task 2: 이사 갈 가족 구성원 선택하기',
          summary: '전체 1단계',
          steps: ['단계1 : 주소조회'],
        },
      ],
      stopLabel: '그만 따라하기',
      collapseLabel: '접어두기',
      label: '도움말',
      title: '도움말',
      children: helpDescription,
    };
  } else if (componentId === 'disclosure') {
    const items = [
      '하나의 아이디로 안전하고 편리하게 여러 전자정부 서비스를 이용할 수 있는 서비스입니다.',
      '디지털원패스 이용문의 : 1533-3713 (평일9~18시, 공휴일제외)',
    ];
    defaults = { title: '신청 서비스안내', items, children: items.join(' ') };
  } else if (componentId === 'tooltip') {
    defaults = {
      label: 'tooltip-horizontal',
      message: '툴팁의 기본 설정입니다',
      children: 'tooltip-horizontal',
    };
  } else if (componentId === 'tooltip-box') {
    defaults = {
      label: 'tooltip-box',
      message:
        'tooltip-box 툴팁은 150자 내외의 텍스트만 제공되어야 합니다. 내부에 닫기 버튼을 포함한 대화형 요소를 사용하지 않습니다. 본문을 가리지 않도록 주의합니다.',
      children: 'tooltip-box',
    };
  } else if (componentId === 'tooltip-vertical') {
    defaults = {
      label: 'tooltip-vertical',
      message: 'tooltip-vertical 옵션입니다',
      children: 'tooltip-vertical',
    };
  } else if (componentId === 'tts') {
    defaults = {
      label: '레이블',
      text:
        'TTS 기능이란 화면에 표시된 주요 안내, 입력 서식 설명, 업무 진행 상태 등의 텍스트를 사용자가 요청했을 때 음성으로 읽어주는 보조적 사용자 지원 기능을 말하며, 이는 시각 정보의 대체가 아닌 보완 수단으로서 다른 접근성 기능(글자 크기 조절, 대비 향상, 쉬운모드 등)과 함께 제공되는 것을 원칙으로 한다.',
      children: '레이블',
    };
  } else if (componentId === 'tts-icon') {
    defaults = { label: '' };
  } else if (componentId === 'tts-size') {
    defaults = { size: 'xsmall', label: 'Xsmall TTS', children: ' Xsmall TTS' };
  } else if (componentId === 'file-upload') {
    const commonName = '위임장(주민등록법 시행령 별지 제15호의2호서식) [hwp, 17KB] ';
    defaults = {
      title: '타이틀영역',
      description: '컨텐츠 영역',
      prompt: '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.',
      name: 'myFile',
      inputId: 'fileu-upload',
      selectLabel: '파일선택',
      currentCount: 3,
      maxCount: 10,
      countSuffix: '개',
      files: [
        { id: 'uploading', name: commonName, status: 'uploading', statusLabel: '업로드 중' },
        { id: 'complete', name: commonName, status: 'complete', statusLabel: '업로드 완료' },
        { id: 'deletable', name: commonName, status: 'deletable', deleteLabel: '삭제' },
        {
          id: 'error',
          name: '전입재등록신고서 [주민등록법 시행령 : 별지서식 15, 15호의2호] [hwp, 17KB]',
          status: 'error',
          deleteLabel: '삭제',
          errors: [
            '등록 가능한 파일 용량을 초과하였습니다.',
            '20MB 미만의 파일만 등록할 수 있습니다.',
          ],
        },
        {
          id: 'downloadable',
          name: commonName,
          status: 'downloadable',
          downloadLabel: '다운로드',
          previewLabel: '바로보기',
        },
      ],
      deleteAllLabel: '전체 파일 삭제',
      label: '파일 첨부',
    };
  } else if (componentId === 'favicon') {
    defaults = {
      href: '/favicon-32x32.png',
      type: 'image/png',
      size: '32x32',
      sizes: '32x32',
    };
  } else if (componentId === 'masthead') {
    defaults = { message: '이 누리집은 대한민국 공식 전자정부 누리집입니다.' };
  } else if (componentId === 'coach-mark') {
    defaults = {
      title: '따라하기 가이드',
      stepTitle: '1단계 : 코치 마크',
      description: '1단계 코치 마크 내용입니다.',
      contentTitle: '코치 마크 내용',
      step: '1/4',
      currentStep: '1',
      totalSteps: '4',
      stopLabel: '그만보기',
      currentStepLabel: '현재 단계',
      totalStepsLabel: '총 단계',
      nextLabel: '다음으로',
      label: '코치 마크 내용',
      children: '코치 마크 내용',
    };
  } else if (componentId === 'contextual-help') {
    const description =
      '컴포넌트 주변에 배치되어 해당 컴포넌트의 상태나 관련된 상세 정보를 제공하는 컴포넌트이다. 맥락적 도움말은 정보 아이콘이나 도움 아이콘 버튼을 통해 사용자가 요청하는 경우에만 화면에 표시된다.';
    defaults = {
      position: 'top-left',
      label: '도움말',
      caption: '예시이미지(상단 왼쪽)',
      message: '도움말',
      title: '도움말 제목',
      description,
      children: description,
      linkLabel: '바로가기',
      href: '#;',
      closeLabel: '닫기',
    };
  } else if (componentId === 'badge') {
    defaults = { label: 'Label' };
  } else if (componentId === 'badge-number') {
    defaults = { appearance: 'solid', label: '5' };
  } else if (componentId === 'badge-size') {
    defaults = { label: 'Label', size: 'large' };
  } else if (componentId === 'tag') {
    defaults = { label: '태그', removable: true, message: '삭제' };
  } else if (componentId === 'tag-link') {
    defaults = { href: '#', label: '태그' };
  }
  return Object.fromEntries(
    Object.entries({ ...defaults, ...definition.props }).filter(([, value]) => value !== undefined),
  );
};
