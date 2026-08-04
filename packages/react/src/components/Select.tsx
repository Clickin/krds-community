import { useId, type SelectHTMLAttributes, type Ref } from "react";
import { cx, selectRecipe } from "@krds-community/recipes";
import type { KrdsOption } from "@krds-community/recipes";
import type { NativeCommonProps, LabelProps } from "./_utils.js";
import { joinAriaIds } from "./_utils.js";

export interface SelectOption extends KrdsOption {
  selected?: boolean;
}
export interface SelectProps
  extends
    NativeCommonProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "size">,
    LabelProps {
  options?: SelectOption[];
  state?: "default" | "error" | "complete";
  size?: "small" | "medium" | "large";
  variant?: "default" | "size" | "state" | "sorting";
  className?: string;
}
export function Select({
  options = [],
  label = "선택",
  hint,
  id: providedId,
  state = "default",
  size,
  variant = "default",
  className,
  children,
  title = "선택",
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ref,
  ...props
}: SelectProps & { ref?: Ref<HTMLSelectElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-select-${generatedId}`;
  const hintId = variant !== "sorting" && hint ? `${id}-hint` : undefined;
  const selectClasses = selectRecipe(
    variant === "sorting"
      ? { variant: "sorting", state: state === "error" ? "error" : "default" }
      : {
          variant,
          size: variant === "size" ? size : undefined,
          state: state === "error" ? "error" : "default",
        },
  );
  const control = (
    <select
      {...props}
      ref={ref}
      id={id}
      className={cx(selectClasses.control, className)}
      title={title}
      aria-label={variant === "sorting" && typeof label === "string" ? label : undefined}
      aria-invalid={state === "error" ? "true" : ariaInvalid}
      aria-describedby={
        variant === "sorting" ? ariaDescribedBy : joinAriaIds(ariaDescribedBy, hintId)
      }
    >
      {children ??
        options.map((option, index) => {
          const selected = option.selected ?? (variant === "size" && index === 0);
          return (
            <option
              key={`${option.value}-${index}`}
              ref={(node) => {
                if (!node) return;
                if (selected) node.setAttribute("selected", "");
                else node.removeAttribute("selected");
              }}
              value={option.value}
              disabled={option.disabled}
              selected={selected}
            >
              {option.label}
            </option>
          );
        })}
    </select>
  );

  if (variant === "sorting") return control;

  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="form-conts">{control}</div>
      {hint ? (
        <p id={hintId} className={state === "error" ? "form-hint-invalid" : "form-hint"}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
