<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    name?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    form?: string;
    size?: string;
    modelValue?: string | number | boolean;
    checked?: boolean;
    onchange?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    name = '',
    label = '',
    disabled = false,
    required = false,
    form,
    size = '',
    modelValue = $bindable<string | number | boolean | undefined>(),
    checked = $bindable<boolean | undefined>(),
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const checkedValue = $derived(
    checked !== undefined
      ? Boolean(checked)
      : typeof modelValue === 'boolean'
        ? modelValue
        : Boolean(modelValue),
  );
  const handleChange = (event: Event) => {
    const next = (event.currentTarget as HTMLInputElement).checked;
    checked = next;
    if (typeof modelValue === 'boolean' || modelValue === undefined) modelValue = next;
    if (onchange) onchange(event);
  };
</script>

<div class={`krds-form-toggle-switch ${size} ${rootClass}`}>
  <input
    {...rest}
    id={id}
    type="checkbox"
    name={name || undefined}
    {disabled}
    {required}
    {form}
    checked={checkedValue}
    onchange={handleChange}
  />
  <label for={id}><span class="switch-toggle"><i></i></span>{label}</label>
</div>