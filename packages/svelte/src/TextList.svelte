<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { labelOf, childrenOf, fieldOf } from './lib/shared.js';

  type ListItem = Record<string, unknown>;

  type Props = {
    id?: string;
    items?: ListItem[];
ordered?: boolean;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    items = [],
    ordered,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

{#snippet renderList(list, depth)}
  <ul class="krds-info-list {depth === 1 ? 'dash' : 'hollow'}" role="list">
    {#each list as item}
      <li role="listitem">
        {labelOf(item)}
        {#if childrenOf(item).length}
          {@render renderList(childrenOf(item), depth + 1)}
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<ul {...rest} class={`decimal krds-info-list ${rootClass}`} role="list">
  {#each items as item}
    <li role="listitem">
      {labelOf(item)}
      {#if childrenOf(item).length}
        {@render renderList(childrenOf(item), 1)}
      {/if}
    </li>
  {/each}
</ul>