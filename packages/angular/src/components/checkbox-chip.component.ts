import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import type { ControlValueAccessor } from "@angular/forms";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-checkbox-chip, krds-checkbox-size",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsCheckboxChipComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (kind === "checkbox-size") {
      <div [class]="'krds-form-check ' + size">
        <input
          [id]="id"
          type="checkbox"
          [checked]="checked"
          [disabled]="disabled"
          (change)="setChecked(checkedValue($event))"
          (blur)="touch()"
        />
        <label [for]="id">{{ label }}</label>
      </div>
    } @else {
      <div class="krds-form-chip">
        <input
          class="checkbox"
          [id]="id"
          type="checkbox"
          [checked]="checked"
          [disabled]="disabled"
          (change)="setChecked(checkedValue($event))"
          (blur)="touch()"
        />
        <label class="krds-form-chip-outline" [for]="id">{{ label }}</label>
      </div>
    }
  `,
})
export class KrdsCheckboxChipComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-checkbox-chip");
  @Input() label = "레이블";
  @Input() disabled = false;
  @Input() size = "medium";
  @Input() kind: "checkbox-chip" | "checkbox-size" | null = null;
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "checkbox-chip" | "checkbox-size";

  get effectiveKind(): "checkbox-chip" | "checkbox-size" {
    return this.kind ?? this.hostTagKind;
  }

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  setChecked(value: boolean): void {
    this.checked = value;
    this.onChange(value);
    this.checkedChange.emit(value);
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  touch(): void {
    this.onTouched();
  }

  writeValue(value: string | number | boolean | string[] | null): void {
    if (typeof value === "boolean") {
      this.checked = value;
    }
    this.changeDetector?.markForCheck();
  }

  registerOnChange(fn: (value: string | number | boolean | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
}
export { KrdsCheckboxChipComponent as KrdsCheckboxSizeComponent };
