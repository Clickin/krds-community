import { useState } from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

export interface ChipOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ChipProps extends Omit<BoxProps, "selected" | "options"> {
  type?: "single" | "multi";
  size?: "large" | "medium";
  options: ChipOption[];
  selected?: string | string[];
  defaultSelected?: string | string[];
  onChange?: (value: string | string[]) => void;
  ariaLabel?: string;
}

export function Chip({
  type = "single",
  size = "medium",
  options,
  selected: controlledSelected,
  defaultSelected,
  onChange,
  ariaLabel = "선택",
  className,
}: ChipProps) {
  const controlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | string[] | undefined>(
    defaultSelected ?? (type === "multi" ? [] : undefined),
  );
  const current = controlled ? controlledSelected : internalSelected;

  const isSelected = (option: ChipOption) =>
    type === "multi"
      ? Array.isArray(current) && current.includes(option.value)
      : current === option.value;

  const toggle = (option: ChipOption) => {
    if (option.disabled) return;
    if (type === "multi") {
      const next = Array.isArray(current) && current.includes(option.value)
        ? current.filter((item) => item !== option.value)
        : [...(Array.isArray(current) ? current : []), option.value];
      if (!controlled) setInternalSelected(next);
      onChange?.(next);
    } else {
      if (current === option.value) return;
      if (!controlled) setInternalSelected(option.value);
      onChange?.(option.value);
    }
  };

  return (
    <div
      className={cx("krds-chip", type, size, className)}
      role={type === "single" ? "radiogroup" : "group"}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cx("krds-btn small text chip", isSelected(option) && "active")}
          aria-pressed={isSelected(option)}
          disabled={option.disabled}
          onClick={() => toggle(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
