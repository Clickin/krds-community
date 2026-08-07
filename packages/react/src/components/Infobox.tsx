import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

export interface InfoboxProps extends BoxProps {
  type?: "primary" | "secondary";
  size?: "default" | "slim";
  message: ReactNode;
  "aria-label"?: string;
}

export function Infobox({
  type = "primary",
  size = "default",
  message,
  "aria-label": ariaLabel,
  className,
}: InfoboxProps) {
  return (
    <div
      className={cx("krds-infobox", type, size, className)}
      role="region"
      aria-label={ariaLabel ?? "알림"}
    >
      <p className="infobox-text">{message}</p>
    </div>
  );
}
