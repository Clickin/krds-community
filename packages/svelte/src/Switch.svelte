<script lang="ts">
  import type { ChoiceContractProps } from '@krds-community/recipes';
  type Props = ChoiceContractProps & { checked?: boolean };
  let { checked = $bindable(false), label = '', size = 'medium', id = 'krds-switch', disabled = false, ...restProps }: Props = $props();
</script>

<div class="krds-form-toggle-switch" data-size={size}>
  <input {...restProps} type="checkbox" {id} bind:checked {disabled} />
  <label for={id}><span class="switch-toggle" aria-hidden="true"><i></i></span>{label}</label>
</div>
