<script lang="ts">
  import { invoke, labelOf, hrefOf } from './lib/shared.js';
  import type { KrdsNavItem } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    items?: KrdsNavItem[];
    links?: KrdsNavItem[];
    nav?: KrdsNavItem[];
    className?: string;
    class?: string;
    onclick?: (event: Event) => void;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  const generatedId = $props.id();
  let {
    id = generatedId,
    items = [],
    links = [],
    nav = [],
    className = '',
    class: classProp = '',
    onclick,
    children,
    ...rest
  }: Props = $props();

  const navigationLabel = $derived(
    (rest as Record<string, unknown>)["aria-label"] ?? "현재 경로",
  );

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
</script>

<nav {...rest} id={id} class={`krds-breadcrumb-wrap ${rootClass}`} aria-label={navigationLabel}>
  <ol class="breadcrumb">
    {#each navigationItems as item, index}
      <li class:home={index === 0}>
        <a class="txt" href={hrefOf(item)} onclick={(event) => invoke(onclick, event)}>{labelOf(item)}</a>
      </li>
    {/each}
  </ol>
</nav>