<script lang="ts">
  import Badge from './Badge.svelte';
  import { untrack } from 'svelte';

  type Item = { id: string; label: string; href?: string; icon?: string; badge?: string };

  type Props = {
    items?: Item[];
    selected?: string;
    defaultSelected?: string;
    onchange?: (id: string) => void;
    ariaLabel?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    items = [],
    selected = $bindable<string | undefined>(),
    defaultSelected,
    onchange,
    ariaLabel = '주요 메뉴',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  let internal = $state<string | undefined>(untrack(() => defaultSelected));
  const current = $derived(selected !== undefined ? selected : internal);

  const select = (id: string) => {
    if (selected === undefined) internal = id;
    onchange?.(id);
  };
</script>

<nav {...rest} class={`krds-tab-bar ${rootClass}`} aria-label={ariaLabel}>
  {#each items as item}
    {#if item.href}
      <a
        href={item.href}
        class="tab-bar-item"
        class:active={current === item.id}
        aria-current={current === item.id ? 'page' : undefined}
        onclick={(event) => {
          event.preventDefault();
          select(item.id);
        }}
      >
        {#if item.icon}
          <i class={`svg-icon tab-bar-icon ${item.icon}`} aria-hidden="true"></i>
        {/if}
        <span class="tab-bar-label">{item.label}</span>
        {#if item.badge}
          <Badge label={item.badge} className="tab-bar-badge" />
        {/if}
      </a>
    {:else}
      <button
        type="button"
        class="tab-bar-item"
        class:active={current === item.id}
        aria-current={current === item.id ? 'page' : undefined}
        onclick={() => select(item.id)}
      >
        {#if item.icon}
          <i class={`svg-icon tab-bar-icon ${item.icon}`} aria-hidden="true"></i>
        {/if}
        <span class="tab-bar-label">{item.label}</span>
        {#if item.badge}
          <Badge label={item.badge} className="tab-bar-badge" />
        {/if}
      </button>
    {/if}
  {/each}
</nav>
