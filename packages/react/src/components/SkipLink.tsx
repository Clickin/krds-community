import { type AnchorHTMLAttributes, type ReactNode, type Ref } from "react";

export function SkipLink({
  href = "#main",
  label: _label,
  children = "본문 바로가기",
  className,
  id,
  ref,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { label?: ReactNode } & {
  ref?: Ref<HTMLAnchorElement>;
}) {
  return (
    <div id={id ?? "krds-skip-link"} className={className}>
      <a {...props} ref={ref} href={href}>
        {children}
      </a>
    </div>
  );
}
