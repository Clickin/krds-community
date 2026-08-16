<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    id?: string;
    title?: string;
    stepTitle?: string;
    description?: string;
    currentStep?: string;
    step?: string;
    totalSteps?: string;
    currentStepLabel?: string;
    totalStepsLabel?: string;
    stopLabel?: string;
    nextLabel?: string;
    label,
    contentTitle?: string;
label?: string;
    open?: boolean;
    onclick?: (event: Event) => void;
    class?: string;
    className?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  const generatedId = $props.id();
  let {
    id = generatedId,
    title = '',
    stepTitle = '',
    description = '',
    currentStep = '',
    step = '',
    totalSteps = '',
    currentStepLabel = '현재 단계',
    totalStepsLabel = '총 단계',
    stopLabel = '',
    nextLabel = '',
    label,
    contentTitle = '',
    open = $bindable<boolean | undefined>(),
    onclick,
    class: classProp = '',
    className = '',
    children,
    ...rest
  }: Props = $props();
  const rootClass = $derived(`${classProp} ${className}`.trim());
  const isOpen = $derived(open ?? true);
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event && onclick) onclick(event);
  };
</script>

<div {...rest} class={`bg-white bg-white krds-coach-mark txt-box ${rootClass}`} hidden={!isOpen}>
  <div class="coach-balloon">
    {#if title}<h5 class="sr-only">{title}</h5>{/if}
    <h6 class="coach-tit">{stepTitle}</h6>
    <p class="desc">{description}</p>
    <div class="coach-controls">
      <div class="num">
        <span class="sr-only">{currentStepLabel}</span><strong>{currentStep || step.split('/')[0]}</strong>
        <span class="sr-only">{totalStepsLabel}</span><span>{totalSteps || step.split('/')[1]}</span>
      </div>
      <div class="btn-wrap">
        <button class="krds-btn small text" type="button" onclick={() => toggleOpen()}>{stopLabel}</button>
        <button class="krds-btn small tertiary" type="button">{nextLabel}</button>
      </div>
    </div>
  </div>
  <div><h3>{#if children}{@render children()}{:else}{contentTitle}{/if}</h3></div>
</div>