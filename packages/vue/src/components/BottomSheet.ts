import { defineComponent, nextTick, onBeforeUnmount, ref, useId, watch, type PropType } from "vue";

import { children, create, withoutNativeEvents } from "../shared.js";

export const CLOSE_ANIMATION_MS = 200;

export const BottomSheet = defineComponent({
  name: "KrdsBottomSheet",
  inheritAttrs: false,
  props: {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    closeLabel: { type: String, default: "닫기" },
  },
  emits: {
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = `krds-bottom-sheet-${useId()}`;
    const rendered = ref(props.open === true || props.defaultOpen === true);
    const closing = ref(false);
    const sheetElement = ref<HTMLElement | null>(null);

    let previousFocus: HTMLElement | null = null;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const clearRemoveTimer = () => {
      clearTimeout(removeTimer);
      removeTimer = undefined;
    };

    const close = () => {
      if (!rendered.value || closing.value) return;
      closing.value = true;
      removeTimer = setTimeout(() => {
        rendered.value = false;
        closing.value = false;
        emit("openChange", false);
      }, CLOSE_ANIMATION_MS);
    };

    const openSheet = () => {
      clearRemoveTimer();
      closing.value = false;
      rendered.value = true;
    };

    const syncFocus = async (nextOpen: boolean) => {
      if (typeof document === "undefined") return;
      if (nextOpen) {
        previousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        await nextTick();
        sheetElement.value?.querySelector<HTMLElement>("button, [href], input")?.focus();
      } else {
        previousFocus?.focus();
        previousFocus = null;
      }
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    watch(
      () => props.open,
      (next) => {
        if (next === true) {
          openSheet();
          void syncFocus(true);
        } else if (next === false) {
          close();
          void syncFocus(false);
        } else if (rendered.value) {
          // uncontrolled initial open (defaultOpen) — move focus in on mount
          void syncFocus(true);
        }
      },
      { immediate: true },
    );

    watch(
      rendered,
      (visible) => {
        if (typeof document === "undefined") return;
        if (visible) document.addEventListener("keydown", onKeydown);
        else document.removeEventListener("keydown", onKeydown);
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      clearRemoveTimer();
      if (typeof document !== "undefined") document.removeEventListener("keydown", onKeydown);
      void syncFocus(false);
    });

    return () => {
      if (!rendered.value) return null;
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          ref: sheetElement,
          class: ["krds-bottom-sheet", className, closing.value ? "closing" : undefined],
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": props.title ? `${generatedId}-title` : undefined,
        },
        [
          create("button", {
            type: "button",
            class: "bottom-sheet-overlay",
            "data-close": "",
            "aria-label": props.closeLabel,
            onClick: () => close(),
          }),
          create("div", { class: "bottom-sheet-panel", role: "document" }, [
            create("button", {
              type: "button",
              class: "bottom-sheet-handle",
              "aria-hidden": "true",
              tabindex: -1,
              onClick: () => close(),
            }),
            props.title
              ? create("div", { class: "bottom-sheet-header" }, [
                  create(
                    "h2",
                    { id: `${generatedId}-title`, class: "bottom-sheet-title" },
                    props.title,
                  ),
                  props.description
                    ? create("p", { class: "bottom-sheet-description" }, props.description)
                    : null,
                ])
              : null,
            create("div", { class: "bottom-sheet-body" }, slotChildren),
            create(
              "button",
              {
                type: "button",
                class: ["krds-btn", "medium", "icon", "bottom-sheet-close"],
                "aria-label": props.closeLabel,
                onClick: () => close(),
              },
              [create("i", { class: ["svg-icon", "ico-modal-close"] })],
            ),
          ]),
        ],
      );
    };
  },
});
