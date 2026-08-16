import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import {
  createStableId,
  type AngularTableRow,
  type AngularTableAction,
  type AngularTablePagination,
} from "../kinds";
import type { KrdsTableColumn } from "@krds-community/recipes";

const KRDS_TABLE_TEMPLATE = `
    <ng-template #tableContent>
      <div class="krds-table-wrap">
        <table class="tbl col data">
          <caption>
            {{
              caption || title
            }}
          </caption>
          <colgroup>
            @for (column of columns; track column.key) {
              <col [attr.style]="tableColumnStyle(column)" />
            }
            @if (effectiveKind === "structured-list-table") {
              <col />
            }
          </colgroup>
          <thead>
            <tr>
              @for (column of columns; track column.key) {
                <th scope="col">
                  @if (columnVisuallyHidden(column)) {
                    <span class="sr-only">{{ column.label }}</span>
                  } @else {
                    {{ column.label }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track $index) {
              <tr>
                @for (column of columns; track column.key; let columnIndex = $index) {
                  @if (effectiveKind === "structured-list-table" && column.key === "selected") {
                    <th scope="row">
                      <div class="krds-form-check">
                        <input
                          type="checkbox"
                          class="chk"
                          [id]="tableRowControlId(row, $index)"
                          [attr.aria-label]="row.selectionLabel"
                          [checked]="tableCellBoolean(row, column.key)"
                        />
                        <label [for]="tableRowControlId(row, $index)"></label>
                      </div>
                    </th>
                  } @else if (
                    effectiveKind === "structured-list-table" && column.key === "download"
                  ) {
                    <td>
                      <button type="button" class="krds-btn medium text">
                        <i class="svg-icon ico-down"></i>{{ " " + row[column.key] }}
                      </button>
                    </td>
                  } @else if (columnIndex === 0) {
                    <th scope="row">{{ row[column.key] }}</th>
                  } @else {
                    <td>{{ row[column.key] }}</td>
                  }
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </ng-template>
    @if (effectiveKind === "structured-list-table") {
      <div [class]="'krds-structured-list-table ' + (className || 'sample')">
        <div class="search-list-top">
          <div class="sch-left">
            <div class="krds-check-area">
              <div class="krds-form-check">
                <input type="checkbox" class="chk" [id]="id + '-select-all'" />
                <label [for]="id + '-select-all'">{{ selectAllLabel }}</label>
              </div>
            </div>
            <ul class="side-line-ul">
              @for (action of actions; track action.id) {
                <li>
                  <button type="button" class="krds-btn medium text">
                    @if (action.icon) {
                      <i [class]="'svg-icon ico-' + action.icon"></i>{{ " " + action.label }}
                    } @else {
                      {{ action.label }}
                    }
                  </button>
                </li>
              }
            </ul>
          </div>
          <ul class="sch-sort">
            <li>
              <strong class="sort-label"
                ><label [for]="id + '-result-count'">{{ countLabel }}</label></strong
              >
              {{ " " }}
              <select
                class="krds-form-select-sort"
                [id]="id + '-result-count'"
              >
                @for (option of countOptions; track option) {
                  <option>{{ option }}</option>
                }
              </select>
            </li>
            <li>
              <strong class="sort-label"
                ><label [for]="id + '-sort'">{{ sortLabel }}</label></strong
              >
              <div class="w-sort-btn">
                @for (option of sortOptions; track option) {
                  <button
                    type="button"
                    [class.active]="option === sortValue"
                    (click)="sortValue = option"
                  >
                    {{ option }}
                  </button>
                  {{ " " }}
                }
              </div>
              <div class="m-sort-btn">
                <select
                  class="krds-form-select-sort"
                  [id]="id + '-sort'"
                  [value]="sortValue"
                  (change)="sortValue = inputValue($event)"
                >
                  @for (option of sortOptions; track option) {
                    <option>{{ option }}</option>
                  }
                </select>
              </div>
            </li>
          </ul>
        </div>
        <ng-container [ngTemplateOutlet]="tableContent"></ng-container>
        @if (pagination) {
          <div class="krds-pagination">
            @if (pagination.previousDisabled) {
              <span class="page-navi prev disabled" href="#">{{ pagination.previousLabel }}</span>
            } @else {
              <a class="page-navi prev" href="#">{{ pagination.previousLabel }}</a>
            }
            <div class="page-links">
              @for (page of pagination.items; track $index) {
                @if (paginationValue(page) === "ellipsis") {
                  <span class="page-link link-dot"></span>
                } @else {
                  <a
                    href="#"
                    class="page-link"
                    [class.active]="paginationValue(page) === pagination.current.toString()"
                    (click)="setStructuredTablePage(page, $event)"
                  >
                    @if (paginationValue(page) === pagination.current.toString()) {
                      <span class="sr-only">{{ pagination.currentLabel }}</span>
                    }
                    {{ " " }}{{ paginationValue(page) }}
                  </a>
                }
              }
            </div>
            @if (pagination.current < paginationPageMax(pagination)) {
              <a class="page-navi next" href="#">{{ pagination.nextLabel }}</a>
            } @else {
              <span class="page-navi next disabled">{{ pagination.nextLabel }}</span>
            }
          </div>
        }
      </div>
    } @else {
      <ng-container [ngTemplateOutlet]="tableContent"></ng-container>
    }
  `;

@Component({
  selector: "krds-table",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: KRDS_TABLE_TEMPLATE,
})
export class KrdsTableComponent {
  @Input() id = createStableId("krds-table");
  @Input() title = "제목";
  @Input() caption = "";
  @Input() columns: KrdsTableColumn[] = [];
  @Input() rows: AngularTableRow[] = [];
  @Input() kind: "table" | "structured-list-table" | null = null;
  @Input() className = "";

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "table" | "structured-list-table";

  get effectiveKind(): "table" | "structured-list-table" {
    return this.kind ?? this.hostTagKind;
  }
  @Input() selectAllLabel = "";
  @Input() actions: AngularTableAction[] = [];
  @Input() countLabel = "";
  @Input() countOptions: string[] = [];
  @Input() sortLabel = "";
  @Input() sortOptions: string[] = [];
  @Input() sortValue = "";
  @Input() pagination: AngularTablePagination | null = null;
  @Output() sortValueChange = new EventEmitter<string>();

  tableColumnStyle(column: KrdsTableColumn): string | null {
    if (!("width" in column)) return null;
    const width = String((column as KrdsTableColumn & { width?: unknown }).width ?? "");
    return width ? `width: ${width};` : null;
  }

  columnVisuallyHidden(column: KrdsTableColumn): boolean {
    return Boolean((column as KrdsTableColumn & { visuallyHidden?: boolean }).visuallyHidden);
  }

  tableRowControlId(row: AngularTableRow, index: number): string {
    const rowId = "id" in row ? String(row.id) : String(index + 1);
    return `list_chk_${rowId}`;
  }

  tableCellBoolean(row: AngularTableRow, key: string): boolean {
    return Boolean(row[key]);
  }

  paginationValue(item: unknown): string {
    if (typeof item === "number" || typeof item === "string") return String(item);
    if (item && typeof item === "object" && "label" in item) return String(item.label ?? "");
    return "";
  }

  paginationPageMax(pagination: AngularTablePagination): number {
    return Math.max(
      1,
      ...pagination.items
        .map((item) => Number(this.paginationValue(item)))
        .filter((item) => Number.isFinite(item)),
    );
  }

  setStructuredTablePage(page: unknown, event: Event): void {
    event.preventDefault();
    if (this.pagination === null) return;
    const value = Number(this.paginationValue(page));
    if (Number.isNaN(value)) return;
    this.pagination = { ...this.pagination, current: value };
  }

  inputValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
@Component({
  selector: "krds-structured-list-table",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: KRDS_TABLE_TEMPLATE,
})
export class KrdsStructuredListTableComponent extends KrdsTableComponent {
  override kind: "table" | "structured-list-table" | null = "structured-list-table";
}
