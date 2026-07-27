import {
  createSSRApp,
  defineComponent,
  h,
  nextTick,
  ref,
  type App,
} from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  Checkbox,
  Tab,
  TextInput,
} from '../../../packages/vue/src/index.ts';
import { captureHydrationWarnings } from './console-capture.ts';

const accordionItems = [
  { id: 'first', title: 'First section', content: 'First section content' },
  { id: 'second', title: 'Second section', content: 'Second section content' },
];
const tabs = [
  { id: 'first', label: 'First tab' },
  { id: 'second', label: 'Second tab' },
];

const VueHydrationFixture = defineComponent({
  name: 'VueHydrationFixture',
  setup() {
    const value = ref('server value');
    const accepted = ref(false);
    const openItems = ref(['first']);
    const selectedTab = ref('first');
    const submitted = ref('');

    return () =>
      h(
        'form',
        {
          onSubmit: (event: Event) => {
            event.preventDefault();
            submitted.value =
              new FormData(event.currentTarget as HTMLFormElement).get('query')?.toString() ?? '';
          },
        },
        [
          h(TextInput, {
            id: 'vue-query',
            name: 'query',
            label: 'Query',
            hint: 'Hydrated field',
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
          }),
          h(Checkbox, {
            id: 'vue-accepted',
            name: 'accepted',
            label: 'Accept',
            modelValue: accepted.value,
            'onUpdate:modelValue': (next: boolean) => (accepted.value = next),
          }),
          h(Accordion, {
            items: accordionItems,
            modelValue: openItems.value,
            'onUpdate:modelValue': (next: string[]) => (openItems.value = next),
          }),
          h(Tab, {
            id: 'vue-tabs',
            tabs,
            panels: { first: 'First panel', second: 'Second panel' },
            modelValue: selectedTab.value,
            'onUpdate:modelValue': (next: string) => (selectedTab.value = next),
          }),
          h('output', { 'data-testid': 'value-length' }, value.value.length),
          h('output', { 'data-testid': 'selected-tab' }, selectedTab.value),
          h('output', { 'data-testid': 'submitted' }, submitted.value),
          h('button', { type: 'submit' }, 'Submit'),
        ],
      );
  },
});

describe('Vue server rendering and hydration', () => {
  it('hydrates server markup in place and preserves stateful form and widget behavior', async () => {
    const consoleCapture = captureHydrationWarnings();
    const frameworkWarnings: string[] = [];
    const host = document.createElement('div');
    document.body.append(host);
    let app: App<Element> | undefined;

    try {
      const serverApp = createSSRApp(VueHydrationFixture);
      serverApp.config.warnHandler = (message) => frameworkWarnings.push(message);
      serverApp.config.errorHandler = (error) => frameworkWarnings.push(String(error));
      const serverMarkup = await renderToString(serverApp);
      expect(serverMarkup.length).toBeGreaterThan(0);
      host.innerHTML = serverMarkup;
      const serverInput = host.querySelector<HTMLInputElement>('#vue-query')!;
      expect(serverInput.value).toBe('server value');

      app = createSSRApp(VueHydrationFixture);
      app.config.warnHandler = (message) => frameworkWarnings.push(message);
      app.config.errorHandler = (error) => frameworkWarnings.push(String(error));
      app.mount(host);
      await nextTick();

      const input = host.querySelector<HTMLInputElement>('#vue-query')!;
      const checkbox = host.querySelector<HTMLInputElement>('#vue-accepted')!;
      const form = host.querySelector<HTMLFormElement>('form')!;
      expect(input).toBe(serverInput);
      expect(new FormData(form).get('query')).toBe('server value');

      input.value = 'hydrated value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      checkbox.click();
      await nextTick();
      expect(host.querySelector('[data-testid="value-length"]')?.textContent).toBe('14');
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
      await nextTick();
      expect(accordionTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(secondTab.getAttribute('aria-selected')).toBe('true');
      expect(host.querySelector('[data-testid="selected-tab"]')?.textContent).toBe('second');

      host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      await nextTick();
      expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe(
        'hydrated value',
      );
      expect(frameworkWarnings).toEqual([]);
      expect(consoleCapture.messages).toEqual([]);
    } finally {
      app?.unmount();
      host.remove();
      consoleCapture.restore();
    }
  });
});
