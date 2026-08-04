import { mergeProps, splitProps, type JSX } from "solid-js";

export interface IdentifierProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  description?: string;
  organization?: string;
  [key: string]: unknown;
}

export function Identifier(rawProps: IdentifierProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "description",
    "organization",
  ]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-identifier${className() ? ` ${className()}` : ""}`}
    >
      <span class="logo">
        <span class="sr-only">{props.organization}</span>
      </span>
      <span class="ban-txt">{props.description ?? props.children}</span>
    </div>
  );
}
