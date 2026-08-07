import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

export interface KrdsChipOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: "krds-chip",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="'krds-chip ' + type + ' ' + size"
      [attr.role]="type === 'single' ? 'radiogroup' : 'group'"
      [attr.aria-label]="ariaLabel"
    >
      @for (option of options; track $index) {
        <button
          type="button"
          [class]="'krds-btn small text chip' + (isSelected(option) ? ' active' : '')"
          [attr.aria-pressed]="isSelected(option)"
          [disabled]="option.disabled ?? false"
          (click)="toggle(option)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class KrdsChipComponent {
  @Input() id = createStableId("krds-chip");
  @Input() type: "single" | "multi" = "single";
  @Input() size: "large" | "medium" = "medium";
  @Input() options: KrdsChipOption[] = [];
  @Input() selected: string | string[] | undefined = undefined;
  @Input() defaultSelected: string | string[] | undefined = undefined;
  @Input() ariaLabel = "선택";
  @Output() change = new EventEmitter<string | string[]>();

  private internalSelected: string | string[] | null = null;

  get isControlled(): boolean {
    return this.selected !== undefined;
  }

  get currentSelected(): string | string[] {
    if (this.selected !== undefined) return this.selected;
    if (this.internalSelected !== null) return this.internalSelected;
    return this.defaultSelected ?? (this.type === "multi" ? [] : "");
  }

  isSelected(option: KrdsChipOption): boolean {
    const current = this.currentSelected;
    return typeof current === "string" ? current === option.value : current.includes(option.value);
  }

  toggle(option: KrdsChipOption): void {
    if (option.disabled) return;
    if (this.type === "single") {
      if (!this.isControlled) {
        this.internalSelected = option.value;
      }
      this.change.emit(option.value);
      return;
    }
    const next = [...(this.currentSelected as string[])];
    const index = next.indexOf(option.value);
    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(option.value);
    }
    if (!this.isControlled) {
      this.internalSelected = next;
    }
    this.change.emit(next);
  }
}
