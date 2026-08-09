import { isValidElement, type ReactNode, type Ref } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "@krds-community/recipes";

type StructuredTextListItem = {
  id?: string;
  label?: ReactNode;
  title?: ReactNode;
  marker?: ReactNode;
  children?: TextListItem[];
};
export type TextListItem = ReactNode | StructuredTextListItem;

function isTextListReactNode(item: TextListItem): item is ReactNode {
  if (item === null || typeof item !== "object" || isValidElement(item)) {
    return true;
  }
  if (Symbol.iterator in item) {
    return true;
  }
  if ("then" in item && typeof item.then === "function") {
    return true;
  }
  return "$$typeof" in item;
}

function TextListItems({
  items,
  ordered,
  depth,
}: {
  items: TextListItem[];
  ordered: boolean;
  depth: number;
}) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const markerFor = (index: number) =>
    depth === 0
      ? `${index + 1}. `
      : depth === 1
        ? `${alphabet[index] ?? index + 1}. `
        : String.fromCodePoint(0x2460 + index);
  return items.map((item, index) => {
    if (isTextListReactNode(item)) {
      return (
        <li role="listitem" key={index}>
          {ordered && item !== null && typeof item !== "object" ? (
            <span className="num">{markerFor(index)}</span>
          ) : null}
          {item}
        </li>
      );
    }
    const content = item.label ?? item.title;
    const marker = ordered
      ? (item.marker ??
        (depth === 0
          ? `${index + 1}. `
          : depth === 1
            ? `${alphabet[index] ?? index + 1}. `
            : String.fromCodePoint(0x2460 + index)))
      : null;
    const NestedList = ordered ? "ol" : "ul";
    const nestedClass = ordered ? "ordered" : depth === 0 ? "dash" : "hollow";
    return (
      <li role="listitem" key={item.id ?? index}>
        {marker !== null ? <span className="num">{marker}</span> : null}
        {content}
        {item.children?.length ? (
          <NestedList role="list" className={cx("krds-info-list", nestedClass)}>
            <TextListItems items={item.children} ordered={ordered} depth={depth + 1} />
          </NestedList>
        ) : null}
      </li>
    );
  });
}

export function TextList({
  items = [],
  ordered = false,
  className,
  ref,
  ...props
}: {
  items?: TextListItem[];
  ordered?: boolean;
  className?: string;
  ref?: Ref<HTMLElement>;
} & Omit<HTMLAttributes<HTMLUListElement>, "children">) {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      {...props}
      ref={ref as Ref<HTMLOListElement>}
      role="list"
      className={cx("krds-info-list", ordered ? "ordered" : "decimal", className)}
    >
      <TextListItems items={items} ordered={ordered} depth={0} />
    </List>
  );
}
