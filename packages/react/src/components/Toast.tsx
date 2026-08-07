import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

const CLOSE_ANIMATION_MS = 200;

export interface ToastProps extends BoxProps {
  message: ReactNode;
  tone?: "information" | "warning";
  open?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
}

export function Toast({
  message,
  tone = "information",
  open: controlledOpen,
  defaultOpen = false,
  duration,
  onOpenChange,
  className,
}: ToastProps) {
  const controlled = controlledOpen !== undefined;
  const [rendered, setRendered] = useState(
    controlled ? controlledOpen === true : defaultOpen === true,
  );
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (controlledOpen === true) {
      setClosing(false);
      setRendered(true);
      const timer = setTimeout(
        () => {
          if (controlled) onOpenChange?.(false);
          else setClosing(true);
        },
        duration ?? (tone === "warning" ? 4000 : 3000),
      );
      return () => clearTimeout(timer);
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
    if (!controlled) {
      const timer = setTimeout(
        () => setClosing(true),
        duration ?? (tone === "warning" ? 4000 : 3000),
      );
      return () => clearTimeout(timer);
    }
  }, [controlledOpen, controlled, rendered, duration, tone, onOpenChange]);

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
    <div
      className={cx("krds-toast", className, closing && "closing")}
      role={tone === "warning" ? "alert" : "status"}
    >
      <p className="toast-text">{message}</p>
    </div>
  );
}
