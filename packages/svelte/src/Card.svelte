<script lang="ts">
  import Badge from './Badge.svelte';
  import Button from './Button.svelte';
  import Checkbox from './Checkbox.svelte';

  type Action = { label: string; onClick?: () => void };

  type Props = {
    type?: 'vertical' | 'horizontal';
    image?: string;
    imageAlt?: string;
    title: string;
    description?: string;
    badges?: string[];
    actions?: Action[];
    checkbox?: Record<string, unknown>;
    class?: string;
    className?: string;
    [key: string]: unknown;
  };

  let {
    type = 'vertical',
    image = '',
    imageAlt = '',
    title,
    description = '',
    badges = [],
    actions = [],
    checkbox,
    class: classProp = '',
    className = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<article {...rest} class={`krds-card ${type} ${rootClass}`}>
  {#if image || badges.length || checkbox}
    <div class="card-top">
      {#if image}
        <img class="card-image" src={image} alt={imageAlt} />
      {/if}
      {#each badges as badge}
        <div class="card-badge">
          <Badge label={badge} appearance="solid" />
        </div>
      {/each}
      {#if checkbox}
        <Checkbox {...checkbox} />
      {/if}
    </div>
  {/if}
  <div class="card-conts">
    <h3 class="card-title">{title}</h3>
    {#if description}
      <p class="card-description">{description}</p>
    {/if}
    {#if actions.length}
      <div class="card-actions">
        {#each actions as action}
          <Button size="small" variant="primary" onclick={action.onClick}>{action.label}</Button>
        {/each}
      </div>
    {/if}
  </div>
</article>
