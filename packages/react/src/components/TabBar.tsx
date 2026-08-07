import { useState, type MouseEvent } from "react";
import { cx } from "@krds-community/recipes";
import { Badge } from "./Badge.js";
import type { BoxProps } from "./_utils.js";

export interface TabBarItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
}

export interface TabBarProps extends BoxProps {
  items: TabBarItem[];
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
}

export function TabBar({
  items,
  selected: controlledSelected,
  defaultSelected,
  onChange,
  ariaLabel = "주요 메뉴",
  className,
}: TabBarProps) {
  const [internalSelected, setInternalSelected] = useState<string | undefined>(defaultSelected);
  const current = controlledSelected ?? internalSelected;

  const select = (id: string) => {
    setInternalSelected(id);
    onChange?.(id);
  };

  return (
    <nav className={cx("krds-tab-bar", className)} aria-label={ariaLabel}>
      {items.map((item) => {
        const isSelected = current === item.id;
        const itemClassName = cx("tab-bar-item", isSelected && "active");
        const content = (
          <>
            {item.icon ? (
              <i className={cx("svg-icon tab-bar-icon", item.icon)} aria-hidden="true" />
            ) : null}
            <span className="tab-bar-label">{item.label}</span>
            {item.badge ? (
              <Badge tone="danger" appearance="solid" className="tab-bar-badge">
                {item.badge}
              </Badge>
            ) : null}
          </>
        );
        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              className={itemClassName}
              aria-current={isSelected ? "page" : undefined}
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                select(item.id);
              }}
            >
              {content}
            </a>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            className={itemClassName}
            aria-current={isSelected ? "page" : undefined}
            onClick={() => select(item.id)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
