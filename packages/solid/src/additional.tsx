import { For, Show, createSignal, mergeProps, splitProps, type JSX } from 'solid-js';
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

export type AdditionalProps = Omit<KrdsAdditionalProps, 'className'> &
  JSX.HTMLAttributes<HTMLElement> & { class?: string; target?: string; children?: JSX.Element };
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
type Item = NonNullable<KrdsAdditionalProps['items']>[number];
const labelOf = (item: Item) =>
  typeof item === 'string' ? item : 'label' in item ? item.label : item.title;

export function createAdditional(defaultKind: string) {
  return function Additional(rawProps: AdditionalProps) {
    const merged = mergeProps(
      {
        kind: defaultKind,
        label: '레이블',
        title: '제목',
        tone: 'primary' as KrdsTone,
        appearance: 'outline' as const,
        size: 'medium',
        id: `krds-${defaultKind}`,
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
      'value',
      'modelValue',
      'name',
      'target',
      'options',
      'items',
      'links',
      'slides',
      'tabs',
      'panels',
      'steps',
      'columns',
      'rows',
      'class',
      'children',
    ]);
    const [open, setOpen] = createSignal(Boolean(props.open));
    const [selected, setSelected] = createSignal(
      String(props.modelValue ?? props.options[0]?.value ?? props.tabs[0]?.id ?? ''),
    );
    const [index, setIndex] = createSignal(0);
    const [checked, setChecked] = createSignal(Boolean(props.modelValue));
    const [value, setValue] = createSignal(String(props.value ?? props.modelValue ?? ''));
    const updateInput = (
      event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement },
    ) => setValue(event.currentTarget.value);
    const nav = (items: KrdsNavItem[]) => (
      <ul>
        <For each={items}>
          {(item) => (
            <li>
              {item.href ? (
                <a href={item.href} aria-current={item.current ? 'page' : undefined}>
                  {item.label}
                </a>
              ) : (
                <button type="button" disabled={item.disabled}>
                  {item.label}
                </button>
              )}
              {item.children?.length ? nav(item.children) : null}
            </li>
          )}
        </For>
      </ul>
    );
    const children = () => props.children;
    const kind = props.kind;
    const menuId = () => `${props.id}-${kind}-menu`;
    return kind === 'badge' || kind === 'badge-number' || kind === 'badge-size' ? (
      <span
        {...(native as Record<string, unknown>)}
        class={`krds-badge ${props.appearance === 'outline' ? `outline-${tones[props.tone]}` : `bg-${props.tone === 'primary' ? 'primary' : tones[props.tone]}`} ${props.size} ${props.number ? 'number' : ''} ${props.class ?? ''}`}
      >
        {props.label}
      </span>
    ) : kind === 'breadcrumb' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={`krds-breadcrumb-wrap ${props.class ?? ''}`}
        aria-label="현재 경로"
      >
        <ol>
          <For each={props.items}>
            {(item, i) => (
              <li classList={{ home: i() === 0 }}>
                <a
                  href={typeof item !== 'string' && 'href' in item ? (item.href ?? '#') : '#'}
                  aria-current={i() === props.items.length - 1 ? 'page' : undefined}
                >
                  {labelOf(item)}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    ) : kind === 'button-icon' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={`krds-btn icon ${props.size} ${props.class ?? ''}`}
        aria-label={props.label}
      >
        <span aria-hidden="true">⌕</span>
      </button>
    ) : kind === 'button-text' || kind === 'button-with-icon' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={`krds-btn ${kind === 'button-text' ? 'text' : ''} ${props.class ?? ''}`}
      >
        {props.label}
        {kind === 'button-with-icon' ? ' →' : ''}
      </button>
    ) : kind === 'button-hierarchy' || kind === 'button-size' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        disabled={props.disabled}
        class={`krds-button ${props.class ?? ''}`}
        data-variant={props.tone}
        data-size={props.size}
      >
        {props.label}
      </button>
    ) : kind === 'calendar' || kind === 'date-input' ? (
      <label class={`krds-field ${props.class ?? ''}`}>
        <span class="krds-field-label">{props.label}</span>
        <input
          {...(native as Record<string, unknown>)}
          id={props.id}
          type="date"
          value={value()}
          onInput={updateInput}
          class="krds-input"
        />
        {props.hint ? <span class="krds-field-message">{props.hint}</span> : null}
      </label>
    ) : kind === 'calendar-range' ? (
      <fieldset
        {...(native as Record<string, unknown>)}
        class={`krds-calendar-area ${props.class ?? ''}`}
      >
        <legend>{props.label}</legend>
        <input type="date" aria-label="시작일" />
        <span aria-hidden="true">–</span>
        <input type="date" aria-label="종료일" />
      </fieldset>
    ) : kind === 'carousel' || kind === 'carousel-banner' ? (
      <section
        {...(native as Record<string, unknown>)}
        class={`krds-carousel ${props.class ?? ''}`}
        aria-roledescription="carousel"
        aria-label={props.label}
      >
        <p aria-live="polite">
          {index() + 1} / {Math.max(props.slides.length, 1)}
        </p>
        <h3>{props.slides[index()]?.title ?? props.title}</h3>
        <Show when={props.slides[index()]?.description}>
          <p>{props.slides[index()]?.description}</p>
        </Show>
        <button
          type="button"
          aria-label="이전 슬라이드"
          onClick={() => setIndex((index() - 1 + props.slides.length) % props.slides.length)}
        >
          이전
        </button>
        <button
          type="button"
          aria-label="다음 슬라이드"
          onClick={() => setIndex((index() + 1) % props.slides.length)}
        >
          다음
        </button>
      </section>
    ) : kind === 'checkbox-chip' ||
      kind === 'radio-chip' ||
      kind === 'checkbox-size' ||
      kind === 'radio-size' ? (
      <label {...(native as Record<string, unknown>)} class={`krds-form-chip ${props.class ?? ''}`}>
        <input
          type={kind.startsWith('radio') ? 'radio' : 'checkbox'}
          name={props.name}
          value={String(props.value ?? '')}
          disabled={props.disabled}
        />
        <span>{props.label}</span>
      </label>
    ) : kind === 'coach-mark' ? (
      <aside
        {...(native as Record<string, unknown>)}
        class={`krds-coach-mark ${props.class ?? ''}`}
        aria-label={props.title}
      >
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <button type="button">다음</button>
        <button type="button" onClick={() => setOpen(false)}>
          닫기
        </button>
      </aside>
    ) : kind === 'contextual-help' ? (
      <details
        {...(native as Record<string, unknown>)}
        class={`krds-contextual-help ${props.position} ${props.class ?? ''}`}
      >
        <summary>{props.label}</summary>
        <div class="tooltip-txt">{props.description ?? props.message}</div>
      </details>
    ) : kind === 'critical-alerts' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-critical-alerts ${props.class ?? ''}`}
        role="alert"
      >
        <ul>
          <For each={props.items}>{(item) => <li>{labelOf(item)}</li>}</For>
        </ul>
      </div>
    ) : kind === 'disclosure' ? (
      <details
        {...(native as Record<string, unknown>)}
        class={`krds-disclosure ${props.class ?? ''}`}
        open={open()}
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary>{props.title}</summary>
        <div class="expand-wrap">
          {props.description}
          {children()}
        </div>
      </details>
    ) : kind === 'favicon' ? (
      <link
        rel="icon"
        href={props.href}
        sizes={props.size === 'medium' ? '32x32' : props.size}
        type="image/png"
      />
    ) : kind === 'file-upload' ? (
      <div {...(native as Record<string, unknown>)} class={`krds-file-upload ${props.class ?? ''}`}>
        <label>
          {props.label}
          <input
            type="file"
            multiple
            onChange={(event) =>
              setValue(
                Array.from(event.currentTarget.files ?? [])
                  .map((file) => file.name)
                  .join(', '),
              )
            }
          />
        </label>
        <Show when={value()}>
          <p aria-live="polite">{value()}</p>
        </Show>
      </div>
    ) : kind === 'footer' ? (
      <footer {...(native as Record<string, unknown>)} class={`krds-footer ${props.class ?? ''}`}>
        <strong>{props.title}</strong>
        <Show when={props.links.length}>
          <nav aria-label="하단 메뉴">{nav(props.links)}</nav>
        </Show>
      </footer>
    ) : kind === 'header' || kind === 'main-menu-mobile' || kind === 'main-menu-pc' ? (
      <header
        {...(native as Record<string, unknown>)}
        class={`krds-${kind === 'header' ? 'header' : kind === 'main-menu-mobile' ? 'main-menu-mobile' : 'main-menu'} ${props.class ?? ''}`}
      >
        <a href="/">{props.title}</a>
        <button
          type="button"
          aria-expanded={open()}
          aria-controls={menuId()}
          onClick={() => setOpen(!open())}
        >
          메뉴
        </button>
        <nav
          id={menuId()}
          hidden={!open() && kind === 'main-menu-mobile'}
          aria-label={
            kind === 'header'
              ? '헤더 주 메뉴'
              : kind === 'main-menu-mobile'
                ? '모바일 주 메뉴'
                : '주 메뉴'
          }
        >
          {nav(props.links)}
        </nav>
      </header>
    ) : kind === 'help-panel' || kind === 'tutorial-panel' ? (
      <aside
        {...(native as Record<string, unknown>)}
        class={`krds-help-panel ${props.class ?? ''}`}
        hidden={!open()}
        aria-label={props.title}
      >
        <div>
          {props.description}
          {children()}
        </div>
        <button type="button" onClick={() => setOpen(false)}>
          접어두기
        </button>
      </aside>
    ) : kind === 'identifier' ? (
      <div {...(native as Record<string, unknown>)} class={`krds-identifier ${props.class ?? ''}`}>
        <span class="logo" aria-hidden="true">
          ◎
        </span>
        <span>{props.title}</span>
        <Show when={props.description}>
          <small>{props.description}</small>
        </Show>
      </div>
    ) : kind === 'in-page-navigation' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={`krds-in-page-navigation-area ${props.class ?? ''}`}
        aria-label={props.title}
      >
        <strong>{props.title}</strong>
        {nav(props.links)}
      </nav>
    ) : kind === 'language-switcher' || kind === 'language-switcher-page' ? (
      <label {...(native as Record<string, unknown>)} class={`krds-language ${props.class ?? ''}`}>
        <span class="sr-only">언어 선택</span>
        <select value={selected()} onChange={(event) => setSelected(event.currentTarget.value)}>
          <For each={props.options}>
            {(option) => (
              <option value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            )}
          </For>
        </select>
      </label>
    ) : kind === 'link' ? (
      <a
        {...(native as Record<string, unknown>)}
        href={props.href}
        class={`krds-link ${props.class ?? ''}`}
      >
        {props.label}
        {props.target ? ' ↗' : ''}
      </a>
    ) : kind === 'masthead' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-masthead ${props.class ?? ''}`}
        role="note"
      >
        {props.description ?? '이 누리집은 대한민국 공식 전자정부 누리집입니다.'}
      </div>
    ) : kind === 'modal' || kind === 'modal-sample' ? (
      <dialog
        {...(native as Record<string, unknown>)}
        class={`krds-modal ${props.class ?? ''}`}
        open={open()}
        aria-labelledby={`${props.id}-title`}
      >
        <h2 id={`${props.id}-title`}>{props.title}</h2>
        <div>
          {props.description}
          {children()}
        </div>
        <button type="button" onClick={() => setOpen(false)}>
          닫기
        </button>
      </dialog>
    ) : kind === 'pagination' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={`krds-pagination ${props.class ?? ''}`}
        aria-label="페이지 이동"
      >
        <button type="button" disabled={Number(props.modelValue) <= 1}>
          이전
        </button>
        <div class="page-links">
          <For each={[1, 2, 3, 4, 5]}>
            {(page) => (
              <button
                type="button"
                classList={{ active: page === Number(props.modelValue || 1) }}
                aria-current={page === Number(props.modelValue || 1) ? 'page' : undefined}
                onClick={() => setSelected(String(page))}
              >
                {page}
              </button>
            )}
          </For>
        </div>
        <button type="button">다음</button>
      </nav>
    ) : kind === 'resize' ? (
      <label {...(native as Record<string, unknown>)} class={`krds-resize ${props.class ?? ''}`}>
        화면크기
        <select value={selected()} onChange={(event) => setSelected(event.currentTarget.value)}>
          <option value="100">기본</option>
          <option value="125">크게</option>
          <option value="150">가장 크게</option>
        </select>
      </label>
    ) : kind === 'select' ||
      kind === 'select-size' ||
      kind === 'select-state' ||
      kind === 'select-sorting' ? (
      <label class={`krds-field ${props.class ?? ''}`}>
        <span class="krds-field-label">{props.label}</span>
        <select
          id={props.id}
          class={`krds-form-select ${kind === 'select-sorting' ? 'krds-form-select-sort' : ''}`}
          value={selected()}
          onChange={(event) => setSelected(event.currentTarget.value)}
        >
          <For each={props.options}>
            {(option) => (
              <option value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            )}
          </For>
        </select>
        <Show when={props.hint}>
          <span class="krds-field-message">{props.hint}</span>
        </Show>
      </label>
    ) : kind === 'side-navigation' ? (
      <nav
        {...(native as Record<string, unknown>)}
        class={`krds-side-navigation ${props.class ?? ''}`}
        aria-label={props.title}
      >
        <h2>{props.title}</h2>
        {nav(props.links)}
      </nav>
    ) : kind === 'skip-link' ? (
      <div {...(native as Record<string, unknown>)} class={`krds-skip-link ${props.class ?? ''}`}>
        <a href={props.href}>{props.label ?? '본문 바로가기'}</a>
      </div>
    ) : kind === 'spinner' ? (
      <output
        {...(native as Record<string, unknown>)}
        class={`krds-spinner ${props.class ?? ''}`}
        aria-live="polite"
      >
        ⟳ {props.label ?? '처리 중'}
      </output>
    ) : kind === 'step-indicator' ? (
      <ol {...(native as Record<string, unknown>)} class={`krds-step-wrap ${props.class ?? ''}`}>
        <For each={props.steps}>
          {(step, stepIndex) => (
            <li
              classList={{ done: stepIndex() < Number(props.modelValue || 0) }}
              aria-current={stepIndex() === Number(props.modelValue || 0) ? 'step' : undefined}
            >
              <span>{stepIndex() + 1}</span>
              <strong>{step.label}</strong>
            </li>
          )}
        </For>
      </ol>
    ) : kind === 'structured-list' ? (
      <ul
        {...(native as Record<string, unknown>)}
        class={`krds-structured-list ${props.class ?? ''}`}
      >
        <For each={props.items}>
          {(item) => (
            <li>
              <strong>{labelOf(item)}</strong>
              <Show when={typeof item !== 'string' && 'description' in item}>
                <p>{(item as KrdsListItem).description}</p>
              </Show>
            </li>
          )}
        </For>
      </ul>
    ) : kind === 'structured-list-table' || kind === 'table' ? (
      <div {...(native as Record<string, unknown>)} class={`krds-table-wrap ${props.class ?? ''}`}>
        <table>
          <caption>{props.title}</caption>
          <thead>
            <tr>
              <For each={props.columns}>{(column) => <th scope="col">{column.label}</th>}</For>
            </tr>
          </thead>
          <tbody>
            <For each={props.rows}>
              {(row) => (
                <tr>
                  <For each={props.columns}>
                    {(column, columnIndex) =>
                      columnIndex() === 0 ? (
                        <th scope="row">{row[column.key]}</th>
                      ) : (
                        <td>{row[column.key]}</td>
                      )
                    }
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    ) : kind === 'tab' ? (
      <div {...(native as Record<string, unknown>)} class={`krds-tab-area ${props.class ?? ''}`}>
        <div role="tablist">
          <For each={props.tabs}>
            {(tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={selected() === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setSelected(tab.id)}
              >
                {tab.label}
              </button>
            )}
          </For>
        </div>
        <For each={props.tabs}>
          {(tab) => (
            <section
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={selected() !== tab.id}
            >
              {props.panels[tab.id] ?? (tab.id === selected() ? props.description : '')}
            </section>
          )}
        </For>
      </div>
    ) : kind === 'tag' || kind === 'tag-link' ? (
      kind === 'tag-link' ? (
        <a
          {...(native as Record<string, unknown>)}
          href={props.href}
          class={`krds-btn-tag link ${props.class ?? ''}`}
        >
          {props.label}
        </a>
      ) : (
        <span
          {...(native as Record<string, unknown>)}
          class={`krds-btn-tag bg-${tones[props.tone]} ${props.class ?? ''}`}
        >
          {props.label}
        </span>
      )
    ) : kind === 'textarea' ? (
      <label class={`krds-field ${props.class ?? ''}`}>
        <span class="krds-field-label">{props.label}</span>
        <textarea
          id={props.id}
          class="krds-input"
          maxlength="100"
          value={value()}
          onInput={updateInput}
        ></textarea>
        <span aria-live="polite">{value().length}/100</span>
      </label>
    ) : kind === 'text-input-icon' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-input-with-icon ${props.class ?? ''}`}
      >
        <input
          id={props.id}
          class="krds-input"
          aria-label={props.label ?? '입력 보조 텍스트'}
          value={value()}
          onInput={updateInput}
        />
        <button type="button" aria-label="입력 보조 기능">
          ⌕
        </button>
      </div>
    ) : kind === 'text-list' || kind === 'text-list-ordered' ? (
      <ul {...(native as Record<string, unknown>)} class={`krds-info-list ${props.class ?? ''}`}>
        <For each={props.items}>{(item) => <li>{labelOf(item)}</li>}</For>
      </ul>
    ) : kind === 'tooltip' || kind === 'tooltip-box' || kind === 'tooltip-vertical' ? (
      <span class="krds-tooltip-wrap">
        <button
          {...(native as Record<string, unknown>)}
          type="button"
          class={`krds-btn krds-tooltip ${props.class ?? ''}`}
          aria-describedby={`${props.id}-tip`}
        >
          {props.label}
        </button>
        <span id={`${props.id}-tip`} role="tooltip">
          {props.message}
        </span>
      </span>
    ) : kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size' ? (
      <button
        {...(native as Record<string, unknown>)}
        type="button"
        class={`krds-tts ${props.class ?? ''}`}
        aria-pressed={checked()}
        onClick={() => setChecked(!checked())}
      >
        <span class="krds-tts-icon" aria-hidden="true">
          {checked() ? '▶' : '🔊'}
        </span>
        {kind === 'tts-icon' ? <span class="sr-only">{props.label}</span> : props.label}
      </button>
    ) : kind === 'toggle-switch' || kind === 'toggle-switch-size' ? (
      <div
        {...(native as Record<string, unknown>)}
        class={`krds-form-toggle-switch ${props.size} ${props.class ?? ''}`}
      >
        <input
          id={props.id}
          type="checkbox"
          checked={checked()}
          disabled={props.disabled}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <label for={props.id}>
          <span class="switch-toggle" aria-hidden="true">
            <i />
          </span>
          {props.label}
        </label>
      </div>
    ) : kind === 'radio-button' || kind === 'radio-size' ? (
      <label
        {...(native as Record<string, unknown>)}
        class={`krds-form-check ${props.class ?? ''}`}
      >
        <input type="radio" name={props.name} value={String(props.value ?? '')} />
        <span>{props.label}</span>
      </label>
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
