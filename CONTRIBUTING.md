# 기여 안내

## 컴포넌트를 변경하기 전

1. 고정된 upstream manifest와 연결된 모든 fixture를 읽습니다.
2. 공통 token과 recipe 계약을 확인합니다.
3. 다섯 framework package에서 같은 컴포넌트를 확인합니다.
4. native semantics, form 동작, refs, SSR 안전성, keyboard 동작을 보존합니다.
5. status를 바꾸기 전에 공통 conformance scenario를 추가하거나 갱신합니다.

`upstream/krds-html`은 직접 수정하지 않습니다. revision에 한정된 correction은
`upstream/patches`에 기록하고 접근성 근거를 설명합니다.

## 로컬 검증

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:browser
pnpm test:conformance
pnpm test:packages
pnpm build
```

컴포넌트가 `passing`이 되려면 mandatory fixture와 semantic, accessibility,
interaction, form, responsive, visual, SSR, package gate에 실행 가능한 근거가
있어야 합니다. `implemented`, `waived`, `deviating`은 strict conformance에
포함되지 않습니다.

## 출처와 release

배포되는 notice에 필요한 KRDS attribution을 보존합니다. 사용자에게 보이는
변경에는 Changesets를 사용합니다. publish는 trusted GitHub Actions release
workflow에서 수행하며 workstation에서 수동 publish하지 않습니다.

프로젝트 문서와 웹페이지의 설명은 한국어로 작성합니다. framework명, API명,
명령어, 파일 경로, 공식 고유명사는 원문 표기를 유지할 수 있습니다.
