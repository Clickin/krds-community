import { type Ref } from "react";
import { HelpPanelSurface, type HelpPanelProps } from "./HelpPanel.js";

export function TutorialPanel({ ref, ...props }: HelpPanelProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <HelpPanelSurface
      {...props}
      label={props.label ?? "튜토리얼 패널"}
      {...(ref !== undefined ? { ref } : {})}
      tutorialDefault
    />
  );
}
