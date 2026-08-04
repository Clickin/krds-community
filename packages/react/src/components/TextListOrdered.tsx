import { type ComponentProps } from "react";
import { TextList } from "./TextList.js";

export const TextListOrdered = (props: Omit<ComponentProps<typeof TextList>, "ordered">) => (
  <TextList {...props} ordered />
);
