<script lang="ts">
  import { inertWhen, labelOf } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    title?: string;
    open?: boolean;
    description?: string;
    items?: unknown[];
    onclick?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    title = '제목',
    open = $bindable<boolean | undefined>(),
    description = '',
    items = [] as unknown[],
    onclick,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const isOpen = $derived(open ?? false);
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event && onclick) onclick(event);
  };
</script>

<div {...rest} class={`conts-expand-area krds-disclosure ${rootClass}`}>
  <button
    id={`${id}-trigger`}
    class="btn-conts-expand"
    type="button"
    aria-controls={`${id}-content`}
    aria-expanded={isOpen}
    onclick={() => toggleOpen()}
  >{title}</button>
  <div
    class="expand-wrap"
    id={`${id}-content`}
    role="region"
    aria-labelledby={`${id}-trigger`}
    use:inertWhen={!isOpen}
  >
    <div class="expand-in">
      {#if items.length}
        <ul class="dash krds-info-list" role="list">
          {#each items as item}<li role="listitem">{labelOf(item)}</li>{/each}
        </ul>
      {:else if children}
        {@render children()}
      {:else}
        {description}
      {/if}
    </div>
  </div>
</div>