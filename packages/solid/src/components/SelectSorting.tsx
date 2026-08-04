import { For, createEffect, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";
import { selectRecipe } from "@krds-community/recipes";
import type { KrdsOption } from "@krds-community/recipes";

export interface SelectSortingProps {
  class?: string;
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  title?: string;
  state?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  modelValue?: string;
  selected?: string;
  defaultValue?: string;
  options?: KrdsOption[];
  languages?: KrdsOption[];
  [key: string]: unknown;
}

export function SelectSorting(rawProps: SelectSortingProps) {
  const merged = mergeProps(
    { options: [] as KrdsOption[], id: `krds-select-${createUniqueId()}` },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "name",
    "label",
    "title",
    "state",
    "disabled",
    "required",
    "value",
    "modelValue",
    "selected",
    "defaultValue",
    "options",
    "languages",
  ]);
  const [refProps, nativeSelectProps] = splitProps(native, ["ref"]);
  const [localSelected, setLocalSelected] = createSignal<string>();
  const selected = () => {
    const mv = props.modelValue;
    if (typeof mv === "string" || typeof mv === "number") return String(mv);
    return props.selected ?? localSelected() ?? props.defaultValue ?? "";
  };
  const setSelected = (next: string) => {
    if (props.modelValue === undefined) setLocalSelected(next);
  };
  const className = () => props.class ?? props.className ?? "";
  const selectControlClass = () => {
    return selectRecipe({
      variant: "sorting",
      state: props.state === "error" ? "error" : "default",
    }).control;
  };
  const bindSelect = (element: HTMLSelectElement) => {
    const callerRef = refProps.ref;
    if (typeof callerRef === "function") callerRef(element);
    createEffect(() => {
      const controlledValue = props.value;
      element.value = controlledValue === undefined ? selected() : String(controlledValue);
    });
  };
  const updateSelect = (event: Event & { currentTarget: HTMLSelectElement }) => {
    if (props.value === undefined) setSelected(event.currentTarget.value);
    (native as Record<string, any>).onChange?.(event);
  };
  const optionItems = () => props.languages ?? props.options ?? [];
  return (
    <select
      {...(nativeSelectProps as Record<string, any>)}
      ref={bindSelect}
      id={props.id}
      name={props.name}
      title={props.title ?? props.label}
      aria-label={props.label ?? props.title ?? "선택"}
      disabled={props.disabled}
      required={props.required}
      aria-invalid={props.state === "error" ? "true" : undefined}
      class={[selectControlClass(), className()].filter(Boolean).join(" ")}
      value={props.value === undefined ? selected() : String(props.value)}
      onChange={updateSelect}
    >
      <For each={optionItems()}>
        {(option) => (
          <option value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        )}
      </For>
    </select>
  );
}
