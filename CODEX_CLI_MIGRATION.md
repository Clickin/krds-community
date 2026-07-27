# Codex CLI 멀티 턴 작업 전환 문서

## 목적

현재 세션의 작업을 Codex CLI로 옮겨 중단·재시작이 가능하도록 한다. Codex CLI에서는 각 턴의 시작에 `/goal`을 입력하고, 아래 목표를 한 번에 하나씩 완료한다.

이 문서는 실행 지시서다. 구현이 끝났다고 가정하지 않는다. 각 목표는 실제 파일, 명령 결과, 브라우저 동작으로 확인한 뒤 다음 목표로 넘어간다.

## 프로젝트와 실행 위치

```sh
cd /Users/senghyunjo/github/krds-community
pnpm install --no-frozen-lockfile
```

현재 저장소의 규칙은 루트 `AGENTS.md`를 따른다. 특히 다음을 지킨다.

- `upstream/krds-html/**`는 직접 수정하지 않는다.
- 공식 KRDS HTML Component Kit와 공식 KRDS 서비스·기본 패턴 페이지가 기준이다.
- 프레임워크 패키지는 Web Components가 아닌 프레임워크 네이티브 컴포넌트로 구현한다.
- 토큰 값은 `@krds-community/tokens`에서 소비하며 프레임워크 패키지에 직접 복제하지 않는다.
- 접근성 요구사항을 DOM·스크린샷 비교에 맞추기 위해 낮추지 않는다.
- 한국어 문서만 제공한다. 프레임워크명, API명, 명령어, 파일 경로는 원문 표기를 유지한다.
- 검증하지 않은 작업을 완료로 보고하지 않는다.
- `pnpm`을 사용한다. TypeScript `enum`은 사용하지 않는다.

## 사용자 요구사항의 최종 해석

1. 서비스 패턴 전체를 구현한다.
   - 방문
   - 검색
   - 로그인
   - 신청
   - 정책정보 확인
2. 기본 패턴 전체를 구현한다.
   - 개인 식별 정보 입력
   - 도움
   - 동의
   - 목록 탐색
   - 사용자 피드백
   - 상세 정보 확인
   - 오류
   - 입력 폼
   - 첨부 파일
   - 필터링·정렬
   - 확인
   - 모바일 알림
   - 모바일 설정
3. 각 패턴은 하나의 Astro 문서 페이지에서 제공한다.
4. 같은 페이지 안에 React, Vue, Svelte, SolidJS, Angular 탭을 둔다.
5. 탭 버튼에는 프레임워크 아이콘과 프레임워크명이 함께 표시된다.
6. 각 탭에는 해당 프레임워크의 실제 소스 코드와 해당 프레임워크로 렌더링된 예시 뷰를 함께 표시한다.
7. 패턴 적용 수준 표기는 공식 용어인 `필수 (Do)`, `권장 (Better)`, `우수 (Best)`를 사용한다. 세 수준을 모두 구현 완료로 오해하게 만드는 표기는 피하고, 각 패턴별 실제 적용 수준은 공식 원문을 확인해 명시한다.
8. 예시 링크만 제공하는 것으로는 완료하지 않는다. 공식 링크는 출처와 검증용으로만 제공한다.
9. 공통 UI와 탭 동작은 모든 패턴 페이지에서 동일해야 한다.
10. 각 프레임워크의 상태, 이벤트, 폼, SSR·hydration 특성을 보존한다. 다른 프레임워크 컴포넌트의 런타임을 재사용하지 않는다.

## 현재까지 확인된 사실

- 공식 서비스 패턴 개요: `https://www.krds.go.kr/html/site/service/service_summary.html`
- 공식 기본 패턴 개요: `https://www.krds.go.kr/html/site/global/global_summary.html`
- 서비스 패턴은 공식 개요에서 5개로 확인된다.
- 기본 패턴 개요에는 `global_01`부터 `global_12`까지가 표시되고, 공식 사이트 탐색에는 `global_13` 모바일 설정도 존재한다. 사용자가 “전부”를 요구했으므로 `global_13`도 포함한다.
- 공식 서비스 패턴은 각 패턴에 개요 페이지와 사례 페이지가 있다.
- 공식 기본 패턴은 각 패턴별 공식 페이지를 제공한다.
- Storybook은 프레임워크별 독립 설정을 하나의 정적 포털에서 제공하는 구조로 잡았다. 한 Storybook 설정에 여러 프레임워크를 섞지 않는다.
- Angular를 Astro에서 렌더링하기 위해 `@analogjs/astro-angular`를 추가했다. 이는 Angular standalone 컴포넌트의 Astro island 렌더링에만 사용한다.

## 현재 작업 트리에 추가·수정된 주요 파일

### Astro 및 문서 기반

- `apps/docs/astro.config.mjs`
- `apps/docs/tsconfig.json`
- `apps/docs/tsconfig.app.json`
- `apps/docs/package.json`
- `apps/docs/src/data/patterns.ts`
- `apps/docs/src/components/PatternExplorer.tsx`
- `apps/docs/src/components/examples/ReactExample.tsx`
- `apps/docs/src/components/examples/VueExample.vue`
- `apps/docs/src/components/examples/SvelteExample.svelte`
- `apps/docs/src/components/examples/SolidExample.tsx`
- `apps/docs/src/components/angular/AngularExample.ts`

`PatternExplorer.tsx`는 현재 React 기반의 공통 탭·미리보기 초안이다. 현재 미리보기는 패턴별 HTML 예시를 React로 렌더링하며, Vue·Svelte·SolidJS·Angular의 실제 독립 런타임 렌더링을 아직 완료한 것으로 간주하면 안 된다. 다음 목표에서 프레임워크별 실제 렌더러로 교체한다.

`patterns.ts`에는 서비스 5개와 기본 13개를 등록했다. 공식 원문 설명과 링크가 정확한지 각 패턴 페이지를 만들면서 재확인한다.

### Storybook

- `scripts/storybook.mjs`
- `.storybook/shared/preview.ts`
- `.storybook/react/**`
- `.storybook/vue/**`
- `.storybook/svelte/**`
- `.storybook/solid/**`
- `.storybook/angular/**`
- `package.json`
- `pnpm-workspace.yaml`

### 아직 정리해야 하는 기존 파일

- `apps/docs/src/main.tsx`, `apps/docs/index.html`, 기존 Vite 설정과 기존 문서 파일은 Astro 전환 후 사용 여부를 확인한다.
- 기존 `.storybook/main.ts`, `.storybook/preview.ts`는 프레임워크별 설정과 역할이 겹치는지 확인하고, 더 이상 사용하지 않으면 제거한다.
- 생성된 `dist`, `storybook-static`, 보고서 파일은 원본·생성물 규칙에 맞게 관리한다.

## Codex CLI 실행 방법

### 대화형 실행

```sh
codex -C /Users/senghyunjo/github/krds-community -s workspace-write
```

Codex CLI가 이전 대화 세션을 저장했다면 다음으로 재개한다.

```sh
codex resume --last
```

특정 세션을 재개해야 하면 `codex resume`의 선택기를 사용한다. 작업 디렉터리와 사용자 지시가 세션마다 유지되는지 확인한다.

### 한 턴의 표준 시작 형식

각 턴에서 다음을 그대로 입력하고, 목표 번호만 바꾼다.

```text
/goal
목표 N: <아래 목표 제목>

먼저 현재 작업 트리와 해당 목표의 파일을 읽는다.
이전 목표의 완료 여부를 추측하지 말고 필요한 명령과 결과로 확인한다.
이번 턴에서는 이 목표만 구현한다.
끝나기 전에 목표의 수용 기준을 모두 실행하고, 미완료 항목과 실패 원인을 정확히 보고한다.
```

Codex CLI가 `/goal`을 일반 텍스트로 처리하는 환경이면 같은 내용을 일반 프롬프트로 붙여 넣되, 목표 번호와 수용 기준을 유지한다.

### 오류가 발생한 턴의 재개 형식

```text
/goal
목표 N 재개: 직전 오류 복구

직전 출력의 오류를 먼저 재현한다.
오류를 숨기거나 테스트를 건너뛰지 않는다.
가장 작은 수정만 하고 같은 명령을 다시 실행한다.
수정 후 변경 파일과 수용 기준을 다시 확인한다.
```

## 멀티 턴 목표 순서

### 목표 1 — 기준과 작업 트리 확인

확인할 것:

- `AGENTS.md`, `package.json`, `pnpm-workspace.yaml`, `apps/docs/package.json` 읽기
- `apps/docs/astro.config.mjs`, `apps/docs/src/data/patterns.ts`, `PatternExplorer.tsx` 읽기
- 기존 패키지의 React·Vue·Svelte·SolidJS·Angular 컴포넌트 API 읽기
- `packages/icons`의 기존 아이콘 API 읽기
- 공식 KRDS 서비스·기본 패턴 URL과 패턴 목록 재확인

수용 기준:

- 구현 대상이 서비스 5개, 기본 13개라는 목록이 Codex 출력에 남는다.
- 현재 구현과 미완성 구현을 구분한다.
- 파일을 수정하지 않고 조사 결과만 보고한다.

### 목표 2 — Astro 문서 구조 완성

구현할 것:

- Starlight 문서 콘텐츠 구조를 만든다.
- 서비스 패턴 인덱스와 5개 상세 페이지를 만든다.
- 기본 패턴 인덱스와 13개 상세 페이지를 만든다.
- 각 상세 페이지는 공식 설명, 목적, 적용 수준 용어, 프레임워크 예시 섹션을 포함한다.
- 페이지를 복제해 서로 다른 내용을 잃지 않도록 `patterns.ts`의 데이터로 공통 템플릿을 사용한다.

수용 기준:

- 18개 상세 URL이 정적으로 생성된다.
- 각 페이지에 공식 원문 링크가 있다.
- 각 페이지의 제목과 설명은 한국어다.
- 존재하지 않는 패턴 ID를 조용히 fallback하지 않는다.

### 목표 3 — 공통 탭 UI와 프레임워크 아이콘

구현할 것:

- `PatternExplorer`를 공통 React island 또는 Astro 공통 컴포넌트로 정리한다.
- 탭 버튼은 `role="tab"`, `aria-selected`, `aria-controls`를 갖는다.
- 키보드로 탭을 이동할 수 있고 선택된 패널만 노출한다.
- 각 버튼에 프레임워크 아이콘과 텍스트를 함께 표시한다.
- 아이콘은 장식이면 `aria-hidden="true"`, 의미가 있으면 대체 이름을 제공한다.
- 임의 문자열로 Tailwind 클래스를 조합하지 않는다.
- 아이콘이 `@krds-community/icons`의 범위를 넘어가면 아이콘 패키지에 의미 있는 정적 아이콘을 추가하고 패키지 API와 라이선스를 확인한다. 문서 컴포넌트 안에 매번 SVG를 복사하지 않는다.

수용 기준:

- 5개 탭이 모든 18개 페이지에서 같은 순서와 같은 UI로 표시된다.
- 마우스와 키보드로 탭을 전환할 수 있다.
- 스크린리더가 아이콘 때문에 프레임워크 이름을 중복해서 읽지 않는다.
- 탭 전환 시 주소 이동이나 페이지 전체 새로고침이 발생하지 않는다.

### 목표 4 — 실제 React·Vue·Svelte·SolidJS·Angular 예시 구현

구현할 것:

- 각 패턴에 대해 5개 프레임워크의 실제 예시 컴포넌트를 만든다.
- 소스 탭은 실제 파일 또는 실제 컴포넌트에서 파생된 소스를 보여준다. 하드코딩한 설명용 가짜 코드를 실제 구현으로 표시하지 않는다.
- 렌더링 뷰는 각 프레임워크의 island·runtime으로 렌더링한다.
- React는 controlled/uncontrolled와 native event를 유지한다.
- Vue는 typed props, emits, slots, `v-model`을 필요한 패턴에 사용한다.
- Svelte는 현재 안정 문법과 bindable 값이 의미 있을 때만 사용한다.
- SolidJS는 reactive props를 안전하게 읽고 불필요한 동기화 상태를 만들지 않는다.
- Angular는 standalone component를 사용하고, 폼 패턴은 `ControlValueAccessor` 또는 네이티브 폼 동작을 보존한다.
- SSR에서 브라우저 전역을 모듈 평가 시 접근하지 않는다.

수용 기준:

- 18개 패턴 × 5개 프레임워크에 대해 소스와 렌더링 뷰가 존재한다.
- 각 렌더링 뷰는 해당 프레임워크의 이벤트·상태 변화를 실제로 확인할 수 있다.
- 폼 패턴은 label 연결, 오류·필수 상태, 제출 결과를 확인할 수 있다.
- 링크·버튼·입력 컨트롤은 네이티브 요소를 우선 사용한다.
- Web Components로 프레임워크 예시를 대체하지 않는다.

### 목표 5 — 적용 수준과 접근성 검증

구현할 것:

- 공식 원문에서 패턴별 `필수 (Do)`, `권장 (Better)`, `우수 (Best)` 적용 수준을 확인한다.
- 확인되지 않은 수준을 임의로 부여하지 않는다.
- 탭, 폼, 알림, 오류, 확인, 모바일 설정의 접근성 상태를 테스트한다.
- `axe` 결과만으로 완료 처리하지 않고 이름, 관계, 키보드, 포커스 순서를 직접 검사한다.

수용 기준:

- 각 패턴 문서에 공식 적용 수준과 출처가 표시된다.
- 탭 키보드 순서와 포커스 표시가 확인된다.
- `aria-*`, label 관계, 오류·필수·확장 상태가 패턴별로 검사된다.
- 실패 테스트를 숨기기 위한 snapshot 갱신이나 skip이 없다.

### 목표 6 — Storybook 포털 완성

구현할 것:

- React, Vue, Svelte, SolidJS, Angular Storybook 설정을 각각 빌드한다.
- `scripts/storybook.mjs`가 각 Storybook을 빌드하고 하나의 한국어 포털을 만든다.
- 각 Storybook에 같은 수직 슬라이스와 패턴 예시를 연결한다.
- 프레임워크 아이콘을 Storybook 탭·링크에도 일관되게 사용한다.

수용 기준:

- `pnpm storybook:build`가 5개 Storybook과 포털을 생성한다.
- 각 출력 디렉터리에 `index.html`이 있다.
- 한 프레임워크 Storybook 빌드 실패를 다른 빌드 성공으로 감추지 않는다.

### 목표 7 — Pages 배포와 검색

구현할 것:

- Astro 정적 사이트와 Storybook 포털을 GitHub Pages 산출물에 포함한다.
- `site`와 `base` 경로를 저장소 이름에 맞게 설정한다.
- Starlight Pagefind 검색이 한국어 문서를 색인하는지 확인한다.
- GitHub Actions는 빌드·검증 후 배포하며, 패키지를 자동 publish하지 않는다.

수용 기준:

- pull request에서 문서 빌드와 Storybook 빌드가 실행된다.
- Pages 배포 URL에서 문서와 `/storybook/` 포털이 모두 열린다.
- 검색 결과에 서비스·기본 패턴 페이지가 포함된다.

### 목표 8 — 전체 검증과 완료 보고

실행할 명령:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:browser
pnpm test:conformance
pnpm test:visual
pnpm test:packages
pnpm build
pnpm publint
pnpm changeset:status
pnpm docs:build
pnpm storybook:build
```

문서·UI 변경에 필요한 추가 검증:

```sh
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

수용 기준:

- 명령별 성공·실패·경고를 구분하여 기록한다.
- 실패한 검증을 “기존 실패”로 단정하지 말고 재현 명령과 원인을 기록한다.
- conformance 보고서의 upstream repository, ref, commit, packageVersion을 기록한다.
- 18개 패턴과 5개 프레임워크의 실제 완료 수를 보고한다.
- `100% conformant`라는 표현은 생성된 conformance 보고서가 요구하는 모든 fixture와 gate를 통과할 때만 사용한다.
- 구현 완료, 구현했지만 미검증, 미완료, upstream 모호성으로 차단, 의도적 보류를 분리해서 보고한다.

## 현재 세션에서 이미 관찰된 검증 상태

아래 내용은 과거 명령 결과의 기록이며, 최신 변경 이후의 보증이 아니다. Codex CLI에서 반드시 재실행한다.

- 일부 시점에 `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm test:conformance`, `pnpm build`가 통과했다.
- Storybook React 단일 빌드는 한 차례 성공했지만, 현재 다중 프레임워크 설정 변경 후 다시 확인해야 한다.
- 브라우저 수직 슬라이스 테스트는 Chromium·Firefox·WebKit에서 통과한 기록이 있으나 문서 패턴 테스트는 아직 별도 검증이 필요하다.
- conformance 보고서는 upstream KRDS HTML Component Kit `1.1.0`, commit `d6bb184c823e4757f05087ea4646a2e3133b6e6`을 기준으로 76개 inventory와 6개 구현 manifest를 기록한 상태다. 이는 패턴 전체 구현의 완료 증거가 아니다.
- strict conformance는 구현되지 않은 upstream fixture 때문에 통과하지 않는 것이 정상이며, release를 통과시키기 위해 strict 검사를 약화하지 않는다.

## Codex CLI에 전달하면 안 되는 작업 방식

- 현재 변경을 지우기 위해 `git reset --hard`, `git clean -fd`, 전체 파일 덮어쓰기를 실행하지 않는다.
- `upstream/krds-html/**`를 직접 수정하지 않는다.
- 기존 코드가 있다고 가정하고 파일을 만들지 않는다. 먼저 읽고 현재 API를 확인한다.
- 18개 패턴을 한 개의 가짜 공통 HTML로 처리하고 완료라고 보고하지 않는다.
- 프레임워크 아이콘을 탭 텍스트로 대체하지 않는다.
- 모든 탭의 렌더링 뷰가 React DOM이라는 사실을 숨기지 않는다. 실제 프레임워크 island가 아니면 미완료로 남긴다.
- `aria-label`만 추가해 실제 키보드·포커스 동작을 대신하지 않는다.
- 스냅샷을 광범위하게 갱신하거나 테스트를 skip하지 않는다.
- 새로운 의존성을 추가할 때 기존 workspace dependency와 플랫폼 API를 먼저 확인한다.

## 다음 턴에 바로 붙여 넣을 첫 프롬프트

```text
/goal
목표 1: 기준과 작업 트리 확인

현재 작업 디렉터리는 /Users/senghyunjo/github/krds-community 이다.
CODEX_CLI_MIGRATION.md를 먼저 읽고, 루트 AGENTS.md 규칙을 적용한다.
이번 턴에서는 파일을 수정하지 않는다.
서비스 패턴 5개와 기본 패턴 13개의 공식 목록, 현재 Astro·Storybook 관련 파일, 기존 다섯 프레임워크의 공개 API를 확인한다.
현재 구현된 것과 미완료인 것을 분리해 보고하고, 확인에 사용한 파일·URL·명령을 명시한다.
```

다음 목표로 넘어갈 때는 이전 목표의 수용 기준이 모두 확인된 뒤 아래처럼 입력한다.

```text
/goal
목표 2: Astro 문서 구조 완성

CODEX_CLI_MIGRATION.md의 목표 2와 수용 기준을 따른다.
목표 1의 조사 결과를 먼저 읽고, 그 결과와 현재 파일을 다시 확인한다.
이번 턴에서는 Astro 문서 콘텐츠와 패턴 상세 페이지 구조만 구현한다.
프레임워크별 실제 렌더러 작업은 목표 3·4에서 한다.
끝나기 전에 pnpm docs:build를 실행하고 실패하면 원인을 해결하거나 정확히 기록한다.
```

## 작업 결과 보고 형식

각 턴의 마지막 출력은 다음 형식을 사용한다.

```text
완료 목표: 목표 N — <제목>
수정 파일:
- <경로>

실행한 검증:
- `<명령>` — 통과/실패

확인된 동작:
- <관찰한 사실>

미완료:
- <남은 항목>

차단 또는 주의:
- <있을 때만 작성>

다음 목표:
- 목표 N+1 — <제목>
```

검증하지 못한 동작은 완료 목록에 쓰지 않는다.
