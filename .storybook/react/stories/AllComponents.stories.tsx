import type { Meta, StoryObj } from '@storybook/react-vite';
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

const links = [
  { id: 'home', label: '홈', href: '/' },
  { id: 'guide', label: '가이드', href: '#guide' },
];
const options = [
  { value: 'one', label: '첫 번째' },
  { value: 'two', label: '두 번째' },
];
const headerMobileItems = [
  { id: 'header-home', label: '홈', href: '/' },
  { id: 'header-guide', label: '가이드', href: '#guide' },
];
const mobileItems = [
  { id: 'mobile-home', label: '홈', href: '/' },
  { id: 'mobile-guide', label: '가이드', href: '#guide' },
];
const languages = [
  { value: 'ko', label: '한국어', href: '#language-ko', lang: 'ko' },
  { value: 'en', label: 'English', href: '#language-en', lang: 'en' },
];
const resizeOptions = [
  { value: 'default', label: '기본' },
  { value: 'large', label: '크게' },
  { value: 'largest', label: '가장 크게' },
];
const slides = [
  {
    id: 'one',
    title: '첫 번째 카드',
    description: '캐러셀 콘텐츠입니다.',
    href: '#slide-one',
  },
  { id: 'two', title: '두 번째 카드', description: '두 번째 카드 설명입니다.', href: '#slide-two' },
];
const items = [
  { id: 'one', title: '첫 번째 항목', description: '항목 설명입니다.', href: '#item-one' },
  { id: 'two', title: '두 번째 항목', description: '두 번째 항목 설명입니다.', href: '#item-two' },
];
const columns = [
  { key: 'name', label: '이름' },
  { key: 'status', label: '상태' },
];
const rows = [
  { id: 'service', name: '서비스', status: '운영 중' },
  { id: 'docs', name: '문서', status: '검토 중' },
];
const inventoryTabs = [
  { id: 'overview', tabId: 'inventory-tab-overview', panelId: 'inventory-panel-overview', label: '개요' },
  { id: 'details', tabId: 'inventory-tab-details', panelId: 'inventory-panel-details', label: '상세' },
];
const helpTabs = [
  { id: 'help', value: 'help', label: '도움말', panelId: 'inventory-help-panel' },
  { id: 'tutorial', value: 'tutorial', label: '튜토리얼', panelId: 'inventory-help-tutorial' },
];
const tutorialTabs = [
  { id: 'tutorial-help', value: 'help', label: '도움말', panelId: 'inventory-tutorial-help' },
  { id: 'tutorial-guide', value: 'tutorial', label: '튜토리얼', panelId: 'inventory-tutorial-panel' },
];
const sideNavigationItems = [
  {
    id: 'service',
    label: '서비스',
    children: [{ id: 'service-overview', label: '서비스 소개', href: '#service-overview' }],
  },
  {
    id: 'guide',
    label: '가이드',
    children: [{ id: 'guide-start', label: '시작하기', href: '#guide-start' }],
  },
];

const meta = { title: 'React/전체 컴포넌트', parameters: { layout: 'padded', a11y: { test: 'error' }, fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'] } } satisfies Meta;
export default meta;

export const Inventory: StoryObj<typeof meta> = {
  name: '전체 인벤토리',
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'],
  },
  render: () => (
    <main
      id="main-content"
      aria-label="컴포넌트 인벤토리"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '1rem',
        width: '100%',
        maxWidth: 720,
        minWidth: 0,
        overflowX: 'hidden',
      }}
    >
      <Favicon href="/favicon.svg" />
      <Masthead message="대한민국 공식 전자정부 누리집입니다." />
      <Header
        logoLabel="KRDS Community"
        logoHref="/"
        nav={links}
        menuLabel="헤더 주 메뉴"
        searchLabel="검색"
        searchTitle="사이트 검색"
        loginLabel="로그인"
        loginHref="#login"
        joinLabel="회원가입"
        allMenuLabel="전체 메뉴"
        mobileMenu={{
          id: 'inventory-header-mobile',
          searchPlaceholder: '검색어를 입력하세요',
          searchTitle: '모바일 검색',
          searchLabel: '검색',
          loginLabel: '로그인',
          items: headerMobileItems,
          previousLabel: '이전',
          closeLabel: '닫기',
        }}
      />
      <Identifier organization="KRDS Community" description="디지털 서비스 디자인 시스템" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        <Badge label="배지" />
        <BadgeNumber label="3" />
        <BadgeSize label="중요" size="large" />
        <Tag label="태그" />
        <TagLink label="태그 링크" href="#tag" />
      </div>
      <Breadcrumb items={links} label="현재 경로" />
      <div id="krds-skip-link">
        <SkipLink href="#main-content" />
      </div>
      <MainMenuPc
        items={links}
        menuLabel="보조 주 메뉴"
        aria-label="보조 주 메뉴"
      />
      <MainMenuMobile
        id="inventory-mobile-menu"
        items={mobileItems}
        aria-label="모바일 메뉴"
        loginLabel="로그인"
        searchPlaceholder="검색어를 입력하세요"
        searchTitle="모바일 메뉴 검색"
        searchLabel="검색"
        previousLabel="이전"
        closeLabel="닫기"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        <Button variant="primary">기본 계층 버튼</Button>
        <Button variant="secondary">보조 계층 버튼</Button>
        <Button variant="tertiary">취소 계층 버튼</Button>
        <Button>버튼</Button>
        <ButtonHierarchy>계층 버튼</ButtonHierarchy>
        <ButtonIcon label="검색" />
        <ButtonSize size="small">작은 버튼</ButtonSize>
        <ButtonText>텍스트 버튼</ButtonText>
        <ButtonWithIcon>다음</ButtonWithIcon>
        <Link href="#link">링크</Link>
      </div>
      <h2 className="sr-only">상호작용 컴포넌트</h2>
      <h3 className="sr-only">확장 가능한 콘텐츠</h3>
      <h4 className="sr-only">아코디언 예시</h4>
      <Accordion
        items={[{ id: 'one', title: '아코디언', content: '내용입니다.' }]}
      />
      <AccordionLine
        items={[{ id: 'line', title: '라인 아코디언', content: '라인 내용입니다.' }]}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
        <Checkbox id="inventory-checkbox" label="체크박스" name="check" />
        <Checkbox
          id="inventory-checkbox-large"
          label="큰 체크박스"
          name="check-large"
          size="large"
        />
        <CheckboxChip id="inventory-checkbox-chip" label="체크 칩" name="chip" />
        <CheckboxSize id="inventory-checkbox-size" label="큰 체크" size="large" />
        <Radio id="inventory-radio" label="라디오" name="radio" value="one" />
        <RadioButton
          id="inventory-radio-button"
          label="라디오 버튼"
          name="radio2"
          value="one"
        />
        <Radio
          id="inventory-radio-large"
          label="큰 라디오"
          name="radio-large"
          value="large"
          size="large"
        />
        <div className="krds-form-chip">
          <RadioChip id="inventory-radio-chip" label="라디오 칩" name="radio3" value="one" />
        </div>
        <RadioSize
          id="inventory-radio-size"
          label="큰 라디오 칩"
          name="radio4"
          value="one"
        />
        <Switch id="inventory-switch" label="스위치" name="switch" />
        <ToggleSwitch id="inventory-toggle" label="토글" name="toggle" />
        <Switch
          id="inventory-switch-large"
          label="큰 스위치"
          name="switch-large"
          size="large"
        />
        <ToggleSwitchSize
          id="inventory-toggle-size"
          label="큰 토글"
          size="large"
          name="toggle2"
        />
      </div>
      <Calendar
        id="inventory-calendar"
        label="날짜"
        calendarLabel="날짜 달력"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        yearSelectLabel="연도 선택"
        monthSelectLabel="월 선택"
        weekdays={['일', '월', '화', '수', '목', '금', '토']}
        years={[2025, 2026]}
        todayDay={15}
        todayLabel="오늘"
        eventDays={[10]}
        eventLabel="일정 있음"
        cancelLabel="취소"
        confirmLabel="확인"
      />
      <DateInput
        id="inventory-date-input"
        label="날짜 입력"
        calendarLabel="날짜 입력 달력"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        yearSelectLabel="연도 선택"
        monthSelectLabel="월 선택"
        weekdays={['일', '월', '화', '수', '목', '금', '토']}
        todayDay={15}
        todayLabel="오늘"
        cancelLabel="취소"
        confirmLabel="확인"
      />
      <CalendarRange
        id="inventory-calendar-range"
        label="기간"
        calendarLabel="기간 달력"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        yearSelectLabel="연도 선택"
        monthSelectLabel="월 선택"
        weekdays={['일', '월', '화', '수', '목', '금', '토']}
        defaultStart="2026.07.10"
        defaultEnd="2026.07.15"
        rangeStartDay={10}
        rangeEndDay={15}
        todayDay={15}
        todayLabel="오늘"
        cancelLabel="취소"
        confirmLabel="확인"
      />
      <TextInput id="inventory-text" label="텍스트" hint="도움말" />
      <TextInputSize id="inventory-text-small" label="작은 텍스트" size="small" />
      <TextInputState
        id="inventory-text-error"
        label="오류 텍스트"
        state="error"
        hint="오류 안내"
      />
      <TextInput
        id="inventory-text-success"
        label="성공 텍스트"
        state="success"
        hint="사용할 수 있습니다."
      />
      <TextInput
        id="inventory-text-information"
        label="안내 텍스트"
        state="information"
        hint="입력 안내입니다."
      />
      <TextInputIcon id="inventory-text-icon" label="아이콘 텍스트" hint="아이콘 입력 안내" />
      <Textarea id="inventory-textarea" label="긴 텍스트" hint="100자 이내로 입력하세요." />
      <FileUpload
        inputId="inventory-file-upload"
        title="파일 업로드"
        description="필요한 파일을 선택하세요."
        prompt="파일을 첨부하세요."
        selectLabel="파일 선택"
        currentCount={1}
        maxCount={3}
        countSuffix="개"
        files={[
          {
            id: 'document',
            name: '문서.pdf',
            status: 'complete',
            statusLabel: '업로드 완료',
            deleteLabel: '삭제',
          },
        ]}
        deleteAllLabel="전체 삭제"
      />
      <Select
        id="inventory-select"
        label="선택"
        options={options}
        title="선택"
      />
      <SelectSize
        id="inventory-select-size"
        label="작은 선택"
        options={options}
        size="small"
        title="작은 선택"
      />
      <SelectSorting
        id="inventory-select-sorting"
        label="정렬"
        options={options}
        title="정렬"
      />
      <SelectState
        id="inventory-select-error"
        label="오류 선택"
        options={options}
        state="error"
        title="오류 선택"
      />
      <LanguageSwitcher
        languages={languages}
        defaultValue="ko"
        label="언어 선택"
        selectedLabel="현재 선택"
        externalTitle="새 창 열림"
      />
      <LanguageSwitcherPage
        languages={languages}
        defaultValue="ko"
        label="언어 선택"
        currentLabel="현재 언어"
        selectedLabel="현재 선택"
        externalTitle="새 창 열림"
      />
      <Resize
        label="화면 크기"
        options={resizeOptions}
        defaultValue="default"
        selectedLabel="현재 선택"
        resetLabel="기본값으로 재설정"
      />
      <Carousel
        slides={slides}
        label="콘텐츠 캐러셀"
        previousLabel="이전 슬라이드"
        nextLabel="다음 슬라이드"
        moreLabel="콘텐츠 더 보기"
        actionLabel="자세히 보기"
        imageLabel="캐러셀 이미지"
      />
      <CarouselBanner
        slides={slides}
        label="배너 캐러셀"
        previousLabel="이전 배너"
        nextLabel="다음 배너"
        moreLabel="배너 더 보기"
        playLabel="자동 재생"
        stopLabel="자동 재생 중지"
        imageLabel="배너 이미지"
      />
      <Pagination
        current={2}
        navigationLabel="인벤토리 페이지 탐색"
        previousLabel="이전 페이지"
        nextLabel="다음 페이지"
      />
      <StepIndicator
        steps={[
          { id: 'one', label: '첫 단계' },
          { id: 'two', label: '두 번째 단계' },
        ]}
        current={1}
      />
      <Tab
        tabs={inventoryTabs}
        defaultTab="overview"
        message="선택됨"
        panelTitle="탭 내용"
        panels={{ overview: '개요 패널', details: '상세 패널' }}
      />
      <StructuredList
        items={items}
        dateLabel="등록일"
        dateValue="2026년 7월 27일"
        tags={['안내']}
        actionLabel="자세히 보기"
        shareLabel="공유"
        favoriteLabel="즐겨찾기"
      />
      <div className="krds-table-wrap">
        <StructuredListTable
          columns={columns}
          rows={rows}
          caption="서비스 목록"
          selectAllLabel="서비스 선택"
          countLabel="전체"
          sortLabel="정렬"
        />
      </div>
      <div className="krds-table-wrap">
        <Table columns={columns} rows={rows} caption="서비스 상태 표" />
      </div>
      <TextList items={['첫 항목', '둘째 항목']} />
      <TextListOrdered items={['첫 항목', '둘째 항목']} />
      <SideNavigation
        items={sideNavigationItems}
        title="사이드 메뉴"
        aria-label="사이드 메뉴"
      />
      <InPageNavigation
        items={links}
        title="빠른 이동"
        pageTitle="컴포넌트 인벤토리"
        actionLabel="목록 새로고침"
        actionInfo="전체"
        actionCount={2}
      />
      <Footer
        logoLabel="KRDS Community"
        address="서울특별시 중구 세종대로 110"
        contacts={[{ title: '대표전화', description: '02-1234-5678' }]}
        links={[
          { id: 'footer-about', label: '기관 소개', href: '#footer-about' },
          { id: 'footer-contact', label: '문의하기', href: '#footer-contact' },
        ]}
        socialLinks={[{ id: 'footer-blog', label: '공식 블로그', href: '#footer-blog', icon: 'blog' }]}
        policyLinks={[
          { id: 'footer-privacy', label: '개인정보처리방침', href: '#footer-privacy', emphasis: true },
        ]}
        copyright="© KRDS Community"
        organization="KRDS Community"
        description="공공서비스 디자인 시스템"
      />
      <HelpPanel
        open
        title="도움말"
        label="도움말 패널"
        tabs={helpTabs}
        defaultActiveTab="help"
        selectedLabel="선택됨"
        helpTitle="컴포넌트 도움말"
        helpDescription="컴포넌트 사용 방법을 안내합니다."
        downloadLinks={[{ id: 'help-guide', label: '사용 가이드', href: '#help-guide' }]}
        relatedGroups={[
          {
            id: 'help-related',
            title: '관련 서비스',
            links: [{ id: 'help-related-link', label: '관련 문서', href: '#related-docs' }],
          },
        ]}
        collapseLabel="도움말 접기"
        externalTitle="새 창 열림"
      />
      <TutorialPanel
        open
        title="튜토리얼"
        label="튜토리얼 패널"
        tabs={tutorialTabs}
        defaultActiveTab="tutorial"
        selectedLabel="선택됨"
        tutorialTitle="컴포넌트 튜토리얼"
        tutorialBackTitle="도움말로 돌아가기"
        tasks={[
          {
            id: 'tutorial-step',
            title: '첫 단계',
            summary: '컴포넌트 살펴보기',
            steps: ['예시를 확인합니다.'],
            current: true,
            defaultOpen: true,
          },
        ]}
        stopLabel="튜토리얼 종료"
        collapseLabel="튜토리얼 접기"
      />
      <Disclosure id="inventory-disclosure" title="상세 보기" open>
        상세 내용
      </Disclosure>
      <ContextualHelp
        label="도움말 열기"
        caption="추가 안내가 필요하신가요?"
        title="도움말"
        linkLabel="도움말 문서"
        href="#help-docs"
        closeLabel="도움말 닫기"
      >
        도움말 내용
      </ContextualHelp>
      <h2 className="sr-only">안내 컴포넌트</h2>
      <h3 className="sr-only">단계별 안내</h3>
      <h4 className="sr-only">코치마크 예시</h4>
      <CoachMark
        title="따라하기"
        step="1 / 3"
        stepTitle="컴포넌트 둘러보기"
        description="현재 단계 안내"
        currentStep="1"
        totalSteps="3"
        stopLabel="닫기"
        nextLabel="다음"
      >
        현재 단계 대상
      </CoachMark>
      <CriticalAlerts
        items={[{ id: 'critical', tone: 'danger', badgeLabel: '긴급', message: '긴급 안내' }]}
      />
      <Spinner label="처리 중" />
      <Tooltip message="툴팁">툴팁</Tooltip>
      <TooltipBox message="박스 툴팁">박스 툴팁</TooltipBox>
      <TooltipVertical message="세로 툴팁">세로 툴팁</TooltipVertical>
      <Tts text="읽어주기" />
      <TtsIcon text="아이콘 읽어주기" aria-label="아이콘 읽어주기" />
      <TtsSize text="큰 읽어주기" size="large" />
      <Modal
        id="inventory-modal"
        open
        title="대화 상자"
        cancelLabel="취소"
        confirmLabel="확인"
        closeLabel="대화 상자 닫기"
      >
        모달 내용
      </Modal>
      <ModalSample
        id="inventory-modal-sample"
        open
        title="모달 샘플"
        cancelLabel="취소"
        confirmLabel="확인"
        closeLabel="모달 샘플 닫기"
      >
        샘플 내용
      </ModalSample>
    </main>
  ),
};
