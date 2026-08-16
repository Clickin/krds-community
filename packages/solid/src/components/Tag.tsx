import { Show, mergeProps, splitProps, type JSX } from "solid-js";

export interface TagProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  size?: string;
  removable?: boolean;
  message?: string;
  href?: string;
  [key: string]: unknown;
}

export function Tag(rawProps: TagProps) {
  const merged = mergeProps({ size: "large", message: "삭제", removable: true }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "size",
    "removable",
    "message",
    "href",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <div class={["krds-tag-wrap", props.size].filter(Boolean).join(" ")}>
      <span
        {...(native as Record<string, any>)}
        class={`krds-btn-tag${className() ? ` ${className()}` : ""}`}
      >
        {content()}
        <Show when={props.removable}>
          <button type="button" class="btn-delete">
            <span class="sr-only">{props.message}</span>
          </button>
        </Show>
      </span>
    </div>
  );
}

export function TagLink(rawProps: TagProps) {
  const merged = mergeProps({ size: "large" }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "size",
    "removable",
    "message",
    "href",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <div class={["krds-tag-wrap", props.size].filter(Boolean).join(" ")}>
      <a
        {...(native as Record<string, any>)}
        href={props.href}
        class={`krds-btn-tag link${className() ? ` ${className()}` : ""}`}
      >
        {content()}
      </a>
    </div>
  );
}
