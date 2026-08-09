import {
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, joinAriaIds, inlineSpacedText, type NativeCommonProps } from "./_utils.js";

export interface TooltipProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  message?: ReactNode;
  placement?: "horizontal" | "vertical" | "box";
}

export function Tooltip({
  label,
  message,
  placement = "horizontal",
  children,
  className,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: TooltipProps & { ref?: Ref<HTMLButtonElement> }) {
  const generatedId = useId();
  const tooltipId = `tooltip-popover-${generatedId}`;
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);
  useLayoutEffect(() => {
    if (!visible) return;
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;

    const gap = 12;
    const {
      top: triggerTop,
      left: triggerLeft,
      right: triggerRight,
      height: triggerHeight,
      width: triggerWidth,
    } = trigger.getBoundingClientRect();
    const tooltipHeight = popover.clientHeight;
    const tooltipWidth = popover.clientWidth;
    let top: number;
    let left: number;

    popover.classList.remove("top", "bottom", "left", "right");
    if (placement === "horizontal") {
      top = triggerTop + (triggerHeight - tooltipHeight) / 2;
      if (triggerRight > window.innerWidth / 2) {
        left = triggerLeft - tooltipWidth - gap;
        popover.classList.add("right");
      } else {
        left = triggerRight + gap;
      }
    } else {
      if (triggerTop + triggerHeight > window.innerHeight / 2) {
        top = triggerTop - tooltipHeight - gap;
        popover.classList.add("top");
      } else {
        top = triggerTop + triggerHeight + gap;
        popover.classList.add("bottom");
      }

      if (triggerRight > window.innerWidth / 2) {
        left = triggerRight - tooltipWidth;
        popover.classList.add("right");
        if (window.innerWidth - triggerRight > tooltipWidth / 2) {
          left = triggerLeft + (triggerWidth - tooltipWidth) / 2;
          popover.classList.remove("right");
        }
      } else {
        left = triggerLeft + (triggerWidth - tooltipWidth) / 2;
        if (left < 0) {
          left = triggerLeft;
          popover.classList.add("left");
        }
      }
    }

    popover.style.top = `${top}px`;
    popover.style.left = window.innerWidth <= 420 ? "50%" : `${left}px`;
    return () => {
      popover.style.removeProperty("top");
      popover.style.removeProperty("left");
      popover.classList.remove("top", "bottom", "left", "right");
    };
  }, [placement, visible]);

  return (
    <>
      <button
        {...props}
        ref={triggerRef}
        type={props.type ?? "button"}
        className={cx(
          "krds-btn",
          "small",
          "text",
          "krds-tooltip",
          placement === "horizontal" ? undefined : `tooltip-${placement}`,
          className,
        )}
        data-tooltip={typeof message === "string" ? message : undefined}
        aria-labelledby={joinAriaIds(ariaLabelledBy, tooltipId)}
        onFocus={(event) => {
          onFocus?.(event);
          setVisible(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setVisible(false);
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          setVisible(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          setVisible(false);
        }}
      >
        {inlineSpacedText(children ?? label, false, true)}
        <SvgIcon name="ico-angle right" />
      </button>
      <div
        ref={popoverRef}
        id={tooltipId}
        role="tooltip"
        className={cx(
          "krds-tooltip-popover",
          visible && "active",
          visible && placement !== "horizontal" && `tooltip-${placement}`,
        )}
        aria-hidden={visible ? "false" : "true"}
      >
        <span className="sr-only">{label ?? children}</span> {message}
      </div>
    </>
  );
}
