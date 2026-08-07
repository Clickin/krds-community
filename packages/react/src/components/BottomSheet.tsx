import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type BoxProps } from "./_utils.js";

const CLOSE_ANIMATION_MS = 200;

export interface BottomSheetProps extends BoxProps {
  open?: boolean;
  defaultOpen?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  closeLabel?: string;
  onOpenChange?: (open: boolean) => void;
}

export function BottomSheet({
  open: controlledOpen,
  defaultOpen = false,
  title,
  description,
  closeLabel = "닫기",
  onOpenChange,
  id,
  className,
  children,
}: BottomSheetProps) {
  const generatedId = useId();
  const sheetId = id ?? `krds-bottom-sheet-${generatedId}`;
  const titleId = `${sheetId}-title`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const [rendered, setRendered] = useState(open === true);
  const [closing, setClosing] = useState(false);
  const [previousOpen, setPreviousOpen] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasVisibleRef = useRef(open && rendered);

  if (open === true && previousOpen !== true) {
    setPreviousOpen(open);
    setRendered(true);
    setClosing(false);
  } else if (open === false && previousOpen !== false && rendered) {
    setPreviousOpen(open);
    setClosing(true);
  } else if (open !== previousOpen) {
    setPreviousOpen(open);
  }

  const close = () => {
    if (controlledOpen === undefined) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  const focusableElements = () =>
    Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        '[autofocus], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );

  useEffect(() => {
    if (!closing || !rendered) return;
    const timer = setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [closing, rendered]);

  useEffect(() => {
    const panel = panelRef.current;
    const visible = open && rendered;
    if (!panel) return;
    if (visible && !wasVisibleRef.current) {
      const activeElement = panel.ownerDocument.activeElement;
      const view = panel.ownerDocument.defaultView;
      restoreFocusRef.current =
        view && activeElement instanceof view.HTMLElement && !panel.contains(activeElement)
          ? activeElement
          : null;
      focusableElements()[0]?.focus();
    } else if (!visible && wasVisibleRef.current) {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
      restoreFocusRef.current = null;
    }
    wasVisibleRef.current = visible;
  }, [open, rendered]);

  useEffect(
    () => () => {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    },
    [],
  );

  if (!rendered) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = focusableElements();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeElement = panelRef.current?.ownerDocument.activeElement;
    if (
      event.shiftKey &&
      (activeElement === first || !activeElement || !panelRef.current?.contains(activeElement))
    ) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div
      id={sheetId}
      className={cx("krds-bottom-sheet", closing && "closing", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest?.("[data-close]")) close();
      }}
    >
      <div className="bottom-sheet-overlay" data-close />
      <div className="bottom-sheet-panel" role="document" ref={panelRef}>
        <button
          type="button"
          className="bottom-sheet-handle"
          data-close
          aria-hidden="true"
          tabIndex={-1}
        />
        {title ? (
          <div className="bottom-sheet-header">
            <h2 id={titleId} className="bottom-sheet-title">
              {title}
            </h2>
            {description ? <p className="bottom-sheet-description">{description}</p> : null}
          </div>
        ) : null}
        <div className="bottom-sheet-body">{children}</div>
        <button
          type="button"
          className="krds-btn medium icon bottom-sheet-close"
          aria-label={closeLabel ?? "닫기"}
          onClick={close}
        >
          <SvgIcon name="ico-modal-close" />
        </button>
      </div>
    </div>
  );
}
