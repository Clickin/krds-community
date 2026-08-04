import { computed, defineComponent, ref, useId, type PropType } from "vue";

import type { KrdsOption } from "@krds-community/recipes";
import { create, withoutClass, withoutNativeEvents } from "../shared.js";

import type { AdditionalValue } from "../types.js";

export const Resize = defineComponent({
  name: "KrdsResize",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    options: { type: Array as PropType<KrdsOption[]>, default: () => [] },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    selected: { type: String, default: undefined },
    selectedLabel: { type: String, default: undefined },
    resetLabel: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  emits: {
    "update:modelValue": (_value: AdditionalValue) => true,
    valueChange: (_value: string | number | boolean) => true,
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-resize-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const localOpen = ref(props.defaultOpen);
    const setOpen = (next: boolean) => {
      if (props.open === undefined) localOpen.value = next;
      emit("openChange", next);
    };
    const open = computed<boolean>({
      get: () => props.open ?? localOpen.value,
      set: setOpen,
    });

    const initialValue =
      props.defaultValue ??
      props.value ??
      (typeof props.modelValue === "string" || typeof props.modelValue === "number"
        ? props.modelValue
        : "");
    const localValue = ref(String(initialValue));
    const value = computed(() => {
      if (props.value !== undefined) return String(props.value);
      if (typeof props.modelValue === "string" || typeof props.modelValue === "number") {
        return String(props.modelValue);
      }
      return localValue.value;
    });
    const setValue = (next: string) => {
      if (
        props.value === undefined &&
        typeof props.modelValue !== "string" &&
        typeof props.modelValue !== "number"
      ) {
        localValue.value = next;
      }
      emit("update:modelValue", next);
      emit("valueChange", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-resize", "krds-drop-wrap", className],
          "data-adjust": "scale",
        },
        [
          create(
            "button",
            {
              ...withoutClass(attrs),
              type: "button",
              class: ["krds-btn", "small", "text", "drop-btn"],
              "aria-expanded": open.value,
              "aria-controls": `${id.value}-drop-menu`,
              onClick: () => setOpen(!open.value),
            },
            [props.label, " ", create("i", { class: ["svg-icon", "ico-toggle"] })],
          ),
          create("div", { id: `${id.value}-drop-menu`, class: "drop-menu" }, [
            create("div", { class: "drop-in" }, [
              create(
                "ul",
                { class: "drop-list" },
                props.options.map((option: KrdsOption & { value?: string; label?: string }) =>
                  create("li", { key: option.value }, [
                    create(
                      "button",
                      {
                        type: "button",
                        class: [
                          "item-link",
                          option.value,
                          value.value === option.value ? "active" : undefined,
                        ],
                        "data-adjust-scale": option.value,
                        onClick: () => setValue(option.value ?? ""),
                      },
                      [
                        option.label,
                        create(
                          "span",
                          { class: "sr-only" },
                          value.value === option.value ? props.selectedLabel : "",
                        ),
                      ],
                    ),
                  ]),
                ),
              ),
              create("div", { class: "drop-bottom" }, [
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "medium", "text"],
                    "data-adjust-scale": props.defaultValue ?? "",
                    onClick: () => setValue(String(props.defaultValue ?? "")),
                  },
                  [create("i", { class: ["svg-icon", "ico-reset"] }), " ", props.resetLabel],
                ),
              ]),
            ]),
          ]),
        ],
      );
    };
  },
});
