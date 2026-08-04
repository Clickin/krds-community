<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { invoke } from './lib/shared.js';
  import { fieldOf, labelOf, listOf } from './lib/shared.js';

  type FileItem = Record<string, unknown>;

  type Props = {
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    prompt?: string;
    inputId?: string;
    selectLabel?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    required?: boolean;
    form?: string;
    currentCount?: number;
    maxCount?: number;
    label,
    countSuffix?: string;
    files?: FileItem[];
    label?: string;
    deleteAllLabel?: string;
    onchange?: (event: Event) => void;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    name = '',
    title = '제목',
    description = '',
    prompt = '',
    inputId = '',
    selectLabel = '',
    accept,
    multiple = false,
    disabled = false,
    required = false,
    form,
    currentCount = 0,
    maxCount = 0,
    countSuffix = '',
    label,
    files = [],
    deleteAllLabel = '',
    onchange,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());

  let uploadValue = $state('');
  let uploadInput: HTMLInputElement | undefined = $state();

  const setUpload = (event: Event) => {
    uploadValue = Array.from((event.currentTarget as HTMLInputElement).files ?? [])
      .map((file) => file.name)
      .join(', ');
    invoke(onchange, event);
  };
</script>

<div {...rest} class={`krds-file-upload line ${rootClass}`}>
  <div class="file-head">
    <h3 class="tit">{title}</h3>
    {#if description}<div><p>{description}</p></div>{/if}
  </div>
  <div class="file-upload">
    <p class="txt">{prompt}</p>
    <div class="file-upload-btn-wrap">
      <input
        bind:this={uploadInput}
        hidden
        id={inputId || id}
        name={name}
        type="file"
        aria-label={selectLabel || title || undefined}
        {accept}
        {multiple}
        {disabled}
        {required}
        {form}
        onchange={setUpload}
      />
      <button
        type="button"
        class="krds-btn medium"
        {disabled}
        onclick={() => uploadInput?.click()}
      ><i class="svg-icon ico-upload"></i>{selectLabel}</button>
    </div>
  </div>
  <div class="file-list">
    <div class="total">
      <span class="current">{currentCount}{countSuffix || '개'}</span> / {maxCount}{countSuffix || '개'}
    </div>
    <ul class="upload-list">
      {#each files as file}
        {@const fileStatus = fieldOf(file, 'status')}
        {@const fileErrors = listOf(file, 'errors')}
        <li class:is-error={fileStatus === 'error'}>
          <div class="file-info" class:m-column={fileStatus === 'downloadable'}>
            <div class="file-name">{fieldOf(file, 'name')}</div>
            <div class="btn-wrap">
              {#if fileStatus === 'uploading'}
                <span class="krds-spinner" role="status">
                  <span class="sr-only">{fieldOf(file, 'statusLabel')}</span>
                </span>
              {:else if fileStatus === 'complete'}
                <span class="ico-invalid complete">
                  <em class="sr-only">{fieldOf(file, 'statusLabel')}</em>
                </span>
              {/if}
              {#if fieldOf(file, 'deleteLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'deleteLabel')} <i class="svg-icon ico-delete-fill"></i>
                </button>
              {/if}
              {#if fieldOf(file, 'downloadLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'downloadLabel')} <i class="svg-icon ico-down"></i>
                </button>
              {/if}
              {#if fieldOf(file, 'previewLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'previewLabel')} <i class="svg-icon ico-angle right"></i>
                </button>
              {/if}
            </div>
          </div>
          {#if fileErrors.length}
            <p class="file-hint-invalid">
              {#each fileErrors as fileError, index}
                {labelOf(fileError)}{#if index < fileErrors.length - 1}<br />{/if}
              {/each}
            </p>
          {/if}
        </li>
      {/each}
    </ul>
    {#if uploadValue}<p aria-live="polite">{uploadValue}</p>{/if}
    <div class="upload-delete-btn">
      <button class="krds-btn xsmall tertiary" type="button">
        {deleteAllLabel}<i class="svg-icon ico-angle right"></i>
      </button>
    </div>
  </div>
</div>