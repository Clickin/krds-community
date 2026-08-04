import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { type BoxProps } from "./_utils.js";

export interface CoachMarkProps extends BoxProps {
  title?: string;
  step?: string;
  stepTitle?: ReactNode;
  description?: ReactNode;
  contentTitle?: ReactNode;
  currentStep?: ReactNode;
  totalSteps?: ReactNode;
  currentStepLabel?: string;
  totalStepsLabel?: string;
  stopLabel?: ReactNode;
  nextLabel?: ReactNode;
  onNext?: () => void;
  onClose?: () => void;
}

export function CoachMark({
  title,
  step = "1 / 1",
  stepTitle,
  description,
  contentTitle,
  currentStep,
  totalSteps,
  currentStepLabel = "현재 단계",
  totalStepsLabel = "총 단계",
  stopLabel,
  nextLabel,
  onNext,
  onClose,
  children,
  className,
}: CoachMarkProps) {
  const [stepCurrent = "", stepTotal = ""] = step.split("/").map((part) => part.trim());
  return (
    <div className={cx("txt-box", "bg-white", "bg-white", "krds-coach-mark", className)}>
      <div className="coach-balloon">
        {title ? <h5 className="sr-only">{title}</h5> : null}
        <h6 className="coach-tit">{stepTitle}</h6>
        <p className="desc">{description}</p>
        <div className="coach-controls">
          <div className="num">
            <span className="sr-only">{currentStepLabel}</span>
            <strong>{currentStep ?? stepCurrent}</strong>
            <span className="sr-only">{totalStepsLabel}</span>
            <span>{totalSteps ?? stepTotal}</span>
          </div>
          <div className="btn-wrap">
            <button type="button" className="krds-btn small text" onClick={onClose}>
              {stopLabel}
            </button>
            <button type="button" className="krds-btn small tertiary" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
      <div>
        <h3>{children ?? contentTitle}</h3>
      </div>
    </div>
  );
}
