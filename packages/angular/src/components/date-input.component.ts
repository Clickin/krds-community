import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import type { ControlValueAccessor } from "@angular/forms";
import { createStableId, CALENDAR_MONTHS, type AngularCalendarCell } from "../kinds";

@Component({
  selector: "krds-date-input",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsDateInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="form-group">
      <div class="form-tit">
        <label [for]="id">{{ label }}</label>
      </div>
      <div class="form-conts">
        <div class="form-conts calendar-conts">
          <div class="calendar-input">
            <input
              [id]="id"
              type="number"
              class="krds-input datepicker cal"
              placeholder="YYYY.MM.DD"
              [value]="value"
              [disabled]="disabled"
              [readonly]="readonly"
              [required]="required"
              (input)="setValue(inputValue($event))"
              (blur)="touch()"
            />
            <button type="button" class="krds-btn medium icon form-btn-datepicker">
              <span class="sr-only">달력 열기</span>
              <i class="svg-icon ico-calendar"></i>
            </button>
          </div>
          <ng-container *ngTemplateOutlet="calendarSurface"></ng-container>
        </div>
      </div>
      @if (hint) {
        <p class="form-hint">{{ hint }}</p>
      }
    </div>

    <ng-template #calendarSurface>
      <div class="krds-calendar-area">
        <div
          class="calendar-wrap bottom"
          [class.single]="single"
          [attr.aria-label]="calendarLabel || null"
          tabindex="0"
        >
          <div class="calendar-head">
            <button type="button" class="btn-cal-move prev" (click)="moveCalendarMonth(-1)">
              <span class="sr-only">{{ previousMonthLabel }}</span>
            </button>
            <div class="calendar-switch-wrap">
              <div class="calendar-drop-down">
                <button
                  type="button"
                  class="btn-cal-switch year"
                  role="combobox"
                  [attr.aria-label]="yearSelectLabel || null"
                  [attr.aria-controls]="id + '-calendar-year'"
                  [attr.aria-expanded]="calendarYearOpen"
                  aria-haspopup="listbox"
                  (click)="toggleCalendarYear()"
                >
                  {{ calendarYear }}년
                </button>
                <div class="calendar-select calendar-year-wrap" [class.active]="calendarYearOpen">
                  <ul class="sel year" [id]="id + '-calendar-year'" role="listbox">
                    @for (optionYear of calendarYears; track optionYear) {
                      <li role="none">
                        <button
                          type="button"
                          role="option"
                          [class.active]="optionYear === calendarSelectedYear"
                          [attr.aria-selected]="optionYear === calendarSelectedYear"
                          [disabled]="disabledYears.includes(optionYear)"
                          (click)="selectCalendarYear(optionYear)"
                        >
                          {{ optionYear }}년
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
              <div class="calendar-drop-down">
                <button
                  type="button"
                  class="btn-cal-switch month"
                  role="combobox"
                  [attr.aria-label]="monthSelectLabel || null"
                  [attr.aria-controls]="id + '-calendar-month'"
                  [attr.aria-expanded]="calendarMonthOpen"
                  aria-haspopup="listbox"
                  (click)="toggleCalendarMonth()"
                >
                  {{ padCalendarPart(calendarMonth) }}월
                </button>
                <div class="calendar-select calendar-mon-wrap" [class.active]="calendarMonthOpen">
                  <ul class="sel month" [id]="id + '-calendar-month'" role="listbox">
                    @for (optionMonth of calendarMonths; track optionMonth) {
                      <li role="none">
                        <button
                          type="button"
                          role="option"
                          [class.active]="optionMonth === calendarSelectedMonth"
                          [attr.aria-selected]="optionMonth === calendarSelectedMonth"
                          [disabled]="disabledMonths.includes(optionMonth)"
                          (click)="selectCalendarMonth(optionMonth)"
                        >
                          {{ padCalendarPart(optionMonth) }}월
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
            <button type="button" class="btn-cal-move next" (click)="moveCalendarMonth(1)">
              <span class="sr-only">{{ nextMonthLabel }}</span>
            </button>
          </div>
          <div class="calendar-body">
            <div class="calendar-table-wrap">
              <table class="calendar-tbl">
                <caption>
                  {{
                    calendarYear
                  }}년
                  {{
                    padCalendarPart(calendarMonth)
                  }}월
                </caption>
                <thead>
                  <tr>
                    @for (weekday of weekdays; track $index) {
                      <th>{{ weekday }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (week of calendarWeeks; track $index) {
                    <tr>
                      @for (cell of week; track cell.date) {
                        <td [class]="cell.className" [attr.data-date]="cell.date">
                          <button
                            type="button"
                            class="btn-set-date"
                            [disabled]="cell.disabled"
                            [attr.aria-pressed]="cell.pressed ? true : null"
                            [attr.aria-label]="cell.ariaLabel"
                            (click)="selectCalendarDate(cell)"
                          >
                            <span>{{ cell.day }}</span>
                          </button>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div class="calendar-footer">
            <div class="calendar-btn-wrap">
              <button
                type="button"
                class="krds-btn small text"
                id="get-today"
                (click)="selectCalendarToday()"
              >
                {{ todayLabel }}
              </button>
              <button type="button" class="krds-btn small tertiary" (click)="touch()">
                {{ cancelLabel }}
              </button>
              <button type="button" class="krds-btn small primary" (click)="touch()">
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class KrdsDateInputComponent implements ControlValueAccessor {
  @Input() id = createStableId("krds-date-input");
  @Input() single = false;
  @Input() label = "레이블";
  @Input() hint = "";
  @Input() value = "";
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() year: number | null = null;
  @Input() month: number | null = null;
  @Input() displayYear: number | null = null;
  @Input() displayMonth: number | null = null;
  @Input() selectedYear: number | null = null;
  @Input() selectedMonth: number | null = null;
  @Input() years: number[] = [];
  @Input() disabledYears: number[] = [];
  @Input() disabledMonths: number[] = [];
  @Input() leadingDays: number | null = null;
  @Input() previousMonthDayCount: number | null = null;
  @Input() dayCount: number | null = null;
  @Input() rangeStartDay: number | null = null;
  @Input() rangeEndDay: number | null = null;
  @Input() todayDay: number | null = null;
  @Input() eventDays: number[] = [];
  @Input() disabledDays: number[] = [];
  @Input() calendarLabel = "";
  @Input() previousMonthLabel = "이전 달";
  @Input() nextMonthLabel = "다음 달";
  @Input() yearSelectLabel = "연도 선택";
  @Input() monthSelectLabel = "월 선택";
  @Input() weekdays: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  @Input() todayLabel = "";
  @Input() eventLabel = "";
  @Input() cancelLabel = "";
  @Input() confirmLabel = "";
  @Output() valueChange = new EventEmitter<string>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() monthChange = new EventEmitter<number>();
  calendarYearOpen = false;
  calendarMonthOpen = false;

  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });

  get calendarYear(): number {
    return this.displayYear ?? this.year ?? this.years[0] ?? new Date().getFullYear();
  }

  get calendarMonth(): number {
    return this.displayMonth ?? this.month ?? new Date().getMonth() + 1;
  }

  get calendarSelectedYear(): number {
    return this.selectedYear ?? this.year ?? this.calendarYear;
  }

  get calendarSelectedMonth(): number {
    return this.selectedMonth ?? this.month ?? this.calendarMonth;
  }

  get calendarYears(): number[] {
    return this.years.length > 0 ? this.years : this.calendarYear === 0 ? [] : [this.calendarYear];
  }

  get calendarMonths(): readonly number[] {
    return CALENDAR_MONTHS;
  }

  get calendarWeeks(): AngularCalendarCell[][] {
    const activeYear = this.calendarYear;
    const activeMonth = this.calendarMonth;
    const leadingDays = Math.max(
      0,
      Math.min(6, this.leadingDays ?? new Date(activeYear, activeMonth - 1, 1).getDay()),
    );
    const dayCount = Math.max(0, this.dayCount ?? new Date(activeYear, activeMonth, 0).getDate());
    const previousMonthDayCount = Math.max(
      0,
      this.previousMonthDayCount ?? new Date(activeYear, activeMonth - 1, 0).getDate(),
    );
    const totalCells = 42;
    const weeks: AngularCalendarCell[][] = [];

    for (let row = 0; row < totalCells / 7; row += 1) {
      const week: AngularCalendarCell[] = [];
      for (let column = 0; column < 7; column += 1) {
        const index = row * 7 + column;
        const offset = index - leadingDays + 1;
        let day: number;
        let month = activeMonth;
        let year = activeYear;
        let offMonth: "old" | "new" | null = null;

        if (offset < 1) {
          day = previousMonthDayCount + offset;
          offMonth = "old";
          month = activeMonth === 1 ? 12 : activeMonth - 1;
          year = activeMonth === 1 ? activeYear - 1 : activeYear;
        } else if (offset > dayCount) {
          day = offset - dayCount;
          offMonth = "new";
          month = activeMonth === 12 ? 1 : activeMonth + 1;
          year = activeMonth === 12 ? activeYear + 1 : activeYear;
        } else {
          day = offset;
        }

        const currentMonth = offMonth === null;
        const period =
          currentMonth &&
          this.rangeStartDay !== null &&
          this.rangeEndDay !== null &&
          day >= this.rangeStartDay &&
          day <= this.rangeEndDay;
        const start = period && day === this.rangeStartDay;
        const end = period && day === this.rangeEndDay;
        const today = currentMonth && day === this.todayDay;
        const event = currentMonth && this.eventDays.includes(day);
        const dateDisabled = currentMonth && this.disabledDays.includes(day);
        const disabled = !currentMonth || dateDisabled;
        const date = `${year}.${this.padCalendarPart(month)}.${this.padCalendarPart(day)}`;
        const selected = this.value === date;
        const classes = [
          offMonth,
          column === 0 ? "day-off" : null,
          period || (selected && !period) ? "period" : null,
          start || (selected && !period) ? "start" : null,
          end || (selected && !period) ? "end" : null,
          today ? "today" : null,
          event ? "day-event" : null,
          dateDisabled ? "disabled" : null,
        ].filter((className): className is string => className !== null);

        week.push({
          day,
          date,
          className: classes.join(" "),
          disabled,
          pressed: period || selected,
          ariaLabel: today
            ? `${day} ${this.todayLabel}`.trim()
            : event
              ? `${day} ${this.eventLabel}`.trim()
              : null,
        });
      }
      weeks.push(week);
    }

    return weeks;
  }

  padCalendarPart(value: number): string {
    return value.toString().padStart(2, "0");
  }

  toggleCalendarYear(): void {
    this.calendarYearOpen = !this.calendarYearOpen;
    this.calendarMonthOpen = false;
  }

  toggleCalendarMonth(): void {
    this.calendarMonthOpen = !this.calendarMonthOpen;
    this.calendarYearOpen = false;
  }

  selectCalendarYear(year: number): void {
    if (this.disabledYears.includes(year)) return;
    this.year = year;
    this.displayYear = year;
    this.selectedYear = year;
    this.calendarYearOpen = false;
    this.yearChange.emit(year);
  }

  selectCalendarMonth(month: number): void {
    if (this.disabledMonths.includes(month)) return;
    this.month = month;
    this.displayMonth = month;
    this.selectedMonth = month;
    this.calendarMonthOpen = false;
    this.monthChange.emit(month);
  }

  moveCalendarMonth(direction: -1 | 1): void {
    let year = this.calendarYear;
    let month = this.calendarMonth + direction;
    if (month === 0) {
      month = 12;
      year -= 1;
    } else if (month === 13) {
      month = 1;
      year += 1;
    }
    this.year = year;
    this.month = month;
    this.displayYear = year;
    this.displayMonth = month;
    this.selectedYear = year;
    this.selectedMonth = month;
    this.calendarYearOpen = false;
    this.calendarMonthOpen = false;
    this.yearChange.emit(year);
    this.monthChange.emit(month);
  }

  selectCalendarDate(cell: AngularCalendarCell): void {
    if (!cell.disabled) this.setValue(cell.date);
  }

  selectCalendarToday(): void {
    if (this.todayDay === null) return;
    const date = `${this.calendarYear}.${this.padCalendarPart(
      this.calendarMonth,
    )}.${this.padCalendarPart(this.todayDay)}`;
    this.setValue(date);
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  setValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  touch(): void {
    this.onTouched();
  }

  writeValue(value: string | number | boolean | string[] | null): void {
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = String(value);
    }
    this.changeDetector?.markForCheck();
  }

  registerOnChange(fn: (value: string | number | boolean | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
}
