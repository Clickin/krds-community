import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

export interface ProgressBarProps extends BoxProps {
  size?: "large" | "medium";
  state?: "active" | "success" | "error";
  value?: number;
  max?: number;
  label?: ReactNode;
}

export function ProgressBar({
  size = "medium",
  state = "active",
  value = 0,
  max = 100,
  label,
  className,
}: ProgressBarProps) {
  return (
    <div className={cx("krds-progress-bar", size, state, className)}>
      <progress className="krds-progress" value={value} max={max}>
        {label ?? `${value}%`}
      </progress>
      {label ? <span className="progress-label">{label}</span> : null}
    </div>
  );
}
