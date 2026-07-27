# Runtime Conformance 100% 달성 계획

이 문서는 코드 수정 없이 **진단만 수행한 결과**를 정리한 실행 계획이다. 이전 작업에서 catalog/manifest 정리는 완료되었으나 `pnpm test:conformance` 런타임 검증이 `277/1104` states 실패로 끝났다. 본 문서는 이를 `1104/1104`(strict 통과)로 끌어올리기 위한 작업 스트림을 다른 agent가 실행할 수 있도록 분해한다.

## 현재 baseline (증거)

- 런타임 보고서: `reports/conformance-runtime.json` (upstream `KRDS-uiux/krds-uiux@1.1.0`, commit `d6bb184`)
- 총 states: 1104 = 85 fixture × 6 framework × (평균 state 수). fixture 단위 510 = 85 × 6.
- state 통과: 827/1104 (실패 277).
- fixture 완전 통과(6개 framework 모두 통과): **7/85** — `badge-number`, `badge-size`, `identifier`, `switch.default.medium`, `switch.default.large`, `toggle-switch`, `toggle-switch-size`.
- framework별 실패 fixture 수: react 64 / vue 66 / svelte 70 / solid 67 / angular 60 / **astro 72**.

### 핵심 구조적 관찰

**실패의 대다수는 6개 framework에서 동일하게 발생한다(공통 근본 원인).** 공유 계층(packages/recipes, manifests, conformance harness)에서 한 번 고치면 6배 효과가 있다. 프레임워크별 delta는 그 다음 단계다.

- 6개 framework 모두에서 실패하는 check: render 4, dom 13, accessibility 13, behavior 13, form 7, visual 46, contract 11.
- `@krds-community/styles`의 `dist/index.css`는 upstream `krds.min.css`의 **verbatim 복사**(아이콘 URL만 로컬 경로로 치환 — `packages/styles/scripts/build.mjs:31`). 따라서 visual 실패는 CSS 내용 불일치가 아니라 recipe의 class 적용/visualAncestor 캡처 차이에서 온다.

## 검사 의미론 (수정 전 반드시 이해)

`scripts/conformance/runtime.mjs`가 각 check를 어떻게 판정하는지:

| check           | 판정 방식                                                                                                                                                                                                   | 함의                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `render`        | host 페이지 로드/준비 실패 또는 `capture()` 예외 → 7개 check 전부 실패 폭포                                                                                                                                 | 하나의 예외가 전체 state를 죽인다                       |
| `dom`           | `captureDom()` 직렬화 결과(정규화)의 문자열 동등 비교. 정규화는 생성ID 치환, `class` 정렬, 참조속성(`aria-controls`,`for`,`headers` 등) ID 치환만. errata whitelist는 **속성 생략만** 지원(`dom.mjs:44-50`) | errata로 속성 **값**을 교정하거나 요소를 무시할 수 없다 |
| `accessibility` | Playwright `ariaSnapshot()` YAML의 **문자 그대로 동등**. 단 fixture에 errata가 있고 dom이 통과하면 통과(`runtime.mjs:553-562`)                                                                              | dom이 통과해야 errata 경로가 활성화된다                 |
| `behavior`      | `actions.length===0                                                                                                                                                                                         |                                                         | dom.passed`(`runtime.mjs:563-567`) | action이 있으면 dom이 통과해야 behavior도 통과 |
| `form`          | `semantics.form` 객체 deep strict 동등(`runtime.mjs:568-575`)                                                                                                                                               | form value/name 차이                                    |
| `visual`        | `comparePixels()` with `threshold:0, includeAA:true`(`visual.mjs:24`). **1px도 허용 안 함**. visualRootスク린샷 크기/픽셀 완전 일치                                                                         | 매우 엄격. markup+class가 완전히 같아야 통과            |
| `contract`      | manifest `contract.semanticElement/requiredAttributes/forbiddenAttributes` 검증 + errata 미사용 시 upstream literal 오류도 노출(`runtime.mjs:592-605`)                                                      | manifest 계약 명세가 실제 렌더링과 일치해야 한다        |

### 이미 확인된 harness 결함 2건 (우선 수리 대상)

1. **favicon "render" 실패 = harness 결함.** `favicon.default`의 `sourceSelector`는 `link[rel="icon"]`(`<head>` 내). 실제 에러: `locator.screenshot: Timeout 3000ms ... element is not visible`. head 요소는 screenshot 불가 → 예외 → 7개 check 전부 실패, 6개 framework 동일. 컴포넌트 결함이 아니다.
2. **errata normalization가 값 교정을 못 한다.** `dom.mjs:44-50`의 `ignoredForElement`는 `attribute` 생략만 지원. `errata.tab.runtime-state-semantics`가 정의한 `aria-selected exact-value:true` 같은 값 규칙은 DOM 비교에 전혀 반영되지 않는다(contract check에만 부분 효과). tab/help-panel/tutorial-panel이 errata가 있는데도 6개 framework 전부 dom 실패인 이유.

## 작업 스트림 (leverage 순서)

원칙: **공통 층을 먼저 고친다.** WS-1/WS-2/WS-4가 통과되면 dom/a11y/behavior/contract의 shared 실패가 사라지고, 그 후 framework delta(WS-5/WS-6)만 남는다. 각 스트림 끝에 반드시 `node scripts/conformance/runtime.mjs --framework <fw> --fixture <id>`로 단건 smoke 한 뒤 전체 run.

---

### WS-1 · Conformance harness + errata 정규화 강화

**대상(근본 원인):** favicon screenshot 불가, errarta 값/구조 정규화 미지원.
**수정 위치:**

- `scripts/conformance/dom.mjs` — `ignoredAttributes` 엔트리에 `value` 재작성 규칙과 `ignoreElement`/`ignoreSubtree` 지원 추가. errata 스키마(`conformance/errata/schema.json`)와 `normalization.whitelist` 포맷을 확장.
- `scripts/conformance/runtime.mjs` — `fixtureNormalization()`이 새 whitelist 종류를 그대로 `captureDom`에 전달하도록 유지. favicon 등 비시각 fixture의 visual 캡처를 건너뛰는 조건 추가(예: manifest에 `visual: false` 또는 `sourceSelector`가 head 전용일 때).
- `conformance/manifests/favicon.yaml` — `visual: false`(또는 동등 메타) 추가. favicon은 semantic `link` 검증만 의미 있다.
- `conformance/errata/schema.json` — 값 재작성/요소 무시 규칙 허용.

**영향(fixture):** favicon(render/dom/a11y/behavior/form/visual/contract shared), tab·help-panel·tutorial-panel(dom shared), 그 외 errata-bearing fixture의 DOM 통과 가능성 확보.
**검증:** `node scripts/conformance/runtime.mjs --fixture favicon.default --framework react` (render 통과 확인), `--fixture tab.default` (dom 통과 확인).

> **주의(AGENTS.md 준수):** errata는 upstream 결함을 숨기는 용도가 아니라 비의미적 차이만 정규화. 값 재작성 규칙은 WAI-ARIA 등 근거(`sourceUrls`)를 반드시 명시하고 accessibility 약화 금지.

---

### WS-2 · 공유 DOM/a11y/behavior/form parity (13 fixture)

**대상(shared, 6fw 전부 dom/a11y/behavior 실패):** `calendar-range`, `calendar`, `date-input`, `disclosure`, `header`, `help-panel`, `main-menu-mobile`, `main-menu-pc`, `modal`, `structured-list-table`, `tab`, `tutorial-panel`. 추가 shared a11y-only: `footer`.

**근본 원인 가설(수정 전 fixture별로 upstream HTML vs recipe 출력을 diff로 확인):**

1. recipe(`packages/recipes/src/components.ts`)가 upstream 구조를 충실히 재현하지 않음 — 예: tab의 `<li role="tab" class="active">` + `<i class="sr-only created">선택됨</i>` 표시, panel의 `data-quick-nav` 속성, `aria-selected`/`aria-controls` 관계.
2. manifest의 `sourceSelector`/`sourceAncestorSelector`가 upstream에서 잡는 부분트리와 recipe가 렌더링하는 부분트리가 구조적으로 다름.
3. `apps/conformance-host/src/fixture-props.ts`의 `baseProps()`가 state 전환 시 잘못된 props를 주입(form 실패 원인).

**수정 위치:**

- `packages/recipes/src/components.ts` — 해당 컴포넌트 recipe를 upstream `upstream/krds-html/html/code/<comp>.html`과 구조 동일화.
- `conformance/manifests/*.yaml` — `sourceSelector`/`visualSelector`/`visualAncestorSelector` 재설정(필요 시).
- `apps/conformance-host/src/fixture-props.ts` — state별 props/form 값 정정.
- 이미 존재 errata(`errata.tab.runtime-state-semantics`, `errata.navigation.missing-landmark-semantics`, `errata.accordion.state-and-panel-relationship` 등)는 WS-1 확장 후 DOM에도 적용되는지 재검증.

**검증(각 fixture):**

```sh
node scripts/conformance/runtime.mjs --fixture <id> --framework react --save-diffs
```

dom 통과 → 자동으로 accessibility(또는 errata 경로), behavior, form까지 연쇄 통과되는지 확인. 한 fixture가 react에서 통과하면 vue/svelte/solid/angular도 동일 recipe를 쓰므로 대부분 같이 통과해야 한다(그렇지 않으면 WS-6 영역).

---

### WS-3 · 공유 visual parity (46 fixture, 그중 11은 순수-visual)

**순수-visual(DOM/a11y/behavior/contract는 전 fw 통과, visual만 6fw 실패) 11:** `badge`, `checkbox-chip`, `checkbox-size`, `checkbox.default.medium`, `checkbox.default.large`, `radio-size`, `radio.default.medium`, `radio.default.large`, `spinner`, `tag`, `tag-link`.

**그 외 shared visual 35:** `button-size`, `button-text`, `button-with-icon`, `button.primary/secondary/tertiary.medium.default`, `calendar-range`, `calendar`, `carousel-banner`, `critical-alerts`, `date-input`, `favicon`(WS-1), `file-upload`, `header`, `help-panel`, `in-page-navigation`, `link`, `main-menu-mobile`, `modal-sample`, `modal`, `select-size`, `select-state`, `select.default`, `skip-link`, `structured-list-table`, `structured-list`, `tab`, `textarea`, `tooltip-box`, `tooltip-vertical`, `tooltip.default`, `tutorial-panel` 등.

**근본 원인(styles는 verbatim이므로):**

1. recipe가 upstream class 문자열을 완전히 일치시키지 않음(예: checkbox/radio의 `created`/사이즈 클래스, badge의 `outline-<tone>` vs `bg-<tone>` 톤 조합).
2. manifest `visualAncestorSelector`가 upstream과 다른 wrapper를 캡처하여 배경/여백/보더가 다르게 찍힘.
3. SVG/아이콘 마크업이 다르거나 누락(spinner, tag의 아이콘).

**수정 위치:** `packages/recipes/src/components.ts`(class/구조 동일화), `conformance/manifests/*.yaml`(`visualSelector`/`visualAncestorSelector` 조정).
**검증 방법(필수):**

```sh
node scripts/conformance/runtime.mjs --fixture <id> --framework react --save-diffs
# reports/conformance-diffs/<id>-react-default-expected.png vs -actual.png 를 픽셀 비교
```

threshold가 0이므로 class가 1개만 바라도 픽셀이 달라진다. diff PNG를 보고 누락된 class/구조를 특정한다.

---

### WS-4 · 공유 contract parity (11 fixture)

**대상(shared, 6fw 전부 contract 실패):** `accordion-line`, `contextual-help`, `date-input`, `disclosure`, `favicon`, `help-panel`, `language-switcher-page`, `language-switcher`, `modal`, `resize`, `tutorial-panel`.

**근본 원인:** manifest `contract.semanticElement`/`requiredAttributes`/`forbiddenAttributes`가 실제 렌더링 또는 upstream과 불일치. `runtime.mjs:307-389`의 `contractChecks`가 role/속성을 검사.

**수정 절차:**

1. `node scripts/conformance/runtime.mjs --fixture <id> --framework react --output /tmp/c.json` 후 `checks.contract.errors`/`literalUpstreamErrors` 읽기 — 어느 쪽(“framework:” vs “upstream:”) 에러인지 확인.
2. `framework:` 에러 → recipe가 빼먹은 속성/role → recipe 수정.
3. `upstream:` 에러 + errata 없음 → AGENTS.md에 따라 errata 추가(`conformance/errata/`)하고 근거 URL 명시. 단, accessibility 약화 금지.
4. manifest의 `contract.*` 필드 재확정.

> date-input/help-panel/modal/tutorial-panel은 WS-1/WS-2와 겹침. WS-1/2 선행 후 잔류 contract만 이 스트림에서 처리.

---

### WS-5 · Astro framework 패스 (최우선 framework delta — 50 fixture)

**현황:** astro는 거의 모든 delta에 등장하며 실패 72/85로 최악. astro-only dom/a11y/behavior 실패(다른 5fw는 통과): `accordion.default.single`, `accordion.line.single`, `breadcrumb`, `button.primary/secondary/tertiary`, `button-icon`, `radio-chip`. astro-only render 실패 5: `button-text`, `calendar-range`, `calendar`, `date-input`, `skip-link`(=astro host 런타임 에러/페이지 생성 실패).

**근본 원인 가설:**

1. `apps/conformance-host-astro/src/pages/`(per-fixture/state 정적 페이지 생성)가 `conformance-host/src/fixture-props.ts`의 `baseProps` 로직을 별도로 갖고 있어 props/state 적용이 본 host와 다름.
2. `packages/astro/src/*.astro` 컴포넌트 일부가 recipe를 다르게 소비하거나 wrapper를 추가.
3. `apps/conformance-host-astro/src/runtime.ts`의 ready/setState 프로토콜이 `runtime.mjs:396-409`의 대기 조건과 안 맞음.

**수정 위치:**

- `apps/conformance-host-astro/src/pages/*`, `src/runtime.ts` — fixture-props 단일 소스(`conformance-host/src/fixture-props.ts`) 재사용 또는 동기화.
- `packages/astro/src/*.astro` — 통과 framework의 마크업과 정렬(WS-2/3 이후 기준으로).

**검증:** `node scripts/conformance/runtime.mjs --framework astro --fixture accordion.default.single`.

---

### WS-6 · 나머지 framework별 delta

WS-1~5 후에도 남는 framework 고유 실패. 각 framework 패키지 + 해당 adapter에서 수정.

- **angular (11):** `button-hierarchy/size/text/with-icon`(DOM 그룹 — 속성 전달/class), `accordion.default.single`, `masthead`, `table`, `tts-size`, `tts.default`, `main-menu-mobile`. angular 버튼 속성 forward/class 적용 점검(`packages/angular/src`).
- **svelte (35, 최다):** `text-input-state/size/error/success/information`, `radio-button`, `select-state/size/default/sorting`, `side-navigation`, `carousel*`, `in-page-navigation`, `pagination`, `textarea`, `tts*`, `table` 등. svelte rune 반응성/class 바인딩 점검(`packages/svelte/src`).
- **solid (30):** form 실패 클러스터(`in-page-navigation`, `main-menu-pc`, `side-navigation`), `text-input-state/error/success/information`, `select*`, `carousel*`, `pagination`, `radio-chip`, `textarea`. solid는 prop destructuring 반응성 손실 점검(AGENTS.md SolidJS 규칙).
- **vue (29):** `select*`, `text-input-size/default`, `radio-chip`, `textarea`, `structured-list`, `masthead`, `modal-sample`, `tts*`. vue v-model/props 전달 점검.
- **react (25):** `tooltip*`, `text-list*`, `link`, `skip-link`, `tts*`, `pagination`, `table`, `step-indicator`, `select-sorting`, `file-upload`, `critical-alerts`, `coach-mark`. react 컴포넌트/adapter 점검.

**검증:** `node scripts/conformance/runtime.mjs --framework <fw> --fixture <id>`.

---

### WS-7 · 검증 · errata · 보고 (마지막)

1. 전체 run: `pnpm test:conformance` → `reports/conformance.md`와 runtime evidence가 strict 통과(1104/1104)인지 확인.
2. 각 버그 수정마다 **회귀 테스트**(AGENTS.md: "Every fixed bug requires a regression test in the narrowest appropriate layer"). 계약/errata 변경은 `conformance/errata/`에 근거 URL과 함께 기록.
3. `conformance/manifests/*` status 갱신. `reports/conformance.md` 재생성.
4. AGENTS.md 필수 검증 전체 실행: `pnpm lint && pnpm typecheck && pnpm test && pnpm test:conformance && pnpm build`.
5. visual/cross-browser 영향(마크업/스타일/focus/애니메이션)이 있으면 `pnpm test:browser`와 시각 suite 실행.

## 실행 순서 요약

```
WS-1 (harness/errata) ──┐
WS-2 (공유 DOM 13)   ───┼──→ 6fw shared 대부분 해소
WS-4 (공유 contract 11)┘
        │
WS-3 (공유 visual 46) ──→ 순수-visual 11 우선, diff PNG 기반
        │
WS-5 (astro 50) ────────→ 단일 framework 집중
        │
WS-6 (angular/svelte/solid/vue/react delta)
        │
WS-7 (전체 검증 + errata + regression test)
```

## 수용 기준 (definition of done)

- `pnpm test:conformance` 엄격 통과: **1104/1104 states passing**, 유예 0.
- `reports/conformance.md` 표 5개 framework 모두 `76/76 엄격 통과`(runtime evidence 기반).
- favicon 등 비의미 fixture는 harness 수리로 통과(component를 억지로 만들지 않음).
- 모든 errata 변경에 근거 URL 포함, accessibility 요구 약화 없음(AGENTS.md 8조).
- 각 버그 수정에 회귀 테스트 추가.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 전부 통과.

## 위험 / 주의

- **errata 남용 금지:** 통과 점수를 위해 errata로 차이를 가리면 AGENTS.md 7조/11조 위반. errata는 비의미적 차이 + 근거 명시 경우만.
- **visual threshold 0:** 픽셀 단위 차이를 정당화하려 하지 말 것. class/구조를 upstream에 맞추거나 manifest visualSelector를 정정.
- **upstream 결함 무단 교정 금속:** AGENTS.md에 따라 errata로 기록하고 literal vs accessibility-corrected 중 어느 쪽을 따르는지 명시.
- **recipe 변경은 6fw에 동시 영향:** WS-2/3/4에서 recipe를 고치면 5개 component-framework + astro 모두 재검증 필수.
