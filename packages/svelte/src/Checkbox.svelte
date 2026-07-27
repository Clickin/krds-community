<script lang="ts">
  import type { ChoiceContractProps } from '@krds-community/recipes';
  type Props = ChoiceContractProps & { checked?: boolean };
  let { checked = $bindable(false), label = '', description = '', size = 'medium', id = 'krds-checkbox', disabled = false, ...restProps }: Props = $props();
</script>

<div class="krds-form-check" data-size={size}>
  <input {...restProps} type="checkbox" {id} bind:checked {disabled} />
  <label for={id}>{label}</label>
  {#if description}<span class="krds-field-message">{description}</span>{/if}
</div>
