import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { choiceRecipe } from "@krds-community/recipes";
import type { ChoiceContractProps } from "@krds-community/recipes";

function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));
  return unique.size ? Array.from(unique).join(" ") : undefined;
}

export interface CheckboxProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled">,
    Omit<ChoiceContractProps, "label" | "description"> {
  label: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
}
export function Checkbox({
  label,
  description,
  size,
  id: providedId,
  className,
  indeterminate = false,
  ref,
  ...props
}: CheckboxProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-checkbox-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const setInputRef = (input: HTMLInputElement | null) => {
    inputRef.current = input;
    if (typeof ref === "function") ref(input);
    else if (ref) ref.current = input;
  };
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = choiceRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={setInputRef}
        id={id}
        type="checkbox"
        aria-describedby={joinAriaIds(props["aria-describedby"], descriptionId)}
      />
      <label htmlFor={id}>{label}</label>
      {description ? (
        <div className="krds-form-check-cnt">
          <p id={descriptionId} className="krds-form-check-p">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
