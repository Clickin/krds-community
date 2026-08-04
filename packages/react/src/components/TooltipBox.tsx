import { Tooltip, type TooltipProps } from "./Tooltip.js";

export function TooltipBox(props: TooltipProps) {
  return <Tooltip {...props} placement="box" />;
}
