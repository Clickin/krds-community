import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-pagination",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-pagination" role="navigation" [attr.aria-label]="navigationLabel">
      <span class="page-navi prev disabled" href="#">{{ previousLabel }}</span>
      <div class="page-links">
        @for (page of items; track $index) {
          @if (paginationValue(page) === "ellipsis") {
            <span class="page-link link-dot"></span>
          } @else {
            <a
              href="#"
              class="page-link"
              [class.active]="paginationValue(page) === currentPage"
              (click)="setCurrentPage(page, $event)"
            >
              @if (paginationValue(page) === currentPage) {
                <span class="sr-only">{{ message }} </span>
              }
              {{ paginationValue(page) }}
            </a>
          }
        }
      </div>
      <a class="page-navi next" href="#">{{ nextLabel }}</a>
    </div>
  `,
})
export class KrdsPaginationComponent {
  @Input() id = createStableId("krds-pagination");
  @Input() current = 1;
  @Input() message = "도움말";
  @Input() navigationLabel = "페이지 이동";
  @Input() previousLabel = "";
  @Input() nextLabel = "";
  @Input() items: (string | number | { label: string })[] = [];
  @Output() currentChange = new EventEmitter<number>();

  get currentPage(): string {
    return this.current.toString();
  }

  paginationValue(item: unknown): string {
    if (typeof item === "number" || typeof item === "string") return String(item);
    if (item && typeof item === "object" && "label" in item) {
      return String(item.label ?? "");
    }
    return "";
  }

  setCurrentPage(item: unknown, event: Event): void {
    event.preventDefault();
    const value = Number(this.paginationValue(item));
    if (!Number.isNaN(value)) {
      this.current = value;
      this.currentChange.emit(value);
    }
  }
}
