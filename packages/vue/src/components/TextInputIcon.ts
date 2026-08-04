import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { create, invokeNativeEvent } from "../shared.js";

export const TextInputIcon = defineComponent({
  name: "KrdsTextInputIcon",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    name: { type: String, default: undefined },
    type: { type: String, default: undefined },
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
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
    actionLabel: { type: String, default: undefined },
    passwordLabel: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: string | number) => true,
    change: (_event: Event) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-textinputicon-${useId()}`;
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

    return () => {
      const className = attrs.class as string | undefined;
      const passwordHidden = (props.type ?? "text") === "password";
      return create("div", { class: "form-group" }, [
        props.label
          ? create("div", { class: "form-tit" }, create("label", { for: id.value }, props.label))
          : null,
        create("div", { class: ["form-conts", "btn-ico-wrap"] }, [
          create("input", {
            ...attrs,
            id: id.value,
            name: props.name,
            type: props.type ?? "text",
            value: hasInitialValue || value.value ? value.value : undefined,
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: props.readonly,
            required: props.required,
            class: ["krds-input", className],
            onInput: (event: Event) => {
              invokeNativeEvent(attrs.onInput, event);
              setValue((event.target as HTMLInputElement).value);
            },
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              emit("change", event);
            },
          }),
          create("button", { type: "button", class: ["krds-btn", "medium", "icon"] }, [
            create(
              "span",
              { class: "sr-only" },
              props.actionLabel ??
                (passwordHidden ? "입력한 비밀번호 보기" : "입력한 비밀번호 가리기"),
            ),
            create("i", {
              class: ["svg-icon", passwordHidden ? "ico-pw-visible" : "ico-pw-visible-on"],
            }),
          ]),
        ]),
      ]);
    };
  },
});
