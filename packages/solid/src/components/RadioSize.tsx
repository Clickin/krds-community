import { createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface RadioSizeProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  playing?: boolean;
  modelValue?: boolean;
  size?: string;
  [key: string]: unknown;
}

export function RadioSize(rawProps: RadioSizeProps) {
  const merged = mergeProps({ id: `krds-radio-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "id",
    "name",
    "checked",
    "disabled",
    "playing",
    "modelValue",
    "size",
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
    <div class="krds-check-area">
      <div
        class={["krds-form-check", props.size ?? "medium", className()].filter(Boolean).join(" ")}
      >
        <input
          {...(native as Record<string, any>)}
          id={props.id}
          type="radio"
          name={props.name}
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label for={props.id}>{content()}</label>
      </div>
      <div class="krds-form-check large">
        <input id={`${props.id}-large`} type="radio" name={props.name} />
        <label for={`${props.id}-large`}>사이즈 : large</label>
      </div>
    </div>
  );
}
