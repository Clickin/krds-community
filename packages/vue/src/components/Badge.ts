import { defineComponent, type PropType } from "vue";

import type { KrdsTone } from "@krds-community/recipes";
import { children, create, tones } from "../shared.js";

export const Badge = defineComponent({
  name: "KrdsBadge",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    tone: { type: String as PropType<KrdsTone>, default: "primary" },
    appearance: { type: String, default: "outline" },
    size: { type: String, default: undefined },
    number: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "span",
        {
          ...attrs,
          class: [
            "krds-badge",
            props.appearance === "outline"
              ? `outline-${tones[props.tone]}`
              : props.appearance === "light"
                ? `bg-light-${tones[props.tone]}`
                : `bg-${tones[props.tone]}`,
            props.number ? "number" : "",
            props.size,
            className,
          ],
        },
        slotChildren.length ? slotChildren : props.label,
      );
    };
  },
});

export const BadgeNumber = defineComponent({
  name: "KrdsBadgeNumber",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    tone: { type: String as PropType<KrdsTone>, default: "primary" },
    appearance: { type: String, default: "outline" },
    size: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "span",
        {
          ...attrs,
          class: [
            "krds-badge",
            props.appearance === "outline"
              ? `outline-${tones[props.tone]}`
              : props.appearance === "light"
                ? `bg-light-${tones[props.tone]}`
                : `bg-${tones[props.tone]}`,
            "number",
            props.size,
            className,
          ],
        },
        slotChildren.length ? slotChildren : props.label,
      );
    };
  },
});

export const BadgeSize = Badge;
