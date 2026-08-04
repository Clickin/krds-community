<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    description?: string;
    organization?: string;
    title?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    description = '',
    organization = '',
    title = '제목',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} class={`krds-identifier ${rootClass}`}>
  <span class="logo"><span class="sr-only">{organization || 'KRDS - Korea Design System'}</span></span>
  <span class="ban-txt">{description || organization || title}</span>
</div>