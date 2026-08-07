<script lang="ts">
  type Props = {
    size?: 'xlarge' | 'large' | 'medium';
    placeholder?: string;
    onsearch?: (value: string) => void;
    buttonLabel?: string;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    size = 'large',
    placeholder = '검색어를 입력해 주세요',
    onsearch,
    buttonLabel = '검색',
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  let value = $state('');

  const submit = () => onsearch?.(value);

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') submit();
  };
</script>

<div {...rest} class={`krds-search ${size} ${rootClass}`}>
  <div class="search-input-wrap">
    <input
      type="search"
      class="krds-input"
      {placeholder}
      aria-label="검색어"
      bind:value
      onkeydown={handleKeydown}
    />
  </div>
  <button type="button" class="krds-btn large primary" aria-label={buttonLabel} onclick={submit}>
    {buttonLabel}
  </button>
</div>
