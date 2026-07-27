# KRDS Conformance 아키텍처

## 1. 목적

`krds-conformance`는 공식 KRDS HTML Component Kit의 immutable revision을
추적하고, framework 구현의 semantic structure, behavior, accessibility,
responsive behavior, visual presentation을 판정합니다. serialized HTML을
byte 단위로 비교하지 않으며, conformance 주장을 재현 가능한 근거로 남깁니다.

## 2. 100% conformance의 정의

다음 조건을 모두 만족할 때만 upstream revision에 대해 100% conformance라고
말할 수 있습니다.

1. 모든 mandatory upstream fixture를 inventory에 등록합니다.
2. 모든 fixture를 실행 가능한 framework scenario에 연결합니다.
3. variant, size, state, responsive mode를 모두 표현합니다.
4. semantic, behavior, accessibility, form, style, visual, SSR, package gate를 통과합니다.
5. mandatory test를 skip하지 않습니다.
6. deviation을 해결하거나 승인된 upstream errata로 기록합니다.
7. report에 정확한 upstream commit과 package version을 표시합니다.

Report는 fixture, implemented, passing, waived, not-applicable coverage를
구분합니다. waiver는 구현으로 계산하지 않습니다.

```text
Implemented coverage: 100%
Strict conformance: 98%
Waived: 2%
```

위 결과도 strict conformance 100%로 보고하지 않습니다.

## 3. Upstream snapshot

검증된 read-only snapshot은 다음 경로에 저장합니다.

```text
upstream/krds-html/<upstream-version>/
```

repository, release, full commit SHA, npm package/version, integrity,
retrievedAt, `KOGL-Type-1` license를 기록하고 source provenance와 attribution을
포함합니다. CI는 snapshot 경로의 기록되지 않은 수정을 거부해야 합니다.

## 4. Inventory model

logical component마다 stable ID를 가진 manifest 하나를 만듭니다.

```text
conformance/manifests/button.yaml
conformance/manifests/text-input.yaml
conformance/manifests/accordion.yaml
```

```yaml
id: button
upstream:
  version: 1.1.0
  files:
    - path: html/code/component/button.html
      selectors: ["#button-primary", "#button-secondary"]
fixtures:
  - id: button.primary.large.default
    sourceSelector: "#button-primary-large"
    mandatory: true
    viewport: desktop
    props: { variant: primary, size: large }
    states: [default, hover, focus-visible, active, disabled]
contract:
  semanticElement: button
  accessibleRole: button
  requiredAttributes: { type: button }
  forbiddenAttributes: { role: button }
```

## 5. Conformance 차원

### 5.1 Inventory와 semantic DOM

모든 upstream example은 `mapped`, 사유가 있는 `excluded`, 또는 `unresolved` 중
하나여야 합니다. unmapped fixture는 coverage gate를 실패시킵니다. DOM은
serialized markup가 아니라 normalized semantic tree로 비교하며 element type,
hierarchy, landmark role, heading level, label 관계, interactive element 위치,
list/table semantics를 포함합니다. 승인된 framework bookkeeping과 generated ID만
무시합니다.

### 5.2 Accessibility tree와 interaction

ARIA snapshot과 assertion으로 role, accessible name, description,
checked/selected/expanded/pressed/disabled/invalid state, heading level을
검사합니다. snapshot은 keyboard, focus, form interaction test를 대체하지
않습니다. 모든 adapter에는 동일한 trace를 실행합니다.

```yaml
- action: focus
  target: trigger
- action: key
  value: Enter
- assert:
    target: panel
    visible: true
- assert:
    target: trigger
    ariaExpanded: "true"
- action: key
  value: Escape
- assert:
    focus: trigger
```

### 5.3 Form, style, visual

해당 form control은 native submission, default/controlled value, reset, required,
disabled, readonly, invalid, name/value payload, framework forms integration,
imperative focus를 검사합니다. React controlled/uncontrolled, Vue model binding,
Svelte bindable value, Solid signal-controlled value, Angular
`ControlValueAccessor`도 포함합니다.

Computed style는 display, dimension, spacing, typography, border, radius,
foreground/background, focus indicator, visibility, positioning, state token을
curated contract로 검사합니다. mandatory token을 우회한 hard-coded value를
허용하지 않습니다. visual regression은 upstream reference와 다섯 framework를
동일 text, viewport, font, browser, device scale factor, animation, locale로
렌더링하고, 좁고 문서화된 tolerance와 사람이 검토한 diff를 사용합니다.

### 5.4 Responsive, SSR, package

manifest의 viewport class를 기준으로 visibility, stacking, sizing, wrapping,
navigation mode, dialog/panel layout, touch target을 검사합니다. SSR framework는
browser global 없는 server rendering, mismatch 없는 hydration, 초기 accessible
state, generated ID 안정성, hydration 후 event를 검사합니다.

packed npm tarball을 최소 consumer fixture에 설치하여 ESM export, type declaration,
CSS export, tree shaking, peer dependency, side effect, SSR import, package
contents, license와 notice를 확인합니다.

## 6. Framework adapter interface

각 framework test application은 다음 공통 browser contract를 노출합니다.

```ts
interface ConformanceAdapter {
  framework: "react" | "vue" | "svelte" | "solid" | "angular";
  renderScenario(id: string, props?: unknown): Promise<void>;
  setProps(props: unknown): Promise<void>;
  reset(): Promise<void>;
  getRoot(): HTMLElement;
}
```

route도 다음 형식으로 안정적으로 유지합니다.

```text
/conformance/react/button.primary.large.default
/conformance/vue/button.primary.large.default
/conformance/svelte/button.primary.large.default
/conformance/solid/button.primary.large.default
/conformance/angular/button.primary.large.default
/reference/button.primary.large.default
```

## 7. Status와 errata

manifest status는 `unmapped`, `mapped`, `implementing`, `implemented`, `passing`,
`deviating`, `blocked-upstream`, `waived`, `not-applicable` 중 하나입니다.
오직 `passing`만 strict conformance에 기여합니다.

공식 HTML의 redundant ARIA, invalid markup, inaccessible behavior, script defect는
`conformance/errata/<component>/<erratum-id>.yaml`에 좁고 revision-specific하게
기록합니다. 예를 들어 native button의 redundant `role="button"`을 제거할 때
source path, 문제 유형, implementation correction, normalization, evidence를
함께 적습니다. “모든 ARIA 차이를 무시” 같은 broad exception은 만들지 않습니다.

## 8. CLI와 report

```sh
krds-conformance inventory
krds-conformance check react
krds-conformance check vue
krds-conformance check svelte
krds-conformance check solid
krds-conformance check angular
krds-conformance check --all
krds-conformance diff-upstream
krds-conformance report
```

JSON, JUnit, Markdown, HTML report는 upstream repository/ref, commit, package
version과 framework별 inventory, implemented, strict passing, waived 수치를
표시해야 합니다.

## 9. CI와 승인 조건

공통 token, recipe, contract, upstream source에 영향을 주는 pull request는 모든
framework suite를 실행합니다. 한 framework 변경도 해당 suite, shared unit test,
cross-framework smoke suite, package conformance check를 실행합니다. nightly
workflow는 browser·visual matrix 전체를 실행하고 release workflow는 package마다
fresh full conformance report를 요구합니다.

초기 사용 승인은 deterministic upstream snapshot, versioned manifest schema,
fixture inventory generation, 완성된 Button/TextInput reference manifest,
동일 scenario를 실행하는 다섯 adapter, CI semantic/ARIA/interaction/visual/package
test, 정확한 provenance, passing으로 계산되지 않는 incomplete/waived scenario,
KRDS attribution 보존을 모두 요구합니다.
