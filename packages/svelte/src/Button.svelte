<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ButtonContractProps } from '@krds-community/recipes';

  type Props = ButtonContractProps & {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    children?: Snippet;
  };

  let { variant = 'primary', size = 'medium', disabled = false, type = 'button', className = '', children, ...restProps }: Props = $props();
</script>

<button {...restProps} {type} {disabled} class={`krds-button ${className}`} data-variant={variant} data-size={size}>
  {@render children?.()}
</button>
