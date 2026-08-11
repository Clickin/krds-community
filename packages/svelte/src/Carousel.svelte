<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { invoke } from './lib/shared.js';

  type Slide = {
    title?: string;
    description?: string;
    href?: string;
    [key: string]: unknown;
  };

  type Props = {
    id?: string;
    slides?: Slide[];
    href?: string;
    previousLabel?: string;
    nextLabel?: string;
    moreLabel?: string;
    playLabel?: string;
    stopLabel?: string;
    imageLabel?: string;
    actionLabel?: string;
    current?: number;
    kind?: 'carousel' | 'banner' | string;
    onclick?: (event: Event) => void;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    slides = [],
    href = '#',
    previousLabel = '이전',
    nextLabel = '다음',
    moreLabel = '더 보기',
    playLabel = '재생',
    stopLabel = '멈춤',
    imageLabel = '',
    actionLabel = '',
    current = $bindable(0),
    kind = 'carousel',
    onclick,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const currentIndex = $derived(current ?? 0);

  const moveSlide = (delta: number, event?: Event) => {
    const count = slides.length;
    if (count) current = (currentIndex + delta + count) % count;
    if (event) invoke(onclick, event);
  };
</script>

{#snippet CarouselBanner()}
  <div {...rest} class={`main-d-ban-swiper ${rootClass}`}>
    <div class="swiper">
      <ul class="swiper-wrapper">
        {#each slides as slide}
          <li class="swiper-slide">
            <div class="text">
              <p class="cate">{slide.description}</p>
              <p class="tit">{slide.title}</p>
            </div>
            <div class="im">
              <svg
                width="243"
                height="178"
                viewBox="0 0 243 178"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={imageLabel || undefined}
              >
                <rect width="243" height="178" fill="#E6E8EA"></rect>
              </svg>
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="swiper-indicator">
      <div class="swiper-pagination"></div>
      <div class="swiper-controller">
        <button type="button" class="swiper-button-play" onclick={(event) => invoke(onclick, event)}>
          <span class="sr-only">{playLabel}</span>
        </button>
        <button type="button" class="swiper-button-stop" onclick={(event) => invoke(onclick, event)}>
          <span class="sr-only">{stopLabel}</span>
        </button>
      </div>
      <div class="swiper-navigation">
        <button type="button" class="swiper-button-prev" onclick={(event) => moveSlide(-1, event)}>
          <span class="sr-only">{previousLabel}</span>
        </button>
        <button type="button" class="swiper-button-next" onclick={(event) => moveSlide(1, event)}>
          <span class="sr-only">{nextLabel}</span>
        </button>
        <a href={href} class="swiper-button-more">
          <span class="sr-only">{moreLabel}</span>
        </a>
      </div>
    </div>
  </div>
{/snippet}
{#if kind === 'banner'}
  {@render CarouselBanner()}
{:else}
  <div {...rest} class={`main-vban-wrap bg ${rootClass}`}>
    <div class="inner">
      <div class="vb-swiper">
        <div class="swiper">
          <ul class="swiper-wrapper">
            {#each slides as slide}
              <li class="swiper-slide">
                <div class="in">
                  <div class="text">
                    <p class="tit">{slide.title} <br class="w-hide" />{slide.title}</p>
                    <p class="txt">
                      {slide.description} <br class="w-hide" />{slide.description}
                    </p>
                    <a href={slide.href ?? '#'} class="krds-btn primary">{actionLabel}</a>
                  </div>
                  <div class="im">
                    <svg
                      width="243"
                      height="178"
                      viewBox="0 0 243 178"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label={imageLabel || undefined}
                    >
                      <rect width="243" height="178" fill="#E6E8EA"></rect>
                    </svg>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
        <button type="button" class="swiper-button-prev" onclick={(event) => moveSlide(-1, event)}>
          <span class="sr-only">{previousLabel}</span>
        </button>
        <button type="button" class="swiper-button-next" onclick={(event) => moveSlide(1, event)}>
          <span class="sr-only">{nextLabel}</span>
        </button>
        <div class="swiper-indicator text-center">
          <div class="swiper-pagination"></div>
          <a href={href} class="swiper-button-more">
            <span class="sr-only">{moreLabel}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
