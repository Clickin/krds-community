import { defineComponent, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const Infobox = defineComponent({
  name: "KrdsInfobox",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<"primary" | "secondary">, default: "primary" },
    size: { type: String as PropType<"default" | "slim">, default: "default" },
    message: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      const ariaLabel =
        typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : "알림";
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-infobox", props.type, props.size, className],
          role: "region",
          "aria-label": ariaLabel,
        },
        [create("p", { class: "infobox-text" }, props.message)],
      );
    };
  },
});
