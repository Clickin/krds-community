import { type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsPaginationItem } from "@krds-community/recipes";
import type { CommonProps } from "./_utils.js";

export interface PaginationProps extends Omit<CommonProps, "items"> {
  items?: KrdsPaginationItem[];
  current?: number;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  navigationLabel?: string;
  onPageChange?: (page: number) => void;
  className?: string;
  children?: ReactNode;
}
export function Pagination({
  items = [1, 2, 3, 4, 5],
  current = 1,
  previousDisabled = Number(current) <= 1,
  nextDisabled = Number(current) >=
    Math.max(...items.filter((item): item is number => item !== "ellipsis")),
  previousLabel = "이전",
  nextLabel = "다음",
  navigationLabel = "페이지 이동",
  onPageChange,
  className,
  ref,
  ..._props
}: PaginationProps & { ref?: Ref<HTMLDivElement> }) {
  const currentPage = Number(current) || 1;
  const pageLink = (page: number) => (
    <a
      className={cx("page-link", page === currentPage && "active")}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onPageChange?.(page);
      }}
      key={page}
    >
      {page === currentPage ? <span className="sr-only">현재페이지 </span> : null}
      {page}
    </a>
  );
  return (
    <div
      ref={ref}
      className={cx("krds-pagination", className)}
      role="navigation"
      aria-label={navigationLabel}
    >
      {previousDisabled ? (
        <span {...{ href: "#" }} className="page-navi prev disabled">
          {previousLabel}
        </span>
      ) : (
        <a
          className="page-navi prev"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onPageChange?.(currentPage - 1);
          }}
        >
          {previousLabel}
        </a>
      )}
      <div className="page-links">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span className="page-link link-dot" key={`ellipsis-${index}`} />
          ) : (
            pageLink(item)
          ),
        )}
      </div>
      {nextDisabled ? (
        <span {...{ href: "#" }} className="page-navi next disabled">
          {nextLabel}
        </span>
      ) : (
        <a
          className="page-navi next"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onPageChange?.(currentPage + 1);
          }}
        >
          {nextLabel}
        </a>
      )}
    </div>
  );
}
