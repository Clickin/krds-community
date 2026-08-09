<script lang="ts">
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, labelOf, hrefOf, listOf, invoke, flagOf } from './lib/shared.js';

  type Props = {
    id?: string;
    tabs?: { id: string; label: string; panelId?: string }[];
    activeTab?: 'help' | 'tutorial';
    selectedLabel?: string;
    label?: string;
    title?: string;
    helpTitle?: string;
    helpDescription?: string;
    downloadLinks?: KrdsNavItem[];
    relatedGroups?: Record<string, unknown>[];
    tutorialTitle?: string;
    backTitle?: string;
    tutorialBackTitle?: string;
    tasks?: Record<string, unknown>[];
    stopLabel?: string;
    externalTitle?: string;
    open?: boolean;
    collapseLabel?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
    class?: string;
    className?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-tutorial-panel',
    tabs = [],
    activeTab = $bindable<'help' | 'tutorial'>('tutorial'),
    selectedLabel = '',
    label = '',
    title,
    helpTitle = '',
    helpDescription = '',
    downloadLinks = [],
    relatedGroups = [],
    tutorialTitle = '',
    backTitle = '',
    tutorialBackTitle = '',
    tasks = [],
    stopLabel = '',
    externalTitle = '',
    open = $bindable<boolean | undefined>(),
    collapseLabel = '',
    onclick,
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const isOpen = $derived(open ?? false);

  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event) invoke(onclick, event);
  };
</script>

<div
  {...rest}
  class={`krds-help-panel ${isOpen ? 'expand' : ''} ${rootClass}`}
  hidden={!isOpen}
>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -- KRDS requires this wrapper to receive focus when the panel opens. -->
  <div class="help-panel-wrap" tabindex={isOpen ? 0 : undefined}>
    <div class="help-conts-area">
      <div class="krds-tab-area layer">
        <div class="tab line">
          <ul role="tablist">
            {#each tabs as tab, index}
              {@const tabName = index === 0 ? 'help' : 'tutorial'}
              <li role="presentation" class:active={activeTab === tabName}>
                <button
                  id={tab.id}
                  type="button"
                  class="btn-tab"
                  role="tab"
                  aria-selected={activeTab === tabName}
                  aria-controls={fieldOf(tab, 'panelId')}
                  tabindex={activeTab === tabName ? 0 : -1}
                  onclick={(event) => {
                    activeTab = tabName;
                    invoke(onclick, event);
                  }}
                >
                  {tab.label}
                  {#if activeTab === tabName}<i class="sr-only created"> {selectedLabel}</i>{/if}
                </button>
              </li>
            {/each}
          </ul>
        </div>
        <div class="tab-conts-wrap">
          {#each tabs as tab, index}
            {@const tabName = index === 0 ? 'help' : 'tutorial'}
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -- The upstream KRDS fixture requires a section tabpanel. -->
            <section id={fieldOf(tab, 'panelId')}
              role="tabpanel"
              aria-labelledby={tab.id}
              class="tab-conts"
              class:active={activeTab === tabName}
              hidden={activeTab !== tabName}
            >
              {#if tab.label}<h3 class="sr-only">{tab.label}</h3>{/if}
              <div class="help-conts-area-inner">
                {#if tabName === 'help'}
                  <div class="conts-area help-conts">
                    <div class="conts-wrap">
                      <h4 class="help-title">
                        {helpTitle}
                        <span class="krds-btn medium icon">
                          <span class="sr-only">{label}</span>
                          <i class="svg-icon ico-help"></i>
                        </span>
                      </h4>
                      <div class="conts-desc"><p>{helpDescription}</p></div>
                      <ul class="link-list">
                        {#each downloadLinks as item}
                          <li>
                            <a
                              href={hrefOf(item)}
                              target={fieldOf(item, 'target') || undefined}
                              title={fieldOf(item, 'title') || externalTitle || undefined}
                              class="krds-btn xsmall link basic"
                            >
                              {labelOf(item)} <i class="svg-icon ico-go"></i>
                            </a>
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                  <div class="conts-area related-service">
                    {#each relatedGroups as group}
                      <div class="conts-wrap">
                        <h4 class="help-title">{fieldOf(group, 'title')}</h4>
                        <ul class="link-list">
                          {#each listOf(group, 'links') as item}
                            <li>
                              <a href={hrefOf(item)} class="krds-btn xsmall link basic">
                                {#if fieldOf(item, 'icon')}<i class={`svg-icon ico-${fieldOf(item, 'icon')}`}></i>{/if}
                                {labelOf(item)}
                                {#if !fieldOf(item, 'icon')}<i class="svg-icon ico-angle right"></i>{/if}
                              </a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="conts-area">
                    <h4 class="help-title">
                      <a href="#;" title={tutorialBackTitle || backTitle || undefined}>
                        {tutorialTitle}
                      </a>
                    </h4>
                    <ul class="coach-help-process">
                      {#each tasks as task, taskIndex}
                        <li>
                          <h4 class="tit" class:current={flagOf(task, 'current')}>
                            {fieldOf(task, 'title')}
                          </h4>
                          <div class="krds-disclosure conts-expand-area">
                            <button
                              type="button"
                              class="btn-conts-expand"
                              aria-label={fieldOf(task, 'summary') || fieldOf(task, 'title') || undefined}
                              aria-controls={`${id}-help-disclosure-${taskIndex}`}
                              aria-expanded="false"
                            >
                              {fieldOf(task, 'summary')}
                            </button>
                            <div
                              class="expand-wrap"
                              id={`${id}-help-disclosure-${taskIndex}`}
                              inert
                            >
                              <div class="expand-in">
                                <ul class="krds-info-list decimal" role="list">
                                  {#each listOf(task, 'steps') as taskStep}
                                    <li role="listitem">{labelOf(taskStep)}</li>
                                  {/each}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  </div>
                  <div class="help-panel-action">
                    <button type="button" class="krds-btn medium secondary coach-btn-stop">
                      {stopLabel}
                    </button>
                  </div>
                {/if}
              </div>
            </section>
          {/each}
        </div>
      </div>
      <button
        type="button"
        class="krds-btn small tertiary btn-help-panel fold"
        onclick={toggleOpen}
      >
        <span class="sr-only">{label}</span> {collapseLabel}
        <i class="svg-icon ico-angle right"></i>
      </button>
    </div>
  </div>
</div>
