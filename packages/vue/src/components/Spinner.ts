import { computed, defineComponent, useId } from "vue";

import { create } from "../shared.js";

export const Spinner = defineComponent({
  name: "KrdsSpinner",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    placeholder: { type: String, default: "" },
    label: { type: String, default: "처리 중" },
    inputLabel: { type: String, default: "Label" },
  },
  setup(props, { attrs, slots: _slots }) {
    const generatedId = `krds-spinner-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      return create("div", { class: "form-group" }, [
        create("div", { class: "form-tit" }, [
          create("label", { for: `${id.value}-input` }, props.inputLabel),
        ]),
        create("div", { class: "form-conts" }, [
          create("div", { class: "form-spinner" }, [
            create("input", {
              id: `${id.value}-input`,
              type: "text",
              class: "krds-input",
              placeholder: props.placeholder || "placeholder",
              "aria-label": props.inputLabel ?? props.label ?? props.placeholder,
            }),
            create(
              "div",
              { ...attrs, class: ["krds-spinner", className], role: "status" },
              create("span", { class: "sr-only" }, props.label),
            ),
          ]),
        ]),
      ]);
    };
  },
});
