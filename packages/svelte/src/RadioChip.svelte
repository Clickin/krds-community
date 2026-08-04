<script lang="ts">
  type Props = {
    id?: string;
    name?: string;
    value?: string | number | boolean;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    form?: string;
    modelValue?: string | number | boolean;
    checked?: boolean;
    onchange?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    value,
    label = '레이블',
    disabled = false,
    required = false,
    form,
    modelValue = $bindable<string | number | boolean | undefined>(),
    checked = $bindable<boolean | undefined>(),
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const radioChecked = $derived(modelValue !== undefined ? modelValue === value : checked);
  const setRadio = (event: Event) => {
    checked = (event.currentTarget as HTMLInputElement).checked;
    modelValue = value;
    if (onchange) onchange(event);
  };
</script>

<div class={`krds-form-chip ${rootClass}`}>
  <input
    {...rest}
    class={`radio ${rootClass}`}
    type="radio"
    id={id}
    name={name || undefined}
    {value}
    checked={radioChecked}
    {disabled}
    {required}
    {form}
    onchange={setRadio}
  />
  <label class="krds-form-chip-outline" for={id}>{label}</label>
</div>