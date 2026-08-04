import { Show, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";

export interface TextareaProps {
  class?: string;
  className?: string;
  id?: string;
  label?: string;
  hint?: string;
  maxLength?: number;
  value?: string;
  modelValue?: string;
  [key: string]: unknown;
}

export function Textarea(rawProps: TextareaProps) {
  const merged = mergeProps({ id: `krds-textarea-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "label",
    "hint",
    "maxLength",
    "value",
    "modelValue",
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
      <div class="form-conts">
        <div class="textarea-wrap">
          <textarea
            {...(native as Record<string, any>)}
            id={props.id}
            class={["krds-input", className()].filter(Boolean).join(" ")}
            maxlength={props.maxLength}
            value={value()}
            onInput={updateInput}
          />
        </div>
      </div>
      <Show when={props.hint}>
        <p class="form-hint">{props.hint}</p>
      </Show>
    </div>
  );
}
