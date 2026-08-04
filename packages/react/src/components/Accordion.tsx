import { useId, useState, type ReactNode } from "react";
import { accordionRecipe, cx } from "@krds-community/recipes";
import type { AccordionContractProps, AccordionItemContract } from "@krds-community/recipes";

export interface AccordionItemData extends Omit<AccordionItemContract, "title" | "content"> {
  title: ReactNode;
  content: ReactNode;
}
export interface AccordionProps extends Omit<AccordionContractProps, "items"> {
  items: AccordionItemData[];
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}
export function Accordion({
  items,
  type = "default",
  multiple = false,
  defaultOpen = [],
  open: controlledOpen,
  onOpenChange,
  className,
}: AccordionProps) {
  const generatedId = useId();
  const accordionId = `krds-accordion-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(defaultOpen);
  const openItems = controlledOpen ?? uncontrolledOpen;
  const toggle = (id: string) => {
    const next = openItems.includes(id)
      ? openItems.filter((item) => item !== id)
      : multiple
        ? [...openItems, id]
        : [id];
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };
  const recipe = accordionRecipe({ type, className });
  return (
    <div className={recipe.className}>
      {items.map((item, index) => {
        const open = openItems.includes(item.id);
        const headerId = `${accordionId}-header-${index}-${item.id}`;
        const panelId = `${accordionId}-panel-${index}-${item.id}`;
        return (
          <div className={cx("accordion-item", open && "active")} key={headerId}>
            <h5 className="accordion-header">
              <button
                type="button"
                className={cx("btn-accordion", open && "active")}
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                {item.title}
              </button>
            </h5>
            <div
              id={panelId}
              className={cx("accordion-collapse", "collapse", open && "show")}
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
            >
              <div className="accordion-body">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
