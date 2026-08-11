import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import type { KrdsStep } from "@krds-community/recipes";

@Component({
  selector: "krds-step-indicator",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="krds-step-wrap">
      @for (step of steps; track step.id) {
        <li [class.done]="$index < current" [class.active]="$index === current">
          <span>
            @if ($index === current) {
              <em class="sr-only">{{ message }}</em>
            }
            <i class="step">{{ $index + 1 }}{{ label }}</i>
            <span class="step-tit">{{ step.label }}</span>
          </span>
        </li>
      }
    </ol>
  `,
})
export class KrdsStepIndicatorComponent {
  @Input() current = 0;
  @Input() stepLabel = "";
  @Input() label = "단계";
  @Input() message = "현재단계";
  @Input() steps: KrdsStep[] = [];
}
