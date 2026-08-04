import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { cx } from "@krds-community/recipes";

/**
 * 실시간 유효성 검사 입력 필드 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용 계약
 * (service_03_05.html: 실시간 유효성 검사 — focusout 시점 검증, global_08.html:
 * 클라이언트 측 검증 — Keyup/Focusout)을 참조해 동일한 계약을 구현한다.
 *
 * `validate`는 함수(백엔드 검증 배선 가능) 또는 규칙 문자열("required" |
 * "min-length:N" | "email")을 받는다. 함수 prop은 JSON 시리얼라이즈가 안 되므로
 * conformance/demo에서는 문자열 규칙을 사용한다.
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface ValidatedInputProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  /** 초기값 (선택). value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약). */
  value?: string;
  validate: ((value: string) => ValidationResult | Promise<ValidationResult>) | string;
  /** 검증 시점: 기본 "focusout" (service_03_05 계약). */
  mode?: "keyup" | "focusout" | "both";
  /** keyup 모드 디바운스(ms). 기본 300. */
  debounceMs?: number;
  /** 검증 전(미입력/미블러) 도움말. */
  hint?: string;
  /** 검증 통과 시 메시지. 기본 "입력이 유효합니다.". */
  successMessage?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const RULE_MESSAGES = {
  required: "필수 입력 항목입니다.",
  email: "올바른 이메일 형식으로 입력해 주세요.",
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRule = (rule: string, value: string): ValidationResult => {
  if (rule === "required") {
    return value.trim() === ""
      ? { valid: false, message: RULE_MESSAGES.required }
      : { valid: true };
  }
  const minLength = rule.match(/^min-length:(\d+)$/);
  if (minLength) {
    const length = Number(minLength[1]);
    return value.length >= length
      ? { valid: true }
      : { valid: false, message: `${length}자 이상 입력해 주세요.` };
  }
  if (rule === "email") {
    return EMAIL_PATTERN.test(value.trim())
      ? { valid: true }
      : { valid: false, message: RULE_MESSAGES.email };
  }
  return { valid: true };
};

export function ValidatedInput({
  label,
  name,
  type = "text",
  placeholder,
  value: initialValue,
  validate,
  mode = "focusout",
  debounceMs = 300,
  hint,
  successMessage = "입력이 유효합니다.",
  required = false,
  disabled = false,
  className,
  id: providedId,
}: ValidatedInputProps) {
  const generatedId = useId();
  const id = providedId ?? `krds-validated-input-${generatedId}`;

  const [value, setValue] = useState(initialValue ?? "");
  // null = 검증 전(미블러/미입력) — 상태 없음(hint만 표시).
  const [result, setResult] = useState<ValidationResult | null>(null);
  const requestRef = useRef(0);
  const debounceTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(debounceTimer.current), []);

  const runValidation = (nextValue: string) => {
    const requestId = ++requestRef.current;
    const outcome =
      typeof validate === "string" ? validateRule(validate, nextValue) : validate(nextValue);
    Promise.resolve(outcome).then((nextResult) => {
      if (requestRef.current === requestId) setResult(nextResult);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    if (mode === "keyup" || mode === "both") {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => runValidation(nextValue), debounceMs);
    }
  };

  const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
    if (mode === "focusout" || mode === "both") {
      window.clearTimeout(debounceTimer.current);
      runValidation(value);
    }
  };

  const statusClass = result === null ? "" : result.valid ? "is-success" : "is-error";
  const message =
    result === null ? hint : result.valid ? (result.message ?? successMessage) : result.message;
  const messageClass = result === null ? "form-hint" : result.valid ? "form-hint-success" : "form-hint-invalid";

  return (
    <div className={cx("krds-validated-input", className)}>
      <div className="form-group">
        <div className="form-tit">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className={cx("form-conts", statusClass)}>
          <input
            id={id}
            className="krds-input"
            type={type}
            name={name}
            // value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
            value={value || undefined}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={result !== null && !result.valid ? true : undefined}
            aria-describedby={`${id}-message`}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <p id={`${id}-message`} className={messageClass}>
          {message}
        </p>
      </div>
    </div>
  );
}
