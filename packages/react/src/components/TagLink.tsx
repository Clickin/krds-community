import { type AnchorHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";

export function TagLink({
  href = "#",
  label,
  children,
  className,
  ref,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { label?: ReactNode } & {
  ref?: Ref<HTMLAnchorElement>;
}) {
  return (
    <div className="krds-tag-wrap large">
      <a {...props} ref={ref} href={href} className={cx("krds-btn-tag", "link", className)}>
        {children ?? label}
      </a>
    </div>
  );
}
