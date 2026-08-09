import { createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface SpinnerProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  id?: string;
  inputLabel?: string;
  placeholder?: string;
  [key: string]: unknown;
}

export function Spinner(rawProps: SpinnerProps) {
  const merged = mergeProps({ id: `krds-spinner-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "id",
    "inputLabel",
    "placeholder",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <div class="form-group">
      <div class="form-tit">
        <label for={`${props.id}-input`}>{props.inputLabel ?? "Label"}</label>
      </div>
      <div class="form-conts">
        <div class="form-spinner">
          <input
            type="text"
            id={`${props.id}-input`}
            class="krds-input"
            aria-label={props.inputLabel}
            placeholder={props.placeholder ?? "placeholder"}
          />
          <div
            {...(native as Record<string, any>)}
            class={`krds-spinner${className() ? ` ${className()}` : ""}`}
            role="status"
          >
            <span class="sr-only">{content()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
