---
title: 복사한 컴포넌트 업데이트
description: CLI로 복사한 컴포넌트의 출처와 변경 여부를 확인하고 안전하게 마이그레이션하는 방법입니다.
---

`@krds-community/krds-cli`의 `component copy`와 `component paste`는 프레임워크별 컴포넌트 소스와 함께 출처 메타데이터를 생성합니다. 생성된 소스의 헤더에는 다음 값이 고정된 형식으로 기록됩니다.

- `@krds-community/component`: 컴포넌트 이름
- `@krds-community/framework`: 생성 대상 프레임워크
- `@krds-community/source-version`: 소스를 생성한 커뮤니티 버전
- `@krds-community/source-hash`: 정규화된 소스의 결정적 해시
- `@krds-community/source`: 소스 매니페스트 식별자

해시를 사람이 직접 계산하거나 파일의 전체 내용을 비교할 필요 없이, 같은 컴포넌트와 프레임워크를 다시 복사해 현재 파일이 같은 소스인지 확인할 수 있습니다.

## 매니페스트와 소스 revision 확인

지원 목록을 출력하면 컴포넌트별 매니페스트 식별자, source revision/version, 정규화된 source hash를 확인할 수 있습니다.

```sh
pnpm dlx @krds-community/krds-cli component list
```

이 값은 실행 시각이나 로컬 경로에 따라 바뀌지 않는 결정적 정보입니다. `component copy`가 생성하는 헤더에도 같은 출처 정보가 포함되므로, 목록의 revision/hash와 프로젝트 파일의 헤더를 비교해 어떤 소스에서 복사했는지 추적할 수 있습니다.

## 처음 복사하기

출력 파일을 지정해 컴포넌트를 프로젝트에 복사합니다.

```sh
pnpm dlx @krds-community/krds-cli component copy button \
  --framework react \
  --out src/components/Button.tsx
```

## 변경 여부 확인과 diff 보기

같은 명령을 기존 출력 경로에 다시 실행하면 별도의 체크 모드 없이 최신 소스와 현재 파일을 비교할 수 있습니다.

```sh
pnpm dlx @krds-community/krds-cli component copy button \
  --framework react \
  --out src/components/Button.tsx
```

- 대상 파일이 없으면 메타데이터가 포함된 새 소스를 씁니다.
- 파일의 `@krds-community/source-hash`가 현재 소스와 같으면 **변경 없음(no-op)** 으로 종료합니다.
- 해시가 다르거나 헤더가 없으면 파일을 덮어쓰지 않고 unified diff와 마이그레이션 안내를 출력하며 실패 상태로 종료합니다. diff를 검토한 뒤 프로젝트의 변경 사항을 보존할지, 커뮤니티 소스로 갱신할지 결정합니다.
- 다른 컴포넌트·프레임워크의 헤더가 있는 파일도 안전을 위해 일치하지 않는 대상으로 취급합니다.

이 비교 결과는 제어 문자나 현재 시각에 의존하지 않으므로 CI에서 소스 드리프트를 감지하는 검사로 사용할 수 있습니다. 다만 로컬 파일에 직접 추가한 비즈니스 로직과 접근성 보정은 해시가 달라지는 일반적인 원인이므로, CLI가 출력한 diff를 검토하지 않고 자동 갱신하지 마세요.

## 명시적으로 갱신하거나 다른 이름으로 보존하기

변경된 대상 파일을 새 커뮤니티 소스로 교체하려면 diff를 검토한 뒤 반드시 `--force`를 지정합니다. `copy`로 생성해 바로 저장하는 경우와 `paste --from <file> --out <file>`으로 저장하는 경우 모두 기본값은 덮어쓰기가 아닙니다.

```sh
pnpm dlx @krds-community/krds-cli component copy button \
  --framework react \
  --out src/components/Button.tsx \
  --force
```

기존 파일을 보존하면서 소스를 다른 컴포넌트 이름으로 생성하려면 `--as <name>`을 사용합니다.

```sh
pnpm dlx @krds-community/krds-cli component copy button \
  --framework react \
  --out src/components/Button.tsx \
  --as ButtonV2
```

`--as`로 만든 소스도 컴포넌트·프레임워크·`source-version`·`source-hash`·매니페스트 식별자를 포함합니다. `--force`와 `--as`는 서로 다른 의도를 표현합니다. 전자는 기존 경로의 명시적 교체이고, 후자는 기존 구현과 새 구현을 함께 유지하는 마이그레이션 단계입니다. 어느 경우든 새 소스와 로컬 수정 사항의 props, 이벤트, 스타일 호환성을 직접 확인해야 합니다.

## 제한 사항

복사한 소스는 프로젝트 코드로 관리되며 설치된 프레임워크 패키지와 자동 동기화되지 않습니다. CLI는 메타데이터가 있는 파일의 출처와 내용 차이만 알려 주므로 다음은 직접 확인해야 합니다.

- 프로젝트에서 수정한 props, 이벤트, 스타일, 비즈니스 로직의 호환성
- 프레임워크별 의존성 및 import 경로 변경
- KRDS 공식 HTML 원문과 커뮤니티 구현 사이의 차이와 접근성 보정
- `--force` 이후의 테스트, 키보드 동작, 포커스 복원 및 실제 화면 검증

공식 KRDS 원문을 덮어쓰지 않으며, 커뮤니티 소스의 버전·해시와 프로젝트 변경 사항을 함께 검토하는 것이 안전한 업데이트 절차입니다.
