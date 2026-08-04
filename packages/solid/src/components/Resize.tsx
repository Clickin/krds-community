import { For, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";
import type { KrdsOption } from "@krds-community/recipes";

export interface ResizeProps {
  class?: string;
  className?: string;
  label?: string;
  open?: boolean;
  selected?: string;
  selectedLabel?: string;
  defaultValue?: string;
  resetLabel?: string;
  value?: string;
  modelValue?: string;
  options?: KrdsOption[];
  languages?: KrdsOption[];
  [key: string]: unknown;
}

export function Resize(rawProps: ResizeProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "label",
    "open",
    "selected",
    "selectedLabel",
    "defaultValue",
    "resetLabel",
    "value",
    "modelValue",
    "options",
    "languages",
  ]);
  const [localOpen, setLocalOpen] = createSignal(false);
  const open = () => (props.open !== undefined ? Boolean(props.open) : localOpen());
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
  };
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
  const optionItems = () => props.languages ?? props.options ?? [];
  const dropMenuId = `krds-resize-drop-${createUniqueId()}`;
  return (
    <div
      {...(native as Record<string, any>)}
      class={["krds-drop-wrap", "krds-resize", className()].filter(Boolean).join(" ")}
      data-adjust="scale"
    >
      <button
        type="button"
        class="krds-btn small text drop-btn"
        aria-expanded={open()}
        aria-controls={dropMenuId}
        onClick={() => setOpen(!open())}
      >
        {props.label} <i class="svg-icon ico-toggle" />
      </button>
      <div class="drop-menu" id={dropMenuId} style={{ display: open() ? "block" : undefined }}>
        <div class="drop-in">
          <ul class="drop-list">
            <For each={optionItems()}>
              {(option) => (
                <li>
                  <button
                    type="button"
                    class={`item-link ${option.value}`}
                    classList={{ active: selected() === option.value }}
                    data-adjust-scale={option.value}
                    onClick={(event) => {
                      setSelected(option.value);
                      (native as Record<string, any>).onChange?.(event);
                    }}
                  >
                    {option.label}
                    <span class="sr-only">
                      {selected() === option.value ? props.selectedLabel : undefined}
                    </span>
                  </button>
                </li>
              )}
            </For>
          </ul>
          <div class="drop-bottom">
            <button
              type="button"
              class="krds-btn medium text"
              data-adjust-scale={props.defaultValue}
              onClick={() => setSelected(props.defaultValue ?? "")}
            >
              <i class="svg-icon ico-reset" /> {props.resetLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
