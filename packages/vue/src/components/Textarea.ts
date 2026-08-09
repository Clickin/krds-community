import { computed, defineComponent, Fragment, ref, useId, type PropType } from "vue";

import { create, invokeNativeEvent } from "../shared.js";

export const Textarea = defineComponent({
  name: "KrdsTextarea",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: "내용" },
    name: { type: String, default: undefined },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    defaultValue: { type: String, default: undefined },
    modelValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    placeholder: { type: String, default: "" },
    hint: { type: String, default: undefined },
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
  },
  emits: {
    "update:modelValue": (_value: string | number) => true,
    change: (_event: Event) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-textarea-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const initialValue =
      props.defaultValue ??
      props.value ??
      (typeof props.modelValue === "string" || typeof props.modelValue === "number"
        ? props.modelValue
        : "");
    const hasInitialValue =
      props.defaultValue !== undefined ||
      props.value !== undefined ||
      typeof props.modelValue === "string" ||
      typeof props.modelValue === "number";
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

    const hintId = props.hint ? `${id.value}-hint` : undefined;

    return () => {
      const className = attrs.class as string | undefined;
      return create(Fragment, null, [
        create("label", { for: id.value }, props.label),
        create("textarea", {
          ...attrs,
          id: id.value,
          name: props.name,
          value: hasInitialValue || value.value ? value.value : undefined,
          maxlength: (attrs.maxlength ?? attrs.maxLength) as number | undefined,
          placeholder: props.placeholder,
          disabled: props.disabled,
          readonly: props.readonly,
          required: props.required,
          "aria-describedby": hintId,
          onInput: (event: Event) => {
            invokeNativeEvent(attrs.onInput, event);
            setValue((event.target as HTMLTextAreaElement).value);
          },
          onChange: (event: Event) => {
            invokeNativeEvent(attrs.onChange, event);
            emit("change", event);
          },
          class: ["krds-input", className],
        }),
        props.hint ? create("p", { id: hintId }, props.hint) : null,
      ]);
    };
  },
});
