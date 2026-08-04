import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const TagLink = defineComponent({
  name: "KrdsTagLink",
  inheritAttrs: false,
  props: {
    href: { type: String, default: "#" },
    size: { type: String, default: undefined },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const tag = create(
        "a",
        { ...attrs, href: props.href, class: ["krds-btn-tag", "link", className] },
        slotChildren.length ? slotChildren : props.label,
      );
      return create("div", { class: ["krds-tag-wrap", props.size ?? "large"] }, tag);
    };
  },
});
