---
title: 공식 가이드라인 검토
description: 공식 KRDS 원문, HTML Component Kit, 토큰과 conformance 결과를 함께 검토하는 방법입니다.
---

공식 KRDS 서비스·기본 패턴 페이지와 컴포넌트 원문은 패턴·컴포넌트의 목적, 단계, 사용성 가이드라인을 정의합니다. 프레임워크 구현은 이 기준을 재해석하지 않으며, 차이가 발견되면 `conformance/errata/`에 근거와 적용 범위를 남깁니다.

## 출처와 버전 경계

현재 문서에서 사용하는 출처:

- [서비스 패턴 개요](https://www.krds.go.kr/html/site/service/service_summary.html)
- [기본 패턴 개요](https://www.krds.go.kr/html/site/global/global_summary.html)
- [컴포넌트 요약](https://www.krds.go.kr/html/site/component/component_summary.html)
- [KRDS 저작권 정책](https://www.krds.go.kr/html/site/utility/utility_06.html)
- [고정 HTML Component Kit source](https://github.com/KRDS-uiux/krds-uiux/tree/d6bb184c823e4757f05807ea4646a23e3133b6e6) (`krds-uiux@1.1.0`, commit `d6bb184c823e4757f05807ea4646a23e3133b6e6`, 2026-07-26 수집, KOGL-Type-1)

공식 웹사이트는 고정된 `1.1.0` HTML snapshot보다 먼저 또는 더 넓은 컴포넌트·단계 정보를 공개할 수 있습니다. 라이브 문서에만 있는 항목을 이 저장소의 구현·conformance 결과로 간주하지 않으며, 다음 upstream 동기화 때 version boundary를 갱신합니다.

## 단계·체크리스트 사용

서비스 패턴 페이지의 `공식 단계·체크리스트` 링크가 각 과업 단계(`service_01_02` 등)와 적용 수준 체크리스트를 가리키는지 확인합니다. 한 문단의 최소 예시는 과업 전체 guidance를 대체하지 않으므로 제품 적용 시 공식 단계별 checklist, 폼 검증, 오류·focus 동작을 모두 검토하세요.

예시의 실행 가능성은 프레임워크별 island 동작을 의미하며, 이것만으로 KRDS 전체 conformance를 선언하지 않습니다.
