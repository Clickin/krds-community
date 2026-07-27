# ADR 0003: 접근성은 release를 차단하는 요구사항

- **상태:** 승인
- **결정:** native semantics를 우선합니다. Accordion contract는 `aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`을 요구하고, input contract는 native label 관계와 상태 semantics를 요구합니다.
- **참고:** `Initializer-org/krds-vue`는 명시적인 attribute binding을 검토하는 참고 자료로만 사용했으며 source를 복사하지 않았습니다.
- **결과:** 자동 axe 검사는 keyboard, focus, form, screen-reader 관점 assertion을 보완할 뿐 대체하지 않습니다.
