import { useState, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { CarouselImage } from "./Carousel.js";
import type { CarouselProps } from "./Carousel.js";

export function CarouselBanner({
  slides = [],
  label: _label,
  autoPlay = true,
  previousLabel,
  nextLabel,
  moreLabel,
  playLabel,
  stopLabel,
  imageLabel,
  onSlideChange,
  onPlayingChange,
  className,
  ref,
  ..._props
}: CarouselProps & { ref?: Ref<HTMLDivElement> }) {
  const [, setIndex] = useState(0);
  const [, setPlaying] = useState(autoPlay);
  const move = (delta: number) => {
    if (!slides.length) return;
    setIndex((current) => {
      const next = (current + delta + slides.length) % slides.length;
      onSlideChange?.(next);
      return next;
    });
  };
  const updatePlaying = (next: boolean) => {
    setPlaying(next);
    onPlayingChange?.(next);
  };
  return (
    <div ref={ref} className={cx("main-d-ban-swiper", className)}>
      <div className="swiper">
        <ul className="swiper-wrapper">
          {slides.map((slide) => (
            <li className="swiper-slide" key={slide.id}>
              <div className="text">
                <p className="cate">{slide.description}</p>
                <p className="tit">{slide.title}</p>
              </div>
              <div className="im">
                <CarouselImage {...(imageLabel === undefined ? {} : { label: imageLabel })} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="swiper-indicator">
        <div className="swiper-pagination" />
        <div className="swiper-controller">
          <button type="button" className="swiper-button-play" onClick={() => updatePlaying(true)}>
            <span className="sr-only">{playLabel}</span>
          </button>
          <button type="button" className="swiper-button-stop" onClick={() => updatePlaying(false)}>
            <span className="sr-only">{stopLabel}</span>
          </button>
        </div>
        <div className="swiper-navigation">
          <button type="button" className="swiper-button-prev" onClick={() => move(-1)}>
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button type="button" className="swiper-button-next" onClick={() => move(1)}>
            <span className="sr-only">{nextLabel}</span>
          </button>
          <a href="#" className="swiper-button-more">
            <span className="sr-only">{moreLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
