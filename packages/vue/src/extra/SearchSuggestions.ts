import {
  computed,
  defineComponent,
  h,
  onUnmounted,
  ref,
  useId,
  watch,
  type PropType,
} from "vue";

/**
 * 검색어 입력 시 실시간 추천 검색어를 제공하는 combobox 컴포넌트 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(service_02_03.html: 실시간 검색어 제안 — ↑↓/Enter/Esc, Status Messages)을
 * 참조해 동일한 키보드·접근성 계약을 구현한다.
 *
 * 백엔드 배선: `suggest` 콜백이 검색어를 받아 제안 목록을 반환한다. 데모/문서/
 * 테스트에서는 `suggestions` 정적 목록을 주면 클라이언트에서 필터링한다.
 */

export interface SearchSuggestion {
  id: string;
  label: string;
  /** 폼 제출/선택 시 사용할 값. 기본값은 label. */
  value?: string;
}

export interface SearchSuggestionsProps {
  label: string;
  name?: string;
  placeholder?: string;
  /** 백엔드 배선: 검색어(query) → 제안 목록. 실서비스에서 사용한다. */
  suggest?: (query: string) => Promise<SearchSuggestion[]> | SearchSuggestion[];
  /** 정적 제안 목록(내부 JSON 백엔드). `suggest`가 있으면 무시된다. */
  suggestions?: SearchSuggestion[];
  /** 제안 요청을 시작하는 최소 글자 수. 기본 2. */
  minLength?: number;
  /** `suggest` 모드 디바운스(ms). 기본 300. */
  debounceMs?: number;
  onSelect?: (item: SearchSuggestion) => void;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const SearchSuggestions = defineComponent<SearchSuggestionsProps>({
  name: "KrdsSearchSuggestions",
  props: {
    label: { type: String, required: true },
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    suggest: {
      type: Function as PropType<
        (query: string) => Promise<SearchSuggestion[]> | SearchSuggestion[]
      >,
      default: undefined,
    },
    suggestions: {
      type: Array as PropType<SearchSuggestion[]>,
      default: undefined,
    },
    minLength: { type: Number, default: 2 },
    debounceMs: { type: Number, default: 300 },
    emptyMessage: { type: String, default: "검색 결과가 없습니다." },
    loadingMessage: { type: String, default: "검색 중입니다." },
    disabled: Boolean,
    className: { type: String, default: undefined },
    id: { type: String, default: undefined },
  },
  emits: ["select"],
  setup(props, { emit }) {
    // defineComponent 제네릭은 props를 모두 optional로 타입하므로 런타임 기본값을 여기서 보정한다.
    const minLength = props.minLength ?? 2;
    const debounceMs = props.debounceMs ?? 300;
    const emptyMessage = props.emptyMessage ?? "검색 결과가 없습니다.";
    const loadingMessage = props.loadingMessage ?? "검색 중입니다.";

    const generatedId = `krds-search-suggestions-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const listboxId = computed(() => `${id.value}-listbox`);
    const statusId = computed(() => `${id.value}-status`);
    const optionId = (index: number) => `${id.value}-option-${index}`;

    const value = ref("");
    const items = ref<SearchSuggestion[]>([]);
    const open = ref(false);
    const activeIndex = ref(-1);
    const status = ref("");
    let requestId = 0;
    let timer: number | undefined;

    const announce = (nextItems: SearchSuggestion[]) => {
      status.value =
        nextItems.length > 0
          ? `${nextItems.length}개의 추천 검색어가 표시되었습니다.`
          : emptyMessage;
    };

    const resolveSuggestions = (query: string) => {
      if (props.suggest) {
        const currentRequest = ++requestId;
        status.value = loadingMessage;
        Promise.resolve(props.suggest(query)).then((result) => {
          if (requestId !== currentRequest) return;
          items.value = result;
          open.value = result.length > 0;
          activeIndex.value = -1;
          announce(result);
        });
        return;
      }
      const result = (props.suggestions ?? []).filter((item) => item.label.includes(query));
      items.value = result;
      open.value = result.length > 0;
      activeIndex.value = -1;
      announce(result);
    };

    // value 변경 → (async: 디바운스 후 suggest 호출 | static: 즉시 필터)
    watch(value, (next) => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      const query = next.trim();
      requestId += 1;
      if (query.length < minLength) {
        items.value = [];
        open.value = false;
        activeIndex.value = -1;
        status.value = "";
        return;
      }
      if (props.suggest) {
        timer = window.setTimeout(() => resolveSuggestions(query), debounceMs);
        return;
      }
      resolveSuggestions(query);
    });

    onUnmounted(() => {
      if (timer !== undefined) window.clearTimeout(timer);
    });

    const selectItem = (item: SearchSuggestion) => {
      value.value = item.label;
      open.value = false;
      activeIndex.value = -1;
      status.value = "";
      emit("select", item);
    };

    const onInput = (event: Event) => {
      value.value = (event.target as HTMLInputElement).value;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (open.value) {
          event.preventDefault();
          open.value = false;
          activeIndex.value = -1;
        }
        return;
      }
      if (!open.value || items.value.length === 0) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % items.value.length;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length;
      } else if (event.key === "Enter" && activeIndex.value >= 0) {
        event.preventDefault();
        const item = items.value[activeIndex.value];
        if (item) selectItem(item);
      }
    };

    return () => {
      const rootClass = ["krds-search-suggestions", props.className]
        .filter(Boolean)
        .join(" ");
      const active = open.value && activeIndex.value >= 0;
      return h(
        "div",
        { class: rootClass },
        [
          h("div", { class: "form-group" }, [
            h("div", { class: "form-tit" }, [
              h("label", { for: id.value }, props.label),
            ]),
            h("div", { class: "form-conts" }, [
              h("input", {
                id: id.value,
                class: "krds-input",
                type: "text",
                name: props.name,
                // value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
                value: value.value || undefined,
                placeholder: props.placeholder,
                disabled: props.disabled || undefined,
                role: "combobox",
                "aria-expanded": open.value,
                "aria-controls": listboxId.value,
                "aria-autocomplete": "list",
                "aria-activedescendant": active ? optionId(activeIndex.value) : undefined,
                "aria-describedby": statusId.value,
                onInput,
                onKeydown: onKeyDown,
                onBlur: () => {
                  open.value = false;
                  activeIndex.value = -1;
                },
              }),
            ]),
          ]),
          h(
            "ul",
            {
              id: listboxId.value,
              role: "listbox",
              "aria-label": "추천 검색어",
              class: "krds-suggestions-list",
              hidden: !open.value,
              // 목록 클릭 시 입력 필드 blur를 막아 onClick이 동작하도록 한다.
              onMousedown: (event: MouseEvent) => event.preventDefault(),
            },
            items.value.map((item, index) =>
              h(
                "li",
                {
                  id: optionId(index),
                  role: "option",
                  "aria-selected": index === activeIndex.value,
                  class:
                    index === activeIndex.value
                      ? "krds-suggestions-item is-active"
                      : "krds-suggestions-item",
                  onClick: () => selectItem(item),
                },
                item.label,
              ),
            ),
          ),
          h("p", { id: statusId.value, class: "sr-only", "aria-live": "polite" }, status.value),
        ],
      );
    };
  },
});
