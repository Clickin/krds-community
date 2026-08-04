import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
} from "solid-js";
import { selectRecipe } from "@krds-community/recipes";
import type { InputState, KrdsOption, SelectRecipeSize } from "@krds-community/recipes";

export interface SelectProps {
  class?: string;
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  title?: string;
  hint?: string;
  error?: string;
  state?: string;
  size?: SelectRecipeSize;
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

function SelectInner(rawProps: SelectProps, kind: string) {
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
    "hint",
    "error",
    "state",
    "size",
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
      variant: kind === "select-size" ? "size" : kind === "select-state" ? "state" : "default",
      size: props.size as SelectRecipeSize | undefined,
      state: props.state as InputState | undefined,
    }).control;
  };
  const selectMessage = () => (props.state === "error" ? (props.error ?? props.hint) : props.hint);
  const selectDescribedBy = () => {
    const descriptionId = selectMessage() ? `${props.id}-hint` : undefined;
    const consumerDescription = nativeSelectProps["aria-describedby"];
    if (typeof consumerDescription !== "string" || consumerDescription.length === 0)
      return descriptionId;
    return descriptionId ? `${consumerDescription} ${descriptionId}` : consumerDescription;
  };
  const selectHintClass = () => {
    if (props.state === "error") return "form-hint-invalid";
    if (props.state === "success") return "form-hint-success";
    if (props.state === "information") return "form-hint-information";
    return "form-hint";
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
    <div class="form-group">
      <div class="form-tit">
        <label for={props.id}>{props.label}</label>
      </div>
      <div class="form-conts">
        <select
          {...(nativeSelectProps as Record<string, any>)}
          ref={bindSelect}
          id={props.id}
          name={props.name}
          title={props.title ?? props.label}
          disabled={props.disabled}
          required={props.required}
          aria-describedby={selectDescribedBy()}
          aria-invalid={props.state === "error" ? "true" : undefined}
          class={[selectControlClass(), className()].filter(Boolean).join(" ")}
          value={props.value === undefined ? selected() : String(props.value)}
          onChange={updateSelect}
        >
          <For each={optionItems()}>
            {(option, optionIndex) => (
              <option
                value={option.value}
                disabled={option.disabled}
                ref={(element: HTMLOptionElement) => {
                  if (kind === "select-size" && optionIndex() === 0)
                    element.setAttribute("selected", "");
                }}
                selected={kind === "select-size" && optionIndex() === 0 ? true : undefined}
              >
                {option.label}
              </option>
            )}
          </For>
        </select>
      </div>
      <Show when={selectMessage()}>
        <p id={`${props.id}-hint`} class={selectHintClass()}>
          {selectMessage()}
        </p>
      </Show>
    </div>
  );
}

export function Select(rawProps: SelectProps) {
  return SelectInner(rawProps, "default");
}
export function SelectSize(rawProps: SelectProps) {
  return SelectInner(rawProps, "select-size");
}
export function SelectState(rawProps: SelectProps) {
  return SelectInner(rawProps, "select-state");
}
