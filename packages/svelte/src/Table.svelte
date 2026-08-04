<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf } from './lib/shared.js';

  type Props = {
    id?: string;
    columns?: Record<string, unknown>[];
    rows?: Record<string, unknown>[];
    caption?: string;
    title?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    columns = [],
    rows = [],
    caption = '',
    title = '제목',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div class="krds-table-wrap">
  <table {...rest} class="tbl col data">
    <caption>{caption || title}</caption>
    <colgroup>
      {#each columns as column}
        <col style={fieldOf(column, 'width') ? `width: ${fieldOf(column, 'width')};` : undefined} />
      {/each}
    </colgroup>
    <thead>
      <tr>
        {#each columns as column}
          <th scope="col">{column.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as column, columnIndex}
            {#if columnIndex === 0}<th scope="row">{row[column.key]}</th>{:else}<td>{row[column.key]}</td>{/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>