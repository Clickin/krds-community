<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string;
    label?: string;
    inputLabel?: string;
    placeholder?: string;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id,
    label = '레이블',
    inputLabel = 'Label',
    placeholder = 'placeholder',
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div class="form-group">
  <div class="form-tit">
    <label for={`${id}-input`}>{inputLabel}</label>
  </div>
  <div class="form-conts">
    <div class="form-spinner">
      <input type="text" id={`${id}-input`} class="krds-input" aria-label={inputLabel} {placeholder} />
      <div {...rest} class={`krds-spinner ${rootClass}`} role="status">
        <span class="sr-only">{label}</span>
      </div>
    </div>
  </div>
</div>