<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { selectRecipe, type InputState, type SelectRecipeSize } from '@krds-community/recipes';

  type Option = {
    value?: string;
    label?: string;
    disabled?: boolean;
    [key: string]: unknown;
  };

  type Props = {
    id?: string;
    name?: string;
    label?: string;
    value?: unknown;
    modelValue?: unknown;
    selected?: string;
    defaultValue?: string;
    options?: Option[];
    disabled?: boolean;
    required?: boolean;
    form?: string;
    hint?: string;
    controlState?: string;
    size?: string;
    variant?: string;
    type?: string;
    title?: string;
    onchange?: (event: Event) => void;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    label = '레이블',
    value,
    modelValue = $bindable<unknown>(),
    selected = $bindable<string | undefined>(),
    defaultValue = '',
    options = [],
    disabled = false,
    required = false,
    form,
    hint = '',
    state: stateProp,
    controlState = stateProp ?? 'default',
    size = '',
    variant = '',
    type = '',
    title = '제목',
    onchange,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const selectState: InputState = $derived(
    controlState === 'error' ||
      controlState === 'success' ||
      controlState === 'information'
      ? controlState
      : 'default',
  );
  const selectVariant = $derived(
    variant === 'size' || size
      ? 'size'
      : variant === 'state' || selectState !== 'default'
        ? 'state'
        : 'default',
  );
  const selectClasses = $derived(
    selectRecipe({
      variant: selectVariant,
      size: (size || variant === 'size' ? (size as SelectRecipeSize) : undefined),
      state: selectState,
    }),
  );
  const selection = $derived(
    modelValue !== undefined
      ? String(modelValue)
      : selected !== undefined
        ? selected
        : defaultValue || String(options[0]?.value ?? ''),
  );

  const setSelection = (next: string, event?: Event) => {
    selected = next;
    modelValue = next;
    if (event && typeof onchange === 'function') onchange(event);
  };
</script>

<div class="form-group">
  <div class="form-tit"><label for={id}>{label}</label></div>
  <div class="form-conts">
    <select
      {...rest}
      id={id}
      name={name || undefined}
      {disabled}
      {required}
      {form}
      title={title}
      value={selection}
      onchange={(event) => setSelection(event.currentTarget.value, event)}
      class={`${selectClasses.control} ${rootClass}`.trim()}
      aria-invalid={selectState === 'error' ? 'true' : undefined}
      aria-describedby={hint ? `${id}-hint` : undefined}
    >
      {#each options as option, index}
        <option
          value={option.value}
          disabled={option.disabled}
          selected={selectVariant === 'size' && index === 0}
        >{option.label}</option>
      {/each}
    </select>
  </div>
  {#if hint}
    <p
      id={`${id}-hint`}
      class={selectState === 'error'
        ? 'form-hint-invalid'
        : selectState === 'success'
          ? 'form-hint-success'
          : selectState === 'information'
            ? 'form-hint-information'
            : 'form-hint'}
    >{hint}</p>
  {/if}
</div>