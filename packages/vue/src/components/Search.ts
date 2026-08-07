import { defineComponent, ref, type PropType } from "vue";

import { create, withoutNativeEvents } from "../shared.js";

export const Search = defineComponent({
  name: "KrdsSearch",
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<"xlarge" | "large" | "medium">, default: "large" },
    placeholder: { type: String, default: undefined },
    buttonLabel: { type: String, default: undefined },
    onSearch: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  emits: {
    search: (_value: string) => true,
  },
  setup(props, { attrs, emit }) {
    const value = ref("");

    const submit = () => {
      props.onSearch?.(value.value);
      emit("search", value.value);
    };

    return () => {
      const className = attrs.class as string | undefined;
      return create(
        "div",
        { ...withoutNativeEvents(attrs), class: ["krds-search", props.size, className] },
        [
          create("div", { class: "search-input-wrap" }, [
            create("input", {
              type: "search",
              class: "krds-input",
              placeholder: props.placeholder ?? "검색어를 입력해 주세요",
              "aria-label": "검색어",
              value: value.value,
              onInput: (event: Event) => {
                value.value = (event.target as HTMLInputElement).value;
              },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === "Enter") submit();
              },
            }),
          ]),
          create(
            "button",
            {
              type: "button",
              class: ["krds-btn", props.size, "primary"],
              "aria-label": props.buttonLabel ?? "검색",
              onClick: submit,
            },
            props.buttonLabel ?? "검색",
          ),
        ],
      );
    };
  },
});
