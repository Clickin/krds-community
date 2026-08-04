import { type ReactNode, type TableHTMLAttributes, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { DataTableColumn } from "./StructuredListTable.js";
export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: DataTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  caption?: ReactNode;
}

export function Table({
  columns,
  rows,
  caption,
  className,
  ref,
  ...props
}: TableProps & { ref?: Ref<HTMLTableElement> }) {
  return (
    <div className="krds-table-wrap">
      <table {...props} ref={ref} className={cx("tbl", "col", "data", className)}>
        <caption>{caption}</caption>
        <colgroup>
          {columns.map((column) => (
            <col style={column.width ? { width: column.width } : undefined} key={column.key} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.key}>
                {column.visuallyHidden ? (
                  <span className="sr-only">{column.label}</span>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column, columnIndex) =>
                columnIndex === 0 ? (
                  <th scope="row" key={column.key}>
                    {row[column.key]}
                  </th>
                ) : (
                  <td key={column.key}>{row[column.key]}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
