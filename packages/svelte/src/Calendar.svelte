<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { invoke, reflectValueAttribute } from './lib/shared.js';

  type Props = {
    id?: string;
    name?: string;
    label?: string;
    title?: string;
    description?: string;
    hint?: string;
    placeholder?: string;
    value?: unknown;
    modelValue?: unknown;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    form?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onclick?: (event: Event) => void;
    open?: boolean;
    current?: number;
    displayYear?: number;
    displayMonth?: number;
    selectedYear?: number;
    selectedMonth?: number;
    years?: number[];
    disabledYears?: number[];
    disabledMonths?: number[];
    calendarLabel?: string;
    calendarOpenLabel?: string;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    yearSelectLabel?: string;
    monthSelectLabel?: string;
    dateInputLabel?: string;
    closeLabel?: string;
    clearLabel?: string;
    dateInputClearLabel?: string;
    rangeInputLabel?: string;
    startInputLabel?: string;
    endInputLabel?: string;
    rangeSeparatorLabel?: string;
    dateInputHintLabel?: string;
    yearPrefix?: string;
    yearSuffix?: string;
    monthPrefix?: string;
    monthSuffix?: string;
    inputValue?: string;
    rangeStartValue?: string;
    rangeEndValue?: string;
    kind?: string;
    disabledDays?: number[];
    rangeStartDay?: number;
    rangeEndDay?: number;
    todayDay?: number;
    eventDays?: number[];
    leadingDays?: number;
    dayCount?: number;
    previousMonthDayCount?: number;
    className?: string;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id'>;

  let {
    id = '',
    name = '',
    label = '레이블',
    title = '',
    description = '',
    hint = '',
    placeholder = '',
    value,
    modelValue,
    disabled = false,
    required = false,
    readonly = false,
    form,
    oninput,
    onchange,
    onclick,
    open = false,
    current,
    year,
    month,
    displayYear,
    displayMonth,
    selectedYear,
    selectedMonth,
    years = [],
    disabledYears = [],
    disabledMonths = [],
    weekdays = [],
    calendarLabel = '',
    calendarOpenLabel = '달력 열기',
    previousMonthLabel = '이전 달',
    nextMonthLabel = '다음 달',
    yearSelectLabel = '연도 선택',
    monthSelectLabel = '월 선택',
    dateInputLabel = '',
    closeLabel = '닫기',
    clearLabel = '초기화',
    dateInputClearLabel = '지우기',
    rangeInputLabel = '',
    startInputLabel = '',
    endInputLabel = '',
    rangeSeparatorLabel = '',
    dateInputHintLabel = '',
    yearPrefix = '',
    yearSuffix = '년',
    monthPrefix = '',
    monthSuffix = '월',
    inputValue = '',
    rangeStartValue = '',
    rangeEndValue = '',
    kind = 'calendar',
    single,
    disabledDays = [],
    cancelLabel,
    confirmLabel,
    eventLabel,
    todayLabel,
    selectedLabel,
    rangeStartDay,
    rangeEndDay,
    todayDay,
    eventDays = [],
    leadingDays: leadingDaysProp,
    dayCount: dayCountProp,
    previousMonthDayCount: previousMonthDayCountProp,
    className = '',
    class: classProp = '',
    children,
    ...rest
  }: Props = $props();

  const rootClass = $derived(`${classProp} ${className}`.trim());

  let isOpen = $state(false);
  let yearOpen = $state(false);
  let monthOpen = $state(false);

  const calendarYear = $derived(displayYear ?? year ?? new Date().getFullYear());
  const calendarMonth = $derived(displayMonth ?? month ?? new Date().getMonth() + 1);
  const calendarSelectedYear = $derived(selectedYear ?? year ?? calendarYear);
  const calendarSelectedMonth = $derived(selectedMonth ?? month ?? calendarMonth);
  const calendarYears = $derived(years.length ? years : [calendarYear]);

  const calendarMonths = $derived([
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
  ]);

  const dayCount = $derived(dayCountProp ?? new Date(calendarYear, calendarMonth, 0).getDate());
  const firstDayOfWeek = $derived(new Date(calendarYear, calendarMonth - 1, 1).getDay());
  const leadingDays = $derived(leadingDaysProp ?? firstDayOfWeek);
  const previousMonthDayCount = $derived(
    previousMonthDayCountProp ?? new Date(calendarYear, calendarMonth - 1, 0).getDate(),
  );
  const calendarDays = $derived((() => {
    const cells: Array<{
      day: number;
      isLeading?: boolean;
      isTrailing?: boolean;
      isPeriod?: boolean;
      isStart?: boolean;
      isEnd?: boolean;
      isEvent?: boolean;
      isToday?: boolean;
      isDisabled?: boolean;
      year?: number;
      month?: number;
    }> = [];
    const previousMonth = calendarMonth === 1 ? 12 : calendarMonth - 1;
    const previousYear = calendarMonth === 1 ? calendarYear - 1 : calendarYear;
    const nextMonth = calendarMonth === 12 ? 1 : calendarMonth + 1;
    const nextYear = calendarMonth === 12 ? calendarYear + 1 : calendarYear;
    const currentCell = (day: number) =>
      rangeStartDay !== undefined &&
      rangeEndDay !== undefined &&
      day >= rangeStartDay &&
      day <= rangeEndDay;
    for (let i = 0; i < leadingDays; i++) {
      cells.push({
        day: previousMonthDayCount - leadingDays + i + 1,
        isLeading: true,
        year: previousYear,
        month: previousMonth,
      });
    }
    for (let d = 1; d <= dayCount; d++) {
      const period = currentCell(d);
      cells.push({
        day: d,
        year: calendarYear,
        month: calendarMonth,
        isPeriod: period,
        isStart: period && d === rangeStartDay,
        isEnd: period && d === rangeEndDay,
        isEvent: eventDays.includes(d),
        isToday: d === todayDay,
        isDisabled: disabledDays.includes(d),
      });
    }
    const trailingCount = 42 - cells.length;
    for (let t = 1; t <= trailingCount; t++) {
      cells.push({ day: t, isTrailing: true, year: nextYear, month: nextMonth });
    }
    return cells;
  })());

  let localInputValue = $state('');
  $effect(() => { localInputValue = inputValue || ''; });
  const setInputValue = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    localInputValue = target.value;
  };

  const focusable = (node: HTMLElement) => {
    node.tabIndex = 0;
  };
</script>

{#snippet calendarSurface()}
  <div use:focusable class="bottom calendar-wrap" class:single={kind === 'calendar' && single !== false} aria-label={calendarLabel}>
    <div class="calendar-head">
      <button class="btn-cal-move prev" type="button">
        <span class="sr-only">{previousMonthLabel}</span>
      </button>
      <div class="calendar-switch-wrap">
        <div class="calendar-drop-down">
          <button class="btn-cal-switch year" type="button" role="combobox"
            aria-label={yearSelectLabel} aria-haspopup="listbox"
            aria-expanded={yearOpen} aria-controls={`${id}-year`}
            onclick={() => { yearOpen = !yearOpen; monthOpen = false; }}
          >{calendarYear}{yearSuffix}</button>
          <div class="calendar-select calendar-year-wrap" class:active={yearOpen}>
            <ul class="sel year" id={`${id}-year`} role="listbox">
              {#each (years.length ? years : calendarYears) as optionYear}
                <li role="none">
                  <button type="button" role="option"
                    class:active={optionYear === calendarSelectedYear}
                    aria-selected={optionYear === calendarSelectedYear}
                    disabled={disabledYears.includes(optionYear)}
                  >{optionYear}{yearSuffix}</button>
                </li>
              {/each}
            </ul>
          </div>
        </div>
        <div class="calendar-drop-down">
          <button class="btn-cal-switch month" type="button" role="combobox"
            aria-label={monthSelectLabel} aria-haspopup="listbox"
            aria-expanded={monthOpen} aria-controls={`${id}-month`}
            onclick={() => { monthOpen = !monthOpen; yearOpen = false; }}
          >{calendarMonth.toString().padStart(2, '0')}{monthSuffix}</button>
          <div class="calendar-mon-wrap calendar-select" class:active={monthOpen}>
            <ul class="month sel" id={`${id}-month`} role="listbox">
              {#each calendarMonths as optionMonth}
                <li role="none">
                  <button type="button" role="option"
                    class:active={optionMonth.value === calendarSelectedMonth}
                    aria-selected={optionMonth.value === calendarSelectedMonth}
                    disabled={disabledMonths.includes(optionMonth.value)}
                  >{optionMonth.label}{monthSuffix}</button>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
      <button class="btn-cal-move next" type="button">
        <span class="sr-only">{nextMonthLabel}</span>
      </button>
    </div>
    <div class="calendar-body">
      <div class="calendar-table-wrap">
        <table class="calendar-tbl">
          <caption>{calendarYear}{yearSuffix} {calendarMonth.toString().padStart(2, '0')}{monthSuffix}</caption>
          <thead>
            <tr>
              {#each (weekdays.length ? weekdays : ['일', '월', '화', '수', '목', '금', '토']) as weekday}
                <th>{weekday}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each Array.from({ length: 6 }) as _, week}
              <tr>
                {#each Array.from({ length: 7 }) as _, dayIndex}
                  {@const cellIndex = week * 7 + dayIndex}
                  {@const cell = calendarDays[cellIndex]}
                  <td
                    data-date={`${cell?.year}.${String(cell?.month ?? '').padStart(2, '0')}.${String(cell?.day ?? '').padStart(2, '0')}`}
                    class:day-off={cellIndex % 7 === 0}
                    class:old={cell?.isLeading}
                    class:new={cell?.isTrailing}
                    class:period={cell?.isPeriod}
                    class:start={cell?.isStart}
                    class:end={cell?.isEnd}
                    class:day-event={cell?.isEvent}
                    class:today={cell?.isToday}
                    class:disabled={cell?.isDisabled}
                  >
                    <button type="button" class="btn-set-date" aria-pressed={cell?.isPeriod ? 'true' : undefined} aria-label={cell?.isEvent ? `${cell?.day} ${eventLabel ?? ''}`.trim() : cell?.isToday ? `${cell?.day} ${todayLabel ?? ''}`.trim() : undefined} disabled={cell?.isLeading || cell?.isTrailing || cell?.isDisabled}><span>{cell?.day}</span></button>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <div class="calendar-footer">
      <div class="calendar-btn-wrap">
        <button type="button" class="krds-btn small text" id="get-today">{todayLabel}</button>
        <button type="button" class="krds-btn small tertiary">{cancelLabel}</button>
        <button type="button" class="krds-btn small primary">{confirmLabel}</button>
      </div>
    </div>
  </div>
{/snippet}

{#snippet DateInput()}
  <div {...rest} class={`form-group ${rootClass}`}>
    <div class="form-tit"><label for={id}>{label}</label></div>
    <div class="form-conts">
      <div class="form-conts calendar-conts">
        <div class="calendar-input">
          <input id={id} name={name || undefined}
            class="krds-input datepicker cal" type="number"
            placeholder={placeholder || 'YYYY.MM.DD'}
            value={localInputValue}
            use:reflectValueAttribute={localInputValue}
            {disabled} {required} {readonly} {form}
            oninput={setInputValue}
          />
          <button class="krds-btn medium icon form-btn-datepicker" type="button">
            <span class="sr-only">{calendarOpenLabel}</span>
            <i class="svg-icon ico-calendar"></i>
          </button>
        </div>
        <div class="krds-calendar-area">
          {@render calendarSurface()}
        </div>
      </div>
    </div>
    {#if hint}<p class="form-hint">{hint}</p>{/if}
  </div>
{/snippet}

{#snippet CalendarRange()}
  <div {...rest} class="krds-calendar-area">
    {@render calendarSurface()}
  </div>
{/snippet}

{#if kind === 'date-input'}
  {@render DateInput()}
{:else if kind === 'calendar-range'}
  {@render CalendarRange()}
{:else}
  <div {...rest} class="krds-calendar-area">
    {@render calendarSurface()}
  </div>
{/if}
