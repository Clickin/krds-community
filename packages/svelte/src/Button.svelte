<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ButtonContractProps } from '@krds-community/recipes';

  type Props = ButtonContractProps & {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    children?: Snippet;
  };

  let { variant, size = 'medium', disabled = false, type = 'button', className = '', children, ...restProps }: Props = $props();
</script>

<button {...restProps} {type} {disabled} class:primary={variant === 'primary'} class:secondary={variant === 'secondary'} class:tertiary={variant === 'tertiary'} class:xsmall={size === 'xsmall'} class:small={size === 'small'} class:large={size === 'large'} class:xlarge={size === 'xlarge'} class={`krds-btn ${className}`}>
  {@render children?.()}
</button>
