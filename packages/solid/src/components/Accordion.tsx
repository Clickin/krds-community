import { For, createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";
import { accordionRecipe } from "@krds-community/recipes";
import type { AccordionContractProps, AccordionItemContract } from "@krds-community/recipes";

export interface AccordionItem extends AccordionItemContract {}
export interface AccordionProps
  extends Omit<AccordionContractProps, "items">, JSX.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  defaultOpen?: string[];
}

export function Accordion(rawProps: AccordionProps) {
  const merged = mergeProps(
    { type: "default" as const, multiple: false, defaultOpen: [] as string[] },
    rawProps,
  );
  const instanceId = createUniqueId();
  const [props, nativeProps] = splitProps(merged, [
    "type",
    "multiple",
    "defaultOpen",
    "items",
    "class",
    "children",
  ]);
  const [openItems, setOpenItems] = createSignal(props.defaultOpen);
  const toggle = (id: string) => {
    const current = openItems();
    if (current.includes(id)) setOpenItems(current.filter((item) => item !== id));
    else if (props.multiple) setOpenItems([...current, id]);
    else setOpenItems([id]);
  };
  return (
    <div
      {...nativeProps}
      class={accordionRecipe({ type: props.type, className: props.class }).className}
    >
      <For each={props.items}>
        {(item) => {
          const open = () => openItems().includes(item.id);
          return (
            <div class="accordion-item" classList={{ active: open() }}>
              <h5 class="accordion-header">
                <button
                  type="button"
                  class="btn-accordion"
                  classList={{ active: open() }}
                  id={`krds-accordion-${instanceId}-header-${item.id}`}
                  aria-expanded={open()}
                  aria-controls={`krds-accordion-${instanceId}-panel-${item.id}`}
                  disabled={item.disabled}
                  onClick={() => toggle(item.id)}
                >
                  {item.title}
                </button>
              </h5>
              <div
                id={`krds-accordion-${instanceId}-panel-${item.id}`}
                class="accordion-collapse collapse"
                classList={{ show: open() }}
                role="region"
                aria-labelledby={`krds-accordion-${instanceId}-header-${item.id}`}
                hidden={!open()}
              >
                <div class="accordion-body">{item.content}</div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
