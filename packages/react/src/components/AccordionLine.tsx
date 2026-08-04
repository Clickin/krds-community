import { Accordion } from "./Accordion.js";
import type { AccordionProps } from "./Accordion.js";

export function AccordionLine(props: Omit<AccordionProps, "type">) {
  return <Accordion {...props} type="line" />;
}
