import {
  act,
  createElement,
  createRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Accordion,
  Button,
  Checkbox,
  Switch,
  TextInput,
} from '../../packages/react/src/components.tsx';
import {
  Calendar,
  ContextualHelp,
  CriticalAlerts,
  DateInput,
  Header,
  LanguageSwitcher,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Pagination,
  Resize,
  SkipLink,
  StructuredListTable,
  Tab,
  TextList,
  Tooltip,
  Tts,
  HelpPanel,
} from '../../packages/react/src/additional.tsx';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const h = createElement;
let root: Root | undefined;
let host: HTMLDivElement;

function render(node: ReactNode) {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  return act(async () => {
    root?.render(node);
  });
}

afterEach(() => {
  if (root) {
    act(() => root?.unmount());
    root = undefined;
  }
  host?.remove();
});

describe('React core component contracts', () => {
  it('keeps parent-controlled values, native state, derived count, and form data reactive', async () => {
    function FormHarness() {
      const [value, setValue] = useState('one');
      const [checked, setChecked] = useState(false);
      const [disabled, setDisabled] = useState(false);
      const [submitted, setSubmitted] = useState('');
      const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).get('query')?.toString() ?? '');
      };

      return h(
        'form',
        { onSubmit: submit },
        h(TextInput, {
          id: 'query',
          name: 'query',
          label: 'Query',
          hint: 'Required',
          value,
          onChange: (event) => setValue(event.currentTarget.value),
          'aria-label': 'Query input',
        }),
        h(Checkbox, {
          id: 'accepted',
          name: 'accepted',
          label: 'Accept',
          checked,
          onChange: (event) => setChecked(event.currentTarget.checked),
          disabled,
        }),
        h('output', { 'data-testid': 'count' }, value.length),
        h('output', { 'data-testid': 'submitted' }, submitted),
        h(
          Button,
          {
            type: 'button',
            onClick: () => {
              setValue('updated');
              setDisabled(true);
            },
          },
          'Parent update',
        ),
        h('button', { type: 'submit' }, 'Submit'),
      );
    }

    await render(h(FormHarness));
    const input = host.querySelector<HTMLInputElement>('#query')!;
    const checkbox = host.querySelector<HTMLInputElement>('#accepted')!;
    const update = Array.from(host.querySelectorAll('button')).find((button) => button.textContent === 'Parent update')!;

    expect(input.value).toBe('one');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('3');
    expect(new FormData(host.querySelector('form')!).get('query')).toBe('one');
    expect(new FormData(host.querySelector('form')!).has('accepted')).toBe(false);

    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'user input');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      checkbox.click();
    });
    expect(input.value).toBe('user input');
    expect(checkbox.checked).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('10');
    expect(new FormData(host.querySelector('form')!).get('query')).toBe('user input');
    expect(new FormData(host.querySelector('form')!).get('accepted')).toBe('on');

    await act(async () => update.click());
    expect(input.value).toBe('updated');
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('7');

    await act(async () => host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe('updated');
  });

  it('preserves ARIA state and native event/ref composition across rerenders', async () => {
    const ref = createRef<HTMLButtonElement>();
    const events: string[] = [];
    function Harness() {
      const [state, setState] = useState<'default' | 'error'>('error');
      return h(
        'section',
        null,
        h(TextInput, {
          id: 'invalid-input',
          label: 'Invalid field',
          hint: 'Explain the error',
          state,
          onBlur: () => events.push('blur'),
        }),
        h(
          Button,
          {
            ref,
            onClick: () => {
              events.push('click');
              setState('default');
            },
          },
          'clear error',
        ),
        h(Accordion, {
          items: [
            { id: 'first', title: 'First', content: 'First content' },
            { id: 'second', title: 'Second', content: 'Second content' },
          ],
          defaultOpen: ['first'],
        }),
      );
    }

    await render(h(Harness));
    const invalidInput = host.querySelector<HTMLInputElement>('#invalid-input')!;
    const firstPanel = host.querySelector<HTMLElement>('[role="region"]')!;
    const firstTrigger = host.querySelector<HTMLButtonElement>(
      `button[aria-controls="${firstPanel.id}"]`,
    )!;
    const clearError = Array.from(host.querySelectorAll('button')).find((button) => button.textContent === 'clear error')!;

    expect(invalidInput.getAttribute('aria-invalid')).toBe('true');
    expect(invalidInput.getAttribute('aria-describedby')).toBe('invalid-input-hint');
    expect(firstTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(firstPanel.hidden).toBe(false);
    expect(ref.current).toBe(clearError);

    await act(async () => {
      invalidInput.focus();
      invalidInput.blur();
      clearError.click();
      firstTrigger.click();
    });
    expect(events).toEqual(['blur', 'click']);
    expect(invalidInput.getAttribute('aria-invalid')).toBe(null);
    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(firstPanel.hidden).toBe(true);
  });

  it('keeps uncontrolled ownership with native defaults while controlled ownership follows parent state', async () => {
    await render(
      h(
        'form',
        null,
        h(Checkbox, { id: 'uncontrolled', label: 'Uncontrolled', defaultChecked: true, name: 'uncontrolled' }),
        h(Switch, { id: 'controlled-switch', label: 'Controlled', checked: false, name: 'controlled' }),
      ),
    );
    const uncontrolled = host.querySelector<HTMLInputElement>('#uncontrolled')!;
    const controlled = host.querySelector<HTMLInputElement>('#controlled-switch')!;

    expect(uncontrolled.checked).toBe(true);
    expect(controlled.checked).toBe(false);
    await act(async () => uncontrolled.click());
    expect(uncontrolled.checked).toBe(false);
    await act(async () => controlled.click());
    expect(controlled.checked).toBe(false);
  });
  it('keeps additional tabs reactive to external and interaction-driven parent updates', async () => {
    const changes: string[] = [];
    function Harness() {
      const [selected, setSelected] = useState('first');
      const [updated, setUpdated] = useState(false);
      const tabs = updated
        ? [
            { id: 'first', label: 'First renamed' },
            { id: 'second', label: 'Second renamed' },
          ]
        : [
            { id: 'first', label: 'First' },
            { id: 'second', label: 'Second' },
          ];
      const panels = updated
        ? { first: 'First panel updated', second: 'Second panel updated' }
        : { first: 'First panel', second: 'Second panel' };

      return h(
        'section',
        null,
        h(Tab, {
          tabs,
          panels,
          selected,
          onTabChange: (next) => {
            changes.push(next);
            setSelected(next);
          },
        }),
        h(
          'button',
          {
            type: 'button',
            onClick: () => {
              setSelected('second');
              setUpdated(true);
            },
          },
          'Parent tab update',
        ),
      );
    }

    await render(h(Harness));
    const tabs = () => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const parentUpdate = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent === 'Parent tab update',
    )!;
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs().every((tab) => tab.tagName === 'BUTTON')).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);

    await act(async () => parentUpdate.click());
    expect(tabs().map((tab) => tab.textContent)).toEqual(['First renamed', 'Second renamed']);
    expect(tabs()[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      'Second panel updated',
    );

    await act(async () => tabs()[0].click());
    expect(changes).toEqual(['first']);
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      'First panel updated',
    );
  });
  it('labels pagination navigation landmarks from the public prop', async () => {
    await render(
      h(Pagination, {
        current: 2,
        navigationLabel: 'Inventory pages',
      }),
    );
    expect(host.querySelector('[role="navigation"]')?.getAttribute('aria-label')).toBe(
      'Inventory pages',
    );
  });
  it('keeps help panel tab roles on focusable controls', async () => {
    await render(
      h(HelpPanel, {
        open: true,
        title: 'Help',
        label: 'Help panel',
        tabs: [
          { id: 'help', value: 'help', label: 'Help', panelId: 'help-panel' },
          { id: 'tutorial', value: 'tutorial', label: 'Tutorial', panelId: 'tutorial-panel' },
        ],
        defaultActiveTab: 'help',
        selectedLabel: 'selected',
        helpTitle: 'How it works',
        helpDescription: 'Follow these steps.',
        collapseLabel: 'Close',
      }),
    );
    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === 'BUTTON')).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    for (const tab of tabs) {
      const panelId = tab.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      expect(panelId ? host.querySelector(`#${panelId}`) : null).not.toBeNull();
    }
  });
  it('connects expanded controls to their panels and labels menus and search', async () => {
    await render(
      h(
        'div',
        null,
        h(ContextualHelp, {
          label: '도움말',
          title: '도움말',
          closeLabel: '닫기',
        }),
        h(LanguageSwitcher, {
          languages: [{ value: 'ko', label: '한국어' }],
          label: '언어 선택',
        }),
        h(Resize, {
          options: [{ value: 'default', label: '기본' }],
          label: '화면 크기',
        }),
        h(Header, {
          logoLabel: '로고',
          logoHref: '#',
          nav: [],
          menuLabel: '주 메뉴',
          utilityItems: [{ id: 'utility', kind: 'dropdown', label: '도구', items: [] }],
          myMenu: {
            label: '내 메뉴',
            userName: '사용자',
            timeLabel: '남은 시간',
            time: '10분',
            extendLabel: '연장',
            logoutLabel: '로그아웃',
            items: [],
          },
        }),
        h(MainMenuPc, { items: [], menuLabel: '보조 메뉴' }),
        h(MainMenuMobile, {
          id: 'mobile-menu',
          items: [],
          searchTitle: '모바일 검색',
          searchLabel: '검색',
        }),
      ),
    );

    const expandedControls = Array.from(
      host.querySelectorAll<HTMLButtonElement>('[aria-expanded]'),
    );
    expect(expandedControls).toHaveLength(5);
    for (const control of expandedControls) {
      const panelId = control.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      expect(panelId ? host.ownerDocument.getElementById(panelId) : null).not.toBeNull();
    }
    expect(host.querySelector('nav.krds-main-menu')?.getAttribute('aria-label')).toBe('주 메뉴');
    expect(host.querySelector('#mobile-menu input')?.getAttribute('aria-label')).toBe('검색');
  });

  it('keeps critical alerts as named alert regions with labeled table selection', async () => {
    await render(
      h(
        'div',
        null,
        h(CriticalAlerts, {
          items: [{ id: 'service', badgeLabel: '긴급', message: '서비스 점검 안내' }],
        }),
        h(StructuredListTable, {
          columns: [
            { key: 'selected', label: '선택' },
            { key: 'name', label: '이름' },
          ],
          rows: [{ id: 'service', selected: false, name: '서비스' }],
          caption: '서비스 목록',
        }),
      ),
    );

    const alert = host.querySelector<HTMLElement>('.krds-critical-alerts')!;
    expect(alert.tagName).toBe('UL');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.querySelector(':scope > li')).not.toBeNull();
    const masterCheckbox = host.querySelector<HTMLInputElement>('.krds-check-area input')!;
    expect(masterCheckbox.labels?.[0]?.textContent).toBe('전체선택');
    const checkbox = host.querySelector<HTMLInputElement>(
      '.krds-table-wrap input[type="checkbox"]',
    )!;
    expect(checkbox.getAttribute('aria-label')).toBeNull();
    const rowLabel = Array.from(host.querySelectorAll('label')).find(
      (label) => label.htmlFor === checkbox.id,
    );
    expect(rowLabel).not.toBeUndefined();
    expect(rowLabel?.textContent).toBe('');
    expect(host.querySelector('td')?.textContent).toContain('서비스');
  });
  it('keeps calendar display values separate from selected options', async () => {
    await render(
      h(Calendar, {
        displayYear: 2024,
        selectedYear: 2002,
        displayMonth: 12,
        selectedMonth: 2,
        years: [2001, 2002, 2024],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      }),
    );

    expect(host.querySelector('.btn-cal-switch.year')?.textContent).toBe('2024년');
    expect(host.querySelector('.sel.year button.active')?.textContent).toBe('2002년');
    expect(host.querySelector('.sel.month button.active')?.textContent).toBe('02월');
    expect(host.querySelector('td[class=""]')).toBeNull();
  });

  it('renders date input controls and hint in the complete form root', async () => {
    await render(
      h(DateInput, {
        label: '레이블',
        hint: '도움말',
        displayYear: 2002,
        selectedYear: 2002,
        displayMonth: 12,
        selectedMonth: 12,
        years: [2001, 2002],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      }),
    );

    expect(host.querySelector('input[placeholder="YYYY.MM.DD"]')).not.toBeNull();
    expect(host.querySelector('.form-btn-datepicker .ico-calendar')).not.toBeNull();
    expect(host.querySelector('.form-hint')?.textContent).toBe('도움말');
  });

  it('does not leak label props and preserves explicit text-list roles', async () => {
    await render(
      h(
        'div',
        null,
        h(Tooltip, { label: '툴팁', message: '설명', children: '도움말' }),
        h(Link, { label: '링크', href: '#' }, '링크'),
        h(SkipLink, { label: '건너뛰기', href: '#main' }, '본문 바로가기'),
        h(Tts, { label: '읽기', text: '읽기' }),
        h(TextList, {
          items: [{ id: 'one', label: '하나', children: [{ id: 'two', label: '둘' }] }],
        }),
      ),
    );

    expect(host.querySelectorAll('[label]')).toHaveLength(0);
    expect(host.querySelector('ul.krds-info-list')?.getAttribute('role')).toBe('list');
    expect(host.querySelectorAll('li[role="listitem"]')).toHaveLength(2);
  });
});
