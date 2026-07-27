<script lang="ts">
  import * as Components from '@krds-community/svelte';

  type ShowcaseProps = {
    component: string;
    componentProps?: Record<string, unknown>;
    snippetText?: string;
    eventLabel?: string;
    formLabel?: string;
  };

  let {
    component,
    componentProps = {},
    snippetText = '',
    eventLabel = '컴포넌트',
    formLabel = '',
  }: ShowcaseProps = $props();

  let eventStatus = $state('이벤트를 기다리는 중입니다.');

  const selectedComponent = $derived(Components[component as keyof typeof Components] as any);

  const invoke = (name: string, event: Event) => {
    eventStatus = `${eventLabel}: ${event.type}`;
    const callback = componentProps[name];
    if (typeof callback === 'function') callback(event);
  };

  const forwardedProps = $derived({
    ...componentProps,
    onclick: (event: Event) => invoke('onclick', event),
    onchange: (event: Event) => invoke('onchange', event),
    oninput: (event: Event) => invoke('oninput', event),
    ontoggle: (event: Event) => invoke('ontoggle', event),
    onclose: (event: Event) => invoke('onclose', event),
    oncancel: (event: Event) => invoke('oncancel', event),
  });

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    eventStatus = `${eventLabel}: submit`;
  };
</script>

<div class="svelte-showcase" style="display:grid;gap:1rem;max-width:52rem">
  {#if formLabel}
    <form aria-label={formLabel} onsubmit={submit}>
      <svelte:component this={selectedComponent} {...forwardedProps}>
        {#if snippetText}{snippetText}{/if}
      </svelte:component>
      <button type="submit">제출</button>
    </form>
  {:else}
    <svelte:component this={selectedComponent} {...forwardedProps}>
      {#if snippetText}{snippetText}{/if}
    </svelte:component>
  {/if}
  <p role="status" aria-live="polite">{eventStatus}</p>
</div>
