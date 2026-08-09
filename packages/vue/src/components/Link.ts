import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const Link = defineComponent({
  name: "KrdsLink",
  inheritAttrs: false,
  props: {
    href: { type: String, default: "#" },
    size: { type: String, default: "small" },
    label: { type: String, default: undefined },
    external: Boolean,
    title: { type: String, default: undefined },
    externalTitle: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "a",
        {
          ...attrs,
          href: props.href,
          class: ["krds-btn", "link", props.size, className],
          target: props.external ? "_blank" : (attrs.target as string | undefined),
          title: props.title,
        },
        [
          create("span", { class: "underline" }, slotChildren.length ? slotChildren : props.label),
          " ",
          create("i", {
            class: [
              "svg-icon",
              props.external || attrs.target ? "ico-go" : "ico-angle",
              !(props.external || attrs.target) ? "right" : undefined,
            ],
          }),
        ],
      );
    };
  },
});
