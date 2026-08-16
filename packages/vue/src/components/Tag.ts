import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const Tag = defineComponent({
  name: "KrdsTag",
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    removable: { type: Boolean, default: true },
    message: { type: String, default: "삭제" },
    size: { type: String, default: undefined },
  },
  emits: {
    close: () => true,
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const tag = create("span", { ...attrs, class: ["krds-btn-tag", className] }, [
        slotChildren.length ? slotChildren : props.label,
        props.removable
          ? create(
              "button",
              {
                type: "button",
                class: "btn-delete",
                onClick: () => emit("close"),
              },
              create("span", { class: "sr-only" }, props.message),
            )
          : null,
      ]);
      return create("div", { class: ["krds-tag-wrap", props.size ?? "large"] }, tag);
    };
  },
});
