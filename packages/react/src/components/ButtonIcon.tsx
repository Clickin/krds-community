import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type NativeCommonProps } from "./_utils.js";

export interface ButtonIconProps
  extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: ReactNode;
  size?: "small" | "medium" | "large";
}
export function ButtonIcon({
  label,
  icon,
  size,
  className,
  children,
  ref,
  ...props
}: ButtonIconProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      className={cx("krds-btn", "icon", size, className)}
    >
      {children ?? (
        <>
          <span className="sr-only">{label}</span>
          {icon ?? <SvgIcon name="ico-sch" />}
        </>
      )}
    </button>
  );
}
