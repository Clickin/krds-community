import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { create, withoutClass, withoutNativeEvents, invokeNativeEvent } from "../shared.js";

export const ToggleSwitchSize = defineComponent({
  name: "KrdsToggleSwitchSize",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    modelValue: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    disabled: Boolean,
    required: Boolean,
    label: { type: String, default: undefined },
    size: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: boolean) => true,
    change: (_event: Event) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-toggle-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const initialChecked =
      props.defaultChecked ??
      props.checked ??
      (typeof props.modelValue === "boolean" ? props.modelValue : false);
    const localChecked = ref(initialChecked);
    const checked = computed(() => {
      if (props.checked !== undefined) return props.checked;
      if (typeof props.modelValue === "boolean") return props.modelValue;
      return localChecked.value;
    });
    const setChecked = (next: boolean) => {
      if (props.checked === undefined && typeof props.modelValue !== "boolean") {
        localChecked.value = next;
      }
      emit("update:modelValue", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-form-toggle-switch", props.size, className],
        },
        [
          create("input", {
            ...withoutClass(attrs),
            id: id.value,
            name: props.name,
            type: "checkbox",
            checked: checked.value,
            disabled: props.disabled,
            required: props.required,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              setChecked((event.target as HTMLInputElement).checked);
              emit("change", event);
            },
          }),
          create("label", { for: id.value }, [
            create("span", { class: "switch-toggle" }, create("i")),
            props.label,
          ]),
        ],
      );
    };
  },
});
