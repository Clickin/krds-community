import { type ButtonHTMLAttributes, type Ref } from "react";
import { buttonRecipe } from "@krds-community/recipes";
import type { ButtonContractProps } from "@krds-community/recipes";

export interface ButtonProps
  extends ButtonContractProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {}
export function Button({
  variant,
  size,
  className,
  type = "button",
  disabled,
  ref,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {
  const recipe = buttonRecipe({ variant, size, disabled, className });
  return (
    <button {...props} ref={ref} type={type} disabled={disabled} className={recipe.className} />
  );
}
