<script lang="ts">
  type Props = {
    type?: 'basic' | 'label';
    onclick?: () => void;
    ariaLabel?: string;
    label?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    type = 'basic',
    onclick,
    ariaLabel = '맨 위로',
    label = 'TOP',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} class={`krds-top-button ${rootClass}`}>
  <button type="button" class="krds-btn medium icon" aria-label={ariaLabel} onclick={onclick}>
    <i class="svg-icon ico-go-top"></i>
    {#if type === 'label'}
      <span class="top-button-label">{label}</span>
    {/if}
  </button>
</div>
