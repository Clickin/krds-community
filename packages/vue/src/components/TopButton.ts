import { defineComponent, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const TopButton = defineComponent({
  name: "KrdsTopButton",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<"basic" | "label">, default: "basic" },
    ariaLabel: { type: String, default: undefined },
    label: { type: String, default: undefined },
    onClick: { type: Function as PropType<() => void>, default: undefined },
  },
  emits: {
    click: (_event: MouseEvent) => true,
  },
  setup(props, { attrs, emit }) {
    return () => {
      const className = attrs.class as string | undefined;
      const children = [
        create("i", { class: ["svg-icon", "ico-go-top"] }),
        props.type === "label" ? create("span", null, props.label ?? "TOP") : null,
      ];
      return create(
        "div",
        { ...withoutNativeEvents(attrs), class: ["krds-top-button", className] },
        [
          create(
            "button",
            {
              type: "button",
              class: ["krds-btn", "medium", "icon"],
              "aria-label": props.ariaLabel ?? "맨 위로",
              onClick: (event: MouseEvent) => {
                props.onClick?.();
                emit("click", event);
              },
            },
            children,
          ),
        ],
      );
    };
  },
});
