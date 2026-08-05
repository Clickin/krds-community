import { computed, defineComponent, ref, type PropType } from "vue";

import { children, create, invokeNativeEvent } from "../shared.js";

export const Tts = defineComponent({
  name: "KrdsTts",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    disabled: Boolean,
    playing: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean, default: false },
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<
        string | number | boolean | string[] | undefined
      >,
      default: undefined,
    },
    size: { type: String, default: undefined },
    label: { type: String, default: undefined },
    text: { type: String, default: undefined },
    iconOnly: Boolean,
  },
  emits: {
    "update:modelValue": (_value: boolean) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const initialChecked =
      props.defaultChecked ??
      props.checked ??
      (typeof props.modelValue === "boolean" ? props.modelValue : false);
    const localChecked = ref(initialChecked);
    const checked = computed(() => {
      if (props.checked !== undefined) return props.checked;
      if (typeof props.modelValue === "boolean") return props.modelValue;
      return localChecked.value;
    });
    const setChecked = (next: boolean) => {
      if (props.checked === undefined && typeof props.modelValue !== "boolean") {
        localChecked.value = next;
      }
      emit("update:modelValue", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const isPlaying = props.playing ?? checked.value;
      return create(
        "button",
        {
          ...attrs,
          type: "button",
          disabled: props.disabled,
          class: ["krds-tts", props.size ?? "medium", className],
          "aria-pressed":
            props.playing !== undefined || props.checked !== undefined ? isPlaying : undefined,
          onClick: (event: MouseEvent) => {
            invokeNativeEvent(attrs.onClick, event);
            setChecked(!isPlaying);
          },
        },
        [
          create("span", { class: "krds-tts-icon", "aria-hidden": "true" }, [
            create("i", {
              class: ["svg-icon", isPlaying ? "ico-stop" : "ico-volume"],
            }),
          ]),
          create(
            "span",
            { class: "krds-tts-text" },
            slotChildren.length ? slotChildren : [props.text],
          ),
        ],
      );
    };
  },
});
