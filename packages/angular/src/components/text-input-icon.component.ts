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
  selector: "krds-text-input-icon, krds-text-input-size, krds-text-input-state",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsTextInputIconComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (effectiveKind === "text-input-size" || effectiveKind === "text-input-state") {
      <div class="form-group">
        <div class="form-tit">
          <label [for]="id">{{ label }}</label>
        </div>
        <div [class]="textInputContainerClass">
          <input
            [id]="id"
            [attr.type]="type"
            [value]="value"
            [attr.value]="value || null"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [readonly]="readonly"
            [required]="required"
            [class]="textInputClass"
            [attr.aria-describedby]="hint ? textInputHintId : null"
            [attr.aria-invalid]="state === 'error' ? 'true' : null"
            (input)="setValue(inputValue($event))"
            (blur)="touch()"
          />
        </div>
        @if (hint) {
          <p [id]="textInputHintId" [class]="textInputHintClass">{{ hint }}</p>
        }
      </div>
    } @else {
      <div class="form-group">
        <div class="form-tit">
          <label [for]="id">{{ label }}</label>
        </div>
        <div class="form-conts btn-ico-wrap">
          <input
            [id]="id"
            class="krds-input"
            [attr.type]="type"
            [value]="value"
            [attr.value]="value || null"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [readonly]="readonly"
            [required]="required"
            (input)="setValue(inputValue($event))"
            (blur)="touch()"
          />
          <button type="button" class="krds-btn medium icon">
            <span class="sr-only">입력한 비밀번호 보기</span>
            <i class="svg-icon ico-pw-visible"></i>
          </button>
        </div>
      </div>
    }
  `,
})
export class KrdsTextInputIconComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-text-input-icon");
  @Input() label = "레이블";
  @Input() type = "text";
  @Input() value = "";
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() hint = "";
  @Input() state: "default" | "error" | "success" | "information" = "default";
  @Input() size = "medium";
  @Input() kind: "text-input-icon" | "text-input-size" | "text-input-state" | null = null;
  @Output() valueChange = new EventEmitter<string>();

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });
  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "text-input-icon" | "text-input-size" | "text-input-state";

  get effectiveKind(): "text-input-icon" | "text-input-size" | "text-input-state" {
    return this.kind ?? this.hostTagKind;
  }

  get textInputContainerClass(): string {
    return `form-conts${this.state === "default" ? "" : ` is-${this.state}`}`;
  }

  get textInputClass(): string {
    return `krds-input${this.effectiveKind === "text-input-size" ? ` ${this.size}` : ""}`;
  }

  get textInputHintId(): string {
    return `${this.id}-hint`;
  }

  get textInputHintClass(): string {
    if (this.state === "error") return "form-hint-invalid";
    if (this.state === "success") return "form-hint-success";
    if (this.state === "information") return "form-hint-information";
    return "form-hint";
  }

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
