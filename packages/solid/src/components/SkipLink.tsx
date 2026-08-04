import { mergeProps, splitProps, type JSX } from "solid-js";

export interface SkipLinkProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  href?: string;
  id?: string;
  [key: string]: unknown;
}

export function SkipLink(rawProps: SkipLinkProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "href",
    "id",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <div id={props.id ?? "krds-skip-link"} class={className() || undefined}>
      <a {...(native as Record<string, any>)} href={props.href}>
        {content()}
      </a>
    </div>
  );
}
