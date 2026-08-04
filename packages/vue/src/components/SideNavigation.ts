import { computed, defineComponent, useId, type PropType } from "vue";

import { create, sideNavigationList } from "../shared.js";

import type { KrdsNavItem } from "../types.js";

export const SideNavigation = defineComponent({
  name: "KrdsSideNavigation",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    title: { type: String, default: undefined },
    label: { type: String, default: undefined },
    items: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
    links: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
  },
  setup(props, { attrs }) {
    const generatedId = `krds-side-navigation-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      const navigationItems = (props.items.length ? props.items : props.links) as any[];
      return create(
        "nav",
        {
          ...attrs,
          class: ["krds-side-navigation", className],
        },
        [
          create("h2", { class: "lnb-tit" }, props.title ?? props.label),
          sideNavigationList(navigationItems, id.value),
        ],
      );
    };
  },
});
