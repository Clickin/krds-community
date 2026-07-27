<script lang="ts">
  import type { AccordionContractProps, AccordionItemContract } from '@krds-community/recipes';
  export type AccordionItem = AccordionItemContract;
  type Props = Omit<AccordionContractProps, 'items'> & { items?: AccordionItem[]; openItems?: string[] };
  let { items = [], type = 'default', multiple = false, openItems = $bindable<string[]>([]) , ...restProps }: Props = $props();

  const toggle = (id: string) => {
    if (openItems.includes(id)) openItems = openItems.filter((item) => item !== id);
    else if (multiple) openItems = [...openItems, id];
    else openItems = [id];
  };
</script>

<div {...restProps} class="krds-accordion" data-type={type}>
  {#each items as item (item.id)}
    {@const open = openItems.includes(item.id)}
    {@const headerId = `krds-accordion-header-${item.id}`}
    {@const panelId = `krds-accordion-panel-${item.id}`}
    <div class:is-open={open} class="krds-accordion-item">
      <h5 class="krds-accordion-heading"><button type="button" class="krds-accordion-trigger" id={headerId} aria-expanded={open} aria-controls={panelId} disabled={item.disabled} onclick={() => toggle(item.id)}>{item.title}</button></h5>
      <div id={panelId} class="krds-accordion-panel" role="region" aria-labelledby={headerId} hidden={!open}>{item.content}</div>
    </div>
  {/each}
</div>
