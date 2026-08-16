<script lang="ts">
  import { invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    label?: string;
    title?: string;
    description?: string;
    message?: string;
    caption?: string;
    position?: string;
    href?: string;
    linkLabel?: string;
    closeLabel?: string;
    open?: boolean;
    onclick?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    label = '레이블',
    title = '',
    description = '',
    message = '',
    caption = '',
    position = 'top-left',
    href = '#',
    linkLabel = '',
    closeLabel = '',
    open = $bindable<boolean | undefined>(),
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

<div {...rest} class={`krds-contextual-help ${position.split('-').reverse().join(' ')} ${rootClass}`}>
  <p class="tooltip-txt">{caption}</p>
  <div class="tooltip-action">
    <button
      class="icon krds-btn medium tooltip-btn"
      type="button"
      aria-expanded={isOpen}
      aria-controls={`${id}-popover`}
      onclick={() => toggleOpen()}
    >
      <span class="sr-only">{label}</span>
      <i class="ico-tooltip svg-icon"></i>
    </button>
    <div class="tooltip-popover" id={`${id}-popover`} role="tooltip">
      <h4 class="tooltip-title">{title}</h4>
      <div class="tooltip-contents">
        <p>
          {@render children?.()}
          {#if !children}{description || message}{/if}
        </p>
        {#if linkLabel}<div class="btn-wrap"><a class="basic krds-btn link xsmall" href={href}>{linkLabel}<i class="ico-angle right svg-icon"></i></a></div>{/if}
      </div>
      <button class="icon krds-btn tooltip-close xsmall" type="button" onclick={() => toggleOpen()}>
        <span class="sr-only">{closeLabel}</span>
        <i class="ico-modal-close svg-icon"></i>
      </button>
    </div>
  </div>
</div>