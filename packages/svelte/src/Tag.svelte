<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    label?: string;
    size?: string;
    removable?: boolean;
    message?: string;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    id,
    label = '레이블',
    size = 'large',
    removable = false,
    message = '도움말',
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div class={`krds-tag-wrap ${size || 'large'}`}>
  <span {...rest} class={`krds-btn-tag ${rootClass}`}>
    {label}
    {#if removable}
      <button class="btn-delete" type="button" onclick={(event) => invoke(onclick, event)}>
        <span class="sr-only">{message}</span>
      </button>
    {/if}
  </span>
</div>