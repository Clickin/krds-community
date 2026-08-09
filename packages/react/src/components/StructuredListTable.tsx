import { Fragment, useId, useState, type ReactNode, type Ref } from "react";
import { SvgIcon, cx } from "./_utils.js";
import type { KrdsTableColumn } from "@krds-community/recipes";

export interface StructuredListTableAction {
  id?: string;
  label: ReactNode;
  icon?: string;
}

export interface DataTableColumn extends KrdsTableColumn {
  width?: string;
  visuallyHidden?: boolean;
}

export interface StructuredListTableRow extends Record<
  string,
  string | number | boolean | undefined
> {
  id: string;
  selected?: boolean;
  selectionLabel?: string;
}

export interface StructuredListTableProps {
  columns?: DataTableColumn[];
  rows?: StructuredListTableRow[];
  caption?: ReactNode;
  className?: string;
  selectAllLabel?: ReactNode;
  actions?: StructuredListTableAction[];
  countLabel?: ReactNode;
  countOptions?: string[];
  sortLabel?: ReactNode;
  sortOptions?: string[];
  sortValue?: string;
  pagination?: {
    current: number;
    items: Array<number | "ellipsis">;
    previousDisabled?: boolean;
    previousLabel?: ReactNode;
    nextLabel?: ReactNode;
    nextDisabled?: boolean;
    currentLabel?: string;
  };
  onSelectionChange?: (ids: string[]) => void;
  onDownload?: (row: StructuredListTableRow) => void;
}
export function StructuredListTable({
  columns = [],
  rows = [],
  caption,
  className: _className,
  selectAllLabel = "전체선택",
  actions = [],
  countLabel = "표시 개수",
  countOptions = [],
  sortLabel = "정렬",
  sortOptions = [],
  sortValue,
  pagination,
  onSelectionChange,
  onDownload,
  ref,
  ..._props
}: StructuredListTableProps & { ref?: Ref<HTMLDivElement> }) {
  const generatedId = useId();
  const countId = `krds-table-count-${useId()}`;
  const sortId = `krds-table-sort-${useId()}`;
  const controlled = rows.some((row) => row.selected !== undefined);
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(rows.filter((row) => row.selected).map((row) => row.id)),
  );
  const selected = controlled
    ? new Set(rows.filter((row) => row.selected).map((row) => row.id))
    : selectedIds;
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const toggle = (row: StructuredListTableRow) => {
    const next = new Set(selected);
    if (next.has(row.id)) next.delete(row.id);
    else next.add(row.id);
    if (!controlled) setSelectedIds(next);
    onSelectionChange?.([...next]);
  };
  const toggleAll = (checked: boolean) => {
    const next = checked ? new Set(rows.map((row) => row.id)) : new Set<string>();
    if (!controlled) setSelectedIds(next);
    onSelectionChange?.([...next]);
  };
  const pageItems = pagination?.items ?? [];
  const pageMax = Math.max(1, ...pageItems.filter((item): item is number => item !== "ellipsis"));
  const pageLink = (page: number) => (
    <a
      className={cx("page-link", page === pagination?.current && "active")}
      href="#"
      onClick={(event) => event.preventDefault()}
      key={page}
    >
      {page === pagination?.current ? (
        <span className="sr-only">{pagination.currentLabel}</span>
      ) : null}
      {page}
    </a>
  );
  return (
    <div ref={ref} className={cx("krds-structured-list-table", _className || "sample")}>
      <div className="search-list-top">
        <div className="sch-left">
          <div className="krds-check-area">
            <div className="krds-form-check">
              <input
                type="checkbox"
                className="chk"
                id={generatedId}
                checked={allSelected}
                onChange={(event) => toggleAll(event.currentTarget.checked)}
              />
              <label htmlFor={generatedId}>{selectAllLabel}</label>
            </div>
          </div>
          <ul className="side-line-ul">
            {actions.map((action, index) => (
              <li key={action.id ?? index}>
                <button type="button" className="krds-btn medium text">
                  <SvgIcon name={`ico-${action.icon ?? "down"}`} /> {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <ul className="sch-sort">
          <li>
            <strong className="sort-label">
              <label htmlFor={countId}>{countLabel}</label>
            </strong>{" "}
            <select className="krds-form-select-sort" id={countId}>
              {countOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <strong className="sort-label">
              <label htmlFor={sortId}>{sortLabel}</label>
            </strong>
            <div className="w-sort-btn">
              {sortOptions.map((option) => (
                <Fragment key={option}>
                  <button type="button" className={option === sortValue ? "active" : undefined}>
                    {option}
                  </button>{" "}
                </Fragment>
              ))}
            </div>
            <div className="m-sort-btn">
              <select className="krds-form-select-sort" id={sortId}>
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div className="krds-table-wrap">
        <table className="tbl col data">
          <caption>{caption}</caption>
          <colgroup>
            {columns.map((column) => (
              <col style={column.width ? { width: column.width } : undefined} key={column.key} />
            ))}
            <col />
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
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column, columnIndex) => {
                  if (column.key === "selected") {
                    const inputId = `krds-table-${generatedId}-${row.id}`;
                    return (
                      <th scope="row" key={column.key}>
                        <div className="krds-form-check">
                          <input
                            type="checkbox"
                            className="chk"
                            id={inputId}
                            aria-label={row.selectionLabel}
                            checked={selected.has(row.id)}
                            onChange={() => toggle(row)}
                          />
                          <label htmlFor={inputId} />
                        </div>
                      </th>
                    );
                  }
                  if (column.key === "download") {
                    return (
                      <td key={column.key}>
                        <button
                          type="button"
                          className="krds-btn medium text"
                          onClick={() => onDownload?.(row)}
                        >
                          <SvgIcon name="ico-down" /> {String(row[column.key] ?? "")}
                        </button>
                      </td>
                    );
                  }
                  if (columnIndex === 0) {
                    return (
                      <th scope="row" key={column.key}>
                        {String(row[column.key] ?? "")}
                      </th>
                    );
                  }
                  return <td key={column.key}>{String(row[column.key] ?? "")}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div className="krds-pagination">
          {pagination.previousDisabled ? (
            <span {...{ href: "#" }} className="page-navi prev disabled">
              {pagination.previousLabel}
            </span>
          ) : (
            <a href="#" className="page-navi prev" onClick={(event) => event.preventDefault()}>
              {pagination.previousLabel}
            </a>
          )}
          <div className="page-links">
            {pageItems.map((item, index) =>
              item === "ellipsis" ? (
                <span className="page-link link-dot" key={`ellipsis-${index}`} />
              ) : (
                pageLink(item)
              ),
            )}
          </div>
          {pagination.current >= pageMax ? (
            <span {...{ href: "#" }} className="page-navi next disabled">
              {pagination.nextLabel}
            </span>
          ) : (
            <a href="#" className="page-navi next" onClick={(event) => event.preventDefault()}>
              {pagination.nextLabel}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
