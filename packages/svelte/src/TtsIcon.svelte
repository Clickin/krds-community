<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'class'> & {
    label?: string;
    className?: string;
    class?: string;
  };

  let {
    label = '음성 재생',
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<button
  {...rest}
  type="button"
  class={`krds-tts medium ${rootClass}`.trim()}
  aria-label={label || undefined}
>
  <span class="krds-tts-icon" aria-hidden="true"><i class="ico-volume svg-icon"></i></span>
</button>
