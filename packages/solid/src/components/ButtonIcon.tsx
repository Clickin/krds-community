import { mergeProps, splitProps, type JSX } from "solid-js";

export interface ButtonIconProps {
  class?: string;
  className?: string;
  label?: string;
  size?: string;
  icon?: JSX.Element;
  [key: string]: unknown;
}

export function ButtonIcon(rawProps: ButtonIconProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "label", "size", "icon"]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      class={["krds-btn", "icon", props.size, className()].filter(Boolean).join(" ")}
    >
      <span class="sr-only">{props.label}</span>
      {props.icon ?? <i class="svg-icon ico-sch" />}
    </button>
  );
}
