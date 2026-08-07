import { Show, mergeProps, splitProps } from "solid-js";

export interface TopButtonProps {
  class?: string;
  className?: string;
  type?: "basic" | "label";
  onClick: () => void;
  ariaLabel?: string;
  label?: string;
  [key: string]: unknown;
}

export function TopButton(rawProps: TopButtonProps) {
  const merged = mergeProps({ type: "basic" as const }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "type",
    "onClick",
    "ariaLabel",
    "label",
  ]);

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-top-button${className() ? ` ${className()}` : ""}`}
    >
      <button
        type="button"
        class="krds-btn medium icon"
        aria-label={props.ariaLabel ?? "맨 위로"}
        onClick={props.onClick}
      >
        <i class="svg-icon ico-go-top" />
        <Show when={props.type === "label"}>
          <span>{props.label ?? "TOP"}</span>
        </Show>
      </button>
    </div>
  );
}
