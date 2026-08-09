import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx, tabRecipe } from "@krds-community/recipes";
import type { KrdsTabItem } from "@krds-community/recipes";

export interface TabItem extends Omit<KrdsTabItem, "label"> {
  label: ReactNode;
  tabId?: string;
  panelId?: string;
  quickNav?: boolean;
}

export interface TabProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  tabs?: TabItem[];
  panels: Record<string, ReactNode>;
  defaultTab?: string;
  defaultValue?: string;
  value?: string;
  selected?: string;
  message?: ReactNode;
  panelTitle?: ReactNode;
  full?: boolean;
  onTabChange?: (id: string) => void;
  onChange?: (id: string) => void;
}
export function Tab({
  tabs = [],
  panels,
  defaultTab,
  defaultValue,
  value,
  selected,
  message,
  panelTitle,
  full = true,
  onTabChange,
  onChange,
  className,
  ref,
  ...props
}: TabProps & { ref?: Ref<HTMLDivElement> }) {
  const controlledSelected = value ?? selected;
  const selectedControlled = value !== undefined || selected !== undefined;
  const firstEnabled = tabs.find((tab) => !tab.disabled);
  const requestedDefault = defaultValue ?? defaultTab;
  const initialSelected = tabs.some((tab) => tab.id === requestedDefault && !tab.disabled)
    ? (requestedDefault ?? "")
    : (firstEnabled?.id ?? "");
  const [uncontrolledSelected, setUncontrolledSelected] = useState(initialSelected);
  const requestedSelected = controlledSelected ?? uncontrolledSelected;
  const activeTab = tabs.some((tab) => tab.id === requestedSelected && !tab.disabled)
    ? requestedSelected
    : (firstEnabled?.id ?? "");
  const tabClasses = tabRecipe({ full });
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  const selectTab = (id: string) => {
    const tab = tabs.find((item) => item.id === id);
    if (!tab || tab.disabled) return;
    if (!selectedControlled) setUncontrolledSelected(id);
    onTabChange?.(id);
    onChange?.(id);
  };
  return (
    <div {...props} ref={ref} className={cx(tabClasses.root, className)}>
      <div className={tabClasses.listContainer}>
        <ul role="tablist">
          {tabs.map((tab) => {
            const tabId = tab.tabId ?? `tab_${tab.id}`;
            const panelId = tab.panelId ?? `panel_${tab.id}`;
            const active = activeTab === tab.id;
            const itemClass = tabRecipe({ full, active }).item;
            return (
              <li role="presentation" className={itemClass || undefined} key={tab.id}>
                <button
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  className={tabClasses.trigger}
                  disabled={tab.disabled}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(event) => {
                    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                      return;
                    }
                    const currentIndex = enabledTabs.findIndex((item) => item.id === tab.id);
                    const nextIndex =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? enabledTabs.length - 1
                          : event.key === "ArrowRight"
                            ? (currentIndex + 1) % enabledTabs.length
                            : (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
                    const nextTab = enabledTabs[nextIndex];
                    if (!nextTab) return;
                    event.preventDefault();
                    selectTab(nextTab.id);
                    const nextTabId = nextTab.tabId ?? `tab_${nextTab.id}`;
                    event.currentTarget.ownerDocument.getElementById(nextTabId)?.focus();
                  }}
                >
                  {tab.label}
                  {active && message ? <i className="sr-only created"> {message}</i> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="tab-conts-wrap">
        {tabs.map((tab) => {
          const tabId = tab.tabId ?? `tab_${tab.id}`;
          const panelId = tab.panelId ?? `panel_${tab.id}`;
          return (
            <section
              id={panelId}
              aria-labelledby={tabId}
              role="tabpanel"
              className={cx("tab-conts", activeTab === tab.id && "active")}
              hidden={activeTab !== tab.id}
              data-quick-nav={tab.quickNav ?? false}
              key={tab.id}
            >
              {panelTitle ? <h3 className="sr-only">{panelTitle}</h3> : null}
              {panels[tab.id]}
            </section>
          );
        })}
      </div>
    </div>
  );
}
