import { useId, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { ChoiceChipProps } from "./CheckboxChip.js";

export function RadioChip({
  label,
  size,
  className,
  id: providedId,
  ref,
  ...props
}: ChoiceChipProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-radio-chip-${generatedId}`;
  return (
    <div className={cx("krds-form-chip", size, className)}>
      <input {...props} ref={ref} id={id} type="radio" className="radio" />
      <label className="krds-form-chip-outline" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
