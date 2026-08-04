<script lang="ts">
  import { fieldOf, labelOf, hrefOf } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    items?: unknown[];
    linkLabel?: string;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    items = [] as unknown[],
    linkLabel = '',
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} class={`main-urgent-wrap ${rootClass}`} role="alert">
  <ul class="krds-critical-alerts">
    {#each items as item}
      <li>
        <div class="critical-ban">
          <span class={`critical-badge ${fieldOf(item, 'tone') || 'info'}`}
            >{fieldOf(item, 'badgeLabel') || fieldOf(item, 'badge') || labelOf(item)}</span
          >
          <p class="critical-txt"
            >{fieldOf(item, 'message') || fieldOf(item, 'text') || fieldOf(item, 'description') || labelOf(item)}</p
          >
          <a class="basic krds-btn link medium" href={hrefOf(item)}>
            <span class="m-hide">{fieldOf(item, 'linkLabel') || fieldOf(item, 'actionLabel') || linkLabel}</span>
            <i class="ico-angle right svg-icon"></i>
          </a>
        </div>
      </li>
    {/each}
  </ul>
</div>