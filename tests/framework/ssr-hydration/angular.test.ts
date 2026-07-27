import '@angular/compiler';
import { Component, destroyPlatform, type ApplicationRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { describe, expect, it } from 'vitest';
import {
  KrdsAccordionComponent,
  KrdsCheckboxComponent,
  KrdsTabComponent,
  KrdsTextInputComponent,
} from '../../../packages/angular/src/index.ts';
import { captureHydrationWarnings } from './console-capture.ts';

const angularHydrationMetadata = {
  selector: 'krds-hydration-fixture',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KrdsAccordionComponent,
    KrdsCheckboxComponent,
    KrdsTabComponent,
    KrdsTextInputComponent,
  ],
  template: `
    <form [formGroup]="form" (submit)="submit($event)">
      <krds-text-input
        id="angular-query"
        name="query"
        label="Query"
        hint="Hydrated field"
        formControlName="query"
      ></krds-text-input>
      <krds-checkbox
        id="angular-accepted"
        name="accepted"
        label="Accept"
        formControlName="accepted"
      ></krds-checkbox>
      <krds-accordion
        [items]="accordionItems"
        [defaultOpen]="['first']"
      ></krds-accordion>
      <krds-tab
        id="angular-tabs"
        [tabs]="tabs"
        [selected]="selectedTab"
        selectedLabel="Selected"
        (selectedChange)="selectedTab = $event"
      ></krds-tab>
      <output data-testid="value-length">{{ form.controls.query.value.length }}</output>
      <output data-testid="selected-tab">{{ selectedTab }}</output>
      <output data-testid="submitted">{{ submitted }}</output>
      <button type="submit">Submit</button>
    </form>
  `,
};

class AngularHydrationFixtureState {
  readonly form = new FormGroup({
    query: new FormControl('server value', { nonNullable: true }),
    accepted: new FormControl(false, { nonNullable: true }),
  });
  readonly accordionItems = [
    { id: 'first', title: 'First section', content: 'First section content' },
    { id: 'second', title: 'Second section', content: 'Second section content' },
  ];
  readonly tabs = [
    { id: 'first', label: 'First tab' },
    { id: 'second', label: 'Second tab' },
  ];
  selectedTab = 'first';
  submitted = '';

  submit(event: Event) {
    event.preventDefault();
    this.submitted =
      new FormData(event.currentTarget as HTMLFormElement).get('query')?.toString() ?? '';
  }
}

const AngularHydrationFixture = Component(angularHydrationMetadata)(
  AngularHydrationFixtureState,
);

const serverDocument = `<!doctype html>
<html>
  <head><title>Angular hydration fixture</title></head>
  <body><krds-hydration-fixture></krds-hydration-fixture></body>
</html>`;

function restoreRuntimeGlobals(descriptors: PropertyDescriptorMap) {
  const originalKeys = new Set(Reflect.ownKeys(descriptors));
  for (const key of Reflect.ownKeys(globalThis)) {
    if (!originalKeys.has(key)) Reflect.deleteProperty(globalThis, key);
  }
  for (const key of originalKeys) {
    const descriptor = Reflect.get(descriptors, key) as PropertyDescriptor;
    Reflect.defineProperty(globalThis, key, descriptor);
  }
}

describe('Angular server rendering and hydration', () => {
  it('hydrates server markup in place and preserves stateful form and widget behavior', async () => {
    const consoleCapture = captureHydrationWarnings();
    let appRef: ApplicationRef | undefined;

    try {
      const browserGlobals = Object.getOwnPropertyDescriptors(globalThis);
      let serverMarkup = '';
      try {
        serverMarkup = await renderApplication(
          (context) =>
            bootstrapApplication(
              AngularHydrationFixture,
              {
                providers: [provideServerRendering(), provideClientHydration()],
              },
              context,
            ),
          {
            document: serverDocument,
            url: 'http://localhost/',
            allowedHosts: ['localhost'],
          },
        );
      } finally {
        // Angular's server adapter installs Domino constructors globally. Restore
        // JSDOM before invoking the browser bootstrap and dispatching DOM events.
        restoreRuntimeGlobals(browserGlobals);
      }
      expect(serverMarkup.length).toBeGreaterThan(0);
      const parsed = new DOMParser().parseFromString(serverMarkup, 'text/html');
      document.head.innerHTML = parsed.head.innerHTML;
      document.body.innerHTML = parsed.body.innerHTML;
      const host = document.querySelector<HTMLElement>('krds-hydration-fixture')!;
      const serverInput = host.querySelector<HTMLInputElement>('input[id="angular-query"]')!;
      expect(serverInput.value).toBe('server value');

      appRef = await bootstrapApplication(AngularHydrationFixture, {
        providers: [provideClientHydration()],
      });
      await appRef.whenStable();

      const input = host.querySelector<HTMLInputElement>('input[id="angular-query"]')!;
      const checkbox = host.querySelector<HTMLInputElement>('input[id="angular-accepted"]')!;
      const form = host.querySelector<HTMLFormElement>('form')!;
      const instance = appRef.components[0]!.instance as AngularHydrationFixtureState;
      expect(input).toBe(serverInput);
      expect(new FormData(form).get('query')).toBe('server value');

      input.value = 'hydrated value';
      const inputEvent = input.ownerDocument.createEvent('Event');
      inputEvent.initEvent('input', true, false);
      input.dispatchEvent(inputEvent);
      checkbox.click();
      appRef.tick();
      await appRef.whenStable();
      expect(instance.form.controls.query.value).toBe('hydrated value');
      expect(host.querySelector('[data-testid="value-length"]')?.textContent?.trim()).toBe(
        '14',
      );
      expect(new FormData(form).get('query')).toBe('hydrated value');
      expect(new FormData(form).get('accepted')).toBe('on');

      const accordionTrigger = host.querySelector<HTMLButtonElement>('.btn-accordion')!;
      accordionTrigger.click();
      const tabNodes = host.querySelectorAll<HTMLElement>('[role="tab"]');
      const secondTab = tabNodes[1]!;
      (secondTab.matches('button')
        ? secondTab
        : secondTab.querySelector<HTMLButtonElement>('button')!
      ).click();
      appRef.tick();
      await appRef.whenStable();
      expect(accordionTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(secondTab.getAttribute('aria-selected')).toBe('true');
      expect(host.querySelector('[data-testid="selected-tab"]')?.textContent?.trim()).toBe(
        'second',
      );

      const submitEvent = form.ownerDocument.createEvent('Event');
      submitEvent.initEvent('submit', true, true);
      form.dispatchEvent(submitEvent);
      appRef.tick();
      await appRef.whenStable();
      expect(host.querySelector('[data-testid="submitted"]')?.textContent?.trim()).toBe(
        'hydrated value',
      );
      expect(consoleCapture.messages).toEqual([]);
    } finally {
      appRef?.destroy();
      destroyPlatform();
      document.head.innerHTML = '';
      document.body.innerHTML = '';
      consoleCapture.restore();
    }
  });
});
