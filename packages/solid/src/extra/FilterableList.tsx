import { For, createEffect, createMemo, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";

/**
 * 즉각 표시 필터·정렬 목록 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(global_10.html: 즉각 표시 — 옵션 선택 즉시 필터링·정렬·조회 실행,
 * 정렬 순서 변경 Click/Enter/Space 토글)을 참조해 필터 select 변경·정렬
 * 방향 버튼 클릭 시 리스트와 결과 카운트를 즉시 갱신한다.
 *
 * 정렬은 `String(field)` 값을 유니코드 코드포인트로 비교한다(localeCompare
 * 금지 — 프레임워크 간 결정성, 참조 DOM extra/filterable-list/*.html 스펙).
 */

export interface FilterableItem {
  id: string;
  label: string;
  [field: string]: string | number | boolean | undefined;
}

export interface FilterableFilter {
  id: string;
  label: string;
  field: string;
  options: { value: string; label: string }[];
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
  /** 각 필터 select의 첫 옵션. 기본 "전체". */
  allLabel?: string;
  emptyMessage?: string;
  sortAscendingLabel?: string;
  sortDescendingLabel?: string;
  className?: string;
  id?: string;
}

const compareCodePoint = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

export function FilterableList(rawProps: FilterableListProps) {
  const merged = mergeProps(
    {
      allLabel: "전체",
      emptyMessage: "검색 결과가 없습니다.",
      sortAscendingLabel: "오름차순",
      sortDescendingLabel: "내림차순",
      id: `krds-filterable-list-${createUniqueId()}`,
    },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    "items",
    "filters",
    "sort",
    "allLabel",
    "emptyMessage",
    "sortAscendingLabel",
    "sortDescendingLabel",
    "className",
  ]);

  const [selections, setSelections] = createSignal<Record<string, string>>({});
  const [descending, setDescending] = createSignal(false);

  // Solid은 option의 `selected`를 속성 대신 프로퍼티로만 설정한다 — 참조 DOM
  // 계약(선택 옵션의 selected 속성)을 맞추기 위해 ref로 수집한 옵션 요소의
  // 속성을 시그널과 동기화한다 (Select.tsx의 setAttribute 패턴).
  const optionElements = new Map<string, Map<string, HTMLOptionElement>>();
  const bindOption = (filterId: string, value: string) => (element: HTMLOptionElement) => {
    let byValue = optionElements.get(filterId);
    if (!byValue) {
      byValue = new Map();
      optionElements.set(filterId, byValue);
    }
    byValue.set(value, element);
  };
  createEffect(() => {
    const current = selections();
    for (const [filterId, byValue] of optionElements) {
      const selectedValue = current[filterId] ?? "";
      for (const [value, element] of byValue) {
        if (value === selectedValue) element.setAttribute("selected", "");
        else element.removeAttribute("selected");
      }
    }
  });

  // 즉각 표시(global_10): 필터/정렬 변경 즉시 목록과 결과 카운트를 갱신.
  // 필터는 선택 값이 있는 필터만 AND 적용(item[field] === value, "" = 전체),
  // 이후 정렬 필드 기준 정렬(기본 오름차순).
  const visibleItems = createMemo(() => {
    let result = props.items;
    for (const filter of props.filters ?? []) {
      const selected = selections()[filter.id];
      if (selected) result = result.filter((item) => item[filter.field] === selected);
    }
    if (props.sort) {
      const field = props.sort.field;
      const direction = descending() ? -1 : 1;
      result = [...result].sort(
        (a, b) => compareCodePoint(String(a[field]), String(b[field])) * direction,
      );
    }
    return result;
  });

  return (
    <div class={`krds-filterable-list${props.className ? ` ${props.className}` : ""}`}>
      <div class="krds-filterable-controls">
        <For each={props.filters ?? []}>
          {(filter) => (
            <div class="form-group">
              <div class="form-tit">
                <label for={`${nativeProps.id}-filter-${filter.id}`}>{filter.label}</label>
              </div>
              <div class="form-conts">
                <select
                  id={`${nativeProps.id}-filter-${filter.id}`}
                  class="krds-form-select"
                  title={filter.label}
                  onChange={(event) =>
                    setSelections((prev) => ({ ...prev, [filter.id]: event.currentTarget.value }))
                  }
                >
                  <option value="">{props.allLabel}</option>
                  <For each={filter.options}>
                    {(option) => (
                      <option value={option.value} ref={bindOption(filter.id, option.value)}>
                        {option.label}
                      </option>
                    )}
                  </For>
                </select>
              </div>
            </div>
          )}
        </For>
        {props.sort && (
          <div class="form-group">
            <div class="form-tit">
              <label for={`${nativeProps.id}-sort`}>{props.sort.label}</label>
            </div>
            <div class="form-conts" style="display:flex;gap:0.5rem;align-items:flex-end">
              <select id={`${nativeProps.id}-sort`} class="krds-form-select" title={props.sort.label}>
                <option value={props.sort.field}>{props.sort.label}</option>
              </select>
              <button
                type="button"
                class="krds-btn"
                aria-pressed={descending() ? "true" : "false"}
                onClick={() => setDescending((current) => !current)}
              >
                {descending() ? props.sortDescendingLabel : props.sortAscendingLabel}
              </button>
            </div>
          </div>
        )}
      </div>
      <p class="krds-filterable-result">{`검색 결과 ${visibleItems().length}건`}</p>
      <ul class="krds-filterable-items">
        <For each={visibleItems()}>
          {(item) => <li class="krds-filterable-item">{item.label}</li>}
        </For>
      </ul>
    </div>
  );
}
