import { For, Show, mergeProps, splitProps } from "solid-js";
import { labelOf, type StructuredItem } from "../shared.js";

export interface StructuredListProps {
  class?: string;
  className?: string;
  items?: (StructuredItem | string | number)[];
  dateLabel?: string;
  dateValue?: string;
  actionLabel?: string;
  shareLabel?: string;
  favoriteLabel?: string;
  tags?: string[];
  [key: string]: unknown;
}

export function StructuredList(rawProps: StructuredListProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "items",
    "dateLabel",
    "dateValue",
    "actionLabel",
    "shareLabel",
    "favoriteLabel",
    "tags",
  ]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <ul
      {...(native as Record<string, any>)}
      class={["krds-structured-list", "type-full", className()].filter(Boolean).join(" ")}
    >
      <For each={props.items ?? []}>
        {(item) => {
          const structured =
            typeof item === "string" || typeof item === "number"
              ? undefined
              : (item as StructuredItem);
          return (
            <li class="structured-item">
              <div class="in">
                <Show when={structured?.badge}>
                  <div class="card-top">
                    <span class={["krds-badge", structured?.badgeClass].filter(Boolean).join(" ")}>
                      {structured?.badge}
                    </span>
                  </div>
                </Show>
                <div class="card-body">
                  <a class="c-text" href={structured?.href ?? "#"}>
                    <p class="c-tit">
                      <span class="span">{labelOf(item)}</span>
                    </p>
                    <Show when={structured?.description}>
                      <p class="c-txt">{structured?.description}</p>
                    </Show>
                    <p class="c-date">
                      <strong class="key">{structured?.dateLabel ?? props.dateLabel}</strong>
                      <span class="value">{structured?.dateValue ?? props.dateValue}</span>
                    </p>
                  </a>
                  <div class="c-btn">
                    <a
                      class="krds-btn secondary"
                      href={structured?.href ?? "#"}
                      title={labelOf(item)}
                    >
                      {structured?.actionLabel ?? props.actionLabel}
                    </a>
                  </div>
                </div>
                <div class="card-btm">
                  <For each={structured?.tags ?? props.tags ?? []}>
                    {(tag) => <span class="tag">{tag}</span>}
                  </For>
                </div>
                <div class="card-btn">
                  <button type="button" class="krds-btn medium text" title={labelOf(item)}>
                    <i class="svg-icon ico-share" />
                    {" " + (structured?.shareLabel ?? props.shareLabel)}
                  </button>
                  <button type="button" class="krds-btn medium text" title={labelOf(item)}>
                    <i class="svg-icon ico-like" />
                    {" " + (structured?.favoriteLabel ?? props.favoriteLabel)}
                  </button>
                </div>
              </div>
            </li>
          );
        }}
      </For>
    </ul>
  );
}
