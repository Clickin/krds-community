<script lang="ts">
  import { toneClass, invoke } from './lib/shared.js';
  import type { KrdsTone } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    label?: string;
    tone?: KrdsTone;
    appearance?: 'outline' | 'solid' | 'light';
    size?: string;
    number?: boolean;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    label = '레이블',
    tone = 'primary',
    appearance = 'outline',
    size = '',
    number = false,
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<span
  {...rest}
  class={`krds-badge ${
    appearance === 'outline'
      ? `outline-${toneClass[tone]}`
      : `bg-${appearance === 'light' ? 'light-' : ''}${toneClass[tone]}`
  } ${size} ${number ? 'number' : ''} ${rootClass}`}
  onclick={(event) => invoke(onclick, event)}
>{#if children}{@render children()}{:else}{label}{/if}</span>