import { createEffect, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";

export interface TextInputIconProps {
  class?: string;
  className?: string;
  id?: string;
  label?: string;
  value?: string;
  modelValue?: string;
  type?: string;
  passwordLabel?: string;
  [key: string]: unknown;
}

export function TextInputIcon(rawProps: TextInputIconProps) {
  const merged = mergeProps({ id: `krds-input-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "label",
    "value",
    "modelValue",
    "type",
    "passwordLabel",
  ]);
  const [localValue, setLocalValue] = createSignal("");
  const value = () => {
    if (props.value !== undefined) return String(props.value ?? "");
    if (typeof props.modelValue === "string" || typeof props.modelValue === "number")
      return String(props.modelValue);
    return localValue();
  };
  const setValue = (next: string) => {
    if (props.value === undefined) setLocalValue(next);
  };
  const updateInput = (
    event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement },
  ) => {
    setValue(event.currentTarget.value);
    (native as Record<string, any>).onInput?.(event);
  };
  const className = () => props.class ?? props.className ?? "";
  return (
    <div class="form-group">
      <div class="form-tit">
        <label for={props.id}>{props.label}</label>
      </div>
      <div class="form-conts btn-ico-wrap">
        <input
          {...(native as Record<string, any>)}
          id={props.id}
          ref={(element) => {
            createEffect(() => {
              const mv = props.modelValue;
              if (props.value !== undefined || typeof mv === "string" || typeof mv === "number") {
                element.value = value();
                element.setAttribute("value", value());
              }
            });
          }}
          class={["krds-input", className()].filter(Boolean).join(" ")}
          type={props.type}
          value={value()}
          onInput={updateInput}
        />
        <button type="button" class="krds-btn medium icon">
          <span class="sr-only">{props.passwordLabel ?? "입력한 비밀번호 보기"}</span>
          <i class="svg-icon ico-pw-visible" />
        </button>
      </div>
    </div>
  );
}
