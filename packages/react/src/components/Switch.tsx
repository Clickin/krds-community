import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { switchRecipe } from "@krds-community/recipes";
import type { ChoiceContractProps } from "@krds-community/recipes";

function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));
  return unique.size ? Array.from(unique).join(" ") : undefined;
}

export interface SwitchProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled">,
    Omit<ChoiceContractProps, "label" | "description"> {
  label: ReactNode;
  description?: ReactNode;
}
export function Switch({
  label,
  description,
  size,
  id: providedId,
  className,
  ref,
  ...props
}: SwitchProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-switch-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = switchRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="checkbox"
        aria-describedby={joinAriaIds(props["aria-describedby"], descriptionId)}
      />
      <label htmlFor={id}>
        <span className="switch-toggle">
          <i />
        </span>
        {label}
      </label>
      {description ? (
        <span id={descriptionId} className="krds-field-message">
          {description}
        </span>
      ) : null}
    </div>
  );
}
