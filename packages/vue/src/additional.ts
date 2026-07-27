import { computed, defineComponent, h, ref, useId, type PropType, type VNode } from 'vue';
import type {
  KrdsAdditionalProps,
  KrdsCarouselSlide,
  KrdsListItem,
  KrdsNavItem,
  KrdsOption,
  KrdsPaginationItem,
  KrdsStep,
  KrdsTableColumn,
  KrdsTableRow,
  KrdsTabItem,
  KrdsTone,
} from '@krds-community/recipes';

export type AdditionalProps = Omit<KrdsAdditionalProps, 'className' | 'modelValue'> & {
  modelValue?: string | number | boolean | string[];
  class?: string;
};
type AnyItem =
  NonNullable<KrdsAdditionalProps['items']>[number] | KrdsOption | KrdsStep | KrdsTabItem;
const create = h as unknown as (...args: unknown[]) => VNode;
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
const commonProps = {
  id: { type: String, default: undefined },
  label: { type: String, default: undefined },
  hint: { type: String, default: undefined },
  title: { type: String, default: undefined },
  description: { type: String, default: undefined },
  tone: { type: String as PropType<KrdsTone>, default: 'primary' },
  appearance: { type: String, default: 'outline' },
  size: { type: String, default: 'medium' },
  number: Boolean,
  items: { type: Array as PropType<AnyItem[]>, default: () => [] },
  options: { type: Array as PropType<KrdsOption[]>, default: () => [] },
  links: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
  slides: { type: Array as PropType<KrdsCarouselSlide[]>, default: () => [] },
  tabs: { type: Array as PropType<KrdsTabItem[]>, default: () => [] },
  steps: { type: Array as PropType<KrdsStep[]>, default: () => [] },
  panels: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  columns: { type: Array as PropType<KrdsTableColumn[]>, default: () => [] },
  rows: { type: Array as PropType<KrdsTableRow[]>, default: () => [] },
  modelValue: {
    type: [String, Number, Boolean, Array] as PropType<string | number | boolean | string[]>,
    default: '',
  },
  value: { type: [String, Number, Boolean], default: '' },
  current: { type: Number, default: 1 },
  open: Boolean,
  multiple: Boolean,
  state: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
  href: { type: String, default: '#' },
  message: { type: String, default: '' },
  position: { type: String, default: 'top' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: undefined },
  disabled: Boolean,
  required: Boolean,
  readonly: Boolean,
  organization: { type: String, default: 'KRDS Community' },
  text: { type: String, default: '레이블' },
  iconOnly: Boolean,
};

function children(slots: { default?: () => unknown[] }): VNode[] {
  return (slots.default?.() ?? []) as VNode[];
}
function itemLabel(item: AnyItem): string {
  if (typeof item === 'string') return item;
  const candidate = item as { label?: string; title?: string; id?: string };
  return candidate.label ?? candidate.title ?? candidate.id ?? '';
}
function navList(items: KrdsNavItem[]): VNode {
  return create(
    'ul',
    items.map((item) =>
      create('li', { key: item.id ?? item.label }, [
        item.href
          ? create(
              'a',
              { href: item.href, 'aria-current': item.current ? 'page' : undefined },
              item.label,
            )
          : create('button', { type: 'button', disabled: item.disabled }, item.label),
        item.children?.length ? navList(item.children) : null,
      ]),
    ),
  );
}

export function createAdditional(name: string, kind: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: commonProps,
    emits: [
      'update:modelValue',
      'change',
      'close',
      'openChange',
      'pageChange',
      'valueChange',
      'filesChange',
    ],
    setup(props, { attrs, emit, slots }) {
      const open = ref(props.open);
      const selected = ref(
        String((props.modelValue as string) || props.tabs[0]?.id || props.options[0]?.value || ''),
      );
      const index = ref(Math.max(0, props.current - 1));
      const value = ref(String(props.modelValue ?? ''));
      const checked = ref(Boolean(props.modelValue));
      const id = computed(() => props.id ?? `krds-${kind}-${useId()}`);
      const menuId = computed(() => `${id.value}-${kind}-menu`);
      const setValue = (next: string) => {
        value.value = next;
        emit('update:modelValue', next);
        emit('valueChange', next);
      };
      return () => {
        const className = attrs.class as string | undefined;
        if (kind === 'badge' || kind === 'badge-number' || kind === 'badge-size')
          return create(
            'span',
            {
              ...attrs,
              class: [
                'krds-badge',
                props.appearance === 'outline'
                  ? `outline-${tones[props.tone]}`
                  : `bg-${tones[props.tone]}`,
                props.size,
                props.number ? 'number' : '',
                className,
              ],
            },
            children(slots).length ? children(slots) : props.label,
          );
        if (kind === 'breadcrumb')
          return create(
            'nav',
            {
              ...attrs,
              class: ['krds-breadcrumb-wrap', className],
              'aria-label': props.label ?? '현재 경로',
            },
            create(
              'ol',
              props.items.map((item, i) =>
                create(
                  'li',
                  { key: i, class: i === 0 ? 'home' : '' },
                  create(
                    'a',
                    {
                      href: (item as KrdsNavItem).href ?? '#',
                      'aria-current': i === props.items.length - 1 ? 'page' : undefined,
                    },
                    itemLabel(item),
                  ),
                ),
              ),
            ),
          );
        if (kind === 'button-icon')
          return create(
            'button',
            {
              ...attrs,
              type: props.type,
              class: ['krds-btn', 'icon', props.size, className],
              'aria-label': props.label ?? props.text,
            },
            [create('span', { 'aria-hidden': 'true' }, children(slots))],
          );
        if (kind === 'button-text' || kind === 'button-with-icon')
          return create(
            'button',
            {
              ...attrs,
              type: props.type,
              class: ['krds-btn', kind === 'button-text' ? 'text' : '', className],
            },
            [
              children(slots).length ? children(slots) : (props.label ?? '버튼'),
              kind === 'button-with-icon' ? create('span', { 'aria-hidden': 'true' }, '→') : null,
            ],
          );
        if (kind === 'button-hierarchy' || kind === 'button-size')
          return create(
            'button',
            {
              ...attrs,
              type: props.type,
              disabled: props.disabled,
              class: ['krds-button', className],
              'data-variant': props.tone,
              'data-size': props.size,
            },
            children(slots).length ? children(slots) : (props.label ?? '버튼'),
          );
        if (kind === 'calendar' || kind === 'date-input')
          return create('label', { class: ['krds-field', className] }, [
            create('span', { class: 'krds-field-label' }, props.label ?? '날짜'),
            create('input', {
              ...attrs,
              id: id.value,
              type: 'date',
              value: value.value,
              onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
              class: 'krds-input',
            }),
            props.hint ? create('span', { class: 'krds-field-message' }, props.hint) : null,
          ]);
        if (kind === 'calendar-range')
          return create('fieldset', { ...attrs, class: ['krds-calendar-area', className] }, [
            create('legend', props.label ?? '기간 선택'),
            create('input', { type: 'date', 'aria-label': '시작일' }),
            ' – ',
            create('input', { type: 'date', 'aria-label': '종료일' }),
          ]);
        if (kind === 'carousel' || kind === 'carousel-banner') {
          const slides = props.slides;
          const slide = slides[index.value] ?? { id: 'empty', title: props.title ?? '슬라이드' };
          return create(
            'section',
            {
              ...attrs,
              class: ['krds-carousel', className],
              'aria-roledescription': 'carousel',
              'aria-label': props.label ?? '콘텐츠 캐러셀',
            },
            [
              create(
                'p',
                { 'aria-live': 'polite' },
                `${index.value + 1} / ${Math.max(slides.length, 1)}`,
              ),
              create('h3', slide.title),
              slide.description ? create('p', slide.description) : null,
              create('div', [
                create(
                  'button',
                  {
                    type: 'button',
                    'aria-label': '이전 슬라이드',
                    onClick: () => {
                      index.value = (index.value - 1 + slides.length) % slides.length;
                    },
                  },
                  '이전',
                ),
                create(
                  'button',
                  {
                    type: 'button',
                    'aria-label': '다음 슬라이드',
                    onClick: () => {
                      index.value = (index.value + 1) % slides.length;
                    },
                  },
                  '다음',
                ),
              ]),
            ],
          );
        }
        if (
          kind === 'checkbox-chip' ||
          kind === 'radio-chip' ||
          kind === 'checkbox-size' ||
          kind === 'radio-size'
        )
          return create('label', { ...attrs, class: ['krds-form-chip', className] }, [
            create('input', {
              type: kind.startsWith('radio') ? 'radio' : 'checkbox',
              name: attrs.name as string,
              value: props.value,
            }),
            create('span', children(slots).length ? children(slots) : props.label),
          ]);
        if (kind === 'coach-mark')
          return create(
            'aside',
            {
              ...attrs,
              class: ['krds-coach-mark', className],
              'aria-label': props.title ?? '따라하기 가이드',
            },
            [
              create('h2', props.title ?? '따라하기 가이드'),
              create('p', children(slots)),
              create('button', { type: 'button' }, '다음'),
              create('button', { type: 'button', onClick: () => emit('close') }, '닫기'),
            ],
          );
        if (kind === 'contextual-help')
          return create(
            'details',
            { ...attrs, class: ['krds-contextual-help', props.position, className] },
            [
              create('summary', props.label ?? '도움말'),
              create('div', { class: 'tooltip-txt' }, children(slots)),
            ],
          );
        if (kind === 'critical-alerts')
          return create(
            'div',
            { ...attrs, class: ['krds-critical-alerts', className], role: 'alert' },
            create(
              'ul',
              props.items.map((item, i) => create('li', { key: i }, itemLabel(item))),
            ),
          );
        if (kind === 'disclosure')
          return create(
            'details',
            {
              ...attrs,
              class: ['krds-disclosure', className],
              open: open.value,
              onToggle: (e: Event) => {
                open.value = (e.currentTarget as HTMLDetailsElement).open;
                emit('openChange', open.value);
              },
            },
            [
              create('summary', props.title ?? props.label ?? '내용 보기'),
              create('div', { class: 'expand-wrap' }, children(slots)),
            ],
          );
        if (kind === 'favicon')
          return create('link', {
            rel: 'icon',
            href: props.href,
            sizes: props.size ?? '32x32',
            type: 'image/png',
          });
        if (kind === 'file-upload')
          return create('div', { ...attrs, class: ['krds-file-upload', className] }, [
            create('label', [
              props.label ?? '파일 선택',
              create('input', {
                type: 'file',
                multiple: props.multiple,
                onChange: (e: Event) =>
                  emit('filesChange', Array.from((e.target as HTMLInputElement).files ?? [])),
              }),
            ]),
            children(slots),
          ]);
        if (kind === 'footer')
          return create('footer', { ...attrs, class: ['krds-footer', className] }, [
            create('strong', props.organization),
            props.links.length
              ? create('nav', { 'aria-label': '하단 메뉴' }, navList(props.links))
              : null,
          ]);
        if (kind === 'header' || kind === 'main-menu-mobile' || kind === 'main-menu-pc')
          return create(
            kind === 'header' ? 'header' : 'nav',
            {
              ...attrs,
              class: [
                kind === 'header'
                  ? 'krds-header'
                  : kind === 'main-menu-mobile'
                    ? 'krds-main-menu-mobile'
                    : 'krds-main-menu',
                className,
              ],
              'aria-label':
                kind === 'header'
                  ? '헤더 주 메뉴'
                  : kind === 'main-menu-mobile'
                    ? '모바일 메뉴 컨테이너'
                    : '데스크톱 메뉴 컨테이너',
            },
            [
              create('a', { href: '/' }, props.title ?? props.organization),
              create(
                'button',
                {
                  type: 'button',
                  'aria-expanded': open.value,
                  'aria-controls': menuId.value,
                  onClick: () => {
                    open.value = !open.value;
                  },
                },
                '메뉴',
              ),
              create(
                'nav',
                {
                  id: menuId.value,
                  hidden: !open.value && kind === 'main-menu-mobile',
                  'aria-label':
                    kind === 'header'
                      ? '헤더 주 메뉴'
                      : kind === 'main-menu-mobile'
                        ? '모바일 주 메뉴'
                        : '주 메뉴',
                },
                navList(props.links),
              ),
            ],
          );
        if (kind === 'help-panel' || kind === 'tutorial-panel')
          return create(
            'aside',
            {
              ...attrs,
              class: ['krds-help-panel', className],
              hidden: !open.value,
              'aria-label': props.title ?? '도움말',
            },
            [
              create('div', children(slots)),
              create(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    open.value = false;
                    emit('close');
                  },
                },
                '접어두기',
              ),
            ],
          );
        if (kind === 'identifier')
          return create('div', { ...attrs, class: ['krds-identifier', className] }, [
            create('span', { class: 'logo', 'aria-hidden': 'true' }, '◎'),
            create('span', props.organization),
            props.description ? create('small', props.description) : null,
          ]);
        if (kind === 'in-page-navigation')
          return create(
            'nav',
            {
              ...attrs,
              class: ['krds-in-page-navigation-area', className],
              'aria-label': props.title ?? '페이지 내비게이션',
            },
            [create('strong', props.title ?? '페이지 내비게이션'), navList(props.links)],
          );
        if (kind === 'language-switcher' || kind === 'language-switcher-page')
          return create('label', { ...attrs, class: ['krds-language', className] }, [
            create('span', { class: 'sr-only' }, '언어 선택'),
            create(
              'select',
              {
                value: selected.value,
                onChange: (e: Event) => {
                  selected.value = (e.target as HTMLSelectElement).value;
                  emit('update:modelValue', selected.value);
                },
              },
              props.options.map((o) =>
                create('option', { value: o.value, disabled: o.disabled }, o.label),
              ),
            ),
          ]);
        if (kind === 'link')
          return create(
            'a',
            {
              ...attrs,
              href: props.href,
              class: ['krds-link', className],
              target: attrs.target ?? undefined,
              rel: attrs.target ? 'noreferrer' : undefined,
            },
            [
              children(slots).length ? children(slots) : props.label,
              attrs.target ? create('span', { 'aria-hidden': 'true' }, ' ↗') : null,
            ],
          );
        if (kind === 'masthead')
          return create(
            'div',
            { ...attrs, class: ['krds-masthead', className], role: 'note' },
            props.description ?? '이 누리집은 대한민국 공식 전자정부 누리집입니다.',
          );
        if (kind === 'modal' || kind === 'modal-sample')
          return create(
            'dialog',
            {
              ...attrs,
              open: open.value,
              class: ['krds-modal', className],
              'aria-labelledby': `${id.value}-title`,
              onCancel: () => emit('close'),
            },
            [
              create('h2', { id: `${id.value}-title` }, props.title ?? '대화 상자'),
              create('div', children(slots)),
              create('button', { type: 'button', onClick: () => emit('close') }, '닫기'),
            ],
          );
        if (kind === 'pagination') {
          const nums = props.items.length ? props.items : [1, 2, 3, 4, 5];
          return create(
            'nav',
            { ...attrs, class: ['krds-pagination', className], 'aria-label': '페이지 이동' },
            [
              create(
                'button',
                {
                  type: 'button',
                  disabled: props.current <= 1,
                  onClick: () => emit('pageChange', props.current - 1),
                },
                '이전',
              ),
              create(
                'div',
                { class: 'page-links' },
                nums.map((item, i) =>
                  item === 'ellipsis'
                    ? create('span', { key: i }, '…')
                    : create(
                        'button',
                        {
                          key: i,
                          type: 'button',
                          class: item === props.current ? 'active' : '',
                          'aria-current': item === props.current ? 'page' : undefined,
                          onClick: () => emit('pageChange', item),
                        },
                        typeof item === 'number' ? item : itemLabel(item),
                      ),
                ),
              ),
              create(
                'button',
                { type: 'button', onClick: () => emit('pageChange', props.current + 1) },
                '다음',
              ),
            ],
          );
        }
        if (kind === 'resize')
          return create('label', { ...attrs, class: ['krds-resize', className] }, [
            '화면크기',
            create(
              'select',
              {
                onChange: (e: Event) => emit('valueChange', (e.target as HTMLSelectElement).value),
              },
              [create('option', '기본'), create('option', '크게'), create('option', '가장 크게')],
            ),
          ]);
        if (
          kind === 'select' ||
          kind === 'select-size' ||
          kind === 'select-state' ||
          kind === 'select-sorting'
        )
          return create('label', { ...attrs, class: ['krds-field', className] }, [
            create('span', { class: 'krds-field-label' }, props.label ?? '선택'),
            create(
              'select',
              {
                id: id.value,
                value: selected.value,
                class: [
                  'krds-form-select',
                  props.state === 'error' ? 'is-error' : '',
                  kind === 'select-sorting' ? 'krds-form-select-sort' : '',
                ],
                onChange: (e: Event) => {
                  selected.value = (e.target as HTMLSelectElement).value;
                  emit('update:modelValue', selected.value);
                },
              },
              props.options.map((option) =>
                create('option', { value: option.value, disabled: option.disabled }, option.label),
              ),
            ),
            props.hint ? create('span', { class: 'krds-field-message' }, props.hint) : null,
          ]);
        if (kind === 'side-navigation')
          return create(
            'nav',
            {
              ...attrs,
              class: ['krds-side-navigation', className],
              'aria-label': props.title ?? '메뉴',
            },
            [create('h2', props.title ?? '메뉴'), navList(props.links)],
          );
        if (kind === 'skip-link')
          return create(
            'div',
            { ...attrs, class: ['krds-skip-link', className] },
            create('a', { href: props.href }, props.label ?? '본문 바로가기'),
          );
        if (kind === 'spinner')
          return create(
            'output',
            { ...attrs, class: ['krds-spinner', className], 'aria-live': 'polite' },
            ['⟳ ', props.label ?? '처리 중'],
          );
        if (kind === 'step-indicator')
          return create(
            'ol',
            { ...attrs, class: ['krds-step-wrap', className] },
            props.steps.map((step, i) =>
              create(
                'li',
                {
                  key: step.id,
                  class: i < props.current ? 'done' : '',
                  'aria-current': i === props.current ? 'step' : undefined,
                },
                [
                  create('span', i + 1),
                  create('strong', step.label),
                  step.description ? create('small', step.description) : null,
                ],
              ),
            ),
          );
        if (kind === 'structured-list')
          return create(
            'ul',
            { ...attrs, class: ['krds-structured-list', className] },
            props.items.map((item, i) =>
              create('li', { key: i }, [
                create('strong', itemLabel(item)),
                create(
                  'p',
                  'description' in (item as object) ? (item as KrdsListItem).description : '',
                ),
              ]),
            ),
          );
        if (kind === 'structured-list-table' || kind === 'table')
          return create(
            'div',
            { ...attrs, class: ['krds-table-wrap', className] },
            create('table', [
              create('caption', props.title ?? '표'),
              create(
                'thead',
                create(
                  'tr',
                  props.columns.map((column) => create('th', { scope: 'col' }, column.label)),
                ),
              ),
              create(
                'tbody',
                props.rows.map((row, i) =>
                  create(
                    'tr',
                    { key: i },
                    props.columns.map((column, j) =>
                      j === 0
                        ? create('th', { scope: 'row' }, row[column.key])
                        : create('td', row[column.key]),
                    ),
                  ),
                ),
              ),
            ]),
          );
        if (kind === 'tab') {
          const active = selected.value || props.tabs[0]?.id || '';
          return create('div', { ...attrs, class: ['krds-tab-area', className] }, [
            create(
              'div',
              { role: 'tablist' },
              props.tabs.map((tab) =>
                create(
                  'button',
                  {
                    type: 'button',
                    role: 'tab',
                    'aria-selected': active === tab.id,
                    'aria-controls': `panel-${tab.id}`,
                    disabled: tab.disabled,
                    onClick: () => {
                      selected.value = tab.id;
                    },
                  },
                  tab.label,
                ),
              ),
            ),
            props.tabs.map((tab) =>
              create(
                'section',
                {
                  role: 'tabpanel',
                  id: `panel-${tab.id}`,
                  'aria-labelledby': `tab-${tab.id}`,
                  hidden: active !== tab.id,
                },
                props.panels[tab.id] ?? (tab.id === active ? children(slots) : ''),
              ),
            ),
          ]);
        }
        if (kind === 'tag' || kind === 'tag-link')
          return kind === 'tag-link'
            ? create(
                'a',
                { ...attrs, href: props.href, class: ['krds-btn-tag', 'link', className] },
                props.label ?? children(slots),
              )
            : create(
                'span',
                { ...attrs, class: ['krds-btn-tag', `bg-${tones[props.tone]}`, className] },
                props.label ?? children(slots),
              );
        if (kind === 'textarea')
          return create('label', { ...attrs, class: ['krds-field', className] }, [
            create('span', { class: 'krds-field-label' }, props.label ?? '내용'),
            create('textarea', {
              id: id.value,
              value: value.value,
              maxlength: 100,
              placeholder: props.placeholder,
              onInput: (e: Event) => setValue((e.target as HTMLTextAreaElement).value),
              class: 'krds-input',
            }),
            create('span', { 'aria-live': 'polite' }, `${value.value.length}/100`),
          ]);
        if (kind === 'text-input-icon')
          return create('div', { ...attrs, class: ['krds-input-with-icon', className] }, [
            create('input', {
              id: id.value,
              value: value.value,
              class: 'krds-input',
              'aria-label': props.label ?? '입력 보조 텍스트',
              onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
            }),
            create('button', { type: 'button', 'aria-label': '입력 보조 기능' }, '⌕'),
          ]);
        if (kind === 'text-list' || kind === 'text-list-ordered')
          return create(
            kind === 'text-list-ordered' ? 'ol' : 'ul',
            { ...attrs, class: ['krds-info-list', className] },
            props.items.map((item, i) => create('li', { key: i }, itemLabel(item))),
          );
        if (kind === 'tooltip' || kind === 'tooltip-box' || kind === 'tooltip-vertical')
          return create('span', { class: 'krds-tooltip-wrap' }, [
            create(
              'button',
              {
                ...attrs,
                type: 'button',
                class: ['krds-btn', 'krds-tooltip', className],
                'aria-describedby': `${id.value}-tip`,
              },
              children(slots).length ? children(slots) : (props.label ?? '도움말'),
            ),
            create('span', { id: `${id.value}-tip`, role: 'tooltip' }, props.message),
          ]);
        if (kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size')
          return create(
            'button',
            {
              ...attrs,
              type: 'button',
              class: ['krds-tts', className],
              'aria-pressed': checked.value,
              onClick: () => {
                checked.value = !checked.value;
              },
            },
            [
              create(
                'span',
                { class: 'krds-tts-icon', 'aria-hidden': 'true' },
                checked.value ? '▶' : '🔊',
              ),
              props.iconOnly
                ? create('span', { class: 'sr-only' }, props.text)
                : create('span', { class: 'krds-tts-text' }, props.text),
            ],
          );
        if (kind === 'toggle-switch' || kind === 'toggle-switch-size')
          return create(
            'div',
            { ...attrs, class: ['krds-form-toggle-switch', props.size, className] },
            [
              create('input', {
                id: id.value,
                type: 'checkbox',
                checked: checked.value,
                disabled: props.disabled,
                onChange: (e: Event) => {
                  checked.value = (e.target as HTMLInputElement).checked;
                  emit('update:modelValue', checked.value);
                },
              }),
              create('label', { for: id.value }, [
                create('span', { class: 'switch-toggle', 'aria-hidden': 'true' }, create('i')),
                props.label ?? '설정',
              ]),
            ],
          );
        if (kind === 'radio-button' || kind === 'radio-size')
          return create('label', { ...attrs, class: ['krds-form-check', className] }, [
            create('input', {
              type: 'radio',
              name: attrs.name,
              value: props.value,
              checked: props.modelValue === props.value,
            }),
            props.label ?? children(slots),
          ]);
        return create('div', { ...attrs, class: className }, children(slots));
      };
    },
  });
}

export const Badge = createAdditional('KrdsBadge', 'badge');
export const BadgeNumber = createAdditional('KrdsBadgeNumber', 'badge-number');
export const BadgeSize = createAdditional('KrdsBadgeSize', 'badge-size');
export const Breadcrumb = createAdditional('KrdsBreadcrumb', 'breadcrumb');
export const ButtonHierarchy = createAdditional('KrdsButtonHierarchy', 'button-hierarchy');
export const ButtonIcon = createAdditional('KrdsButtonIcon', 'button-icon');
export const ButtonSize = createAdditional('KrdsButtonSize', 'button-size');
export const ButtonText = createAdditional('KrdsButtonText', 'button-text');
export const ButtonWithIcon = createAdditional('KrdsButtonWithIcon', 'button-with-icon');
export const Calendar = createAdditional('KrdsCalendar', 'calendar');
export const CalendarRange = createAdditional('KrdsCalendarRange', 'calendar-range');
export const Carousel = createAdditional('KrdsCarousel', 'carousel');
export const CarouselBanner = createAdditional('KrdsCarouselBanner', 'carousel-banner');
export const CheckboxChip = createAdditional('KrdsCheckboxChip', 'checkbox-chip');
export const CheckboxSize = createAdditional('KrdsCheckboxSize', 'checkbox-size');
export const CoachMark = createAdditional('KrdsCoachMark', 'coach-mark');
export const ContextualHelp = createAdditional('KrdsContextualHelp', 'contextual-help');
export const CriticalAlerts = createAdditional('KrdsCriticalAlerts', 'critical-alerts');
export const DateInput = createAdditional('KrdsDateInput', 'date-input');
export const Disclosure = createAdditional('KrdsDisclosure', 'disclosure');
export const Favicon = createAdditional('KrdsFavicon', 'favicon');
export const FileUpload = createAdditional('KrdsFileUpload', 'file-upload');
export const Footer = createAdditional('KrdsFooter', 'footer');
export const Header = createAdditional('KrdsHeader', 'header');
export const HelpPanel = createAdditional('KrdsHelpPanel', 'help-panel');
export const Identifier = createAdditional('KrdsIdentifier', 'identifier');
export const InPageNavigation = createAdditional('KrdsInPageNavigation', 'in-page-navigation');
export const LanguageSwitcher = createAdditional('KrdsLanguageSwitcher', 'language-switcher');
export const LanguageSwitcherPage = createAdditional(
  'KrdsLanguageSwitcherPage',
  'language-switcher-page',
);
export const Link = createAdditional('KrdsLink', 'link');
export const MainMenuMobile = createAdditional('KrdsMainMenuMobile', 'main-menu-mobile');
export const MainMenuPc = createAdditional('KrdsMainMenuPc', 'main-menu-pc');
export const Masthead = createAdditional('KrdsMasthead', 'masthead');
export const Modal = createAdditional('KrdsModal', 'modal');
export const ModalSample = createAdditional('KrdsModalSample', 'modal-sample');
export const Pagination = createAdditional('KrdsPagination', 'pagination');
export const RadioButton = createAdditional('KrdsRadioButton', 'radio-button');
export const RadioChip = createAdditional('KrdsRadioChip', 'radio-chip');
export const RadioSize = createAdditional('KrdsRadioSize', 'radio-size');
export const Resize = createAdditional('KrdsResize', 'resize');
export const Select = createAdditional('KrdsSelect', 'select');
export const SelectSize = createAdditional('KrdsSelectSize', 'select-size');
export const SelectSorting = createAdditional('KrdsSelectSorting', 'select-sorting');
export const SelectState = createAdditional('KrdsSelectState', 'select-state');
export const SideNavigation = createAdditional('KrdsSideNavigation', 'side-navigation');
export const SkipLink = createAdditional('KrdsSkipLink', 'skip-link');
export const Spinner = createAdditional('KrdsSpinner', 'spinner');
export const StepIndicator = createAdditional('KrdsStepIndicator', 'step-indicator');
export const StructuredList = createAdditional('KrdsStructuredList', 'structured-list');
export const StructuredListTable = createAdditional(
  'KrdsStructuredListTable',
  'structured-list-table',
);
export const Tab = createAdditional('KrdsTab', 'tab');
export const Table = createAdditional('KrdsTable', 'table');
export const Tag = createAdditional('KrdsTag', 'tag');
export const TagLink = createAdditional('KrdsTagLink', 'tag-link');
export const Textarea = createAdditional('KrdsTextarea', 'textarea');
export const TextInputIcon = createAdditional('KrdsTextInputIcon', 'text-input-icon');
export const TextList = createAdditional('KrdsTextList', 'text-list');
export const TextListOrdered = createAdditional('KrdsTextListOrdered', 'text-list-ordered');
export const ToggleSwitch = createAdditional('KrdsToggleSwitch', 'toggle-switch');
export const ToggleSwitchSize = createAdditional('KrdsToggleSwitchSize', 'toggle-switch-size');
export const Tooltip = createAdditional('KrdsTooltip', 'tooltip');
export const TooltipBox = createAdditional('KrdsTooltipBox', 'tooltip-box');
export const TooltipVertical = createAdditional('KrdsTooltipVertical', 'tooltip-vertical');
export const Tts = createAdditional('KrdsTts', 'tts');
export const TtsIcon = createAdditional('KrdsTtsIcon', 'tts-icon');
export const TtsSize = createAdditional('KrdsTtsSize', 'tts-size');
export const TutorialPanel = createAdditional('KrdsTutorialPanel', 'tutorial-panel');
