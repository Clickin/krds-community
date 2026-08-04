import { defineComponent } from "vue";

import { create } from "../shared.js";

export const ButtonIcon = defineComponent({
  name: "KrdsButtonIcon",
  inheritAttrs: false,
  props: {
    type: { type: String, default: undefined },
    size: { type: String, default: undefined },
    label: { type: String, default: undefined },
    text: { type: String, default: "레이블" },
  },
  setup(props, { attrs, slots: _slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "button",
        {
          ...attrs,
          type: props.type ?? "button",
          class: ["krds-btn", "icon", props.size, className],
        },
        [
          create("span", { class: "sr-only" }, props.label ?? props.text),
          create("i", { class: ["svg-icon", "ico-sch"] }),
        ],
      );
    };
  },
});
