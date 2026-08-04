import { For, mergeProps, splitProps, type JSX } from "solid-js";
import { labelOf } from "../shared.js";

export interface TextListProps {
  class?: string;
  className?: string;
  items?: (string | number | { label?: string; title?: string; children?: any[] })[];
  ordered?: boolean;
  [key: string]: unknown;
}

const infoList = (
  items: () => (
    | string
    | number
    | { label?: string; title?: string; marker?: string; children?: any[] }
  )[],
  ordered: () => boolean,
  depth = 0,
): JSX.Element => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const listItems = (
    <For each={items()}>
      {(item, index) => {
        const structured = typeof item !== "string" && typeof item !== "number" ? item : null;
        const nested =
          structured && Array.isArray(structured.children)
            ? (structured.children as (
                | string
                | number
                | { label?: string; title?: string; marker?: string; children?: any[] }
              )[])
            : [];
        const marker = structured
          ? (structured.marker ??
            (ordered()
              ? depth === 0
                ? `${index() + 1}. `
                : depth === 1
                  ? `${alphabet[index()] ?? index() + 1}. `
                  : String.fromCodePoint(0x2460 + index())
              : null))
          : null;
        return (
          <li role="listitem">
            {marker !== null ? <span class="num">{marker}</span> : null}
            {labelOf(item)}
            {nested.length > 0 && infoList(() => nested, ordered, depth + 1)}
          </li>
        );
      }}
    </For>
  );
  if (ordered()) {
    return (
      <ol class="krds-info-list ordered" role="list">
        {listItems}
      </ol>
    );
  }
  return (
    <ul
      class={`krds-info-list ${depth === 0 ? "decimal" : depth === 1 ? "dash" : "hollow"}`}
      role="list"
    >
      {listItems}
    </ul>
  );
};

export function TextList(rawProps: TextListProps) {
  const merged = mergeProps({}, rawProps);
  const [props] = splitProps(merged, ["items", "ordered"]);
  return infoList(
    () => props.items ?? [],
    () => false,
  );
}

export function TextListOrdered(rawProps: TextListProps) {
  const merged = mergeProps({}, rawProps);
  const [props] = splitProps(merged, ["items", "ordered"]);
  return infoList(
    () => props.items ?? [],
    () => true,
  );
}
