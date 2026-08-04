import { defineComponent } from "vue";

import { create } from "../shared.js";

export const Identifier = defineComponent({
  name: "KrdsIdentifier",
  inheritAttrs: false,
  props: {
    organization: { type: String, default: "KRDS Community" },
    description: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create("div", { ...attrs, class: ["krds-identifier", className] }, [
        create("span", { class: "logo" }, [
          create("span", { class: "sr-only" }, props.organization),
        ]),
        create("span", { class: "ban-txt" }, props.description ?? props.organization),
      ]);
    };
  },
});
