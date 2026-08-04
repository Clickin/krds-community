import type { ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsTone } from "@krds-community/recipes";
import { toneClass, outlineToneClass } from "./_utils.js";
import type { BoxProps } from "./_utils.js";

export interface BadgeProps extends BoxProps {
  tone?: KrdsTone;
  appearance?: "outline" | "solid" | "light";
  size?: "small" | "medium" | "large";
  number?: boolean;
  label?: ReactNode;
}
export function Badge({
  tone = "primary",
  appearance = "outline",
  size,
  number,
  label,
  children,
  className,
}: BadgeProps) {
  const appearanceClass =
    appearance === "outline"
      ? outlineToneClass[tone]
      : appearance === "light"
        ? `bg-light-${toneClass[tone]}`
        : `bg-${toneClass[tone]}`;
  return (
    <span className={cx("krds-badge", appearanceClass, size, number && "number", className)}>
      {children ?? label}
    </span>
  );
}
export const BadgeNumber = (props: Omit<BadgeProps, "number">) => <Badge {...props} number />;
export const BadgeSize = Badge;
