import { useState, useId, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type BoxProps } from "./_utils.js";

export interface ContextualHelpProps extends Omit<BoxProps, "position" | "open"> {
  label?: string;
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  caption?: ReactNode;
  title?: ReactNode;
  linkLabel?: ReactNode;
  href?: string;
  closeLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContextualHelp({
  label,
  position = "top-left",
  caption,
  title,
  linkLabel,
  href = "#",
  closeLabel,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: ContextualHelpProps) {
  const generatedId = useId();
  const popoverId = `krds-contextual-help-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div className={cx("krds-contextual-help", ...position.split("-"), className)}>
      <p className="tooltip-txt">{caption}</p>
      <div className="tooltip-action">
        <button
          type="button"
          className="krds-btn medium icon tooltip-btn"
          aria-expanded={open}
          aria-controls={popoverId}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{label}</span>
          <SvgIcon name="ico-tooltip" />
        </button>
        <div
          id={popoverId}
          className="tooltip-popover"
          role="tooltip"
          style={open ? { display: "block", width: "360px" } : undefined}
        >
          <h4 className="tooltip-title">{title}</h4>
          <div className="tooltip-contents">
            <p>{children}</p>
            {linkLabel ? (
              <div className="btn-wrap">
                <a href={href} className="krds-btn xsmall link basic">
                  {linkLabel} <SvgIcon name="ico-angle right" />
                </a>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="krds-btn xsmall icon tooltip-close"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{closeLabel}</span>
            <SvgIcon name="ico-modal-close" />
          </button>
        </div>
      </div>
    </div>
  );
}
