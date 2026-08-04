import { computed, defineComponent, h, reactive, ref, useId, type PropType, type VNode } from "vue";

/**
 * 즉각 표시 필터·정렬 목록 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용 계약
 * (global_10.html: 즉각 표시 — 옵션 선택하자마자 필터링·정렬·조회 동작 실행,
 * 정렬 순서 변경 Click/Enter/Space 토글)을 참조해 필터 선택/정렬 방향 변경 시
 * 즉시 목록과 결과 건수를 갱신한다.
 *
 * 필터는 선택 값이 있는 필터만 AND 적용(item[field] === value, "" = 전체),
 * 정렬은 해당 field 기준 코드포인트 비교(프레임워크 간 결정적) 후 asc/desc.
 */

export interface FilterableItem {
  id: string;
  label: string;
  [field: string]: string | number | boolean | undefined;
}

export interface FilterableFilterOption {
  value: string;
  label: string;
}

export interface FilterableFilter {
  id: string;
  label: string;
  field: string;
  options: FilterableFilterOption[];
}

export interface FilterableSort {
  id: string;
  label: string;
  field: string;
}

export interface FilterableListProps {
  items: FilterableItem[];
  filters?: FilterableFilter[];
  sort?: FilterableSort;
  /** 각 필터 select의 첫 옵션(전체). 기본 "전체". */
  allLabel?: string;
  emptyMessage?: string;
  sortAscendingLabel?: string;
  sortDescendingLabel?: string;
  className?: string;
  id?: string;
}

export const FilterableList = defineComponent<FilterableListProps>({
  name: "KrdsFilterableList",
  props: {
    items: { type: Array as PropType<FilterableItem[]>, required: true },
    filters: { type: Array as PropType<FilterableFilter[]>, default: undefined },
    sort: { type: Object as PropType<FilterableSort>, default: undefined },
    allLabel: { type: String, default: "전체" },
    emptyMessage: { type: String, default: "검색 결과가 없습니다." },
    sortAscendingLabel: { type: String, default: "오름차순" },
    sortDescendingLabel: { type: String, default: "내림차순" },
    className: { type: String, default: undefined },
    id: { type: String, default: undefined },
  },
  setup(props) {
    // defineComponent 제네릭은 props를 모두 optional로 타입하므로 런타임 기본값을 여기서 보정한다.
    const allLabel = props.allLabel ?? "전체";
    const sortAscendingLabel = props.sortAscendingLabel ?? "오름차순";
    const sortDescendingLabel = props.sortDescendingLabel ?? "내림차순";

    const generatedId = `krds-filterable-list-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    // 필터 선택값: filterId → 선택 옵션 value ("" = 전체).
    const selectedFilters = reactive<Record<string, string>>({});
    const sortAscending = ref(true);

    const filteredItems = computed(() => {
      const active = (props.filters ?? []).filter((filter) => {
        const selected = selectedFilters[filter.id] ?? "";
        return selected !== "";
      });
      if (active.length === 0) return [...props.items];
      return props.items.filter((item) =>
        active.every((filter) => item[filter.field] === (selectedFilters[filter.id] ?? "")),
      );
    });

    const visibleItems = computed(() => {
      const list = filteredItems.value;
      if (!props.sort) return list;
      const field = props.sort.field;
      // 유니코드 코드포인트 문자열 비교 — localeCompare 금지(프레임워크 간 결정성).
      const sorted = [...list].sort((a, b) => {
        const av = String(a[field] ?? "");
        const bv = String(b[field] ?? "");
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      });
      return sortAscending.value ? sorted : sorted.reverse();
    });

    const onFilterChange = (filterId: string) => (event: Event) => {
      selectedFilters[filterId] = (event.target as HTMLSelectElement).value;
    };

    const onDirectionClick = () => {
      sortAscending.value = !sortAscending.value;
    };

    // 참조 DOM 리터럴 유지: Vue style prop은 cssText 정규화(공백/세미콜론)로
    // 변형되므로 setAttribute로 원문 그대로 심는다. (strict DOM 비교 요구)
    const SORT_STYLE = "display:flex;gap:0.5rem;align-items:flex-end";
    const setSortStyle = (node: VNode) => {
      if (node.el instanceof Element) node.el.setAttribute("style", SORT_STYLE);
    };

    return () => {
      const rootClass = ["krds-filterable-list", props.className].filter(Boolean).join(" ");
      const items = visibleItems.value;

      const filterGroups = (props.filters ?? []).map((filter) => {
        const selected = selectedFilters[filter.id] ?? "";
        return h("div", { class: "form-group" }, [
          h("div", { class: "form-tit" }, [
            h("label", { for: `${id.value}-filter-${filter.id}` }, filter.label),
          ]),
          h("div", { class: "form-conts" }, [
            h(
              "select",
              {
                id: `${id.value}-filter-${filter.id}`,
                class: "krds-form-select",
                title: filter.label,
                onChange: onFilterChange(filter.id),
              },
              [
                h("option", { value: "" }, allLabel),
                ...filter.options.map((option) =>
                  h(
                    "option",
                    {
                      value: option.value,
                      selected: selected === option.value || undefined,
                    },
                    option.label,
                  ),
                ),
              ],
            ),
          ]),
        ]);
      });

      const sortGroup = props.sort
        ? h("div", { class: "form-group" }, [
            h("div", { class: "form-tit" }, [
              h("label", { for: `${id.value}-sort` }, props.sort.label),
            ]),
            h(
              "div",
              {
                class: "form-conts",
                onVnodeMounted: setSortStyle,
                onVnodeUpdated: setSortStyle,
              },
              [
                h(
                  "select",
                  {
                    id: `${id.value}-sort`,
                    class: "krds-form-select",
                    title: props.sort.label,
                  },
                  [h("option", { value: props.sort.field }, props.sort.label)],
                ),
                h(
                  "button",
                  {
                    type: "button",
                    class: "krds-btn",
                    "aria-pressed": sortAscending.value ? "false" : "true",
                    onClick: onDirectionClick,
                  },
                  sortAscending.value ? sortAscendingLabel : sortDescendingLabel,
                ),
              ],
            ),
          ])
        : null;

      return h("div", { class: rootClass }, [
        h(
          "div",
          { class: "krds-filterable-controls" },
          [...filterGroups, sortGroup].filter(Boolean),
        ),
        h("p", { class: "krds-filterable-result" }, `검색 결과 ${items.length}건`),
        h(
          "ul",
          { class: "krds-filterable-items" },
          items.map((item) => h("li", { key: item.id, class: "krds-filterable-item" }, item.label)),
        ),
      ]);
    };
  },
});
