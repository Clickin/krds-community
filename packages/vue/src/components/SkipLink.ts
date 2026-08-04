import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const SkipLink = defineComponent({
  name: "KrdsSkipLink",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    href: { type: String, default: "#" },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "div",
        { ...attrs, id: props.id ?? "krds-skip-link", class: className },
        create("a", { href: props.href }, slotChildren.length ? slotChildren : props.label),
      );
    };
  },
});
