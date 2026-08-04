import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { type NativeCommonProps } from "./_utils.js";

export interface ChoiceChipProps
  extends NativeCommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  type?: "checkbox" | "radio";
  size?: "small" | "medium" | "large";
}
export function CheckboxChip({
  label,
  size,
  className,
  id: providedId,
  ref,
  ...props
}: ChoiceChipProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-checkbox-chip-${generatedId}`;
  return (
    <div className={cx("krds-form-chip", size, className)}>
      <input {...props} ref={ref} id={id} type="checkbox" className="checkbox" />
      <label className="krds-form-chip-outline" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
