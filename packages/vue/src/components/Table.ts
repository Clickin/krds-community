import { defineComponent, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

import type { AdditionalTableColumn, AdditionalTableRow } from "../types.js";

export const Table = defineComponent({
  name: "KrdsTable",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    caption: { type: String, default: undefined },
    title: { type: String, default: undefined },
    columns: { type: Array as PropType<AdditionalTableColumn[]>, default: () => [] },
    rows: { type: Array as PropType<AdditionalTableRow[]>, default: () => [] },
  },
  setup(props, { attrs, slots: _slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        { ...withoutNativeEvents(attrs), class: "krds-table-wrap" },
        create("table", { class: ["tbl", "col", "data", className] }, [
          create("caption", props.caption ?? props.title),
          create(
            "colgroup",
            props.columns.map((column, columnIndex) =>
              create("col", {
                key: column.key ?? columnIndex,
                style: column.width ? `width: ${column.width};` : undefined,
              }),
            ),
          ),
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
                  return columnIndex === 0
                    ? create("th", { scope: "row" }, String(row[column.key] ?? ""))
                    : create("td", String(row[column.key] ?? ""));
                }),
              ),
            ),
          ),
        ]),
      );
    };
  },
});
