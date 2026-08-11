<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { labelOf, invoke } from './lib/shared.js';

  type Props = {
    id?: string;
    title?: string;
    items?: unknown[];
    description?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    closeLabel?: string;
    open?: boolean;
    oncancel?: (event: Event) => void;
    onclose?: (event: Event) => void;
    children?: Snippet;
    className?: string;
    class?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    title = '제목',
    items = [],
    description = '',
    cancelLabel = '',
    confirmLabel = '',
    closeLabel = '닫기',
    open = $bindable<boolean | undefined>(),
    oncancel,
    onclose,
    children,
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const isOpen = $derived(open ?? true);

  let modalRoot: HTMLElement | undefined = $state();
  let restoreFocus: HTMLElement | null = null;
  let wasOpen = false;
  let hasObservedModalState = false;

  $effect(() => {
    if (!modalRoot) return;
    if (!hasObservedModalState) {
      hasObservedModalState = true;
      wasOpen = isOpen;
      return;
    }
    if (isOpen && !wasOpen) {
      restoreFocus =
        typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      queueMicrotask(() => {
        modalRoot
          ?.querySelector<HTMLElement>(
            'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
          )
          ?.focus();
      });
    } else if (!isOpen && wasOpen) {
      restoreFocus?.focus();
      restoreFocus = null;
    }
    wasOpen = isOpen;
  });

  const closeModal = (event: Event) => {
    if (event.type === 'cancel') {
      invoke(oncancel, event);
      if (event.defaultPrevented) return;
    }
    open = false;
    if (event.currentTarget instanceof Element) {
      event.currentTarget.closest('.krds-modal')?.classList.remove('in', 'shown');
    }
    if (event.type !== 'cancel') invoke(onclose, event);
  };

  const handleModalKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && isOpen) {
      const focusable = Array.from(
        modalRoot?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = modalRoot?.ownerDocument.activeElement;
      if (event.shiftKey && (activeElement === first || !modalRoot?.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key !== 'Escape') return;
    const cancelEvent = new Event('cancel', { cancelable: true });
    invoke(oncancel, cancelEvent);
    if (cancelEvent.defaultPrevented) return;
    event.preventDefault();
    open = false;
    if (event.currentTarget instanceof Element) {
      event.currentTarget.closest('.krds-modal')?.classList.remove('in', 'shown');
    }
    invoke(onclose, event);
  };

  // ModalSample uses the same template as the default Modal export

</script>
<section
  {...rest}
  bind:this={modalRoot}
  id={`${id}-dialog`}
  class={`krds-modal fade ${isOpen ? 'in shown' : ''} ${rootClass}`}
  role="dialog"
  aria-labelledby={`${id}-title`}
  onkeydown={handleModalKeydown}
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id={`${id}-title`} class="modal-title">{title}</h2>
      </div>
      <div class="modal-conts">
        <div class="conts-area">
          {#if items.length}
            {#each items as item, index}
              {labelOf(item)}{#if index < items.length - 1}<br />{/if}
            {/each}
          {:else if children}
            {@render children()}
          {:else}
            {description}
          {/if}
        </div>
      </div>
      <div class="modal-btn btn-wrap">
        <button type="button" class="krds-btn medium tertiary close-modal" onclick={closeModal}>
          {cancelLabel}
        </button>
        <button type="button" class="krds-btn medium primary close-modal" onclick={closeModal}>
          {confirmLabel}
        </button>
      </div>
      <button type="button" class="krds-btn medium icon btn-close close-modal" onclick={closeModal}>
        <span class="sr-only">{closeLabel}</span>
        <i class="svg-icon ico-popup-close"></i>
      </button>
    </div>
  </div>
  <div class={`modal-back ${isOpen ? 'in' : ''}`}></div>
</section>
