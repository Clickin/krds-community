import { type ButtonHTMLAttributes } from "react";
import { cx } from "@krds-community/recipes";

export function ButtonText({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={props.type ?? "button"} className={cx("krds-btn", "text", className)}>
      {children}
    </button>
  );
}
