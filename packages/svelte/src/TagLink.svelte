<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    label?: string;
    href?: string;
    size?: string;
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    label = '레이블',
    href = '#',
    size = 'large',
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div class={`krds-tag-wrap ${size || 'large'}`}>
  <a
    {...rest}
    {href}
    class={`krds-btn-tag link ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >{label}</a>
</div>