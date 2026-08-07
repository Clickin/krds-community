import { computed, defineComponent, ref, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";
import { Badge } from "./Badge.js";

export interface TabBarItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
}

export const TabBar = defineComponent({
  name: "KrdsTabBar",
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<TabBarItem[]>, default: () => [] },
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    onChange: { type: Function as PropType<(id: string) => void>, default: undefined },
  },
  emits: {
    change: (_id: string) => true,
  },
  setup(props, { attrs, emit }) {
    const localSelected = ref(props.defaultSelected ?? props.items[0]?.id ?? "");
    const selected = computed<string>(() => props.selected ?? localSelected.value);

    const select = (id: string) => {
      if (props.selected === undefined) localSelected.value = id;
      props.onChange?.(id);
      emit("change", id);
    };

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "nav",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-tab-bar", className],
          "aria-label": props.ariaLabel ?? "주요 메뉴",
        },
        props.items.map((item) => {
          const isSelected = selected.value === item.id;
          const itemClass = ["tab-bar-item", isSelected ? "active" : undefined];
          const content = [
            item.icon
              ? create("i", { key: "icon", class: ["svg-icon", "tab-bar-icon", item.icon] })
              : null,
            create("span", { key: "label", class: "tab-bar-label" }, item.label),
            item.badge
              ? create(Badge, {
                  key: "badge",
                  label: item.badge,
                  tone: "danger",
                  appearance: "bg",
                  class: "tab-bar-badge",
                })
              : null,
          ];
          return item.href
            ? create(
                "a",
                {
                  key: item.id,
                  href: item.href,
                  class: itemClass,
                  "aria-current": isSelected ? "page" : undefined,
                  onClick: (event: MouseEvent) => {
                    event.preventDefault();
                    select(item.id);
                  },
                },
                content,
              )
            : create(
                "button",
                {
                  key: item.id,
                  type: "button",
                  class: itemClass,
                  "aria-current": isSelected ? "page" : undefined,
                  onClick: () => select(item.id),
                },
                content,
              );
        }),
      );
    };
  },
});
