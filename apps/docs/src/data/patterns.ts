import { pinnedKrdsSnapshot } from './provenance';

export type PatternCategory = '서비스 패턴' | '기본 패턴';
export type PatternLevel = '필수 (Do)' | '권장 (Better)' | '우수 (Best)';
export type PatternStage = {
  id: string;
  title: string;
  href: string;
};

export type Pattern = {
  id: string;
  slug: string;
  category: PatternCategory;
  title: string;
  description: string;
  officialOverview: string;
  officialExample: string;
  officialChecklist: string;
  officialStageLinks: PatternStage[];
  officialLevels?: PatternLevel[];
  officialVersionBoundary: string;
  sourceNote: string;
};

const versionBoundary = `공식 웹사이트는 ${pinnedKrdsSnapshot.ref} HTML snapshot(${pinnedKrdsSnapshot.commit})보다 넓은 live 정보를 가질 수 있다. 이 페이지는 ${pinnedKrdsSnapshot.retrieved}에 고정한 스냅샷과 확인한 공식 링크를 구분한다.`;

const basicOverview = 'https://www.krds.go.kr/html/site/global/global_summary.html';
const serviceLevels: PatternLevel[] = ['필수 (Do)', '권장 (Better)', '우수 (Best)'];
const basicSourceNote =
  '공식 기본 패턴 페이지에는 서비스 패턴처럼 필수·권장·우수 적용 수준 필터가 별도로 표시되지 않는다.';
const serviceChecklist = 'https://www.krds.go.kr/html/site/utility/utility_01.html';
const basicChecklist = basicOverview;
const stage = (id: string, title: string): PatternStage => ({
  id,
  title,
  href: `https://www.krds.go.kr/html/site/service/service_${id}.html`,
});
const basicStage = (id: string, title: string): PatternStage => ({
  id,
  title,
  href: `https://www.krds.go.kr/html/site/global/global_${id}.html`,
});

export const servicePatterns: Pattern[] = [
  {
    id: 'visit',
    slug: 'visit',
    category: '서비스 패턴',
    title: '방문',
    description:
      '사용자가 디지털 서비스에 접속하여 원하는 상세 정보로 연결되는 과정이다. 서비스와 만나는 첫 화면이므로 명확하고 간결하게 구성한다.',
    officialOverview: 'https://www.krds.go.kr/html/site/service/service_01_01.html',
    officialExample: 'https://www.krds.go.kr/html/site/service/service_01_02.html',
    officialChecklist: serviceChecklist,
    officialStageLinks: [stage('01_02', '방문')],
    officialVersionBoundary: versionBoundary,
    officialLevels: serviceLevels,
    sourceNote: '공식 개요의 사용성 가이드라인에 표시된 적용 수준을 기준으로 한다.',
  },
  {
    id: 'search',
    slug: 'search',
    category: '서비스 패턴',
    title: '검색',
    description:
      '큰 데이터 집합에서 원하는 정보를 찾도록 돕는 기능이다. 검색어 입력, 결과 확인, 재검색과 상세 검색 흐름을 함께 고려한다.',
    officialOverview: 'https://www.krds.go.kr/html/site/service/service_02_01.html',
    officialExample: 'https://www.krds.go.kr/html/site/service/service_02_02.html',
    officialChecklist: serviceChecklist,
    officialStageLinks: [
      stage('02_02', '검색 기능 찾기'),
      stage('02_03', '검색어 입력'),
      stage('02_04', '검색 결과 확인'),
      stage('02_05', '상세 검색'),
      stage('02_06', '검색 결과 이용'),
      stage('02_07', '재검색'),
      stage('02_08', '검색 종료'),
    ],
    officialVersionBoundary: versionBoundary,
    officialLevels: serviceLevels,
    sourceNote: '공식 개요의 사용성 가이드라인에 표시된 적용 수준을 기준으로 한다.',
  },
  {
    id: 'login',
    slug: 'login',
    category: '서비스 패턴',
    title: '로그인',
    description:
      '사용자의 신원을 확인하여 서비스에 접근하도록 하는 과정이다. 인증 방식 선택, 정보 입력, 완료와 로그아웃 흐름을 고려한다.',
    officialOverview: 'https://www.krds.go.kr/html/site/service/service_03_01.html',
    officialExample: 'https://www.krds.go.kr/html/site/service/service_03_02.html',
    officialChecklist: serviceChecklist,
    officialStageLinks: [
      stage('03_02', '로그인 기능 찾기'),
      stage('03_03', '로그인 안내'),
      stage('03_04', '로그인 방식 확인/선택'),
      stage('03_05', '로그인 정보 입력'),
      stage('03_06', '로그인 완료'),
      stage('03_07', '서비스 이용'),
      stage('03_08', '로그아웃'),
    ],
    officialVersionBoundary: versionBoundary,
    officialLevels: serviceLevels,
    sourceNote: '공식 개요의 사용성 가이드라인에 표시된 적용 수준을 기준으로 한다.',
  },
  {
    id: 'application',
    slug: 'application',
    category: '서비스 패턴',
    title: '신청',
    description:
      '사용자가 서비스 제공 기관에 요구 사항을 알리기 위해 서식을 작성하는 과업이다. 작성·확정·결과 확인 흐름을 연결한다.',
    officialOverview: 'https://www.krds.go.kr/html/site/service/service_04_01.html',
    officialExample: 'https://www.krds.go.kr/html/site/service/service_04_02.html',
    officialChecklist: serviceChecklist,
    officialStageLinks: [
      stage('04_02', '신청 대상 탐색'),
      stage('04_03', '서비스 정보 확인'),
      stage('04_04', '유의 사항/자격 확인'),
      stage('04_05', '신청서 작성'),
      stage('04_06', '확인/확정'),
      stage('04_07', '완료'),
      stage('04_08', '신청 결과 확인'),
    ],
    officialVersionBoundary: versionBoundary,
    officialLevels: serviceLevels,
    sourceNote: '공식 개요의 사용성 가이드라인에 표시된 적용 수준을 기준으로 한다.',
  },
  {
    id: 'policy',
    slug: 'policy',
    category: '서비스 패턴',
    title: '정책 정보 확인',
    description:
      '디지털 서비스에 게재된 정부·기관의 행동 방침, 계획, 법률과 관련 자료를 확인하는 과업이다.',
    officialOverview: 'https://www.krds.go.kr/html/site/service/service_05_01.html',
    officialExample: 'https://www.krds.go.kr/html/site/service/service_05_02.html',
    officialChecklist: serviceChecklist,
    officialStageLinks: [
      stage('05_02', '정책 탐색'),
      stage('05_03', '정보 확인'),
      stage('05_04', '정책 자료 탐색'),
    ],
    officialVersionBoundary: versionBoundary,
    officialLevels: serviceLevels,
    sourceNote: '공식 개요의 사용성 가이드라인에 표시된 적용 수준을 기준으로 한다.',
  },
];

export const basicPatterns: Pattern[] = [
  {
    id: 'personal-information',
    slug: 'personal-information',
    category: '기본 패턴',
    title: '개인 식별 정보 입력',
    description:
      '개인의 신원을 밝히거나 개인·단체의 기본 정보를 확인하기 위한 정보를 입력받는다. 수집 필요성과 입력 이유를 먼저 설명한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_01.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('01', '개인 식별 정보 입력')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'help',
    slug: 'help',
    category: '기본 패턴',
    title: '도움',
    description:
      '서비스 이용 중 인터페이스 작동 방식, 이용 방법, 진행 중인 과업 흐름과 관련된 도움을 제공한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_02.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('02', '도움')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'consent',
    slug: 'consent',
    category: '기본 패턴',
    title: '동의',
    description:
      '웹사이트 이용 조건과 절차를 읽고 동의하거나 안내 사항을 확인하도록 한다. 약관을 이해하기 쉽게 구조화한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_03.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('03', '동의')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'list',
    slug: 'list',
    category: '기본 패턴',
    title: '목록 탐색',
    description:
      '의미적으로 관련된 다수의 데이터를 일관된 형식과 논리적 순서로 배열하여 원하는 항목을 찾도록 한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_04.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('04', '목록 탐색')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'feedback',
    slug: 'feedback',
    category: '기본 패턴',
    title: '사용자 피드백',
    description:
      '페이지나 기능 이용 경험에 대한 평가, 불편 사항, 제안 사항을 과업을 방해하지 않는 방식으로 수집한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_05.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('05', '사용자 피드백')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'detail',
    slug: 'detail',
    category: '기본 패턴',
    title: '상세 정보 확인',
    description:
      '목록의 제목이나 요약 링크에서 진입한 사용자가 예상한 정보를 명확하고 간결하게 확인하도록 한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_06.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('06', '상세 정보 확인')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'error',
    slug: 'error',
    category: '기본 패턴',
    title: '오류',
    description:
      '요청한 작업을 완료하지 못한 문제를 알리고, 사용자가 본래 수행하려던 행동을 완수하도록 다음 방법을 안내한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_07.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('07', '오류')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'form',
    slug: 'form',
    category: '기본 패턴',
    title: '입력 폼',
    description:
      '하나 이상의 입력 컨트롤로 구성된 콘텐츠 섹션으로 사용자가 데이터를 입력하여 서버로 전송하도록 한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_08.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('08', '입력 폼')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'attachment',
    slug: 'attachment',
    category: '기본 패턴',
    title: '첨부 파일',
    description: '게시물이나 본문에서 사용자가 내려받을 수 있는 콘텐츠를 제공한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_09.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('09', '첨부 파일')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'filter-sort',
    slug: 'filter-sort',
    category: '기본 패턴',
    title: '필터링·정렬',
    description:
      '데이터 집합을 원하는 속성과 범주로 선별하거나 특정 기준으로 조직화하여 목록 탐색 범위를 좁힌다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_10.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('10', '필터링·정렬')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'confirm',
    slug: 'confirm',
    category: '기본 패턴',
    title: '확인',
    description:
      '취소하기 어렵거나 효과·부작용을 인지해야 하는 행위의 내용을 다시 확인하고 승인하도록 하여 오류를 예방한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_11.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('11', '확인')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'mobile-notification',
    slug: 'mobile-notification',
    category: '기본 패턴',
    title: '모바일 알림',
    description:
      '업무 진행 상태나 서비스의 중요한 변화를 적시에 알린다. 푸시 알림, 인앱 알림, 알림함을 상황에 맞게 사용한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_12.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('12', '모바일 알림')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
  {
    id: 'mobile-settings',
    slug: 'mobile-settings',
    category: '기본 패턴',
    title: '모바일 설정',
    description:
      '계정·보안·알림·접근성·언어·데이터·법적 고지를 한 곳에서 조정하게 하며 변경 결과를 예측할 수 있게 한다.',
    officialOverview: basicOverview,
    officialExample: 'https://www.krds.go.kr/html/site/global/global_13.html',
    officialChecklist: basicChecklist,
    officialStageLinks: [basicStage('13', '모바일 설정')],
    officialVersionBoundary: versionBoundary,
    sourceNote: basicSourceNote,
  },
];

export const allPatterns = [...servicePatterns, ...basicPatterns];

export function findPattern(id: string): Pattern {
  const pattern = allPatterns.find((item) => item.id === id);
  if (!pattern) throw new Error(`알 수 없는 KRDS 패턴: ${id}`);
  return pattern;
}
