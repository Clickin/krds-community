import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { choiceRecipe } from "@krds-community/recipes";
import type { RadioContractProps } from "@krds-community/recipes";

function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));
  return unique.size ? Array.from(unique).join(" ") : undefined;
}

export interface RadioProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled" | "value">,
    Omit<RadioContractProps, "label" | "description" | "value"> {
  label: ReactNode;
  value?: string;
  description?: ReactNode;
}
export function Radio({
  label,
  description,
  size,
  id: providedId,
  className,
  value,
  ref,
  ...props
}: RadioProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-radio-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = choiceRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="radio"
        value={value}
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
