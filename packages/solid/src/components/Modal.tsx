import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
  type JSX,
} from "solid-js";
import { focusableSelector, trapTabFocus, labelOf } from "../shared.js";

export interface ModalProps {
  class?: string;
  className?: string;
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  title?: JSX.Element;
  description?: JSX.Element;
  items?: JSX.Element[];
  cancelLabel?: JSX.Element;
  confirmLabel?: JSX.Element;
  closeLabel?: JSX.Element;
  children?: JSX.Element;
  onOpenChange?: (open: boolean) => void;
  onClose?: (event: Event) => void;
  onCancel?: (event: KeyboardEvent) => void;
  onCancelAction?: () => void;
  onConfirm?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  [key: string]: unknown;
}

export function Modal(rawProps: ModalProps) {
  const merged = mergeProps({ closeLabel: "닫기", title: "" as JSX.Element }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "open",
    "defaultOpen",
    "title",
    "description",
    "items",
    "cancelLabel",
    "confirmLabel",
    "closeLabel",
    "children",
    "onOpenChange",
    "onClose",
    "onCancel",
    "onCancelAction",
    "onConfirm",
    "onKeyDown",
  ]);

  const generatedId = createUniqueId();
  const dialogId = () => props.id ?? `krds-modal-${generatedId}`;
  const titleId = () => `tit_${dialogId()}`;

  const [localOpen, setLocalOpen] = createSignal(Boolean(props.defaultOpen));
  const open = () => (props.open === undefined ? localOpen() : Boolean(props.open));
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
    props.onOpenChange?.(next);
  };

  let modalRoot: HTMLElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  let restoreFocus: HTMLElement | undefined;
  let wasOpen = false;

  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };

  const closeModal = (event: Event) => {
    setOpen(false);
    invokeHandler(native.onClose, event);
  };

  let isInitialMount = true;
  createEffect(() => {
    const currentOpen = open();
    const modal = modalRoot;
    if (!modal) return;
    if (currentOpen && !wasOpen) {
      const activeElement = modal.ownerDocument.activeElement;
      const view = modal.ownerDocument.defaultView;
      restoreFocus =
        view && activeElement instanceof view.HTMLElement && !modal.contains(activeElement)
          ? activeElement
          : undefined;
      if (!isInitialMount) {
        contentRef?.querySelector<HTMLElement>(focusableSelector)?.focus();
      }
    } else if (!currentOpen && wasOpen) {
      if (restoreFocus?.isConnected) restoreFocus.focus();
      restoreFocus = undefined;
    }
    wasOpen = currentOpen;
    isInitialMount = false;
  });

  onCleanup(() => {
    if (restoreFocus?.isConnected) restoreFocus.focus();
  });

  const className = () => props.class ?? props.className ?? "";
  const children = () => props.children;

  return (
    <section
      {...(native as Record<string, any>)}
      ref={(element) => {
        modalRoot = element;
      }}
      id={dialogId()}
      role="dialog"
      aria-labelledby={titleId()}
      class={["krds-modal", "fade", open() && "in", open() && "shown", className()]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        invokeHandler(native.onClick, event);
        if (
          !event.defaultPrevented &&
          open() &&
          !(event.target as Element).closest(".modal-content")
        ) {
          event.currentTarget.querySelector<HTMLElement>(focusableSelector)?.focus();
        }
      }}
      onKeyDown={(event) => {
        invokeHandler(native.onKeyDown, event);
        if (event.defaultPrevented) return;
        if (event.key === "Escape" || event.key === "Esc") {
          props.onCancel?.(event as KeyboardEvent);
          if (!event.defaultPrevented) {
            event.preventDefault();
            closeModal(event);
          }
          return;
        }
        const content = event.currentTarget.querySelector<HTMLElement>(".modal-content");
        if (content && open()) trapTabFocus(event, content);
      }}
    >
      <div class="modal-dialog">
        <div
          class="modal-content"
          ref={(element) => {
            contentRef = element;
          }}
        >
          <div class="modal-header">
            <h2 id={titleId()} class="modal-title">
              {props.title}
            </h2>
          </div>
          <div class="modal-conts">
            <div class="conts-area">
              <Show when={props.items?.length} fallback={props.description ?? children()}>
                <For each={props.items}>
                  {(item, itemIndex) => (
                    <>
                      {labelOf(item)}
                      <Show when={itemIndex() < (props.items?.length ?? 0) - 1}>
                        <br />
                      </Show>
                    </>
                  )}
                </For>
              </Show>
            </div>
          </div>
          <div class="modal-btn btn-wrap">
            <button
              type="button"
              class="krds-btn medium tertiary close-modal"
              onClick={(event) => {
                props.onCancelAction?.();
                closeModal(event);
              }}
            >
              {props.cancelLabel}
            </button>
            <button
              type="button"
              class="krds-btn medium primary close-modal"
              onClick={(event) => {
                props.onConfirm?.();
                closeModal(event);
              }}
            >
              {props.confirmLabel}
            </button>
          </div>
          <button
            type="button"
            class="krds-btn medium icon btn-close close-modal"
            onClick={closeModal}
          >
            <span class="sr-only">{props.closeLabel}</span>
            <i class="svg-icon ico-popup-close" />
          </button>
        </div>
      </div>
      <div class="modal-back" classList={{ in: open() }} />
    </section>
  );
}

export const ModalSample = Modal;
