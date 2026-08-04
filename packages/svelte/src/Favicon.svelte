<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    href?: string;
    sizes?: string;
    size?: string;
    type?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    href = '#',
    sizes,
    size = '32x32',
    type = 'image/png',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<link {...rest} rel="icon" {href} sizes={sizes || size || '32x32'} type={type || 'image/png'} />