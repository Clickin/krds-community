import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsNavItem } from "@krds-community/recipes";

export interface SideNavigationItem extends Omit<KrdsNavItem, "children"> {
  description?: ReactNode;
  title?: ReactNode;
  target?: string;
  children?: SideNavigationItem[];
}
export interface SideNavigationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> {
  items?: SideNavigationItem[];
  links?: SideNavigationItem[];
  title?: ReactNode;
  expandedItems?: string[];
  defaultExpandedItems?: string[];
  onExpandedChange?: (ids: string[]) => void;
}

function SideNavigationPopup({ item, panelId }: { item: SideNavigationItem; panelId: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);
  return (
    <li className="lnb-subitem" role="none">
      <button
        ref={triggerRef}
        type="button"
        className="lnb-btn lnb-toggle-popup"
        role="menuitem"
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="true"
        disabled={item.disabled}
        onClick={() => setOpen(true)}
      >
        {item.label}
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={cx("lnb-submenu-lv2", open && "active")}
        role="menu"
        onBlur={(event) => {
          if (!panelRef.current?.contains(event.relatedTarget as Node)) {
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <button
          ref={titleRef}
          type="button"
          className="lnb-btn-tit"
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          {item.description ?? item.title}
        </button>
        <ul>
          {item.children?.map((leaf, index) => (
            <li role="none" key={leaf.id ?? index}>
              <a
                href={leaf.href ?? "#"}
                className="lnb-btn"
                role="menuitem"
                aria-current={leaf.current ? "page" : undefined}
                target={leaf.target}
                title={leaf.title as string | undefined}
              >
                {leaf.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function SideNavigation({
  items,
  links,
  title,
  expandedItems: controlledExpandedItems,
  defaultExpandedItems,
  onExpandedChange,
  className,
  ref,
  ...props
}: SideNavigationProps & { ref?: Ref<HTMLElement> }) {
  const navigationItems = items?.length ? items : (links ?? []);
  const generatedId = useId();
  const [uncontrolledExpandedItems, setUncontrolledExpandedItems] = useState(
    defaultExpandedItems ??
      navigationItems
        .filter(
          (item) =>
            item.current ||
            item.children?.some(
              (child) => child.current || child.children?.some((leaf) => leaf.current),
            ),
        )
        .map((item, index) => item.id ?? String(index)),
  );
  const expandedItems = controlledExpandedItems ?? uncontrolledExpandedItems;
  const setExpandedItems = (next: string[]) => {
    if (controlledExpandedItems === undefined) setUncontrolledExpandedItems(next);
    onExpandedChange?.(next);
  };
  return (
    <nav {...props} ref={ref} className={cx("krds-side-navigation", className)}>
      <h2 className="lnb-tit">{title}</h2>
      <ul className="lnb-list" role="menubar">
        {navigationItems.map((item, topIndex) => {
          const itemId = item.id ?? String(topIndex);
          const submenuId = `krds-side-${generatedId}-${topIndex}`;
          const expanded = expandedItems.includes(itemId);
          return (
            <li className={cx("lnb-item", expanded && "active")} role="none" key={itemId}>
              <button
                type="button"
                className={cx("lnb-btn", "lnb-toggle", expanded && "active")}
                role="menuitem"
                aria-controls={submenuId}
                aria-expanded={expanded}
                disabled={item.disabled}
                onClick={() =>
                  setExpandedItems(
                    expanded
                      ? expandedItems.filter((id) => id !== itemId)
                      : [...expandedItems, itemId],
                  )
                }
              >
                {item.label}
              </button>
              <div className="lnb-submenu">
                <ul id={submenuId} role="menu">
                  {item.children?.map((child, childIndex) =>
                    child.children?.length ? (
                      <SideNavigationPopup
                        item={child}
                        panelId={`${submenuId}-${childIndex}`}
                        key={child.id ?? childIndex}
                      />
                    ) : (
                      <li
                        className={cx("lnb-subitem", child.current && "active")}
                        role="none"
                        key={child.id ?? childIndex}
                      >
                        <a
                          href={child.href ?? "#"}
                          className="lnb-btn lnb-link"
                          role="menuitem"
                          aria-current={child.current ? "page" : undefined}
                          target={child.target}
                          title={child.title as string | undefined}
                        >
                          {child.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
