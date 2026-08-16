<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, labelOf, hrefOf } from './lib/shared.js';

  type ListItem = Record<string, unknown>;

  type Props = {
    id?: string;
    items?: ListItem[];
    dateLabel?: string;
    dateValue?: string;
    actionLabel?: string;
    tags?: string[];
    shareLabel?: string;
    favoriteLabel?: string;
    children?: Snippet;
    className?: string;
    class?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    items = [],
    dateLabel = '',
    dateValue = '',
    actionLabel = '',
    tags = [],
    shareLabel = '',
    favoriteLabel = '',
    children,
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<ul {...rest} class={`krds-structured-list type-full ${rootClass}`}>
  {#each items as item}
    <li class="structured-item">
      <div class="in">
        <div class="card-top">
          {#if fieldOf(item, 'badge')}
            <span class={`krds-badge ${fieldOf(item, 'badgeClass') || fieldOf(item, 'tone')}`}
              >{fieldOf(item, 'badge')}</span
            >
          {/if}
        </div>
        <div class="card-body">
          <a class="c-text" href={hrefOf(item)}>
            <p class="c-tit"><span class="span">{labelOf(item)}</span></p>
            {#if fieldOf(item, 'description')}<p class="c-txt">{fieldOf(item, 'description')}</p>{/if}
            <p class="c-date">
              <strong class="key">{fieldOf(item, 'dateLabel') || dateLabel}</strong>
              <span class="value">{fieldOf(item, 'date') || dateValue}</span>
            </p>
          </a>
          <div class="c-btn"><a class="krds-btn secondary" href={hrefOf(item)} title={labelOf(item)}>{actionLabel}</a></div>
        </div>
        <div class="card-btm">{#each tags as tag}<span class="tag">{tag}</span>{/each}</div>
        <div class="card-btn">
          <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-share svg-icon"></i>{' '}{shareLabel}</button>
          <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-like svg-icon"></i>{' '}{favoriteLabel}</button>
        </div>
      </div>
    </li>
  {/each}
</ul>