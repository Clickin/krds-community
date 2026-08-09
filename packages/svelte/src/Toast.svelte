<script lang="ts">
  import { onDestroy, untrack } from 'svelte';

  const CLOSE_ANIMATION_MS = 200;

  type Props = {
    message: string;
    tone?: 'information' | 'warning';
    open?: boolean;
    defaultOpen?: boolean;
    duration?: number;
    onopenchange?: (open: boolean) => void;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    message,
    tone = 'information',
    open = $bindable<boolean | undefined>(),
    defaultOpen = false,
    duration,
    onopenchange,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const controlled = $derived(open !== undefined);

  let rendered = $state(untrack(() => open === true || (open === undefined && defaultOpen === true)));
  let closing = $state(false);
  let wasOpen = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
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

  $effect(() => {
    const isOpen = controlled ? open === true : rendered;
    if (isOpen && !wasOpen) {
      if (removeTimer) clearTimeout(removeTimer);
      closing = false;
      rendered = true;
      closeTimer = setTimeout(
        () => {
          if (controlled) {
            onopenchange?.(false);
          } else {
            startClose();
          }
        },
        duration ?? (tone === 'warning' ? 4000 : 3000),
      );
    } else if (!isOpen && wasOpen) {
      if (closeTimer) clearTimeout(closeTimer);
      startClose();
    }
    wasOpen = isOpen;
  });

  onDestroy(() => {
    if (closeTimer) clearTimeout(closeTimer);
    if (removeTimer) clearTimeout(removeTimer);
  });
</script>

{#if rendered}
  <div
    {...rest}
    class={`krds-toast ${rootClass}`}
    class:closing={closing}
    role={tone === 'warning' ? 'alert' : 'status'}
  >
    <p class="toast-text">{message}</p>
  </div>
{/if}
