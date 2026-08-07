import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

const DEFAULT_FEEDBACK_OPTIONS = [
  { value: "satisfied", label: "만족" },
  { value: "dissatisfied", label: "불만족" },
];

@Component({
  selector: "krds-user-feedback",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-user-feedback">
      <fieldset>
        <legend class="feedback-title">{{ title }}</legend>
        <div class="feedback-options">
          @for (option of options; track $index) {
            <label class="krds-form-check">
              <input
                type="radio"
                [name]="id"
                [value]="option.value"
                [checked]="selectedValue === option.value"
                (change)="selectedValue = option.value"
              />
              <span>{{ option.label }}</span>
            </label>
          }
        </div>
        <button
          type="button"
          class="krds-btn small primary"
          [disabled]="selectedValue === null"
          (click)="submit.emit(selectedValue!)"
        >
          {{ submitLabel }}
        </button>
      </fieldset>
    </div>
  `,
})
export class KrdsUserFeedbackComponent {
  @Input() id = createStableId("krds-user-feedback");
  @Input() title = "이 페이지에 만족하시나요?";
  @Input() options: { value: string; label: string }[] = DEFAULT_FEEDBACK_OPTIONS;
  @Input() submitLabel = "제출";
  @Output() submit = new EventEmitter<string>();

  selectedValue: string | null = null;
}
