import { mergeProps, splitProps, type JSX } from "solid-js";

export interface CoachMarkProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  open?: boolean;
  title?: string;
  stepTitle?: string;
  description?: string;
  currentStepLabel?: string;
  currentStep?: string;
  totalStepsLabel?: string;
  totalSteps?: string;
  stopLabel?: string;
  nextLabel?: string;
  contentTitle?: string;
  step?: string;
  label?: string;
  [key: string]: unknown;
}

export function CoachMark(rawProps: CoachMarkProps) {
  const merged = mergeProps(
    { currentStepLabel: "현재 단계", totalStepsLabel: "총 단계" },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "title",
    "stepTitle",
    "description",
    "currentStepLabel",
    "currentStep",
    "totalStepsLabel",
    "totalSteps",
    "stopLabel",
    "nextLabel",
    "contentTitle",
    "open",
    "step",
    "label",
  ]);
  const className = () => props.class ?? props.className ?? "";
  // react baseline: `step="1 / 2"` → current "1", total "2"; explicit
  // currentStep/totalSteps override the parsed values.
  const stepParts = () => {
    const [current = "", total = ""] = (props.step ?? "1 / 1")
      .split("/")
      .map((part) => part.trim());
    return { current, total };
  };
  return (
    <div
      {...(native as Record<string, any>)}
      hidden={props.open === false}
      class={["krds-coach-mark", "txt-box", "bg-white", "bg-white", className()]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="coach-balloon">
        <h5 class="sr-only">{props.title}</h5>
        <h6 class="coach-tit">{props.stepTitle}</h6>
        <p class="desc">{props.description}</p>
        <div class="coach-controls">
          <div class="num">
            <span class="sr-only">{props.currentStepLabel}</span>
            <strong>{props.currentStep ?? stepParts().current}</strong>
            <span class="sr-only">{props.totalStepsLabel}</span>
            <span>{props.totalSteps ?? stepParts().total}</span>
          </div>
          <div class="btn-wrap">
            <button type="button" class="krds-btn small text">
              {props.stopLabel}
            </button>
            <button type="button" class="krds-btn small tertiary">
              {props.nextLabel}
            </button>
          </div>
        </div>
      </div>
      <div>
        <h3>{props.contentTitle ?? props.children}</h3>
      </div>
    </div>
  );
}
