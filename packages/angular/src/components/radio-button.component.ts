import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  selector: "krds-radio-button",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsRadioButtonComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-form-check">
      <input
        [id]="id"
        type="radio"
        [attr.name]="name || null"
        [attr.value]="value || null"
        [checked]="checked || (value !== '' && selected === value)"
        [disabled]="disabled"
        (change)="setSelected(value || 'on')"
        (blur)="touch()"
      />
      <label [for]="id">{{ label }}</label>
    </div>
  `,
})
export class KrdsRadioButtonComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-radio-button");
  @Input() label = "레이블";
  @Input() name = "";
  @Input() value = "";
  @Input() disabled = false;
  @Input() checked = false;
  @Input() selected = "";
  @Output() selectedChange = new EventEmitter<string>();

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  setSelected(value: string): void {
    this.selected = value;
    this.onChange(value);
    this.selectedChange.emit(value);
  }

  touch(): void {
    this.onTouched();
  }

  writeValue(value: string | number | boolean | string[] | null): void {
    if (typeof value === "string") {
      this.selected = value;
    } else if (typeof value === "boolean") {
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
