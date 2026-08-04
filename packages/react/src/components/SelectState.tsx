import { type Ref } from "react";
import { Select } from "./Select.js";
import type { SelectProps } from "./Select.js";

export function SelectState({ ref, ...props }: SelectProps & { ref?: Ref<HTMLSelectElement> }) {
  return (
    <Select
      {...props}
      {...(ref !== undefined ? { ref } : {})}
      variant="state"
      state={props.state ?? "error"}
    />
  );
}
