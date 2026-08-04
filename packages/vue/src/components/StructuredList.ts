import { defineComponent, type PropType } from "vue";

import { create } from "../shared.js";

import type { AdditionalStructuredListItem } from "../types.js";

export const StructuredList = defineComponent({
  name: "KrdsStructuredList",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    items: { type: Array as PropType<AdditionalStructuredListItem[]>, default: () => [] },
    tags: { type: Array as PropType<string[]>, default: () => [] },
    dateLabel: { type: String, default: undefined },
    dateValue: { type: String, default: undefined },
    actionLabel: { type: String, default: undefined },
    shareLabel: { type: String, default: undefined },
    favoriteLabel: { type: String, default: undefined },
  },
  setup(props, { attrs, slots: _slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "ul",
        { ...attrs, class: ["krds-structured-list", "type-full", className] },
        props.items.map((item, itemIndex) => {
          const listItem = item as AdditionalStructuredListItem;
          return create("li", { key: listItem.id ?? itemIndex, class: "structured-item" }, [
            create("div", { class: "in" }, [
              listItem.badge
                ? create("div", { class: "card-top" }, [
                    create(
                      "span",
                      { class: ["krds-badge", listItem.badgeClass ?? listItem.tone] },
                      listItem.badge,
                    ),
                  ])
                : null,
              create("div", { class: "card-body" }, [
                create("a", { class: "c-text", href: listItem.href }, [
                  create("p", { class: "c-tit" }, [
                    create("span", { class: "span" }, listItem.title),
                  ]),
                  listItem.description
                    ? create("p", { class: "c-txt" }, listItem.description)
                    : null,
                  listItem.date || listItem.dateLabel || props.dateValue || props.dateLabel
                    ? create("p", { class: "c-date" }, [
                        create("strong", { class: "key" }, listItem.dateLabel ?? props.dateLabel),
                        create("span", { class: "value" }, listItem.date ?? props.dateValue),
                      ])
                    : null,
                ]),
                listItem.actionLabel || props.actionLabel
                  ? create("div", { class: "c-btn" }, [
                      create(
                        "a",
                        {
                          class: ["krds-btn", "secondary"],
                          href: listItem.href,
                          title: listItem.title,
                        },
                        listItem.actionLabel ?? props.actionLabel,
                      ),
                    ])
                  : null,
              ]),
              (listItem.tags?.length ?? props.tags.length) > 0
                ? create(
                    "div",
                    { class: "card-btm" },
                    (listItem.tags?.length ? listItem.tags : props.tags).map((tag) =>
                      create("span", { class: "tag" }, tag),
                    ),
                  )
                : null,
              create("div", { class: "card-btn" }, [
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "medium", "text"],
                    title: listItem.title,
                  },
                  [create("i", { class: ["svg-icon", "ico-share"] }), " " + props.shareLabel],
                ),
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "medium", "text"],
                    title: listItem.title,
                  },
                  [create("i", { class: ["svg-icon", "ico-like"] }), " " + props.favoriteLabel],
                ),
              ]),
            ]),
          ]);
        }),
      );
    };
  },
});
