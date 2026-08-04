import { For, Show, mergeProps, splitProps } from "solid-js";
import type { TableColumn, TableRow, TablePagination, CalendarAction } from "../shared.js";

export interface StructuredListTableProps {
  class?: string;
  className?: string;
  id?: string;
  columns?: TableColumn[];
  rows?: TableRow[];
  pagination?: TablePagination;
  caption?: string;
  selectAllLabel?: string;
  countLabel?: string;
  countOptions?: string[];
  sortLabel?: string;
  sortOptions?: string[];
  sortValue?: string;
  actions?: CalendarAction[];
  [key: string]: unknown;
}

export function StructuredListTable(rawProps: StructuredListTableProps) {
  const merged = mergeProps({ columns: [] as TableColumn[], rows: [] as TableRow[] }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "columns",
    "rows",
    "pagination",
    "caption",
    "selectAllLabel",
    "countLabel",
    "countOptions",
    "sortLabel",
    "sortOptions",
    "sortValue",
    "actions",
  ]);
  const className = () => props.class ?? props.className ?? "sample";
  return (
    <div
      {...(native as Record<string, any>)}
      class={["krds-structured-list-table", className()].filter(Boolean).join(" ")}
    >
      <div class="search-list-top">
        <div class="sch-left">
          <div class="krds-check-area">
            <div class="krds-form-check">
              <input type="checkbox" class="chk" id={`${props.id}-all`} />
              <label for={`${props.id}-all`}>{props.selectAllLabel}</label>
            </div>
          </div>
          <ul class="side-line-ul">
            <For each={props.actions ?? []}>
              {(action) => (
                <li>
                  <button type="button" class="krds-btn medium text">
                    <i class={`svg-icon ico-${action.icon}`} />
                    {" " + action.label}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
        <ul class="sch-sort">
          <li>
            <strong class="sort-label">
              <label for={`${props.id}-count`}>{props.countLabel}</label>
            </strong>{" "}
            <select
              class="krds-form-select-sort"
              id={`${props.id}-count`}
              aria-label={props.countLabel}
              value={props.countOptions?.[0]}
            >
              <For each={props.countOptions ?? []}>{(option) => <option>{option}</option>}</For>
            </select>
          </li>
          <li>
            <strong class="sort-label">
              <label for={`${props.id}-sort`}>{props.sortLabel}</label>
            </strong>{" "}
            <div class="w-sort-btn">
              <For each={props.sortOptions ?? []}>
                {(option) => (
                  <>
                    <button type="button" classList={{ active: props.sortValue === option }}>
                      {option}
                    </button>{" "}
                  </>
                )}
              </For>
            </div>
            <div class="m-sort-btn">
              <select
                class="krds-form-select-sort"
                id={`${props.id}-sort`}
                aria-label={props.sortLabel}
                value={props.sortValue}
              >
                <For each={props.sortOptions ?? []}>{(option) => <option>{option}</option>}</For>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div class="krds-table-wrap">
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
            <col />
          </colgroup>
          <thead>
            <tr>
              <For each={props.columns}>
                {(column) => (
                  <th scope="col">
                    <Show
                      when={"visuallyHidden" in column && column.visuallyHidden === true}
                      fallback={column.label}
                    >
                      <span class="sr-only">{column.label}</span>
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={props.rows}>
              {(row) => (
                <tr>
                  <For each={props.columns}>
                    {(column, columnIndex) =>
                      columnIndex() === 0 ? (
                        <th scope="row">
                          <div class="krds-form-check">
                            <input
                              type="checkbox"
                              class="chk"
                              id={`${props.id}-row-${String(row.id)}`}
                              aria-label={row.selectionLabel ?? String(row[column.key] ?? "")}
                              checked={Boolean(row.selected)}
                            />
                            <label for={`${props.id}-row-${String(row.id)}`} />
                          </div>
                        </th>
                      ) : column.key === "download" ? (
                        <td>
                          <button type="button" class="krds-btn medium text">
                            <i class="svg-icon ico-down" />
                            {" " + String(row[column.key] ?? "")}
                          </button>
                        </td>
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
      <div class="krds-pagination">
        <Show
          when={!props.pagination?.previousDisabled}
          fallback={
            <span {...({ href: "#" } as Record<string, string>)} class="page-navi prev disabled">
              {props.pagination?.previousLabel}
            </span>
          }
        >
          <a class="page-navi prev" href="#">
            {props.pagination?.previousLabel}
          </a>
        </Show>
        <div class="page-links">
          <For each={props.pagination?.items}>
            {(item) =>
              item === "ellipsis" ? (
                <span class="page-link link-dot" />
              ) : (
                <a
                  class="page-link"
                  classList={{ active: props.pagination?.current === item }}
                  href="#"
                >
                  <Show when={props.pagination?.current === item}>
                    <span class="sr-only">{props.pagination?.currentLabel} </span>
                  </Show>
                  {item}
                </a>
              )
            }
          </For>
        </div>
        <a class="page-navi next" href="#">
          {props.pagination?.nextLabel}
        </a>
      </div>
    </div>
  );
}
