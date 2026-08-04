import { For, Show, createSignal, mergeProps, splitProps } from "solid-js";
import type { KrdsCarouselSlide } from "@krds-community/recipes";

export interface CarouselProps {
  class?: string;
  className?: string;
  slides?: KrdsCarouselSlide[];
  href?: string;
  actionLabel?: string;
  imageLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  moreLabel?: string;
  playLabel?: string;
  stopLabel?: string;
  playing?: boolean;
  checked?: boolean;
  current?: number;
  [key: string]: unknown;
}

export function Carousel(rawProps: CarouselProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "slides",
    "href",
    "actionLabel",
    "imageLabel",
    "previousLabel",
    "nextLabel",
    "moreLabel",
    "playLabel",
    "stopLabel",
    "playing",
    "checked",
    "current",
  ]);
  const [localIndex, setLocalIndex] = createSignal<number>();
  const index = () =>
    props.current === undefined
      ? localIndex()
      : Math.max(0, Number.isFinite(props.current) ? props.current - 1 : 0);
  const currentSlideIndex = () => {
    const count = props.slides?.length ?? 0;
    const ci = index();
    if (count === 0 || ci === undefined) return undefined;
    return ((ci % count) + count) % count;
  };
  const moveSlide = (delta: number) => {
    const count = props.slides?.length ?? 0;
    if (count > 0) setLocalIndex(((currentSlideIndex() ?? 0) + delta + count) % count);
  };
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={["main-vban-wrap", "bg", className()].filter(Boolean).join(" ")}
    >
      <div class="inner">
        <div class="vb-swiper">
          <div class="swiper">
            <ul class="swiper-wrapper">
              <For each={props.slides ?? []}>
                {(slide, slideIndex) => (
                  <li
                    class="swiper-slide"
                    classList={{
                      "swiper-slide-active":
                        currentSlideIndex() !== undefined && slideIndex() === currentSlideIndex(),
                      "swiper-slide-prev":
                        currentSlideIndex() !== undefined &&
                        (props.slides?.length ?? 0) > 1 &&
                        slideIndex() ===
                          ((currentSlideIndex() ?? 0) - 1 + (props.slides?.length ?? 0)) %
                            (props.slides?.length ?? 0),
                      "swiper-slide-next":
                        currentSlideIndex() !== undefined &&
                        (props.slides?.length ?? 0) > 1 &&
                        slideIndex() ===
                          ((currentSlideIndex() ?? 0) + 1) % (props.slides?.length ?? 0),
                    }}
                    aria-current={
                      currentSlideIndex() !== undefined && slideIndex() === currentSlideIndex()
                        ? "true"
                        : undefined
                    }
                  >
                    <div class="in">
                      <div class="text">
                        <p class="tit">
                          {slide.title}
                          <br class="w-hide" />
                          {slide.title}
                        </p>
                        <Show when={slide.description}>
                          <p class="txt">
                            {slide.description}
                            <br class="w-hide" />
                            {slide.description}
                          </p>
                        </Show>
                        <a href={slide.href ?? props.href ?? "#"} class="krds-btn primary">
                          {props.actionLabel}
                        </a>
                      </div>
                      <div class="im">
                        <svg
                          width="243"
                          height="178"
                          viewBox="0 0 243 178"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label={props.imageLabel}
                        >
                          <rect width="243" height="178" fill="#E6E8EA" />
                        </svg>
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <button type="button" class="swiper-button-prev" onClick={() => moveSlide(-1)}>
            <span class="sr-only">{props.previousLabel}</span>
          </button>
          <button type="button" class="swiper-button-next" onClick={() => moveSlide(1)}>
            <span class="sr-only">{props.nextLabel}</span>
          </button>
          <div class="swiper-indicator text-center">
            <div class="swiper-pagination" />
            <a href={props.href ?? "#"} class="swiper-button-more">
              <span class="sr-only">{props.moreLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarouselBanner(rawProps: CarouselProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "slides",
    "href",
    "actionLabel",
    "imageLabel",
    "previousLabel",
    "nextLabel",
    "moreLabel",
    "playLabel",
    "stopLabel",
    "playing",
    "checked",
    "current",
  ]);
  const [, setLocalChecked] = createSignal(false);
  const [localIndex, setLocalIndex] = createSignal<number>();
  const index = () =>
    props.current === undefined
      ? localIndex()
      : Math.max(0, Number.isFinite(props.current) ? props.current - 1 : 0);
  const currentSlideIndex = () => {
    const count = props.slides?.length ?? 0;
    const ci = index();
    if (count === 0 || ci === undefined) return undefined;
    return ((ci % count) + count) % count;
  };
  const moveSlide = (delta: number) => {
    const count = props.slides?.length ?? 0;
    if (count > 0) setLocalIndex(((currentSlideIndex() ?? 0) + delta + count) % count);
  };
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`main-d-ban-swiper${className() ? ` ${className()}` : ""}`}
    >
      <div class="swiper">
        <ul class="swiper-wrapper">
          <For each={props.slides ?? []}>
            {(slide, slideIndex) => (
              <li
                class="swiper-slide"
                classList={{
                  "swiper-slide-active":
                    currentSlideIndex() !== undefined && slideIndex() === currentSlideIndex(),
                  "swiper-slide-prev":
                    currentSlideIndex() !== undefined &&
                    (props.slides?.length ?? 0) > 1 &&
                    slideIndex() ===
                      ((currentSlideIndex() ?? 0) - 1 + (props.slides?.length ?? 0)) %
                        (props.slides?.length ?? 0),
                  "swiper-slide-next":
                    currentSlideIndex() !== undefined &&
                    (props.slides?.length ?? 0) > 1 &&
                    slideIndex() === ((currentSlideIndex() ?? 0) + 1) % (props.slides?.length ?? 0),
                }}
                aria-current={
                  currentSlideIndex() !== undefined && slideIndex() === currentSlideIndex()
                    ? "true"
                    : undefined
                }
              >
                <div class="text">
                  <Show when={slide.description}>
                    <p class="cate">{slide.description}</p>
                  </Show>
                  <p class="tit">{slide.title}</p>
                </div>
                <div class="im">
                  <svg
                    width="243"
                    height="178"
                    viewBox="0 0 243 178"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label={props.imageLabel}
                  >
                    <rect width="243" height="178" fill="#E6E8EA" />
                  </svg>
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="swiper-indicator">
        <div class="swiper-pagination" />
        <div class="swiper-controller">
          <button type="button" class="swiper-button-play" onClick={() => setLocalChecked(true)}>
            <span class="sr-only">{props.playLabel}</span>
          </button>
          <button type="button" class="swiper-button-stop" onClick={() => setLocalChecked(false)}>
            <span class="sr-only">{props.stopLabel}</span>
          </button>
        </div>
        <div class="swiper-navigation">
          <button type="button" class="swiper-button-prev" onClick={() => moveSlide(-1)}>
            <span class="sr-only">{props.previousLabel}</span>
          </button>
          <button type="button" class="swiper-button-next" onClick={() => moveSlide(1)}>
            <span class="sr-only">{props.nextLabel}</span>
          </button>
          <a href={props.href ?? "#"} class="swiper-button-more">
            <span class="sr-only">{props.moreLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
