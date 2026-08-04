import { defineComponent, type PropType } from "vue";

import { create } from "../shared.js";
import type { KrdsNavItem } from "../types.js";

export const InPageNavigation = defineComponent({
  name: "KrdsInPageNavigation",
  inheritAttrs: false,
  props: {
    title: { type: String, default: undefined },
    pageTitle: { type: String, default: undefined },
    items: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
    actionLabel: { type: String, default: undefined },
    actionInfo: { type: String, default: undefined },
    actionCount: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      const navigationItems = props.items as any[];
      return create("div", { class: "krds-in-page-navigation-type" }, [
        create(
          "div",
          {
            ...attrs,
            class: ["krds-in-page-navigation-area", className],
          },
          [
            create("div", { class: "in-page-navigation-header" }, [
              create("p", { class: "quick-caption" }, props.title),
              props.pageTitle ? create("p", { class: "quick-title" }, props.pageTitle) : null,
            ]),
            create("nav", { class: "in-page-navigation-list", "aria-label": props.title }, [
              create(
                "ul",
                navigationItems.map((item: any) =>
                  create("li", { key: item.id ?? item.label }, [
                    create(
                      "a",
                      {
                        href: item.href,
                        class: item.current ? "active" : undefined,
                      },
                      item.label,
                    ),
                  ]),
                ),
              ),
            ]),
            create("div", { class: "in-page-navigation-action" }, [
              create(
                "button",
                { type: "button", class: ["krds-btn", "medium"] },
                props.actionLabel,
              ),
              props.actionInfo || props.actionCount
                ? create("p", { class: "quick-info" }, [
                    props.actionInfo,
                    props.actionInfo && props.actionCount ? " " : null,
                    props.actionCount ? create("strong", props.actionCount) : null,
                  ])
                : null,
            ]),
          ],
        ),
      ]);
    };
  },
});
