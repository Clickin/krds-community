import { Component, EventEmitter, forwardRef, inject, ElementRef, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { ControlValueAccessor } from "@angular/forms";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ADDITIONAL_ALIAS_KINDS, KIND_ALIASES } from "../../../packages/angular/src/kinds";
import {
  KrdsAccordionLineComponent,
  KrdsBadgeComponent,
  KrdsBadgeNumberComponent,
  KrdsBadgeSizeComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonSizeComponent,
  KrdsButtonIconComponent,
  KrdsButtonTextComponent,
  KrdsButtonWithIconComponent,
  KrdsCalendarComponent,
  KrdsCalendarRangeComponent,
  KrdsCarouselComponent,
  KrdsCarouselBannerComponent,
  KrdsCoachMarkComponent,
  KrdsContextualHelpComponent,
  KrdsCriticalAlertsComponent,
  KrdsDateInputComponent,
  KrdsDisclosureComponent,
  KrdsFaviconComponent,
  KrdsFileUploadComponent,
  KrdsFooterComponent,
  KrdsHeaderComponent,
  KrdsHelpPanelComponent,
  KrdsIdentifierComponent,
  KrdsInPageNavigationComponent,
  KrdsLanguageSwitcherComponent,
  KrdsLanguageSwitcherPageComponent,
  KrdsLinkComponent,
  KrdsMainMenuMobileComponent,
  KrdsMainMenuPcComponent,
  KrdsMastheadComponent,
  KrdsModalComponent,
  KrdsModalSampleComponent,
  KrdsPaginationComponent,
  KrdsRadioButtonComponent,
  KrdsRadioChipComponent,
  KrdsRadioSizeComponent,
  KrdsResizeComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectStateComponent,
  KrdsSelectSortingComponent,
  KrdsSideNavigationComponent,
  KrdsSkipLinkComponent,
  KrdsSpinnerComponent,
  KrdsStepIndicatorComponent,
  KrdsStructuredListComponent,
  KrdsStructuredListTableComponent,
  KrdsTabComponent,
  KrdsTableComponent,
  KrdsTagComponent,
  KrdsTagLinkComponent,
  KrdsTextareaComponent,
  KrdsTextInputIconComponent,
  KrdsTextInputSizeComponent,
  KrdsTextInputStateComponent,
  KrdsTextListComponent,
  KrdsTextListOrderedComponent,
  KrdsToggleSwitchComponent,
  KrdsToggleSwitchSizeComponent,
  KrdsTooltipComponent,
  KrdsTooltipBoxComponent,
  KrdsTooltipVerticalComponent,
  KrdsTtsComponent,
  KrdsTtsIconComponent,
  KrdsTtsSizeComponent,
  KrdsTutorialPanelComponent,
} from "@krds-community/angular";

const krdsAdditionalMetadata = {
  selector: "krds-additional",
  standalone: true,
  imports: [
    CommonModule,
    KrdsAccordionLineComponent,
    KrdsBadgeComponent,
    KrdsBadgeNumberComponent,
    KrdsBadgeSizeComponent,
    KrdsBreadcrumbComponent,
    KrdsButtonHierarchyComponent,
    KrdsButtonSizeComponent,
    KrdsButtonIconComponent,
    KrdsButtonTextComponent,
    KrdsButtonWithIconComponent,
    KrdsCalendarComponent,
    KrdsCalendarRangeComponent,
    KrdsCarouselComponent,
    KrdsCarouselBannerComponent,
    KrdsCoachMarkComponent,
    KrdsContextualHelpComponent,
    KrdsCriticalAlertsComponent,
    KrdsDateInputComponent,
    KrdsDisclosureComponent,
    KrdsFaviconComponent,
    KrdsFileUploadComponent,
    KrdsFooterComponent,
    KrdsHeaderComponent,
    KrdsHelpPanelComponent,
    KrdsIdentifierComponent,
    KrdsInPageNavigationComponent,
    KrdsLanguageSwitcherComponent,
    KrdsLanguageSwitcherPageComponent,
    KrdsLinkComponent,
    KrdsMainMenuMobileComponent,
    KrdsMainMenuPcComponent,
    KrdsMastheadComponent,
    KrdsModalComponent,
    KrdsModalSampleComponent,
    KrdsPaginationComponent,
    KrdsRadioButtonComponent,
    KrdsRadioChipComponent,
    KrdsRadioSizeComponent,
    KrdsResizeComponent,
    KrdsSelectComponent,
    KrdsSelectSizeComponent,
    KrdsSelectSortingComponent,
    KrdsSelectStateComponent,
    KrdsSideNavigationComponent,
    KrdsSkipLinkComponent,
    KrdsSpinnerComponent,
    KrdsStepIndicatorComponent,
    KrdsStructuredListComponent,
    KrdsStructuredListTableComponent,
    KrdsTabComponent,
    KrdsTableComponent,
    KrdsTagComponent,
    KrdsTagLinkComponent,
    KrdsTextareaComponent,
    KrdsTextInputIconComponent,
    KrdsTextInputSizeComponent,
    KrdsTextInputStateComponent,
    KrdsTextListComponent,
    KrdsTextListOrderedComponent,
    KrdsToggleSwitchComponent,
    KrdsToggleSwitchSizeComponent,
    KrdsTooltipComponent,
    KrdsTooltipBoxComponent,
    KrdsTooltipVerticalComponent,
    KrdsTtsComponent,
    KrdsTtsIconComponent,
    KrdsTtsSizeComponent,
    KrdsTutorialPanelComponent,
  ],
  inputs: [
    "kind",
    "id",
    "label",
    "value",
    "name",
    "type",
    "title",
    "hint",
    "message",
    "href",
    "className",
    "placeholder",
    "size",
    "state",
    "disabled",
    "required",
    "variant",
    "items",
    "options",
    "tabs",
    "panels",
    "selected",
    "selectedLabel",
    "caption",
    "columns",
    "rows",
    "actions",
    "navigationLabel",
    "current",
    "previousLabel",
    "nextLabel",
    "inputId",
    "currentCount",
    "maxCount",
    "countSuffix",
    "files",
    "displayYear",
    "displayMonth",
    "selectedYear",
    "selectedMonth",
    "years",
    "disabledYears",
    "disabledMonths",
    "leadingDays",
    "previousMonthDayCount",
    "dayCount",
    "disabledDays",
    "weekdays",
    "calendarLabel",
    "previousMonthLabel",
    "nextMonthLabel",
    "yearSelectLabel",
    "monthSelectLabel",
    "todayLabel",
    "cancelLabel",
    "confirmLabel",
    "menuLabel",
    "utilityItems",
    "desktopItems",
    "myMenu",
    "mobileMenu",
    "open",
    "activeTab",
    "collapseLabel",
    "tasks",
    "pageTitle",
    "actionLabel",
    "panelTitle",
  ],
  outputs: ["change", "selectedChange"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsAdditionalComponent),
      multi: true,
    },
  ],
  template: `
    <ng-template #projectedContent><ng-content></ng-content></ng-template>
    @switch (renderKind) {
      @case ('accordion-line') { <krds-accordion-line [items]="items"><ng-container *ngTemplateOutlet="projectedContent" /></krds-accordion-line> }
      @case ('badge') { <krds-badge [label]="label" [message]="message" /> }
      @case ('badge-number') { <krds-badge-number [label]="label" [message]="message" /> }
      @case ('badge-size') { <krds-badge-size [label]="label" [message]="message" /> }
      @case ('breadcrumb') { <krds-breadcrumb /> }
      @case ('button-hierarchy') { <krds-button-hierarchy [variant]="variant"><ng-container *ngTemplateOutlet="projectedContent" /></krds-button-hierarchy> }
      @case ('button-icon') { <krds-button-icon /> }
      @case ('button-size') { <krds-button-size [size]="size"><ng-container *ngTemplateOutlet="projectedContent" /></krds-button-size> }
      @case ('button-text') { <krds-button-text /> }
      @case ('button-with-icon') { <krds-button-with-icon [size]="size"><ng-container *ngTemplateOutlet="projectedContent" /></krds-button-with-icon> }
      @case ('calendar') { <krds-calendar [id]="id" [displayYear]="displayYear" [displayMonth]="displayMonth" [selectedYear]="selectedYear" [selectedMonth]="selectedMonth" [years]="years" [disabledYears]="disabledYears" [disabledMonths]="disabledMonths" [leadingDays]="leadingDays" [previousMonthDayCount]="previousMonthDayCount" [dayCount]="dayCount" [disabledDays]="disabledDays" [weekdays]="weekdays" [calendarLabel]="calendarLabel" [previousMonthLabel]="previousMonthLabel" [nextMonthLabel]="nextMonthLabel" [yearSelectLabel]="yearSelectLabel" [monthSelectLabel]="monthSelectLabel" [todayLabel]="todayLabel" [cancelLabel]="cancelLabel" [confirmLabel]="confirmLabel" /> }
      @case ('calendar-range') { <krds-calendar-range /> }
      @case ('carousel') { <krds-carousel /> }
      @case ('carousel-banner') { <krds-carousel-banner /> }
      @case ('coach-mark') { <krds-coach-mark /> }
      @case ('contextual-help') { <krds-contextual-help [id]="id" [label]="label" /> }
      @case ('critical-alerts') { <krds-critical-alerts [items]="items" /> }
      @case ('date-input') { <krds-date-input [id]="id" [label]="label" [hint]="hint" [displayYear]="displayYear" [displayMonth]="displayMonth" [selectedYear]="selectedYear" [selectedMonth]="selectedMonth" [years]="years" [weekdays]="weekdays" /> }
      @case ('disclosure') { <krds-disclosure [id]="id" [title]="title" [items]="items"><ng-container *ngTemplateOutlet="projectedContent" /></krds-disclosure> }
      @case ('favicon') { <krds-favicon /> }
      @case ('file-upload') { <krds-file-upload [inputId]="inputId" [name]="name" [currentCount]="currentCount" [maxCount]="maxCount" [countSuffix]="countSuffix" [files]="files" /> }
      @case ('footer') { <krds-footer /> }
      @case ('header') { <krds-header [id]="id" [menuLabel]="menuLabel" [utilityItems]="utilityItems" [desktopItems]="desktopItems" [myMenu]="myMenu" [mobileMenu]="mobileMenu" /> }
      @case ('help-panel') { <krds-help-panel [open]="open" [activeTab]="activeTab" [label]="label" [selectedLabel]="selectedLabel" [collapseLabel]="collapseLabel" [tabs]="tabs" [tasks]="tasks" (activeTabChange)="activeTab = $event" /> }
      @case ('identifier') { <krds-identifier /> }
      @case ('in-page-navigation') { <krds-in-page-navigation [title]="title" [pageTitle]="pageTitle" [actionLabel]="actionLabel" [items]="items" /> }
      @case ('language-switcher') { <krds-language-switcher [label]="label" [options]="options" [selected]="selected" [selectedLabel]="selectedLabel" /> }
      @case ('language-switcher-page') { <krds-language-switcher-page [label]="label" [options]="options" [selected]="selected" [selectedLabel]="selectedLabel" /> }
      @case ('link') { <krds-link [label]="label" [href]="href" /> }
      @case ('main-menu-mobile') { <krds-main-menu-mobile [menuLabel]="menuLabel" /> }
      @case ('main-menu-pc') { <krds-main-menu-pc /> }
      @case ('masthead') { <krds-masthead /> }
      @case ('modal') { <krds-modal /> }
      @case ('modal-sample') { <krds-modal-sample /> }
      @case ('pagination') { <krds-pagination [navigationLabel]="navigationLabel" [items]="items" [current]="current" [previousLabel]="previousLabel" [nextLabel]="nextLabel" /> }
      @case ('radio-button') { <krds-radio-button /> }
      @case ('radio-chip') { <krds-radio-chip /> }
      @case ('radio-size') { <krds-radio-size [id]="id" [label]="label" [name]="name" [value]="value" /> }
      @case ('resize') { <krds-resize [label]="label" [options]="options" [selected]="selected" [selectedLabel]="selectedLabel" /> }
      @case ('select') {
        <krds-select
          [id]="id"
          [name]="name"
          [title]="title"
          [label]="label"
          [hint]="hint"
          [className]="className"
          [options]="options"
          [required]="required"
          [disabled]="cvaDisabled() || disabled"
          [state]="state"
          [size]="size"
          [selected]="cvaSelected()"
          (change)="change.emit($event)"
          (selectedChange)="onSelectedChange($event)"
        />
      }
      @case ('select-size') {
        <krds-select-size
          [id]="id"
          [name]="name"
          [title]="title"
          [label]="label"
          [hint]="hint"
          [className]="className"
          [options]="options"
          [size]="size"
          [state]="state"
          (change)="change.emit($event)"
          (selectedChange)="onSelectedChange($event)"
        />
      }
      @case ('select-state') {
        <krds-select-state
          [id]="id"
          [name]="name"
          [title]="title"
          [label]="label"
          [hint]="hint"
          [className]="className"
          [options]="options"
          [state]="state"
          (change)="change.emit($event)"
          (selectedChange)="onSelectedChange($event)"
        />
      }
      @case ('select-sorting') {
        <krds-select-sorting
          [id]="id"
          [name]="name"
          [title]="title"
          [label]="label"
          [hint]="hint"
          [className]="className"
          [options]="options"
          [disabled]="cvaDisabled() || disabled"
          [required]="required"
          (change)="change.emit($event)"
          (selectedChange)="onSelectedChange($event)"
        />
      }
      @case ('side-navigation') { <krds-side-navigation /> }
      @case ('skip-link') { <krds-skip-link /> }
      @case ('spinner') { <krds-spinner [id]="id" [label]="label" /> }
      @case ('step-indicator') { <krds-step-indicator /> }
      @case ('structured-list') { <krds-structured-list /> }
      @case ('structured-list-table') { <krds-structured-list-table [id]="id" [caption]="caption" [columns]="columns" [rows]="rows" [actions]="actions" /> }
      @case ('tab') { <krds-tab [selected]="selected" [selectedLabel]="selectedLabel" [message]="message" [panelTitle]="panelTitle" [tabs]="tabs" [panels]="panels" (selectedChange)="onSelectedChange($event)" /> }
      @case ('table') { <krds-table /> }
      @case ('tag') { <krds-tag [label]="label" [message]="message" /> }
      @case ('tag-link') { <krds-tag-link [href]="href" /> }
      @case ('textarea') { <krds-textarea /> }
      @case ('text-input-icon') { <krds-text-input-icon [id]="id" [label]="label" [type]="type" [value]="value" [placeholder]="placeholder" /> }
      @case ('text-input-size') { <krds-text-input-size [id]="id" [label]="label" [hint]="hint" [placeholder]="placeholder" [size]="size" [state]="state" [type]="type" [value]="value" /> }
      @case ('text-input-state') { <krds-text-input-state [id]="id" [hint]="hint" [state]="state" [value]="value" /> }
      @case ('text-list') { <krds-text-list /> }
      @case ('text-list-ordered') { <krds-text-list-ordered /> }
      @case ('toggle-switch') { <krds-toggle-switch /> }
      @case ('toggle-switch-size') { <krds-toggle-switch-size /> }
      @case ('tooltip') { <krds-tooltip [id]="id" [label]="label" [message]="message" /> }
      @case ('tooltip-box') { <krds-tooltip-box [id]="id" [label]="label" [message]="message" /> }
      @case ('tooltip-vertical') { <krds-tooltip-vertical /> }
      @case ('tts') { <krds-tts [label]="label" [size]="size" /> }
      @case ('tts-icon') { <krds-tts-icon [kind]="kind" [label]="label" /> }
      @case ('tts-size') { <krds-tts-size [label]="label" [size]="size" /> }
      @case ('tutorial-panel') { <krds-tutorial-panel [open]="open" [activeTab]="activeTab" [tabs]="tabs" /> }
    }
  `,
};

export const KrdsAdditionalComponent = Component(krdsAdditionalMetadata)(
  class KrdsAdditionalComponent implements ControlValueAccessor {
    kind = "";

    // Shared input props used across components
    id = "";
    label = "";
    value = "";
    name = "";
    type = "";
    title = "";
    hint = "";
    message = "";
    href = "";
    className = "";
    placeholder = "";
    size = "";
    state = "";
    disabled = false;
    required = false;
    variant = "";

    // Items, options, collections
    items: any[] | undefined;
    options: any[] | undefined;
    tabs: any[] | undefined;
    panels: Record<string, string> | undefined;
    selected = "";
    selectedLabel = "";
    caption = "";
    columns: any[] | undefined;
    rows: any[] | undefined;
    actions: any[] | undefined;

    // Pagination
    navigationLabel = "";
    current: number | undefined;
    previousLabel = "";
    nextLabel = "";

    // File upload
    inputId = "";
    currentCount: number | undefined;
    maxCount: number | undefined;
    countSuffix = "";
    files: any[] | undefined;

    // Calendar
    displayYear: number | undefined;
    displayMonth: number | undefined;
    selectedYear: number | undefined;
    selectedMonth: number | undefined;
    years: number[] | undefined;
    disabledYears: number[] | undefined;
    disabledMonths: number[] | undefined;
    leadingDays: number | undefined;
    previousMonthDayCount: number | undefined;
    dayCount: number | undefined;
    disabledDays: number[] | undefined;
    weekdays: string[] | undefined;
    calendarLabel = "";
    previousMonthLabel = "";
    nextMonthLabel = "";
    yearSelectLabel = "";
    monthSelectLabel = "";
    todayLabel = "";
    cancelLabel = "";
    confirmLabel = "";

    // Header
    menuLabel = "";
    utilityItems: any[] | undefined;
    desktopItems: any[] | undefined;
    myMenu: any | undefined;
    mobileMenu: any | undefined;

    // Help/tutorial panel
    open = false;
    activeTab = "";
    collapseLabel = "";
    tasks: any[] | undefined;

    // In-page navigation
    pageTitle = "";
    actionLabel = "";

    // Tab
    panelTitle = "";

    // Kind resolution from host element selector
    private elementRef = inject(ElementRef);
    private get hostAliasKind(): string | undefined {
      const tagName = this.elementRef.nativeElement.tagName;
      return ADDITIONAL_ALIAS_KINDS[tagName.toLowerCase()];
    }
    get renderKind(): string {
      const hostKind = this.hostAliasKind;
      const inputKind = hostKind ?? this.kind;
      return KIND_ALIASES[inputKind as keyof typeof KIND_ALIASES] ?? inputKind ?? "surface";
    }

    // CVA forwarding state
    cvaSelected = signal<string>("");
    cvaDisabled = signal<boolean>(false);

    // Output forwarding
    change = new EventEmitter<Event>();
    selectedChange = new EventEmitter<string>();

    // CVA callbacks
    private _onChange: (value: string) => void = () => {};
    private _onTouched: () => void = () => {};

    /** Called by inner component when selected value changes */
    onSelectedChange(value: string): void {
      this.selected = value;
      this._onChange(value);
      this.selectedChange.emit(value);
    }

    // ControlValueAccessor implementation
    writeValue(value: string | null): void {
      this.cvaSelected.set(value ?? "");
    }

    registerOnChange(fn: (value: string) => void): void {
      this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
      this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
      this.cvaDisabled.set(disabled);
    }
  },
);

const krdsTabWrapperMetadata = {
  selector: "krds-tab-wrapper",
  standalone: true,
  imports: [KrdsTabComponent],
  template: `
    <krds-tab
      [selected]="selected"
      [selectedLabel]="selectedLabel"
      [message]="message"
      [panelTitle]="panelTitle"
      [tabs]="tabs"
      [panels]="panels"
      (selectedChange)="selectedChange.emit($event)"
    />
  `,
  inputs: ["selected", "selectedLabel", "message", "panelTitle", "tabs", "panels"],
  outputs: ["selectedChange"],
};

export const KrdsTabWrapperComponent = Component(krdsTabWrapperMetadata)(
  class KrdsTabWrapperComponent {
    selected = "";
    selectedLabel = "";
    message = "";
    panelTitle = "";
    tabs: any[] = [];
    panels: Record<string, string> = {};
    selectedChange = new EventEmitter<string>();
  },
);
