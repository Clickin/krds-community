import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ACCORDION_ITEM_SINGLE,
  BUTTON_TEXT,
  CHECKBOX_LABEL_DEFAULT,
  CHECKBOX_LABEL_LARGE,
  RADIO_LABEL_DEFAULT,
  RADIO_LABEL_LARGE,
  TEXT_INPUT_PROPS,
  MODAL_PROPS,
  MODAL_TRIGGER_TEXT,
} from "../../shared/story-props";
import {
  Accordion,
  AccordionLine,
  Alert,
  Badge,
  BadgeNumber,
  BadgeSize,
  BottomSheet,
  Breadcrumb,
  Button,
  ButtonHierarchy,
  ButtonIcon,
  ButtonSize,
  ButtonText,
  ButtonWithIcon,
  Calendar,
  CalendarRange,
  Card,
  Carousel,
  CarouselBanner,
  Checkbox,
  CheckboxChip,
  CheckboxSize,
  Chip,
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
  Infobox,
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
  ProgressBar,
  Radio,
  RadioButton,
  RadioChip,
  RadioSize,
  Resize,
  Search,
  Select,
  SelectSize,
  SelectSorting,
  SelectState,
  SideNavigation,
  SkipLink,
  Snackbar,
  Spinner,
  StepIndicator,
  StructuredList,
  StructuredListTable,
  Switch,
  Tab,
  TabBar,
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
  Toast,
  ToggleSwitch,
  ToggleSwitchSize,
  Tooltip,
  TooltipBox,
  TooltipVertical,
  TopButton,
  Tts,
  TtsIcon,
  TtsSize,
  TutorialPanel,
  UserFeedback,
} from "@krds-community/react";

const links = [
  { id: "home", label: "홈", href: "/" },
  { id: "guide", label: "가이드", href: "#guide" },
];
const options = [
  { value: "one", label: "첫 번째" },
  { value: "two", label: "두 번째" },
];
const headerMobileItems = [
  { id: "header-home", label: "홈", href: "/" },
  { id: "header-guide", label: "가이드", href: "#guide" },
];
const mobileItems = [
  { id: "mobile-home", label: "홈", href: "/" },
  { id: "mobile-guide", label: "가이드", href: "#guide" },
];
const languages = [
  { value: "ko", label: "한국어", href: "#language-ko", lang: "ko" },
  { value: "en", label: "English", href: "#language-en", lang: "en" },
];
const resizeOptions = [
  { value: "default", label: "기본" },
  { value: "large", label: "크게" },
  { value: "largest", label: "가장 크게" },
];
const slides = [
  {
    id: "one",
    title: "첫 번째 카드",
    description: "캐러셀 콘텐츠입니다.",
    href: "#slide-one",
  },
  { id: "two", title: "두 번째 카드", description: "두 번째 카드 설명입니다.", href: "#slide-two" },
];
const items = [
  { id: "one", title: "첫 번째 항목", description: "항목 설명입니다.", href: "#item-one" },
  { id: "two", title: "두 번째 항목", description: "두 번째 항목 설명입니다.", href: "#item-two" },
];
const columns = [
  { key: "name", label: "이름" },
  { key: "status", label: "상태" },
];
const rows = [
  { id: "service", name: "서비스", status: "운영 중" },
  { id: "docs", name: "문서", status: "검토 중" },
];
const inventoryTabs = [
  {
    id: "overview",
    tabId: "inventory-tab-overview",
    panelId: "inventory-panel-overview",
    label: "개요",
  },
  {
    id: "details",
    tabId: "inventory-tab-details",
    panelId: "inventory-panel-details",
    label: "상세",
  },
];
const helpTabs = [
  { id: "help", value: "help", label: "도움말", panelId: "inventory-help-panel" },
  { id: "tutorial", value: "tutorial", label: "튜토리얼", panelId: "inventory-help-tutorial" },
];
const tutorialTabs = [
  { id: "tutorial-help", value: "help", label: "도움말", panelId: "inventory-tutorial-help" },
  {
    id: "tutorial-guide",
    value: "tutorial",
    label: "튜토리얼",
    panelId: "inventory-tutorial-panel",
  },
];
const sideNavigationItems = [
  {
    id: "service",
    label: "서비스",
    children: [{ id: "service-overview", label: "서비스 소개", href: "#service-overview" }],
  },
  {
    id: "guide",
    label: "가이드",
    children: [{ id: "guide-start", label: "시작하기", href: "#guide-start" }],
  },
];

const meta = {
  title: "React/전체 컴포넌트",
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
  render: () => (
    <main
      id="main-content"
      aria-label="컴포넌트 인벤토리"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "1rem",
        width: "100%",
        maxWidth: 720,
        minWidth: 0,
        overflowX: "hidden",
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
          id: "inventory-header-mobile",
          searchPlaceholder: "검색어를 입력하세요",
          searchTitle: "모바일 검색",
          searchLabel: "검색",
          loginLabel: "로그인",
          items: headerMobileItems,
          previousLabel: "이전",
          closeLabel: "닫기",
        }}
      />
      <Identifier organization="KRDS Community" description="디지털 서비스 디자인 시스템" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
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
      <MainMenuPc items={links} menuLabel="보조 주 메뉴" aria-label="보조 주 메뉴" />
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        <Button variant="primary">{BUTTON_TEXT.primary}</Button>
        <Button variant="secondary">버튼 : secondary</Button>
        <Button variant="tertiary">버튼 : tertiary</Button>
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
      <Accordion items={[ACCORDION_ITEM_SINGLE]} />
      <AccordionLine
        items={[{ id: "line", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" }]}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
        <Checkbox id="inventory-checkbox" label={CHECKBOX_LABEL_DEFAULT} name="check" />
        <Checkbox
          id="inventory-checkbox-large"
          label={CHECKBOX_LABEL_LARGE}
          name="check-large"
          size="large"
        />
        <CheckboxChip id="inventory-checkbox-chip" label="체크 칩" name="chip" />
        <CheckboxSize id="inventory-checkbox-size" label="큰 체크" size="large" />
        <Radio id="inventory-radio" label={RADIO_LABEL_DEFAULT} name="radio" value="one" />
        <RadioButton id="inventory-radio-button" label="라디오 버튼" name="radio2" value="one" />
        <Radio
          id="inventory-radio-large"
          label={RADIO_LABEL_LARGE}
          name="radio-large"
          value="large"
          size="large"
        />
        <div className="krds-form-chip">
          <RadioChip id="inventory-radio-chip" label="라디오 칩" name="radio3" value="one" />
        </div>
        <RadioSize id="inventory-radio-size" label="큰 라디오 칩" name="radio4" value="one" />
        <Switch id="inventory-switch" label="스위치" name="switch" />
        <ToggleSwitch id="inventory-toggle" label="토글" name="toggle" />
        <Switch id="inventory-switch-large" label="큰 스위치" name="switch-large" size="large" />
        <ToggleSwitchSize id="inventory-toggle-size" label="큰 토글" size="large" name="toggle2" />
      </div>
      <Calendar
        id="inventory-calendar"
        label="날짜"
        calendarLabel="날짜 달력"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        yearSelectLabel="연도 선택"
        monthSelectLabel="월 선택"
        weekdays={["일", "월", "화", "수", "목", "금", "토"]}
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
        weekdays={["일", "월", "화", "수", "목", "금", "토"]}
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
        weekdays={["일", "월", "화", "수", "목", "금", "토"]}
        defaultStart="2026.07.10"
        defaultEnd="2026.07.15"
        rangeStartDay={10}
        rangeEndDay={15}
        todayDay={15}
        todayLabel="오늘"
        cancelLabel="취소"
        confirmLabel="확인"
      />
      <TextInput id="inventory-text" label={TEXT_INPUT_PROPS.label} hint={TEXT_INPUT_PROPS.hint} />
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
            id: "document",
            name: "문서.pdf",
            status: "complete",
            statusLabel: "업로드 완료",
            deleteLabel: "삭제",
          },
        ]}
        deleteAllLabel="전체 삭제"
      />
      <Select id="inventory-select" label="선택" options={options} title="선택" />
      <SelectSize
        id="inventory-select-size"
        label="작은 선택"
        options={options}
        size="small"
        title="작은 선택"
      />
      <SelectSorting id="inventory-select-sorting" label="정렬" options={options} title="정렬" />
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
          { id: "one", label: "첫 단계" },
          { id: "two", label: "두 번째 단계" },
        ]}
        current={1}
      />
      <Tab
        tabs={inventoryTabs}
        defaultTab="overview"
        message="선택됨"
        panelTitle="탭 내용"
        panels={{ overview: "개요 패널", details: "상세 패널" }}
      />
      <StructuredList
        items={items}
        dateLabel="등록일"
        dateValue="2026년 7월 27일"
        tags={["안내"]}
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
      <TextList items={["첫 항목", "둘째 항목"]} />
      <TextListOrdered items={["첫 항목", "둘째 항목"]} />
      <SideNavigation items={sideNavigationItems} title="사이드 메뉴" aria-label="사이드 메뉴" />
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
        contacts={[{ title: "대표전화", description: "02-1234-5678" }]}
        links={[
          { id: "footer-about", label: "기관 소개", href: "#footer-about" },
          { id: "footer-contact", label: "문의하기", href: "#footer-contact" },
        ]}
        socialLinks={[
          { id: "footer-blog", label: "공식 블로그", href: "#footer-blog", icon: "blog" },
        ]}
        policyLinks={[
          {
            id: "footer-privacy",
            label: "개인정보처리방침",
            href: "#footer-privacy",
            emphasis: true,
          },
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
        downloadLinks={[{ id: "help-guide", label: "사용 가이드", href: "#help-guide" }]}
        relatedGroups={[
          {
            id: "help-related",
            title: "관련 서비스",
            links: [{ id: "help-related-link", label: "관련 문서", href: "#related-docs" }],
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
            id: "tutorial-step",
            title: "첫 단계",
            summary: "컴포넌트 살펴보기",
            steps: ["예시를 확인합니다."],
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
        items={[{ id: "critical", tone: "danger", badgeLabel: "긴급", message: "긴급 안내" }]}
      />
      <Spinner label="처리 중" />
      <Tooltip message="툴팁">툴팁</Tooltip>
      <TooltipBox message="박스 툴팁">박스 툴팁</TooltipBox>
      <TooltipVertical message="세로 툴팁">세로 툴팁</TooltipVertical>
      <Tts text="읽어주기" />
      <TtsIcon text="아이콘 읽어주기" aria-label="아이콘 읽어주기" />
      <TtsSize text="큰 읽어주기" size="large" />
      <>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Button onClick={() => {}}>{MODAL_TRIGGER_TEXT}</Button>
          <Button onClick={() => {}}>모달 샘플 열기</Button>
        </div>
        <Modal
          id="inventory-modal"
          open={false}
          title={MODAL_PROPS.title}
          cancelLabel="취소"
          confirmLabel="확인"
          closeLabel="대화 상자 닫기"
        >
          모달 내용
        </Modal>
        <ModalSample
          id="inventory-modal-sample"
          open={false}
          title="모달 샘플"
          cancelLabel="취소"
          confirmLabel="확인"
          closeLabel="모달 샘플 닫기"
        >
          샘플 내용
        </ModalSample>
      </>
    </main>
  ),
};

export const AccordionLineStory: StoryObj<typeof meta> = {
  name: "아코디언 라인",
  render: () => (
    <AccordionLine
      items={[{ id: "line", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" }]}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const AlertStory: StoryObj<typeof meta> = {
  name: "알림",
  render: () => (
    <Alert
      state="danger"
      title="오류가 발생했습니다."
      message="처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BadgeStory: StoryObj<typeof meta> = {
  name: "배지",
  render: () => <Badge label="배지" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BadgeNumberStory: StoryObj<typeof meta> = {
  name: "배지 번호",
  render: () => <BadgeNumber label="3" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BadgeSizeStory: StoryObj<typeof meta> = {
  name: "배지 크기",
  render: () => <BadgeSize label="중요" size="large" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BreadcrumbStory: StoryObj<typeof meta> = {
  name: "브레드크럼",
  render: () => <Breadcrumb items={links} label="현재 경로" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const BottomSheetStory: StoryObj<typeof meta> = {
  name: "바텀 시트",
  render: () => (
    <BottomSheet open title="정렬 기준 선택" description="원하는 정렬 기준을 선택하세요.">
      정렬 기준 내용
    </BottomSheet>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonHierarchyStory: StoryObj<typeof meta> = {
  name: "버튼 계층",
  render: () => <ButtonHierarchy>계층 버튼</ButtonHierarchy>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonIconStory: StoryObj<typeof meta> = {
  name: "아이콘 버튼",
  render: () => <ButtonIcon label="검색" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonSizeStory: StoryObj<typeof meta> = {
  name: "버튼 크기",
  render: () => <ButtonSize size="small">작은 버튼</ButtonSize>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonTextStory: StoryObj<typeof meta> = {
  name: "텍스트 버튼",
  render: () => <ButtonText>텍스트 버튼</ButtonText>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ButtonWithIconStory: StoryObj<typeof meta> = {
  name: "아이콘이 있는 버튼",
  render: () => <ButtonWithIcon>다음</ButtonWithIcon>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CalendarStory: StoryObj<typeof meta> = {
  name: "캘린더",
  render: () => (
    <Calendar
      id="inventory-calendar"
      label="날짜"
      calendarLabel="날짜 달력"
      previousMonthLabel="이전 달"
      nextMonthLabel="다음 달"
      yearSelectLabel="연도 선택"
      monthSelectLabel="월 선택"
      weekdays={["일", "월", "화", "수", "목", "금", "토"]}
      years={[2025, 2026]}
      todayDay={15}
      todayLabel="오늘"
      eventDays={[10]}
      eventLabel="일정 있음"
      cancelLabel="취소"
      confirmLabel="확인"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CalendarRangeStory: StoryObj<typeof meta> = {
  name: "캘린더 범위",
  render: () => (
    <CalendarRange
      id="inventory-calendar-range"
      label="기간"
      calendarLabel="기간 달력"
      previousMonthLabel="이전 달"
      nextMonthLabel="다음 달"
      yearSelectLabel="연도 선택"
      monthSelectLabel="월 선택"
      weekdays={["일", "월", "화", "수", "목", "금", "토"]}
      defaultStart="2026.07.10"
      defaultEnd="2026.07.15"
      rangeStartDay={10}
      rangeEndDay={15}
      todayDay={15}
      todayLabel="오늘"
      cancelLabel="취소"
      confirmLabel="확인"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CardStory: StoryObj<typeof meta> = {
  name: "카드",
  render: () => (
    <Card
      type="vertical"
      title="서비스 안내 카드"
      description="서비스 이용 방법을 안내합니다."
      badges={["안내"]}
      actions={[{ label: "자세히 보기" }]}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CarouselStory: StoryObj<typeof meta> = {
  name: "캐러셀",
  render: () => (
    <Carousel
      slides={slides}
      label="콘텐츠 캐러셀"
      previousLabel="이전 슬라이드"
      nextLabel="다음 슬라이드"
      moreLabel="콘텐츠 더 보기"
      actionLabel="자세히 보기"
      imageLabel="캐러셀 이미지"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CarouselBannerStory: StoryObj<typeof meta> = {
  name: "배너 캐러셀",
  render: () => (
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
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CheckboxChipStory: StoryObj<typeof meta> = {
  name: "체크박스 칩",
  render: () => <CheckboxChip id="inventory-checkbox-chip" label="체크 칩" name="chip" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CheckboxSizeStory: StoryObj<typeof meta> = {
  name: "체크박스 크기",
  render: () => (
    <CheckboxSize id="inventory-checkbox-size" label={CHECKBOX_LABEL_LARGE} size="large" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ChipStory: StoryObj<typeof meta> = {
  name: "칩",
  render: () => (
    <Chip
      options={[
        { value: "all", label: "전체" },
        { value: "notice", label: "공지" },
        { value: "event", label: "행사" },
      ]}
      defaultSelected="all"
      ariaLabel="칩 선택"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CoachMarkStory: StoryObj<typeof meta> = {
  name: "코치마크",
  render: () => (
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
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ContextualHelpStory: StoryObj<typeof meta> = {
  name: "컨텍스추얼 헬프",
  render: () => (
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
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const CriticalAlertsStory: StoryObj<typeof meta> = {
  name: "크리티컬 알림",
  render: () => (
    <CriticalAlerts
      items={[{ id: "critical", tone: "danger", badgeLabel: "긴급", message: "긴급 안내" }]}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const DateInputStory: StoryObj<typeof meta> = {
  name: "날짜 입력",
  render: () => (
    <DateInput
      id="inventory-date-input"
      label="날짜 입력"
      calendarLabel="날짜 입력 달력"
      previousMonthLabel="이전 달"
      nextMonthLabel="다음 달"
      yearSelectLabel="연도 선택"
      monthSelectLabel="월 선택"
      weekdays={["일", "월", "화", "수", "목", "금", "토"]}
      todayDay={15}
      todayLabel="오늘"
      cancelLabel="취소"
      confirmLabel="확인"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const DisclosureStory: StoryObj<typeof meta> = {
  name: "디스클로저",
  render: () => (
    <Disclosure id="inventory-disclosure" title="상세 보기">
      상세 내용
    </Disclosure>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const FaviconStory: StoryObj<typeof meta> = {
  name: "파비콘",
  render: () => <Favicon href="/favicon.svg" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const FileUploadStory: StoryObj<typeof meta> = {
  name: "파일 업로드",
  render: () => (
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
          id: "document",
          name: "문서.pdf",
          status: "complete",
          statusLabel: "업로드 완료",
          deleteLabel: "삭제",
        },
      ]}
      deleteAllLabel="전체 삭제"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const FooterStory: StoryObj<typeof meta> = {
  name: "푸터",
  render: () => (
    <Footer
      logoLabel="KRDS Community"
      address="서울특별시 중구 세종대로 110"
      contacts={[{ title: "대표전화", description: "02-1234-5678" }]}
      links={[
        { id: "footer-about", label: "기관 소개", href: "#footer-about" },
        { id: "footer-contact", label: "문의하기", href: "#footer-contact" },
      ]}
      socialLinks={[
        { id: "footer-blog", label: "공식 블로그", href: "#footer-blog", icon: "blog" },
      ]}
      policyLinks={[
        {
          id: "footer-privacy",
          label: "개인정보처리방침",
          href: "#footer-privacy",
          emphasis: true,
        },
      ]}
      copyright="© KRDS Community"
      organization="KRDS Community"
      description="공공서비스 디자인 시스템"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const HeaderStory: StoryObj<typeof meta> = {
  name: "헤더",
  render: () => (
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
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const HelpPanelStory: StoryObj<typeof meta> = {
  name: "헬프 패널",
  render: () => (
    <HelpPanel
      open
      title="도움말"
      label="도움말 패널"
      tabs={helpTabs}
      defaultActiveTab="help"
      selectedLabel="선택됨"
      helpTitle="컴포넌트 도움말"
      helpDescription="컴포넌트 사용 방법을 안내합니다."
      downloadLinks={[{ id: "help-guide", label: "사용 가이드", href: "#help-guide" }]}
      relatedGroups={[
        {
          id: "help-related",
          title: "관련 서비스",
          links: [{ id: "help-related-link", label: "관련 문서", href: "#related-docs" }],
        },
      ]}
      collapseLabel="도움말 접기"
      externalTitle="새 창 열림"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const IdentifierStory: StoryObj<typeof meta> = {
  name: "식별자",
  render: () => (
    <Identifier organization="KRDS Community" description="디지털 서비스 디자인 시스템" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const InfoboxStory: StoryObj<typeof meta> = {
  name: "인포박스",
  render: () => (
    <Infobox type="primary" message="정부 서비스 이용에 도움이 되는 안내입니다." />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const InPageNavigationStory: StoryObj<typeof meta> = {
  name: "페이지 내 네비게이션",
  render: () => (
    <InPageNavigation
      items={links}
      title="빠른 이동"
      pageTitle="컴포넌트 인벤토리"
      actionLabel="목록 새로고침"
      actionInfo="전체"
      actionCount={2}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const LanguageSwitcherStory: StoryObj<typeof meta> = {
  name: "언어 전환",
  render: () => (
    <LanguageSwitcher
      languages={languages}
      defaultValue="ko"
      label="언어 선택"
      selectedLabel="현재 선택"
      externalTitle="새 창 열림"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const LanguageSwitcherPageStory: StoryObj<typeof meta> = {
  name: "언어 전환 페이지",
  render: () => (
    <LanguageSwitcherPage
      languages={languages}
      defaultValue="ko"
      label="언어 선택"
      currentLabel="현재 언어"
      selectedLabel="현재 선택"
      externalTitle="새 창 열림"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const LinkStory: StoryObj<typeof meta> = {
  name: "링크",
  render: () => <Link href="#link">링크</Link>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const MainMenuMobileStory: StoryObj<typeof meta> = {
  name: "모바일 메인 메뉴",
  render: () => (
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
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const MainMenuPcStory: StoryObj<typeof meta> = {
  name: "PC 메인 메뉴",
  render: () => <MainMenuPc items={links} menuLabel="보조 주 메뉴" aria-label="보조 주 메뉴" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const MastheadStory: StoryObj<typeof meta> = {
  name: "마스트헤드",
  render: () => <Masthead message="대한민국 공식 전자정부 누리집입니다." />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ModalSampleStory: StoryObj<typeof meta> = {
  name: "모달 샘플",
  render: () => (
    <>
      <Button onClick={() => {}}>{MODAL_TRIGGER_TEXT}</Button>
      <ModalSample
        id="inventory-modal-sample"
        open={false}
        title="모달 샘플"
        cancelLabel="취소"
        confirmLabel="확인"
        closeLabel="모달 샘플 닫기"
      >
        샘플 내용
      </ModalSample>
    </>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const PaginationStory: StoryObj<typeof meta> = {
  name: "페이지네이션",
  render: () => (
    <Pagination
      current={2}
      navigationLabel="인벤토리 페이지 탐색"
      previousLabel="이전 페이지"
      nextLabel="다음 페이지"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ProgressBarStory: StoryObj<typeof meta> = {
  name: "진행률",
  render: () => <ProgressBar value={70} label="처리 진행률" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioButtonStory: StoryObj<typeof meta> = {
  name: "라디오 버튼",
  render: () => (
    <RadioButton id="inventory-radio-button" label="라디오 버튼" name="radio2" value="one" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioChipStory: StoryObj<typeof meta> = {
  name: "라디오 칩",
  render: () => (
    <div className="krds-form-chip">
      <RadioChip id="inventory-radio-chip" label="라디오 칩" name="radio3" value="one" />
    </div>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const RadioSizeStory: StoryObj<typeof meta> = {
  name: "라디오 크기",
  render: () => (
    <RadioSize id="inventory-radio-size" label="큰 라디오 칩" name="radio4" value="one" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ResizeStory: StoryObj<typeof meta> = {
  name: "화면 크기",
  render: () => (
    <Resize
      label="화면 크기"
      options={resizeOptions}
      defaultValue="default"
      selectedLabel="현재 선택"
      resetLabel="기본값으로 재설정"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SearchStory: StoryObj<typeof meta> = {
  name: "검색",
  render: () => (
    <Search
      placeholder="검색어를 입력해 주세요"
      onSearch={(value) => console.log("검색:", value)}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectStory: StoryObj<typeof meta> = {
  name: "셀렉트",
  render: () => <Select id="inventory-select" label="선택" options={options} title="선택" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectSizeStory: StoryObj<typeof meta> = {
  name: "셀렉트 크기",
  render: () => (
    <SelectSize
      id="inventory-select-size"
      label="작은 선택"
      options={options}
      size="small"
      title="작은 선택"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectSortingStory: StoryObj<typeof meta> = {
  name: "정렬 셀렉트",
  render: () => (
    <SelectSorting id="inventory-select-sorting" label="정렬" options={options} title="정렬" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SelectStateStory: StoryObj<typeof meta> = {
  name: "셀렉트 상태",
  render: () => (
    <SelectState
      id="inventory-select-error"
      label="오류 선택"
      options={options}
      state="error"
      title="오류 선택"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SideNavigationStory: StoryObj<typeof meta> = {
  name: "사이드 네비게이션",
  render: () => (
    <SideNavigation items={sideNavigationItems} title="사이드 메뉴" aria-label="사이드 메뉴" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SkipLinkStory: StoryObj<typeof meta> = {
  name: "스킵 링크",
  render: () => (
    <div id="krds-skip-link">
      <SkipLink href="#main-content" />
    </div>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SnackbarStory: StoryObj<typeof meta> = {
  name: "스낵바",
  render: () => (
    <Snackbar
      message="변경사항이 저장되었습니다."
      actionLabel="되돌리기"
      closeLabel="닫기"
      open
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SpinnerStory: StoryObj<typeof meta> = {
  name: "스피너",
  render: () => <Spinner label="처리 중" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StepIndicatorStory: StoryObj<typeof meta> = {
  name: "단계 표시기",
  render: () => (
    <StepIndicator
      steps={[
        { id: "one", label: "첫 단계" },
        { id: "two", label: "두 번째 단계" },
      ]}
      current={1}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StructuredListStory: StoryObj<typeof meta> = {
  name: "구조화된 목록",
  render: () => (
    <StructuredList
      items={items}
      dateLabel="등록일"
      dateValue="2026년 7월 27일"
      tags={["안내"]}
      actionLabel="자세히 보기"
      shareLabel="공유"
      favoriteLabel="즐겨찾기"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const StructuredListTableStory: StoryObj<typeof meta> = {
  name: "구조화된 테이블",
  render: () => (
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
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const SwitchStory: StoryObj<typeof meta> = {
  name: "스위치",
  render: () => <Switch id="inventory-switch" label="스위치" name="switch" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TabBarStory: StoryObj<typeof meta> = {
  name: "탭 바",
  render: () => (
    <TabBar
      items={[
        { id: "home", label: "홈" },
        { id: "guide", label: "가이드" },
        { id: "notice", label: "공지" },
      ]}
      defaultSelected="home"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TableStory: StoryObj<typeof meta> = {
  name: "테이블",
  render: () => (
    <div className="krds-table-wrap">
      <Table columns={columns} rows={rows} caption="서비스 상태 표" />
    </div>
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TagStory: StoryObj<typeof meta> = {
  name: "태그",
  render: () => <Tag label="태그" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TagLinkStory: StoryObj<typeof meta> = {
  name: "태그 링크",
  render: () => <TagLink label="태그 링크" href="#tag" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextareaStory: StoryObj<typeof meta> = {
  name: "텍스트 영역",
  render: () => (
    <Textarea id="inventory-textarea" label={TEXT_INPUT_PROPS.label} hint={TEXT_INPUT_PROPS.hint} />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputIconStory: StoryObj<typeof meta> = {
  name: "아이콘 텍스트 입력",
  render: () => (
    <TextInputIcon
      id="inventory-text-icon"
      label={TEXT_INPUT_PROPS.label}
      hint={TEXT_INPUT_PROPS.hint}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputSizeStory: StoryObj<typeof meta> = {
  name: "텍스트 입력 크기",
  render: () => (
    <TextInputSize id="inventory-text-small" label={TEXT_INPUT_PROPS.label} size="small" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextInputStateStory: StoryObj<typeof meta> = {
  name: "텍스트 입력 상태",
  render: () => (
    <TextInputState
      id="inventory-text-error"
      label={TEXT_INPUT_PROPS.label}
      state="error"
      hint={TEXT_INPUT_PROPS.hint}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextListStory: StoryObj<typeof meta> = {
  name: "텍스트 목록",
  render: () => <TextList items={["첫 항목", "둘째 항목"]} />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TextListOrderedStory: StoryObj<typeof meta> = {
  name: "순서 있는 텍스트 목록",
  render: () => <TextListOrdered items={["첫 항목", "둘째 항목"]} />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ToastStory: StoryObj<typeof meta> = {
  name: "토스트",
  render: () => <Toast message="저장되었습니다." defaultOpen duration={60000} />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ToggleSwitchStory: StoryObj<typeof meta> = {
  name: "토글 스위치",
  render: () => <ToggleSwitch id="inventory-toggle" label="토글" name="toggle" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const ToggleSwitchSizeStory: StoryObj<typeof meta> = {
  name: "토글 스위치 크기",
  render: () => (
    <ToggleSwitchSize id="inventory-toggle-size" label="큰 토글" size="large" name="toggle2" />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TooltipStory: StoryObj<typeof meta> = {
  name: "툴팁",
  render: () => <Tooltip message="툴팁">툴팁</Tooltip>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TooltipBoxStory: StoryObj<typeof meta> = {
  name: "툴팁 박스",
  render: () => <TooltipBox message="박스 툴팁">박스 툴팁</TooltipBox>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TooltipVerticalStory: StoryObj<typeof meta> = {
  name: "수직 툴팁",
  render: () => <TooltipVertical message="세로 툴팁">세로 툴팁</TooltipVertical>,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TopButtonStory: StoryObj<typeof meta> = {
  name: "상단 이동",
  render: () => <TopButton onClick={() => console.log("맨 위로 이동")} />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TtsStory: StoryObj<typeof meta> = {
  name: "TTS",
  render: () => <Tts text="읽어주기" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TtsIconStory: StoryObj<typeof meta> = {
  name: "TTS 아이콘",
  render: () => <TtsIcon text="아이콘 읽어주기" aria-label="아이콘 읽어주기" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TtsSizeStory: StoryObj<typeof meta> = {
  name: "TTS 크기",
  render: () => <TtsSize text="큰 읽어주기" size="large" />,
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const TutorialPanelStory: StoryObj<typeof meta> = {
  name: "튜토리얼 패널",
  render: () => (
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
          id: "tutorial-step",
          title: "첫 단계",
          summary: "컴포넌트 살펴보기",
          steps: ["예시를 확인합니다."],
          current: true,
          defaultOpen: true,
        },
      ]}
      stopLabel="튜토리얼 종료"
      collapseLabel="튜토리얼 접기"
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
export const UserFeedbackStory: StoryObj<typeof meta> = {
  name: "사용자 피드백",
  render: () => (
    <UserFeedback
      title="이 페이지에 만족하시나요?"
      options={[
        { value: "satisfied", label: "만족" },
        { value: "dissatisfied", label: "불만족" },
      ]}
      onSubmit={(value) => console.log("피드백:", value)}
    />
  ),
  parameters: { layout: "padded", a11y: { test: "error" } },
};
