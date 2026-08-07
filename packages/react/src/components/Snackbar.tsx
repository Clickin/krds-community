import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type BoxProps } from "./_utils.js";

const CLOSE_ANIMATION_MS = 200;

export interface SnackbarProps extends BoxProps {
  title?: ReactNode;
  message: ReactNode;
  icon?: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Snackbar({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  closeLabel = "닫기",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
}: SnackbarProps) {
  const controlled = controlledOpen !== undefined;
  const [rendered, setRendered] = useState(
    controlled ? controlledOpen === true : defaultOpen === true,
  );
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (controlled) onOpenChange?.(false);
    else setClosing(true);
  };

  useEffect(() => {
    if (controlledOpen === true) {
      setClosing(false);
      setRendered(true);
      return;
    }
    if (!rendered) return;
    if (controlledOpen === false) {
      setClosing(true);
      const timer = setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, CLOSE_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
  }, [controlledOpen, rendered]);

  useEffect(() => {
    if (!closing || !rendered || controlled) return;
    const timer = setTimeout(() => {
      setRendered(false);
      setClosing(false);
      onOpenChange?.(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [closing, rendered, controlled, onOpenChange]);

  if (!rendered) return null;
  return (
    <div className={cx("krds-snackbar", className, closing && "closing")} role="alert">
      {icon ? <i className={cx("svg-icon snackbar-icon", icon)} aria-hidden="true" /> : null}
      <div className="snackbar-conts">
        {title ? <strong className="snackbar-title">{title}</strong> : null}
        <p className="snackbar-text">{message}</p>
      </div>
      {actionLabel ? (
        <button type="button" className="krds-btn small text snackbar-action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      <button
        type="button"
        className="krds-btn small icon snackbar-close"
        aria-label={closeLabel ?? "닫기"}
        onClick={close}
      >
        <SvgIcon name="ico-modal-close" />
      </button>
    </div>
  );
}
