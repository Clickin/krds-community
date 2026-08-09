import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-button-icon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="'krds-btn icon' + (size ? ' ' + size : '')"
      [disabled]="disabled"
    >
      <span class="sr-only">{{ label }}</span>
      <i class="svg-icon ico-sch"></i>
    </button>
  `,
})
export class KrdsButtonIconComponent {
  @Input() id = createStableId("krds-button-icon");
  @Input() label = "레이블";
  @Input() size = "";
  @Input() disabled = false;
}
