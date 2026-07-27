# ADR 0004: 순수 TypeScript 공통 props contract

- **상태:** 승인
- **결정:** `@krds-community/recipes`가 `ButtonContractProps`, `TextInputContractProps`, `ChoiceContractProps`, `AccordionContractProps`, `KrdsAdditionalProps` 같은 framework-neutral props contract를 소유합니다. framework package는 이 타입에서 파생하고 native event, ref, slot, signal, form API를 local type으로 추가합니다.
- **결과:** canonical variant, size, state, item shape를 일관되게 유지하면서 runtime UI component는 공유하지 않습니다. framework별 label과 children은 native content type에 맞게 넓힐 수 있습니다.
