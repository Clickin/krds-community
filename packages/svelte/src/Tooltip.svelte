<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    label?: string;
    message?: string;
    kind?: 'horizontal' | 'box' | 'vertical' | string;
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
    message = '',
    kind = 'horizontal',
    open = $bindable<boolean | undefined>(),
    onclick,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const isOpen = $derived(open ?? false);
  const placementClass = $derived(kind === 'box' ? 'tooltip-box' : kind === 'vertical' ? 'tooltip-vertical' : '');
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event && onclick) onclick(event);
  };
</script>

<button
  {...rest}
  type="button"
  class={`krds-btn krds-tooltip small text ${placementClass} ${rootClass}`.trim()}
  data-tooltip={message}
  aria-labelledby={`${id}-tip`}
  onclick={() => toggleOpen()}
>
  {#if children}{@render children()}{:else}{label}{/if}{' '}<i class="ico-angle right svg-icon"></i>
</button>
<div id={`${id}-tip`} class={`krds-tooltip-popover ${placementClass}`.trim()} role="tooltip" aria-hidden={isOpen ? 'false' : 'true'}>
  <span class="sr-only">{label}</span>
  {message}
</div>
