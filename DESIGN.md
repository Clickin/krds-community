# DESIGN.md

AI 에이전트(또는 새 기여자)가 이 저장소에서 컴포넌트를 구현/수정할 때 읽는 **단일 참조 문서**.
`AGENTS.md`의 규칙을 축약하고, 구현 체인·파일 경로·명명 규칙·인벤토리를 구체화한다.
`ARCHITECTURE.md`는 conformance 파이프라인, `AGENTS.md`는 저장소 규칙, 이 문서는 **컴포넌트를 만드는 방법**을 다룬다.

## 1. 목적

공식 KRDS HTML Component Kit은 **normative source of truth**다. 프레임워크 패키지는 그 스펙의
구현이지 재해석이 아니다. 컴포넌트를 추가/변경할 때:

1. upstream manifest와 공식 fixture를 먼저 읽는다.
2. 모든 프레임워크의 기존 구현을 읽고 같은 패턴을 미러한다.
3. 변경이 tokens/styles/recipes/contracts/프레임워크 중 어디에 속하는지 결정한다.
4. 테스트를 추가/갱신하고 완료를 주장하기 전에 전체 검증을 돌린다.

## 2. 소스 트러스트 계층

충돌 시 우선순위 (높은 것부터):

1. 공식 KRDS 컴포넌트 가이드라인 및 접근성 요구사항
2. 고정된 공식 KRDS HTML Component Kit 스냅샷 (`upstream/krds-html/`)
3. 공식 KRDS 디자인 토큰
4. 선언된 conformance 계약 및 승인된 errata
5. 공유 레시피 및 동작 테스트 벡터
6. 프레임워크 구현
7. 예제와 문서

upstream 결함으로 보이는 것은 조용히 고치지 않는다. `conformance/errata/`에 기록하고,
원본 fixture를 보존하며, 좁은 범위의 patch contract를 추가한다.

## 3. 패키지 맵

| 패키지 | 책임 | 경로 |
|---|---|---|
| `@krds-community/tokens` | 프리미티브/시맨틱/컴포넌트 토큰, 메타데이터, 출처 | `packages/tokens/` |
| `@krds-community/styles` | opt-in 기반 CSS + 공용 CSS 변수 (리셋 금지) | `packages/styles/src/index.css` |
| `@krds-community/tailwind` | Tailwind 테마 통합 (정적 클래스만) | `packages/tailwind/` |
| `@krds-community/recipes` | 타입드 클래스 레시피 (DOM/상태/JSX 없음) | `packages/recipes/` |
| `@krds-community/conformance` | manifest 스키마, 검증, 테스트 오케스트레이션, 리포트 | `packages/conformance/` |
| `@krds-community/react` | React 네이티브 컴포넌트 | `packages/react/src/components/` |
| `@krds-community/vue` | Vue 네이티브 컴포넌트 | `packages/vue/src/components/` |
| `@krds-community/svelte` | Svelte 네이티브 컴포넌트 | `packages/svelte/src/` |
| `@krds-community/solid` | SolidJS 네이티브 컴포넌트 | `packages/solid/src/components/` |
| `@krds-community/angular` | Angular standalone 컴포넌트 | `packages/angular/src/components/` |
| `@krds-community/astro` | Astro 컴포넌트 | `packages/astro/src/` |

## 4. 컴포넌트 구현 체인

새 컴포넌트(`<id>`, 예: `toast`)를 추가하는 순서. 각 단계의 파일이 정확한 위치:

1. **styles**: `packages/styles/src/index.css` 파일 끝 `extra:` 블록 아래에 opt-in 스타일 추가.
   root 클래스 `krds-<id>` + 플랫 자식 클래스 `<id>-<child>` (예: `.krds-toast` > `.toast-text`).
   값 하드코딩 금지 — `var(--krds-mode-light-*)` 토큰만.
2. **6개 프레임워크 컴포넌트 파일** (기존 `CriticalAlerts.*`/`Modal.*` 구조 미러):
   - react: `packages/react/src/components/<Name>.tsx`
   - vue: `packages/vue/src/components/<Name>.ts`
   - svelte: `packages/svelte/src/<Name>.svelte`
   - solid: `packages/solid/src/components/<Name>.tsx`
   - angular: `packages/angular/src/components/<id>.component.ts` (클래스 `Krds<Name>Component`, selector `krds-<id>`)
   - astro: `packages/astro/src/<Name>.astro`
3. **index export** (PascalCase — inventory 테스트가 정확한 집합을 강제):
   - react `packages/react/src/index.ts`: `export { X } from "./components/X.js"; export type { XProps } ...`
   - vue `packages/vue/src/index.ts`: `export { X } from "./components/X.js";`
   - svelte `packages/svelte/src/index.js`: `export { default as X } from "./X.svelte";`
   - solid `packages/solid/src/index.tsx`: `export { X } from "./components/X.js";`
   - angular `packages/angular/src/index.ts`: `export { KrdsXComponent } from "./components/x.component.js";`
   - astro `packages/astro/src/index.js`: `export { default as X } from "./X.astro";` (형식 엄격 — 테스트가 파싱)
4. **docs 페이지**: `apps/docs/src/content/docs/components/<category>/<id>.mdx`
   (카테고리: identity/navigation/layout/action/selection/feedback/help/input/settings).
   상단 `FrameworkPreview` 6슬롯(react/vue/svelte/solid/astro + `Angular<Name>` from `@docs/angular-previews.ts`) + 코드 블록 6개.
5. **내비게이션**: `apps/docs/src/data/component-meta.ts`의 `componentNavigation`에 추가.
6. **angular 미리보기**: `apps/docs/src/components/angular-previews.ts`에 re-export 추가.
7. **conformance manifest**: `conformance/manifests/<id>.yaml` (upstream 컴포넌트는 fixture 포함,
   no-upstream은 `status: no-upstream` + contract만 — 아래 §7).
8. **테스트**: `tests/inventory.test.ts`의 `inventoryNames`에 추가 (알파벳 위치) +
   `tests/framework/<fw>.test.*`에 DOM/동작 단언.
9. **Storybook**: `.storybook/{react,vue,svelte,solid,angular}/stories/AllComponents.stories.*`에 항목 추가.

## 5. 토큰/스타일 규칙

- 디자인 값의 canonical 출처는 토큰뿐. 프레임워크 컴포넌트/문서에 값을 하드코딩하지 않는다.
- 스타일은 `packages/styles/src/index.css`의 opt-in 블록에만. `--krds-mode-light-*` 토큰 사용.
- 공용 reset/focus-visible/reduced-motion 선택자 목록에 새 컴포넌트를 빠뜨리지 않는다.
- 애니메이션 지속시간이 프레임워크 `CLOSE_ANIMATION_MS`와 맞아야 하는 컴포넌트(toast/snackbar/bottom-sheet)는
  한쪽만 바꾸지 않는다 (요소가 exit 도중 제거됨).
- consumer class는 의도한 네이티브 요소에만, 여러 요소가 있으면 `classes?: { root?, control?, label?, ... }`로 명시.

## 6. 컴포넌트 인벤토리

### upstream 74개 (정상 conformance 측정 대상)

`conformance/manifests/*.yaml`의 74개. 각 manifest는 upstream fixture에 매핑되고
`tests/inventory.test.ts`가 74개 집합 + 82개 fixture를 강제한다.

### extra 3개 (커뮤니티 확장, 별도 카탈로그)

`extra/manifests/`: `filterable-list`, `search-suggestions`, `validated-input`.

### no-upstream 12개 (conformance 측정 제외 — 커뮤니티 구현)

upstream HTML 키트(스냅샷/GitHub/라이브 사이트)에도, Figma v1.0.0에도 마크업이 없는 컴포넌트.
라이브 사이트 문서(`live-only/`에 있던 공식 문서 내용) 또는 Figma v1.0.0 구조를 기준으로
커뮤니티가 마크업을 작성했다. `conformance/manifests/<id>.yaml`에 `status: no-upstream`으로 선언되어
conformance 리포트에서 측정 제외된다 (Phase A 메커니즘).

| id | semanticElement | 근거 |
|---|---|---|
| toast | status | 라이브 docs 구조 (정보형 3s/주의형 4s 자동 닫힘, enter/exit 애니메이션) |
| snackbar | alert | 라이브 docs 구조 (자동 닫힘 없음, 작업/닫기 버튼) |
| alert | status | Figma (State × Size, 아이콘+제목+본문) |
| infobox | region | Figma (Type × Size, 강조 텍스트 블록) |
| progress-bar | progressbar | Figma (Size × State, `<progress>` 시맨틱) |
| search | search | Figma (pc/mo × Size, 입력+버튼) |
| chip | checkbox | Figma (single/multi × Size; single은 role=radio 그룹으로 동작) |
| top-button | button | Figma (basic/label, `ico-go-top`) |
| user-feedback | group | Figma (pc/mo, 만족도 질문 + 응답) |
| card | article | Figma (Type × Image, 콘텐츠 카드) |
| bottom-sheet | dialog | 라이브 docs 구조 (오버레이/헤더/핸들/본문/닫기, Modal 포커스 패턴) |
| tab-bar | tablist | 라이브 docs 구조 (아이콘/레이블/인디케이터/배지, 하단 고정) |

구현 시: `conformance/manifests/<id>.yaml`에 `status: no-upstream` manifest 추가 →
`packages/conformance`가 자동으로 측정에서 제외 (빌드 리포트 `notes`에 명시).

### 미구현 6종 + 사유 (Figma v1.0.0 전용)

| Figma set | 사유 |
|---|---|
| container | 레이아웃 원자 — 사용자 대상 컴포넌트 아님 |
| list / list_group | `TextList`/`TextListOrdered`와 기능 중복 |
| open_panel | `HelpPanel`이 커버 |
| social | 푸터 보조 요소 |
| getting_started_guide | 저빈도 온보딩 (Figma에서도 FRAME일 뿐 COMPONENT_SET 아님) |
| splash-screen | 저빈도 모바일 |

요청 시 동일한 no-upstream 절차로 구현한다.

## 7. conformance 상태 의미론

`packages/conformance/src/index.ts`의 `statuses`:

- `unmapped` / `mapped` / `implementing` / `implemented` / `passing` / `deviating` / `blocked-upstream` / `waived` / `not-applicable`
- **`no-upstream`**: upstream HTML이 존재하지 않아 conformance 측정에서 제외되는 컴포넌트
  (toast, snackbar 등 12종). `parseManifest`가 upstream/fixture 필수 검증을 건너뛰고,
  `buildReport`가 측정 집합에서 제외하지만 리포트 `manifests`에는 표시한다.
  contract(semanticElement/accessibility) 선언은 필수다.

"100% conformant"라고 말할 때는 반드시 생성된 conformance 리포트와 upstream revision을 인용한다.
no-upstream 컴포넌트는 "conformance 제외"로 표현한다 (conformant 아님).

## 8. 접근성 체크리스트

모든 컴포넌트는 아래를 검증한다 (axe 자동 검사는 필요조건일 뿐 충분하지 않다):

- 시맨틱 요소 선택 (네이티브 HTML 우선, 중복 ARIA 금지 — 네이티브 `<button>`에 `role="button"` 금지)
- 접근 가능한 이름 (label/description 관계)
- 키보드 동작, 포커스 가시성/순서/복원
- disabled/읽기 전용 시맨틱, invalid/error 시맨틱
- expanded/selected/checked/pressed 상태
- reduced motion, forced-colors, 터치 대상 크기

toast 특기: `role="status"`(정보형) / `role="alert"`(주의형), 자동 닫힘 타이머는
사용자가 충분히 인지할 수 있는 시간(정보 2~3초, 주의 3~4초)으로 설정, reduced-motion에서
애니메이션은 꺼지되 200ms 제거 지연은 유지(시각적으로 즉시 사라짐).

## 9. Figma 감사 방법

```sh
pnpm figma:audit <fileKey>            # 인벤토리 감사 → reports/figma-audit/report.md + inventory.json
pnpm figma:audit <fileKey> --dump <setName>   # 컴포넌트 구조 덤프 (변형 + 레이어 트리)
```

- `scripts/figma-audit.mjs` — REST API `GET /v1/files/<fileKey>`, `X-Figma-Token` 헤더.
- 토큰: `--token <pat>` > `FIGMA_API_KEY` > `~/.figma-token`.
- 원본 JSON(최대 ~400MB)은 디스크에 저장하지 않고 메모리에서 파싱.
- 감사 출력: 페이지 목록, COMPONENT_SET 정규화(`__` 접미사 제거 후 dedupe) + 변형 수,
  `upstream/krds-html/html/code/*.html` basename과 diff.
- `reports/`는 gitignore 대상 (추적 안 됨).
- 유의점: 이름 변형(`textarea`/`text_area` 등)으로 false positive 가능 — 사람 검토 필요.
  `getting_started_guide`처럼 FRAME인 노드는 COMPONENT_SET 집계에 안 잡힌다.
