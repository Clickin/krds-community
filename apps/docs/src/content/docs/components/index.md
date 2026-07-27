---
title: 컴포넌트 인벤토리
description: 공식 KRDS HTML Component Kit의 고정 인벤토리를 다섯 프레임워크 네이티브 구현으로 검토합니다.
---

이 페이지의 컴포넌트는 공통 데이터·상태 props 계약을 공유하고, 이벤트·refs·children/slots·forms·SSR 연결은 각 프레임워크의 관용적인 API로 유지합니다. 프레임워크별로 필요한 차이는 각 패키지의 타입에서 `Omit` 또는 `Pick`으로 명시합니다.

실행 가능한 전체 예시는 [Storybook 포털](/storybook/)에서 확인할 수 있습니다. Storybook의 `전체 컴포넌트 / 전체 인벤토리` 화면은 아래 고정 인벤토리와 같은 시나리오 데이터를 다섯 런타임에 전달합니다.

| 영역          | 컴포넌트                                                                                                                                                                                                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 탐색·레이아웃 | `breadcrumb`, `footer`, `header`, `identifier`, `in-page-navigation`, `language-switcher`, `language-switcher-page`, `main-menu-mobile`, `main-menu-pc`, `masthead`, `side-navigation`, `skip-link`                                                                                                                                                 |
| 동작·피드백   | `accordion`, `accordion-line`, `carousel`, `carousel-banner`, `coach-mark`, `contextual-help`, `critical-alerts`, `disclosure`, `help-panel`, `modal`, `modal-sample`, `pagination`, `spinner`, `tooltip`, `tooltip-box`, `tooltip-vertical`, `tutorial-panel`                                                                                      |
| 입력·폼       | `calendar`, `calendar-range`, `checkbox`, `checkbox-chip`, `checkbox-size`, `date-input`, `file-upload`, `radio-button`, `radio-chip`, `radio-size`, `resize`, `select`, `select-size`, `select-sorting`, `select-state`, `text-input`, `text-input-icon`, `text-input-size`, `text-input-state`, `textarea`, `toggle-switch`, `toggle-switch-size` |
| 콘텐츠·표현   | `badge`, `badge-number`, `badge-size`, `button`, `button-hierarchy`, `button-icon`, `button-size`, `button-text`, `button-with-icon`, `favicon`, `link`, `step-indicator`, `structured-list`, `structured-list-table`, `tab`, `table`, `tag`, `tag-link`, `text-list`, `text-list-ordered`, `tts`, `tts-icon`, `tts-size`                           |

구현 상태와 공식 fixture 매핑은 생성된 [conformance report](/conformance/)를 기준으로 판단합니다. 이 커뮤니티 프로젝트는 정부의 공식 구현이 아니며, 공식 KRDS 자료의 출처·라이선스 고지를 유지합니다.
