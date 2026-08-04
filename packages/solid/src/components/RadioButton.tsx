import { createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface RadioButtonProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  content?: JSX.Element;
  label?: string;
  id?: string;
  name?: string;
  value?: string | number;
  checked?: boolean;
  disabled?: boolean;
  playing?: boolean;
  modelValue?: any;
  [key: string]: unknown;
}

export function RadioButton(rawProps: RadioButtonProps) {
  const merged = mergeProps({ id: `krds-radio-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "content",
    "label",
    "id",
    "name",
    "value",
    "checked",
    "disabled",
    "playing",
    "modelValue",
  ]);
  const [localChecked, setLocalChecked] = createSignal(false);
  const checked = () =>
    props.playing !== undefined
      ? Boolean(props.playing)
      : props.checked !== undefined
        ? Boolean(props.checked)
        : typeof props.modelValue === "boolean"
          ? props.modelValue
          : localChecked();
  const setChecked = (next: boolean) => {
    if (
      props.playing === undefined &&
      props.checked === undefined &&
      typeof props.modelValue !== "boolean"
    )
      setLocalChecked(next);
  };
  const updateChecked = (event: Event & { currentTarget: HTMLInputElement }) => {
    setChecked(event.currentTarget.checked);
    (native as Record<string, any>).onChange?.(event);
  };
  const content = () => props.children ?? props.content ?? props.label;
  const className = () => props.class ?? props.className ?? "";
  return (
    <div class={`krds-form-check${className() ? ` ${className()}` : ""}`}>
      <input
        {...(native as Record<string, any>)}
        id={props.id}
        type="radio"
        name={props.name}
        value={
          typeof props.value === "string" || typeof props.value === "number"
            ? String(props.value)
            : undefined
        }
        checked={checked()}
        disabled={props.disabled}
        onChange={updateChecked}
      />
      <label for={props.id}>{content()}</label>
    </div>
  );
}
