<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    steps?: { label?: string }[];
    current?: number;
    message?: string;
label?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class'>;

  let {
    steps = [],
    current,
    message = '현재단계',
    label = '단계',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<ol {...rest} class={`krds-step-wrap ${rootClass}`}>
  {#each steps as item, index}
    <li class:done={index < (current ?? 0)} class:active={index === (current ?? 0)}>
      <span>
        {#if index === (current ?? 0)}<em class="sr-only">{message}</em>{/if}
        <i class="step">{index + 1}{label}</i>
        <span class="step-tit">{item.label}</span>
      </span>
    </li>
  {/each}
</ol>
