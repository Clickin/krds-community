<script lang="ts">
  import type { TextInputContractProps } from '@krds-community/recipes';
  type Props = Omit<TextInputContractProps, 'value'> & {
    value?: string;
    id?: string;
  };

  let { value = $bindable(''), label = '', hint = '', state = 'default', size = 'medium', id = 'krds-input', disabled = false, readonly = false, required = false, ...restProps }: Props = $props();
</script>

<label class="krds-field">
  {#if label}<span class="krds-field-label">{label}</span>{/if}
  <input {...restProps} bind:value {id} {disabled} {readonly} {required} class="krds-input" data-state={state} data-size={size} aria-invalid={state === 'error' ? 'true' : undefined} aria-describedby={hint ? `${id}-hint` : undefined} />
  {#if hint}<span id={`${id}-hint`} class="krds-field-message" data-state={state}>{hint}</span>{/if}
</label>
