import { mergeProps, splitProps, type JSX } from "solid-js";
import type { KrdsTone } from "@krds-community/recipes";
import { tones } from "../shared.js";

export interface BadgeProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  tone?: KrdsTone;
  appearance?: "outline" | "solid" | "light";
  size?: string;
  number?: boolean;
  [key: string]: unknown;
}

export function Badge(rawProps: BadgeProps) {
  const merged = mergeProps(
    { tone: "primary" as KrdsTone, appearance: "outline" as const },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "tone",
    "appearance",
    "size",
    "number",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label;
  return (
    <span
      {...(native as Record<string, any>)}
      class={[
        "krds-badge",
        props.appearance === "outline"
          ? `outline-${tones[props.tone]}`
          : props.appearance === "light"
            ? `bg-light-${tones[props.tone]}`
            : `bg-${props.tone === "primary" ? "primary" : tones[props.tone]}`,
        props.size,
        props.number && "number",
        className(),
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {content()}
    </span>
  );
}

export const BadgeNumber = (props: Omit<BadgeProps, "number">) => <Badge {...props} number />;
export const BadgeSize = Badge;
