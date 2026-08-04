import { defineComponent } from "vue";

import { children, create } from "../shared.js";

export const CoachMark = defineComponent({
  name: "KrdsCoachMark",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    title: { type: String, default: undefined },
    step: { type: String, default: undefined },
    stepTitle: { type: String, default: undefined },
    description: { type: String, default: undefined },
    currentStep: { type: String, default: undefined },
    totalSteps: { type: String, default: undefined },
    currentStepLabel: { type: String, default: undefined },
    totalStepsLabel: { type: String, default: undefined },
    stopLabel: { type: String, default: undefined },
    nextLabel: { type: String, default: undefined },
    contentTitle: { type: String, default: undefined },
    label: { type: String, default: undefined },
  },
  emits: {
    close: () => true,
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const className = attrs.class as string | undefined;
      const slotChildren = children(slots);
      const [fallbackCurrent = "", fallbackTotal = ""] = (props.step ?? "").split("/");
      const currentStep = props.currentStep ?? fallbackCurrent;
      const totalSteps = props.totalSteps ?? fallbackTotal;
      return create(
        "div",
        {
          ...attrs,
          class: ["krds-coach-mark", "txt-box", "bg-white", "bg-white", className],
        },
        [
          create("div", { class: "coach-balloon" }, [
            create("h5", { class: "sr-only" }, props.title),
            create("h6", { class: "coach-tit" }, props.stepTitle),
            props.description ? create("p", { class: "desc" }, props.description) : null,
            create("div", { class: "coach-controls" }, [
              create("div", { class: "num" }, [
                create("span", { class: "sr-only" }, props.currentStepLabel),
                create("strong", currentStep),
                create("span", { class: "sr-only" }, props.totalStepsLabel),
                create("span", totalSteps),
              ]),
              create("div", { class: "btn-wrap" }, [
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "small", "text"],
                    onClick: () => emit("close"),
                  },
                  props.stopLabel,
                ),
                create(
                  "button",
                  { type: "button", class: ["krds-btn", "small", "tertiary"] },
                  props.nextLabel,
                ),
              ]),
            ]),
          ]),
          create("div", [
            create("h3", props.contentTitle ?? (slotChildren.length ? slotChildren : props.label)),
          ]),
        ],
      );
    };
  },
});
