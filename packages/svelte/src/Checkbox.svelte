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
    description = '',
    size,
    id = generatedId,
    disabled = false,
    class: classValue = '',
    className = '',
    ...restProps
  }: Props = $props();
</script>

<div class={`krds-form-check${size ? ` ${size}` : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}>
  <input {...restProps} type="checkbox" {id} bind:checked {disabled} aria-describedby={description ? `${id}-description` : undefined} />
  <label for={id}>{label}</label>
  {#if description}
    <div class="krds-form-check-cnt">
      <p id={`${id}-description`} class="krds-form-check-p">{description}</p>
    </div>
  {/if}
</div>
