import { useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsOption } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";

export interface ResizeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  dataAdjust?: boolean;
  label?: ReactNode;
  options?: KrdsOption[];
  value?: string;
  selected?: string;
  defaultValue?: string;
  selectedLabel?: ReactNode;
  resetLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
}
export function Resize({
  dataAdjust = true,
  className,
  label,
  options = [],
  value,
  selected,
  defaultValue,
  selectedLabel,
  resetLabel,
  open: controlledOpen,
  defaultOpen = false,
  onChange,
  onOpenChange,
  onReset,
  ref,
  ...props
}: ResizeProps & { ref?: Ref<HTMLDivElement> }) {
  const controlledValue = value ?? selected;
  const valueControlled = value !== undefined || selected !== undefined;
  const resetValue = defaultValue ?? options[0]?.value ?? "";
  const [uncontrolledValue, setUncontrolledValue] = useState(resetValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropId = useId();
  const selectedValue = controlledValue ?? uncontrolledValue;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const select = (next: string) => {
    if (!valueControlled) setUncontrolledValue(next);
    onChange?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <div
      {...props}
      ref={ref}
      className={cx("krds-drop-wrap", "krds-resize", className)}
      {...(dataAdjust ? { "data-adjust": "scale" } : {})}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx("krds-btn", "small", "text", "drop-btn", open && "active")}
        aria-expanded={open}
        aria-controls={dropId}
        onClick={() => setOpen(!open)}
      >
        {label + " "}
        <SvgIcon name="ico-toggle" />
      </button>
      <div id={dropId} className="drop-menu">
        <div className="drop-in">
          <ul className="drop-list">
            {options.map((option) => {
              const active = selectedValue === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cx(
                      "item-link",
                      (option as KrdsOption & { className?: string }).className ?? option.value,
                      active && "active",
                    )}
                    {...(dataAdjust ? { "data-adjust-scale": option.value } : {})}
                    disabled={option.disabled}
                    onClick={() => select(option.value)}
                  >
                    {option.label}
                    <span className="sr-only">{active ? selectedLabel : null}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="drop-bottom">
            <button
              type="button"
              className="krds-btn medium text"
              {...(dataAdjust ? { "data-adjust-scale": resetValue } : {})}
              onClick={() => {
                select(resetValue);
                onReset?.();
              }}
            >
              <SvgIcon name="ico-reset" /> {resetLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
