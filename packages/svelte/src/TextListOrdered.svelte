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

  const markerFor = (depth: number, index: number) => {
    if (depth === 0) return `${index + 1}. `;
    if (depth === 1) return `${String.fromCharCode(97 + index)}. `;
    return String.fromCodePoint(0x2460 + index);
  };
</script>

{#snippet renderList(list, depth)}
  <ol role="list" class="krds-info-list ordered">
    {#each list as item, index}
      <li role="listitem">
        <span class="num">{fieldOf(item, 'marker') || markerFor(depth, index)}</span>{labelOf(item)}
        {#if childrenOf(item).length}
          {@render renderList(childrenOf(item), depth + 1)}
        {/if}
      </li>
    {/each}
  </ol>
{/snippet}

<ol {...rest} class={`krds-info-list ordered ${rootClass}`} role="list">
  {#each items as item, index}
    <li role="listitem">
      <span class="num">{fieldOf(item, 'marker') || markerFor(0, index)}</span>{labelOf(item)}
      {#if childrenOf(item).length}
        {@render renderList(childrenOf(item), 1)}
      {/if}
    </li>
  {/each}
</ol>
