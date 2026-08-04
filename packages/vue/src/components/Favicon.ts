import { defineComponent } from "vue";

import { create } from "../shared.js";

export const Favicon = defineComponent({
  name: "KrdsFavicon",
  inheritAttrs: false,
  props: {
    href: { type: String, default: "#" },
    sizes: { type: String, default: undefined },
    size: { type: String, default: undefined },
    type: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      return create("link", {
        ...attrs,
        rel: "icon",
        href: props.href,
        sizes: props.sizes ?? props.size ?? "32x32",
        type: props.type ?? "image/png",
      });
    };
  },
});
