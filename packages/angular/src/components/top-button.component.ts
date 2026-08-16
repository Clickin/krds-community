import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-top-button",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-top-button">
      <button
        type="button"
        class="krds-btn medium icon"
        [attr.aria-label]="ariaLabel"
        (click)="topClick.emit()"
      >
        <i class="svg-icon ico-go-top"></i>
        @if (type === "label") {
          <span>{{ label }}</span>
        }
      </button>
    </div>
  `,
})
export class KrdsTopButtonComponent {
  @Input() id = createStableId("krds-top-button");
  @Input() type: "basic" | "label" = "basic";
  @Input() ariaLabel = "맨 위로";
  @Input() label = "TOP";
  @Output() topClick = new EventEmitter<void>();
}
