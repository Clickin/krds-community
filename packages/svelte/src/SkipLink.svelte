<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    href?: string;
    label?: string;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-skip-link',
    href = '#',
    label = '레이블',
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div id={id} class={rootClass}>
  <a {...rest} {href} onclick={(event) => invoke(onclick, event)}>
    {#if children}{@render children()}{:else}{label}{/if}
  </a>
</div>