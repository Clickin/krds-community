# KRDS Community

KRDS Community는 한국형 웹·앱 디자인 시스템(KRDS)을 React, Vue, Svelte, SolidJS,
Angular, Astro의 프레임워크 네이티브 컴포넌트로 연구·구현하는 커뮤니티 오픈소스
모노레포입니다.

> **프로젝트 상태:** pre-1.0 평가 단계입니다. 대한민국 정부의 공식 구현이나
> 인증 제품이 아니며, package가 존재하거나 manifest에 매핑되었다는 사실은
> conformance 통과를 뜻하지 않습니다. 도입 전 선택한 프레임워크의 최신 runtime
> evidence와 실제 서비스 요구사항을 직접 검토하세요.

## 먼저 확인할 링크

- [문서](https://krds-community.github.io/krds-community/) ·
  [설치와 테마](https://krds-community.github.io/krds-community/getting-started/installation/) ·
  [컴포넌트 API](https://krds-community.github.io/krds-community/components/)
- [프레임워크별 실제 예제](https://krds-community.github.io/krds-community/framework-examples/) ·
  [Storybook](https://krds-community.github.io/krds-community/storybook/)
- [Runtime evidence 대시보드](https://krds-community.github.io/krds-community/conformance-report/) ·
  [판정 방법](https://krds-community.github.io/krds-community/conformance/) ·
  [JSON 원본](reports/conformance-runtime.json)

대시보드는 `reports/conformance-runtime.json`의 프레임워크·fixture·state·check
결과를 읽기 전용으로 표시합니다. 생성 시각, 고정된 upstream commit, snapshot
integrity, browser 버전과 runner source를 함께 보여 주므로 숫자만 떼어 해석하지
마세요. [`reports/conformance.md`](reports/conformance.md)는 manifest catalog로
생성될 수 있으며, `evidenceStatus: unverified` 또는 evidence 0건인 catalog는
runtime 통과 증거가 아닙니다.

이 README는 쉽게 낡는 통과율 badge나 “전체 지원” 숫자를 복사하지 않습니다. 현재
판정은 위 runtime JSON의 `generatedAt`, 각 `FrameworkEvidence.status`, 실패 상세,
`strictConformance`를 함께 확인하세요. `passing`은 exact runtime evidence가
완전할 때만 유효하며, `implemented`, `unverified`, `skipped`, waiver 또는 manifest
status를 성공으로 바꾸어 읽지 않습니다.

## 프레임워크 지원 범위

아래의 “지원”은 framework-native source package와 public export 경로가 있다는
뜻입니다. 특정 버전의 모든 fixture가 통과한다는 뜻은 아닙니다.

| 프레임워크 | 패키지 source                                 | peer dependency 기준                 | 사용 예제                                                                           | Runtime 결과                                                                                                           |
| ---------- | --------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| React      | [`@krds-community/react`](packages/react)     | React `>=18.3.0`                     | [React 예제](https://krds-community.github.io/krds-community/framework-examples/)   | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=react#failures)   |
| Vue        | [`@krds-community/vue`](packages/vue)         | Vue `>=3.5.0`                        | [Vue 예제](https://krds-community.github.io/krds-community/framework-examples/)     | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=vue#failures)     |
| Svelte     | [`@krds-community/svelte`](packages/svelte)   | Svelte `>=5.20.0`                    | [Svelte 예제](https://krds-community.github.io/krds-community/framework-examples/)  | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=svelte#failures)  |
| SolidJS    | [`@krds-community/solid`](packages/solid)     | SolidJS `>=1.8.0`                    | [SolidJS 예제](https://krds-community.github.io/krds-community/framework-examples/) | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=solid#failures)   |
| Angular    | [`@krds-community/angular`](packages/angular) | Angular core/common/forms `>=20.0.0` | [Angular 예제](https://krds-community.github.io/krds-community/framework-examples/) | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=angular#failures) |
| Astro      | [`@krds-community/astro`](packages/astro)     | Astro `>=5.0.0`                      | [Astro 예제](https://krds-community.github.io/krds-community/framework-examples/)   | [실패·provenance 보기](https://krds-community.github.io/krds-community/conformance-report/?framework=astro#failures)   |

각 package의 실제 공개 API 기준은 해당 `src/index.*`입니다. 문서 예제와 source가
다르면 public export와 현재 runtime report를 우선 확인하고 issue로 알려 주세요.

## 설치와 최소 사용

사용할 package version이 npm registry에 실제 배포되었는지 먼저 확인하세요. 이
저장소의 package manifest나 release workflow만으로 배포 완료를 보장하지 않습니다.
React와 공통 기초 스타일을 설치하는 예시는 다음과 같습니다.

```sh
pnpm add @krds-community/react @krds-community/styles
```

```tsx
import "@krds-community/styles";
import { Button } from "@krds-community/react";

export function SaveButton() {
  return <Button type="submit">저장</Button>;
}
```

Vue, Svelte, SolidJS, Angular, Astro의 framework-native import와 template 예시는
[설치와 테마](https://krds-community.github.io/krds-community/getting-started/installation/)에서
확인하세요. 전체 props·event·form·접근성 계약은
[컴포넌트 API](https://krds-community.github.io/krds-community/components/)에서 확인하고,
React·Vue·Svelte·SolidJS·Angular는
[Storybook](https://krds-community.github.io/krds-community/storybook/) 상호작용 예제도 함께 검토해야 합니다.

### 도입 전 체크리스트

1. Runtime JSON의 `generatedAt`과 upstream/browser provenance가 검토 시점에 맞는지
   확인합니다.
2. 선택한 framework의 evidence가 존재하는지, failing fixture/state/check와
   `skipped: true` 검사가 남아 있지 않은지 확인합니다.
3. 필요한 component가 package public export와 API 문서에 실제로 있는지 확인합니다.
4. 실제 서비스의 browser matrix, SSR/hydration, form 제출, keyboard, screen reader,
   보안·서버 검증을 별도로 시험합니다.
5. 아래 KRDS 출처 표시와 제3자 라이선스 의무를 배포물에 유지합니다.

## Conformance 검사 방법

규범적 입력은 [`upstream/upstream.lock.json`](upstream/upstream.lock.json)에
고정한 KRDS HTML Component Kit와 수정하지 않는
[`upstream/krds-html`](upstream/krds-html) snapshot입니다. Catalog와 실행 evidence는
다음처럼 구분합니다.

- [`conformance/manifests`](conformance/manifests) — component/fixture/state/contract
  정의와 upstream selector catalog
- [`reports/conformance-runtime.json`](reports/conformance-runtime.json) — Chromium에서
  upstream HTML과 framework host를 같은 fixture/state/action/viewport로 실행한 상세
  결과
- [`reports/conformance.*`](reports) — CLI가 생성한 사람이 읽는 요약 또는 catalog.
  Runtime evidence를 입력하지 않은 결과는 strict 통과 자료가 아님

Runtime runner는 각 state의 render 오류, 정규화한 DOM, ARIA snapshot, interaction
event, native form state, visual pixel/computed style, semantic contract를 기록합니다.
Visual check가 실행되지 않았으면 결과에 `skipped: true`가 남으며 성공 증거로
간주하지 않습니다. 이 범위는 fixture 회귀 검사이지 WCAG 전체 감사, 정부 인증,
실제 서비스 사용성 검증을 대신하지 않습니다.

```sh
pnpm install --frozen-lockfile
pnpm test:conformance:runtime
pnpm test:conformance
```

`pnpm test:conformance:runtime`은 상세 runtime report를 갱신합니다. Strict 명령은
`reportType: runtime-strict-evidence`와 모든 framework의 exact fixture evidence가
완전하지 않거나 failing 결과가 하나라도 있으면 실패해야 합니다. 실패 원인은
[대시보드](https://krds-community.github.io/krds-community/conformance-report/)에서
fixture → state → check 순으로 확인할 수 있습니다.

## 개발과 복사 도구

```sh
pnpm install --frozen-lockfile
pnpm tokens:generate
pnpm upstream:check
pnpm build
pnpm test
```

CLI package는 `@krds-community/krds-cli`, 실행 명령은 `krds`입니다. 복사한 코드는
원본 package와 자동 동기화되지 않으므로 변경 내용을 직접 검토해야 합니다.

```sh
pnpm krds component list
pnpm krds component copy accordion --framework vue --clipboard
pnpm krds component paste --from snippet.txt --out target.txt
```

나머지 workspace package에는 generated token
[`@krds-community/tokens`](packages/tokens), 기초 CSS
[`@krds-community/styles`](packages/styles), Tailwind v4 theme
[`@krds-community/tailwind`](packages/tailwind), framework-independent recipe
[`@krds-community/recipes`](packages/recipes), SVG icon data
[`@krds-community/icons`](packages/icons), report CLI
[`@krds-community/conformance`](packages/conformance), test helper
[`@krds-community/test-utils`](packages/test-utils)가 있습니다.

## 출처와 라이선스 경계

> 출처: KRDS (KoRea Design System)  
> 본 저작물은 행정안전부에서 공공누리 제1유형으로 개방한 KRDS 디자인시스템을 이용하였습니다.

- `upstream/krds-html`의 KRDS 원본 자료와 그로부터 배포하는 문서·고지에는 upstream
  조건과 공공누리 제1유형의 출처 표시 의무가 적용됩니다. 퍼블릭 도메인으로
  간주하지 않습니다.
- KRDS Community 기여자가 작성한 framework adapter와 도구의 원본 코드는
  [`Apache-2.0`](LICENSE)입니다. Apache-2.0이 upstream KRDS 자료의 조건을
  대체하지 않습니다.
- 초기 migration과 접근성 참고 구현의 attribution·변경 경계는 [`NOTICE`](NOTICE)와
  [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)에 기록합니다.

패키지나 복사한 snippet을 재배포할 때는 포함된 `LICENSE`, `NOTICE`, 제3자 고지를
제거하지 말고 실제 사용 범위에 맞는 출처 표시를 검토하세요.
