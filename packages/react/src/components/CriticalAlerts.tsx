import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type BoxProps } from "./_utils.js";

export interface CriticalAlertItem {
  id?: string;
  badge?: ReactNode;
  badgeLabel?: ReactNode;
  tone?: "danger" | "ok" | "info";
  message?: ReactNode;
  title?: ReactNode;
  text?: ReactNode;
  href?: string;
  linkLabel?: ReactNode;
}

export interface CriticalAlertsProps extends Omit<BoxProps, "items"> {
  items?: Array<string | CriticalAlertItem>;
}

export function CriticalAlerts({ items = [], className }: CriticalAlertsProps) {
  return (
    <div className="main-urgent-wrap" role="alert">
      <ul className={cx("krds-critical-alerts", className)}>
        {items.map((rawItem, index) => {
          const item: CriticalAlertItem =
            typeof rawItem === "string" ? { message: rawItem } : rawItem;
          const badgeTone =
            item.tone ??
            (item.badge === "danger" || item.badge === "ok" || item.badge === "info"
              ? item.badge
              : undefined);
          const badgeLabel = item.badgeLabel ?? (item.badge === badgeTone ? undefined : item.badge);
          const message = item.message ?? item.text ?? item.title;
          return (
            <li key={item.id ?? index}>
              <div className="critical-ban">
                {badgeLabel ? (
                  <span className={cx("critical-badge", badgeTone)}>{badgeLabel}</span>
                ) : null}
                <p className="critical-txt">{message}</p>
                {item.linkLabel ? (
                  <a href={item.href ?? "#"} className="krds-btn medium link basic">
                    <span className="m-hide">{item.linkLabel}</span>{" "}
                    <SvgIcon name="ico-angle right" />
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
