<script lang="ts">
  import { zoomOptions, invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    label?: string;
    open?: boolean;
    options?: { value: string; label: string; disabled?: boolean }[];
    selected?: string;
    modelValue?: string;
    defaultValue?: string;
    selectedLabel?: string;
    resetLabel?: string;
    onclick?: (event: Event) => void;
    onchange?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    label = '레이블',
    open = $bindable<boolean | undefined>(),
    options = [] as { value: string; label: string; disabled?: boolean }[],
    selected = $bindable<string | undefined>(),
    modelValue = $bindable<string | undefined>(),
    defaultValue = '',
    selectedLabel = '선택됨',
    resetLabel = '',
    onclick,
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const selection = $derived(
    modelValue !== undefined
      ? String(modelValue)
      : selected !== undefined
        ? selected
        : defaultValue || 'md',
  );
  const isOpen = $derived(open ?? false);
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event && onclick) onclick(event);
  };
  const setSelection = (next: string, event?: Event) => {
    selected = next;
    modelValue = next;
    if (event) invoke(onchange, event);
  };
</script>

<div {...rest} class={`krds-drop-wrap krds-resize ${rootClass}`} data-adjust="scale">
  <button
    type="button"
    class="krds-btn small text drop-btn"
    aria-expanded={isOpen}
    aria-controls={`${id}-menu`}
    onclick={() => toggleOpen()}
  >
    {label} <i class="svg-icon ico-toggle"></i>
  </button>
  <div class="drop-menu" id={`${id}-menu`}>
    <div class="drop-in">
      <ul class="drop-list">
        {#each (options.length ? options : zoomOptions) as option}
          <li>
            <button
              type="button"
              class={`item-link ${option.value}`}
              class:active={(selection || 'md') === option.value}
              data-adjust-scale={option.value}
              onclick={(event) => setSelection(option.value, event)}
            >
              {option.label}<span class="sr-only">{(selection || 'md') === option.value ? selectedLabel : ''}</span>
            </button>
          </li>
        {/each}
      </ul>
      <div class="drop-bottom">
        <button
          type="button"
          class="krds-btn medium text"
          data-adjust-scale="md"
          onclick={(event) => setSelection('md', event)}
        >
          <i class="svg-icon ico-reset"></i> {resetLabel}
        </button>
      </div>
    </div>
  </div>
</div>