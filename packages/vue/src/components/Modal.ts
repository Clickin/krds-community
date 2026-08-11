import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type PropType,
} from "vue";

import { children, create, itemLabel, withoutNativeEvents } from "../shared.js";
import type { AnyItem } from "../types.js";

export const Modal = defineComponent({
  name: "KrdsModal",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    items: { type: Array as PropType<AnyItem[]>, default: () => [] },
    cancelLabel: { type: String, default: undefined },
    confirmLabel: { type: String, default: undefined },
    closeLabel: { type: String, default: "닫기" },
    sample: Boolean,
  },
  emits: {
    close: () => true,
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-modal-${useId()}`;
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

    const modalElement = ref<HTMLElement | null>(null);
    let previousFocus: HTMLElement | null = null;
    const syncModalFocus = async (nextOpen: boolean) => {
      if (typeof document === "undefined") return;
      if (nextOpen) {
        previousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        await nextTick();
        modalElement.value?.querySelector<HTMLElement>("button, [href], input")?.focus();
      } else {
        previousFocus?.focus();
        previousFocus = null;
      }
    };

    watch(open, (nextOpen) => {
      void syncModalFocus(nextOpen);
    });
    onBeforeUnmount(() => {
      void syncModalFocus(false);
    });

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "section",
        {
          ...withoutNativeEvents(attrs),
          ref: modalElement,
          id: id.value,
          class: ["krds-modal", "fade", open.value && "in", open.value && "shown", className],
          role: "dialog",
          "aria-labelledby": `${id.value}-title`,
        },
        [
          create("div", { class: "modal-dialog" }, [
            create("div", { class: "modal-content" }, [
              create("div", { class: "modal-header" }, [
                create("h2", { id: `${id.value}-title`, class: "modal-title" }, props.title),
              ]),
              create("div", { class: "modal-conts" }, [
                create(
                  "div",
                  { class: "conts-area" },
                  slotChildren.length
                    ? slotChildren
                    : props.items.length
                      ? props.items.flatMap((item, itemIndex) =>
                          itemIndex
                            ? [create("br", { key: `break-${itemIndex}` }), itemLabel(item)]
                            : [itemLabel(item)],
                        )
                      : props.description,
                ),
              ]),
              create("div", { class: ["btn-wrap", "modal-btn"] }, [
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "medium", "tertiary", "close-modal"],
                    onClick: () => {
                      setOpen(false);
                      emit("close");
                    },
                  },
                  props.cancelLabel,
                ),
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "medium", "primary", "close-modal"],
                    onClick: () => {
                      setOpen(false);
                      emit("close");
                    },
                  },
                  props.confirmLabel,
                ),
              ]),
              create(
                "button",
                {
                  type: "button",
                  class: ["krds-btn", "icon", "medium", "btn-close", "close-modal"],
                  onClick: () => {
                    setOpen(false);
                    emit("close");
                  },
                },
                [
                  create("span", { class: "sr-only" }, props.closeLabel),
                  create("i", { class: ["svg-icon", "ico-popup-close"] }),
                ],
              ),
            ]),
          ]),
          create("div", {
            class: ["modal-back", open.value && "in"],
          }),
        ],
      );
    };
  },
});
