import { defineComponent, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

const ALERT_ICONS = {
  danger: "ico-error-fill",
  warning: "ico-error-fill",
  success: "ico-success-fill",
  information: "ico-information-fill",
} as const;

export const Alert = defineComponent({
  name: "KrdsAlert",
  inheritAttrs: false,
  props: {
    state: {
      type: String as PropType<"danger" | "warning" | "success" | "information">,
      default: "danger",
    },
    size: { type: String as PropType<"with-title" | "slim">, default: "slim" },
    title: { type: String, default: undefined },
    message: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-alert", props.state, props.size, className],
          role: "status",
        },
        [
          create("i", {
            class: ["svg-icon", "alert-icon", ALERT_ICONS[props.state]],
            "aria-hidden": "true",
          }),
          props.title ? create("strong", { class: "alert-title" }, props.title) : null,
          create("p", { class: "alert-body" }, props.message),
        ],
      );
    };
  },
});
