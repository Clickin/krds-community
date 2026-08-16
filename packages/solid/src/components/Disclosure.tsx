import { For, Show, createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";
import type { KrdsListItem, KrdsNavItem } from "@krds-community/recipes";
import { labelOf } from "../shared.js";

export interface DisclosureProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  id?: string;
  title?: string;
  description?: string;
  items?: (KrdsListItem | KrdsNavItem | string | number)[];
  [key: string]: unknown;
}

export function Disclosure(rawProps: DisclosureProps) {
  const merged = mergeProps({ id: `disclosure-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "id",
    "title",
    "description",
    "items",
    "open",
  ]);
  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };
  const [localOpen, setLocalOpen] = createSignal(false);
  const open = () => (props.open === undefined ? localOpen() : Boolean(props.open));
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
  };
  const className = () => props.class ?? props.className ?? "";
  const children = () => props.children;
  return (
    <div
      {...(native as Record<string, any>)}
      class={["krds-disclosure", "conts-expand-area", open() && "active", className()]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        class="btn-conts-expand"
        id={`${props.id}-trigger`}
        aria-expanded={open()}
        aria-controls={`${props.id}-content`}
        onClick={(event) => {
          setOpen(!open());
          invokeHandler((native as Record<string, any>).onClick, event);
        }}
      >
        {props.title}
      </button>
      <div
        id={`${props.id}-content`}
        class="expand-wrap"
        role="region"
        aria-labelledby={`${props.id}-trigger`}
        inert={!open()}
      >
        <div class="expand-in">
          <Show when={(props.items?.length ?? 0) > 0} fallback={props.description ?? children()}>
            <ul class="krds-info-list dash" role="list">
              <For each={props.items}>{(item) => <li role="listitem">{labelOf(item)}</li>}</For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
}
