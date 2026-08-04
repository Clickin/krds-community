import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { create, invokeNativeEvent, withoutClass, withoutNativeEvents } from "../shared.js";

export const ContextualHelp = defineComponent({
  name: "KrdsContextualHelp",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    position: { type: String, default: "top" },
    caption: { type: String, default: undefined },
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    href: { type: String, default: "#" },
    linkLabel: { type: String, default: undefined },
    closeLabel: { type: String, default: undefined },
    message: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  emits: {
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-contextual-help-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const localOpen = ref(props.defaultOpen);
    const setOpen = (next: boolean) => {
      if (props.open === undefined) localOpen.value = next;
      emit("openChange", next);
    };
    const open = computed<boolean>({
      get: () => props.open ?? localOpen.value,
      set: setOpen,
    });

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-contextual-help", props.position.split("-"), className],
        },
        [
          props.caption ? create("p", { class: "tooltip-txt" }, props.caption) : null,
          create("div", { class: "tooltip-action" }, [
            create(
              "button",
              {
                ...withoutClass(attrs),
                type: "button",
                class: ["krds-btn", "icon", "medium", "tooltip-btn"],
                "aria-expanded": open.value,
                "aria-controls": `${id.value}-tooltip`,
                onClick: (event: MouseEvent) => {
                  invokeNativeEvent(attrs.onClick as unknown, event);
                  setOpen(!open.value);
                },
              },
              [
                create("span", { class: "sr-only" }, props.label),
                create("i", { class: ["svg-icon", "ico-tooltip"] }),
              ],
            ),
            create(
              "div",
              { id: `${id.value}-tooltip`, class: "tooltip-popover", role: "tooltip" },
              [
                props.title ? create("h4", { class: "tooltip-title" }, props.title) : null,
                create("div", { class: "tooltip-contents" }, [
                  props.description ? create("p", props.description) : null,
                  props.href !== "#"
                    ? create("div", { class: "btn-wrap" }, [
                        create(
                          "a",
                          { class: ["krds-btn", "xsmall", "basic", "link"], href: props.href },
                          [
                            props.linkLabel,
                            create("i", { class: ["svg-icon", "ico-angle", "right"] }),
                          ],
                        ),
                      ])
                    : null,
                ]),
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "icon", "xsmall", "tooltip-close"],
                    onClick: () => setOpen(false),
                  },
                  [
                    create("span", { class: "sr-only" }, props.closeLabel),
                    create("i", { class: ["svg-icon", "ico-modal-close"] }),
                  ],
                ),
              ],
            ),
          ]),
        ],
      );
    };
  },
});
