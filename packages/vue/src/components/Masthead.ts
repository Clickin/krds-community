import { defineComponent } from "vue";

import { create } from "../shared.js";

export const Masthead = defineComponent({
  name: "KrdsMasthead",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    message: { type: String, default: "도움말" },
    description: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create("div", { ...attrs, id: props.id ?? "krds-masthead", class: className }, [
        create("div", { class: "toggle-wrap" }, [
          create("div", { class: "toggle-head" }, [
            create("div", { class: "inner" }, [
              create("span", { class: "nuri-txt" }, props.message || props.description),
            ]),
          ]),
        ]),
      ]);
    };
  },
});
