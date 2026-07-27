---
title: 프레임워크별 실제 예제
description: 같은 KRDS 패턴 과업을 React, Vue, Svelte, SolidJS, Angular의 네이티브 문법으로 구현한 예제입니다.
---

모든 패턴 상세 페이지의 예제 탐색기에서 다섯 프레임워크 탭을 제공합니다. 각 탭은 다음을 함께 보여줍니다.

- 실제 패턴 예제 파일에서 읽은 소스
- 해당 프레임워크 island로 렌더링된 미리보기
- 폼 제출, 상태 변경, 검색, 오류 재시도와 같은 관찰 가능한 결과

각 구현은 다음 특성을 문서와 실행 뷰에서 확인할 수 있습니다.

| 프레임워크 | 상태·이벤트·폼                                       | SSR·hydration                                    |
| ---------- | ---------------------------------------------------- | ------------------------------------------------ |
| React      | `useState`, `onChange`, `onSubmit`, 제어·비제어 입력 | Astro `client:load` island에서 React hydration   |
| Vue        | `ref`, `computed`, `v-model`, `@submit`              | Astro `client:load` island에서 Vue hydration     |
| Svelte     | `$state`, `$derived`, `bind:value`, `onsubmit`       | Astro `client:load` island에서 Svelte hydration  |
| SolidJS    | `createSignal`, reactive props, `onInput`            | Astro `client:load` island에서 SolidJS hydration |
| Angular    | standalone component, `ngModel`, `ngSubmit`          | Astro `client:load` island에서 Angular hydration |

예제는 패턴의 핵심 구조를 보여주는 독립적인 검토용 화면입니다. 실제 서비스에서는 서버 검증, 데이터 보존, 인증, 오류 처리와 공식 접근성 지침을 추가로 구현해야 합니다.
