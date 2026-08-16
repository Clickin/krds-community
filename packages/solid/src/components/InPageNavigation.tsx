import { For, mergeProps, splitProps } from "solid-js";
import type { KrdsNavItem } from "@krds-community/recipes";

export interface InPageNavigationProps {
  class?: string;
  className?: string;
  title?: string;
  pageTitle?: string;
  actionLabel?: string;
  actionInfo?: string;
  actionCount?: string;
  nav?: KrdsNavItem[];
  links?: KrdsNavItem[];
  items?: (KrdsNavItem | string | number)[];
  [key: string]: unknown;
}

export function InPageNavigation(rawProps: InPageNavigationProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "pageTitle",
    "actionLabel",
    "actionInfo",
    "actionCount",
    "nav",
    "links",
    "items",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const navigation = () =>
    (props.nav?.length
      ? props.nav
      : props.links?.length
        ? props.links
        : (props.items ?? []).filter(
            (item): item is KrdsNavItem => typeof item !== "string" && typeof item !== "number",
          )) as KrdsNavItem[];
  return (
    <div class="krds-in-page-navigation-type">
      <div
        {...(native as Record<string, any>)}
        class={`krds-in-page-navigation-area${className() ? ` ${className()}` : ""}`}
      >
        <div class="in-page-navigation-header">
          <p class="quick-caption">{props.title}</p>
          <p class="quick-title">{props.pageTitle}</p>
        </div>
        <nav class="in-page-navigation-list" aria-label={props.title || undefined}>
          <ul>
            <For each={navigation()}>
              {(item) => (
                <li>
                  <a href={item.href ?? "#"} classList={{ active: item.current }}>
                    {item.label}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </nav>
        <div class="in-page-navigation-action">
          <button type="button" class="krds-btn medium">
            {props.actionLabel}
          </button>
          <p class="quick-info">
            {props.actionInfo}
            {props.actionInfo && props.actionCount ? " " : null}
            {props.actionCount ? <strong>{props.actionCount}</strong> : null}
          </p>
        </div>
      </div>
    </div>
  );
}
