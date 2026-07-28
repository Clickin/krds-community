<script lang="ts">
  import type { TextInputContractProps } from '@krds-community/recipes';
  type Props = Omit<TextInputContractProps, 'value'> & {
    value?: string;
    error?: string;
    id?: string;
    class?: string;
    className?: string;
    oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
  };

  const generatedId = $props.id();
  let {
    value = $bindable(''),
    label = '',
    hint = '',
    state = 'default',
    error = '',
    size,
    id = generatedId,
    disabled = false,
    readonly = false,
    required = false,
    class: classValue = '',
    className = '',
    oninput,
    ...restProps
  }: Props = $props();

  const message = $derived(state === 'error' ? error || hint : hint);
  let inputElement: HTMLInputElement;
  $effect(() => {
    if (value) inputElement.setAttribute('value', value);
    else inputElement.removeAttribute('value');
  });
</script>

<div class="form-group">
  <div class="form-tit">
    <label for={id}>{label}</label>
  </div>
  <div
    class="form-conts"
    class:is-error={state === 'error'}
    class:is-success={state === 'success'}
    class:is-information={state === 'information'}
  >
    <input
      {...restProps}
      value={value}
      bind:this={inputElement}
      oninput={(event) => {
        value = event.currentTarget.value;
        oninput?.(event);
      }}
      {id}
      {disabled}
      {readonly}
      {required}
      class={`krds-input${size ? ` ${size}` : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}
      aria-invalid={state === 'error' ? 'true' : undefined}
      aria-describedby={message ? `${id}-hint` : undefined}
    />
  </div>
  {#if message}
    <p
      id={`${id}-hint`}
      class={state === 'error'
        ? 'form-hint-invalid'
        : state === 'success'
          ? 'form-hint-success'
          : state === 'information'
            ? 'form-hint-information'
            : 'form-hint'}
    >
      {message}
    </p>
  {/if}
</div>
