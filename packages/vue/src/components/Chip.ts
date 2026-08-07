import { computed, defineComponent, ref, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export interface ChipOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const Chip = defineComponent({
  name: "KrdsChip",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<"single" | "multi">, default: "single" },
    size: { type: String as PropType<"large" | "medium">, default: "medium" },
    options: { type: Array as PropType<ChipOption[]>, default: () => [] },
    selected: {
      type: [String, Array] as PropType<string | string[] | undefined>,
      default: undefined,
    },
    defaultSelected: {
      type: [String, Array] as PropType<string | string[] | undefined>,
      default: undefined,
    },
    ariaLabel: { type: String, default: undefined },
    onChange: {
      type: Function as PropType<(value: string | string[]) => void>,
      default: undefined,
    },
  },
  emits: {
    change: (_value: string | string[]) => true,
  },
  setup(props, { attrs, emit }) {
    const localSelected = ref<string | string[]>(
      props.defaultSelected ?? (props.type === "multi" ? [] : ""),
    );
    const selected = computed<string | string[]>(() => props.selected ?? localSelected.value);

    const isSelected = (value: string) => {
      const current = selected.value;
      return Array.isArray(current) ? current.includes(value) : current === value;
    };

    const toggle = (value: string) => {
      let next: string | string[];
      if (props.type === "multi") {
        const current = Array.isArray(selected.value) ? selected.value : [];
        next = current.includes(value)
          ? current.filter((candidate) => candidate !== value)
          : [...current, value];
      } else {
        next = value;
      }
      if (props.selected === undefined) localSelected.value = next;
      props.onChange?.(next);
      emit("change", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      const label =
        props.ariaLabel ??
        (typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined) ??
        "선택";
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-chip", props.type, props.size, className],
          role: props.type === "single" ? "radiogroup" : "group",
          "aria-label": label,
        },
        props.options.map((option, optionIndex) =>
          create(
            "button",
            {
              key: optionIndex,
              type: "button",
              class: [
                "krds-btn",
                "small",
                "text",
                "chip",
                isSelected(option.value) ? "active" : undefined,
              ],
              "aria-pressed": isSelected(option.value) ? "true" : "false",
              disabled: option.disabled,
              onClick: () => toggle(option.value),
            },
            option.label,
          ),
        ),
      );
    };
  },
});
