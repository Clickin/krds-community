import { computed, defineComponent, ref, type PropType } from "vue";

import { create, itemLabel } from "../shared.js";
import type { AnyItem } from "../types.js";
export const Pagination = defineComponent({
  name: "KrdsPagination",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    items: { type: Array as PropType<AnyItem[]>, default: () => [1, 2, 3, 4, 5] },
    previousDisabled: Boolean,
    nextDisabled: Boolean,
    title: { type: String, default: undefined },
    label: { type: String, default: undefined },
    previousLabel: { type: String, default: "이전" },
    nextLabel: { type: String, default: "다음" },
    navigationLabel: { type: String, default: "페이지 이동" },
    message: { type: String, default: "현재페이지" },
    current: { type: Number, default: undefined },
    defaultCurrent: { type: Number, default: 1 },
  },
  emits: {
    pageChange: (_page: number) => true,
  },
  setup(props, { attrs, emit }) {
    const initialIndex = Math.max(0, (props.defaultCurrent ?? props.current ?? 1) - 1);
    const localIndex = ref(initialIndex);
    const currentPage = computed(() =>
      props.current === undefined ? localIndex.value + 1 : Number(props.current) || 1,
    );
    const maxPage = computed(() =>
      Math.max(1, ...props.items.map((item) => Number(itemLabel(item))).filter(Number.isFinite)),
    );
    const setPage = (next: number) => {
      if (props.current === undefined) localIndex.value = Math.max(0, next - 1);
      emit("pageChange", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      const pages = props.items.length ? props.items : [];
      return create(
        "div",
        {
          ...attrs,
          class: ["krds-pagination", className],
          role: "navigation",
          "aria-label": props.navigationLabel ?? props.label ?? props.title,
        },
        [
          props.previousDisabled || currentPage.value <= 1
            ? create(
                "span",
                { class: ["page-navi", "prev", "disabled"], href: "#" },
                props.previousLabel,
              )
            : create(
                "a",
                {
                  class: ["page-navi", "prev"],
                  href: "#",
                  onClick: (event: Event) => {
                    event.preventDefault();
                    setPage(currentPage.value - 1);
                  },
                },
                props.previousLabel,
              ),
          create(
            "div",
            { class: "page-links" },
            pages.map((item, itemIndex) => {
              if (item === "ellipsis")
                return create("span", {
                  key: itemIndex,
                  class: ["page-link", "link-dot"],
                });
              const page = typeof item === "number" ? item : Number(itemLabel(item));
              return create(
                "a",
                {
                  key: itemIndex,
                  href: "#",
                  class: ["page-link", page === currentPage.value ? "active" : undefined],
                  onClick: (event: Event) => {
                    event.preventDefault();
                    if (Number.isFinite(page)) setPage(page);
                  },
                },
                [
                  page === currentPage.value
                    ? create("span", { class: "sr-only" }, `${props.message} `)
                    : null,
                  String(page),
                ],
              );
            }),
          ),
          props.nextDisabled || currentPage.value >= maxPage.value
            ? create(
                "span",
                { class: ["page-navi", "next", "disabled"], href: "#" },
                props.nextLabel,
              )
            : create(
                "a",
                {
                  class: ["page-navi", "next"],
                  href: "#",
                  onClick: (event: Event) => {
                    event.preventDefault();
                    setPage(currentPage.value + 1);
                  },
                },
                props.nextLabel,
              ),
        ],
      );
    };
  },
});
