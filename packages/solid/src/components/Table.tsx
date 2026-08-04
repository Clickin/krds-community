import { For, mergeProps, splitProps } from "solid-js";
import type { TableColumn, TableRow } from "../shared.js";

export interface TableProps {
  class?: string;
  className?: string;
  caption?: string;
  columns?: TableColumn[];
  rows?: TableRow[];
  [key: string]: unknown;
}

export function Table(rawProps: TableProps) {
  const merged = mergeProps({ columns: [] as TableColumn[], rows: [] as TableRow[] }, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "caption", "columns", "rows"]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={["krds-table-wrap", className()].filter(Boolean).join(" ")}
    >
      <table class="tbl col data">
        <caption>{props.caption}</caption>
        <colgroup>
          <For each={props.columns}>
            {(column) => (
              <col
                style={
                  "width" in column && typeof column.width === "string" && column.width
                    ? { width: column.width }
                    : undefined
                }
              />
            )}
          </For>
        </colgroup>
        <thead>
          <tr>
            <For each={props.columns}>{(column) => <th scope="col">{column.label}</th>}</For>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(row) => (
              <tr>
                <For each={props.columns}>
                  {(column, columnIndex) =>
                    columnIndex() === 0 ? (
                      <th scope="row">{String(row[column.key] ?? "")}</th>
                    ) : (
                      <td>{String(row[column.key] ?? "")}</td>
                    )
                  }
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
