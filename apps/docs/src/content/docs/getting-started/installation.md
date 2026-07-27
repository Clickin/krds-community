---
title: 설치와 테마
description: KRDS Community 패키지를 workspace 또는 애플리케이션에서 사용하는 기본 순서입니다.
---

각 프레임워크 패키지는 해당 프레임워크의 네이티브 컴포넌트를 제공합니다. 공통 토큰 값은 `@krds-community/tokens`에서 생성되며, 기초 스타일은 선택적으로 `@krds-community/styles`에서 가져옵니다.

```sh
pnpm add @krds-community/react @krds-community/styles
```

다른 프레임워크는 `@krds-community/vue`, `@krds-community/svelte`, `@krds-community/solid`, `@krds-community/angular`를 사용합니다. Web Components 런타임은 사용하지 않습니다.
