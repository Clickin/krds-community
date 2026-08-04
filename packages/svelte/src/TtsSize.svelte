<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'class'> & {
    label?: string;
    size?: string;
    className?: string;
    class?: string;
  };

  let {
    label = '레이블',
    size = 'xsmall',
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<button
  {...rest}
  type="button"
  class={`krds-tts ${size} ${rootClass}`.trim()}
>
  <span class="krds-tts-icon" aria-hidden="true"><i class="ico-volume svg-icon"></i></span>
  <span class="krds-tts-text">{label}</span>
</button>
