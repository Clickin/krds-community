import { createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface RadioChipProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  id?: string;
  name?: string;
  value?: string | number;
  checked?: boolean;
  disabled?: boolean;
  playing?: boolean;
  modelValue?: boolean;
  [key: string]: unknown;
}

export function RadioChip(rawProps: RadioChipProps) {
  const merged = mergeProps({ id: `krds-radio-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
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
  return (
    <div
      class={`krds-form-chip${(props.class ?? props.className ?? "") ? ` ${props.class ?? props.className ?? ""}` : ""}`}
    >
      <input
        {...(native as Record<string, any>)}
        id={props.id}
        class="radio"
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
      <label class="krds-form-chip-outline" for={props.id}>
        {props.children ?? props.label}
      </label>
    </div>
  );
}
