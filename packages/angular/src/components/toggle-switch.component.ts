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
  selector: "krds-toggle-switch, krds-toggle-switch-size",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsToggleSwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="
        'krds-form-toggle-switch' +
        (size && effectiveKind === 'toggle-switch-size' ? ' ' + size : '')
      "
    >
      <input
        [id]="id"
        [attr.name]="name || null"
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        (change)="setChecked(checkedValue($event))"
        (blur)="touch()"
      />
      <label [for]="id">
        <span class="switch-toggle"><i></i></span>{{ label }}
      </label>
    </div>
  `,
})
export class KrdsToggleSwitchComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-toggle-switch");
  @Input() label = "";
  @Input() name = "";
  @Input() disabled = false;
  @Input() size = "";
  @Input() kind: "toggle-switch" | "toggle-switch-size" | null = null;
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "toggle-switch" | "toggle-switch-size";

  get effectiveKind(): "toggle-switch" | "toggle-switch-size" {
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
export { KrdsToggleSwitchComponent as KrdsToggleSwitchSizeComponent };
