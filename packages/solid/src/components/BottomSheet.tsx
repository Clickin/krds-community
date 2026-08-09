import {
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
  type JSX,
} from "solid-js";
import { focusableSelector, trapTabFocus } from "../shared.js";

const CLOSE_ANIMATION_MS = 200;

export interface BottomSheetProps {
  class?: string;
  className?: string;
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  title?: JSX.Element;
  description?: JSX.Element;
  closeLabel?: string;
  children?: JSX.Element;
  onOpenChange?: (open: boolean) => void;
  [key: string]: unknown;
}

export function BottomSheet(rawProps: BottomSheetProps) {
  const merged = mergeProps({ closeLabel: "닫기" }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "open",
    "defaultOpen",
    "title",
    "description",
    "closeLabel",
    "children",
    "onOpenChange",
  ]);

  const generatedId = createUniqueId();
  const sheetId = () => props.id ?? `krds-bottom-sheet-${generatedId}`;
  const titleId = () => `tit_${sheetId()}`;

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

  const startClose = () => setOpen(false);

  let sheetRoot: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let restoreFocus: HTMLElement | undefined;
  let wasOpen = false;
  let isInitialMount = true;

  createEffect(() => {
    const isOpen = open();
    const root = sheetRoot;
    if (!root) return;
    if (isOpen && !wasOpen) {
      clearTimer();
      setClosing(false);
      setRendered(true);
      const activeElement = root.ownerDocument.activeElement;
      const view = root.ownerDocument.defaultView;
      restoreFocus =
        view && activeElement instanceof view.HTMLElement && !root.contains(activeElement)
          ? activeElement
          : undefined;
      if (!isInitialMount) {
        panelRef?.querySelector<HTMLElement>(focusableSelector)?.focus();
      }
    } else if (!isOpen && wasOpen) {
      if (restoreFocus?.isConnected) restoreFocus.focus();
      restoreFocus = undefined;
      if (rendered()) {
        setClosing(true);
        props.onOpenChange?.(false);
        removeTimer = window.setTimeout(() => {
          setRendered(false);
          setClosing(false);
        }, CLOSE_ANIMATION_MS);
      }
    }
    wasOpen = isOpen;
    isInitialMount = false;
  });

  onCleanup(() => {
    clearTimer();
    if (restoreFocus?.isConnected) restoreFocus.focus();
  });

  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };

  const className = () => props.class ?? props.className ?? "";
  return (
    <Show when={rendered()}>
      <div
        {...(native as Record<string, any>)}
        ref={(element) => {
          sheetRoot = element;
        }}
        id={sheetId()}
        role="dialog"
        aria-modal={true}
        aria-labelledby={props.title ? titleId() : undefined}
        class={`krds-bottom-sheet${closing() ? " closing" : ""}${className() ? ` ${className()}` : ""}`}
        onClick={(event) => {
          invokeHandler(native.onClick, event);
          if (
            !event.defaultPrevented &&
            (event.target as Element).closest(".bottom-sheet-overlay")
          ) {
            startClose();
          }
        }}
        onKeyDown={(event) => {
          invokeHandler(native.onKeyDown, event);
          if (event.defaultPrevented) return;
          if (event.key === "Escape" || event.key === "Esc") {
            event.preventDefault();
            startClose();
            return;
          }
          const panel = panelRef;
          if (panel && open()) trapTabFocus(event, panel);
        }}
      >
        <button
          type="button"
          class="bottom-sheet-overlay"
          data-close
          aria-label={props.closeLabel}
        />
        <div
          class="bottom-sheet-panel"
          role="document"
          ref={(element) => {
            panelRef = element;
          }}
        >
          <button type="button" class="bottom-sheet-handle" aria-hidden="true" tabindex="-1" />
          <Show when={props.title}>
            <div class="bottom-sheet-header">
              <h2 id={titleId()} class="bottom-sheet-title">
                {props.title}
              </h2>
              <Show when={props.description}>
                <p class="bottom-sheet-description">{props.description}</p>
              </Show>
            </div>
          </Show>
          <div class="bottom-sheet-body">{props.children}</div>
          <button
            type="button"
            class="krds-btn medium icon bottom-sheet-close"
            aria-label={props.closeLabel}
            onClick={startClose}
          >
            <i class="svg-icon ico-modal-close" />
          </button>
        </div>
      </div>
    </Show>
  );
}
