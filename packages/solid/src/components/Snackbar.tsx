import { Show, createEffect, createSignal, mergeProps, onCleanup, splitProps, type JSX } from "solid-js";

const CLOSE_ANIMATION_MS = 200;

export interface SnackbarProps {
  class?: string;
  className?: string;
  title?: JSX.Element;
  message: JSX.Element;
  icon?: string;
  actionLabel?: JSX.Element;
  onAction?: () => void;
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: unknown;
}

export function Snackbar(rawProps: SnackbarProps) {
  const merged = mergeProps({ closeLabel: "닫기" }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "message",
    "icon",
    "actionLabel",
    "onAction",
    "closeLabel",
    "open",
    "defaultOpen",
    "onOpenChange",
  ]);

  const [localOpen, setLocalOpen] = createSignal(Boolean(props.defaultOpen));
  const open = () => (props.open === undefined ? localOpen() : Boolean(props.open));
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
    props.onOpenChange?.(next);
  };

  const [closing, setClosing] = createSignal(false);
  const [rendered, setRendered] = createSignal(open());

  let removeTimer: number | undefined;
  const clearTimer = () => {
    clearTimeout(removeTimer);
    removeTimer = undefined;
  };

  let wasOpen = false;
  createEffect(() => {
    const isOpen = open();
    if (isOpen && !wasOpen) {
      clearTimer();
      setClosing(false);
      setRendered(true);
    } else if (!isOpen && wasOpen && rendered()) {
      setClosing(true);
      props.onOpenChange?.(false);
      removeTimer = window.setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, CLOSE_ANIMATION_MS);
    }
    wasOpen = isOpen;
  });

  onCleanup(clearTimer);

  const className = () => props.class ?? props.className ?? "";
  return (
    <Show when={rendered()}>
      <div
        {...(native as Record<string, any>)}
        class={`krds-snackbar${closing() ? " closing" : ""}${className() ? ` ${className()}` : ""}`}
        role="alert"
      >
        <Show when={props.icon}>
          <i class={`svg-icon snackbar-icon ${props.icon}`} aria-hidden="true" />
        </Show>
        <div class="snackbar-conts">
          <Show when={props.title}>
            <strong class="snackbar-title">{props.title}</strong>
          </Show>
          <p class="snackbar-text">{props.message}</p>
        </div>
        <Show when={props.actionLabel}>
          <button
            type="button"
            class="krds-btn small text snackbar-action"
            onClick={() => props.onAction?.()}
          >
            {props.actionLabel}
          </button>
        </Show>
        <button
          type="button"
          class="krds-btn small icon snackbar-close"
          aria-label={props.closeLabel}
          onClick={() => setOpen(false)}
        >
          <i class="svg-icon ico-modal-close" />
        </button>
      </div>
    </Show>
  );
}
