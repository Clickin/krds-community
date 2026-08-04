import { type Ref } from "react";
import { type BoxProps, cx } from "./_utils.js";

export interface IdentifierProps extends BoxProps {
  organization?: string;
  description?: string;
}
export function Identifier({
  organization = "KRDS - Korea Design System",
  description,
  className,
  children,
  ref,
  ...props
}: IdentifierProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div {...props} ref={ref} className={cx("krds-identifier", className)}>
      <span className="logo">
        <span className="sr-only">{organization}</span>
      </span>
      <span className="ban-txt">{children ?? description}</span>
    </div>
  );
}
