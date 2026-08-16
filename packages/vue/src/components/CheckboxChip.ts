import { computed, defineComponent, ref, useId, type PropType } from "vue";

import {
  children,
  create,
  createVueInstanceId,
  invokeNativeEvent,
  withoutClass,
  withoutNativeEvents,
} from "../shared.js";

export const CheckboxChip = defineComponent({
  name: "KrdsCheckboxChip",
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
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    defaultValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    label: { type: String, default: undefined },
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean, default: undefined },
    indeterminate: { type: Boolean, default: false },
    disabled: Boolean,
    required: Boolean,
    size: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: boolean | string) => true,
    valueChange: (_value: string | number | boolean) => true,
    change: (_event: Event) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-checkbox-chip-${useId()}-${createVueInstanceId("checkbox-chip")}`;
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
        class: "checkbox",
        type: "checkbox",
        name: props.name,
        value: props.value,
        checked: isChecked,
        indeterminate: props.indeterminate,
        disabled: props.disabled,
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
          class: ["krds-form-chip", props.size, className],
        },
        [
          input,
          create(
            "label",
            {
              for: id.value,
              class: "krds-form-chip-outline",
            },
            slotChildren.length ? slotChildren : props.label,
          ),
        ],
      );
    };
  },
});
