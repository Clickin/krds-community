import { type Ref } from "react";
import { Select } from "./Select.js";
import type { SelectProps } from "./Select.js";

export function SelectSorting({
  ref,
  label = "선택",
  ...props
}: Omit<SelectProps, "label"> & { label?: string } & { ref?: Ref<HTMLSelectElement> }) {
  return (
    <Select {...props} label={label} {...(ref !== undefined ? { ref } : {})} variant="sorting" />
  );
}
