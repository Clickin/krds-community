<script lang="ts">
  import { onDestroy } from 'svelte';

  const CLOSE_ANIMATION_MS = 200;

  type Props = {
    title?: string;
    message: string;
    icon?: string;
    actionLabel?: string;
    onaction?: () => void;
    closeLabel?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onopenchange?: (open: boolean) => void;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    title = '',
    message,
    icon = '',
    actionLabel = '',
    onaction,
    closeLabel = '닫기',
    open = $bindable<boolean | undefined>(),
    defaultOpen = false,
    onopenchange,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const controlled = $derived(open !== undefined);

  let rendered = $state(open === true || (open === undefined && defaultOpen === true));
  let closing = $state(false);
  let wasOpen = false;
  let removeTimer: ReturnType<typeof setTimeout> | undefined;

  const startClose = () => {
    if (!rendered || closing) return;
    closing = true;
    removeTimer = setTimeout(() => {
      rendered = false;
      closing = false;
      onopenchange?.(false);
    }, CLOSE_ANIMATION_MS);
  };

  const requestClose = () => {
    if (controlled) {
      onopenchange?.(false);
    } else {
      startClose();
    }
  };

  $effect(() => {
    const isOpen = controlled ? open === true : rendered;
    if (isOpen && !wasOpen) {
      if (removeTimer) clearTimeout(removeTimer);
      closing = false;
      rendered = true;
    } else if (!isOpen && wasOpen) {
      startClose();
    }
    wasOpen = isOpen;
  });

  onDestroy(() => {
    if (removeTimer) clearTimeout(removeTimer);
  });
</script>

{#if rendered}
  <div {...rest} class={`krds-snackbar ${rootClass}`} class:closing={closing} role="alert">
    {#if icon}
      <i class={`svg-icon snackbar-icon ${icon}`} aria-hidden="true"></i>
    {/if}
    <div class="snackbar-conts">
      {#if title}
        <strong class="snackbar-title">{title}</strong>
      {/if}
      <p class="snackbar-text">{message}</p>
    </div>
    {#if actionLabel}
      <button type="button" class="krds-btn small text snackbar-action" onclick={onaction}>{actionLabel}</button>
    {/if}
    <button type="button" class="krds-btn small icon snackbar-close" aria-label={closeLabel} onclick={requestClose}>
      <i class="svg-icon ico-modal-close"></i>
    </button>
  </div>
{/if}
