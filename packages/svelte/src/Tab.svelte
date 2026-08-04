<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tabRecipe } from './lib/shared.js';

  type TabItem = {
    id: string;
    label?: string;
    disabled?: boolean;
    [key: string]: unknown;
  };

  type Props = {
    id?: string;
    tabs?: TabItem[];
    panels?: Record<string, unknown>;
    defaultValue?: string;
    selection?: string;
    selected?: string;
    modelValue?: string;
    description?: string;
    message?: string;
    panelTitle?: string;
    onclick?: (event: Event) => void;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    tabs = [],
    panels = {},
    defaultValue = '',
    selection = $bindable<string | undefined>(),
    selected = $bindable<string | undefined>(),
    modelValue = $bindable<string | undefined>(),
    description = '',
    message = '도움말',
    panelTitle = '',
    onclick,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const tabClasses = $derived(tabRecipe());
  const active = $derived(selection ?? selected ?? modelValue ?? tabs[0]?.id);

  const selectTab = (tabId: string, event?: Event) => {
    selection = tabId;
    selected = tabId;
    modelValue = tabId;
    if (event) {
      if (typeof onclick === 'function') onclick(event);
    }
  };

  const handleTabKeydown = (event: KeyboardEvent, index: number) => {
    if (!tabs.length || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1;
    let nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + direction + tabs.length) % tabs.length;
    while (tabs[nextIndex]?.disabled && nextIndex !== index) {
      nextIndex = (nextIndex + direction + tabs.length) % tabs.length;
    }
    if (tabs[nextIndex]?.disabled) return;
    selectTab(tabs[nextIndex].id);
    (event.currentTarget as HTMLButtonElement).parentElement?.parentElement
      ?.querySelectorAll<HTMLButtonElement>('.btn-tab')
      [nextIndex]?.focus();
  };
</script>

<div {...rest} class={`${tabClasses.root} ${rootClass}`.trim()}>
  <div class={tabClasses.listContainer}>
    <ul role="tablist">
      {#each tabs as tab, index}
        {@const itemClasses = tabRecipe({ active: active === tab.id })}
        <li
          role="presentation"
          class={itemClasses.item}
        >
          <button
            id={`${id}-tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${id}-panel-${tab.id}`}
            class={itemClasses.trigger}
            type="button"
            disabled={tab.disabled}
            tabindex={active === tab.id ? 0 : -1}
            onclick={(event) => selectTab(tab.id, event)}
            onkeydown={(event) => handleTabKeydown(event, index)}
          >
            {tab.label}
            {#if active === tab.id}<i class="created sr-only">{message}</i>{/if}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  <div class="tab-conts-wrap">
    {#each tabs as tab}
      <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<section
        role="tabpanel"
        id={`${id}-panel-${tab.id}`}
        aria-labelledby={`${id}-tab-${tab.id}`}
        data-quick-nav="false"
        class={`tab-conts ${active === tab.id ? 'active' : ''}`}
        hidden={active !== tab.id}
      ><h3 class="sr-only">{panelTitle || '탭 영역 타이틀'}</h3>{panels[tab.id] ?? (tab.id === active ? description : '')}</section>
    {/each}
  </div>
</div>