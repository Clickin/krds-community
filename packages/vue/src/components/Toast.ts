import { defineComponent, onBeforeUnmount, ref, watch, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const CLOSE_ANIMATION_MS = 200;

export const Toast = defineComponent({
  name: "KrdsToast",
  inheritAttrs: false,
  props: {
    message: { type: String, required: true },
    tone: { type: String as PropType<"information" | "warning">, default: "information" },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    duration: { type: Number, default: undefined },
  },
  emits: {
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit }) {
    const rendered = ref(props.open === true || props.defaultOpen === true);
    const closing = ref(false);

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    const clearTimers = () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
      closeTimer = undefined;
      removeTimer = undefined;
    };

    const close = () => {
      clearTimeout(closeTimer);
      closeTimer = undefined;
      if (!rendered.value || closing.value) return;
      closing.value = true;
      removeTimer = setTimeout(() => {
        rendered.value = false;
        closing.value = false;
        emit("openChange", false);
      }, CLOSE_ANIMATION_MS);
    };

    const openToast = () => {
      clearTimers();
      closing.value = false;
      rendered.value = true;
      const delay = props.duration ?? (props.tone === "warning" ? 4000 : 3000);
      closeTimer = setTimeout(() => {
        if (props.open !== undefined) {
          emit("openChange", false);
        } else {
          close();
        }
      }, delay);
    };

    watch(
      () => props.open,
      (next) => {
        if (next === true) {
          openToast();
        } else if (next === false) {
          close();
        } else if (rendered.value) {
          // uncontrolled initial open (defaultOpen) — start the auto-close timer
          openToast();
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      clearTimers();
    });

    return () => {
      if (!rendered.value) return null;
      const className = attrs.class as string | undefined;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-toast", className, closing.value ? "closing" : undefined],
          role: props.tone === "warning" ? "alert" : "status",
        },
        [create("p", { class: "toast-text" }, props.message)],
      );
    };
  },
});
