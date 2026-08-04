import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const ButtonText = defineComponent({
  name: "KrdsButtonText",
  inheritAttrs: false,
  props: {
    type: { type: String, default: undefined },
    label: { type: String, default: undefined },
    text: { type: String, default: "레이블" },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "button",
        {
          ...attrs,
          type: props.type ?? "button",
          class: ["krds-btn", "text", className],
        },
        [slotChildren.length ? slotChildren : (props.label ?? props.text)],
      );
    };
  },
});

export const ButtonWithIcon = defineComponent({
  name: "KrdsButtonWithIcon",
  inheritAttrs: false,
  props: {
    type: { type: String, default: undefined },
    label: { type: String, default: undefined },
    text: { type: String, default: "레이블" },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "button",
        {
          ...attrs,
          type: props.type ?? "button",
          class: ["krds-btn", className],
        },
        [
          slotChildren.length ? slotChildren : (props.label ?? props.text),
          create("i", { class: ["svg-icon", "ico-sch"] }),
        ],
      );
    };
  },
});
