import { defineComponent, onBeforeUnmount, ref, watch, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const CLOSE_ANIMATION_MS = 200;

export const Snackbar = defineComponent({
  name: "KrdsSnackbar",
  inheritAttrs: false,
  props: {
    title: { type: String, default: undefined },
    message: { type: String, required: true },
    icon: { type: String, default: undefined },
    actionLabel: { type: String, default: undefined },
    closeLabel: { type: String, default: "닫기" },
    onAction: { type: Function as PropType<() => void>, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  emits: {
    openChange: (_open: boolean) => true,
    action: () => true,
  },
  setup(props, { attrs, emit }) {
    const rendered = ref(props.open === true || props.defaultOpen === true);
    const closing = ref(false);

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

    const openSnackbar = () => {
      clearRemoveTimer();
      closing.value = false;
      rendered.value = true;
    };

    watch(
      () => props.open,
      (next) => {
        if (next === true) {
          openSnackbar();
        } else if (next === false) {
          close();
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(clearRemoveTimer);

    return () => {
      if (!rendered.value) return null;
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-snackbar", className, closing.value ? "closing" : undefined],
          role: "alert",
        },
        [
          props.icon
            ? create("i", {
                class: ["svg-icon", "snackbar-icon", props.icon],
                "aria-hidden": "true",
              })
            : null,
          create("div", { class: "snackbar-conts" }, [
            props.title ? create("strong", { class: "snackbar-title" }, props.title) : null,
            create("p", { class: "snackbar-text" }, props.message),
          ]),
          props.actionLabel
            ? create(
                "button",
                {
                  type: "button",
                  class: ["krds-btn", "small", "text", "snackbar-action"],
                  onClick: () => {
                    props.onAction?.();
                    emit("action");
                  },
                },
                props.actionLabel,
              )
            : null,
          create(
            "button",
            {
              type: "button",
              class: ["krds-btn", "small", "icon", "snackbar-close"],
              "aria-label": props.closeLabel,
              onClick: close,
            },
            [create("i", { class: ["svg-icon", "ico-modal-close"] })],
          ),
        ],
      );
    };
  },
});
