import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { children, create, itemLabel, withoutClass, withoutNativeEvents } from "../shared.js";

export const Disclosure = defineComponent({
  name: "KrdsDisclosure",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    title: { type: String, default: undefined },
    label: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    items: { type: Array as PropType<import("../types.js").AnyItem[]>, default: () => [] },
  },
  emits: {
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-disclosure-${useId()}`;
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
      const slotChildren = children(slots);
      const triggerId = `${id.value}-trigger`;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-disclosure", "conts-expand-area", className],
        },
        [
          create(
            "button",
            {
              ...withoutClass(attrs),
              id: triggerId,
              type: "button",
              class: "btn-conts-expand",
              "aria-controls": id.value,
              "aria-expanded": open.value,
              onClick: () => setOpen(!open.value),
            },
            props.title ?? props.label,
          ),
          create(
            "div",
            {
              id: id.value,
              class: "expand-wrap",
              role: "region",
              "aria-labelledby": triggerId,
              inert: open.value ? undefined : "",
            },
            create(
              "div",
              { class: "expand-in" },
              props.items.length
                ? create(
                    "ul",
                    { class: ["krds-info-list", "dash"], role: "list" },
                    props.items.map((item: import("../types.js").AnyItem, itemIndex: number) =>
                      create("li", { key: itemIndex, role: "listitem" }, itemLabel(item)),
                    ),
                  )
                : slotChildren,
            ),
          ),
        ],
      );
    };
  },
});
