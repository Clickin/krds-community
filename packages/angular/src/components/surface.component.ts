import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-surface",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="krds-field"
      ><span class="krds-field-label">{{ label }}</span
      ><input class="krds-input" [value]="value" [disabled]="disabled" [readonly]="readonly"
    /></label>
  `,
})
export class KrdsSurfaceComponent {
  @Input() label = "레이블";
  @Input() value = "";
  @Input() disabled = false;
  @Input() readonly = false;
}
