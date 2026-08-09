import { Show, mergeProps, splitProps, type JSX } from "solid-js";

export interface ButtonTextProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  size?: string;
  icon?: JSX.Element;
  [key: string]: unknown;
}

export function ButtonText(rawProps: ButtonTextProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "size",
    "icon",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label ?? "레이블";
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      class={["krds-btn", "text", props.size, className()].filter(Boolean).join(" ")}
    >
      {content()}
    </button>
  );
}

export function ButtonWithIcon(rawProps: ButtonTextProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "size",
    "icon",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label ?? "레이블";
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      class={["krds-btn", props.size, className()].filter(Boolean).join(" ")}
    >
      {content()}
      <Show when={true}>{props.icon ?? <i class="svg-icon ico-sch" />}</Show>
    </button>
  );
}
