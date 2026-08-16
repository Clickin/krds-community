<script lang="ts">
  type Props = {
    state?: 'danger' | 'warning' | 'success' | 'information';
    size?: 'with-title' | 'slim';
    title?: string;
    message: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    state = 'danger',
    size = 'slim',
    title = '',
    message,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const icon = $derived(
    state === 'success'
      ? 'ico-success-fill'
      : state === 'information'
        ? 'ico-information-fill'
        : 'ico-error-fill',
  );
</script>

<div {...rest} class={`krds-alert ${state} ${size} ${rootClass}`} role="status"><i class={`svg-icon alert-icon ${icon}`} aria-hidden="true"></i>{#if title}<strong class="alert-title">{title}</strong>{/if}<p class="alert-body">{message}</p></div>
