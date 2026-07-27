# ADR 0002: framework package는 native 방식으로 구현

- **상태:** 승인
- **결정:** React, Vue, Svelte, SolidJS, Angular가 각각 native markup, lifecycle, events, refs, forms integration을 소유합니다. 공통 package는 token, recipe, 순수 behavioral contract만 제공합니다.
- **결과:** 필요한 markup 반복은 의도된 것입니다. Web Components와 공통 runtime component layer는 사용하지 않습니다.
