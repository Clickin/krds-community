import {
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type ComponentProps,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type LinkHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TableHTMLAttributes,
  type TextareaHTMLAttributes,
  type MouseEventHandler,
} from 'react';
import {
  cx,
  type KrdsAdditionalProps,
  type KrdsCarouselSlide,
  type KrdsListItem,
  type KrdsNavItem,
  type KrdsOption,
  type KrdsPaginationItem,
  type KrdsStep,
  type KrdsTableColumn,
  type KrdsTabItem,
  type KrdsTone,
} from '@krds-community/recipes';
import {
  Button,
  Checkbox,
  Radio,
  Switch as BaseSwitch,
  TextInput,
} from './components.js';

function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(
    ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []),
  );
  return unique.size ? Array.from(unique).join(' ') : undefined;
}

function SvgIcon({ name }: { name: string }) {
  return <i className={cx('svg-icon', name)} />;
}

type CommonProps = Omit<
  KrdsAdditionalProps,
  | 'label'
  | 'title'
  | 'description'
  | 'hint'
  | 'message'
  | 'size'
  | 'value'
  | 'modelValue'
  | 'className'
  | 'disabled'
>;
type NativeCommonProps = Omit<
  CommonProps,
  | 'id'
  | 'name'
  | 'required'
  | 'readonly'
  | 'open'
  | 'checked'
  | 'selected'
  | 'rows'
  | 'columns'
  | 'items'
  | 'panels'
  | 'steps'
  | 'tabs'
  | 'options'
  | 'slides'
  | 'links'
>;
type BoxProps = CommonProps & { className?: string; children?: ReactNode };
type LabelProps = { label?: ReactNode; hint?: ReactNode };

const toneClass: Record<KrdsTone, string> = {
  primary: 'primary',
  secondary: 'secondary',
  gray: 'gray',
  point: 'point',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  information: 'information',
  disabled: 'disabled',
};
const outlineToneClass: Record<KrdsTone, string> = {
  primary: 'outline-primary',
  secondary: 'outline-secondary',
  gray: 'outline-gray',
  point: 'outline-point',
  danger: 'outline-danger',
  warning: 'outline-warning',
  success: 'outline-success',
  information: 'outline-information',
  disabled: 'outline-disabled',
};

export interface BadgeProps extends BoxProps {
  tone?: KrdsTone;
  appearance?: 'outline' | 'solid' | 'light';
  size?: 'small' | 'medium' | 'large';
  number?: boolean;
  label?: ReactNode;
}
export function Badge({
  tone = 'primary',
  appearance = 'outline',
  size,
  number,
  label,
  children,
  className,
}: BadgeProps) {
  const appearanceClass =
    appearance === 'outline'
      ? outlineToneClass[tone]
      : appearance === 'light'
        ? `bg-light-${toneClass[tone]}`
        : `bg-${toneClass[tone]}`;
  return (
    <span className={cx('krds-badge', appearanceClass, size, number && 'number', className)}>
      {children ?? label}
    </span>
  );
}
export const BadgeNumber = (props: Omit<BadgeProps, 'number'>) => <Badge {...props} number />;
export const BadgeSize = Badge;

export interface BreadcrumbProps extends NativeCommonProps, HTMLAttributes<HTMLElement> {
  items?: KrdsNavItem[];
  label?: string;
}
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items = [],
    label = '현재 경로',
    id: providedId,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  return (
    <nav
      {...props}
      ref={ref}
      id={providedId ?? `krds-breadcrumb-${generatedId}`}
      className={cx('krds-breadcrumb-wrap', className)}
      aria-label={ariaLabel ?? label}
    >
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li className={index === 0 ? 'home' : undefined} key={item.id ?? item.label}>
            <a className="txt" href={item.href ?? '#'}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
});

export interface ButtonIconProps
  extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}
export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  { label, icon, size, className, children, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cx('krds-btn', 'icon', size, className)}
    >
      {children ?? (
        <>
          <span className="sr-only">{label}</span>
          {icon ?? <SvgIcon name="ico-sch" />}
        </>
      )}
    </button>
  );
});
export const ButtonHierarchy = (props: ComponentProps<typeof Button>) => <Button {...props} />;
export const ButtonSize = ButtonHierarchy;
export function ButtonText({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={props.type ?? 'button'} className={cx('krds-btn', 'text', className)}>
      {children}
    </button>
  );
}
export const ButtonWithIcon = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode }
>(function ButtonWithIcon({ icon, children, className, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cx('krds-btn', className)}
    >
      {children}
      {icon ?? <SvgIcon name="ico-sch" />}
    </button>
  );
});

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
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
  defaultValue?: string;
  calendarLabel?: string;
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
const CalendarSurface = forwardRef<
  HTMLDivElement,
  CalendarProps & { single: boolean }
>(function CalendarSurface(
  {
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
    defaultValue = '',
    calendarLabel,
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
    ...props
  },
  ref,
) {
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
  const leadingDays =
    providedLeadingDays ?? new Date(displayYear, displayMonth - 1, 1).getDay();
  const previousMonthDayCount =
    providedPreviousMonthDayCount ?? new Date(displayYear, displayMonth - 1, 0).getDate();
  const dayCount = providedDayCount ?? new Date(displayYear, displayMonth, 0).getDate();
  const totalCells = Math.ceil((leadingDays + dayCount) / 7) * 7;
  const pad = (part: number) => String(part).padStart(2, '0');
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
      return { day, month, year, offMonth: 'old' as const };
    }
    if (offset > dayCount) {
      const day = offset - dayCount;
      const month = displayMonth === 12 ? 1 : displayMonth + 1;
      const year = displayMonth === 12 ? displayYear + 1 : displayYear;
      return { day, month, year, offMonth: 'new' as const };
    }
    return { day: offset, month: displayMonth, year: displayYear, offMonth: undefined };
  });
  return (
    <div {...props} ref={ref} className={cx('krds-calendar-area', className)}>
      <div
        className={cx('calendar-wrap', 'bottom', single && 'single')}
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
                        className={year === selectedYear ? 'active' : undefined}
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
                        className={month === selectedMonth ? 'active' : undefined}
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
                              columnIndex === 0 && 'day-off',
                              period && 'period',
                              start && 'start',
                              end && 'end',
                              today && 'today',
                              event && 'day-event',
                              disabled && 'disabled',
                              selected && !period && 'period start end',
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
                                ? (node) => node?.setAttribute('disabled', 'true')
                                : undefined
                            }
                            aria-pressed={period || selected ? true : undefined}
                            aria-label={
                              today
                                ? `${cell.day} ${todayLabel ?? ''}`.trim()
                                : event
                                  ? `${cell.day} ${eventLabel ?? ''}`.trim()
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
});
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  return <CalendarSurface {...props} ref={ref} single />;
});
export interface CalendarRangeProps
  extends Omit<CalendarProps, 'value' | 'defaultValue' | 'onValueChange' | 'onChange'> {
  start?: string;
  end?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onChange?: (range: { start: string; end: string }) => void;
}
export const CalendarRange = forwardRef<HTMLDivElement, CalendarRangeProps>(
  function CalendarRange(
    {
      start,
      end,
      defaultStart = '',
      defaultEnd = '',
      onChange,
      rangeStartDay,
      rangeEndDay,
      ...props
    },
    ref,
  ) {
    const [uncontrolledRange, setUncontrolledRange] = useState({
      start: defaultStart,
      end: defaultEnd,
    });
    const range = {
      start: start ?? uncontrolledRange.start,
      end: end ?? uncontrolledRange.end,
    };
    const update = (date: string) => {
      const next =
        !range.start || range.end
          ? { start: date, end: '' }
          : { start: range.start, end: date };
      if (start === undefined || end === undefined) setUncontrolledRange(next);
      onChange?.(next);
    };
    return (
      <CalendarSurface
        {...props}
        ref={ref}
        single={false}
        {...(rangeStartDay === undefined ? {} : { rangeStartDay })}
        {...(rangeEndDay === undefined ? {} : { rangeEndDay })}
        onValueChange={update}
      />
    );
  },
);
export const DateInput = forwardRef<HTMLDivElement, CalendarProps>(function DateInput(props, ref) {
  const inputId = `krds-date-${useId()}`;
  const {
    label,
    hint,
    value,
    className,
    ...calendarProps
  } = props;
  return (
    <div ref={ref} className={cx('form-group', className)}>
      <div className="form-tit">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <div className="form-conts">
        <div className="form-conts calendar-conts">
          <div className="calendar-input">
            <input
              id={inputId}
              type="number"
              className="krds-input datepicker cal"
              placeholder="YYYY.MM.DD"
              value={value || undefined}
            />
            <button type="button" className="krds-btn medium icon form-btn-datepicker">
              <span className="sr-only">달력 열기</span>
              <SvgIcon name="ico-calendar" />
            </button>
          </div>
          <CalendarSurface {...calendarProps} value={value ?? ''} single={false} />
        </div>
      </div>
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
});

function CarouselImage({ label }: { label?: string }) {
  return (
    <svg
      width="243"
      height="178"
      viewBox="0 0 243 178"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
    >
      <rect width="243" height="178" fill="#E6E8EA" />
    </svg>
  );
}
export interface CarouselProps extends BoxProps {
  slides?: KrdsCarouselSlide[];
  label?: string;
  autoPlay?: boolean;
  interval?: number;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  moreLabel?: ReactNode;
  playLabel?: ReactNode;
  stopLabel?: ReactNode;
  imageLabel?: string;
  actionLabel?: ReactNode;
  onSlideChange?: (index: number) => void;
  onPlayingChange?: (playing: boolean) => void;
}
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    slides = [],
    label: _label,
    autoPlay = false,
    interval = 5000,
    previousLabel,
    nextLabel,
    moreLabel,
    imageLabel,
    actionLabel,
    onSlideChange,
    className,
  },
  ref,
) {
  const [, setIndex] = useState(0);
  const move = useCallback(
    (delta: number) => {
      if (!slides.length) return;
      setIndex((current) => {
        const next = (current + delta + slides.length) % slides.length;
        onSlideChange?.(next);
        return next;
      });
    },
    [onSlideChange, slides.length],
  );
  useEffect(() => {
    if (!autoPlay || slides.length < 2) return;
    const timer = window.setInterval(() => move(1), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, interval, move, slides.length]);
  return (
    <div ref={ref} className={cx('main-vban-wrap', 'bg', className)}>
      <div className="inner">
        <div className="vb-swiper">
          <div className="swiper">
            <ul className="swiper-wrapper">
              {slides.map((slide) => (
                <li className="swiper-slide" key={slide.id}>
                  <div className="in">
                    <div className="text">
                      <p className="tit">
                        {slide.title} <br className="w-hide" />
                        {slide.title}
                      </p>
                      <p className="txt">
                        {slide.description} <br className="w-hide" />
                        {slide.description}
                      </p>
                      <a href={slide.href ?? '#'} className="krds-btn primary">
                        {actionLabel}
                      </a>
                    </div>
                    <div className="im">
                      <CarouselImage {...(imageLabel === undefined ? {} : { label: imageLabel })} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="swiper-button-prev" onClick={() => move(-1)}>
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button type="button" className="swiper-button-next" onClick={() => move(1)}>
            <span className="sr-only">{nextLabel}</span>
          </button>
          <div className="swiper-indicator text-center">
            <div className="swiper-pagination" />
            <a href="#" className="swiper-button-more">
              <span className="sr-only">{moreLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
export const CarouselBanner = forwardRef<HTMLDivElement, CarouselProps>(function CarouselBanner(
  {
    slides = [],
    label: _label,
    autoPlay = true,
    previousLabel,
    nextLabel,
    moreLabel,
    playLabel,
    stopLabel,
    imageLabel,
    onSlideChange,
    onPlayingChange,
    className,
  },
  ref,
) {
  const [, setIndex] = useState(0);
  const [, setPlaying] = useState(autoPlay);
  const move = (delta: number) => {
    if (!slides.length) return;
    setIndex((current) => {
      const next = (current + delta + slides.length) % slides.length;
      onSlideChange?.(next);
      return next;
    });
  };
  const updatePlaying = (next: boolean) => {
    setPlaying(next);
    onPlayingChange?.(next);
  };
  return (
    <div ref={ref} className={cx('main-d-ban-swiper', className)}>
      <div className="swiper">
        <ul className="swiper-wrapper">
          {slides.map((slide) => (
            <li className="swiper-slide" key={slide.id}>
              <div className="text">
                <p className="cate">{slide.description}</p>
                <p className="tit">{slide.title}</p>
              </div>
              <div className="im">
                <CarouselImage {...(imageLabel === undefined ? {} : { label: imageLabel })} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="swiper-indicator">
        <div className="swiper-pagination" />
        <div className="swiper-controller">
          <button
            type="button"
            className="swiper-button-play"
            onClick={() => updatePlaying(true)}
          >
            <span className="sr-only">{playLabel}</span>
          </button>
          <button
            type="button"
            className="swiper-button-stop"
            onClick={() => updatePlaying(false)}
          >
            <span className="sr-only">{stopLabel}</span>
          </button>
        </div>
        <div className="swiper-navigation">
          <button type="button" className="swiper-button-prev" onClick={() => move(-1)}>
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button type="button" className="swiper-button-next" onClick={() => move(1)}>
            <span className="sr-only">{nextLabel}</span>
          </button>
          <a href="#" className="swiper-button-more">
            <span className="sr-only">{moreLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
});

export interface ChoiceChipProps
  extends NativeCommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  type?: 'checkbox' | 'radio';
  size?: 'small' | 'medium' | 'large';
}
export const CheckboxChip = forwardRef<HTMLInputElement, ChoiceChipProps>(function CheckboxChip(
  { label, size, className, id: providedId, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-checkbox-chip-${generatedId}`;
  return (
    <div className={cx('krds-form-chip', size, className)}>
      <input {...props} ref={ref} id={id} type="checkbox" className="checkbox" />
      <label className="krds-form-chip-outline" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
export const RadioChip = forwardRef<HTMLInputElement, ChoiceChipProps>(function RadioChip(
  { label, size, className, id: providedId, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-radio-chip-${generatedId}`;
  return (
    <div className={cx('krds-form-chip', size, className)}>
      <input {...props} ref={ref} id={id} type="radio" className="radio" />
      <label className="krds-form-chip-outline" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
export function CheckboxSize(props: ComponentProps<typeof Checkbox>) {
  return <Checkbox {...props} />;
}
export function RadioSize(props: ComponentProps<typeof Radio>) {
  return <Radio {...props} />;
}

export interface CoachMarkProps extends BoxProps {
  title?: string;
  step?: string;
  stepTitle?: ReactNode;
  description?: ReactNode;
  contentTitle?: ReactNode;
  currentStep?: ReactNode;
  totalSteps?: ReactNode;
  stopLabel?: ReactNode;
  nextLabel?: ReactNode;
  onNext?: () => void;
  onClose?: () => void;
}
export function CoachMark({
  title,
  step = '1 / 1',
  stepTitle,
  description,
  contentTitle,
  currentStep,
  totalSteps,
  stopLabel,
  nextLabel,
  onNext,
  onClose,
  children,
  className,
}: CoachMarkProps) {
  const [stepCurrent = '', stepTotal = ''] = step.split('/').map((part) => part.trim());
  return (
    <div className={cx('txt-box', 'bg-white', 'bg-white', 'krds-coach-mark', className)}>
      <div className="coach-balloon">
        <h5 className="sr-only">{title}</h5>
        <h6 className="coach-tit">{stepTitle}</h6>
        <p className="desc">{description}</p>
        <div className="coach-controls">
          <div className="num">
            <span className="sr-only">현재 단계</span>
            <strong>{currentStep ?? stepCurrent}</strong>
            <span className="sr-only">총 단계</span>
            <span>{totalSteps ?? stepTotal}</span>
          </div>
          <div className="btn-wrap">
            <button type="button" className="krds-btn small text" onClick={onClose}>
              {stopLabel}
            </button>
            <button type="button" className="krds-btn small tertiary" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
      <div className="coach-point">
        <h3>{children ?? contentTitle}</h3>
      </div>
    </div>
  );
}

export interface ContextualHelpProps extends Omit<BoxProps, 'position' | 'open'> {
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  caption?: ReactNode;
  title?: ReactNode;
  linkLabel?: ReactNode;
  href?: string;
  closeLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function ContextualHelp({
  label,
  position = 'top-left',
  caption,
  title,
  linkLabel,
  href = '#',
  closeLabel,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: ContextualHelpProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const generatedId = useId();
  const popoverId = `krds-contextual-help-${generatedId}`;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div className={cx('krds-contextual-help', ...position.split('-'), className)}>
      <p className="tooltip-txt">{caption}</p>
      <div className="tooltip-action">
        <button
          type="button"
          className="krds-btn medium icon tooltip-btn"
          aria-expanded={open}
          aria-controls={popoverId}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{label}</span>
          <SvgIcon name="ico-tooltip" />
        </button>
        <div id={popoverId} className="tooltip-popover" role="tooltip">
          <h4 className="tooltip-title">{title}</h4>
          <div className="tooltip-contents">
            <p>{children}</p>
            {linkLabel ? (
              <div className="btn-wrap">
                <a href={href} className="krds-btn xsmall link basic">
                  {linkLabel} <SvgIcon name="ico-angle right" />
                </a>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="krds-btn xsmall icon tooltip-close"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{closeLabel}</span>
            <SvgIcon name="ico-modal-close" />
          </button>
        </div>
      </div>
    </div>
  );
}

export interface CriticalAlertItem {
  id?: string;
  badge?: ReactNode;
  badgeLabel?: ReactNode;
  tone?: 'danger' | 'ok' | 'info';
  message?: ReactNode;
  title?: ReactNode;
  text?: ReactNode;
  href?: string;
  linkLabel?: ReactNode;
}
export interface CriticalAlertsProps extends Omit<BoxProps, 'items'> {
  items?: Array<string | CriticalAlertItem>;
}
export function CriticalAlerts({ items = [], className }: CriticalAlertsProps) {
  return (
    <ul className={cx('krds-critical-alerts', className)} role="alert">
      {items.map((rawItem, index) => {
        const item: CriticalAlertItem =
          typeof rawItem === 'string' ? { message: rawItem } : rawItem;
        const badgeTone =
          item.tone ??
          (item.badge === 'danger' || item.badge === 'ok' || item.badge === 'info'
            ? item.badge
            : undefined);
        const badgeLabel =
          item.badgeLabel ?? (item.badge === badgeTone ? undefined : item.badge);
        const message = item.message ?? item.text ?? item.title;
        return (
          <li key={item.id ?? index}>
            <div className="critical-ban">
              {badgeLabel ? (
                <span className={cx('critical-badge', badgeTone)}>{badgeLabel}</span>
              ) : null}
              <p className="critical-txt">{message}</p>
              {item.linkLabel ? (
                <a href={item.href ?? '#'} className="krds-btn medium link basic">
                  <span className="m-hide">{item.linkLabel}</span>
                  <SvgIcon name="ico-angle right" />
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export interface DisclosureProps
  extends
    Omit<BoxProps, 'id' | 'items' | 'open'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title' | 'onToggle' | 'className'> {
  title: ReactNode;
  items?: ReactNode[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onToggle?: MouseEventHandler<HTMLButtonElement>;
}
export function Disclosure({
  title,
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onToggle,
  children,
  id: providedId,
  className,
  ...props
}: DisclosureProps) {
  const generatedId = useId();
  const panelId = providedId ?? `krds-disclosure-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  return (
    <div {...props} className={cx('krds-disclosure', 'conts-expand-area', className)}>
      <button
        id={`${panelId}-trigger`}
        type="button"
        className="btn-conts-expand"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={(event) => {
          const next = !open;
          onToggle?.(event);
          if (event.defaultPrevented) return;
          if (controlledOpen === undefined) setUncontrolledOpen(next);
          onOpenChange?.(next);
        }}
      >
        {title}
      </button>
      <div
        id={panelId}
        className="expand-wrap"
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        inert={!open}
      >
        <div className="expand-in">
          {items ? (
            <ul className="krds-info-list dash" role="list">
              {items.map((item, index) => (
                <li role="listitem" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export interface FaviconProps
  extends Omit<LinkHTMLAttributes<HTMLLinkElement>, 'href' | 'rel' | 'size' | 'sizes' | 'type'> {
  href?: string;
  size?: string;
  sizes?: string;
  type?: string;
}
export const Favicon = forwardRef<HTMLLinkElement, FaviconProps>(function Favicon(
  { href, size, sizes, type, ...props },
  ref,
) {
  return (
    <link
      {...props}
      ref={ref}
      rel="icon"
      href={href}
      sizes={sizes ?? size}
      type={type}
    />
  );
});

export interface FileUploadItem {
  id: string;
  name: ReactNode;
  status?: 'uploading' | 'complete' | 'deletable' | 'error' | 'downloadable';
  statusLabel?: ReactNode;
  deleteLabel?: ReactNode;
  errors?: ReactNode[];
  downloadLabel?: ReactNode;
  previewLabel?: ReactNode;
}
export interface FileUploadProps
  extends NativeCommonProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  prompt?: ReactNode;
  inputId?: string;
  selectLabel?: ReactNode;
  currentCount?: number;
  maxCount?: number;
  countSuffix?: ReactNode;
  files?: FileUploadItem[];
  deleteAllLabel?: ReactNode;
  label?: string;
  onFilesChange?: (files: File[]) => void;
  onDelete?: (item: FileUploadItem) => void;
  onDeleteAll?: () => void;
  onDownload?: (item: FileUploadItem) => void;
  onPreview?: (item: FileUploadItem) => void;
  className?: string;
}
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    title,
    description,
    prompt,
    inputId: providedInputId,
    selectLabel,
    currentCount,
    maxCount,
    countSuffix,
    files: controlledFiles,
    deleteAllLabel,
    label: _label,
    onFilesChange,
    onDelete,
    onDeleteAll,
    onDownload,
    onPreview,
    className,
    onChange,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = providedInputId ?? id ?? `krds-file-upload-${generatedId}`;
  const [selectedFiles, setSelectedFiles] = useState<FileUploadItem[]>([]);
  const files = controlledFiles ?? selectedFiles;
  const countSuffixText =
    typeof countSuffix === 'string' || typeof countSuffix === 'number'
      ? String(countSuffix)
      : '';
  const currentCountText = `${currentCount ?? files.length}${countSuffixText} `;
  const maxCountText = `/ ${maxCount ?? ''}${countSuffixText}`;
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.currentTarget.files ?? []);
    setSelectedFiles(next.map((file, index) => ({ id: `${index}`, name: file.name })));
    onFilesChange?.(next);
    onChange?.(event);
  };
  return (
    <div className={cx('krds-file-upload', 'line', className)}>
      <div className="file-head">
        <h3 className="tit">{title}</h3>
        <div>
          <p>{description}</p>
        </div>
      </div>
      <div className="file-upload">
        <p className="txt">{prompt}</p>
        <div className="file-upload-btn-wrap">
          <input {...props} ref={ref} hidden id={inputId} type="file" onChange={change} />
          <label htmlFor={inputId}>
            <button type="button" className="krds-btn medium">
              <SvgIcon name="ico-upload" />
              {selectLabel}
            </button>
          </label>
        </div>
      </div>
      <div className="file-list">
        <div className="total">
          <span className="current">{currentCountText}</span>
          {maxCountText}
        </div>
        <ul className="upload-list">
          {files.map((file) => (
            <li className={file.status === 'error' ? 'is-error' : undefined} key={file.id}>
              <div className={cx('file-info', file.status === 'downloadable' && 'm-column')}>
                <div className="file-name">{file.name}</div>
                <div className="btn-wrap">
                  {file.status === 'uploading' ? (
                    <span className="krds-spinner" role="status">
                      <span className="sr-only">{file.statusLabel}</span>
                    </span>
                  ) : null}
                  {file.status === 'complete' ? (
                    <span className="complete ico-invalid">
                      <em className="sr-only">{file.statusLabel}</em>
                    </span>
                  ) : null}
                  {file.deleteLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onDelete?.(file)}
                    >
                      {file.deleteLabel}
                      <SvgIcon name="ico-delete-fill" />
                    </button>
                  ) : null}
                  {file.downloadLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onDownload?.(file)}
                    >
                      {file.downloadLabel}
                      <SvgIcon name="ico-down" />
                    </button>
                  ) : null}
                  {file.previewLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onPreview?.(file)}
                    >
                      {file.previewLabel}
                      <SvgIcon name="ico-angle right" />
                    </button>
                  ) : null}
                </div>
              </div>
              {file.errors?.length ? (
                <p className="file-hint-invalid">
                  {file.errors.map((error, index) => (
                    <Fragment key={index}>
                      {index ? <br /> : null}
                      {error}
                    </Fragment>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="upload-delete-btn">
          <button
            type="button"
            className="krds-btn xsmall tertiary"
            onClick={onDeleteAll}
          >
            {deleteAllLabel}
            <SvgIcon name="ico-angle right" />
          </button>
        </div>
      </div>
    </div>
  );
});

export interface FooterLink {
  id?: string;
  label: ReactNode;
  href?: string;
  target?: string;
  title?: string;
  icon?: string;
  emphasis?: boolean;
}
export interface FooterProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  relatedSites?: FooterLink[];
  logoLabel?: ReactNode;
  address?: ReactNode;
  contacts?: Array<{ title: ReactNode; description?: ReactNode }>;
  links?: FooterLink[];
  socialLinks?: FooterLink[];
  policyLinks?: FooterLink[];
  copyright?: ReactNode;
  organization?: ReactNode;
  description?: ReactNode;
  onRelatedSite?: (item: FooterLink) => void;
}
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  {
    relatedSites = [],
    logoLabel,
    address,
    contacts = [],
    links = [],
    socialLinks = [],
    policyLinks = [],
    copyright,
    organization,
    description,
    onRelatedSite,
    id = 'krds-footer',
    className,
    ...props
  },
  ref,
) {
  return (
    <footer {...props} ref={ref} id={id} className={className}>
      <div className="foot-quick">
        <div className="inner">
          {relatedSites.map((item) => (
            <button
              type="button"
              className="link"
              title={item.title}
              onClick={() => onRelatedSite?.(item)}
              key={item.id ?? String(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="inner">
        <div className="f-logo">
          <span className="sr-only">{logoLabel}</span>
        </div>
        <div className="f-cnt">
          <div className="f-info">
            <p className="info-addr">{address}</p>
            <ul className="info-cs">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <strong className="strong">{contact.title}</strong>
                  <span className="span">{contact.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="f-link">
            <div className="link-go">
              {links.map((item) => (
                <a
                  href={item.href ?? '#'}
                  className="krds-btn medium text"
                  target={item.target}
                  title={item.title}
                  key={item.id ?? String(item.label)}
                >
                  {item.label}
                  <SvgIcon name="ico-angle right" />
                </a>
              ))}
            </div>
            <div className="link-sns">
              {socialLinks.map((item) => (
                <a
                  href={item.href ?? '#'}
                  className="krds-btn xlarge icon border"
                  target={item.target}
                  title={item.title}
                  key={item.id ?? String(item.label)}
                >
                  <span className="sr-only">{item.label}</span>
                  <SvgIcon name={`ico-${item.icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="f-btm">
          <div className="f-btm-text">
            <div className="f-menu">
              {policyLinks.map((item) => (
                <a
                  href={item.href ?? '#'}
                  className={item.emphasis ? 'point' : undefined}
                  key={item.id ?? String(item.label)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <p className="f-copy">{copyright}</p>
          </div>
          <div className="krds-identifier">
            <span className="logo">
              <span className="sr-only">{organization}</span>
            </span>
            <span className="ban-txt">{description}</span>
          </div>
        </div>
      </div>
    </footer>
  );
});

export interface HeaderUtilitySubItem extends Omit<MainMenuItem, 'children'> {
  className?: string;
  selected?: boolean;
}
export interface HeaderUtilityItem extends Omit<MainMenuItem, 'children'> {
  kind: 'link' | 'dropdown' | 'resize';
  items?: HeaderUtilitySubItem[];
  selectedLabel?: ReactNode;
  resetLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (id: string) => void;
  onReset?: () => void;
}
export interface HeaderMyMenu {
  label?: ReactNode;
  userName?: ReactNode;
  timeLabel?: ReactNode;
  time?: ReactNode;
  extendLabel?: ReactNode;
  items?: MainMenuItem[];
  logoutLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExtend?: () => void;
  onLogout?: () => void;
}
export interface HeaderMobileMenu {
  id?: string;
  utilityItems?: MainMenuItem[];
  loginLabel?: ReactNode;
  serviceItems?: MainMenuItem[];
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: ReactNode;
  items?: MainMenuItem[];
  bottomItems?: MainMenuItem[];
  previousLabel?: ReactNode;
  closeLabel?: ReactNode;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPrevious?: () => void;
  onClose?: () => void;
}
export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  children?: ReactNode;
  title?: ReactNode;
  utilityItems?: HeaderUtilityItem[];
  logoLabel?: ReactNode;
  logoHref?: string;
  searchLabel?: ReactNode;
  searchTitle?: string;
  loginLabel?: ReactNode;
  loginHref?: string;
  joinLabel?: ReactNode;
  allMenuLabel?: ReactNode;
  myMenu?: HeaderMyMenu;
  desktopItems?: MainMenuItem[];
  nav?: MainMenuItem[];
  links?: MainMenuItem[];
  menuLabel?: string;
  mobileMenu?: HeaderMobileMenu;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

function HeaderUtilityMenu({ item }: { item: HeaderUtilityItem }) {
  const generatedId = useId();
  const menuId = `krds-header-utility-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(item.defaultOpen ?? false);
  const controlledSelectedId = item.items?.find((entry) => entry.selected)?.id;
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState(controlledSelectedId);
  const open = item.open ?? uncontrolledOpen;
  const selectedId = controlledSelectedId ?? uncontrolledSelectedId;
  const setMenuOpen = (next: boolean) => {
    if (item.open === undefined) setUncontrolledOpen(next);
    item.onOpenChange?.(next);
  };
  if (item.kind === 'link') {
    return (
      <a
        href={item.href ?? '#'}
        className="krds-btn small text"
        target={item.target}
        title={item.title}
      >
        {item.label}
        <SvgIcon name="ico-go" />
      </a>
    );
  }
  return (
    <div className={cx('krds-drop-wrap', item.kind === 'resize' && 'krds-resize')}>
      <button
        type="button"
        className={cx('krds-btn', 'small', 'text', 'drop-btn', open && 'active')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setMenuOpen(!open)}
      >
        {item.label}
        <SvgIcon name="ico-toggle" />
      </button>
      <div id={menuId} className="drop-menu">
        <div className="drop-in">
          <ul className="drop-list">
            {item.items?.map((entry, index) => {
              const entryId = entry.id ?? String(index);
              const selected = selectedId === entryId;
              return (
                <li key={entryId}>
                  {item.kind === 'resize' ? (
                    <button
                      type="button"
                      className={cx('item-link', entry.className, selected && 'active')}
                      disabled={entry.disabled}
                      onClick={() => {
                        if (controlledSelectedId === undefined) setUncontrolledSelectedId(entryId);
                        item.onSelect?.(entryId);
                        setMenuOpen(false);
                      }}
                    >
                      {entry.label}
                      {selected && item.selectedLabel ? (
                        <span className="sr-only"> {item.selectedLabel}</span>
                      ) : null}
                    </button>
                  ) : (
                    <a
                      href={entry.href ?? '#'}
                      className={cx('item-link', entry.className, selected && 'active')}
                      target={entry.target}
                      title={entry.title}
                      aria-disabled={entry.disabled || undefined}
                      onClick={() => {
                        if (entry.disabled) return;
                        if (controlledSelectedId === undefined) setUncontrolledSelectedId(entryId);
                        item.onSelect?.(entryId);
                        setMenuOpen(false);
                      }}
                    >
                      {entry.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          {item.kind === 'resize' ? (
            <div className="drop-bottom">
              <button
                type="button"
                className="krds-btn medium text"
                onClick={() => {
                  if (controlledSelectedId === undefined) {
                    setUncontrolledSelectedId(controlledSelectedId);
                  }
                  item.onReset?.();
                  setMenuOpen(false);
                }}
              >
                <SvgIcon name="ico-reset" />
                {item.resetLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    id = 'krds-header',
    children: _children,
    title: _title,
    utilityItems = [],
    logoLabel,
    logoHref,
    searchLabel,
    searchTitle,
    loginLabel,
    loginHref,
    joinLabel,
    allMenuLabel,
    myMenu,
    desktopItems,
    nav,
    links,
    menuLabel,
    mobileMenu,
    mobileOpen: controlledMobileOpen,
    defaultMobileOpen = false,
    onMobileOpenChange,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const myMenuId = `krds-header-my-menu-${generatedId}`;
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen);
  const [uncontrolledMyMenuOpen, setUncontrolledMyMenuOpen] = useState(
    myMenu?.defaultOpen ?? false,
  );
  const mobileOpen = controlledMobileOpen ?? uncontrolledMobileOpen;
  const myMenuOpen = myMenu?.open ?? uncontrolledMyMenuOpen;
  const menuItems = desktopItems ?? nav ?? links ?? [];
  const mobileId = mobileMenu?.id ?? 'mobile-nav';
  const setMobileOpen = (next: boolean) => {
    if (controlledMobileOpen === undefined) setUncontrolledMobileOpen(next);
    onMobileOpenChange?.(next);
  };
  const setMyMenuOpen = (next: boolean) => {
    if (myMenu?.open === undefined) setUncontrolledMyMenuOpen(next);
    myMenu?.onOpenChange?.(next);
  };
  return (
    <header {...props} ref={ref} id={id} className={className}>
      <div className="header-in">
        <div className="header-container">
          <div className="inner">
            <div className="header-utility">
              <ul className="utility-list">
                {utilityItems.map((item, index) => (
                  <li key={item.id ?? index}>
                    <HeaderUtilityMenu item={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="header-branding">
              <h2 className="logo">
                <a href={logoHref}>
                  <span className="sr-only">{logoLabel}</span>
                </a>
              </h2>
              <div className="header-actions">
                <button type="button" className="btn-navi sch" title={searchTitle}>
                  {searchLabel}
                </button>
                <a href={loginHref} className="btn-navi login">
                  {loginLabel}
                </a>
                <button type="button" className="btn-navi join">
                  {joinLabel}
                </button>
                {myMenu ? (
                  <div className="krds-drop-wrap my-drop">
                    <button
                      type="button"
                      className={cx('btn-navi', 'my', 'drop-btn', myMenuOpen && 'active')}
                      aria-expanded={myMenuOpen}
                      aria-controls={myMenuId}
                      onClick={() => setMyMenuOpen(!myMenuOpen)}
                    >
                      {myMenu.label}
                    </button>
                    <div id={myMenuId} className="drop-menu">
                      <div className="drop-in">
                        <div className="drop-top">
                          <p className="my-name">{myMenu.userName}</p>
                          <dl className="my-time">
                            <dt>{myMenu.timeLabel}</dt>
                            <dd>
                              <span className="time">{myMenu.time}</span>
                              <button
                                type="button"
                                className="krds-btn medium text"
                                onClick={myMenu.onExtend}
                              >
                                {myMenu.extendLabel}
                              </button>
                            </dd>
                          </dl>
                        </div>
                        <ul className="drop-list">
                          {myMenu.items?.map((item, index) => (
                            <li key={item.id ?? index}>
                              <a href={item.href ?? '#'} className="item-link">
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <div className="drop-bottom">
                          <button
                            type="button"
                            className="krds-btn medium text"
                            onClick={myMenu.onLogout}
                          >
                            <SvgIcon name="ico-logout" />
                            {myMenu.logoutLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="btn-navi all"
                  aria-controls={mobileId}
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {allMenuLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
        <MainMenuPc
          items={menuItems}
          {...(menuLabel !== undefined ? { menuLabel } : {})}
          sample={false}
        />
      </div>
      {mobileMenu ? (
        <MainMenuMobile
          id={mobileId}
          {...(mobileMenu.utilityItems !== undefined
            ? { utilityItems: mobileMenu.utilityItems }
            : {})}
          {...(mobileMenu.loginLabel !== undefined
            ? { loginLabel: mobileMenu.loginLabel }
            : {})}
          {...(mobileMenu.serviceItems !== undefined
            ? { serviceItems: mobileMenu.serviceItems }
            : {})}
          {...(mobileMenu.searchPlaceholder !== undefined
            ? { searchPlaceholder: mobileMenu.searchPlaceholder }
            : {})}
          {...(mobileMenu.searchTitle !== undefined
            ? { searchTitle: mobileMenu.searchTitle }
            : {})}
          {...(mobileMenu.searchLabel !== undefined
            ? { searchLabel: mobileMenu.searchLabel }
            : {})}
          {...(mobileMenu.items !== undefined ? { items: mobileMenu.items } : {})}
          {...(mobileMenu.bottomItems !== undefined
            ? { bottomItems: mobileMenu.bottomItems }
            : {})}
          {...(mobileMenu.previousLabel !== undefined
            ? { previousLabel: mobileMenu.previousLabel }
            : {})}
          {...(mobileMenu.closeLabel !== undefined
            ? { closeLabel: mobileMenu.closeLabel }
            : {})}
          sample={false}
          standalone={false}
          bottomSize="medium"
          {...(mobileOpen ? { className: 'is-open' } : {})}
          {...(mobileMenu.onSearchChange !== undefined
            ? { onSearchChange: mobileMenu.onSearchChange }
            : {})}
          {...(mobileMenu.onSearch !== undefined ? { onSearch: mobileMenu.onSearch } : {})}
          {...(mobileMenu.onPrevious !== undefined
            ? { onPrevious: mobileMenu.onPrevious }
            : {})}
          onClose={() => {
            mobileMenu.onClose?.();
            setMobileOpen(false);
          }}
        />
      ) : null}
    </header>
  );
});

export interface HelpPanelTab {
  id: string;
  label: ReactNode;
  panelId: string;
  value?: string;
  disabled?: boolean;
}
export interface HelpPanelLink {
  id?: string;
  label: ReactNode;
  href?: string;
  target?: string;
  title?: string;
  icon?: string;
}
export interface HelpPanelRelatedGroup {
  id?: string;
  title: ReactNode;
  links: HelpPanelLink[];
}
export interface HelpPanelTask {
  id?: string;
  title: ReactNode;
  current?: boolean;
  summary: ReactNode;
  steps: ReactNode[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface HelpPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title' | 'onChange'> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  activeTab?: string;
  defaultActiveTab?: string;
  tabs?: HelpPanelTab[];
  label?: ReactNode;
  title?: ReactNode;
  selectedLabel?: ReactNode;
  helpTitle?: ReactNode;
  helpDescription?: ReactNode;
  downloadLinks?: HelpPanelLink[];
  relatedGroups?: HelpPanelRelatedGroup[];
  tutorialTitle?: ReactNode;
  tutorialBackTitle?: string;
  backTitle?: string;
  externalTitle?: string;
  tasks?: HelpPanelTask[];
  stopLabel?: ReactNode;
  collapseLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onActiveTabChange?: (tab: string) => void;
  onStop?: () => void;
}

function HelpTaskDisclosure({
  task,
  panelId,
}: {
  task: HelpPanelTask;
  panelId: string;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(task.defaultOpen ?? false);
  const open = task.open ?? uncontrolledOpen;
  return (
    <div className={cx('krds-disclosure', 'conts-expand-area', open && 'active')}>
      <button
        type="button"
        className="btn-conts-expand"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          if (task.open === undefined) setUncontrolledOpen(next);
          task.onOpenChange?.(next);
        }}
      >
        {task.summary}
      </button>
      <div id={panelId} className="expand-wrap" inert={!open}>
        <div className="expand-in">
          <ul className="krds-info-list decimal">
            {task.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const HelpPanelSurface = forwardRef<
  HTMLDivElement,
  HelpPanelProps & { tutorialDefault?: boolean }
>(function HelpPanelSurface(
  {
    tutorialDefault = false,
    children,
    open: controlledOpen,
    defaultOpen = false,
    activeTab: controlledActiveTab,
    defaultActiveTab,
    tabs = [],
    label,
    title,
    selectedLabel,
    helpTitle,
    helpDescription,
    downloadLinks = [],
    relatedGroups = [],
    tutorialTitle,
    tutorialBackTitle,
    backTitle,
    externalTitle,
    tasks = [],
    stopLabel,
    collapseLabel,
    onOpenChange,
    onActiveTabChange,
    onStop,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const initialTab =
    defaultActiveTab ??
    (tutorialDefault
      ? (tabs.find((tab) => tab.value === 'tutorial')?.value ??
        tabs.find((tab) => tab.value === 'tutorial')?.id)
      : undefined) ??
    tabs[0]?.value ??
    tabs[0]?.id ??
    '';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState(initialTab);
  const open = controlledOpen ?? uncontrolledOpen;
  const activeTab = controlledActiveTab ?? uncontrolledActiveTab;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const setActiveTab = (next: string) => {
    if (controlledActiveTab === undefined) setUncontrolledActiveTab(next);
    onActiveTabChange?.(next);
  };
  return (
    <div {...props} ref={ref} className={cx('krds-help-panel', open && 'expand', className)}>
      <div className="help-panel-wrap" tabIndex={open ? 0 : undefined}>
        <div className="help-conts-area">
          <div className="krds-tab-area layer">
            <div className="tab line">
              <ul role="tablist">
                {tabs.map((tab) => {
                  const tabValue = tab.value ?? tab.id;
                  const active = tabValue === activeTab;
                  return (
                    <li
                      role="none"
                      key={tab.id}
                    >
                      <button
                        id={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls={tab.panelId}
                        tabIndex={active ? 0 : -1}
                        className="btn-tab"
                        disabled={tab.disabled}
                        onClick={() => {
                          if (!tab.disabled) setActiveTab(tabValue);
                        }}
                      >
                        {tab.label}
                        {active && selectedLabel ? (
                          <i className="sr-only created"> {selectedLabel}</i>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="tab-conts-wrap">
              {tabs.map((tab, tabIndex) => {
                const tabValue = tab.value ?? tab.id;
                const active = tabValue === activeTab;
                const helpTab = tabValue === 'help' || (tabIndex === 0 && tabValue !== 'tutorial');
                return (
                  <section
                    id={tab.panelId}
                    role="tabpanel"
                    aria-labelledby={tab.id}
                    className={cx('tab-conts', active && 'active')}
                    key={tab.panelId}
                  >
                    <h3 className="sr-only">{tab.label}</h3>
                    <div className="help-conts-area-inner">
                      {helpTab ? (
                        <>
                          <div className="conts-area help-conts">
                            <div className="conts-wrap">
                              <h4 className="help-title">
                                {helpTitle}
                                <span className="krds-btn medium icon">
                                  <span className="sr-only">{label ?? title}</span>
                                  <SvgIcon name="ico-help" />
                                </span>
                              </h4>
                              <div className="conts-desc">
                                <p>{helpDescription ?? children}</p>
                              </div>
                              <ul className="link-list">
                                {downloadLinks.map((link, index) => (
                                  <li key={link.id ?? index}>
                                    <a
                                      href={link.href ?? '#'}
                                      target={link.target}
                                      title={link.title ?? externalTitle}
                                      className="krds-btn xsmall link basic"
                                    >
                                      {link.label}
                                      <SvgIcon name="ico-go" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="conts-area related-service">
                            {relatedGroups.map((group, groupIndex) => (
                              <div className="conts-wrap" key={group.id ?? groupIndex}>
                                <h4 className="help-title">{group.title}</h4>
                                <ul className="link-list">
                                  {group.links.map((link, linkIndex) => {
                                    const icon = link.icon
                                      ? link.icon.startsWith('ico-')
                                        ? link.icon
                                        : `ico-${link.icon}`
                                      : undefined;
                                    return (
                                      <li key={link.id ?? linkIndex}>
                                        <a
                                          href={link.href ?? '#'}
                                          className="krds-btn xsmall link basic"
                                        >
                                          {icon ? <SvgIcon name={icon} /> : null}
                                          {link.label}
                                          {!icon ? <SvgIcon name="ico-angle right" /> : null}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="conts-area">
                            <h4 className="help-title">
                              <a href="#;" title={tutorialBackTitle ?? backTitle}>
                                {tutorialTitle}
                              </a>
                            </h4>
                            <ul className="coach-help-process">
                              {tasks.map((task, taskIndex) => (
                                <li key={task.id ?? taskIndex}>
                                  <h4 className={cx('tit', task.current && 'current')}>
                                    {task.title}
                                  </h4>
                                  <HelpTaskDisclosure
                                    task={task}
                                    panelId={`krds-help-task-${generatedId}-${taskIndex}`}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="help-panel-action">
                            <button
                              type="button"
                              className="krds-btn medium secondary coach-btn-stop"
                              onClick={onStop}
                            >
                              {stopLabel}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="krds-btn small tertiary btn-help-panel fold"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{label ?? title}</span>
            {collapseLabel}
            <SvgIcon name="ico-angle right" />
          </button>
        </div>
      </div>
    </div>
  );
});

export const HelpPanel = forwardRef<HTMLDivElement, HelpPanelProps>(function HelpPanel(props, ref) {
  return <HelpPanelSurface {...props} ref={ref} />;
});
export const TutorialPanel = forwardRef<HTMLDivElement, HelpPanelProps>(
  function TutorialPanel(props, ref) {
    return <HelpPanelSurface {...props} ref={ref} tutorialDefault />;
  },
);

export interface IdentifierProps extends BoxProps {
  organization?: string;
  description?: string;
}
export const Identifier = forwardRef<HTMLDivElement, IdentifierProps>(function Identifier(
  {
    organization = 'KRDS - Korea Design System',
    description,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div {...props} ref={ref} className={cx('krds-identifier', className)}>
      <span className="logo">
        <span className="sr-only">{organization}</span>
      </span>
      <span className="ban-txt">{children ?? description}</span>
    </div>
  );
});

export interface InPageNavigationProps extends BoxProps {
  items?: KrdsNavItem[];
  title?: string;
  pageTitle?: ReactNode;
  actionLabel?: ReactNode;
  actionInfo?: ReactNode;
  actionCount?: ReactNode;
  onAction?: () => void;
}
export function InPageNavigation({
  items = [],
  title,
  pageTitle,
  actionLabel,
  actionInfo,
  actionCount,
  onAction,
  className,
}: InPageNavigationProps) {
  return (
    <div className={cx('krds-in-page-navigation-area', className)}>
      <div className="in-page-navigation-header">
        <p className="quick-caption">{title}</p>
        <p className="quick-title">{pageTitle}</p>
      </div>
      <nav className="in-page-navigation-list">
        <ul>
          {items.map((item) => (
            <li key={item.id ?? item.label}>
              <a className={item.current ? 'active' : undefined} href={item.href ?? '#'}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="in-page-navigation-action">
        <button type="button" className="krds-btn medium" onClick={onAction}>
          {actionLabel}
        </button>
        <p className="quick-info">
          {actionInfo} {actionCount ? <strong>{actionCount}</strong> : null}
        </p>
      </div>
    </div>
  );
}

export interface LanguageOption extends KrdsOption {
  href?: string;
  lang?: string;
  target?: string;
  title?: string;
  external?: boolean;
}
export interface LanguageSwitcherProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  languages?: LanguageOption[];
  options?: LanguageOption[];
  value?: string;
  selected?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  label?: ReactNode;
  currentLabel?: ReactNode;
  selectedLabel?: ReactNode;
  externalTitle?: string;
  text?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}
const LanguageMenu = forwardRef<
  HTMLDivElement,
  LanguageSwitcherProps & { page: boolean }
>(function LanguageMenu(
  {
    page,
    languages,
    options,
    value,
    selected,
    defaultValue,
    open: controlledOpen,
    defaultOpen = false,
    label,
    currentLabel,
    selectedLabel,
    externalTitle,
    text,
    onChange,
    onOpenChange,
    className,
    ...props
  },
  ref,
) {
  const items = languages?.length ? languages : (options ?? []);
  const generatedId = useId();
  const menuId = `krds-language-menu-${generatedId}`;
  const controlledValue = value ?? selected;
  const valueControlled = value !== undefined || selected !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? items[0]?.value ?? '',
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedValue = controlledValue ?? uncontrolledValue;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const select = (next: string) => {
    if (!valueControlled) setUncontrolledValue(next);
    onChange?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const current = items.find((language) => language.value === selectedValue);
  const links = page
    ? items.filter((language) => language.value !== selectedValue)
    : items;
  return (
    <div
      {...props}
      ref={ref}
      className={cx('krds-drop-wrap', 'krds-language', className)}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx('krds-btn', 'small', 'text', 'drop-btn', open && 'active')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <SvgIcon name="ico-global" />
        {label}
        <SvgIcon name="ico-toggle" />
      </button>
      <div id={menuId} className="drop-menu">
        <div className="drop-in">
          {page ? (
            <div className="drop-top">
              <p className="current-laguage">
                <span>{currentLabel}</span>
                <strong>{current?.label}</strong>
              </p>
            </div>
          ) : null}
          <ul className="drop-list">
            {links.map((language) => {
              const external = page || language.external || language.target === '_blank';
              const active = !page && selectedValue === language.value;
              return (
                <li key={language.value}>
                  <a
                    href={language.href ?? '#'}
                    className={cx('item-link', active && 'active')}
                    lang={language.lang ?? language.value}
                    target={language.target ?? (external ? '_blank' : undefined)}
                    title={language.title ?? (external ? externalTitle ?? text : undefined)}
                    aria-disabled={language.disabled || undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (!language.disabled) select(language.value);
                    }}
                  >
                    {language.label}
                    {page ? <SvgIcon name="ico-go" /> : null}
                    {active && selectedLabel ? (
                      <span className="sr-only"> {selectedLabel}</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
});
export const LanguageSwitcher = forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  function LanguageSwitcher(props, ref) {
    return <LanguageMenu {...props} ref={ref} page={false} />;
  },
);
export const LanguageSwitcherPage = forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  function LanguageSwitcherPage(props, ref) {
    return <LanguageMenu {...props} ref={ref} page />;
  },
);

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  label?: ReactNode;
}
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { external = false, label: _label, children, className, href = '#', target, rel, title, ...props },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      href={href}
      className={cx('krds-btn', 'small', 'link', className)}
      target={external ? '_blank' : target}
      rel={rel}
      title={external ? (title ?? '새 창 열림') : title}
    >
      <span className="underline">{children}</span>
      <SvgIcon name={external ? 'ico-go' : 'ico-angle right'} />
    </a>
  );
});

interface MainMenuDescriptionItem {
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  target?: string;
  externalTitle?: string;
}
interface MainMenuBanner {
  badge?: ReactNode;
  label?: ReactNode;
}
export interface MainMenuItem extends Omit<KrdsNavItem, 'children' | 'title'> {
  active?: boolean;
  button?: boolean;
  target?: string;
  title?: string;
  titleHref?: string;
  titleLinkLabel?: ReactNode;
  descriptionItems?: MainMenuDescriptionItem[];
  banner?: MainMenuBanner;
  children?: MainMenuItem[];
}
function MainMenuBannerView({ banner }: { banner?: MainMenuBanner }) {
  return banner ? (
    <div className="gnb-sub-banner">
      {banner.badge ? (
        <span className="krds-badge bg-secondary">{banner.badge}</span>
      ) : null}
      {banner.label ? (
        <button type="button" className="krds-btn medium text">
          {banner.label}
          <SvgIcon name="ico-angle right" />
        </button>
      ) : null}
    </div>
  ) : null;
}
export interface MainMenuPcProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items?: MainMenuItem[];
  menuLabel?: string;
  sample?: boolean;
  onItemChange?: (id: string) => void;
}
export const MainMenuPc = forwardRef<HTMLElement, MainMenuPcProps>(function MainMenuPc(
  {
    items = [],
    menuLabel,
    sample = true,
    className,
    onItemChange,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const [openTop, setOpenTop] = useState(items.find((item) => item.active)?.id);
  const [openSub, setOpenSub] = useState(
    items.flatMap((item) => item.children ?? []).find((item) => item.active)?.id,
  );
  const renderSubContent = (item: MainMenuItem) => (
    <>
      <div className="gnb-sub-content">
        {item.title ? (
          <h2 className="sub-title">
            {item.titleHref ? (
              <>
                {item.title}
                <a href={item.titleHref} className="krds-btn link basic small">
                  <span className="underline">{item.titleLinkLabel}</span>
                  <SvgIcon name="ico-angle right" />
                </a>
              </>
            ) : (
              <span>{item.title}</span>
            )}
          </h2>
        ) : null}
        {item.descriptionItems?.length ? (
          <ul className="type-description">
            {item.descriptionItems.map((description, index) => (
              <li key={index}>
                <h3 className="tit">
                  <a
                    href={description.href ?? '#'}
                    target={description.target}
                    title={description.externalTitle}
                  >
                    {description.title}
                    {description.target ? <SvgIcon name="ico-go" /> : null}
                  </a>
                </h3>
                {description.description ? (
                  <p className="txt">{description.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : item.children?.length ? (
          <ul>
            {item.children.map((child) => (
              <li key={child.id ?? child.label}>
                {child.href ? (
                  <a href={child.href}>{child.label}</a>
                ) : (
                  <button type="button">{child.label}</button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {item.banner ? <MainMenuBannerView banner={item.banner} /> : null}
    </>
  );
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? menuLabel}
      className={cx('krds-main-menu', sample && 'sample', className)}
    >
      <div className="inner">
        <ul className="gnb-menu" aria-label={menuLabel}>
          {items.map((item) => {
            if (item.href) {
              return (
                <li key={item.id ?? item.label}>
                  <a
                    href={item.href}
                    className="gnb-main-trigger is-link"
                    data-trigger="gnb"
                    target={item.target}
                    title={item.title}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            if (item.button) {
              return (
                <li key={item.id ?? item.label}>
                  <button type="button" className="gnb-main-trigger is-link" data-trigger="gnb">
                    {item.label}
                  </button>
                </li>
              );
            }
            const topOpen = openTop === item.id;
            const single = Boolean(item.title);
            return (
              <li key={item.id ?? item.label}>
                <button
                  type="button"
                  className={cx('gnb-main-trigger', topOpen && 'active')}
                  data-trigger="gnb"
                  onClick={() => {
                    const next = topOpen ? undefined : item.id;
                    setOpenTop(next);
                    if (next) onItemChange?.(next);
                  }}
                >
                  {item.label}
                </button>
                <div className={cx('gnb-toggle-wrap', topOpen && 'is-open')}>
                  <div className="gnb-main-list" data-has-submenu={single ? undefined : 'true'}>
                    {single ? (
                      <div className="gnb-sub-list single-list between">
                        {renderSubContent(item)}
                      </div>
                    ) : (
                      <ul>
                        {item.children?.map((subItem, subIndex) => {
                          if (subItem.href) {
                            return (
                              <li key={subItem.id ?? subItem.label}>
                                <a
                                  href={subItem.href}
                                  className={cx(
                                    'gnb-sub-trigger',
                                    'is-link',
                                    subItem.target && 'external-link',
                                  )}
                                  data-trigger="gnb"
                                  target={subItem.target}
                                  title={subItem.title}
                                >
                                  {subItem.label}
                                </a>
                              </li>
                            );
                          }
                          const subOpen = openSub === subItem.id;
                          return (
                            <li key={subItem.id ?? subItem.label}>
                              <button
                                type="button"
                                className={cx('gnb-sub-trigger', subOpen && 'active')}
                                data-trigger="gnb"
                                onClick={() => {
                                  const next = subOpen ? undefined : subItem.id;
                                  setOpenSub(next);
                                  if (next) onItemChange?.(next);
                                }}
                              >
                                {subItem.label}
                              </button>
                              <div
                                className={cx(
                                  'gnb-sub-list',
                                  subOpen && 'active',
                                  subIndex > 0 && 'between',
                                )}
                              >
                                {renderSubContent(subItem)}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
});
export interface MainMenuMobileProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  utilityItems?: MainMenuItem[];
  loginLabel?: ReactNode;
  serviceItems?: MainMenuItem[];
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: ReactNode;
  searchValue?: string;
  defaultSearchValue?: string;
  items?: MainMenuItem[];
  bottomItems?: MainMenuItem[];
  previousLabel?: ReactNode;
  closeLabel?: ReactNode;
  bottomSize?: 'small' | 'medium';
  sample?: boolean;
  standalone?: boolean;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPrevious?: () => void;
  onClose?: () => void;
}
export const MainMenuMobile = forwardRef<HTMLDivElement, MainMenuMobileProps>(
  function MainMenuMobile(
    {
      utilityItems = [],
      loginLabel,
      serviceItems = [],
      searchPlaceholder,
      searchTitle,
      searchLabel,
      searchValue: controlledSearchValue,
      defaultSearchValue = '',
      items = [],
      bottomItems = [],
      previousLabel,
      closeLabel,
      bottomSize = 'small',
      sample = true,
      standalone = true,
      onSearchChange,
      onSearch,
      onPrevious,
      onClose,
      id = 'mobile-nav',
      role,
      style,
      className,
      ...props
    },
    ref,
  ) {
    const [uncontrolledSearchValue, setUncontrolledSearchValue] =
      useState(defaultSearchValue);
    const searchValue = controlledSearchValue ?? uncontrolledSearchValue;
    const searchAriaLabel =
      typeof searchLabel === 'string' && searchLabel.trim()
        ? searchLabel
        : searchTitle ?? searchPlaceholder ?? '검색';
    return (
      <div
        {...props}
        ref={ref}
        id={id}
        role={standalone ? (role ?? 'navigation') : role}
        className={cx('krds-main-menu-mobile', sample && 'sample', className)}
        style={
          standalone
            ? { display: 'block', position: 'static', visibility: 'visible', ...style }
            : style
        }
      >
        <div className="gnb-wrap">
          <div className="gnb-header">
            <div className="gnb-utils">
              <ul className="utility-list">
                {utilityItems.map((item) => (
                  <li key={item.id ?? item.label}>
                    <button type="button" className="krds-btn xsmall text">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gnb-login">
              <button type="button" className="krds-btn large text">
                <SvgIcon name="ico-log" />
                {loginLabel}
              </button>
            </div>
            <div className="gnb-service-menu">
              {serviceItems.map((item) => (
                <a href={item.href ?? '#'} className="link" key={item.id ?? item.label}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="sch-input">
              <input
                type="text"
                className="krds-input"
                placeholder={searchPlaceholder}
                title={searchTitle}
                aria-label={searchAriaLabel}
                onChange={(event) => {
                  const next = event.currentTarget.value;
                  if (controlledSearchValue === undefined) setUncontrolledSearchValue(next);
                  onSearchChange?.(next);
                }}
              />
              <button
                type="button"
                className="krds-btn medium icon ico-search"
                onClick={() => onSearch?.(searchValue)}
              >
                <span className="sr-only">{searchLabel}</span>
                <SvgIcon name="ico-sch" />
              </button>
            </div>
          </div>
          <div className="gnb-body">
            <div className="gnb-menu">
              <div className="menu-wrap">
                <ul>
                  {items.map((item) => (
                    <li key={item.id ?? item.label}>
                      <a href={`#${item.id}`} className="gnb-main-trigger">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="submenu-wrap">
                {items.map((item) => (
                  <div className="gnb-sub-list" id={item.id} key={item.id ?? item.label}>
                    <h2 className="sub-title">{item.label}</h2>
                    <ul>
                      {item.children?.map((second) => (
                        <li key={second.id ?? second.label}>
                          <a
                            href={second.href ?? '#'}
                            className={cx(
                              'gnb-sub-trigger',
                              second.children?.length && 'has-depth3',
                            )}
                          >
                            {second.label}
                          </a>
                          {second.children?.length ? (
                            <div className="depth3-wrap">
                              <ul>
                                {second.children.map((third) => (
                                  <li key={third.id ?? third.label}>
                                    <a
                                      href={third.href ?? '#'}
                                      className={cx(
                                        'depth3-trigger',
                                        third.children?.length && 'has-depth4',
                                      )}
                                    >
                                      {third.label}
                                    </a>
                                    {third.children?.length ? (
                                      <div className="depth4-wrap">
                                        <div className="depth4-head">
                                          <button
                                            type="button"
                                            className="krds-btn icon trigger-prev"
                                            onClick={onPrevious}
                                          >
                                            <span className="sr-only">{previousLabel}</span>
                                            <SvgIcon name="ico-angle left" />
                                          </button>
                                          <button
                                            type="button"
                                            className="krds-btn icon trigger-close"
                                            onClick={onClose}
                                          >
                                            <span className="sr-only">{closeLabel}</span>
                                            <SvgIcon name="ico-popup-close" />
                                          </button>
                                        </div>
                                        <ul className="depth4-body">
                                          <h4 className="sub-title">{third.title}</h4>
                                          <ul className="depth4-ul">
                                            {third.children.map((fourth) => (
                                              <li key={fourth.id ?? fourth.label}>
                                                <a href={fourth.href ?? '#'}>{fourth.label}</a>
                                              </li>
                                            ))}
                                          </ul>
                                        </ul>
                                      </div>
                                    ) : null}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="gnb-bottom">
              {bottomItems.map((item, index) => (
                <a
                  href={item.href ?? '#'}
                  className={cx('krds-btn', bottomSize, 'text')}
                  target={item.target}
                  title={item.title}
                  key={item.id ?? index}
                >
                  {item.label}
                  <SvgIcon name={item.target ? 'ico-go' : 'ico-angle right'} />
                </a>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="krds-btn medium icon"
            id="close-nav"
            onClick={onClose}
          >
            <span className="sr-only">{closeLabel}</span>
            <SvgIcon name="ico-popup-close" />
          </button>
        </div>
      </div>
    );
  },
);

export interface MastheadProps extends BoxProps {
  message?: ReactNode;
}
export const Masthead = forwardRef<HTMLDivElement, MastheadProps>(function Masthead(
  { id = 'krds-masthead', message, className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} id={id} className={className}>
      <div className="toggle-wrap">
        <div className="toggle-head">
          <div className="inner">
            <span className="nuri-txt">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title' | 'onKeyDown'> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  title: ReactNode;
  description?: ReactNode;
  items?: ReactNode[];
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  closeLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onCancel?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onCancelAction?: () => void;
  onConfirm?: () => void;
  onKeyDown?: HTMLAttributes<HTMLElement>['onKeyDown'];
}
export const Modal = forwardRef<HTMLElement, ModalProps>(function Modal(
  {
    open: controlledOpen,
    defaultOpen = false,
    title,
    description,
    items,
    cancelLabel,
    confirmLabel,
    closeLabel,
    onOpenChange,
    onClose,
    onCancel,
    onCancelAction,
    onConfirm,
    id,
    children,
    className,
    onKeyDown,
    onMouseDown,
    'aria-labelledby': ariaLabelledBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const dialogId = id ?? `krds-modal-${generatedId}`;
  const titleId = `${dialogId}-title`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const modalRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  useImperativeHandle(ref, () => modalRef.current as HTMLElement, []);

  const focusableElements = () =>
    Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[autofocus], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const close = () => {
    setOpen(false);
    onClose?.();
  };

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (open && !wasOpenRef.current) {
      const activeElement = modal.ownerDocument.activeElement;
      const view = modal.ownerDocument.defaultView;
      restoreFocusRef.current =
        view && activeElement instanceof view.HTMLElement && !modal.contains(activeElement)
          ? activeElement
          : null;
      focusableElements()[0]?.focus();
    } else if (!open && wasOpenRef.current) {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
      restoreFocusRef.current = null;
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(
    () => () => {
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    },
    [],
  );

  return (
    <section
      {...props}
      ref={modalRef}
      id={dialogId}
      className={cx('krds-modal', 'fade', open && 'in', open && 'shown', className)}
      role="dialog"
      aria-labelledby={joinAriaIds(ariaLabelledBy, titleId)}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (
          !event.defaultPrevented &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          focusableElements()[0]?.focus();
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Escape' || event.key === 'Esc') {
          onCancel?.(event);
          if (!event.defaultPrevented) {
            event.preventDefault();
            close();
          }
          return;
        }
        if (event.key !== 'Tab' || !open) return;
        const focusables = focusableElements();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeElement = modalRef.current?.ownerDocument.activeElement;
        if (event.shiftKey && (activeElement === first || !activeElement || !contentRef.current?.contains(activeElement))) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content" ref={contentRef}>
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
          </div>
          <div className="modal-conts">
            <div className="conts-area">
              {items?.length
                ? items.map((item, index) => (
                    <Fragment key={index}>
                      {item}
                      {index < items.length - 1 ? <br /> : null}
                    </Fragment>
                  ))
                : children ?? description}
            </div>
          </div>
          <div className="modal-btn btn-wrap">
            <button
              type="button"
              className="krds-btn medium tertiary close-modal"
              onClick={() => {
                onCancelAction?.();
                close();
              }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="krds-btn medium primary close-modal"
              onClick={() => {
                onConfirm?.();
                close();
              }}
            >
              {confirmLabel}
            </button>
          </div>
          <button
            type="button"
            className="krds-btn medium icon btn-close close-modal"
            onClick={close}
          >
            <span className="sr-only">{closeLabel}</span>
            <SvgIcon name="ico-popup-close" />
          </button>
        </div>
      </div>
      <div className={cx('modal-back', open && 'in')} />
    </section>
  );
});
export const ModalSample = Modal;

export interface PaginationProps extends Omit<CommonProps, 'items'> {
  items?: KrdsPaginationItem[];
  current?: number;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  navigationLabel?: string;
  onPageChange?: (page: number) => void;
  className?: string;
  children?: ReactNode;
}
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(function Pagination(
  {
    items = [1, 2, 3, 4, 5],
    current = 1,
    previousDisabled = current <= 1,
    nextDisabled = current >= Math.max(...items.filter((item): item is number => item !== 'ellipsis')),
    previousLabel = '이전',
    nextLabel = '다음',
    navigationLabel = '페이지 이동',
    onPageChange,
    className,
  },
  ref,
) {
  const pageLink = (page: number) => (
    <a
      className={cx('page-link', page === current && 'active')}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onPageChange?.(page);
      }}
      key={page}
    >
      {page === current ? <span className="sr-only">현재페이지 </span> : null}
      {page}
    </a>
  );
  return (
    <div
      ref={ref}
      className={cx('krds-pagination', className)}
      role="navigation"
      aria-label={navigationLabel}
    >
      {previousDisabled ? (
        <span {...{ href: '#' }} className="page-navi prev disabled">
          {previousLabel}
        </span>
      ) : (
        <a
          className="page-navi prev"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onPageChange?.(current - 1);
          }}
        >
          {previousLabel}
        </a>
      )}
      <div className="page-links">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span className="page-link link-dot" key={`ellipsis-${index}`} />
          ) : (
            pageLink(item)
          ),
        )}
      </div>
      {nextDisabled ? (
        <span {...{ href: '#' }} className="page-navi next disabled">
          {nextLabel}
        </span>
      ) : (
        <a
          className="page-navi next"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onPageChange?.(current + 1);
          }}
        >
          {nextLabel}
        </a>
      )}
    </div>
  );
});

export interface ResizeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  label?: ReactNode;
  options?: KrdsOption[];
  value?: string;
  selected?: string;
  defaultValue?: string;
  selectedLabel?: ReactNode;
  resetLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
}
export const Resize = forwardRef<HTMLDivElement, ResizeProps>(function Resize(
  {
    className,
    label,
    options = [],
    value,
    selected,
    defaultValue,
    selectedLabel,
    resetLabel,
    open: controlledOpen,
    defaultOpen = false,
    onChange,
    onOpenChange,
    onReset,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const menuId = `krds-resize-menu-${generatedId}`;
  const controlledValue = value ?? selected;
  const valueControlled = value !== undefined || selected !== undefined;
  const resetValue = defaultValue ?? options[0]?.value ?? '';
  const [uncontrolledValue, setUncontrolledValue] = useState(resetValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedValue = controlledValue ?? uncontrolledValue;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const select = (next: string) => {
    if (!valueControlled) setUncontrolledValue(next);
    onChange?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <div
      {...props}
      ref={ref}
      className={cx('krds-drop-wrap', 'krds-resize', className)}
      data-adjust="scale"
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx('krds-btn', 'small', 'text', 'drop-btn', open && 'active')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        {label}
        <SvgIcon name="ico-toggle" />
      </button>
      <div id={menuId} className="drop-menu">
        <div className="drop-in">
          <ul className="drop-list">
            {options.map((option) => {
              const active = selectedValue === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cx('item-link', option.value, active && 'active')}
                    data-adjust-scale={option.value}
                    disabled={option.disabled}
                    onClick={() => select(option.value)}
                  >
                    {option.label}
                    {active && selectedLabel ? (
                      <span className="sr-only"> {selectedLabel}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="drop-bottom">
            <button
              type="button"
              className="krds-btn medium text"
              data-adjust-scale={resetValue}
              onClick={() => {
                select(resetValue);
                onReset?.();
              }}
            >
              <SvgIcon name="ico-reset" />
              {resetLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export interface SelectOption extends KrdsOption {
  selected?: boolean;
}
export interface SelectProps
  extends
    NativeCommonProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'>,
    LabelProps {
  options?: SelectOption[];
  state?: 'default' | 'error' | 'complete';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'size' | 'state' | 'sorting';
  className?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options = [],
    label = '선택',
    hint,
    id: providedId,
    state = 'default',
    size,
    variant = 'default',
    className,
    children,
    title = '선택',
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-select-${generatedId}`;
  const selectClass =
    variant === 'sorting'
      ? 'krds-form-select-sort'
      : cx(
          'krds-form-select',
          variant === 'size' && size,
          (variant === 'state' || state === 'error') && state === 'error' && 'is-error',
          className,
        );
  return (
    <>
      <select {...props} ref={ref} id={id} className={selectClass} title={title}>
        {children ??
          options.map((option, index) => (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              disabled={option.disabled}
              selected={option.selected ?? (variant === 'size' && index === 0)}
            >
              {option.label}
            </option>
          ))}
      </select>
      <label htmlFor={id}>{label}</label>
      {hint ? <p>{hint}</p> : null}
    </>
  );
});
export const SelectSize = forwardRef<HTMLSelectElement, SelectProps>(function SelectSize(
  props,
  ref,
) {
  return <Select {...props} ref={ref} variant="size" size={props.size ?? 'large'} />;
});
export const SelectState = forwardRef<HTMLSelectElement, SelectProps>(function SelectState(
  props,
  ref,
) {
  return <Select {...props} ref={ref} variant="state" state={props.state ?? 'error'} />;
});
export const SelectSorting = forwardRef<
  HTMLSelectElement,
  Omit<SelectProps, 'label'> & { label?: string }
>(function SelectSorting(props, ref) {
  return <Select {...props} ref={ref} variant="sorting" />;
});

export interface SideNavigationItem extends Omit<KrdsNavItem, 'children'> {
  description?: ReactNode;
  title?: ReactNode;
  target?: string;
  children?: SideNavigationItem[];
}
export interface SideNavigationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  items?: SideNavigationItem[];
  links?: SideNavigationItem[];
  title?: ReactNode;
  expandedItems?: string[];
  defaultExpandedItems?: string[];
  onExpandedChange?: (ids: string[]) => void;
}

function SideNavigationPopup({
  item,
  panelId,
}: {
  item: SideNavigationItem;
  panelId: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);
  return (
    <li className="lnb-subitem" role="none">
      <button
        ref={triggerRef}
        type="button"
        className="lnb-btn lnb-toggle-popup"
        role="menuitem"
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="true"
        disabled={item.disabled}
        onClick={() => setOpen(true)}
      >
        {item.label}
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={cx('lnb-submenu-lv2', open && 'active')}
        role="menu"
        onBlur={(event) => {
          if (!panelRef.current?.contains(event.relatedTarget as Node)) {
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <button
          ref={titleRef}
          type="button"
          className="lnb-btn-tit"
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          {item.description ?? item.title}
        </button>
        <ul>
          {item.children?.map((leaf, index) => (
            <li role="none" key={leaf.id ?? index}>
              <a
                href={leaf.href ?? '#'}
                className="lnb-btn"
                role="menuitem"
                aria-current={leaf.current ? 'page' : undefined}
                target={leaf.target}
                title={leaf.title as string | undefined}
              >
                {leaf.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export const SideNavigation = forwardRef<HTMLElement, SideNavigationProps>(
  function SideNavigation(
    {
      items,
      links,
      title,
      expandedItems: controlledExpandedItems,
      defaultExpandedItems,
      onExpandedChange,
      className,
      ...props
    },
    ref,
  ) {
    const navigationItems = items?.length ? items : (links ?? []);
    const generatedId = useId();
    const [uncontrolledExpandedItems, setUncontrolledExpandedItems] = useState(
      defaultExpandedItems ??
        navigationItems
          .filter(
            (item) =>
              item.current ||
              item.children?.some(
                (child) => child.current || child.children?.some((leaf) => leaf.current),
              ),
          )
          .map((item, index) => item.id ?? String(index)),
    );
    const expandedItems = controlledExpandedItems ?? uncontrolledExpandedItems;
    const setExpandedItems = (next: string[]) => {
      if (controlledExpandedItems === undefined) setUncontrolledExpandedItems(next);
      onExpandedChange?.(next);
    };
    return (
      <nav {...props} ref={ref} className={cx('krds-side-navigation', className)}>
        <h2 className="lnb-tit">{title}</h2>
        <ul className="lnb-list" role="menubar">
          {navigationItems.map((item, topIndex) => {
            const itemId = item.id ?? String(topIndex);
            const submenuId = `krds-side-${generatedId}-${topIndex}`;
            const expanded = expandedItems.includes(itemId);
            return (
              <li className={cx('lnb-item', expanded && 'active')} role="none" key={itemId}>
                <button
                  type="button"
                  className={cx('lnb-btn', 'lnb-toggle', expanded && 'active')}
                  role="menuitem"
                  aria-controls={submenuId}
                  aria-expanded={expanded}
                  disabled={item.disabled}
                  onClick={() =>
                    setExpandedItems(
                      expanded
                        ? expandedItems.filter((id) => id !== itemId)
                        : [...expandedItems, itemId],
                    )
                  }
                >
                  {item.label}
                </button>
                <div className="lnb-submenu">
                  <ul id={submenuId} role="menu">
                    {item.children?.map((child, childIndex) =>
                      child.children?.length ? (
                        <SideNavigationPopup
                          item={child}
                          panelId={`${submenuId}-${childIndex}`}
                          key={child.id ?? childIndex}
                        />
                      ) : (
                        <li
                          className={cx('lnb-subitem', child.current && 'active')}
                          role="none"
                          key={child.id ?? childIndex}
                        >
                          <a
                            href={child.href ?? '#'}
                            className="lnb-btn lnb-link"
                            role="menuitem"
                            aria-current={child.current ? 'page' : undefined}
                            target={child.target}
                            title={child.title as string | undefined}
                          >
                            {child.label}
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);
export const SkipLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { label?: ReactNode }
>(function SkipLink(
  { href = '#main', label: _label, children = '본문 바로가기', className, id, ...props },
  ref,
) {
  return (
    <div id={id ?? 'krds-skip-link'} className={className}>
      <a {...props} ref={ref} href={href}>
        {children}
      </a>
    </div>
  );
});
export const Spinner = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { label?: string }
>(function Spinner({ label = '처리 중', className, ...props }, ref) {
  return (
    <div {...props} ref={ref} className={cx('krds-spinner', className)} role="status">
      <span className="sr-only">{label}</span>
    </div>
  );
});

export function StepIndicator({
  steps,
  current = 0,
  className,
}: {
  steps: KrdsStep[];
  current?: number;
  className?: string;
}) {
  return (
    <ol className={cx('krds-step-wrap', className)}>
      {steps.map((step, index) => (
        <li
          className={cx(index < current && 'done', index === current && 'active')}
          key={step.id}
        >
          <span>
            {index === current ? <em className="sr-only">현재단계</em> : null}
            <i className="step">{index + 1}단계</i>
            <span className="step-tit">{step.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export interface StructuredListItem extends Omit<KrdsListItem, 'title' | 'description'> {
  title: ReactNode;
  description?: ReactNode;
  badgeClass?: string;
}
export interface StructuredListProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  items: StructuredListItem[];
  dateLabel?: ReactNode;
  dateValue?: ReactNode;
  tags?: ReactNode[];
  actionLabel?: ReactNode;
  shareLabel?: ReactNode;
  favoriteLabel?: ReactNode;
  onShare?: (item: StructuredListItem) => void;
  onFavorite?: (item: StructuredListItem) => void;
}
export const StructuredList = forwardRef<HTMLUListElement, StructuredListProps>(
  function StructuredList(
    {
      items,
      dateLabel,
      dateValue,
      tags = [],
      actionLabel,
      shareLabel,
      favoriteLabel,
      onShare,
      onFavorite,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <ul
        {...props}
        ref={ref}
        className={cx('krds-structured-list', 'type-full', className)}
      >
        {items.map((item) => (
          <li className="structured-item" key={item.id}>
            <div className="in">
              <div className="card-top">
                {item.badge ? (
                  <span className={cx('krds-badge', item.badgeClass)}>{item.badge}</span>
                ) : null}
              </div>
              <div className="card-body">
                <a href={item.href ?? '#'} className="c-text">
                  <p className="c-tit">
                    <span className="span">{item.title}</span>
                  </p>
                  {item.description ? <p className="c-txt">{item.description}</p> : null}
                  <p className="c-date">
                    <strong className="key">{dateLabel}</strong>
                    <span className="value">{dateValue}</span>
                  </p>
                </a>
                <div className="c-btn">
                  <a
                    href={item.href ?? '#'}
                    className="krds-btn secondary"
                    title={typeof item.title === 'string' ? item.title : undefined}
                  >
                    {actionLabel}
                  </a>
                </div>
              </div>
              <div className="card-btm">
                {tags.map((tag, index) => (
                  <span className="tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-btn">
                <button
                  type="button"
                  className="krds-btn medium text"
                  title={typeof item.title === 'string' ? item.title : undefined}
                  onClick={() => onShare?.(item)}
                >
                  <SvgIcon name="ico-share" />
                  {shareLabel}
                </button>
                <button
                  type="button"
                  className="krds-btn medium text"
                  title={typeof item.title === 'string' ? item.title : undefined}
                  onClick={() => onFavorite?.(item)}
                >
                  <SvgIcon name="ico-like" />
                  {favoriteLabel}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  },
);

export interface StructuredListTableAction {
  id?: string;
  label: ReactNode;
  icon?: string;
}
export interface DataTableColumn extends KrdsTableColumn {
  width?: string;
  visuallyHidden?: boolean;
}
export interface StructuredListTableRow
  extends Record<string, string | number | boolean | undefined> {
  id: string;
  selected?: boolean;
}
export interface StructuredListTableProps {
  columns: DataTableColumn[];
  rows: StructuredListTableRow[];
  caption?: ReactNode;
  className?: string;
  selectAllLabel?: ReactNode;
  actions?: StructuredListTableAction[];
  countLabel?: ReactNode;
  countOptions?: string[];
  sortLabel?: ReactNode;
  sortOptions?: string[];
  sortValue?: string;
  pagination?: {
    current: number;
    items: Array<number | 'ellipsis'>;
    previousDisabled?: boolean;
    previousLabel?: ReactNode;
    nextLabel?: ReactNode;
    currentLabel?: ReactNode;
  };
  onSelectionChange?: (ids: string[]) => void;
  onDownload?: (row: StructuredListTableRow) => void;
}
export const StructuredListTable = forwardRef<HTMLDivElement, StructuredListTableProps>(
  function StructuredListTable(
    {
      columns,
      rows,
      caption,
      className: _className,
      selectAllLabel = '전체선택',
      actions = [],
      countLabel,
      countOptions = [],
      sortLabel,
      sortOptions = [],
      sortValue,
      pagination,
      onSelectionChange,
      onDownload,
    },
    ref,
  ) {
    const generatedId = useId();
    const countId = `krds-table-count-${useId()}`;
    const sortId = `krds-table-sort-${useId()}`;
    const controlled = rows.some((row) => row.selected !== undefined);
    const [selectedIds, setSelectedIds] = useState(
      () => new Set(rows.filter((row) => row.selected).map((row) => row.id)),
    );
    const selected = controlled
      ? new Set(rows.filter((row) => row.selected).map((row) => row.id))
      : selectedIds;
    const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
    const toggle = (row: StructuredListTableRow) => {
      const next = new Set(selected);
      if (next.has(row.id)) next.delete(row.id);
      else next.add(row.id);
      if (!controlled) setSelectedIds(next);
      onSelectionChange?.([...next]);
    };
    const toggleAll = (checked: boolean) => {
      const next = checked ? new Set(rows.map((row) => row.id)) : new Set<string>();
      if (!controlled) setSelectedIds(next);
      onSelectionChange?.([...next]);
    };
    const pageItems = pagination?.items ?? [];
    const pageMax = Math.max(
      1,
      ...pageItems.filter((item): item is number => item !== 'ellipsis'),
    );
    const pageLink = (page: number) => (
      <a
        className={cx('page-link', page === pagination?.current && 'active')}
        href="#"
        onClick={(event) => event.preventDefault()}
        key={page}
      >
        {page === pagination?.current ? (
          <span className="sr-only">{pagination.currentLabel}</span>
        ) : null}
        {page}
      </a>
    );
    return (
      <div ref={ref} className={cx('krds-structured-list-table', _className || 'sample')}>
        <div className="search-list-top">
          <div className="sch-left">
            <div className="krds-check-area">
              <div className="krds-form-check">
                <input
                  type="checkbox"
                  className="chk"
                  id={generatedId}
                  checked={allSelected}
                  onChange={(event) => toggleAll(event.currentTarget.checked)}
                />
                <label htmlFor={generatedId}>{selectAllLabel}</label>
              </div>
            </div>
            <ul className="side-line-ul">
              {actions.map((action, index) => (
                <li key={action.id ?? index}>
                  <button type="button" className="krds-btn medium text">
                    <SvgIcon name={`ico-${action.icon ?? 'down'}`} />
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <ul className="sch-sort">
            <li>
              <strong className="sort-label">
                <label htmlFor={countId}>{countLabel}</label>
              </strong>
              <select
                className="krds-form-select-sort"
                id={countId}
              >
                {countOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </li>
            <li>
              <strong className="sort-label">
                <label htmlFor={sortId}>{sortLabel}</label>
              </strong>
              <div className="w-sort-btn">
                {sortOptions.map((option) => (
                  <button
                    type="button"
                    className={option === sortValue ? 'active' : undefined}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="m-sort-btn">
                <select
                  className="krds-form-select-sort"
                  id={sortId}
                >
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </li>
          </ul>
        </div>
        <div className="krds-table-wrap">
          <table className="tbl col data">
            <caption>{caption}</caption>
            <colgroup>
              {columns.map((column) => (
                <col style={column.width ? { width: column.width } : undefined} key={column.key} />
              ))}
              <col />
            </colgroup>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th scope="col" key={column.key}>
                    {column.visuallyHidden ? (
                      <span className="sr-only">{column.label}</span>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column, columnIndex) => {
                    if (column.key === 'selected') {
                      const inputId = `krds-table-${generatedId}-${row.id}`;
                      return (
                        <th scope="row" key={column.key}>
                          <div className="krds-form-check">
                            <input
                              type="checkbox"
                              className="chk"
                              id={inputId}
                              checked={selected.has(row.id)}
                              onChange={() => toggle(row)}
                            />
                            <label htmlFor={inputId} />
                          </div>
                        </th>
                      );
                    }
                    if (column.key === 'download') {
                      return (
                        <td key={column.key}>
                          <button
                            type="button"
                            className="krds-btn medium text"
                            onClick={() => onDownload?.(row)}
                          >
                            <SvgIcon name="ico-down" />
                            {String(row[column.key] ?? '')}
                          </button>
                        </td>
                      );
                    }
                    if (columnIndex === 0) {
                      return (
                        <th scope="row" key={column.key}>
                          {String(row[column.key] ?? '')}
                        </th>
                      );
                    }
                    return <td key={column.key}>{String(row[column.key] ?? '')}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination ? (
          <div className="krds-pagination">
            {pagination.previousDisabled ? (
              <span {...{ href: '#' }} className="page-navi prev disabled">
                {pagination.previousLabel}
              </span>
            ) : (
              <a href="#" className="page-navi prev" onClick={(event) => event.preventDefault()}>
                {pagination.previousLabel}
              </a>
            )}
            <div className="page-links">
              {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                  <span className="page-link link-dot" key={`ellipsis-${index}`} />
                ) : (
                  pageLink(item)
                ),
              )}
            </div>
            {pagination.current >= pageMax ? (
              <span {...{ href: '#' }} className="page-navi next disabled">
                {pagination.nextLabel}
              </span>
            ) : (
              <a href="#" className="page-navi next" onClick={(event) => event.preventDefault()}>
                {pagination.nextLabel}
              </a>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

export interface TabItem extends Omit<KrdsTabItem, 'label'> {
  label: ReactNode;
  tabId?: string;
  panelId?: string;
  quickNav?: boolean;
}
export interface TabProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  tabs: TabItem[];
  panels: Record<string, ReactNode>;
  defaultTab?: string;
  defaultValue?: string;
  value?: string;
  selected?: string;
  message?: ReactNode;
  panelTitle?: ReactNode;
  full?: boolean;
  onTabChange?: (id: string) => void;
  onChange?: (id: string) => void;
}
export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  {
    tabs,
    panels,
    defaultTab,
    defaultValue,
    value,
    selected,
    message,
    panelTitle,
    full = true,
    onTabChange,
    onChange,
    className,
    ...props
  },
  ref,
) {
  const controlledSelected = value ?? selected;
  const selectedControlled = value !== undefined || selected !== undefined;
  const firstEnabled = tabs.find((tab) => !tab.disabled);
  const requestedDefault = defaultValue ?? defaultTab;
  const initialSelected =
    tabs.some((tab) => tab.id === requestedDefault && !tab.disabled)
      ? (requestedDefault ?? '')
      : (firstEnabled?.id ?? '');
  const [uncontrolledSelected, setUncontrolledSelected] = useState(initialSelected);
  const requestedSelected = controlledSelected ?? uncontrolledSelected;
  const activeTab =
    tabs.some((tab) => tab.id === requestedSelected && !tab.disabled)
      ? requestedSelected
      : (firstEnabled?.id ?? '');
  const selectTab = (id: string) => {
    const tab = tabs.find((item) => item.id === id);
    if (!tab || tab.disabled) return;
    if (!selectedControlled) setUncontrolledSelected(id);
    onTabChange?.(id);
    onChange?.(id);
  };
  return (
    <div {...props} ref={ref} className={cx('krds-tab-area', 'layer', className)}>
      <div className={cx('tab', 'line', full && 'full')}>
        <ul role="tablist">
          {tabs.map((tab) => {
            const tabId = tab.tabId ?? `tab_${tab.id}`;
            const panelId = tab.panelId ?? `panel_${tab.id}`;
            const active = activeTab === tab.id;
            return (
              <li
                role="none"
                className={active ? 'active' : undefined}
                key={tab.id}
              >
                <button
                  id={tabId}
                  type="button"
                  className="btn-tab"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  disabled={tab.disabled}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(event) => {
                    if (
                      !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)
                    ) {
                      return;
                    }
                    const buttons = Array.from(
                      event.currentTarget
                        .closest('ul')
                        ?.querySelectorAll<HTMLButtonElement>('.btn-tab:not(:disabled)') ?? [],
                    );
                    const currentIndex = buttons.indexOf(event.currentTarget);
                    const nextIndex =
                      event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? buttons.length - 1
                          : currentIndex + (event.key === 'ArrowRight' ? 1 : -1);
                    const nextButton = buttons[nextIndex];
                    if (nextButton) {
                      event.preventDefault();
                      nextButton.focus();
                    }
                  }}
                >
                  {tab.label}
                  {active && message ? (
                    <i className="sr-only created"> {message}</i>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="tab-conts-wrap">
        {tabs.map((tab) => {
          const tabId = tab.tabId ?? `tab_${tab.id}`;
          const panelId = tab.panelId ?? `panel_${tab.id}`;
          return (
            <section
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              className={cx('tab-conts', activeTab === tab.id && 'active')}
              data-quick-nav={tab.quickNav ?? false}
              hidden={activeTab !== tab.id}
              key={tab.id}
            >
              <h3 className="sr-only">{panelTitle}</h3>
              {panels[tab.id]}
            </section>
          );
        })}
      </div>
    </div>
  );
});

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: DataTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  caption?: ReactNode;
}
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { columns, rows, caption, className, ...props },
  ref,
) {
  return (
    <div className="krds-table-wrap">
    <table {...props} ref={ref} className={cx('tbl', 'col', 'data', className)}>
      <caption>{caption}</caption>
      <colgroup>
        {columns.map((column) => (
          <col style={column.width ? { width: column.width } : undefined} key={column.key} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map((column) => (
            <th scope="col" key={column.key}>
              {column.visuallyHidden ? (
                <span className="sr-only">{column.label}</span>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column, columnIndex) =>
              columnIndex === 0 ? (
                <th scope="row" key={column.key}>
                  {row[column.key]}
                </th>
              ) : (
                <td key={column.key}>{row[column.key]}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
});

export function Tag({
  label,
  tone,
  removable = true,
  onRemove,
  className,
}: {
  label: ReactNode;
  tone?: KrdsTone;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span className={cx('krds-btn-tag', tone && `bg-${toneClass[tone]}`, className)}>
      {label}
      {removable ? (
        <button type="button" className="btn-delete" onClick={onRemove}>
          <span className="sr-only">삭제</span>
        </button>
      ) : null}
    </span>
  );
}
export const TagLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { label?: ReactNode }
>(function TagLink({ href = '#', label, children, className, ...props }, ref) {
  return (
    <a {...props} ref={ref} href={href} className={cx('krds-btn-tag', 'link', className)}>
      {children ?? label}
    </a>
  );
});

export interface TextareaProps
  extends
    Omit<NativeCommonProps, 'rows'>,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'className'>,
    LabelProps {
  maxLength?: number;
  className?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label = '내용',
    hint,
    id: providedId,
    className,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-textarea-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <>
      <textarea
        {...props}
        ref={ref}
        id={id}
        className={cx('krds-input', className)}
        aria-describedby={ariaDescribedBy}
      />
      <label htmlFor={id}>{label}</label>
      {hint ? <p id={hintId}>{hint}</p> : null}
    </>
  );
});
export interface TextInputIconProps extends Omit<ComponentProps<typeof TextInput>, 'ref'> {
  icon?: ReactNode;
  error?: ReactNode;
}
export const TextInputIcon = forwardRef<HTMLInputElement, TextInputIconProps>(
  function TextInputIcon(
    {
      icon: _icon,
      label,
      hint,
      error: _error,
      state: _state,
      size,
      readonly,
      readOnly,
      id: providedId,
      className,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const id = providedId ?? `krds-input-icon-${generatedId}`;
    const hintId = hint ? `${id}-hint` : undefined;
    return (
      <>
        <input
          {...props}
          ref={ref}
          id={id}
          readOnly={readonly ?? readOnly}
          className={cx('krds-input', size, className)}
          aria-describedby={ariaDescribedBy}
        />
        <label htmlFor={id}>{label}</label>
        {hint ? <p id={hintId}>{hint}</p> : null}
      </>
    );
  },
);
export interface TextInputStateProps
  extends Omit<ComponentProps<typeof TextInput>, 'ref'> {
  error?: ReactNode;
}
export const TextInputState = forwardRef<HTMLInputElement, TextInputStateProps>(
  function TextInputState(
    {
      label,
      hint,
      error,
      state = 'error',
      size,
      readonly,
      readOnly,
      id: providedId,
      className,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const id = providedId ?? `krds-input-state-${generatedId}`;
    const message = error ?? hint;
    return (
      <div className="form-group">
        <div className="form-tit">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className={cx('form-conts', state !== 'default' && `is-${state}`)}>
          <input
            {...props}
            ref={ref}
            id={id}
            readOnly={readonly ?? readOnly}
            className={cx('krds-input', size, className)}
          />
        </div>
        {message ? (
          <p
            className={
              state === 'error'
                ? 'form-hint-invalid'
                : state === 'default'
                  ? 'form-hint'
                  : `form-hint-${state}`
            }
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);
type StructuredTextListItem = {
  id?: string;
  label?: ReactNode;
  title?: ReactNode;
  marker?: ReactNode;
  children?: TextListItem[];
};
export type TextListItem = ReactNode | StructuredTextListItem;

function isTextListReactNode(item: TextListItem): item is ReactNode {
  if (item === null || typeof item !== 'object' || isValidElement(item)) {
    return true;
  }
  if (Symbol.iterator in item) {
    return true;
  }
  if ('then' in item && typeof item.then === 'function') {
    return true;
  }
  return '$$typeof' in item;
}
function TextListItems({
  items,
  ordered,
  depth,
}: {
  items: TextListItem[];
  ordered: boolean;
  depth: number;
}) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return items.map((item, index) => {
    if (isTextListReactNode(item)) {
      return <li role="listitem" key={index}>{item}</li>;
    }
    const content = item.label ?? item.title;
    const marker = ordered
      ? (item.marker ??
        (depth === 0
          ? `${index + 1}. `
          : depth === 1
            ? `${alphabet[index] ?? index + 1}. `
            : String.fromCodePoint(0x2460 + index)))
      : null;
    const NestedList = ordered ? 'ol' : 'ul';
    const nestedClass = ordered ? 'ordered' : depth === 0 ? 'dash' : 'hollow';
    return (
      <li role="listitem" key={item.id ?? index}>
        {marker !== null ? <span className="num">{marker}</span> : null}
        {content}
        {item.children?.length ? (
          <NestedList role="list" className={cx('krds-info-list', nestedClass)}>
            <TextListItems items={item.children} ordered={ordered} depth={depth + 1} />
          </NestedList>
        ) : null}
      </li>
    );
  });
}
export function TextList({
  items = [],
  ordered = false,
  className,
}: {
  items?: TextListItem[];
  ordered?: boolean;
  className?: string;
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <List role="list" className={cx('krds-info-list', ordered ? 'ordered' : 'decimal', className)}>
      <TextListItems items={items} ordered={ordered} depth={0} />
    </List>
  );
}
export const TextListOrdered = (props: Omit<ComponentProps<typeof TextList>, 'ordered'>) => (
  <TextList {...props} ordered />
);

export interface TooltipProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  message?: ReactNode;
  placement?: 'horizontal' | 'vertical' | 'box';
}
export const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(function Tooltip(
  {
    label: _label,
    message,
    placement = 'horizontal',
    children,
    className,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    'aria-labelledby': ariaLabelledBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const tooltipId = `tooltip-popover-${generatedId}`;
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        {...props}
        ref={ref}
        type={props.type ?? 'button'}
        className={cx(
          'krds-btn',
          'small',
          'text',
          'krds-tooltip',
          placement === 'horizontal' ? undefined : `tooltip-${placement}`,
          className,
        )}
        data-tooltip={typeof message === 'string' ? message : undefined}
        aria-labelledby={joinAriaIds(ariaLabelledBy, tooltipId)}
        onFocus={(event) => {
          onFocus?.(event);
          setVisible(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setVisible(false);
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          setVisible(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          setVisible(false);
        }}
      >
        {children}
        <SvgIcon name="ico-angle right" />
      </button>
      <span id={tooltipId} role="tooltip" hidden={!visible}>
        {message}
      </span>
    </>
  );
});
export function TooltipBox(props: TooltipProps) {
  return <Tooltip {...props} placement="box" />;
}
export function TooltipVertical(props: TooltipProps) {
  return <Tooltip {...props} placement="vertical" />;
}

export interface TtsProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  text?: string;
  iconOnly?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}
export const Tts = forwardRef<HTMLButtonElement, TtsProps>(function Tts(
  {
    label: _label,
    text,
    iconOnly = false,
    size = 'medium',
    playing: controlledPlaying,
    defaultPlaying = false,
    onPlayingChange,
    children,
    className,
    onClick,
    ...props
  },
  ref,
) {
  const [uncontrolledPlaying, setUncontrolledPlaying] = useState(defaultPlaying);
  const playing = controlledPlaying ?? uncontrolledPlaying;
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cx('krds-tts', size, playing && 'play', className)}
      onClick={(event) => {
        const next = !playing;
        if (controlledPlaying === undefined) setUncontrolledPlaying(next);
        onPlayingChange?.(next);
        onClick?.(event);
      }}
    >
      <span className="krds-tts-icon" aria-hidden="true">
        <SvgIcon name={playing ? 'ico-stop' : 'ico-volume'} />
      </span>
      {iconOnly ? null : <span className="krds-tts-text">{children ?? text}</span>}
    </button>
  );
});
export const TtsIcon = forwardRef<HTMLButtonElement, TtsProps>(function TtsIcon(props, ref) {
  return <Tts {...props} ref={ref} iconOnly />;
});
export const TtsSize = forwardRef<HTMLButtonElement, TtsProps>(function TtsSize(props, ref) {
  return <Tts {...props} ref={ref} size={props.size ?? 'xsmall'} />;
});

export const ToggleSwitch = BaseSwitch;
export const ToggleSwitchSize = ToggleSwitch;
