import { For, Show, createSignal, mergeProps, splitProps, type JSX } from "solid-js";
import { Badge } from "./Badge.js";

export interface TabBarItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
}

export interface TabBarProps {
  class?: string;
  className?: string;
  items: TabBarItem[];
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
  [key: string]: unknown;
}

export function TabBar(rawProps: TabBarProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "items",
    "selected",
    "defaultSelected",
    "onChange",
    "ariaLabel",
  ]);

  const [localSelected, setLocalSelected] = createSignal<string | undefined>(props.defaultSelected);
  const selected = () => (props.selected !== undefined ? props.selected : localSelected());

  const select = (id: string) => {
    if (props.selected === undefined) setLocalSelected(id);
    props.onChange?.(id);
  };

  const className = () => props.class ?? props.className ?? "";
  return (
    <nav
      {...(native as Record<string, any>)}
      class={`krds-tab-bar${className() ? ` ${className()}` : ""}`}
      aria-label={props.ariaLabel ?? "주요 메뉴"}
    >
      <For each={props.items}>
        {(item) => {
          const active = () => selected() === item.id;
          const content = (
            <>
              <Show when={item.icon}>
                <i class={`svg-icon tab-bar-icon ${item.icon}`} aria-hidden="true" />
              </Show>
              <span class="tab-bar-label">{item.label}</span>
              <Show when={item.badge}>
                <Badge class="tab-bar-badge" tone="danger" appearance="solid">
                  {item.badge}
                </Badge>
              </Show>
            </>
          );
          return item.href ? (
            <a
              class={`tab-bar-item${active() ? " active" : ""}`}
              href={item.href}
              aria-current={active() ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                select(item.id);
              }}
            >
              {content}
            </a>
          ) : (
            <button
              type="button"
              class={`tab-bar-item${active() ? " active" : ""}`}
              aria-current={active() ? "page" : undefined}
              onClick={() => select(item.id)}
            >
              {content}
            </button>
          );
        }}
      </For>
    </nav>
  );
}
