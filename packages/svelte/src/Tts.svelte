<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    label?: string;
    size?: string;
    iconOnly?: boolean;
    checked?: boolean;
    modelValue?: string | number | boolean;
    onclick?: (event: Event) => void;
    onchange?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    'aria-label'?: string;
    text?: string;
    [key: string]: unknown;
  };
  let {
    label = '레이블',
    size = 'medium',
    iconOnly = false,
    checked = $bindable<boolean | undefined>(),
    modelValue = $bindable<string | number | boolean | undefined>(),
    onclick,
    onchange,
    class: classProp = '',
    className = '',
    children,
    'aria-label': ariaLabel,
    text,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const buttonClass = $derived(
    `${rootClass} krds-tts ${size} ${checkedValue ? 'play' : ''}`.trim(),
  );
  const checkedValue = $derived(
    checked !== undefined
      ? Boolean(checked)
      : typeof modelValue === 'boolean'
        ? modelValue
        : Boolean(modelValue),
  );
  const setChecked = (next: boolean, event: Event, eventName: string) => {
    checked = next;
    if (typeof modelValue === 'boolean' || modelValue === undefined) modelValue = next;
    if (eventName === 'click' && onclick) onclick(event);
    else if (onchange) onchange(event);
  };
</script>

<button
  {...rest}
  type="button"
  class={buttonClass}
  aria-label={iconOnly ? (ariaLabel || label || '음성 재생') : ariaLabel}
  onclick={(event) => setChecked(!checkedValue, event, 'click')}
>
  <span class="krds-tts-icon" aria-hidden="true"><i class="ico-volume svg-icon"></i></span>
  {#if !iconOnly}<span class="krds-tts-text">{#if children}{@render children()}{:else}{label}{/if}</span>{/if}
</button>
