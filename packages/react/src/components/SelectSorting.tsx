import { type Ref } from "react";
import { Select } from "./Select.js";
import type { SelectProps } from "./Select.js";

export function SelectSorting({
  ref,
  label,
  title,
  ...props
}: Omit<SelectProps, "label"> & { label?: string; title?: string } & { ref?: Ref<HTMLSelectElement> }) {
  return (
    <Select
      {...props}
      title={title}
      label={label ?? title}
      {...(ref !== undefined ? { ref } : {})}
      variant="sorting"
    />
  );
}
