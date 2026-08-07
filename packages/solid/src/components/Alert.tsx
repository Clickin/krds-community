import { Show, mergeProps, splitProps, type JSX } from "solid-js";

export interface AlertProps {
  class?: string;
  className?: string;
  state?: "danger" | "warning" | "success" | "information";
  size?: "with-title" | "slim";
  title?: JSX.Element;
  message: JSX.Element;
  [key: string]: unknown;
}

export function Alert(rawProps: AlertProps) {
  const merged = mergeProps({ state: "danger" as const, size: "slim" as const }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "state",
    "size",
    "title",
    "message",
  ]);

  const alertIcon = () => {
    if (props.state === "success") return "ico-success-fill";
    if (props.state === "information") return "ico-information-fill";
    return "ico-error-fill";
  };

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-alert ${props.state} ${props.size}${className() ? ` ${className()}` : ""}`}
      role="status"
    >
      <i class={`svg-icon alert-icon ${alertIcon()}`} aria-hidden="true" />
      <Show when={props.title}>
        <strong class="alert-title">{props.title}</strong>
      </Show>
      <p class="alert-body">{props.message}</p>
    </div>
  );
}
