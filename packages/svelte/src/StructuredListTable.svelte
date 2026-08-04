<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, labelOf, flagOf, listOf } from './lib/shared.js';

  type StructuredListTableRow = {
    selectionLabel?: string;
    [key: string]: string | number | boolean | null | undefined;
  };

  type Props = {
    id?: string;
    columns?: Record<string, unknown>[];
    rows?: StructuredListTableRow[];
    caption?: string;
    title?: string;
    selectAllLabel?: string;
    actions?: Record<string, unknown>[];
    countLabel?: string;
    countOptions?: string[];
    sortLabel?: string;
    sortOptions?: string[];
    sortValue?: string;
    pagination?: Record<string, unknown>;
    href?: string;
    children?: Snippet;
    className?: string;
    class?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    columns = [],
    rows = [],
    caption = '',
    title = '제목',
    selectAllLabel = '',
    actions = [],
    countLabel = '',
    countOptions = [],
    sortLabel = '',
    sortOptions = [],
    sortValue = '',
    pagination,
    href = '#',
    children,
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim() || "sample");
</script>

<div class={`krds-structured-list-table ${rootClass}`}>
  <div class="search-list-top">
    <div class="sch-left">
      <div class="krds-check-area">
        <div class="krds-form-check">
          <input class="chk" id={`${id}-all`} type="checkbox" />
          <label for={`${id}-all`}>{selectAllLabel}</label>
        </div>
      </div>
      <ul class="side-line-ul">
        {#each actions as action}
          <li>
            <button class="krds-btn medium text" type="button">
              <i class={`svg-icon ico-${fieldOf(action, 'icon')}`}></i>{' '}{fieldOf(action, 'label')}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <ul class="sch-sort">
      <li>
        <strong class="sort-label"><label for={`${id}-result-count`}>{countLabel}</label></strong>
        {' '}
        <select class="krds-form-select-sort" id={`${id}-result-count`} aria-label={countLabel}>
          {#each countOptions as option}<option>{option}</option>{/each}
        </select>
      </li>
      <li>
        <strong class="sort-label"><label for={`${id}-sort`}>{sortLabel}</label></strong>
        <div class="w-sort-btn">
          {#each sortOptions as option}
            <button class:active={option === sortValue} type="button">{option}</button>
            {' '}
          {/each}
        </div>
        <div class="m-sort-btn">
          <select class="krds-form-select-sort" id={`${id}-sort`} value={sortValue} aria-label={sortLabel}>
            {#each sortOptions as option}<option>{option}</option>{/each}
          </select>
        </div>
      </li>
    </ul>
  </div>
  <div class="krds-table-wrap">
    <table class="tbl col data">
      <caption>{caption || title}</caption>
      <colgroup>
        {#each columns as column}
          <col style={fieldOf(column, 'width') ? `width: ${fieldOf(column, 'width')};` : undefined} />
        {/each}
        <col />
      </colgroup>
      <thead>
        <tr>
          {#each columns as column}
            <th scope="col">
              {#if column.key === 'download'}<span class="sr-only">{column.label}</span>{:else}{column.label}{/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row, rowIndex}
          <tr>
            {#each columns as column}
              {#if column.key === 'selected'}
                <th scope="row">
                  <div class="krds-form-check">
                    <input
                      class="chk"
                      id={`${id}-row-${rowIndex + 1}`}
                      type="checkbox"
                      aria-label={fieldOf(row, 'selectionLabel') || undefined}
                      checked={flagOf(row, 'selected')}
                    />
                    <label for={`${id}-row-${rowIndex + 1}`}></label>
                  </div>
                </th>
              {:else if column.key === 'download'}
                <td>
                  <button class="krds-btn medium text" type="button">
                    <i class="svg-icon ico-down"></i>{' '}{row[column.key]}
                  </button>
                </td>
              {:else}
                <td>{row[column.key]}</td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if pagination}
    <div class="krds-pagination">
      {#if flagOf(pagination, 'previousDisabled')}
        <span class="page-navi prev disabled">{fieldOf(pagination, 'previousLabel')}</span>
      {:else}
        <a class="page-navi prev" href={href}>{fieldOf(pagination, 'previousLabel')}</a>
      {/if}
      <div class="page-links">
        {#each listOf(pagination, 'items') as item}
          {#if labelOf(item) === 'ellipsis'}
            <span class="page-link link-dot"></span>
          {:else}
            {@const page = Number(labelOf(item))}
            <a class:active={page === Number(fieldOf(pagination, 'current'))} class="page-link" href={href}>
              {#if page === Number(fieldOf(pagination, 'current'))}<span class="sr-only">{fieldOf(pagination, 'currentLabel')} </span>{/if}
              {page}
            </a>
          {/if}
        {/each}
      </div>
      <a class="page-navi next" href={href}>{fieldOf(pagination, 'nextLabel')}</a>
    </div>
  {/if}
</div>