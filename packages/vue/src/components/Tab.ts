import { computed, defineComponent, nextTick, ref, useId, type PropType } from "vue";

import { tabRecipe } from "@krds-community/recipes";
import { children, create, withoutNativeEvents } from "../shared.js";
import type { AdditionalTabItem } from "../types.js";

export const Tab = defineComponent({
  name: "KrdsTab",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    tabs: { type: Array as PropType<AdditionalTabItem[]>, default: () => [] },
    panels: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
    message: { type: String, default: undefined },
    panelTitle: { type: String, default: undefined },
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    defaultValue: { type: [String, Number, Boolean, Array], default: undefined },
    modelValue: { type: [String, Number, Boolean, Array], default: undefined },
  },
  emits: {
    "update:modelValue": (_value: any) => true,
    valueChange: (_value: any) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-tab-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const initialSelected =
      props.defaultSelected ??
      (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
      (typeof props.defaultValue === "string" ? props.defaultValue : undefined) ??
      props.tabs[0]?.id ??
      "";
    const localSelected = ref(initialSelected);
    const setSelected = (next: string) => {
      if (props.selected === undefined && typeof props.modelValue !== "string") {
        localSelected.value = next;
      }
      emit("update:modelValue", next);
      emit("valueChange", next);
    };
    const selected = computed<string>({
      get: () =>
        props.selected ??
        (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
        localSelected.value,
      set: setSelected,
    });

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const active = selected.value;
      const tabClasses = tabRecipe();
      const enabledTabs = props.tabs.filter((tab) => !tab.disabled);
      const moveTab = (event: KeyboardEvent, tabId: string) => {
        const currentIndex = enabledTabs.findIndex((tab) => tab.id === tabId);
        if (currentIndex < 0 || !enabledTabs.length) return;
        let nextIndex = currentIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % enabledTabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = enabledTabs.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        const nextTab = enabledTabs[nextIndex];
        if (!nextTab) return;
        const ownerDocument = (event.currentTarget as HTMLElement).ownerDocument;
        setSelected(nextTab.id);
        void nextTick(() => {
          ownerDocument.getElementById(`${id.value}-tab-${nextTab.id}`)?.focus();
        });
      };
      return create("div", { ...withoutNativeEvents(attrs), class: [tabClasses.root, className] }, [
        create(
          "div",
          { class: tabClasses.listContainer },
          create(
            "ul",
            { role: "tablist" },
            props.tabs.map((tab) => {
              const tabId = `${id.value}-tab-${tab.id}`;
              const panelId = `${id.value}-panel-${tab.id}`;
              const isActive = active === tab.id;
              return create(
                "li",
                {
                  key: tab.id,
                  role: "presentation",
                  class: tabRecipe({ active: isActive }).item,
                },
                create(
                  "button",
                  {
                    id: tabId,
                    type: "button",
                    role: "tab",
                    "aria-selected": isActive,
                    "aria-controls": panelId,
                    tabindex: isActive ? 0 : -1,
                    class: tabClasses.trigger,
                    disabled: tab.disabled,
                    onClick: () => setSelected(tab.id),
                    onKeydown: (event: KeyboardEvent) => moveTab(event, tab.id),
                  },
                  [
                    tab.label,
                    isActive
                      ? create(
                          "i",
                          { class: ["sr-only", "created"] },
                          ` ${props.message ?? "선택됨"}`,
                        )
                      : null,
                  ],
                ),
              );
            }),
          ),
        ),
        create(
          "div",
          { class: "tab-conts-wrap" },
          props.tabs.map((tab) => {
            const tabId = `${id.value}-tab-${tab.id}`;
            const panelId = `${id.value}-panel-${tab.id}`;
            const isActive = active === tab.id;
            return create(
              "section",
              {
                key: panelId,
                id: panelId,
                role: "tabpanel",
                "aria-labelledby": tabId,
                class: ["tab-conts", isActive ? "active" : undefined],
                "data-quick-nav": "false",
                hidden: !isActive,
              },
              [
                props.panelTitle ? create("h3", { class: "sr-only" }, props.panelTitle) : null,
                props.panels[tab.id] ?? (isActive ? slotChildren : ""),
              ],
            );
          }),
        ),
      ]);
    };
  },
});
