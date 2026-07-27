import { act, useState, type FormEvent } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  Checkbox,
  Tab,
  TextInput,
} from '../../../packages/react/src/index.ts';
import { captureHydrationWarnings } from './console-capture.ts';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const accordionItems = [
  { id: 'first', title: 'First section', content: 'First section content' },
  { id: 'second', title: 'Second section', content: 'Second section content' },
];
const tabs = [
  { id: 'first', label: 'First tab' },
  { id: 'second', label: 'Second tab' },
];

function ReactHydrationFixture() {
  const [value, setValue] = useState('server value');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(new FormData(event.currentTarget).get('query')?.toString() ?? '');
  };

  return (
    <form onSubmit={submit}>
      <TextInput
        id="react-query"
        name="query"
        label="Query"
        hint="Hydrated field"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Checkbox
        id="react-accepted"
        name="accepted"
        label="Accept"
        checked={accepted}
        onChange={(event) => setAccepted(event.currentTarget.checked)}
      />
      <Accordion items={accordionItems} defaultOpen={['first']} />
      <Tab
        tabs={tabs}
        panels={{ first: 'First panel', second: 'Second panel' }}
        defaultTab="first"
      />
      <output data-testid="value-length">{value.length}</output>
      <output data-testid="submitted">{submitted}</output>
      <button type="submit">Submit</button>
    </form>
  );
}

describe('React server rendering and hydration', () => {
  it('hydrates server markup in place and preserves stateful form and widget behavior', async () => {
    const consoleCapture = captureHydrationWarnings();
    const recoverableErrors: string[] = [];
    const host = document.createElement('div');
    document.body.append(host);
    let root: Root | undefined;

    try {
      const serverMarkup = renderToString(<ReactHydrationFixture />);
      expect(serverMarkup.length).toBeGreaterThan(0);
      host.innerHTML = serverMarkup;
      const serverInput = host.querySelector<HTMLInputElement>('#react-query')!;
      expect(serverInput.value).toBe('server value');

      await act(async () => {
        root = hydrateRoot(host, <ReactHydrationFixture />, {
          onRecoverableError(error) {
            recoverableErrors.push(error instanceof Error ? error.message : String(error));
          },
        });
      });

      const input = host.querySelector<HTMLInputElement>('#react-query')!;
      const checkbox = host.querySelector<HTMLInputElement>('#react-accepted')!;
      const form = host.querySelector<HTMLFormElement>('form')!;
      expect(input).toBe(serverInput);
      expect(new FormData(form).get('query')).toBe('server value');

      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
          input,
          'hydrated value',
        );
        input.dispatchEvent(new Event('input', { bubbles: true }));
        checkbox.click();
      });
      expect(host.querySelector('[data-testid="value-length"]')?.textContent).toBe('14');
      expect(new FormData(form).get('query')).toBe('hydrated value');
      expect(new FormData(form).get('accepted')).toBe('on');

      const accordionTrigger = host.querySelector<HTMLButtonElement>('.btn-accordion')!;
      const secondTabButton = host.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1]!;
      await act(async () => {
        accordionTrigger.click();
        secondTabButton.click();
      });
      expect(accordionTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(secondTabButton.getAttribute('aria-selected')).toBe('true');
      expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
        'Second panel',
      );

      await act(async () => {
        host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      });
      expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe(
        'hydrated value',
      );
      expect(recoverableErrors).toEqual([]);
      expect(consoleCapture.messages).toEqual([]);
    } finally {
      if (root) await act(async () => root?.unmount());
      host.remove();
      consoleCapture.restore();
    }
  });
});
