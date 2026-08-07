import { useId, useState, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { Radio } from "./Radio.js";
import type { BoxProps } from "./_utils.js";

const defaultOptions: UserFeedbackOption[] = [
  { value: "satisfied", label: "만족" },
  { value: "dissatisfied", label: "불만족" },
];

export interface UserFeedbackOption {
  value: string;
  label: string;
}

export interface UserFeedbackProps extends BoxProps {
  title?: ReactNode;
  options?: UserFeedbackOption[];
  onSubmit?: (value: string) => void;
  submitLabel?: ReactNode;
}

export function UserFeedback({
  title = "이 페이지에 만족하시나요?",
  options = defaultOptions,
  onSubmit,
  submitLabel = "제출",
  className,
}: UserFeedbackProps) {
  const generatedId = useId();
  const name = `krds-feedback-${generatedId}`;
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <div className={cx("krds-user-feedback", className)}>
      <fieldset>
        <legend className="feedback-title">{title}</legend>
        <div className="feedback-options">
          {options.map((option) => (
            <Radio
              key={option.value}
              name={name}
              value={option.value}
              label={option.label}
              checked={selected === option.value}
              onChange={() => setSelected(option.value)}
            />
          ))}
        </div>
        <button
          type="button"
          className="krds-btn small primary"
          onClick={() => {
            if (selected) onSubmit?.(selected);
          }}
        >
          {submitLabel}
        </button>
      </fieldset>
    </div>
  );
}
