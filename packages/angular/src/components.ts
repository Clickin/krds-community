import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';
import type {
  AccordionContractProps,
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from '@krds-community/recipes';

@Component({
  selector: 'krds-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
    [attr.type]="type"
    [disabled]="disabled"
    [class]="'krds-button ' + className"
    [attr.data-variant]="variant"
    [attr.data-size]="size"
    (click)="clicked.emit($event)"
  >
    <ng-content />
  </button>`,
})
export class KrdsButtonComponent implements ButtonContractProps {
  @Input() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() className = '';
  @Output() clicked = new EventEmitter<MouseEvent>();
}

@Component({
  selector: 'krds-text-input',
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
  template: `<label class="krds-field"
    ><span *ngIf="label" class="krds-field-label">{{ label }}</span
    ><input
      [id]="id"
      [name]="name"
      [type]="type"
      [value]="value"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [class]="'krds-input ' + className"
      [attr.data-state]="state"
      [attr.data-size]="size"
      [attr.aria-invalid]="state === 'error' ? 'true' : null"
      [attr.aria-describedby]="hint ? id + '-hint' : null"
      (input)="input($event)"
      (blur)="blur()"
    /><span *ngIf="hint" [id]="id + '-hint'" class="krds-field-message" [attr.data-state]="state">{{
      hint
    }}</span></label
  >`,
})
export class KrdsTextInputComponent implements ControlValueAccessor, TextInputContractProps {
  @Input() id = 'krds-input';
  @Input() name: string | null = null;
  @Input() type = 'text';
  @Input() label = '';
  @Input() hint = '';
  @Input() placeholder = '';
  @Input() state: 'default' | 'error' | 'success' | 'information' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() className = '';
  @Input() required = false;
  @Input() readonly = false;
  disabled = false;
  value = '';
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
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
  selector: 'krds-checkbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="krds-form-check" [attr.data-size]="size">
    <input
      [id]="id"
      [name]="name"
      type="checkbox"
      [checked]="checked"
      [disabled]="disabled"
      (change)="changed($event)"
    /><label [for]="id">{{ label }}</label
    ><span *ngIf="description" class="krds-field-message">{{ description }}</span>
  </div>`,
})
export class KrdsCheckboxComponent implements ChoiceContractProps {
  @Input() id = 'krds-checkbox';
  @Input() name: string | undefined = undefined;
  @Input() label = '';
  @Input() description = '';
  @Input() size: 'medium' | 'large' = 'medium';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  changed(event: Event): void {
    if (!this.disabled) {
      this.checkedChange.emit((event.target as HTMLInputElement).checked);
    }
  }
}

@Component({
  selector: 'krds-radio',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="krds-form-check" [attr.data-size]="size">
    <input
      [id]="id"
      [name]="name"
      type="radio"
      [value]="value"
      [checked]="checked"
      [disabled]="disabled"
      (change)="selected.emit(value)"
    /><label [for]="id">{{ label }}</label
    ><span *ngIf="description" class="krds-field-message">{{ description }}</span>
  </div>`,
})
export class KrdsRadioComponent implements RadioContractProps {
  @Input() id = 'krds-radio';
  @Input() name = '';
  @Input() label = '';
  @Input() description = '';
  @Input() size: 'medium' | 'large' = 'medium';
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() selected = new EventEmitter<string>();
}

@Component({
  selector: 'krds-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="krds-form-toggle-switch" [attr.data-size]="size">
    <input
      [id]="id"
      [name]="name"
      type="checkbox"
      [checked]="checked"
      [disabled]="disabled"
      (change)="changed($event)"
    /><label [for]="id"
      ><span class="switch-toggle" aria-hidden="true"><i></i></span>{{ label }}</label
    >
  </div>`,
})
export class KrdsSwitchComponent implements ChoiceContractProps {
  @Input() id = 'krds-switch';
  @Input() name: string | undefined = undefined;
  @Input() label = '';
  @Input() size: 'medium' | 'large' = 'medium';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  changed(event: Event): void {
    this.checkedChange.emit((event.target as HTMLInputElement).checked);
  }
}

export interface KrdsAccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
}
@Component({
  selector: 'krds-accordion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="krds-accordion" [attr.data-type]="type">
    <div *ngFor="let item of items" class="krds-accordion-item" [class.is-open]="isOpen(item.id)">
      <h5 class="krds-accordion-heading">
        <button
          type="button"
          class="krds-accordion-trigger"
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
        class="krds-accordion-panel"
        role="region"
        [id]="'krds-accordion-panel-' + item.id"
        [attr.aria-labelledby]="'krds-accordion-header-' + item.id"
        [hidden]="!isOpen(item.id)"
      >
        {{ item.content }}
      </div>
    </div>
  </div>`,
})
export class KrdsAccordionComponent implements AccordionContractProps {
  @Input() items: KrdsAccordionItem[] = [];
  @Input() type: 'default' | 'line' = 'default';
  @Input() multiple = false;
  @Input() defaultOpen: string[] = [];
  openItems: string[] = [];
  ngOnInit(): void {
    this.openItems = [...this.defaultOpen];
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
