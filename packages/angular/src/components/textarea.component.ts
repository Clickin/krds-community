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
  selector: "krds-textarea",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsTextareaComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <textarea
      class="krds-input"
      [id]="id"
      [value]="value"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [attr.aria-describedby]="hint ? textareaHintId : null"
      (input)="setValue(inputValue($event))"
      (blur)="touch()"
    ></textarea>
    <label [for]="id">{{ label }}</label>
    @if (hint) {
      <p [id]="textareaHintId">{{ hint }}</p>
    }
  `,
})
export class KrdsTextareaComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-textarea");
  @Input() label = "레이블";
  @Input() value = "";
  @Input() placeholder = "";
  @Input() hint = "";
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Output() valueChange = new EventEmitter<string>();

  get textareaHintId(): string {
    return `${this.id}-hint`;
  }

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  setValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  touch(): void {
    this.onTouched();
  }

  writeValue(value: string | number | boolean | string[] | null): void {
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = String(value);
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
