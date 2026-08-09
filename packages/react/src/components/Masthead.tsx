import { type ReactNode, type Ref } from "react";
import { type BoxProps } from "./_utils.js";

export interface MastheadProps extends BoxProps {
  message?: ReactNode;
}
export function Masthead({
  id = "krds-masthead",
  message = "도움말",
  className,
  ref,
  ...props
}: MastheadProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div {...props} ref={ref} id={id} className={className}>
      <div className="toggle-wrap">
        <div className="toggle-head">
          <div className="inner">
            <span className="nuri-txt">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
