import { useId, type TextareaHTMLAttributes, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { NativeCommonProps, LabelProps } from "./_utils.js";

export interface TextareaProps
  extends
    Omit<NativeCommonProps, "rows">,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "className">,
    LabelProps {
  maxLength?: number;
  className?: string;
}

export function Textarea({
  label = "내용",
  hint,
  id: providedId,
  className,
  "aria-describedby": ariaDescribedBy,
  ref,
  ...props
}: TextareaProps & { ref?: Ref<HTMLTextAreaElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-textarea-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <>
      <textarea
        {...props}
        ref={ref}
        id={id}
        className={cx("krds-input", className)}
        aria-describedby={ariaDescribedBy}
      />
      <label htmlFor={id}>{label}</label>
      {hint ? <p id={hintId}>{hint}</p> : null}
    </>
  );
}
