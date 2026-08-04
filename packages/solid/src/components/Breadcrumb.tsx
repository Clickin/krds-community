import { For, createUniqueId, mergeProps, splitProps } from "solid-js";
import { labelOf } from "../shared.js";

export interface BreadcrumbProps {
  class?: string;
  className?: string;
  id?: string;
  label?: string;
  items?: (string | number | { href?: string; label?: string; title?: string })[];
  [key: string]: unknown;
}

export function Breadcrumb(rawProps: BreadcrumbProps) {
  const merged = mergeProps({ id: `krds-breadcrumb-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "id", "label", "items"]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <nav
      {...(native as Record<string, any>)}
      id={props.id}
      class={`krds-breadcrumb-wrap${className() ? ` ${className()}` : ""}`}
      aria-label={(native as Record<string, string>)?.["aria-label"] ?? props.label ?? "현재 경로"}
    >
      <ol class="breadcrumb">
        <For each={props.items ?? []}>
          {(item, itemIndex) => (
            <li classList={{ home: itemIndex() === 0 }}>
              <a
                class="txt"
                href={
                  typeof item !== "string" && typeof item !== "number" && "href" in item
                    ? (item.href ?? "#")
                    : "#"
                }
              >
                {labelOf(item)}
              </a>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
