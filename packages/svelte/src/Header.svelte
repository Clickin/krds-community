<script lang="ts">
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, flagOf, labelOf, hrefOf, childrenOf, listOf, recordOf, invoke } from './lib/shared.js';

  type Props = {
    id?: string;
    items?: KrdsNavItem[];
    links?: KrdsNavItem[];
    nav?: KrdsNavItem[];
    desktopItems?: KrdsNavItem[];
    utilityItems?: KrdsNavItem[];
    logoHref?: string;
    logoLabel?: string;
    searchTitle?: string;
    searchLabel?: string;
    loginHref?: string;
    loginLabel?: string;
    joinLabel?: string;
    myMenu?: Record<string, unknown>;
    allMenuLabel?: string;
    menuLabel?: string;
    mobileMenu?: Record<string, unknown>;
    title?: string;
    open?: boolean;
    onclick?: (event: Event) => void;
    children?: Snippet;
    class?: string;
    className?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-header',
    items = [],
    links = [],
    nav = [],
    desktopItems = [],
    utilityItems = [],
    logoHref,
    logoLabel = '',
    searchTitle = '',
    searchLabel = '',
    loginHref,
    loginLabel = '',
    joinLabel = '',
    myMenu,
    title,
    allMenuLabel = '',
    menuLabel = '',
    mobileMenu,
    open = $bindable<boolean | undefined>(),
    onclick,
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
  const myMenuData = $derived(myMenu ?? {});
  const mobileData = $derived(mobileMenu ?? {});
  const mobileId = $derived(fieldOf(mobileData, 'id') || 'mobile-nav');
  const headerItems = $derived(desktopItems.length ? desktopItems : navigationItems);
  const isOpen = $derived(open ?? false);

  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event) invoke(onclick, event);
  };
</script>

<header {...rest} id={id} class={rootClass}>
  <div class="header-in">
    <div class="header-container">
      <div class="inner">
        <div class="header-utility">
          <ul class="utility-list">
            {#each utilityItems as item, index}
              <li>
                {#if fieldOf(item, 'kind') === 'link'}
                  <a
                    href={hrefOf(item)}
                    class="krds-btn small text"
                    target={fieldOf(item, 'target') || undefined}
                    title={fieldOf(item, 'title') || undefined}
                  >
                    {labelOf(item)} <i class="svg-icon ico-go"></i>
                  </a>
                {:else}
                  <div
                    class="krds-drop-wrap"
                    class:krds-resize={fieldOf(item, 'kind') === 'resize'}
                  >
                    <button
                      type="button"
                      class="krds-btn small text drop-btn"
                      aria-expanded="false"
                      aria-controls={`${id}-utility-${index}`}
                    >
                      {labelOf(item)} <i class="svg-icon ico-toggle"></i>
                    </button>
                    <div class="drop-menu" id={`${id}-utility-${index}`}>
                      <div class="drop-in">
                        <ul class="drop-list">
                          {#each listOf(item, 'items') as option}
                            <li>
                              {#if fieldOf(item, 'kind') === 'resize'}
                                <button
                                  type="button"
                                  class={`item-link ${fieldOf(option, 'className')}`}
                                  class:active={flagOf(option, 'selected')}
                                >
                                  {labelOf(option)}<span class="sr-only">{flagOf(option, 'selected') ? fieldOf(item, 'selectedLabel') : ''}</span>
                                </button>
                              {:else}
                                <a
                                  href={hrefOf(option)}
                                  class={`item-link ${fieldOf(option, 'className')}`}
                                  target={fieldOf(option, 'target') || undefined}
                                  title={fieldOf(option, 'title') || undefined}
                                >{labelOf(option)}<span class="sr-only"></span></a>
                              {/if}
                            </li>
                          {/each}
                        </ul>
                        {#if fieldOf(item, 'resetLabel')}
                          <div class="drop-bottom">
                            <button type="button" class="krds-btn medium text">
                              <i class="svg-icon ico-reset"></i> {fieldOf(item, 'resetLabel')}
                            </button>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
        <div class="header-branding">
          <h2 class="logo">
            <a href={logoHref}><span class="sr-only">{logoLabel}</span></a>
          </h2>
          <div class="header-actions">
            <button type="button" class="btn-navi sch" title={searchTitle}>{searchLabel}</button>
            <a href={loginHref} class="btn-navi login">{loginLabel}</a>
            <button type="button" class="btn-navi join">{joinLabel}</button>
            {#if myMenu}
            <div class="krds-drop-wrap my-drop">
              <button
                type="button"
                class="btn-navi my drop-btn"
                aria-expanded="false"
                aria-controls={`${id}-my-drop`}
              >{fieldOf(myMenuData, 'label')}</button>
              <div class="drop-menu" id={`${id}-my-drop`}>
                <div class="drop-in">
                  <div class="drop-top">
                    <p class="my-name">{fieldOf(myMenuData, 'userName')}</p>
                    <dl class="my-time">
                      <dt>{fieldOf(myMenuData, 'timeLabel')}</dt>
                      <dd>
                        <span class="time">{fieldOf(myMenuData, 'time')}</span>
                        <button type="button" class="krds-btn medium text">{fieldOf(myMenuData, 'extendLabel')}</button>
                      </dd>
                    </dl>
                  </div>
                  <ul class="drop-list">
                    {#each listOf(myMenuData, 'items') as item}
                      <li><a href={hrefOf(item)} class="item-link">{labelOf(item)}<span class="sr-only"></span></a></li>
                    {/each}
                  </ul>
                  <div class="drop-bottom">
                    <button type="button" class="krds-btn medium text">
                      <i class="svg-icon ico-logout"></i> {fieldOf(myMenuData, 'logoutLabel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/if}
            <button
              type="button"
              class="btn-navi all"
              aria-controls={mobileId}
              onclick={toggleOpen}
            >{allMenuLabel}</button>
          </div>
        </div>
      </div>
    </div>
    <nav class="krds-main-menu" aria-label={menuLabel || undefined}>
      <div class="inner">
        <ul class="gnb-menu" aria-label={menuLabel || undefined}>
          {#each headerItems as item, topIndex}
            {@const topChildren = childrenOf(item)}
            {@const topBanner = recordOf(item, 'banner')}
            {@const mainPanelId = `${id}-desktop-main-${topIndex}`}
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
                  aria-controls={mainPanelId}
                  aria-expanded="false"
                  aria-haspopup="true"
                >{labelOf(item)}</button>
                <div
                  id={mainPanelId}
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
                          {@const childPanelId = `${id}-desktop-sub-${topIndex}-${childIndex}`}
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
                                class:active={flagOf(child, 'active') || childIndex === 0}
                                data-trigger="gnb"
                                aria-controls={childPanelId}
                                aria-expanded={childIndex === 0 ? 'true' : 'false'}
                                aria-haspopup="true"
                              >{labelOf(child)}</button>
                              <div
                                class="gnb-sub-list"
                                class:active={flagOf(child, 'active') || childIndex === 0}
                                class:between={childIndex > 0}
                                id={childPanelId}
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
  </div>
  {#if mobileMenu}
  <div id={mobileId} class="krds-main-menu-mobile" style:display={isOpen ? 'block' : 'none'}>
    <div class="gnb-wrap">
      <div class="gnb-header">
        <div class="gnb-utils">
          <ul class="utility-list">
            {#each listOf(mobileData, 'utilityItems') as item}
              <li><button type="button" class="krds-btn xsmall text">{labelOf(item)}</button></li>
            {/each}
          </ul>
        </div>
        <div class="gnb-login">
          <button type="button" class="krds-btn large text">
            <i class="svg-icon ico-log"></i> {fieldOf(mobileData, 'loginLabel')}
          </button>
        </div>
        <div class="gnb-service-menu">
          {#each listOf(mobileData, 'serviceItems') as item}
            <a href={hrefOf(item)} class="link">{labelOf(item)}</a>
          {/each}
        </div>
        <div class="sch-input">
          <input
            type="text"
            class="krds-input"
            placeholder={fieldOf(mobileData, 'searchPlaceholder')}
            title={fieldOf(mobileData, 'searchTitle')}
            aria-label={fieldOf(mobileData, 'searchLabel') || fieldOf(mobileData, 'searchTitle') || undefined}
          />
          <button type="button" class="krds-btn medium icon ico-search">
            <span class="sr-only">{fieldOf(mobileData, 'searchLabel')}</span>
            <i class="svg-icon ico-sch"></i>
          </button>
        </div>
      </div>
      <div class="gnb-body">
        <div class="gnb-menu">
          <div class="menu-wrap">
            <ul role="tablist">
              {#each listOf(mobileData, 'items') as item, itemIndex}
                <li role="none">
                  <a
                    href={`#${item.id}`}
                    id={`${id}-mobile-tab-${itemIndex}`}
                    class="gnb-main-trigger"
                    class:active={itemIndex === 0}
                    role="tab"
                    aria-selected={itemIndex === 0 ? 'true' : 'false'}
                    aria-controls={item.id}
                  >{labelOf(item)}</a>
                </li>
              {/each}
            </ul>
          </div>
          <div class="submenu-wrap">
            {#each listOf(mobileData, 'items') as item, itemIndex}
              <div
                class="gnb-sub-list"
                id={item.id}
                role="tabpanel"
                aria-labelledby={`${id}-mobile-tab-${itemIndex}`}
              >
                <h2 class="sub-title">{labelOf(item)}</h2>
                <ul>
                  {#each childrenOf(item) as child, childIndex}
                    <li>
                      <a
                        href={hrefOf(child)}
                        class="gnb-sub-trigger"
                        class:has-depth3={childrenOf(child).length > 0}
                        aria-expanded={childrenOf(child).length > 0 ? 'false' : undefined}
                        aria-controls={childrenOf(child).length > 0 ? `${id}-mobile-depth3-${itemIndex}-${childIndex}` : undefined}
                      >{labelOf(child)}</a>
                      {#if childrenOf(child).length}
                        <div class="depth3-wrap" id={`${id}-mobile-depth3-${itemIndex}-${childIndex}`}>
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
                                        <span class="sr-only">{fieldOf(mobileData, 'previousLabel')}</span>
                                        <i class="svg-icon ico-angle left"></i>
                                      </button>
                                      <button type="button" class="krds-btn icon trigger-close">
                                        <span class="sr-only">{fieldOf(mobileData, 'closeLabel')}</span>
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
          {#each listOf(mobileData, 'bottomItems') as item}
            <a
              href={hrefOf(item)}
              class="krds-btn medium text"
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
        id={`${id}-mobile-close`}
        onclick={toggleOpen}
      >
        <span class="sr-only">{fieldOf(mobileData, 'closeLabel')}</span>
        <i class="svg-icon ico-popup-close"></i>
      </button>
    </div>
  </div>
  {/if}
</header>
