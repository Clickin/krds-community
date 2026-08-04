import {
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
} from "solid-js";

/**
 * 실시간 유효성 검사 입력 필드 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(service_03_05.html: 실시간 유효성 검사 — 입력 필드가 포커스를 잃을 때,
 * global_08.html: 클라이언트 측 검증 Keyup/Focusout)을 참조해 검증 시점별
 * hint/error/success 상태를 동적으로 전환한다.
 *
 * `validate`는 함수(비동기 허용) 또는 conformance/demo용 문자열 규칙
 * ("required" | "min-length:<n>" | "email")이다.
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export type ValidatedInputValidate =
  | ((value: string) => ValidationResult | Promise<ValidationResult>)
  | string;

export interface ValidatedInputProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  /** 초기값 (선택). 비어 있지 않을 때만 value 속성으로 렌더한다. */
  value?: string;
  validate: ValidatedInputValidate;
  /** 검증 시점. 기본 "focusout" (service_03_05 계약). */
  mode?: "keyup" | "focusout" | "both";
  /** keyup 모드 디바운스(ms). 기본 300. */
  debounceMs?: number;
  /** 검증 전(미입력/미블러) 도움말. */
  hint?: string;
  /** 검증 통과 시 메시지. 기본 "입력이 유효합니다." */
  successMessage?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 문자열 규칙을 함수로 해석한다. 알 수 없는 규칙은 항상 유효 처리. */
const ruleValidator = (rule: string): ((value: string) => ValidationResult) => {
  if (rule === "required") {
    return (value) =>
      value.trim() ? { valid: true } : { valid: false, message: "필수 입력 항목입니다." };
  }
  const minLength = rule.match(/^min-length:(\d+)$/);
  if (minLength) {
    const n = Number(minLength[1]);
    return (value) =>
      value.length >= n
        ? { valid: true }
        : { valid: false, message: `${n}자 이상 입력해 주세요.` };
  }
  if (rule === "email") {
    return (value) =>
      EMAIL_RE.test(value)
        ? { valid: true }
        : { valid: false, message: "올바른 이메일 형식으로 입력해 주세요." };
  }
  return () => ({ valid: true });
};

export function ValidatedInput(rawProps: ValidatedInputProps) {
  const merged = mergeProps(
    {
      type: "text",
      mode: "focusout",
      debounceMs: 300,
      successMessage: "입력이 유효합니다.",
      required: false,
      disabled: false,
      id: `krds-validated-input-${createUniqueId()}`,
    },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    "label",
    "validate",
    "mode",
    "debounceMs",
    "hint",
    "successMessage",
    "required",
    "className",
  ]);

  const [value, setValue] = createSignal(merged.value ?? "");
  const [state, setState] = createSignal<"idle" | "valid" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = createSignal("");
  const validate =
    typeof props.validate === "string" ? ruleValidator(props.validate) : props.validate;
  let inputElement: HTMLInputElement | undefined;
  // 진행 중인 검증 요청을 무효화하기 위한 토큰. 새 입력/블러마다 증가시켜
  // 이전 요청의 결과가 늦게 도착해도 반영되지 않게 한다.
  let requestToken = 0;

  // 참조 DOM 계약: value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
  createEffect(() => {
    const current = value();
    if (current) inputElement?.setAttribute("value", current);
    else inputElement?.removeAttribute("value");
  });

  const runValidation = (current: string) => {
    const requestId = ++requestToken;
    Promise.resolve(validate(current)).then((result) => {
      if (requestToken !== requestId) return;
      if (result.valid) {
        setState("valid");
        setErrorMessage("");
      } else {
        setState("invalid");
        setErrorMessage(result.message ?? "");
      }
    });
  };

  // keyup 모드: 타이핑마다 디바운스 후 검증. 첫 실행(마운트)은 건너뛴다 —
  // 검증 전에는 아무 상태도 적용하지 않는다(모드 focusout 계약).
  let started = false;
  createEffect(() => {
    const current = value();
    if (!started) {
      started = true;
      return;
    }
    if (props.mode === "keyup" || props.mode === "both") {
      const timer = window.setTimeout(() => runValidation(current), props.debounceMs);
      onCleanup(() => window.clearTimeout(timer));
    }
  });

  // message 우선순위: 검증 결과 message(불가) > successMessage(가능) > hint(검증 전).
  const message = () => {
    if (state() === "invalid") return errorMessage();
    if (state() === "valid") return props.successMessage;
    return props.hint;
  };
  const messageClass = () => {
    if (state() === "invalid") return "form-hint-invalid";
    if (state() === "valid") return "form-hint-success";
    return "form-hint";
  };

  return (
    <div class={`krds-validated-input${props.className ? ` ${props.className}` : ""}`}>
      <div class="form-group">
        <div class="form-tit">
          <label for={nativeProps.id}>{props.label}</label>
        </div>
        <div
          class={`form-conts${state() === "invalid" ? " is-error" : ""}${state() === "valid" ? " is-success" : ""}`}
        >
          <input
            id={nativeProps.id}
            ref={(element) => {
              inputElement = element;
            }}
            class="krds-input"
            type={nativeProps.type}
            name={nativeProps.name}
            value={value()}
            placeholder={nativeProps.placeholder}
            disabled={nativeProps.disabled || undefined}
            required={props.required || undefined}
            aria-invalid={state() === "invalid" || undefined}
            aria-describedby={`${nativeProps.id}-message`}
            onInput={(event) => setValue(event.currentTarget.value)}
            onBlur={() => {
              if (props.mode === "focusout" || props.mode === "both") runValidation(value());
            }}
          />
        </div>
        <p id={`${nativeProps.id}-message`} class={messageClass()}>
          {message()}
        </p>
      </div>
    </div>
  );
}
