import { mergeProps, splitProps, type JSX } from "solid-js";

export interface MastheadProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  message?: string;
  description?: string;
  id?: string;
  [key: string]: unknown;
}

export function Masthead(rawProps: MastheadProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "message",
    "description",
    "id",
  ]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      id={props.id ?? "krds-masthead"}
      class={className() || undefined}
    >
      <div class="toggle-wrap">
        <div class="toggle-head">
          <div class="inner">
            <span class="nuri-txt">{props.message ?? props.description ?? props.children}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
