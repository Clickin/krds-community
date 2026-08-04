import { createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface CheckboxSizeProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  id?: string;
  name?: string;
  size?: string;
  checked?: boolean;
  disabled?: boolean;
  playing?: boolean;
  modelValue?: boolean;
  [key: string]: unknown;
}

export function CheckboxSize(rawProps: CheckboxSizeProps) {
  const merged = mergeProps({ id: `krds-checkbox-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "id",
    "name",
    "size",
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
  const content = () => props.children ?? props.label;
  const className = () => props.class ?? props.className ?? "";
  return (
    <div class={["krds-form-check", props.size, className()].filter(Boolean).join(" ")}>
      <input
        {...(native as Record<string, any>)}
        id={props.id}
        type="checkbox"
        name={props.name}
        checked={checked()}
        disabled={props.disabled}
        onChange={updateChecked}
      />
      <label for={props.id}>{content()}</label>
    </div>
  );
}
