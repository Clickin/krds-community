import { useState, type ReactNode, type ButtonHTMLAttributes, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, type NativeCommonProps } from "./_utils.js";

export interface TtsProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  text?: string;
  iconOnly?: boolean;
  size?: "xsmall" | "small" | "medium" | "large";
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function Tts({
  label,
  text,
  iconOnly = false,
  size = "medium",
  playing: controlledPlaying,
  defaultPlaying = false,
  onPlayingChange,
  children,
  className,
  onClick,
  ref,
  ...props
}: TtsProps & { ref?: Ref<HTMLButtonElement> }) {
  const [uncontrolledPlaying, setUncontrolledPlaying] = useState(defaultPlaying);
  const playing = controlledPlaying ?? uncontrolledPlaying;
  const textContent = children ?? text ?? label;
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      className={cx("krds-tts", size, playing && "play", className)}
      onClick={(event) => {
        const next = !playing;
        if (controlledPlaying === undefined) setUncontrolledPlaying(next);
        onPlayingChange?.(next);
        onClick?.(event);
      }}
    >
      <span className="krds-tts-icon" aria-hidden="true">
        <SvgIcon name={playing ? "ico-stop" : "ico-volume"} />
      </span>
      {iconOnly ? (
        textContent ? (
          <span className="sr-only">{textContent}</span>
        ) : null
      ) : (
        <>
          {" "}
          <span className="krds-tts-text">{textContent}</span>
        </>
      )}
    </button>
  );
}
