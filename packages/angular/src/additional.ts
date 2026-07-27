import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'krds-additional',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (renderKind) {
      @case ('badge') {
        <span
          [class]="
            'krds-badge ' +
            (appearance === 'outline' ? 'outline-' : 'bg-') +
            tone +
            ' ' +
            size +
            (number ? ' number' : '')
          "
          >{{ label }}</span
        >
      }
      @case ('breadcrumb') {
        <nav class="krds-breadcrumb-wrap" aria-label="현재 경로">
          <ol>
            @for (item of items; track $index) {
              <li [class.home]="$index === 0">
                <a [href]="navHref(item)">{{ navLabel(item) }}</a>
              </li>
            }
          </ol>
        </nav>
      }
      @case ('accordion') {
        <div class="krds-accordion">
          @for (item of items; track $index) {
            <details class="krds-accordion-item">
              <summary class="krds-accordion-trigger">{{ navLabel(item) }}</summary>
              <div class="krds-accordion-panel">{{ itemDescription(item) }}</div>
            </details>
          }
        </div>
      }
      @case ('button-icon') {
        <button type="button" class="krds-btn icon" [attr.aria-label]="label">⌕</button>
      }
      @case ('button-text') {
        <button type="button" class="krds-btn text">{{ label }}</button>
      }
      @case ('button-with-icon') {
        <button type="button" class="krds-btn">
          {{ label }} <span aria-hidden="true">→</span>
        </button>
      }
      @case ('button-hierarchy') {
        <button
          [type]="type"
          class="krds-button"
          [disabled]="disabled"
          [attr.data-variant]="tone"
          [attr.data-size]="size"
        >
          {{ label }}
        </button>
      }
      @case ('calendar') {
        <label class="krds-field"
          ><span class="krds-field-label">{{ label }}</span
          ><input class="krds-input" type="date" [(ngModel)]="value" [id]="id" />
          @if (hint) {
            <span class="krds-field-message">{{ hint }}</span>
          }
        </label>
      }
      @case ('calendar-range') {
        <fieldset class="krds-calendar-area">
          <legend>{{ label }}</legend>
          <input type="date" aria-label="시작일" /><span aria-hidden="true">–</span
          ><input type="date" aria-label="종료일" />
        </fieldset>
      }
      @case ('carousel') {
        <section class="krds-carousel" aria-roledescription="carousel" [attr.aria-label]="label">
          <p aria-live="polite">{{ slideIndex + 1 }} / {{ slides.length || 1 }}</p>
          <h3>{{ slides[slideIndex]?.title || title }}</h3>
          <p>{{ slides[slideIndex]?.description }}</p>
          <button type="button" (click)="previousSlide()">이전</button
          ><button type="button" (click)="nextSlide()">다음</button>
        </section>
      }
      @case ('checkbox-chip') {
        <label class="krds-form-chip"
          ><input type="checkbox" [disabled]="disabled" [value]="value" /><span>{{
            label
          }}</span></label
        >
      }
      @case ('radio-chip') {
        <label class="krds-form-chip"
          ><input type="radio" [name]="name" [value]="value" /><span>{{ label }}</span></label
        >
      }
      @case ('coach-mark') {
        <aside class="krds-coach-mark" aria-label="따라하기 가이드">
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
          <button type="button">다음</button
          ><button type="button" (click)="open = false">닫기</button>
        </aside>
      }
      @case ('contextual-help') {
        <details class="krds-contextual-help">
          <summary>{{ label }}</summary>
          <div class="tooltip-txt">{{ description || message }}</div>
        </details>
      }
      @case ('critical-alerts') {
        <div class="krds-critical-alerts" role="alert">
          <ul>
            @for (item of items; track $index) {
              <li>{{ navLabel(item) }}</li>
            }
          </ul>
        </div>
      }
      @case ('disclosure') {
        <details class="krds-disclosure" [open]="open">
          <summary>{{ title }}</summary>
          <div class="expand-wrap">{{ description }}</div>
        </details>
      }
      @case ('file-upload') {
        <div class="krds-file-upload">
          <label
            >{{ label }}<input type="file" multiple (change)="fileNames = fileList($event)"
          /></label>
          @if (fileNames) {
            <p aria-live="polite">{{ fileNames }}</p>
          }
        </div>
      }
      @case ('footer') {
        <footer class="krds-footer">
          <strong>{{ organization }}</strong>
          @if (links.length) {
            <nav aria-label="하단 메뉴">
              <ul>
                @for (item of links; track $index) {
                  <li>
                    <a [href]="item.href || '#'">{{ item.label }}</a>
                  </li>
                }
              </ul>
            </nav>
          }
        </footer>
      }
      @case ('header') {
        <header class="krds-header">
          <a href="/">{{ title }}</a
          ><button
            type="button"
            [attr.aria-expanded]="open"
            [attr.aria-controls]="id + '-header-menu'"
            (click)="open = !open"
          >
            메뉴
          </button>
          <nav [id]="id + '-header-menu'" [hidden]="!open" aria-label="헤더 주 메뉴">
            @for (item of links; track $index) {
              <a [href]="item.href || '#'">{{ item.label }}</a>
            }
          </nav>
        </header>
      }
      @case ('help-panel') {
        <aside
          class="krds-help-panel"
          [hidden]="!open"
          [attr.aria-label]="kind === 'help-panel' ? '도움말 패널' : '튜토리얼 패널'"
        >
          <p>{{ description }}</p>
          <button type="button" (click)="open = false">접어두기</button>
        </aside>
      }
      @case ('identifier') {
        <div class="krds-identifier">
          <span class="logo" aria-hidden="true">◎</span><span>{{ organization }}</span
          ><small>{{ description }}</small>
        </div>
      }
      @case ('in-page-navigation') {
        <nav class="krds-in-page-navigation-area" aria-label="페이지 내비게이션">
          <strong>{{ title }}</strong>
          <ul>
            @for (item of links; track $index) {
              <li>
                <a [href]="item.href || '#'">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
      }
      @case ('language-switcher') {
        <label class="krds-language"
          ><span class="sr-only">언어 선택</span
          ><select [(ngModel)]="selected">
            @for (option of options; track option.value) {
              <option [value]="option.value" [disabled]="option.disabled">
                {{ option.label }}
              </option>
            }
          </select></label
        >
      }
      @case ('link') {
        <a class="krds-link" [href]="href">{{ label }}</a>
      }
      @case ('main-menu-mobile') {
        <nav class="krds-main-menu-mobile">
          <button
            type="button"
            [attr.aria-expanded]="open"
            [attr.aria-controls]="id + '-mobile-menu'"
            (click)="open = !open"
          >
            메뉴
          </button>
          <ul [id]="id + '-mobile-menu'" [hidden]="!open">
            @for (item of links; track $index) {
              <li>
                <a [href]="item.href || '#'">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
      }
      @case ('main-menu-pc') {
        <nav class="krds-main-menu" aria-label="주 메뉴">
          <ul>
            @for (item of links; track $index) {
              <li>
                <a [href]="item.href || '#'">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
      }
      @case ('masthead') {
        <div class="krds-masthead" role="note">
          {{ description || '이 누리집은 대한민국 공식 전자정부 누리집입니다.' }}
        </div>
      }
      @case ('modal') {
        <dialog class="krds-modal" [open]="open" [attr.aria-labelledby]="id + '-title'">
          <h2 [id]="id + '-title'">{{ title }}</h2>
          <p>{{ description }}</p>
          <button type="button" (click)="open = false">닫기</button>
        </dialog>
      }
      @case ('pagination') {
        <nav class="krds-pagination" aria-label="페이지 이동">
          <button type="button" [disabled]="current <= 1" (click)="current = current - 1">
            이전
          </button>
          <div class="page-links">
            @for (page of pages; track page) {
              <button
                type="button"
                [class.active]="page === current"
                [attr.aria-current]="page === current ? 'page' : null"
                (click)="current = page"
              >
                {{ page }}
              </button>
            }
          </div>
          <button type="button" (click)="current = current + 1">다음</button>
        </nav>
      }
      @case ('resize') {
        <label class="krds-resize"
          >화면크기<select [(ngModel)]="selected">
            <option value="100">기본</option>
            <option value="125">크게</option>
            <option value="150">가장 크게</option>
          </select></label
        >
      }
      @case ('select') {
        <label class="krds-field"
          ><span class="krds-field-label">{{ label }}</span
          ><select class="krds-form-select" [(ngModel)]="selected">
            @for (option of options; track option.value) {
              <option [value]="option.value" [disabled]="option.disabled">
                {{ option.label }}
              </option>
            }
          </select>
          @if (hint) {
            <span class="krds-field-message">{{ hint }}</span>
          }
        </label>
      }
      @case ('side-navigation') {
        <nav class="krds-side-navigation" aria-label="{{ title }}">
          <h2>{{ title }}</h2>
          <ul>
            @for (item of links; track $index) {
              <li>
                <a [href]="item.href || '#'">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
      }
      @case ('skip-link') {
        <div class="krds-skip-link">
          <a [href]="href">{{ label || '본문 바로가기' }}</a>
        </div>
      }
      @case ('spinner') {
        <output class="krds-spinner" aria-live="polite">⟳ {{ label || '처리 중' }}</output>
      }
      @case ('step-indicator') {
        <ol class="krds-step-wrap">
          @for (step of steps; track step.id) {
            <li
              [class.done]="$index < current"
              [attr.aria-current]="$index === current ? 'step' : null"
            >
              <span>{{ $index + 1 }}</span
              ><strong>{{ step.label }}</strong>
            </li>
          }
        </ol>
      }
      @case ('structured-list') {
        <ul class="krds-structured-list">
          @for (item of items; track $index) {
            <li>
              <strong>{{ navLabel(item) }}</strong>
            </li>
          }
        </ul>
      }
      @case ('table') {
        <div class="krds-table-wrap">
          <table>
            <caption>
              {{
                title
              }}
            </caption>
            <thead>
              <tr>
                @for (column of columns; track column.key) {
                  <th scope="col">{{ column.label }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track $index) {
                <tr>
                  @for (column of columns; track column.key; let columnIndex = $index) {
                    @if (columnIndex === 0) {
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
      }
      @case ('tab') {
        <div class="krds-tab-area">
          <div role="tablist">
            @for (tab of tabs; track tab.id) {
              <button
                type="button"
                role="tab"
                [id]="'tab-' + tab.id"
                [attr.aria-selected]="activeTab === tab.id"
                [attr.aria-controls]="'panel-' + tab.id"
                (click)="selected = tab.id"
              >
                {{ tab.label }}
              </button>
            }
          </div>
          @for (tab of tabs; track tab.id) {
            <section
              role="tabpanel"
              [id]="'panel-' + tab.id"
              [attr.aria-labelledby]="'tab-' + tab.id"
              [hidden]="activeTab !== tab.id"
            >
              {{ panels[tab.id] || (tab.id === activeTab ? description : '') }}
            </section>
          }
        </div>
      }
      @case ('tag') {
        <span class="krds-btn-tag" [class]="'krds-btn-tag bg-' + tone">{{ label }}</span>
      }
      @case ('tag-link') {
        <a class="krds-btn-tag link" [href]="href">{{ label }}</a>
      }
      @case ('textarea') {
        <label class="krds-field"
          ><span class="krds-field-label">{{ label }}</span
          ><textarea class="krds-input" [(ngModel)]="value" maxlength="100"></textarea
          ><span aria-live="polite">{{ value.length }}/100</span></label
        >
      }
      @case ('text-input-icon') {
        <div class="krds-input-with-icon">
          <input
            class="krds-input"
            [attr.aria-label]="label || '입력 보조 텍스트'"
            [(ngModel)]="value"
          /><button type="button" aria-label="입력 보조 기능">⌕</button>
        </div>
      }
      @case ('text-list') {
        <ul class="krds-info-list">
          @for (item of items; track $index) {
            <li>{{ navLabel(item) }}</li>
          }
        </ul>
      }
      @case ('text-list-ordered') {
        <ol class="krds-info-list">
          @for (item of items; track $index) {
            <li>{{ navLabel(item) }}</li>
          }
        </ol>
      }
      @case ('tooltip') {
        <span class="krds-tooltip-wrap"
          ><button
            type="button"
            class="krds-btn krds-tooltip"
            [attr.aria-describedby]="id + '-tip'"
          >
            {{ label }}</button
          ><span [id]="id + '-tip'" role="tooltip">{{ message }}</span></span
        >
      }
      @case ('tts') {
        <button
          type="button"
          class="krds-tts"
          [attr.aria-pressed]="playing"
          (click)="playing = !playing"
        >
          <span class="krds-tts-icon" aria-hidden="true">{{ playing ? '▶' : '🔊' }}</span
          >{{ label }}
        </button>
      }
      @case ('toggle-switch') {
        <div class="krds-form-toggle-switch">
          <input [id]="id" type="checkbox" [(ngModel)]="checked" [disabled]="disabled" /><label
            [for]="id"
            ><span class="switch-toggle" aria-hidden="true"><i></i></span>{{ label }}</label
          >
        </div>
      }
      @case ('radio-button') {
        <label class="krds-form-check"
          ><input type="radio" [name]="name" [value]="value" /><span>{{ label }}</span></label
        >
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
export class KrdsAdditionalComponent implements KrdsAdditionalProps {
  @Input() kind = 'surface';
  @Input() id = 'krds-additional';
  @Input() label = '레이블';
  @Input() title = '제목';
  @Input() description = '';
  @Input() hint = '';
  @Input() tone: KrdsTone = 'primary';
  @Input() appearance: 'outline' | 'solid' | 'light' = 'outline';
  @Input() size = 'medium';
  @Input() number = false;
  @Input() href = '#';
  @Input() message = '도움말';
  @Input() position = 'top';
  @Input() open = false;
  @Input() disabled = false;
  @Input() value = '';
  @Input() modelValue: string | number | boolean | string[] = '';
  @Input() name = '';
  @Input() required = false;
  @Input() readonly = false;
  @Input() organization = 'KRDS Community';
  @Input() current = 1;
  @Input() selected = '';
  @Input() checked = false;
  @Input() playing = false;
  @Input() options: KrdsOption[] = [];
  @Input() items: (KrdsNavItem | KrdsListItem | string)[] = [];
  @Input() links: KrdsNavItem[] = [];
  @Input() slides: KrdsCarouselSlide[] = [];
  @Input() tabs: KrdsTabItem[] = [];
  @Input() panels: Record<string, string> = {};
  @Input() steps: KrdsStep[] = [];
  @Input() columns: KrdsTableColumn[] = [];
  @Input() rows: KrdsTableRow[] = [];
  get renderKind(): string {
    const aliases: Record<string, string> = {
      'badge-number': 'badge',
      'badge-size': 'badge',
      'accordion-line': 'accordion',
      'button-size': 'button-hierarchy',
      'checkbox-size': 'checkbox-chip',
      'radio-size': 'radio-button',
      'carousel-banner': 'carousel',
      'date-input': 'calendar',
      'language-switcher-page': 'language-switcher',
      'modal-sample': 'modal',
      'select-size': 'select',
      'select-sorting': 'select',
      'select-state': 'select',
      'structured-list-table': 'table',
      'text-input-size': 'surface',
      'text-input-state': 'surface',
      'toggle-switch-size': 'toggle-switch',
      'tooltip-box': 'tooltip',
      'tooltip-vertical': 'tooltip',
      'tts-icon': 'tts',
      'tts-size': 'tts',
      'tutorial-panel': 'help-panel',
    };
    return aliases[this.kind] ?? this.kind;
  }
  get activeTab(): string {
    return this.selected || this.tabs[0]?.id || '';
  }
  pages = [1, 2, 3, 4, 5];
  slideIndex = 0;
  fileNames = '';
  navLabel(item: KrdsNavItem | KrdsListItem | string): string {
    return typeof item === 'string' ? item : 'label' in item ? item.label : item.title;
  }
  itemDescription(item: KrdsNavItem | KrdsListItem | string): string {
    return typeof item !== 'string' && 'description' in item
      ? (item.description ?? '')
      : this.description;
  }
  navHref(item: KrdsNavItem | KrdsListItem | string): string {
    return typeof item !== 'string' && 'href' in item ? item.href || '#' : '#';
  }
  previousSlide(): void {
    this.slideIndex =
      (this.slideIndex - 1 + Math.max(this.slides.length, 1)) % Math.max(this.slides.length, 1);
  }
  nextSlide(): void {
    this.slideIndex = (this.slideIndex + 1) % Math.max(this.slides.length, 1);
  }
  fileList(event: Event): string {
    return Array.from((event.target as HTMLInputElement).files ?? [])
      .map((file) => file.name)
      .join(', ');
  }
}

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
