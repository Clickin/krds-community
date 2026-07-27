import { mount, tick, unmount, type Component } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Accordion from '../../packages/svelte/src/Accordion.svelte';
import Additional from '../../packages/svelte/src/Additional.svelte';
import Checkbox from '../../packages/svelte/src/Checkbox.svelte';
import TextInput from '../../packages/svelte/src/TextInput.svelte';
import ReactiveForm from './fixtures/ReactiveForm.svelte';

let mounted: Record<string, any> | undefined;
let host: HTMLDivElement;

function mountInHost(component: Component<Record<string, unknown>>, props: Record<string, unknown> = {}) {
  if (mounted) unmount(mounted);
  host?.remove();
  host = document.createElement('div');
  document.body.append(host);
  mounted = mount(component, { target: host, props });
}


afterEach(() => {
  if (mounted) unmount(mounted);
  mounted = undefined;
  host?.remove();
});

describe('Svelte core component contracts', () => {
  it('keeps bindable parent state, native form state, derived count, and ARIA state reactive', async () => {
    mountInHost(ReactiveForm);
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
    await tick();
    expect(input.value).toBe('user input');
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('10');
    expect(new FormData(host.querySelector('form')!).get('query')).toBe('user input');

    checkbox.click();
    await tick();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(host.querySelector('form')!).get('accepted')).toBe('on');

    update.click();
    await tick();
    expect(input.value).toBe('updated');
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('7');

    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs[0].textContent).toContain('First tab renamed');
    expect(tabs[1].textContent).toContain('Second tab renamed');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(host.querySelector('[data-testid="selected-tab"]')?.textContent).toBe('second');
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toContain(
      'Second panel updated',
    );

    tabs[0].click();
    await tick();
    expect(host.querySelector('[data-testid="selected-tab"]')?.textContent).toBe('first');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toContain(
      'First panel updated',
    );

    const firstTrigger = host.querySelector<HTMLButtonElement>('#krds-accordion-header-first')!;
    const firstPanel = host.querySelector<HTMLElement>('#krds-accordion-panel-first')!;
    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    firstTrigger.click();
    await tick();
    expect(firstTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(firstPanel.hidden).toBe(false);
    expect(firstPanel.textContent).toBe('Updated content');

    host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await tick();
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe('updated');
  });

  it('supports uncontrolled native ownership and preserves initial value and ARIA state', () => {
    mountInHost(Checkbox, { id: 'uncontrolled', label: 'Uncontrolled' });
    const checkbox = host.querySelector<HTMLInputElement>('#uncontrolled')!;
    expect(checkbox.checked).toBe(false);
    checkbox.click();
    expect(checkbox.checked).toBe(true);

    mountInHost(TextInput, {
      id: 'initial-input',
      value: 'server value',
      label: 'Server field',
      hint: 'Server hint',
      state: 'error',
    });
    const input = host.querySelector<HTMLInputElement>('#initial-input')!;
    expect(input.value).toBe('server value');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('initial-input-hint');
    expect(host.textContent).toContain('Server hint');
  });

  it('keeps uncontrolled accordion state local after user interaction', async () => {
    const items = [
      { id: 'first', title: 'First', content: 'First content' },
      { id: 'second', title: 'Second', content: 'Second content' },
    ];
    const openItems = ['first'];
    mountInHost(Accordion, { items, openItems });
    const trigger = host.querySelector<HTMLButtonElement>('#krds-accordion-header-first')!;
    const panel = host.querySelector<HTMLElement>('#krds-accordion-panel-first')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.textContent).toBe('First content');

    trigger.click();
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
  });
  it('keeps help panel tabs as native tab controls without nested interactive roles', async () => {
    mountInHost(Additional, {
      kind: 'help-panel',
      id: 'svelte-help',
      open: true,
      activeTab: 'help',
      tabs: [
        { id: 'help-tab', label: 'Help', panelId: 'help-panel' },
        { id: 'tutorial-tab', label: 'Tutorial', panelId: 'tutorial-panel' },
      ],
    });
    await tick();

    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === 'BUTTON')).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(host.querySelectorAll('li[role="none"]')).toHaveLength(2);
    expect(host.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby')).toBe('help-tab');
  });
  it('renders structured-list date labels from component props', async () => {
    mountInHost(Additional, {
      kind: 'structured-list',
      dateLabel: '신청 기간',
      dateValue: '2023.00.00-2024.00.00',
      items: [{ title: '타이틀 영역', href: '#' }],
    });
    await tick();

    expect(host.querySelector('.c-date .key')?.textContent).toBe('신청 기간');
    expect(host.querySelector('.c-date .value')?.textContent).toBe('2023.00.00-2024.00.00');
  });

  it('matches native calendar, date-input, disclosure, table, and tab semantics', async () => {
    mountInHost(Additional, {
      kind: 'calendar',
      id: 'calendar-contract',
      displayYear: 2024,
      displayMonth: 12,
      disabledDays: [3],
      dayCount: 31,
    });
    await tick();
    expect(host.querySelector<HTMLButtonElement>('.btn-set-date[disabled]')?.getAttribute('disabled')).toBe('');

    mountInHost(Additional, {
      kind: 'date-input',
      id: 'date-contract',
      label: '레이블',
      hint: '도움말',
      calendarLabel: '달력',
    });
    await tick();
    const dateRoot = host.querySelector<HTMLElement>('.form-group')!;
    expect(dateRoot.querySelector(':scope > .form-conts > .form-conts.calendar-conts')).not.toBeNull();
    expect(dateRoot.querySelector('.form-hint')?.textContent).toBe('도움말');
    expect(dateRoot.querySelector('.form-btn-datepicker')?.textContent).toContain('달력 열기');

    mountInHost(Additional, {
      kind: 'disclosure',
      id: 'disclosure-contract',
      title: '신청 서비스안내',
      open: false,
      items: [{ title: '항목' }],
    });
    await tick();
    const disclosureTrigger = host.querySelector<HTMLButtonElement>('.btn-conts-expand')!;
    const disclosurePanel = host.querySelector<HTMLElement>('.expand-wrap')!;
    expect(disclosureTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(disclosurePanel.getAttribute('role')).toBe('region');
    expect(disclosurePanel.getAttribute('aria-labelledby')).toBe(disclosureTrigger.id);

    mountInHost(Additional, {
      kind: 'structured-list-table',
      id: 'table-contract',
      className: 'sample',
      selectAllLabel: '전체선택',
      actions: [{ label: '핵심버튼', icon: 'down' }],
      countLabel: '목록 표시 개수',
      countOptions: ['10개'],
      sortLabel: '정렬기준',
      sortOptions: ['관련도순'],
      sortValue: '관련도순',
      columns: [
        { key: 'selected', label: '선택' },
        { key: 'title', label: '제목' },
        { key: 'download', label: '다운로드', visuallyHidden: true },
      ],
      rows: [{ selected: false, title: '타이틀 영역', download: '다운로드' }],
      pagination: { current: 1, items: [1], previousDisabled: true, previousLabel: '이전', nextLabel: '다음' },
    });
    await tick();
    const tableRoot = host.querySelector<HTMLElement>('.krds-structured-list-table')!;
    expect(tableRoot.firstElementChild?.classList.contains('search-list-top')).toBe(true);
    expect(tableRoot.querySelector('.krds-table-wrap table')).not.toBeNull();
    expect(tableRoot.querySelector('.krds-pagination')).not.toBeNull();
    expect(tableRoot.hasAttribute('columns')).toBe(false);

    mountInHost(Additional, {
      kind: 'tab',
      id: 'tab-contract',
      panelTitle: '탭 영역 타이틀',
      tabs: [{ id: 'one', label: '탭 1' }, { id: 'two', label: '탭 2' }],
      panels: { one: '탭 1 영역', two: '탭 2 영역' },
      defaultValue: 'one',
    });
    await tick();
    expect(host.querySelector('[role="tabpanel"] h3')?.textContent).toBe('탭 영역 타이틀');
    expect(host.querySelectorAll('button[role="tab"]')).toHaveLength(2);
  });

});
