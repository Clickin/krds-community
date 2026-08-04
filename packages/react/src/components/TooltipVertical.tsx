import { Tooltip, type TooltipProps } from "./Tooltip.js";

export function TooltipVertical(props: TooltipProps) {
  return <Tooltip {...props} placement="vertical" />;
}
