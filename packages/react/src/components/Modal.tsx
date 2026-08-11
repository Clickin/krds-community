import {
  Fragment,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "@krds-community/recipes";
import { joinAriaIds, SvgIcon } from "./_utils.js";

export interface ModalProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title" | "onKeyDown"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  title: ReactNode;
  description?: ReactNode;
  items?: ReactNode[];
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  closeLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onCancel?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onCancelAction?: () => void;
  onConfirm?: () => void;
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
}
export function Modal({
  open: controlledOpen,
  defaultOpen = false,
  title,
  description,
  items,
  cancelLabel,
  confirmLabel,
  closeLabel = "닫기",
  onOpenChange,
  onClose,
  onCancel,
  onCancelAction,
  onConfirm,
  id,
  children,
  className,
  onKeyDown,
  onMouseDown,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: ModalProps & { ref?: Ref<HTMLElement> }) {
  const generatedId = useId();
  const dialogId = id ?? `krds-modal-${generatedId}`;
  const titleId = `${dialogId}-title`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const modalRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(open);
  useImperativeHandle(ref, () => modalRef.current as HTMLElement, []);

  const focusableElements = () =>
    Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[autofocus], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const close = () => {
    setOpen(false);
    onClose?.();
  };

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (open && !wasOpenRef.current) {
      const activeElement = modal.ownerDocument.activeElement;
      const view = modal.ownerDocument.defaultView;
      restoreFocusRef.current =
        view && activeElement instanceof view.HTMLElement && !modal.contains(activeElement)
          ? activeElement
          : null;
      focusableElements()[0]?.focus();
    } else if (!open && wasOpenRef.current) {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
      restoreFocusRef.current = null;
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(
    () => () => {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    },
    [],
  );

  return (
    <section
      {...props}
      ref={modalRef}
      id={dialogId}
      className={cx("krds-modal", "fade", open && "in", open && "shown", className)}
      role="dialog"
      aria-labelledby={joinAriaIds(ariaLabelledBy, titleId)}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (
          !event.defaultPrevented &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          focusableElements()[0]?.focus();
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Escape" || event.key === "Esc") {
          onCancel?.(event);
          if (!event.defaultPrevented) {
            event.preventDefault();
            close();
          }
          return;
        }
        if (event.key !== "Tab" || !open) return;
        const focusables = focusableElements();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeElement = modalRef.current?.ownerDocument.activeElement;
        if (
          event.shiftKey &&
          (activeElement === first ||
            !activeElement ||
            !contentRef.current?.contains(activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content" ref={contentRef}>
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
          </div>
          <div className="modal-conts">
            <div className="conts-area">
              {items?.length
                ? items.map((item, index) => (
                    <Fragment key={index}>
                      {item}
                      {index < items.length - 1 ? <br /> : null}
                    </Fragment>
                  ))
                : (children ?? description)}
            </div>
          </div>
          <div className="modal-btn btn-wrap">
            <button
              type="button"
              className="krds-btn medium tertiary close-modal"
              onClick={() => {
                onCancelAction?.();
                close();
              }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="krds-btn medium primary close-modal"
              onClick={() => {
                onConfirm?.();
                close();
              }}
            >
              {confirmLabel}
            </button>
          </div>
          <button
            type="button"
            className="krds-btn medium icon btn-close close-modal"
            onClick={close}
          >
            <span className="sr-only">{closeLabel}</span>
            <SvgIcon name="ico-popup-close" />
          </button>
        </div>
      </div>
      <div className={cx("modal-back", open && "in")} />
    </section>
  );
}
export const ModalSample = Modal;
