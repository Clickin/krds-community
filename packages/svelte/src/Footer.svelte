<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fieldOf, labelOf, hrefOf, flagOf } from './lib/shared.js';

  type NavItem = {
    label?: string;
    href?: string;
    [key: string]: unknown;
  };

  type ContactItem = {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };

  type SocialLink = NavItem & {
    target?: string;
    icon?: string;
  };

  type Props = {
    id?: string;
    relatedSites?: NavItem[];
    logoLabel?: string;
    address?: string;
    contacts?: ContactItem[];
    links?: NavItem[];
    socialLinks?: SocialLink[];
    policyLinks?: NavItem[];
    organization?: string;
    description?: string;
    copyright?: string;
    children?: Snippet;
    className?: string;
    class?: string;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = 'krds-footer',
    relatedSites = [],
    logoLabel = '',
    address = '',
    contacts = [],
    links = [],
    socialLinks = [],
    policyLinks = [],
    organization = '',
    description = '',
    copyright = '',
    children,
    className = '',
    class: classProp = '',
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
</script>

<footer {...rest} id={id} class={rootClass}>
  <div class="foot-quick">
    <div class="inner">
      {#each relatedSites as item}
        <button class="link" type="button" title={fieldOf(item, 'title') || undefined}>
          {labelOf(item)}
        </button>
      {/each}
    </div>
  </div>
  <div class="inner">
    <div class="f-logo"><span class="sr-only">{logoLabel}</span></div>
    <div class="f-cnt">
      <div class="f-info">
        <p class="info-addr">{address}</p>
        <ul class="info-cs">
          {#each contacts as contact}
            <li>
              <strong class="strong">{fieldOf(contact, 'title')}</strong><span class="span">{fieldOf(contact, 'description')}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="f-link">
        <div class="link-go">
          {#each links as item}
            <a href={hrefOf(item)} class="krds-btn medium text">
              {labelOf(item)} <i class="svg-icon ico-angle right"></i>
            </a>
          {/each}
        </div>
        <div class="link-sns">
          {#each socialLinks as item}
            <a
              href={hrefOf(item)}
              class="krds-btn xlarge icon border"
              target={fieldOf(item, 'target') || undefined}
              title={fieldOf(item, 'title') || undefined}
            >
              <span class="sr-only">{labelOf(item)}</span>
              <i class={`svg-icon ico-${fieldOf(item, 'icon')}`}></i>
            </a>
          {/each}
        </div>
      </div>
    </div>
    <div class="f-btm">
      <div class="f-btm-text">
        <div class="f-menu">
          {#each policyLinks as item}
            <a class:point={flagOf(item, 'emphasis')} href={hrefOf(item)}>{labelOf(item)}</a>
          {/each}
        </div>
        <p class="f-copy">{copyright}</p>
      </div>
      <div class="krds-identifier">
        <span class="logo"><span class="sr-only">{organization}</span></span>
        <span class="ban-txt">{description}</span>
      </div>
    </div>
  </div>
</footer>