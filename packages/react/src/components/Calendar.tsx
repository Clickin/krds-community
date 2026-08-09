import { useId, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSelect"
> {
  label?: ReactNode;
  hint?: ReactNode;
  year?: number;
  displayYear?: number;
  selectedYear?: number;
  defaultYear?: number;
  month?: number;
  displayMonth?: number;
  selectedMonth?: number;
  defaultMonth?: number;
  years?: number[];
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
  value?: string;
  calendarLabel?: string;
  calendarOpenLabel?: string;
  previousMonthLabel?: ReactNode;
  nextMonthLabel?: ReactNode;
  yearSelectLabel?: string;
  monthSelectLabel?: string;
  weekdays?: ReactNode[];
  todayLabel?: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  eventLabel?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function CalendarSurface({
  single,
  label: _label,
  hint: _hint,
  year: controlledYear,
  displayYear: controlledDisplayYear,
  selectedYear: controlledSelectedYear,
  defaultYear = new Date().getFullYear(),
  month: controlledMonth,
  displayMonth: controlledDisplayMonth,
  selectedMonth: controlledSelectedMonth,
  defaultMonth = new Date().getMonth() + 1,
  years,
  disabledYears = [],
  disabledMonths = [],
  leadingDays: providedLeadingDays,
  previousMonthDayCount: providedPreviousMonthDayCount,
  dayCount: providedDayCount,
  rangeStartDay,
  rangeEndDay,
  todayDay,
  eventDays = [],
  disabledDays = [],
  value: controlledValue,
  defaultValue = "",
  calendarLabel,
  calendarOpenLabel: _calendarOpenLabel,
  previousMonthLabel,
  nextMonthLabel,
  yearSelectLabel,
  monthSelectLabel,
  weekdays = [],
  todayLabel,
  cancelLabel,
  confirmLabel,
  eventLabel,
  onValueChange,
  onChange,
  onYearChange,
  onMonthChange,
  onPreviousMonth,
  onNextMonth,
  onCancel,
  onConfirm,
  className,
  ref,
  ...props
}: CalendarProps & { single?: boolean } & { ref?: Ref<HTMLDivElement> }) {
  const generatedId = useId();
  const yearListId = `krds-calendar-year-${generatedId}`;
  const monthListId = `krds-calendar-month-${generatedId}`;
  const [uncontrolledDisplayYear, setUncontrolledDisplayYear] = useState(
    controlledDisplayYear ?? controlledYear ?? defaultYear,
  );
  const [uncontrolledDisplayMonth, setUncontrolledDisplayMonth] = useState(
    controlledDisplayMonth ?? controlledMonth ?? defaultMonth,
  );
  const [uncontrolledSelectedYear, setUncontrolledSelectedYear] = useState(
    controlledSelectedYear ?? controlledYear ?? defaultYear,
  );
  const [uncontrolledSelectedMonth, setUncontrolledSelectedMonth] = useState(
    controlledSelectedMonth ?? controlledMonth ?? defaultMonth,
  );
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const displayYear = controlledDisplayYear ?? uncontrolledDisplayYear;
  const displayMonth = controlledDisplayMonth ?? uncontrolledDisplayMonth;
  const selectedYear = controlledSelectedYear ?? controlledYear ?? uncontrolledSelectedYear;
  const selectedMonth = controlledSelectedMonth ?? controlledMonth ?? uncontrolledSelectedMonth;
  const value = controlledValue ?? uncontrolledValue;
  const availableYears = years ?? [selectedYear];
  const leadingDays = providedLeadingDays ?? new Date(displayYear, displayMonth - 1, 1).getDay();
  const previousMonthDayCount =
    providedPreviousMonthDayCount ?? new Date(displayYear, displayMonth - 1, 0).getDate();
  const dayCount = providedDayCount ?? new Date(displayYear, displayMonth, 0).getDate();
  const totalCells = 42;
  const pad = (part: number) => String(part).padStart(2, "0");
  const chooseYear = (next: number) => {
    if (controlledDisplayYear === undefined) setUncontrolledDisplayYear(next);
    if (controlledSelectedYear === undefined && controlledYear === undefined) {
      setUncontrolledSelectedYear(next);
    }
    setYearOpen(false);
    onYearChange?.(next);
  };
  const chooseMonth = (next: number) => {
    if (controlledDisplayMonth === undefined) setUncontrolledDisplayMonth(next);
    if (controlledSelectedMonth === undefined && controlledMonth === undefined) {
      setUncontrolledSelectedMonth(next);
    }
    setMonthOpen(false);
    onMonthChange?.(next);
  };
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const offset = index - leadingDays + 1;
    if (offset < 1) {
      const day = previousMonthDayCount + offset;
      const month = displayMonth === 1 ? 12 : displayMonth - 1;
      const year = displayMonth === 1 ? displayYear - 1 : displayYear;
      return { day, month, year, offMonth: "old" as const };
    }
    if (offset > dayCount) {
      const day = offset - dayCount;
      const month = displayMonth === 12 ? 1 : displayMonth + 1;
      const year = displayMonth === 12 ? displayYear + 1 : displayYear;
      return { day, month, year, offMonth: "new" as const };
    }
    return { day: offset, month: displayMonth, year: displayYear, offMonth: undefined };
  });
  return (
    <div {...props} ref={ref} className={cx("krds-calendar-area", className)}>
      <div
        className={cx("calendar-wrap", "bottom", single && "single")}
        aria-label={calendarLabel}
        tabIndex={0}
      >
        <div className="calendar-head">
          <button type="button" className="btn-cal-move prev" onClick={onPreviousMonth}>
            <span className="sr-only">{previousMonthLabel}</span>
          </button>
          <div className="calendar-switch-wrap">
            <div className="calendar-drop-down">
              <button
                type="button"
                className="btn-cal-switch year"
                aria-label={yearSelectLabel}
                aria-controls={yearListId}
                aria-expanded={yearOpen}
                aria-haspopup="listbox"
                role="combobox"
                onClick={() => setYearOpen((open) => !open)}
              >
                {`${displayYear}년`}
              </button>
              <div className="calendar-select calendar-year-wrap">
                <ul className="sel year" id={yearListId} role="listbox">
                  {availableYears.map((year) => (
                    <li role="none" key={year}>
                      <button
                        type="button"
                        role="option"
                        className={year === selectedYear ? "active" : undefined}
                        aria-selected={year === selectedYear}
                        disabled={disabledYears.includes(year)}
                        onClick={() => chooseYear(year)}
                      >
                        {`${year}년`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="calendar-drop-down">
              <button
                type="button"
                className="btn-cal-switch month"
                aria-label={monthSelectLabel}
                aria-controls={monthListId}
                aria-expanded={monthOpen}
                aria-haspopup="listbox"
                role="combobox"
                onClick={() => setMonthOpen((open) => !open)}
              >
                {`${pad(displayMonth)}월`}
              </button>
              <div className="calendar-select calendar-mon-wrap">
                <ul className="sel month" id={monthListId} role="listbox">
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <li role="none" key={month}>
                      <button
                        type="button"
                        role="option"
                        className={month === selectedMonth ? "active" : undefined}
                        aria-selected={month === selectedMonth}
                        disabled={disabledMonths.includes(month)}
                        onClick={() => chooseMonth(month)}
                      >
                        {`${pad(month)}월`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button type="button" className="btn-cal-move next" onClick={onNextMonth}>
            <span className="sr-only">{nextMonthLabel}</span>
          </button>
        </div>
        <div className="calendar-body">
          <div className="calendar-table-wrap">
            <table className="calendar-tbl">
              <caption>{`${displayYear}년 ${pad(displayMonth)}월`}</caption>
              <thead>
                <tr>
                  {weekdays.map((weekday, index) => (
                    <th key={index}>{weekday}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(cells.length / 7) }, (_, rowIndex) => (
                  <tr key={rowIndex}>
                    {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, columnIndex) => {
                      const currentMonth = cell.offMonth === undefined;
                      const period =
                        currentMonth &&
                        rangeStartDay !== undefined &&
                        rangeEndDay !== undefined &&
                        cell.day >= rangeStartDay &&
                        cell.day <= rangeEndDay;
                      const start = period && cell.day === rangeStartDay;
                      const end = period && cell.day === rangeEndDay;
                      const today = currentMonth && cell.day === todayDay;
                      const event = currentMonth && eventDays.includes(cell.day);
                      const disabled = currentMonth && disabledDays.includes(cell.day);
                      const date = `${cell.year}.${pad(cell.month)}.${pad(cell.day)}`;
                      const selected = value === date;
                      const offMonth = cell.offMonth !== undefined;
                      return (
                        <td
                          className={
                            cx(
                              cell.offMonth,
                              columnIndex === 0 && "day-off",
                              period && "period",
                              start && "start",
                              end && "end",
                              today && "today",
                              event && "day-event",
                              disabled && "disabled",
                              selected && !period && "period start end",
                            ) || undefined
                          }
                          data-date={date}
                          key={date}
                        >
                          <button
                            type="button"
                            className="btn-set-date"
                            disabled={offMonth || disabled}
                            ref={
                              offMonth
                                ? (node) => node?.setAttribute("disabled", "true")
                                : undefined
                            }
                            aria-pressed={period || selected ? true : undefined}
                            aria-label={
                              today
                                ? `${cell.day} ${todayLabel ?? ""}`.trim()
                                : event
                                  ? `${cell.day} ${eventLabel ?? ""}`.trim()
                                  : undefined
                            }
                            onClick={() => {
                              if (controlledValue === undefined) setUncontrolledValue(date);
                              onValueChange?.(date);
                              onChange?.(date);
                            }}
                          >
                            <span>{cell.day}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="calendar-footer">
          <div className="calendar-btn-wrap">
            <button type="button" className="krds-btn small text" id="get-today">
              {todayLabel}
            </button>
            <button type="button" className="krds-btn small tertiary" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="krds-btn small primary" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Calendar({ ref, ...props }: CalendarProps & { ref?: Ref<HTMLDivElement> }) {
  return <CalendarSurface {...props} {...(ref !== undefined ? { ref } : {})} single />;
}
