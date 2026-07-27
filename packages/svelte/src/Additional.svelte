<script lang="ts">
  import type { KrdsAdditionalProps, KrdsNavItem, KrdsTone } from '@krds-community/recipes';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = Omit<KrdsAdditionalProps, 'className' | 'open'> &
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
      languages?: NonNullable<KrdsAdditionalProps['options']>;
      nav?: KrdsNavItem[];
      text?: string;
      step?: string;
      previousLabel?: string;
      nextLabel?: string;
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
    };
  type AdditionalValue = NonNullable<Props['value']>;
  type AdditionalModelValue = NonNullable<Props['modelValue']>;

  const generatedId = $props.id();
  let {
    kind = 'surface',
    id = generatedId,
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
    maxLength = 100,
    defaultValue = '',
    languages = [],
    nav = [],
    text = '',
    step = '',
    previousLabel = '이전',
    nextLabel = '다음',
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
    activeTab = kind === 'tutorial-panel' ? 'tutorial' : 'help',
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
  const calendarYear = $derived(year ?? Number(dateParts?.[1] ?? '2000'));
  const calendarMonth = $derived(month ?? Number(dateParts?.[2] ?? '1'));
  const selectedDay = $derived(Number(dateParts?.[3] ?? rangeStartDay));
  const calendarYears = Array.from({ length: 24 }, (_, index) => calendarYear - 1 + index);
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
  let modalRoot: HTMLDialogElement | undefined = $state();
  let restoreFocus: HTMLElement | null = null;
  let wasOpen = false;
  $effect(() => {
    if (!modalRoot) return;
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
    if (event.type !== 'cancel') invoke(onclose, event);
  };
  const setUpload = (event: Event) => {
    uploadValue = Array.from((event.currentTarget as HTMLInputElement).files ?? [])
      .map((file) => file.name)
      .join(', ');
    invoke(onchange, event);
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
  <div {...rest} class={`krds-calendar-area ${rootClass}`}>
    <div
      class={`bottom calendar-wrap ${kind === 'calendar' ? 'single' : ''}`}
      aria-label={calendarLabel}
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
                      class:active={optionYear === calendarYear}
                      aria-selected={optionYear === calendarYear}
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
                {#each calendarMonths as month}
                  <li role="none">
                    <button
                      type="button"
                      role="option"
                      class:active={month === calendarMonth}
                      aria-selected={month === calendarMonth}
                      disabled={disabledMonths.includes(month)}
                    >{String(month).padStart(2, '0')}월</button>
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
            <caption>{calendarYear}년 {calendarMonth}월</caption>
            <thead>
              <tr>
                {#each (weekdays.length ? weekdays : ['일', '월', '화', '수', '목', '금', '토']) as weekday}<th>{weekday}</th>{/each}
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
                      ? calendarMonth === 1 ? 12 : calendarMonth - 1
                      : isTrailing
                        ? calendarMonth === 12 ? 1 : calendarMonth + 1
                        : calendarMonth}
                    {@const cellYear = isLeading && calendarMonth === 1
                      ? calendarYear - 1
                      : isTrailing && calendarMonth === 12
                        ? calendarYear + 1
                        : calendarYear}
                    {@const inCurrentMonth = !isLeading && !isTrailing}
                    {@const inRange = inCurrentMonth && rangeStartDay > 0 && day >= rangeStartDay && day <= rangeEndDay}
                    {@const isSelected = inCurrentMonth && (selectedDay === day || day === rangeStartDay || day === rangeEndDay)}
                    <td
                      class:day-off={dayIndex === 0}
                      class:old={!inCurrentMonth}
                      class:start={inCurrentMonth && day === rangeStartDay}
                      class:end={inCurrentMonth && day === rangeEndDay}
                      class:period={inRange}
                      class:today={inCurrentMonth && day === todayDay}
                      class:day-event={inCurrentMonth && eventDays.includes(day)}
                      class:disabled={inCurrentMonth && disabledDays.includes(day)}
                      data-date={`${cellYear}.${String(cellMonth).padStart(2, '0')}.${String(day).padStart(2, '0')}`}
                    >
                      <button
                        class="btn-set-date"
                        type="button"
                        disabled={!inCurrentMonth || disabledDays.includes(day)}
                        aria-pressed={isSelected ? 'true' : undefined}
                        aria-label={inCurrentMonth && eventDays.includes(day) ? `${day} ${eventLabel}` : undefined}
                        onclick={(event) => selectCalendarDay(day, event)}
                      >
                        <span>{day}</span>
                        {#if inCurrentMonth && day === todayDay}<span class="sr-only">{todayLabel}</span>{/if}
                      </button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <div class="calendar-footer">
        <button class="krds-btn medium tertiary" type="button">{cancelLabel}</button>
        <button class="krds-btn medium primary" type="button">{confirmLabel}</button>
      </div>
    </div>
  </div>
{:else if kind === 'carousel' || kind === 'carousel-banner'}
  {#if kind === 'carousel-banner'}
    <div {...rest} class={`main-d-ban-swiper ${rootClass}`} aria-roledescription="carousel">
      <div class="swiper">
        <ul class="swiper-wrapper">
          {#each slides as slide, index}
            <li class="swiper-slide" aria-current={index === currentIndex ? 'true' : undefined}>
              {#if slide.description}<p class="in-sub">{slide.description}</p>{/if}
              <p class="in-tit">{slide.title}</p>
              {#if fieldOf(slide, 'image') || imageLabel}
                <svg aria-label={imageLabel} fill="none" height="178" viewBox="0 0 243 178" width="243" xmlns="http://www.w3.org/2000/svg"><rect fill="#E6E8EA" height="178" width="243"></rect></svg>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <div class="swiper-indicator">
        <div class="swiper-pagination" aria-live="polite">
          <span class="swiper-pagination-current">{currentIndex + 1}</span>
          <span class="swiper-pagination-total">{slides.length}</span>
        </div>
        <div class="swiper-controller">
          <button type="button" aria-label={playLabel}><i class="ico-play svg-icon"></i></button>
          <button type="button" aria-label={stopLabel}><i class="ico-stop svg-icon"></i></button>
        </div>
        <div class="swiper-navigation">
          <button type="button" aria-label={previousLabel} onclick={(event) => moveSlide(-1, event)}></button>
          <button type="button" aria-label={nextLabel} onclick={(event) => moveSlide(1, event)}></button>
        </div>
        <a class="krds-btn link" href={href}>{moreLabel}</a>
      </div>
    </div>
  {:else}
    <div {...rest} class={`bg main-vban-wrap ${rootClass}`} aria-roledescription="carousel">
      <div class="inner">
        <div class="vb-swiper">
          <ul class="swiper-wrapper">
            {#each slides as slide, index}
              <li class="swiper-slide" aria-current={index === currentIndex ? 'true' : undefined}>
                <p class="in-tit">{slide.title}</p>
                {#if slide.description}<p class="in-txt">{slide.description}</p>{/if}
                {#if actionLabel}<a class="krds-btn" href={slide.href ?? '#'}>{actionLabel}</a>{/if}
                {#if fieldOf(slide, 'image') || imageLabel}
                  <svg aria-label={imageLabel} fill="none" height="178" viewBox="0 0 243 178" width="243" xmlns="http://www.w3.org/2000/svg"><rect fill="#E6E8EA" height="178" width="243"></rect></svg>
                {/if}
              </li>
            {/each}
          </ul>
          <div class="swiper-indicator">
            <button type="button" aria-label={previousLabel} onclick={(event) => moveSlide(-1, event)}></button>
            <span aria-live="polite">{currentIndex + 1} / {slides.length}</span>
            <button type="button" aria-label={nextLabel} onclick={(event) => moveSlide(1, event)}></button>
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
{:else if kind === 'radio-size'}
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
{:else if kind === 'coach-mark'}
  <div {...rest} class={`bg-white krds-coach-mark txt-box ${rootClass}`} hidden={!isOpen}>
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
  <div {...rest} class={`krds-critical-alerts ${rootClass}`} role="alert">
    <ul>
      {#each items as item}
        <li>
          <div class="critical-ban">
            <span class={`critical-badge ${fieldOf(item, 'tone') || 'info'}`}
              >{fieldOf(item, 'badgeLabel') || fieldOf(item, 'badge') || labelOf(item)}</span
            >
            <p class="critical-txt">{fieldOf(item, 'message') || fieldOf(item, 'text') || fieldOf(item, 'description') || labelOf(item)}</p>
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
      class="btn-conts-expand"
      type="button"
      aria-controls={`${id}-content`}
      aria-expanded={isOpen}
      onclick={toggleOpen}
    >{title}</button>
    <div class="expand-wrap" id={`${id}-content`} inert={!isOpen}>
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
      {#if description}<div>{description}</div>{/if}
    </div>
    <div class="file-upload">
      <p class="txt">{prompt}</p>
      <div class="file-upload-btn-wrap">
        <input
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
        <label class="krds-btn medium" for={inputId || id}>
          <i class="ico-upload svg-icon"></i>{selectLabel}
        </label>
      </div>
    </div>
    <div class="file-list">
      <div class="total">{currentCount}개 / {maxCount}개</div>
      <ul class="upload-list">
        {#each files as file}
          <li>
            <div class="file-info">
              <span class="file-name">{fieldOf(file, 'name')}</span>
              {#if fieldOf(file, 'statusLabel')}
                {#if fieldOf(file, 'status') === 'uploading'}
                  <span role="status">{fieldOf(file, 'statusLabel')}</span>
                {:else}
                  <em>{fieldOf(file, 'statusLabel')}</em>
                {/if}
              {/if}
              {#if fieldOf(file, 'deleteLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'deleteLabel')}<i class="ico-delete-fill svg-icon"></i>
                </button>
              {/if}
              {#each listOf(file, 'errors') as fileError}<p>{labelOf(fileError)}</p>{/each}
              {#if fieldOf(file, 'downloadLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'downloadLabel')}<i class="ico-down svg-icon"></i>
                </button>
              {/if}
              {#if fieldOf(file, 'previewLabel')}
                <button class="krds-btn medium text" type="button">
                  {fieldOf(file, 'previewLabel')}<i class="ico-angle right svg-icon"></i>
                </button>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
      {#if uploadValue}<p aria-live="polite">{uploadValue}</p>{/if}
      <div class="upload-delete-btn">
        <button class="krds-btn tertiary xsmall" type="button">
          {deleteAllLabel}<i class="ico-angle right svg-icon"></i>
        </button>
      </div>
    </div>
  </div>
{:else if kind === 'footer'}
  <footer {...rest} id={id} class={rootClass}>
    {#if relatedSites.length}
      <div class="foot-quick">
        <div class="inner">
          {#each relatedSites as item, index}
            <button
              class="link"
              type="button"
              aria-expanded="false"
              aria-controls={`${id}-related-${index}`}
            >{item.label}</button>
          {/each}
        </div>
      </div>
    {/if}
    <div class="inner">
      <div class="f-logo"><span class="sr-only">{logoLabel}</span></div>
      <div class="f-cnt">
        <p>{address}</p>
        <ul>
          {#each contacts as contact}
            <li><strong>{fieldOf(contact, 'title')}</strong> {fieldOf(contact, 'description')}</li>
          {/each}
        </ul>
        <nav aria-label={organization}>
          <ul>{#each links as item}<li><a href={hrefOf(item)}>{item.label}</a></li>{/each}</ul>
        </nav>
        <ul class="f-sns">
          {#each socialLinks as item}
            <li>
              <a
                href={hrefOf(item)}
                target={fieldOf(item, 'target') || undefined}
                title={fieldOf(item, 'title') || undefined}
              >
                <span class="sr-only">{item.label}</span>
                <i class={`ico-${fieldOf(item, 'icon')} svg-icon`}></i>
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <div class="f-btm">
        <ul>
          {#each policyLinks as item}
            <li><a class:point={flagOf(item, 'emphasis')} href={hrefOf(item)}>{item.label}</a></li>
          {/each}
        </ul>
        <p>{copyright}</p>
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
                      class="krds-btn small text"
                      href={hrefOf(item)}
                      target={fieldOf(item, 'target') || undefined}
                      title={fieldOf(item, 'title') || undefined}
                    >{labelOf(item)}<i class="ico-go svg-icon"></i></a>
                  {:else}
                    <div class={`krds-drop-wrap ${fieldOf(item, 'kind') === 'resize' ? 'krds-resize' : ''}`}>
                      <button class="drop-btn krds-btn small text" type="button">{labelOf(item)}</button>
                      <div class="drop-menu">
                        <div class="drop-in">
                          <ul class="drop-list">
                            {#each listOf(item, 'items') as option}
                              <li>
                                {#if hrefOf(option) !== '#'}
                                  <a
                                    href={hrefOf(option)}
                                    target={fieldOf(option, 'target') || undefined}
                                    title={fieldOf(option, 'title') || undefined}
                                  >{labelOf(option)}{#if fieldOf(option, 'className')}<i class={`${fieldOf(option, 'className')} svg-icon`}></i>{/if}</a>
                                {:else}
                                  <button
                                    class={fieldOf(option, 'className') || undefined}
                                    class:active={flagOf(option, 'selected')}
                                    type="button"
                                  >{labelOf(option)}{#if flagOf(option, 'selected')}<span class="sr-only">{fieldOf(item, 'selectedLabel')}</span>{/if}</button>
                                {/if}
                              </li>
                            {/each}
                          </ul>
                        </div>
                        {#if fieldOf(item, 'resetLabel')}<div class="drop-bottom"><button type="button"><i class="ico-reset svg-icon"></i>{fieldOf(item, 'resetLabel')}</button></div>{/if}
                      </div>
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
          <div class="header-branding">
            <h2 class="logo"><a href={logoHref}><span class="sr-only">{logoLabel}</span></a></h2>
            <div class="header-actions">
              <button class="btn-navi sch" type="button">{searchLabel}</button>
              <a class="btn-navi login" href={loginHref}>{loginLabel}</a>
              <button class="btn-navi join" type="button">{joinLabel}</button>
              <div class="krds-drop-wrap my-drop">
                <button class="btn-navi drop-btn my" type="button">{fieldOf(myMenuData, 'label')}</button>
                <div class="drop-menu">
                  <div class="drop-in">
                    <div class="my-name">{fieldOf(myMenuData, 'userName')}</div>
                    <div class="my-time"><span>{fieldOf(myMenuData, 'timeLabel')}</span><strong>{fieldOf(myMenuData, 'time')}</strong><button type="button">{fieldOf(myMenuData, 'extendLabel')}</button></div>
                    <ul>{#each listOf(myMenuData, 'items') as item}<li><a href={hrefOf(item)}>{labelOf(item)}</a></li>{/each}</ul>
                    <button type="button">{fieldOf(myMenuData, 'logoutLabel')}</button>
                  </div>
                </div>
              </div>
              <button class="all btn-navi" type="button" onclick={toggleOpen}>{allMenuLabel}</button>
            </div>
          </div>
        </div>
      </div>
      <nav class="krds-main-menu">
        <div class="inner">
          <ul class="gnb-menu" aria-label={menuLabel}>
            {#each headerItems as item, index}
              <li>
                {#if fieldOf(item, 'href')}
                  <a
                    class="gnb-main-trigger is-link"
                    href={hrefOf(item)}
                    target={fieldOf(item, 'target') || undefined}
                    title={fieldOf(item, 'title') || undefined}
                  >{labelOf(item)}</a>
                {:else if flagOf(item, 'button')}
                  <button class="gnb-main-trigger is-link" type="button">{labelOf(item)}</button>
                {:else}
                  <button class="gnb-main-trigger" type="button" aria-expanded="false" aria-controls={`${id}-menu-${index}`}>{labelOf(item)}</button>
                  <div class="gnb-toggle-wrap" id={`${id}-menu-${index}`}>
                    <div class="gnb-main-list">
                      {#if childrenOf(item).length}
                        <ul>
                          {#each childrenOf(item) as child}
                            <li>
                              {#if childrenOf(child).length || listOf(child, 'descriptionItems').length}
                                <button type="button">{labelOf(child)}</button>
                                <div class="gnb-sub-list">
                                  {#if fieldOf(child, 'title')}<h2>{fieldOf(child, 'title')}</h2>{/if}
                                  <ul>
                                    {#each childrenOf(child) as leaf}
                                      <li>{#if flagOf(leaf, 'button')}<button type="button">{labelOf(leaf)}</button>{:else}<a href={hrefOf(leaf)}>{labelOf(leaf)}</a>{/if}</li>
                                    {/each}
                                    {#each listOf(child, 'descriptionItems') as detail}
                                      <li><a href={hrefOf(detail)} target={fieldOf(detail, 'target') || undefined}><strong>{fieldOf(detail, 'title')}</strong><span>{fieldOf(detail, 'description')}</span></a></li>
                                    {/each}
                                  </ul>
                                </div>
                              {:else}
                                <a href={hrefOf(child)} target={fieldOf(child, 'target') || undefined} title={fieldOf(child, 'title') || undefined}>{labelOf(child)}</a>
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
    <div class="krds-main-menu-mobile" id={`${id}-mobile`}>
      <div class="gnb-wrap">
        <div class="gnb-header">
          <div class="gnb-utils">
            <ul class="utility-list">{#each listOf(mobileData, 'utilityItems') as item}<li><button class="krds-btn text xsmall" type="button">{labelOf(item)}</button></li>{/each}</ul>
          </div>
          <div class="gnb-login"><button class="krds-btn large text" type="button"><i class="ico-log svg-icon"></i>{fieldOf(mobileData, 'loginLabel')}</button></div>
          <div class="gnb-service-menu">{#each listOf(mobileData, 'serviceItems') as item}<a class="link" href={hrefOf(item)}>{labelOf(item)}</a>{/each}</div>
          <div class="sch-input">
            <input class="krds-input" aria-label={fieldOf(mobileData, 'searchLabel') || fieldOf(mobileData, 'searchTitle') || '검색'} title={fieldOf(mobileData, 'searchTitle')} placeholder={fieldOf(mobileData, 'searchPlaceholder')} />
            <button class="ico-search icon krds-btn medium" type="button"><span class="sr-only">{fieldOf(mobileData, 'searchLabel')}</span><i class="ico-sch svg-icon"></i></button>
          </div>
        </div>
        <div class="gnb-body">
          <div class="gnb-menu">
            <div class="menu-wrap">
              <ul role="tablist">
                {#each listOf(mobileData, 'items') as item, index}<li role="none"><a class:active={index === 0} class="gnb-main-trigger" id={`${id}-mobile-tab-${index}`} href={hrefOf(item)} role="tab" aria-selected={index === 0} aria-controls={`${id}-mobile-panel-${index}`}>{labelOf(item)}</a></li>{/each}
              </ul>
            </div>
            <div class="submenu-wrap">
              {#each listOf(mobileData, 'items') as item, index}
                <div class="gnb-sub-list" id={`${id}-mobile-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-mobile-tab-${index}`}>
                  <h2 class="sub-title">{labelOf(item)}</h2>
                  <ul>
                    {#each childrenOf(item) as child}
                      <li>
                        <a href={hrefOf(child)}>{labelOf(child)}</a>
                        {#if childrenOf(child).length}
                          <ul>{#each childrenOf(child) as depthThree}<li><a href={hrefOf(depthThree)}>{labelOf(depthThree)}</a>{#if childrenOf(depthThree).length}<h3>{fieldOf(depthThree, 'title')}</h3><ul>{#each childrenOf(depthThree) as depthFour}<li><a href={hrefOf(depthFour)}>{labelOf(depthFour)}</a></li>{/each}</ul>{/if}</li>{/each}</ul>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
          <div class="gnb-bottom">{#each listOf(mobileData, 'bottomItems') as item}<a class="krds-btn medium text" href={hrefOf(item)} target={fieldOf(item, 'target') || undefined} title={fieldOf(item, 'title') || undefined}>{labelOf(item)}<i class={`${fieldOf(item, 'target') ? 'ico-go' : 'ico-angle right'} svg-icon`}></i></a>{/each}</div>
        </div>
        <button class="icon krds-btn medium" id={`${id}-mobile-close`} type="button" onclick={toggleOpen}><span class="sr-only">{fieldOf(mobileData, 'closeLabel')}</span><i class="ico-popup-close svg-icon"></i></button>
      </div>
    </div>
  </header>
{:else if kind === 'main-menu-mobile'}
  <div
    {...rest}
    id={id}
    class={`krds-main-menu-mobile sample ${rootClass}`}
    role="navigation"
  >
    <div class="gnb-wrap">
      <div class="gnb-header">
        {#if utilityItems.length}
          <ul>
            {#each utilityItems as item}<li><button type="button">{item.label}</button></li>{/each}
          </ul>
        {/if}
        <button type="button">{loginLabel}</button>
        {#if serviceItems.length}
          <ul>
            {#each serviceItems as item}<li><a href={hrefOf(item)}>{item.label}</a></li>{/each}
          </ul>
        {/if}
        <form role="search">
          <input class="krds-input" aria-label={searchLabel || searchTitle || '검색'} title={searchTitle} placeholder={searchPlaceholder} />
          <button type="submit">{searchLabel}</button>
        </form>
      </div>
      <div class="gnb-body">
        <ul>
          {#each navigationItems as item}
            <li><a href={item.id ? `#${item.id}` : hrefOf(item)}>{labelOf(item)}</a></li>
          {/each}
        </ul>
        {#each navigationItems as item}
          <section id={item.id}>
            <h2>{labelOf(item)}</h2>
            <ul>
              {#each childrenOf(item) as child}
                <li>
                  <a href={hrefOf(child)}>{labelOf(child)}</a>
                  {#if childrenOf(child).length}
                    <ul>
                      {#each childrenOf(child) as grandchild}
                        <li>
                          <a href={hrefOf(grandchild)}>{labelOf(grandchild)}</a>
                          {#if fieldOf(grandchild, 'title')}<h3>{fieldOf(grandchild, 'title')}</h3>{/if}
                          {#if childrenOf(grandchild).length}
                            <ul>
                              {#each childrenOf(grandchild) as leaf}
                                <li><a href={hrefOf(leaf)}>{labelOf(leaf)}</a></li>
                              {/each}
                            </ul>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
      {#if bottomItems.length}
        <ul>
          {#each bottomItems as item}
            <li>
              <a href={hrefOf(item)} target={fieldOf(item, 'target') || undefined} title={fieldOf(item, 'title') || undefined}
                >{labelOf(item)}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
      <button class="icon krds-btn medium" type="button" onclick={toggleOpen}>
        <span class="sr-only">{closeLabel}</span>
      </button>
    </div>
  </div>
{:else if kind === 'main-menu-pc'}
  <nav {...rest} class={`krds-main-menu sample ${rootClass}`} aria-label={menuLabel}>
    <div class="inner">
      <ul class="gnb-menu">
        {#each navigationItems as item, index}
          {@const itemBanner = recordOf(item, 'banner')}
          <li class:active={flagOf(item, 'active')}>
            {#if hrefOf(item) !== '#' || fieldOf(item, 'href')}
              <a href={hrefOf(item)} target={fieldOf(item, 'target') || undefined} title={fieldOf(item, 'title') || undefined}
                >{labelOf(item)}</a
              >
            {:else}
              <button type="button" aria-expanded={false} aria-controls={`${id}-pc-${index}`}
                >{labelOf(item)}</button
              >
            {/if}
            {#if fieldOf(item, 'title')}<h2>{fieldOf(item, 'title')}</h2>{/if}
            {#if childrenOf(item).length}
              <ul id={`${id}-pc-${index}`}>
                {#each childrenOf(item) as child}
                  {@const childBanner = recordOf(child, 'banner')}
                  <li class:active={flagOf(child, 'active')}>
                    {#if fieldOf(child, 'href') && !childrenOf(child).length && !listOf(child, 'descriptionItems').length}
                      <a
                        href={hrefOf(child)}
                        target={fieldOf(child, 'target') || undefined}
                        title={fieldOf(child, 'title') || undefined}
                      >{labelOf(child)}</a>
                    {:else}
                      <button type="button">{labelOf(child)}</button>
                      {#if fieldOf(child, 'title')}
                        <h2>
                          {fieldOf(child, 'title')}
                          {#if fieldOf(child, 'titleHref')}
                            <a href={fieldOf(child, 'titleHref')}>{fieldOf(child, 'titleLinkLabel')}</a>
                          {/if}
                        </h2>
                      {/if}
                      {#if childrenOf(child).length}
                        <ul>
                          {#each childrenOf(child) as leaf}
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
                      {#if listOf(child, 'descriptionItems').length}
                        <ul>
                          {#each listOf(child, 'descriptionItems') as descriptionItem}
                            <li>
                              <a
                                href={hrefOf(descriptionItem)}
                                target={fieldOf(descriptionItem, 'target') || undefined}
                                title={fieldOf(descriptionItem, 'externalTitle') || undefined}
                              >
                                <strong>{fieldOf(descriptionItem, 'title')}</strong>
                                <span>{fieldOf(descriptionItem, 'description')}</span>
                              </a>
                            </li>
                          {/each}
                        </ul>
                      {/if}
                      {#if childBanner}
                        <span>{fieldOf(childBanner, 'badge')}</span><button type="button">{labelOf(childBanner)}</button>
                      {/if}
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
            {#if itemBanner}<span>{fieldOf(itemBanner, 'badge')}</span><button type="button">{labelOf(itemBanner)}</button>{/if}
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{:else if kind === 'help-panel' || kind === 'tutorial-panel'}
  {@const activeTabItem = tabs[activeTab === 'tutorial' ? 1 : 0]}
  <div {...rest} class={`krds-help-panel ${isOpen ? 'expand' : ''} ${rootClass}`} hidden={!isOpen}>
    <div class="help-panel-wrap">
      <div class="help-conts-area">
        <ul role="tablist">
          {#each tabs as tab, index}
            {@const tabName = index === 0 ? 'help' : 'tutorial'}
            <li
              role="none"
              class:active={activeTab === tabName}
            >
              <button
                id={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tabName}
                aria-controls={fieldOf(tab, 'panelId')}
              >
                {tab.label}
                {#if activeTab === tabName}<span class="sr-only">{message}</span>{/if}
              </button>
            </li>
          {/each}
        </ul>
        <div
          id={fieldOf(activeTabItem, 'panelId')}
          role="tabpanel"
          aria-labelledby={activeTabItem?.id}
        >
          {#if activeTab === 'help'}
            <h3>{activeTabItem?.label}</h3>
            <h4>{helpTitle}</h4>
            <p>{helpDescription}</p>
            {#if downloadLinks.length}
              <ul>
                {#each downloadLinks as item}<li><a href={hrefOf(item)}>{labelOf(item)}</a></li>{/each}
              </ul>
            {/if}
            {#each relatedGroups as group}
              <h4>{fieldOf(group, 'title')}</h4>
              <ul>
                {#each listOf(group, 'links') as item}
                  <li><a href={hrefOf(item)}>{labelOf(item)}</a></li>
                {/each}
              </ul>
            {/each}
          {:else}
            <h3>{activeTabItem?.label}</h3>
            <h4><a href={href}>{tutorialTitle}</a></h4>
            <ol>
              {#each tasks as task}
                <li>
                  <h4>{fieldOf(task, 'title')}</h4>
                  <button type="button">{fieldOf(task, 'label')}</button>
                  <ol>
                    {#each listOf(task, 'steps') as taskStep}<li>{labelOf(taskStep)}</li>{/each}
                  </ol>
                </li>
              {/each}
            </ol>
            <button type="button">{stopLabel}</button>
          {/if}
        </div>
        <button type="button" onclick={toggleOpen}>{collapseLabel}</button>
      </div>
    </div>
  </div>
{:else if kind === 'identifier'}
  <div {...rest} class={`krds-identifier ${rootClass}`}>
    <span class="logo"><span class="sr-only">KRDS - Korea Design System</span></span>
    <span class="ban-txt">{description || organization || title}</span>
  </div>
{:else if kind === 'in-page-navigation'}
  <div {...rest} class={`krds-in-page-navigation-area ${rootClass}`}>
    <div class="in-page-navigation-header">
      <p class="quick-caption">{title}</p>
      {#if pageTitle}<p class="quick-title">{pageTitle}</p>{/if}
    </div>
    <nav class="in-page-navigation-list" aria-label={title}>
      <ul>
        {#each navigationItems as item, index}
          <li><a class:active={index === 0} href={hrefOf(item)}>{labelOf(item)}</a></li>
        {/each}
      </ul>
    </nav>
    {#if actionLabel}
      <div class="in-page-navigation-action">
        <button class="krds-btn medium" type="button">{actionLabel}</button>
        {#if actionInfo || actionCount}<p class="quick-info">{actionInfo} <strong>{actionCount}</strong></p>{/if}
      </div>
    {/if}
  </div>
{:else if kind === 'language-switcher' || kind === 'language-switcher-page'}
  <div {...rest} class={`krds-drop-wrap krds-language ${rootClass}`}>
    <button
      class="drop-btn krds-btn small text"
      type="button"
      aria-expanded={isOpen}
      aria-controls={`${id}-languages`}
      onclick={toggleOpen}
    >
      <i class="ico-global svg-icon"></i>{label}<i class="ico-toggle svg-icon"></i>
    </button>
    <div class="drop-menu" id={`${id}-languages`}>
      <div class="drop-in">
        {#if kind === 'language-switcher-page'}
          <div class="drop-top">
            <p class="current-laguage"><span>{title}</span><strong>{description}</strong></p>
          </div>
        {/if}
        <ul class="drop-list">
          {#each languageItems as language}
            <li>
              <a
                class:active={selection === language.value}
                class="item-link"
                href={fieldOf(language, 'href') || '#'}
                lang={language.value}
                target={kind === 'language-switcher-page' ? '_blank' : undefined}
                title={kind === 'language-switcher-page' ? message : undefined}
                onclick={(event) => {
                  event.preventDefault();
                  setSelection(language.value, event);
                }}
              >
                {language.label}
                {#if kind === 'language-switcher-page'}<i class="ico-go svg-icon"></i>{/if}
                {#if selection === language.value}<span class="sr-only">{selectedLabel}</span>{/if}
              </a>
            </li>
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
  <dialog
    {...rest}
    bind:this={modalRoot}
    open={isOpen}
    id={`${id}-dialog`}
    class={`fade krds-modal ${isOpen ? 'in shown' : ''} ${rootClass}`}
    aria-labelledby={`${id}-title`}
    oncancel={closeModal}
    onclose={closeModal}
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h2 class="modal-title" id={`${id}-title`}>{title}</h2></div>
        <div class="modal-conts">
          <div class="conts-area">
            {#if items.length}
              {#each items as item, index}{labelOf(item)}{#if index < items.length - 1}<br />{/if}{/each}
            {:else if children}
              {@render children()}
            {:else}
              {description}
            {/if}
          </div>
        </div>
        <div class="btn-wrap modal-btn">
          <button class="close-modal krds-btn medium tertiary" type="button" onclick={closeModal}
            >{cancelLabel}</button
          >
          <button class="close-modal krds-btn medium primary" type="button" onclick={closeModal}
            >{confirmLabel}</button
          >
        </div>
        <button class="btn-close close-modal icon krds-btn medium" type="button" onclick={closeModal}>
          <span class="sr-only">{closeLabel}</span><i class="ico-popup-close svg-icon"></i>
        </button>
      </div>
    </div>
    <div class={`modal-back ${isOpen ? 'in' : ''}`}></div>
  </dialog>
{:else if kind === 'pagination'}
  <div {...rest} class={`krds-pagination ${rootClass}`} role="navigation">
    {#if previousDisabled || (current ?? 1) <= 1}
      <span class="disabled page-navi prev">{previousLabel}</span>
    {:else}
      <button
        class="page-navi prev"
        type="button"
        onclick={(event) => {
          event.preventDefault();
          selectPage((current ?? 1) - 1, event);
        }}
      >{previousLabel}</button>
    {/if}
    <div class="page-links">
      {#each items as item}
        {#if labelOf(item) === 'ellipsis'}
          <span class="link-dot page-link"></span>
        {:else}
          {@const page = Number(labelOf(item))}
          <button
            class:active={page === (current ?? 1)}
            class="page-link"
            type="button"
            aria-current={page === (current ?? 1) ? 'page' : undefined}
            onclick={(event) => {
              event.preventDefault();
              selectPage(page, event);
            }}
          >
            {#if page === (current ?? 1)}<span class="sr-only">{message}</span>{/if}
            {page}
          </button>
        {/if}
      {/each}
    </div>
    <button
      class="next page-navi"
      type="button"
      onclick={(event) => {
        event.preventDefault();
        selectPage((current ?? 1) + 1, event);
      }}
    >{nextLabel}</button>
  </div>
{:else if kind === 'resize'}
  <div {...rest} class={`krds-drop-wrap krds-resize ${rootClass}`} data-adjust="scale">
    <button
      class="drop-btn krds-btn small text"
      type="button"
      aria-expanded={isOpen}
      aria-controls={`${id}-scale`}
      onclick={toggleOpen}
    >{label}<i class="ico-toggle svg-icon"></i></button>
    <div class="drop-menu" id={`${id}-scale`}>
      <div class="drop-in">
        <ul class="drop-list">
          {#each (options.length ? options : zoomOptions) as option}
            <li>
              <button
                class={`item-link ${option.value}`}
                class:active={(selection || 'md') === option.value}
                data-adjust-scale={option.value}
                type="button"
                onclick={(event) => setSelection(option.value, event)}
              >
                {option.label}
                {#if (selection || 'md') === option.value}<span class="sr-only">{selectedLabel}</span>{/if}
              </button>
            </li>
          {/each}
        </ul>
        <div class="drop-bottom">
          <button
            class="krds-btn medium text"
            data-adjust-scale="md"
            type="button"
            onclick={(event) => setSelection('md', event)}
          ><i class="ico-reset svg-icon"></i>{resetLabel}</button>
        </div>
      </div>
    </div>
  </div>
{:else if kind === 'select' || kind === 'select-size' || kind === 'select-state' || kind === 'select-sorting'}
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
    class={`${
      kind === 'select-sorting' ? 'krds-form-select-sort' : 'krds-form-select'
    } ${kind === 'select-size' ? size : ''} ${kind === 'select-state' || controlState === 'error' ? 'is-error' : ''} ${rootClass}`}
    aria-invalid={kind === 'select-state' || controlState === 'error' ? 'true' : undefined}
    aria-describedby={hint ? `${id}-hint` : undefined}
  >
    {#each options as option}<option value={option.value} disabled={option.disabled}>{option.label}</option>{/each}
  </select>
  <label class="sr-only" for={id}>{label}</label>
  {#if hint}<span id={`${id}-hint`} class="sr-only">{hint}</span>{/if}
{:else if kind === 'side-navigation'}
  <nav {...rest} class={`krds-side-navigation ${rootClass}`} aria-label={title}>
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
                  <li class="lnb-subitem" role="none">
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
                        <button class="lnb-btn-tit" type="button">{labelOf(child)}</button>
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
  <a {...rest} class={rootClass} href={href} onclick={(event) => invoke(onclick, event)}>
    {#if children}{@render children()}{:else}{label}{/if}
  </a>
{:else if kind === 'spinner'}
  <div {...rest} class={`krds-spinner ${rootClass}`} role="status">
    <span class="sr-only">{label}</span>
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
            <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-share svg-icon"></i>{shareLabel}</button>
            <button class="krds-btn medium text" title={labelOf(item)} type="button"><i class="ico-like svg-icon"></i>{favoriteLabel}</button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else if kind === 'structured-list-table' || kind === 'table'}
  <table {...rest} class="col data tbl">
    <caption>{caption || title}</caption>
    <colgroup>
      {#each columns as column}
        <col style={fieldOf(column, 'width') ? `width: ${fieldOf(column, 'width')};` : undefined} />
      {/each}
    </colgroup>
    <thead>
      <tr>
        {#each columns as column}
          <th class:sr-only={flagOf(column, 'visuallyHidden')} scope="col">
            {#if column.key === 'selected'}
              <input id={`${id}-all`} type="checkbox" aria-label={selectAllLabel} />
            {:else}
              {column.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, rowIndex}
        <tr>
          {#each columns as column, columnIndex}
            {#if column.key === 'selected'}
              <th scope="row">
                <input
                  class="chk"
                  id={`${id}-row-${rowIndex}`}
                  type="checkbox"
                  checked={flagOf(row, 'selected')}
                  aria-label={`${rowIndex + 1}`}
                />
              </th>
            {:else if kind === 'table' && columnIndex === 0}
              <th scope="row">{row[column.key]}</th>
            {:else if column.key === 'download'}
              <td><a href={fieldOf(row, 'downloadHref') || '#'}>{row[column.key]}</a></td>
            {:else}
              <td>{row[column.key]}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  {#if kind === 'structured-list-table'}
    <div class={`krds-table-wrap ${rootClass}`}>
      <div class="table-actions">
        {#each actions as action}
          <button class="krds-btn" type="button">
            {fieldOf(action, 'label')}<i class={`ico-${fieldOf(action, 'icon')} svg-icon`}></i>
          </button>
        {/each}
      </div>
      <label>{countLabel}<select>{#each countOptions as option}<option>{option}</option>{/each}</select></label>
      <label>
        {sortLabel}
        <select value={sortValue}>
          {#each sortOptions as option}<option value={option}>{option}</option>{/each}
        </select>
      </label>
      {#if pagination}
        <div class="krds-pagination" role="navigation">
          {#if flagOf(pagination, 'previousDisabled')}
            <span class="disabled page-navi prev">{fieldOf(pagination, 'previousLabel')}</span>
          {:else}
            <button class="page-navi prev" type="button">{fieldOf(pagination, 'previousLabel')}</button>
          {/if}
          <div class="page-links">
            {#each listOf(pagination, 'items') as item}
              {#if labelOf(item) === 'ellipsis'}
                <span class="link-dot page-link"></span>
              {:else}
                {@const page = Number(labelOf(item))}
                <button
                  class:active={page === Number(fieldOf(pagination, 'current'))}
                  class="page-link"
                  type="button"
                >
                  {#if page === Number(fieldOf(pagination, 'current'))}
                    <span class="sr-only">{fieldOf(pagination, 'currentLabel')}</span>
                  {/if}
                  {page}
                </button>
              {/if}
            {/each}
          </div>
          <button class="next page-navi" type="button">{fieldOf(pagination, 'nextLabel')}</button>
        </div>
      {/if}
    </div>
  {/if}
{:else if kind === 'tab'}
  {@const active = selection || tabs[0]?.id}
  <ul {...rest} role="tablist" class={rootClass}>
    {#each tabs as tab, index}
      <li
        role="none"
        class:active={active === tab.id}
      >
        <button
          id={`${id}-tab-${tab.id}`}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`${id}-panel-${tab.id}`}
          class="btn-tab"
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
  {#each tabs as tab}
    <div
      role="tabpanel"
      tabindex="0"
      id={`${id}-panel-${tab.id}`}
      aria-labelledby={`${id}-tab-${tab.id}`}
      hidden={active !== tab.id}
    >{panels[tab.id] ?? (tab.id === active ? description : '')}</div>
  {/each}
{:else if kind === 'tag-link'}
  <a
    {...rest}
    href={href}
    class={`krds-btn-tag link ${rootClass}`}
    onclick={(event) => invoke(onclick, event)}
  >{label}</a>
{:else if kind === 'tag'}
  <span {...rest} class={`krds-btn-tag ${rootClass}`}>
    {label}
    {#if removable}
      <button class="btn-delete" type="button" onclick={(event) => invoke(onclick, event)}>
        <span class="sr-only">{message}</span>
      </button>
    {/if}
  </span>
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
    aria-describedby={hint ? `${id}-hint` : undefined}
    oninput={setValue}
  ></textarea>
  <label class="sr-only" for={id}>{label}</label>
  {#if hint}<span class="sr-only" id={`${id}-hint`}>{hint}</span>{/if}
{:else if kind === 'text-input-icon'}
  <input
    {...rest}
    id={id}
    name={name || undefined}
    class={`krds-input ${rootClass}`}
    type={type || 'text'}
    {placeholder}
    value={inputValue}
    {disabled}
    {required}
    {readonly}
    {autocomplete}
    {form}
    aria-describedby={hint ? `${id}-hint` : undefined}
    oninput={setValue}
  />
  <label class="sr-only" for={id}>{label}</label>
  {#if hint}<span class="sr-only" id={`${id}-hint`}>{hint}</span>{/if}
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
    {#if children}{@render children()}{:else}{label}{/if}
    <i class="ico-angle right svg-icon"></i>
  </button>
  <span id={`${id}-tip`} role="tooltip" hidden={!isOpen}>
    {#if children}{@render children()} {/if}{message}
  </span>
{:else if kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size'}
  <button
    {...rest}
    type="button"
    class={`krds-tts ${size || 'medium'} ${rootClass}`}
    aria-pressed={playing || checkedValue}
    data-text={text || undefined}
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
{:else if children}
  {@render children()}
{:else}
  <div {...rest} class={rootClass}>{description}</div>
{/if}
