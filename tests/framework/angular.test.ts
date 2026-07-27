import '@angular/compiler';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  KrdsAccordionComponent,
  KrdsCheckboxComponent,
  KrdsTextInputComponent,
} from '../../packages/angular/dist/components.js';
import { KrdsAdditionalComponent } from '../../packages/angular/dist/additional.js';

const formHarnessMetadata = {
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KrdsAccordionComponent,
    KrdsCheckboxComponent,
    KrdsTextInputComponent,
  ],
  template: `
    <form [formGroup]="form" (submit)="submit($event)">
      <krds-text-input
        id="query"
        name="query"
        label="Query"
        hint="Required"
        state="error"
        formControlName="query"
      />
      <krds-checkbox
        id="accepted"
        name="accepted"
        label="Accept"
        formControlName="accepted"
      />
      <krds-checkbox id="local" name="local" label="Local" />
      <krds-accordion [items]="items" [defaultOpen]="openItems" />
      <button type="button" data-testid="replace-accordion" (click)="replaceAccordionContent()">
        Update accordion content
      </button>
      <output data-testid="count">{{ form.controls.query.value.length }}</output>
      <output data-testid="submitted">{{ submitted }}</output>
      <button type="submit">Submit</button>
    </form>
  `,
};
const FormHarnessComponent = Component(formHarnessMetadata)(
  class FormHarnessComponent {
    form = new FormGroup({
      query: new FormControl('one', { nonNullable: true }),
      accepted: new FormControl(false, { nonNullable: true }),
    });
    items = [
      { id: 'first', title: 'First', content: 'First content' },
      { id: 'second', title: 'Second', content: 'Second content' },
    ];
    openItems: string[] = [];
    replaceAccordionContent() {
      this.items = [
        { id: 'first', title: 'First renamed', content: 'Updated first content' },
        { id: 'second', title: 'Second', content: 'Second content' },
      ];
    }
    submitted = '';
    submit(event: Event) {
      event.preventDefault();
      this.submitted = new FormData(event.target as HTMLFormElement).get('query')?.toString() ?? '';
    }
  },
);

const additionalHarnessMetadata = {
  standalone: true,
  imports: [CommonModule, KrdsAdditionalComponent],
  template: `
    <krds-tab
      [tabs]="tabs"
      [selected]="selected"
      [selectedLabel]="selectedLabel"
      (selectedChange)="select($event)"
    />
    <krds-tts-icon kind="tts-icon" label="Icon speech" />
    <output data-testid="selected-tab">{{ selected }}</output>
    <button type="button" (click)="replaceProps()">Parent additional update</button>
  `,
};
const AdditionalHarnessComponent = Component(additionalHarnessMetadata)(
  class AdditionalHarnessComponent {
    selected = 'first';
    selectedLabel = 'selected';
    changes: string[] = [];
    tabs = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
    ];

    select(value: string) {
      this.selected = value;
      this.changes.push(value);
    }

    replaceProps() {
      this.tabs = [
        { id: 'first', label: 'First renamed' },
        { id: 'second', label: 'Second renamed' },
      ];
      this.selectedLabel = 'current';
    }
  },
);

beforeAll(() => {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
});
afterEach(() => TestBed.resetTestingModule());

describe('Angular core component contracts', () => {
  it('updates CVA values, disabled state, derived count, and serialized form data after mount', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FormHarnessComponent] }).createComponent(FormHarnessComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="query"]')!;
    const checkbox = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="accepted"]')!;
    const form = fixture.nativeElement.querySelector<HTMLFormElement>('form')!;

    expect(input.value).toBe('one');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('query-hint');
    expect(checkbox.checked).toBe(false);
    expect(input.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe('3');
    expect(new FormData(form).get('query')).toBe('one');

    input.value = 'user input';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.query.value).toBe('user input');
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe('10');
    expect(new FormData(form).get('query')).toBe('user input');

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.accepted.value).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(new FormData(form).get('accepted')).toBe('on');

    fixture.componentInstance.form.setValue({ query: 'updated', accepted: true });
    fixture.componentInstance.form.controls.accepted.disable();
    fixture.detectChanges();
    expect(input.value).toBe('updated');
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe('7');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.submitted).toBe('updated');
  });

  it('keeps OnPush accordion ARIA state and content current through user transitions', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [FormHarnessComponent] }).createComponent(FormHarnessComponent);
    fixture.componentInstance.openItems = ['first'];
    fixture.detectChanges();
    const trigger = () =>
      fixture.nativeElement.querySelector<HTMLButtonElement>('button[aria-controls="krds-accordion-panel-first"]')!;
    const panel = () =>
      fixture.nativeElement.querySelector<HTMLElement>('[id="krds-accordion-panel-first"][role="region"]')!;

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hidden).toBe(false);
    expect(panel().textContent?.trim()).toBe('First content');

    trigger().click();
    await fixture.whenStable();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);

    fixture.nativeElement.querySelector<HTMLButtonElement>('[data-testid="replace-accordion"]')!.click();
    await fixture.whenStable();
    expect(trigger().textContent?.trim()).toBe('First renamed');
    expect(panel().textContent?.trim()).toBe('Updated first content');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);

    trigger().click();
    await fixture.whenStable();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hidden).toBe(false);
    expect(panel().textContent?.trim()).toBe('Updated first content');
  });

  it('keeps an unbound checkbox local while a controlled CVA follows external form state', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FormHarnessComponent] }).createComponent(FormHarnessComponent);
    fixture.detectChanges();
    const controlled = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="accepted"]')!;
    const uncontrolled = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="local"]')!;
    const form = fixture.nativeElement.querySelector<HTMLFormElement>('form')!;
    const control = fixture.componentInstance.form.controls.accepted;

    expect(control.value).toBe(false);
    expect(controlled.checked).toBe(false);
    expect(uncontrolled.checked).toBe(false);

    uncontrolled.click();
    fixture.detectChanges();
    expect(uncontrolled.checked).toBe(true);
    expect(control.value).toBe(false);
    expect(new FormData(form).get('local')).toBe('on');

    control.setValue(true);
    fixture.detectChanges();
    expect(controlled.checked).toBe(true);
    expect(uncontrolled.checked).toBe(true);

    control.setValue(false);
    fixture.detectChanges();
    expect(controlled.checked).toBe(false);
    expect(uncontrolled.checked).toBe(true);
  });
  it('updates additional component inputs after mount and emits user selection outcomes', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AdditionalHarnessComponent] }).createComponent(
      AdditionalHarnessComponent,
    );
    fixture.detectChanges();
    const tabs = () => Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const parentUpdate = Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Parent additional update',
    )!;
    const ttsButton = fixture.nativeElement.querySelector<HTMLButtonElement>('button.krds-tts')!;

    expect(tabs()[0].textContent).toContain('First');
    expect(tabs()[1].textContent).toContain('Second');
    expect(fixture.nativeElement.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(ttsButton.getAttribute('aria-label')).toBe('Icon speech');

    parentUpdate.click();
    fixture.detectChanges();
    expect(tabs()[0].textContent).toContain('First renamed');
    expect(tabs()[0].textContent).toContain('current');
    expect(tabs()[1].textContent).toContain('Second renamed');

    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual(['second']);
    expect(fixture.componentInstance.selected).toBe('second');
    expect(fixture.nativeElement.querySelector('[data-testid="selected-tab"]')?.textContent?.trim()).toBe('second');
  });
});
