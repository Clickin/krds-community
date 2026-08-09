import { defineComponent, type PropType } from "vue";

import { create } from "../shared.js";
import type { KrdsStep } from "@krds-community/recipes";

export const StepIndicator = defineComponent({
  name: "KrdsStepIndicator",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    steps: { type: Array as PropType<KrdsStep[]>, default: () => [] },
    current: { type: Number, default: undefined },
    defaultCurrent: { type: Number, default: 0 },
    label: { type: String, default: "단계" },
    message: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "ol",
        { ...attrs, class: ["krds-step-wrap", className] },
        props.steps.map((step: any, stepIndex: number) => {
          const stepNumber = stepIndex + 1;
          const currentStepIndex = props.current ?? props.defaultCurrent ?? 0;
          const isCurrent = stepIndex === currentStepIndex;
          return create(
            "li",
            {
              key: step.id,
              class: stepIndex < currentStepIndex ? "done" : isCurrent ? "active" : undefined,
            },
            create("span", [
              isCurrent ? create("em", { class: "sr-only" }, props.message) : null,
              create("i", { class: "step" }, `${stepNumber}${props.label}`),
              create("span", { class: "step-tit" }, step.label),
            ]),
          );
        }),
      );
    };
  },
});
