import { krdsTokens } from "@krds-community/tokens";

const light = {
  background: krdsTokens["primitive.color.light.gray.0"],
  foreground: krdsTokens["primitive.color.light.gray.90"],
  muted: krdsTokens["primitive.color.light.gray.60"],
  primary: krdsTokens["primitive.color.light.primary.60"],
  accent: krdsTokens["primitive.color.light.secondary.60"],
  point: krdsTokens["primitive.color.light.point.60"],
  success: krdsTokens["primitive.color.light.success.60"],
};

const dark = {
  background: krdsTokens["primitive.color.high-contrast.gray.95"],
  foreground: krdsTokens["primitive.color.high-contrast.gray.5"],
  muted: krdsTokens["primitive.color.high-contrast.gray.30"],
  primary: krdsTokens["primitive.color.high-contrast.primary.30"],
  accent: krdsTokens["primitive.color.high-contrast.secondary.30"],
  point: krdsTokens["primitive.color.high-contrast.point.30"],
  success: krdsTokens["primitive.color.high-contrast.success.30"],
};

const createTheme = (
  name: string,
  palette: Record<keyof typeof light, string>,
  type: "light" | "dark",
) => ({
  name,
  type,
  colors: {
    "editor.background": palette.background,
    "editor.foreground": palette.foreground,
    "editorLineNumber.foreground": palette.muted,
    "editor.selectionBackground": `${palette.primary}40`,
    "editorCursor.foreground": palette.primary,
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: palette.muted, fontStyle: "italic" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: palette.primary, fontStyle: "bold" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: palette.success },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: palette.point },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: palette.accent },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class"],
      settings: { foreground: palette.primary },
    },
    { scope: ["variable", "variable.other"], settings: { foreground: palette.foreground } },
    { scope: ["entity.name.tag"], settings: { foreground: palette.primary, fontStyle: "bold" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: palette.accent } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: palette.muted } },
  ],
});

export const krdsShikiLight = createTheme("krds-light", light, "light");
export const krdsShikiHighContrast = createTheme("krds-high-contrast", dark, "dark");
