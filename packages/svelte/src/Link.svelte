<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    href?: string;
    target?: string;
    rel?: string;
    title?: string;
    label?: string;
    size?: string;
external?: boolean;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    href = '#',
    target,
    rel,
    title = '제목',
    label = '레이블',
    external,
    size = 'small',
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<a
  {...rest}
  {href}
  {target}
  {rel}
  title={title === '제목' ? undefined : title}
  class={`krds-btn link ${size} ${rootClass}`}
  onclick={(event) => invoke(onclick, event)}
>
  <span class="underline">{#if children}{@render children()}{:else}{label}{/if}</span>
  <i class:ico-go={target === '_blank' || external} class:ico-angle={target !== '_blank' && !external} class:right={target !== '_blank' && !external} class="svg-icon"></i>
</a>
