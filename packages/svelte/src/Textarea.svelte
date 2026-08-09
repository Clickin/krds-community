<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    maxLength?: number;
    value?: string;
    modelValue?: string | number | boolean;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    autocomplete?: string;
    form?: string;
    oninput?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    label = '',
    placeholder = '',
    hint,
    maxLength,
    value = $bindable<string | undefined>(),
    modelValue = $bindable<string | number | boolean | undefined>(),
    disabled = false,
    required = false,
    readonly = false,
    autocomplete,
    form,
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
    const next = (event.currentTarget as HTMLTextAreaElement).value;
    if (value !== undefined) value = next;
    else modelValue = next;
    invoke(oninput, event);
  };
</script>

<textarea
  {...rest}
  id={id}
  name={name || undefined}
  class={`krds-input ${rootClass}`}
  {placeholder}
  maxlength={maxLength}
  value={inputValue}
  {disabled}
  {required}
  {readonly}
  {autocomplete}
  {form}
  oninput={setValue}
></textarea>
{#if label}<label for={id}>{label}</label>{/if}
{#if hint}<p id={`${id}-hint`}>{hint}</p>{/if}