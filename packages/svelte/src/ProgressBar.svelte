<script lang="ts">
  type Props = {
    size?: 'large' | 'medium';
    state?: 'active' | 'success' | 'error';
    value?: number;
    max?: number;
    label?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    size = 'medium',
    state = 'active',
    value = 0,
    max = 100,
    label = '',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} class={`krds-progress-bar ${size} ${state} ${rootClass}`}>
  <progress class="krds-progress" {value} {max}>{label || `${value}%`}</progress>
  {#if label}
    <span class="progress-label">{label}</span>
  {/if}
</div>
