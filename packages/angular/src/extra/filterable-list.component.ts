import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * 즉각 표시 필터·정렬 목록 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(global_10.html: 즉각 표시 — 옵션 선택 즉시 필터링·정렬·조회, 인라인
 * 정렬 — 정렬 순서 변경 Click/Enter/Space 토글)을 참조해 동일한 즉시 갱신
 * 동작을 구현한다.
 */

export interface KrdsFilterableItem {
  id: string;
  label: string;
  [field: string]: string | number | boolean | undefined;
}

export interface KrdsFilterableOption {
  value: string;
  label: string;
}

export interface KrdsFilterableFilter {
  id: string;
  label: string;
  field: string;
  options: KrdsFilterableOption[];
}

export interface KrdsFilterableSort {
  id: string;
  label: string;
  field: string;
}

let nextFilterableListId = 0;

// components.ts의 createStableId와 동일한 로컬 카운터 패턴 (공식 모듈 import 금지).
function createStableId(prefix: string): string {
  nextFilterableListId += 1;
  return `${prefix}-${nextFilterableListId.toString(36)}`;
}

@Component({
  selector: "krds-filterable-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="'krds-filterable-list' + (className ? ' ' + className : '')">
    <div class="krds-filterable-controls">
      @for (filter of filters; track filter.id) {
        <div class="form-group">
          <div class="form-tit">
            <label [for]="id + '-filter-' + filter.id">{{ filter.label }}</label>
          </div>
          <div class="form-conts">
            <select
              [id]="id + '-filter-' + filter.id"
              class="krds-form-select"
              [title]="filter.label"
              (change)="onFilterChange(filter.id, $event)"
            >
              <option
                value=""
                [attr.selected]="
                  selectedValue(filter.id) !== null && selectedValue(filter.id) === '' ? '' : null
                "
              >
                {{ allLabel }}
              </option>
              @for (option of filter.options; track option.value) {
                <option
                  [value]="option.value"
                  [attr.selected]="selectedValue(filter.id) === option.value ? '' : null"
                >
                  {{ option.label }}
                </option>
              }
            </select>
          </div>
        </div>
      }
      @if (sort) {
        <div class="form-group">
          <div class="form-tit">
            <label [for]="id + '-sort'">{{ sort.label }}</label>
          </div>
          <div class="form-conts" [attr.style]="'display:flex;gap:0.5rem;align-items:flex-end'">
            <select [id]="id + '-sort'" class="krds-form-select" [title]="sort.label">
              <option [value]="sort.field">{{ sort.label }}</option>
            </select>
            <button
              type="button"
              class="krds-btn"
              [attr.aria-pressed]="direction === 'desc' ? 'true' : 'false'"
              (click)="toggleDirection()"
            >
              {{ direction === "asc" ? sortAscendingLabel : sortDescendingLabel }}
            </button>
          </div>
        </div>
      }
    </div>
    <p class="krds-filterable-result">검색 결과 {{ visibleItems.length }}건</p>
    <ul class="krds-filterable-items">
      @for (item of visibleItems; track item.id) {
        <li class="krds-filterable-item">{{ item.label }}</li>
      }
    </ul>
  </div>`,
})
export class KrdsFilterableListComponent {
  @Input() items: KrdsFilterableItem[] = [];
  @Input() filters: KrdsFilterableFilter[] = [];
  @Input() sort: KrdsFilterableSort | null = null;
  @Input() allLabel = "전체";
  @Input() emptyMessage = "검색 결과가 없습니다.";
  @Input() sortAscendingLabel = "오름차순";
  @Input() sortDescendingLabel = "내림차순";
  @Input() className = "";
  @Input() id = createStableId("krds-filterable-list");

  /** 필터 id → 선택된 값. 빈 문자열("")은 전체. 미상호작용 필터는 undefined. */
  selected: Record<string, string> = {};
  direction: "asc" | "desc" = "asc";

  /** 선택된 값. 사용자가 건드리지 않은 필터는 null (selected 속성 미렌더). */
  selectedValue(filterId: string): string | null {
    return this.selected[filterId] ?? null;
  }

  /** 선택된 필터를 AND로 적용한 뒤 정렬 방향에 따라 표시할 항목. */
  get visibleItems(): KrdsFilterableItem[] {
    const filtered = this.items.filter((item) =>
      this.filters.every((filter) => {
        const value = this.selected[filter.id] ?? "";
        return value === "" || item[filter.field] === value;
      }),
    );
    if (!this.sort) return filtered;
    const sorted = [...filtered].sort((a, b) => this.compare(a, b));
    return this.direction === "desc" ? sorted.reverse() : sorted;
  }

  onFilterChange(filterId: string, event: Event): void {
    this.selected = {
      ...this.selected,
      [filterId]: (event.target as HTMLSelectElement).value,
    };
  }

  toggleDirection(): void {
    this.direction = this.direction === "asc" ? "desc" : "asc";
  }

  // 정렬 계약: String(field 값)을 유니코드 코드포인트로 비교 (localeCompare 금지 —
  // 프레임워크 간 결정성). 참조 DOM(extra/filterable-list/)과 일치한다.
  private compare(a: KrdsFilterableItem, b: KrdsFilterableItem): number {
    const aValue = String(a[this.sort!.field]);
    const bValue = String(b[this.sort!.field]);
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  }
}
