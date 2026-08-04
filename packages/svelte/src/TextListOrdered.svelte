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

<ol {...rest} class={`krds-info-list ordered ${rootClass}`} role="list">
  {#each items as item, index}
    <li role="listitem">
      <span class="num">{index + 1}.</span>{labelOf(item)}
      {#if childrenOf(item).length}
        <ol class="krds-info-list ordered" role="list">
          {#each childrenOf(item) as child, childIndex}
            <li role="listitem">
              <span class="num">{String.fromCharCode(97 + childIndex)}.</span>{labelOf(child)}
              {#if childrenOf(child).length}
                <ol class="krds-info-list ordered" role="list">
                  {#each childrenOf(child) as grandchild}
                    <li role="listitem"><span class="num">{fieldOf(grandchild, 'marker')}</span>{labelOf(grandchild)}</li>
                  {/each}
                </ol>
              {/if}
            </li>
          {/each}
        </ol>
      {/if}
    </li>
  {/each}
</ol>