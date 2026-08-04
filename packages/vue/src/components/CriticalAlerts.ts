import { defineComponent, type PropType } from "vue";

import { create } from "../shared.js";
import type { AdditionalAlertItem } from "../types.js";

export const CriticalAlerts = defineComponent({
  name: "KrdsCriticalAlerts",
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<AdditionalAlertItem[]>, default: () => [] },
  },
  setup(props, { attrs, slots: _slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create("div", { class: "main-urgent-wrap", role: "alert" }, [
        create(
          "ul",
          { ...attrs, class: ["krds-critical-alerts", className] },
          props.items.map((item: AdditionalAlertItem, itemIndex: number) => {
            const alert = item as AdditionalAlertItem;
            return create("li", { key: alert.id ?? itemIndex }, [
              create("div", { class: "critical-ban" }, [
                create(
                  "span",
                  { class: ["critical-badge", alert.tone] },
                  alert.badgeLabel ?? alert.badge,
                ),
                create("p", { class: "critical-txt" }, alert.message ?? alert.text ?? alert.title),
                alert.href
                  ? create(
                      "a",
                      { class: ["krds-btn", "medium", "basic", "link"], href: alert.href },
                      [
                        create("span", { class: "m-hide" }, alert.linkLabel),
                        " ",
                        create("i", { class: ["svg-icon", "ico-angle", "right"] }),
                      ],
                    )
                  : null,
              ]),
            ]);
          }),
        ),
      ]);
    };
  },
});
