import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-pagination",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-pagination" role="navigation" [attr.aria-label]="navigationLabel">
      @if (previousDisabled || current <= 1) {
        <span class="page-navi prev disabled" href="#">{{ previousLabel }}</span>
      } @else {
        <a class="page-navi prev" href="#" (click)="setCurrentPage(current - 1, $event)">{{
          previousLabel
        }}</a>
      }
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
      @if (nextDisabled || current >= maxPage) {
        <span class="page-navi next disabled" href="#">{{ nextLabel }}</span>
      } @else {
        <a class="page-navi next" href="#" (click)="setCurrentPage(current + 1, $event)">{{
          nextLabel
        }}</a>
      }
    </div>
  `,
})
export class KrdsPaginationComponent {
  @Input() id = createStableId("krds-pagination");
  @Input() current = 1;
  @Input() message = "현재페이지";
  @Input() navigationLabel = "페이지 이동";
  @Input() previousLabel = "이전";
  @Input() nextLabel = "다음";
  @Input() previousDisabled = false;
  @Input() nextDisabled = false;
  @Input() items: (string | number | { label: string })[] = [1, 2, 3, 4, 5];
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

  get maxPage(): number {
    return Math.max(
      1,
      ...this.items
        .map((item) => Number(this.paginationValue(item)))
        .filter((value) => Number.isFinite(value)),
    );
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
