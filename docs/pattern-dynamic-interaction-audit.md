# 패턴 정적-동적 상호작용 감사

감사일: 2026-08-04
대상: `apps/docs/src/content/docs/basic-patterns/*.mdx`(13개) + `service-patterns/*.mdx`(5개), 총 18개 패턴 문서
공식 대조: `audit-input/krds-official-html/` (KRDS 공식 HTML 컴포넌트 키트 스냅샷)
결론: 코드 변경 없음. 발견 사항과 후속 과제 후보만 기록.

## 요약

| ID | 패턴 페이지 | 섹션 | 가이드라인 (요약) | 유형 | docs 위치 | 공식 가이드 위치 |
|---|---|---|---|---|---|---|
| F1 | service-patterns/search.mdx | 검색어 입력 도움 | "검색어 입력 도움은 가능한 사용자가 검색어를 입력하는 시점에 실시간으로 제공한다" — 실시간 검색어 제안 | A | 2103-2104, 2106-2270(구현); 1064-1065, 1067-1370(구현); 1914-1917, 1920, ~1923-2098(구현) | service_02_03.html 구조 #7(1172-1174), 상호작용 가이드라인(1415-1491), 접근성 Status Messages(1388-1393) |
| F2 | service-patterns/login.mdx | 로그인 정보 입력 | "실시간 유효성 검사는 입력 필드가 포커스를 잃을 때 발생" + "제출 시 오류가 발생한 경우 해당 항목으로 초점을 이동" | A | 3885-3889, 3006-3880(구현) | service_03_05.html 상호작용 가이드라인(1285-1297) |
| F3 | basic-patterns/filter-sort.mdx | 정보 조회와 표시 | "즉각 표시(Instant display) — 사용자가 옵션을 선택하자마자 필터링·정렬·조회 동작이 실행" | A | 64, 90-1164(구현) | global_10.html 상호작용 가이드라인(1541-1615) |
| F4 | basic-patterns/form.mdx | (가이드라인 자체 미복사) | "클라이언트 측 검증은 브라우저에서 실시간으로 사용자의 입력을 확인" (Keyup/Focusout) | A+B | 1536-1818(정적 `state="error"` 예시) — 가이드라인 텍스트 0건 | global_08.html 상호작용 가이드라인(1438-1518) |
| F5 | basic-patterns/mobile-settings.mdx | 모바일 설정 | "설정 변경은 즉시 적용하며 간결한 피드백 제공" + "저장 버튼은 입력이 유효할 때만 활성화" | A (구현 부재) | 31, 35, 37-38 — 파일 44행, 예시 0건 | global_13.html 사용성 가이드라인(1060-1093) |
| B1 | (시스템성) | 18개 패턴 mdx 전체 | 공식 상호작용 가이드라인(키보드 계약 테이블: 방향키↑↓/Enter/Esc/Keyup/Focusout 등) 미반영 | B | 18개 mdx `상호작용\|방향키\|Focusin\|Keyup\|Focusout` 0건 | global_03.html(1318-1395), global_05.html(1314-1405), global_08.html(1438-1518), global_10.html(1541-1615), service_02_03.html(1415-1491), service_03_05.html(1285-1297) |
| OK-1 | basic-patterns/error.mdx | 오류 메시지 | "오류가 발생한 지점을 즉시 파악하고 수정" — 인라인 메시지 배치 안내(정적) | 제외 | 16 | — |
| OK-2 | basic-patterns/feedback.mdx | frontmatter | description "제안을 수집하는 기본 패턴" — 가이드라인 아님 | 제외 | 3 | — |
| OK-3 | basic-patterns/mobile-notification.mdx | 알림 유형·우선순위 | 스낵바/바텀시트 "즉각적인 반응을 유도" 문구 안내(23), 알림 우선순위 "긴급(즉시 조치 필요)" 분류(36) — 동적 상호작용 규정 아님 | 제외 | 23, 36 | — |
| OK-4 | basic-patterns/mobile-settings.mdx | 유형 | "토글스위치 — 즉각적인 제어를 목적으로 상태를 전환하는 요소" — 컴포넌트 정의 문구 | 제외 | 19 | — |
| OK-5 | basic-patterns/personal-information.mdx | 이름·생년월일 입력 | 이름 글자 수 유효성 최소 3글자 유의(65), 중간 공백 허용(305), 날짜 선택기 사용 금지(311) — 정적 입력 규칙 안내 | 제외 | 65, 305, 311 | — |
| OK-6 | service-patterns/login.mdx | 로그인 유도 | "제안" 어휘 — 로그인 제안 유형 안내(787, 1182, 1184-1185), 세션 만료 안내 문맥(4365) — 검색 제안과 무관 | 제외 | 787, 1182, 1184-1185, 4365 | — |
| OK-7 | service-patterns/search.mdx | 플레이스홀더 | "사용자가 검색어를 입력하는 시점에는 도움을 받을 수 없다" — 플레이스홀더 사용 규칙(정적) | 제외 | 1640 | — |
| OK-8 | service-patterns/search.mdx | 검색 결과 과다 | "정렬/필터 기능을 제안하여" — 고급 검색 안내 문구의 "제안" 어휘 | 제외 | 3363 | — |
| OK-9 | service-patterns/search.mdx | 검색어 입력 도움 | "권장: 실시간으로 검색어를 제안할 수 없는 경우, 검색 결과 화면에서 보조적인 도움 수단(음성입력)" — 실시간 계약의 폴백 안내, 계약 자체는 F1에서 다룸 | 제외 | 2274 | — |

## 발견 상세

### F1 — 검색어 입력 도움: 실시간 검색어 제안이 정적 `TextList`로 렌더링됨

- **기대 동작**: 공식 service_02_03.html 구조 #7(1172-1174) "실시간 검색어 제안(선택) — 검색어 입력 필드가 활성화된 상태에서는 사용자의 최근 검색어, 인기 검색어와 같은 추천 검색어가 제공되며, 검색어 입력 필드에 텍스트 입력이 시작되면 검색어에 기반한 검색어 제안이 제공됨". 상호작용 테이블(1415-1491):
  - 검색어 입력 필드: **Focusin**(값 없으면 인기 검색어·이전 검색 기록 제공), **Keyup**(1글자 이상 입력 시 검색어 제안으로 변경), **Enter**(검색 실행), **방향키 ↓**(제안 목록 첫 요소로 초점 이동).
  - 실시간 검색어 입력 도움: **방향키 ↑↓**(목록 순회, 끝에서 래핑), **Click**(선택 항목으로 검색 실행), **Enter**(초점 항목으로 검색 실행), **Esc**(레이어 닫고 입력 필드로 초점 복귀).
  - 접근성(1388-1393): "실시간 검색어 입력 도움창의 출현 여부 및 추천 검색어를 스크린 리더가 탐지할 수 있도록 한다" — WCAG 2.1 **Status Messages (AA)**.
- **현재 구현**:
  - 2103-2104 "우수: 검색어 입력 도움은 가능한 사용자가 검색어를 입력하는 시점에 실시간으로 제공한다." → PracticeExample(2106-2270)는 6개 프레임워크 슬롯 + 6개 코드 펜스 전부 `<TextInput name="search" …/>` + `<TextList aria-label="실시간 검색어 제안" items={["건강보험 자격 확인", "건강검진 결과 조회", "건강보험료 조회"]}/>`의 **미연결 정적 조합**. Angular 펜스(2247-2248)도 `<krds-text-input>`와 `<krds-text-list [items]="suggestions">`(하드코딩 배열, 2250-2251)만 존재.
  - 1064-1065 "검색어 입력 필드와 실시간 검색어 제안 레이어를 제외한 나머지 영역의 명도나 불투명도를 낮추어…" → 구현(1067-1370)은 입력 필드 + 정적 제안 목록만 렌더링, 포커스 기반 명도 저하 동작 없음.
  - 1914-1917 "권장: 사용자에게 다양한 방식의 검색어 입력 도움을 제공한다" (검색어 예제 / 인기 검색어 / 이전 검색어 / **첫 단어 제안** / 검색 도움말) → 예시(~1923-2098)는 6개 슬롯·6개 펜스 전부 `<TextInput>` + `aria-label="추천 검색어"` 정적 TextList 4개 항목(마지막 astro 펜스 2093-2098).
- **결여 요소**: 입력 필드-목록 연결(바인딩), 입력값 기반 필터/제안 로직, 키보드 내비게이션(↑↓/Enter/Esc), 초점 관리, live region(`aria-live`/combobox 패턴) 전부 부재. 텍스트만 봐도 "실시간"이라 읽히지만 렌더링 결과는 상수 목록.
- **후속 과제 후보**: 6개 프레임워크 공용 `SearchSuggestions`(combobox 패턴: input + listbox + `aria-expanded`/`aria-activedescendant` + live region) 컴포넌트 신설 후 패턴 docs 예시 교체. 프레임워크 갭 섹션 참조.
- **상태(2026-08-04)**: 후속 과제로 `SearchSuggestions` extra 컴포넌트를 6개 프레임워크에 구현 완료 — `@krds-community/<fw>/extra` subpath export, 백엔드 배선(`suggest`) + 정적 목록(`suggestions`) 지원. `search.mdx`의 3개 예시(2106-2270, 1067-1370, ~1923-2098)를 해당 컴포넌트로 교체 완료. extra conformance 스위트(`pnpm test:conformance:extra`)가 6개 프레임워크의 참조 DOM 일치를 검증(18/18 통과).

### F2 — 로그인: 실시간 유효성 검사·제출 오류 초점 이동이 정적 `state="error"`로 렌더링됨

- **기대 동작**: 공식 service_03_05.html 상호작용 가이드라인(1285-1297): "제출하기 전 가능한 한 많은 사용자 데이터의 유효성을 검사한다 — 실시간 유효성 검사는 입력 필드가 포커스를 잃을 때 발생하며 유효하지 않은 문자나 빈 필드와 같은 입력 오류를 확인" + "사용자가 로그인 폼을 제출하였을 때 오류가 발생한 경우 해당 항목으로 초점을 이동시킨다 — 서버 측 오류가 발생하면 화면을 다시 로드하고 비밀번호 필드를 지운 다음 사용자 이름 입력 필드로 사용자를 돌려보내야 한다".
- **현재 구현**: docs 3885-3889에 가이드라인 텍스트는 복사됨. 예시(~3006-3880)는 `<TextInput name="password" state="error" hint="비밀번호가 일치하지 않습니다. 다시 확인해 주세요."/>`처럼 **오류 상태·힌트가 하드코딩된 정적 입력**. 포커스 아웃 감지, 검증 로직, 오류 항목 초점 이동, 비밀번호 필드 클리어 동작 없음.
- **결여 요소**: Focusout 검증 트리거, 오류 상태 토글 로직, 제출 오류 시 첫 오류 항목 초점 이동, 인라인 오류 메시지 배선.
- **후속 과제 후보**: 로그인 예시를 상태 기반 검증 데모(컨트롤드 입력 + focusout 검증 + 제출 시 focus)로 교체. F4의 클라이언트 측 검증 구현과 공유 가능.
- **상태(2026-08-04)**: 후속 과제로 `ValidatedInput` extra 컴포넌트 구현 완료(`/extra` subpath) — `validate` 함수(백엔드) 또는 규칙 문자열 지원, Keyup/Focusout 모드, aria-invalid/인라인 메시지. login.mdx에 실시간 유효성 검사 예시 추가. extra conformance 스위트가 6개 프레임워크 구조 일치 검증.

### F3 — 필터·정렬: "즉각 표시" 계약이 하드코딩된 Select + 정적 결과로 렌더링됨

- **기대 동작**: 공식 global_10.html 상호작용 가이드라인(1541-1615): "**즉각 표시** — 사용자가 옵션 값을 선택하거나 값이 변경되었을 때 해당 속성과 옵션 값을 기준으로 데이터 집합에 대한 조회 또는 정렬 동작이 발생한다", "**일괄 표시** — '적용', '조회' 버튼에서 Enter/Space Keyup 또는 Click 시 일괄 적용", "**인라인 정렬** — 정렬 컨트롤 탐색 Tab·Shift+Tab / 정렬 순서 변경 Click·Enter·Space(오름차순·내림차순 토글)".
- **현재 구현**: docs 64에 "즉각 표시 — 사용자가 옵션을 선택하자마자 필터링·정렬·조회 동작이 실행된다" 가이드라인 복사. 예시(90-1164)는 `options={[{…}, { value: "infant", label: "영유아", selected: true }, …]}`처럼 **`selected: true`가 하드코딩된 Select 3개** + 항상 "검색 결과 **24**건"(131, 173, 215, 296, 438, 481, …)과 동일한 정적 결과 목록. change 이벤트 배선, 결과 갱신, 정렬 토글 없음.
- **결여 요소**: Select change 배선 → 결과 재계산/재렌더, 정렬 상태 토글, 조건 적용 시각적 단서(태그 등)의 동적 갱신.
- **후속 과제 후보**: 데모 상태(선택값)를 끌어올려 결과 목록을 파생 렌더링하는 대화형 예시로 교체. "일괄 표시" 사례는 적용 버튼 배선 필요.
- **상태(2026-08-04)**: `FilterableList` extra 컴포넌트 구현 완료 — 즉각 표시 계약(옵션 선택 즉시 필터링·정렬·결과 갱신, 정렬 순서 토글)을 6개 프레임워크에 제공. filter-sort.mdx에 대화형 예시 추가.

### F4 — 입력 폼: 클라이언트 측 실시간 검증 계약이 미반영(가이드라인 미복사 + 정적 예시)

- **기대 동작**: 공식 global_08.html 상호작용 가이드라인(1438-1518): "클라이언트 측 검증은 입력폼의 데이터를 서버에 전송하기 전에 브라우저에서 **실시간으로 사용자의 입력을 확인**하고 오류가 발생한 항목에 인라인으로 메시지를 제공", **Keyup**(타이핑 중 실시간 검증 — 아이디 중복, 비밀번호 규칙), **Focusout**(날짜 등 전체 값 입력 후 검증), **서버 측 검증 Click/Enter**(오류 발생 첫 항목으로 Focus).
- **현재 구현**: docs form.mdx에 해당 가이드라인 텍스트가 **전혀 복사되지 않음**(`실시간|즉시|…|유효성` 0건). 유일한 오류 관련 예시(1536-1818)는 `defaultValue="hong@example" state="error" hint="올바른 이메일 형식으로 입력해 주세요."`의 **정적 오류 렌더링**(good/bad 사례 모두 동일 패턴).
- **결여 요소**: 가이드라인 텍스트 자체(유형 A), Keyup/Focusout 검증 데모, 오류 항목 초점 이동(유형 B 계약 미반영).
- **후속 과제 후보**: global_08 가이드라인 원문을 docs에 복사하고, 검증 상태를 가진 대화형 입력 예시 추가(타이핑 중/포커스 아웃 검증 + 인라인 메시지 + 첫 오류 초점).
- **상태(2026-08-04)**: `ValidatedInput` extra 컴포넌트로 클라이언트 측 검증(Keyup/Focusout) 계약 구현 완료. form.mdx에 실시간 검증 예시 추가(가이드라인 원문 반영 포함).

### F5 — 모바일 설정: 즉시 적용·피드백·유효성 게이트 저장 버튼 가이드라인에 예시 구현 부재

- **기대 동작**: 공식 global_13.html 사용성 가이드라인(1060-1093): "사용자가 변경 결과를 예측할 수 있고 즉시 확인하며 언제든 되돌릴 수 있어야 한다"(1061), "상태의 즉시 전환에는 저장 버튼 없이 바로 반영되는 토글 스위치를 쓰고…"(1069), "설정 변경은 가능하면 즉시 적용하고, 스낵바·토스트로 2~3초 안에 간결한 피드백을 제공… 접근성 사용자를 위해 스크린리더로 읽히도록 한다… 저장 버튼을 제공하고 **입력이 유효할 때만 활성화**한다"(1075-1077).
- **현재 구현**: docs mobile-settings.mdx는 **44행짜리 가이드라인 전용 파일** — 31, 35, 37-38에 공식 문구가 복사되어 있으나 PracticeExample/컴포넌트 코드가 **하나도 없음**(`PracticeExample|Toggle|Switch|Select|Button` 0건). 즉시 적용·피드백·유효성 게이트 버튼을 보여줄 예시가 부재.
- **결여 요소**: 구현 자체 부재. (Plan의 분류 기준상 "토글 단독 배치면 OK"에 해당하는 예시조차 없음 — 조합 수준 동작을 규정한 가이드라인이 문서에 그림 없이 남음.)
- **후속 과제 후보**: 설정 화면 예시(토글 + 즉시 적용 + 스낵바 피드백 + 유효성 게이트 저장 버튼) 추가. live region(`aria-live="polite"`) 피드백 포함.

### B1 — 공식 상호작용 가이드라인(키보드 계약)이 패턴 docs에 전혀 반영되지 않음 (시스템성)

- **기대 동작**: 공식 가이드는 패턴별로 "상호작용 가이드라인" 섹션에 키보드·마우스 계약 테이블을 규정함: global_03(목록 탐색 Tab·Shift+Tab / 일괄 선택 Click·Space), global_05(맞춤 영역 탐색 / 최종 응답 제출 / 평가 선택 + live-region), global_08(클라이언트 측 검증 Keyup/Focusout, 서버 측 검증 Click/Enter), global_10(즉각 표시 / 일괄 표시 / 정렬 컨트롤 탐색 / 정렬 순서 변경), service_02_03(검색어 입력 필드 Focusin·Keyup·Enter·방향키↓ / 실시간 검색어 입력 도움 ↑↓·Click·Enter·Esc), service_03_05(실시간 유효성 검사·제출 오류 초점).
- **현재 구현**: 18개 패턴 mdx 전체에서 `상호작용|방향키|Focusin|Keyup|Focusout` **0건**. 컴포넌트 페이지에는 존재하는 해당 섹션이 패턴 docs에는 한 번도 복사되지 않음.
- **결여 요소**: 패턴별 상호작용 계약 섹션(테이블), 키보드 동작 문서화.
- **후속 과제 후보**: 각 패턴 mdx에 공식 상호작용 테이블을 그대로 옮겨 담는 섹션 추가(컴포넌트 페이지의 기존 표기 방식 재사용).

## 프레임워크 컴포넌트 갭

`packages/*/src` 전체에 `autocomplete|combobox|suggestion` (대소문자 무시) grep 결과 — **실시간 검색어 제안/자동완성을 표현할 수 있는 컴포넌트가 6개 프레임워크(react/vue/svelte/solid/angular/astro) 어디에도 없음**.

유일한 히트:
- Calendar 계열의 연/월 선택 버튼 `role="combobox"` (react `Calendar.tsx`/`additional.tsx`, vue `shared.ts`, svelte `Calendar.svelte`/`Additional.svelte`, solid `Calendar.tsx`, angular `calendar.component.ts`/`calendar-range.component.ts`/`date-input.component.ts`, astro `Calendar.astro`) — 캘린더 내부 셀렉트용, 검색 제안과 무관.
- HTML `autocomplete` 속성 포워딩 (svelte `TextInputIcon.svelte`, `Textarea.svelte`, `Additional.svelte` 등) — 브라우저 네이티브 자동완성 위임, KRDS 검색 제안 계약과 무관.

따라서 F1의 "실시간 검색어 제안" 예시는 모든 프레임워크에서 `<TextInput>` + 정적 `<TextList>` 조합으로만 그릴 수밖에 없는 상태이며, 공식 상호작용 계약(↑↓/Enter/Esc, live region)을 충족하는 컴포넌트 신설이 선행되어야 한다.

**상태(2026-08-04)**: 갭 해소됨 — `SearchSuggestions` extra 컴포넌트를 6개 프레임워크에 추가(`/extra` subpath). extra conformance 스위트(`extra/manifests/search-suggestions.yaml`, 참조 DOM `extra/search-suggestions/{closed,open,active}.html`)가 6개 프레임워크 구조 일치를 검증한다.

## 부록: 감사 방법

### Step 1 — 탐지 스윕 (Grep A/B)

작업 디렉터리: `/Users/senghyunjo/github/krds-community`. 대상: `apps/docs/src/content/docs/basic-patterns/*.mdx`(13개) + `service-patterns/*.mdx`(5개).

- **Grep A** — 패턴 `실시간|즉시|즉각|입력하는 시점|타이핑|선택하자마자|제안|유효성`: 히트 66건(아래 커버리지 표). `attachment|confirm|consent|detail|form|help|list|application|policy|visit` 10개 파일은 0건.
- **Grep B** — 패턴 `onchange|onInput|@change|@input|on:input|bind:|useState|useSignal|addEventListener|client:load`: **0건** (대조 재실행 통과 — 이벤트 배선을 가진 동적 구현이 패턴 docs에 존재하지 않음).

### Step 2 — 공식 가이드 매핑 (각 mdx의 `<PatternReference patternId>`로 1줄 재확인)

| docs mdx | patternId | 공식 가이드 |
|---|---|---|
| service-patterns/search.mdx | search | service_02_01..08.html (검색) |
| service-patterns/login.mdx | login | service_03_01..08.html (로그인) |
| service-patterns/application.mdx | application | service_04_01..08.html (신청) |
| service-patterns/policy.mdx | policy | service_05_01..04.html (정책) |
| service-patterns/visit.mdx | visit | service_01_01..02.html (방문) |
| basic-patterns/personal-information.mdx | personal-information | global_01.html |
| basic-patterns/help.mdx | help | global_02.html |
| basic-patterns/consent.mdx | consent | global_03.html |
| basic-patterns/list.mdx | list | global_04.html |
| basic-patterns/feedback.mdx | feedback | global_05.html |
| basic-patterns/detail.mdx | detail | global_06.html |
| basic-patterns/error.mdx | error | global_07.html |
| basic-patterns/form.mdx | form | global_08.html |
| basic-patterns/attachment.mdx | attachment | global_09.html |
| basic-patterns/filter-sort.mdx | filter-sort | global_10.html |
| basic-patterns/confirm.mdx | confirm | global_11.html |
| basic-patterns/mobile-notification.mdx | mobile-notification | global_12.html |
| basic-patterns/mobile-settings.mdx | mobile-settings | global_13.html |

### Step 3 — 프레임워크 컴포넌트 갭

`packages/*/src` 대상 `autocomplete|combobox|suggestion` (대소문자 무시) grep. 결과는 본문 "프레임워크 컴포넌트 갭" 섹션과 동일.

### 커버리지 체크 (Grep A 히트 전수 매핑)

히트 66건 모두 아래에 매핑됨 — 미매핑 0건.

| # | 파일:행 | 분류 |
|---|---|---|
| 1 | error.mdx:16 | OK-1 |
| 2 | feedback.mdx:3 | OK-2 |
| 3 | filter-sort.mdx:64 | F3 |
| 4 | mobile-notification.mdx:23 | OK-3 |
| 5 | mobile-notification.mdx:36 | OK-3 |
| 6 | mobile-settings.mdx:19 | OK-4 |
| 7 | mobile-settings.mdx:31 | F5 |
| 8 | mobile-settings.mdx:35 | F5 |
| 9 | mobile-settings.mdx:37 | F5 |
| 10 | mobile-settings.mdx:38 | F5 |
| 11 | personal-information.mdx:65 | OK-5 |
| 12 | personal-information.mdx:305 | OK-5 |
| 13 | personal-information.mdx:311 | OK-5 |
| 14 | login.mdx:787 | OK-6 |
| 15 | login.mdx:1182 | OK-6 |
| 16 | login.mdx:1184 | OK-6 |
| 17 | login.mdx:1185 | OK-6 |
| 18 | login.mdx:3885 | F2 |
| 19 | login.mdx:3886 | F2 |
| 20 | login.mdx:3888 | F2 |
| 21 | login.mdx:3889 | F2 |
| 22 | login.mdx:4365 | OK-6 |
| 23 | search.mdx:1065 | F1 |
| 24 | search.mdx:1203-1366 (실시간 검색어 제안 구현 펜스, 24건) | F1 |
| 25 | search.mdx:1640 | OK-7 |
| 26 | search.mdx:1920 | F1 |
| 27 | search.mdx:2103 | F1 |
| 28 | search.mdx:2104 | F1 |
| 29 | search.mdx:2110-2266 (검색어 입력 도움 구현 펜스, 13건) | F1 |
| 30 | search.mdx:2274 | OK-9 |
| 31 | search.mdx:3363 | OK-8 |

(검색 구현 펜스 내 "실시간 검색어 제안" aria-label/text 히트는 24·29 행의 범위로 묶음 — 행 단위 나열 시 1203, 1205, 1214, 1216, 1225, 1227, 1236, 1238, 1247, 1249, 1257, 1259, 1274, 1276, 1293, 1295, 1310, 1312, 1326, 1328, 1346, 1347, 1364, 1366, 2110, 2116, 2126, 2137, 2147, 2156, 2165, 2181, 2199, 2215, 2230, 2248, 2266 포함)

### 제외(OK) 판정 기준

가이드라인이 동적이라도 (a) 예시가 네이티브 인터랙티브 컴포넌트 단독(토글 등)으로 동작하거나, (b) 동적 상호작용이 아닌 정적 배치·문구·분류 규칙이면 제외. 유형 A는 **조합 수준 동작**(입력→목록 반응, 타이핑→검증 반응, 선택→결과 갱신)이 빠진 경우만 해당.

### 검증 요약

- Grep B 대조: 0건 유지 확인.
- "현재 구현" 인용: 보고서 인용 라인은 작성 전 mdx 재-read로 확인(라인 번호는 힌트이며 편집 전 재확인 원칙 적용).
- 프레임워크 갭: Step 3 grep 결과 재확인.
- 빌드/테스트: docs mdx·패키지 코드를 건드리지 않는 순수 감사 보고서이므로 실행하지 않음.
