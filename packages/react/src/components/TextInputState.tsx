import { useId, type ComponentProps, type ReactNode, type Ref } from "react";
import { cx, joinAriaIds } from "./_utils.js";
import { TextInput } from "./TextInput.js";

export interface TextInputStateProps extends Omit<ComponentProps<typeof TextInput>, "ref"> {
  error?: ReactNode;
}

export function TextInputState({
  label,
  hint,
  error,
  state = "error",
  size,
  readonly,
  readOnly,
  id: providedId,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ref,
  ...props
}: TextInputStateProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-input-state-${generatedId}`;
  const message = error ?? hint;
  const messageId = message ? `${id}-hint` : undefined;
  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className={cx("form-conts", state !== "default" && `is-${state}`)}>
        <input
          {...props}
          ref={ref}
          id={id}
          readOnly={readonly ?? readOnly}
          className={cx("krds-input", size, className)}
          aria-invalid={state === "error" ? "true" : ariaInvalid}
          aria-describedby={joinAriaIds(ariaDescribedBy, messageId)}
        />
      </div>
      {message ? (
        <p
          id={messageId}
          className={
            state === "error"
              ? "form-hint-invalid"
              : state === "default"
                ? "form-hint"
                : `form-hint-${state}`
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
