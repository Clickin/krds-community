<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    message?: string;
    description?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-masthead',
    message = '도움말',
    description = '',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} id={id} class={rootClass}>
  <div class="toggle-wrap">
    <div class="toggle-head">
      <div class="inner"><span class="nuri-txt">{message || description}</span></div>
    </div>
  </div>
</div>