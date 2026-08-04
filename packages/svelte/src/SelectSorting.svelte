<script lang="ts">
  import { selectRecipe, invoke } from './lib/shared.js';
  import type { InputState } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    name?: string;
    options?: { value: string; label: string; disabled?: boolean }[];
    disabled?: boolean;
    required?: boolean;
    form?: string;
    title?: string;
    selected?: string;
    modelValue?: string;
    defaultValue?: string;
    controlState?: string;
    onchange?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    options = [] as { value: string; label: string; disabled?: boolean }[],
    disabled = false,
    required = false,
    form,
    title = '',
    selected = $bindable<string | undefined>(),
    modelValue = $bindable<string | undefined>(),
    defaultValue = '',
    state: stateProp,
    controlState = stateProp ?? 'default',
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const selection = $derived(
    modelValue !== undefined
      ? String(modelValue)
      : selected !== undefined
        ? selected
        : defaultValue || String(options[0]?.value ?? ''),
  );
  const selectState: InputState = $derived(
    controlState === 'error' ||
      controlState === 'success' ||
      controlState === 'information'
      ? controlState
      : 'default',
  );
  const selectClasses = $derived(
    selectRecipe({ variant: 'sorting', state: selectState === 'error' ? 'error' : 'default' }),
  );
  const setSelection = (next: string, event?: Event) => {
    selected = next;
    modelValue = next;
    if (event) invoke(onchange, event);
  };
</script>

<select
  {...rest}
  id={id}
  name={name || undefined}
  {disabled}
  {required}
  {form}
  {title}
  aria-label={title || undefined}
  aria-invalid={selectState === 'error' ? 'true' : undefined}
  value={selection}
  onchange={(event) => setSelection((event.currentTarget as HTMLSelectElement).value, event)}
  class={`${selectClasses.control} ${rootClass}`.trim()}
>
  {#each options as option}
    <option value={option.value} disabled={option.disabled}>{option.label}</option>
  {/each}
</select>