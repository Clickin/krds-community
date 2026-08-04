import { type HTMLAttributes, type ReactNode, type Ref } from "react";
import { SvgIcon, cx } from "./_utils.js";
import type { KrdsListItem } from "@krds-community/recipes";

export interface StructuredListItem extends Omit<KrdsListItem, "title" | "description"> {
  title: ReactNode;
  description?: ReactNode;
  badgeClass?: string;
}

export interface StructuredListProps extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
  items: StructuredListItem[];
  dateLabel?: ReactNode;
  dateValue?: ReactNode;
  tags?: ReactNode[];
  actionLabel?: ReactNode;
  shareLabel?: ReactNode;
  favoriteLabel?: ReactNode;
  onShare?: (item: StructuredListItem) => void;
  onFavorite?: (item: StructuredListItem) => void;
}
export function StructuredList({
  items,
  dateLabel,
  dateValue,
  tags = [],
  actionLabel,
  shareLabel,
  favoriteLabel,
  onShare,
  onFavorite,
  className,
  ref,
  ...props
}: StructuredListProps & { ref?: Ref<HTMLUListElement> }) {
  return (
    <ul {...props} ref={ref} className={cx("krds-structured-list", "type-full", className)}>
      {items.map((item) => (
        <li className="structured-item" key={item.id}>
          <div className="in">
            <div className="card-top">
              {item.badge ? (
                <span className={cx("krds-badge", item.badgeClass)}>{item.badge}</span>
              ) : null}
            </div>
            <div className="card-body">
              <a href={item.href ?? "#"} className="c-text">
                <p className="c-tit">
                  <span className="span">{item.title}</span>
                </p>
                {item.description ? <p className="c-txt">{item.description}</p> : null}
                <p className="c-date">
                  <strong className="key">{dateLabel}</strong>
                  <span className="value">{dateValue}</span>
                </p>
              </a>
              <div className="c-btn">
                <a
                  href={item.href ?? "#"}
                  className="krds-btn secondary"
                  title={typeof item.title === "string" ? item.title : undefined}
                >
                  {actionLabel}
                </a>
              </div>
            </div>
            <div className="card-btm">
              {tags.map((tag, index) => (
                <span className="tag" key={index}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="card-btn">
              <button
                type="button"
                className="krds-btn medium text"
                title={typeof item.title === "string" ? item.title : undefined}
                onClick={() => onShare?.(item)}
              >
                <SvgIcon name="ico-share" />
                {" " + shareLabel}
              </button>
              <button
                type="button"
                className="krds-btn medium text"
                title={typeof item.title === "string" ? item.title : undefined}
                onClick={() => onFavorite?.(item)}
              >
                <SvgIcon name="ico-like" />
                {" " + favoriteLabel}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
