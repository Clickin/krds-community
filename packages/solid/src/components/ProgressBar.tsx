import { Show, mergeProps, splitProps, type JSX } from "solid-js";

export interface ProgressBarProps {
  class?: string;
  className?: string;
  size?: "large" | "medium";
  state?: "active" | "success" | "error";
  value?: number;
  max?: number;
  label?: JSX.Element;
  [key: string]: unknown;
}

export function ProgressBar(rawProps: ProgressBarProps) {
  const merged = mergeProps(
    { size: "medium" as const, state: "active" as const, value: 0, max: 100 },
    rawProps,
  );
  const [props, native] = splitProps(merged, ["class", "className", "size", "state", "value", "max", "label"]);

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-progress-bar ${props.size} ${props.state}${className() ? ` ${className()}` : ""}`}
    >
      <progress class="krds-progress" value={props.value} max={props.max}>
        {props.label ?? `${props.value}%`}
      </progress>
      <Show when={props.label}>
        <span class="progress-label">{props.label}</span>
      </Show>
    </div>
  );
}
