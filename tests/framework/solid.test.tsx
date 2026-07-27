import { render } from 'solid-js/web';
import { createSignal, type JSX } from 'solid-js';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Accordion,
  Calendar,
  CalendarRange,
  Checkbox,
  ContextualHelp,
  DateInput,
  CriticalAlerts,
  Disclosure,
  Header,
  HelpPanel,
  LanguageSwitcher,
  MainMenuMobile,
  Resize,
  Select,
  StructuredListTable,
  Tab,
  TextInput,
  TextList,
  TutorialPanel,
} from '@krds-community/solid';

let dispose: (() => void) | undefined;
let host: HTMLDivElement;

function mount(view: () => JSX.Element) {
  host = document.createElement('div');
  document.body.append(host);
  dispose = render(view, host);
}

afterEach(() => {
  dispose?.();
  dispose = undefined;
  host?.remove();
});

describe('Solid core component contracts', () => {
  it('tracks signal props after mount and serializes native form state', async () => {
    const [value, setValue] = createSignal('one');
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    const [submitted, setSubmitted] = createSignal('');

    mount(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(new FormData(event.currentTarget).get('query')?.toString() ?? '');
        }}
      >
        <TextInput
          id="query"
          name="query"
          label="Query"
          hint="Required"
          state="error"
          value={value()}
        />
        <Checkbox
          id="accepted"
          name="accepted"
          label="Accept"
          checked={checked()}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled()}
        />
        <output data-testid="count">{value().length}</output>
        <output data-testid="submitted">{submitted()}</output>
        <button
          type="button"
          onClick={() => {
            setValue('updated');
            setDisabled(true);
          }}
        >
          Parent update
        </button>
        <button type="submit">Submit</button>
      </form>
    ));

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

    checkbox.click();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(host.querySelector('form')!).get('accepted')).toBe('on');

    setValue('user input');
    expect(input.value).toBe('user input');
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('10');

    update.click();
    expect(input.value).toBe('updated');
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe('7');

    host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe('updated');
  });

  it('keeps accordion expanded state and derived item content reactive', () => {
    const [items, setItems] = createSignal([
      { id: 'first', title: 'First', content: 'First content' },
      { id: 'second', title: 'Second', content: 'Second content' },
    ]);

    mount(() => <Accordion items={items()} defaultOpen={['first']} />);
    const firstTrigger = () => host.querySelector<HTMLButtonElement>('button[aria-controls]')!;
    const firstPanel = () => host.querySelector<HTMLElement>('[role="region"]')!;

    expect(firstTrigger().getAttribute('aria-expanded')).toBe('true');
    expect(firstPanel().hidden).toBe(false);
    expect(firstPanel().textContent).toBe('First content');

    firstTrigger().click();
    expect(firstTrigger().getAttribute('aria-expanded')).toBe('false');
    expect(firstPanel().hidden).toBe(true);

    setItems([
      { id: 'first', title: 'Renamed', content: 'Updated content' },
      { id: 'second', title: 'Second', content: 'Second content' },
    ]);
    expect(firstTrigger().textContent).toBe('Renamed');
    expect(firstPanel().textContent).toBe('Updated content');
    expect(firstTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps spread props live instead of snapshotting destructured core and additional values', () => {
    const [fieldProps, setFieldProps] = createSignal({
      id: 'spread-query',
      name: 'spread-query',
      label: 'Before label',
      hint: 'Before hint',
      state: 'default' as 'default' | 'error',
      value: 'before',
      disabled: false,
    });
    const [tabProps, setTabProps] = createSignal({
      id: 'reactive-tabs',
      tabs: [
        { id: 'first', label: 'First' },
        { id: 'second', label: 'Second' },
      ],
      modelValue: 'first',
      message: 'selected',
    });
    const changes: string[] = [];
    const selectFirst = () => {
      changes.push('first');
      setTabProps((current) => ({ ...current, modelValue: 'first' }));
    };

    mount(() => (
      <section>
        <TextInput {...fieldProps()} />
        <Tab {...tabProps()} onChange={selectFirst} />
      </section>
    ));

    const input = host.querySelector<HTMLInputElement>('#spread-query')!;
    const tabs = () => Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
    expect(input.value).toBe('before');
    expect(input.disabled).toBe(false);
    expect(host.querySelector('label[for="spread-query"]')?.textContent).toBe('Before label');
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('false');

    setFieldProps((current) => ({
      ...current,
      label: 'After label',
      hint: 'After hint',
      state: 'error',
      value: 'after',
      disabled: true,
    }));
    setTabProps((current) => ({
      ...current,
      tabs: [
        { id: 'first', label: 'First renamed' },
        { id: 'second', label: 'Second renamed' },
      ],
      modelValue: 'second',
      message: 'selected now',
    }));

    expect(input.value).toBe('after');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(host.querySelector('label[for="spread-query"]')?.textContent).toBe('After label');
    expect(host.querySelector('#spread-query-hint')?.textContent).toBe('After hint');
    expect(tabs().map((tab) => tab.textContent)).toEqual([
      'First renamed',
      'Second renamedselected now',
    ]);
    expect(tabs()[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');

    (tabs()[0] as HTMLButtonElement).click();
    expect(changes).toEqual(['first']);
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
  });
  it('keeps critical alerts as alert regions with native list descendants', () => {
    mount(() => (
      <CriticalAlerts
        id="critical-alerts"
        items={[
          {
            id: 'critical',
            title: '서비스 점검 안내',
            badge: 'danger',
            badgeLabel: '긴급',
            href: '#critical',
            linkLabel: '자세히 보기',
          },
        ]}
      />
    ));

    const region = host.querySelector<HTMLElement>('.krds-critical-alerts')!;
    expect(region.getAttribute('role')).toBe('alert');
    expect(region.tagName).toBe('DIV');
    expect(region.querySelector(':scope > ul')).not.toBeNull();
    expect(region.querySelectorAll(':scope > ul > li[role]')).toHaveLength(0);
    expect(region.querySelector('a[href="#critical"]')?.textContent).toContain('자세히 보기');
  });
  it('exposes native tab controls and linked panels without nested interactive roles', () => {
    mount(() => (
      <Tab
        id="tabs"
        tabs={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        panels={{ first: 'First panel', second: 'Second panel' }}
        selected="first"
        panelTitle="Tab panel"
        message="selected"
      />
    ));

    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === 'BUTTON')).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(host.querySelectorAll('li[role="none"]')).toHaveLength(2);
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].tabIndex).toBe(-1);

    for (const tab of tabs) {
      const panelId = tab.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      const panel = host.querySelector<HTMLElement>(`#${panelId}`)!;
      expect(panel.getAttribute('role')).toBe('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    expect(host.querySelector('#panel-first')?.textContent).toContain('First panel');
  });
  it('updates TextList DOM when its reactive item array is replaced', () => {
    const [items, setItems] = createSignal(['Before']);
    mount(() => <TextList items={items()} />);

    expect(
      Array.from(host.querySelectorAll('ul[role="list"] li')).map((item) => item.textContent),
    ).toEqual(['Before']);

    setItems(['After', 'Added']);

    expect(
      Array.from(host.querySelectorAll('ul[role="list"] li')).map((item) => item.textContent),
    ).toEqual(['After', 'Added']);
  });
  it('forwards the public ref callback while controlled values update the same input', () => {
    let forwarded: HTMLInputElement | undefined;
    const [value, setValue] = createSignal('before');

    mount(() => (
      <TextInput
        id="ref-query"
        label="Query"
        value={value()}
        ref={(element) => {
          forwarded = element;
        }}
      />
    ));

    const input = host.querySelector<HTMLInputElement>('#ref-query')!;
    expect(forwarded).toBe(input);
    expect(input.value).toBe('before');

    setValue('after');

    expect(forwarded).toBe(input);
    expect(input.value).toBe('after');
  });


  it('lets uncontrolled native input state stay local while controlled state follows the parent', () => {
    const [checked, setChecked] = createSignal(false);
    mount(() => (
      <form>
        <Checkbox id="uncontrolled" label="Uncontrolled" checked={undefined} />
        <Checkbox
          id="controlled"
          label="Controlled"
          checked={checked()}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      </form>
    ));
    const uncontrolled = host.querySelector<HTMLInputElement>('#uncontrolled')!;
    const controlled = host.querySelector<HTMLInputElement>('#controlled')!;

    expect(uncontrolled.checked).toBe(false);
    expect(controlled.checked).toBe(false);
    uncontrolled.click();
    expect(uncontrolled.checked).toBe(true);
    controlled.click();
    expect(checked()).toBe(true);
    expect(controlled.checked).toBe(true);
  });
  it('relates expanded controls and labels their inventory inputs', () => {
    mount(() => (
      <div>
        <ContextualHelp
          id="help"
          open
          label="도움말"
          title="도움말 제목"
          description="도움말 내용"
          closeLabel="닫기"
        />
        <LanguageSwitcher
          id="language"
          open
          label="언어 변경"
          options={[{ value: 'ko', label: '한국어' }]}
        />
        <Resize
          id="resize"
          open
          label="화면 크기"
          options={[{ value: 'md', label: '보통' }]}
        />
        <Header
          id="header"
          utilityItems={[{ id: 'utility', kind: 'dropdown', label: '이용 안내', items: [] }]}
          myMenu={{
            label: '내 메뉴',
            userName: '사용자',
            timeLabel: '시간',
            time: '10:00',
            extendLabel: '연장',
            items: [],
            logoutLabel: '로그아웃',
          }}
        />
        <MainMenuMobile
          id="mobile"
          open
          searchPlaceholder="메뉴 검색"
          searchTitle="메뉴 검색"
          searchLabel="검색"
          utilityItems={[]}
          serviceItems={[]}
          items={[]}
        />
        <Select
          id="select"
          label="정렬 기준"
          title="정렬"
          options={[{ value: 'recent', label: '최신순' }]}
        />
        <StructuredListTable
          id="table"
          selectAllLabel="전체 선택"
          countLabel="표시 개수"
          countOptions={['10개']}
          sortLabel="정렬 기준"
          sortOptions={['최신순']}
          caption="게시물 목록"
          columns={[
            { key: 'selected', label: '선택' },
            { key: 'title', label: '제목' },
          ]}
          rows={[{ id: '1', selected: false, title: '첫 번째 행' }]}
        />
      </div>
    ));

    for (const control of Array.from(host.querySelectorAll<HTMLElement>('[aria-expanded]'))) {
      const targetId = control.getAttribute('aria-controls');
      expect(targetId).toBeTruthy();
      expect(host.querySelector(`[id="${targetId}"]`)).not.toBeNull();
    }
    expect(host.querySelector('input[title="메뉴 검색"]')?.getAttribute('aria-label')).toBe('검색');
    expect(host.querySelector<HTMLSelectElement>('#select')?.getAttribute('aria-label')).toBe(
      '정렬 기준',
    );
    expect(host.querySelector('label[for="table-row-1"]')?.textContent).toContain(
      '게시물 목록 1 선택',
    );
  });
  it('derives calendar vectors while preserving display and selected values', () => {
    mount(() => (
      <div>
        <Calendar
          id="calendar"
          displayYear={2024}
          displayMonth={12}
          selectedYear={2002}
          selectedMonth={2}
          years={[2001, 2002]}
          disabledYears={[2001]}
          disabledMonths={[2]}
          leadingDays={5}
          previousMonthDayCount={30}
          dayCount={31}
          rangeStartDay={7}
          rangeEndDay={7}
          todayDay={30}
          eventDays={[8]}
          disabledDays={[13]}
          calendarLabel="달력"
          previousLabel="이전 달"
          nextLabel="다음 달"
          yearSelectLabel="연도 선택"
          monthSelectLabel="월 선택"
          todayLabel="오늘"
          eventLabel="일정있음"
          weekdays={['일', '월', '화', '수', '목', '금', '토']}
        />
        <CalendarRange id="range" displayYear={2024} displayMonth={12} />
        <DateInput id="date" label="날짜" hint="도움말" calendarLabel="달력" />
      </div>
    ));

    const calendar = host.querySelector<HTMLElement>('.krds-calendar-area')!;
    expect(calendar.hasAttribute('displayyear')).toBe(false);
    expect(calendar.querySelector<HTMLButtonElement>('.btn-cal-switch.year')?.textContent).toBe(
      '2024년',
    );
    expect(
      calendar.querySelector<HTMLButtonElement>('.calendar-year-wrap button.active')?.textContent,
    ).toBe('2002년');
    expect(
      calendar.querySelector<HTMLButtonElement>('.calendar-mon-wrap button.active')?.textContent,
    ).toBe('02월');
    expect(calendar.querySelector('[data-date="2024.12.07"]')?.className).toContain('period');
    expect(
      calendar.querySelector<HTMLButtonElement>('[data-date="2024.12.08"] button')?.getAttribute(
        'aria-label',
      ),
    ).toBe('8 일정있음');
    expect(host.querySelectorAll('.calendar-wrap:not(.single)')).toHaveLength(2);
    expect(host.querySelector<HTMLLabelElement>('label[for="date"]')?.textContent).toBe('날짜');
    expect(host.querySelector<HTMLInputElement>('#date')?.type).toBe('number');
    expect(host.querySelector('.form-group .form-hint')?.textContent).toBe('도움말');
  });

  it('keeps disclosure and help surfaces linked to native controls', () => {
    mount(() => (
      <div>
        <Disclosure id="disclosure" title="상세 보기" description="상세 내용" />
        <HelpPanel
          id="help-panel"
          tabs={[{ id: 'help-tab', label: '도움', panelId: 'help-panel-content' }]}
          activeTab="help"
          helpTitle="도움말"
          helpDescription="도움말 내용"
          tutorialBackTitle="이전으로"
        />
        <TutorialPanel
          id="tutorial-panel"
          tabs={[{ id: 'tutorial-tab', label: '따라하기', panelId: 'tutorial-content' }]}
          activeTab="tutorial"
          tutorialTitle="따라하기"
          tutorialBackTitle="이전으로"
          tasks={[]}
        />
      </div>
    ));

    const trigger = host.querySelector<HTMLButtonElement>('#disclosure-trigger')!;
    const panel = host.querySelector<HTMLElement>('#disclosure-content')!;
    expect(trigger.getAttribute('aria-controls')).toBe('disclosure-content');
    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.getAttribute('aria-labelledby')).toBe('disclosure-trigger');
    expect(host.querySelector('.help-panel-wrap')?.getAttribute('tabindex')).toBe('0');
    expect(host.querySelector('.krds-help-panel')?.hasAttribute('tutorialbacktitle')).toBe(false);
  });
});
