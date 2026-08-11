import { computed, defineComponent, ref, useId, type PropType } from "vue";

import {
  children,
  create,
  invokeNativeEvent,
  withoutClass,
  withoutNativeEvents,
  createVueInstanceId,
} from "../shared.js";

export const RadioChip = defineComponent({
  name: "KrdsRadioChip",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
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
    defaultChecked: { type: Boolean, default: false },
    disabled: Boolean,
    required: Boolean,
    size: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: string | number | boolean) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-radio-chip-${useId()}-${createVueInstanceId("radio-chip")}`;
    const id = computed(() => props.id ?? generatedId);

    const initialSelected =
      props.defaultSelected ??
      (props.defaultChecked === true ? String(props.value ?? "on") : undefined) ??
      (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
      (typeof props.defaultValue === "string" ? props.defaultValue : undefined) ??
      "";
    const localSelected = ref(initialSelected);
    const setSelected = (next: string) => {
      if (props.selected === undefined && typeof props.modelValue !== "string") {
        localSelected.value = next;
      }
      emit("update:modelValue", next);
      emit("valueChange", next);
    };
    const selected = computed<string>({
      get: () =>
        props.selected ??
        (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
        localSelected.value,
      set: setSelected,
    });

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const choiceValue = props.value ?? "on";
      const isChecked =
        props.checked !== undefined
          ? props.checked
          : props.modelValue !== undefined
            ? props.modelValue === choiceValue
            : selected.value === String(choiceValue);
      const input = create("input", {
        ...withoutClass(attrs),
        id: id.value,
        class: "radio",
        type: "radio",
        name: props.name,
        value: props.value,
        checked: isChecked,
        disabled: props.disabled,
        required: props.required,
        onChange: (event: Event) => {
          invokeNativeEvent(attrs.onChange as unknown, event);
          if (props.modelValue === undefined) localSelected.value = String(choiceValue);
          emit("update:modelValue", choiceValue);
          emit("valueChange", choiceValue);
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
