<script lang="ts">
  import type { AccordionContractProps, AccordionItemContract } from '@krds-community/recipes';
  export type AccordionItem = AccordionItemContract;
  type Props = Omit<AccordionContractProps, 'items'> & {
    items?: AccordionItem[];
    openItems?: string[];
    kind?: string;
    class?: string;
    className?: string;
  };
  let {
    items = [],
    type = 'default',
    multiple = false,
    openItems = $bindable<string[]>([]),
    kind,
    class: classValue = '',
    className = '',
    ...restProps
  }: Props = $props();
  const effectiveType = $derived(kind === 'accordion-line' ? 'line' : type);

  const toggle = (id: string) => {
    if (openItems.includes(id)) openItems = openItems.filter((item) => item !== id);
    else if (multiple) openItems = [...openItems, id];
    else openItems = [id];
  };
</script>
<div
  {...restProps}
  class={`krds-accordion${effectiveType === 'line' ? ' type-line' : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}
>
  {#each items as item (item.id)}
    {@const open = openItems.includes(item.id)}
    {@const headerId = `krds-accordion-header-${item.id}`}
    {@const panelId = `krds-accordion-panel-${item.id}`}
    <div class="accordion-item">
      <h5 class="accordion-header">
        <button
          type="button"
          class="btn-accordion"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={item.disabled}
          onclick={() => toggle(item.id)}
        >
          {item.title}
        </button>
      </h5>
      <div
        id={panelId}
        class="accordion-collapse collapse"
        class:show={open}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
      >
        <div class="accordion-body">{item.content}</div>
      </div>
    </div>
  {/each}
</div>
