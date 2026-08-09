import type { ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsAdditionalProps, KrdsTone } from "@krds-community/recipes";
export { cx };

export function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));
  return unique.size ? Array.from(unique).join(" ") : undefined;
}

export function SvgIcon({ name }: { name: string }) {
  return <i className={cx("svg-icon", name)} />;
}

export function inlineSpacedText(value: ReactNode, leading: boolean, trailing: boolean): ReactNode {
  if (typeof value === "string") {
    const parts = value.split(" ");
    if (parts.length < 2) {
      let text = value;
      if (leading) text = " " + text;
      if (trailing) text = text + " ";
      return text;
    }
    const className = cx(
      leading ? "krds-icon-space-left" : undefined,
      trailing ? "krds-icon-space-right" : undefined,
    );
    return (
      <>
        {parts.map((part, index) => (
          <>
            {index > 0 && " "}
            <span key={index} className={className ?? undefined}>
              {part}
            </span>
          </>
        ))}
      </>
    );
  }
  return value;
}

export type CommonProps = Omit<
  KrdsAdditionalProps,
  | "label"
  | "title"
  | "description"
  | "hint"
  | "message"
  | "size"
  | "value"
  | "modelValue"
  | "className"
  | "disabled"
>;
export type NativeCommonProps = Omit<
  CommonProps,
  | "id"
  | "name"
  | "required"
  | "readonly"
  | "open"
  | "checked"
  | "selected"
  | "rows"
  | "columns"
  | "items"
  | "panels"
  | "steps"
  | "tabs"
  | "options"
  | "slides"
  | "links"
>;

export type BoxProps = CommonProps & { className?: string; children?: ReactNode };
export type LabelProps = { label?: ReactNode; hint?: ReactNode };

export const toneClass: Record<KrdsTone, string> = {
  primary: "primary",
  secondary: "secondary",
  gray: "gray",
  point: "point",
  information: "information",
  danger: "danger",
  warning: "warning",
  success: "success",
  disabled: "disabled",
};

export const outlineToneClass: Record<KrdsTone, string> = {
  primary: "outline-primary",
  secondary: "outline-secondary",
  gray: "outline-gray",
  point: "outline-point",
  information: "outline-information",
  danger: "outline-danger",
  warning: "outline-warning",
  success: "outline-success",
  disabled: "outline-disabled",
};
