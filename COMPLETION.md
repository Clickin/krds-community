# 구현 완료 보고서

이 보고서는 upstream KRDS HTML Component Kit `1.1.0`, commit
`d6bb184c823e4757f05807ea4646a23e3133b6e6`을 기준으로 합니다.

이 저장소는 커뮤니티 구현이며 대한민국 정부의 공식 구현이 아닙니다. KRDS 원본
자료에는 공공누리 제1유형 출처 표시 의무가 적용되고, 커뮤니티가 작성한 원본 코드는
Apache-2.0입니다.

## 완료 및 검증됨

- 공통 tokens, styles, tailwind, recipes, icons, conformance, test-utils 패키지와 다섯 프레임워크 패키지를 유지합니다.
- `@krds-community/recipes`에 프레임워크 중립 `KrdsAdditionalProps`와 공통 item 계약을 추가하고, 프레임워크별 native props는 `Omit`/`Pick`으로 파생합니다.
- 배포 가능한 패키지 13개를 모두 `@krds-community/*` scope로 통일하고, CLI는 `@krds-community/krds-cli`와 실행 명령 `krds`를 사용합니다.
- React, Vue, Svelte, SolidJS, Angular에 upstream 76개 manifest에 대응하는 native component export와 변형 export를 추가했습니다.
- 공유 CSS에 token 기반 레이아웃, 포커스 표시, reduced motion, forced colors, form/table/navigation 기초 스타일을 추가했습니다.
- 다섯 프레임워크의 독립 Storybook에 `전체 컴포넌트 / 전체 인벤토리` 예시를 추가했습니다.
- 한국어 Astro 문서에 컴포넌트 인벤토리와 공통 props 정책을 추가하고, 기존 18개 패턴에 다섯 프레임워크 예시를 제공합니다.
- 76개 manifest에 upstream source 파일, mandatory fixture, semantic/accessibility contract를 연결했습니다.
- Changesets, upstream provenance, KOGL attribution, Apache-2.0 notice를 유지합니다.

## 검증 결과

- `pnpm lint` 통과
- `pnpm format:check` 통과
- `pnpm typecheck` 통과
- `pnpm test` 통과: 3개 파일, 9개 테스트
- `pnpm test:browser` 통과: Chromium·Firefox·WebKit, 9개 테스트
- `pnpm test:visual` 통과: Chromium, 3개 테스트
- `pnpm build` 통과
- `pnpm docs:build` 통과
- `pnpm storybook:build` 통과: React·Vue·Svelte·SolidJS·Angular 5개
- React 전체 인벤토리 Storybook axe 검사: 위반 0건, 통과 39건
- `pnpm test:conformance` report 생성 통과
- `pnpm test:packages` 및 `pnpm publint` 통과: 13개 패키지
- `pnpm upstream:check` 통과: 고정 upstream commit 확인
- conformance inventory: 76/76, implemented: 76/76, strict passing: 0/76
- upstream lock 기준: `KRDS-uiux/krds-uiux@1.1.0`, commit `d6bb184c823e4757f05807ea4646a23e3133b6e6`

## 구현되었지만 아직 완전히 검증되지 않음

- 76개 fixture는 모두 `implemented`로 연결했지만, strict `passing`으로 올리지는 않았습니다.
- 각 fixture의 semantic, keyboard, pointer, focus, form, responsive, visual, SSR/hydration, package gate를 다섯 프레임워크별 실행 시나리오로 완전히 연결하는 작업이 남아 있습니다.
- Storybook 전체 inventory는 렌더링을 확인했지만, 모든 컴포넌트의 개별 상호작용·시각 baseline·axe 결과를 release gate로 고정하지 않았습니다.

## 미완료

- 생성된 report가 모든 manifest를 `passing`으로 기록하지 않았으므로 전체 conformance 주장을 할 수 없습니다.
- package-level parity report와 공식 fixture별 full visual baseline은 추가 작업입니다.

## upstream 모호성으로 차단됨

- 현재 기록된 항목 없음. upstream defect를 조용히 수정하지 않았습니다.

## 의도적으로 연기됨

- strict conformance 통과와 publish/release는 모든 mandatory gate와 trusted publishing 환경이 준비될 때까지 연기합니다.
