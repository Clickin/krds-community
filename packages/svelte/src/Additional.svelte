<script lang="ts">
  import {
    selectRecipe,
    tabRecipe,
    type InputState,
    type KrdsAdditionalProps,
    type KrdsNavItem,
    type KrdsTone,
    type SelectRecipeSize,
  } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type StructuredListTableRow = {
    selectionLabel?: string;
    [key: string]: string | number | boolean | null | undefined;
  };

  type Props = Omit<KrdsAdditionalProps, 'className' | 'open' | 'rows'> &
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'id' | 'title'> & {
      children?: Snippet;
      class?: string;
      className?: string;
      open?: boolean;
      variant?: string;
      state?: string;
      error?: string;
      placeholder?: string;
      type?: string;
      target?: string;
      rel?: string;
      accept?: string;
      multiple?: boolean;
      autocomplete?: string;
      form?: string;
      maxLength?: number;
      defaultValue?: string;
      rows?: StructuredListTableRow[];
      languages?: NonNullable<KrdsAdditionalProps['options']>;
      nav?: KrdsNavItem[];
      text?: string;
      step?: string;
      previousLabel?: string;
      nextLabel?: string;
      navigationLabel?: string;
      moreLabel?: string;
      imageLabel?: string;
      actionLabel?: string;
      playLabel?: string;
      stopLabel?: string;
      pageTitle?: string;
      actionInfo?: string;
      actionCount?: string;
      dateLabel?: string;
      dateValue?: string;
      tags?: string[];
      shareLabel?: string;
      favoriteLabel?: string;
      cancelLabel?: string;
      confirmLabel?: string;
      closeLabel?: string;
      stepTitle?: string;
      contentTitle?: string;
      currentStep?: string;
      totalSteps?: string;
      caption?: string;
      linkLabel?: string;
      panelTitle?: string;
      previousDisabled?: boolean;
      removable?: boolean;
      sizes?: string;
      activeTab?: 'help' | 'tutorial';
      helpTitle?: string;
      helpDescription?: string;
      downloadLinks?: KrdsNavItem[];
      relatedGroups?: Record<string, unknown>[];
      tutorialTitle?: string;
      tasks?: Record<string, unknown>[];
      backTitle?: string;
      tutorialBackTitle?: string;
      externalTitle?: string;
      displayYear?: number;
      displayMonth?: number;
      selectedYear?: number;
      selectedMonth?: number;
      collapseLabel?: string;
      utilityItems?: KrdsNavItem[];
      serviceItems?: KrdsNavItem[];
      bottomItems?: KrdsNavItem[];
      loginLabel?: string;
      searchPlaceholder?: string;
      searchTitle?: string;
      searchLabel?: string;
      selectedLabel?: string;
      resetLabel?: string;
      selectAllLabel?: string;
      actions?: Record<string, unknown>[];
      countLabel?: string;
      countOptions?: string[];
      sortLabel?: string;
      sortOptions?: string[];
      sortValue?: string;
      pagination?: Record<string, unknown>;
      relatedSites?: KrdsNavItem[];
      logoLabel?: string;
      address?: string;
      contacts?: Record<string, unknown>[];
      socialLinks?: KrdsNavItem[];
      policyLinks?: KrdsNavItem[];
      copyright?: string;
      prompt?: string;
      inputId?: string;
      selectLabel?: string;
      currentCount?: number;
      maxCount?: number;
      files?: Record<string, unknown>[];
      deleteAllLabel?: string;
      external?: boolean;
      years?: number[];
      disabledYears?: number[];
      leadingDays?: number;
      previousMonthDayCount?: number;
      dayCount?: number;
      calendarLabel?: string;
      previousMonthLabel?: string;
      nextMonthLabel?: string;
      yearSelectLabel?: string;
      monthSelectLabel?: string;
      weekdays?: string[];
      todayLabel?: string;
      eventLabel?: string;
      year?: number;
      month?: number;
      disabledMonths?: number[];
      rangeStartDay?: number;
      rangeEndDay?: number;
      todayDay?: number;
      eventDays?: number[];
      disabledDays?: number[];
      logoHref?: string;
      loginHref?: string;
      joinLabel?: string;
      allMenuLabel?: string;
      myMenu?: Record<string, unknown>;
      desktopItems?: KrdsNavItem[];
      mobileMenu?: Record<string, unknown>;
      menuLabel?: string;
      badgeLabel?: string;
      countSuffix?: string;
      currentLabel?: string;
      currentStepLabel?: string;
      deleteLabel?: string;
      downloadLabel?: string;
      extendLabel?: string;
      logoutLabel?: string;
      ordered?: boolean;
      previewLabel?: string;
      sample?: boolean;
      statusLabel?: string;
      timeLabel?: string;
      titleLinkLabel?: string;
      totalStepsLabel?: string;
    };
  type AdditionalValue = NonNullable<Props['value']>;
  type AdditionalModelValue = NonNullable<Props['modelValue']>;

  const generatedId = $props.id();
  let {
    kind = 'surface',
    id =
      kind === 'footer'
        ? 'krds-footer'
        : kind === 'header'
          ? 'krds-header'
          : kind === 'masthead'
            ? 'krds-masthead'
            : kind === 'skip-link'
              ? 'krds-skip-link'
              : generatedId,
    label = '레이블',
    title = '제목',
    description = '',
    hint = '',
    tone = 'primary',
    variant = 'primary',
    appearance = 'outline',
    size = '',
    number = false,
    href = '#',
    message = '도움말',
    position = 'top',
    open = $bindable<boolean | undefined>(),
    disabled = false,
    value = $bindable<AdditionalValue | undefined>(),
    modelValue = $bindable<AdditionalModelValue | undefined>(),
    name = '',
    required = false,
    readonly = false,
    organization = '',
    selected = $bindable<string | undefined>(),
    checked = $bindable<boolean | undefined>(),
    current = $bindable<number | undefined>(),
    playing = false,
    options = [],
    items = [],
    links = [],
    slides = [],
    tabs = [],
    panels = {},
    steps = [],
    columns = [],
    rows = [],
    state: controlState = 'default',
    error = '',
    placeholder = '',
    type,
    target,
    rel,
    accept,
    multiple = false,
    autocomplete,
    form,
    maxLength,
    defaultValue = '',
    languages = [],
    nav = [],
    text = '',
    step = '',
    previousLabel = '이전',
    nextLabel = '다음',
    navigationLabel = '페이지 이동',
    moreLabel = '더 보기',
    imageLabel = '',
    actionLabel = '',
    playLabel = '재생',
    stopLabel = '멈춤',
    pageTitle = '',
    actionInfo = '',
    actionCount = '',
    dateLabel = '',
    dateValue = '',
    tags = [],
    shareLabel = '',
    favoriteLabel = '',
    cancelLabel = '',
    confirmLabel = '',
    closeLabel = '',
    stepTitle = '',
    contentTitle = '',
    currentStep = '',
    totalSteps = '',
    caption = '',
    linkLabel = '',
    panelTitle = '',
    previousDisabled = false,
    removable = false,
    sizes,
    activeTab = $bindable<'help' | 'tutorial'>(kind === 'tutorial-panel' ? 'tutorial' : 'help'),
    helpTitle = '',
    helpDescription = '',
    downloadLinks = [],
    relatedGroups = [],
    tutorialTitle = '',
    tasks = [],
    collapseLabel = '',
    utilityItems = [],
    serviceItems = [],
    bottomItems = [],
    loginLabel = '',
    searchPlaceholder = '',
    searchTitle = '',
    searchLabel = '',
    selectedLabel = '선택됨',
    resetLabel = '',
    selectAllLabel = '',
    actions = [],
    countLabel = '',
    countOptions = [],
    sortLabel = '',
    sortOptions = [],
    sortValue = '',
    pagination,
    relatedSites = [],
    logoLabel = '',
    address = '',
    contacts = [],
    socialLinks = [],
    policyLinks = [],
    copyright = '',
    prompt = '',
    inputId = '',
    selectLabel = '',
    currentCount = 0,
    maxCount = 0,
    files = [],
    deleteAllLabel = '',
    external = false,
    years = [],
    disabledYears = [],
    leadingDays = 0,
    previousMonthDayCount = 0,
    dayCount = 31,
    calendarLabel = '',
    previousMonthLabel = '',
    nextMonthLabel = '',
    yearSelectLabel = '',
    monthSelectLabel = '',
    weekdays = [],
    todayLabel = '',
    eventLabel = '',
    displayYear,
    displayMonth,
    selectedYear,
    selectedMonth,
    backTitle = '',
    tutorialBackTitle = '',
    externalTitle = '새 창 열림',
    year,
    month,
    disabledMonths = [],
    rangeStartDay = 0,
    rangeEndDay = 0,
    todayDay = 0,
    eventDays = [],
    disabledDays = [],
    logoHref = '#',
    loginHref = '#',
    joinLabel = '',
    allMenuLabel = '',
    myMenu,
    desktopItems = [],
    mobileMenu,
    menuLabel = '',
    badgeLabel = '',
    countSuffix = '',
    currentLabel = '',
    currentStepLabel = '',
    deleteLabel = '',
    downloadLabel = '',
    extendLabel = '',
    logoutLabel = '',
    ordered = false,
    previewLabel = '',
    sample = false,
    statusLabel = '',
    timeLabel = '',
    titleLinkLabel = '',
    totalStepsLabel = '',
    class: classProp = '',
    className = '',
    children,
    oninput,
    onchange,
    onclick,
    ontoggle,
    onclose,
    oncancel,
    ...rest
  }: Props = $props();

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
  const labelOf = (item: unknown) => {
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (!item || typeof item !== 'object') return '';
    if ('label' in item && typeof item.label === 'string') return item.label;
    if ('title' in item && typeof item.title === 'string') return item.title;
    return '';
  };
  const fieldOf = (item: unknown, field: string) => {
    if (!item || typeof item !== 'object' || !(field in item)) return '';
    const entry = (item as Record<string, unknown>)[field];
    return typeof entry === 'string' || typeof entry === 'number' ? String(entry) : '';
  };
  const flagOf = (item: unknown, field: string) =>
    Boolean(item && typeof item === 'object' && field in item && (item as Record<string, unknown>)[field]);
  const hrefOf = (item: unknown) => fieldOf(item, 'href') || '#';
  const childrenOf = (item: unknown): KrdsNavItem[] => {
    if (!item || typeof item !== 'object' || !('children' in item) || !Array.isArray(item.children)) return [];
    return item.children as KrdsNavItem[];
  };
  const listOf = (item: unknown, field: string): unknown[] => {
    if (!item || typeof item !== 'object' || !(field in item)) return [];
    const entry = (item as Record<string, unknown>)[field];
    return Array.isArray(entry) ? entry : [];
  };
  const recordOf = (item: unknown, field: string): Record<string, unknown> | undefined => {
    if (!item || typeof item !== 'object' || !(field in item)) return undefined;
    const entry = (item as Record<string, unknown>)[field];
    return entry && typeof entry === 'object' && !Array.isArray(entry)
      ? (entry as Record<string, unknown>)
      : undefined;
  };
  const invoke = (handler: unknown, event: Event) => {
    if (typeof handler === 'function') (handler as (event: Event) => void)(event);
  };
  const reflectValueAttribute = (node: HTMLInputElement, reflectedValue: string) => {
    const reflect = (nextValue: string) => {
      if (nextValue) node.setAttribute('value', nextValue);
      else node.removeAttribute('value');
    };
    reflect(reflectedValue);
    return { update: reflect };
  };

  const rootClass = $derived(`${classProp} ${className}`.trim());
  const navigationItems = $derived(items.length ? items : links.length ? links : nav);
  const languageItems = $derived(languages.length ? languages : options);
  const selection = $derived(
    modelValue !== undefined
      ? String(modelValue)
      : selected !== undefined
        ? selected
        : defaultValue || String(options[0]?.value ?? tabs[0]?.id ?? ''),
  );
  const currentLanguage = $derived(languageItems.find((language) => language.value === selection));
  const selectState: InputState = $derived(
    controlState === 'error' ||
      controlState === 'success' ||
      controlState === 'information'
      ? controlState
      : 'default',
  );
  const selectClasses = $derived(
    kind === 'select-sorting'
      ? selectRecipe({ variant: 'sorting', state: selectState === 'error' ? 'error' : 'default' })
      : selectRecipe({
          variant:
            kind === 'select-size'
              ? 'size'
              : kind === 'select-state' || selectState !== 'default'
                ? 'state'
                : 'default',
          size: kind === 'select-size' ? (size as SelectRecipeSize) : undefined,
          state: selectState,
        }),
  );
  const tabClasses = $derived(tabRecipe());
  const inputValue = $derived(
    value !== undefined
      ? String(value)
      : typeof modelValue === 'string' || typeof modelValue === 'number' || typeof modelValue === 'boolean'
        ? String(modelValue)
        : '',
  );
  const checkedValue = $derived(
    checked !== undefined
      ? Boolean(checked)
      : typeof modelValue === 'boolean'
        ? modelValue
        : Boolean(modelValue),
  );
  const isOpen = $derived(
    open ?? ['coach-mark', 'help-panel', 'tutorial-panel', 'modal-sample'].includes(kind),
  );
  const currentIndex = $derived(current ?? 0);
  const radioChecked = $derived(modelValue !== undefined ? modelValue === value : checkedValue);
  const chipChecked = $derived(
    Array.isArray(modelValue)
      ? modelValue.includes(String(value))
      : modelValue !== undefined
        ? modelValue === value
        : checkedValue,
  );
  const dateParts = $derived(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(inputValue));
  const calendarYear = $derived(displayYear ?? year ?? Number(dateParts?.[1] ?? '2000'));
  const calendarMonth = $derived(displayMonth ?? month ?? Number(dateParts?.[2] ?? '1'));
  const selectedCalendarYear = $derived(selectedYear ?? year ?? Number(dateParts?.[1] ?? calendarYear));
  const selectedCalendarMonth = $derived(selectedMonth ?? month ?? Number(dateParts?.[2] ?? calendarMonth));
  const selectedDay = $derived(Number(dateParts?.[3] ?? rangeStartDay));
  const calendarYears = $derived(Array.from({ length: 24 }, (_, index) => calendarYear - 1 + index));
  const calendarMonths = Array.from({ length: 12 }, (_, index) => index + 1);
  const calendarDays = Array.from({ length: 42 }, (_, index) => index + 1);
  const zoomOptions = [
    { value: 'sm', label: '작게' },
    { value: 'md', label: '보통' },
    { value: 'lg', label: '조금 크게' },
    { value: 'xlg', label: '크게' },
    { value: 'xxlg', label: '가장크게' },
  ];

  const setValue = (event: Event) => {
    const next = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
    if (value !== undefined) value = next;
    else modelValue = next;
    invoke(oninput, event);
  };
  const setSelection = (next: string, event?: Event) => {
    selected = next;
    modelValue = next;
    if (event) invoke(onchange, event);
  };
  const setChecked = (next: boolean, event?: Event, eventName = 'change') => {
    checked = next;
    if (typeof modelValue === 'boolean' || modelValue === undefined) modelValue = next;
    if (event) invoke(eventName === 'click' ? onclick : onchange, event);
  };
  const setRadio = (event: Event) => {
    checked = (event.currentTarget as HTMLInputElement).checked;
    modelValue = value;
    invoke(onchange, event);
  };
  const setChip = (event: Event) => {
    if (kind === 'radio-chip') {
      setRadio(event);
      return;
    }
    const next = (event.currentTarget as HTMLInputElement).checked;
    if (Array.isArray(modelValue)) {
      const item = String(value);
      modelValue = next
        ? modelValue.includes(item)
          ? modelValue
          : [...modelValue, item]
        : modelValue.filter((entry) => entry !== item);
      checked = next;
      invoke(onchange, event);
    } else {
      setChecked(next, event);
    }
  };
  const toggleOpen = (event?: Event) => {
    open = !isOpen;
    if (event) invoke(onclick, event);
  };
  const moveSlide = (delta: number, event?: Event) => {
    const count = slides.length;
    if (count) current = (currentIndex + delta + count) % count;
    if (event) invoke(onclick, event);
  };
  const selectCalendarDay = (day: number, event: Event) => {
    const next = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (value !== undefined) value = next;
    else modelValue = next;
    invoke(onchange, event);
  };
  const selectTab = (tabId: string, event?: Event) => {
    setSelection(tabId);
    if (event) invoke(onclick, event);
  };
  const handleTabKeydown = (event: KeyboardEvent, index: number) => {
    if (!tabs.length || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1;
    let nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + direction + tabs.length) % tabs.length;
    while (tabs[nextIndex]?.disabled && nextIndex !== index) {
      nextIndex = (nextIndex + direction + tabs.length) % tabs.length;
    }
    if (tabs[nextIndex]?.disabled) return;
    selectTab(tabs[nextIndex].id);
    (event.currentTarget as HTMLButtonElement).parentElement?.parentElement
      ?.querySelectorAll<HTMLButtonElement>('.btn-tab')
      [nextIndex]?.focus();
  };
  const selectPage = (page: number, event: Event) => {
    current = page;
    modelValue = page;
    invoke(onclick, event);
  };

  let uploadValue = $state('');
  let uploadInput: HTMLInputElement | undefined = $state();
  let modalRoot: HTMLElement | undefined = $state();
  let restoreFocus: HTMLElement | null = null;
  let wasOpen = false;
  let hasObservedModalState = false;
  $effect(() => {
    if (!modalRoot) return;
    if (!hasObservedModalState) {
      hasObservedModalState = true;
      wasOpen = isOpen;
      return;
    }
    if (isOpen && !wasOpen) {
      restoreFocus =
        typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      queueMicrotask(() => {
        modalRoot
          ?.querySelector<HTMLElement>(
            'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
          )
          ?.focus();
      });
    } else if (!isOpen && wasOpen) {
      restoreFocus?.focus();
      restoreFocus = null;
    }
    wasOpen = isOpen;
  });
  const closeModal = (event: Event) => {
    if (event.type === 'cancel') {
      invoke(oncancel, event);
      if (event.defaultPrevented) return;
    }
    open = false;
    if (event.currentTarget instanceof Element) {
      event.currentTarget.closest('.krds-modal')?.classList.remove('in', 'shown');
    }
    if (event.type !== 'cancel') invoke(onclose, event);
  };
  const handleModalKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && isOpen) {
      const focusable = Array.from(
        modalRoot?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = modalRoot?.ownerDocument.activeElement;
      if (event.shiftKey && (activeElement === first || !modalRoot?.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key !== 'Escape') return;
    const cancelEvent = new Event('cancel', { cancelable: true });
    invoke(oncancel, cancelEvent);
    if (cancelEvent.defaultPrevented) return;
    event.preventDefault();
    open = false;
    if (event.currentTarget instanceof Element) {
      event.currentTarget.closest('.krds-modal')?.classList.remove('in', 'shown');
    }
    invoke(onclose, event);
  };
  const setUpload = (event: Event) => {
    uploadValue = Array.from((event.currentTarget as HTMLInputElement).files ?? [])
      .map((file) => file.name)
      .join(', ');
    invoke(onchange, event);
  };
  const inertWhen = (node: HTMLElement, value: boolean) => {
    const sync = (next: boolean) => node.toggleAttribute('inert', next);
    sync(value);
    return { update: sync };
  };
</script>

{#if kind === 'badge' || kind === 'badge-number' || kind === 'badge-size'}
  <span
    {...rest}
    class={`krds-badge ${
      appearance === 'outline'
        ? `outline-${toneClass[tone]}`
        : `bg-${appearance === 'light' ? 'light-' : ''}${toneClass[tone]}`
    } ${size} ${number || kind === 'badge-number' ? 'number' : ''} ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >{label}</span>
{:else if kind === 'breadcrumb'}
  <nav {...rest} id={id} class={`krds-breadcrumb-wrap ${rootClass}`} aria-label="현재 경로">
    <ol class="breadcrumb">
      {#each navigationItems as item, index}
        <li class:home={index === 0}>
          <a class="txt" href={hrefOf(item)} onclick={(event) => invoke(onclick, event)}
            >{labelOf(item)}</a
          >
        </li>
      {/each}
    </ol>
  </nav>
{:else if kind === 'button-icon'}
  <button
    {...rest}
    type="button"
    disabled={disabled}
    class={`icon krds-btn ${size} ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >
    <span class="sr-only">{label}</span>
    <i class="ico-sch svg-icon"></i>
  </button>
{:else if kind === 'button-text' || kind === 'button-with-icon'}
  <button
    {...rest}
    type="button"
    disabled={disabled}
    class={`krds-btn ${size} ${kind === 'button-text' ? 'text' : ''} ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >
    {#if children}{@render children()}{:else}{label}{/if}
    {#if kind === 'button-with-icon'}<i class="ico-sch svg-icon"></i>{/if}
  </button>
{:else if kind === 'button-hierarchy' || kind === 'button-size'}
  <button
    {...rest}
    type="button"
    disabled={disabled}
    class={`krds-btn ${kind === 'button-hierarchy' ? variant : ''} ${size} ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >
    {#if children}{@render children()}{:else}{label}{/if}
  </button>
{:else if kind === 'calendar' || kind === 'calendar-range' || kind === 'date-input'}
  <div {...rest} class={kind === 'date-input' ? `form-group ${rootClass}` : 'calendar-host'}>
    {#if kind === 'date-input'}
      <div class="form-tit"><label for={id}>{label}</label></div>
    {/if}
    <div class={kind === 'date-input' ? 'form-conts' : undefined}>
      <div class={kind === 'date-input' ? 'form-conts calendar-conts' : 'calendar-surface-host'}>
        {#if kind === 'date-input'}
          <div class="calendar-input">
            <input
              id={id}
              name={name || undefined}
              class="krds-input datepicker cal"
              type="number"
              placeholder={placeholder || 'YYYY.MM.DD'}
              value={inputValue}
              use:reflectValueAttribute={inputValue}
              {disabled}
              {required}
              {readonly}
              {form}
              oninput={setValue}
            />
            <button class="krds-btn medium icon form-btn-datepicker" type="button">
              <span class="sr-only">달력 열기</span>
              <i class="svg-icon ico-calendar"></i>
            </button>
          </div>
        {/if}
        <div class="krds-calendar-area">
          <div
            class={`bottom calendar-wrap ${kind === 'calendar' ? 'single' : ''}`}
            aria-label={calendarLabel}
            tabindex="0"
          >
            <div class="calendar-head">
              <button class="btn-cal-move prev" type="button">
                <span class="sr-only">{previousMonthLabel}</span>
              </button>
              <div class="calendar-switch-wrap">
                <div class="calendar-drop-down">
                  <button
                    class="btn-cal-switch year"
                    type="button"
                    role="combobox"
                    aria-label={yearSelectLabel}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-year`}
                    onclick={toggleOpen}
                  >{calendarYear}년</button>
                  <div class="calendar-select calendar-year-wrap">
                    <ul class="sel year" id={`${id}-year`} role="listbox">
                      {#each (years.length ? years : calendarYears) as optionYear}
                        <li role="none">
                          <button
                            type="button"
                            role="option"
                            class:active={optionYear === selectedCalendarYear}
                            aria-selected={optionYear === selectedCalendarYear}
                            disabled={disabledYears.includes(optionYear)}
                          >{optionYear}년</button>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
                <div class="calendar-drop-down">
                  <button
                    class="btn-cal-switch month"
                    type="button"
                    role="combobox"
                    aria-label={monthSelectLabel}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-month`}
                    onclick={toggleOpen}
                  >{String(calendarMonth).padStart(2, '0')}월</button>
                  <div class="calendar-mon-wrap calendar-select">
                    <ul class="month sel" id={`${id}-month`} role="listbox">
                      {#each calendarMonths as calendarMonthOption}
                        <li role="none">
                          <button
                            type="button"
                            role="option"
                            class:active={calendarMonthOption === selectedCalendarMonth}
                            aria-selected={calendarMonthOption === selectedCalendarMonth}
                            disabled={disabledMonths.includes(calendarMonthOption)}
                          >{String(calendarMonthOption).padStart(2, '0')}월</button>
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
                  <caption>{calendarYear}년 {String(calendarMonth).padStart(2, '0')}월</caption>
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
                        {#each calendarDays.slice(week * 7, week * 7 + 7) as _, dayIndex}
                          {@const cellIndex = week * 7 + dayIndex}
                          {@const isLeading = cellIndex < leadingDays}
                          {@const currentDay = cellIndex - leadingDays + 1}
                          {@const isTrailing = currentDay > dayCount}
                          {@const day = isLeading
                            ? previousMonthDayCount - leadingDays + cellIndex + 1
                            : isTrailing
                              ? currentDay - dayCount
                              : currentDay}
                          {@const cellMonth = isLeading
                            ? calendarMonth === 1
                              ? 12
                              : calendarMonth - 1
                            : isTrailing
                              ? calendarMonth === 12
                                ? 1
                                : calendarMonth + 1
                              : calendarMonth}
                          {@const cellYear = isLeading && calendarMonth === 1
                            ? calendarYear - 1
                            : isTrailing && calendarMonth === 12
                              ? calendarYear + 1
                              : calendarYear}
                          {@const inCurrentMonth = !isLeading && !isTrailing}
                          {@const inRange =
                            inCurrentMonth &&
                            rangeStartDay > 0 &&
                            day >= rangeStartDay &&
                            day <= rangeEndDay}
                          {@const isSelected =
                            inRange ||
                            (inCurrentMonth &&
                              cellYear === selectedCalendarYear &&
                              cellMonth === selectedCalendarMonth &&
                              selectedDay === day)}
                          <td
                            class:day-off={dayIndex === 0}
                            class:old={isLeading}
                            class:new={isTrailing}
                            class:period={inRange}
                            class:start={inCurrentMonth && day === rangeStartDay}
                            class:end={inCurrentMonth && day === rangeEndDay}
                            class:today={inCurrentMonth && day === todayDay}
                            class:day-event={inCurrentMonth && eventDays.includes(day)}
                            class:disabled={inCurrentMonth && disabledDays.includes(day)}
                            data-date={`${cellYear}.${String(cellMonth).padStart(2, '0')}.${String(day).padStart(2, '0')}`}
                          >
                            {#if inCurrentMonth}
                              <button
                                class="btn-set-date"
                                type="button"
                                disabled={disabledDays.includes(day)}
                                aria-pressed={isSelected ? 'true' : undefined}
                                aria-label={eventDays.includes(day)
                                  ? `${day} ${eventLabel}`
                                  : day === todayDay
                                    ? `${day} ${todayLabel}`
                                    : undefined}
                                onclick={(event) => selectCalendarDay(day, event)}
                              >
                                <span>{day}</span>
                              </button>
                            {:else}
                              <button class="btn-set-date" type="button" disabled="true">
                                <span>{day}</span>
                              </button>
                            {/if}
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
                <button class="krds-btn small text" id={`${id}-today`} type="button">{todayLabel}</button>
                <button class="krds-btn small tertiary" type="button">{cancelLabel}</button>
                <button class="krds-btn small primary" type="button">{confirmLabel}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if kind === 'date-input' && hint}<p class="form-hint">{hint}</p>{/if}
  </div>
{:else if kind === 'carousel' || kind === 'carousel-banner'}
  {#if kind === 'carousel-banner'}
    <div {...rest} class={`main-d-ban-swiper ${rootClass}`}>
      <div class="swiper">
        <ul class="swiper-wrapper">
          {#each slides as slide}
            <li class="swiper-slide">
              <div class="text">
                <p class="cate">{slide.description}</p>
                <p class="tit">{slide.title}</p>
              </div>
              <div class="im">
                <svg
                  width="243"
                  height="178"
                  viewBox="0 0 243 178"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label={imageLabel}
                >
                  <rect width="243" height="178" fill="#E6E8EA"></rect>
                </svg>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="swiper-indicator">
        <div class="swiper-pagination"></div>
        <div class="swiper-controller">
          <button type="button" class="swiper-button-play" onclick={(event) => invoke(onclick, event)}>
            <span class="sr-only">{playLabel}</span>
          </button>
          <button type="button" class="swiper-button-stop" onclick={(event) => invoke(onclick, event)}>
            <span class="sr-only">{stopLabel}</span>
          </button>
        </div>
        <div class="swiper-navigation">
          <button type="button" class="swiper-button-prev" onclick={(event) => moveSlide(-1, event)}>
            <span class="sr-only">{previousLabel}</span>
          </button>
          <button type="button" class="swiper-button-next" onclick={(event) => moveSlide(1, event)}>
            <span class="sr-only">{nextLabel}</span>
          </button>
          <a href={href} class="swiper-button-more">
            <span class="sr-only">{moreLabel}</span>
          </a>
        </div>
      </div>
    </div>
  {:else}
    <div {...rest} class={`main-vban-wrap bg ${rootClass}`}>
      <div class="inner">
        <div class="vb-swiper">
          <div class="swiper">
            <ul class="swiper-wrapper">
              {#each slides as slide}
                <li class="swiper-slide">
                  <div class="in">
                    <div class="text">
                      <p class="tit">{slide.title} <br class="w-hide" />{slide.title}</p>
                      <p class="txt">
                        {slide.description} <br class="w-hide" />{slide.description}
                      </p>
                      <a href={slide.href ?? '#'} class="krds-btn primary">{actionLabel}</a>
                    </div>
                    <div class="im">
                      <svg
                        width="243"
                        height="178"
                        viewBox="0 0 243 178"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label={imageLabel}
                      >
                        <rect width="243" height="178" fill="#E6E8EA"></rect>
                      </svg>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
          <button type="button" class="swiper-button-prev" onclick={(event) => moveSlide(-1, event)}>
            <span class="sr-only">{previousLabel}</span>
          </button>
          <button type="button" class="swiper-button-next" onclick={(event) => moveSlide(1, event)}>
            <span class="sr-only">{nextLabel}</span>
          </button>
          <div class="swiper-indicator text-center">
            <div class="swiper-pagination"></div>
            <a href={href} class="swiper-button-more">
              <span class="sr-only">{moreLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
{:else if kind === 'checkbox-chip'}
  <div class={`krds-form-chip ${rootClass}`}>
    <input
      {...rest}
      class="checkbox"
      type="checkbox"
      id={id}
      name={name || undefined}
      value={value}
      checked={chipChecked}
      disabled={disabled}
      required={required}
      form={form}
      onchange={setChip}
    />
    <label class="krds-form-chip-outline" for={id}>{label}</label>
  </div>
{:else if kind === 'checkbox-size'}
  <div class={`krds-form-check ${size} ${rootClass}`}>
    <input
      {...rest}
      type="checkbox"
      id={id}
      name={name || undefined}
      value={value}
      checked={chipChecked}
      disabled={disabled}
      required={required}
      form={form}
      onchange={setChip}
    />
    <label for={id}>{label}</label>
  </div>
{:else if kind === 'radio-chip'}
  <div class={`krds-form-chip ${rootClass}`}>
  <input
    {...rest}
    class={`radio ${rootClass}`}
    type="radio"
    id={id}
    name={name || undefined}
    value={value}
    checked={radioChecked}
    disabled={disabled}
    required={required}
    form={form}
    onchange={setRadio}
  />
  <label class="krds-form-chip-outline" for={id}>{label}</label>
  </div>
{:else if kind === 'radio-size'}
  <div class="krds-check-area">
    <div class={`krds-form-check ${size} ${rootClass}`}>
      <input
        {...rest}
        type="radio"
        id={id}
        name={name || undefined}
        value={value}
        checked={radioChecked}
        disabled={disabled}
        required={required}
        form={form}
        onchange={setRadio}
      />
      <label for={id}>{label}</label>
    </div>
    <div class="krds-form-check large">
      <input type="radio" id={`${id}-large`} name={name || undefined} />
      <label for={`${id}-large`}>사이즈 : large</label>
    </div>
  </div>
{:else if kind === 'coach-mark'}
  <div {...rest} class={`bg-white bg-white krds-coach-mark txt-box ${rootClass}`} hidden={!isOpen}>
    <div class="coach-balloon">
      <h5 class="sr-only">{title}</h5>
      <h6 class="coach-tit">{stepTitle}</h6>
      <p class="desc">{description}</p>
      <div class="coach-controls">
        <div class="num">
          <span class="sr-only">현재 단계</span><strong>{currentStep || step.split('/')[0]}</strong>
          <span class="sr-only">총 단계</span><span>{totalSteps || step.split('/')[1]}</span>
        </div>
        <div class="btn-wrap">
          <button class="krds-btn small text" type="button" onclick={toggleOpen}>{stopLabel}</button>
          <button class="krds-btn small tertiary" type="button">{nextLabel}</button>
        </div>
      </div>
    </div>
    <div><h3>{#if children}{@render children()}{:else}{contentTitle}{/if}</h3></div>
  </div>
{:else if kind === 'contextual-help'}
  <div {...rest} class={`krds-contextual-help ${position.split('-').reverse().join(' ')} ${rootClass}`}>
    {#if caption}<p class="tooltip-txt">{caption}</p>{/if}
    <div class="tooltip-action">
      <button
        class="icon krds-btn medium tooltip-btn"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-popover`}
        onclick={toggleOpen}
      >
        <span class="sr-only">{label}</span>
        <i class="ico-tooltip svg-icon"></i>
      </button>
      <div class="tooltip-popover" id={`${id}-popover`} role="tooltip">
        <h4 class="tooltip-title">{title}</h4>
        <div class="tooltip-contents">
          <p>{description || message}</p>
          {#if linkLabel}<div class="btn-wrap"><a class="basic krds-btn link xsmall" href={href}>{linkLabel}<i class="ico-angle right svg-icon"></i></a></div>{/if}
        </div>
        <button class="icon krds-btn tooltip-close xsmall" type="button" onclick={toggleOpen}>
          <span class="sr-only">{closeLabel}</span>
          <i class="ico-modal-close svg-icon"></i>
        </button>
      </div>
    </div>
  </div>
{:else if kind === 'critical-alerts'}
  <div {...rest} class={`main-urgent-wrap ${rootClass}`} role="alert">
    <ul class="krds-critical-alerts">
      {#each items as item}
        <li>
          <div class="critical-ban">
            <span class={`critical-badge ${fieldOf(item, 'tone') || 'info'}`}
              >{fieldOf(item, 'badgeLabel') || fieldOf(item, 'badge') || labelOf(item)}</span
            >
            <p class="critical-txt"
              >{fieldOf(item, 'message') || fieldOf(item, 'text') || fieldOf(item, 'description') || labelOf(item)}</p
            >
            <a class="basic krds-btn link medium" href={hrefOf(item)}>
              <span class="m-hide">{fieldOf(item, 'linkLabel') || fieldOf(item, 'actionLabel') || linkLabel}</span>
              <i class="ico-angle right svg-icon"></i>
            </a>
          </div>
        </li>
      {/each}
    </ul>
  </div>
{:else if kind === 'disclosure'}
  <div {...rest} class={`conts-expand-area krds-disclosure ${rootClass}`}>
    <button
      id={`${id}-trigger`}
      class="btn-conts-expand"
      type="button"
      aria-controls={`${id}-content`}
      aria-expanded={isOpen}
      onclick={toggleOpen}
    >{title}</button>
    <div
      class="expand-wrap"
      id={`${id}-content`}
      role="region"
      aria-labelledby={`${id}-trigger`}
      use:inertWhen={!isOpen}
    >
      <div class="expand-in">
        {#if items.length}
          <ul class="dash krds-info-list" role="list">
            {#each items as item}<li role="listitem">{labelOf(item)}</li>{/each}
          </ul>
        {:else if children}
          {@render children()}
        {:else}
          {description}
        {/if}
      </div>
    </div>
  </div>
{:else if kind === 'favicon'}
  <link {...rest} rel="icon" href={href} sizes={sizes || size || '32x32'} type={type || 'image/png'} />
{:else if kind === 'file-upload'}
  <div {...rest} class={`krds-file-upload line ${rootClass}`}>
    <div class="file-head">
      <h3 class="tit">{title}</h3>
      {#if description}<div><p>{description}</p></div>{/if}
    </div>
    <div class="file-upload">
      <p class="txt">{prompt}</p>
      <div class="file-upload-btn-wrap">
        <input
          bind:this={uploadInput}
          hidden
          id={inputId || id}
          name={name}
          type="file"
          {accept}
          {multiple}
          {disabled}
          {required}
          {form}
          onchange={setUpload}
        />
        <button
          type="button"
          class="krds-btn medium"
          {disabled}
          onclick={() => uploadInput?.click()}
        ><i class="svg-icon ico-upload"></i>{selectLabel}</button>
      </div>
    </div>
    <div class="file-list">
      <div class="total">
        <span class="current">{currentCount}{countSuffix || '개'}</span> / {maxCount}{countSuffix || '개'}
      </div>
      <ul class="upload-list">
        {#each files as file}
          {@const fileStatus = fieldOf(file, 'status')}
          {@const fileErrors = listOf(file, 'errors')}
          <li class:is-error={fileStatus === 'error'}>
            <div class="file-info" class:m-column={fileStatus === 'downloadable'}>
              <div class="file-name">{fieldOf(file, 'name')}</div>
              <div class="btn-wrap">
                {#if fileStatus === 'uploading'}
                  <span class="krds-spinner" role="status">
                    <span class="sr-only">{fieldOf(file, 'statusLabel')}</span>
                  </span>
                {:else if fileStatus === 'complete'}
                  <span class="ico-invalid complete">
                    <em class="sr-only">{fieldOf(file, 'statusLabel')}</em>
                  </span>
                {/if}
                {#if fieldOf(file, 'deleteLabel')}
                  <button class="krds-btn medium text" type="button">
                    {fieldOf(file, 'deleteLabel')} <i class="svg-icon ico-delete-fill"></i>
                  </button>
                {/if}
                {#if fieldOf(file, 'downloadLabel')}
                  <button class="krds-btn medium text" type="button">
                    {fieldOf(file, 'downloadLabel')} <i class="svg-icon ico-down"></i>
                  </button>
                {/if}
                {#if fieldOf(file, 'previewLabel')}
                  <button class="krds-btn medium text" type="button">
                    {fieldOf(file, 'previewLabel')} <i class="svg-icon ico-angle right"></i>
                  </button>
                {/if}
              </div>
            </div>
            {#if fileErrors.length}
              <p class="file-hint-invalid">
                {#each fileErrors as fileError, index}
                  {labelOf(fileError)}{#if index < fileErrors.length - 1}<br />{/if}
                {/each}
              </p>
            {/if}
          </li>
        {/each}
      </ul>
      {#if uploadValue}<p aria-live="polite">{uploadValue}</p>{/if}
      <div class="upload-delete-btn">
        <button class="krds-btn xsmall tertiary" type="button">
          {deleteAllLabel}<i class="svg-icon ico-angle right"></i>
        </button>
      </div>
    </div>
  </div>
{:else if kind === 'footer'}
  <footer {...rest} id={id} class={rootClass}>
    <div class="foot-quick">
      <div class="inner">
        {#each relatedSites as item}
          <button class="link" type="button" title={fieldOf(item, 'title') || undefined}>
            {item.label}
          </button>
        {/each}
      </div>
    </div>
    <div class="inner">
      <div class="f-logo"><span class="sr-only">{logoLabel}</span></div>
      <div class="f-cnt">
        <div class="f-info">
          <p class="info-addr">{address}</p>
          <ul class="info-cs">
            {#each contacts as contact}
              <li>
                <strong class="strong">{fieldOf(contact, 'title')}</strong><span class="span">{fieldOf(contact, 'description')}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="f-link">
          <div class="link-go">
            {#each links as item}
              <a href={hrefOf(item)} class="krds-btn medium text">
                {item.label} <i class="svg-icon ico-angle right"></i>
              </a>
            {/each}
          </div>
          <div class="link-sns">
            {#each socialLinks as item}
              <a
                href={hrefOf(item)}
                class="krds-btn xlarge icon border"
                target={fieldOf(item, 'target') || undefined}
                title={fieldOf(item, 'title') || undefined}
              >
                <span class="sr-only">{item.label}</span>
                <i class={`svg-icon ico-${fieldOf(item, 'icon')}`}></i>
              </a>
            {/each}
          </div>
        </div>
      </div>
      <div class="f-btm">
        <div class="f-btm-text">
          <div class="f-menu">
            {#each policyLinks as item}
              <a class:point={flagOf(item, 'emphasis')} href={hrefOf(item)}>{item.label}</a>
            {/each}
          </div>
          <p class="f-copy">{copyright}</p>
        </div>
        <div class="krds-identifier">
          <span class="logo"><span class="sr-only">{organization}</span></span>
          <span class="ban-txt">{description}</span>
        </div>
      </div>
    </div>
  </footer>
{:else if kind === 'header'}
  {@const myMenuData = myMenu ?? {}}
  {@const mobileData = mobileMenu ?? {}}
  {@const headerItems = desktopItems.length ? desktopItems : navigationItems}
  <header {...rest} id={id} class={rootClass}>
    <div class="header-in">
      <div class="header-container">
        <div class="inner">
          <div class="header-utility">
            <ul class="utility-list">
              {#each utilityItems as item}
                <li>
                  {#if fieldOf(item, 'kind') === 'link'}
                    <a
                      href={hrefOf(item)}
                      class="krds-btn small text"
                      target={fieldOf(item, 'target') || undefined}
                      title={fieldOf(item, 'title') || undefined}
                    >
                      {labelOf(item)} <i class="svg-icon ico-go"></i>
                    </a>
                  {:else}
                    <div
                      class="krds-drop-wrap"
                      class:krds-resize={fieldOf(item, 'kind') === 'resize'}
                    >
                      <button type="button" class="krds-btn small text drop-btn" aria-expanded="false">
                        {labelOf(item)} <i class="svg-icon ico-toggle"></i>
                      </button>
                      <div class="drop-menu">
                        <div class="drop-in">
                          <ul class="drop-list">
                            {#each listOf(item, 'items') as option}
                              <li>
                                {#if fieldOf(item, 'kind') === 'resize'}
                                  <button
                                    type="button"
                                    class={`item-link ${fieldOf(option, 'className')}`}
                                    class:active={flagOf(option, 'selected')}
                                  >
                                    {labelOf(option)}<span class="sr-only">{flagOf(option, 'selected') ? fieldOf(item, 'selectedLabel') : ''}</span>
                                  </button>
                                {:else}
                                  <a
                                    href={hrefOf(option)}
                                    class={`item-link ${fieldOf(option, 'className')}`}
                                    target={fieldOf(option, 'target') || undefined}
                                    title={fieldOf(option, 'title') || undefined}
                                  >{labelOf(option)}<span class="sr-only"></span></a>
                                {/if}
                              </li>
                            {/each}
                          </ul>
                          {#if fieldOf(item, 'resetLabel')}
                            <div class="drop-bottom">
                              <button type="button" class="krds-btn medium text">
                                <i class="svg-icon ico-reset"></i> {fieldOf(item, 'resetLabel')}
                              </button>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
          <div class="header-branding">
            <h2 class="logo">
              <a href={logoHref}><span class="sr-only">{logoLabel}</span></a>
            </h2>
            <div class="header-actions">
              <button type="button" class="btn-navi sch" title={searchTitle}>{searchLabel}</button>
              <a href={loginHref} class="btn-navi login">{loginLabel}</a>
              <button type="button" class="btn-navi join">{joinLabel}</button>
              <div class="krds-drop-wrap my-drop">
                <button type="button" class="btn-navi my drop-btn" aria-expanded="false">{fieldOf(myMenuData, 'label')}</button>
                <div class="drop-menu">
                  <div class="drop-in">
                    <div class="drop-top">
                      <p class="my-name">{fieldOf(myMenuData, 'userName')}</p>
                      <dl class="my-time">
                        <dt>{fieldOf(myMenuData, 'timeLabel')}</dt>
                        <dd>
                          <span class="time">{fieldOf(myMenuData, 'time')}</span>
                          <button type="button" class="krds-btn medium text">{fieldOf(myMenuData, 'extendLabel')}</button>
                        </dd>
                      </dl>
                    </div>
                    <ul class="drop-list">
                      {#each listOf(myMenuData, 'items') as item}
                        <li><a href={hrefOf(item)} class="item-link">{labelOf(item)}<span class="sr-only"></span></a></li>
                      {/each}
                    </ul>
                    <div class="drop-bottom">
                      <button type="button" class="krds-btn medium text">
                        <i class="svg-icon ico-logout"></i> {fieldOf(myMenuData, 'logoutLabel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="btn-navi all"
                aria-controls={`${id}-mobile`}
                onclick={toggleOpen}
              >{allMenuLabel}</button>
            </div>
          </div>
        </div>
      </div>
      <nav class="krds-main-menu">
        <div class="inner">
          <ul class="gnb-menu" aria-label={menuLabel || undefined}>
            {#each headerItems as item, topIndex}
              {@const topChildren = childrenOf(item)}
              {@const topBanner = recordOf(item, 'banner')}
              {@const mainPanelId = `${id}-desktop-main-${topIndex}`}
              <li>
                {#if fieldOf(item, 'href')}
                  <a
                    href={hrefOf(item)}
                    class="gnb-main-trigger is-link"
                    data-trigger="gnb"
                    target={fieldOf(item, 'target') || undefined}
                    title={fieldOf(item, 'title') || undefined}
                  >{labelOf(item)}</a>
                {:else if flagOf(item, 'button')}
                  <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                    {labelOf(item)}
                  </button>
                {:else}
                  <button
                    type="button"
                    class="gnb-main-trigger"
                    class:active={flagOf(item, 'active')}
                    data-trigger="gnb"
                    aria-controls={mainPanelId}
                    aria-expanded="false"
                    aria-haspopup="true"
                  >{labelOf(item)}</button>
                  <div
                    id={mainPanelId}
                    class="gnb-toggle-wrap"
                    class:is-open={flagOf(item, 'active')}
                  >
                    <div
                      class="gnb-main-list"
                      data-has-submenu={fieldOf(item, 'title') ? undefined : 'true'}
                    >
                      {#if fieldOf(item, 'title')}
                        <div class="gnb-sub-list single-list between">
                          <div class="gnb-sub-content">
                            <h2 class="sub-title"><span>{fieldOf(item, 'title')}</span></h2>
                            <ul>
                              {#each topChildren as leaf}
                                <li>
                                  {#if fieldOf(leaf, 'href')}
                                    <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                                  {:else}
                                    <button type="button">{labelOf(leaf)}</button>
                                  {/if}
                                </li>
                              {/each}
                            </ul>
                          </div>
                          {#if topBanner}
                            <div class="gnb-sub-banner">
                              <span class="krds-badge bg-secondary">{fieldOf(topBanner, 'badge')}</span>
                              <button type="button" class="krds-btn medium text">
                                {labelOf(topBanner)} <i class="svg-icon ico-angle right"></i>
                              </button>
                            </div>
                          {/if}
                        </div>
                      {:else}
                        <ul>
                          {#each topChildren as child, childIndex}
                            {@const childChildren = childrenOf(child)}
                            {@const descriptionItems = listOf(child, 'descriptionItems')}
                            {@const childBanner = recordOf(child, 'banner')}
                            {@const childPanelId = `${id}-desktop-sub-${topIndex}-${childIndex}`}
                            <li>
                              {#if fieldOf(child, 'href') && !childChildren.length && !descriptionItems.length}
                                <a
                                  href={hrefOf(child)}
                                  class="gnb-sub-trigger is-link"
                                  class:external-link={fieldOf(child, 'target') === '_blank'}
                                  data-trigger="gnb"
                                  target={fieldOf(child, 'target') || undefined}
                                  title={fieldOf(child, 'title') || undefined}
                                >{labelOf(child)}</a>
                              {:else}
                                <button
                                  type="button"
                                  class="gnb-sub-trigger"
                                  class:active={flagOf(child, 'active') || childIndex === 0}
                                  data-trigger="gnb"
                                  aria-controls={childPanelId}
                                  aria-expanded={childIndex === 0 ? 'true' : 'false'}
                                  aria-haspopup="true"
                                >{labelOf(child)}</button>
                                <div
                                  class="gnb-sub-list"
                                  class:active={flagOf(child, 'active') || childIndex === 0}
                                  class:between={childIndex > 0}
                                  id={childPanelId}
                                >
                                  <div class="gnb-sub-content">
                                    <h2 class="sub-title">
                                      {#if fieldOf(child, 'titleHref')}
                                        {fieldOf(child, 'title')}
                                        <a
                                          href={fieldOf(child, 'titleHref')}
                                          class="krds-btn link basic small"
                                        >
                                          <span class="underline">{fieldOf(child, 'titleLinkLabel')}</span>
                                          <i class="svg-icon ico-angle right"></i>
                                        </a>
                                      {:else}
                                        <span>{fieldOf(child, 'title')}</span>
                                      {/if}
                                    </h2>
                                    {#if descriptionItems.length}
                                      <ul class="type-description">
                                        {#each descriptionItems as detail}
                                          <li>
                                            <h3 class="tit">
                                              <a
                                                href={hrefOf(detail)}
                                                target={fieldOf(detail, 'target') || undefined}
                                                title={fieldOf(detail, 'externalTitle') || undefined}
                                              >
                                                {fieldOf(detail, 'title')} <i class="svg-icon ico-go"></i>
                                              </a>
                                            </h3>
                                            <p class="txt">{fieldOf(detail, 'description')}</p>
                                          </li>
                                        {/each}
                                      </ul>
                                    {:else}
                                      <ul>
                                        {#each childChildren as leaf}
                                          <li>
                                            {#if fieldOf(leaf, 'href')}
                                              <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                                            {:else}
                                              <button type="button">{labelOf(leaf)}</button>
                                            {/if}
                                          </li>
                                        {/each}
                                      </ul>
                                    {/if}
                                  </div>
                                  {#if childBanner}
                                    <div class="gnb-sub-banner">
                                      <span class="krds-badge bg-secondary">{fieldOf(childBanner, 'badge')}</span>
                                      <button type="button" class="krds-btn medium text">
                                        {labelOf(childBanner)} <i class="svg-icon ico-angle right"></i>
                                      </button>
                                    </div>
                                  {/if}
                                </div>
                              {/if}
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </div>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      </nav>
    </div>
    <div id={`${id}-mobile`} class="krds-main-menu-mobile" style:display={isOpen ? 'block' : 'none'}>
      <div class="gnb-wrap">
        <div class="gnb-header">
          <div class="gnb-utils">
            <ul class="utility-list">
              {#each listOf(mobileData, 'utilityItems') as item}
                <li><button type="button" class="krds-btn xsmall text">{labelOf(item)}</button></li>
              {/each}
            </ul>
          </div>
          <div class="gnb-login">
            <button type="button" class="krds-btn large text">
              <i class="svg-icon ico-log"></i> {fieldOf(mobileData, 'loginLabel')}
            </button>
          </div>
          <div class="gnb-service-menu">
            {#each listOf(mobileData, 'serviceItems') as item}
              <a href={hrefOf(item)} class="link">{labelOf(item)}</a>
            {/each}
          </div>
          <div class="sch-input">
            <input
              type="text"
              class="krds-input"
              placeholder={fieldOf(mobileData, 'searchPlaceholder')}
              title={fieldOf(mobileData, 'searchTitle')}
            />
            <button type="button" class="krds-btn medium icon ico-search">
              <span class="sr-only">{fieldOf(mobileData, 'searchLabel')}</span>
              <i class="svg-icon ico-sch"></i>
            </button>
          </div>
        </div>
        <div class="gnb-body">
          <div class="gnb-menu">
            <div class="menu-wrap">
              <ul role="tablist">
                {#each listOf(mobileData, 'items') as item, itemIndex}
                  <li role="none">
                    <a
                      href={`#${item.id}`}
                      id={`${id}-mobile-tab-${itemIndex}`}
                      class="gnb-main-trigger"
                      class:active={itemIndex === 0}
                      role="tab"
                      aria-selected={itemIndex === 0 ? 'true' : 'false'}
                      aria-controls={item.id}
                    >{labelOf(item)}</a>
                  </li>
                {/each}
              </ul>
            </div>
            <div class="submenu-wrap">
              {#each listOf(mobileData, 'items') as item, itemIndex}
                <div
                  class="gnb-sub-list"
                  id={item.id}
                  role="tabpanel"
                  aria-labelledby={`${id}-mobile-tab-${itemIndex}`}
                >
                  <h2 class="sub-title">{labelOf(item)}</h2>
                  <ul>
                    {#each childrenOf(item) as child}
                      <li>
                        <a
                          href={hrefOf(child)}
                          class="gnb-sub-trigger"
                          class:has-depth3={childrenOf(child).length > 0}
                          aria-expanded={childrenOf(child).length > 0 ? 'false' : undefined}
                        >{labelOf(child)}</a>
                        {#if childrenOf(child).length}
                          <div class="depth3-wrap">
                            <ul>
                              {#each childrenOf(child) as depthThree}
                                <li>
                                  <a
                                    href={hrefOf(depthThree)}
                                    class="depth3-trigger"
                                    class:has-depth4={childrenOf(depthThree).length > 0}
                                  >{labelOf(depthThree)}</a>
                                  {#if childrenOf(depthThree).length}
                                    <div class="depth4-wrap">
                                      <div class="depth4-head">
                                        <button type="button" class="krds-btn icon trigger-prev">
                                          <span class="sr-only">{fieldOf(mobileData, 'previousLabel')}</span>
                                          <i class="svg-icon ico-angle left"></i>
                                        </button>
                                        <button type="button" class="krds-btn icon trigger-close">
                                          <span class="sr-only">{fieldOf(mobileData, 'closeLabel')}</span>
                                          <i class="svg-icon ico-popup-close"></i>
                                        </button>
                                      </div>
                                      <ul class="depth4-body">
                                        <h4 class="sub-title">{fieldOf(depthThree, 'title')}</h4>
                                        <ul class="depth4-ul">
                                          {#each childrenOf(depthThree) as depthFour}
                                            <li><a href={hrefOf(depthFour)}>{labelOf(depthFour)}</a></li>
                                          {/each}
                                        </ul>
                                      </ul>
                                    </div>
                                  {/if}
                                </li>
                              {/each}
                            </ul>
                          </div>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
          <div class="gnb-bottom">
            {#each listOf(mobileData, 'bottomItems') as item}
              <a
                href={hrefOf(item)}
                class="krds-btn medium text"
                target={fieldOf(item, 'target') || undefined}
                title={fieldOf(item, 'title') || undefined}
              >
                {labelOf(item)}
                <i class={`svg-icon ${fieldOf(item, 'target') ? 'ico-go' : 'ico-angle right'}`}></i>
              </a>
            {/each}
          </div>
        </div>
        <button
          type="button"
          class="krds-btn medium icon"
          id={`${id}-mobile-close`}
          onclick={toggleOpen}
        >
          <span class="sr-only">{fieldOf(mobileData, 'closeLabel')}</span>
          <i class="svg-icon ico-popup-close"></i>
        </button>
      </div>
    </div>
  </header>
{:else if kind === 'main-menu-mobile'}
  <div
    {...rest}
    id={id}
    class={`krds-main-menu-mobile ${rootClass}`}
    class:sample={sample}
    style={sample ? 'display: block; position: static; visibility: visible;' : 'display: none;'}
    role="navigation"
  >
    <div class="gnb-wrap">
      <div class="gnb-header">
        <div class="gnb-utils">
          <ul class="utility-list">
            {#each utilityItems as item}
              <li><button type="button" class="krds-btn xsmall text">{item.label}</button></li>
            {/each}
          </ul>
        </div>
        <div class="gnb-login">
          <button type="button" class="krds-btn large text">
            <i class="svg-icon ico-log"></i> {loginLabel}
          </button>
        </div>
        <div class="gnb-service-menu">
          {#each serviceItems as item}<a href={hrefOf(item)} class="link">{item.label}</a>{/each}
        </div>
        <div class="sch-input">
          <input
            type="text"
            class="krds-input"
            placeholder={searchPlaceholder}
            title={searchTitle}
          />
          <button type="button" class="krds-btn medium icon ico-search">
            <span class="sr-only">{searchLabel}</span>
            <i class="svg-icon ico-sch"></i>
          </button>
        </div>
      </div>
      <div class="gnb-body">
        <div class="gnb-menu">
          <div class="menu-wrap">
            <ul role={sample ? undefined : 'tablist'}>
              {#each navigationItems as item, itemIndex}
                <li role={sample ? undefined : 'none'}>
                  <a
                    href={`#${item.id}`}
                    id={sample ? undefined : `${id}-tab-${itemIndex}`}
                    class="gnb-main-trigger"
                    class:active={!sample && itemIndex === 0}
                    role={sample ? undefined : 'tab'}
                    aria-selected={sample ? undefined : itemIndex === 0 ? 'true' : 'false'}
                    aria-controls={sample ? undefined : item.id}
                  >{labelOf(item)}</a>
                </li>
              {/each}
            </ul>
          </div>
          <div class="submenu-wrap">
            {#each navigationItems as item, itemIndex}
              <div
                class="gnb-sub-list"
                id={item.id}
                role={sample ? undefined : 'tabpanel'}
                aria-labelledby={sample ? undefined : `${id}-tab-${itemIndex}`}
              >
                <h2 class="sub-title">{labelOf(item)}</h2>
                <ul>
                  {#each childrenOf(item) as child}
                    <li>
                      <a
                        href={hrefOf(child)}
                        class="gnb-sub-trigger"
                        class:has-depth3={childrenOf(child).length > 0}
                        aria-expanded={!sample && childrenOf(child).length > 0 ? 'false' : undefined}
                      >{labelOf(child)}</a>
                      {#if childrenOf(child).length}
                        <div class="depth3-wrap">
                          <ul>
                            {#each childrenOf(child) as depthThree}
                              <li>
                                <a
                                  href={hrefOf(depthThree)}
                                  class="depth3-trigger"
                                  class:has-depth4={childrenOf(depthThree).length > 0}
                                >{labelOf(depthThree)}</a>
                                {#if childrenOf(depthThree).length}
                                  <div class="depth4-wrap">
                                    <div class="depth4-head">
                                      <button type="button" class="krds-btn icon trigger-prev">
                                        <span class="sr-only">{previousLabel}</span>
                                        <i class="svg-icon ico-angle left"></i>
                                      </button>
                                      <button type="button" class="krds-btn icon trigger-close">
                                        <span class="sr-only">{closeLabel}</span>
                                        <i class="svg-icon ico-popup-close"></i>
                                      </button>
                                    </div>
                                    <ul class="depth4-body">
                                      <h4 class="sub-title">{fieldOf(depthThree, 'title')}</h4>
                                      <ul class="depth4-ul">
                                        {#each childrenOf(depthThree) as depthFour}
                                          <li><a href={hrefOf(depthFour)}>{labelOf(depthFour)}</a></li>
                                        {/each}
                                      </ul>
                                    </ul>
                                  </div>
                                {/if}
                              </li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                    </li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        </div>
        <div class="gnb-bottom">
          {#each bottomItems as item}
            <a
              href={hrefOf(item)}
              class="krds-btn small text"
              target={fieldOf(item, 'target') || undefined}
              title={fieldOf(item, 'title') || undefined}
            >
              {labelOf(item)}
              <i class={`svg-icon ${fieldOf(item, 'target') ? 'ico-go' : 'ico-angle right'}`}></i>
            </a>
          {/each}
        </div>
      </div>
      <button
        type="button"
        class="krds-btn medium icon"
        id={sample ? 'close-nav' : `${id}-close`}
        onclick={sample ? undefined : toggleOpen}
      >
        <span class="sr-only">{closeLabel}</span>
        <i class="svg-icon ico-popup-close"></i>
      </button>
    </div>
  </div>
{:else if kind === 'main-menu-pc'}
  <nav {...rest} class={`krds-main-menu ${rootClass}`} class:sample={sample}>
    <div class="inner">
      <ul class="gnb-menu" aria-label={sample ? undefined : menuLabel || undefined}>
        {#each navigationItems as item, topIndex}
          {@const topChildren = childrenOf(item)}
          {@const topBanner = recordOf(item, 'banner')}
          {@const mainPanelId = `${id}-main-${topIndex}`}
          <li>
            {#if fieldOf(item, 'href')}
              <a
                href={hrefOf(item)}
                class="gnb-main-trigger is-link"
                data-trigger="gnb"
                target={fieldOf(item, 'target') || undefined}
                title={fieldOf(item, 'title') || undefined}
              >{labelOf(item)}</a>
            {:else if flagOf(item, 'button')}
              <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                {labelOf(item)}
              </button>
            {:else}
              <button
                type="button"
                class="gnb-main-trigger"
                class:active={flagOf(item, 'active')}
                data-trigger="gnb"
                aria-controls={sample ? undefined : mainPanelId}
                aria-expanded={sample ? undefined : 'false'}
                aria-haspopup={sample ? undefined : 'true'}
              >{labelOf(item)}</button>
              <div
                id={sample ? undefined : mainPanelId}
                class="gnb-toggle-wrap"
                class:is-open={flagOf(item, 'active')}
              >
                <div
                  class="gnb-main-list"
                  data-has-submenu={fieldOf(item, 'title') ? undefined : 'true'}
                >
                  {#if fieldOf(item, 'title')}
                    <div class="gnb-sub-list single-list between">
                      <div class="gnb-sub-content">
                        <h2 class="sub-title"><span>{fieldOf(item, 'title')}</span></h2>
                        <ul>
                          {#each topChildren as leaf}
                            <li>
                              {#if fieldOf(leaf, 'href')}
                                <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                              {:else}
                                <button type="button">{labelOf(leaf)}</button>
                              {/if}
                            </li>
                          {/each}
                        </ul>
                      </div>
                      {#if topBanner}
                        <div class="gnb-sub-banner">
                          <span class="krds-badge bg-secondary">{fieldOf(topBanner, 'badge')}</span>
                          <button type="button" class="krds-btn medium text">
                            {labelOf(topBanner)} <i class="svg-icon ico-angle right"></i>
                          </button>
                        </div>
                      {/if}
                    </div>
                  {:else}
                    <ul>
                      {#each topChildren as child, childIndex}
                        {@const childChildren = childrenOf(child)}
                        {@const descriptionItems = listOf(child, 'descriptionItems')}
                        {@const childBanner = recordOf(child, 'banner')}
                        {@const childPanelId = `${id}-sub-${topIndex}-${childIndex}`}
                        {@const runtimeSubActive = !sample && childIndex === 0}
                        <li>
                          {#if fieldOf(child, 'href') && !childChildren.length && !descriptionItems.length}
                            <a
                              href={hrefOf(child)}
                              class="gnb-sub-trigger is-link"
                              class:external-link={fieldOf(child, 'target') === '_blank'}
                              data-trigger="gnb"
                              target={fieldOf(child, 'target') || undefined}
                              title={fieldOf(child, 'title') || undefined}
                            >{labelOf(child)}</a>
                          {:else}
                            <button
                              type="button"
                              class="gnb-sub-trigger"
                              class:active={flagOf(child, 'active') || runtimeSubActive}
                              data-trigger="gnb"
                              aria-controls={sample ? undefined : childPanelId}
                              aria-expanded={sample ? undefined : runtimeSubActive ? 'true' : 'false'}
                              aria-haspopup={sample ? undefined : 'true'}
                            >{labelOf(child)}</button>
                            <div
                              class="gnb-sub-list"
                              class:active={flagOf(child, 'active') || runtimeSubActive}
                              class:between={childIndex > 0}
                              id={sample ? undefined : childPanelId}
                            >
                              <div class="gnb-sub-content">
                                <h2 class="sub-title">
                                  {#if fieldOf(child, 'titleHref')}
                                    {fieldOf(child, 'title')}
                                    <a
                                      href={fieldOf(child, 'titleHref')}
                                      class="krds-btn link basic small"
                                    >
                                      <span class="underline">{fieldOf(child, 'titleLinkLabel')}</span>
                                      <i class="svg-icon ico-angle right"></i>
                                    </a>
                                  {:else}
                                    <span>{fieldOf(child, 'title')}</span>
                                  {/if}
                                </h2>
                                {#if descriptionItems.length}
                                  <ul class="type-description">
                                    {#each descriptionItems as detail}
                                      <li>
                                        <h3 class="tit">
                                          <a
                                            href={hrefOf(detail)}
                                            target={fieldOf(detail, 'target') || undefined}
                                            title={fieldOf(detail, 'externalTitle') || undefined}
                                          >
                                            {fieldOf(detail, 'title')} <i class="svg-icon ico-go"></i>
                                          </a>
                                        </h3>
                                        <p class="txt">{fieldOf(detail, 'description')}</p>
                                      </li>
                                    {/each}
                                  </ul>
                                {:else}
                                  <ul>
                                    {#each childChildren as leaf}
                                      <li>
                                        {#if fieldOf(leaf, 'href')}
                                          <a href={hrefOf(leaf)}>{labelOf(leaf)}</a>
                                        {:else}
                                          <button type="button">{labelOf(leaf)}</button>
                                        {/if}
                                      </li>
                                    {/each}
                                  </ul>
                                {/if}
                              </div>
                              {#if childBanner}
                                <div class="gnb-sub-banner">
                                  <span class="krds-badge bg-secondary">{fieldOf(childBanner, 'badge')}</span>
                                  <button type="button" class="krds-btn medium text">
                                    {labelOf(childBanner)} <i class="svg-icon ico-angle right"></i>
                                  </button>
                                </div>
                              {/if}
                            </div>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{:else if kind === 'help-panel' || kind === 'tutorial-panel'}
  <div
    {...rest}
    class={`krds-help-panel ${isOpen ? 'expand' : ''} ${rootClass}`}
    hidden={!isOpen}
  >
    <div class="help-panel-wrap" tabindex={isOpen ? 0 : undefined}>
      <div class="help-conts-area">
        <div class="krds-tab-area layer">
          <div class="tab line">
            <ul role="tablist">
              {#each tabs as tab, index}
                {@const tabName = index === 0 ? 'help' : 'tutorial'}
                <li role="presentation" class:active={activeTab === tabName}>
                  <button
                    id={tab.id}
                    type="button"
                    class="btn-tab"
                    role="tab"
                    aria-selected={activeTab === tabName}
                    aria-controls={fieldOf(tab, 'panelId')}
                    tabindex={activeTab === tabName ? 0 : -1}
                    onclick={(event) => {
                      activeTab = tabName;
                      invoke(onclick, event);
                    }}
                  >
                    {tab.label}
                    {#if activeTab === tabName}<i class="sr-only created"> {selectedLabel}</i>{/if}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
          <div class="tab-conts-wrap">
            {#each tabs as tab, index}
              {@const tabName = index === 0 ? 'help' : 'tutorial'}
              <section
                id={fieldOf(tab, 'panelId')}
                role="tabpanel"
                aria-labelledby={tab.id}
                class="tab-conts"
                class:active={activeTab === tabName}
                hidden={activeTab !== tabName}
              >
                <h3 class="sr-only">{tab.label}</h3>
                <div class="help-conts-area-inner">
                  {#if tabName === 'help'}
                    <div class="conts-area help-conts">
                      <div class="conts-wrap">
                        <h4 class="help-title">
                          {helpTitle}
                          <span class="krds-btn medium icon">
                            <span class="sr-only">{label}</span>
                            <i class="svg-icon ico-help"></i>
                          </span>
                        </h4>
                        <div class="conts-desc"><p>{helpDescription}</p></div>
                        <ul class="link-list">
                          {#each downloadLinks as item}
                            <li>
                              <a
                                href={hrefOf(item)}
                                target={fieldOf(item, 'target') || undefined}
                                title={fieldOf(item, 'title') || externalTitle || undefined}
                                class="krds-btn xsmall link basic"
                              >
                                {labelOf(item)} <i class="svg-icon ico-go"></i>
                              </a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    </div>
                    <div class="conts-area related-service">
                      {#each relatedGroups as group}
                        <div class="conts-wrap">
                          <h4 class="help-title">{fieldOf(group, 'title')}</h4>
                          <ul class="link-list">
                            {#each listOf(group, 'links') as item}
                              <li>
                                <a href={hrefOf(item)} class="krds-btn xsmall link basic">
                                  {#if fieldOf(item, 'icon')}<i class={`svg-icon ico-${fieldOf(item, 'icon')}`}></i>{/if}
                                  {labelOf(item)}
                                  {#if !fieldOf(item, 'icon')}<i class="svg-icon ico-angle right"></i>{/if}
                                </a>
                              </li>
                            {/each}
                          </ul>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="conts-area">
                      <h4 class="help-title">
                        <a href="#;" title={tutorialBackTitle || backTitle || undefined}>
                          {tutorialTitle}
                        </a>
                      </h4>
                      <ul class="coach-help-process">
                        {#each tasks as task, taskIndex}
                          <li>
                            <h4 class="tit" class:current={flagOf(task, 'current')}>
                              {fieldOf(task, 'title')}
                            </h4>
                            <div class="krds-disclosure conts-expand-area">
                              <button
                                type="button"
                                class="btn-conts-expand"
                                aria-controls={`${id}-help-disclosure-${taskIndex}`}
                                aria-expanded="false"
                              >
                                {fieldOf(task, 'summary')}
                              </button>
                              <div
                                class="expand-wrap"
                                id={`${id}-help-disclosure-${taskIndex}`}
                                inert
                              >
                                <div class="expand-in">
                                  <ul class="krds-info-list decimal" role="list">
                                    {#each listOf(task, 'steps') as taskStep}
                                      <li role="listitem">{labelOf(taskStep)}</li>
                                    {/each}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                        {/each}
                      </ul>
                    </div>
                    <div class="help-panel-action">
                      <button type="button" class="krds-btn medium secondary coach-btn-stop">
                        {stopLabel}
                      </button>
                    </div>
                  {/if}
                </div>
              </section>
            {/each}
          </div>
        </div>
        <button
          type="button"
          class="krds-btn small tertiary btn-help-panel fold"
          onclick={toggleOpen}
        >
          <span class="sr-only">{label}</span> {collapseLabel}
          <i class="svg-icon ico-angle right"></i>
        </button>
      </div>
    </div>
  </div>
{:else if kind === 'identifier'}
  <div {...rest} class={`krds-identifier ${rootClass}`}>
    <span class="logo"><span class="sr-only">KRDS - Korea Design System</span></span>
    <span class="ban-txt">{description || organization || title}</span>
  </div>
{:else if kind === 'in-page-navigation'}
  <div class="krds-in-page-navigation-type">
    <div {...rest} class={`krds-in-page-navigation-area ${rootClass}`}>
      <div class="in-page-navigation-header">
        <p class="quick-caption">{title}</p>
        <p class="quick-title">{pageTitle}</p>
      </div>
      <nav class="in-page-navigation-list">
        <ul>
          {#each navigationItems as item}
            <li><a class:active={flagOf(item, 'current')} href={hrefOf(item)}>{labelOf(item)}</a></li>
          {/each}
        </ul>
      </nav>
      <div class="in-page-navigation-action">
        <button class="krds-btn medium" type="button">{actionLabel}</button>
        <p class="quick-info">{actionInfo} <strong>{actionCount}</strong></p>
      </div>
    </div>
  </div>
{:else if kind === 'language-switcher' || kind === 'language-switcher-page'}
  <div {...rest} class={`krds-drop-wrap krds-language ${rootClass}`}>
    <button
      class="krds-btn small text drop-btn"
      type="button"
      aria-expanded={isOpen}
      onclick={toggleOpen}
    ><i class="svg-icon ico-global"></i>{' '}{label}{' '}<i class="svg-icon ico-toggle"></i></button>
    <div class="drop-menu">
      <div class="drop-in">
        {#if kind === 'language-switcher-page'}
          <div class="drop-top">
            <p class="current-laguage">
              <span>{currentLabel}</span>
              <strong>{currentLanguage?.label}</strong>
            </p>
          </div>
        {/if}
        <ul class="drop-list">
          {#each languageItems as language}
            {#if kind !== 'language-switcher-page' || selection !== language.value}
              <li>
                <a
                  class="item-link"
                  class:active={kind === 'language-switcher' && selection === language.value}
                  href={fieldOf(language, 'href') || '#'}
                  lang={fieldOf(language, 'lang') || language.value}
                  target={kind === 'language-switcher-page' ? '_blank' : undefined}
                  title={kind === 'language-switcher-page' ? externalTitle : undefined}
                  onclick={(event) => setSelection(language.value, event)}
                >
                  {language.label}
                  {#if kind === 'language-switcher-page'}<i class="svg-icon ico-go"></i>{/if}
                  <span class="sr-only">{selection === language.value ? selectedLabel : ''}</span>
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    </div>
  </div>
{:else if kind === 'link'}
  <a
    {...rest}
    href={href}
    {target}
    {rel}
    title={title === '제목' ? undefined : title}
    class={`krds-btn link ${size} ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >
    <span class="underline">{#if children}{@render children()}{:else}{label}{/if}</span>
    {#if target === '_blank'}<i class="ico-go svg-icon"></i>{/if}
  </a>
{:else if kind === 'masthead'}
  <div {...rest} id={id} class={rootClass}>
    <div class="toggle-wrap">
      <div class="toggle-head">
        <div class="inner"><span class="nuri-txt">{message || description}</span></div>
      </div>
    </div>
  </div>
{:else if kind === 'modal' || kind === 'modal-sample'}
  <section
    {...rest}
    bind:this={modalRoot}
    id={`${id}-dialog`}
    class={`krds-modal fade ${isOpen ? 'in shown' : ''} ${rootClass}`}
    role="dialog"
    aria-labelledby={`${id}-title`}
    onkeydown={handleModalKeydown}
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id={`${id}-title`} class="modal-title">{title}</h2>
        </div>
        <div class="modal-conts">
          <div class="conts-area">
            {#if items.length}
              {#each items as item, index}
                {labelOf(item)}{#if index < items.length - 1}<br />{/if}
              {/each}
            {:else if children}
              {@render children()}
            {:else}
              {description}
            {/if}
          </div>
        </div>
        <div class="modal-btn btn-wrap">
          <button type="button" class="krds-btn medium tertiary close-modal" onclick={closeModal}>
            {cancelLabel}
          </button>
          <button type="button" class="krds-btn medium primary close-modal" onclick={closeModal}>
            {confirmLabel}
          </button>
        </div>
        <button type="button" class="krds-btn medium icon btn-close close-modal" onclick={closeModal}>
          <span class="sr-only">{closeLabel}</span>
          <i class="svg-icon ico-popup-close"></i>
        </button>
      </div>
    </div>
    <div class={`modal-back ${isOpen ? 'in' : ''}`}></div>
  </section>
{:else if kind === 'pagination'}
  <div
    {...rest}
    class={`krds-pagination ${rootClass}`}
    role="navigation"
    aria-label={navigationLabel}
  >
    {#if previousDisabled || (current ?? 1) <= 1}
      <span class="page-navi prev disabled" href="#">{previousLabel}</span>
    {:else}
      <a
        href="#"
        class="page-navi prev"
        onclick={(event) => {
          event.preventDefault();
          selectPage((current ?? 1) - 1, event);
        }}
      >{previousLabel}</a>
    {/if}
    <div class="page-links">
      {#each items as item}
        {#if labelOf(item) === 'ellipsis'}
          <span class="page-link link-dot"></span>
        {:else}
          {@const page = Number(labelOf(item))}
          <a
            href="#"
            class="page-link"
            class:active={page === (current ?? 1)}
            onclick={(event) => {
              event.preventDefault();
              selectPage(page, event);
            }}
          >
            {#if page === (current ?? 1)}<span class="sr-only">{message} </span>{/if}
            {page}
          </a>
        {/if}
      {/each}
    </div>
    <a
      href="#"
      class="page-navi next"
      onclick={(event) => {
        event.preventDefault();
        selectPage((current ?? 1) + 1, event);
      }}
    >{nextLabel}</a>
  </div>
{:else if kind === 'resize'}
  <div {...rest} class={`krds-drop-wrap krds-resize ${rootClass}`} data-adjust="scale">
    <button
      type="button"
      class="krds-btn small text drop-btn"
      aria-expanded={isOpen}
      onclick={toggleOpen}
    >
      {label} <i class="svg-icon ico-toggle"></i>
    </button>
    <div class="drop-menu">
      <div class="drop-in">
        <ul class="drop-list">
          {#each (options.length ? options : zoomOptions) as option}
            <li>
              <button
                type="button"
                class={`item-link ${option.value}`}
                class:active={(selection || 'md') === option.value}
                data-adjust-scale={option.value}
                onclick={(event) => setSelection(option.value, event)}
              >
                {option.label}<span class="sr-only">{(selection || 'md') === option.value ? selectedLabel : ''}</span>
              </button>
            </li>
          {/each}
        </ul>
        <div class="drop-bottom">
          <button
            type="button"
            class="krds-btn medium text"
            data-adjust-scale="md"
            onclick={(event) => setSelection('md', event)}
          >
            <i class="svg-icon ico-reset"></i> {resetLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
{:else if kind === 'select-sorting'}
  <select
    {...rest}
    id={id}
    name={name || undefined}
    {disabled}
    {required}
    {form}
    title={title}
    aria-invalid={selectState === 'error' ? 'true' : undefined}
    value={selection}
    onchange={(event) => setSelection(event.currentTarget.value, event)}
    class={`${selectClasses.control} ${rootClass}`.trim()}
  >
    {#each options as option}
      <option value={option.value} disabled={option.disabled}>{option.label}</option>
    {/each}
  </select>
{:else if kind === 'select' || kind === 'select-size' || kind === 'select-state'}
  <div class="form-group">
    <div class="form-tit"><label for={id}>{label}</label></div>
    <div class="form-conts">
      <select
        {...rest}
        id={id}
        name={name || undefined}
        {disabled}
        {required}
        {form}
        title={title}
        value={selection}
        onchange={(event) => setSelection(event.currentTarget.value, event)}
        class={`${selectClasses.control} ${rootClass}`.trim()}
        aria-invalid={selectState === 'error' ? 'true' : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
      >
        {#each options as option, index}
          <option
            value={option.value}
            disabled={option.disabled}
            selected={kind === 'select-size' && index === 0 ? true : undefined}
          >{option.label}</option>
        {/each}
      </select>
    </div>
    {#if hint}
      <p
        id={`${id}-hint`}
        class={selectState === 'error'
          ? 'form-hint-invalid'
          : selectState === 'success'
            ? 'form-hint-success'
            : selectState === 'information'
              ? 'form-hint-information'
              : 'form-hint'}
      >{hint}</p>
    {/if}
  </div>
{:else if kind === 'side-navigation'}
  <nav {...rest} class={`krds-side-navigation ${rootClass}`}>
    <h2 class="lnb-tit">{title}</h2>
    <ul class="lnb-list" role="menubar">
      {#each navigationItems as item, index}
        <li class:active={index === 0} class="lnb-item" role="none">
          {#if childrenOf(item).length}
            <button
              class="lnb-btn lnb-toggle"
              class:active={index === 0}
              type="button"
              role="menuitem"
              aria-expanded={index === 0}
              aria-controls={`${id}-side-${index}`}
            >{labelOf(item)}</button>
            <div class="lnb-submenu">
              <ul id={`${id}-side-${index}`} role="menu">
                {#each childrenOf(item) as child, childIndex}
                  <li class="lnb-subitem" class:active={flagOf(child, 'current')} role="none">
                    {#if childrenOf(child).length}
                      <button
                        class="lnb-btn lnb-toggle-popup"
                        type="button"
                        role="menuitem"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls={`${id}-side-${index}-${childIndex}`}
                      >{labelOf(child)}</button>
                      <div class="lnb-submenu-lv2" id={`${id}-side-${index}-${childIndex}`} role="menu">
                        <button class="lnb-btn-tit" type="button">{fieldOf(child, 'description')}</button>
                        <ul>
                          {#each childrenOf(child) as leaf}
                            <li role="none">
                              <a class="lnb-btn" href={hrefOf(leaf)} role="menuitem">{labelOf(leaf)}</a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {:else}
                      <a
                        class="lnb-btn lnb-link"
                        href={hrefOf(child)}
                        role="menuitem"
                        aria-current={flagOf(child, 'current') ? 'page' : undefined}
                      >{labelOf(child)}</a>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {:else}
            <a class="lnb-btn lnb-link" href={hrefOf(item)} role="menuitem">{labelOf(item)}</a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
{:else if kind === 'skip-link'}
  <div id={id} class={rootClass}>
    <a {...rest} href={href} onclick={(event) => invoke(onclick, event)}>
      {#if children}{@render children()}{:else}{label}{/if}
    </a>
  </div>
{:else if kind === 'spinner'}
  <div class="form-group">
    <div class="form-tit">
      <label for={`${id}-input`}>Label</label>
    </div>
    <div class="form-conts">
      <div class="form-spinner">
        <input type="text" id={`${id}-input`} class="krds-input" placeholder="placeholder" />
        <div {...rest} class={`krds-spinner ${rootClass}`} role="status">
          <span class="sr-only">{label}</span>
        </div>
      </div>
    </div>
  </div>
{:else if kind === 'step-indicator'}
  <ol {...rest} class={`krds-step-wrap ${rootClass}`}>
    {#each steps as item, index}
      <li class:done={index < (current ?? 0)} class:active={index === (current ?? 0)}>
        <span>
          {#if index === (current ?? 0)}<em class="sr-only">{message}</em>{/if}
          <i class="step">{index + 1}단계</i>
          <span class="step-tit">{item.label}</span>
        </span>
      </li>
    {/each}
  </ol>
{:else if kind === 'structured-list'}
  <ul {...rest} class={`krds-structured-list type-full ${rootClass}`}>
    {#each items as item}
      <li class="structured-item">
        <div class="in">
          {#if fieldOf(item, 'badge')}
            <div class="card-top">
              <span class={`krds-badge ${fieldOf(item, 'badgeClass') || fieldOf(item, 'tone')}`}
                >{fieldOf(item, 'badge')}</span
              >
            </div>
          {/if}
          <div class="card-body">
            <a class="c-text" href={hrefOf(item)}>
              <p class="c-tit"><span class="span">{labelOf(item)}</span></p>
              {#if fieldOf(item, 'description')}<p class="c-txt">{fieldOf(item, 'description')}</p>{/if}
              {#if fieldOf(item, 'date') || dateValue}
                <p class="c-date">
                  <strong class="key">{fieldOf(item, 'dateLabel') || dateLabel}</strong>
                  <span class="value">{fieldOf(item, 'date') || dateValue}</span>
                </p>
              {/if}
            </a>
            {#if actionLabel}
              <div class="c-btn"><a class="krds-btn secondary" href={hrefOf(item)} title={labelOf(item)}>{actionLabel}</a></div>
            {/if}
          </div>
          {#if tags.length}
            <div class="card-btm">{#each tags as tag}<span class="tag">{tag}</span>{/each}</div>
          {/if}
          <div class="card-btn">
            <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-share svg-icon"></i>{' '}{shareLabel}</button>
            <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-like svg-icon"></i>{' '}{favoriteLabel}</button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else if kind === 'structured-list-table' || kind === 'table'}
  {#if kind === 'structured-list-table'}
    <div class={`krds-structured-list-table ${rootClass}`}>
      <div class="search-list-top">
        <div class="sch-left">
          <div class="krds-check-area">
            <div class="krds-form-check">
              <input class="chk" id={`${id}-all`} type="checkbox" />
              <label for={`${id}-all`}>{selectAllLabel}</label>
            </div>
          </div>
          <ul class="side-line-ul">
            {#each actions as action}
              <li>
                <button class="krds-btn medium text" type="button">
                  <i class={`svg-icon ico-${fieldOf(action, 'icon')}`}></i>{' '}{fieldOf(action, 'label')}
                </button>
              </li>
            {/each}
          </ul>
        </div>
        <ul class="sch-sort">
          <li>
            <strong class="sort-label"><label for={`${id}-result-count`}>{countLabel}</label></strong>
            {' '}
            <select class="krds-form-select-sort" id={`${id}-result-count`}>
              {#each countOptions as option}<option>{option}</option>{/each}
            </select>
          </li>
          <li>
            <strong class="sort-label"><label for={`${id}-sort`}>{sortLabel}</label></strong>
            <div class="w-sort-btn">
              {#each sortOptions as option}
                <button class:active={option === sortValue} type="button">{option}</button>
                {' '}
              {/each}
            </div>
            <div class="m-sort-btn">
              <select class="krds-form-select-sort" id={`${id}-sort`} value={sortValue}>
                {#each sortOptions as option}<option>{option}</option>{/each}
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div class="krds-table-wrap">
        <table class="tbl col data">
          <caption>{caption || title}</caption>
          <colgroup>
            {#each columns as column}
              <col style={fieldOf(column, 'width') ? `width: ${fieldOf(column, 'width')};` : undefined} />
            {/each}
            <col />
          </colgroup>
          <thead>
            <tr>
              {#each columns as column}
                <th scope="col">
                  {#if column.key === 'download'}<span class="sr-only">{column.label}</span>{:else}{column.label}{/if}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each rows as row, rowIndex}
              <tr>
                {#each columns as column}
                  {#if column.key === 'selected'}
                    <th scope="row">
                      <div class="krds-form-check">
                        <input
                          class="chk"
                          id={`${id}-row-${rowIndex + 1}`}
                          type="checkbox"
                          aria-label={fieldOf(row, 'selectionLabel') || undefined}
                          checked={flagOf(row, 'selected')}
                        />
                        <label for={`${id}-row-${rowIndex + 1}`}></label>
                      </div>
                    </th>
                  {:else if column.key === 'download'}
                    <td>
                      <button class="krds-btn medium text" type="button">
                        <i class="svg-icon ico-down"></i>{' '}{row[column.key]}
                      </button>
                    </td>
                  {:else}
                    <td>{row[column.key]}</td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if pagination}
        <div class="krds-pagination">
          {#if flagOf(pagination, 'previousDisabled')}
            <span class="page-navi prev disabled" href="#">{fieldOf(pagination, 'previousLabel')}</span>
          {:else}
            <a class="page-navi prev" href={href}>{fieldOf(pagination, 'previousLabel')}</a>
          {/if}
          <div class="page-links">
            {#each listOf(pagination, 'items') as item}
              {#if labelOf(item) === 'ellipsis'}
                <span class="page-link link-dot"></span>
              {:else}
                {@const page = Number(labelOf(item))}
                <a class:active={page === Number(fieldOf(pagination, 'current'))} class="page-link" href={href}>
                  {#if page === Number(fieldOf(pagination, 'current'))}<span class="sr-only">{fieldOf(pagination, 'currentLabel')} </span>{/if}
                  {page}
                </a>
              {/if}
            {/each}
          </div>
          <a class="page-navi next" href={href}>{fieldOf(pagination, 'nextLabel')}</a>
        </div>
      {/if}
    </div>
  {:else}
    <div class="krds-table-wrap">
    <table {...rest} class="tbl col data">
      <caption>{caption || title}</caption>
      <colgroup>
        {#each columns as column}
          <col style={fieldOf(column, 'width') ? `width: ${fieldOf(column, 'width')};` : undefined} />
        {/each}
      </colgroup>
      <thead>
        <tr>
          {#each columns as column}
            <th scope="col">{column.label}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            {#each columns as column, columnIndex}
              {#if columnIndex === 0}<th scope="row">{row[column.key]}</th>{:else}<td>{row[column.key]}</td>{/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    </div>
  {/if}
{:else if kind === 'tab'}
  {@const active = selection || tabs[0]?.id}
  <div {...rest} class={`${tabClasses.root} ${rootClass}`.trim()}>
    <div class={tabClasses.listContainer}>
      <ul role="tablist">
    {#each tabs as tab, index}
      {@const itemClasses = tabRecipe({ active: active === tab.id })}
      <li
        role="presentation"
        class={itemClasses.item}
      >
        <button
          id={`${id}-tab-${tab.id}`}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`${id}-panel-${tab.id}`}
          class={itemClasses.trigger}
          type="button"
          disabled={tab.disabled}
          tabindex={active === tab.id ? 0 : -1}
          onclick={(event) => selectTab(tab.id, event)}
          onkeydown={(event) => handleTabKeydown(event, index)}
        >
          {tab.label}
          {#if active === tab.id}<i class="created sr-only">{message}</i>{/if}
        </button>
      </li>
    {/each}
  </ul>
    </div>
    <div class="tab-conts-wrap">
  {#each tabs as tab}
      <section
        role="tabpanel"
        id={`${id}-panel-${tab.id}`}
        aria-labelledby={`${id}-tab-${tab.id}`}
        data-quick-nav="false"
        class={`tab-conts ${active === tab.id ? 'active' : ''}`}
        hidden={active !== tab.id}
      ><h3 class="sr-only">{panelTitle || '탭 영역 타이틀'}</h3>{panels[tab.id] ?? (tab.id === active ? description : '')}</section>
  {/each}
    </div>
  </div>
{:else if kind === 'tag-link'}
  <div class={`krds-tag-wrap ${size || 'large'}`}>
    <a
      {...rest}
      href={href}
      class={`krds-btn-tag link ${rootClass}`}
      onclick={(event) => invoke(onclick, event)}
    >{label}</a>
  </div>
{:else if kind === 'tag'}
  <div class={`krds-tag-wrap ${size || 'large'}`}>
    <span {...rest} class={`krds-btn-tag ${rootClass}`}>
      {label}
      {#if removable}
        <button class="btn-delete" type="button" onclick={(event) => invoke(onclick, event)}>
          <span class="sr-only">{message}</span>
        </button>
      {/if}
    </span>
  </div>
{:else if kind === 'textarea'}
  <textarea
    {...rest}
    id={id}
    name={name || undefined}
    class={`krds-input ${rootClass}`}
    {placeholder}
    maxlength={maxLength}
    value={inputValue}
    {disabled}
    {required}
    {readonly}
    {autocomplete}
    {form}
    oninput={setValue}
  ></textarea>
  <label class="sr-only" for={id}>{label}</label>
{:else if kind === 'text-input-icon'}
  <div class="form-group">
    <div class="form-tit">
      <label for={id}>{label}</label>
    </div>
    <div class="form-conts btn-ico-wrap">
      <input
        {...rest}
        id={id}
        name={name || undefined}
        class={`krds-input ${rootClass}`}
        type={type || 'text'}
        {placeholder}
        value={inputValue}
        use:reflectValueAttribute={inputValue}
        {disabled}
        {required}
        {readonly}
        {autocomplete}
        {form}
        aria-describedby={hint ? `${id}-hint` : undefined}
        oninput={setValue}
      />
      <button type="button" class="krds-btn medium icon">
        <span class="sr-only">입력한 비밀번호 보기</span>
        <i class="svg-icon ico-pw-visible"></i>
      </button>
    </div>
    {#if hint}<p class="form-hint" id={`${id}-hint`}>{hint}</p>{/if}
  </div>
{:else if kind === 'text-list' || kind === 'text-list-ordered'}
  {#if kind === 'text-list-ordered'}
    <ol {...rest} class={`krds-info-list ordered ${rootClass}`} role="list">
      {#each items as item, index}
        <li role="listitem">
          <span class="num">{index + 1}.</span>{labelOf(item)}
          {#if childrenOf(item).length}
            <ol class="krds-info-list ordered" role="list">
              {#each childrenOf(item) as child, childIndex}
                <li role="listitem">
                  <span class="num">{String.fromCharCode(97 + childIndex)}.</span>{labelOf(child)}
                  {#if childrenOf(child).length}
                    <ol class="krds-info-list ordered" role="list">
                      {#each childrenOf(child) as grandchild}
                        <li role="listitem"><span class="num">{fieldOf(grandchild, 'marker')}</span>{labelOf(grandchild)}</li>
                      {/each}
                    </ol>
                  {/if}
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {/each}
    </ol>
  {:else}
    <ul {...rest} class={`decimal krds-info-list ${rootClass}`} role="list">
      {#each items as item}
        <li role="listitem">
          {labelOf(item)}
          {#if childrenOf(item).length}
            <ul class="dash krds-info-list" role="list">
              {#each childrenOf(item) as child}
                <li role="listitem">
                  {labelOf(child)}
                  {#if childrenOf(child).length}
                    <ul class="hollow krds-info-list" role="list">
                      {#each childrenOf(child) as grandchild}<li role="listitem">{labelOf(grandchild)}</li>{/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
{:else if kind === 'tooltip' || kind === 'tooltip-box' || kind === 'tooltip-vertical'}
  <button
    {...rest}
    type="button"
    class={`krds-btn krds-tooltip small text ${
      kind === 'tooltip-box' ? 'tooltip-box' : kind === 'tooltip-vertical' ? 'tooltip-vertical' : ''
    } ${rootClass}`}
    data-tooltip={message}
    aria-labelledby={`${id}-tip`}
    onclick={toggleOpen}
  >
    {#if children}{@render children()}{:else}{label}{/if}{' '}<i class="ico-angle right svg-icon"></i>
  </button>
  <span id={`${id}-tip`} role="tooltip" hidden={!isOpen}>
    {#if children}{@render children()}{/if}{' '}{message}
  </span>
{:else if kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size'}
  <button
    {...rest}
    type="button"
    class={`krds-tts ${size || 'medium'} ${rootClass}`}
    onclick={(event) => setChecked(!checkedValue, event, 'click')}
  >
    <span class="krds-tts-icon" aria-hidden="true"><i class="ico-volume svg-icon"></i></span>
    {#if kind !== 'tts-icon'}
      <span class="krds-tts-text">{#if children}{@render children()}{:else}{label}{/if}</span>
    {/if}
  </button>
{:else if kind === 'toggle-switch' || kind === 'toggle-switch-size'}
  <div class={`krds-form-toggle-switch ${size} ${rootClass}`}>
    <input
      {...rest}
      id={id}
      type="checkbox"
      name={name || undefined}
      value={value}
      checked={checkedValue}
      {disabled}
      {required}
      {form}
      onchange={(event) => setChecked(event.currentTarget.checked, event)}
    />
    <label for={id}><span class="switch-toggle"><i></i></span>{label}</label>
  </div>
{:else if kind === 'radio-button'}
  <div class={`krds-form-check ${size} ${rootClass}`}>
  <input
    {...rest}
    type="radio"
    id={id}
    name={name || undefined}
    value={value}
    checked={radioChecked}
    {disabled}
    {required}
    {form}
    onchange={setRadio}
  />
  <label for={id}>{label}</label>
  </div>
{:else if children}
  {@render children()}
{:else}
  <div {...rest} class={rootClass}>{description}</div>
{/if}
