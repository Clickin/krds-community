<script lang="ts">
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { labelOf, hrefOf, childrenOf, fieldOf, flagOf } from './lib/shared.js';

  type Props = {
    id?: string;
    title?: string;
    items?: KrdsNavItem[];
    links?: KrdsNavItem[];
    nav?: KrdsNavItem[];
    children?: Snippet;
    class?: string;
    className?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-side-navigation',
    title = '',
    items = [],
    links = [],
    nav = [],
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
</script>

<nav {...rest} class={`krds-side-navigation ${rootClass}`}>
  <h2 class="lnb-tit">{title}</h2>
  <ul class="lnb-list" role="menubar">
    {#each navigationItems as item, index}
      <li class:active={index === 0} class="lnb-item" role="none">
        {#if childrenOf(item).length}
          <button
            class="lnb-btn lnb-toggle"
            class:active={index === 0}
            type="button"
            role="menuitem"
            aria-expanded={index === 0}
            aria-controls={`${id}-side-${index}`}
          >{labelOf(item)}</button>
          <div class="lnb-submenu">
            <ul id={`${id}-side-${index}`} role="menu">
              {#each childrenOf(item) as child, childIndex}
                <li class="lnb-subitem" class:active={flagOf(child, 'current')} role="none">
                  {#if childrenOf(child).length}
                    <button
                      class="lnb-btn lnb-toggle-popup"
                      type="button"
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded="false"
                      aria-controls={`${id}-side-${index}-${childIndex}`}
                    >{labelOf(child)}</button>
                    <div class="lnb-submenu-lv2" id={`${id}-side-${index}-${childIndex}`} role="menu">
                      <button class="lnb-btn-tit" type="button">{fieldOf(child, 'description') || labelOf(child)}</button>
                      <ul>
                        {#each childrenOf(child) as leaf}
                          <li role="none">
                            <a class="lnb-btn" href={hrefOf(leaf)} role="menuitem">{labelOf(leaf)}</a>
                          </li>
                        {/each}
                      </ul>
                    </div>
                  {:else}
                    <a
                      class="lnb-btn lnb-link"
                      href={hrefOf(child)}
                      role="menuitem"
                      aria-current={flagOf(child, 'current') ? 'page' : undefined}
                    >{labelOf(child)}</a>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <a
            class="lnb-btn lnb-link"
            href={hrefOf(item)}
            role="menuitem"
            aria-current={flagOf(item, 'current') ? 'page' : undefined}
          >{labelOf(item)}</a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>