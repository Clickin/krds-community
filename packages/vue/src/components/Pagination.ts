import { computed, defineComponent, ref, type PropType } from "vue";

import { create, itemLabel } from "../shared.js";

export const Pagination = defineComponent({
  name: "KrdsPagination",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    items: { type: Array as PropType<any[]>, default: () => [] },
    previousDisabled: Boolean,
    title: { type: String, default: undefined },
    label: { type: String, default: undefined },
    previousLabel: { type: String, default: undefined },
    nextLabel: { type: String, default: undefined },
    navigationLabel: { type: String, default: undefined },
    message: { type: String, default: undefined },
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
      props.current === undefined ? localIndex.value + 1 : props.current,
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
          props.previousDisabled
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
            pages.map((item: any, itemIndex: number) => {
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
                    ? create("span", { class: "sr-only" }, props.message)
                    : null,
                  String(page),
                ],
              );
            }),
          ),
          create(
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
