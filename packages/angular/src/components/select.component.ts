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
import { selectRecipe, type SelectRecipeSize } from "@krds-community/recipes";
import { createStableId } from "../kinds";

const ANGULAR_ADDITIONAL_KINDS = [
  "select",
  "select-size",
  "select-sorting",
  "select-state",
] as const;

@Component({
  selector: "krds-select, krds-select-size, krds-select-sorting, krds-select-state",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (selectKind === "select-sorting") {
      <select
        [id]="id"
        [attr.name]="name || null"
        [attr.class]="selectClass"
        [attr.title]="title || null"
        [attr.aria-label]="title || label || null"
        [value]="selected"
        [disabled]="disabled"
        [required]="required"
        (change)="setSelected(inputValue($event))"
        (blur)="touch()"
      >
        @for (option of options; track $index) {
          <option
            [attr.value]="option.value"
            [disabled]="option.disabled"
            [selected]="selectOptionSelected($index)"
          >
            {{ option.label }}
          </option>
        }
      </select>
    } @else {
      <div class="form-group">
        <div class="form-tit">
          <label [for]="id">{{ label }}</label>
        </div>
        <div class="form-conts">
          <select
            [id]="id"
            [attr.name]="name || null"
            [attr.class]="selectClass"
            [attr.title]="title || null"
            [value]="selected"
            [disabled]="disabled"
            [required]="required"
            [attr.aria-invalid]="state === 'error' ? 'true' : null"
            [attr.aria-describedby]="hint ? selectHintId : null"
            (change)="setSelected(inputValue($event))"
            (blur)="touch()"
          >
            @for (option of options; track $index) {
              <option
                [attr.value]="option.value"
                [disabled]="option.disabled"
                [attr.selected]="selectKind === 'select-size' && $first ? '' : null"
                [selected]="selectOptionSelected($index)"
              >
                {{ option.label }}
              </option>
            }
          </select>
        </div>
        @if (hint) {
          <p [id]="selectHintId" [attr.class]="selectHintClass">{{ hint }}</p>
        }
      </div>
    }
  `,
})
export class KrdsSelectComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-select");
  @Input() label = "레이블";
  @Input() title = "제목";
  @Input() name = "";
  @Input() hint = "";
  @Input() disabled = false;
  @Input() required = false;
  @Input() state: "default" | "error" | "success" | "information" = "default";
  @Input() size = "medium";
  @Input() className = "";
  @Input() selected = "";
  @Input() options: Array<{ value: string; label: string; disabled?: boolean }> = [];
  @Input() kind: (typeof ANGULAR_ADDITIONAL_KINDS)[number] | null = null;
  @Output() selectedChange = new EventEmitter<string>();

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });
  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as (typeof ANGULAR_ADDITIONAL_KINDS)[number];

  get selectKind(): string {
    return this.kind ?? this.hostTagKind;
  }

  get selectClass(): string {
    const kind = this.selectKind;
    const control =
      kind === "select-sorting"
        ? selectRecipe({ variant: "sorting" }).control
        : selectRecipe({
            variant:
              kind === "select-size" ? "size" : kind === "select-state" ? "state" : "default",
            size: kind === "select-size" ? (this.size as SelectRecipeSize) : undefined,
            state: this.state,
          }).control;
    return `${control}${this.className ? ` ${this.className}` : ""}`;
  }

  get selectHintId(): string {
    return `${this.id}-hint`;
  }

  get selectHintClass(): string {
    if (this.state === "error") return "form-hint-invalid";
    if (this.state === "success") return "form-hint-success";
    if (this.state === "information") return "form-hint-information";
    return "form-hint";
  }

  selectOptionSelected(index: number): boolean {
    if (this.selectKind === "select-size") return index === 0;
    return this.options.findIndex((option) => option.value === this.selected) === index;
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

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
    } else if (typeof value === "number") {
      this.selected = String(value);
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
export {
  KrdsSelectComponent as KrdsSelectSizeComponent,
  KrdsSelectComponent as KrdsSelectSortingComponent,
  KrdsSelectComponent as KrdsSelectStateComponent,
};
