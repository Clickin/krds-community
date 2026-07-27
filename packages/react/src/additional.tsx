import {
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type ComponentProps,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
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
  type KrdsTableRow,
  type KrdsTabItem,
  type KrdsTone,
} from '@krds-community/recipes';
import { Button, Switch as BaseSwitch, TextInput } from './components.js';

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
  items: KrdsNavItem[];
  label?: string;
}
export function Breadcrumb({ items, label = '현재 경로', className, ...props }: BreadcrumbProps) {
  return (
    <nav {...props} className={cx('krds-breadcrumb-wrap', className)} aria-label={label}>
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li className={index === 0 ? 'home' : undefined} key={item.id ?? item.label}>
            <a
              href={item.href ?? '#'}
              aria-current={item.current || index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface ButtonIconProps
  extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}
export function ButtonIcon({ label, icon, size = 'medium', className, ...props }: ButtonIconProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      aria-label={label}
      className={cx('krds-btn', 'icon', size, className)}
    >
      <span aria-hidden="true">{icon ?? '◉'}</span>
    </button>
  );
}
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
export function ButtonWithIcon({
  icon,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode }) {
  return (
    <button {...props} type={props.type ?? 'button'} className={cx('krds-btn', className)}>
      {children}
      <span aria-hidden="true">{icon ?? '→'}</span>
    </button>
  );
}

export interface CalendarProps
  extends
    NativeCommonProps,
    LabelProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'> {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
export function Calendar({
  id: providedId,
  label = '날짜',
  hint,
  className,
  onValueChange,
  onChange,
  ...props
}: CalendarProps) {
  const id = providedId ?? `krds-calendar-${useId()}`;
  return (
    <label className={cx('krds-field', className)} htmlFor={id}>
      <span className="krds-field-label">{label}</span>
      <input
        {...props}
        id={id}
        type="date"
        className={cx('krds-input', className)}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.currentTarget.value);
        }}
      />
      {hint ? <span className="krds-field-message">{hint}</span> : null}
    </label>
  );
}
export interface CalendarRangeProps extends BoxProps {
  start?: string;
  end?: string;
  onChange?: (range: { start: string; end: string }) => void;
  label?: string;
}
export function CalendarRange({
  start = '',
  end = '',
  onChange,
  label = '기간 선택',
  className,
}: CalendarRangeProps) {
  const [range, setRange] = useState({ start, end });
  const update = (key: 'start' | 'end', value: string) => {
    const next = { ...range, [key]: value };
    setRange(next);
    onChange?.(next);
  };
  return (
    <fieldset className={cx('krds-calendar-area', className)}>
      <legend>{label}</legend>
      <input
        aria-label="시작일"
        type="date"
        value={range.start}
        onChange={(event) => update('start', event.currentTarget.value)}
      />
      <span aria-hidden="true">–</span>
      <input
        aria-label="종료일"
        type="date"
        value={range.end}
        onChange={(event) => update('end', event.currentTarget.value)}
      />
    </fieldset>
  );
}
export const DateInput = Calendar;

export interface CarouselProps extends BoxProps {
  slides: KrdsCarouselSlide[];
  label?: string;
  autoPlay?: boolean;
}
export function Carousel({ slides, label = '콘텐츠 캐러셀', className }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const current = slides[index];
  if (!current) return null;
  const move = (delta: number) =>
    setIndex((value) => (value + delta + slides.length) % slides.length);
  return (
    <section
      className={cx('krds-carousel', className)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <p aria-live="polite">
        {index + 1} / {slides.length}
      </p>
      <div className="carousel-slide">
        <h3>{current.title}</h3>
        {current.description ? <p>{current.description}</p> : null}
        {current.href ? <a href={current.href}>자세히 보기</a> : null}
      </div>
      <div className="carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="이전 슬라이드">
          이전
        </button>
        <button type="button" onClick={() => move(1)} aria-label="다음 슬라이드">
          다음
        </button>
      </div>
    </section>
  );
}
export const CarouselBanner = Carousel;

export interface ChoiceChipProps
  extends NativeCommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  type?: 'checkbox' | 'radio';
}
export function CheckboxChip({ label, className, ...props }: ChoiceChipProps) {
  return (
    <label className={cx('krds-form-chip', className)}>
      <input {...props} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
export function RadioChip({ label, className, ...props }: ChoiceChipProps) {
  return (
    <label className={cx('krds-form-chip', className)}>
      <input {...props} type="radio" />
      <span>{label}</span>
    </label>
  );
}
export const CheckboxSize = CheckboxChip;
export const RadioSize = RadioChip;

export interface CoachMarkProps extends BoxProps {
  title?: string;
  step?: string;
  onNext?: () => void;
  onClose?: () => void;
}
export function CoachMark({
  title = '따라하기 가이드',
  step = '1 / 3',
  onNext,
  onClose,
  children,
  className,
}: CoachMarkProps) {
  return (
    <aside className={cx('krds-coach-mark', className)} aria-label={title}>
      <h2>{title}</h2>
      <p>{children}</p>
      <p>{step}</p>
      <button type="button" onClick={onNext}>
        다음
      </button>
      <button type="button" onClick={onClose}>
        닫기
      </button>
    </aside>
  );
}

export interface ContextualHelpProps extends BoxProps {
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
export function ContextualHelp({
  label = '도움말',
  position = 'top',
  children,
  className,
}: ContextualHelpProps) {
  return (
    <details className={cx('krds-contextual-help', position, className)}>
      <summary>{label}</summary>
      <div className="tooltip-txt">{children}</div>
    </details>
  );
}

export interface CriticalAlertsProps extends BoxProps {
  items: string[];
}
export function CriticalAlerts({ items, className }: CriticalAlertsProps) {
  return (
    <div className={cx('krds-critical-alerts', className)} role="alert">
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export interface DisclosureProps extends BoxProps {
  title: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function Disclosure({ title, open, onOpenChange, children, className }: DisclosureProps) {
  return (
    <details
      className={cx('krds-disclosure', className)}
      open={open}
      onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
    >
      <summary>{title}</summary>
      <div className="expand-wrap">{children}</div>
    </details>
  );
}

export interface FaviconProps {
  href: string;
  sizes?: string;
  type?: string;
}
export function Favicon({ href, sizes = '32x32', type = 'image/png' }: FaviconProps) {
  return <link rel="icon" href={href} sizes={sizes} type={type} />;
}

export interface FileUploadProps
  extends NativeCommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  children?: ReactNode;
}
export function FileUpload({
  label = '파일 선택',
  onFilesChange,
  className,
  onChange,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = useState<string[]>([]);
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.currentTarget.files ?? []);
    setFiles(next.map((file) => file.name));
    onFilesChange?.(next);
    onChange?.(event);
  };
  return (
    <div className={cx('krds-file-upload', className)}>
      <label>
        <span>{label}</span>
        <input {...props} type="file" onChange={change} />
      </label>
      {files.length ? (
        <ul aria-live="polite">
          {files.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export interface FooterProps extends BoxProps {
  links?: KrdsNavItem[];
  organization?: string;
}
export function Footer({ links = [], organization = 'KRDS Community', className }: FooterProps) {
  return (
    <footer className={cx('krds-footer', className)}>
      <strong>{organization}</strong>
      {links.length ? (
        <nav aria-label="하단 메뉴">
          <ul>
            {links.map((item) => (
              <li key={item.id ?? item.label}>
                <a href={item.href ?? '#'}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </footer>
  );
}

export interface HeaderProps extends BoxProps {
  title?: string;
  nav?: KrdsNavItem[];
}
export function Header({ title = 'KRDS Community', nav = [], className }: HeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className={cx('krds-header', className)}>
      <a className="brand" href="/">
        {title}
      </a>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="krds-header-nav"
        onClick={() => setOpen((value) => !value)}
      >
        메뉴
      </button>
      <nav id="krds-header-nav" hidden={!open || nav.length === 0} aria-label="헤더 메뉴">
        <NavList items={nav} />
      </nav>
    </header>
  );
}

function NavList({ items }: { items: KrdsNavItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id ?? item.label}>
          {item.href ? (
            <a href={item.href} aria-current={item.current ? 'page' : undefined}>
              {item.label}
            </a>
          ) : (
            <button type="button" disabled={item.disabled}>
              {item.label}
            </button>
          )}
          {item.children?.length ? <NavList items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

export interface HelpPanelProps extends BoxProps {
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
}
export function HelpPanel({
  open = false,
  title = '도움말',
  onOpenChange,
  children,
  className,
}: HelpPanelProps) {
  return (
    <aside className={cx('krds-help-panel', className)} hidden={!open} aria-label={title}>
      <div>{children}</div>
      <button type="button" onClick={() => onOpenChange?.(false)}>
        접어두기
      </button>
    </aside>
  );
}
export const TutorialPanel = HelpPanel;

export interface IdentifierProps extends BoxProps {
  organization?: string;
  description?: string;
}
export function Identifier({
  organization = 'KRDS - Korea Design System',
  description,
  className,
}: IdentifierProps) {
  return (
    <div className={cx('krds-identifier', className)}>
      <span className="logo" aria-hidden="true">
        ◎
      </span>
      <span>{organization}</span>
      {description ? <small>{description}</small> : null}
    </div>
  );
}

export interface InPageNavigationProps extends BoxProps {
  items: KrdsNavItem[];
  title?: string;
}
export function InPageNavigation({
  items,
  title = '페이지 내비게이션',
  className,
}: InPageNavigationProps) {
  return (
    <nav className={cx('krds-in-page-navigation-area', className)} aria-label={title}>
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item.id ?? item.label}>
            <a href={item.href ?? `#${item.id ?? item.label}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface LanguageSwitcherProps extends BoxProps {
  languages?: KrdsOption[];
  value?: string;
  onChange?: (value: string) => void;
}
export function LanguageSwitcher({
  languages = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
  ],
  value = 'ko',
  onChange,
  className,
}: LanguageSwitcherProps) {
  return (
    <label className={cx('krds-language', className)}>
      <span className="sr-only">언어 선택</span>
      <select value={value} onChange={(event) => onChange?.(event.currentTarget.value)}>
        {languages.map((language) => (
          <option key={language.value} value={language.value} disabled={language.disabled}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export const LanguageSwitcherPage = LanguageSwitcher;

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}
export function Link({ external, children, className, ...props }: LinkProps) {
  return (
    <a
      {...props}
      className={cx('krds-link', external && 'external', className)}
      target={external ? '_blank' : props.target}
      rel={external ? 'noreferrer' : props.rel}
    >
      {children}
      {external ? <span aria-hidden="true"> ↗</span> : null}
    </a>
  );
}

export const MainMenuPc = ({
  items = [],
  className,
}: {
  items?: KrdsNavItem[];
  className?: string;
}) => (
  <nav className={cx('krds-main-menu', className)} aria-label="주 메뉴">
    <NavList items={items} />
  </nav>
);
export function MainMenuMobile({
  items = [],
  className,
}: {
  items?: KrdsNavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx('krds-main-menu-mobile', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="krds-main-menu-mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        메뉴
      </button>
      <nav id="krds-main-menu-mobile-nav" hidden={!open} aria-label="모바일 주 메뉴">
        <NavList items={items} />
      </nav>
    </div>
  );
}

export interface MastheadProps extends BoxProps {
  message?: ReactNode;
}
export function Masthead({
  message = '이 누리집은 대한민국 공식 전자정부 누리집입니다.',
  className,
}: MastheadProps) {
  return (
    <div className={cx('krds-masthead', className)} role="note">
      <span>{message}</span>
    </div>
  );
}

export interface ModalProps extends BoxProps {
  open?: boolean;
  title: string;
  onClose?: () => void;
  id?: string;
}
export function Modal({ open = false, title, onClose, id, children, className }: ModalProps) {
  const dialogId = id ?? `krds-modal-${useId()}`;
  return (
    <dialog
      id={dialogId}
      open={open}
      className={cx('krds-modal', className)}
      aria-labelledby={`${dialogId}-title`}
      onCancel={onClose}
    >
      <div className="modal-dialog">
        <h2 id={`${dialogId}-title`}>{title}</h2>
        <div className="modal-content">{children}</div>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </dialog>
  );
}
export const ModalSample = Modal;

export interface PaginationProps extends Omit<CommonProps, 'items'> {
  items?: KrdsPaginationItem[];
  current?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  children?: ReactNode;
}
export function Pagination({
  items = [1, 2, 3, 4, 5],
  current = 1,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <nav className={cx('krds-pagination', className)} aria-label="페이지 이동">
      <button type="button" disabled={current <= 1} onClick={() => onPageChange?.(current - 1)}>
        이전
      </button>
      <div className="page-links">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span className="page-link link-dot" key={`ellipsis-${index}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              className={cx('page-link', item === current && 'active')}
              aria-current={item === current ? 'page' : undefined}
              onClick={() => onPageChange?.(item)}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        disabled={
          current >= Math.max(...items.filter((item): item is number => item !== 'ellipsis'))
        }
        onClick={() => onPageChange?.(current + 1)}
      >
        다음
      </button>
    </nav>
  );
}

export function Resize({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className={cx('krds-resize', className)}>
      화면크기
      <select onChange={(event) => onChange?.(event.currentTarget.value)} defaultValue="100">
        <option value="100">기본</option>
        <option value="125">크게</option>
        <option value="150">가장 크게</option>
      </select>
    </label>
  );
}

export interface SelectProps
  extends
    NativeCommonProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>,
    LabelProps {
  options?: KrdsOption[];
  state?: 'default' | 'error' | 'complete';
  className?: string;
}
export function Select({
  options = [],
  label = '선택',
  hint,
  id: providedId,
  state = 'default',
  className,
  children,
  ...props
}: SelectProps) {
  const id = providedId ?? `krds-select-${useId()}`;
  return (
    <label className={cx('krds-field', className)} htmlFor={id}>
      <span className="krds-field-label">{label}</span>
      <select
        {...props}
        id={id}
        className={cx('krds-form-select', state === 'error' && 'is-error')}
        aria-invalid={state === 'error' ? true : props['aria-invalid']}
      >
        {children ??
          options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
      </select>
      {hint ? (
        <span className={cx('krds-field-message', state === 'error' && 'invalid')}>{hint}</span>
      ) : null}
    </label>
  );
}
export const SelectSize = Select;
export const SelectState = Select;
export function SelectSorting(props: Omit<SelectProps, 'label'> & { label?: string }) {
  return (
    <Select
      {...props}
      label={props.label ?? '정렬'}
      className={cx('krds-form-select-sort', props.className)}
    />
  );
}

export function SideNavigation({
  items = [],
  title = '메뉴',
  className,
}: {
  items?: KrdsNavItem[];
  title?: string;
  className?: string;
}) {
  return (
    <nav className={cx('krds-side-navigation', className)} aria-label={title}>
      <h2>{title}</h2>
      <NavList items={items} />
    </nav>
  );
}
export function SkipLink({
  href = '#main',
  children = '본문 바로가기',
  className,
}: {
  href?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('krds-skip-link', className)}>
      <a href={href}>{children}</a>
    </div>
  );
}
export function Spinner({ label = '처리 중', className }: { label?: string; className?: string }) {
  return (
    <output className={cx('krds-spinner', className)} aria-live="polite">
      <span aria-hidden="true">⟳</span>
      {label}
    </output>
  );
}

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
          className={cx(index < current && 'done', index === current && 'current')}
          aria-current={index === current ? 'step' : undefined}
          key={step.id}
        >
          <span>{index + 1}</span>
          <strong>{step.label}</strong>
          {step.description ? <small>{step.description}</small> : null}
        </li>
      ))}
    </ol>
  );
}

export function StructuredList({
  items,
  className,
}: {
  items: KrdsListItem[];
  className?: string;
}) {
  return (
    <ul className={cx('krds-structured-list', className)}>
      {items.map((item) => (
        <li className="structured-item" key={item.id}>
          <div>
            <strong>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</strong>
            {item.description ? <p>{item.description}</p> : null}
            {item.badge ? <Badge size="small" label={item.badge} /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StructuredListTable({
  columns,
  rows,
  caption = '데이터 목록',
  className,
}: {
  columns: KrdsTableColumn[];
  rows: KrdsTableRow[];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cx('krds-structured-list-table', className)}>
      <Table columns={columns} rows={rows} caption={caption} />
    </div>
  );
}

export interface TabProps extends Omit<CommonProps, 'tabs' | 'panels'> {
  tabs: KrdsTabItem[];
  panels: Record<string, ReactNode>;
  defaultTab?: string;
  className?: string;
  children?: ReactNode;
}
export function Tab({ tabs, panels, defaultTab, className }: TabProps) {
  const [selected, setSelected] = useState(defaultTab ?? tabs[0]?.id ?? '');
  return (
    <div className={cx('krds-tab-area', className)}>
      <div role="tablist" className="tab line">
        {tabs.map((tab) => (
          <button
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => setSelected(tab.id)}
            key={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <section
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          className="tab-conts"
          hidden={selected !== tab.id}
          key={tab.id}
        >
          {panels[tab.id]}
        </section>
      ))}
    </div>
  );
}

export function Table({
  columns,
  rows,
  caption = '표',
  className,
}: {
  columns: KrdsTableColumn[];
  rows: KrdsTableRow[];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cx('krds-table-wrap', className)}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.key}>
                {column.label}
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
}

export function Tag({
  label,
  tone = 'gray',
  removable = false,
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
    <span className={cx('krds-btn-tag', `bg-${toneClass[tone]}`, className)}>
      {label}
      {removable ? (
        <button type="button" aria-label={`${String(label)} 삭제`} onClick={onRemove}>
          ×
        </button>
      ) : null}
    </span>
  );
}
export function TagLink({
  href = '#',
  label,
  className,
}: {
  href?: string;
  label: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={cx('krds-btn-tag', 'link', className)}>
      {label}
    </a>
  );
}

export interface TextareaProps
  extends
    Omit<NativeCommonProps, 'rows'>,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'className'>,
    LabelProps {
  maxLength?: number;
  className?: string;
}
export function Textarea({
  label = '내용',
  hint,
  id: providedId,
  className,
  onChange,
  maxLength = 100,
  ...props
}: TextareaProps) {
  const id = providedId ?? `krds-textarea-${useId()}`;
  const [count, setCount] = useState(String(props.value ?? '').length);
  return (
    <label className={cx('krds-field', className)} htmlFor={id}>
      <span className="krds-field-label">{label}</span>
      <textarea
        {...props}
        id={id}
        maxLength={maxLength}
        className="krds-input"
        onChange={(event) => {
          setCount(event.currentTarget.value.length);
          onChange?.(event);
        }}
      />{' '}
      <span className="textarea-count" aria-live="polite">
        {count}/{maxLength}
      </span>
      {hint ? <span className="krds-field-message">{hint}</span> : null}
    </label>
  );
}
export function TextInputIcon({
  icon = '⌕',
  ...props
}: ComponentProps<typeof TextInput> & { icon?: ReactNode }) {
  return (
    <div className="krds-input-with-icon">
      <TextInput {...props} />
      <button type="button" aria-label="입력 보조 기능">
        {icon}
      </button>
    </div>
  );
}
export function TextList({
  items,
  ordered = false,
  className,
}: {
  items: ReactNode[];
  ordered?: boolean;
  className?: string;
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <List className={cx('krds-info-list', ordered ? 'ordered' : 'decimal', className)}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </List>
  );
}
export const TextListOrdered = (props: Omit<React.ComponentProps<typeof TextList>, 'ordered'>) => (
  <TextList {...props} ordered />
);

export interface TooltipProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  message: ReactNode;
  placement?: 'horizontal' | 'vertical' | 'box';
}
export function Tooltip({
  message,
  placement = 'horizontal',
  children,
  className,
  ...props
}: TooltipProps) {
  const id = `tooltip-${useId()}`;
  const [visible, setVisible] = useState(false);
  return (
    <span className="krds-tooltip-wrap">
      <button
        {...props}
        type={props.type ?? 'button'}
        className={cx('krds-btn', 'krds-tooltip', `tooltip-${placement}`, className)}
        aria-describedby={visible ? id : undefined}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </button>
      <span id={id} role="tooltip" hidden={!visible}>
        {message}
      </span>
    </span>
  );
}
export const TooltipBox = Tooltip;
export const TooltipVertical = Tooltip;

export interface TtsProps extends NativeCommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  iconOnly?: boolean;
}
export function Tts({
  text = '레이블',
  iconOnly = false,
  children,
  className,
  ...props
}: TtsProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={cx('krds-tts', playing && 'play', className)}
      aria-pressed={playing}
      onClick={(event) => {
        setPlaying((value) => !value);
        props.onClick?.(event);
      }}
    >
      <span className="krds-tts-icon" aria-hidden="true">
        {playing ? '▶' : '🔊'}
      </span>
      {iconOnly ? (
        <span className="sr-only">{text}</span>
      ) : (
        <span className="krds-tts-text">{children ?? text}</span>
      )}
    </button>
  );
}
export const TtsIcon = (props: TtsProps) => <Tts {...props} iconOnly />;
export const TtsSize = Tts;

export const ToggleSwitch = BaseSwitch;
export const ToggleSwitchSize = ToggleSwitch;
