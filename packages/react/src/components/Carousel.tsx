import { useCallback, useEffect, useState, type ReactNode, type Ref } from "react";
import { cx, type KrdsCarouselSlide } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

export function CarouselImage({ label }: { label?: string }) {
  return (
    <svg
      width="243"
      height="178"
      viewBox="0 0 243 178"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
    >
      <rect width="243" height="178" fill="#E6E8EA" />
    </svg>
  );
}

export interface CarouselProps extends BoxProps {
  slides?: KrdsCarouselSlide[];
  label?: string;
  autoPlay?: boolean;
  interval?: number;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  moreLabel?: ReactNode;
  playLabel?: ReactNode;
  stopLabel?: ReactNode;
  imageLabel?: string;
  actionLabel?: ReactNode;
  onSlideChange?: (index: number) => void;
  onPlayingChange?: (playing: boolean) => void;
}

export function Carousel({
  slides = [],
  label: _label,
  autoPlay = false,
  interval = 5000,
  previousLabel,
  nextLabel,
  moreLabel,
  imageLabel,
  actionLabel,
  onSlideChange,
  className,
  ref,
  ..._props
}: CarouselProps & { ref?: Ref<HTMLDivElement> }) {
  const [, setIndex] = useState(0);
  const move = useCallback(
    (delta: number) => {
      if (!slides.length) return;
      setIndex((current) => {
        const next = (current + delta + slides.length) % slides.length;
        onSlideChange?.(next);
        return next;
      });
    },
    [onSlideChange, slides.length],
  );
  useEffect(() => {
    if (!autoPlay || slides.length < 2) return;
    const timer = window.setInterval(() => move(1), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, interval, move, slides.length]);
  return (
    <div ref={ref} className={cx("main-vban-wrap", "bg", className)}>
      <div className="inner">
        <div className="vb-swiper">
          <div className="swiper">
            <ul className="swiper-wrapper">
              {slides.map((slide) => (
                <li className="swiper-slide" key={slide.id}>
                  <div className="in">
                    <div className="text">
                      <p className="tit">
                        {slide.title} <br className="w-hide" />
                        {slide.title}
                      </p>
                      <p className="txt">
                        {slide.description} <br className="w-hide" />
                        {slide.description}
                      </p>
                      <a href={slide.href ?? "#"} className="krds-btn primary">
                        {actionLabel}
                      </a>
                    </div>
                    <div className="im">
                      <CarouselImage {...(imageLabel === undefined ? {} : { label: imageLabel })} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="swiper-button-prev" onClick={() => move(-1)}>
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button type="button" className="swiper-button-next" onClick={() => move(1)}>
            <span className="sr-only">{nextLabel}</span>
          </button>
          <div className="swiper-indicator text-center">
            <div className="swiper-pagination" />
            <a href="#" className="swiper-button-more">
              <span className="sr-only">{moreLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
