import { useId, type HTMLAttributes, type Ref } from "react";
import { cx } from "@krds-community/recipes";

export function Spinner({
  label = "처리 중",
  inputLabel = "Label",
  placeholder = "placeholder",
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label?: string;
  inputLabel?: string;
  placeholder?: string;
} & { ref?: Ref<HTMLDivElement> }) {
  const inputId = `krds-spinner-input-${useId()}`;
  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={inputId}>{inputLabel}</label>
      </div>
      <div className="form-conts">
        <div className="form-spinner">
          <input type="text" id={inputId} className="krds-input" placeholder={placeholder} />
          <div {...props} ref={ref} className={cx("krds-spinner", className)} role="status">
            <span className="sr-only">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
