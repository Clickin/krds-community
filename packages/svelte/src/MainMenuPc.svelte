<script lang="ts">
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, flagOf, labelOf, hrefOf, childrenOf, recordOf, listOf } from './lib/shared.js';

  type Props = {
    id?: string;
    items?: KrdsNavItem[];
    links?: KrdsNavItem[];
    nav?: KrdsNavItem[];
    menuLabel?: string;
    sample?: boolean;
    children?: Snippet;
    class?: string;
    className?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-main-menu',
    items = [],
    links = [],
    nav = [],
    menuLabel = '',
    sample = false,
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
</script>

<nav {...rest} class={`krds-main-menu ${rootClass}`} class:sample={sample}>
  <div class="inner">
    <ul class="gnb-menu" aria-label={sample ? undefined : menuLabel || undefined}>
      {#each navigationItems as item, topIndex}
        {@const topChildren = childrenOf(item)}
        {@const topBanner = recordOf(item, 'banner')}
        {@const mainPanelId = `${id}-main-${topIndex}`}
        <li>
          {#if fieldOf(item, 'href')}
            <a
              href={hrefOf(item)}
              class="gnb-main-trigger is-link"
              data-trigger="gnb"
              target={fieldOf(item, 'target') || undefined}
              title={fieldOf(item, 'title') || undefined}
            >{labelOf(item)}</a>
          {:else if flagOf(item, 'button')}
            <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
              {labelOf(item)}
            </button>
          {:else}
            <button
              type="button"
              class="gnb-main-trigger"
              class:active={flagOf(item, 'active')}
              data-trigger="gnb"
              aria-controls={sample ? undefined : mainPanelId}
              aria-expanded={sample ? undefined : 'false'}
              aria-haspopup={sample ? undefined : 'true'}
            >{labelOf(item)}</button>
            <div
              id={sample ? undefined : mainPanelId}
              class="gnb-toggle-wrap"
              class:is-open={flagOf(item, 'active')}
            >
              <div
                class="gnb-main-list"
                data-has-submenu={fieldOf(item, 'title') ? undefined : 'true'}
              >
                {#if fieldOf(item, 'title')}
                  <div class="gnb-sub-list single-list between">
                    <div class="gnb-sub-content">
                      <h2 class="sub-title"><span>{fieldOf(item, 'title')}</span></h2>
                      <ul>
                        {#each topChildren as leaf}
                          <li>
                            {#if fieldOf(leaf, 'href')}
                              <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                            {:else}
                              <button type="button">{labelOf(leaf)}</button>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                    </div>
                    {#if topBanner}
                      <div class="gnb-sub-banner">
                        <span class="krds-badge bg-secondary">{fieldOf(topBanner, 'badge')}</span>
                        <button type="button" class="krds-btn medium text">
                          {labelOf(topBanner)} <i class="svg-icon ico-angle right"></i>
                        </button>
                      </div>
                    {/if}
                  </div>
                {:else}
                  <ul>
                    {#each topChildren as child, childIndex}
                      {@const childChildren = childrenOf(child)}
                      {@const descriptionItems = listOf(child, 'descriptionItems')}
                      {@const childBanner = recordOf(child, 'banner')}
                      {@const childPanelId = `${id}-sub-${topIndex}-${childIndex}`}
                      {@const runtimeSubActive = !sample && childIndex === 0}
                      <li>
                        {#if fieldOf(child, 'href') && !childChildren.length && !descriptionItems.length}
                          <a
                            href={hrefOf(child)}
                            class="gnb-sub-trigger is-link"
                            class:external-link={fieldOf(child, 'target') === '_blank'}
                            data-trigger="gnb"
                            target={fieldOf(child, 'target') || undefined}
                            title={fieldOf(child, 'title') || undefined}
                          >{labelOf(child)}</a>
                        {:else}
                          <button
                            type="button"
                            class="gnb-sub-trigger"
                            class:active={flagOf(child, 'active') || runtimeSubActive}
                            data-trigger="gnb"
                            aria-controls={sample ? undefined : childPanelId}
                            aria-expanded={sample ? undefined : runtimeSubActive ? 'true' : 'false'}
                            aria-haspopup={sample ? undefined : 'true'}
                          >{labelOf(child)}</button>
                          <div
                            class="gnb-sub-list"
                            class:active={flagOf(child, 'active') || runtimeSubActive}
                            class:between={childIndex > 0}
                            id={sample ? undefined : childPanelId}
                          >
                            <div class="gnb-sub-content">
                              <h2 class="sub-title">
                                {#if fieldOf(child, 'titleHref')}
                                  {fieldOf(child, 'title')}
                                  <a
                                    href={fieldOf(child, 'titleHref')}
                                    class="krds-btn link basic small"
                                  >
                                    <span class="underline">{fieldOf(child, 'titleLinkLabel')}</span>
                                    <i class="svg-icon ico-angle right"></i>
                                  </a>
                                {:else}
                                  <span>{fieldOf(child, 'title')}</span>
                                {/if}
                              </h2>
                              {#if descriptionItems.length}
                                <ul class="type-description">
                                  {#each descriptionItems as detail}
                                    <li>
                                      <h3 class="tit">
                                        <a
                                          href={hrefOf(detail)}
                                          target={fieldOf(detail, 'target') || undefined}
                                          title={fieldOf(detail, 'externalTitle') || undefined}
                                        >
                                          {fieldOf(detail, 'title')} <i class="svg-icon ico-go"></i>
                                        </a>
                                      </h3>
                                      <p class="txt">{fieldOf(detail, 'description')}</p>
                                    </li>
                                  {/each}
                                </ul>
                              {:else}
                                <ul>
                                  {#each childChildren as leaf}
                                    <li>
                                      {#if fieldOf(leaf, 'href')}
                                        <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                                      {:else}
                                        <button type="button">{labelOf(leaf)}</button>
                                      {/if}
                                    </li>
                                  {/each}
                                </ul>
                              {/if}
                            </div>
                            {#if childBanner}
                              <div class="gnb-sub-banner">
                                <span class="krds-badge bg-secondary">{fieldOf(childBanner, 'badge')}</span>
                                <button type="button" class="krds-btn medium text">
                                  {labelOf(childBanner)} <i class="svg-icon ico-angle right"></i>
                                </button>
                              </div>
                            {/if}
                          </div>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</nav>