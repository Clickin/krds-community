import { computed, defineComponent, ref, useId, type PropType, type VNode } from "vue";

import { selectRecipe } from "@krds-community/recipes";
import type { KrdsOption } from "@krds-community/recipes";

import { create, invokeNativeEvent } from "../shared.js";

import type { AdditionalValue, InputState as InputStateT } from "../types.js";

export const SelectSorting = defineComponent({
  name: "KrdsSelectSorting",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    label: { type: String, default: undefined },
    options: { type: Array as PropType<KrdsOption[]>, default: () => [] },
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
      default: undefined,
    },
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    state: { type: String as PropType<InputStateT>, default: "default" },
    disabled: Boolean,
    required: Boolean,
    title: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: AdditionalValue) => true,
    change: (_event: Event) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, expose, slots: _slots }) {
    const selectElement = ref<HTMLSelectElement | null>(null);
    expose({ element: selectElement });

    const generatedId = `krds-select-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const initialSelected =
      props.defaultSelected ??
      (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
      (typeof props.defaultValue === "string" ? props.defaultValue : undefined) ??
      props.options[0]?.value ??
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

    const nativeSelectValue = computed(() => {
      if (
        typeof props.modelValue === "string" ||
        typeof props.modelValue === "number" ||
        typeof props.modelValue === "boolean"
      ) {
        return String(props.modelValue);
      }
      return props.value === undefined ? selected.value : String(props.value);
    });

    const syncNativeSelectValue = (vnode: VNode) => {
      const element = vnode.el as HTMLSelectElement;
      if (element.value !== nativeSelectValue.value) {
        element.value = nativeSelectValue.value;
      }
    };

    return () => {
      const className = attrs.class as string | undefined;
      const recipe = selectRecipe({
        variant: "sorting",
        state: props.state === "error" ? "error" : "default",
      });
      const control = create(
        "select",
        {
          ...attrs,
          ref: selectElement,
          id: id.value,
          name: props.name,
          onVnodeMounted: syncNativeSelectValue,
          onVnodeUpdated: syncNativeSelectValue,
          disabled: props.disabled,
          required: props.required,
          title: props.title ?? props.label,
          "aria-label": props.title ?? props.label,
          "aria-describedby": attrs["aria-describedby"] as string | undefined,
          "aria-invalid":
            props.state === "error" ? "true" : (attrs["aria-invalid"] as string | undefined),
          class: [recipe.control, className],
          onChange: (event: Event) => {
            invokeNativeEvent(attrs.onChange, event);
            setSelected((event.target as HTMLSelectElement).value);
            emit("change", event);
          },
        },
        props.options.map((option, optionIndex) =>
          create(
            "option",
            {
              key: optionIndex,
              value: option.value,
              disabled: option.disabled,
            },
            option.label,
          ),
        ),
      );
      return control;
    };
  },
});
