import { type Ref } from "react";
import { LanguageMenu, type LanguageSwitcherProps } from "./LanguageSwitcher.js";

export function LanguageSwitcherPage({
  ref,
  ...props
}: LanguageSwitcherProps & { ref?: Ref<HTMLDivElement> }) {
  return <LanguageMenu {...props} {...(ref !== undefined ? { ref } : {})} page />;
}
