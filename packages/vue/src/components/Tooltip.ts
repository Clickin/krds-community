import { computed, defineComponent, Fragment, useId } from "vue";

import { children, create } from "../shared.js";

export const Tooltip = defineComponent({
  name: "KrdsTooltip",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    type: { type: String, default: undefined },
    name: { type: String, default: undefined },
    disabled: Boolean,
    message: { type: String, default: "" },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const generatedId = `krds-tooltip-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const tooltipId = `${id.value}-tooltip`;
      return create(Fragment, null, [
        create(
          "button",
          {
            ...attrs,
            id: props.id,
            type: props.type ?? "button",
            name: props.name,
            disabled: props.disabled,
            class: ["krds-btn", "small", "text", "krds-tooltip", className],
            "aria-labelledby":
              typeof attrs["aria-labelledby"] === "string"
                ? `${attrs["aria-labelledby"]} ${tooltipId}`
                : tooltipId,
            "data-tooltip": props.message,
          },
          [
            slotChildren.length ? slotChildren : props.label,
            " ",
            create("i", { class: ["svg-icon", "ico-angle", "right"] }),
          ],
        ),
        create(
          "div",
          {
            id: tooltipId,
            class: "krds-tooltip-popover",
            "aria-hidden": "true",
          },
          [create("span", { class: "sr-only" }, props.label), props.message],
        ),
      ]);
    };
  },
});

export const TooltipBox = defineComponent({
  name: "KrdsTooltipBox",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    type: { type: String, default: undefined },
    name: { type: String, default: undefined },
    disabled: Boolean,
    message: { type: String, default: "" },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const generatedId = `krds-tooltip-box-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const tooltipId = `${id.value}-tooltip`;
      return create(Fragment, null, [
        create(
          "button",
          {
            ...attrs,
            id: props.id,
            type: props.type ?? "button",
            name: props.name,
            disabled: props.disabled,
            class: ["krds-btn", "small", "text", "krds-tooltip", "tooltip-box", className],
            "aria-labelledby":
              typeof attrs["aria-labelledby"] === "string"
                ? `${attrs["aria-labelledby"]} ${tooltipId}`
                : tooltipId,
            "data-tooltip": props.message,
          },
          [
            slotChildren.length ? slotChildren : props.label,
            " ",
            create("i", { class: ["svg-icon", "ico-angle", "right"] }),
          ],
        ),
        create(
          "div",
          {
            id: tooltipId,
            class: "krds-tooltip-popover",
            "aria-hidden": "true",
          },
          [create("span", { class: "sr-only" }, props.label), props.message],
        ),
      ]);
    };
  },
});

export const TooltipVertical = defineComponent({
  name: "KrdsTooltipVertical",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    type: { type: String, default: undefined },
    name: { type: String, default: undefined },
    disabled: Boolean,
    message: { type: String, default: "" },
    label: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const generatedId = `krds-tooltip-vertical-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const tooltipId = `${id.value}-tooltip`;
      return create(Fragment, null, [
        create(
          "button",
          {
            ...attrs,
            id: props.id,
            type: props.type ?? "button",
            name: props.name,
            disabled: props.disabled,
            class: ["krds-btn", "small", "text", "krds-tooltip", "tooltip-vertical", className],
            "aria-labelledby":
              typeof attrs["aria-labelledby"] === "string"
                ? `${attrs["aria-labelledby"]} ${tooltipId}`
                : tooltipId,
            "data-tooltip": props.message,
          },
          [
            slotChildren.length ? slotChildren : props.label,
            " ",
            create("i", { class: ["svg-icon", "ico-angle", "right"] }),
          ],
        ),
        create(
          "div",
          {
            id: tooltipId,
            class: "krds-tooltip-popover",
            "aria-hidden": "true",
          },
          [create("span", { class: "sr-only" }, props.label), props.message],
        ),
      ]);
    };
  },
});
