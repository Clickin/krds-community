<script lang="ts">
  import RadioButton from './RadioButton.svelte';
  import Button from './Button.svelte';

  type Option = { value: string; label: string };

  type Props = {
    title?: string;
    options?: Option[];
    onsubmit?: (value: string) => void;
    submitLabel?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  const generatedId = $props.id();

  let {
    id = generatedId,
    title = '이 페이지에 만족하시나요?',
    options = [
      { value: 'satisfied', label: '만족' },
      { value: 'dissatisfied', label: '불만족' },
    ],
    onsubmit,
    submitLabel = '제출',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  let selectedValue = $state<string | number | boolean | undefined>();

  const submit = () => {
    if (selectedValue === undefined) return;
    onsubmit?.(String(selectedValue));
  };
</script>

<div {...rest} class={`krds-user-feedback ${rootClass}`}>
  <fieldset>
    <legend class="feedback-title">{title}</legend>
    <div class="feedback-options">
      {#each options as option}
        <RadioButton
          id={`${id}-${option.value}`}
          name={id}
          value={option.value}
          label={option.label}
          bind:modelValue={selectedValue}
        />
      {/each}
    </div>
    <Button size="small" variant="primary" onclick={submit}>{submitLabel}</Button>
  </fieldset>
</div>
