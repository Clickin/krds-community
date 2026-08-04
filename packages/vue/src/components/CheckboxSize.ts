import { computed, defineComponent, ref, useId, type PropType } from "vue";

import {
  children,
  create,
  invokeNativeEvent,
  withoutClass,
  withoutNativeEvents,
} from "../shared.js";

export const CheckboxSize = defineComponent({
  name: "KrdsCheckboxSize",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    modelValue: {
      type: [Boolean, String, Number] as PropType<boolean | string | number | undefined>,
      default: undefined,
    },
    label: { type: String, default: undefined },
    disabled: Boolean,
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    required: Boolean,
    size: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: boolean) => true,
    valueChange: (_value: string | number | boolean) => true,
    change: (_event: Event) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-checkbox-size-${useId()}`;
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
      const slotChildren = children(slots);
      const isChecked = checked.value;
      const input = create("input", {
        ...withoutClass(attrs),
        id: id.value,
        type: "checkbox",
        name: props.name,
        value: props.value,
        checked: isChecked,
        disabled: props.disabled,
        required: props.required,
        onChange: (event: Event) => {
          invokeNativeEvent(attrs.onChange as unknown, event);
          setChecked((event.target as HTMLInputElement).checked);
          emit("change", event);
        },
      });
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-form-check", props.size, className],
        },
        [
          input,
          create("label", { for: id.value }, slotChildren.length ? slotChildren : props.label),
        ],
      );
    };
  },
});
