<script lang="ts">
  /**
   * 즉각 표시 필터·정렬 목록 (extra).
   *
   * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
   * 계약(global_10.html: 즉각 표시 — 옵션 선택 즉시 필터링/정렬/결과 갱신,
   * 정렬 순서 변경 Click/Enter/Space 토글)을 참조해 동일한 계약을 구현한다.
   *
   * 필터 select 변경 → 즉시 필터링, 방향 버튼 클릭 → 즉시 재정렬(오름차순/내림차순).
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

  const generatedId = $props.id();

  let {
    items,
    filters = [],
    sort,
    allLabel = '전체',
    emptyMessage = '검색 결과가 없습니다.',
    sortAscendingLabel = '오름차순',
    sortDescendingLabel = '내림차순',
    className = '',
    id = `krds-filterable-list-${generatedId}`,
  }: FilterableListProps = $props();

  // 선택된 필터 값 map(빈 문자열 = 전체)과 정렬 방향. 변경 시 파생 계산으로 즉시 재렌더.
  let selectedFilters = $state<Record<string, string>>({});
  let sortDirection = $state<'asc' | 'desc'>('asc');

  // 필터(선택 값 있는 필터만 AND 적용) → 정렬(field 값을 유니코드 코드포인트로
  // 비교, 프레임워크 간 결정적) 순서로 즉시 계산한다.
  const visibleItems = $derived.by(() => {
    let result = items;
    for (const filter of filters) {
      const selected = selectedFilters[filter.id];
      if (selected) {
        result = result.filter((item) => String(item[filter.field]) === selected);
      }
    }
    if (sort) {
      const factor = sortDirection === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const left = String(a[sort.field]);
        const right = String(b[sort.field]);
        return left < right ? -factor : left > right ? factor : 0;
      });
    }
    return result;
  });

  const toggleDirection = () => {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  };
</script>

<div class={`krds-filterable-list${className ? ` ${className}` : ''}`}>
  <div class="krds-filterable-controls">
    {#each filters as filter (filter.id)}
      <div class="form-group">
        <div class="form-tit">
          <label for={`${id}-filter-${filter.id}`}>{filter.label}</label>
        </div>
        <div class="form-conts">
          <select
            id={`${id}-filter-${filter.id}`}
            class="krds-form-select"
            title={filter.label}
            onchange={(event) => {
              selectedFilters[filter.id] = (event.currentTarget as HTMLSelectElement).value;
            }}
          >
            <option value="">{allLabel}</option>
            {#each filter.options as option (option.value)}
              <option
                value={option.value}
                selected={selectedFilters[filter.id] === option.value}
              >
                {option.label}
              </option>
            {/each}
          </select>
        </div>
      </div>
    {/each}
    {#if sort}
      <div class="form-group">
        <div class="form-tit">
          <label for={`${id}-sort`}>{sort.label}</label>
        </div>
        <div class="form-conts" style="display:flex;gap:0.5rem;align-items:flex-end">
          <select id={`${id}-sort`} class="krds-form-select" title={sort.label}>
            <option value={sort.field}>{sort.label}</option>
          </select>
          <button
            type="button"
            class="krds-btn"
            aria-pressed={sortDirection === 'desc'}
            onclick={toggleDirection}
          >
            {sortDirection === 'asc' ? sortAscendingLabel : sortDescendingLabel}
          </button>
        </div>
      </div>
    {/if}
  </div>
  <p class="krds-filterable-result">검색 결과 {visibleItems.length}건</p>
  <ul class="krds-filterable-items">
    {#each visibleItems as item (item.id)}
      <li class="krds-filterable-item">{item.label}</li>
    {/each}
  </ul>
</div>
