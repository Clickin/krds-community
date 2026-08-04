import { type ComponentProps } from "react";
import { Button } from "./Button.js";

export const ButtonHierarchy = (props: ComponentProps<typeof Button>) => <Button {...props} />;
export const ButtonSize = ButtonHierarchy;
