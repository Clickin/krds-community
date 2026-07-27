---
title: 설치와 테마
description: KRDS Community 패키지를 workspace 또는 애플리케이션에서 사용하는 기본 순서입니다.
---

각 프레임워크 패키지는 해당 프레임워크의 네이티브 컴포넌트를 제공합니다. 공통 계약은 `@krds-community/recipes`, canonical token 값은 `@krds-community/tokens`에서 생성되며, 기초 스타일은 선택적으로 `@krds-community/styles`에서 가져옵니다.

```sh
pnpm add @krds-community/react @krds-community/styles
```

Astro 앱은 Astro 런타임과 네이티브 패키지를 함께 설치합니다.

```sh
pnpm add astro @krds-community/astro @krds-community/styles
```

다른 프레임워크와 Astro는 다음 패키지를 사용합니다. Web Components 런타임은 사용하지 않습니다.

| 프레임워크 | 패키지 |
| ---------- | ------ |
| React      | `@krds-community/react` |
| Vue        | `@krds-community/vue` |
| Svelte     | `@krds-community/svelte` |
| SolidJS    | `@krds-community/solid` |
| Angular    | `@krds-community/angular` |
| Astro      | `@krds-community/astro` |

설치 후 public export를 직접 import하는 최소 사용 예시는 다음과 같습니다. 각 컴포넌트의 전체 props/events/forms/a11y 계약과 복사 버튼은 [컴포넌트 API 안내](../../components/)에서 확인하세요.

```tsx
import { Button } from '@krds-community/react';

export function SaveButton() {
  return <Button type=\"submit\">저장</Button>;
}
```

```vue
<script setup lang="ts">
import { Button } from '@krds-community/vue';
</script>

<template>
  <Button type="submit">저장</Button>
</template>
```

```svelte
<script lang="ts">
  import { Button } from '@krds-community/svelte';
</script>

<Button type="submit">저장</Button>
```

```tsx
import { Button } from '@krds-community/solid';

export function SaveButton() {
  return <Button type=\"submit\">저장</Button>;
}
```

```ts
import { KrdsButtonComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsButtonComponent],
  template: '<krds-button type=\"submit\">저장</krds-button>',
})
export class SaveButtonComponent {}
```

```astro
---
import { Button } from '@krds-community/astro';
---

<Button type="submit">저장</Button>
```
