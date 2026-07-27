---
title: 프레임워크별 실제 예제
description: 같은 KRDS 패턴 과업을 React, Vue, Svelte, SolidJS, Angular, Astro의 네이티브 문법으로 구현한 예제입니다.
---

모든 패턴 상세 페이지의 예제 탐색기에서 여섯 프레임워크 탭을 제공합니다. 각 탭은 다음을 함께 보여줍니다.

- 실제 패턴 예제 파일에서 읽은 소스
- 해당 프레임워크 island 또는 Astro native SSR로 렌더링된 미리보기
- 폼 제출, 상태 변경, 검색, 오류 재시도와 같은 관찰 가능한 결과
- 설치 가능한 `@krds-community/{framework}` public package import가 포함된 [복사 가능한 컴포넌트 API 안내](../components/)

각 구현은 다음 특성을 문서와 실행 뷰에서 확인할 수 있습니다.

| 프레임워크 | 상태·이벤트·폼                                                       | SSR·hydration                                        |
| ---------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| React      | `useState`, `onChange`, `onSubmit`, 제어·비제어 입력                 | Astro `client:load` island에서 React hydration       |
| Vue        | `ref`, `computed`, `v-model`, `@submit`                              | Astro `client:load` island에서 Vue hydration         |
| Svelte     | `$state`, `$derived`, `bind:value`, `onsubmit`                       | Astro `client:load` island에서 Svelte hydration      |
| SolidJS    | `createSignal`, reactive props, `onInput`                             | Astro `client:load` island에서 SolidJS hydration     |
| Angular    | standalone component, `ngModel`, `ngSubmit`                           | Astro `client:load` island에서 Angular hydration     |
| Astro      | frontmatter `patternId`, native `submit`·`click`·`change`, HTML forms | 서버 렌더링 + 필요한 상호작용만 native script enhance |

## React 최적화 진단 절차

React 패키지는 Babel 기반 React Compiler 변환을 배포 빌드에 강제로 포함하지 않습니다. 대신 `eslint-plugin-react-hooks`의 `recommended-latest` compiler diagnostics를 `pnpm lint:react-compiler`로 실행합니다. 이 검사는 `immutability`, `purity`, `refs`, `static-components`, `unsupported-syntax`, `use-memo` 같은 규칙 위반과 컴파일을 건너뛸 수 있는 코드를 알려주지만, 모든 컴포넌트에 `useMemo`를 추가하라는 성능 판정기는 아닙니다.

진단된 컴포넌트는 먼저 실제 렌더링 프로파일과 의존성 불변성을 확인합니다. 그 결과가 입증된 경우에만 해당 컴포넌트에 `useMemo`, `useCallback`, 또는 `memo`를 수동으로 추가하고, props·ref·이벤트·접근성 상태 회귀 테스트를 함께 유지합니다. 기존 수동 memoization은 lint의 `preserve-manual-memoization` 진단 없이 제거하지 않습니다.

예제는 패턴의 핵심 구조를 보여주는 독립적인 검토용 화면입니다. 실제 서비스에서는 서버 검증, 데이터 보존, 인증, 오류 처리와 공식 접근성 지침을 추가로 구현해야 합니다.
