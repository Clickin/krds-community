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
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-user-feedback">
      <fieldset>
        <legend class="feedback-title">{{ title }}</legend>
        <div class="feedback-options">
          @for (option of options; track $index) {
            <div class="krds-form-check">
              <input
                type="radio"
                [id]="optionId(option)"
                [name]="id"
                [value]="option.value"
                [checked]="selectedValue === option.value"
                (change)="selectedValue = option.value"
              />
              <label [for]="optionId(option)">{{ option.label }}</label>
            </div>
          }
        </div>
        <button
          type="button"
          class="krds-btn small primary"
          (click)="selectedValue ? submit.emit(selectedValue) : null"
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

  optionId(option: { value: string; label: string }): string {
    return `${this.id}-${option.value}`;
  }
}
