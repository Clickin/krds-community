import { For, Show, createSignal, mergeProps, splitProps } from "solid-js";
import { tabRecipe } from "@krds-community/recipes";
import type { KrdsTabItem } from "@krds-community/recipes";

export interface TabItem extends KrdsTabItem {}
export interface TabProps {
  class?: string;
  className?: string;
  tabs?: KrdsTabItem[];
  panels?: Record<string, string>;
  panelTitle?: string;
  message?: string;
  selected?: string;
  defaultValue?: string;
  modelValue?: string;
  value?: string;
  [key: string]: unknown;
}

export function Tab(rawProps: TabProps) {
  const merged = mergeProps(
    { tabs: [] as KrdsTabItem[], panels: {} as Record<string, string> },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "tabs",
    "panels",
    "panelTitle",
    "message",
    "selected",
    "defaultValue",
    "modelValue",
    "value",
  ]);
  const [localSelected, setLocalSelected] = createSignal<string>();
  const selected = () => {
    const mv = props.modelValue;
    if (typeof mv === "string" || typeof mv === "number") return String(mv);
    return props.selected ?? localSelected() ?? props.defaultValue ?? props.tabs[0]?.id ?? "";
  };
  const setSelected = (next: string) => {
    if (props.modelValue === undefined) setLocalSelected(next);
  };
  const tabClasses = (active?: boolean) => tabRecipe({ full: true, active });
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={[tabClasses().root, className()].filter(Boolean).join(" ")}
    >
      <div class={tabClasses().listContainer}>
        <ul role="tablist">
          <For each={props.tabs}>
            {(tab) => {
              const active = () => selected() === tab.id;
              const tabId = `tab-${tab.id}`;
              const panelId = `panel-${tab.id}`;
              return (
                <li role="presentation" class={tabClasses(active()).item}>
                  <button
                    id={tabId}
                    type="button"
                    class={tabClasses().trigger}
                    role="tab"
                    tabIndex={active() ? 0 : -1}
                    disabled={tab.disabled}
                    aria-selected={active()}
                    aria-controls={panelId}
                    onClick={(event) => {
                      setSelected(tab.id);
                      (native as Record<string, any>).onChange?.(event);
                    }}
                  >
                    {tab.label}
                    <Show when={active()}>
                      <i class="sr-only created">{props.message}</i>
                    </Show>
                  </button>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
      <div class="tab-conts-wrap">
        <For each={props.tabs}>
          {(tab) => {
            const active = () => selected() === tab.id;
            return (
              <Show when={props.panels[tab.id] !== undefined}>
                <section
                  id={`panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  class="tab-conts"
                  data-quick-nav="false"
                  classList={{ active: active() }}
                  hidden={!active()}
                >
                  <Show when={props.panelTitle}>
                    <h3 class="sr-only">{props.panelTitle}</h3>
                  </Show>
                  {props.panels[tab.id]}
                </section>
              </Show>
            );
          }}
        </For>
      </div>
    </div>
  );
}
