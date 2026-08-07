<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';

  const CLOSE_ANIMATION_MS = 200;

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    title?: string;
    description?: string;
    closeLabel?: string;
    onopenchange?: (open: boolean) => void;
    children?: Snippet;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  const generatedId = $props.id();

  let {
    id = generatedId,
    open = $bindable<boolean | undefined>(),
    defaultOpen = false,
    title = '',
    description = '',
    closeLabel = '닫기',
    onopenchange,
    children,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const controlled = $derived(open !== undefined);

  let rendered = $state(open === true || (open === undefined && defaultOpen === true));
  let closing = $state(false);
  let wasOpen = false;
  let wasRendered = false;
  let removeTimer: ReturnType<typeof setTimeout> | undefined;
  let sheetRoot: HTMLElement | undefined = $state();
  let restoreFocus: HTMLElement | null = null;

  const startClose = () => {
    if (!rendered || closing) return;
    closing = true;
    restoreFocus?.focus();
    restoreFocus = null;
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

  $effect(() => {
    if (rendered && !wasRendered) {
      restoreFocus =
        typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      queueMicrotask(() => {
        sheetRoot
          ?.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          )
          ?.focus();
      });
    }
    wasRendered = rendered;
  });

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(
      sheetRoot?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = sheetRoot?.ownerDocument.activeElement;
    if (event.shiftKey && (activeElement === first || !sheetRoot?.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  onDestroy(() => {
    if (removeTimer) clearTimeout(removeTimer);
  });
</script>

{#if rendered}
  <div
    {...rest}
    bind:this={sheetRoot}
    class={`krds-bottom-sheet ${rootClass}`}
    class:closing={closing}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? `${id}-title` : undefined}
    onkeydown={handleKeydown}
  >
    <div class="bottom-sheet-overlay" data-close onclick={requestClose}></div>
    <div class="bottom-sheet-panel" role="document">
      <button type="button" class="bottom-sheet-handle" aria-hidden="true" tabindex="-1"></button>
      {#if title}
        <div class="bottom-sheet-header">
          <h2 id={`${id}-title`} class="bottom-sheet-title">{title}</h2>
          {#if description}
            <p class="bottom-sheet-description">{description}</p>
          {/if}
        </div>
      {/if}
      <div class="bottom-sheet-body">{@render children?.()}</div>
      <button type="button" class="krds-btn medium icon bottom-sheet-close" aria-label={closeLabel} onclick={requestClose}>
        <i class="svg-icon ico-modal-close"></i>
      </button>
    </div>
  </div>
{/if}
