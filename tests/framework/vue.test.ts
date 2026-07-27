import { createApp, defineComponent, h, nextTick, reactive, ref, type App, type Component } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { Accordion, Checkbox, Tab, TextInput } from '../../packages/vue/src/index.ts';

let app: App<Element> | undefined;
let host: HTMLDivElement;

async function mount(view: Component) {
  host = document.createElement('div');
  document.body.append(host);
  app = createApp(view);
  app.mount(host);
  await nextTick();
}

afterEach(() => {
  app?.unmount();
  app = undefined;
  host?.remove();
});

describe('Vue core component contracts', () => {
  it('supports reactive setProps, v-model updates, native state, derived count, and form data', async () => {
    const props = reactive({
      value: 'one',
      accepted: false,
      disabled: false,
      openItems: [] as string[],
      items: [
        { id: 'first', title: 'First', content: 'First content' },
        { id: 'second', title: 'Second', content: 'Second content' },
      ],
    });
    const setProps = (next: Partial<typeof props>) => Object.assign(props, next);
    const submitted = ref('');
    const Parent = defineComponent({
      setup() {
        return () =>
          h('form', {
            onSubmit: (event: Event) => {
              event.preventDefault();
              submitted.value = new FormData(event.currentTarget as HTMLFormElement).get('query')?.toString() ?? '';
            },
          }, [
            h(TextInput, {
              id: 'query',
              name: 'query',
              label: 'Query',
              hint: 'Required',
              state: 'error',
              modelValue: props.value,
              'onUpdate:modelValue': (value: string) => setProps({ value }),
            }),
            h(Checkbox, {
              id: 'accepted',
              name: 'accepted',
              label: 'Accept',
              modelValue: props.accepted,
              disabled: props.disabled,
              'onUpdate:modelValue': (value: boolean) => setProps({ accepted: value }),
            }),
            h(Accordion, {
              items: props.items,
              modelValue: props.openItems,
              'onUpdate:modelValue': (value: string[]) => setProps({ openItems: value }),
            }),
            h('output', { 'data-testid': 'count' }, props.value.length),
            h('output', { 'data-testid': 'submitted' }, submitted.value),
            h('button', {
              type: 'button',
              onClick: () => setProps({ value: 'updated', disabled: true }),
            }, 'Parent update'),
            h('button', { type: 'submit' }, 'Submit'),
          ]);
      },
    });

    await mount(Parent);
    const input = host.querySelector<HTMLInputElement>('#query')!;
    const checkbox = host.querySelector<HTMLInputElement>('#accepted')!;
    const update = Array.from(host.querySelectorAll('button')).find((button) => button.textContent === 'Parent update')!;

    expect(input.value).toBe('one');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('query-hint');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('3');
    expect(new FormData(host.querySelector('form')!).get('query')).toBe('one');

    input.value = 'user input';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    expect(input.value).toBe('user input');
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('10');
    expect(new FormData(host.querySelector('form')!).get('query')).toBe('user input');

    checkbox.click();
    await nextTick();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(host.querySelector('form')!).get('accepted')).toBe('on');

    update.click();
    await nextTick();
    expect(input.value).toBe('updated');
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('7');

    host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await nextTick();
    expect(submitted.value).toBe('updated');
  });

  it('keeps controlled accordion expanded state and item content reactive', async () => {
    const openItems = ref<string[]>([]);
    const emittedValues: string[][] = [];
    const items = ref([
      { id: 'first', title: 'First', content: 'First content' },
      { id: 'second', title: 'Second', content: 'Second content' },
    ]);
    const Parent = defineComponent({
      setup() {
        return () => h(Accordion, {
          items: items.value,
          modelValue: openItems.value,
          'onUpdate:modelValue': (value: string[]) => {
            emittedValues.push(value);
            openItems.value = value;
          },
        });
      },
    });
    await mount(Parent);
    const trigger = host.querySelector<HTMLButtonElement>('.btn-accordion')!;
    const panel = host.querySelector<HTMLElement>('[role="region"]')!;
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
    trigger.click();
    await nextTick();
    expect(openItems.value).toEqual(['first']);
    expect(emittedValues).toEqual([['first']]);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);

    items.value = [{ id: 'first', title: 'Renamed', content: 'Updated content' }, items.value[1]];
    await nextTick();
    expect(trigger.textContent).toBe('Renamed');
    expect(panel.textContent).toBe('Updated content');
  });

  it('preserves uncontrolled checkbox state across unrelated parent rerenders and native form serialization', async () => {
    const revision = ref(0);
    const Parent = defineComponent({
      setup() {
        return () =>
          h('form', null, [
            h(Checkbox, {
              id: 'local-checkbox',
              name: 'local',
              label: 'Local',
              defaultChecked: true,
            }),
            h('output', { 'data-testid': 'revision' }, revision.value),
            h('button', { type: 'button', onClick: () => (revision.value += 1) }, 'Rerender'),
          ]);
      },
    });

    await mount(Parent);
    const form = host.querySelector('form')!;
    const checkbox = host.querySelector<HTMLInputElement>('#local-checkbox')!;
    const rerender = host.querySelector<HTMLButtonElement>('button')!;
    expect(checkbox.checked).toBe(true);
    expect(new FormData(form).get('local')).toBe('on');

    checkbox.click();
    await nextTick();
    expect(checkbox.checked).toBe(false);
    expect(new FormData(form).has('local')).toBe(false);

    rerender.click();
    await nextTick();
    expect(host.querySelector('[data-testid="revision"]')?.textContent).toBe('1');
    expect(checkbox.checked).toBe(false);

    checkbox.click();
    await nextTick();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(form).get('local')).toBe('on');
  });

  it('keeps additional tab content and selection reactive to parent and user updates', async () => {
    const selected = ref('first');
    const tabs = ref([
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
    ]);
    const Parent = defineComponent({
      setup() {
        return () =>
          h(Tab, {
            tabs: tabs.value,
            panels: { first: 'First panel', second: 'Second panel' },
            modelValue: selected.value,
            'onUpdate:modelValue': (value: string) => (selected.value = value),
          });
      },
    });
    await mount(Parent);
    const renderedTabs = () => Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));

    expect(renderedTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs()[1].getAttribute('aria-selected')).toBe('false');

    selected.value = 'second';
    tabs.value = [
      { id: 'first', label: 'First renamed' },
      { id: 'second', label: 'Second renamed' },
    ];
    await nextTick();
    expect(renderedTabs()[0].textContent).toContain('First renamed');
    expect(renderedTabs()[1].textContent).toContain('Second renamed');
    expect(renderedTabs()[0].getAttribute('aria-selected')).toBe('false');
    expect(renderedTabs()[1].getAttribute('aria-selected')).toBe('true');

    renderedTabs()[0].click();
    await nextTick();
    expect(selected.value).toBe('first');
    expect(renderedTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs()[1].getAttribute('aria-selected')).toBe('false');
  });
});
