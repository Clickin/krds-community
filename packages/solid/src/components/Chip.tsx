import { For, createSignal, mergeProps, splitProps, type JSX } from "solid-js";

export interface ChipOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ChipProps {
  class?: string;
  className?: string;
  type?: "single" | "multi";
  size?: "large" | "medium";
  options: ChipOption[];
  selected?: string | string[];
  defaultSelected?: string | string[];
  onChange?: (value: string | string[]) => void;
  ariaLabel?: string;
  [key: string]: unknown;
}

export function Chip(rawProps: ChipProps) {
  const merged = mergeProps({ type: "single" as const, size: "medium" as const }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "type",
    "size",
    "options",
    "selected",
    "defaultSelected",
    "onChange",
    "ariaLabel",
  ]);

  const [localSelected, setLocalSelected] = createSignal<string | string[] | undefined>(
    props.defaultSelected,
  );
  const selected = () =>
    props.selected !== undefined ? props.selected : localSelected();

  const isSelected = (value: string) => {
    if (props.type === "single") return selected() === value;
    const values = Array.isArray(selected()) ? (selected() as string[]) : [];
    return values.includes(value);
  };

  const select = (value: string) => {
    let next: string | string[];
    if (props.type === "single") {
      next = value;
    } else {
      const current = Array.isArray(selected()) ? (selected() as string[]) : [];
      next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
    }
    if (props.selected === undefined) setLocalSelected(next);
    props.onChange?.(next);
  };

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-chip ${props.type} ${props.size}${className() ? ` ${className()}` : ""}`}
      role={props.type === "single" ? "radiogroup" : "group"}
      aria-label={props.ariaLabel ?? "선택"}
    >
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            class={`krds-btn small text chip${isSelected(option.value) ? " active" : ""}`}
            aria-pressed={isSelected(option.value)}
            disabled={option.disabled}
            onClick={() => select(option.value)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
