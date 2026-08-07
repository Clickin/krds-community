import { defineComponent, useId, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";
import { Badge } from "./Badge.js";

export interface CardAction {
  label: string;
  onClick?: () => void;
}

export interface CardCheckboxProps {
  label: string;
  modelValue?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  size?: "medium" | "large";
}

export const Card = defineComponent({
  name: "KrdsCard",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<"vertical" | "horizontal">, default: "vertical" },
    image: { type: String, default: undefined },
    imageAlt: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    badges: { type: Array as PropType<string[]>, default: () => [] },
    actions: { type: Array as PropType<CardAction[]>, default: () => [] },
    checkbox: {
      type: Object as PropType<CardCheckboxProps | undefined>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const checkboxId = `krds-card-checkbox-${useId()}`;

    return () => {
      const className = attrs.class as string | undefined;
      const showTop =
        props.image !== undefined || props.badges.length > 0 || props.checkbox !== undefined;
      return create(
        "article",
        { ...withoutNativeEvents(attrs), class: ["krds-card", props.type, className] },
        [
          showTop
            ? create("div", { class: "card-top" }, [
                props.checkbox
                  ? create("div", { class: ["krds-form-check", props.checkbox.size] }, [
                      create("input", {
                        id: checkboxId,
                        type: "checkbox",
                        name: props.checkbox.name,
                        checked:
                          props.checkbox.modelValue !== undefined
                            ? props.checkbox.modelValue
                            : props.checkbox.defaultChecked === true,
                        disabled: props.checkbox.disabled,
                      }),
                      create("label", { for: checkboxId }, props.checkbox.label),
                    ])
                  : null,
                props.image !== undefined
                  ? create("img", {
                      class: "card-image",
                      src: props.image,
                      alt: props.imageAlt ?? "",
                    })
                  : null,
                props.badges.length
                  ? props.badges.map((badge, badgeIndex) =>
                      create(Badge, {
                        key: badgeIndex,
                        label: badge,
                        tone: "primary",
                        appearance: "bg",
                        class: "card-badge",
                      }),
                    )
                  : null,
              ])
            : null,
          create("div", { class: "card-conts" }, [
            create("h3", { class: "card-title" }, props.title),
            props.description
              ? create("p", { class: "card-description" }, props.description)
              : null,
            props.actions.length
              ? create(
                  "div",
                  { class: "card-actions" },
                  props.actions.map((action, actionIndex) =>
                    create(
                      "button",
                      {
                        key: actionIndex,
                        type: "button",
                        class: ["krds-btn", "small", "primary"],
                        onClick: () => action.onClick?.(),
                      },
                      action.label,
                    ),
                  ),
                )
              : null,
          ]),
        ],
      );
    };
  },
});
