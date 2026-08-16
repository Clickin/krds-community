import { defineComponent, ref, useId, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export interface FeedbackOption {
  value: string;
  label: string;
}

export const UserFeedback = defineComponent({
  name: "KrdsUserFeedback",
  inheritAttrs: false,
  props: {
    title: { type: String, default: "이 페이지에 만족하시나요?" },
    options: {
      type: Array as PropType<FeedbackOption[]>,
      default: () => [
        { value: "satisfied", label: "만족" },
        { value: "dissatisfied", label: "불만족" },
      ],
    },
    submitLabel: { type: String, default: "제출" },
    onSubmit: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  emits: {
    submit: (_value: string) => true,
  },
  setup(props, { attrs, emit }) {
    const name = `krds-user-feedback-${useId()}`;
    const selected = ref("");

    const submit = () => {
      if (!selected.value) return;
      props.onSubmit?.(selected.value);
      emit("submit", selected.value);
    };

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        { ...withoutNativeEvents(attrs), class: ["krds-user-feedback", className] },
        [
          create("fieldset", null, [
            create("legend", { class: "feedback-title" }, props.title),
            create(
              "div",
              { class: "feedback-options" },
              props.options.map((option, optionIndex) =>
                create("div", { key: optionIndex, class: "krds-form-check" }, [
                  create("input", {
                    type: "radio",
                    id: `${name}-${option.value}`,
                    name,
                    value: option.value,
                    checked: selected.value === option.value,
                    onChange: () => {
                      selected.value = option.value;
                    },
                  }),
                  create("label", { for: `${name}-${option.value}` }, option.label),
                ]),
              ),
            ),
            create(
              "button",
              {
                type: "button",
                class: ["krds-btn", "small", "primary"],
                onClick: submit,
              },
              props.submitLabel,
            ),
          ]),
        ],
      );
    };
  },
});
