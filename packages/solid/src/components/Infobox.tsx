import { mergeProps, splitProps, type JSX } from "solid-js";

export interface InfoboxProps {
  class?: string;
  className?: string;
  type?: "primary" | "secondary";
  size?: "default" | "slim";
  message: JSX.Element;
  ariaLabel?: string;
  [key: string]: unknown;
}

export function Infobox(rawProps: InfoboxProps) {
  const merged = mergeProps({ type: "primary" as const, size: "default" as const }, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "type", "size", "message", "ariaLabel"]);

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-infobox ${props.type} ${props.size}${className() ? ` ${className()}` : ""}`}
      role="region"
      aria-label={props.ariaLabel ?? "알림"}
    >
      <p class="infobox-text">{props.message}</p>
    </div>
  );
}
