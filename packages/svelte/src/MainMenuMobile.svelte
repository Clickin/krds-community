<script lang="ts">
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { invoke, labelOf, hrefOf, childrenOf, fieldOf } from './lib/shared.js';

  type Props = {
    id?: string;
    items?: KrdsNavItem[];
    links?: KrdsNavItem[];
    nav?: KrdsNavItem[];
    utilityItems?: KrdsNavItem[];
    serviceItems?: KrdsNavItem[];
    bottomItems?: KrdsNavItem[];
    loginLabel?: string;
    menuLabel?: string;
    searchPlaceholder?: string;
    searchTitle?: string;
    searchLabel?: string;
    closeLabel?: string;
    previousLabel?: string;
    sample?: boolean;
    open?: boolean;
    onclick?: (event: Event) => void;
    children?: Snippet;
    class?: string;
    className?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-main-menu-mobile',
    items = [],
    links = [],
    nav = [],
    utilityItems = [],
    serviceItems = [],
    bottomItems = [],
    loginLabel = '',
    menuLabel = '',
    searchPlaceholder = '',
    searchTitle = '',
    searchLabel = '',
    closeLabel = '',
    previousLabel = '',
    sample = false,
    open = $bindable<boolean | undefined>(),
    onclick,
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
  const isOpen = $derived(open ?? false);

  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event) invoke(onclick, event);
  };
</script>

<div
  {...rest}
  id={id}
  class={`krds-main-menu-mobile ${rootClass}`}
  class:sample={sample}
  style={sample ? 'display: block; position: static; visibility: visible;' : 'display: none;'}
  role="navigation"
  aria-label={menuLabel || (rest as Record<string, unknown>)["aria-label"] || "전체 메뉴"}
>
  <div class="gnb-wrap">
    <div class="gnb-header">
      <div class="gnb-utils">
        <ul class="utility-list">
          {#each utilityItems as item}
            <li><button type="button" class="krds-btn xsmall text">{item.label}</button></li>
          {/each}
        </ul>
      </div>
      <div class="gnb-login">
        <button type="button" class="krds-btn large text">
          <i class="svg-icon ico-log"></i> {loginLabel}
        </button>
      </div>
      <div class="gnb-service-menu">
        {#each serviceItems as item}<a href={hrefOf(item)} class="link">{item.label}</a>{/each}
      </div>
      <div class="sch-input">
        <input
          type="text"
          class="krds-input"
          placeholder={searchPlaceholder || undefined}
          title={searchTitle || undefined}
          aria-label={searchLabel || searchTitle || undefined}
        />
        <button type="button" class="krds-btn medium icon ico-search">
          <span class="sr-only">{searchLabel}</span>
          <i class="svg-icon ico-sch"></i>
        </button>
      </div>
    </div>
    <div class="gnb-body">
      <div class="gnb-menu">
        <div class="menu-wrap">
          <ul role={sample ? undefined : 'tablist'}>
            {#each navigationItems as item, itemIndex}
              <li role={sample ? undefined : 'none'}>
                <a
                  href={`#${item.id}`}
                  id={sample ? undefined : `${id}-tab-${itemIndex}`}
                  class="gnb-main-trigger"
                  class:active={!sample && itemIndex === 0}
                  role={sample ? undefined : 'tab'}
                  aria-selected={sample ? undefined : itemIndex === 0 ? 'true' : 'false'}
                  aria-controls={sample ? undefined : item.id}
                >{labelOf(item)}</a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="submenu-wrap">
          {#each navigationItems as item, itemIndex}
            <div
              class="gnb-sub-list"
              id={item.id}
              role={sample ? undefined : 'tabpanel'}
              aria-labelledby={sample ? undefined : `${id}-tab-${itemIndex}`}
            >
              <h2 class="sub-title">{labelOf(item)}</h2>
              <ul>
                {#each childrenOf(item) as child, childIndex}
                  <li>
                    <a
                      href={hrefOf(child)}
                      class="gnb-sub-trigger"
                      class:has-depth3={childrenOf(child).length > 0}
                      aria-expanded={!sample && childrenOf(child).length > 0 ? 'false' : undefined}
                      aria-controls={!sample && childrenOf(child).length > 0 ? `${id}-depth3-${itemIndex}-${childIndex}` : undefined}
                    >{labelOf(child)}</a>
                    {#if childrenOf(child).length}
                      <div class="depth3-wrap" id={!sample ? `${id}-depth3-${itemIndex}-${childIndex}` : undefined}>
                        <ul>
                          {#each childrenOf(child) as depthThree}
                            <li>
                              <a
                                href={hrefOf(depthThree)}
                                class="depth3-trigger"
                                class:has-depth4={childrenOf(depthThree).length > 0}
                              >{labelOf(depthThree)}</a>
                              {#if childrenOf(depthThree).length}
                                <div class="depth4-wrap">
                                  <div class="depth4-head">
                                    <button type="button" class="krds-btn icon trigger-prev">
                                      <span class="sr-only">{previousLabel}</span>
                                      <i class="svg-icon ico-angle left"></i>
                                    </button>
                                    <button type="button" class="krds-btn icon trigger-close">
                                      <span class="sr-only">{closeLabel}</span>
                                      <i class="svg-icon ico-popup-close"></i>
                                    </button>
                                  </div>
                                  <ul class="depth4-body">
                                    <h4 class="sub-title">{fieldOf(depthThree, 'title')}</h4>
                                    <ul class="depth4-ul">
                                      {#each childrenOf(depthThree) as depthFour}
                                        <li><a href={hrefOf(depthFour)}>{labelOf(depthFour)}</a></li>
                                      {/each}
                                    </ul>
                                  </ul>
                                </div>
                              {/if}
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>
      <div class="gnb-bottom">
        {#each bottomItems as item}
          <a
            href={hrefOf(item)}
            class="krds-btn small text"
            target={fieldOf(item, 'target') || undefined}
            title={fieldOf(item, 'title') || undefined}
          >
            {labelOf(item)}
            <i class={`svg-icon ${fieldOf(item, 'target') ? 'ico-go' : 'ico-angle right'}`}></i>
          </a>
        {/each}
      </div>
    </div>
    <button
      type="button"
      class="krds-btn medium icon"
      id={sample ? 'close-nav' : `${id}-close`}
      onclick={sample ? undefined : toggleOpen}
    >
      <span class="sr-only">{closeLabel}</span>
      <i class="svg-icon ico-popup-close"></i>
    </button>
  </div>
</div>