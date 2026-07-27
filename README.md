# KRDS Community

KRDS Community는 한국형 웹·앱 디자인 시스템(KRDS)을 React, Vue, Svelte, SolidJS,
Angular의 프레임워크 네이티브 방식으로 구현하는 커뮤니티 오픈소스 모노레포입니다.
대한민국 정부의 공식 구현은 아닙니다.

공식 KRDS HTML Component Kit를 규범적 기준으로 삼습니다. 고정한 원본 버전과
커밋은 [`upstream/upstream.lock.json`](upstream/upstream.lock.json)에 기록하며,
원본 snapshot은 [`upstream/krds-html`](upstream/krds-html)에 보존합니다. 해당
snapshot은 직접 수정하지 않습니다.

## 현재 구현 범위

공통 props 계약과 76개 upstream manifest를 기반으로 다섯 프레임워크에 전체
컴포넌트 인벤토리의 네이티브 구현·export·Storybook 예시를 제공합니다. 구현된
상태와 엄격한 conformance 통과 상태는 다르며, 생성된 report에서 각각 확인해야
합니다.

문서 사이트와 Storybook의 모든 설명은 한국어로 제공하고, 프레임워크명·API명·명령어·파일 경로 같은 고유 표기는 원문을 유지합니다.

Accordion은 `aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`
관계를 사용합니다. 모든 adapter에서 native label, native form control, native
keyboard 동작을 보존합니다.

## 패키지

배포 가능한 모든 패키지는 `@krds-community/*` organization scope 아래에 두며,
CLI 패키지는 `@krds-community/krds-cli`, 실행 명령은 `krds`로 통일합니다.

- `@krds-community/tokens` — 생성되는 primitive·semantic·component token
- `@krds-community/styles` — 선택적으로 적용하는 기초 CSS
- `@krds-community/tailwind` — Tailwind CSS v4 theme 진입점
- `@krds-community/recipes` — `clsx` 기반 프레임워크 독립 class recipe와 공통 props 계약
- `@krds-community/icons` — 프레임워크 중립 SVG icon 데이터
- `@krds-community/react`, `vue`, `svelte`, `solid`, `angular` — 네이티브 adapter
- `@krds-community/conformance` — manifest, CLI, JSON/JUnit/Markdown/HTML report
- `@krds-community/test-utils` — 공통 시나리오와 접근성 계약
- `@krds-community/krds-cli` — 컴포넌트 snippet 복사·붙여넣기 도구

## 명령어

```sh
pnpm install
pnpm tokens:generate
pnpm upstream:check
pnpm upstream:diff
pnpm upstream:extract
pnpm build
pnpm test
pnpm test:conformance
```

실행 시 의존성 없이 컴포넌트 코드 조각을 복사하거나 붙여 넣을 수 있습니다.

```sh
pnpm krds component list
pnpm krds component copy accordion --framework vue --clipboard
pnpm krds component paste --from snippet.txt --out target.txt
```

## 출처와 라이선스

출처: KRDS (KoRea Design System)  
본 저작물은 행정안전부에서 공공누리 제1유형으로 개방한 KRDS 디자인시스템을 이용하였습니다.

KRDS 원본 자료에는 공공누리 제1유형 출처 표시 의무가 적용되며 퍼블릭 도메인으로
간주하지 않습니다. 커뮤니티가 작성한 원본 코드는 Apache-2.0입니다. 자세한 내용은
[`NOTICE`](NOTICE), [`LICENSE`](LICENSE), [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)를
확인하세요.
