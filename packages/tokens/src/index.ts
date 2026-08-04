import { krdsTokens } from "./generated.js";

export { krdsTokens };
export type { KrdsTokenName } from "./generated.js";
export type KrdsTokens = typeof krdsTokens;

/** Resolve a generated token as a CSS custom property reference. */
export const tokenVar = (name: keyof typeof krdsTokens): string =>
  `var(--krds-${name.replace(/\./g, "-")})`;
