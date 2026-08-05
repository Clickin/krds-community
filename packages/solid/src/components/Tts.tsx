import { createSignal, mergeProps, splitProps, type JSX } from "solid-js";

export interface TtsProps {
  class?: string;
  className?: string;
  children?: JSX.Element;
  label?: string;
  text?: string;
  size?: string;
  checked?: boolean;
  playing?: boolean;
  modelValue?: boolean;
  [key: string]: unknown;
}

export function Tts(rawProps: TtsProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "text",
    "size",
    "checked",
    "playing",
    "modelValue",
  ]);
  const [localChecked, setLocalChecked] = createSignal(false);
  const checked = () =>
    props.playing !== undefined
      ? Boolean(props.playing)
      : props.checked !== undefined
        ? Boolean(props.checked)
        : typeof props.modelValue === "boolean"
          ? props.modelValue
          : localChecked();
  const setChecked = (next: boolean) => {
    if (
      props.playing === undefined &&
      props.checked === undefined &&
      typeof props.modelValue !== "boolean"
    )
      setLocalChecked(next);
  };
  const className = () => props.class ?? props.className ?? "";
  const content = () => props.children ?? props.label ?? props.text;
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      class={["krds-tts", props.size ?? "medium", className()].filter(Boolean).join(" ")}
      onClick={(event) => {
        setChecked(!checked());
        (native as Record<string, any>).onClick?.(event);
      }}
    >
      <span class="krds-tts-icon" aria-hidden="true">
        <i class={checked() ? "svg-icon ico-pause" : "svg-icon ico-volume"} />
      </span>
      <span class="krds-tts-text">{content()}</span>
    </button>
  );
}

export function TtsIcon(rawProps: TtsProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "children",
    "label",
    "text",
    "size",
    "checked",
    "playing",
    "modelValue",
  ]);
  const [localChecked, setLocalChecked] = createSignal(false);
  const checked = () =>
    props.playing !== undefined
      ? Boolean(props.playing)
      : props.checked !== undefined
        ? Boolean(props.checked)
        : typeof props.modelValue === "boolean"
          ? props.modelValue
          : localChecked();
  const setChecked = (next: boolean) => {
    if (
      props.playing === undefined &&
      props.checked === undefined &&
      typeof props.modelValue !== "boolean"
    )
      setLocalChecked(next);
  };
  const className = () => props.class ?? props.className ?? "";
  return (
    <button
      {...(native as Record<string, any>)}
      type="button"
      class={["krds-tts", props.size ?? "medium", className()].filter(Boolean).join(" ")}
      onClick={(event) => {
        setChecked(!checked());
        (native as Record<string, any>).onClick?.(event);
      }}
    >
      <span class="krds-tts-icon" aria-hidden="true">
        <i class={checked() ? "svg-icon ico-pause" : "svg-icon ico-volume"} />
      </span>
    </button>
  );
}

export const TtsSize = Tts;
