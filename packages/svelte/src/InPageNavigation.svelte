<script lang="ts">
  import { labelOf, hrefOf, flagOf } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    title?: string;
    pageTitle?: string;
    items?: unknown[];
    links?: unknown[];
    nav?: unknown[];
    actionLabel?: string;
    actionInfo?: string;
    actionCount?: string;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    title = '',
    pageTitle = '',
    items = [] as unknown[],
    links = [] as unknown[],
    nav = [] as unknown[],
    actionLabel = '',
    actionInfo = '',
    actionCount = '',
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
</script>

<div class="krds-in-page-navigation-type">
  <div {...rest} class={`krds-in-page-navigation-area ${rootClass}`}>
    <div class="in-page-navigation-header">
      <p class="quick-caption">{title}</p>
      <p class="quick-title">{pageTitle}</p>
    </div>
    <nav class="in-page-navigation-list" aria-label={title || undefined}>
      <ul>
        {#each navigationItems as item}
          <li><a class:active={flagOf(item, 'current')} href={hrefOf(item)}>{labelOf(item)}</a></li>
        {/each}
      </ul>
    </nav>
    <div class="in-page-navigation-action">
      <button class="krds-btn medium" type="button">{actionLabel}</button>
      <p class="quick-info">{actionInfo}{actionInfo && actionCount ? ' ' : ''}{#if actionCount}<strong>{actionCount}</strong>{/if}</p>
    </div>
  </div>
</div>