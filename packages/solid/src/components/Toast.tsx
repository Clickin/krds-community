import { Show, createEffect, createSignal, mergeProps, onCleanup, splitProps, type JSX } from "solid-js";

const CLOSE_ANIMATION_MS = 200;

export interface ToastProps {
  class?: string;
  className?: string;
  message: JSX.Element;
  tone?: "information" | "warning";
  open?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
  [key: string]: unknown;
}

export function Toast(rawProps: ToastProps) {
  const merged = mergeProps({ tone: "information" as const }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "message",
    "tone",
    "open",
    "defaultOpen",
    "duration",
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

  let closeTimer: number | undefined;
  let removeTimer: number | undefined;
  const clearTimers = () => {
    clearTimeout(closeTimer);
    closeTimer = undefined;
    clearTimeout(removeTimer);
    removeTimer = undefined;
  };

  let wasOpen = false;
  createEffect(() => {
    const isOpen = open();
    if (isOpen && !wasOpen) {
      clearTimers();
      setClosing(false);
      setRendered(true);
      const duration = props.duration ?? (props.tone === "warning" ? 4000 : 3000);
      closeTimer = window.setTimeout(() => setOpen(false), duration);
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

  onCleanup(clearTimers);

  const className = () => props.class ?? props.className ?? "";
  return (
    <Show when={rendered()}>
      <div
        {...(native as Record<string, any>)}
        class={`krds-toast${closing() ? " closing" : ""}${className() ? ` ${className()}` : ""}`}
        role={props.tone === "warning" ? "alert" : "status"}
      >
        <p class="toast-text">{props.message}</p>
      </div>
    </Show>
  );
}
