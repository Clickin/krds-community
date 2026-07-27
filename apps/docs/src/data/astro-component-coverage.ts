import { fixtureCatalog, publicComponentExports } from './component-catalog';
import { liveKrdsSource, pinnedKrdsSnapshot } from './provenance';

export const astroCoverageCategories = ['navigation', 'interaction', 'form', 'content'] as const;
export type AstroCoverageCategory = (typeof astroCoverageCategories)[number];

export type AstroCoverageDetail = {
  category: AstroCoverageCategory;
  usage: string;
  state: string;
};

/**
 * Native Astro examples are deliberately kept beside the page that renders them.
 * The export inventory remains generated; this map only records what the example
 * demonstrates (usage and the visible state) for the generated export name.
 */
const nativeExampleDetails: Record<string, AstroCoverageDetail> = {
  Accordion: { category: 'interaction', usage: '여러 안내 항목을 한 그룹으로 접고 펼칩니다.', state: 'defaultOpen=["overview"]' },
  AccordionLine: { category: 'interaction', usage: '선형 구분선이 있는 아코디언 항목을 표시합니다.', state: 'open=["overview"]' },
  Badge: { category: 'content', usage: '상태나 분류를 짧은 라벨로 표시합니다.', state: 'tone="primary"' },
  BadgeNumber: { category: 'content', usage: '읽지 않은 항목 수를 숫자 배지로 표시합니다.', state: 'label={3}' },
  BadgeSize: { category: 'content', usage: '서비스 밀도에 맞는 배지 크기를 선택합니다.', state: 'size="large"' },
  Breadcrumb: { category: 'navigation', usage: '현재 페이지의 계층적 위치를 제공합니다.', state: 'current=true on the last item' },
  Button: { category: 'content', usage: '폼 제출이나 명시적 작업을 실행합니다.', state: 'variant="primary"' },
  ButtonHierarchy: { category: 'content', usage: '주요 작업과 보조 작업의 시각적 위계를 보여줍니다.', state: 'variant="secondary"' },
  ButtonIcon: { category: 'content', usage: '아이콘과 텍스트가 있는 작업 버튼을 제공합니다.', state: 'size="medium"' },
  ButtonSize: { category: 'content', usage: '작업 영역에 맞는 버튼 크기를 지정합니다.', state: 'size="large"' },
  ButtonText: { category: 'content', usage: '강조가 낮은 텍스트형 작업을 제공합니다.', state: 'variant="tertiary"' },
  ButtonWithIcon: { category: 'content', usage: '아이콘과 버튼 레이블을 함께 표시합니다.', state: 'iconClass="ico-sch"' },
  Calendar: { category: 'form', usage: '단일 날짜를 달력 표면에서 선택합니다.', state: 'open=false, selectionMode="single"' },
  CalendarRange: { category: 'form', usage: '시작일과 종료일을 하나의 달력 흐름으로 선택합니다.', state: 'open=false, rangeStartDay=10, rangeEndDay=15' },
  Carousel: { category: 'interaction', usage: '여러 홍보 콘텐츠를 이전·다음으로 탐색합니다.', state: 'autoPlay=false, initialIndex=0' },
  CarouselBanner: { category: 'interaction', usage: '자동 재생 가능한 배너 콘텐츠를 제공합니다.', state: 'autoPlay=false, initialIndex=0' },
  Checkbox: { category: 'form', usage: '독립적인 선택 항목을 여러 개 제공합니다.', state: 'checked=false' },
  CheckboxChip: { category: 'form', usage: '칩 형태로 선택 가능한 필터를 제공합니다.', state: 'checked=true' },
  CheckboxSize: { category: 'form', usage: '선택 영역에 맞는 체크박스 크기를 지정합니다.', state: 'size="large"' },
  CoachMark: { category: 'interaction', usage: '처음 방문한 사용자에게 단계별 도움말을 안내합니다.', state: 'open=true, step="1 / 3"' },
  ContextualHelp: { category: 'interaction', usage: '현재 작업에 필요한 보충 설명을 제공합니다.', state: 'defaultOpen=true, position="top-left"' },
  CriticalAlerts: { category: 'interaction', usage: '페이지 상단에 긴급 공지를 목록으로 전달합니다.', state: 'items=[{ tone: "danger" }]' },
  DateInput: { category: 'form', usage: '날짜 입력 필드와 달력 팝업을 연결합니다.', state: 'open=false, required=true' },
  Disclosure: { category: 'interaction', usage: '세부 설명을 독립된 공개/비공개 영역으로 제공합니다.', state: 'open=false' },
  Favicon: { category: 'navigation', usage: '문서 페이지의 파비콘 리소스를 선언합니다.', state: 'rel="icon"' },
  FileUpload: { category: 'form', usage: '파일 선택과 업로드 상태 목록을 제공합니다.', state: 'files=[{ status: "complete" }]' },
  Footer: { category: 'navigation', usage: '서비스 하단의 기관 정보와 정책 링크를 구성합니다.', state: 'policyLinks rendered' },
  Header: { category: 'navigation', usage: '서비스 로고·검색·주요 메뉴를 묶어 제공합니다.', state: 'mobileMenu.open=false' },
  HelpPanel: { category: 'interaction', usage: '도움말과 튜토리얼을 탭 패널로 제공합니다.', state: 'open=false, activeTab="help"' },
  Identifier: { category: 'navigation', usage: '서비스 운영 기관과 설명을 식별합니다.', state: 'organization rendered' },
  InPageNavigation: { category: 'navigation', usage: '현재 문서의 주요 섹션으로 바로 이동합니다.', state: 'items include current section' },
  LanguageSwitcher: { category: 'navigation', usage: '동일 콘텐츠의 언어 선택을 제공합니다.', state: 'selected="ko"' },
  LanguageSwitcherPage: { category: 'navigation', usage: '언어별 페이지 링크를 선택 메뉴로 제공합니다.', state: 'selected="ko"' },
  Link: { category: 'navigation', usage: '텍스트 링크에 KRDS 링크 의미와 레이블을 적용합니다.', state: 'href points to an internal route' },
  MainMenuMobile: { category: 'navigation', usage: '모바일 환경의 서비스 메뉴를 표시합니다.', state: 'open=false' },
  MainMenuPc: { category: 'navigation', usage: '데스크톱 환경의 주요 메뉴와 하위 메뉴를 표시합니다.', state: 'current=true on the active item' },
  Masthead: { category: 'navigation', usage: '서비스 전체 공지나 안내를 헤더 위에 표시합니다.', state: 'message rendered' },
  Modal: { category: 'interaction', usage: '확인·취소가 필요한 작업을 대화상자로 요청합니다.', state: 'open=true' },
  ModalSample: { category: 'interaction', usage: '문서에서 사용할 모달의 대표 구성을 보여줍니다.', state: 'open=false, triggerLabel rendered' },
  Pagination: { category: 'interaction', usage: '목록 페이지 사이를 이동할 수 있게 합니다.', state: 'current=2' },
  Radio: { category: 'form', usage: '하나의 값만 고르는 라디오 그룹을 제공합니다.', state: 'checked=true' },
  RadioButton: { category: 'form', usage: '버튼형 라디오 선택지를 제공합니다.', state: 'checked=false' },
  RadioChip: { category: 'form', usage: '칩 형태의 단일 선택지를 제공합니다.', state: 'checked=true' },
  RadioSize: { category: 'form', usage: '라디오 그룹의 크기 변형을 지정합니다.', state: 'size="large"' },
  Resize: { category: 'interaction', usage: '서비스 화면 크기·보기 옵션을 선택합니다.', state: 'selected="medium"' },
  Select: { category: 'form', usage: '여러 옵션 중 하나를 네이티브 select로 고릅니다.', state: 'value="all"' },
  SelectSize: { category: 'form', usage: '크기 변형이 적용된 select를 제공합니다.', state: 'size="large"' },
  SelectSorting: { category: 'form', usage: '정렬 기준을 고르는 select를 제공합니다.', state: 'variant="sorting"' },
  SelectState: { category: 'form', usage: '검증 오류가 있는 select 상태를 보여줍니다.', state: 'state="error"' },
  SideNavigation: { category: 'navigation', usage: '문서나 서비스 영역의 보조 탐색을 제공합니다.', state: 'current=true on the active item' },
  SkipLink: { category: 'navigation', usage: '키보드 사용자가 본문으로 바로 건너뛰게 합니다.', state: 'href="#main-content"' },
  Spinner: { category: 'interaction', usage: '처리 중임을 보조 기술에 알립니다.', state: 'role="status"' },
  StepIndicator: { category: 'content', usage: '여러 단계 흐름에서 현재 단계를 표시합니다.', state: 'current=2' },
  StructuredList: { category: 'content', usage: '날짜·태그·작업이 포함된 카드 목록을 제공합니다.', state: 'favorite=true on the first item' },
  StructuredListTable: { category: 'content', usage: '선택·정렬·페이지 이동이 있는 목록 표를 제공합니다.', state: 'first row selected=true' },
  Switch: { category: 'form', usage: '설정의 켜짐/꺼짐 상태를 즉시 전환합니다.', state: 'checked=true' },
  Tab: { category: 'content', usage: '같은 맥락의 콘텐츠를 탭으로 나눕니다.', state: 'defaultValue="summary"' },
  Table: { category: 'content', usage: '행과 열의 관계가 있는 데이터를 표로 제공합니다.', state: 'first row is rendered as a header row' },
  Tag: { category: 'content', usage: '콘텐츠의 분류와 제거 가능한 필터를 표시합니다.', state: 'removable=true' },
  TagLink: { category: 'content', usage: '분류 태그를 탐색 링크로 제공합니다.', state: 'href points to a filter route' },
  TextInput: { category: 'form', usage: '레이블·힌트와 연결된 한 줄 입력을 제공합니다.', state: 'required=true' },
  TextInputIcon: { category: 'form', usage: '검색·비밀번호 같은 아이콘 입력을 제공합니다.', state: 'clearable=true' },
  TextInputSize: { category: 'form', usage: '입력 필드 크기 변형을 지정합니다.', state: 'size="large"' },
  TextInputState: { category: 'form', usage: '검증 결과가 반영된 입력 상태를 보여줍니다.', state: 'state="error", error rendered' },
  TextList: { category: 'content', usage: '계층이 있는 비순서 텍스트 목록을 제공합니다.', state: 'depth=0' },
  TextListOrdered: { category: 'content', usage: '순서가 중요한 단계 목록을 제공합니다.', state: 'ordered=true' },
  Textarea: { category: 'form', usage: '여러 줄의 설명이나 사유를 입력받습니다.', state: 'required=true' },
  ToggleSwitch: { category: 'form', usage: '토글 스위치 형태의 설정을 제공합니다.', state: 'checked=false' },
  ToggleSwitchSize: { category: 'form', usage: '토글 스위치 크기 변형을 지정합니다.', state: 'size="large"' },
  Tooltip: { category: 'interaction', usage: '짧은 보충 설명을 버튼에 연결합니다.', state: 'placement="horizontal"' },
  TooltipBox: { category: 'interaction', usage: '상자형 보충 설명을 제공합니다.', state: 'placement="box"' },
  TooltipVertical: { category: 'interaction', usage: '세로 배치가 필요한 보충 설명을 제공합니다.', state: 'placement="vertical"' },
  Tts: { category: 'content', usage: '텍스트 읽기 동작을 시작하는 컨트롤을 제공합니다.', state: 'variant="default", playing=false' },
  TtsIcon: { category: 'content', usage: '아이콘 중심의 텍스트 읽기 컨트롤을 제공합니다.', state: 'variant="default", playing=false' },
  TtsSize: { category: 'content', usage: '읽기 컨트롤의 크기 변형을 지정합니다.', state: 'size="large"' },
  TutorialPanel: { category: 'interaction', usage: '단계별 튜토리얼 작업을 패널로 제공합니다.', state: 'open=true, activeTab="tutorial"' },
};

const inventoryNames = new Set(publicComponentExports.map((entry) => entry.name));
const detailNames = Object.keys(nativeExampleDetails);
const missingDetails = publicComponentExports.filter((entry) => !nativeExampleDetails[entry.name]);
const staleDetails = detailNames.filter((name) => !inventoryNames.has(name));
if (missingDetails.length || staleDetails.length) {
  throw new Error(
    `Astro docs coverage map is out of sync (missing: ${missingDetails.map((entry) => entry.name).join(', ') || 'none'}; stale: ${staleDetails.join(', ') || 'none'})`,
  );
}

export const astroComponentCoverage = publicComponentExports.map((entry) => {
  const detail = nativeExampleDetails[entry.name]!;
  return {
    exportName: entry.name,
    importPath: entry.importPath,
    packageName: entry.packageName,
    sourceFile: entry.sourceFile,
    category: detail.category,
    usage: detail.usage,
    state: detail.state,
    fixtureIds: entry.fixtures.map((fixture) => fixture.id),
    fixtureCount: entry.fixtures.length,
    officialFiles: entry.manifest?.files ?? [],
    frameworkExamples: ['astro'] as const,
  };
});

export const astroCoverageSummary = {
  snapshot: pinnedKrdsSnapshot.ref,
  sourceUrl: pinnedKrdsSnapshot.sourceUrl,
  liveComponentSummary: liveKrdsSource.componentSummary,
  exportsExpected: publicComponentExports.length,
  usageExamples: astroComponentCoverage.length,
  stateExamples: astroComponentCoverage.filter((entry) => entry.state.length > 0).length,
  fixtureLinkedExports: astroComponentCoverage.filter((entry) => entry.fixtureCount > 0).length,
  fixtureCount: fixtureCatalog.length,
  nativeFrameworkExamples: astroComponentCoverage.length,
  categories: Object.fromEntries(
    astroCoverageCategories.map((category) => [
      category,
      astroComponentCoverage.filter((entry) => entry.category === category).length,
    ]),
  ) as Record<AstroCoverageCategory, number>,
} as const;

export const astroCoverageGaps = {
  missingNativeExamples: publicComponentExports.length - astroCoverageSummary.usageExamples,
  missingStateExamples: publicComponentExports.length - astroCoverageSummary.stateExamples,
  missingFixtureLinks: publicComponentExports.filter((entry) => entry.fixtures.length === 0).map((entry) => entry.name),
} as const;
