<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    label?: string;
    size?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    label = '레이블',
    size = '',
    disabled = false,
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<button
  {...rest}
  type="button"
  {disabled}
  class={`krds-btn ${size} ${rootClass}`}
  onclick={(event) => invoke(onclick, event)}
>
  {#if children}{@render children()}{:else}{label}{/if}
  <i class="ico-sch svg-icon"></i>
</button>