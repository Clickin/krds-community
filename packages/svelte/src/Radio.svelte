<script lang="ts">
  import type { RadioContractProps } from '@krds-community/recipes';
  type RadioValue = string | number | boolean;
  type Props = Omit<RadioContractProps, 'value'> & {
    checked?: boolean;
    group?: RadioValue;
    value?: RadioValue;
    class?: string;
    className?: string;
  };
  const generatedId = $props.id();
  let {
    checked = $bindable(false),
    group = $bindable<RadioValue | undefined>(),
    value,
    name = '',
    label = '',
    description = '',
    size,
    id = generatedId,
    disabled = false,
    class: classValue = '',
    className = '',
    ...restProps
  }: Props = $props();
  const grouped = $derived(group !== undefined);
  const radioChecked = $derived(grouped ? group === value : checked);
  const handleChange = (event: Event) => {
    checked = true;
    if (grouped) group = value;
    const handler = (restProps as Record<string, unknown>).onchange;
    if (typeof handler === 'function') (handler as (event: Event) => void)(event);
  };
</script>

<div class={`krds-form-check${size ? ` ${size}` : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}>
  <input {...restProps} type="radio" {id} {name} {value} checked={radioChecked} {disabled} onchange={handleChange} aria-describedby={description ? `${id}-description` : undefined} />
  <label for={id}>{label}</label>
  {#if description}
    <div class="krds-form-check-cnt">
      <p id={`${id}-description`} class="krds-form-check-p">{description}</p>
    </div>
  {/if}
</div>
