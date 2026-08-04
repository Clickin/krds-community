import { Accordion, type AccordionProps } from "./Accordion.js";

export function AccordionLine(props: Omit<AccordionProps, "type">) {
  return <Accordion {...props} type="line" />;
}
