import { mergeProps, splitProps, type JSX } from "solid-js";

export interface TooltipProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  message?: string;
  icon?: JSX.Element;
  id?: string;
  [key: string]: unknown;
}

export function Tooltip(rawProps: TooltipProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "message",
    "icon",
    "id",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <>
      <button
        {...(native as Record<string, any>)}
        type="button"
        class={["krds-btn", "krds-tooltip", "small", "text", className()].filter(Boolean).join(" ")}
        data-tooltip={props.message}
        aria-labelledby={`${props.id}-tooltip`}
      >
        {content()} {props.icon ?? <i class="svg-icon ico-angle right" />}
      </button>
      <span id={`${props.id}-tooltip`} class="krds-tooltip-popover" role="tooltip" hidden>
        {[props.label, props.message].filter(Boolean).join(" ")}
      </span>
    </>
  );
}

export function TooltipBox(rawProps: TooltipProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "message",
    "icon",
    "id",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <>
      <button
        {...(native as Record<string, any>)}
        type="button"
        class={["krds-btn", "krds-tooltip", "small", "text", "tooltip-box", className()]
          .filter(Boolean)
          .join(" ")}
        data-tooltip={props.message}
        aria-labelledby={`${props.id}-tooltip`}
      >
        {content()} {props.icon ?? <i class="svg-icon ico-angle right" />}
      </button>
      <span id={`${props.id}-tooltip`} class="krds-tooltip-popover" role="tooltip" hidden>
        {[props.label, props.message].filter(Boolean).join(" ")}
      </span>
    </>
  );
}

export function TooltipVertical(rawProps: TooltipProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "message",
    "icon",
    "id",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <>
      <button
        {...(native as Record<string, any>)}
        type="button"
        class={["krds-btn", "krds-tooltip", "small", "text", "tooltip-vertical", className()]
          .filter(Boolean)
          .join(" ")}
        data-tooltip={props.message}
        aria-labelledby={`${props.id}-tooltip`}
      >
        {content()} {props.icon ?? <i class="svg-icon ico-angle right" />}
      </button>
      <span id={`${props.id}-tooltip`} class="krds-tooltip-popover" role="tooltip" hidden>
        {[props.label, props.message].filter(Boolean).join(" ")}
      </span>
    </>
  );
}
