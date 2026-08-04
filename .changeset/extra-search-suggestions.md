---
"@krds-community/react": minor
"@krds-community/vue": minor
"@krds-community/svelte": minor
"@krds-community/solid": minor
"@krds-community/angular": minor
"@krds-community/astro": minor
"@krds-community/styles": minor
"@krds-community/conformance": minor
---

공식 키트에 없는 커뮤니티 확장(extra) 컴포넌트 3종을 6개 프레임워크에 동일한 구조로 추가.

**SearchSuggestions(검색어 실시간 제안)** — 공식 검색 서비스 패턴의 상호작용 계약
(service_02_03.html: 실시간 검색어 제안 — 방향키 ↑↓/Enter/Esc, WCAG 2.1 Status Messages) 구현.

**ValidatedInput(실시간 유효성 검사)** — 공식 TextInput의 정적 error state를 동적 검증으로 확장
(service_03_05.html 실시간 유효성 검사, global_08.html 클라이언트 측 검증 Keyup/Focusout).
`validate`는 함수(백엔드 배선) 또는 규칙 문자열(`required`/`min-length:<n>`/`email`) 허용.

**FilterableList(즉각 표시 필터·정렬)** — global_10.html 즉각 표시 계약: 옵션 선택 즉시
필터링·정렬·결과 갱신, 정렬 순서 변경(Click/Enter/Space 토글).

- 새 export 경로: `@krds-community/<framework>/extra` (메인 `"."` export는 공식
  컴포넌트로 유지, extra는 별도 subpath로 분리).
- 백엔드 배선: `suggest(query)` 콜백으로 실제 검색 API를 연결. 데모/문서/
  테스트에는 `suggestions` 정적 목록(내부 JSON 백엔드) 전달 가능.
- 접근성: `role="combobox"` + `aria-expanded/controls/activedescendant`,
  `role="option"` 목록, `aria-live="polite"` 상태 영역, 키보드 내비게이션.
- CLI: `krds component list/copy`에서 extra 컴포넌트를 1급으로 취급
  (`list`에 `[extra]` 표시, `copy <component>`가 백엔드 배선 예시 포함 스니펫 생성).
- conformance: 공식 스위트와 분리된 extra 스위트
  (`pnpm test:conformance:extra`)가 6개 프레임워크의 DOM 구조·상태·동작이
  참조 DOM(`extra/<component>/*.html`)과 동일함을 검증(9 fixture × 6 = 54 state).
- 스타일: shared styles에 `.krds-search-suggestions` 계열 클래스 추가(옵트인).
- 스토리북: 5개 프레임워크(react/vue/svelte/solid/angular)에 ExtraComponents
  스토리 추가 (SearchSuggestions/ValidatedInput/FilterableList 렌더 +
  SearchSuggestions 상호작용).
