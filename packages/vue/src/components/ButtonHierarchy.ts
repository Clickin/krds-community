import { defineComponent, type PropType } from "vue";

import type { KrdsTone } from "@krds-community/recipes";
import { children, create } from "../shared.js";

export const ButtonHierarchy = defineComponent({
  name: "KrdsButtonHierarchy",
  inheritAttrs: false,
  props: {
    type: { type: String, default: undefined },
    disabled: Boolean,
    variant: { type: String, default: undefined },
    tone: { type: String as PropType<KrdsTone>, default: "primary" },
    size: { type: String, default: undefined },
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
          disabled: props.disabled,
          class: ["krds-btn", props.variant ?? props.tone, props.size, className],
        },
        slotChildren.length ? slotChildren : (props.label ?? props.text),
      );
    };
  },
});

export const ButtonSize = defineComponent({
  name: "KrdsButtonSize",
  inheritAttrs: false,
  props: {
    type: { type: String, default: undefined },
    disabled: Boolean,
    size: { type: String, default: undefined },
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
          disabled: props.disabled,
          class: ["krds-btn", props.size, className],
        },
        slotChildren.length ? slotChildren : (props.label ?? props.text),
      );
    };
  },
});
