<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  /**
   * 실시간 유효성 검사 입력 필드 (extra).
   *
   * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
   * 계약(service_03_05.html: 실시간 유효성 검사 — focusout/keyup, global_08.html:
   * 클라이언트 측 검증 — Keyup/Focusout)을 참조해 동일한 검증 계약을 구현한다.
   *
   * `validate`는 콜백 또는 문자열 규칙("required" | "min-length:<n>" | "email")을
   * 받는다. 문자열 규칙은 conformance/데모용으로 콜백과 동일한 결과를 만든다.
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
    /** 초기값 (선택) */
    value?: string;
    /** 콜백 또는 문자열 규칙("required" | "min-length:<n>" | "email"). */
    validate: ((value: string) => ValidationResult | Promise<ValidationResult>) | string;
    /** 검증 시점: blur(focusout), 타이핑(keyup), 둘 다(both). 기본 focusout. */
    mode?: 'keyup' | 'focusout' | 'both';
    /** keyup 모드 디바운스(ms). 기본 300. */
    debounceMs?: number;
    /** 검증 전(미입력/미블러) 도움말. */
    hint?: string;
    /** 기본 "입력이 유효합니다." */
    successMessage?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
  }

  type Props = ValidatedInputProps &
    Omit<
      HTMLAttributes<HTMLInputElement>,
      | 'children'
      | 'class'
      | 'id'
      | 'value'
      | 'name'
      | 'placeholder'
      | 'type'
      | 'disabled'
      | 'required'
      | 'aria-invalid'
      | 'aria-describedby'
      | 'oninput'
      | 'onblur'
    >;

  const generatedId = $props.id();

  let {
    label,
    name,
    type = 'text',
    placeholder,
    value: initialValue = '',
    validate,
    mode = 'focusout',
    debounceMs = 300,
    hint,
    successMessage = '입력이 유효합니다.',
    required,
    disabled = false,
    className = '',
    id = `krds-validated-input-${generatedId}`,
    ...restProps
  }: Props = $props();

  let inputValue = $state(initialValue);
  let status = $state<'idle' | 'valid' | 'invalid'>('idle');
  let message = $state('');
  let inputElement: HTMLInputElement;
  // 진행 중인 검증을 무효화하기 위한 토큰 카운터(디바운스/async 경합 방지).
  let validateToken = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // 참조 DOM 계약: value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 패턴과 동일).
  $effect(() => {
    if (inputValue) inputElement.setAttribute('value', inputValue);
    else inputElement.removeAttribute('value');
  });

  const runRule = (rule: string, currentValue: string): ValidationResult => {
    if (rule === 'required') {
      return currentValue.trim()
        ? { valid: true }
        : { valid: false, message: '필수 입력 항목입니다.' };
    }
    if (rule.startsWith('min-length:')) {
      const min = Number(rule.slice('min-length:'.length));
      return currentValue.length >= min
        ? { valid: true }
        : { valid: false, message: `${min}자 이상 입력해 주세요.` };
    }
    if (rule === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue)
        ? { valid: true }
        : { valid: false, message: '올바른 이메일 형식으로 입력해 주세요.' };
    }
    return { valid: true };
  };

  // 계약: 빈 값도 validate에 전달한다(required 외 규칙은 빈 값도 스스로 판정).
  const validateNow = async () => {
    const token = ++validateToken;
    const result = await Promise.resolve(
      typeof validate === 'string' ? runRule(validate, inputValue) : validate(inputValue),
    );
    if (token !== validateToken) return;
    if (result.valid) {
      status = 'valid';
      message = '';
    } else {
      status = 'invalid';
      message = result.message ?? '';
    }
  };

  const onInput = (event: Event) => {
    inputValue = (event.currentTarget as HTMLInputElement).value;
    if (mode === 'keyup' || mode === 'both') {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(validateNow, debounceMs);
    }
  };

  const onBlur = () => {
    if (mode === 'focusout' || mode === 'both') {
      clearTimeout(debounceTimer);
      validateNow();
    }
  };

  // message 우선순위: 검증 결과 message(불가) > successMessage(가능) > hint(검증 전).
  const contsClass = $derived(
    status === 'invalid' ? 'is-error' : status === 'valid' ? 'is-success' : '',
  );
  const hintClass = $derived(
    status === 'invalid'
      ? 'form-hint-invalid'
      : status === 'valid'
        ? 'form-hint-success'
        : 'form-hint',
  );
  const displayMessage = $derived(
    status === 'invalid' ? message : status === 'valid' ? successMessage : (hint ?? ''),
  );
</script>

<div class={`krds-validated-input${className ? ` ${className}` : ''}`}>
  <div class="form-group">
    <div class="form-tit">
      <label for={id}>{label}</label>
    </div>
    <div class={contsClass ? `form-conts ${contsClass}` : 'form-conts'}>
      <input
        {...restProps}
        bind:this={inputElement}
        {id}
        class="krds-input"
        {type}
        {name}
        value={inputValue}
        {placeholder}
        {required}
        {disabled}
        aria-invalid={status === 'invalid' ? 'true' : undefined}
        aria-describedby={`${id}-message`}
        oninput={onInput}
        onblur={onBlur}
      />
    </div>
    <p id={`${id}-message`} class={hintClass}>{displayMessage}</p>
  </div>
</div>
