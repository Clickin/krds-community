# ADR 0001: 공식 HTML을 규범적 기준으로 사용

- **상태:** 승인
- **결정:** 고정된 KRDS HTML Component Kit를 규범적 원본으로 사용합니다. framework package는 native framework API에 맞게 markup을 조정할 수 있지만 KRDS 요구사항을 다시 정의하지 않습니다.
- **결과:** 모든 구현 변경은 upstream fixture와 conformance manifest에서 시작합니다. upstream defect로 보이는 내용은 조용히 고치지 않고 `upstream/patches`와 `conformance/errata`에 기록합니다.
