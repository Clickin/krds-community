import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { type NativeCommonProps } from "./_utils.js";

export interface ChoiceChipProps
  extends NativeCommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  type?: "checkbox" | "radio";
  size?: "small" | "medium" | "large";
  indeterminate?: boolean;
}
export function CheckboxChip({
  label,
  size,
  className,
  id: providedId,
  indeterminate = false,
  ref,
  ...props
}: ChoiceChipProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-checkbox-chip-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const setInputRef = (input: HTMLInputElement | null) => {
    inputRef.current = input;
    if (typeof ref === "function") ref(input);
    else if (ref) ref.current = input;
  };
  return (
    <div className={cx("krds-form-chip", size, className)}>
      <input {...props} ref={setInputRef} id={id} type="checkbox" className="checkbox" />
      <label className="krds-form-chip-outline" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
