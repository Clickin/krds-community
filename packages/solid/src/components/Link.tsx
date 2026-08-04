import { Show, mergeProps, splitProps, type JSX } from "solid-js";

export interface LinkProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  href?: string;
  target?: string;
  external?: boolean;
  size?: string;
  icon?: JSX.Element;
  title?: string;
  [key: string]: unknown;
}

export function Link(rawProps: LinkProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "href",
    "target",
    "external",
    "size",
    "icon",
    "title",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <a
      {...(native as Record<string, any>)}
      href={props.href}
      target={props.target ?? (props.external ? "_blank" : undefined)}
      title={props.external ? props.title : undefined}
      class={["krds-btn", "link", props.size, className()].filter(Boolean).join(" ")}
    >
      <span class="underline">{content()}</span>{" "}
      <Show when={props.external ?? Boolean(props.target)}>
        {props.icon ?? <i class="svg-icon ico-go" />}
      </Show>
    </a>
  );
}
