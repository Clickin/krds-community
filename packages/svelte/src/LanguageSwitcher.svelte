<script lang="ts">
  import { fieldOf, flagOf, invoke } from './lib/shared.js';
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    label?: string;
    kind?: 'default' | 'page' | string;
    open?: boolean;
    languages?: unknown[];
    options?: unknown[];
    selected?: string;
    modelValue?: string;
    defaultValue?: string;
    selectedLabel?: string;
    currentLabel?: string;
    externalTitle?: string;
    onclick?: (event: Event) => void;
    onchange?: (event: Event) => void;
    className?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    label = '레이블',
    kind = 'default',
    open = $bindable<boolean | undefined>(),
    languages = [],
    options = [],
    selected = $bindable<string | undefined>(),
    modelValue = $bindable<string | undefined>(),
    defaultValue = '',
    selectedLabel = '',
    currentLabel = '',
    externalTitle = '새 창 열림',
    onclick,
    onchange,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const languageItems = $derived(languages.length ? languages : options);
  const selection = $derived(
    modelValue !== undefined
      ? String(modelValue)
      : selected !== undefined
        ? selected
      : defaultValue || fieldOf(languageItems[0], 'value'),
  );
  const currentLanguage = $derived(languageItems.find((language) => fieldOf(language, 'value') === selection));
  const isOpen = $derived(open ?? false);
  const isPage = $derived(kind === 'page');
  const visibleLanguages = $derived(
    isPage ? languageItems.filter((language) => fieldOf(language, 'value') !== selection) : languageItems,
  );
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event && onclick) onclick(event);
  };
  const setSelection = (next: string, event?: Event) => {
    selected = next;
    modelValue = next;
    open = false;
    if (event) invoke(onchange, event);
  };

</script>

<div {...rest} class={`krds-drop-wrap krds-language ${rootClass}`.trim()}>
  <button
    class="krds-btn small text drop-btn"
    class:active={isOpen}
    type="button"
    aria-expanded={isOpen}
    aria-controls={`${id}-menu`}
    onclick={() => toggleOpen()}
  ><i class="svg-icon ico-global"></i>{' '}{label}{' '}<i class="svg-icon ico-toggle"></i></button>
  <div class="drop-menu" id={`${id}-menu`}>
    <div class="drop-in">
      {#if isPage}
        <div class="drop-top">
          <p class="current-laguage">
            <span>{currentLabel}</span>
            <strong>{fieldOf(currentLanguage, 'label')}</strong>
          </p>
        </div>
      {/if}
      <ul class="drop-list">
        {#each visibleLanguages as language}
          {@const value = fieldOf(language, 'value')}
          {@const external = isPage || flagOf(language, 'external') || fieldOf(language, 'target') === '_blank'}
          {@const target = fieldOf(language, 'target') || (external ? '_blank' : '')}
          {@const title = fieldOf(language, 'title') || (external ? externalTitle : '')}
          <li>
            <a
              class="item-link"
              class:active={!isPage && selection === value}
              href={fieldOf(language, 'href') || './'}
              lang={fieldOf(language, 'lang') || value}
              target={target || undefined}
              title={title || undefined}
              aria-disabled={flagOf(language, 'disabled') || undefined}
              onclick={(event: Event) => {
                event.preventDefault();
                if (!flagOf(language, 'disabled')) setSelection(value, event);
              }}
            >
              {fieldOf(language, 'label')}
              {#if isPage}<i class="svg-icon ico-go"></i>{/if}
              <span class="sr-only">{!isPage && selection === value ? selectedLabel : ''}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
