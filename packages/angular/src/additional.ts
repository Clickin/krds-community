import { CommonModule } from '@angular/common';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';
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
export type AngularNavItem = Omit<KrdsNavItem, 'children'> & {
  active?: boolean;
  button?: boolean;
  title?: string;
  titleHref?: string;
  titleLinkLabel?: string;
  target?: string;
  banner?: { badge: string; label: string };
  descriptionItems?: Array<{
    title: string;
    description: string;
    href: string;
    target?: string;
    externalTitle?: string;
  }>;
  children?: AngularNavItem[];
};
export type HeaderUtilityItem = {
  id: string;
  kind?: 'link' | 'dropdown' | 'resize';
  label: string;
  href?: string;
  target?: string;
  title?: string;
  selectedLabel?: string;
  resetLabel?: string;
  items?: Array<AngularNavItem & { className?: string; selected?: boolean }>;
};

export type HeaderMyMenu = {
  label: string;
  userName: string;
  timeLabel: string;
  time: string;
  extendLabel: string;
  items: AngularNavItem[];
  logoutLabel: string;
};

export type HeaderMobileMenu = {
  utilityItems: HeaderUtilityItem[];
  loginLabel: string;
  serviceItems: AngularNavItem[];
  searchPlaceholder: string;
  searchTitle: string;
  searchLabel: string;
  items: AngularNavItem[];
  previousLabel: string;
  closeLabel: string;
  bottomItems: AngularNavItem[];
};

export type AngularTableAction = {
  id: string;
  label: string;
  icon?: string;
};

export type AngularTablePagination = {
  current: number;
  items: Array<string | number>;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  currentLabel: string;
};

export type AngularCalendarCell = {
  day: number;
  date: string;
  className: string;
  disabled: boolean;
  pressed: boolean;
  ariaLabel: string | null;
};

const CALENDAR_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

let nextAdditionalId = 0;

function createStableId(prefix: string): string {
  nextAdditionalId += 1;
  return `${prefix}-${nextAdditionalId.toString(36)}`;
}

export const ANGULAR_ADDITIONAL_KINDS = [
  'surface',
  'badge',
  'badge-number',
  'badge-size',
  'breadcrumb',
  'accordion',
  'accordion-line',
  'button-icon',
  'button-text',
  'button-with-icon',
  'button-hierarchy',
  'button-size',
  'calendar',
  'calendar-range',
  'date-input',
  'carousel',
  'carousel-banner',
  'checkbox-chip',
  'checkbox-size',
  'radio-chip',
  'radio-size',
  'radio-button',
  'coach-mark',
  'contextual-help',
  'critical-alerts',
  'disclosure',
  'favicon',
  'file-upload',
  'footer',
  'header',
  'help-panel',
  'tutorial-panel',
  'identifier',
  'in-page-navigation',
  'language-switcher',
  'language-switcher-page',
  'link',
  'main-menu-mobile',
  'main-menu-pc',
  'masthead',
  'modal',
  'modal-sample',
  'pagination',
  'resize',
  'select',
  'select-size',
  'select-sorting',
  'select-state',
  'side-navigation',
  'skip-link',
  'spinner',
  'step-indicator',
  'structured-list',
  'structured-list-table',
  'tab',
  'table',
  'tag',
  'tag-link',
  'textarea',
  'text-input-icon',
  'text-input-size',
  'text-input-state',
  'text-list',
  'text-list-ordered',
  'toggle-switch',
  'toggle-switch-size',
  'tooltip',
  'tooltip-box',
  'tooltip-vertical',
  'tts',
  'tts-icon',
  'tts-size',
] as const;

export type AngularAdditionalKind = (typeof ANGULAR_ADDITIONAL_KINDS)[number];

export type AngularImplementedAdditionalKind =
  | 'calendar'
  | 'calendar-range'
  | 'checkbox-chip'
  | 'date-input'
  | 'header'
  | 'language-switcher'
  | 'radio-button'
  | 'radio-chip'
  | 'select'
  | 'structured-list-table'
  | 'textarea'
  | 'text-input-icon'
  | 'toggle-switch';

export type AngularUnverifiedAdditionalKind = Exclude<
  AngularAdditionalKind,
  AngularImplementedAdditionalKind
>;

export type AngularAdditionalSupport =
  | { readonly status: 'implemented'; readonly kind: AngularImplementedAdditionalKind }
  | { readonly status: 'unverified'; readonly kind: AngularUnverifiedAdditionalKind };

const ADDITIONAL_ALIAS_KINDS: Record<string, AngularAdditionalKind> = {
  'krds-badge': 'badge',
  'krds-badge-number': 'badge-number',
  'krds-badge-size': 'badge-size',
  'krds-accordion-line': 'accordion-line',
  'krds-breadcrumb': 'breadcrumb',
  'krds-button-hierarchy': 'button-hierarchy',
  'krds-button-icon': 'button-icon',
  'krds-button-size': 'button-size',
  'krds-button-text': 'button-text',
  'krds-button-with-icon': 'button-with-icon',
  'krds-calendar': 'calendar',
  'krds-calendar-range': 'calendar-range',
  'krds-carousel': 'carousel',
  'krds-carousel-banner': 'carousel-banner',
  'krds-checkbox-chip': 'checkbox-chip',
  'krds-checkbox-size': 'checkbox-size',
  'krds-coach-mark': 'coach-mark',
  'krds-contextual-help': 'contextual-help',
  'krds-critical-alerts': 'critical-alerts',
  'krds-date-input': 'date-input',
  'krds-disclosure': 'disclosure',
  'krds-favicon': 'favicon',
  'krds-file-upload': 'file-upload',
  'krds-footer': 'footer',
  'krds-header': 'header',
  'krds-help-panel': 'help-panel',
  'krds-identifier': 'identifier',
  'krds-in-page-navigation': 'in-page-navigation',
  'krds-language-switcher': 'language-switcher',
  'krds-language-switcher-page': 'language-switcher-page',
  'krds-link': 'link',
  'krds-main-menu-mobile': 'main-menu-mobile',
  'krds-main-menu-pc': 'main-menu-pc',
  'krds-masthead': 'masthead',
  'krds-modal': 'modal',
  'krds-modal-sample': 'modal-sample',
  'krds-pagination': 'pagination',
  'krds-radio-button': 'radio-button',
  'krds-radio-chip': 'radio-chip',
  'krds-radio-size': 'radio-size',
  'krds-resize': 'resize',
  'krds-select': 'select',
  'krds-select-size': 'select-size',
  'krds-select-sorting': 'select-sorting',
  'krds-select-state': 'select-state',
  'krds-side-navigation': 'side-navigation',
  'krds-skip-link': 'skip-link',
  'krds-spinner': 'spinner',
  'krds-step-indicator': 'step-indicator',
  'krds-structured-list': 'structured-list',
  'krds-structured-list-table': 'structured-list-table',
  'krds-tab': 'tab',
  'krds-table': 'table',
  'krds-tag': 'tag',
  'krds-tag-link': 'tag-link',
  'krds-textarea': 'textarea',
  'krds-text-input-icon': 'text-input-icon',
  'krds-text-input-size': 'text-input-size',
  'krds-text-input-state': 'text-input-state',
  'krds-text-list': 'text-list',
  'krds-text-list-ordered': 'text-list-ordered',
  'krds-toggle-switch': 'toggle-switch',
  'krds-toggle-switch-size': 'toggle-switch-size',
  'krds-tooltip': 'tooltip',
  'krds-tooltip-box': 'tooltip-box',
  'krds-tooltip-vertical': 'tooltip-vertical',
  'krds-tts': 'tts',
  'krds-tts-icon': 'tts-icon',
  'krds-tts-size': 'tts-size',
  'krds-tutorial-panel': 'tutorial-panel',
};

const KIND_ALIASES: Partial<Record<AngularAdditionalKind, AngularAdditionalKind>> = {
  'badge-number': 'badge',
  'badge-size': 'badge',
  'accordion-line': 'accordion',
  'button-size': 'button-hierarchy',
  'checkbox-size': 'checkbox-chip',
  'radio-size': 'radio-button',
  'carousel-banner': 'carousel',
  'calendar-range': 'calendar',
  'date-input': 'calendar',
  'language-switcher-page': 'language-switcher',
  'modal-sample': 'modal',
  'select-size': 'select',
  'select-sorting': 'select',
  'select-state': 'select',
  'structured-list-table': 'table',
  'text-input-size': 'text-input-icon',
  'text-input-state': 'text-input-icon',
  'toggle-switch-size': 'toggle-switch',
  'tooltip-box': 'tooltip',
  'tooltip-vertical': 'tooltip',
  'tts-icon': 'tts',
  'tts-size': 'tts',
  'tutorial-panel': 'help-panel',
};

@Component({
  selector:
    'krds-additional, krds-badge, krds-accordion-line, krds-badge-number, krds-badge-size, ' +
    'krds-breadcrumb, krds-button-hierarchy, krds-button-icon, krds-button-size, krds-button-text, ' +
    'krds-button-with-icon, krds-calendar, krds-calendar-range, krds-carousel, krds-carousel-banner, ' +
    'krds-checkbox-chip, krds-checkbox-size, krds-coach-mark, krds-contextual-help, krds-critical-alerts, ' +
    'krds-date-input, krds-disclosure, krds-favicon, krds-file-upload, krds-footer, krds-header, ' +
    'krds-help-panel, krds-identifier, krds-in-page-navigation, krds-language-switcher, ' +
    'krds-language-switcher-page, krds-link, krds-main-menu-mobile, krds-main-menu-pc, krds-masthead, ' +
    'krds-modal, krds-modal-sample, krds-pagination, krds-radio-button, krds-radio-chip, krds-radio-size, ' +
    'krds-resize, krds-select, krds-select-size, krds-select-sorting, krds-select-state, ' +
    'krds-side-navigation, krds-skip-link, krds-spinner, krds-step-indicator, krds-structured-list, ' +
    'krds-structured-list-table, krds-tab, krds-table, krds-tag, krds-tag-link, krds-textarea, ' +
    'krds-text-input-icon, krds-text-input-size, krds-text-input-state, krds-text-list, ' +
    'krds-text-list-ordered, krds-toggle-switch, krds-toggle-switch-size, krds-tooltip, ' +
    'krds-tooltip-box, krds-tooltip-vertical, krds-tts, krds-tts-icon, krds-tts-size, ' +
    'krds-tutorial-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KrdsAdditionalComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #projectedButtonContent><ng-content></ng-content></ng-template>
    @switch (renderKind) {
      @case ('badge') {
        <span
          [class]="
            'krds-badge ' +
            (kind === 'badge-size' && size !== 'medium' ? size + ' ' : '') +
            (appearance === 'outline'
              ? 'outline-'
              : appearance === 'light'
                ? 'bg-light-'
                : 'bg-') +
            tone +
            (renderNumber ? ' number' : '')
          "
          >{{ label }}</span
        >
      }
      @case ('breadcrumb') {
        <nav class="krds-breadcrumb-wrap" aria-label="현재 경로" [id]="id">
          <ol class="breadcrumb">
            @for (item of items; track $index) {
              <li [class.home]="$index === 0">
                <a class="txt" [href]="navHref(item)">{{ navLabel(item) }}</a>
              </li>
            }
          </ol>
        </nav>
      }
      @case ('accordion') {
        <div class="krds-accordion type-line">
          @for (item of items; track $index) {
            <div class="accordion-item">
              <h5 class="accordion-header">
                <button
                  type="button"
                  class="btn-accordion"
                  [id]="accordionHeaderId($index)"
                  [attr.aria-controls]="accordionPanelId($index)"
                  [attr.aria-expanded]="'false'"
                >
                  {{ navLabel(item) }}
                </button>
              </h5>
              <div
                class="accordion-collapse collapse"
                [id]="accordionPanelId($index)"
                [attr.aria-labelledby]="accordionHeaderId($index)"
                role="region"
              >
                <div class="accordion-body">{{ itemDescription(item) }}</div>
              </div>
            </div>
          }
        </div>
      }
      @case ('button-icon') {
        <button type="button" class="krds-btn icon" [disabled]="disabled">
          <span class="sr-only">{{ label }}</span>
          <i class="svg-icon ico-sch"></i>
        </button>
      }
      @case ('button-text') {
        <button
          type="button"
          [class]="'krds-btn text ' + (className || 'small')"
          [disabled]="disabled"
        >
          <ng-container *ngTemplateOutlet="projectedButtonContent"></ng-container>
        </button>
      }
      @case ('button-with-icon') {
        <button
          type="button"
          [class]="'krds-btn ' + (className || size)"
          [disabled]="disabled"
        >
          <ng-container *ngTemplateOutlet="projectedButtonContent"></ng-container>
          <i class="svg-icon ico-sch"></i>
        </button>
      }
      @case ('button-hierarchy') {
        <button
          [attr.type]="type"
          [class]="
            'krds-btn ' +
            (kind === 'button-size' ? size : variant || tone)
          "
          [disabled]="disabled"
        >
          <ng-container *ngTemplateOutlet="projectedButtonContent"></ng-container>
        </button>
      }
      @case ('calendar') {
        <ng-template #calendarSurface>
          <div
            [class]="additionalRootClass('krds-calendar-area')"
            [ngStyle]="style"
          >
          <div
            class="calendar-wrap bottom"
            [class.single]="isSingleCalendar"
            [attr.aria-label]="calendarLabel || null"
            tabindex="0"
          >
            <div class="calendar-head">
              <button
                type="button"
                class="btn-cal-move prev"
                (click)="moveCalendarMonth(-1)"
              >
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
                  <div
                    class="calendar-select calendar-year-wrap"
                    [class.active]="calendarYearOpen"
                  >
                    <ul
                      class="sel year"
                      [id]="id + '-calendar-year'"
                      role="listbox"
                    >
                      @for (optionYear of calendarYears; track optionYear) {
                        <li role="none">
                          <button
                            type="button"
                            role="option"
                            [class.active]="optionYear === calendarSelectedYear"
                            [attr.aria-selected]="optionYear === calendarSelectedYear"
                            [attr.disabled]="disabledYears.includes(optionYear) ? 'true' : null"
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
                  <div
                    class="calendar-select calendar-mon-wrap"
                    [class.active]="calendarMonthOpen"
                  >
                    <ul
                      class="sel month"
                      [id]="id + '-calendar-month'"
                      role="listbox"
                    >
                      @for (optionMonth of calendarMonths; track optionMonth) {
                        <li role="none">
                          <button
                            type="button"
                            [class.active]="optionMonth === calendarSelectedMonth"
                            [attr.aria-selected]="optionMonth === calendarSelectedMonth"
                            [attr.disabled]="disabledMonths.includes(optionMonth) ? 'true' : null"
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
              <button
                type="button"
                class="btn-cal-move next"
                (click)="moveCalendarMonth(1)"
              >
                <span class="sr-only">{{ nextMonthLabel }}</span>
              </button>
            </div>
            <div class="calendar-body">
              <div class="calendar-table-wrap">
                <table class="calendar-tbl">
                  <caption>
                    {{ calendarYear }}년 {{ padCalendarPart(calendarMonth) }}월
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
                              [attr.disabled]="cell.disabled ? 'true' : null"
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
        @if (isDateInput) {
          <div class="form-group" [ngStyle]="style">
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
                <ng-container [ngTemplateOutlet]="calendarSurface"></ng-container>
              </div>
            </div>
          </div>
        } @else {
          <ng-container [ngTemplateOutlet]="calendarSurface"></ng-container>
        }
      }
      @case ('carousel') {
        @if (kind === 'carousel-banner') {
          <div class="main-d-ban-swiper">
            <div class="swiper">
              <ul class="swiper-wrapper">
                @for (slide of slides; track slide.id) {
                  <li class="swiper-slide">
                    <div class="text">
                      <p class="cate">{{ slide.description }}</p>
                      <p class="tit">{{ slide.title }}</p>
                    </div>
                    <div class="im">
                      <svg
                        width="243"
                        height="178"
                        viewBox="0 0 243 178"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        [attr.aria-label]="imageLabel"
                      >
                        <rect width="243" height="178" fill="#E6E8EA"></rect>
                      </svg>
                    </div>
                  </li>
                }
              </ul>
            </div>
            <div class="swiper-indicator">
              <div class="swiper-pagination"></div>
              <div class="swiper-controller">
                <button type="button" class="swiper-button-play">
                  <span class="sr-only">{{ playLabel }}</span>
                </button>
                <button type="button" class="swiper-button-stop">
                  <span class="sr-only">{{ stopLabel }}</span>
                </button>
              </div>
              <div class="swiper-navigation">
                <button type="button" class="swiper-button-prev" (click)="previousSlide()">
                  <span class="sr-only">{{ previousLabel }}</span>
                </button>
                <button type="button" class="swiper-button-next" (click)="nextSlide()">
                  <span class="sr-only">{{ nextLabel }}</span>
                </button>
                <a href="#" class="swiper-button-more">
                  <span class="sr-only">{{ moreLabel }}</span>
                </a>
              </div>
            </div>
          </div>
        } @else {
          <div class="main-vban-wrap bg">
            <div class="inner">
              <div class="vb-swiper">
                <div class="swiper">
                  <ul class="swiper-wrapper">
                    @for (slide of slides; track slide.id) {
                      <li class="swiper-slide">
                        <div class="in">
                          <div class="text">
                            <p class="tit">{{ slide.title }} <br class="w-hide" />{{ slide.title }}</p>
                            <p class="txt">
                              {{ slide.description }} <br class="w-hide" />{{ slide.description }}
                            </p>
                            <a [href]="slide.href || '#'" class="krds-btn primary">{{
                              actionLabel
                            }}</a>
                          </div>
                          <div class="im">
                            <svg
                              width="243"
                              height="178"
                              viewBox="0 0 243 178"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              [attr.aria-label]="imageLabel"
                            >
                              <rect width="243" height="178" fill="#E6E8EA"></rect>
                            </svg>
                          </div>
                        </div>
                      </li>
                    }
                  </ul>
                </div>
                <button type="button" class="swiper-button-prev" (click)="previousSlide()">
                  <span class="sr-only">{{ previousLabel }}</span>
                </button>
                <button type="button" class="swiper-button-next" (click)="nextSlide()">
                  <span class="sr-only">{{ nextLabel }}</span>
                </button>
                <div class="swiper-indicator text-center">
                  <div class="swiper-pagination"></div>
                  <a href="#" class="swiper-button-more">
                    <span class="sr-only">{{ moreLabel }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      }
      @case ('checkbox-chip') {
        @if (kind === 'checkbox-size') {
          <div [class]="'krds-form-check ' + size">
            <input
              [id]="id"
              type="checkbox"
              [checked]="checked"
              [disabled]="disabled"
              (change)="setChecked(checkedValue($event))"
              (blur)="touch()"
            />
            <label [for]="id">{{ label }}</label>
          </div>
        } @else {
          <div class="krds-form-chip">
            <input
              class="checkbox"
              [id]="id"
              type="checkbox"
              [checked]="checked"
              [disabled]="disabled"
              (change)="setChecked(checkedValue($event))"
              (blur)="touch()"
            />
            <label class="krds-form-chip-outline" [for]="id">{{ label }}</label>
          </div>
        }
      }
      @case ('radio-chip') {
        <div class="krds-form-chip">
          <input
            class="radio"
            [id]="id"
            type="radio"
            [attr.name]="name || null"
            [attr.value]="value || null"
            [checked]="checked || (value !== '' && selected === value)"
            [disabled]="disabled"
            (change)="setSelected(value || 'on')"
            (blur)="touch()"
          />
          <label class="krds-form-chip-outline" [for]="id">{{ label }}</label>
        </div>
      }
      @case ('coach-mark') {
        <div class="txt-box bg-white bg-white krds-coach-mark">
          <div class="coach-balloon">
            <h5 class="sr-only">{{ title }}</h5>
            <h6 class="coach-tit">{{ stepTitle }}</h6>
            <p class="desc">{{ description }}</p>
            <div class="coach-controls">
              <div class="num">
                <span class="sr-only">{{ currentStepLabel }}</span>
                <strong>{{ currentStep }}</strong>
                <span class="sr-only">{{ totalStepsLabel }}</span>
                <span>{{ totalSteps }}</span>
              </div>
              <div class="btn-wrap">
                <button type="button" class="krds-btn small text">{{ stopLabel }}</button>
                <button type="button" class="krds-btn small tertiary">{{ nextLabel }}</button>
              </div>
            </div>
          </div>
          <div><h3>{{ contentTitle }}</h3></div>
        </div>
      }
      @case ('contextual-help') {
        <div [class]="contextualHelpClass">
          <p class="tooltip-txt">{{ caption }}</p>
          <div class="tooltip-action">
            <button
              type="button"
              class="krds-btn medium icon tooltip-btn"
              [attr.aria-expanded]="contextualHelpFocused ? null : 'false'"
              (focus)="contextualHelpFocused = true"
            >
              <span class="sr-only">{{ label }}</span>
              <i class="svg-icon ico-tooltip"></i>
            </button>
            <div class="tooltip-popover" role="tooltip">
              <h4 class="tooltip-title">{{ title }}</h4>
              <div class="tooltip-contents">
                <p>{{ description }}</p>
                <div class="btn-wrap">
                  <a [href]="href" class="krds-btn xsmall link basic">
                    {{ linkLabel }} <i class="svg-icon ico-angle right"></i>
                  </a>
                </div>
              </div>
              <button type="button" class="krds-btn xsmall icon tooltip-close">
                <span class="sr-only">{{ closeLabel }}</span>
                <i class="svg-icon ico-modal-close"></i>
              </button>
            </div>
          </div>
        </div>
      }
      @case ('critical-alerts') {
        <ul class="krds-critical-alerts" role="alert">
          @for (item of items; track $index) {
            <li>
              <div class="critical-ban">
                <span [class]="'critical-badge ' + criticalTone(item)">
                  {{ criticalLabel(item) }}
                </span>
                <p class="critical-txt">{{ navLabel(item) }}</p>
                <a [href]="navHref(item)" class="krds-btn medium link basic">
                  <span class="m-hide">{{ itemLinkLabel(item) }}</span>
                  <i class="svg-icon ico-angle right"></i>
                </a>
              </div>
            </li>
          }
        </ul>
      }
      @case ('disclosure') {
        <div class="krds-disclosure conts-expand-area">
          <button
            [id]="id + '-trigger'"
            type="button"
            class="btn-conts-expand"
            [attr.aria-controls]="id + '-contents'"
            [attr.aria-expanded]="open"
            (click)="open = !open"
          >
            {{ title }}
          </button>
          <div
            class="expand-wrap"
            [class.show]="open"
            [id]="id + '-contents'"
            [attr.aria-labelledby]="id + '-trigger'"
            role="region"
            [attr.inert]="!open ? '' : null"
          >
            <div class="expand-in">
              <ul class="krds-info-list dash" role="list">
                @for (item of items; track $index) {
                  <li role="listitem">
                    {{ navLabel(item) }}
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      }
      @case ('favicon') {
        <link
          rel="icon"
          [href]="safeFaviconHref(href)"
          [attr.sizes]="sizes || null"
          [attr.type]="type"
        />
      }
      @case ('file-upload') {
        <div class="krds-file-upload line">
          <div class="file-head">
            <h3 class="tit">{{ title }}</h3>
            <div><p>{{ description }}</p></div>
          </div>
          <div class="file-upload">
            <p class="txt">{{ prompt }}</p>
            <div class="file-upload-btn-wrap">
              <input
                type="file"
                [name]="name"
                [id]="inputId"
                hidden
              />
              <label [for]="inputId">
                <button type="button" class="krds-btn medium">
                  <i class="svg-icon ico-upload"></i>{{ selectLabel }}
                </button>
              </label>
            </div>
          </div>
          <div class="file-list">
            <div class="total">
              <span class="current">{{ currentCount }}{{ countSuffix }}</span> /
              {{ maxCount }}{{ countSuffix }}
            </div>
            <ul class="upload-list">
              @for (file of files; track file.id) {
                <li [class.is-error]="file.status === 'error'">
                  <div class="file-info" [class.m-column]="file.status === 'downloadable'">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="btn-wrap">
                      @if (file.status === 'uploading') {
                        <span class="krds-spinner" role="status">
                          <span class="sr-only">{{ file.statusLabel }}</span>
                        </span>
                      } @else if (file.status === 'complete') {
                        <span class="ico-invalid complete">
                          <em class="sr-only">{{ file.statusLabel }}</em>
                        </span>
                      } @else if (file.status === 'deletable') {
                        <button type="button" class="krds-btn medium text">
                          {{ file.deleteLabel }} <i class="svg-icon ico-delete-fill"></i>
                        </button>
                      } @else if (file.status === 'error') {
                        <button type="button" class="krds-btn medium text">
                          {{ file.deleteLabel }} <i class="svg-icon ico-delete-fill"></i>
                        </button>
                      } @else if (file.status === 'downloadable') {
                        <button type="button" class="krds-btn medium text">
                          {{ file.downloadLabel }} <i class="svg-icon ico-down"></i>
                        </button>
                        <button type="button" class="krds-btn medium text">
                          {{ file.previewLabel }} <i class="svg-icon ico-angle right"></i>
                        </button>
                      }
                    </div>
                  </div>
                  @if (file.errors?.length) {
                    <p class="file-hint-invalid">
                      @for (error of file.errors; track $index) {
                        {{ error }}@if (!$last) {<br />}
                      }
                    </p>
                  }
                </li>
              }
            </ul>
            <div class="upload-delete-btn">
              <button type="button" class="krds-btn xsmall tertiary">
                {{ deleteAllLabel }}<i class="svg-icon ico-angle right"></i>
              </button>
            </div>
          </div>
        </div>
      }
      @case ('footer') {
        <footer id="krds-footer">
          <div class="foot-quick">
            <div class="inner">
              @for (site of relatedSites; track site.id) {
                <button type="button" class="link" [attr.title]="site.title">
                  {{ site.label }}
                </button>
              }
            </div>
          </div>
          <div class="inner">
            <div class="f-logo"><span class="sr-only">{{ logoLabel }}</span></div>
            <div class="f-cnt">
              <div class="f-info">
                <p class="info-addr">{{ address }}</p>
                <ul class="info-cs">
                  @for (contact of contacts; track $index) {
                    <li>
                      <strong class="strong">{{ contact.title }}</strong
                      ><span class="span">{{ contact.description }}</span>
                    </li>
                  }
                </ul>
              </div>
              <div class="f-link">
                <div class="link-go">
                  @for (item of links; track $index) {
                    <a [href]="item.href || '#'" class="krds-btn medium text">
                      {{ item.label }} <i class="svg-icon ico-angle right"></i>
                    </a>
                  }
                </div>
                <div class="link-sns">
                  @for (item of socialLinks; track $index) {
                    <a
                      [href]="item.href"
                      class="krds-btn xlarge icon border"
                      [attr.target]="item.target || null"
                      [attr.title]="item.title || null"
                    >
                      <span class="sr-only">{{ item.label }}</span>
                      <i [class]="'svg-icon ico-' + item.icon"></i>
                    </a>
                  }
                </div>
              </div>
            </div>
            <div class="f-btm">
              <div class="f-btm-text">
                <div class="f-menu">
                  @for (item of policyLinks; track $index) {
                    <a [href]="item.href" [class.point]="item.emphasis">{{ item.label }}</a>
                  }
                </div>
                <p class="f-copy">{{ copyright }}</p>
              </div>
              <div class="krds-identifier">
                <span class="logo"><span class="sr-only">{{ organization }}</span></span>
                <span class="ban-txt">{{ description }}</span>
              </div>
            </div>
          </div>
        </footer>
      }
      @case ('header') {
        <header
          [id]="id.startsWith('krds-additional') ? 'krds-header' : id"
          [class]="additionalRootClass('krds-header')"
          [ngStyle]="style"
        >
          <div class="header-in">
            <div class="header-container">
              <div class="inner">
                <div class="header-utility">
                  <ul class="utility-list">
                    @for (item of utilityItems; track item.id) {
                      <li>
                        @if (item.kind === 'link') {
                          <a
                            [href]="item.href || '#'"
                            class="krds-btn small text"
                            [attr.target]="item.target || null"
                            [attr.title]="item.title || null"
                          >
                            {{ item.label }} <i class="svg-icon ico-go"></i>
                          </a>
                        } @else {
                          <div
                            class="krds-drop-wrap"
                            [class.krds-resize]="item.kind === 'resize'"
                          >
                            <button type="button" class="krds-btn small text drop-btn">
                              {{ item.label }} <i class="svg-icon ico-toggle"></i>
                            </button>
                            <div class="drop-menu">
                              <div class="drop-in">
                                <ul class="drop-list">
                                  @for (dropItem of item.items || []; track dropItem.id) {
                                    <li>
                                      @if (item.kind === 'resize') {
                                        <button
                                          type="button"
                                          [class]="
                                            'item-link' +
                                            (dropItem.className ? ' ' + dropItem.className : '')
                                          "
                                          [class.active]="dropItem.selected"
                                        >
                                          {{ dropItem.label }}
                                          @if (dropItem.selected) {
                                            <span class="sr-only">{{ item.selectedLabel }}</span>
                                          }
                                        </button>
                                      } @else {
                                        <a
                                          [href]="dropItem.href || '#'"
                                          [class]="
                                            'item-link' +
                                            (dropItem.className ? ' ' + dropItem.className : '')
                                          "
                                          [attr.target]="dropItem.target || null"
                                          [attr.title]="dropItem.title || null"
                                        >
                                          {{ dropItem.label }}
                                        </a>
                                      }
                                    </li>
                                  }
                                </ul>
                                @if (item.kind === 'resize') {
                                  <div class="drop-bottom">
                                    <button type="button" class="krds-btn medium text">
                                      <i class="svg-icon ico-reset"></i> {{ item.resetLabel }}
                                    </button>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        }
                      </li>
                    }
                  </ul>
                </div>
                <div class="header-branding">
                  <h2 class="logo">
                    <a [href]="logoHref">
                      <span class="sr-only">{{ logoLabel }}</span>
                    </a>
                  </h2>
                  <div class="header-actions">
                    <button type="button" class="btn-navi sch" [attr.title]="searchTitle || null">
                      {{ searchLabel }}
                    </button>
                    <a [href]="loginHref" class="btn-navi login">{{ loginLabel }}</a>
                    <button type="button" class="btn-navi join">{{ joinLabel }}</button>
                    @if (myMenu) {
                      <div class="krds-drop-wrap my-drop">
                        <button type="button" class="btn-navi my drop-btn">{{ myMenu.label }}</button>
                        <div class="drop-menu">
                          <div class="drop-in">
                            <div class="drop-top">
                              <p class="my-name">{{ myMenu.userName }}</p>
                              <dl class="my-time">
                                <dt>{{ myMenu.timeLabel }}</dt>
                                <dd>
                                  <span class="time">{{ myMenu.time }}</span>
                                  <button type="button" class="krds-btn medium text">
                                    {{ myMenu.extendLabel }}
                                  </button>
                                </dd>
                              </dl>
                            </div>
                            <ul class="drop-list">
                              @for (item of myMenu.items; track item.id) {
                                <li>
                                  <a [href]="item.href || '#'" class="item-link">
                                    {{ item.label }}
                                  </a>
                                </li>
                              }
                            </ul>
                            <div class="drop-bottom">
                              <button type="button" class="krds-btn medium text">
                                <i class="svg-icon ico-logout"></i> {{ myMenu.logoutLabel }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    <button
                      type="button"
                      class="btn-navi all"
                      [attr.aria-controls]="headerMobileId"
                    >
                      {{ allMenuLabel }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <nav class="krds-main-menu" [attr.aria-label]="menuLabel || null">
              <div class="inner">
                <ul class="gnb-menu">
                  @for (item of headerDesktopItems; track item.id) {
                    <li>
                      @if (item.href) {
                        <a
                          [href]="item.href"
                          class="gnb-main-trigger is-link"
                          data-trigger="gnb"
                          [class.external-link]="!!item.target"
                          [attr.target]="item.target || null"
                          [attr.title]="item.title || null"
                        >
                          {{ item.label }}
                        </a>
                      } @else if (item.button) {
                        <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                          {{ item.label }}
                        </button>
                      } @else {
                        <button
                          type="button"
                          class="gnb-main-trigger"
                          [class.active]="item.active"
                          data-trigger="gnb"
                        >
                          {{ item.label }}
                        </button>
                        <div class="gnb-toggle-wrap" [class.is-open]="item.active">
                          <div
                            class="gnb-main-list"
                            [attr.data-has-submenu]="isSingleDesktopMenu(item) ? null : 'true'"
                          >
                            @if (isSingleDesktopMenu(item)) {
                              <div class="gnb-sub-list single-list between">
                                <div class="gnb-sub-content">
                                  <h2 class="sub-title"><span>{{ item.title }}</span></h2>
                                  <ul>
                                    @for (leaf of item.children || []; track leaf.id) {
                                      <li>
                                        @if (leaf.href) {
                                          <a [href]="leaf.href">{{ leaf.label }}</a>
                                        } @else {
                                          <button type="button">{{ leaf.label }}</button>
                                        }
                                      </li>
                                    }
                                  </ul>
                                </div>
                                @if (item.banner) {
                                  <div class="gnb-sub-banner">
                                    <span class="krds-badge bg-secondary">
                                      {{ item.banner.badge }}
                                    </span>
                                    <button type="button" class="krds-btn medium text">
                                      {{ item.banner.label }}
                                      <i class="svg-icon ico-angle right"></i>
                                    </button>
                                  </div>
                                }
                              </div>
                            } @else {
                              <ul>
                                @for (
                                  child of item.children || [];
                                  track child.id;
                                  let childIndex = $index
                                ) {
                                  <li>
                                    @if (child.href) {
                                      <a
                                        [href]="child.href"
                                        class="gnb-sub-trigger is-link"
                                        [class.external-link]="!!child.target"
                                        data-trigger="gnb"
                                        [attr.target]="child.target || null"
                                        [attr.title]="child.title || null"
                                      >
                                        {{ child.label }}
                                      </a>
                                    } @else {
                                      <button
                                        type="button"
                                        class="gnb-sub-trigger"
                                        [class.active]="child.active"
                                        data-trigger="gnb"
                                      >
                                        {{ child.label }}
                                      </button>
                                      <div
                                        class="gnb-sub-list"
                                        [class.active]="child.active"
                                        [class.between]="!child.active && childIndex > 0"
                                      >
                                        <div class="gnb-sub-content">
                                          <h2 class="sub-title">
                                            @if (child.titleHref) {
                                              {{ child.title }}
                                              <a
                                                [href]="child.titleHref"
                                                class="krds-btn link basic small"
                                              >
                                                <span class="underline">
                                                  {{ child.titleLinkLabel }}
                                                </span>
                                                <i class="svg-icon ico-angle right"></i>
                                              </a>
                                            } @else {
                                              <span>{{ child.title }}</span>
                                            }
                                          </h2>
                                          @if (child.descriptionItems?.length) {
                                            <ul class="type-description">
                                              @for (
                                                descriptionItem of child.descriptionItems || [];
                                                track $index
                                              ) {
                                                <li>
                                                  <h3 class="tit">
                                                    <a
                                                      [href]="descriptionItem.href"
                                                      [attr.target]="descriptionItem.target || null"
                                                      [attr.title]="
                                                        descriptionItem.externalTitle || null
                                                      "
                                                    >
                                                      {{ descriptionItem.title }}
                                                      <i class="svg-icon ico-go"></i>
                                                    </a>
                                                  </h3>
                                                  <p class="txt">
                                                    {{ descriptionItem.description }}
                                                  </p>
                                                </li>
                                              }
                                            </ul>
                                          } @else {
                                            <ul>
                                              @for (leaf of child.children || []; track leaf.id) {
                                                <li>
                                                  @if (leaf.href) {
                                                    <a [href]="leaf.href">{{ leaf.label }}</a>
                                                  } @else {
                                                    <button type="button">{{ leaf.label }}</button>
                                                  }
                                                </li>
                                              }
                                            </ul>
                                          }
                                        </div>
                                        @if (child.banner) {
                                          <div class="gnb-sub-banner">
                                            <span class="krds-badge bg-secondary">
                                              {{ child.banner.badge }}
                                            </span>
                                            <button type="button" class="krds-btn medium text">
                                              {{ child.banner.label }}
                                              <i class="svg-icon ico-angle right"></i>
                                            </button>
                                          </div>
                                        }
                                      </div>
                                    }
                                  </li>
                                }
                              </ul>
                            }
                          </div>
                        </div>
                      }
                    </li>
                  }
                </ul>
              </div>
            </nav>
          </div>
          @if (mobileMenu) {
            <div [id]="headerMobileId" class="krds-main-menu-mobile">
              <div class="gnb-wrap">
                <div class="gnb-header">
                  <div class="gnb-utils">
                    <ul class="utility-list">
                      @for (item of mobileMenu.utilityItems; track item.id) {
                        <li>
                          <button type="button" class="krds-btn xsmall text">
                            {{ item.label }}
                          </button>
                        </li>
                      }
                    </ul>
                  </div>
                  <div class="gnb-login">
                    <button type="button" class="krds-btn large text">
                      <i class="svg-icon ico-log"></i> {{ mobileMenu.loginLabel }}
                    </button>
                  </div>
                  <div class="gnb-service-menu">
                    @for (item of mobileMenu.serviceItems; track item.id) {
                      <a [href]="item.href || '#'" class="link">{{ item.label }}</a>
                    }
                  </div>
                  <div class="sch-input">
                    <input
                      type="text"
                      class="krds-input"
                      [placeholder]="mobileMenu.searchPlaceholder"
                      [attr.title]="mobileMenu.searchTitle || null"
                    />
                    <button type="button" class="krds-btn medium icon ico-search">
                      <span class="sr-only">{{ mobileMenu.searchLabel }}</span>
                      <i class="svg-icon ico-sch"></i>
                    </button>
                  </div>
                </div>
                <div class="gnb-body">
                  <div class="gnb-menu">
                    <div class="menu-wrap">
                      <ul>
                        @for (item of mobileMenu.items; track item.id) {
                          <li>
                            <a [href]="item.href || '#'" class="gnb-main-trigger">
                              {{ item.label }}
                            </a>
                          </li>
                        }
                      </ul>
                    </div>
                    <div class="submenu-wrap">
                      @for (item of mobileMenu.items; track item.id) {
                        <div class="gnb-sub-list" [id]="mobileMenuId(item)">
                          <h2 class="sub-title">{{ item.label }}</h2>
                          <ul>
                            @for (child of item.children || []; track child.id) {
                              <li>
                                <a
                                  [href]="child.href || '#'"
                                  class="gnb-sub-trigger"
                                  [class.has-depth3]="!!child.children?.length"
                                >
                                  {{ child.label }}
                                </a>
                                @if (child.children?.length) {
                                  <div class="depth3-wrap">
                                    <ul>
                                      @for (depth3 of child.children || []; track depth3.id) {
                                        <li>
                                          <a
                                            [href]="depth3.href || '#'"
                                            class="depth3-trigger"
                                            [class.has-depth4]="!!depth3.children?.length"
                                          >
                                            {{ depth3.label }}
                                          </a>
                                          @if (depth3.children?.length) {
                                            <div class="depth4-wrap">
                                              <div class="depth4-head">
                                                <button
                                                  type="button"
                                                  class="krds-btn icon trigger-prev"
                                                >
                                                  <span class="sr-only">
                                                    {{ mobileMenu.previousLabel }}
                                                  </span>
                                                  <i class="svg-icon ico-angle left"></i>
                                                </button>
                                                <button
                                                  type="button"
                                                  class="krds-btn icon trigger-close"
                                                >
                                                  <span class="sr-only">
                                                    {{ mobileMenu.closeLabel }}
                                                  </span>
                                                  <i class="svg-icon ico-popup-close"></i>
                                                </button>
                                              </div>
                                              <ul class="depth4-body">
                                                <h4 class="sub-title">{{ depth3.title }}</h4>
                                                <ul class="depth4-ul">
                                                  @for (
                                                    depth4 of depth3.children || [];
                                                    track depth4.id
                                                  ) {
                                                    <li>
                                                      <a [href]="depth4.href || '#'">
                                                        {{ depth4.label }}
                                                      </a>
                                                    </li>
                                                  }
                                                </ul>
                                              </ul>
                                            </div>
                                          }
                                        </li>
                                      }
                                    </ul>
                                  </div>
                                }
                              </li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                  <div class="gnb-bottom">
                    @for (item of mobileMenu.bottomItems; track $index) {
                      <a
                        [href]="item.href || '#'"
                        class="krds-btn medium text"
                        [attr.target]="item.target || null"
                        [attr.title]="item.title || null"
                      >
                        {{ item.label }}
                        <i
                          [class]="
                            'svg-icon ' + (item.target ? 'ico-go' : 'ico-angle right')
                          "
                        ></i>
                      </a>
                    }
                  </div>
                </div>
                <button
                  type="button"
                  class="krds-btn medium icon"
                  [id]="id + '-close-nav'"
                >
                  <span class="sr-only">{{ mobileMenu.closeLabel }}</span>
                  <i class="svg-icon ico-popup-close"></i>
                </button>
              </div>
            </div>
          }
        </header>
      }
      @case ('help-panel') {
        <div
          [class]="'krds-help-panel' + (open && !helpPanelFocused ? ' expand' : '')"
        >
          <div
            class="help-panel-wrap"
            [attr.tabindex]="helpPanelFocused ? null : '0'"
            (focus)="helpPanelFocused = true"
          >
            <div class="help-conts-area">
              <div class="krds-tab-area layer">
                <div class="tab line">
                  <ul role="tablist">
                    @for (tab of tabs; track tab.id) {
                      <li [class.active]="helpTabValue(tab) === activeTab">
                        <button
                          [id]="tab.id"
                          type="button"
                          class="btn-tab"
                          role="tab"
                          [attr.aria-selected]="
                            helpPanelFocused ? helpTabValue(tab) === activeTab : false
                          "
                          [attr.aria-controls]="helpTabPanelId(tab)"
                          [attr.data-listener-attached]="helpPanelFocused ? null : 'true'"
                          (focus)="helpPanelFocused = true"
                          (click)="activeTab = helpTabValue(tab)"
                        >
                          {{ tab.label }}
                          @if (helpTabValue(tab) === activeTab) {
                            <i class="sr-only created"> {{ selectedLabel }}</i>
                          }
                        </button>
                      </li>
                    }
                  </ul>
                </div>
                <div class="tab-conts-wrap">
                  @if (tabs[0]) {
                    <section
                      [id]="helpTabPanelId(tabs[0])"
                      role="tabpanel"
                      [attr.aria-labelledby]="tabs[0].id"
                      class="tab-conts"
                      [class.active]="helpTabValue(tabs[0]) === activeTab"
                    >
                      <h3 class="sr-only">{{ tabs[0].label }}</h3>
                      <div class="help-conts-area-inner">
                        <div class="conts-area help-conts">
                          <div class="conts-wrap">
                            <h4 class="help-title">
                              {{ helpTitle }}
                              <span class="krds-btn medium icon">
                                <span class="sr-only">{{ label }}</span>
                                <i class="svg-icon ico-help"></i>
                              </span>
                            </h4>
                            <div class="conts-desc"><p>{{ helpDescription }}</p></div>
                            <ul class="link-list">
                              @for (link of downloadLinks; track $index) {
                                <li>
                                  <a
                                    [href]="link.href"
                                    [attr.target]="link.target || null"
                                    [attr.title]="link.title || null"
                                    class="krds-btn xsmall link basic"
                                  >
                                    {{ link.label }}
                                    <i class="svg-icon ico-go"></i>
                                  </a>
                                </li>
                              }
                            </ul>
                          </div>
                        </div>
                        <div class="conts-area related-service">
                          @for (group of relatedGroups; track $index) {
                            <div class="conts-wrap">
                              <h4 class="help-title">{{ group.title }}</h4>
                              <ul class="link-list">
                                @for (link of group.links; track $index) {
                                  <li>
                                    <a [href]="link.href" class="krds-btn xsmall link basic">
                                      @if (link.icon) {
                                        <i [class]="'svg-icon ico-' + link.icon"></i>
                                      }
                                      {{ link.label }}
                                      @if (!link.icon) {
                                        <i class="svg-icon ico-angle right"></i>
                                      }
                                    </a>
                                  </li>
                                }
                              </ul>
                            </div>
                          }
                        </div>
                      </div>
                    </section>
                  }
                  @if (tabs[1]) {
                    <section
                      [id]="helpTabPanelId(tabs[1])"
                      role="tabpanel"
                      [attr.aria-labelledby]="tabs[1].id"
                      class="tab-conts"
                      [class.active]="helpTabValue(tabs[1]) === activeTab"
                    >
                      <h3 class="sr-only">{{ tabs[1].label }}</h3>
                      <div class="help-conts-area-inner">
                        <div class="conts-area">
                          <h4 class="help-title">
                            <a href="#;" [attr.title]="tutorialBackTitle">{{ tutorialTitle }}</a>
                          </h4>
                          <ul class="coach-help-process">
                            @for (task of tasks; track $index) {
                              <li>
                                <h4 class="tit" [class.current]="task.current">{{ task.title }}</h4>
                                <div class="krds-disclosure conts-expand-area">
                                  <button type="button" class="btn-conts-expand">
                                    {{ task.summary }}
                                  </button>
                                  <div class="expand-wrap">
                                    <div class="expand-in">
                                      <ul class="krds-info-list decimal">
                                        @for (step of task.steps; track $index) {
                                          <li>{{ step }}</li>
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            }
                          </ul>
                        </div>
                        <div class="help-panel-action">
                          <button type="button" class="krds-btn medium secondary coach-btn-stop">
                            {{ stopLabel }}
                          </button>
                        </div>
                      </div>
                    </section>
                  }
                </div>
              </div>
              <button
                type="button"
                class="krds-btn small tertiary btn-help-panel fold"
                (click)="open = false"
              >
                <span class="sr-only">{{ label }}</span> {{ collapseLabel }}
                <i class="svg-icon ico-angle right"></i>
              </button>
            </div>
          </div>
        </div>
      }
      @case ('identifier') {
        <div class="krds-identifier">
          <span class="logo">
            <span class="sr-only">KRDS - Korea Design System</span>
          </span>
          <span class="ban-txt">{{ description || organization }}</span>
        </div>
      }
      @case ('in-page-navigation') {
        <div class="krds-in-page-navigation-area">
          <div class="in-page-navigation-header">
            <p class="quick-caption">{{ title }}</p>
            <p class="quick-title">{{ pageTitle }}</p>
          </div>
          <nav class="in-page-navigation-list">
            <ul>
              @for (item of items; track $index) {
                <li>
                  <a [href]="navHref(item)" [class.active]="$index === 0">
                    {{ navLabel(item) }}
                  </a>
                </li>
              }
            </ul>
          </nav>
          <div class="in-page-navigation-action">
            <button type="button" class="krds-btn medium">{{ actionLabel }}</button>
            @if (actionInfo || actionCount) {
              <p class="quick-info">{{ actionInfo }} <strong>{{ actionCount }}</strong></p>
            }
          </div>
        </div>
      }
      @case ('language-switcher') {
        <div class="krds-drop-wrap krds-language">
          <button
            type="button"
            class="krds-btn small text drop-btn"
            [attr.aria-expanded]="languageFocused ? null : 'false'"
            (focus)="languageFocused = true"
          >
            <i class="svg-icon ico-global"></i>
            {{ label }}
            <i class="svg-icon ico-toggle"></i>
          </button>
          <div class="drop-menu">
            <div class="drop-in">
              @if (kind === 'language-switcher-page') {
                <div class="drop-top">
                  <p class="current-laguage">
                    <span>{{ currentLabel }}</span>
                    <strong>{{ selectedOptionLabel }}</strong>
                  </p>
                </div>
              }
              <ul class="drop-list">
                @for (option of visibleLanguageOptions; track $index) {
                  <li>
                    <a
                      href="#"
                      class="item-link"
                      [class.active]="kind === 'language-switcher' && option.value === selected"
                      [attr.lang]="option.value"
                      [attr.target]="kind === 'language-switcher-page' ? '_blank' : null"
                      [attr.title]="kind === 'language-switcher-page' ? externalTitle : null"
                    >
                      {{ option.label }}
                      @if (kind === 'language-switcher-page') {
                        <i class="svg-icon ico-go"></i>
                      }
                      @if (!languageFocused) {
                        <span class="sr-only">{{
                          kind === 'language-switcher' && option.value === selected ? selectedLabel : ''
                        }}</span>
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      }
      @case ('link') {
        <a [href]="href" class="krds-btn small link" [attr.target]="target" [attr.title]="title">
          <span class="underline">{{ label }}</span>
          <i class="svg-icon ico-go"></i>
        </a>
      }
      @case ('main-menu-mobile') {
        <div
          id="mobile-nav"
          [class]="additionalRootClass('krds-main-menu-mobile')"
          role="navigation"
          [ngStyle]="style"
        >
          <div class="gnb-wrap">
            <div class="gnb-header">
              <div class="gnb-utils">
                <ul class="utility-list">
                  @for (item of utilityItems; track item.id) {
                    <li>
                      <button type="button" class="krds-btn xsmall text">{{ item.label }}</button>
                    </li>
                  }
                </ul>
              </div>
              <div class="gnb-login">
                <button type="button" class="krds-btn large text">
                  <i class="svg-icon ico-log"></i> {{ loginLabel }}
                </button>
              </div>
              <div class="gnb-service-menu">
                @for (item of serviceItems; track item.id) {
                  <a [href]="item.href || '#'" class="link">{{ item.label }}</a>
                }
              </div>
              <div class="sch-input">
                <input
                  type="text"
                  class="krds-input"
                  [placeholder]="searchPlaceholder"
                  [attr.title]="searchTitle"
                />
                <button type="button" class="krds-btn medium icon ico-search">
                  <span class="sr-only">{{ searchLabel }}</span>
                  <i class="svg-icon ico-sch"></i>
                </button>
              </div>
            </div>
            <div class="gnb-body">
              <div class="gnb-menu">
                <div class="menu-wrap">
                  <ul>
                    @for (item of menuItems; track item.id) {
                      <li>
                        <a [href]="item.href || '#'" class="gnb-main-trigger">{{ item.label }}</a>
                      </li>
                    }
                  </ul>
                </div>
                <div class="submenu-wrap">
                  @for (item of menuItems; track item.id) {
                    <div class="gnb-sub-list" [id]="mobileMenuId(item)">
                      <h2 class="sub-title">{{ item.label }}</h2>
                      <ul>
                        @for (child of item.children || []; track child.id) {
                          <li>
                            <a
                              [href]="child.href || '#'"
                              class="gnb-sub-trigger"
                              [class.has-depth3]="!!child.children?.length"
                            >
                              {{ child.label }}
                            </a>
                            @if (child.children?.length) {
                              <div class="depth3-wrap">
                                <ul>
                                  @for (depth3 of child.children || []; track depth3.id) {
                                    <li>
                                      <a
                                        [href]="depth3.href || '#'"
                                        class="depth3-trigger"
                                        [class.has-depth4]="!!depth3.children?.length"
                                      >
                                        {{ depth3.label }}
                                      </a>
                                      @if (depth3.children?.length) {
                                        <div class="depth4-wrap">
                                          <div class="depth4-head">
                                            <button type="button" class="krds-btn icon trigger-prev">
                                              <span class="sr-only">{{ previousLabel }}</span>
                                              <i class="svg-icon ico-angle left"></i>
                                            </button>
                                            <button type="button" class="krds-btn icon trigger-close">
                                              <span class="sr-only">{{ closeLabel }}</span>
                                              <i class="svg-icon ico-popup-close"></i>
                                            </button>
                                          </div>
                                          <ul class="depth4-body">
                                            <h4 class="sub-title">{{ depth3.title }}</h4>
                                            <ul class="depth4-ul">
                                              @for (depth4 of depth3.children || []; track depth4.id) {
                                                <li>
                                                  <a [href]="depth4.href || '#'">{{ depth4.label }}</a>
                                                </li>
                                              }
                                            </ul>
                                          </ul>
                                        </div>
                                      }
                                    </li>
                                  }
                                </ul>
                              </div>
                            }
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              </div>
              <div class="gnb-bottom">
                @for (item of bottomItems; track $index) {
                  <a
                    [href]="item.href || '#'"
                    class="krds-btn small text"
                    [attr.target]="item.target || null"
                    [attr.title]="item.title || null"
                  >
                    {{ item.label }}
                    <i
                      [class]="
                        'svg-icon ' + (item.target ? 'ico-go' : 'ico-angle right')
                      "
                    ></i>
                  </a>
                }
              </div>
            </div>
            <button type="button" class="krds-btn medium icon" id="close-nav">
              <span class="sr-only">{{ closeLabel }}</span>
              <i class="svg-icon ico-popup-close"></i>
            </button>
          </div>
        </div>
      }
      @case ('main-menu-pc') {
        <nav
          [class]="additionalRootClass('krds-main-menu')"
        >
          <div class="inner">
            <ul class="gnb-menu">
              @for (item of menuItems; track item.id) {
                <li>
                  @if (item.href) {
                    <a
                      [href]="item.href"
                      class="gnb-main-trigger is-link"
                      data-trigger="gnb"
                      [class.external-link]="!!item.target"
                      [attr.target]="item.target || null"
                      [attr.title]="item.title || null"
                    >
                      {{ item.label }}
                    </a>
                  } @else if (item.button) {
                    <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                      {{ item.label }}
                    </button>
                  } @else {
                    <button
                      type="button"
                      class="gnb-main-trigger"
                      [class.active]="item.active"
                      data-trigger="gnb"
                    >
                      {{ item.label }}
                    </button>
                    <div class="gnb-toggle-wrap" [class.is-open]="item.active">
                      <div
                        class="gnb-main-list"
                        [attr.data-has-submenu]="isSingleDesktopMenu(item) ? null : 'true'"
                      >
                        @if (isSingleDesktopMenu(item)) {
                          <div class="gnb-sub-list single-list between">
                            <div class="gnb-sub-content">
                              <h2 class="sub-title"><span>{{ item.title }}</span></h2>
                              <ul>
                                @for (leaf of item.children || []; track leaf.id) {
                                  <li>
                                    @if (leaf.href) {
                                      <a [href]="leaf.href">{{ leaf.label }}</a>
                                    } @else {
                                      <button type="button">{{ leaf.label }}</button>
                                    }
                                  </li>
                                }
                              </ul>
                            </div>
                            @if (item.banner) {
                              <div class="gnb-sub-banner">
                                <span class="krds-badge bg-secondary">{{ item.banner.badge }}</span>
                                <button type="button" class="krds-btn medium text">
                                  {{ item.banner.label }} <i class="svg-icon ico-angle right"></i>
                                </button>
                              </div>
                            }
                          </div>
                        } @else {
                          <ul>
                            @for (
                              child of item.children || [];
                              track child.id;
                              let childIndex = $index
                            ) {
                              <li>
                                @if (child.href) {
                                  <a
                                    [href]="child.href"
                                    class="gnb-sub-trigger is-link"
                                    [class.external-link]="!!child.target"
                                    data-trigger="gnb"
                                    [attr.target]="child.target || null"
                                    [attr.title]="child.title || null"
                                  >
                                    {{ child.label }}
                                  </a>
                                } @else {
                                  <button
                                    type="button"
                                    class="gnb-sub-trigger"
                                    [class.active]="child.active"
                                    data-trigger="gnb"
                                  >
                                    {{ child.label }}
                                  </button>
                                  <div
                                    class="gnb-sub-list"
                                    [class.active]="child.active"
                                    [class.between]="!child.active && childIndex > 0"
                                  >
                                    <div class="gnb-sub-content">
                                      <h2 class="sub-title">
                                        @if (child.titleHref) {
                                          {{ child.title }}
                                          <a
                                            [href]="child.titleHref"
                                            class="krds-btn link basic small"
                                          >
                                            <span class="underline">{{ child.titleLinkLabel }}</span>
                                            <i class="svg-icon ico-angle right"></i>
                                          </a>
                                        } @else {
                                          <span>{{ child.title }}</span>
                                        }
                                      </h2>
                                      @if (child.descriptionItems?.length) {
                                        <ul class="type-description">
                                          @for (
                                            descriptionItem of child.descriptionItems || [];
                                            track $index
                                          ) {
                                            <li>
                                              <h3 class="tit">
                                                <a
                                                  [href]="descriptionItem.href"
                                                  [attr.target]="descriptionItem.target || null"
                                                  [attr.title]="descriptionItem.externalTitle || null"
                                                >
                                                  {{ descriptionItem.title }}
                                                  <i class="svg-icon ico-go"></i>
                                                </a>
                                              </h3>
                                              <p class="txt">{{ descriptionItem.description }}</p>
                                            </li>
                                          }
                                        </ul>
                                      } @else {
                                        <ul>
                                          @for (leaf of child.children || []; track leaf.id) {
                                            <li>
                                              @if (leaf.href) {
                                                <a [href]="leaf.href">{{ leaf.label }}</a>
                                              } @else {
                                                <button type="button">{{ leaf.label }}</button>
                                              }
                                            </li>
                                          }
                                        </ul>
                                      }
                                    </div>
                                    @if (child.banner) {
                                      <div class="gnb-sub-banner">
                                        <span class="krds-badge bg-secondary">
                                          {{ child.banner.badge }}
                                        </span>
                                        <button type="button" class="krds-btn medium text">
                                          {{ child.banner.label }}
                                          <i class="svg-icon ico-angle right"></i>
                                        </button>
                                      </div>
                                    }
                                  </div>
                                }
                              </li>
                            }
                          </ul>
                        }
                      </div>
                    </div>
                  }
                </li>
              }
            </ul>
          </div>
        </nav>
      }
      @case ('masthead') {
        <div [id]="id.startsWith('krds-additional') ? 'krds-masthead' : id">
          <div class="toggle-wrap">
            <div class="toggle-head">
              <div class="inner">
                <span class="nuri-txt">{{ message }}</span>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('modal') {
        @if (kind === 'modal-sample') {
          <section
            [id]="id"
            class="krds-modal fade in shown"
            role="dialog"
            [attr.aria-labelledby]="id + '-title'"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h2 [id]="id + '-title'" class="modal-title">{{ title }}</h2>
                </div>
                <div class="modal-conts">
                  <div class="conts-area">{{ description }}</div>
                </div>
                <div class="modal-btn btn-wrap">
                  <button type="button" class="krds-btn medium tertiary close-modal">{{ cancelLabel }}</button>
                  <button type="button" class="krds-btn medium primary close-modal">{{ confirmLabel }}</button>
                </div>
                <button type="button" class="krds-btn medium icon btn-close close-modal">
                  <span class="sr-only">{{ closeLabel }}</span>
                  <i class="svg-icon ico-popup-close"></i>
                </button>
              </div>
            </div>
            <div class="modal-back in"></div>
          </section>
        } @else {
          <section
            [id]="id"
            class="krds-modal fade"
            role="dialog"
            [attr.aria-labelledby]="id + '-title'"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h2 [id]="id + '-title'" class="modal-title">{{ title }}</h2>
                </div>
                <div class="modal-conts">
                  <div class="conts-area">
                    @if (items.length > 0) {
                      @for (item of items; track $index) {
                        {{ navLabel(item) }}
                        @if (!$last) {
                          <br />
                        }
                      }
                    } @else {
                      {{ description }}
                    }
                  </div>
                </div>
                <div class="modal-btn btn-wrap">
                  <button type="button" class="krds-btn medium tertiary close-modal">{{ cancelLabel }}</button>
                  <button type="button" class="krds-btn medium primary close-modal">{{ confirmLabel }}</button>
                </div>
                <button type="button" class="krds-btn medium icon btn-close close-modal">
                  <span class="sr-only">{{ closeLabel }}</span>
                  <i class="svg-icon ico-popup-close"></i>
                </button>
              </div>
            </div>
            <div class="modal-back"></div>
          </section>
        }
      }
      @case ('pagination') {
        <div class="krds-pagination" role="navigation">
          <span class="page-navi prev disabled" href="#">{{ previousLabel }}</span>
          <div class="page-links">
            @for (page of items; track $index) {
              @if (paginationValue(page) === 'ellipsis') {
                <span class="page-link link-dot"></span>
              } @else {
                <a
                  href="#"
                  class="page-link"
                  [class.active]="paginationValue(page) === currentPage"
                  (click)="setCurrentPage(page, $event)"
                >
                  @if (paginationValue(page) === currentPage) {
                    <span class="sr-only">{{ message }} </span>
                  }
                  {{ paginationValue(page) }}
                </a>
              }
            }
          </div>
          <a class="page-navi next" href="#">{{ nextLabel }}</a>
        </div>
      }
      @case ('resize') {
        <div class="krds-drop-wrap krds-resize" data-adjust="scale">
          <button
            type="button"
            class="krds-btn small text drop-btn"
            [attr.aria-expanded]="resizeFocused ? null : 'false'"
            (focus)="resizeFocused = true"
          >
            {{ label }} <i class="svg-icon ico-toggle"></i>
          </button>
          <div class="drop-menu">
            <div class="drop-in">
              <ul class="drop-list">
                @for (option of options; track $index) {
                  <li>
                    <button
                      type="button"
                      [class]="'item-link ' + option.value + (option.value === selected ? ' active' : '')"
                      [attr.data-adjust-scale]="option.value"
                      (click)="setSelected(option.value)"
                    >
                      {{ option.label }}
                      @if (!resizeFocused) {
                        <span class="sr-only">{{
                          option.value === selected ? selectedLabel : ''
                        }}</span>
                      }
                    </button>
                  </li>
                }
              </ul>
              <div class="drop-bottom">
                <button
                  type="button"
                  class="krds-btn medium text"
                  data-adjust-scale="md"
                  (click)="setSelected('md')"
                >
                  <i class="svg-icon ico-reset"></i> {{ resetLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('select') {
        <select
          [id]="id"
          [class]="selectClass"
          title="선택"
          [value]="selected"
          [disabled]="disabled"
          (change)="setSelected(inputValue($event))"
          (blur)="touch()"
        >
          @for (option of options; track $index) {
            <option
              [attr.value]="option.value"
              [disabled]="option.disabled"
              [attr.selected]="kind === 'select-size' && $first ? '' : null"
            >
              {{ option.label }}
            </option>
          }
        </select>
        @if (kind !== 'select-sorting') {
          <label [for]="id">{{ label }}</label>
        }
      }
      @case ('side-navigation') {
        <nav class="krds-side-navigation">
          <h2 class="lnb-tit">{{ title }}</h2>
          <ul class="lnb-list" role="menubar">
            @for (item of items; track $index; let topIndex = $index) {
              <li class="lnb-item" [class.active]="$first" role="none">
                <button
                  type="button"
                  class="lnb-btn lnb-toggle"
                  [class.active]="$first"
                  role="menuitem"
                  [attr.aria-controls]="sideMenuId(topIndex)"
                  [attr.aria-expanded]="$first"
                >
                  {{ navLabel(item) }}
                </button>
                <div class="lnb-submenu">
                  <ul [id]="sideMenuId(topIndex)" role="menu">
                    @for (child of itemChildren(item); track $index; let childIndex = $index) {
                      <li
                        class="lnb-subitem"
                        [class.active]="itemCurrent(child)"
                        role="none"
                      >
                        @if (itemChildren(child).length > 0) {
                          <button
                            type="button"
                            class="lnb-btn lnb-toggle-popup"
                            role="menuitem"
                            [attr.aria-controls]="sidePopupId(topIndex, childIndex)"
                            aria-expanded="false"
                            aria-haspopup="true"
                          >
                            {{ navLabel(child) }}
                          </button>
                          <div
                            class="lnb-submenu-lv2"
                            [id]="sidePopupId(topIndex, childIndex)"
                            role="menu"
                          >
                            <button type="button" class="lnb-btn-tit">
                              {{ itemDescription(child) }}
                            </button>
                            <ul>
                              @for (leaf of itemChildren(child); track $index) {
                                <li role="none">
                                  <a [href]="navHref(leaf)" class="lnb-btn" role="menuitem">
                                    {{ navLabel(leaf) }}
                                  </a>
                                </li>
                              }
                            </ul>
                          </div>
                        } @else {
                          <a
                            [href]="navHref(child)"
                            class="lnb-btn lnb-link"
                            role="menuitem"
                            [attr.aria-current]="itemCurrent(child) ? 'page' : null"
                          >
                            {{ navLabel(child) }}
                          </a>
                        }
                      </li>
                    }
                  </ul>
                </div>
              </li>
            }
          </ul>
        </nav>
      }
      @case ('skip-link') {
        <div [id]="id.startsWith('krds-additional') ? 'krds-skip-link' : id">
          <a [href]="href">{{ label }}</a>
        </div>
      }
      @case ('spinner') {
        <div class="krds-spinner" role="status">
          <span class="sr-only">{{ label }}</span>
        </div>
      }
      @case ('step-indicator') {
        <ol class="krds-step-wrap">
          @for (step of steps; track step.id) {
            <li
              [class.done]="$index < current"
              [class.active]="$index === current"
            >
              <span>
                @if ($index === current) {
                  <em class="sr-only">{{ message }}</em>
                }
                <i class="step">{{ $index + 1 }}{{ label }}</i>
                <span class="step-tit">{{ step.label }}</span>
              </span>
            </li>
          }
        </ol>
      }
      @case ('structured-list') {
        <ul class="krds-structured-list type-full">
          @for (item of items; track $index) {
            <li class="structured-item">
              <div class="in">
                <div class="card-top">
                  <span [class]="'krds-badge ' + structuredBadgeTone(item)">
                    {{ itemBadge(item) }}
                  </span>
                </div>
                <div class="card-body">
                  <a [href]="navHref(item)" class="c-text">
                    <p class="c-tit"><span class="span">{{ navLabel(item) }}</span></p>
                    <p class="c-txt">{{ itemDescription(item) }}</p>
                    <p class="c-date">
                      <strong class="key">{{ dateLabel }}</strong>
                      <span class="value">{{ dateValue }}</span>
                    </p>
                  </a>
                  <div class="c-btn">
                    <a
                      [href]="navHref(item)"
                      class="krds-btn secondary"
                      [attr.title]="navLabel(item)"
                    >
                      {{ actionLabel }}
                    </a>
                  </div>
                </div>
                <div class="card-btm">
                  @for (tag of tags; track $index) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
                <div class="card-btn">
                  <button
                    type="button"
                    class="krds-btn medium text"
                    [attr.title]="navLabel(item)"
                  >
                    <i class="svg-icon ico-share"></i> {{ shareLabel }}
                  </button>
                  <button
                    type="button"
                    class="krds-btn medium text"
                    [attr.title]="navLabel(item)"
                  >
                    <i class="svg-icon ico-like"></i> {{ favoriteLabel }}
                  </button>
                </div>
              </div>
            </li>
          }
        </ul>
      }
      @case ('table') {
        <ng-template #tableContent>
          <div class="krds-table-wrap">
            <table class="tbl col data">
              <caption>{{ caption || title }}</caption>
              <colgroup>
                @for (column of columns; track column.key) {
                  <col [attr.style]="tableColumnStyle(column)" />
                }
                @if (kind === 'structured-list-table') {
                  <col />
                }
              </colgroup>
              <thead>
                <tr>
                  @for (column of columns; track column.key) {
                    <th scope="col">
                      @if (columnVisuallyHidden(column)) {
                        <span class="sr-only">{{ column.label }}</span>
                      } @else {
                        {{ column.label }}
                      }
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of rows; track $index) {
                  <tr>
                    @for (column of columns; track column.key; let columnIndex = $index) {
                      @if (kind === 'structured-list-table' && column.key === 'selected') {
                        <th scope="row">
                          <div class="krds-form-check">
                            <input
                              type="checkbox"
                              class="chk"
                              [id]="tableRowControlId(row, $index)"
                              [checked]="tableCellBoolean(row, column.key)"
                            />
                            <label [for]="tableRowControlId(row, $index)"></label>
                          </div>
                        </th>
                      } @else if (
                        kind === 'structured-list-table' && column.key === 'download'
                      ) {
                        <td>
                          <button type="button" class="krds-btn medium text">
                            <i class="svg-icon ico-down"></i>
                            {{ row[column.key] }}
                          </button>
                        </td>
                      } @else if (columnIndex === 0) {
                        <th scope="row">{{ row[column.key] }}</th>
                      } @else {
                        <td>{{ row[column.key] }}</td>
                      }
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ng-template>
        @if (kind === 'structured-list-table') {
          <div [class]="additionalRootClass('krds-structured-list-table')">
            <div class="search-list-top">
              <div class="sch-left">
                <div class="krds-check-area">
                  <div class="krds-form-check">
                    <input type="checkbox" class="chk" [id]="id + '-select-all'" />
                    <label [for]="id + '-select-all'">{{ selectAllLabel }}</label>
                  </div>
                </div>
                <ul class="side-line-ul">
                  @for (action of actions; track action.id) {
                    <li>
                      <button type="button" class="krds-btn medium text">
                        @if (action.icon) {
                          <i [class]="'svg-icon ico-' + action.icon"></i>
                        }
                        {{ action.label }}
                      </button>
                    </li>
                  }
                </ul>
              </div>
              <ul class="sch-sort">
                <li>
                  <strong class="sort-label">
                    <label [for]="id + '-result-count'">{{ countLabel }}</label>
                  </strong>
                  <select class="krds-form-select-sort" [id]="id + '-result-count'">
                    @for (option of countOptions; track option) {
                      <option>{{ option }}</option>
                    }
                  </select>
                </li>
                <li>
                  <strong class="sort-label">
                    <label [for]="id + '-sort'">{{ sortLabel }}</label>
                  </strong>
                  <div class="w-sort-btn">
                    @for (option of sortOptions; track option) {
                      <button
                        type="button"
                        [class.active]="option === sortValue"
                        (click)="sortValue = option"
                      >
                        {{ option }}
                      </button>
                    }
                  </div>
                  <div class="m-sort-btn">
                    <select
                      class="krds-form-select-sort"
                      [id]="id + '-sort'"
                      [value]="sortValue"
                      (change)="sortValue = inputValue($event)"
                    >
                      @for (option of sortOptions; track option) {
                        <option>{{ option }}</option>
                      }
                    </select>
                  </div>
                </li>
              </ul>
            </div>
            <ng-container [ngTemplateOutlet]="tableContent"></ng-container>
            @if (pagination) {
              <div class="krds-pagination">
                @if (pagination.previousDisabled) {
                  <span class="page-navi prev disabled" href="#">{{ pagination.previousLabel }}</span>
                } @else {
                  <a class="page-navi prev" href="#">{{ pagination.previousLabel }}</a>
                }
                <div class="page-links">
                  @for (page of pagination.items; track $index) {
                    @if (paginationValue(page) === 'ellipsis') {
                      <span class="page-link link-dot"></span>
                    } @else {
                      <a
                        href="#"
                        class="page-link"
                        [class.active]="paginationValue(page) === pagination.current.toString()"
                        (click)="setStructuredTablePage(page, $event)"
                      >
                        @if (paginationValue(page) === pagination.current.toString()) {
                          <span class="sr-only">{{ pagination.currentLabel }} </span>
                        }
                        {{ paginationValue(page) }}
                      </a>
                    }
                  }
                </div>
                @if (pagination.nextDisabled) {
                  <span class="page-navi next disabled">{{ pagination.nextLabel }}</span>
                } @else {
                  <a class="page-navi next" href="#">{{ pagination.nextLabel }}</a>
                }
              </div>
            }
          </div>
        } @else {
          <ng-container [ngTemplateOutlet]="tableContent"></ng-container>
        }
      }
      @case ('tab') {
        <div class="krds-tab-area layer">
          <div class="tab line full">
            <ul role="tablist">
              @for (tab of tabs; track tab.id) {
                <li [class.active]="(selected || tabs[0]?.id) === tab.id">
                  <button
                    [id]="'tab_' + tab.id"
                    type="button"
                    class="btn-tab"
                    role="tab"
                    [attr.aria-selected]="(selected || tabs[0]?.id) === tab.id"
                    [attr.aria-controls]="'panel_' + tab.id"
                    [attr.data-listener-attached]="tabFocused ? null : 'true'"
                    (focus)="tabFocused = true"
                    (click)="setSelected(tab.id)"
                  >
                    {{ tab.label }}
                    @if ((selected || tabs[0]?.id) === tab.id) {
                      <i class="sr-only created"> {{ selectedLabel }}</i>
                    }
                  </button>
                </li>
              }
            </ul>
          </div>
        </div>
      }
      @case ('tag') {
        <span class="krds-btn-tag">
          {{ label }}
          <button type="button" class="btn-delete">
            <span class="sr-only">{{ message }}</span>
          </button>
        </span>
      }
      @case ('tag-link') {
        <a class="krds-btn-tag link" [href]="href">{{ label }}</a>
      }
      @case ('textarea') {
        <textarea
          class="krds-input"
          [id]="id"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          (input)="setValue(inputValue($event))"
          (blur)="touch()"
        ></textarea>
        <label [for]="id">{{ label }}</label>
      }
      @case ('text-input-icon') {
        @if (kind === 'text-input-size' || kind === 'text-input-state') {
          <div class="form-group">
            <div class="form-tit">
              <label [for]="id">{{ label }}</label>
            </div>
            <div [class]="textInputContainerClass">
              <input
                [id]="id"
                [attr.type]="type"
                [value]="value"
                [attr.value]="value || null"
                [placeholder]="placeholder"
                [disabled]="disabled"
                [readonly]="readonly"
                [required]="required"
                [class]="textInputClass"
                (input)="setValue(inputValue($event))"
                (blur)="touch()"
              />
            </div>
            @if (hint) {
              <p [class]="textInputHintClass">{{ hint }}</p>
            }
          </div>
        } @else {
          <input
            [id]="id"
            class="krds-input"
            [attr.type]="type"
            [value]="value"
            [attr.value]="value || null"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [readonly]="readonly"
            [required]="required"
            (input)="setValue(inputValue($event))"
            (blur)="touch()"
          />
          <label [for]="id">{{ label }}</label>
        }
      }
      @case ('text-list') {
        <ng-template #unorderedList let-list let-level="level">
          <ul [class]="unorderedListClass(level)" role="list">
            @for (item of list; track $index) {
              <li role="listitem">
                {{ navLabel(item) }}
                @if (itemChildren(item).length > 0) {
                  <ng-container
                    *ngTemplateOutlet="
                      unorderedList;
                      context: { $implicit: itemChildren(item), level: level + 1 }
                    "
                  />
                }
              </li>
            }
          </ul>
        </ng-template>
        <ng-container
          *ngTemplateOutlet="unorderedList; context: { $implicit: items, level: 0 }"
        />
      }
      @case ('text-list-ordered') {
        <ng-template #orderedList let-list let-level="level">
          <ol class="krds-info-list ordered" role="list">
            @for (item of list; track $index) {
              <li role="listitem">
                <span class="num">{{ orderedMarker(level, $index) }}</span>
                {{ navLabel(item) }}
                @if (itemChildren(item).length > 0) {
                  <ng-container
                    *ngTemplateOutlet="
                      orderedList;
                      context: { $implicit: itemChildren(item), level: level + 1 }
                    "
                  />
                }
              </li>
            }
          </ol>
        </ng-template>
        <ng-container
          *ngTemplateOutlet="orderedList; context: { $implicit: items, level: 0 }"
        />
      }
      @case ('tooltip') {
        <button type="button" [class]="tooltipClass" [attr.data-tooltip]="message">
          {{ label }}
          <i class="svg-icon ico-angle right"></i>
        </button>
      }
      @case ('tts') {
        <button
          type="button"
          [class]="ttsClass"
          [attr.aria-label]="kind === 'tts-icon' ? label || null : null"
          (click)="playing = !playing"
        >
          <span class="krds-tts-icon" aria-hidden="true">
            <i class="svg-icon ico-volume"></i>
          </span>
          @if (kind !== 'tts-icon') {
            <span class="krds-tts-text">{{ label }}</span>
          }
        </button>
      }
      @case ('toggle-switch') {
        <div
          [class]="
            'krds-form-toggle-switch' +
            (kind === 'toggle-switch-size' ? ' ' + size : '')
          "
        >
          <input
            [id]="id"
            [attr.name]="name || null"
            type="checkbox"
            [checked]="checked"
            [disabled]="disabled"
            (change)="setChecked(checkedValue($event))"
            (blur)="touch()"
          />
          <label [for]="id">
            <span class="switch-toggle"><i></i></span>{{ label }}
          </label>
        </div>
      }
      @case ('radio-button') {
        <div
          [class]="
            'krds-form-check' + (kind === 'radio-size' ? ' ' + size : '')
          "
        >
          <input
            [id]="id"
            type="radio"
            [attr.name]="name || null"
            [attr.value]="value || null"
            [checked]="checked || (value !== '' && selected === value)"
            [disabled]="disabled"
            (change)="setSelected(value || 'on')"
            (blur)="touch()"
          />
          <label [for]="id">{{ label }}</label>
        </div>
      }
      @case ('surface') {
        <label class="krds-field"
          ><span class="krds-field-label">{{ label }}</span
          ><input class="krds-input" [value]="value" [disabled]="disabled" [readonly]="readonly"
        /></label>
      }
      @default {
        <div>{{ description }}</div>
      }
    }
  `,
})
export class KrdsAdditionalComponent implements ControlValueAccessor, KrdsAdditionalProps {
  @Input() kind: AngularAdditionalKind = 'surface';
  @Input() id = createStableId('krds-additional');
  @Input() type = 'button';
  @Input() label = '레이블';
  @Input() title = '제목';
  @Input() description = '';
  @Input() pageTitle = '';
  @Input() caption = '';
  @Input() stepTitle = '';
  @Input() contentTitle = '';
  @Input() helpTitle = '';
  @Input() helpDescription = '';
  @Input() tutorialTitle = '';
  @Input() tutorialBackTitle = '';
  @Input() hint = '';
  @Input() placeholder = '';
  @Input() state: 'default' | 'error' | 'success' | 'information' = 'default';
  @Input() variant = '';
  @Input() className = '';
  @Input() sample = false;
  @Input() style: Record<string, string> = {};
  @Input() tone: KrdsTone = 'primary';
  @Input() appearance: 'outline' | 'solid' | 'light' = 'outline';
  @Input() size = 'medium';
  @Input() sizes = '';
  @Input() number = false;
  @Input() href = '#';
  @Input() target: '_blank' | '_self' | null = null;
  @Input() message = '도움말';
  @Input() text = '';
  @Input() actionInfo = '';
  @Input() actionCount = '';
  @Input() selectedLabel = '';
  @Input() currentLabel = '';
  @Input() externalTitle = '';
  @Input() resetLabel = '';
  @Input() linkLabel = '';
  @Input() closeLabel = '';
  @Input() cancelLabel = '';
  @Input() confirmLabel = '';
  @Input() currentStepLabel = '';
  @Input() totalStepsLabel = '';
  @Input() collapseLabel = '';
  @Input() activeTab = '';
  @Input() position = 'top';
  @Input() step = '1/1';
  @Input() open = false;
  @Input() disabled = false;
  @Input() value = '';
  @Input() modelValue: string | number | boolean | string[] = '';
  @Input() name = '';
  @Input() inputId = '';
  @Input() prompt = '';
  @Input() selectLabel = '';
  @Input() currentCount = 0;
  @Input() maxCount = 0;
  @Input() countSuffix = '';
  @Input() selectAllLabel = '';
  @Input() actions: AngularTableAction[] = [];
  @Input() countLabel = '';
  @Input() countOptions: string[] = [];
  @Input() sortLabel = '';
  @Input() sortOptions: string[] = [];
  @Input() sortValue = '';
  @Input() pagination: AngularTablePagination | null = null;
  @Input() year: number | null = null;
  @Input() month: number | null = null;
  @Input() displayYear: number | null = null;
  @Input() displayMonth: number | null = null;
  @Input() selectedYear: number | null = null;
  @Input() selectedMonth: number | null = null;
  @Input() years: number[] = [];
  @Input() disabledYears: number[] = [];
  @Input() disabledMonths: number[] = [];
  @Input() leadingDays = 0;
  @Input() previousMonthDayCount = 0;
  @Input() dayCount = 0;
  @Input() rangeStartDay: number | null = null;
  @Input() rangeEndDay: number | null = null;
  @Input() todayDay: number | null = null;
  @Input() eventDays: number[] = [];
  @Input() disabledDays: number[] = [];
  @Input() calendarLabel = '';
  @Input() previousMonthLabel = '';
  @Input() nextMonthLabel = '';
  @Input() yearSelectLabel = '';
  @Input() monthSelectLabel = '';
  @Input() weekdays: string[] = [];
  @Input() todayLabel = '';
  @Input() eventLabel = '';
  @Input() files: Array<{
    id: string;
    name: string;
    status: 'uploading' | 'complete' | 'deletable' | 'error' | 'downloadable';
    statusLabel?: string;
    deleteLabel?: string;
    errors?: string[];
    downloadLabel?: string;
    previewLabel?: string;
  }> = [];
  @Input() deleteAllLabel = '';
  @Input() required = false;
  @Input() readonly = false;
  @Input() organization = 'KRDS Community';
  @Input() current = 1;
  @Input() selected = '';
  @Input() checked = false;
  @Input() playing = false;
  @Input() options: KrdsOption[] = [];
  @Input() set languages(value: KrdsOption[]) {
    this.options = value;
  }
  @Input() set defaultValue(value: string) {
    this.selected = value;
  }
  @Input() items: (AngularNavItem | KrdsListItem | string)[] = [];
  @Input() links: AngularNavItem[] = [];
  @Input() set nav(value: AngularNavItem[]) {
    this.links = value;
  }
  @Input() utilityItems: HeaderUtilityItem[] = [];
  @Input() serviceItems: AngularNavItem[] = [];
  @Input() bottomItems: AngularNavItem[] = [];
  @Input() loginLabel = '';
  @Input() searchPlaceholder = '';
  @Input() searchTitle = '';
  @Input() searchLabel = '';
  @Input() logoHref = '#';
  @Input() loginHref = '#';
  @Input() joinLabel = '';
  @Input() allMenuLabel = '';
  @Input() menuLabel = '';
  @Input() myMenu: HeaderMyMenu | null = null;
  @Input() desktopItems: AngularNavItem[] = [];
  @Input() mobileMenu: HeaderMobileMenu | null = null;
  @Input() slides: KrdsCarouselSlide[] = [];
  slideIndex = 0;
  @Input() previousLabel = '';
  @Input() nextLabel = '';
  @Input() moreLabel = '';
  @Input() imageLabel = '';
  @Input() actionLabel = '';
  @Input() dateLabel = '';
  @Input() dateValue = '';
  @Input() tags: string[] = [];
  @Input() shareLabel = '';
  @Input() favoriteLabel = '';
  @Input() playLabel = '';
  @Input() stopLabel = '';
  @Input() downloadLinks: Array<{
    label: string;
    href: string;
    target?: string;
    title?: string;
  }> = [];
  @Input() relatedGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string; icon?: string }>;
  }> = [];
  @Input() tasks: Array<{
    title: string;
    current?: boolean;
    summary: string;
    steps: string[];
  }> = [];
  @Input() relatedSites: Array<{ id: string; label: string; title: string }> = [];
  @Input() logoLabel = '';
  @Input() address = '';
  @Input() contacts: Array<{ title: string; description: string }> = [];
  @Input() socialLinks: Array<{
    label: string;
    icon: string;
    href: string;
    target?: string;
    title?: string;
  }> = [];
  @Input() policyLinks: Array<{
    label: string;
    href: string;
    emphasis?: boolean;
  }> = [];
  @Input() copyright = '';
  @Input() tabs: Array<KrdsTabItem & { panelId?: string; value?: string }> = [];
  @Input() panels: Record<string, string> = {};
  @Input() steps: KrdsStep[] = [];
  @Input() columns: KrdsTableColumn[] = [];
  @Input() rows: KrdsTableRow[] = [];
  @Output() valueChange = new EventEmitter<string>();
  @Output() selectedChange = new EventEmitter<string>();
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() monthChange = new EventEmitter<number>();
  helpPanelFocused = false;
  contextualHelpFocused = false;
  languageFocused = false;
  resizeFocused = false;
  tabFocused = false;
  calendarYearOpen = false;
  calendarMonthOpen = false;
  private onChange: (value: string | number | boolean | string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private readonly changeDetector = inject(ChangeDetectorRef, { optional: true });
  private readonly elementRef = inject<ElementRef<{ tagName?: string }>>(ElementRef, {
    optional: true,
  });
  private readonly sanitizer = inject(DomSanitizer, { optional: true });

  writeValue(value: string | number | boolean | string[] | null): void {
    this.modelValue = value ?? '';
    if (typeof value === 'boolean') {
      this.checked = value;
    } else if (typeof value === 'number') {
      this.current = value;
      this.value = String(value);
      this.selected = String(value);
    } else if (Array.isArray(value)) {
      this.value = value.join(', ');
    } else {
      this.value = value ?? '';
      this.selected = value ?? '';
    }
    this.changeDetector?.markForCheck();
  }
  registerOnChange(
    fn: (value: string | number | boolean | string[]) => void,
  ): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector?.markForCheck();
  }
  inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }
  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
  setValue(value: string): void {
    this.value = value;
    this.modelValue = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
  setSelected(value: string): void {
    this.selected = value;
    this.modelValue = value;
    this.onChange(value);
    this.selectedChange.emit(value);
  }
  setChecked(value: boolean): void {
    this.checked = value;
    this.modelValue = value;
    this.onChange(value);
    this.checkedChange.emit(value);
  }
  touch(): void {
    this.onTouched();
  }
  get isSingleCalendar(): boolean {
    return (this.hostAliasKind ?? this.kind) === 'calendar';
  }
  get isDateInput(): boolean {
    return (this.hostAliasKind ?? this.kind) === 'date-input';
  }
  get calendarYear(): number {
    return this.displayYear ?? this.year ?? this.years[0] ?? 0;
  }
  get calendarMonth(): number {
    return this.displayMonth ?? this.month ?? 1;
  }
  get calendarSelectedYear(): number {
    return this.selectedYear ?? this.year ?? this.calendarYear;
  }
  get calendarSelectedMonth(): number {
    return this.selectedMonth ?? this.month ?? this.calendarMonth;
  }
  get calendarYears(): number[] {
    return this.years.length > 0
      ? this.years
      : this.calendarYear === 0
        ? []
        : [this.calendarYear];
  }
  get calendarMonths(): readonly number[] {
    return CALENDAR_MONTHS;
  }
  get calendarWeeks(): AngularCalendarCell[][] {
    const activeYear = this.calendarYear;
    const activeMonth = this.calendarMonth;
    const leadingDays = Math.max(0, Math.min(6, this.leadingDays));
    const dayCount = Math.max(0, this.dayCount);
    const previousMonthDayCount = Math.max(0, this.previousMonthDayCount);
    const totalCells = Math.ceil((leadingDays + dayCount) / 7) * 7;
    const weeks: AngularCalendarCell[][] = [];

    for (let row = 0; row < totalCells / 7; row += 1) {
      const week: AngularCalendarCell[] = [];
      for (let column = 0; column < 7; column += 1) {
        const index = row * 7 + column;
        const offset = index - leadingDays + 1;
        let day: number;
        let month = activeMonth;
        let year = activeYear;
        let offMonth: 'old' | 'new' | null = null;

        if (offset < 1) {
          day = previousMonthDayCount + offset;
          offMonth = 'old';
          month = activeMonth === 1 ? 12 : activeMonth - 1;
          year = activeMonth === 1 ? activeYear - 1 : activeYear;
        } else if (offset > dayCount) {
          day = offset - dayCount;
          offMonth = 'new';
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
        const disabled = !currentMonth || this.disabledDays.includes(day);
        const date = `${year}.${this.padCalendarPart(month)}.${this.padCalendarPart(day)}`;
        const selected = this.value === date;
        const classes = [
          offMonth,
          column === 0 ? 'day-off' : null,
          period || (selected && !period) ? 'period' : null,
          start || (selected && !period) ? 'start' : null,
          end || (selected && !period) ? 'end' : null,
          today ? 'today' : null,
          event ? 'day-event' : null,
          disabled ? 'disabled' : null,
        ].filter((className): className is string => className !== null);

        week.push({
          day,
          date,
          className: classes.join(' '),
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
    return value.toString().padStart(2, '0');
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
  setStructuredTablePage(page: unknown, event: Event): void {
    event.preventDefault();
    if (this.pagination === null) return;
    const value = Number(this.paginationValue(page));
    if (Number.isNaN(value)) return;
    this.pagination = { ...this.pagination, current: value };
    this.onChange(value);
  }
  get renderKind(): AngularAdditionalKind {
    const hostKind = this.hostAliasKind;
    const inputKind = hostKind ?? this.kind ?? 'surface';
    return KIND_ALIASES[inputKind] ?? inputKind;
  }
  get renderNumber(): boolean {
    return (
      this.number ||
      this.kind === 'badge-number' ||
      this.hostAliasKind === 'badge-number'
    );
  }
  private get hostAliasKind(): AngularAdditionalKind | undefined {
    const tagName = this.elementRef?.nativeElement?.tagName;
    return typeof tagName === 'string' ? ADDITIONAL_ALIAS_KINDS[tagName.toLowerCase()] : undefined;
  }
  get currentPage(): string {
    return this.current.toString();
  }
  get currentStep(): string {
    return this.step.split('/')[0] || '1';
  }
  get totalSteps(): string {
    return this.step.split('/')[1] || '1';
  }
  get selectedOptionLabel(): string {
    return (
      this.options.find((option) => option.value === this.selected)?.label ??
      this.options[0]?.label ??
      ''
    );
  }
  get visibleLanguageOptions(): KrdsOption[] {
    return this.kind === 'language-switcher-page'
      ? this.options.filter((option) => option.value !== this.selected)
      : this.options;
  }
  get selectClass(): string {
    if (this.kind === 'select-size') return `krds-form-select ${this.size}`;
    if (this.kind === 'select-state') return 'krds-form-select is-error';
    if (this.kind === 'select-sorting') return 'krds-form-select-sort';
    return 'krds-form-select';
  }
  get textInputContainerClass(): string {
    return `form-conts${this.state === 'default' ? '' : ` is-${this.state}`}`;
  }
  get textInputClass(): string {
    return `krds-input${this.kind === 'text-input-size' ? ` ${this.size}` : ''}`;
  }
  get textInputHintClass(): string {
    if (this.state === 'error') return 'form-hint-invalid';
    if (this.state === 'success') return 'form-hint-success';
    if (this.state === 'information') return 'form-hint-information';
    return 'form-hint';
  }
  get contextualHelpClass(): string {
    return `krds-contextual-help ${this.position.split('-').join(' ')}`;
  }
  get tooltipClass(): string {
    const variation =
      this.kind === 'tooltip-box'
        ? ' tooltip-box'
        : this.kind === 'tooltip-vertical'
          ? ' tooltip-vertical'
          : '';
    return `krds-btn small text krds-tooltip${variation}`;
  }
  get ttsClass(): string {
    return `krds-tts ${this.kind === 'tts-size' ? this.size : 'medium'}`;
  }
  accordionHeaderId(index: number): string {
    return `${this.id}-header-${index}`;
  }
  accordionPanelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }
  helpTabValue(tab: KrdsTabItem & { value?: string }): string {
    return tab.value ?? tab.id;
  }
  helpTabPanelId(tab: KrdsTabItem & { panelId?: string }): string {
    return tab.panelId ?? `${tab.id}-panel`;
  }
  sideMenuId(index: number): string {
    return `${this.id}-side-${index}`;
  }
  sidePopupId(topIndex: number, childIndex: number): string {
    return `${this.id}-side-${topIndex}-${childIndex}`;
  }
  criticalTone(item: unknown): string {
    if (!item || typeof item !== 'object' || !('tone' in item)) return 'info';
    return String((item as { tone?: unknown }).tone ?? 'info');
  }
  criticalLabel(item: unknown): string {
    if (!item || typeof item !== 'object' || !('badgeLabel' in item)) return '';
    return String((item as { badgeLabel?: unknown }).badgeLabel ?? '');
  }
  itemLinkLabel(item: unknown): string {
    if (!item || typeof item !== 'object' || !('linkLabel' in item)) return '';
    return String((item as { linkLabel?: unknown }).linkLabel ?? '');
  }
  structuredBadgeTone(item: unknown): string {
    if (!item || typeof item !== 'object') return 'bg-light-primary';
    if ('badgeTone' in item) {
      return String((item as { badgeTone?: unknown }).badgeTone ?? 'bg-light-primary');
    }
    if ('badgeClass' in item) {
      return String((item as { badgeClass?: unknown }).badgeClass ?? 'bg-light-primary');
    }
    if ('tone' in item) return String((item as { tone?: unknown }).tone ?? 'bg-light-primary');
    return 'bg-light-primary';
  }
  itemBadge(item: unknown): string {
    if (!item || typeof item !== 'object' || !('badge' in item)) return '';
    return String((item as { badge?: unknown }).badge ?? '');
  }
  paginationValue(item: unknown): string {
    if (typeof item === 'number' || typeof item === 'string') return String(item);
    if (item && typeof item === 'object' && 'label' in item) {
      return String((item as { label?: unknown }).label ?? '');
    }
    return '';
  }
  setCurrentPage(item: unknown, event: Event): void {
    event.preventDefault();
    const value = Number(this.paginationValue(item));
    if (!Number.isNaN(value)) {
      this.current = value;
      this.onChange(value);
    }
  }
  tableColumnStyle(column: KrdsTableColumn): string | null {
    if (!('width' in column)) return null;
    const width = String((column as KrdsTableColumn & { width?: unknown }).width ?? '');
    return width ? `width: ${width};` : null;
  }
  columnVisuallyHidden(column: KrdsTableColumn): boolean {
    return Boolean(
      (column as KrdsTableColumn & { visuallyHidden?: boolean }).visuallyHidden,
    );
  }
  tableRowControlId(row: KrdsTableRow, index: number): string {
    const rowId = 'id' in row ? String(row.id) : String(index + 1);
    return `list_chk_${rowId}`;
  }
  tableCellBoolean(row: KrdsTableRow, key: string): boolean {
    return Boolean(row[key]);
  }
  unorderedListClass(level: number): string {
    return `krds-info-list ${['decimal', 'dash', 'hollow'][level] ?? 'hollow'}`;
  }
  orderedMarker(level: number, index: number): string {
    if (level === 0) return `${index + 1}.`;
    if (level === 1) return `${String.fromCharCode(97 + index)}.`;
    return ['①', '②', '③', '④', '⑤'][index] ?? `${index + 1}.`;
  }
  itemChildren(item: unknown): (KrdsNavItem | KrdsListItem | string)[] {
    if (!item || typeof item !== 'object' || !('children' in item)) return [];
    const children = (item as { children?: unknown }).children;
    return Array.isArray(children)
      ? (children as (KrdsNavItem | KrdsListItem | string)[])
      : [];
  }
  get menuItems(): AngularNavItem[] {
    return this.items.filter(
      (item): item is AngularNavItem => Boolean(item && typeof item === 'object' && 'id' in item),
    );
  }
  get headerDesktopItems(): AngularNavItem[] {
    return this.desktopItems.length > 0 ? this.desktopItems : this.links;
  }
  get headerMobileId(): string {
    return `${this.id}-mobile-nav`;
  }
  additionalRootClass(base: string): string {
    const classes = new Set([base]);
    if (this.sample) classes.add('sample');
    for (const className of this.className.split(/\s+/)) {
      if (className) classes.add(className);
    }
    return [...classes].join(' ');
  }
  mobileMenuId(item: AngularNavItem): string {
    return item.href?.startsWith('#') ? item.href.slice(1) : (item.id ?? '');
  }
  isSingleDesktopMenu(item: AngularNavItem): boolean {
    return Boolean(item.title && item.banner);
  }
  navLabel(item: unknown): string {
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (!item || typeof item !== 'object') return '';
    if ('label' in item) return String((item as { label?: unknown }).label ?? '');
    if ('title' in item) return String((item as { title?: unknown }).title ?? '');
    if ('text' in item) return String((item as { text?: unknown }).text ?? '');
    if ('message' in item) return String((item as { message?: unknown }).message ?? '');
    return '';
  }
  itemDescription(item: unknown): string {
    if (!item || typeof item !== 'object') return this.description;
    if ('content' in item) return String((item as { content?: unknown }).content ?? '');
    if ('description' in item) {
      return String((item as { description?: unknown }).description ?? '');
    }
    return this.description;
  }
  itemCurrent(item: unknown): boolean {
    return Boolean(item && typeof item === 'object' && 'current' in item && item.current);
  }
  navHref(item: unknown): string {
    if (!item || typeof item !== 'object' || !('href' in item)) return '#';
    return String((item as { href?: unknown }).href || '#');
  }
  safeFaviconHref(value: string): SafeResourceUrl | string {
    const href = /^(?:https?:|data:image\/|\/|#)/i.test(value) ? value : '/favicon.ico';
    return this.sanitizer?.bypassSecurityTrustResourceUrl(href) ?? href;
  }
  previousSlide(): void {
    const length = Math.max(this.slides.length, 1);
    this.slideIndex = (this.slideIndex - 1 + length) % length;
  }
  nextSlide(): void {
    this.slideIndex = (this.slideIndex + 1) % Math.max(this.slides.length, 1);
  }
}

/**
 * Alias exports remain one standalone component so consumers can import a small surface.
 * Their element selectors are explicit above and resolve to deterministic kinds through the
 * host selector map. `AngularAdditionalSupport` marks controls implemented here versus
 * visual approximations that remain unverified as full standalone widgets.
 */
export {
  KrdsAdditionalComponent as KrdsBadgeComponent,
  KrdsAdditionalComponent as KrdsAccordionLineComponent,
  KrdsAdditionalComponent as KrdsBadgeNumberComponent,
  KrdsAdditionalComponent as KrdsBadgeSizeComponent,
  KrdsAdditionalComponent as KrdsBreadcrumbComponent,
  KrdsAdditionalComponent as KrdsButtonHierarchyComponent,
  KrdsAdditionalComponent as KrdsButtonIconComponent,
  KrdsAdditionalComponent as KrdsButtonSizeComponent,
  KrdsAdditionalComponent as KrdsButtonTextComponent,
  KrdsAdditionalComponent as KrdsButtonWithIconComponent,
  KrdsAdditionalComponent as KrdsCalendarComponent,
  KrdsAdditionalComponent as KrdsCalendarRangeComponent,
  KrdsAdditionalComponent as KrdsCarouselComponent,
  KrdsAdditionalComponent as KrdsCarouselBannerComponent,
  KrdsAdditionalComponent as KrdsCheckboxChipComponent,
  KrdsAdditionalComponent as KrdsCheckboxSizeComponent,
  KrdsAdditionalComponent as KrdsCoachMarkComponent,
  KrdsAdditionalComponent as KrdsContextualHelpComponent,
  KrdsAdditionalComponent as KrdsCriticalAlertsComponent,
  KrdsAdditionalComponent as KrdsDateInputComponent,
  KrdsAdditionalComponent as KrdsDisclosureComponent,
  KrdsAdditionalComponent as KrdsFaviconComponent,
  KrdsAdditionalComponent as KrdsFileUploadComponent,
  KrdsAdditionalComponent as KrdsFooterComponent,
  KrdsAdditionalComponent as KrdsHeaderComponent,
  KrdsAdditionalComponent as KrdsHelpPanelComponent,
  KrdsAdditionalComponent as KrdsIdentifierComponent,
  KrdsAdditionalComponent as KrdsInPageNavigationComponent,
  KrdsAdditionalComponent as KrdsLanguageSwitcherComponent,
  KrdsAdditionalComponent as KrdsLanguageSwitcherPageComponent,
  KrdsAdditionalComponent as KrdsLinkComponent,
  KrdsAdditionalComponent as KrdsMainMenuMobileComponent,
  KrdsAdditionalComponent as KrdsMainMenuPcComponent,
  KrdsAdditionalComponent as KrdsMastheadComponent,
  KrdsAdditionalComponent as KrdsModalComponent,
  KrdsAdditionalComponent as KrdsModalSampleComponent,
  KrdsAdditionalComponent as KrdsPaginationComponent,
  KrdsAdditionalComponent as KrdsRadioButtonComponent,
  KrdsAdditionalComponent as KrdsRadioChipComponent,
  KrdsAdditionalComponent as KrdsRadioSizeComponent,
  KrdsAdditionalComponent as KrdsResizeComponent,
  KrdsAdditionalComponent as KrdsSelectComponent,
  KrdsAdditionalComponent as KrdsSelectSizeComponent,
  KrdsAdditionalComponent as KrdsSelectSortingComponent,
  KrdsAdditionalComponent as KrdsSelectStateComponent,
  KrdsAdditionalComponent as KrdsSideNavigationComponent,
  KrdsAdditionalComponent as KrdsSkipLinkComponent,
  KrdsAdditionalComponent as KrdsSpinnerComponent,
  KrdsAdditionalComponent as KrdsStepIndicatorComponent,
  KrdsAdditionalComponent as KrdsStructuredListComponent,
  KrdsAdditionalComponent as KrdsStructuredListTableComponent,
  KrdsAdditionalComponent as KrdsTabComponent,
  KrdsAdditionalComponent as KrdsTableComponent,
  KrdsAdditionalComponent as KrdsTagComponent,
  KrdsAdditionalComponent as KrdsTagLinkComponent,
  KrdsAdditionalComponent as KrdsTextareaComponent,
  KrdsAdditionalComponent as KrdsTextInputIconComponent,
  KrdsAdditionalComponent as KrdsTextInputSizeComponent,
  KrdsAdditionalComponent as KrdsTextInputStateComponent,
  KrdsAdditionalComponent as KrdsTextListComponent,
  KrdsAdditionalComponent as KrdsTextListOrderedComponent,
  KrdsAdditionalComponent as KrdsToggleSwitchComponent,
  KrdsAdditionalComponent as KrdsToggleSwitchSizeComponent,
  KrdsAdditionalComponent as KrdsTooltipComponent,
  KrdsAdditionalComponent as KrdsTooltipBoxComponent,
  KrdsAdditionalComponent as KrdsTooltipVerticalComponent,
  KrdsAdditionalComponent as KrdsTtsComponent,
  KrdsAdditionalComponent as KrdsTtsIconComponent,
  KrdsAdditionalComponent as KrdsTtsSizeComponent,
  KrdsAdditionalComponent as KrdsTutorialPanelComponent,
};
