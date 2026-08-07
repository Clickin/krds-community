import { defineComponent, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const ProgressBar = defineComponent({
  name: "KrdsProgressBar",
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<"large" | "medium">, default: "medium" },
    state: { type: String as PropType<"active" | "success" | "error">, default: "active" },
    value: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-progress-bar", props.size, props.state, className],
        },
        [
          create(
            "progress",
            { class: "krds-progress", value: props.value, max: props.max },
            props.label ?? `${props.value}%`,
          ),
          props.label ? create("span", { class: "progress-label" }, props.label) : null,
        ],
      );
    };
  },
});
