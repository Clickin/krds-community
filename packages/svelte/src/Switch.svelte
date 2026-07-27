<script lang="ts">
  import type { ChoiceContractProps } from '@krds-community/recipes';
  type Props = ChoiceContractProps & {
    checked?: boolean;
    class?: string;
    className?: string;
  };
  const generatedId = $props.id();
  let {
    checked = $bindable(false),
    label = '',
    description: _description,
    size,
    id = generatedId,
    disabled = false,
    class: classValue = '',
    className = '',
    ...restProps
  }: Props = $props();
</script>

<div class={`krds-form-toggle-switch${size ? ` ${size}` : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}>
  <input {...restProps} type="checkbox" {id} bind:checked {disabled} />
  <label for={id}><span class="switch-toggle"><i></i></span>{label}</label>
</div>
