<script lang="ts">
  import { invoke, labelOf } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    current?: number;
    items?: unknown[];
    previousLabel?: string;
    nextLabel?: string;
    navigationLabel?: string;
    message?: string;
    modelValue?: string | number;
    href?: string;
title?: string;
label?: string;
    previousDisabled?: boolean;
    onclick?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    current = $bindable<number | undefined>(),
    items = [1, 2, 3, 4, 5] as unknown[],
    previousLabel = '이전',
    nextLabel = '다음',
    navigationLabel = '페이지 이동',
    message = '',
    title,
    label,
    modelValue = $bindable<string | number | undefined>(),
    href = '#',
    previousDisabled = false,
    onclick,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const currentIndex = $derived(current ?? 0);
  const selectPage = (page: number, event: Event) => {
    current = page;
    modelValue = page;
    invoke(onclick, event);
  };
</script>

<div
  {...rest}
  class={`krds-pagination ${rootClass}`}
  role="navigation"
  aria-label={navigationLabel}
>
  {#if previousDisabled || (current ?? 1) <= 1}
    <span class="page-navi prev disabled" href={href ?? '#'}>{previousLabel}</span>
  {:else}
    <a
      href={href}
      class="page-navi prev"
      onclick={(event) => {
        event.preventDefault();
        selectPage((current ?? 1) - 1, event);
      }}
    >{previousLabel}</a>
  {/if}
  <div class="page-links">
    {#each items as item}
      {#if labelOf(item) === 'ellipsis'}
        <span class="page-link link-dot"></span>
      {:else}
        {@const page = Number(labelOf(item))}
        <a
          href={href}
          class="page-link"
          class:active={page === (current ?? 1)}
          onclick={(event) => {
            event.preventDefault();
            selectPage(page, event);
          }}
        >
          {#if page === (current ?? 1)}<span class="sr-only">{message} </span>{/if}
          {page}
        </a>
      {/if}
    {/each}
  </div>
  <a
    href={href}
    class="page-navi next"
    onclick={(event) => {
      event.preventDefault();
      selectPage((current ?? 1) + 1, event);
    }}
  >{nextLabel}</a>
</div>