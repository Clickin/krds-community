import { type Ref } from "react";
import { HelpPanelSurface, type HelpPanelProps } from "./HelpPanel.js";

export function TutorialPanel({ ref, ...props }: HelpPanelProps & { ref?: Ref<HTMLDivElement> }) {
  return <HelpPanelSurface {...props} {...(ref !== undefined ? { ref } : {})} tutorialDefault />;
}
