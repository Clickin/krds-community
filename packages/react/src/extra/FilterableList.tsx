import { useId, useState } from "react";
import { cx } from "@krds-community/recipes";

/**
 * 즉각 표시 필터·정렬 목록 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용 계약
 * (global_10.html: 즉각 표시 — 사용자가 옵션을 선택하자마자 필터링·정렬·조회
 * 동작이 실행)을 참조해 동일한 계약을 구현한다.
 *
 * 필터 select 변경 → 즉시 필터링(선택 값이 있는 필터만 AND 적용), 정렬 방향
 * 버튼 클릭 → asc/desc 토글 후 즉시 재정렬. 필터 적용 후 정렬 적용 순서.
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
  options: readonly FilterableFilterOption[];
}

export interface FilterableSort {
  id: string;
  label: string;
  field: string;
}

export interface FilterableListProps {
  items: readonly FilterableItem[];
  filters?: readonly FilterableFilter[];
  sort?: FilterableSort;
  /** 각 필터 select의 첫 옵션(전체). 기본 "전체". */
  allLabel?: string;
  sortAscendingLabel?: string;
  sortDescendingLabel?: string;
  className?: string;
  id?: string;
}

const byCodePoint = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// React는 style 객체를 cssText로 직렬화해 공백/세미콜론이 달라지므로, 참조 DOM과
// 정확히 일치하는 인라인 스타일은 setAttribute로 직접 설정한다 (Select.tsx의
// selected 속성 동기화와 같은 패턴).
const SORT_CONTROLS_STYLE = "display:flex;gap:0.5rem;align-items:flex-end";

export function FilterableList({
  items,
  filters = [],
  sort,
  allLabel = "전체",
  sortAscendingLabel = "오름차순",
  sortDescendingLabel = "내림차순",
  className,
  id: providedId,
}: FilterableListProps) {
  const generatedId = useId();
  const id = providedId ?? `krds-filterable-list-${generatedId}`;

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  // 필터 적용(선택 값이 있는 필터만 AND) → 정렬 적용(유니코드 코드포인트 비교).
  const filtered = items.filter((item) =>
    filters.every((filter) => {
      const selected = filterValues[filter.id] ?? "";
      return selected === "" || item[filter.field] === selected;
    }),
  );
  const result = sort
    ? [...filtered].sort((a, b) => {
        const cmp = byCodePoint(String(a[sort.field]), String(b[sort.field]));
        return direction === "asc" ? cmp : -cmp;
      })
    : filtered;

  return (
    <div className={cx("krds-filterable-list", className)}>
      <div className="krds-filterable-controls">
        {filters.map((filter) => (
          <div className="form-group" key={filter.id}>
            <div className="form-tit">
              <label htmlFor={`${id}-filter-${filter.id}`}>{filter.label}</label>
            </div>
            <div className="form-conts">
              <select
                id={`${id}-filter-${filter.id}`}
                className="krds-form-select"
                title={filter.label}
                value={filterValues[filter.id] ?? ""}
                onChange={(event) =>
                  setFilterValues((prev) => ({ ...prev, [filter.id]: event.target.value }))
                }
              >
                <option value="">{allLabel}</option>
                {filter.options.map((option) => {
                  const isSelected = (filterValues[filter.id] ?? "") === option.value;
                  return (
                    <option
                      key={option.value}
                      // React는 select value로 selectedness만 관리하므로 콘텐츠
                      // 속성까지 참조 DOM과 동일하게 맞춘다 (Select.tsx 동일 패턴).
                      ref={(node) => {
                        if (!node) return;
                        if (isSelected) node.setAttribute("selected", "");
                        else node.removeAttribute("selected");
                      }}
                      value={option.value}
                      selected={isSelected}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        ))}
        {sort && (
          <div className="form-group">
            <div className="form-tit">
              <label htmlFor={`${id}-sort`}>{sort.label}</label>
            </div>
            <div
              className="form-conts"
              ref={(node) => {
                if (node) node.setAttribute("style", SORT_CONTROLS_STYLE);
              }}
            >
              <select id={`${id}-sort`} className="krds-form-select" title={sort.label}>
                <option value={sort.field}>{sort.label}</option>
              </select>
              <button
                type="button"
                className="krds-btn"
                aria-pressed={direction === "desc"}
                onClick={() => setDirection((current) => (current === "asc" ? "desc" : "asc"))}
              >
                {direction === "asc" ? sortAscendingLabel : sortDescendingLabel}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="krds-filterable-result">{`검색 결과 ${filtered.length}건`}</p>
      <ul className="krds-filterable-items">
        {result.map((item) => (
          <li className="krds-filterable-item" key={item.id}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
