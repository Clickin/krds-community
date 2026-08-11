import { computed, defineComponent, ref, useId, type PropType } from "vue";

import {
  children,
  create,
  withoutClass,
  withoutNativeEvents,
  invokeNativeEvent,
  createVueInstanceId,
} from "../shared.js";
import type { AdditionalValue } from "../types.js";

export const RadioButton = defineComponent({
  name: "KrdsRadioButton",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    value: { type: String, default: undefined },
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    defaultValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    label: { type: String, default: undefined },
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    disabled: Boolean,
    required: Boolean,
  },
  emits: {
    "update:modelValue": (_value: AdditionalValue) => true,
    change: (_event: Event) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-radio-${useId()}-${createVueInstanceId("radio")}`;
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
      const radioValue = props.value ?? "on";
      const input = create("input", {
        ...withoutClass(attrs),
        id: id.value,
        type: "radio",
        name: props.name,
        value: props.value,
        checked:
          props.checked !== undefined
            ? props.checked
            : props.modelValue !== undefined
              ? props.modelValue === radioValue
              : selected.value === String(radioValue),
        disabled: props.disabled,
        required: props.required,
        onChange: (event: Event) => {
          invokeNativeEvent(attrs.onChange, event);
          if (props.modelValue === undefined) localSelected.value = String(radioValue);
          emit("update:modelValue", radioValue);
          emit("change", event);
        },
      });
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-form-check", className],
        },
        [
          input,
          create("label", { for: id.value }, slotChildren.length ? slotChildren : props.label),
        ],
      );
    };
  },
});
