import { computed, defineComponent, ref, useId, type PropType, type VNode } from "vue";

import { selectRecipe } from "@krds-community/recipes";
import type { KrdsOption } from "@krds-community/recipes";

import { create, invokeNativeEvent } from "../shared.js";

import type { AdditionalValue, InputState as InputStateT } from "../types.js";

export const SelectState = defineComponent({
  name: "KrdsSelectState",
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
    error: { type: String, default: undefined },
    hint: { type: String, default: undefined },
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
      const message = props.state === "error" ? (props.error ?? props.hint) : props.hint;
      const hintId = message ? `${id.value}-hint` : undefined;
      const describedBy =
        [
          typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : undefined,
          hintId,
        ]
          .filter(Boolean)
          .join(" ") || undefined;
      const recipe = selectRecipe({
        variant: "state",
        state: props.state,
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
          "aria-describedby": describedBy,
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
      return create("div", { class: "form-group" }, [
        create("div", { class: "form-tit" }, create("label", { for: id.value }, props.label)),
        create("div", { class: "form-conts" }, control),
        message
          ? create(
              "p",
              {
                id: hintId,
                class:
                  props.state === "error"
                    ? "form-hint-invalid"
                    : props.state === "success"
                      ? "form-hint-success"
                      : props.state === "information"
                        ? "form-hint-information"
                        : "form-hint",
              },
              message,
            )
          : null,
      ]);
    };
  },
});
