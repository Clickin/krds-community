import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-progress-bar",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div [class]="'krds-progress-bar ' + size + ' ' + state">
      <progress class="krds-progress" [attr.value]="value" [attr.max]="max">
        {{ label || value + "%" }}
      </progress>
      @if (label) {
        <span class="progress-label">{{ label }}</span>
      }
    </div>
  `,
})
export class KrdsProgressBarComponent {
  @Input() id = createStableId("krds-progress-bar");
  @Input() size: "large" | "medium" = "medium";
  @Input() state: "active" | "success" | "error" = "active";
  @Input() value = 0;
  @Input() max = 100;
  @Input() label = "";
}
