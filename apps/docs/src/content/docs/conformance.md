---
title: Conformance report
slug: conformance
description: 프레임워크별 conformance 상태와 공식 fixture 출처를 확인하는 방법입니다.
---

이 페이지는 conformance 결과의 해석 범위를 설명합니다. 실제 판정의 정본은 브라우저 runner가 생성한 `reports/conformance-runtime.json`이며, 대시보드는 그 파일을 읽기 전용으로 표시합니다. Manifest catalog나 package export 수만으로 framework 통과 상태를 만들지 않습니다.

- [Runtime evidence 대시보드](../conformance-report/) — framework·fixture·state·failed check 상세와 provenance
- [Runtime JSON 원본](https://github.com/KRDS-community/krds-community/blob/main/reports/conformance-runtime.json) — 대시보드가 읽는 판정 정본
- [Catalog Markdown](https://github.com/KRDS-community/krds-community/blob/main/reports/conformance.md) — manifest inventory이며 runtime 통과 증거가 아님
- [원본 manifest와 fixture](https://github.com/KRDS-community/krds-community/tree/main/conformance/manifests)
- [공식 HTML Component Kit 출처](https://github.com/KRDS-uiux/krds-uiux)

## 판정 읽는 순서

1. `generatedAt`, upstream ref·commit·snapshot integrity, browser 버전으로 evidence의 출처와 시점을 확인합니다.
2. 각 framework의 `FrameworkEvidence.status`와 fixture result를 확인합니다.
3. failing fixture를 state 단위로 열고 `render`, `dom`, `accessibility`, `behavior`, `form`, `visual`, `contract` 중 실패한 check의 error·expected·actual을 확인합니다.
4. `skipped: true`, 누락된 evidence, unresolved selector와 errata는 성공으로 간주하지 않습니다.

> 이 report는 고정된 fixture 범위의 커뮤니티 회귀 evidence입니다. 대한민국 정부의 공식 인증서, KRDS 전체 준수 선언, WCAG 전체 감사 또는 실제 서비스 품질 승인이 아닙니다.

## 생성과 배포

`pnpm test:conformance:runtime`은 상세 runtime JSON을 생성합니다. `pnpm test:conformance`의 strict 단계는 정확한 runtime evidence가 없거나 하나라도 failing이면 실패합니다. Pages 빌드는 대시보드와 동일한 runtime JSON을 configured base 아래 `/conformance-report/`에 함께 배포합니다. `/conformance/`의 이 설명 페이지와 `/storybook/` 포털은 별도 경로입니다.
