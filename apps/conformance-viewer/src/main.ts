import './styles.css';

type EvidenceStatus = 'unverified' | 'implemented' | 'passing' | 'failing' | string;

interface CheckResult {
  passed: boolean;
  skipped?: boolean;
  [key: string]: unknown;
}

interface RuntimeResult {
  fixtureId: string;
  componentId: string;
  framework: string;
  state: string;
  status: string;
  checks: Record<string, CheckResult>;
}

interface FixtureEvidence {
  fixtureId: string;
  status: EvidenceStatus;
  errors?: string[];
}

interface FrameworkEvidence {
  framework: string;
  status: EvidenceStatus;
  fixtureResults: FixtureEvidence[];
  unresolvedSelectors: string[];
  errata: string[];
  errors: string[];
  source?: string;
}

interface RuntimeReport {
  schemaVersion: number;
  reportType?: string;
  generatedAt: string;
  upstream: {
    repository: string;
    ref: string;
    commit: string;
    packageVersion: string;
    snapshotIntegrity?: string;
  };
  browser: {
    name: string;
    version: string;
  };
  fixtureCount: number;
  executableFixtureCount?: number;
  evidenceCount?: number;
  stateCount: number;
  frameworks: Array<string | FrameworkEvidence>;
  evidence?: FrameworkEvidence[];
  results: RuntimeResult[];
  strictConformance: boolean;
  unresolvedCount?: number;
  errataCount?: number;
  failures?: string[];
}

interface FrameworkStats {
  framework: string;
  evidence?: FrameworkEvidence;
  results: RuntimeResult[];
  testedFixtures: number;
  failingFixtures: number;
  passingStates: number;
  failingStates: number;
  failedChecks: number;
  skippedChecks: number;
  runtimePassing: boolean;
}

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Conformance viewer root is missing');

const reportUrl = new URL('reports/conformance-runtime.json', document.baseURI).toString();
const strictReportType = 'runtime-strict-evidence';
const pageSize = 40;
const styledEvidenceStatuses: Record<string, true> = {
  passing: true,
  failing: true,
  implemented: true,
  unverified: true,
};

const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (className !== undefined) element.className = className;
  return element;
};

const textElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className?: string,
): HTMLElementTagNameMap[K] => {
  const element = createElement(tag, className);
  element.textContent = text;
  return element;
};

const createLink = (label: string, href: string): HTMLAnchorElement => {
  const link = createElement('a');
  link.href = href;
  link.textContent = label;
  return link;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFrameworkEvidence = (value: unknown): value is FrameworkEvidence =>
  isRecord(value) &&
  typeof value.framework === 'string' &&
  typeof value.status === 'string' &&
  Array.isArray(value.fixtureResults) &&
  Array.isArray(value.unresolvedSelectors) &&
  Array.isArray(value.errata) &&
  Array.isArray(value.errors);

const parseReport = (value: unknown): RuntimeReport => {
  if (
    !isRecord(value) ||
    typeof value.schemaVersion !== 'number' ||
    typeof value.generatedAt !== 'string' ||
    !isRecord(value.upstream) ||
    typeof value.upstream.repository !== 'string' ||
    typeof value.upstream.ref !== 'string' ||
    typeof value.upstream.commit !== 'string' ||
    typeof value.upstream.packageVersion !== 'string' ||
    !isRecord(value.browser) ||
    typeof value.browser.name !== 'string' ||
    typeof value.browser.version !== 'string' ||
    !Array.isArray(value.frameworks) ||
    !Array.isArray(value.results) ||
    typeof value.stateCount !== 'number' ||
    typeof value.fixtureCount !== 'number' ||
    typeof value.strictConformance !== 'boolean'
  ) {
    throw new Error('파일이 runtime conformance report 계약을 충족하지 않습니다.');
  }

  for (const result of value.results) {
    if (
      !isRecord(result) ||
      typeof result.fixtureId !== 'string' ||
      typeof result.componentId !== 'string' ||
      typeof result.framework !== 'string' ||
      typeof result.state !== 'string' ||
      typeof result.status !== 'string' ||
      !isRecord(result.checks) ||
      Object.values(result.checks).some(
        (check) => !isRecord(check) || typeof check.passed !== 'boolean',
      )
    ) {
      throw new Error('runtime report에 잘못된 fixture/state/check 결과가 있습니다.');
    }
  }

  return value as unknown as RuntimeReport;
};

const authoritativeEvidence = (report: RuntimeReport): FrameworkEvidence[] => {
  const strictFrameworks = report.frameworks.filter(isFrameworkEvidence);
  if (strictFrameworks.length > 0) return strictFrameworks;
  return (report.evidence ?? []).filter(isFrameworkEvidence);
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeStyle: 'long',
  }).format(date);
};

const formatValue = (value: unknown): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  }
  const serialized = JSON.stringify(value, null, 2);
  return serialized ?? String(value);
};

const appendDefinition = (
  list: HTMLDListElement,
  term: string,
  value: string | Node,
): void => {
  list.append(textElement('dt', term));
  const description = createElement('dd');
  description.append(typeof value === 'string' ? document.createTextNode(value) : value);
  list.append(description);
};

const statusChip = (status: EvidenceStatus, label = status): HTMLSpanElement => {
  const chip = textElement('span', label, 'status-chip');
  chip.dataset.status = styledEvidenceStatuses[status] ? status : 'unverified';
  return chip;
};

const createSection = (
  number: string,
  id: string,
  title: string,
  introduction: string,
): HTMLElement => {
  const section = createElement('section', 'section');
  section.id = id;
  const headingRow = createElement('div', 'section-heading');
  headingRow.append(textElement('span', number, 'section-number'));
  const heading = textElement('h2', title);
  heading.id = `${id}-heading`;
  heading.tabIndex = -1;
  headingRow.append(heading);
  section.setAttribute('aria-labelledby', heading.id);
  section.append(headingRow, textElement('p', introduction, 'section-intro'));
  return section;
};

const frameworkReportLink = (framework: string): string => {
  const url = new URL(window.location.href);
  url.searchParams.set('framework', framework);
  url.searchParams.delete('check');
  url.searchParams.delete('q');
  url.hash = 'failures';
  return url.toString();
};

const failedCheckEntries = (result: RuntimeResult): Array<[string, CheckResult]> =>
  Object.entries(result.checks).filter((entry) => entry[1].passed === false);

const skippedCheckEntries = (result: RuntimeResult): Array<[string, CheckResult]> =>
  Object.entries(result.checks).filter((entry) => entry[1].skipped === true);

const collectFrameworkStats = (
  report: RuntimeReport,
  evidence: FrameworkEvidence[],
): FrameworkStats[] => {
  const names = [
    ...evidence.map((entry) => entry.framework),
    ...report.results.map((result) => result.framework),
  ].filter((name, index, values) => values.indexOf(name) === index);

  return names.map((framework) => {
    const results = report.results.filter((result) => result.framework === framework);
    const frameworkEvidence = evidence.find((entry) => entry.framework === framework);
    const testedFixtures = new Set(results.map((result) => result.fixtureId)).size;
    const failingFixtures = new Set(
      results
        .filter((result) => result.status !== 'passing')
        .map((result) => result.fixtureId),
    ).size;
    const passingStates = results.filter((result) => result.status === 'passing').length;
    const failingStates = results.length - passingStates;
    const failedChecks = results.reduce(
      (count, result) => count + failedCheckEntries(result).length,
      0,
    );
    const skippedChecks = results.reduce(
      (count, result) => count + skippedCheckEntries(result).length,
      0,
    );
    const runtimePassing =
      report.reportType === strictReportType &&
      frameworkEvidence?.status === 'passing' &&
      results.length > 0 &&
      failingStates === 0;

    const stats: FrameworkStats = {
      framework,
      results,
      testedFixtures,
      failingFixtures,
      passingStates,
      failingStates,
      failedChecks,
      skippedChecks,
      runtimePassing,
    };
    if (frameworkEvidence !== undefined) stats.evidence = frameworkEvidence;
    return stats;
  });
};

const reportIntegrityWarnings = (
  report: RuntimeReport,
  stats: FrameworkStats[],
  evidence: FrameworkEvidence[],
): string[] => {
  const warnings: string[] = [];
  if (report.reportType !== strictReportType) {
    warnings.push(
      `reportType이 ${strictReportType}이 아니므로 엄격 통과 표시는 보류됩니다.`,
    );
  }
  if (report.results.length !== report.stateCount) {
    warnings.push(
      `기록된 stateCount(${report.stateCount})와 실제 결과 수(${report.results.length})가 다릅니다.`,
    );
  }
  if (evidence.length === 0) {
    warnings.push('프레임워크 runtime evidence가 없습니다.');
  }
  for (const framework of stats) {
    if (framework.evidence === undefined) {
      warnings.push(`${framework.framework}: FrameworkEvidence가 없습니다.`);
    }
    if (framework.results.length === 0) {
      warnings.push(`${framework.framework}: state/check 결과가 없습니다.`);
    }
  }
  const derivedPassing =
    stats.length > 0 &&
    stats.every((framework) => framework.runtimePassing) &&
    report.results.length === report.stateCount;
  if (report.strictConformance !== derivedPassing) {
    warnings.push(
      `strictConformance(${String(report.strictConformance)})와 evidence에서 재계산한 결과(${String(derivedPassing)})가 다릅니다.`,
    );
  }
  return warnings;
};

const renderHeader = (report: RuntimeReport): HTMLElement => {
  const header = createElement('header', 'report-header');
  header.append(
    textElement('p', 'Runtime evidence ledger', 'report-kicker'),
    textElement('h1', 'KRDS conformance 대시보드'),
    textElement(
      'p',
      `${formatDate(report.generatedAt)}에 생성된 브라우저 실행 결과를 그대로 탐색합니다. manifest의 구현 표시는 통과 증거로 계산하지 않습니다.`,
    ),
  );
  const navigation = createElement('nav', 'report-nav');
  navigation.setAttribute('aria-label', '리포트 섹션');
  navigation.append(
    createLink('판정', '#verdict'),
    createLink('프레임워크 결과', '#frameworks'),
    createLink('출처', '#provenance'),
    createLink('실패 상세', '#failures'),
    createLink('Evidence 진단', '#evidence'),
    createLink('검사 방법', '#methodology'),
  );
  header.append(navigation);
  return header;
};

const renderVerdict = (
  report: RuntimeReport,
  stats: FrameworkStats[],
  warnings: string[],
): HTMLElement => {
  const section = createSection(
    '01',
    'verdict',
    '현재 판정',
    '통과는 runtime-strict-evidence 계약, 완전한 state 결과, 프레임워크별 passing evidence가 모두 일치할 때만 표시합니다.',
  );
  const proofComplete =
    report.strictConformance &&
    report.reportType === strictReportType &&
    report.results.length === report.stateCount &&
    stats.length > 0 &&
    stats.every((framework) => framework.runtimePassing);
  const verdictStatus = proofComplete
    ? 'passing'
    : report.strictConformance
      ? 'unverified'
      : 'failing';
  const verdictLabel =
    verdictStatus === 'passing'
      ? '엄격 통과'
      : verdictStatus === 'failing'
        ? '엄격 미통과'
        : '통과 증거 불완전';
  const verdict = createElement('div', 'verdict');
  verdict.dataset.status = verdictStatus;
  verdict.append(textElement('div', verdictLabel, 'verdict-mark'));
  const copy = createElement('div', 'verdict-copy');
  copy.append(
    textElement(
      'h3',
      proofComplete ? '현재 report가 엄격 통과를 증명합니다.' : '현재 report로 엄격 통과를 주장하지 않습니다.',
    ),
    textElement(
      'p',
      proofComplete
        ? '모든 기록된 framework fixture/state/check와 FrameworkEvidence가 passing으로 일치합니다.'
        : '아래 프레임워크 요약과 실패 상세에서 실제 failing state와 check를 확인하세요. passing state 수는 전체 conformance 또는 접근성 인증을 뜻하지 않습니다.',
    ),
  );
  verdict.append(copy);
  section.append(verdict);

  const passingStates = report.results.filter((result) => result.status === 'passing').length;
  const failingStates = report.results.length - passingStates;
  const skippedChecks = report.results.reduce(
    (count, result) => count + skippedCheckEntries(result).length,
    0,
  );
  const executableFixtures =
    report.executableFixtureCount ??
    new Set(report.results.map((result) => result.fixtureId)).size;
  const metrics = createElement('div', 'metric-grid');
  for (const [value, label] of [
    [String(stats.length), 'evidence가 기록된 프레임워크'],
    [String(executableFixtures), '고유 실행 fixture'],
    [String(report.results.length), '기록된 state 결과'],
    [String(passingStates), 'passing state'],
    [String(failingStates), 'passing이 아닌 state'],
    [String(skippedChecks), 'skipped check'],
  ] satisfies Array<[string, string]>) {
    const metric = createElement('div', 'metric');
    metric.append(
      textElement('span', value, 'metric-value'),
      textElement('span', label, 'metric-label'),
    );
    metrics.append(metric);
  }
  section.append(metrics);

  for (const warning of warnings) {
    section.append(textElement('p', warning, 'integrity-note'));
  }
  return section;
};

const renderFrameworks = (stats: FrameworkStats[]): HTMLElement => {
  const section = createSection(
    '02',
    'frameworks',
    '프레임워크별 runtime 결과',
    '각 수치는 이 report의 results와 FrameworkEvidence에서 계산합니다. package export 또는 manifest inventory만으로 통과를 표시하지 않습니다.',
  );
  const wrapper = createElement('div', 'table-wrap');
  const table = createElement('table');
  table.append(textElement('caption', '프레임워크별 실행 evidence 요약'));
  const head = createElement('thead');
  const headRow = createElement('tr');
  for (const label of [
    '프레임워크',
    'Evidence 판정',
    'Fixture (실패)',
    'State 통과 / 전체',
    '실패 check',
    'Skipped check',
    '상세',
  ]) {
    const cell = textElement('th', label);
    cell.scope = 'col';
    headRow.append(cell);
  }
  head.append(headRow);
  const body = createElement('tbody');
  for (const framework of stats) {
    const row = createElement('tr');
    const name = textElement('th', framework.framework);
    name.scope = 'row';
    const status = createElement('td');
    status.append(
      statusChip(
        framework.runtimePassing ? 'passing' : 'failing',
        framework.runtimePassing
          ? 'runtime 통과'
          : `미통과 · ${framework.evidence?.status ?? 'evidence 없음'}`,
      ),
    );
    const detail = createElement('td');
    detail.append(
      createLink(
        `${framework.failingStates}개 failing state 보기`,
        frameworkReportLink(framework.framework),
      ),
    );
    row.append(
      name,
      status,
      textElement('td', `${framework.testedFixtures} (${framework.failingFixtures})`),
      textElement('td', `${framework.passingStates} / ${framework.results.length}`),
      textElement('td', String(framework.failedChecks)),
      textElement('td', String(framework.skippedChecks)),
      detail,
    );
    body.append(row);
  }
  table.append(head, body);
  wrapper.append(table);
  section.append(wrapper);
  return section;
};

const renderProvenance = (
  report: RuntimeReport,
  evidence: FrameworkEvidence[],
): HTMLElement => {
  const section = createSection(
    '03',
    'provenance',
    'Evidence 출처와 재현 정보',
    '아래 값은 report에 기록된 provenance입니다. 원본 JSON이 정본이며, 대시보드는 판정을 덮어쓰지 않습니다.',
  );
  const grid = createElement('div', 'provenance-grid');

  const reportCard = createElement('article', 'provenance-card');
  reportCard.append(textElement('h3', 'Runtime report'));
  const reportList = createElement('dl', 'provenance-list');
  const time = createElement('time');
  time.dateTime = report.generatedAt;
  time.textContent = formatDate(report.generatedAt);
  appendDefinition(reportList, 'generatedAt', time);
  appendDefinition(reportList, 'reportType', report.reportType ?? '<기록 없음>');
  appendDefinition(reportList, 'schemaVersion', String(report.schemaVersion));
  appendDefinition(reportList, 'raw evidence', createLink('JSON 원본 열기', reportUrl));
  appendDefinition(reportList, 'strictConformance', String(report.strictConformance));
  if (report.evidenceCount !== undefined) {
    appendDefinition(reportList, 'evidenceCount', String(report.evidenceCount));
  }
  reportCard.append(reportList);

  const upstreamCard = createElement('article', 'provenance-card');
  upstreamCard.append(textElement('h3', '고정된 KRDS upstream'));
  const upstreamList = createElement('dl', 'provenance-list');
  const encodedRepository = report.upstream.repository
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const upstreamUrl = `https://github.com/${encodedRepository}/tree/${encodeURIComponent(report.upstream.commit)}`;
  appendDefinition(
    upstreamList,
    'repository',
    createLink(report.upstream.repository, upstreamUrl),
  );
  appendDefinition(upstreamList, 'ref', report.upstream.ref);
  appendDefinition(upstreamList, 'commit', textElement('code', report.upstream.commit));
  appendDefinition(upstreamList, 'packageVersion', report.upstream.packageVersion);
  if (report.upstream.snapshotIntegrity !== undefined) {
    appendDefinition(
      upstreamList,
      'snapshotIntegrity',
      textElement('code', report.upstream.snapshotIntegrity),
    );
  }
  upstreamCard.append(upstreamList);

  const runnerCard = createElement('article', 'provenance-card');
  runnerCard.append(textElement('h3', '실행 환경'));
  const runnerList = createElement('dl', 'provenance-list');
  appendDefinition(runnerList, 'browser', `${report.browser.name} ${report.browser.version}`);
  const sources = [...new Set(evidence.map((entry) => entry.source).filter(Boolean))] as string[];
  appendDefinition(
    runnerList,
    'evidence source',
    sources.length > 0 ? sources.join(', ') : '<기록 없음>',
  );
  appendDefinition(runnerList, 'stateCount', `${report.results.length} (기록: ${report.stateCount})`);
  appendDefinition(
    runnerList,
    'fixtureCount',
    String(report.executableFixtureCount ?? report.fixtureCount),
  );
  runnerCard.append(runnerList);

  grid.append(reportCard, upstreamCard, runnerCard);
  section.append(grid);
  section.append(
    textElement(
      'p',
      '현재 report schema에는 community 저장소 commit이 별도 필드로 기록되지 않습니다. source는 runner 경로이며, upstream commit과 동일한 의미가 아닙니다. 실행 코드 revision을 확인할 때는 report가 생성된 CI run 또는 저장소 commit을 함께 보존해야 합니다.',
      'warning-note',
    ),
  );
  return section;
};

const appendEvidenceField = (
  parent: HTMLElement,
  title: string,
  value: unknown,
): void => {
  const field = createElement('div', 'evidence-field');
  field.append(textElement('h4', title));
  if (title === 'errors' && Array.isArray(value)) {
    const list = createElement('ul', 'error-list');
    for (const error of value) list.append(textElement('li', formatValue(error)));
    field.append(list);
  } else if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    field.append(textElement('p', String(value)));
  } else {
    field.append(textElement('pre', formatValue(value)));
  }
  parent.append(field);
};

const renderFailureCard = (
  result: RuntimeResult,
  selectedCheck: string,
): HTMLDetailsElement => {
  const card = createElement('details', 'failure-card');
  const idSource = `${result.framework}-${result.fixtureId}-${result.state}`;
  card.id = `failure-${idSource.replace(/[^a-z0-9_-]+/gi, '-')}`;
  const summary = createElement('summary');
  const title = createElement('span', 'failure-title');
  title.append(
    statusChip('failing', '실패'),
    textElement('strong', `${result.componentId} · ${result.state}`),
    textElement('span', `${result.framework} / ${result.fixtureId}`, 'failure-meta'),
  );
  summary.append(title);
  card.append(summary);

  const body = createElement('div', 'failure-body');
  const checks = failedCheckEntries(result).filter(
    ([name]) => selectedCheck === '' || name === selectedCheck,
  );
  if (checks.length === 0) {
    body.append(
      textElement(
        'p',
        'state는 failing이지만 선택한 failed check 데이터가 없습니다. 원본 JSON을 확인하세요.',
        'warning-note',
      ),
    );
  }
  for (const [name, check] of checks) {
    const checkCard = createElement('details', 'check-card');
    checkCard.append(textElement('summary', `${name} · 실패`));
    const checkBody = createElement('div', 'check-body');
    const fields = Object.entries(check).filter(([key]) => key !== 'passed');
    if (fields.length === 0) {
      checkBody.append(
        textElement('p', '추가 진단 값이 기록되지 않았습니다.', 'warning-note'),
      );
    }
    for (const [key, value] of fields) appendEvidenceField(checkBody, key, value);
    checkCard.append(checkBody);
    body.append(checkCard);
  }
  card.append(body);
  return card;
};

const renderFailures = (
  report: RuntimeReport,
  stats: FrameworkStats[],
): HTMLElement => {
  const section = createSection(
    '04',
    'failures',
    'Fixture · state · check 실패 상세',
    'passing이 아닌 state만 표시합니다. 각 항목을 열면 실패한 check의 error, expected, actual과 측정값을 원본 그대로 확인할 수 있습니다.',
  );
  const failingResults = report.results
    .filter((result) => result.status !== 'passing')
    .sort(
      (left, right) =>
        left.framework.localeCompare(right.framework) ||
        left.componentId.localeCompare(right.componentId) ||
        left.fixtureId.localeCompare(right.fixtureId) ||
        left.state.localeCompare(right.state),
    );
  const observedChecks = [
    ...new Set(failingResults.flatMap((result) => failedCheckEntries(result).map(([name]) => name))),
  ].sort();

  const form = createElement('form', 'filters');
  form.setAttribute('role', 'search');
  form.addEventListener('submit', (event) => event.preventDefault());

  const frameworkField = createElement('div', 'filter-field');
  const frameworkLabel = textElement('label', '프레임워크', 'filter-label');
  frameworkLabel.htmlFor = 'framework-filter';
  const frameworkSelect = createElement('select');
  frameworkSelect.id = 'framework-filter';
  const allFrameworks = textElement('option', '모든 프레임워크');
  allFrameworks.value = '';
  frameworkSelect.append(allFrameworks);
  for (const framework of stats) {
    const option = textElement('option', framework.framework);
    option.value = framework.framework;
    frameworkSelect.append(option);
  }
  frameworkField.append(frameworkLabel, frameworkSelect);

  const checkField = createElement('div', 'filter-field');
  const checkLabel = textElement('label', '실패 check', 'filter-label');
  checkLabel.htmlFor = 'check-filter';
  const checkSelect = createElement('select');
  checkSelect.id = 'check-filter';
  const allChecks = textElement('option', '모든 실패 check');
  allChecks.value = '';
  checkSelect.append(allChecks);
  for (const check of observedChecks) {
    const option = textElement('option', check);
    option.value = check;
    checkSelect.append(option);
  }
  checkField.append(checkLabel, checkSelect);

  const searchField = createElement('div', 'filter-field');
  const searchLabel = textElement('label', 'Fixture / component / state 검색', 'filter-label');
  searchLabel.htmlFor = 'failure-search';
  const searchInput = createElement('input');
  searchInput.id = 'failure-search';
  searchInput.type = 'search';
  searchInput.autocomplete = 'off';
  searchInput.placeholder = '예: accordion, focus-visible';
  searchField.append(searchLabel, searchInput);
  form.append(frameworkField, checkField, searchField);
  section.append(form);

  const query = new URLSearchParams(window.location.search);
  const initialFramework = query.get('framework') ?? '';
  const initialCheck = query.get('check') ?? '';
  if (stats.some((framework) => framework.framework === initialFramework)) {
    frameworkSelect.value = initialFramework;
  }
  if (observedChecks.includes(initialCheck)) checkSelect.value = initialCheck;
  searchInput.value = query.get('q') ?? '';

  const toolbar = createElement('div', 'result-toolbar');
  const count = textElement('p', '', 'result-count');
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');
  toolbar.append(count);
  section.append(toolbar);

  const list = createElement('ol', 'failure-list');
  const more = textElement('button', '다음 실패 더 보기', 'load-more');
  more.type = 'button';
  section.append(list, more);

  let visibleLimit = pageSize;
  const renderList = (): void => {
    const normalizedSearch = searchInput.value.trim().toLocaleLowerCase('ko');
    const filtered = failingResults.filter((result) => {
      if (frameworkSelect.value !== '' && result.framework !== frameworkSelect.value) return false;
      if (
        checkSelect.value !== '' &&
        result.checks[checkSelect.value]?.passed !== false
      ) {
        return false;
      }
      if (normalizedSearch === '') return true;
      return [result.framework, result.componentId, result.fixtureId, result.state]
        .join(' ')
        .toLocaleLowerCase('ko')
        .includes(normalizedSearch);
    });
    const visible = filtered.slice(0, visibleLimit);
    list.replaceChildren(
      ...visible.map((result) => {
        const item = createElement('li');
        item.append(renderFailureCard(result, checkSelect.value));
        return item;
      }),
    );
    if (filtered.length === 0) {
      const item = createElement('li', 'empty-state');
      item.textContent = '조건에 맞는 failing state가 없습니다.';
      list.append(item);
    }
    count.textContent = `${filtered.length}개 failing state 중 ${visible.length}개 표시`;
    more.hidden = visible.length >= filtered.length;

    const nextQuery = new URLSearchParams(window.location.search);
    for (const [name, value] of [
      ['framework', frameworkSelect.value],
      ['check', checkSelect.value],
      ['q', searchInput.value.trim()],
    ] satisfies Array<[string, string]>) {
      if (value === '') nextQuery.delete(name);
      else nextQuery.set(name, value);
    }
    const queryString = nextQuery.toString();
    const failureFiltersActive =
      frameworkSelect.value !== '' || checkSelect.value !== '' || searchInput.value.trim() !== '';
    const nextHash = failureFiltersActive ? '#failures' : window.location.hash;
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${queryString === '' ? '' : `?${queryString}`}${nextHash}`,
    );
  };

  const resetAndRender = (): void => {
    visibleLimit = pageSize;
    renderList();
  };
  frameworkSelect.addEventListener('change', resetAndRender);
  checkSelect.addEventListener('change', resetAndRender);
  searchInput.addEventListener('input', resetAndRender);
  more.addEventListener('click', () => {
    visibleLimit += pageSize;
    renderList();
    list.lastElementChild?.scrollIntoView({ block: 'nearest' });
  });
  renderList();
  return section;
};

const appendDiagnosticList = (
  parent: HTMLElement,
  title: string,
  values: string[],
): void => {
  if (values.length === 0) return;
  const disclosure = createElement('details', 'disclosure-card');
  disclosure.append(textElement('summary', `${title} · ${values.length}`));
  const body = createElement('div', 'check-body');
  const list = createElement('ul', 'error-list');
  for (const value of values) list.append(textElement('li', value));
  body.append(list);
  disclosure.append(body);
  parent.append(disclosure);
};

const renderEvidence = (
  report: RuntimeReport,
  stats: FrameworkStats[],
): HTMLElement => {
  const section = createSection(
    '05',
    'evidence',
    'FrameworkEvidence 진단',
    '엄격 report의 프레임워크별 evidence를 그대로 표시합니다. failing fixture, unresolved selector, errata와 runner error는 숨기거나 waiver로 통과 처리하지 않습니다.',
  );
  const list = createElement('div', 'fixture-diagnostics');
  for (const framework of stats) {
    const card = createElement('details', 'evidence-card');
    const summary = createElement('summary');
    const summaryContent = createElement('span', 'failure-title');
    summaryContent.append(
      statusChip(framework.evidence?.status ?? 'unverified'),
      textElement('strong', framework.framework),
      textElement(
        'span',
        `${framework.evidence?.fixtureResults.filter((fixture) => fixture.status !== 'passing').length ?? 0}개 failing fixture evidence`,
        'failure-meta',
      ),
    );
    summary.append(summaryContent);
    card.append(summary);
    const body = createElement('div', 'evidence-body');
    if (framework.evidence === undefined) {
      body.append(
        textElement(
          'p',
          '이 프레임워크의 FrameworkEvidence가 report에 없습니다.',
          'error-message',
        ),
      );
    } else {
      const metadata = createElement('dl', 'provenance-list');
      appendDefinition(metadata, 'status', framework.evidence.status);
      appendDefinition(metadata, 'source', framework.evidence.source ?? '<기록 없음>');
      appendDefinition(
        metadata,
        'fixtureResults',
        String(framework.evidence.fixtureResults.length),
      );
      body.append(metadata);
      appendDiagnosticList(body, 'unresolved selectors', framework.evidence.unresolvedSelectors);
      appendDiagnosticList(body, 'errata', framework.evidence.errata);
      appendDiagnosticList(body, 'framework errors', framework.evidence.errors);

      const failingFixtures = framework.evidence.fixtureResults.filter(
        (fixture) => fixture.status !== 'passing',
      );
      if (failingFixtures.length > 0) {
        const fixtureList = createElement('ul', 'fixture-diagnostics');
        for (const fixture of failingFixtures) {
          const item = createElement('li');
          const fixtureCard = createElement('details', 'check-card');
          fixtureCard.append(
            textElement(
              'summary',
              `${fixture.fixtureId} · ${fixture.status} · ${fixture.errors?.length ?? 0}개 진단`,
            ),
          );
          const fixtureBody = createElement('div', 'check-body');
          if ((fixture.errors?.length ?? 0) === 0) {
            fixtureBody.append(
              textElement('p', '추가 error 문자열이 기록되지 않았습니다.', 'warning-note'),
            );
          } else {
            const errors = createElement('ul', 'error-list');
            for (const error of fixture.errors ?? []) errors.append(textElement('li', error));
            fixtureBody.append(errors);
          }
          fixtureCard.append(fixtureBody);
          item.append(fixtureCard);
          fixtureList.append(item);
        }
        body.append(fixtureList);
      }
    }
    card.append(body);
    list.append(card);
  }
  section.append(list);

  if ((report.failures?.length ?? 0) > 0) {
    const failures = createElement('div', 'diagnostic-card');
    failures.append(textElement('h3', 'Strict report failures'));
    const failureList = createElement('ul', 'error-list');
    for (const failure of report.failures ?? []) failureList.append(textElement('li', failure));
    failures.append(failureList);
    section.append(failures);
  }
  return section;
};

const renderMethodology = (): HTMLElement => {
  const section = createSection(
    '06',
    'methodology',
    '이 report가 검사하는 것',
    '고정된 upstream HTML fixture와 각 framework host를 같은 state/action/viewport에서 실행해 비교합니다. 개별 check 결과는 실패 상세의 원본 값으로 확인할 수 있습니다.',
  );
  const methods: Array<[string, string]> = [
    ['render', 'host 준비 여부와 browser runtime·console 오류를 기록합니다.'],
    ['dom', '정규화 규칙을 적용한 upstream DOM과 framework DOM을 비교합니다.'],
    ['accessibility', 'ARIA snapshot을 비교하고 적용된 errata를 결과에 남깁니다.'],
    ['behavior', 'fixture action 뒤 DOM 변화와 framework event 기록을 확인합니다.'],
    ['form', 'native form의 name, value, disabled 상태 등을 비교합니다.'],
    [
      'visual',
      'pixel과 computed style을 비교합니다. skipped=true이면 visual 통과 증거로 해석하지 않습니다.',
    ],
    ['contract', 'semantic element, role, required/forbidden attribute 계약을 검사합니다.'],
  ];
  const list = createElement('ul', 'method-list');
  for (const [name, description] of methods) {
    const item = createElement('li');
    item.append(textElement('code', name), document.createTextNode(` — ${description}`));
    list.append(item);
  }
  section.append(list);
  section.append(
    textElement(
      'p',
      '이 결과는 고정된 fixture 범위의 회귀 evidence이며 대한민국 정부의 인증, KRDS 전체 준수, WCAG 전체 감사 또는 실제 서비스 품질 승인을 의미하지 않습니다.',
      'warning-note',
    ),
  );
  return section;
};

const renderReport = (report: RuntimeReport): void => {
  const evidence = authoritativeEvidence(report);
  const stats = collectFrameworkStats(report, evidence);
  const warnings = reportIntegrityWarnings(report, stats, evidence);
  const footer = createElement('footer', 'report-footer');
  footer.append(
    document.createTextNode('이 화면은 read-only presentation입니다. 판정 정본: '),
    createLink('conformance-runtime.json', reportUrl),
    document.createTextNode(' · Manifest catalog와 runtime evidence를 구분해 해석하세요.'),
  );
  root.replaceChildren(
    renderHeader(report),
    renderVerdict(report, stats, warnings),
    renderFrameworks(stats),
    renderProvenance(report, evidence),
    renderFailures(report, stats),
    renderEvidence(report, stats),
    renderMethodology(),
    footer,
  );
  root.setAttribute('aria-busy', 'false');
};

const renderError = (error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error);
  const header = createElement('header', 'report-header');
  header.append(
    textElement('p', 'Runtime evidence unavailable', 'report-kicker'),
    textElement('h1', '리포트를 표시할 수 없습니다'),
    textElement(
      'p',
      'manifest나 package inventory를 대신 표시하지 않습니다. runtime evidence를 생성한 뒤 다시 빌드하세요.',
    ),
  );
  const section = createSection(
    '!',
    'report-error',
    'Runtime report 오류',
    '통과 상태를 추정하지 않고 오류를 그대로 표시합니다.',
  );
  section.append(
    textElement('p', message, 'error-message'),
    textElement(
      'p',
      '로컬에서는 pnpm test:conformance:runtime을 실행한 뒤 viewer를 다시 시작하세요.',
    ),
    createLink('예상 report URL 열기', reportUrl),
  );
  root.replaceChildren(header, section);
  root.setAttribute('aria-busy', 'false');
};

const render = async (): Promise<void> => {
  root.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(reportUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`runtime report 요청 실패: HTTP ${response.status}`);
    }
    renderReport(parseReport(await response.json()));
  } catch (error) {
    renderError(error);
  }
};

void render();
