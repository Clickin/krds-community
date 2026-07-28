import { createApp, defineComponent, h, nextTick, reactive, ref, type App, type Component } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Accordion,
  Checkbox,
  CoachMark,
  CriticalAlerts,
  DateInput,
  Disclosure,
  FileUpload,
  Footer,
  HelpPanel,
  Header,
  InPageNavigation,
  LanguageSwitcher,
  LanguageSwitcherPage,
  Link,
  MainMenuMobile,
  Modal,
  Pagination,
  RadioSize,
  Resize,
  Select,
  SelectSize,
  SelectState,
  SelectSorting,
  Spinner,
  StructuredList,
  StructuredListTable,
  Tab,
  Tag,
  TagLink,
  TextInput,
  TextInputIcon,
  Tooltip,
  Tts,
  TutorialPanel,
} from '../../packages/vue/src/index.ts';

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
    const item = trigger.closest<HTMLElement>('.accordion-item')!;
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
    expect(item.classList.contains('active')).toBe(true);
    expect(trigger.classList.contains('active')).toBe(true);

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

  it('recomputes select recipe modifiers from reactive props without stale classes', async () => {
    const size = ref('small');
    const state = ref<'default' | 'error' | 'success' | 'information'>('error');
    const hint = ref('Error hint');
    const options = [{ label: 'One', value: 'one' }];
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(SelectSize, {
              class: 'consumer-size',
              label: 'Size',
              size: size.value,
              state: state.value,
              options,
              modelValue: 'one',
            }),
            h(SelectState, {
              class: 'consumer-state',
              label: 'State',
              state: state.value,
              id: 'state-select',
              hint: hint.value,
              error: 'Error message',
              options,
              modelValue: 'one',
            }),
          ]);
      },
    });

    await mount(Parent);
    const selectElements = Array.from(host.querySelectorAll<HTMLSelectElement>('select'));
    expect(selectElements.every((select) => !select.hasAttribute('value'))).toBe(true);
    expect(selectElements[0].className).toBe(
      'krds-form-select small is-error consumer-size',
    );
    expect(selectElements[1].className).toBe('krds-form-select is-error consumer-state');
    expect(selectElements[0].options[0].getAttribute('selected')).toBe('');
    expect(selectElements[1].options[0].hasAttribute('selected')).toBe(false);
    expect(selectElements[0].closest('.form-group')?.className).toBe('form-group');
    expect(selectElements[0].parentElement?.className).toBe('form-conts');
    expect(selectElements[1].parentElement?.className).toBe('form-conts');
    expect(
      host.querySelector<HTMLLabelElement>('.form-tit > label[for="state-select"]')
        ?.htmlFor,
    ).toBe('state-select');
    expect(selectElements[1].getAttribute('aria-describedby')).toBe(
      'state-select-hint',
    );
    expect(selectElements[1].getAttribute('aria-invalid')).toBe('true');
    expect(host.querySelector('#state-select-hint')?.className).toBe(
      'form-hint-invalid',
    );
    expect(host.querySelector('#state-select-hint')?.textContent).toBe(
      'Error message',
    );

    state.value = 'success';
    await nextTick();
    expect(selectElements[1].className).toBe('krds-form-select is-success consumer-state');
    expect(selectElements[0].className).toBe(
      'krds-form-select small is-success consumer-size',
    );
    expect(selectElements[1].classList.contains('is-error')).toBe(false);
    expect(selectElements[0].classList.contains('is-error')).toBe(false);
    expect(selectElements[0].parentElement?.className).toBe('form-conts');
    expect(selectElements[1].parentElement?.className).toBe('form-conts');
    expect(selectElements[1].getAttribute('aria-invalid')).toBeNull();
    expect(host.querySelector('#state-select-hint')?.className).toBe(
      'form-hint-success',
    );
    expect(host.querySelector('#state-select-hint')?.textContent).toBe(
      'Error hint',
    );

    size.value = 'large';
    state.value = 'default';
    await nextTick();
    expect(selectElements[0].className).toBe('krds-form-select large consumer-size');
    expect(selectElements[0].classList.contains('small')).toBe(false);
    expect(selectElements[1].className).toBe('krds-form-select consumer-state');
    expect(selectElements[1].classList.contains('is-error')).toBe(false);
    expect(selectElements[1].parentElement?.className).toBe('form-conts');
    expect(host.querySelector('#state-select-hint')?.className).toBe('form-hint');
  });

  it('keeps select attrs, exposed element, native events, and form ownership on the control', async () => {
    type SelectExposure = { element: HTMLSelectElement | null };
    const selected = ref('second');
    const changes: Event[] = [];
    const focuses: FocusEvent[] = [];
    let exposedSelect: SelectExposure | null = null;
    const options = [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
    ];
    const Parent = defineComponent({
      setup() {
        return () =>
          h('form', { id: 'select-form' }, [
            h('p', { id: 'external-help' }, 'External help'),
            h(Select, {
              ref: (instance: unknown) => {
                exposedSelect = instance as SelectExposure | null;
              },
              id: 'account-select',
              name: 'account',
              required: true,
              label: 'Account',
              hint: 'Choose an account',
              title: 'Account choice',
              class: 'consumer-select',
              'data-consumer': 'select',
              'aria-describedby': 'external-help',
              modelValue: selected.value,
              options,
              onFocus: (event: FocusEvent) => focuses.push(event),
              onChange: (payload: Event | [string, string]) => {
                if (payload instanceof Event) changes.push(payload);
              },
              'onUpdate:modelValue': (
                next: string | number | boolean | string[],
              ) => {
                selected.value = String(next);
              },
            }),
            h(SelectSorting, {
              id: 'sorting-select',
              title: 'Sort results',
              class: 'consumer-sorting',
              options,
            }),
          ]);
      },
    });

    await mount(Parent);
    const form = host.querySelector<HTMLFormElement>('#select-form')!;
    const select = host.querySelector<HTMLSelectElement>('#account-select')!;
    const root = select.closest<HTMLElement>('.form-group')!;
    const sorting = host.querySelector<HTMLSelectElement>('#sorting-select')!;

    expect(root.className).toBe('form-group');
    expect(root.querySelector(':scope > .form-tit > label')?.getAttribute('for')).toBe(
      'account-select',
    );
    expect(select.parentElement?.className).toBe('form-conts');
    expect(select.className).toBe('krds-form-select consumer-select');
    expect(select.id).toBe('account-select');
    expect(select.name).toBe('account');
    expect(select.title).toBe('Account choice');
    expect(select.value).toBe('second');
    expect(select.hasAttribute('value')).toBe(false);
    expect(select.disabled).toBe(false);
    expect(select.required).toBe(true);
    expect(select.options[0].hasAttribute('selected')).toBe(false);
    expect(select.getAttribute('data-consumer')).toBe('select');
    expect(root.getAttribute('data-consumer')).toBeNull();
    expect(select.getAttribute('aria-describedby')).toBe(
      'external-help account-select-hint',
    );
    expect(root.querySelector('#account-select-hint')?.className).toBe('form-hint');
    expect(root.querySelector('#account-select-hint')?.textContent).toBe(
      'Choose an account',
    );
    expect((exposedSelect as SelectExposure | null)?.element).toBe(select);
    expect(new FormData(form).get('account')).toBe('second');

    select.focus();
    expect(focuses).toHaveLength(1);
    expect(focuses[0].target).toBe(select);
    select.value = 'first';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await nextTick();
    expect(selected.value).toBe('first');
    expect(changes).toHaveLength(1);
    expect(changes[0].target).toBe(select);
    expect(new FormData(form).get('account')).toBe('first');

    expect(sorting.parentElement).toBe(form);
    expect(sorting.className).toBe('krds-form-select-sort consumer-sorting');
    expect(sorting.options[0].hasAttribute('selected')).toBe(false);
    expect(sorting.hasAttribute('value')).toBe(false);
    expect(sorting.title).toBe('Sort results');
    expect(host.querySelector('label[for="sorting-select"]')).toBeNull();
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
    const renderedTabs = Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
    const renderedItems = Array.from(
      host.querySelectorAll<HTMLElement>('[role="tablist"] > li'),
    );

    expect(renderedTabs.every((tab) => tab.tagName === 'BUTTON')).toBe(true);
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('false');
    expect(renderedTabs.map((tab) => tab.tabIndex)).toEqual([0, -1]);
    expect(renderedItems[0].classList.contains('active')).toBe(true);
    expect(renderedItems[1].classList.contains('active')).toBe(false);
    expect(renderedItems[1].hasAttribute('class')).toBe(false);

    selected.value = 'second';
    tabs.value = [
      { id: 'first', label: 'First renamed' },
      { id: 'second', label: 'Second renamed' },
    ];
    await nextTick();
    expect(renderedTabs[0].textContent).toContain('First renamed');
    expect(renderedTabs[1].textContent).toContain('Second renamed');
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('false');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(renderedItems[0].classList.contains('active')).toBe(false);
    expect(renderedItems[1].classList.contains('active')).toBe(true);
    expect(renderedItems[0].hasAttribute('class')).toBe(false);

    renderedTabs[0].click();
    await nextTick();
    expect(selected.value).toBe('first');
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('false');
    expect(renderedItems[0].classList.contains('active')).toBe(true);
    expect(renderedItems[1].classList.contains('active')).toBe(false);
    expect(renderedItems[1].hasAttribute('class')).toBe(false);
  });
  it('preserves local language selection while page links keep native navigation', async () => {
    const selected = ref('ko');
    const languages = [
      { value: 'ko', label: '한국어', href: '#ko', lang: 'ko' },
      { value: 'en', label: 'English', href: '#en', lang: 'en' },
    ];
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(LanguageSwitcher, {
              label: '언어 변경',
              selectedLabel: '선택됨',
              languages,
              modelValue: selected.value,
              'onUpdate:modelValue': (value: string) => (selected.value = value),
            }),
            h(LanguageSwitcherPage, {
              label: '언어 변경',
              currentLabel: '현재페이지',
              externalTitle: '새 창 열림',
              languages,
              selected: 'ko',
            }),
          ]);
      },
    });

    await mount(Parent);
    const switcherLink = host.querySelector<HTMLAnchorElement>(
      '.krds-language:not(:last-child) a[lang="en"]',
    )!;
    const selectionEvent = new Event('click', { bubbles: true, cancelable: true });
    switcherLink.dispatchEvent(selectionEvent);
    await nextTick();
    expect(selectionEvent.defaultPrevented).toBe(true);
    expect(selected.value).toBe('en');
    expect(switcherLink.querySelector('.sr-only')?.textContent).toBe('선택됨');

    const pageLinks = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('.krds-language:last-child a'),
    );
    expect(pageLinks).toHaveLength(1);
    expect(pageLinks[0].lang).toBe('en');
    expect(pageLinks[0].target).toBe('_blank');
    expect(pageLinks[0].title).toBe('새 창 열림');
    expect(pageLinks[0].querySelector('.sr-only')?.textContent).toBe('');
    const navigationEvent = new Event('click', { bubbles: true, cancelable: true });
    pageLinks[0].dispatchEvent(navigationEvent);
    await nextTick();
    expect(navigationEvent.defaultPrevented).toBe(false);
  });

  it('preserves the pinned duplicate coach-mark surface class', async () => {
    await mount(() =>
      h(CoachMark, {
        title: '따라하기 가이드',
        stepTitle: '1단계 : 코치 마크',
        description: '1단계 코치 마크 내용입니다.',
        contentTitle: '코치 마크 내용',
        currentStep: '1',
        totalSteps: '4',
      }),
    );

    expect(host.querySelector('.krds-coach-mark')?.getAttribute('class')).toBe(
      'krds-coach-mark txt-box bg-white bg-white',
    );
  });

  it('maps the pagination label prop to its navigation landmark', async () => {
    await mount(() =>
      h(Pagination, {
        current: 4,
        items: [1, 4],
        previousDisabled: true,
        previousLabel: '이전',
        nextLabel: '다음',
        message: '현재페이지',
        navigationLabel: '페이지 이동',
      }),
    );

    const pagination = host.querySelector<HTMLElement>('.krds-pagination')!;
    expect(pagination.getAttribute('role')).toBe('navigation');
    expect(pagination.getAttribute('aria-label')).toBe('페이지 이동');
    expect(pagination.hasAttribute('navigationlabel')).toBe(false);
  });

  it('preserves composite date-input controls and absent-value semantics', async () => {
    await mount(() =>
      h(DateInput, {
        label: '레이블',
        hint: '도움말',
        calendarLabel: '달력',
        years: [2024],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        dayCount: 31,
        leadingDays: 0,
        previousMonthDayCount: 30,
        displayYear: 2024,
        displayMonth: 12,
        selectedYear: 2024,
        selectedMonth: 12,
      }),
    );
    const input = host.querySelector<HTMLInputElement>('.calendar-input input')!;
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('value');
    expect(host.querySelector('.calendar-input .form-btn-datepicker')).not.toBeNull();
    expect(host.querySelector('.form-btn-datepicker .sr-only')?.textContent).toBe('달력 열기');
    const dateGroup = host.querySelector<HTMLElement>('.form-group')!;
    expect(Array.from(dateGroup.children).map((child) => child.className)).toEqual([
      'form-tit',
      'form-conts',
      'form-hint',
    ]);
    expect(
      dateGroup.querySelectorAll(':scope > .form-conts > .form-conts.calendar-conts'),
    ).toHaveLength(1);

    await mount(() => h(TextInput, { label: '텍스트' }));
    expect(host.querySelector('input')).not.toHaveAttribute('value');
  });

  it('gives table row checkboxes unique names without duplicating visible text', async () => {
    await mount(() =>
      h(StructuredListTable, {
        columns: [
          { key: 'selected', label: '선택' },
          { key: 'name', label: '이름' },
        ],
        rows: [
          {
            id: 'service',
            selected: false,
            selectionLabel: '서비스 선택',
            name: '서비스',
          },
          {
            id: 'account',
            selected: false,
            selectionLabel: '계정 선택',
            name: '계정',
          },
        ],
        selectAllLabel: '전체선택',
        caption: '서비스 목록',
      }),
    );

    const masterCheckbox = host.querySelector<HTMLInputElement>('.krds-check-area input')!;
    expect(masterCheckbox.labels?.[0]?.textContent).toBe('전체선택');
    const checkboxes = Array.from(
      host.querySelectorAll<HTMLInputElement>('.krds-table-wrap input[type="checkbox"]'),
    );
    const accessibleNames = checkboxes.map((checkbox) => checkbox.getAttribute('aria-label'));
    expect(accessibleNames).toEqual(['서비스 선택', '계정 선택']);
    expect(new Set(accessibleNames).size).toBe(checkboxes.length);
    expect(checkboxes.map((checkbox) => checkbox.labels?.[0]?.textContent)).toEqual(['', '']);
    expect(host.querySelector('.krds-table-wrap')?.textContent).not.toContain('서비스 선택');
    expect(host.querySelector('.krds-table-wrap')?.textContent).not.toContain('계정 선택');
  });

  it('keeps disclosure semantics and tab panel headings native', async () => {
    await mount(() =>
      h(Disclosure, {
        id: 'details',
        title: '신청 서비스안내',
        items: [{ label: '안내' }],
      }),
    );
    const disclosureButton = host.querySelector<HTMLButtonElement>('.btn-conts-expand')!;
    const disclosurePanel = host.querySelector<HTMLElement>('.expand-wrap')!;
    expect(disclosureButton.id).toBe('details-trigger');
    expect(disclosureButton.getAttribute('aria-controls')).toBe('details');
    expect(disclosurePanel.getAttribute('role')).toBe('region');
    expect(disclosurePanel.getAttribute('aria-labelledby')).toBe(disclosureButton.id);
    disclosureButton.click();
    await nextTick();
    expect(disclosureButton.getAttribute('aria-expanded')).toBe('true');

    await mount(() =>
      h(Tab, {
        tabs: [
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ],
        panels: { first: 'First panel', second: 'Second panel' },
        panelTitle: '탭 영역 타이틀',
      }),
    );
    expect(host.querySelector('.krds-tab-area')?.classList.contains('layer')).toBe(true);
    expect(host.querySelector('.tab.line.full')).not.toBeNull();
    expect(host.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(host.querySelectorAll('.tab-conts h3.sr-only')[0]?.textContent).toBe('탭 영역 타이틀');
  });

  it('renders upstream visual context wrappers around the captured controls', async () => {
    await mount(() =>
      h('div', [
        h(Tag, { label: '태그', removable: true, message: '삭제' }),
        h(TagLink, { label: '태그', href: '#' }),
        h(Spinner, { label: '로딩 중' }),
        h(TextInputIcon, {
          id: 'password',
          label: '레이블',
          type: 'password',
          value: '1234567890',
          placeholder: '8-12자의 영문자, 숫자, 특수문자 조합',
        }),
        h(InPageNavigation, { title: '이 페이지의 구성', items: [] }),
        h(RadioSize, {
          id: 'radio-size',
          label: '사이즈 : medium',
          name: 'rdo-size',
          size: 'medium',
        }),
        h(HelpPanel, { open: true }),
        h(TutorialPanel, { open: true }),
      ]),
    );

    const tagWrappers = Array.from(host.querySelectorAll<HTMLElement>('.krds-tag-wrap'));
    expect(tagWrappers).toHaveLength(2);
    expect(tagWrappers.map((wrapper) => wrapper.className)).toEqual([
      'krds-tag-wrap large',
      'krds-tag-wrap large',
    ]);
    expect(tagWrappers[0].querySelector(':scope > span.krds-btn-tag')).not.toBeNull();
    expect(tagWrappers[1].querySelector(':scope > a.krds-btn-tag.link')).not.toBeNull();
    const spinner = host.querySelector<HTMLElement>('.krds-spinner[role="status"]')!;
    const spinnerWrap = spinner.parentElement!;
    expect(spinnerWrap.className).toBe('form-spinner');
    expect(spinnerWrap.children).toHaveLength(2);
    expect(spinnerWrap.firstElementChild?.matches('input.krds-input')).toBe(true);
    expect(spinnerWrap.lastElementChild).toBe(spinner);
    expect(spinnerWrap.parentElement?.className).toBe('form-conts');
    expect(spinnerWrap.parentElement?.parentElement?.className).toBe('form-group');
    const iconInput = host.querySelector<HTMLInputElement>('#password')!;
    const iconInputGroup = iconInput.closest<HTMLElement>('.form-group')!;
    expect(
      iconInputGroup.querySelector(':scope > .form-tit > label[for="password"]')?.textContent,
    ).toBe('레이블');
    const iconInputButton = iconInputGroup.querySelector<HTMLButtonElement>(
      ':scope > .form-conts.btn-ico-wrap > input#password + button.krds-btn.medium.icon',
    )!;
    expect(iconInputButton.querySelector('.sr-only')?.textContent).toBe(
      '입력한 비밀번호 보기',
    );
    expect(iconInputButton.querySelector('.svg-icon')?.className).toBe(
      'svg-icon ico-pw-visible',
    );
    expect(
      host.querySelector(
        '.krds-in-page-navigation-type > .krds-in-page-navigation-area',
      ),
    ).not.toBeNull();

    const radioArea = host.querySelector<HTMLElement>('.krds-check-area')!;
    expect(Array.from(radioArea.children).map((choice) => choice.className)).toEqual([
      'krds-form-check medium',
      'krds-form-check large',
    ]);
    expect(
      Array.from(radioArea.querySelectorAll('label')).map((label) => label.textContent),
    ).toEqual(['사이즈 : medium', '사이즈 : large']);
    expect(
      host.querySelectorAll(
        '.krds-help-panel.expand > .help-panel-wrap > .help-conts-area',
      ),
    ).toHaveLength(2);
  });

  it('preserves literal separators at inline text and icon boundaries', async () => {
    await mount(() =>
      h('div', [
        h(Tooltip, { label: 'tooltip-horizontal', message: '툴팁 설명' }),
        h(LanguageSwitcher, { label: '언어 변경', languages: [] }),
        h(Link, { label: '기본 링크', href: '#', external: true }),
        h(Tts, { text: '레이블' }),
      ]),
    );

    const tooltip = host.querySelector<HTMLButtonElement>('button.krds-tooltip')!;
    const language = host.querySelector<HTMLButtonElement>('.krds-language > .drop-btn')!;
    const link = host.querySelector<HTMLAnchorElement>('a.krds-btn.link')!;
    const tts = host.querySelector<HTMLButtonElement>('button.krds-tts')!;
    expect(tooltip.textContent).toBe('tooltip-horizontal ');
    expect(tooltip.lastElementChild?.className).toBe('svg-icon ico-angle right');
    expect(language.textContent).toBe(' 언어 변경 ');
    expect(language.firstElementChild?.className).toBe('svg-icon ico-global');
    expect(language.lastElementChild?.className).toBe('svg-icon ico-toggle');
    expect(link.textContent).toBe('기본 링크 ');
    expect(link.lastElementChild?.className).toBe('svg-icon ico-go');
    expect(tts.textContent).toBe(' 레이블');
    expect(tts.firstElementChild?.className).toBe('krds-tts-icon');
    expect(tts.lastElementChild?.className).toBe('krds-tts-text');
  });

  it('preserves one collapsed space at every assigned inline icon and label boundary', async () => {
    await mount(() =>
      h('div', [
        h(CriticalAlerts, {
          items: [
            {
              id: 'danger',
              badge: 'danger',
              tone: 'danger',
              text: '긴급 공지',
              href: '#',
              linkLabel: '자세히 보기',
            },
          ],
        }),
        h(FileUpload, {
          files: [
            {
              id: 'delete',
              name: '삭제할 파일',
              status: 'deletable',
              deleteLabel: '삭제',
            },
            {
              id: 'download',
              name: '다운로드할 파일',
              status: 'downloadable',
              downloadLabel: '다운로드',
              previewLabel: '바로보기',
            },
          ],
        }),
        h(Footer, {
          links: [{ id: 'directions', label: '찾아오시는 길', href: '#' }],
        }),
        h(Header, {
          utilityItems: [
            { id: 'external', kind: 'link', label: '외부 메뉴', href: '#' },
            { id: 'dropdown', kind: 'dropdown', label: '드롭다운 메뉴', items: [] },
            {
              id: 'resize',
              kind: 'resize',
              label: '화면크기',
              items: [],
              resetLabel: '초기화',
            },
          ],
          myMenu: {
            label: '나의 GOV',
            userName: '홍길동님',
            timeLabel: '로그아웃까지 남은 시간',
            time: '12:00',
            extendLabel: '시간 연장',
            items: [],
            logoutLabel: '로그아웃',
          },
        }),
        h(HelpPanel, {
          open: true,
          label: '도움말',
          collapseLabel: '접어두기',
          activeTab: 'help',
          tabs: [{ id: 'help-tab', value: 'help', label: '도움' }],
          helpTitle: '전자문서지갑',
          downloadLinks: [{ label: '애플리케이션 다운로드', href: '#' }],
          relatedGroups: [
            { title: '관련 서비스', links: [{ label: '주민등록표등본', href: '#' }] },
            {
              title: '기타 문의',
              links: [{ label: '문의 전화 번호 찾기', href: '#', icon: 'call' }],
            },
          ],
        }),
        h(Resize, {
          label: '화면크기',
          resetLabel: '초기화',
          options: [],
        }),
        h(InPageNavigation, {
          title: '이 페이지의 구성',
          items: [],
          actionLabel: '신청',
          actionInfo: '신청 가능',
          actionCount: '10건',
        }),
        h(StructuredList, {
          items: [{ id: 'one', title: '타이틀', href: '#' }],
          shareLabel: '공유하기',
          favoriteLabel: '찜하기',
        }),
        h(StructuredListTable, {
          actions: [{ id: 'download', label: '다운로드', icon: 'down' }],
          columns: [{ key: 'download', label: '파일' }],
          rows: [{ id: 'one', download: '파일 받기' }],
          caption: '파일 목록',
        }),
      ]),
    );

    expect(
      host.querySelector('.krds-critical-alerts a.krds-btn.link')?.textContent,
    ).toBe('자세히 보기 ');
    expect(
      Array.from(host.querySelectorAll('.krds-file-upload .upload-list button')).map(
        (button) => button.textContent,
      ),
    ).toEqual(['삭제 ', '다운로드 ', '바로보기 ']);
    expect(host.querySelector('footer .link-go a')?.textContent).toBe(
      '찾아오시는 길 ',
    );

    const header = host.querySelector<HTMLElement>('header')!;
    const utilityItems = Array.from(
      header.querySelectorAll<HTMLElement>('.utility-list > li'),
    );
    expect(utilityItems[0].querySelector('a')?.firstChild?.nodeValue).toBe('외부 메뉴 ');
    expect(utilityItems[1].querySelector('.drop-btn')?.firstChild?.nodeValue).toBe(
      '드롭다운 메뉴 ',
    );
    expect(utilityItems[2].querySelector('.drop-btn')?.firstChild?.nodeValue).toBe(
      '화면크기 ',
    );
    expect(utilityItems[2].querySelector('.drop-bottom button')?.textContent).toBe(
      ' 초기화',
    );
    expect(header.querySelector('.my-drop .drop-bottom button')?.textContent).toBe(
      ' 로그아웃',
    );

    const helpPanel = host.querySelector<HTMLElement>('.krds-help-panel')!;
    expect(helpPanel.querySelector('.help-conts .help-title')?.textContent).toBe(
      '전자문서지갑 도움말',
    );
    expect(helpPanel.querySelector('.help-conts .help-title')?.firstChild?.nodeValue).toBe(
      '전자문서지갑 ',
    );
    expect(
      helpPanel.querySelector('.help-conts .link-list a')?.firstChild?.nodeValue,
    ).toBe('애플리케이션 다운로드 ');
    expect(
      Array.from(helpPanel.querySelectorAll('.related-service .link-list a')).map(
        (link) =>
          Array.from(link.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim(),
          )?.nodeValue,
      ),
    ).toEqual(['주민등록표등본 ', ' 문의 전화 번호 찾기']);
    const collapse = helpPanel.querySelector('.btn-help-panel.fold')!;
    expect(collapse.childNodes[1]?.nodeValue).toBe(' 접어두기 ');
    expect(collapse.textContent).toBe('도움말 접어두기 ');

    const resize = host.querySelector<HTMLElement>('[data-adjust="scale"]')!;
    expect(resize.querySelector('.drop-btn')?.textContent).toBe('화면크기 ');
    expect(resize.querySelector('.drop-bottom button')?.textContent).toBe(
      ' 초기화',
    );
    expect(host.querySelector('.quick-info')?.textContent).toBe('신청 가능 10건');
    expect(
      Array.from(host.querySelectorAll('.krds-structured-list .card-btn button')).map(
        (button) => button.textContent,
      ),
    ).toEqual([' 공유하기', ' 찜하기']);
    expect(
      host.querySelector('.krds-structured-list-table .side-line-ul button')
        ?.textContent,
    ).toBe(' 다운로드');
    expect(
      host.querySelector('.krds-structured-list-table tbody button')?.textContent,
    ).toBe(' 파일 받기');
  });

  it('retains evidence-backed critical alert, upload, structured-list, and modal nodes', async () => {
    await mount(() =>
      h('div', [
        h(CriticalAlerts, {
          items: [
            {
              id: 'danger',
              badge: 'danger',
              badgeLabel: '긴급',
              tone: 'danger',
              text: '긴급 공지',
            },
          ],
        }),
        h(FileUpload, {
          inputId: 'file-upload',
          selectLabel: '파일선택',
          currentCount: 3,
          maxCount: 10,
          countSuffix: '개',
        }),
        h(StructuredList, {
          items: [
            {
              id: 'one',
              title: '타이틀',
              href: '#',
              badge: '뱃지',
              badgeClass: 'bg-light-primary',
            },
          ],
          shareLabel: '공유하기',
          favoriteLabel: '찜하기',
        }),
        h(Modal, {
          title: '모달 제목',
          items: ['첫째', '둘째'],
          cancelLabel: '아니요',
          confirmLabel: '예',
          closeLabel: '닫기',
        }),
      ]),
    );

    const alerts = host.querySelector<HTMLElement>('.krds-critical-alerts')!;
    expect(alerts.tagName).toBe('UL');
    expect(alerts.querySelector(':scope > ul')).toBeNull();
    expect(alerts.parentElement?.className).toBe('main-urgent-wrap');
    expect(alerts.parentElement?.getAttribute('role')).toBe('alert');
    const upload = host.querySelector<HTMLElement>('.krds-file-upload')!;
    expect(upload).not.toHaveAttribute('countsuffix');
    const uploadInput = upload.querySelector<HTMLInputElement>('input[type="file"]')!;
    const uploadButton = upload.querySelector<HTMLButtonElement>('.file-upload-btn-wrap > button')!;
    expect(uploadButton.previousElementSibling).toBe(uploadInput);
    expect(uploadButton.className).toBe('krds-btn medium');
    let uploadInputClicks = 0;
    uploadInput.addEventListener('click', () => uploadInputClicks++);
    uploadButton.click();
    expect(uploadInputClicks).toBe(1);
    expect(upload.querySelector('.file-list > .total')?.textContent).toBe('3개 / 10개');
    expect(
      host.querySelector('.krds-structured-list .krds-badge.bg-light-primary'),
    ).not.toBeNull();
    expect(
      Array.from(host.querySelectorAll('.krds-structured-list .card-btn button')).map(
        (button) => button.textContent,
      ),
    ).toEqual([' 공유하기', ' 찜하기']);
    const modalContent = host.querySelector<HTMLElement>(
      '.krds-modal > .modal-dialog > .modal-content',
    )!;
    expect(modalContent).not.toBeNull();
    expect(
      Array.from(modalContent.querySelector('.modal-conts > .conts-area')!.childNodes).map(
        (node) => node.nodeName,
      ),
    ).toEqual(['#text', 'BR', '#text']);
  });
  it('skips initial-open modal autofocus but focuses and restores on later transitions', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const modalOpen = ref(true);
    const Parent = defineComponent({
      setup() {
        return () =>
          h(Modal, {
            open: modalOpen.value,
            title: '모달 제목',
            cancelLabel: '아니요',
            confirmLabel: '예',
            closeLabel: '닫기',
          });
      },
    });

    try {
      await mount(Parent);
      expect(document.activeElement).toBe(opener);

      modalOpen.value = false;
      await nextTick();
      opener.focus();
      modalOpen.value = true;
      await nextTick();
      await nextTick();
      const firstFocusable = host.querySelector<HTMLElement>(
        '.krds-modal button, .krds-modal [href], .krds-modal input',
      )!;
      expect(document.activeElement).toBe(firstFocusable);

      modalOpen.value = false;
      await nextTick();
      expect(document.activeElement).toBe(opener);
    } finally {
      opener.remove();
    }
  });

  it('adds the standalone mobile menu sample class only when requested', async () => {
    await mount(() =>
      h('div', [
        h(MainMenuMobile, { id: 'regular-mobile-menu', sample: false }),
        h(MainMenuMobile, {
          id: 'sample-mobile-menu',
          sample: true,
          loginLabel: '로그인',
          bottomItems: [{ label: '메뉴', href: '#' }],
        }),
      ]),
    );

    expect(host.querySelector('#regular-mobile-menu')?.getAttribute('class')).toBe(
      'krds-main-menu-mobile',
    );
    expect(host.querySelector('#sample-mobile-menu')?.getAttribute('class')).toBe(
      'krds-main-menu-mobile sample',
    );
    const sampleMobile = host.querySelector<HTMLElement>('#sample-mobile-menu')!;
    expect(sampleMobile.querySelector('.gnb-login button')?.textContent).toBe(' 로그인');
    expect(sampleMobile.querySelector('.gnb-bottom a')?.textContent).toBe('메뉴 ');
    expect(sampleMobile.querySelector('#close-nav')).not.toBeNull();
  });

});
