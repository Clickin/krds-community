import { defineComponent, type PropType } from "vue";
import { textList } from "../shared.js";
import type { AnyItem } from "../types.js";

export const TextList = defineComponent({
  name: "KrdsTextList",
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<AnyItem[]>, default: () => [] },
    ordered: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return textList(props.items, false, 1, {
        ...attrs,
        class: className,
      });
    };
  },
});
