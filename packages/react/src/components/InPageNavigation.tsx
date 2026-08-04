import { cx, type KrdsNavItem } from "@krds-community/recipes";
import type { ReactNode } from "react";
import { type BoxProps } from "./_utils.js";

export interface InPageNavigationProps extends BoxProps {
  items?: KrdsNavItem[];
  title?: string;
  pageTitle?: ReactNode;
  actionLabel?: ReactNode;
  actionInfo?: ReactNode;
  actionCount?: ReactNode;
  onAction?: () => void;
}
export function InPageNavigation({
  items = [],
  title,
  pageTitle,
  actionLabel,
  actionInfo,
  actionCount,
  onAction,
  className,
}: InPageNavigationProps) {
  return (
    <div className="krds-in-page-navigation-type">
      <div className={cx("krds-in-page-navigation-area", className)}>
        <div className="in-page-navigation-header">
          <p className="quick-caption">{title}</p>
          <p className="quick-title">{pageTitle}</p>
        </div>
        <nav className="in-page-navigation-list" aria-label={title}>
          <ul>
            {items.map((item) => (
              <li key={item.id ?? item.label}>
                <a className={item.current ? "active" : undefined} href={item.href ?? "#"}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="in-page-navigation-action">
          <button type="button" className="krds-btn medium" onClick={onAction}>
            {actionLabel}
          </button>
          <p className="quick-info">
            {actionInfo} {actionCount ? <strong>{actionCount}</strong> : null}
          </p>
        </div>
      </div>
    </div>
  );
}
