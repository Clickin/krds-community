<script lang="ts">
  type Props = {
    id?: string;
    name?: string;
    value?: string | number | boolean;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    form?: string;
    size?: string;
    modelValue?: string | number | boolean | string[];
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
    size = '',
    modelValue = $bindable<string | number | boolean | string[] | undefined>(),
    checked = $bindable<boolean | undefined>(),
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const chipChecked = $derived(
    Array.isArray(modelValue)
      ? modelValue.includes(String(value))
      : modelValue !== undefined
        ? modelValue === value
        : checked,
  );
  const setChip = (event: Event) => {
    const next = (event.currentTarget as HTMLInputElement).checked;
    if (Array.isArray(modelValue)) {
      const item = String(value);
      modelValue = next
        ? modelValue.includes(item)
          ? modelValue
          : [...modelValue, item]
        : modelValue.filter((entry) => entry !== item);
      checked = next;
      if (onchange) onchange(event);
    } else {
      checked = next;
      if (typeof modelValue === 'boolean' || modelValue === undefined) modelValue = next;
      if (onchange) onchange(event);
    }
  };
</script>

<div class={`krds-form-check ${size} ${rootClass}`}>
  <input
    {...rest}
    type="checkbox"
    id={id}
    name={name || undefined}
    value={value}
    checked={chipChecked}
    {disabled}
    {required}
    {form}
    onchange={setChip}
  />
  <label for={id}>{label}</label>
</div>