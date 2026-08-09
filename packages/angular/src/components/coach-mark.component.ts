import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-coach-mark",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="txt-box bg-white bg-white krds-coach-mark">
      <div class="coach-balloon">
        <h5 class="sr-only">{{ title }}</h5>
        <h6 class="coach-tit">{{ stepTitle }}</h6>
        <p class="desc">{{ description }}</p>
        <div class="coach-controls">
          <div class="num">
            <span class="sr-only">{{ currentStepLabel }}</span>
            <strong>{{ currentStep }}</strong>
            <span class="sr-only">{{ totalStepsLabel }}</span>
            <span>{{ totalSteps }}</span>
          </div>
          <div class="btn-wrap">
            <button type="button" class="krds-btn small text">{{ stopLabel }}</button>
            <button type="button" class="krds-btn small tertiary">{{ nextLabel }}</button>
          </div>
        </div>
      </div>
      <div>
        <h3>{{ contentTitle }}</h3>
      </div>
    </div>
  `,
})
export class KrdsCoachMarkComponent {
  @Input() title = "제목";
  @Input() stepTitle = "";
  @Input() description = "";
  @Input() contentTitle = "";
  @Input() currentStepLabel = "";
  @Input() totalStepsLabel = "";
  @Input() stopLabel = "";
  @Input() nextLabel = "";
  @Input() step = "1/1";

  get currentStep(): string {
    return this.step.split("/")[0]?.trim() ?? "";
  }

  // react renders only the parts present in `step` — no "1/1" fallback.
  get totalSteps(): string {
    return this.step.split("/")[1]?.trim() ?? "";
  }
}
