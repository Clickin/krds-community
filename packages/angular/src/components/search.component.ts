import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-search",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div [class]="'krds-search ' + size">
      <div class="search-input-wrap">
        <input
          type="search"
          class="krds-input"
          [attr.placeholder]="placeholder"
          aria-label="검색어"
          [value]="query"
          (input)="query = $any($event.target).value"
          (keydown.enter)="submitSearch()"
        />
      </div>
      <button
        type="button"
        class="krds-btn large primary"
        [attr.aria-label]="buttonLabel"
        (click)="submitSearch()"
      >
        {{ buttonLabel }}
      </button>
    </div>
  `,
})
export class KrdsSearchComponent {
  @Input() id = createStableId("krds-search");
  @Input() size: "xlarge" | "large" | "medium" = "large";
  @Input() placeholder = "검색어를 입력해 주세요";
  @Input() buttonLabel = "검색";
  @Output() search = new EventEmitter<string>();

  query = "";

  submitSearch(): void {
    this.search.emit(this.query);
  }
}
