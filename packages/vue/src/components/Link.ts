import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const Link = defineComponent({
  name: "KrdsLink",
  inheritAttrs: false,
  props: {
    href: { type: String, default: "#" },
    size: { type: String, default: undefined },
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
          props.external || attrs.target ? " " : null,
          props.external || attrs.target ? create("i", { class: ["svg-icon", "ico-go"] }) : null,
        ],
      );
    };
  },
});
