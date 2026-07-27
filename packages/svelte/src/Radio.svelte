<script lang="ts">
  import type { RadioContractProps } from '@krds-community/recipes';
  type Props = Omit<RadioContractProps, 'value'> & { checked?: boolean; value?: string };
  let { checked = $bindable(false), value = '', name = '', label = '', description = '', size = 'medium', id = 'krds-radio', disabled = false, ...restProps }: Props = $props();
</script>

<div class="krds-form-check" data-size={size}>
  <input {...restProps} type="radio" {id} {name} {value} checked={checked} {disabled} onchange={(event) => (checked = event.currentTarget.checked)} />
  <label for={id}>{label}</label>
  {#if description}<span class="krds-field-message">{description}</span>{/if}
</div>
