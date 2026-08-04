import { useId, type HTMLAttributes, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsNavItem } from "@krds-community/recipes";
import { type NativeCommonProps } from "./_utils.js";

export interface BreadcrumbProps extends NativeCommonProps, HTMLAttributes<HTMLElement> {
  items?: KrdsNavItem[];
  label?: string;
}
export function Breadcrumb({
  items = [],
  label = "현재 경로",
  id: providedId,
  className,
  "aria-label": ariaLabel,
  ref,
  ...props
}: BreadcrumbProps & { ref?: Ref<HTMLElement> }) {
  const generatedId = useId();
  return (
    <nav
      {...props}
      ref={ref}
      id={providedId ?? `krds-breadcrumb-${generatedId}`}
      className={cx("krds-breadcrumb-wrap", className)}
      aria-label={ariaLabel ?? label}
    >
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li className={index === 0 ? "home" : undefined} key={item.id ?? item.label}>
            <a className="txt" href={item.href ?? "#"}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
