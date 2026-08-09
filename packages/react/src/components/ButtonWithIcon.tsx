import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";

export function ButtonWithIcon({
  icon,
  label,
  children,
  className,
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode; label?: ReactNode } & {
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      className={cx("krds-btn", className)}
    >
      {children ?? label ?? "레이블"}
      {icon ?? <SvgIcon name="ico-sch" />}
    </button>
  );
}
