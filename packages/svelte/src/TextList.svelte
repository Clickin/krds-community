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

<ul {...rest} class={`decimal krds-info-list ${rootClass}`} role="list">
  {#each items as item}
    <li role="listitem">
      {labelOf(item)}
      {#if childrenOf(item).length}
        <ul class="dash krds-info-list" role="list">
          {#each childrenOf(item) as child}
            <li role="listitem">
              {labelOf(child)}
              {#if childrenOf(child).length}
                <ul class="hollow krds-info-list" role="list">
                  {#each childrenOf(child) as grandchild}<li role="listitem">{labelOf(grandchild)}</li>{/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>