<script lang="ts">
  import { untrack } from 'svelte';

  type Option = { value: string; label: string; disabled?: boolean };

  type Props = {
    type?: 'single' | 'multi';
    size?: 'large' | 'medium';
    options?: Option[];
    selected?: string | string[];
    defaultSelected?: string | string[];
    onchange?: (value: string | string[]) => void;
    ariaLabel?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    type = 'single',
    size = 'medium',
    options = [],
    selected = $bindable<string | string[] | undefined>(),
    defaultSelected,
    onchange,
    ariaLabel = '선택',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  let internal = $state<string | string[] | undefined>(untrack(() => defaultSelected));
  const current = $derived(selected !== undefined ? selected : internal);
  const isSelected = (value: string) =>
    type === 'single' ? current === value : (Array.isArray(current) ? current : []).includes(value);

  const toggle = (value: string) => {
    let next: string | string[];
    if (type === 'single') {
      next = value;
    } else {
      const arr = Array.isArray(current) ? current : [];
      next = arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];
    }
    if (selected === undefined) internal = next;
    onchange?.(next);
  };
</script>

<div
  {...rest}
  class={`krds-chip ${type} ${size} ${rootClass}`}
  role={type === 'single' ? 'radiogroup' : 'group'}
  aria-label={ariaLabel}
>
  {#each options as option}
    <button
      type="button"
      class="krds-btn small text chip"
      class:active={isSelected(option.value)}
      aria-pressed={isSelected(option.value)}
      disabled={option.disabled}
      onclick={() => toggle(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
