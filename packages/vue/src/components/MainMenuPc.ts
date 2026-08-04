import { computed, defineComponent, useId, type PropType } from "vue";

import { create, desktopMainMenu } from "../shared.js";
import type { AdditionalMenuItem } from "../types.js";

export const MainMenuPc = defineComponent({
  name: "KrdsMainMenuPc",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    items: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    sample: Boolean,
    menuLabel: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    const generatedId = `krds-main-menu-pc-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      const menuItems = props.items as AdditionalMenuItem[];
      return create(
        "nav",
        {
          ...attrs,
          id: props.id,
          class: [
            "krds-main-menu",
            props.sample && !className?.split(/\s+/).includes("sample") ? "sample" : undefined,
            className,
          ],
        },
        [create("div", { class: "inner" }, desktopMainMenu(menuItems, id.value, props.menuLabel))],
      );
    };
  },
});
