import { For, Show, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";
import {
  numberValue,
  choiceNumber,
  padCalendarPart,
  type CalendarChoiceInput,
  type CalendarDay,
  type CalendarAction,
} from "../shared.js";

export interface CalendarProps {
  class?: string;
  className?: string;
  id?: string;
  label?: string;
  calendarLabel?: string;
  todayLabel?: string;
  yearLabel?: string;
  monthLabel?: string;
  previousMonthLabel?: string;
  previousmonthlabel?: string;
  nextmonthlabel?: string;
  nextMonthLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  yearSelectLabel?: string;
  monthSelectLabel?: string;
  eventLabel?: string;
  year?: string | number;
  month?: string | number;
  displayYear?: string | number;
  displayMonth?: string | number;
  selectedYear?: string | number;
  selectedMonth?: string | number;
  years?: CalendarChoiceInput[];
  months?: CalendarChoiceInput[];
  disabledYears?: number[];
  disabledMonths?: number[];
  leadingDays?: number;
  previousMonthDayCount?: number;
  dayCount?: number;
  rangeStartDay?: number;
  rangeEndDay?: number;
  todayDay?: number;
  eventDays?: number[];
  disabledDays?: number[];
  weekdays?: string[];
  weeks?: CalendarDay[][];
  actions?: CalendarAction[];
  defaultValue?: string;
  value?: string;
  modelValue?: string;
  selected?: string;
  selectedLabel?: string;
  open?: boolean;
  hint?: string;
  name?: string;
  [key: string]: unknown;
}

const renderCalendarSurface = (
  props: Record<string, any>,
  native: Record<string, any>,
  single: boolean,
  includeNative: boolean,
) => {
  const p = props as unknown as CalendarProps;
  const n = native as Record<string, any>;

  const calendarDisplayYear = () =>
    numberValue(
      (p as Record<string, any>).displayYear ??
        (p as Record<string, any>).year ??
        (p as Record<string, any>).selectedYear,
      2000,
    );
  const calendarDisplayMonth = () =>
    Math.min(
      12,
      Math.max(
        1,
        numberValue(
          (p as Record<string, any>).displayMonth ??
            (p as Record<string, any>).month ??
            (p as Record<string, any>).selectedMonth,
          1,
        ),
      ),
    );
  const calendarSelectedYear = () =>
    numberValue(
      (p as Record<string, any>).selectedYear ??
        (p as Record<string, any>).year ??
        (p as Record<string, any>).displayYear,
      calendarDisplayYear(),
    );
  const calendarSelectedMonth = () =>
    Math.min(
      12,
      Math.max(
        1,
        numberValue(
          (p as Record<string, any>).selectedMonth ??
            (p as Record<string, any>).month ??
            (p as Record<string, any>).displayMonth,
          calendarDisplayMonth(),
        ),
      ),
    );
  const calendarYears = () => {
    const source =
      p.years && p.years.length > 0
        ? p.years
        : Array.from({ length: 24 }, (_, offset) => calendarDisplayYear() - 1 + offset);
    return source.map((choice: CalendarChoiceInput) => {
      const year = choiceNumber(choice, calendarDisplayYear());
      const original = typeof choice === "number" ? undefined : choice;
      return {
        label: original?.label ?? `${year}년`,
        value: String(year),
        active: year === calendarSelectedYear(),
        disabled: original?.disabled === true || ((p.disabledYears ?? []).includes(year) ?? false),
      };
    });
  };
  const calendarMonths = () => {
    const source =
      p.months && p.months.length > 0
        ? p.months
        : Array.from({ length: 12 }, (_, offset) => offset + 1);
    return source.map((choice: CalendarChoiceInput) => {
      const month = choiceNumber(choice, calendarDisplayMonth());
      const original = typeof choice === "number" ? undefined : choice;
      return {
        label: original?.label ?? `${padCalendarPart(month)}월`,
        value: String(month),
        active: month === calendarSelectedMonth(),
        disabled:
          original?.disabled === true || ((p.disabledMonths ?? []).includes(month) ?? false),
      };
    });
  };
  const calendarSelectedDate = () => {
    const raw = (p as Record<string, any>).value ?? (p as Record<string, any>).modelValue;
    const match = typeof raw === "string" && /^(\d{4})[.-](\d{2})[.-](\d{2})$/.exec(raw);
    return match ? `${match[1]}.${match[2]}.${match[3]}` : undefined;
  };
  const calendarWeeks = () => {
    if (p.weeks && p.weeks.length > 0) return p.weeks;
    const displayYear = calendarDisplayYear();
    const displayMonth = calendarDisplayMonth();
    const leadingDays = Math.min(
      6,
      Math.max(0, numberValue(p.leadingDays, new Date(displayYear, displayMonth - 1, 1).getDay())),
    );
    const previousMonthDayCount = Math.max(
      0,
      numberValue(p.previousMonthDayCount, new Date(displayYear, displayMonth - 1, 0).getDate()),
    );
    const dayCount = Math.max(
      0,
      numberValue(p.dayCount, new Date(displayYear, displayMonth, 0).getDate()),
    );
    const totalCells = Math.ceil((leadingDays + dayCount) / 7) * 7;
    const selectedDate = calendarSelectedDate();
    return Array.from({ length: totalCells / 7 }, (_, row) =>
      Array.from({ length: 7 }, (_, column) => {
        const index = row * 7 + column;
        const offset = index - leadingDays + 1;
        const old = offset < 1;
        const next = offset > dayCount;
        const day = old ? previousMonthDayCount + offset : next ? offset - dayCount : offset;
        const month = old
          ? displayMonth === 1
            ? 12
            : displayMonth - 1
          : next
            ? displayMonth === 12
              ? 1
              : displayMonth + 1
            : displayMonth;
        const year =
          old && displayMonth === 1
            ? displayYear - 1
            : next && displayMonth === 12
              ? displayYear + 1
              : displayYear;
        const currentMonth = !old && !next;
        const period =
          currentMonth &&
          p.rangeStartDay !== undefined &&
          p.rangeEndDay !== undefined &&
          day >= p.rangeStartDay &&
          day <= p.rangeEndDay;
        const start = period && day === p.rangeStartDay;
        const end = period && day === p.rangeEndDay;
        const today = currentMonth && day === p.todayDay;
        const event = currentMonth && (p.eventDays?.includes(day) ?? false);
        const disabled = currentMonth && (p.disabledDays?.includes(day) ?? false);
        const date = `${year}.${padCalendarPart(month)}.${padCalendarPart(day)}`;
        const selected = currentMonth && selectedDate === date;
        const classes = [
          old ? "old" : next ? "new" : undefined,
          column === 0 ? "day-off" : undefined,
          period ? "period" : undefined,
          start ? "start" : undefined,
          end ? "end" : undefined,
          today ? "today" : undefined,
          event ? "day-event" : undefined,
          disabled ? "disabled" : undefined,
        ]
          .filter(Boolean)
          .join(" ");
        return {
          label: String(day),
          value: date,
          className: classes,
          disabled: !currentMonth || disabled,
          pressed: period || selected,
          ariaLabel: today
            ? `${day} ${p.todayLabel ?? ""}`.trim()
            : event
              ? `${day} ${p.eventLabel ?? ""}`.trim()
              : undefined,
        };
      }),
    );
  };
  const calendarActions = (): CalendarAction[] =>
    p.actions && p.actions.length > 0
      ? p.actions
      : [
          { id: "get-today", label: String(p.todayLabel ?? ""), variant: "text" },
          { label: String(p.cancelLabel ?? ""), variant: "tertiary" },
          { label: String(p.confirmLabel ?? ""), variant: "primary" },
        ];
  const [calendarYearOpen, setCalendarYearOpen] = createSignal(false);
  const [calendarMonthOpen, setCalendarMonthOpen] = createSignal(false);
  return (
    <div
      {...(includeNative ? n : {})}
      class={`krds-calendar-area${((p as Record<string, any>).className as string) ? ` ${(p as Record<string, any>).className}` : ""}`}
    >
      <div
        class={["calendar-wrap", "bottom", single && "single"].filter(Boolean).join(" ")}
        aria-label={p.calendarLabel ?? "달력"}
        tabIndex={0}
      >
        <div class="calendar-head">
          <button type="button" class="btn-cal-move prev">
            <span class="sr-only">
              {p.previousMonthLabel ?? p.previousmonthlabel ?? p.previousLabel}
            </span>
          </button>
          <div class="calendar-switch-wrap">
            <div class="calendar-drop-down">
              <button
                type="button"
                class="btn-cal-switch year"
                role="combobox"
                aria-label={p.yearSelectLabel ?? p.yearLabel}
                aria-haspopup="listbox"
                aria-expanded={calendarYearOpen()}
                aria-controls={`${p.id}-calendar-year`}
                onClick={() => setCalendarYearOpen((o) => !o)}
              >
                {`${calendarDisplayYear()}년`}
              </button>
              <div class="calendar-select calendar-year-wrap">
                <ul class="sel year" id={`${p.id}-calendar-year`} role="listbox">
                  <For each={calendarYears()}>
                    {(choice) => (
                      <li role="none">
                        <button
                          type="button"
                          role="option"
                          classList={{ active: choice.active }}
                          aria-selected={choice.active}
                          disabled={choice.disabled}
                        >
                          {choice.label}
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
            <div class="calendar-drop-down">
              <button
                type="button"
                class="btn-cal-switch month"
                role="combobox"
                aria-label={p.monthSelectLabel ?? p.monthLabel}
                aria-haspopup="listbox"
                aria-expanded={calendarMonthOpen()}
                aria-controls={`${p.id}-calendar-month`}
                onClick={() => setCalendarMonthOpen((o) => !o)}
              >
                {`${padCalendarPart(calendarDisplayMonth())}월`}
              </button>
              <div class="calendar-select calendar-mon-wrap">
                <ul class="sel month" id={`${p.id}-calendar-month`} role="listbox">
                  <For each={calendarMonths()}>
                    {(choice) => (
                      <li role="none">
                        <button
                          type="button"
                          role="option"
                          classList={{ active: choice.active }}
                          aria-selected={choice.active}
                          disabled={choice.disabled}
                        >
                          {choice.label}
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
          </div>
          <button type="button" class="btn-cal-move next">
            <span class="sr-only">{p.nextMonthLabel ?? p.nextmonthlabel ?? p.nextLabel}</span>
          </button>
        </div>
        <div class="calendar-body">
          <div class="calendar-table-wrap">
            <table class="calendar-tbl">
              <caption>{`${calendarDisplayYear()}년 ${padCalendarPart(calendarDisplayMonth())}월`}</caption>
              <thead>
                <tr>
                  <For each={p.weekdays ?? ["일", "월", "화", "수", "목", "금", "토"]}>
                    {(weekday) => <th>{weekday}</th>}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={calendarWeeks()}>
                  {(week) => (
                    <tr>
                      <For each={week}>
                        {(day) => {
                          const pressedResult = "pressed" in day && day.pressed;
                          const ariaLabel = "ariaLabel" in day ? day.ariaLabel : undefined;
                          return (
                            <td class={day.className || undefined} data-date={day.value}>
                              <button
                                type="button"
                                class="btn-set-date"
                                disabled={day.disabled}
                                aria-pressed={pressedResult ? "true" : undefined}
                                aria-label={ariaLabel}
                                onClick={(event) => {
                                  (p as Record<string, any>).onChange?.(event);
                                }}
                              >
                                <span>{day.label}</span>
                              </button>
                            </td>
                          );
                        }}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
        <div class="calendar-footer">
          <div class="calendar-btn-wrap">
            <For each={calendarActions()}>
              {(action) => (
                <button
                  type="button"
                  id={action.id}
                  class={["krds-btn", "small", action.variant].filter(Boolean).join(" ")}
                  onClick={(event) => (p as Record<string, any>).onClick?.(event)}
                >
                  {action.label}
                  <Show when={action.icon}>
                    <i class={`svg-icon ico-${action.icon}`} />
                  </Show>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Calendar(rawProps: CalendarProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "label",
    "calendarLabel",
    "calendarOpenLabel",
    "todayLabel",
    "yearLabel",
    "monthLabel",
    "previousMonthLabel",
    "previousmonthlabel",
    "nextmonthlabel",
    "nextMonthLabel",
    "previousLabel",
    "nextLabel",
    "cancelLabel",
    "confirmLabel",
    "yearSelectLabel",
    "monthSelectLabel",
    "eventLabel",
    "year",
    "month",
    "displayYear",
    "displayMonth",
    "selectedYear",
    "selectedMonth",
    "years",
    "months",
    "disabledYears",
    "disabledMonths",
    "leadingDays",
    "previousMonthDayCount",
    "dayCount",
    "rangeStartDay",
    "rangeEndDay",
    "todayDay",
    "eventDays",
    "disabledDays",
    "weekdays",
    "weeks",
    "actions",
    "defaultValue",
    "value",
    "modelValue",
    "selected",
    "selectedLabel",
    "open",
    "hint",
    "name",
  ]);
  const instanceId = createUniqueId?.() ?? "cal";
  return renderCalendarSurface(
    { ...props, instanceId } as unknown as Record<string, any>,
    native as unknown as Record<string, any>,
    true,
    true,
  );
}

export function CalendarRange(rawProps: CalendarProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "label",
    "calendarLabel",
    "calendarOpenLabel",
    "todayLabel",
    "yearLabel",
    "monthLabel",
    "previousMonthLabel",
    "previousmonthlabel",
    "nextmonthlabel",
    "nextMonthLabel",
    "previousLabel",
    "nextLabel",
    "cancelLabel",
    "confirmLabel",
    "yearSelectLabel",
    "monthSelectLabel",
    "eventLabel",
    "year",
    "month",
    "displayYear",
    "displayMonth",
    "selectedYear",
    "selectedMonth",
    "years",
    "months",
    "disabledYears",
    "disabledMonths",
    "leadingDays",
    "previousMonthDayCount",
    "dayCount",
    "rangeStartDay",
    "rangeEndDay",
    "todayDay",
    "eventDays",
    "disabledDays",
    "weekdays",
    "weeks",
    "actions",
    "defaultValue",
    "value",
    "modelValue",
    "selected",
    "selectedLabel",
    "open",
    "hint",
    "name",
  ]);
  const instanceId = createUniqueId?.() ?? "cal";
  return renderCalendarSurface(
    { ...props, instanceId } as unknown as Record<string, any>,
    native as unknown as Record<string, any>,
    false,
    true,
  );
}

export function DateInput(rawProps: CalendarProps) {
  const merged = mergeProps({ id: `krds-date-input-${createUniqueId()}` }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "label",
    "calendarLabel",
    "calendarOpenLabel",
    "todayLabel",
    "yearLabel",
    "monthLabel",
    "previousMonthLabel",
    "previousmonthlabel",
    "nextmonthlabel",
    "nextMonthLabel",
    "previousLabel",
    "nextLabel",
    "cancelLabel",
    "confirmLabel",
    "yearSelectLabel",
    "monthSelectLabel",
    "eventLabel",
    "year",
    "month",
    "displayYear",
    "displayMonth",
    "selectedYear",
    "selectedMonth",
    "years",
    "months",
    "disabledYears",
    "disabledMonths",
    "leadingDays",
    "previousMonthDayCount",
    "dayCount",
    "rangeStartDay",
    "rangeEndDay",
    "todayDay",
    "eventDays",
    "disabledDays",
    "weekdays",
    "weeks",
    "actions",
    "defaultValue",
    "value",
    "modelValue",
    "selected",
    "selectedLabel",
    "open",
    "hint",
    "name",
  ]);
  const [localValue, setLocalValue] = createSignal("");
  const value = () => {
    if (props.value !== undefined) return String(props.value ?? "");
    if (typeof props.modelValue === "string" || typeof props.modelValue === "number")
      return String(props.modelValue);
    return localValue();
  };
  const setValue = (next: string) => {
    if (props.value === undefined) setLocalValue(next);
  };
  const updateInput = (
    event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement },
  ) => {
    setValue(event.currentTarget.value);
  };
  const instanceId = createUniqueId?.() ?? "di";
  return (
    <div {...(native as Record<string, any>)} class="form-group">
      <div class="form-tit">
        <label for={props.id}>{props.label}</label>
      </div>
      <div class="form-conts">
        <div class="form-conts calendar-conts">
          <div class="calendar-input">
            <input
              id={props.id}
              name={props.name}
              type="number"
              class="krds-input datepicker cal"
              placeholder="YYYY.MM.DD"
              value={value()}
              onInput={updateInput}
            />
            <button type="button" class="krds-btn medium icon form-btn-datepicker">
              <span class="sr-only">{`${props.calendarLabel ?? "달력"} 열기`}</span>
              <i class="svg-icon ico-calendar" />
            </button>
          </div>
          {renderCalendarSurface(
            { ...props, instanceId } as unknown as Record<string, any>,
            {} as Record<string, any>,
            false,
            false,
          )}
        </div>
      </div>
      <Show when={props.hint}>
        <p class="form-hint">{props.hint}</p>
      </Show>
    </div>
  );
}
