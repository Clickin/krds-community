import { computed, defineComponent, ref, type PropType } from "vue";

import { create } from "../shared.js";
import type { KrdsCarouselSlide } from "@krds-community/recipes";

export const CarouselBanner = defineComponent({
  name: "KrdsCarouselBanner",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    slides: { type: Array as PropType<KrdsCarouselSlide[]>, default: () => [] },
    href: { type: String, default: "#" },
    previousLabel: { type: String, default: undefined },
    nextLabel: { type: String, default: undefined },
    moreLabel: { type: String, default: undefined },
    imageLabel: { type: String, default: undefined },
    actionLabel: { type: String, default: undefined },
    playLabel: { type: String, default: undefined },
    stopLabel: { type: String, default: undefined },
    current: { type: Number, default: undefined },
    defaultCurrent: { type: Number, default: undefined },
  },
  emits: {
    pageChange: (_page: number) => true,
  },
  setup(props, { attrs, emit }) {
    const initialIndex = Math.max(0, (props.defaultCurrent ?? props.current ?? 1) - 1);
    const localIndex = ref(initialIndex);
    const index = computed(() =>
      Math.max(0, (props.current === undefined ? localIndex.value + 1 : props.current) - 1),
    );
    const setIndex = (next: number) => {
      if (props.current === undefined) localIndex.value = next;
      emit("pageChange", next + 1);
    };

    return () => {
      const className = attrs.class as string | undefined;
      const slides = props.slides;
      const placeholderSvgProps = {
        xmlns: "http://www.w3.org/2000/svg",
        width: "243",
        height: "178",
        viewBox: "0 0 243 178",
        fill: "none",
        "aria-label": props.imageLabel,
      };
      const placeholderRectProps = {
        width: "243",
        height: "178",
        fill: "#E6E8EA",
      };
      return create("div", { ...attrs, class: ["main-d-ban-swiper", className] }, [
        create("div", { class: "swiper" }, [
          create(
            "ul",
            { class: "swiper-wrapper" },
            slides.map((slide) =>
              create("li", { key: slide.id, class: "swiper-slide" }, [
                create("div", { class: "text" }, [
                  slide.description ? create("p", { class: "cate" }, slide.description) : null,
                  create("p", { class: "tit" }, slide.title),
                ]),
                create(
                  "div",
                  { class: "im" },
                  create("svg", placeholderSvgProps, create("rect", placeholderRectProps)),
                ),
              ]),
            ),
          ),
        ]),
        create("div", { class: "swiper-indicator" }, [
          create("div", { class: "swiper-pagination" }),
          create("div", { class: "swiper-controller" }, [
            create(
              "button",
              { type: "button", class: "swiper-button-play" },
              create("span", { class: "sr-only" }, props.playLabel),
            ),
            create(
              "button",
              { type: "button", class: "swiper-button-stop" },
              create("span", { class: "sr-only" }, props.stopLabel),
            ),
          ]),
          create("div", { class: "swiper-navigation" }, [
            create(
              "button",
              {
                type: "button",
                class: "swiper-button-prev",
                onClick: () =>
                  setIndex(slides.length ? (index.value - 1 + slides.length) % slides.length : 0),
              },
              create("span", { class: "sr-only" }, props.previousLabel),
            ),
            create(
              "button",
              {
                type: "button",
                class: "swiper-button-next",
                onClick: () => setIndex(slides.length ? (index.value + 1) % slides.length : 0),
              },
              create("span", { class: "sr-only" }, props.nextLabel),
            ),
            create(
              "a",
              { class: "swiper-button-more", href: props.href },
              create("span", { class: "sr-only" }, props.moreLabel),
            ),
          ]),
        ]),
      ]);
    };
  },
});
