import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";

export function ButtonText({
  className,
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label?: ReactNode }) {
  return (
    <button {...props} type={props.type ?? "button"} className={cx("krds-btn", "text", className)}>
      {children ?? label ?? "레이블"}
    </button>
  );
}
