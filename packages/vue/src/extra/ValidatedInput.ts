import { computed, defineComponent, h, onUnmounted, ref, useId, type PropType } from "vue";

/**
 * 실시간 유효성 검사 입력 필드 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용 계약
 * (service_03_05.html: 실시간 유효성 검사·제출 오류 초점, global_08.html:
 * 클라이언트 측 검증 — Keyup/Focusout)을 참조해 focusout/keyup 모드 검증과
 * is-error/is-success 상태 표시를 구현한다.
 *
 * `validate`는 검증 함수 또는 conformance/demo용 문자열 규칙을 받는다
 * (JSON 시리얼라이즈 가능): "required" | "min-length:<n>" | "email".
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export type ValidatedInputMode = "keyup" | "focusout" | "both";

/** 문자열 규칙 (conformance/demo용 — 함수 prop과 동일 계약). */
export type ValidationRule = "required" | `min-length:${number}` | "email";

export interface ValidatedInputProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  /** 초기값. 비어 있지 않을 때만 value 속성으로 렌더(공식 TextInput 계약과 동일). */
  value?: string;
  validate: ((value: string) => ValidationResult | Promise<ValidationResult>) | string;
  /** 검증 시점. 기본 "focusout" (service_03_05 계약). */
  mode?: ValidatedInputMode;
  /** keyup 모드 디바운스(ms). 기본 300. */
  debounceMs?: number;
  /** 검증 전(미입력/미블러) 도움말. */
  hint?: string;
  successMessage?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 문자열 규칙 평가. 규칙 메시지는 계약 문서 고정값. */
const evaluateRule = (rule: string, value: string): ValidationResult => {
  if (rule === "required") {
    return value.trim() === ""
      ? { valid: false, message: "필수 입력 항목입니다." }
      : { valid: true };
  }
  if (rule === "email") {
    return EMAIL_PATTERN.test(value)
      ? { valid: true }
      : { valid: false, message: "올바른 이메일 형식으로 입력해 주세요." };
  }
  if (rule.startsWith("min-length:")) {
    const length = Number(rule.slice("min-length:".length));
    return value.length < length
      ? { valid: false, message: `${length}자 이상 입력해 주세요.` }
      : { valid: true };
  }
  // 미지원 규칙 문자열은 통과(무해).
  return { valid: true };
};

export const ValidatedInput = defineComponent<ValidatedInputProps>({
  name: "KrdsValidatedInput",
  props: {
    label: { type: String, required: true },
    name: { type: String, default: undefined },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: undefined },
    value: { type: String, default: undefined },
    validate: {
      type: [Function, String] as PropType<
        ((value: string) => ValidationResult | Promise<ValidationResult>) | string
      >,
      required: true,
    },
    mode: { type: String as PropType<ValidatedInputMode>, default: "focusout" },
    debounceMs: { type: Number, default: 300 },
    hint: { type: String, default: undefined },
    successMessage: { type: String, default: undefined },
    required: Boolean,
    disabled: Boolean,
    className: { type: String, default: undefined },
    id: { type: String, default: undefined },
  },
  setup(props) {
    // defineComponent 제네릭은 props를 모두 optional로 타입하므로 런타임 기본값을 여기서 보정한다.
    const mode = props.mode ?? "focusout";
    const debounceMs = props.debounceMs ?? 300;
    const successMessage = props.successMessage ?? "입력이 유효합니다.";
    const validateRule = props.validate as ValidatedInputProps["validate"];

    const generatedId = `krds-validated-input-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const messageId = computed(() => `${id.value}-message`);

    const value = ref(props.value ?? "");
    const validated = ref(false);
    const result = ref<ValidationResult>({ valid: true });
    let requestId = 0;
    let timer: number | undefined;

    const runValidation = (current: string): Promise<ValidationResult> => {
      if (typeof validateRule === "string") {
        return Promise.resolve(evaluateRule(validateRule, current));
      }
      return Promise.resolve(validateRule(current));
    };

    // immediate=false면 디바운스 후 검증. 이전 타이머/늦은 응답은 무시한다.
    const validate = (immediate: boolean) => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      const current = ++requestId;
      const run = () =>
        runValidation(value.value).then((next) => {
          if (requestId !== current) return;
          validated.value = true;
          result.value = next;
        });
      if (immediate) run();
      else timer = window.setTimeout(run, debounceMs);
    };

    onUnmounted(() => {
      if (timer !== undefined) window.clearTimeout(timer);
    });

    const onInput = (event: Event) => {
      value.value = (event.target as HTMLInputElement).value;
      if (mode === "keyup" || mode === "both") validate(false);
    };

    const onBlur = () => {
      if (mode === "focusout" || mode === "both") validate(true);
    };

    return () => {
      const invalid = validated.value && !result.value.valid;
      const contsClass = !validated.value ? undefined : invalid ? "is-error" : "is-success";
      const messageClass = !validated.value
        ? "form-hint"
        : invalid
          ? "form-hint-invalid"
          : "form-hint-success";
      // 메시지 우선순위: 검증 결과 message > successMessage > hint(검증 전).
      const message = !validated.value
        ? (props.hint ?? "")
        : invalid
          ? (result.value.message ?? "")
          : successMessage;
      const rootClass = ["krds-validated-input", props.className].filter(Boolean).join(" ");

      return h("div", { class: rootClass }, [
        h("div", { class: "form-group" }, [
          h("div", { class: "form-tit" }, [h("label", { for: id.value }, props.label)]),
          h("div", { class: ["form-conts", contsClass].filter(Boolean).join(" ") }, [
            h("input", {
              id: id.value,
              class: "krds-input",
              type: props.type,
              name: props.name,
              // value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
              value: value.value || undefined,
              placeholder: props.placeholder,
              disabled: props.disabled || undefined,
              "aria-invalid": invalid ? "true" : undefined,
              "aria-describedby": messageId.value,
              onInput,
              onBlur,
            }),
          ]),
          h("p", { id: messageId.value, class: messageClass }, message),
        ]),
      ]);
    };
  },
});
