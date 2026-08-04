import { type Ref } from "react";
import { Tts, type TtsProps } from "./Tts.js";

export function TtsSize({ ref, ...props }: TtsProps & { ref?: Ref<HTMLButtonElement> }) {
  return <Tts {...props} {...(ref !== undefined ? { ref } : {})} size={props.size ?? "xsmall"} />;
}
