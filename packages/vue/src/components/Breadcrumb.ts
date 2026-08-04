import { computed, defineComponent, useId, type PropType } from "vue";

import type { KrdsNavItem } from "@krds-community/recipes";
import { create, itemLabel } from "../shared.js";

import type { AnyItem } from "../types.js";

export const Breadcrumb = defineComponent({
  name: "KrdsBreadcrumb",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    items: { type: Array as PropType<AnyItem[]>, default: () => [] },
  },
  setup(props, { attrs, slots: _slots }) {
    const generatedId = `krds-breadcrumb-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "nav",
        {
          ...attrs,
          id: id.value,
          class: ["krds-breadcrumb-wrap", className],
          "aria-label": props.label ?? "현재 경로",
        },
        create(
          "ol",
          { class: "breadcrumb" },
          props.items.map((item, itemIndex) =>
            create(
              "li",
              { key: itemIndex, class: itemIndex === 0 ? "home" : undefined },
              create(
                "a",
                {
                  class: "txt",
                  href: (item as KrdsNavItem).href ?? "#",
                },
                itemLabel(item),
              ),
            ),
          ),
        ),
      );
    };
  },
});
