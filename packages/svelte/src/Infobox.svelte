<script lang="ts">
  type Props = {
    type?: 'primary' | 'secondary';
    size?: 'default' | 'slim';
    message: string;
    ariaLabel?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    type = 'primary',
    size = 'default',
    message,
    ariaLabel = '알림',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<div {...rest} class={`krds-infobox ${type} ${size} ${rootClass}`} role="region" aria-label={ariaLabel}>
  <p class="infobox-text">{message}</p>
</div>
