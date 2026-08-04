<script lang="ts">
  import type { Snippet } from 'svelte';
  import Calendar from './Calendar.svelte';
  import { invoke, reflectValueAttribute } from './lib/shared.js';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    name?: string;
    label?: string;
    hint?: string;
    placeholder?: string;
    calendarOpenLabel?: string;
    modelValue?: unknown;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    form?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onClick?: (event: Event) => void;
    inputValue?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    label = '레이블',
    hint = '',
    placeholder = '',
    calendarOpenLabel = '달력 열기',
    modelValue,
    disabled = false,
    required = false,
    readonly = false,
    form,
    oninput,
    onchange,
    onClick,
    inputValue = '',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());

  let isOpen = $state(false);
  const toggleOpen = invoke(() => { isOpen = !isOpen; });

  let localInputValue = $state('');
  $effect(() => { localInputValue = inputValue || ''; });
  const setInputValue = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    localInputValue = target.value;
  };
</script>

<div class={`form-group ${rootClass}`}>
  <div class="form-tit"><label for={id}>{label}</label></div>
  <div class="form-conts">
    <div class="form-conts calendar-conts">
      <div class="calendar-input">
        <input
          id={id}
          name={name || undefined}
          class="krds-input datepicker cal"
          type="number"
          placeholder={placeholder || 'YYYY.MM.DD'}
          value={localInputValue}
          use:reflectValueAttribute={localInputValue}
          {disabled}
          {required}
          {readonly}
          {form}
          oninput={setInputValue}
        />
        <button class="krds-btn medium icon form-btn-datepicker" type="button" onclick={toggleOpen}>
          <span class="sr-only">{calendarOpenLabel}</span>
          <i class="svg-icon ico-calendar"></i>
        </button>
      </div>
      <Calendar
        id={id}
        open={isOpen}
        kind="calendar"
        single={false}
        inputValue={localInputValue}
        oninput={(event: Event) => { setInputValue(event); }}
        onchange={onchange}
        onClick={onClick}
        {disabled}
        {required}
        {readonly}
        {form}
        {...rest}
      />
    </div>
  </div>
  {#if hint}<p class="form-hint">{hint}</p>{/if}
</div>