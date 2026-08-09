import { mergeProps, splitProps, type JSX } from "solid-js";

export interface ButtonHierarchyProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  tone?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export function ButtonHierarchy(rawProps: ButtonHierarchyProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "tone",
    "variant",
    "size",
    "disabled",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label ?? "레이블";
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      disabled={props.disabled}
      class={["krds-btn", props.variant ?? props.tone, props.size, className()]
        .filter(Boolean)
        .join(" ")}
    >
      {content()}
    </button>
  );
}

export const ButtonSize = ButtonHierarchy;
