import { type ComponentProps } from "react";
import { Checkbox } from "./Checkbox.js";

export function CheckboxSize(props: ComponentProps<typeof Checkbox>) {
  return <Checkbox {...props} />;
}
