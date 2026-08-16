import type { ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsStep } from "@krds-community/recipes";

export function StepIndicator({
  steps = [],
  current = 0,
  label = "단계",
  message = "현재단계",
  className,
}: {
  steps?: KrdsStep[];
  current?: number;
  label?: ReactNode;
  message?: ReactNode;
  className?: string;
}) {
  const currentIndex = current;
  return (
    <ol className={cx("krds-step-wrap", className)}>
      {steps.map((step, index) => (
        <li
          className={
            cx(index < currentIndex && "done", index === currentIndex && "active") || undefined
          }
          key={step.id}
        >
          <span>
            {index === currentIndex ? <em className="sr-only">{message}</em> : null}
            <i className="step">
              {typeof label === "string" || typeof label === "number" ? (
                `${index + 1}${label}`
              ) : (
                <>
                  {index + 1}
                  {label}
                </>
              )}
            </i>
            <span className="step-tit">{step.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
