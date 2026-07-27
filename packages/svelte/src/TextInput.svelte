<script lang="ts">
  import type { TextInputContractProps } from '@krds-community/recipes';
  type Props = Omit<TextInputContractProps, 'value'> & {
    value?: string;
    id?: string;
    class?: string;
    className?: string;
  };

  const generatedId = $props.id();
  let {
    value = $bindable(''),
    label = '',
    hint = '',
    state = 'default',
    size,
    id = generatedId,
    disabled = false,
    readonly = false,
    required = false,
    class: classValue = '',
    className = '',
    ...restProps
  }: Props = $props();
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
      bind:value
      {id}
      {disabled}
      {readonly}
      {required}
      class={`krds-input${size ? ` ${size}` : ''}${classValue ? ` ${classValue}` : ''}${className ? ` ${className}` : ''}`}
      aria-invalid={state === 'error' ? 'true' : undefined}
      aria-describedby={hint ? `${id}-hint` : undefined}
    />
  </div>
  {#if hint}
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
      {hint}
    </p>
  {/if}
</div>
