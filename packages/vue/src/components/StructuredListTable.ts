import { computed, defineComponent, useId, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

import type {
  AdditionalAction,
  AdditionalPagination,
  AdditionalTableColumn,
  AdditionalTableRow,
} from "../types.js";

export const StructuredListTable = defineComponent({
  name: "KrdsStructuredListTable",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    caption: { type: String, default: undefined },
    title: { type: String, default: undefined },
    columns: { type: Array as PropType<AdditionalTableColumn[]>, default: () => [] },
    rows: { type: Array as PropType<AdditionalTableRow[]>, default: () => [] },
    selectAllLabel: { type: String, default: undefined },
    actions: { type: Array as PropType<AdditionalAction[]>, default: () => [] },
    countLabel: { type: String, default: undefined },
    countOptions: { type: Array as PropType<string[]>, default: () => [] },
    sortLabel: { type: String, default: undefined },
    sortOptions: { type: Array as PropType<string[]>, default: () => [] },
    sortValue: { type: String, default: undefined },
    pagination: { type: Object as PropType<AdditionalPagination | undefined>, default: undefined },
  },
  setup(props, { attrs, slots: _slots }) {
    const generatedId = `krds-structured-list-table-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    return () => {
      const className = (attrs.class as string | undefined) ?? "sample";
      const selectionId = `${id.value}-all`;
      const countId = `${id.value}-count`;
      const sortId = `${id.value}-sort`;
      const pagination = props.pagination;
      return create(
        "div",
        { ...withoutNativeEvents(attrs), class: ["krds-structured-list-table", className] },
        [
          create("div", { class: "search-list-top" }, [
            create("div", { class: "sch-left" }, [
              create("div", { class: "krds-check-area" }, [
                create("div", { class: "krds-form-check" }, [
                  create("input", {
                    id: selectionId,
                    class: "chk",
                    type: "checkbox",
                    // Name comes from the visible <label for>, not aria-label:
                    // the control-labels errata omits checkbox aria-labels, so
                    // an aria-label here would strip the select-all's name.
                  }),
                  create("label", { for: selectionId }, props.selectAllLabel),
                ]),
              ]),
              create(
                "ul",
                { class: "side-line-ul" },
                props.actions.map((action) =>
                  create("li", { key: action.id ?? action.label }, [
                    create("button", { type: "button", class: ["krds-btn", "medium", "text"] }, [
                      create("i", { class: ["svg-icon", `ico-${action.icon ?? "down"}`] }),
                      " ",
                      action.label,
                    ]),
                  ]),
                ),
              ),
            ]),
            create("ul", { class: "sch-sort" }, [
              create("li", [
                create("strong", { class: "sort-label" }, [
                  create("label", { for: countId }, props.countLabel),
                ]),
                " ",
                create(
                  "select",
                  {
                    id: countId,
                    class: "krds-form-select-sort",
                    "aria-label": props.countLabel ?? "표시 개수",
                  },
                  props.countOptions.map((option) => create("option", {}, option)),
                ),
              ]),
              create("li", [
                create("strong", { class: "sort-label" }, [
                  create("label", { for: sortId }, props.sortLabel),
                ]),
                create(
                  "div",
                  { class: "w-sort-btn" },
                  props.sortOptions.flatMap((option) => [
                    create(
                      "button",
                      {
                        type: "button",
                        class: option === props.sortValue ? "active" : undefined,
                      },
                      option,
                    ),
                    " ",
                  ]),
                ),
                create(
                  "div",
                  { class: "m-sort-btn" },
                  create(
                    "select",
                    {
                      id: sortId,
                      class: "krds-form-select-sort",
                      "aria-label": props.sortLabel ?? "정렬",
                    },
                    props.sortOptions.map((option) => create("option", {}, option)),
                  ),
                ),
              ]),
            ]),
          ]),
          create(
            "div",
            { class: "krds-table-wrap" },
            create("table", { class: ["tbl", "col", "data"] }, [
              create("caption", props.caption ?? props.title),
              create("colgroup", [
                ...props.columns.map((column, columnIndex) =>
                  create("col", {
                    key: column.key ?? columnIndex,
                    style: column.width ? `width: ${column.width};` : undefined,
                  }),
                ),
                create("col"),
              ]),
              create(
                "thead",
                create(
                  "tr",
                  props.columns.length
                    ? props.columns.map((column) =>
                        create("th", { key: column.key, scope: "col" }, [
                          column.visuallyHidden
                            ? create("span", { class: "sr-only" }, column.label)
                            : column.label,
                        ]),
                      )
                    : create(
                        "th",
                        { scope: "col" },
                        create("span", { class: "sr-only" }, props.caption ?? props.title ?? "표"),
                      ),
                ),
              ),
              create(
                "tbody",
                props.rows.map((row, rowIndex) =>
                  create(
                    "tr",
                    { key: String(row.id ?? rowIndex) },
                    props.columns.map((column, columnIndex) => {
                      if (column.key === "selected") {
                        const checkboxId = `${id.value}-${row.id ?? rowIndex}`;
                        return create("th", { scope: "row" }, [
                          create("div", { class: "krds-form-check" }, [
                            create("input", {
                              id: checkboxId,
                              class: "chk",
                              type: "checkbox",
                              "aria-label": row.selectionLabel,
                              checked: Boolean(row[column.key]),
                            }),
                            create("label", { for: checkboxId }, ""),
                          ]),
                        ]);
                      }
                      if (column.key === "download")
                        return create("td", [
                          create(
                            "button",
                            { type: "button", class: ["krds-btn", "medium", "text"] },
                            [
                              create("i", { class: ["svg-icon", "ico-down"] }),
                              " ",
                              String(row[column.key] ?? ""),
                            ],
                          ),
                        ]);
                      return columnIndex === 0
                        ? create("th", { scope: "row" }, String(row[column.key] ?? ""))
                        : create("td", String(row[column.key] ?? ""));
                    }),
                  ),
                ),
              ),
            ]),
          ),
          pagination
            ? create("div", { class: "krds-pagination" }, [
                create(
                  "span",
                  {
                    class: [
                      "page-navi",
                      "prev",
                      pagination.previousDisabled ? "disabled" : undefined,
                    ],
                    href: "#",
                  },
                  pagination.previousLabel,
                ),
                create(
                  "div",
                  { class: "page-links" },
                  pagination.items.map((item) =>
                    item === "ellipsis"
                      ? create("span", { class: ["page-link", "link-dot"] })
                      : create(
                          "a",
                          {
                            class: [
                              "page-link",
                              item === pagination.current ? "active" : undefined,
                            ],
                            href: "#",
                          },
                          item === pagination.current
                            ? [
                                create(
                                  "span",
                                  { class: "sr-only" },
                                  `${pagination.currentLabel ?? "현재페이지"} `,
                                ),
                                item,
                              ]
                            : item,
                        ),
                  ),
                ),
                create("a", { class: ["page-navi", "next"], href: "#" }, pagination.nextLabel),
              ])
            : null,
        ],
      );
    };
  },
});
