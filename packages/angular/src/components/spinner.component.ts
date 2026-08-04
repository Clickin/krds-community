import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-spinner",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-group">
      <div class="form-tit">
        <label [for]="id + '-input'">{{ label }}</label>
      </div>
      <div class="form-conts">
        <div class="form-spinner">
          <input type="text" [id]="id + '-input'" class="krds-input" placeholder="placeholder" />
          <div class="krds-spinner" role="status">
            <span class="sr-only">{{ label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class KrdsSpinnerComponent {
  @Input() id = createStableId("krds-spinner");
  @Input() label = "레이블";
}
