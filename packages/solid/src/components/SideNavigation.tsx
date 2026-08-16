import { For, createSignal, mergeProps, splitProps } from "solid-js";
import type { KrdsNavItem } from "@krds-community/recipes";

export interface SideNavigationItem extends KrdsNavItem {
  children?: SideNavigationItem[];
  description?: string;
  current?: boolean;
}

export interface SideNavigationProps {
  class?: string;
  className?: string;
  title?: string;
  id?: string;
  nav?: KrdsNavItem[];
  links?: KrdsNavItem[];
  items?: (KrdsNavItem | string | number)[];
  selected?: string;
  defaultValue?: string;
  modelValue?: string;
  value?: string;
  [key: string]: unknown;
}

export function SideNavigation(rawProps: SideNavigationProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "id",
    "nav",
    "links",
    "items",
    "selected",
    "defaultValue",
    "modelValue",
    "value",
  ]);
  const [localSelected, setLocalSelected] = createSignal<string>();
  const selected = () => {
    const mv = props.modelValue;
    if (typeof mv === "string" || typeof mv === "number") return String(mv);
    return props.selected ?? localSelected() ?? props.defaultValue ?? "";
  };
  const setSelected = (next: string) => {
    if (props.modelValue === undefined) setLocalSelected(next);
  };
  const className = () => props.class ?? props.className ?? "";
  const hasCurrentItem = (item: KrdsNavItem): boolean => {
    if (item.current) return true;
    return item.children?.some(hasCurrentItem) ?? false;
  };
  const navigation = () =>
    (props.nav?.length
      ? props.nav
      : props.links?.length
        ? props.links
        : (props.items ?? []).filter(
            (item): item is KrdsNavItem => typeof item !== "string" && typeof item !== "number",
          )) as KrdsNavItem[];
  return (
    <nav
      {...(native as Record<string, any>)}
      class={`krds-side-navigation${className() ? ` ${className()}` : ""}`}
    >
      <h2 class="lnb-tit">{props.title}</h2>
      <ul class="lnb-list" role="menubar">
        <For each={navigation()}>
          {(item, topIndex) => {
            const submenuId = `${props.id}-submenu-${topIndex()}`;
            const expanded = () =>
              selected() === item.id || (selected() === "" && hasCurrentItem(item));
            return item.children?.length ? (
              <li class="lnb-item" classList={{ active: expanded() }} role="none">
                <button
                  type="button"
                  class="lnb-btn lnb-toggle"
                  classList={{ active: expanded() }}
                  role="menuitem"
                  aria-controls={submenuId}
                  aria-expanded={expanded()}
                  onClick={() => setSelected(expanded() ? "" : (item.id ?? submenuId))}
                >
                  {item.label}
                </button>
                <div class="lnb-submenu">
                  <ul id={submenuId} role="menu">
                    <For each={(item as SideNavigationItem).children}>
                      {(child, childIndex) => {
                        const popupId = `${submenuId}-${childIndex()}`;
                        return (child as SideNavigationItem).children?.length ? (
                          <li class="lnb-subitem" role="none">
                            <button
                              type="button"
                              class="lnb-btn lnb-toggle-popup"
                              role="menuitem"
                              aria-controls={popupId}
                              aria-expanded="false"
                              aria-haspopup="true"
                            >
                              {child.label}
                            </button>
                            <div class="lnb-submenu-lv2" id={popupId} role="menu">
                              <button type="button" class="lnb-btn-tit">
                                {typeof child.description === "string"
                                  ? child.description
                                  : child.label}
                              </button>
                              <ul>
                                <For each={(child as SideNavigationItem).children}>
                                  {(leaf) => (
                                    <li role="none">
                                      <a href={leaf.href ?? "#"} class="lnb-btn" role="menuitem">
                                        {leaf.label}
                                      </a>
                                    </li>
                                  )}
                                </For>
                              </ul>
                            </div>
                          </li>
                        ) : (
                          <li class="lnb-subitem" classList={{ active: child.current }} role="none">
                            <a
                              href={child.href ?? "#"}
                              class="lnb-btn lnb-link"
                              role="menuitem"
                              aria-current={child.current ? "page" : undefined}
                            >
                              {child.label}
                            </a>
                          </li>
                        );
                      }}
                    </For>
                  </ul>
                </div>
              </li>
            ) : (
              <li class="lnb-item" classList={{ active: item.current }} role="none">
                <a
                  href={item.href ?? "#"}
                  class="lnb-btn lnb-link"
                  role="menuitem"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          }}
        </For>
      </ul>
    </nav>
  );
}
