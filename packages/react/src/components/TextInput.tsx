import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { TextInputContractProps } from "@krds-community/recipes";

function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));
  return unique.size ? Array.from(unique).join(" ") : undefined;
}

export interface TextInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "disabled">,
    Omit<TextInputContractProps, "label" | "hint"> {
  label?: ReactNode;
  hint?: ReactNode;
}
export function TextInput({
  label,
  hint,
  state = "default",
  size,
  id: providedId,
  className,
  readonly,
  readOnly,
  ref,
  ...props
}: TextInputProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-input-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const hintClassName =
    state === "default"
      ? "form-hint"
      : state === "error"
        ? "form-hint-invalid"
        : `form-hint-${state}`;
  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className={cx("form-conts", state === "default" ? undefined : `is-${state}`)}>
        <input
          {...props}
          id={id}
          ref={ref}
          readOnly={readonly ?? readOnly}
          className={cx("krds-input", size, className)}
          aria-invalid={state === "error" ? "true" : props["aria-invalid"]}
          aria-describedby={joinAriaIds(props["aria-describedby"], hintId)}
        />
      </div>
      {hint ? (
        <p id={hintId} className={hintClassName}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
