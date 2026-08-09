import { type AnchorHTMLAttributes, type ReactNode, type Ref } from "react";
import { SvgIcon, cx } from "./_utils.js";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  label?: ReactNode;
}
export function Link({
  external = false,
  label,
  children,
  className,
  href = "#",
  target,
  rel,
  title,
  ref,
  ...props
}: LinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  return (
    <a
      {...props}
      ref={ref}
      href={href}
      className={cx("krds-btn", "small", "link", className)}
      target={external ? "_blank" : target}
      rel={rel}
      title={external ? (title ?? "새 창 열림") : title}
    >
      <span className="underline">{children ?? label}</span>{" "}
      <SvgIcon name={external ? "ico-go" : "ico-angle right"} />
    </a>
  );
}
