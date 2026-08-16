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
  ViewChild,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import type { ControlValueAccessor } from "@angular/forms";
import type {
  AccordionContractProps,
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from "@krds-community/recipes";

let nextAngularId = 0;

function createStableId(prefix: string): string {
  nextAngularId += 1;
  return `${prefix}-${nextAngularId.toString(36)}`;
}

@Component({
  selector: "krds-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
    [attr.type]="type"
    [disabled]="disabled"
    [class]="
      'krds-btn' +
      (variant ? ' ' + variant : '') +
      (size === 'medium' ? '' : ' ' + size) +
      (className ? ' ' + className : '')
    "
    (click)="clicked.emit($event)"
  >
    @if (label) {
      {{ label }}
    } @else {
      <ng-content />
    }
  </button>`,
})
export class KrdsButtonComponent implements ButtonContractProps {
  @Input() variant?: "primary" | "secondary" | "tertiary";
  @Input() size: "xsmall" | "small" | "medium" | "large" | "xlarge" = "medium";
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() disabled = false;
  @Input() className = "";
  @Input() label = "";
  @Output() clicked = new EventEmitter<MouseEvent>();
}

@Component({
  selector: "krds-text-input",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsTextInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `<div class="form-group">
    <div class="form-tit">
      <label [for]="id">{{ label }}</label>
    </div>
    <div
      class="form-conts"
      [class.is-error]="state === 'error'"
      [class.is-success]="state === 'success'"
      [class.is-information]="state === 'information'"
    >
      <input
        [id]="id"
        [attr.name]="name"
        [type]="type"
        [value]="value"
        [attr.value]="value || null"
        [attr.placeholder]="placeholder || null"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
        [class]="'krds-input' + (size ? ' ' + size : '') + (className ? ' ' + className : '')"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-invalid]="state === 'error' ? 'true' : null"
        [attr.aria-describedby]="hint ? id + '-hint' : null"
        (input)="input($event)"
        (blur)="blur()"
      />
    </div>
    <p
      *ngIf="hint"
      [id]="id + '-hint'"
      [class.form-hint]="state === 'default'"
      [class.form-hint-invalid]="state === 'error'"
      [class.form-hint-success]="state === 'success'"
      [class.form-hint-information]="state === 'information'"
    >
      {{ hint }}
    </p>
  </div>`,
})
export class KrdsTextInputComponent implements ControlValueAccessor, TextInputContractProps {
  @Input() id = createStableId("krds-input");
  @Input() name: string | null = null;
  @Input() type = "text";
  @Input() label = "";
  @Input("aria-label") ariaLabel = "";
  @Input() hint = "";
  @Input() placeholder = "";
  @Input() state: "default" | "error" | "success" | "information" = "default";
  @Input() size?: "small" | "medium" | "large";
  @Input() className = "";
  @Input() required = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() value = "";
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  writeValue(value: string | null): void {
    this.value = value ?? "";
    this.changeDetector?.markForCheck();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
  input(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
  blur(): void {
    this.onTouched();
  }
}

@Component({
  selector: "krds-checkbox",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsCheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `<div [class]="'krds-form-check' + (size ? ' ' + size : '')">
    <input
      #input
      [id]="id"
      [attr.name]="name ?? null"
      type="checkbox"
      [checked]="checked"
      [disabled]="disabled"
      [attr.aria-describedby]="description ? id + '-description' : null"
      (change)="changed($event)"
      (blur)="blur()"
    />
    <label [for]="id">{{ label }}</label>
    <div *ngIf="description" class="krds-form-check-cnt">
      <p [id]="id + '-description'" class="krds-form-check-p">{{ description }}</p>
    </div>
  </div>`,
})
export class KrdsCheckboxComponent implements ControlValueAccessor, ChoiceContractProps {
  @Input() id = createStableId("krds-checkbox");
  @Input() name: string | undefined = undefined;
  @Input() label = "";
  @Input() description = "";
  @Input() size?: "medium" | "large";
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @ViewChild("input", { static: true }) private inputElement?: ElementRef<HTMLInputElement>;
  private indeterminateValue = false;
  @Input()
  get indeterminate(): boolean {
    return this.indeterminateValue;
  }
  set indeterminate(value: boolean) {
    this.indeterminateValue = value;
    this.syncIndeterminate();
  }
  private syncIndeterminate(): void {
    if (this.inputElement) this.inputElement.nativeElement.indeterminate = this.indeterminateValue;
  }
  ngAfterViewInit(): void {
    this.syncIndeterminate();
  }
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  writeValue(value: boolean | null): void {
    this.checked = Boolean(value);
    this.changeDetector?.markForCheck();
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
  changed(event: Event): void {
    if (!this.disabled) {
      this.checked = (event.target as HTMLInputElement).checked;
      this.checkedChange.emit(this.checked);
      this.onChange(this.checked);
    }
  }
  blur(): void {
    this.onTouched();
  }
}

@Component({
  selector: "krds-radio",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsRadioComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `<div [class]="'krds-form-check' + (size ? ' ' + size : '')">
    <input
      [id]="id"
      [name]="name"
      type="radio"
      [attr.value]="value ?? null"
      [checked]="checked"
      [disabled]="disabled"
      [attr.aria-describedby]="description ? id + '-description' : null"
      (change)="changed()"
      (blur)="blur()"
    />
    <label [for]="id">{{ label }}</label>
    <div *ngIf="description" class="krds-form-check-cnt">
      <p [id]="id + '-description'" class="krds-form-check-p">{{ description }}</p>
    </div>
  </div>`,
})
export class KrdsRadioComponent implements ControlValueAccessor, RadioContractProps {
  @Input() id = createStableId("krds-radio");
  @Input() name = "";
  @Input() label = "";
  @Input() description = "";
  @Input() size?: "medium" | "large";
  @Input() value?: string;
  @Input() checked = false;
  @Input() disabled = false;
  @Output() selected = new EventEmitter<string>();
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  writeValue(value: string | null): void {
    this.checked = value !== null && value === this.value;
    this.changeDetector?.markForCheck();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
  changed(): void {
    if (!this.disabled) {
      this.checked = true;
      const value = this.value ?? "on";
      this.selected.emit(value);
      this.onChange(value);
    }
  }
  blur(): void {
    this.onTouched();
  }
}

@Component({
  selector: "krds-switch",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsSwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `<div [class]="'krds-form-toggle-switch' + (size ? ' ' + size : '')">
    <input
      [id]="id"
      [attr.name]="name ?? null"
      [attr.aria-label]="ariaLabel || null"
      type="checkbox"
      [checked]="checked"
      [disabled]="disabled"
      (change)="changed($event)"
      (blur)="blur()"
    />
    <label [for]="id">
      <span class="switch-toggle"><i></i></span>{{ label }}
    </label>
  </div>`,
})
export class KrdsSwitchComponent implements ControlValueAccessor, ChoiceContractProps {
  @Input() id = createStableId("krds-switch");
  @Input() name: string | undefined = undefined;
  @Input() label = "";
  @Input() size?: "medium" | "large";
  @Input() checked = false;
  @Input() disabled = false;
  @Input("aria-label") ariaLabel = "";
  @Output() checkedChange = new EventEmitter<boolean>();
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  writeValue(value: boolean | null): void {
    this.checked = Boolean(value);
    this.changeDetector?.markForCheck();
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
  changed(event: Event): void {
    if (!this.disabled) {
      this.checked = (event.target as HTMLInputElement).checked;
      this.checkedChange.emit(this.checked);
      this.onChange(this.checked);
    }
  }
  blur(): void {
    this.onTouched();
  }
}

export interface KrdsAccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
}
@Component({
  selector: "krds-accordion",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="krds-accordion" [class.type-line]="type === 'line'">
    <div *ngFor="let item of items" class="accordion-item" [class.active]="isOpen(item.id)">
      <h5 class="accordion-header">
        <button
          type="button"
          class="btn-accordion"
          [class.active]="isOpen(item.id)"
          [id]="'krds-accordion-header-' + item.id"
          [attr.aria-expanded]="isOpen(item.id)"
          [attr.aria-controls]="'krds-accordion-panel-' + item.id"
          [disabled]="item.disabled"
          (click)="toggle(item.id)"
        >
          {{ item.title }}
        </button>
      </h5>
      <div
        class="accordion-collapse collapse"
        [class.show]="isOpen(item.id)"
        role="region"
        [id]="'krds-accordion-panel-' + item.id"
        [attr.aria-labelledby]="'krds-accordion-header-' + item.id"
        [hidden]="!isOpen(item.id)"
      >
        <div class="accordion-body">{{ item.content }}</div>
      </div>
    </div>
  </div>`,
})
export class KrdsAccordionComponent implements AccordionContractProps {
  @Input() items: KrdsAccordionItem[] = [];
  @Input() type: "default" | "line" = "default";
  @Input() multiple = false;
  private _defaultOpen: string[] = [];
  openItems: string[] = [];
  @Input()
  get defaultOpen(): string[] {
    return this._defaultOpen;
  }
  set defaultOpen(value: string[]) {
    this._defaultOpen = value ?? [];
    this.openItems = [...this._defaultOpen];
  }
  isOpen(id: string): boolean {
    return this.openItems.includes(id);
  }
  toggle(id: string): void {
    this.openItems = this.isOpen(id)
      ? this.openItems.filter((item) => item !== id)
      : this.multiple
        ? [...this.openItems, id]
        : [id];
  }
}
