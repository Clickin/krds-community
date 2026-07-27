import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
  type JSX,
} from 'solid-js';
import type {
  KrdsAdditionalProps,
  KrdsCarouselSlide,
  KrdsListItem,
  KrdsNavItem,
  KrdsOption,
  KrdsStep,
  KrdsTableColumn,
  KrdsTableRow,
  KrdsTabItem,
  KrdsTone,
} from '@krds-community/recipes';

export interface CalendarChoice {
  label: string;
  value?: string;
  active?: boolean;
  disabled?: boolean;
}
export interface CalendarDay {
  label: string;
  value?: string;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  ariaLabel?: string;
}
export interface CalendarAction {
  label: string;
  variant?: string;
  id?: string;
  icon?: string;
}
type CalendarChoiceInput = CalendarChoice | number;

const numberValue = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const choiceNumber = (choice: CalendarChoiceInput, fallback: number): number => {
  if (typeof choice === 'number') return choice;
  return numberValue(choice.value ?? choice.label.replace(/[^\d-]/g, ''), fallback);
};

const padCalendarPart = (value: number) => String(value).padStart(2, '0');
export interface TableColumn extends KrdsTableColumn {
  width?: string;
  visuallyHidden?: boolean;
}
export interface TablePagination {
  current: number;
  items: (number | 'ellipsis')[];
  previousDisabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  currentLabel: string;
}

export interface AlertItem extends KrdsListItem {
  badgeLabel?: string;
  linkLabel?: string;
}
export interface StructuredItem extends KrdsListItem {
  badgeClass?: string;
  dateLabel?: string;
  dateValue?: string;
  tags?: string[];
  actionLabel?: string;
  shareLabel?: string;
  favoriteLabel?: string;
}
export interface HelpTab extends KrdsTabItem {
  panelId: string;
}
export interface HelpLink extends KrdsNavItem {
  icon?: string;
  title?: string;
}

export interface HelpRelatedGroup {
  title: string;
  links: HelpLink[];
}
export interface TutorialTask {
  title: string;
  steps: string[];
  current?: boolean;
  summary?: string;
}
export interface MenuDescriptionItem {
  title: string;
  description: string;
  href?: string;
  target?: string;
  externalTitle?: string;
}
export interface MenuBanner {
  badge: string;
  label: string;
}
export interface MenuItem extends Omit<KrdsNavItem, 'children'> {
  active?: boolean;
  title?: string;
  titleHref?: string;
  titleLinkLabel?: string;
  target?: string;
  icon?: string;
  emphasis?: boolean;
  kind?: 'link' | 'dropdown' | 'resize';
  className?: string;
  selected?: boolean;
  selectedLabel?: string;
  resetLabel?: string;
  items?: MenuItem[];
  button?: boolean;
  descriptionItems?: MenuDescriptionItem[];
  banner?: MenuBanner;
  children?: MenuItem[];
}
export interface FooterContact {
  title: string;
  description: string;
}
export interface UploadFile {
  id: string;
  name: string;
  status: 'uploading' | 'complete' | 'deletable' | 'error' | 'downloadable';
  statusLabel?: string;
  deleteLabel?: string;
  errors?: string[];
  downloadLabel?: string;
  previewLabel?: string;
}
export interface HeaderMyMenu {
  label: string;
  userName: string;
  timeLabel: string;
  time: string;
  extendLabel: string;
  items: MenuItem[];
  logoutLabel: string;
}
export interface HeaderMobileMenu {
  utilityItems: MenuItem[];
  loginLabel: string;
  serviceItems: MenuItem[];
  searchPlaceholder: string;
  searchTitle: string;
  searchLabel: string;
  items: MenuItem[];
  previousLabel: string;
  closeLabel: string;
  bottomItems: MenuItem[];
}








export type AdditionalProps = Omit<KrdsAdditionalProps, 'className' | 'items' | 'tabs' | 'columns' | 'rows'> &
  Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> & {
    class?: string;
    sample?: boolean;
    className?: string;
    target?: string;
    children?: JSX.Element;
    variant?: string;
    icon?: JSX.Element;
    state?: string;
    error?: string;
    step?: string;
    text?: string;
    defaultValue?: string;
    defaultStart?: string;
    defaultEnd?: string;
    languages?: KrdsOption[];
    nav?: KrdsNavItem[];
    menuLabel?: string;
    quickLinks?: KrdsNavItem[];
    policyLinks?: KrdsNavItem[];
    address?: string;
    contact?: string;
    copyright?: string;
    identifierText?: string;
    external?: boolean;
    removable?: boolean;
    maxLength?: number;
    ordered?: boolean;
    caption?: string;
    previousLabel?: string;
    nextLabel?: string;
    playLabel?: string;
    stopLabel?: string;
    moreLabel?: string;
    imageLabel?: string;
    actionLabel?: string;
    selectedLabel?: string;
    resetLabel?: string;
    calendarLabel?: string;
    todayLabel?: string;
    yearLabel?: string;
    monthLabel?: string;
    year?: string | number;
    month?: string | number;
    displayYear?: string | number;
    displayMonth?: string | number;
    selectedYear?: string | number;
    selectedMonth?: string | number;
    previousMonthLabel?: string;
    previousmonthlabel?: string;
    nextmonthlabel?: string;
    nextMonthLabel?: string;
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
    yearSelectLabel?: string;
    monthSelectLabel?: string;
    eventLabel?: string;
    weekdays?: string[];
    weeks?: CalendarDay[][];
    actions?: CalendarAction[];
    pageTitle?: string;
    actionInfo?: string;
    actionCount?: string;
    dateLabel?: string;
    dateValue?: string;
    tags?: string[];
    shareLabel?: string;
    favoriteLabel?: string;
    panelTitle?: string;
    previousDisabled?: boolean;
    stepTitle?: string;
    contentTitle?: string;
    currentStep?: string;
    totalSteps?: string;
    currentStepLabel?: string;
    totalStepsLabel?: string;
    linkLabel?: string;
    closeLabel?: string;
    currentLabel?: string;
    activeTab?: 'help' | 'tutorial';
    tabs?: HelpTab[];
    helpTitle?: string;
    helpDescription?: string;
    externalTitle?: string;
    backTitle?: string;
    tutorialBackTitle?: string;
    downloadLinks?: HelpLink[];
    relatedGroups?: HelpRelatedGroup[];
    tutorialTitle?: string;
    tasks?: TutorialTask[];
    collapseLabel?: string;
    utilityItems?: MenuItem[];
    loginLabel?: string;
    serviceItems?: MenuItem[];
    searchPlaceholder?: string;
    searchTitle?: string;
    searchLabel?: string;
    bottomItems?: MenuItem[];
    selectAllLabel?: string;
    countLabel?: string;
    countOptions?: string[];
    sortLabel?: string;
    sortOptions?: string[];
    sortValue?: string;
    columns?: TableColumn[];
    rows?: Record<string, string | number | boolean>[];
    pagination?: TablePagination;
    relatedSites?: MenuItem[];
    logoLabel?: string;
    contacts?: FooterContact[];
    socialLinks?: MenuItem[];
    prompt?: string;
    inputId?: string;
    selectLabel?: string;
    currentCount?: number;
    maxCount?: number;
    files?: UploadFile[];
    deleteAllLabel?: string;
    desktopItems?: MenuItem[];
    logoHref?: string;
    loginHref?: string;
    joinLabel?: string;
    allMenuLabel?: string;
    myMenu?: HeaderMyMenu;
    mobileMenu?: HeaderMobileMenu;
    navigationRole?: JSX.HTMLAttributes<HTMLElement>['role'] | false;
    bottomSize?: 'small' | 'medium';
    cancelLabel?: string;
    confirmLabel?: string;
    items?: (MenuItem | KrdsNavItem | KrdsListItem | StructuredItem | AlertItem | string | number)[];
  };
const tones: Record<KrdsTone, string> = {
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
type Item = NonNullable<AdditionalProps['items']>[number];
const labelOf = (item: Item) =>
  typeof item === 'string' || typeof item === 'number'
    ? String(item)
    : 'label' in item
      ? item.label
      : item.title;


const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapTabFocus = (event: KeyboardEvent, container: HTMLElement) => {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute('hidden') && element.tabIndex >= 0,
  );
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
};

export function createAdditional(defaultKind: string) {
  return function Additional(rawProps: AdditionalProps) {
    const instanceId = createUniqueId();
    const merged = mergeProps(
      {
        kind: defaultKind,
        tone: 'primary' as KrdsTone,
        appearance: 'outline' as const,
        id:
          defaultKind === 'header' || defaultKind === 'footer'
            ? `krds-${defaultKind}`
            : defaultKind === 'masthead' || defaultKind === 'skip-link'
              ? `krds-${defaultKind}`
              : `krds-${defaultKind}-${instanceId}`,
        options: [] as KrdsOption[],
        items: [] as (KrdsNavItem | KrdsListItem | string)[],
        links: [] as KrdsNavItem[],
        slides: [] as KrdsCarouselSlide[],
        tabs: [] as KrdsTabItem[],
        panels: {} as Record<string, string>,
        steps: [] as KrdsStep[],
        columns: [] as KrdsTableColumn[],
        rows: [] as KrdsTableRow[],
      },
      rawProps,
    );
    const [props, native] = splitProps(merged, [
      'kind',
      'id',
      'sample',
      'variant',
      'state',
      'error',
      'step',
      'text',
      'label',
      'title',
      'description',
      'hint',
      'tone',
      'appearance',
      'size',
      'number',
      'href',
      'message',
      'position',
      'open',
      'disabled',
      'current',
      'checked',
      'value',
      'modelValue',
      'name',
      'target',
      'options',
      'defaultValue',
      'defaultStart',
      'defaultEnd',
      'items',
      'links',
      'slides',
      'tabs',
      'panels',
      'steps',
      'columns',
      'rows',
      'languages',
      'nav',
      'menuLabel',
      'quickLinks',
      'policyLinks',
      'address',
      'contact',
      'copyright',
      'identifierText',
      'organization',
      'selected',
      'playing',
      'required',
      'readonly',
      'icon',
      'external',
      'removable',
      'maxLength',
      'ordered',
      'caption',
      'previousLabel',
      'nextLabel',
      'playLabel',
      'stopLabel',
      'moreLabel',
      'imageLabel',
      'actionLabel',
      'selectedLabel',
      'resetLabel',
      'calendarLabel',
      'todayLabel',
      'yearLabel',
      'monthLabel',
      'year',
      'previousMonthLabel',
      'previousmonthlabel',
      'nextmonthlabel',
      'nextMonthLabel',
      'month',
      'displayYear',
      'displayMonth',
      'selectedYear',
      'selectedMonth',
      'disabledYears',
      'disabledMonths',
      'leadingDays',
      'previousMonthDayCount',
      'dayCount',
      'rangeStartDay',
      'rangeEndDay',
      'todayDay',
      'eventDays',
      'disabledDays',
      'yearSelectLabel',
      'monthSelectLabel',
      'eventLabel',
      'years',
      'months',
      'weekdays',
      'weeks',
      'actions',
      'pageTitle',
      'actionInfo',
      'actionCount',
      'dateLabel',
      'dateValue',
      'tags',
      'shareLabel',
      'favoriteLabel',
      'panelTitle',
      'previousDisabled',
      'stepTitle',
      'contentTitle',
      'currentStep',
      'totalSteps',
      'currentStepLabel',
      'totalStepsLabel',
      'linkLabel',
      'closeLabel',
      'currentLabel',
      'activeTab',
      'helpTitle',
      'helpDescription',
      'downloadLinks',
      'relatedGroups',
      'tutorialTitle',
      'tasks',
      'collapseLabel',
      'tutorialBackTitle',
      'externalTitle',
      'backTitle',
      'utilityItems',
      'loginLabel',
      'serviceItems',
      'searchPlaceholder',
      'searchTitle',
      'searchLabel',
      'bottomItems',
      'selectAllLabel',
      'countLabel',
      'countOptions',
      'sortLabel',
      'sortOptions',
      'sortValue',
      'pagination',
      'relatedSites',
      'logoLabel',
      'contacts',
      'socialLinks',
      'prompt',
      'inputId',
      'selectLabel',
      'currentCount',
      'maxCount',
      'files',
      'deleteAllLabel',
      'desktopItems',
      'logoHref',
      'loginHref',
      'joinLabel',
      'allMenuLabel',
      'myMenu',
      'mobileMenu',
      'navigationRole',
      'bottomSize',
      'cancelLabel',
      'confirmLabel',
      'class',
      'className',
      'children',
    ]);
    const [localOpen, setLocalOpen] = createSignal(false);
    const open = () => (props.open === undefined ? localOpen() : Boolean(props.open));
    const setOpen = (next: boolean) => {
      if (props.open === undefined) setLocalOpen(next);
    };
    const [localSelected, setLocalSelected] = createSignal<string>();
    const selected = () => {
      const modelValue = props.modelValue;
      if (typeof modelValue === 'string' || typeof modelValue === 'number')
        return String(modelValue);
      return (
        props.selected ??
        localSelected() ??
        props.defaultValue ??
        String(optionItems()?.[0]?.value ?? props.tabs[0]?.id ?? '')
      );
    };
    const setSelected = (next: string) => {
      if (props.modelValue === undefined) setLocalSelected(next);
    };
    const [localIndex, setLocalIndex] = createSignal(0);
    const index = () =>
      props.current === undefined
        ? localIndex()
        : Math.max(0, Number.isFinite(props.current) ? props.current - 1 : 0);
    const setIndex = (next: number) => {
      if (props.current === undefined) setLocalIndex(next);
    };
    const [localChecked, setLocalChecked] = createSignal(false);
    const checked = () =>
      props.playing !== undefined
        ? Boolean(props.playing)
        : props.checked !== undefined
          ? Boolean(props.checked)
          : typeof props.modelValue === 'boolean'
            ? props.modelValue
            : localChecked();
    const setChecked = (next: boolean) => {
      if (
        props.playing === undefined &&
        props.checked === undefined &&
        typeof props.modelValue !== 'boolean'
      )
        setLocalChecked(next);
    };
    const [localValue, setLocalValue] = createSignal('');
    const value = () => {
      if (props.value !== undefined) return String(props.value ?? '');
      if (typeof props.modelValue === 'string' || typeof props.modelValue === 'number')
        return String(props.modelValue);
      return localValue();
    };
    const setValue = (next: string) => {
      if (
        props.value === undefined &&
        (props.modelValue === undefined ||
          typeof props.modelValue === 'boolean' ||
          Array.isArray(props.modelValue))
      )
        setLocalValue(next);
    };
    const [activeHeaderDropdown, setActiveHeaderDropdown] = createSignal<string>();
    const [localMainMenu, setLocalMainMenu] = createSignal<string | false>();
    const [localSubMenu, setLocalSubMenu] = createSignal<{
      parentId?: string;
      childId?: string;
    }>();
    const [localMobileTab, setLocalMobileTab] = createSignal<string>();
    const [activeMobileDepth3, setActiveMobileDepth3] = createSignal<string>();
    const [activeMobileDepth4, setActiveMobileDepth4] = createSignal<string>();
    let modalRoot: HTMLElement | undefined;
    let headerMobileTrigger: HTMLButtonElement | undefined;
    let headerMobileMenu: HTMLElement | undefined;
    let mobileMenuRoot: HTMLElement | undefined;
    let mobileDepth4Trigger: HTMLAnchorElement | undefined;
    let restoreFocus: HTMLElement | undefined;
    let wasFocusSurfaceOpen = false;
    const invokeHandler = (handler: unknown, event: Event) => {
      if (typeof handler === 'function') handler(event);
      else if (Array.isArray(handler) && typeof handler[0] === 'function')
        handler[0](handler[1], event);
    };
    const closeModal = (event: Event) => {
      setOpen(false);
      invokeHandler(native.onClose, event);
    };
    const closeMobileMenu = (event: Event) => {
      setOpen(false);
      setActiveMobileDepth3(undefined);
      setActiveMobileDepth4(undefined);
      invokeHandler(native.onClose, event);
    };
    const closeMobileDepth4 = () => {
      setActiveMobileDepth4(undefined);
      const trigger = mobileDepth4Trigger;
      mobileDepth4Trigger = undefined;
      queueMicrotask(() => {
        if (trigger?.isConnected) trigger.focus();
      });
    };
    const updateInput = (
      event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement },
    ) => {
      setValue(event.currentTarget.value);
      invokeHandler(native.onInput, event);
    };
    const updateChecked = (
      event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement },
    ) => {
      setChecked(event.currentTarget.checked);
      invokeHandler(native.onChange, event);
    };
    const hasCurrentItem = (item: KrdsNavItem): boolean => {
      if (item.current) return true;
      return item.children?.some(hasCurrentItem) ?? false;
    };
    const infoList = (
      items: () => Item[],
      ordered: () => boolean,
      depth = 0,
    ): JSX.Element => {
      const listItems = (
        <For each={items()}>
          {(item, itemIndex) => {
            const nested =
              typeof item !== 'string' &&
              typeof item !== 'number' &&
              'children' in item &&
              Array.isArray(item.children)
                ? (item.children as KrdsNavItem[])
                : [];
            const marker =
              depth === 0
                ? `${itemIndex() + 1}.`
                : depth === 1
                  ? `${String.fromCharCode(97 + itemIndex())}.`
                  : String.fromCodePoint(0x2460 + itemIndex());
            return (
              <li role="listitem">
                <Show when={ordered()}>
                  <span class="num">{marker}</span>
                </Show>
                {labelOf(item)}
                <Show when={nested.length > 0}>
                  {infoList(() => nested, ordered, depth + 1)}
                </Show>
              </li>
            );
          }}
        </For>
      );
      const rootProps = depth === 0 ? (native as Record<string, unknown>) : {};
      return ordered() ? (
        <ol
          {...rootProps}
          class={`krds-info-list ordered${depth === 0 && className() ? ` ${className()}` : ''}`}
          role="list"
        >
          {listItems}
        </ol>
      ) : (
        <ul
          {...rootProps}
          class={[
            'krds-info-list',
            depth === 0 ? 'decimal' : depth === 1 ? 'dash' : 'hollow',
            depth === 0 && className(),
          ]
            .filter(Boolean)
            .join(' ')}
          role="list"
        >
          {listItems}
        </ul>
      );
    };
    const kind = () => props.kind;
    const children = () => props.children;
    const className = () => props.class ?? props.className ?? '';
    const content = () => props.children ?? props.label;
    const optionItems = () => props.languages ?? props.options;
    const navigation = () =>
      (props.nav?.length
        ? props.nav
        : props.links?.length
          ? props.links
          : props.items.filter(
              (item): item is KrdsNavItem =>
                typeof item !== 'string' && typeof item !== 'number',
            )) as KrdsNavItem[];
    const mainMenuIsActive = (item: MenuItem) => {
      const local = localMainMenu();
      return local === undefined ? Boolean(item.active) : local === item.id;
    };
    const subMenuIsActive = (parent: MenuItem, child: MenuItem, childIndex: number) => {
      const local = localSubMenu();
      if (local !== undefined && local.parentId === parent.id)
        return local.childId === child.id;
      if (child.active !== undefined) return child.active;
      return !props.sample && childIndex === 0;
    };
    const mobileTabId = () =>
      props.selected ??
      localMobileTab() ??
      (navigation() as MenuItem[])[0]?.id ??
      '';
    const moveSlide = (delta: number) => {
      const count = props.slides.length;
      if (count > 0) setIndex((index() + delta + count) % count);
    };
    const currentSlideIndex = () => {
      const count = props.slides.length;
      if (count === 0) return -1;
      return ((index() % count) + count) % count;
    };
    const paginationPage = () => {
      const page = Number(props.modelValue ?? props.current ?? selected());
      return Number.isFinite(page) && page > 0 ? page : 1;
    };
    const stepCurrent = () => Number(props.current ?? props.modelValue ?? 0);
    const calendarDisplayYear = () =>
      numberValue(
        props.displayYear ?? props.year ?? props.selectedYear,
        2000,
      );
    const calendarDisplayMonth = () =>
      Math.min(
        12,
        Math.max(
          1,
          numberValue(
            props.displayMonth ?? props.month ?? props.selectedMonth,
            1,
          ),
        ),
      );
    const calendarSelectedYear = () =>
      numberValue(
        props.selectedYear ?? props.year ?? props.displayYear,
        calendarDisplayYear(),
      );
    const calendarSelectedMonth = () =>
      Math.min(
        12,
        Math.max(
          1,
          numberValue(
            props.selectedMonth ?? props.month ?? props.displayMonth,
            calendarDisplayMonth(),
          ),
        ),
      );
    const calendarYears = () => {
      const source =
        props.years && props.years.length > 0
          ? props.years
          : Array.from({ length: 24 }, (_, offset) => calendarDisplayYear() - 1 + offset);
      return source.map((choice) => {
        const year = choiceNumber(choice, calendarDisplayYear());
        const original = typeof choice === 'number' ? undefined : choice;
        return {
          label: original?.label ?? `${year}년`,
          value: String(year),
          active: year === calendarSelectedYear(),
          disabled:
            original?.disabled === true ||
            (props.disabledYears?.includes(year) ?? false),
        };
      });
    };
    const calendarMonths = () => {
      const source =
        props.months && props.months.length > 0
          ? props.months
          : Array.from({ length: 12 }, (_, offset) => offset + 1);
      return source.map((choice) => {
        const month = choiceNumber(choice, calendarDisplayMonth());
        const original = typeof choice === 'number' ? undefined : choice;
        return {
          label: original?.label ?? `${padCalendarPart(month)}월`,
          value: String(month),
          active: month === calendarSelectedMonth(),
          disabled:
            original?.disabled === true ||
            (props.disabledMonths?.includes(month) ?? false),
        };
      });
    };
    const calendarSelectedDate = () => {
      const raw = value();
      const match =
        typeof raw === 'string' &&
        /^(\d{4})[.-](\d{2})[.-](\d{2})$/.exec(raw);
      return match ? `${match[1]}.${match[2]}.${match[3]}` : undefined;
    };
    const calendarWeeks = () => {
      if (props.weeks && props.weeks.length > 0) return props.weeks;
      const displayYear = calendarDisplayYear();
      const displayMonth = calendarDisplayMonth();
      const leadingDays = Math.min(
        6,
        Math.max(
          0,
          numberValue(
            props.leadingDays,
            new Date(displayYear, displayMonth - 1, 1).getDay(),
          ),
        ),
      );
      const previousMonthDayCount = Math.max(
        0,
        numberValue(
          props.previousMonthDayCount,
          new Date(displayYear, displayMonth - 1, 0).getDate(),
        ),
      );
      const dayCount = Math.max(
        0,
        numberValue(
          props.dayCount,
          new Date(displayYear, displayMonth, 0).getDate(),
        ),
      );
      const totalCells = Math.ceil((leadingDays + dayCount) / 7) * 7;
      const selectedDate = calendarSelectedDate();
      return Array.from({ length: totalCells / 7 }, (_, row) =>
        Array.from({ length: 7 }, (_, column) => {
          const index = row * 7 + column;
          const offset = index - leadingDays + 1;
          const old = offset < 1;
          const next = offset > dayCount;
          const day = old
            ? previousMonthDayCount + offset
            : next
              ? offset - dayCount
              : offset;
          const month = old
            ? displayMonth === 1
              ? 12
              : displayMonth - 1
            : next
              ? displayMonth === 12
                ? 1
                : displayMonth + 1
              : displayMonth;
          const year = old && displayMonth === 1
            ? displayYear - 1
            : next && displayMonth === 12
              ? displayYear + 1
              : displayYear;
          const currentMonth = !old && !next;
          const period =
            currentMonth &&
            props.rangeStartDay !== undefined &&
            props.rangeEndDay !== undefined &&
            day >= props.rangeStartDay &&
            day <= props.rangeEndDay;
          const start = period && day === props.rangeStartDay;
          const end = period && day === props.rangeEndDay;
          const today = currentMonth && day === props.todayDay;
          const event = currentMonth && (props.eventDays?.includes(day) ?? false);
          const disabled =
            currentMonth && (props.disabledDays?.includes(day) ?? false);
          const date = `${year}.${padCalendarPart(month)}.${padCalendarPart(day)}`;
          const selected = currentMonth && selectedDate === date;
          const classes = [
            old ? 'old' : next ? 'new' : undefined,
            column === 0 ? 'day-off' : undefined,
            period ? 'period' : undefined,
            start ? 'start' : undefined,
            end ? 'end' : undefined,
            today ? 'today' : undefined,
            event ? 'day-event' : undefined,
            disabled ? 'disabled' : undefined,
          ]
            .filter(Boolean)
            .join(' ');
          return {
            label: String(day),
            value: date,
            className: classes,
            disabled: !currentMonth || disabled,
            pressed: period || selected,
            ariaLabel: today
              ? `${day} ${props.todayLabel ?? ''}`.trim()
              : event
                ? `${day} ${props.eventLabel ?? ''}`.trim()
                : undefined,
          };
        }),
      );
    };
    const calendarActions = (): CalendarAction[] =>
      props.actions && props.actions.length > 0
        ? props.actions
        : [
            { id: 'get-today', label: String(props.todayLabel ?? ''), variant: 'text' },
            { label: String(props.cancelLabel ?? ''), variant: 'tertiary' },
            { label: String(props.confirmLabel ?? ''), variant: 'primary' },
          ];
    const [calendarYearOpen, setCalendarYearOpen] = createSignal(false);
    const [calendarMonthOpen, setCalendarMonthOpen] = createSignal(false);
    const renderCalendarSurface = (single: boolean, includeNative: boolean) => (
      <div
        {...(includeNative ? (native as Record<string, unknown>) : {})}
        class={`krds-calendar-area${className() ? ` ${className()}` : ''}`}
      >
        <div
          class={[
            'calendar-wrap',
            'bottom',
            single && 'single',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={props.calendarLabel ?? '달력'}
          tabIndex={0}
        >
          <div class="calendar-head">
            <button type="button" class="btn-cal-move prev">
              <span class="sr-only">
                {props.previousMonthLabel ??
                  props.previousmonthlabel ??
                  props.previousLabel}
              </span>
            </button>
            <div class="calendar-switch-wrap">
              <div class="calendar-drop-down">
                <button
                  type="button"
                  class="btn-cal-switch year"
                  role="combobox"
                  aria-label={props.yearSelectLabel ?? props.yearLabel}
                  aria-haspopup="listbox"
                  aria-expanded={calendarYearOpen()}
                  aria-controls={`${props.id}-calendar-year`}
                  onClick={() => setCalendarYearOpen((open) => !open)}
                >
                  {`${calendarDisplayYear()}년`}
                </button>
                <div class="calendar-select calendar-year-wrap">
                  <ul
                    class="sel year"
                    id={`${props.id}-calendar-year`}
                    role="listbox"
                  >
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
                  aria-label={props.monthSelectLabel ?? props.monthLabel}
                  aria-haspopup="listbox"
                  aria-expanded={calendarMonthOpen()}
                  aria-controls={`${props.id}-calendar-month`}
                  onClick={() => setCalendarMonthOpen((open) => !open)}
                >
                  {`${padCalendarPart(calendarDisplayMonth())}월`}
                </button>
                <div class="calendar-select calendar-mon-wrap">
                  <ul
                    class="sel month"
                    id={`${props.id}-calendar-month`}
                    role="listbox"
                  >
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
              <span class="sr-only">
                {props.nextMonthLabel ??
                  props.nextmonthlabel ??
                  props.nextLabel}
              </span>
            </button>
          </div>
          <div class="calendar-body">
            <div class="calendar-table-wrap">
              <table class="calendar-tbl">
                <caption>{`${calendarDisplayYear()}년 ${padCalendarPart(calendarDisplayMonth())}월`}</caption>
                <thead>
                  <tr>
                    <For each={props.weekdays ?? ['일', '월', '화', '수', '목', '금', '토']}>
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
                            const pressed = 'pressed' in day && day.pressed;
                            const ariaLabel = 'ariaLabel' in day ? day.ariaLabel : undefined;
                            return (
                              <td class={day.className || undefined} data-date={day.value}>
                                <button
                                  type="button"
                                  class="btn-set-date"
                                  ref={(element) => {
                                    if (day.disabled)
                                      queueMicrotask(() =>
                                        element.setAttribute('disabled', 'true'),
                                      );
                                  }}
                                  disabled={day.disabled}
                                  aria-pressed={pressed ? 'true' : undefined}
                                  aria-label={ariaLabel}
                                  onClick={(event) => {
                                    setSelected(day.value ?? day.label);
                                    invokeHandler(native.onChange, event);
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
                    class={['krds-btn', 'small', action.variant].filter(Boolean).join(' ')}
                    onClick={(event) => invokeHandler(native.onClick, event)}
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
    createEffect(() => {
      const currentKind = kind();
      if (
        currentKind !== 'header' &&
        currentKind !== 'modal' &&
        currentKind !== 'modal-sample'
      )
        return;
      const currentOpen = open();
      const focusSurface = currentKind === 'header' ? headerMobileMenu : modalRoot;
      if (currentOpen && !wasFocusSurfaceOpen) {
        if (typeof document !== 'undefined') {
          const activeElement = document.activeElement;
          restoreFocus =
            activeElement instanceof HTMLElement &&
            activeElement !== document.body &&
            !focusSurface?.contains(activeElement)
              ? activeElement
              : undefined;
        }
        queueMicrotask(() => {
          if (!open() || !focusSurface?.isConnected) return;
          const focusTarget =
            currentKind === 'header'
              ? focusSurface.querySelector<HTMLElement>('.gnb-wrap')
              : focusSurface.querySelector<HTMLElement>(focusableSelector);
          focusTarget?.focus();
        });
      } else if (!currentOpen && wasFocusSurfaceOpen) {
        const focusTarget = currentKind === 'header' ? headerMobileTrigger : restoreFocus;
        queueMicrotask(() => {
          if (focusTarget?.isConnected) focusTarget.focus();
        });
        restoreFocus = undefined;
      }
      wasFocusSurfaceOpen = currentOpen;
    });
    onCleanup(() => {
      if (wasFocusSurfaceOpen && restoreFocus?.isConnected) restoreFocus.focus();
    });
    return kind() === 'badge' || kind() === 'badge-number' || kind() === 'badge-size' ? (
      <span
        {...(native as Record<string, unknown>)}
        class={[
          'krds-badge',
          props.appearance === 'outline'
            ? `outline-${tones[props.tone]}`
            : `bg-${props.tone === 'primary' ? 'primary' : tones[props.tone]}`,
          props.size,
          (kind() === 'badge-number' || props.number) && 'number',
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {content()}
      </span>
    )
      : kind() === 'breadcrumb' ? (
      <nav
        {...(native as Record<string, unknown>)}
        id={props.id}
        class={`krds-breadcrumb-wrap${className() ? ` ${className()}` : ''}`}
        aria-label={native['aria-label'] ?? props.label ?? '현재 경로'}
      >
        <ol class="breadcrumb">
          <For each={props.items}>
            {(item, itemIndex) => (
              <li classList={{ home: itemIndex() === 0 }}>
                <a
                  class="txt"
                  href={
                    typeof item !== 'string' && typeof item !== 'number' && 'href' in item
                      ? (item.href ?? '#')
                      : '#'
                  }
                >
                  {labelOf(item)}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    )
      : kind() === 'button-icon' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={['krds-btn', 'icon', props.size, className()].filter(Boolean).join(' ')}
      >
        <span class="sr-only">{props.label}</span>
        {props.icon ?? <i class="svg-icon ico-sch" />}
      </button>
    ) : kind() === 'button-text' || kind() === 'button-with-icon' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={[
          'krds-btn',
          kind() === 'button-text' && 'text',
          props.size,
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {content()}
        <Show when={kind() === 'button-with-icon'}>
          {props.icon ?? <i class="svg-icon ico-sch" />}
        </Show>
      </button>
    ) : kind() === 'button-hierarchy' || kind() === 'button-size' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        disabled={props.disabled}
        class={[
          'krds-btn',
          kind() === 'button-hierarchy' && (props.variant ?? props.tone),
          props.size,
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {content()}
      </button>
    )
    : kind() === 'date-input' ? (
      <div
        {...(native as Record<string, unknown>)}
        class="form-group"
      >
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
                <span class="sr-only">{`${props.calendarLabel ?? '달력'} 열기`}</span>
                <i class="svg-icon ico-calendar" />
              </button>
            </div>
            {renderCalendarSurface(false, false)}
          </div>
        </div>
        <Show when={props.hint}>
          <p class="form-hint">{props.hint}</p>
        </Show>
      </div>
    ) : kind() === 'calendar' || kind() === 'calendar-range' ? (
      renderCalendarSurface(kind() === 'calendar', true)
    ) : kind() === 'carousel' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['main-vban-wrap', 'bg', className()].filter(Boolean).join(' ')}
      >
        <div class="inner">
          <div class="vb-swiper">
            <div class="swiper">
              <ul class="swiper-wrapper">
                <For each={props.slides}>
                  {(slide, slideIndex) => (
                    <li
                      class="swiper-slide"
                      classList={{
                        'swiper-slide-active': slideIndex() === currentSlideIndex(),
                        'swiper-slide-prev':
                          props.slides.length > 1 &&
                          slideIndex() ===
                            (currentSlideIndex() - 1 + props.slides.length) %
                              props.slides.length,
                        'swiper-slide-next':
                          props.slides.length > 1 &&
                          slideIndex() ===
                            (currentSlideIndex() + 1) % props.slides.length,
                      }}
                      aria-current={
                        slideIndex() === currentSlideIndex() ? 'true' : undefined
                      }
                    >
                      <div class="in">
                        <div class="text">
                          <p class="tit">
                            {slide.title}
                            <br class="w-hide" />
                            {slide.title}
                          </p>
                          <Show when={slide.description}>
                            <p class="txt">
                              {slide.description}
                              <br class="w-hide" />
                              {slide.description}
                            </p>
                          </Show>
                          <a href={slide.href ?? props.href ?? '#'} class="krds-btn primary">
                            {props.actionLabel}
                          </a>
                        </div>
                        <div class="im">
                          <svg
                            width="243"
                            height="178"
                            viewBox="0 0 243 178"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label={props.imageLabel}
                          >
                            <rect width="243" height="178" fill="#E6E8EA" />
                          </svg>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <button type="button" class="swiper-button-prev" onClick={() => moveSlide(-1)}>
              <span class="sr-only">{props.previousLabel}</span>
            </button>
            <button type="button" class="swiper-button-next" onClick={() => moveSlide(1)}>
              <span class="sr-only">{props.nextLabel}</span>
            </button>
            <div class="swiper-indicator text-center">
              <div class="swiper-pagination" />
              <a href={props.href ?? '#'} class="swiper-button-more">
                <span class="sr-only">{props.moreLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : kind() === 'carousel-banner' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`main-d-ban-swiper${className() ? ` ${className()}` : ''}`}
      >
        <div class="swiper">
          <ul class="swiper-wrapper">
            <For each={props.slides}>
              {(slide, slideIndex) => (
                <li
                  class="swiper-slide"
                  classList={{
                    'swiper-slide-active': slideIndex() === currentSlideIndex(),
                    'swiper-slide-prev':
                      props.slides.length > 1 &&
                      slideIndex() ===
                        (currentSlideIndex() - 1 + props.slides.length) %
                          props.slides.length,
                    'swiper-slide-next':
                      props.slides.length > 1 &&
                      slideIndex() ===
                        (currentSlideIndex() + 1) % props.slides.length,
                  }}
                  aria-current={
                    slideIndex() === currentSlideIndex() ? 'true' : undefined
                  }
                >
                  <div class="text">
                    <Show when={slide.description}>
                      <p class="cate">{slide.description}</p>
                    </Show>
                    <p class="tit">{slide.title}</p>
                  </div>
                  <div class="im">
                    <svg
                      width="243"
                      height="178"
                      viewBox="0 0 243 178"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label={props.imageLabel}
                    >
                      <rect width="243" height="178" fill="#E6E8EA" />
                    </svg>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
        <div class="swiper-indicator">
          <div class="swiper-pagination" />
          <div class="swiper-controller">
            <button
              type="button"
              class="swiper-button-play"
              onClick={() => setChecked(true)}
            >
              <span class="sr-only">{props.playLabel}</span>
            </button>
            <button
              type="button"
              class="swiper-button-stop"
              onClick={() => setChecked(false)}
            >
              <span class="sr-only">{props.stopLabel}</span>
            </button>
          </div>
          <div class="swiper-navigation">
            <button type="button" class="swiper-button-prev" onClick={() => moveSlide(-1)}>
              <span class="sr-only">{props.previousLabel}</span>
            </button>
            <button type="button" class="swiper-button-next" onClick={() => moveSlide(1)}>
              <span class="sr-only">{props.nextLabel}</span>
            </button>
            <a href={props.href ?? '#'} class="swiper-button-more">
              <span class="sr-only">{props.moreLabel}</span>
            </a>
          </div>
        </div>
      </div>
    ) : kind() === 'checkbox-chip' ? (
      <div class={`krds-form-chip${className() ? ` ${className()}` : ''}`}>
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          class="checkbox"
          type="checkbox"
          name={props.name}
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label class="krds-form-chip-outline" for={props.id}>
          {content()}
        </label>
      </div>
    ) : kind() === 'radio-chip' ? (
      <div class={`krds-form-chip${className() ? ` ${className()}` : ''}`}>
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          class="radio"
          type="radio"
          name={props.name}
          value={
            typeof props.value === 'string' || typeof props.value === 'number'
              ? String(props.value)
              : undefined
          }
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label class="krds-form-chip-outline" for={props.id}>
          {content()}
        </label>
      </div>
    ) : kind() === 'checkbox-size' || kind() === 'radio-size' ? (
      <div
        class={[
          'krds-form-check',
          props.size,
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          type={kind() === 'radio-size' ? 'radio' : 'checkbox'}
          name={props.name}
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label for={props.id}>{content()}</label>
      </div>
    )
    : kind() === 'coach-mark' ? (
      <div
        {...(native as Record<string, unknown>)}
        hidden={props.open === false}
        class={['krds-coach-mark', 'txt-box', 'bg-white', 'bg-white', className()]
          .filter(Boolean)
          .join(' ')}
      >
        <div class="coach-balloon">
          <h5 class="sr-only">{props.title}</h5>
          <h6 class="coach-tit">{props.stepTitle}</h6>
          <p class="desc">{props.description}</p>
          <div class="coach-controls">
            <div class="num">
              <span class="sr-only">{props.currentStepLabel}</span>
              <strong>{props.currentStep}</strong>
              <span class="sr-only">{props.totalStepsLabel}</span>
              <span>{props.totalSteps}</span>
            </div>
            <div class="btn-wrap">
              <button type="button" class="krds-btn small text">{props.stopLabel}</button>
              <button type="button" class="krds-btn small tertiary">{props.nextLabel}</button>
            </div>
          </div>
        </div>
        <div><h3>{props.contentTitle ?? children()}</h3></div>
      </div>
    ) : kind() === 'contextual-help' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={[
          'krds-contextual-help',
          props.position === 'top-left' ? 'left top' : props.position?.replace('-', ' '),
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <p class="tooltip-txt">{props.caption}</p>
        <div class="tooltip-action">
          <button
            type="button"
            class="krds-btn medium icon tooltip-btn"
            aria-expanded={open()}
            aria-controls={`${props.id}-popover`}
            onClick={() => setOpen(!open())}
          >
            <span class="sr-only">{props.label}</span>
            <i class="svg-icon ico-tooltip" />
          </button>
          <div id={`${props.id}-popover`} class="tooltip-popover" role="tooltip" hidden={!open()}>
            <h4 class="tooltip-title">{props.title}</h4>
            <div class="tooltip-contents">
              <p>{props.description ?? children()}</p>
              <Show when={props.href}>
                <div class="btn-wrap">
                  <a class="krds-btn xsmall basic link" href={props.href}>
                    {props.linkLabel}
                    <i class="svg-icon ico-angle right" />
                  </a>
                </div>
              </Show>
            </div>
            <button
              type="button"
              class="krds-btn xsmall icon tooltip-close"
              onClick={() => setOpen(false)}
            >
              <span class="sr-only">{props.closeLabel}</span>
              <i class="svg-icon ico-modal-close" />
            </button>
          </div>
        </div>
      </div>
    ) : kind() === 'critical-alerts' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-critical-alerts${className() ? ` ${className()}` : ''}`}
        role="alert"
      >
        <ul>
          <For each={props.items}>
            {(item) => {
              const alert = () =>
                typeof item === 'string' || typeof item === 'number'
                  ? undefined
                  : (item as AlertItem);
              const badge = () => alert()?.badge;
              const href = () => alert()?.href;
              return (
                <li>
                  <div class="critical-ban">
                    <Show when={badge()}>
                      <span class={`critical-badge ${badge()}`}>{alert()?.badgeLabel}</span>
                    </Show>
                    <p class="critical-txt">{labelOf(item)}</p>
                    <Show when={href()}>
                      <a class="krds-btn medium basic link" href={href()}>
                        <span class="m-hide">{alert()?.linkLabel ?? props.actionLabel}</span>
                        <i class="svg-icon ico-angle right" />
                      </a>
                    </Show>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    ) : kind() === 'disclosure' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={[
          'krds-disclosure',
          'conts-expand-area',
          open() && 'active',
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button
          type="button"
          class="btn-conts-expand"
          id={`${props.id}-trigger`}
          aria-expanded={open()}
          aria-controls={`${props.id}-content`}
          onClick={(event) => {
            setOpen(!open());
            invokeHandler(native.onClick, event);
          }}
        >
          {props.title}
        </button>
        <div
          id={`${props.id}-content`}
          class="expand-wrap"
          role="region"
          aria-labelledby={`${props.id}-trigger`}
          inert={!open()}
        >
          <div class="expand-in">
            <Show
              when={props.items.length > 0}
              fallback={props.description ?? children()}
            >
              <ul class="krds-info-list dash" role="list">
                <For each={props.items}>
                  {(item) => <li role="listitem">{labelOf(item)}</li>}
                </For>
              </ul>
            </Show>
          </div>
        </div>
      </div>
    ) : kind() === 'favicon' ? (
      <link
        {...(native as Record<string, unknown>)}
        rel="icon"
        href={props.href}
        sizes={props.size ?? '32x32'}
        type={'type' in native ? String(native.type ?? 'image/png') : 'image/png'}
      />
    ) : kind() === 'file-upload' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-file-upload line${className() ? ` ${className()}` : ''}`}
      >
        <div class="file-head">
          <h3 class="tit">{props.title}</h3>
          <div><p>{props.description}</p></div>
        </div>
        <div class="file-upload">
          <p class="txt">{props.prompt}</p>
          <div class="file-upload-btn-wrap">
            <input
              hidden
              id={props.inputId}
              name={props.name}
              type="file"
              onChange={(event) => {
                setValue(
                  Array.from(event.currentTarget.files ?? [])
                    .map((file) => file.name)
                    .join(', '),
                );
                invokeHandler(native.onChange, event);
              }}
            />
            <label for={props.inputId}>
              <button type="button" class="krds-btn medium">
                <i class="svg-icon ico-upload" />
                {props.selectLabel}
              </button>
            </label>
          </div>
        </div>
        <div class="file-list">
          <div class="total"><span class="current">{props.currentCount}개</span> / {props.maxCount}개</div>
          <ul class="upload-list">
            <For each={props.files}>
              {(file) => (
                <li classList={{ 'is-error': file.status === 'error' }}>
                  <div
                    class="file-info"
                    classList={{ 'm-column': file.status === 'downloadable' }}
                  >
                    <div class="file-name">{file.name}</div>
                    <div class="btn-wrap">
                      <Show when={file.status === 'uploading'}>
                        <span class="krds-spinner" role="status">
                          <span class="sr-only">{file.statusLabel}</span>
                        </span>
                      </Show>
                      <Show when={file.status === 'complete'}>
                        <span class="ico-invalid complete">
                          <em class="sr-only">{file.statusLabel}</em>
                        </span>
                      </Show>
                      <Show when={file.status === 'deletable' || file.status === 'error'}>
                        <button type="button" class="krds-btn medium text">
                          {file.deleteLabel}
                          <i class="svg-icon ico-delete-fill" />
                        </button>
                      </Show>
                      <Show when={file.status === 'downloadable'}>
                        <button type="button" class="krds-btn medium text">
                          {file.downloadLabel}
                          <i class="svg-icon ico-down" />
                        </button>
                        <button type="button" class="krds-btn medium text">
                          {file.previewLabel}
                          <i class="svg-icon ico-angle right" />
                        </button>
                      </Show>
                    </div>
                  </div>
                  <Show when={file.errors?.length}>
                    <p class="file-hint-invalid">
                      <For each={file.errors}>
                        {(error, errorIndex) => (
                          <>
                            {error}
                            <Show when={errorIndex() < (file.errors?.length ?? 0) - 1}><br /></Show>
                          </>
                        )}
                      </For>
                    </p>
                  </Show>
                </li>
              )}
            </For>
          </ul>
          <div class="upload-delete-btn">
            <button type="button" class="krds-btn xsmall tertiary">
              {props.deleteAllLabel}
              <i class="svg-icon ico-angle right" />
            </button>
          </div>
        </div>
      </div>
    ) : kind() === 'footer' ? (
      <footer {...(native as Record<string, unknown>)} id={props.id} class={className() || undefined}>
        <div class="foot-quick">
          <div class="inner">
            <For each={props.relatedSites}>
              {(item) => (
                <button type="button" class="link" title={item.title}>{item.label}</button>
              )}
            </For>
          </div>
        </div>
        <div class="inner">
          <div class="f-logo">
            <span class="sr-only">{props.logoLabel}</span>
          </div>
          <div class="f-cnt">
            <div class="f-info">
              <p class="info-addr">{props.address}</p>
              <ul class="info-cs">
                <For each={props.contacts}>
                  {(contact) => (
                    <li>
                      <strong class="strong">{contact.title}</strong>
                      <span class="span">{contact.description}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="f-link">
              <div class="link-go">
                <For each={props.links as MenuItem[]}>
                  {(item) => (
                    <a href={item.href ?? '#'} class="krds-btn medium text">
                      {item.label}
                      <i class="svg-icon ico-angle right" />
                    </a>
                  )}
                </For>
              </div>
              <div class="link-sns">
                <For each={props.socialLinks}>
                  {(item) => (
                    <a
                      href={item.href ?? '#'}
                      class="krds-btn xlarge icon border"
                      target={item.target}
                      title={item.title}
                    >
                      <span class="sr-only">{item.label}</span>
                      <i class={`svg-icon ico-${item.icon}`} />
                    </a>
                  )}
                </For>
              </div>
            </div>
          </div>
          <div class="f-btm">
            <div class="f-btm-text">
              <div class="f-menu">
                <For each={props.policyLinks as MenuItem[]}>
                  {(item) => (
                    <a href={item.href ?? '#'} classList={{ point: item.emphasis }}>{item.label}</a>
                  )}
                </For>
              </div>
              <p class="f-copy">{props.copyright}</p>
            </div>
            <div class="krds-identifier">
              <span class="logo"><span class="sr-only">{props.organization}</span></span>
              <span class="ban-txt">{props.description}</span>
            </div>
          </div>
        </div>
      </footer>
    ) : kind() === 'header' ? (
      <header
        {...(native as Record<string, unknown>)}
        id={props.id}
        class={className() || undefined}
        onClick={(event) => {
          invokeHandler(native.onClick, event);
          if (!(event.target as Element).closest('.krds-drop-wrap')) {
            setActiveHeaderDropdown(undefined);
          }
        }}
        onFocusOut={(event) => {
          invokeHandler(native.onFocusOut, event);
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setActiveHeaderDropdown(undefined);
          }
        }}
        onKeyDown={(event) => {
          invokeHandler(native.onKeyDown, event);
          if (
            !event.defaultPrevented &&
            (event.key === 'Escape' || event.key === 'Esc') &&
            activeHeaderDropdown()
          ) {
            event.preventDefault();
            const trigger = (event.target as Element)
              .closest('.krds-drop-wrap')
              ?.querySelector<HTMLButtonElement>('.drop-btn');
            setActiveHeaderDropdown(undefined);
            queueMicrotask(() => trigger?.focus());
          }
        }}
      >
        <div class="header-in">
          <div class="header-container">
            <div class="inner">
              <div class="header-utility">
                <ul class="utility-list">
                  <For each={props.utilityItems}>
                    {(item, itemIndex) => (
                      <li>
                        <Show
                          when={item.kind === 'link'}
                          fallback={
                            <div
                              class="krds-drop-wrap"
                              classList={{ 'krds-resize': item.kind === 'resize' }}
                            >
                              <button
                                type="button"
                                class="krds-btn small text drop-btn"
                                classList={{ active: activeHeaderDropdown() === item.id }}
                                aria-expanded={activeHeaderDropdown() === item.id}
                                aria-controls={`${props.id}-utility-${item.id ?? itemIndex()}-menu`}
                                onClick={() =>
                                  setActiveHeaderDropdown((current) =>
                                    current === item.id ? undefined : item.id,
                                  )
                                }
                              >
                                {item.label}
                                <i class="svg-icon ico-toggle" />
                              </button>
                              <div
                                id={`${props.id}-utility-${item.id ?? itemIndex()}-menu`}
                                class="drop-menu"
                                style={
                                  activeHeaderDropdown() === item.id
                                    ? 'display: block;'
                                    : undefined
                                }
                              >
                                <div class="drop-in">
                                  <ul class="drop-list">
                                    <For each={item.items}>
                                      {(dropItem) => (
                                        <li>
                                          <Show
                                            when={item.kind === 'resize'}
                                            fallback={
                                              <a
                                                href={dropItem.href ?? '#'}
                                                class={['item-link', dropItem.className]
                                                  .filter(Boolean)
                                                  .join(' ')}
                                                target={dropItem.target}
                                                title={dropItem.title}
                                              >
                                                {dropItem.label}
                                                <span class="sr-only" />
                                              </a>
                                            }
                                          >
                                            <button
                                              type="button"
                                              class={['item-link', dropItem.className]
                                                .filter(Boolean)
                                                .join(' ')}
                                              classList={{ active: dropItem.selected }}
                                            >
                                              {dropItem.label}
                                              <span class="sr-only">
                                                {dropItem.selected ? item.selectedLabel : undefined}
                                              </span>
                                            </button>
                                          </Show>
                                        </li>
                                      )}
                                    </For>
                                  </ul>
                                  <Show when={item.kind === 'resize'}>
                                    <div class="drop-bottom">
                                      <button type="button" class="krds-btn medium text">
                                        <i class="svg-icon ico-reset" />
                                        {item.resetLabel}
                                      </button>
                                    </div>
                                  </Show>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <a
                            href={item.href ?? '#'}
                            class="krds-btn small text"
                            target={item.target}
                            title={item.title}
                          >
                            {item.label}
                            <i class="svg-icon ico-go" />
                          </a>
                        </Show>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
              <div class="header-branding">
                <h2 class="logo">
                  <a href={props.logoHref}>
                    <span class="sr-only">{props.logoLabel}</span>
                  </a>
                </h2>
                <div class="header-actions">
                  <button
                    type="button"
                    class="btn-navi sch"
                    title={props.searchTitle}
                    aria-label={props.searchLabel ?? props.searchTitle}
                  >
                    {props.searchLabel}
                  </button>
                  <a href={props.loginHref} class="btn-navi login">{props.loginLabel}</a>
                  <button type="button" class="btn-navi join">{props.joinLabel}</button>
                  <div class="krds-drop-wrap my-drop">
                    <button
                      type="button"
                      class="btn-navi my drop-btn"
                      aria-expanded={activeHeaderDropdown() === 'header-my-menu'}
                      aria-controls={`${props.id}-my-menu`}
                      onClick={() =>
                        setActiveHeaderDropdown((current) =>
                          current === 'header-my-menu' ? undefined : 'header-my-menu',
                        )
                      }
                    >
                      {props.myMenu?.label}
                    </button>
                    <div
                      id={`${props.id}-my-menu`}
                      class="drop-menu"
                      style={
                        activeHeaderDropdown() === 'header-my-menu'
                          ? 'display: block;'
                          : undefined
                      }
                    >
                      <div class="drop-in">
                        <div class="drop-top">
                          <p class="my-name">{props.myMenu?.userName}</p>
                          <dl class="my-time">
                            <dt>{props.myMenu?.timeLabel}</dt>
                            <dd>
                              <span class="time">{props.myMenu?.time}</span>
                              <button type="button" class="krds-btn medium text">
                                {props.myMenu?.extendLabel}
                              </button>
                            </dd>
                          </dl>
                        </div>
                        <ul class="drop-list">
                          <For each={props.myMenu?.items}>
                            {(item) => (
                              <li>
                                <a href={item.href ?? '#'} class="item-link">
                                  {item.label}
                                  <span class="sr-only" />
                                </a>
                              </li>
                            )}
                          </For>
                        </ul>
                        <div class="drop-bottom">
                          <button type="button" class="krds-btn medium text">
                            <i class="svg-icon ico-logout" />
                            {props.myMenu?.logoutLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    ref={(element) => {
                      headerMobileTrigger = element;
                    }}
                    type="button"
                    class="btn-navi all"
                    aria-controls="mobile-nav"
                    aria-expanded={open()}
                    onClick={() => setOpen(!open())}
                  >
                    {props.allMenuLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <MainMenuPc
            {...(props.desktopItems === undefined ? {} : { items: props.desktopItems })}
            {...(props.menuLabel === undefined ? {} : { menuLabel: props.menuLabel })}
          />
        </div>
        <MainMenuMobile
          id="mobile-nav"
          ref={(element) => {
            headerMobileMenu = element;
          }}
          open={open()}
          style={`display: ${open() ? 'block' : 'none'};`}
          navigationRole={false}
          bottomSize="medium"
          {...(props.mobileMenu === undefined
            ? {}
            : {
                utilityItems: props.mobileMenu.utilityItems,
                loginLabel: props.mobileMenu.loginLabel,
                serviceItems: props.mobileMenu.serviceItems,
                searchPlaceholder: props.mobileMenu.searchPlaceholder,
                searchTitle: props.mobileMenu.searchTitle,
                searchLabel: props.mobileMenu.searchLabel,
                items: props.mobileMenu.items,
                previousLabel: props.mobileMenu.previousLabel,
                closeLabel: props.mobileMenu.closeLabel,
                bottomItems: props.mobileMenu.bottomItems,
              })}
          onClose={(event: Event) => {
            setOpen(false);
            invokeHandler(native.onClose, event);
          }}
        />
      </header>
    ) : kind() === 'main-menu-mobile' ? (
      <div
        {...(native as Record<string, unknown>)}
        ref={(element) => {
          mobileMenuRoot = element;
        }}
        id={props.id}
        class={['krds-main-menu-mobile', className()].filter(Boolean).join(' ')}
        classList={{
          'is-backdrop': props.open === true,
          'is-open': props.open === true,
        }}
        role={props.navigationRole === false ? undefined : props.navigationRole ?? 'navigation'}
        onClick={(event) => {
          invokeHandler(native.onClick, event);
          if (
            props.open === true &&
            !(event.target as Element).closest('.gnb-wrap')
          ) {
            event.currentTarget.querySelector<HTMLElement>('.gnb-wrap')?.focus();
          }
        }}
        onKeyDown={(event) => {
          invokeHandler(native.onKeyDown, event);
          if (event.defaultPrevented) return;
          if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            if (activeMobileDepth4()) closeMobileDepth4();
            else if (props.open !== undefined) closeMobileMenu(event);
            return;
          }
          const focusSurface = activeMobileDepth4()
            ? event.currentTarget.querySelector<HTMLElement>('.depth4-wrap.is-open')
            : props.open === true
              ? event.currentTarget
              : undefined;
          if (focusSurface) trapTabFocus(event, focusSurface);
        }}
      >
        <div class="gnb-wrap" tabIndex={props.open === true ? 0 : undefined}>
          <div class="gnb-header">
            <div class="gnb-utils">
              <ul class="utility-list">
                <For each={props.utilityItems}>
                  {(item) => (
                    <li>
                      <button type="button" class="krds-btn xsmall text">
                        {item.label}
                      </button>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="gnb-login">
              <button type="button" class="krds-btn large text">
                <i class="svg-icon ico-log" />
                {props.loginLabel}
              </button>
            </div>
            <div class="gnb-service-menu">
              <For each={props.serviceItems}>
                {(item) => (
                  <a href={item.href ?? '#'} class="link">
                    {item.label}
                  </a>
                )}
              </For>
            </div>
            <div class="sch-input">
              <input
                type="text"
                class="krds-input"
                placeholder={props.searchPlaceholder}
                title={props.searchTitle}
                aria-label={props.searchLabel ?? props.searchTitle ?? props.searchPlaceholder}
              />
              <button type="button" class="krds-btn medium icon ico-search">
                <span class="sr-only">{props.searchLabel}</span>
                <i class="svg-icon ico-sch" />
              </button>
            </div>
          </div>
          <div class="gnb-body">
            <div class="gnb-menu">
              <div class="menu-wrap">
                <ul role="tablist">
                  <For each={navigation() as MenuItem[]}>
                    {(item, itemIndex) => (
                      <li role="none">
                        <a
                          id={`${props.id}-tab-${itemIndex()}`}
                          href={`#${item.id}`}
                          class="gnb-main-trigger"
                          classList={{ active: mobileTabId() === item.id }}
                          role="tab"
                          aria-selected={mobileTabId() === item.id}
                          aria-controls={item.id}
                          onClick={(event) => {
                            event.preventDefault();
                            setLocalMobileTab(item.id);
                            invokeHandler(native.onChange, event);
                          }}
                        >
                          {item.label}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
              <div class="submenu-wrap">
                <For each={navigation() as MenuItem[]}>
                  {(item, itemIndex) => (
                    <div
                      class="gnb-sub-list"
                      id={item.id}
                      role="tabpanel"
                      aria-labelledby={`${props.id}-tab-${itemIndex()}`}
                    >
                      <h2 class="sub-title">{item.label}</h2>
                      <ul>
                        <For each={item.children}>
                          {(child) => {
                            const depth3Open = () => activeMobileDepth3() === child.id;
                            return (
                              <li>
                                <a
                                  href={child.href ?? '#'}
                                  class="gnb-sub-trigger"
                                  classList={{
                                    'has-depth3': Boolean(child.children?.length),
                                    active: depth3Open(),
                                  }}
                                  aria-expanded={
                                    child.children?.length ? depth3Open() : undefined
                                  }
                                  aria-controls={
                                    child.children?.length
                                      ? `${props.id}-depth3-${child.id}`
                                      : undefined
                                  }
                                  onClick={(event) => {
                                    if (!child.children?.length) return;
                                    event.preventDefault();
                                    setActiveMobileDepth3((current) =>
                                      current === child.id ? undefined : child.id,
                                    );
                                  }}
                                >
                                  {child.label}
                                </a>
                                <Show when={child.children?.length}>
                                  <div
                                    id={`${props.id}-depth3-${child.id}`}
                                    class="depth3-wrap"
                                    classList={{ 'is-open': depth3Open() }}
                                  >
                                    <ul>
                                      <For each={child.children}>
                                        {(depth3) => (
                                          <li>
                                            <a
                                              href={depth3.href ?? '#'}
                                              class="depth3-trigger"
                                              classList={{
                                                'has-depth4': Boolean(depth3.children?.length),
                                              }}
                                              onClick={(event) => {
                                                if (!depth3.children?.length) return;
                                                event.preventDefault();
                                                mobileDepth4Trigger = event.currentTarget;
                                                setActiveMobileDepth4(depth3.id);
                                                queueMicrotask(() => {
                                                  mobileMenuRoot
                                                    ?.querySelector<HTMLButtonElement>(
                                                      '.depth4-wrap.is-open .trigger-prev',
                                                    )
                                                    ?.focus();
                                                });
                                              }}
                                            >
                                              {depth3.label}
                                            </a>
                                            <Show when={depth3.children?.length}>
                                              <div
                                                class="depth4-wrap"
                                                classList={{
                                                  'is-open':
                                                    activeMobileDepth4() === depth3.id,
                                                }}
                                                style={
                                                  activeMobileDepth4() === depth3.id
                                                    ? 'display: block;'
                                                    : undefined
                                                }
                                              >
                                                <div class="depth4-head">
                                                  <button
                                                    type="button"
                                                    class="krds-btn icon trigger-prev"
                                                    onClick={closeMobileDepth4}
                                                  >
                                                    <span class="sr-only">
                                                      {props.previousLabel}
                                                    </span>
                                                    <i class="svg-icon ico-angle left" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    class="krds-btn icon trigger-close"
                                                    onClick={closeMobileDepth4}
                                                  >
                                                    <span class="sr-only">
                                                      {props.closeLabel}
                                                    </span>
                                                    <i class="svg-icon ico-popup-close" />
                                                  </button>
                                                </div>
                                                <ul class="depth4-body">
                                                  <h4 class="sub-title">{depth3.title}</h4>
                                                  <ul class="depth4-ul">
                                                    <For each={depth3.children}>
                                                      {(depth4) => (
                                                        <li>
                                                          <a href={depth4.href ?? '#'}>
                                                            {depth4.label}
                                                          </a>
                                                        </li>
                                                      )}
                                                    </For>
                                                  </ul>
                                                </ul>
                                              </div>
                                            </Show>
                                          </li>
                                        )}
                                      </For>
                                    </ul>
                                  </div>
                                </Show>
                              </li>
                            );
                          }}
                        </For>
                      </ul>
                    </div>
                  )}
                </For>
              </div>
            </div>
            <div class="gnb-bottom">
              <For each={props.bottomItems}>
                {(item) => (
                  <a
                    href={item.href ?? '#'}
                    class={`krds-btn ${props.bottomSize ?? 'small'} text`}
                    target={item.target}
                    title={item.title}
                  >
                    {item.label}
                    <i class={item.target ? 'svg-icon ico-go' : 'svg-icon ico-angle right'} />
                  </a>
                )}
              </For>
            </div>
          </div>
          <button
            type="button"
            class="krds-btn medium icon"
            id={props.id === 'mobile-nav' ? 'close-nav' : `${props.id}-close`}
            onClick={closeMobileMenu}
          >
            <span class="sr-only">{props.closeLabel}</span>
            <i class="svg-icon ico-popup-close" />
          </button>
        </div>
      </div>
    ) : kind() === 'main-menu-pc' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={['krds-main-menu', className()].filter(Boolean).join(' ')}
        onFocusOut={(event) => {
          invokeHandler(native.onFocusOut, event);
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setLocalMainMenu(false);
          }
        }}
        onKeyUp={(event) => {
          invokeHandler(native.onKeyUp, event);
          if (
            !event.defaultPrevented &&
            (event.key === 'Escape' || event.key === 'Esc')
          ) {
            setLocalMainMenu(false);
          }
        }}
        onKeyDown={(event) => {
          invokeHandler(native.onKeyDown, event);
          if (event.defaultPrevented) return;
          const target = event.target as HTMLElement;
          if (!target.matches('[data-trigger="gnb"]')) return;
          const mainTriggers = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              '.gnb-menu > li > [data-trigger="gnb"]',
            ),
          );
          let focusTarget: HTMLElement | null | undefined;
          if (event.key === 'Home') focusTarget = mainTriggers[0];
          else if (event.key === 'End') focusTarget = mainTriggers[mainTriggers.length - 1];
          else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            focusTarget = target
              .closest('li')
              ?.nextElementSibling?.querySelector<HTMLElement>('[data-trigger="gnb"]');
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            focusTarget = target
              .closest('li')
              ?.previousElementSibling?.querySelector<HTMLElement>('[data-trigger="gnb"]');
          }
          if (focusTarget) {
            event.preventDefault();
            focusTarget.focus();
          }
        }}
      >
        <div class="inner">
          <ul class="gnb-menu" aria-label={props.menuLabel}>
            <For each={navigation() as MenuItem[]}>
              {(item) => (
                <li>
                  <Show
                    when={!item.href && !item.button}
                    fallback={
                      item.button ? (
                        <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                          {item.label}
                        </button>
                      ) : (
                        <a
                          href={item.href ?? '#'}
                          class="gnb-main-trigger is-link"
                          data-trigger="gnb"
                          target={item.target}
                          title={item.title}
                        >
                          {item.label}
                        </a>
                      )
                    }
                  >
                    <button
                      type="button"
                      class="gnb-main-trigger"
                      classList={{ active: mainMenuIsActive(item) }}
                      data-trigger="gnb"
                      aria-controls={`${props.id}-main-${item.id}`}
                      aria-expanded={mainMenuIsActive(item)}
                      aria-haspopup="true"
                      onClick={() =>
                        setLocalMainMenu((current) =>
                          current === item.id || (current === undefined && item.active)
                            ? false
                            : item.id,
                        )
                      }
                    >
                      {item.label}
                    </button>
                    <div
                      id={`${props.id}-main-${item.id}`}
                      class="gnb-toggle-wrap"
                      classList={{ 'is-open': mainMenuIsActive(item) }}
                    >
                      <div
                        class="gnb-main-list"
                        data-has-submenu={
                          item.title && item.banner
                            ? undefined
                            : item.children?.length
                              ? 'true'
                              : undefined
                        }
                      >
                        <Show
                          when={item.title && item.banner}
                          fallback={
                            <ul>
                              <For each={item.children}>
                                {(child, childIndex) => (
                                  <li>
                                    <Show
                                      when={!child.href}
                                      fallback={
                                        <a
                                          href={child.href ?? '#'}
                                          class="gnb-sub-trigger is-link"
                                          classList={{ 'external-link': Boolean(child.target) }}
                                          data-trigger="gnb"
                                          target={child.target}
                                          title={child.title}
                                        >
                                          {child.label}
                                        </a>
                                      }
                                    >
                                      <button
                                        type="button"
                                        class="gnb-sub-trigger"
                                        classList={{
                                          active: subMenuIsActive(item, child, childIndex()),
                                        }}
                                        data-trigger="gnb"
                                        aria-controls={`${props.id}-sub-${child.id}`}
                                        aria-expanded={subMenuIsActive(item, child, childIndex())}
                                        aria-haspopup="true"
                                        onClick={() =>
                                          setLocalSubMenu({
                                            ...(item.id === undefined
                                              ? {}
                                              : { parentId: item.id }),
                                            ...(child.id === undefined
                                              ? {}
                                              : { childId: child.id }),
                                          })
                                        }
                                      >
                                        {child.label}
                                      </button>
                                      <div
                                        id={`${props.id}-sub-${child.id}`}
                                        class="gnb-sub-list"
                                        classList={{
                                          active: subMenuIsActive(item, child, childIndex()),
                                          between:
                                            !subMenuIsActive(item, child, childIndex()) &&
                                            childIndex() > 0,
                                        }}
                                      >
                                        <div class="gnb-sub-content">
                                          <h2 class="sub-title">
                                            <Show
                                              when={child.descriptionItems?.length}
                                              fallback={child.title}
                                            >
                                              <span>{child.title}</span>
                                            </Show>
                                            <Show when={child.titleHref}>
                                              <a
                                                href={child.titleHref}
                                                class="krds-btn link basic small"
                                              >
                                                <span class="underline">{child.titleLinkLabel}</span>
                                                <i class="svg-icon ico-angle right" />
                                              </a>
                                            </Show>
                                          </h2>
                                          <Show
                                            when={child.descriptionItems?.length}
                                            fallback={
                                              <ul>
                                                <For each={child.children}>
                                                  {(leaf) => (
                                                    <li>
                                                      <Show
                                                        when={leaf.href}
                                                        fallback={<button type="button">{leaf.label}</button>}
                                                      >
                                                        <a href={leaf.href}>{leaf.label}</a>
                                                      </Show>
                                                    </li>
                                                  )}
                                                </For>
                                              </ul>
                                            }
                                          >
                                            <ul class="type-description">
                                              <For each={child.descriptionItems}>
                                                {(description) => (
                                                  <li>
                                                    <h3 class="tit">
                                                      <a
                                                        href={description.href ?? '#'}
                                                        target={description.target}
                                                        title={description.externalTitle}
                                                      >
                                                        {description.title}
                                                        <i class="svg-icon ico-go" />
                                                      </a>
                                                    </h3>
                                                    <p class="txt">{description.description}</p>
                                                  </li>
                                                )}
                                              </For>
                                            </ul>
                                          </Show>
                                        </div>
                                        <Show when={child.banner}>
                                          <div class="gnb-sub-banner">
                                            <span class="krds-badge bg-secondary">{child.banner?.badge}</span>
                                            <button type="button" class="krds-btn medium text">
                                              {child.banner?.label}
                                              <i class="svg-icon ico-angle right" />
                                            </button>
                                          </div>
                                        </Show>
                                      </div>
                                    </Show>
                                  </li>
                                )}
                              </For>
                            </ul>
                          }
                        >
                          <div class="gnb-sub-list single-list between">
                            <div class="gnb-sub-content">
                              <h2 class="sub-title"><span>{item.title}</span></h2>
                              <ul>
                                <For each={item.children}>
                                  {(leaf) => <li><a href={leaf.href ?? '#'}>{leaf.label}</a></li>}
                                </For>
                              </ul>
                            </div>
                            <div class="gnb-sub-banner">
                              <span class="krds-badge bg-secondary">{item.banner?.badge}</span>
                              <button type="button" class="krds-btn medium text">
                                {item.banner?.label}
                                <i class="svg-icon ico-angle right" />
                              </button>
                            </div>
                          </div>
                        </Show>
                      </div>
                    </div>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </div>
      </nav>
    ) : kind() === 'help-panel' || kind() === 'tutorial-panel' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={[
          'krds-help-panel',
          open() && 'expand',
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
        hidden={props.open === false}
      >
        <div class="help-panel-wrap" tabIndex={0}>
          <div class="help-conts-area">
            <div class="krds-tab-area layer">
              <div class="tab line">
                <ul role="tablist">
                  <For each={props.tabs}>
                    {(tab, tabIndex) => {
                      const active = () => {
                        const activeId = localSelected();
                        if (activeId) return activeId === tab.id;
                        return props.activeTab === 'tutorial' ? tabIndex() === 1 : tabIndex() === 0;
                      };
                      return (
                        <li role="none" classList={{ active: active() }}>
                          <button
                            id={tab.id}
                            type="button"
                            class="btn-tab"
                            role="tab"
                            aria-selected={active()}
                            aria-controls={
                              'panelId' in tab && typeof tab.panelId === 'string'
                                ? tab.panelId
                                : undefined
                            }
                            tabIndex={active() ? 0 : -1}
                            disabled={tab.disabled}
                            onClick={() => setLocalSelected(tab.id)}
                          >
                            {tab.label}
                            <Show when={active()}>
                              <i class="sr-only created">{props.selectedLabel}</i>
                            </Show>
                          </button>
                        </li>
                      );
                    }}
                  </For>
                </ul>
              </div>
              <div class="tab-conts-wrap">
                <For each={props.tabs}>
                  {(tab, tabIndex) => {
                    const active = () => {
                      const activeId = localSelected();
                      if (activeId) return activeId === tab.id;
                      return props.activeTab === 'tutorial' ? tabIndex() === 1 : tabIndex() === 0;
                    };
                    return (
                      <section
                        id={
                          'panelId' in tab && typeof tab.panelId === 'string'
                            ? tab.panelId
                            : undefined
                        }
                        role="tabpanel"
                        aria-labelledby={tab.id}
                        class="tab-conts"
                        classList={{ active: active() }}
                      >
                        <h3 class="sr-only">{tab.label}</h3>
                        <div class="help-conts-area-inner">
                          <Show
                            when={tabIndex() === 0}
                            fallback={
                              <>
                                <div class="conts-area">
                                  <h4 class="help-title">
                                    <a
                                      href="#;"
                                      title={props.tutorialBackTitle ?? props.backTitle}
                                    >
                                      {props.tutorialTitle}
                                    </a>
                                  </h4>
                                  <ul class="coach-help-process">
                                    <For each={props.tasks}>
                                      {(task) => (
                                        <li>
                                          <h4 class="tit" classList={{ current: task.current }}>
                                            {task.title}
                                          </h4>
                                          <div class="krds-disclosure conts-expand-area">
                                            <button type="button" class="btn-conts-expand">
                                              {task.summary}
                                            </button>
                                            <div class="expand-wrap">
                                              <div class="expand-in">
                                                <ul class="krds-info-list decimal">
                                                  <For each={task.steps}>
                                                    {(step) => <li>{step}</li>}
                                                  </For>
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      )}
                                    </For>
                                  </ul>
                                </div>
                                <div class="help-panel-action">
                                  <button type="button" class="krds-btn medium secondary coach-btn-stop">
                                    {props.stopLabel}
                                  </button>
                                </div>
                              </>
                            }
                          >
                            <div class="conts-area help-conts">
                              <div class="conts-wrap">
                                <h4 class="help-title">
                                  {props.helpTitle}
                                  <span class="krds-btn medium icon">
                                    <span class="sr-only">{props.title}</span>
                                    <i class="svg-icon ico-help" />
                                  </span>
                                </h4>
                                <div class="conts-desc"><p>{props.helpDescription}</p></div>
                                <ul class="link-list">
                                  <For each={props.downloadLinks}>
                                    {(link) => (
                                      <li>
                                        <a
                                          href={link.href ?? '#'}
                                          target="_blank"
                                          title={link.title ?? props.externalTitle}
                                          class="krds-btn xsmall link basic"
                                        >
                                          {link.label}
                                          <i class="svg-icon ico-go" />
                                        </a>
                                      </li>
                                    )}
                                  </For>
                                </ul>
                              </div>
                            </div>
                            <div class="conts-area related-service">
                              <For each={props.relatedGroups}>
                                {(group) => (
                                  <div class="conts-wrap">
                                    <h4 class="help-title">{group.title}</h4>
                                    <ul class="link-list">
                                      <For each={group.links}>
                                        {(link) => {
                                          const leadingIcon = () =>
                                            Boolean(link.icon && !link.icon.includes('ico-angle'));
                                          return (
                                            <li>
                                              <a
                                                href={link.href ?? '#'}
                                                class="krds-btn xsmall link basic"
                                              >
                                                <Show when={leadingIcon()}>
                                                  <i class={`svg-icon ${link.icon}`} />
                                                </Show>
                                                {link.label}
                                                <Show when={!leadingIcon()}>
                                                  <i class={`svg-icon ${link.icon ?? 'ico-angle right'}`} />
                                                </Show>
                                              </a>
                                            </li>
                                          );
                                        }}
                                      </For>
                                    </ul>
                                  </div>
                                )}
                              </For>
                            </div>
                          </Show>
                        </div>
                      </section>
                    );
                  }}
                </For>
              </div>
            </div>
            <button
              type="button"
              class="krds-btn small tertiary btn-help-panel fold"
              onClick={() => setOpen(false)}
            >
              <span class="sr-only">{props.title}</span>
              {props.collapseLabel}
              <i class="svg-icon ico-angle right" />
            </button>
          </div>
        </div>
      </div>
    ) : kind() === 'identifier' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-identifier${className() ? ` ${className()}` : ''}`}
      >
        <span class="logo">
          <span class="sr-only">{props.organization}</span>
        </span>
        <span class="ban-txt">{props.description ?? children()}</span>
      </div>
    ) : kind() === 'in-page-navigation' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-in-page-navigation-area${className() ? ` ${className()}` : ''}`}
      >
        <div class="in-page-navigation-header">
          <p class="quick-caption">{props.title}</p>
          <p class="quick-title">{props.pageTitle}</p>
        </div>
        <nav class="in-page-navigation-list">
          <ul>
            <For each={navigation()}>
              {(item) => (
                <li>
                  <a href={item.href ?? '#'} classList={{ active: item.current }}>
                    {item.label}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </nav>
        <div class="in-page-navigation-action">
          <button type="button" class="krds-btn medium">{props.actionLabel}</button>
          <p class="quick-info">{props.actionInfo} <strong>{props.actionCount}</strong></p>
        </div>
      </div>
    ) : kind() === 'language-switcher' || kind() === 'language-switcher-page' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['krds-drop-wrap', 'krds-language', className()].filter(Boolean).join(' ')}
      >
        <button
          type="button"
          class="krds-btn small text drop-btn"
          aria-expanded={open()}
          aria-controls={`${props.id}-language-menu`}
          onClick={() => setOpen(!open())}
        >
          {props.label}
          <i class="svg-icon ico-toggle" />
        </button>
        <div id={`${props.id}-language-menu`} class="drop-menu" hidden={!open()}>
          <div class="drop-in">
            <ul class="drop-list">
              <For each={optionItems()}>
                {(option) => (
                  <li>
                    <button
                      type="button"
                      class="item-link"
                      disabled={option.disabled}
                      onClick={(event) => {
                        setSelected(option.value);
                        invokeHandler(native.onChange, event);
                      }}
                    >
                      {option.label}
                      <Show when={selected() === option.value}>
                        <span class="sr-only">{props.selectedLabel}</span>
                      </Show>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </div>
    ) : kind() === 'modal' || kind() === 'modal-sample' ? (
      <section
        {...(native as Record<string, unknown>)}
        ref={(element) => {
          modalRoot = element;
        }}
        id={props.id}
        role="dialog"
        aria-labelledby={`tit_${props.id}`}
        class={[
          'krds-modal',
          'fade',
          open() && 'in',
          open() && 'shown',
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => {
          invokeHandler(native.onClick, event);
          if (
            !event.defaultPrevented &&
            open() &&
            !(event.target as Element).closest('.modal-content')
          ) {
            event.currentTarget
              .querySelector<HTMLElement>(focusableSelector)
              ?.focus();
          }
        }}
        onKeyDown={(event) => {
          invokeHandler(native.onKeyDown, event);
          if (event.defaultPrevented) return;
          if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            closeModal(event);
            return;
          }
          const content = event.currentTarget.querySelector<HTMLElement>('.modal-content');
          if (content && open()) trapTabFocus(event, content);
        }}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id={`tit_${props.id}`} class="modal-title">
                {props.title}
              </h2>
            </div>
            <div class="modal-conts">
              <div class="conts-area">
                <Show when={props.items?.length} fallback={props.description ?? children()}>
                  <For each={props.items}>
                    {(item, itemIndex) => (
                      <>
                        {labelOf(item)}
                        <Show when={itemIndex() < (props.items?.length ?? 0) - 1}><br /></Show>
                      </>
                    )}
                  </For>
                </Show>
              </div>
            </div>
            <div class="modal-btn btn-wrap">
              <button
                type="button"
                class="krds-btn medium tertiary close-modal"
                onClick={closeModal}
              >
                {props.cancelLabel}
              </button>
              <button
                type="button"
                class="krds-btn medium primary close-modal"
                onClick={closeModal}
              >
                {props.confirmLabel}
              </button>
            </div>
            <button
              type="button"
              class="krds-btn medium icon btn-close close-modal"
              onClick={closeModal}
            >
              <span class="sr-only">{props.closeLabel}</span>
              <i class="svg-icon ico-popup-close" />
            </button>
          </div>
        </div>
        <div class="modal-back" classList={{ in: open() }} />
      </section>
    ) : kind() === 'pagination' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-pagination${className() ? ` ${className()}` : ''}`}
        role="navigation"
      >
        <Show
          when={!props.previousDisabled}
          fallback={<span class="page-navi prev disabled">{props.title}</span>}
        >
          <a
            class="page-navi prev"
            href="#"
            onClick={() => setSelected(String(Math.max(1, paginationPage() - 1)))}
          >
            {props.title}
          </a>
        </Show>
        <div class="page-links">
          <For each={props.items}>
            {(item) =>
              typeof item === 'number' ? (
                <a
                  href="#"
                  class="page-link"
                  classList={{ active: item === paginationPage() }}
                  onClick={() => setSelected(String(item))}
                >
                  <Show when={item === paginationPage()}>
                    <span class="sr-only">{props.message}</span>
                  </Show>
                  {item}
                </a>
              ) : (
                <span class="page-link link-dot" />
              )
            }
          </For>
        </div>
        <a
          class="page-navi next"
          href="#"
          onClick={() => setSelected(String(paginationPage() + 1))}
        >
          {props.label}
        </a>
      </div>
    ) : kind() === 'link' ? (
      <a
        {...(native as Record<string, unknown>)}
        href={props.href}
        target={props.target ?? (props.external ? '_blank' : undefined)}
        title={props.external ? props.title : undefined}
        class={['krds-btn', 'link', props.size, className()].filter(Boolean).join(' ')}
      >
        <span class="underline">{content()}</span>
        <Show when={props.external ?? Boolean(props.target)}>
          {props.icon ?? <i class="svg-icon ico-go" />}
        </Show>
      </a>
    ) : kind() === 'masthead' ? (
      <div
        {...(native as Record<string, unknown>)}
        id={props.id}
        class={className() || undefined}
      >
        <div class="toggle-wrap">
          <div class="toggle-head">
            <div class="inner">
              <span class="nuri-txt">{props.message ?? props.description ?? children()}</span>
            </div>
          </div>
        </div>
      </div>
    ) : kind() === 'resize' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['krds-drop-wrap', 'krds-resize', className()].filter(Boolean).join(' ')}
        data-adjust="scale"
      >
        <button
          type="button"
          class="krds-btn small text drop-btn"
          aria-expanded={open()}
          aria-controls={`${props.id}-resize-menu`}
          onClick={() => setOpen(!open())}
        >
          {props.label}
          <i class="svg-icon ico-toggle" />
        </button>
        <div id={`${props.id}-resize-menu`} class="drop-menu" hidden={!open()}>
          <div class="drop-in">
            <ul class="drop-list">
              <For each={optionItems()}>
                {(option) => (
                  <li>
                    <button
                      type="button"
                      class={`item-link ${option.value}`}
                      classList={{ active: selected() === option.value }}
                      data-adjust-scale={option.value}
                      onClick={(event) => {
                        setSelected(option.value);
                        invokeHandler(native.onChange, event);
                      }}
                    >
                      {option.label}
                      <span class="sr-only">
                        {selected() === option.value ? props.selectedLabel : undefined}
                      </span>
                    </button>
                  </li>
                )}
              </For>
            </ul>
            <div class="drop-bottom">
              <button
                type="button"
                class="krds-btn medium text"
                data-adjust-scale={props.defaultValue}
                onClick={() => setSelected(props.defaultValue ?? '')}
              >
                <i class="svg-icon ico-reset" />
                {props.resetLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : kind() === 'select' ||
      kind() === 'select-size' ||
      kind() === 'select-state' ||
      kind() === 'select-sorting' ? (
      <select
        {...(native as Record<string, unknown>)}
        id={props.id}
        title={props.title ?? props.label}
        aria-label={props.label ?? props.title}
        class={[
          kind() === 'select-sorting' ? 'krds-form-select-sort' : 'krds-form-select',
          kind() === 'select-size' && props.size,
          kind() === 'select-state' && props.state && `is-${props.state}`,
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
        value={selected()}
        onChange={(event) => {
          setSelected(event.currentTarget.value);
          invokeHandler(native.onChange, event);
        }}
      >
        <For each={optionItems()}>
          {(option, optionIndex) => (
            <option
              value={option.value}
              disabled={option.disabled}
              selected={
                kind() === 'select-size' && optionIndex() === 0 ? true : undefined
              }
            >
              {option.label}
            </option>
          )}
        </For>
      </select>
    ) : kind() === 'side-navigation' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={`krds-side-navigation${className() ? ` ${className()}` : ''}`}
      >
        <h2 class="lnb-tit">{props.title}</h2>
        <ul class="lnb-list" role="menubar">
          <For each={navigation()}>
            {(item, topIndex) => {
              const submenuId = `${props.id}-submenu-${topIndex()}`;
              const expanded = () =>
                selected() === item.id || (selected() === '' && hasCurrentItem(item));
              return (
                <li class="lnb-item" classList={{ active: expanded() }} role="none">
                  <button
                    type="button"
                    class="lnb-btn lnb-toggle"
                    classList={{ active: expanded() }}
                    role="menuitem"
                    aria-controls={submenuId}
                    aria-expanded={expanded()}
                    onClick={() => setSelected(expanded() ? '' : (item.id ?? submenuId))}
                  >
                    {item.label}
                  </button>
                  <div class="lnb-submenu">
                    <ul id={submenuId} role="menu">
                      <For each={item.children}>
                        {(child, childIndex) => {
                          const popupId = `${submenuId}-${childIndex()}`;
                          return child.children?.length ? (
                            <li class="lnb-subitem" role="none">
                              <button
                                type="button"
                                class="lnb-btn lnb-toggle-popup"
                                role="menuitem"
                                aria-controls={popupId}
                                aria-expanded="false"
                                aria-haspopup="true"
                              >
                                {child.label}
                              </button>
                              <div class="lnb-submenu-lv2" id={popupId} role="menu">
                                <button type="button" class="lnb-btn-tit">
                                  {'description' in child &&
                                  typeof child.description === 'string'
                                    ? child.description
                                    : undefined}
                                </button>
                                <ul>
                                  <For each={child.children}>
                                    {(leaf) => (
                                      <li role="none">
                                        <a href={leaf.href ?? '#'} class="lnb-btn" role="menuitem">
                                          {leaf.label}
                                        </a>
                                      </li>
                                    )}
                                  </For>
                                </ul>
                              </div>
                            </li>
                          ) : (
                            <li
                              class="lnb-subitem"
                              classList={{ active: child.current }}
                              role="none"
                            >
                              <a
                                href={child.href ?? '#'}
                                class="lnb-btn lnb-link"
                                role="menuitem"
                                aria-current={child.current ? 'page' : undefined}
                              >
                                {child.label}
                              </a>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
      </nav>
    ) : kind() === 'skip-link' ? (
      <div id={props.id ?? 'krds-skip-link'} class={className() || undefined}>
        <a {...(native as Record<string, unknown>)} href={props.href}>
          {content()}
        </a>
      </div>
    ) : kind() === 'spinner' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-spinner${className() ? ` ${className()}` : ''}`}
        role="status"
      >
        <span class="sr-only">{content()}</span>
      </div>
    ) : kind() === 'step-indicator' ? (
      <ol
        {...(native as Record<string, unknown>)}
        class={`krds-step-wrap${className() ? ` ${className()}` : ''}`}
      >
        <For each={props.steps}>
          {(step, stepIndex) => (
            <li
              classList={{
                done: stepIndex() < stepCurrent(),
                active: stepIndex() === stepCurrent(),
              }}
            >
              <span>
                <Show when={stepIndex() === stepCurrent()}>
                  <em class="sr-only">{props.message}</em>
                </Show>
                <i class="step">{stepIndex() + 1}{props.label}</i>
                <span class="step-tit">{step.label}</span>
              </span>
            </li>
          )}
        </For>
      </ol>
    ) : kind() === 'structured-list' ? (
      <ul
        {...(native as Record<string, unknown>)}
        class={['krds-structured-list', 'type-full', className()]
          .filter(Boolean)
          .join(' ')}
      >
        <For each={props.items}>
          {(item) => {
            const structured =
              typeof item === 'string' || typeof item === 'number'
                ? undefined
                : (item as StructuredItem);
            return (
              <li class="structured-item">
                <div class="in">
                  <Show when={structured?.badge}>
                    <div class="card-top">
                      <span
                        class={['krds-badge', structured?.badgeClass].filter(Boolean).join(' ')}
                      >
                        {structured?.badge}
                      </span>
                    </div>
                  </Show>
                  <div class="card-body">
                    <a class="c-text" href={structured?.href ?? '#'}>
                      <p class="c-tit"><span class="span">{labelOf(item)}</span></p>
                      <Show when={structured?.description}>
                        <p class="c-txt">{structured?.description}</p>
                      </Show>
                      <p class="c-date">
                        <strong class="key">{structured?.dateLabel ?? props.dateLabel}</strong>
                        <span class="value">{structured?.dateValue ?? props.dateValue}</span>
                      </p>
                    </a>
                    <div class="c-btn">
                      <a
                        class="krds-btn secondary"
                        href={structured?.href ?? '#'}
                        title={labelOf(item)}
                      >
                        {structured?.actionLabel ?? props.actionLabel}
                      </a>
                    </div>
                  </div>
                  <div class="card-btm">
                    <For each={structured?.tags ?? props.tags}>
                      {(tag) => <span class="tag">{tag}</span>}
                    </For>
                  </div>
                  <div class="card-btn">
                    <button type="button" class="krds-btn medium text" title={labelOf(item)}>
                      <i class="svg-icon ico-share" />
                      {structured?.shareLabel ?? props.shareLabel}
                    </button>
                    <button type="button" class="krds-btn medium text" title={labelOf(item)}>
                      <i class="svg-icon ico-like" />
                      {structured?.favoriteLabel ?? props.favoriteLabel}
                    </button>
                  </div>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
    ) : kind() === 'structured-list-table' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['krds-structured-list-table', className()].filter(Boolean).join(' ')}
      >
        <div class="search-list-top">
          <div class="sch-left">
            <div class="krds-check-area">
              <div class="krds-form-check">
                <input type="checkbox" class="chk" id={`${props.id}-all`} />
                <label for={`${props.id}-all`}>{props.selectAllLabel}</label>
              </div>
            </div>
            <ul class="side-line-ul">
              <For each={props.actions}>
                {(action) => (
                  <li>
                    <button type="button" class="krds-btn medium text">
                      <i class={`svg-icon ico-${action.icon}`} />
                      {action.label}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <ul class="sch-sort">
            <li>
              <strong class="sort-label"><label for={`${props.id}-count`}>{props.countLabel}</label></strong>
              <select
                class="krds-form-select-sort"
                id={`${props.id}-count`}
                value={props.countOptions?.[0]}
              >
                <For each={props.countOptions}>{(option) => <option>{option}</option>}</For>
              </select>
            </li>
            <li>
              <strong class="sort-label"><label for={`${props.id}-sort`}>{props.sortLabel}</label></strong>
              <div class="w-sort-btn">
                <For each={props.sortOptions}>
                  {(option) => (
                    <button type="button" classList={{ active: props.sortValue === option }}>
                      {option}
                    </button>
                  )}
                </For>
              </div>
              <div class="m-sort-btn">
                <select
                  class="krds-form-select-sort"
                  id={`${props.id}-sort`}
                  value={props.sortValue}
                >
                  <For each={props.sortOptions}>{(option) => <option>{option}</option>}</For>
                </select>
              </div>
            </li>
          </ul>
        </div>
        <div class="krds-table-wrap">
          <table class="tbl col data">
            <caption>{props.caption}</caption>
            <colgroup>
              <For each={props.columns}>
                {(column) => (
                  <col
                    style={
                      'width' in column && typeof column.width === 'string' && column.width
                        ? { width: column.width }
                        : undefined
                    }
                  />
                )}
              </For>
              <col />
            </colgroup>
            <thead>
              <tr>
                <For each={props.columns}>
                  {(column) => (
                    <th scope="col">
                      <Show
                        when={
                          'visuallyHidden' in column && column.visuallyHidden === true
                        }
                        fallback={column.label}
                      >
                        <span class="sr-only">{column.label}</span>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={props.rows}>
                {(row, rowIndex) => (
                  <tr>
                    <For each={props.columns}>
                      {(column, columnIndex) =>
                        columnIndex() === 0 ? (
                          <th scope="row">
                            <div class="krds-form-check">
                              <input
                                type="checkbox"
                                class="chk"
                                id={`${props.id}-row-${String(row.id)}`}
                                checked={Boolean(row.selected)}
                              />
                              <label for={`${props.id}-row-${String(row.id)}`}>
                                <span class="sr-only">
                                  {`${props.caption ?? '행'} ${rowIndex() + 1} 선택`}
                                </span>
                              </label>
                            </div>
                          </th>
                        ) : column.key === 'download' ? (
                          <td>
                            <button type="button" class="krds-btn medium text">
                              <i class="svg-icon ico-down" />
                              {String(row[column.key] ?? '')}
                            </button>
                          </td>
                        ) : (
                          <td>{String(row[column.key] ?? '')}</td>
                        )
                      }
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <div class="krds-pagination">
          <Show
            when={!props.pagination?.previousDisabled}
            fallback={
              <span
                {...({ href: '#' } as Record<string, string>)}
                class="page-navi prev disabled"
              >
                {props.pagination?.previousLabel}
              </span>
            }
          >
            <a class="page-navi prev" href="#">{props.pagination?.previousLabel}</a>
          </Show>
          <div class="page-links">
            <For each={props.pagination?.items}>
              {(item) =>
                item === 'ellipsis' ? (
                  <span class="page-link link-dot" />
                ) : (
                  <a
                    class="page-link"
                    classList={{ active: props.pagination?.current === item }}
                    href="#"
                  >
                    <Show when={props.pagination?.current === item}>
                      <span class="sr-only">{props.pagination?.currentLabel} </span>
                    </Show>
                    {item}
                  </a>
                )
              }
            </For>
          </div>
          <a class="page-navi next" href="#">{props.pagination?.nextLabel}</a>
        </div>
      </div>
    ) : kind() === 'table' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['krds-table-wrap', className()].filter(Boolean).join(' ')}
      >
        <table class="tbl col data">
          <caption>{props.caption}</caption>
          <colgroup>
            <For each={props.columns}>
              {(column) => (
                <col
                  style={
                    'width' in column && typeof column.width === 'string' && column.width
                      ? { width: column.width }
                      : undefined
                  }
                />
              )}
            </For>
          </colgroup>
          <thead>
            <tr>
              <For each={props.columns}>
                {(column) => <th scope="col">{column.label}</th>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={props.rows}>
              {(row) => (
                <tr>
                  <For each={props.columns}>
                    {(column, columnIndex) =>
                      columnIndex() === 0 ? (
                        <th scope="row">{String(row[column.key] ?? '')}</th>
                      ) : (
                        <td>{String(row[column.key] ?? '')}</td>
                      )
                    }
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    ) : kind() === 'tab' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={['krds-tab-area', 'layer', className()].filter(Boolean).join(' ')}
      >
        <div class="tab line full">
          <ul role="tablist">
            <For each={props.tabs}>
              {(tab) => {
                const active = () => selected() === tab.id;
                const tabId = `tab-${tab.id}`;
                const panelId = `panel-${tab.id}`;
                  <li
                    id={tabId}
                    role="tab"
                    aria-selected={active()}
                    aria-controls={panelId}
                    classList={{ active: active() }}
                  >
                    <button
                      type="button"
                      class="btn-tab"
                      disabled={tab.disabled}
                      onClick={(event) => {
                        setSelected(tab.id);
                        invokeHandler(native.onChange, event);
                      }}
                    >
                      {tab.label}
                      <Show when={active()}>
                        <i class="sr-only created">{props.message}</i>
                      </Show>
                    </button>
                  </li>
      </div>
    ) : kind() === 'tag' || kind() === 'tag-link' ? (
      kind() === 'tag-link' ? (
        <a
          {...(native as Record<string, unknown>)}
          href={props.href}
          class={`krds-btn-tag link${className() ? ` ${className()}` : ''}`}
        >
          {content()}
        </a>
      ) : (
        <span
          {...(native as Record<string, unknown>)}
          class={`krds-btn-tag${className() ? ` ${className()}` : ''}`}
        >
          {content()}
          <Show when={props.removable}>
            <button type="button" class="btn-delete">
              <span class="sr-only">{props.message}</span>
            </button>
          </Show>
        </span>
      )
    ) : kind() === 'textarea' ? (
      <div class="form-group">
        <div class="form-tit">
          <label for={props.id}>{props.label}</label>
        </div>
        <div class="form-conts">
          <div class="textarea-wrap">
            <textarea
              {...(native as Record<string, unknown>)}
              id={props.id}
              class={['krds-input', className()].filter(Boolean).join(' ')}
              maxlength={props.maxLength}
              value={value()}
              onInput={updateInput}
            />
          </div>
        </div>
        <Show when={props.hint}>
          <p class="form-hint">{props.hint}</p>
        </Show>
      </div>
    ) : kind() === 'text-input-icon' ? (
      <input
        {...(native as Record<string, unknown>)}
        id={props.id}
        ref={(element) => {
          createEffect(() => {
            const modelValue = props.modelValue;
            if (
              props.value !== undefined ||
              typeof modelValue === 'string' ||
              typeof modelValue === 'number'
            )
              element.value = value();
          });
        }}
        class={['krds-input', className()].filter(Boolean).join(' ')}
        value={value()}
        onInput={updateInput}
      />
    ) : kind() === 'text-list' || kind() === 'text-list-ordered' ? (
      infoList(() => props.items ?? [], () => kind() === 'text-list-ordered')
    ) : kind() === 'tooltip' || kind() === 'tooltip-box' || kind() === 'tooltip-vertical' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={[
          'krds-btn',
          'krds-tooltip',
          'small',
          'text',
          kind() === 'tooltip-box' && 'tooltip-box',
          kind() === 'tooltip-vertical' && 'tooltip-vertical',
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
        data-tooltip={props.message}
      >
        {content()}
        {props.icon ?? <i class="svg-icon ico-angle right" />}
      </button>
    ) : kind() === 'tts' || kind() === 'tts-icon' || kind() === 'tts-size' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={[
          'krds-tts',
          props.size ?? (kind() === 'tts-size' ? undefined : 'medium'),
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => {
          setChecked(!checked());
          invokeHandler(native.onClick, event);
        }}
      >
        <span class="krds-tts-icon" aria-hidden="true">
          <i class={checked() ? 'svg-icon ico-pause' : 'svg-icon ico-volume'} />
        </span>
        <Show when={kind() !== 'tts-icon'}>
          <span class="krds-tts-text">{content()}</span>
        </Show>
      </button>
    ) : kind() === 'toggle-switch' || kind() === 'toggle-switch-size' ? (
      <div
        class={[
          'krds-form-toggle-switch',
          props.size,
          className(),
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          type="checkbox"
          name={props.name}
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label for={props.id}>
          <span class="switch-toggle">
            <i />
          </span>
          {content()}
        </label>
      </div>
    ) : kind() === 'radio-button' ? (
      <div class={`krds-form-check${className() ? ` ${className()}` : ''}`}>
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          type="radio"
          name={props.name}
          value={
            typeof props.value === 'string' || typeof props.value === 'number'
              ? String(props.value)
              : undefined
          }
          checked={checked()}
          disabled={props.disabled}
          onChange={updateChecked}
        />
        <label for={props.id}>{content()}</label>
      </div>
    ) : (
      <div {...(native as Record<string, unknown>)} class={props.class}>
        {children()}
      </div>
    );
  };
}

export const Badge = createAdditional('badge');
export const BadgeNumber = createAdditional('badge-number');
export const BadgeSize = createAdditional('badge-size');
export const Breadcrumb = createAdditional('breadcrumb');
export const ButtonHierarchy = createAdditional('button-hierarchy');
export const ButtonIcon = createAdditional('button-icon');
export const ButtonSize = createAdditional('button-size');
export const ButtonText = createAdditional('button-text');
export const ButtonWithIcon = createAdditional('button-with-icon');
export const Calendar = createAdditional('calendar');
export const CalendarRange = createAdditional('calendar-range');
export const Carousel = createAdditional('carousel');
export const CarouselBanner = createAdditional('carousel-banner');
export const CheckboxChip = createAdditional('checkbox-chip');
export const CheckboxSize = createAdditional('checkbox-size');
export const CoachMark = createAdditional('coach-mark');
export const ContextualHelp = createAdditional('contextual-help');
export const CriticalAlerts = createAdditional('critical-alerts');
export const DateInput = createAdditional('date-input');
export const Disclosure = createAdditional('disclosure');
export const Favicon = createAdditional('favicon');
export const FileUpload = createAdditional('file-upload');
export const Footer = createAdditional('footer');
export const Header = createAdditional('header');
export const HelpPanel = createAdditional('help-panel');
export const Identifier = createAdditional('identifier');
export const InPageNavigation = createAdditional('in-page-navigation');
export const LanguageSwitcher = createAdditional('language-switcher');
export const LanguageSwitcherPage = createAdditional('language-switcher-page');
export const Link = createAdditional('link');
export const MainMenuMobile = createAdditional('main-menu-mobile');
export const MainMenuPc = createAdditional('main-menu-pc');
export const Masthead = createAdditional('masthead');
export const Modal = createAdditional('modal');
export const ModalSample = createAdditional('modal-sample');
export const Pagination = createAdditional('pagination');
export const RadioButton = createAdditional('radio-button');
export const RadioChip = createAdditional('radio-chip');
export const RadioSize = createAdditional('radio-size');
export const Resize = createAdditional('resize');
export const Select = createAdditional('select');
export const SelectSize = createAdditional('select-size');
export const SelectSorting = createAdditional('select-sorting');
export const SelectState = createAdditional('select-state');
export const SideNavigation = createAdditional('side-navigation');
export const SkipLink = createAdditional('skip-link');
export const Spinner = createAdditional('spinner');
export const StepIndicator = createAdditional('step-indicator');
export const StructuredList = createAdditional('structured-list');
export const StructuredListTable = createAdditional('structured-list-table');
export const Tab = createAdditional('tab');
export const Table = createAdditional('table');
export const Tag = createAdditional('tag');
export const TagLink = createAdditional('tag-link');
export const Textarea = createAdditional('textarea');
export const TextInputIcon = createAdditional('text-input-icon');
export const TextList = createAdditional('text-list');
export const TextListOrdered = createAdditional('text-list-ordered');
export const ToggleSwitch = createAdditional('toggle-switch');
export const ToggleSwitchSize = createAdditional('toggle-switch-size');
export const Tooltip = createAdditional('tooltip');
export const TooltipBox = createAdditional('tooltip-box');
export const TooltipVertical = createAdditional('tooltip-vertical');
export const Tts = createAdditional('tts');
export const TtsIcon = createAdditional('tts-icon');
export const TtsSize = createAdditional('tts-size');
export const TutorialPanel = createAdditional('tutorial-panel');
