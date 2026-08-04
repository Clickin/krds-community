import { type ComponentProps } from "react";
import { Radio } from "./Radio.js";

export function RadioSize(props: ComponentProps<typeof Radio>) {
  return (
    <div className="krds-check-area">
      <Radio {...props} />
      <Radio label="사이즈 : large" name={props.name} size="large" />
    </div>
  );
}
