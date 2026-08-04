<script lang="ts">
  import { reflectValueAttribute } from './lib/shared.js';
  type Props = {
    id?: string;
    name?: string;
    label?: string;
    type?: string;
    placeholder?: string;
    passwordLabel?: string;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    autocomplete?: string;
    form?: string;
    hint?: string;
    oninput?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    label = '레이블',
    type,
    placeholder = '',
    passwordLabel = '입력한 비밀번호 보기',
    value = $bindable<string | undefined>(),
    modelValue = $bindable<string | number | boolean | undefined>(),
    disabled = false,
    required = false,
    readonly = false,
    autocomplete,
    form,
    hint = '',
    oninput,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const inputValue = $derived(
    value !== undefined
      ? String(value)
      : typeof modelValue === 'string' || typeof modelValue === 'number' || typeof modelValue === 'boolean'
        ? String(modelValue)
        : '',
  );
  const setValue = (event: Event) => {
    const next = (event.currentTarget as HTMLInputElement).value;
    if (value !== undefined) value = next;
    else modelValue = next;
    if (oninput) oninput(event);
  };
</script>

<div class="form-group">
  <div class="form-tit">
    <label for={id}>{label}</label>
  </div>
  <div class="form-conts btn-ico-wrap">
    <input
      {...rest}
      id={id}
      name={name || undefined}
      class={`krds-input ${rootClass}`}
      type={type || 'text'}
      {placeholder}
      value={inputValue}
      use:reflectValueAttribute={inputValue}
      {disabled}
      {required}
      {readonly}
      {autocomplete}
      {form}
      aria-describedby={hint ? `${id}-hint` : undefined}
      oninput={setValue}
    />
    <button type="button" class="krds-btn medium icon">
      <span class="sr-only">{passwordLabel}</span>
    </button>
  </div>
  {#if hint}<p class="form-hint" id={`${id}-hint`}>{hint}</p>{/if}
</div>