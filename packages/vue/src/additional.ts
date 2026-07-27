import {
  computed,
  defineComponent,
  Fragment,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
  type PropType,
  type VNode,
} from 'vue';
import type {
  KrdsAdditionalProps,
  KrdsCarouselSlide,
  KrdsListItem,
  KrdsNavItem,
  KrdsOption,
  KrdsStep,
  KrdsTableColumn,
  KrdsTabItem,
  KrdsTone,
} from '@krds-community/recipes';

export type AdditionalValue = string | number | boolean | string[];
export type AdditionalProps = Omit<
  KrdsAdditionalProps,
  'className' | 'items' | 'modelValue'
> &
  AdditionalPropsExtension & {
    items?: AnyItem[];
    modelValue?: AdditionalValue;
    defaultValue?: AdditionalValue;
    defaultOpen?: boolean;
    defaultChecked?: boolean;
    defaultSelected?: string;
    defaultCurrent?: number;
    class?: string;
  };
type AdditionalButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type AdditionalLanguage = KrdsOption & {
  href?: string;
  lang?: string;
  external?: boolean;
};
export interface AdditionalAlertItem {
  id?: string;
  badge: string;
  tone: 'danger' | 'ok' | 'info';
  text: string;
  href?: string;
  linkLabel?: string;
  badgeLabel?: string;
  label?: string;
}
export interface AdditionalStructuredListItem extends KrdsListItem {
  tone?: string;
  dateLabel?: string;
  date?: string;
  actionLabel?: string;
  tags?: string[];
}
export interface AdditionalLinkItem {
  label: string;
  href: string;
  target?: string;
  title?: string;
  icon?: string;
}
export interface AdditionalTabItem extends KrdsTabItem {
  panelId?: string;
  value?: string;
}
export interface AdditionalRelatedGroup {
  title: string;
  links: AdditionalLinkItem[];
}
export interface AdditionalTutorialTask {
  title: string;
  current?: boolean;
  summary: string;
  steps: string[];
}
export interface AdditionalMenuBanner {
  badge: string;
  label: string;
}
export interface AdditionalMenuDescriptionItem {
  title: string;
  description: string;
  href?: string;
  target?: string;
  externalTitle?: string;
}
export interface AdditionalMenuItem {
  id?: string;
  label: string;
  href?: string;
  target?: string;
  title?: string;
  current?: boolean;
  active?: boolean;
  disabled?: boolean;
  button?: boolean;
  titleHref?: string;
  titleLinkLabel?: string;
  banner?: AdditionalMenuBanner;
  descriptionItems?: AdditionalMenuDescriptionItem[];
  children?: AdditionalMenuItem[];
  kind?: 'link' | 'dropdown' | 'resize';
  items?: AdditionalMenuItem[];
  className?: string;
  selected?: boolean;
  resetLabel?: string;
  selectedLabel?: string;
}
export interface AdditionalFileItem {
  id: string;
  name: string;
  status: 'uploading' | 'complete' | 'deletable' | 'error' | 'downloadable';
  statusLabel?: string;
  deleteLabel?: string;
  errors?: string[];
  downloadLabel?: string;
  previewLabel?: string;
}
export interface AdditionalFooterLink {
  id?: string;
  label: string;
  href?: string;
  title?: string;
  target?: string;
  icon?: string;
  emphasis?: boolean;
}
export interface AdditionalFooterContact {
  title: string;
  description: string;
}
export interface AdditionalTableColumn extends KrdsTableColumn {
  width?: string;
  visuallyHidden?: boolean;
}
export type AdditionalTableRow = Record<string, string | number | boolean>;
export interface AdditionalAction {
  id?: string;
  label: string;
  icon?: string;
}
export interface AdditionalPagination {
  current: number;
  items: (number | 'ellipsis')[];
  previousDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  currentLabel?: string;
}
export interface AdditionalMyMenu {
  label: string;
  userName: string;
  timeLabel: string;
  time: string;
  extendLabel: string;
  items: AdditionalMenuItem[];
  logoutLabel: string;
}
export interface AdditionalMobileMenu {
  utilityItems: AdditionalMenuItem[];
  loginLabel: string;
  serviceItems: AdditionalMenuItem[];
  searchPlaceholder: string;
  searchTitle: string;
  searchLabel: string;
  items: AdditionalMenuItem[];
  previousLabel: string;
  closeLabel: string;
  bottomItems: AdditionalMenuItem[];
}
type AdditionalPropsExtension = {
  variant?: AdditionalButtonVariant;
  languages?: AdditionalLanguage[];
  nav?: KrdsNavItem[];
  error?: string;
  step?: string;
  type?: string;
  previousLabel?: string;
  nextLabel?: string;
  moreLabel?: string;
  imageLabel?: string;
  actionLabel?: string;
  playLabel?: string;
  stopLabel?: string;
  removable?: boolean;
  panelTitle?: string;
  external?: boolean;
  selectedLabel?: string;
  resetLabel?: string;
  pageTitle?: string;
  actionInfo?: string;
  actionCount?: string;
  dateLabel?: string;
  dateValue?: string;
  tags?: string[];
  shareLabel?: string;
  favoriteLabel?: string;
  previousDisabled?: boolean;
  stepTitle?: string;
  contentTitle?: string;
  currentStep?: string;
  totalSteps?: string;
  caption?: string;
  linkLabel?: string;
  closeLabel?: string;
  sizes?: string;
  activeTab?: string;
  helpTitle?: string;
  helpDescription?: string;
  downloadLinks?: AdditionalLinkItem[];
  relatedGroups?: AdditionalRelatedGroup[];
  tutorialTitle?: string;
  tutorialBackTitle?: string;
  tasks?: AdditionalTutorialTask[];
  collapseLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  utilityItems?: AdditionalMenuItem[];
  serviceItems?: AdditionalMenuItem[];
  bottomItems?: AdditionalMenuItem[];
  loginLabel?: string;
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: string;
  files?: AdditionalFileItem[];
  prompt?: string;
  inputId?: string;
  selectLabel?: string;
  currentCount?: number;
  maxCount?: number;
  deleteAllLabel?: string;
  relatedSites?: AdditionalFooterLink[];
  logoLabel?: string;
  address?: string;
  contacts?: AdditionalFooterContact[];
  socialLinks?: AdditionalFooterLink[];
  policyLinks?: AdditionalFooterLink[];
  copyright?: string;
  selectAllLabel?: string;
  actions?: AdditionalAction[];
  countLabel?: string;
  countOptions?: string[];
  sortLabel?: string;
  sortOptions?: string[];
  sortValue?: string;
  pagination?: AdditionalPagination;
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
  myMenu?: AdditionalMyMenu;
  desktopItems?: AdditionalMenuItem[];
  mobileMenu?: AdditionalMobileMenu;
  menuLabel?: string;
  sample?: boolean;
};

type AnyItem =
  | NonNullable<KrdsAdditionalProps['items']>[number]
  | AdditionalAlertItem
  | AdditionalStructuredListItem
  | AdditionalMenuItem
  | KrdsOption
  | KrdsStep
  | KrdsTabItem
  | number;
type NativeEventHandler = (event: Event) => unknown;
const withoutNativeEvents = (attrs: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith('on')));
const withoutClass = (attrs: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'));
const invokeNativeEvent = (listener: unknown, event: Event) => {
  if (typeof listener === 'function') {
    (listener as NativeEventHandler)(event);
  } else if (Array.isArray(listener)) {
    listener.forEach((candidate) => {
      if (typeof candidate === 'function') (candidate as NativeEventHandler)(event);
    });
  }
};
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
  size: { type: String, default: undefined },
  number: Boolean,
  items: { type: Array as PropType<AnyItem[]>, default: () => [] },
  options: { type: Array as PropType<KrdsOption[]>, default: () => [] },
  links: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
  slides: { type: Array as PropType<KrdsCarouselSlide[]>, default: () => [] },
  tabs: { type: Array as PropType<AdditionalTabItem[]>, default: () => [] },
  steps: { type: Array as PropType<KrdsStep[]>, default: () => [] },
  panels: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  languages: { type: Array as PropType<AdditionalLanguage[]>, default: () => [] },
  nav: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
  columns: { type: Array as PropType<AdditionalTableColumn[]>, default: () => [] },
  rows: { type: Array as PropType<AdditionalTableRow[]>, default: () => [] },
  modelValue: {
    type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Number, Boolean, Array] as PropType<AdditionalValue | undefined>,
    default: undefined,
  },
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
    default: undefined,
  },
  current: { type: Number, default: undefined },
  defaultCurrent: { type: Number, default: undefined },
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  multiple: Boolean,
  selected: { type: String, default: undefined },
  defaultSelected: { type: String, default: undefined },
  checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  defaultChecked: { type: Boolean, default: false },
  variant: {
    type: String as PropType<AdditionalButtonVariant | undefined>,
    default: undefined,
  },
  error: { type: String, default: undefined },
  step: { type: String, default: undefined },
  state: { type: String, default: 'default' },
  type: { type: String, default: undefined },
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
  playing: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  previousLabel: { type: String, default: undefined },
  nextLabel: { type: String, default: undefined },
  moreLabel: { type: String, default: undefined },
  imageLabel: { type: String, default: undefined },
  actionLabel: { type: String, default: undefined },
  playLabel: { type: String, default: undefined },
  stopLabel: { type: String, default: undefined },
  removable: Boolean,
  panelTitle: { type: String, default: undefined },
  external: Boolean,
  selectedLabel: { type: String, default: undefined },
  resetLabel: { type: String, default: undefined },
  pageTitle: { type: String, default: undefined },
  actionInfo: { type: String, default: undefined },
  actionCount: { type: String, default: undefined },
  dateLabel: { type: String, default: undefined },
  dateValue: { type: String, default: undefined },
  tags: { type: Array as PropType<string[]>, default: () => [] },
  shareLabel: { type: String, default: undefined },
  favoriteLabel: { type: String, default: undefined },
  previousDisabled: Boolean,
  stepTitle: { type: String, default: undefined },
  contentTitle: { type: String, default: undefined },
  currentStep: { type: String, default: undefined },
  totalSteps: { type: String, default: undefined },
  caption: { type: String, default: undefined },
  linkLabel: { type: String, default: undefined },
  closeLabel: { type: String, default: undefined },
  sizes: { type: String, default: undefined },
  activeTab: { type: String, default: undefined },
  helpTitle: { type: String, default: undefined },
  helpDescription: { type: String, default: undefined },
  downloadLinks: { type: Array as PropType<AdditionalLinkItem[]>, default: () => [] },
  relatedGroups: { type: Array as PropType<AdditionalRelatedGroup[]>, default: () => [] },
  tutorialTitle: { type: String, default: undefined },
  tutorialBackTitle: { type: String, default: undefined },
  tasks: { type: Array as PropType<AdditionalTutorialTask[]>, default: () => [] },
  collapseLabel: { type: String, default: undefined },
  cancelLabel: { type: String, default: undefined },
  confirmLabel: { type: String, default: undefined },
  utilityItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
  serviceItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
  bottomItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
  loginLabel: { type: String, default: undefined },
  searchPlaceholder: { type: String, default: undefined },
  searchTitle: { type: String, default: undefined },
  searchLabel: { type: String, default: undefined },
  files: { type: Array as PropType<AdditionalFileItem[]>, default: () => [] },
  prompt: { type: String, default: undefined },
  inputId: { type: String, default: undefined },
  selectLabel: { type: String, default: undefined },
  currentCount: { type: Number, default: undefined },
  maxCount: { type: Number, default: undefined },
  deleteAllLabel: { type: String, default: undefined },
  relatedSites: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
  logoLabel: { type: String, default: undefined },
  address: { type: String, default: undefined },
  contacts: { type: Array as PropType<AdditionalFooterContact[]>, default: () => [] },
  socialLinks: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
  policyLinks: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
  copyright: { type: String, default: undefined },
  selectAllLabel: { type: String, default: undefined },
  actions: { type: Array as PropType<AdditionalAction[]>, default: () => [] },
  countLabel: { type: String, default: undefined },
  countOptions: { type: Array as PropType<string[]>, default: () => [] },
  sortLabel: { type: String, default: undefined },
  sortOptions: { type: Array as PropType<string[]>, default: () => [] },
  sortValue: { type: String, default: undefined },
  pagination: { type: Object as PropType<AdditionalPagination | undefined>, default: undefined },
  years: { type: Array as PropType<number[]>, default: () => [] },
  disabledYears: { type: Array as PropType<number[]>, default: () => [] },
  leadingDays: { type: Number, default: 0 },
  previousMonthDayCount: { type: Number, default: 0 },
  dayCount: { type: Number, default: 0 },
  calendarLabel: { type: String, default: undefined },
  previousMonthLabel: { type: String, default: undefined },
  nextMonthLabel: { type: String, default: undefined },
  yearSelectLabel: { type: String, default: undefined },
  monthSelectLabel: { type: String, default: undefined },
  weekdays: { type: Array as PropType<string[]>, default: () => [] },
  todayLabel: { type: String, default: undefined },
  eventLabel: { type: String, default: undefined },
  year: { type: Number, default: undefined },
  month: { type: Number, default: undefined },
  disabledMonths: { type: Array as PropType<number[]>, default: () => [] },
  rangeStartDay: { type: Number, default: undefined },
  rangeEndDay: { type: Number, default: undefined },
  todayDay: { type: Number, default: undefined },
  eventDays: { type: Array as PropType<number[]>, default: () => [] },
  disabledDays: { type: Array as PropType<number[]>, default: () => [] },
  logoHref: { type: String, default: undefined },
  loginHref: { type: String, default: undefined },
  joinLabel: { type: String, default: undefined },
  allMenuLabel: { type: String, default: undefined },
  myMenu: { type: Object as PropType<AdditionalMyMenu | undefined>, default: undefined },
  desktopItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
  mobileMenu: { type: Object as PropType<AdditionalMobileMenu | undefined>, default: undefined },
  menuLabel: { type: String, default: undefined },
  sample: Boolean,
};

function children(slots: { default?: () => unknown[] }): VNode[] {
  return (slots.default?.() ?? []) as VNode[];
}
function itemLabel(item: AnyItem): string {
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  const candidate = item as { label?: string; title?: string; id?: string };
  return candidate.label ?? candidate.title ?? candidate.id ?? '';
}
function sideNavigationList(
  items: KrdsNavItem[],
  idPrefix: string,
  depth = 1,
): VNode {
  return create(
    'ul',
    {
      id: depth > 1 ? `${idPrefix}-menu` : undefined,
      class: depth === 1 ? 'lnb-list' : undefined,
      role: depth === 1 ? 'menubar' : 'menu',
    },
    items.map((item, itemIndex) => {
      const itemId = `${idPrefix}-${item.id ?? itemIndex}`;
      const hasChildren = Boolean(item.children?.length);
      return create(
        'li',
        {
          key: item.id ?? item.label,
          class: [depth === 1 ? 'lnb-item' : 'lnb-subitem', item.current ? 'active' : undefined],
          role: 'none',
        },
        [
          hasChildren
            ? create(
                'button',
                {
                  type: 'button',
                  class: ['lnb-btn', depth === 1 ? 'lnb-toggle' : 'lnb-toggle-popup'],
                  role: 'menuitem',
                  'aria-expanded': item.current ?? false,
                  'aria-controls': `${itemId}-menu`,
                },
                item.label,
              )
            : create(
                'a',
                {
                  href: item.href,
                  class: ['lnb-btn', 'lnb-link'],
                  role: 'menuitem',
                  'aria-current': item.current ? 'page' : undefined,
                },
                item.label,
              ),
          hasChildren
            ? create(
                'div',
                { class: depth === 1 ? 'lnb-submenu' : 'lnb-submenu-lv2' },
                sideNavigationList(item.children ?? [], itemId, depth + 1),
              )
            : null,
        ],
      );
    }),
  );
}
function textList(
  items: AnyItem[],
  ordered: boolean,
  depth = 1,
  rootAttrs?: Record<string, unknown>,
): VNode {
  const unorderedStyles = ['decimal', 'dash', 'hollow'];
  return create(
    ordered ? 'ol' : 'ul',
    {
      ...(depth === 1 ? rootAttrs : undefined),
      class: [
        'krds-info-list',
        ordered ? 'ordered' : unorderedStyles[Math.min(depth - 1, unorderedStyles.length - 1)],
        depth === 1 ? rootAttrs?.class : undefined,
      ],
      role: 'list',
    },
    items.map((item, itemIndex) => {
      const nestedItems =
        typeof item === 'object' && item !== null && 'children' in item
          ? ((item as KrdsNavItem).children ?? [])
          : [];
      const marker =
        depth === 1
          ? `${itemIndex + 1}.`
          : depth === 2
            ? `${String.fromCharCode(97 + itemIndex)}.`
            : String.fromCodePoint(0x2460 + itemIndex);
      return create('li', { key: itemIndex, role: 'listitem' }, [
        ordered ? create('span', { class: 'num' }, marker) : null,
        itemLabel(item),
        nestedItems.length ? textList(nestedItems, ordered, depth + 1) : null,
      ]);
    }),
  );
}
function desktopMenuBanner(banner: AdditionalMenuBanner | undefined): VNode | null {
  if (!banner) return null;
  return create('div', { class: 'gnb-sub-banner' }, [
    create('span', { class: ['krds-badge', 'bg-secondary'] }, banner.badge),
    create('button', { type: 'button', class: ['krds-btn', 'medium', 'text'] }, [
      banner.label,
      create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
    ]),
  ]);
}
function desktopMenuSubList(
  item: AdditionalMenuItem,
  single = false,
  panelId?: string,
  active = item.active ?? false,
  between = single,
): VNode {
  return create(
    'div',
    {
      id: single ? undefined : panelId,
      class: [
        'gnb-sub-list',
        active ? 'active' : undefined,
        between ? 'between' : undefined,
        single ? 'single-list' : undefined,
      ],
    },
    [
      create('div', { class: 'gnb-sub-content' }, [
        item.title
          ? create('h2', { class: 'sub-title' }, [
              item.titleHref ? item.title : create('span', item.title),
              item.titleHref
                ? create(
                    'a',
                    {
                      class: ['krds-btn', 'small', 'basic', 'link'],
                      href: item.titleHref,
                    },
                    [
                      create(
                        'span',
                        { class: 'underline' },
                        item.titleLinkLabel ?? item.title,
                      ),
                      create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                    ],
                  )
                : null,
            ])
          : null,
        item.descriptionItems?.length
          ? create(
              'ul',
              { class: 'type-description' },
              item.descriptionItems.map((description) =>
                create('li', { key: description.title }, [
                  create('h3', { class: 'tit' }, [
                    create(
                      'a',
                      {
                        href: description.href,
                        target: description.target,
                        title: description.externalTitle,
                      },
                      [
                        description.title,
                        create('i', { class: ['svg-icon', 'ico-go'] }),
                      ],
                    ),
                  ]),
                  create('p', { class: 'txt' }, description.description),
                ]),
              ),
            )
          : create(
              'ul',
              (item.children ?? []).map((child) =>
                create('li', { key: child.id ?? child.label }, [
                  child.href
                    ? create(
                        'a',
                        {
                          href: child.href,
                          target: child.target,
                          title: child.title,
                        },
                        child.label,
                      )
                    : create(
                        'button',
                        { type: 'button', disabled: child.disabled },
                        child.label,
                      ),
                ]),
              ),
            ),
      ]),
      desktopMenuBanner(item.banner),
    ],
  );
}
function desktopMainMenu(
  items: AdditionalMenuItem[],
  rootId: string,
  listLabel?: string,
  initializeSubmenus = false,
): VNode {
  return create(
    'ul',
    { class: 'gnb-menu', 'aria-label': listLabel },
    items.map((item, itemIndex) => {
      const panelId = `${rootId}-main-${itemIndex}`;
      return create('li', { key: item.id ?? item.label }, [
        item.children?.length
          ? create(
              'button',
              {
                type: 'button',
                class: ['gnb-main-trigger', item.active ? 'active' : undefined],
                'data-trigger': 'gnb',
                'aria-haspopup': 'true',
                'aria-expanded': item.active ? 'true' : 'false',
                'aria-controls': panelId,
              },
              item.label,
            )
          : item.button
            ? create(
                'button',
                {
                  type: 'button',
                  class: ['gnb-main-trigger', 'is-link'],
                  'data-trigger': 'gnb',
                },
                item.label,
              )
            : create(
                'a',
                {
                  href: item.href,
                  target: item.target,
                  title: item.title,
                  class: [
                    'gnb-main-trigger',
                    'is-link',
                    item.target ? 'external-link' : undefined,
                  ],
                  'data-trigger': 'gnb',
                },
                item.label,
              ),
        item.children?.length
          ? create(
              'div',
              {
                id: panelId,
                class: ['gnb-toggle-wrap', item.active ? 'is-open' : undefined],
              },
              create(
                'div',
                {
                  class: 'gnb-main-list',
                  'data-has-submenu': item.banner ? undefined : 'true',
                },
                item.banner
                  ? desktopMenuSubList(item, true)
                  : create(
                      'ul',
                      item.children.map((child, childIndex) => {
                        const childPanelId = `${rootId}-sub-${itemIndex}-${childIndex}`;
                        const childActive =
                          child.active ?? (initializeSubmenus && childIndex === 0);
                        const childIsLink =
                          child.href &&
                          !child.children?.length &&
                          !child.descriptionItems?.length;
                        return create('li', { key: child.id ?? child.label }, [
                          childIsLink
                            ? create(
                                'a',
                                {
                                  href: child.href,
                                  target: child.target,
                                  title: child.title,
                                  class: [
                                    'gnb-sub-trigger',
                                    'is-link',
                                    child.target ? 'external-link' : undefined,
                                  ],
                                  'data-trigger': 'gnb',
                                },
                                child.label,
                              )
                            : create(
                                'button',
                                {
                                  type: 'button',
                                  class: [
                                    'gnb-sub-trigger',
                                    childActive ? 'active' : undefined,
                                  ],
                                  'data-trigger': 'gnb',
                                  'aria-haspopup': 'true',
                                  'aria-expanded': childActive ? 'true' : 'false',
                                  'aria-controls': childPanelId,
                                },
                                child.label,
                              ),
                          childIsLink
                            ? null
                            : desktopMenuSubList(
                                child,
                                false,
                                childPanelId,
                                childActive,
                                childIndex > 0,
                              ),
                        ]);
                      }),
                    ),
              ),
            )
          : null,
      ]);
    }),
  );
}
function headerUtilityItem(item: AdditionalMenuItem): VNode {
  if (item.kind === 'link')
    return create('a', {
      class: ['krds-btn', 'small', 'text'],
      href: item.href,
      target: item.target,
      title: item.title,
    }, [
      item.label,
      create('i', { class: ['svg-icon', 'ico-go'] }),
    ]);
  const resize = item.kind === 'resize';
  return create('div', { class: ['krds-drop-wrap', resize ? 'krds-resize' : undefined] }, [
    create(
      'button',
      {
        type: 'button',
        class: ['krds-btn', 'small', 'text', 'drop-btn'],
      },
      [
        item.label,
        create('i', { class: ['svg-icon', 'ico-toggle'] }),
      ],
    ),
    create('div', { class: 'drop-menu' }, [
      create('div', { class: 'drop-in' }, [
        create(
          'ul',
          { class: 'drop-list' },
          (item.items ?? []).map((option) =>
            create('li', { key: option.id ?? option.label }, [
              resize
                ? create(
                    'button',
                    {
                      type: 'button',
                      class: [
                        'item-link',
                        option.className,
                        option.selected ? 'active' : undefined,
                      ],
                    },
                    [
                      option.label,
                      create(
                        'span',
                        { class: 'sr-only' },
                        option.selected ? item.selectedLabel : undefined,
                      ),
                    ],
                  )
                : create(
                    'a',
                    {
                      class: ['item-link', option.className],
                      href: option.href,
                      target: option.target,
                      title: option.title,
                    },
                    [option.label, create('span', { class: 'sr-only' })],
                  ),
            ]),
          ),
        ),
        resize
          ? create('div', { class: 'drop-bottom' }, [
              create(
                'button',
                { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                [
                  create('i', { class: ['svg-icon', 'ico-reset'] }),
                  item.resetLabel,
                ],
              ),
            ])
          : null,
      ]),
    ]),
  ]);
}
function headerMyMenu(menu: AdditionalMyMenu): VNode {
  return create('div', { class: ['krds-drop-wrap', 'my-drop'] }, [
    create(
      'button',
      {
        type: 'button',
        class: ['btn-navi', 'drop-btn', 'my'],
      },
      menu.label,
    ),
    create('div', { class: 'drop-menu' }, [
      create('div', { class: 'drop-in' }, [
        create('div', { class: 'drop-top' }, [
          create('p', { class: 'my-name' }, menu.userName),
          create('dl', { class: 'my-time' }, [
            create('dt', menu.timeLabel),
            create('dd', [
              create('span', { class: 'time' }, menu.time),
              create(
                'button',
                { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                menu.extendLabel,
              ),
            ]),
          ]),
        ]),
        create(
          'ul',
          { class: 'drop-list' },
          menu.items.map((item) =>
            create('li', { key: item.id ?? item.label }, [
              create('a', { class: 'item-link', href: item.href }, [
                item.label,
                create('span', { class: 'sr-only' }),
              ]),
            ]),
          ),
        ),
        create('div', { class: 'drop-bottom' }, [
          create(
            'button',
            { type: 'button', class: ['krds-btn', 'medium', 'text'] },
            [
              create('i', { class: ['svg-icon', 'ico-logout'] }),
              menu.logoutLabel,
            ],
          ),
        ]),
      ]),
    ]),
  ]);
}
function mobileNestedMenu(
  items: AdditionalMenuItem[],
  previousLabel: string | undefined,
  closeLabel: string | undefined,
): VNode {
  return create(
    'ul',
    items.map((item) =>
      create('li', { key: item.id ?? item.label }, [
        create(
          'a',
          {
            href: item.href,
            class: [
              'depth3-trigger',
              item.children?.length ? 'has-depth4' : undefined,
            ],
          },
          item.label,
        ),
        item.children?.length
          ? create('div', { class: 'depth4-wrap' }, [
              create('div', { class: 'depth4-head' }, [
                create(
                  'button',
                  { type: 'button', class: ['krds-btn', 'icon', 'trigger-prev'] },
                  [
                    create('span', { class: 'sr-only' }, previousLabel),
                    create('i', { class: ['svg-icon', 'ico-angle', 'left'] }),
                  ],
                ),
                create(
                  'button',
                  { type: 'button', class: ['krds-btn', 'icon', 'trigger-close'] },
                  [
                    create('span', { class: 'sr-only' }, closeLabel),
                    create('i', { class: ['svg-icon', 'ico-popup-close'] }),
                  ],
                ),
              ]),
              create('ul', { class: 'depth4-body' }, [
                item.title ? create('h4', { class: 'sub-title' }, item.title) : null,
                create(
                  'ul',
                  { class: 'depth4-ul' },
                  item.children.map((child) =>
                    create('li', { key: child.id ?? child.label }, [
                      create('a', { href: child.href }, child.label),
                    ]),
                  ),
                ),
              ]),
            ])
          : null,
      ]),
    ),
  );
}

function mobileMenuMarkup(
  data: AdditionalMobileMenu,
  rootId: string,
  attrs: Record<string, unknown>,
  className: string | undefined,
  visible: boolean,
  onClose: () => void,
): VNode {
  return create(
    'div',
    {
      ...attrs,
      id: rootId,
      class: ['krds-main-menu-mobile', className],
      role: visible ? 'navigation' : undefined,
      style: visible ? attrs.style : 'display: none;',
    },
    [
      create('div', { class: 'gnb-wrap' }, [
        create('div', { class: 'gnb-header' }, [
          create('div', { class: 'gnb-utils' }, [
            create(
              'ul',
              { class: 'utility-list' },
              data.utilityItems.map((item) =>
                create('li', { key: item.id ?? item.label }, [
                  create(
                    'button',
                    { type: 'button', class: ['krds-btn', 'text', 'xsmall'] },
                    item.label,
                  ),
                ]),
              ),
            ),
          ]),
          create('div', { class: 'gnb-login' }, [
            create('button', { type: 'button', class: ['krds-btn', 'large', 'text'] }, [
              create('i', { class: ['svg-icon', 'ico-log'] }),
              data.loginLabel,
            ]),
          ]),
          create(
            'div',
            { class: 'gnb-service-menu' },
            data.serviceItems.map((item) =>
              create(
                'a',
                { key: item.id ?? item.label, class: 'link', href: item.href },
                item.label,
              ),
            ),
          ),
          create('div', { class: 'sch-input' }, [
            create('input', {
              type: 'text',
              class: 'krds-input',
              placeholder: data.searchPlaceholder,
              title: data.searchTitle,
            }),
            create(
              'button',
              { type: 'button', class: ['krds-btn', 'icon', 'medium', 'ico-search'] },
              [
                create('span', { class: 'sr-only' }, data.searchLabel),
                create('i', { class: ['svg-icon', 'ico-sch'] }),
              ],
            ),
          ]),
        ]),
        create('div', { class: 'gnb-body' }, [
          create('div', { class: 'gnb-menu' }, [
            create('div', { class: 'menu-wrap' }, [
              create(
                'ul',
                { role: 'tablist' },
                data.items.map((item, itemIndex) => {
                  const triggerId = `${rootId}-trigger-${itemIndex}`;
                  const panelId = item.id ?? `${rootId}-panel-${itemIndex}`;
                  return create('li', { key: item.id ?? item.label, role: 'none' }, [
                    create(
                      'a',
                      {
                        id: triggerId,
                        class: ['gnb-main-trigger', itemIndex === 0 ? 'active' : undefined],
                        href: item.href ?? `#${panelId}`,
                        role: 'tab',
                        'aria-selected': itemIndex === 0 ? 'true' : 'false',
                        'aria-controls': panelId,
                      },
                      item.label,
                    ),
                  ]);
                }),
              ),
            ]),
            create(
              'div',
              { class: 'submenu-wrap' },
              data.items.map((item, itemIndex) => {
                const triggerId = `${rootId}-trigger-${itemIndex}`;
                const panelId = item.id ?? `${rootId}-panel-${itemIndex}`;
                return create(
                  'div',
                  {
                    key: item.id ?? item.label,
                    id: panelId,
                    class: 'gnb-sub-list',
                    role: 'tabpanel',
                    'aria-labelledby': triggerId,
                  },
                  [
                    create('h2', { class: 'sub-title' }, item.label),
                    create(
                      'ul',
                      (item.children ?? []).map((child) =>
                        create('li', { key: child.id ?? child.label }, [
                          create(
                            'a',
                            {
                              class: [
                                'gnb-sub-trigger',
                                child.children?.length ? 'has-depth3' : undefined,
                              ],
                              href: child.href,
                              'aria-expanded': child.children?.length ? 'false' : undefined,
                            },
                            child.label,
                          ),
                          child.children?.length
                            ? create(
                                'div',
                                { class: 'depth3-wrap' },
                                mobileNestedMenu(
                                  child.children,
                                  data.previousLabel,
                                  data.closeLabel,
                                ),
                              )
                            : null,
                        ]),
                      ),
                    ),
                  ],
                );
              }),
            ),
          ]),
          create(
            'div',
            { class: 'gnb-bottom' },
            data.bottomItems.map((item) =>
              create(
                'a',
                {
                  key: item.id ?? item.label,
                  class: ['krds-btn', 'medium', 'text'],
                  href: item.href,
                  target: item.target,
                  title: item.title,
                },
                [
                  item.label,
                  create('i', {
                    class: [
                      'svg-icon',
                      item.target ? 'ico-go' : 'ico-angle',
                      item.target ? undefined : 'right',
                    ],
                  }),
                ],
              ),
            ),
          ),
        ]),
        create(
          'button',
          {
            id: `${rootId}-close`,
            type: 'button',
            class: ['krds-btn', 'icon', 'medium'],
            onClick: onClose,
          },
          [
            create('span', { class: 'sr-only' }, data.closeLabel),
            create('i', { class: ['svg-icon', 'ico-popup-close'] }),
          ],
        ),
      ]),
    ],
  );
}
interface CalendarRenderData {
  id?: string | undefined;
  years: number[];
  disabledYears: number[];
  leadingDays: number;
  previousMonthDayCount: number;
  dayCount: number;
  calendarLabel?: string | undefined;
  previousMonthLabel?: string | undefined;
  nextMonthLabel?: string | undefined;
  yearSelectLabel?: string | undefined;
  monthSelectLabel?: string | undefined;
  weekdays: string[];
  todayLabel?: string | undefined;
  cancelLabel?: string | undefined;
  confirmLabel?: string | undefined;
  eventLabel?: string | undefined;
  year?: number | undefined;
  month?: number | undefined;
  disabledMonths: number[];
  rangeStartDay?: number | undefined;
  rangeEndDay?: number | undefined;
  todayDay?: number | undefined;
  eventDays: number[];
  disabledDays: number[];
}
function calendarMarkup(
  data: CalendarRenderData,
  kind: string,
  rootId: string,
  attrs: Record<string, unknown>,
  className: string | undefined,
): VNode {
  const year = data.year ?? data.years[0] ?? 0;
  const month = data.month ?? 1;
  const yearListId = `${rootId}-year`;
  const monthListId = `${rootId}-month`;
  const pad = (value: number) => String(value).padStart(2, '0');
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const cells = Array.from({ length: 42 }, (_, cellIndex) => {
    const currentOffset = cellIndex - data.leadingDays;
    const old = currentOffset < 0;
    const next = currentOffset >= data.dayCount;
    const day = old
      ? data.previousMonthDayCount + currentOffset + 1
      : next
        ? currentOffset - data.dayCount + 1
        : currentOffset + 1;
    const cellYear = old ? previousYear : next ? nextYear : year;
    const cellMonth = old ? previousMonth : next ? nextMonth : month;
    const current = !old && !next;
    const period =
      current &&
      data.rangeStartDay !== undefined &&
      data.rangeEndDay !== undefined &&
      day >= data.rangeStartDay &&
      day <= data.rangeEndDay;
    const event = current && data.eventDays.includes(day);
    const today = current && day === data.todayDay;
    const unavailable = current && data.disabledDays.includes(day);
    const classNames = [
      cellIndex % 7 === 0 ? 'day-off' : undefined,
      old ? 'old' : undefined,
      next ? 'new' : undefined,
      period ? 'period' : undefined,
      period && day === data.rangeStartDay ? 'start' : undefined,
      period && day === data.rangeEndDay ? 'end' : undefined,
      event ? 'day-event' : undefined,
      today ? 'today' : undefined,
      unavailable ? 'disabled' : undefined,
    ];
    const outside = old || next;
    return create(
      'td',
      {
        key: cellIndex,
        class: classNames,
        'data-date': `${cellYear}.${pad(cellMonth)}.${pad(day)}`,
      },
      [
        create(
          'button',
          {
            type: 'button',
            class: 'btn-set-date',
            disabled: outside ? true : unavailable,
            'aria-pressed': period ? 'true' : undefined,
            'aria-label': today
              ? `${day} ${data.todayLabel}`
              : event
                ? `${day} ${data.eventLabel}`
                : undefined,
            onVnodeMounted: outside
              ? (vnode: VNode) => {
                  (vnode.el as HTMLButtonElement).setAttribute('disabled', 'true');
                }
              : undefined,
          },
          create('span', String(day)),
        ),
      ],
    );
  });
  return create(
    'div',
    { ...attrs, id: data.id, class: ['krds-calendar-area', className] },
    create(
      'div',
      {
        class: ['calendar-wrap', 'bottom', kind === 'calendar' ? 'single' : undefined],
        tabindex: 0,
        'aria-label': data.calendarLabel,
      },
      [
        create('div', { class: 'calendar-head' }, [
          create('button', { type: 'button', class: ['btn-cal-move', 'prev'] }, [
            create('span', { class: 'sr-only' }, data.previousMonthLabel),
          ]),
          create('div', { class: 'calendar-switch-wrap' }, [
            create('div', { class: 'calendar-drop-down' }, [
              create(
                'button',
                {
                  type: 'button',
                  class: ['btn-cal-switch', 'year'],
                  role: 'combobox',
                  'aria-expanded': 'false',
                  'aria-controls': yearListId,
                  'aria-haspopup': 'listbox',
                  'aria-label': data.yearSelectLabel,
                },
                `${year}년`,
              ),
              create('div', { class: ['calendar-select', 'calendar-year-wrap'] }, [
                create(
                  'ul',
                  { id: yearListId, class: ['sel', 'year'], role: 'listbox' },
                  data.years.map((optionYear) =>
                    create('li', { key: optionYear, role: 'none' }, [
                      create(
                        'button',
                        {
                          type: 'button',
                          role: 'option',
                          class: optionYear === year ? 'active' : undefined,
                          disabled: data.disabledYears.includes(optionYear),
                          'aria-selected': optionYear === year ? 'true' : 'false',
                        },
                        `${optionYear}년`,
                      ),
                    ]),
                  ),
                ),
              ]),
            ]),
            create('div', { class: 'calendar-drop-down' }, [
              create(
                'button',
                {
                  type: 'button',
                  class: ['btn-cal-switch', 'month'],
                  role: 'combobox',
                  'aria-expanded': 'false',
                  'aria-controls': monthListId,
                  'aria-haspopup': 'listbox',
                  'aria-label': data.monthSelectLabel,
                },
                `${pad(month)}월`,
              ),
              create('div', { class: ['calendar-select', 'calendar-mon-wrap'] }, [
                create(
                  'ul',
                  { id: monthListId, class: ['sel', 'month'], role: 'listbox' },
                  Array.from({ length: 12 }, (_, monthIndex) => monthIndex + 1).map(
                    (optionMonth) =>
                      create('li', { key: optionMonth, role: 'none' }, [
                        create(
                          'button',
                          {
                            type: 'button',
                            role: 'option',
                            class: optionMonth === month ? 'active' : undefined,
                            disabled: data.disabledMonths.includes(optionMonth),
                            'aria-selected': optionMonth === month ? 'true' : 'false',
                          },
                          `${pad(optionMonth)}월`,
                        ),
                      ]),
                  ),
                ),
              ]),
            ]),
          ]),
          create('button', { type: 'button', class: ['btn-cal-move', 'next'] }, [
            create('span', { class: 'sr-only' }, data.nextMonthLabel),
          ]),
        ]),
        create('div', { class: 'calendar-body' }, [
          create('div', { class: 'calendar-table-wrap' }, [
            create('table', { class: 'calendar-tbl' }, [
              create('caption', `${year}년 ${pad(month)}월`),
              create(
                'thead',
                create(
                  'tr',
                  data.weekdays.map((weekday) => create('th', { key: weekday }, weekday)),
                ),
              ),
              create(
                'tbody',
                Array.from({ length: 6 }, (_, rowIndex) =>
                  create('tr', { key: rowIndex }, cells.slice(rowIndex * 7, rowIndex * 7 + 7)),
                ),
              ),
            ]),
          ]),
        ]),
        create('div', { class: 'calendar-footer' }, [
          create('div', { class: 'calendar-btn-wrap' }, [
            create(
              'button',
              {
                id: `${rootId}-today`,
                type: 'button',
                class: ['krds-btn', 'small', 'text'],
              },
              data.todayLabel,
            ),
            create(
              'button',
              { type: 'button', class: ['krds-btn', 'small', 'tertiary'] },
              data.cancelLabel,
            ),
            create(
              'button',
              { type: 'button', class: ['krds-btn', 'small', 'primary'] },
              data.confirmLabel,
            ),
          ]),
        ]),
      ],
    ),
  );
}
export function createAdditional(name: string, kind: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: commonProps,
    emits: {
      'update:modelValue': (_value: AdditionalValue) => true,
      change: (_payload: Event | [string, string]) => true,
      close: () => true,
      openChange: (_open: boolean) => true,
      pageChange: (_page: number) => true,
      valueChange: (_value: string | number | boolean) => true,
      filesChange: (_files: File[]) => true,
    },
    setup(props, { attrs, emit, slots }) {
      const localOpen = ref(props.defaultOpen);
      const setOpen = (next: boolean) => {
        if (props.open === undefined) localOpen.value = next;
        emit('openChange', next);
      };
      const open = computed<boolean>({
        get: () => props.open ?? localOpen.value,
        set: setOpen,
      });
      const modalElement = ref<HTMLElement | null>(null);
      let previousFocus: HTMLElement | null = null;
      const syncModalFocus = async (nextOpen: boolean) => {
        if (kind !== 'modal' && kind !== 'modal-sample') return;
        if (typeof document === 'undefined') return;
        if (nextOpen) {
          previousFocus =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
          await nextTick();
          modalElement.value?.querySelector<HTMLElement>('button, [href], input')?.focus();
        } else {
          previousFocus?.focus();
          previousFocus = null;
        }
      };
      if (kind === 'modal' || kind === 'modal-sample') {
        watch(open, (nextOpen) => {
          void syncModalFocus(nextOpen);
        });
        onMounted(() => {
          if (open.value) void syncModalFocus(true);
        });
        onBeforeUnmount(() => {
          void syncModalFocus(false);
        });
      }
      const initialSelected =
        props.defaultSelected ??
        (typeof props.modelValue === 'string' ? props.modelValue : undefined) ??
        (typeof props.defaultValue === 'string' ? props.defaultValue : undefined) ??
        props.tabs[0]?.id ??
        props.languages[0]?.value ??
        props.options[0]?.value ??
        '';
      const localSelected = ref(initialSelected);
      const setSelected = (next: string) => {
        if (props.selected === undefined && typeof props.modelValue !== 'string') {
          localSelected.value = next;
        }
        emit('update:modelValue', next);
        emit('valueChange', next);
      };
      const selected = computed<string>({
        get: () =>
          props.selected ??
          (typeof props.modelValue === 'string' ? props.modelValue : undefined) ??
          localSelected.value,
        set: setSelected,
      });
      const initialIndex = Math.max(0, (props.defaultCurrent ?? props.current ?? 1) - 1);
      const localIndex = ref(initialIndex);
      const index = computed(() =>
        Math.max(0, (props.current === undefined ? localIndex.value + 1 : props.current) - 1),
      );
      const setIndex = (next: number) => {
        if (props.current === undefined) localIndex.value = next;
        emit('pageChange', next + 1);
      };
      const currentPage = computed(() =>
        props.current === undefined ? localIndex.value + 1 : props.current,
      );
      const setPage = (next: number) => {
        if (props.current === undefined) localIndex.value = Math.max(0, next - 1);
        emit('pageChange', next);
      };
      const initialValue =
        props.defaultValue ??
        props.value ??
        (typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
          ? props.modelValue
          : '');
      const localValue = ref(String(initialValue));
      const value = computed(() => {
        if (props.value !== undefined) return String(props.value);
        if (typeof props.modelValue === 'string' || typeof props.modelValue === 'number') {
          return String(props.modelValue);
        }
        return localValue.value;
      });
      const setValue = (next: string) => {
        if (
          props.value === undefined &&
          typeof props.modelValue !== 'string' &&
          typeof props.modelValue !== 'number'
        ) {
          localValue.value = next;
        }
        emit('update:modelValue', next);
        emit('valueChange', next);
      };
      const initialChecked =
        props.defaultChecked ??
        props.checked ??
        (typeof props.modelValue === 'boolean' ? props.modelValue : false);
      const localChecked = ref(initialChecked);
      const checked = computed(() => {
        if (props.checked !== undefined) return props.checked;
        if (typeof props.modelValue === 'boolean') return props.modelValue;
        return localChecked.value;
      });
      const setChecked = (next: boolean) => {
        if (props.checked === undefined && typeof props.modelValue !== 'boolean') {
          localChecked.value = next;
        }
        emit('update:modelValue', next);
      };
      const generatedId = `krds-${kind}-${useId()}`;
      const id = computed(() => props.id ?? generatedId);
      return () => {
        const className = attrs.class as string | undefined;
        const slotChildren = children(slots);
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
                kind === 'badge-number' || props.number ? 'number' : '',
                props.size,
                className,
              ],
            },
            slotChildren.length ? slotChildren : props.label,
          );
        if (kind === 'breadcrumb')
          return create(
            'nav',
            {
              ...attrs,
              id: id.value,
              class: ['krds-breadcrumb-wrap', className],
              'aria-label': props.label ?? '현재 경로',
            },
            create(
              'ol',
              { class: 'breadcrumb' },
              props.items.map((item, itemIndex) =>
                create(
                  'li',
                  { key: itemIndex, class: itemIndex === 0 ? 'home' : undefined },
                  create(
                    'a',
                    {
                      class: 'txt',
                      href: (item as KrdsNavItem).href ?? '#',
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
              type: props.type ?? 'button',
              class: ['krds-btn', 'icon', props.size, className],
            },
            [
              create('span', { class: 'sr-only' }, props.label ?? props.text),
              create('i', { class: ['svg-icon', 'ico-sch'] }),
            ],
          );
        if (kind === 'button-text' || kind === 'button-with-icon')
          return create(
            'button',
            {
              ...attrs,
              type: props.type ?? 'button',
              class: ['krds-btn', kind === 'button-text' ? 'text' : undefined, className],
            },
            [
              slotChildren.length ? slotChildren : (props.label ?? props.text),
              kind === 'button-with-icon'
                ? create('i', { class: ['svg-icon', 'ico-sch'] })
                : null,
            ],
          );
        if (kind === 'button-hierarchy' || kind === 'button-size')
          return create(
            'button',
            {
              ...attrs,
              type: props.type ?? 'button',
              disabled: props.disabled,
              class: [
                'krds-btn',
                kind === 'button-hierarchy' ? (props.variant ?? props.tone) : undefined,
                props.size,
                className,
              ],
            },
            slotChildren.length ? slotChildren : (props.label ?? props.text),
          );
        if (kind === 'calendar' || kind === 'date-input' || kind === 'calendar-range')
          return calendarMarkup(props, kind, id.value, attrs, className);
        if (kind === 'carousel' || kind === 'carousel-banner') {
          const slides = props.slides;
          const placeholderSvgProps = {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '243',
            height: '178',
            viewBox: '0 0 243 178',
            fill: 'none',
            'aria-label': props.imageLabel,
          };
          const placeholderRectProps = {
            width: '243',
            height: '178',
            fill: '#E6E8EA',
          };
          if (kind === 'carousel-banner')
            return create(
              'div',
              { ...attrs, class: ['main-d-ban-swiper', className] },
              [
                create('div', { class: 'swiper' }, [
                  create(
                    'ul',
                    { class: 'swiper-wrapper' },
                    slides.map((slide) =>
                      create('li', { key: slide.id, class: 'swiper-slide' }, [
                        create('div', { class: 'text' }, [
                          slide.description
                            ? create('p', { class: 'cate' }, slide.description)
                            : null,
                          create('p', { class: 'tit' }, slide.title),
                        ]),
                        create(
                          'div',
                          { class: 'im' },
                          create('svg', placeholderSvgProps, create('rect', placeholderRectProps)),
                        ),
                      ]),
                    ),
                  ),
                ]),
                create('div', { class: 'swiper-indicator' }, [
                  create('div', { class: 'swiper-pagination' }),
                  create('div', { class: 'swiper-controller' }, [
                    create(
                      'button',
                      { type: 'button', class: 'swiper-button-play' },
                      create('span', { class: 'sr-only' }, props.playLabel),
                    ),
                    create(
                      'button',
                      { type: 'button', class: 'swiper-button-stop' },
                      create('span', { class: 'sr-only' }, props.stopLabel),
                    ),
                  ]),
                  create('div', { class: 'swiper-navigation' }, [
                    create(
                      'button',
                      {
                        type: 'button',
                        class: 'swiper-button-prev',
                        onClick: () =>
                          setIndex(
                            slides.length
                              ? (index.value - 1 + slides.length) % slides.length
                              : 0,
                          ),
                      },
                      create('span', { class: 'sr-only' }, props.previousLabel),
                    ),
                    create(
                      'button',
                      {
                        type: 'button',
                        class: 'swiper-button-next',
                        onClick: () =>
                          setIndex(slides.length ? (index.value + 1) % slides.length : 0),
                      },
                      create('span', { class: 'sr-only' }, props.nextLabel),
                    ),
                    create(
                      'a',
                      { class: 'swiper-button-more', href: props.href },
                      create('span', { class: 'sr-only' }, props.moreLabel),
                    ),
                  ]),
                ]),
              ],
            );
          return create(
            'div',
            { ...attrs, class: ['main-vban-wrap', 'bg', className] },
            [
              create('div', { class: 'inner' }, [
                create('div', { class: 'vb-swiper' }, [
                  create('div', { class: 'swiper' }, [
                    create(
                      'ul',
                      { class: 'swiper-wrapper' },
                      slides.map((slide) =>
                        create('li', { key: slide.id, class: 'swiper-slide' }, [
                          create('div', { class: 'in' }, [
                            create('div', { class: 'text' }, [
                              create('p', { class: 'tit' }, [
                                slide.title,
                                create('br', { class: 'w-hide' }),
                                slide.title,
                              ]),
                              slide.description
                                ? create('p', { class: 'txt' }, [
                                    slide.description,
                                    create('br', { class: 'w-hide' }),
                                    slide.description,
                                  ])
                                : null,
                              create(
                                'a',
                                { class: ['krds-btn', 'primary'], href: slide.href },
                                props.actionLabel,
                              ),
                            ]),
                            create(
                              'div',
                              { class: 'im' },
                              create(
                                'svg',
                                placeholderSvgProps,
                                create('rect', placeholderRectProps),
                              ),
                            ),
                          ]),
                        ]),
                      ),
                    ),
                  ]),
                  create(
                    'button',
                    {
                      type: 'button',
                      class: 'swiper-button-prev',
                      onClick: () =>
                        setIndex(
                          slides.length
                            ? (index.value - 1 + slides.length) % slides.length
                            : 0,
                        ),
                    },
                    create('span', { class: 'sr-only' }, props.previousLabel),
                  ),
                  create(
                    'button',
                    {
                      type: 'button',
                      class: 'swiper-button-next',
                      onClick: () =>
                        setIndex(slides.length ? (index.value + 1) % slides.length : 0),
                    },
                    create('span', { class: 'sr-only' }, props.nextLabel),
                  ),
                  create('div', { class: ['swiper-indicator', 'text-center'] }, [
                    create('div', { class: 'swiper-pagination' }),
                    create(
                      'a',
                      { class: 'swiper-button-more', href: props.href },
                      create('span', { class: 'sr-only' }, props.moreLabel),
                    ),
                  ]),
                ]),
              ]),
            ],
          );
        }
        if (
          kind === 'checkbox-chip' ||
          kind === 'radio-chip' ||
          kind === 'checkbox-size' ||
          kind === 'radio-size'
        ) {
          const isRadio = kind.startsWith('radio');
          const isChip = kind.endsWith('chip');
          const choiceValue = props.value ?? 'on';
          const isChecked = isRadio
            ? props.modelValue !== undefined
              ? props.modelValue === choiceValue
              : selected.value === String(choiceValue)
            : checked.value;
          const input = create('input', {
            ...withoutClass(attrs),
            id: id.value,
            class: isChip ? (isRadio ? 'radio' : 'checkbox') : undefined,
            type: isRadio ? 'radio' : 'checkbox',
            name: props.name,
            value: props.value,
            checked: isChecked,
            disabled: props.disabled,
            required: props.required,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              if (isRadio) {
                if (props.modelValue === undefined) localSelected.value = String(choiceValue);
                emit('update:modelValue', choiceValue);
                emit('valueChange', choiceValue);
              } else {
                setChecked((event.target as HTMLInputElement).checked);
                emit('change', event);
              }
            },
          });
          if (kind === 'radio-chip') return input;
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: [isChip ? 'krds-form-chip' : 'krds-form-check', props.size, className],
            },
            [
              input,
              create(
                'label',
                {
                  for: id.value,
                  class: isChip ? 'krds-form-chip-outline' : undefined,
                },
                slotChildren.length ? slotChildren : props.label,
              ),
            ],
          );
        }
        if (kind === 'coach-mark') {
          const [fallbackCurrent = '', fallbackTotal = ''] = (props.step ?? '').split('/');
          const currentStep = props.currentStep ?? fallbackCurrent;
          const totalSteps = props.totalSteps ?? fallbackTotal;
          return create(
            'div',
            {
              ...attrs,
              class: ['krds-coach-mark', 'txt-box', 'bg-white', 'bg-white', className],
            },
            [
              create('div', { class: 'coach-balloon' }, [
                create('h5', { class: 'sr-only' }, props.title),
                create('h6', { class: 'coach-tit' }, props.stepTitle),
                props.description
                  ? create('p', { class: 'desc' }, props.description)
                  : null,
                create('div', { class: 'coach-controls' }, [
                  create('div', { class: 'num' }, [
                    create('span', { class: 'sr-only' }, '현재 단계'),
                    create('strong', currentStep),
                    create('span', { class: 'sr-only' }, '총 단계'),
                    create('span', totalSteps),
                  ]),
                  create('div', { class: 'btn-wrap' }, [
                    create(
                      'button',
                      {
                        type: 'button',
                        class: ['krds-btn', 'small', 'text'],
                        onClick: () => emit('close'),
                      },
                      props.stopLabel,
                    ),
                    create(
                      'button',
                      { type: 'button', class: ['krds-btn', 'small', 'tertiary'] },
                      props.nextLabel,
                    ),
                  ]),
                ]),
              ]),
              create('div', [
                create(
                  'h3',
                  props.contentTitle ?? (slotChildren.length ? slotChildren : props.label),
                ),
              ]),
            ],
          );
        }
        if (kind === 'contextual-help')
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-contextual-help', props.position.split('-'), className],
            },
            [
              props.caption
                ? create('p', { class: 'tooltip-txt' }, props.caption)
                : null,
              create('div', { class: 'tooltip-action' }, [
                create(
                  'button',
                  {
                    ...withoutClass(attrs),
                    type: 'button',
                    class: ['krds-btn', 'icon', 'medium', 'tooltip-btn'],
                    'aria-expanded': open.value,
                    'aria-controls': `${id.value}-tooltip`,
                    onClick: (event: MouseEvent) => {
                      invokeNativeEvent(attrs.onClick, event);
                      setOpen(!open.value);
                    },
                  },
                  [
                    create('span', { class: 'sr-only' }, props.label),
                    create('i', { class: ['svg-icon', 'ico-tooltip'] }),
                  ],
                ),
                create('div', { id: `${id.value}-tooltip`, class: 'tooltip-popover', role: 'tooltip' }, [
                  props.title
                    ? create('h4', { class: 'tooltip-title' }, props.title)
                    : null,
                  create('div', { class: 'tooltip-contents' }, [
                    props.description ? create('p', props.description) : null,
                    props.href !== '#'
                      ? create('div', { class: 'btn-wrap' }, [
                          create(
                            'a',
                            { class: ['krds-btn', 'xsmall', 'basic', 'link'], href: props.href },
                            [
                              props.linkLabel,
                              create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                            ],
                          ),
                        ])
                      : null,
                  ]),
                  create(
                    'button',
                    {
                      type: 'button',
                      class: ['krds-btn', 'icon', 'xsmall', 'tooltip-close'],
                      onClick: () => setOpen(false),
                    },
                    [
                      create('span', { class: 'sr-only' }, props.closeLabel),
                      create('i', { class: ['svg-icon', 'ico-modal-close'] }),
                    ],
                  ),
                ]),
              ]),
            ],
          );
        if (kind === 'critical-alerts')
          return create(
            'div',
            { ...attrs, class: ['krds-critical-alerts', className], role: 'alert' },
            create(
              'ul',
              props.items.map((item, itemIndex) => {
                const alert = item as AdditionalAlertItem;
                return create('li', { key: alert.id ?? itemIndex }, [
                  create('div', { class: 'critical-ban' }, [
                    create(
                      'span',
                      { class: ['critical-badge', alert.tone] },
                      alert.badgeLabel ?? alert.badge,
                    ),
                    create('p', { class: 'critical-txt' }, alert.text),
                    alert.href
                      ? create(
                          'a',
                          { class: ['krds-btn', 'medium', 'basic', 'link'], href: alert.href },
                          [
                            create('span', { class: 'm-hide' }, alert.linkLabel),
                            create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                          ],
                        )
                      : null,
                  ]),
                ]);
              }),
            ),
          );
        if (kind === 'disclosure')
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-disclosure', 'conts-expand-area', className],
            },
            [
              create(
                'button',
                {
                  ...withoutClass(attrs),
                  type: 'button',
                  class: 'btn-conts-expand',
                  'aria-controls': id.value,
                  'aria-expanded': open.value,
                  onClick: () => setOpen(!open.value),
                },
                props.title ?? props.label,
              ),
              create(
                'div',
                {
                  id: id.value,
                  class: 'expand-wrap',
                  inert: open.value ? undefined : '',
                },
                create(
                  'div',
                  { class: 'expand-in' },
                  props.items.length
                    ? create(
                        'ul',
                        { class: ['krds-info-list', 'dash'], role: 'list' },
                        props.items.map((item, itemIndex) =>
                          create(
                            'li',
                            { key: itemIndex, role: 'listitem' },
                            itemLabel(item),
                          ),
                        ),
                      )
                    : slotChildren,
                ),
              ),
            ],
          );
        if (kind === 'favicon')
          return create('link', {
            ...attrs,
            rel: 'icon',
            href: props.href,
            sizes: props.sizes ?? props.size ?? '32x32',
            type: props.type ?? 'image/png',
          });
        if (kind === 'file-upload') {
          const inputId = props.inputId ?? id.value;
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-file-upload', 'line', className],
            },
            [
              create('div', { class: 'file-head' }, [
                create('h3', { class: 'tit' }, props.title),
                create('div', [create('p', props.description)]),
              ]),
              create('div', { class: 'file-upload' }, [
                create('p', { class: 'txt' }, props.prompt ?? props.hint),
                create('div', { class: 'file-upload-btn-wrap' }, [
                  create('input', {
                    ...withoutClass(attrs),
                    id: inputId,
                    type: 'file',
                    name: props.name,
                    hidden: '',
                    multiple: props.multiple,
                    disabled: props.disabled,
                    required: props.required,
                    onChange: (event: Event) => {
                      invokeNativeEvent(attrs.onChange, event);
                      emit('change', event);
                      emit(
                        'filesChange',
                        Array.from((event.target as HTMLInputElement).files ?? []),
                      );
                    },
                  }),
                  create(
                    'label',
                    { for: inputId, class: ['krds-btn', 'medium'] },
                    [
                      create('i', { class: ['svg-icon', 'ico-upload'] }),
                      props.selectLabel ?? props.label,
                    ],
                  ),
                ]),
              ]),
              create('div', { class: 'file-list' }, [
                create('div', { class: 'total' }, [
                  create('span', { class: 'current' }, `${props.currentCount ?? 0}개`),
                  `/ ${props.maxCount ?? 0}개`,
                ]),
                create(
                  'ul',
                  { class: 'upload-list' },
                  props.files.map((file) =>
                    create(
                      'li',
                      {
                        key: file.id,
                        class: file.status === 'error' ? 'is-error' : undefined,
                      },
                      [
                        create(
                          'div',
                          {
                            class: [
                              'file-info',
                              file.status === 'downloadable' ? 'm-column' : undefined,
                            ],
                          },
                          [
                            create('div', { class: 'file-name' }, file.name),
                            create('div', { class: 'btn-wrap' }, [
                              file.status === 'uploading'
                                ? create('span', { class: 'krds-spinner', role: 'status' }, [
                                    create('span', { class: 'sr-only' }, file.statusLabel),
                                  ])
                                : file.status === 'complete'
                                  ? create('span', { class: ['complete', 'ico-invalid'] }, [
                                      create('em', { class: 'sr-only' }, file.statusLabel),
                                    ])
                                  : file.deleteLabel
                                    ? create(
                                        'button',
                                        {
                                          type: 'button',
                                          class: ['krds-btn', 'medium', 'text'],
                                        },
                                        [
                                          file.deleteLabel,
                                          create('i', {
                                            class: ['svg-icon', 'ico-delete-fill'],
                                          }),
                                        ],
                                      )
                                    : null,
                              file.downloadLabel
                                ? create(
                                    'button',
                                    { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                                    [
                                      file.downloadLabel,
                                      create('i', { class: ['svg-icon', 'ico-down'] }),
                                    ],
                                  )
                                : null,
                              file.previewLabel
                                ? create(
                                    'button',
                                    { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                                    [
                                      file.previewLabel,
                                      create('i', {
                                        class: ['svg-icon', 'ico-angle', 'right'],
                                      }),
                                    ],
                                  )
                                : null,
                            ]),
                          ],
                        ),
                        file.errors?.length
                          ? create(
                              'p',
                              { class: 'file-hint-invalid' },
                              file.errors.flatMap((error, errorIndex) =>
                                errorIndex ? [create('br'), error] : [error],
                              ),
                            )
                          : null,
                      ],
                    ),
                  ),
                ),
                create('div', { class: 'upload-delete-btn' }, [
                  create(
                    'button',
                    { type: 'button', class: ['krds-btn', 'tertiary', 'xsmall'] },
                    [
                      props.deleteAllLabel,
                      create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                    ],
                  ),
                ]),
              ]),
            ],
          );
        }
        if (kind === 'footer')
          return create('footer', { ...attrs, id: id.value, class: className }, [
            create('div', { class: 'foot-quick' }, [
              create(
                'div',
                { class: 'inner' },
                props.relatedSites.map((site) =>
                  create(
                    'button',
                    {
                      key: site.id ?? site.label,
                      type: 'button',
                      class: 'link',
                      title: site.title,
                    },
                    site.label,
                  ),
                ),
              ),
            ]),
            create('div', { class: 'inner' }, [
              create('div', { class: 'f-logo' }, [
                create('span', { class: 'sr-only' }, props.logoLabel),
              ]),
              create('div', { class: 'f-cnt' }, [
                create('div', { class: 'f-info' }, [
                  create('p', { class: 'info-addr' }, props.address),
                  create(
                    'ul',
                    { class: 'info-cs' },
                    props.contacts.map((contact) =>
                      create('li', { key: contact.title }, [
                        create('strong', { class: 'strong' }, contact.title),
                        create('span', { class: 'span' }, contact.description),
                      ]),
                    ),
                  ),
                ]),
                create('div', { class: 'f-link' }, [
                  create(
                    'div',
                    { class: 'link-go' },
                    props.links.map((link) =>
                      create(
                        'a',
                        {
                          key: link.id ?? link.label,
                          class: ['krds-btn', 'medium', 'text'],
                          href: link.href,
                        },
                        [
                          link.label,
                          create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                        ],
                      ),
                    ),
                  ),
                  create(
                    'div',
                    { class: 'link-sns' },
                    props.socialLinks.map((link) =>
                      create(
                        'a',
                        {
                          key: link.id ?? link.label,
                          class: ['krds-btn', 'icon', 'xlarge', 'border'],
                          href: link.href,
                          target: link.target,
                          title: link.title,
                        },
                        [
                          create('span', { class: 'sr-only' }, link.label),
                          create('i', { class: ['svg-icon', `ico-${link.icon}`] }),
                        ],
                      ),
                    ),
                  ),
                ]),
              ]),
              create('div', { class: 'f-btm' }, [
                create('div', { class: 'f-btm-text' }, [
                  create(
                    'div',
                    { class: 'f-menu' },
                    props.policyLinks.map((link) =>
                      create(
                        'a',
                        {
                          key: link.id ?? link.label,
                          class: link.emphasis ? 'point' : undefined,
                          href: link.href,
                        },
                        link.label,
                      ),
                    ),
                  ),
                  create('p', { class: 'f-copy' }, props.copyright),
                ]),
                create('div', { class: 'krds-identifier' }, [
                  create('span', { class: 'logo' }, [
                    create('span', { class: 'sr-only' }, props.organization),
                  ]),
                  create('span', { class: 'ban-txt' }, props.description),
                ]),
              ]),
            ]),
          ]);
        if (kind === 'header' || kind === 'main-menu-mobile' || kind === 'main-menu-pc') {
          const closeMenu = () => {
            setOpen(false);
            emit('close');
          };
          if (kind === 'header') {
            const mobileId = `${id.value}-mobile`;
            const headerItems = props.desktopItems.length
              ? props.desktopItems
              : (props.nav as AdditionalMenuItem[]);
            return create('header', { ...attrs, id: id.value, class: className }, [
              create('div', { class: 'header-in' }, [
                create('div', { class: 'header-container' }, [
                  create('div', { class: 'inner' }, [
                    create('div', { class: 'header-utility' }, [
                      create(
                        'ul',
                        { class: 'utility-list' },
                        props.utilityItems.map((item) =>
                          create(
                            'li',
                            { key: item.id ?? item.label },
                            headerUtilityItem(item),
                          ),
                        ),
                      ),
                    ]),
                    create('div', { class: 'header-branding' }, [
                      create('h2', { class: 'logo' }, [
                        create('a', { href: props.logoHref }, [
                          create('span', { class: 'sr-only' }, props.logoLabel),
                        ]),
                      ]),
                      create('div', { class: 'header-actions' }, [
                        create(
                          'button',
                          {
                            type: 'button',
                            class: ['btn-navi', 'sch'],
                            title: props.searchTitle,
                          },
                          props.searchLabel,
                        ),
                        create(
                          'a',
                          { class: ['btn-navi', 'login'], href: props.loginHref },
                          props.loginLabel,
                        ),
                        create(
                          'button',
                          { type: 'button', class: ['btn-navi', 'join'] },
                          props.joinLabel,
                        ),
                        props.myMenu ? headerMyMenu(props.myMenu) : null,
                        create(
                          'button',
                          {
                            type: 'button',
                            class: ['btn-navi', 'all'],
                            'aria-controls': mobileId,
                          },
                          props.allMenuLabel,
                        ),
                      ]),
                    ]),
                  ]),
                ]),
                create('nav', { class: 'krds-main-menu' }, [
                  create(
                    'div',
                    { class: 'inner' },
                    desktopMainMenu(headerItems, id.value, props.menuLabel, true),
                  ),
                ]),
              ]),
              props.mobileMenu
                ? mobileMenuMarkup(
                    props.mobileMenu,
                    mobileId,
                    {},
                    undefined,
                    false,
                    closeMenu,
                  )
                : null,
            ]);
          }
          const menuItems = props.items as AdditionalMenuItem[];
          if (kind === 'main-menu-mobile') {
            const mobileData: AdditionalMobileMenu = {
              utilityItems: props.utilityItems,
              loginLabel: props.loginLabel ?? '',
              serviceItems: props.serviceItems,
              searchPlaceholder: props.searchPlaceholder ?? '',
              searchTitle: props.searchTitle ?? '',
              searchLabel: props.searchLabel ?? '',
              items: menuItems,
              previousLabel: props.previousLabel ?? '',
              closeLabel: props.closeLabel ?? '',
              bottomItems: props.bottomItems,
            };
            return mobileMenuMarkup(
              mobileData,
              id.value,
              attrs,
              className,
              props.sample,
              closeMenu,
            );
          }
          return create(
            'nav',
            {
              ...attrs,
              id: props.id,
              class: [
                'krds-main-menu',
                props.sample && !className?.split(/\s+/).includes('sample')
                  ? 'sample'
                  : undefined,
                className,
              ],
            },
            [
              create(
                'div',
                { class: 'inner' },
                desktopMainMenu(menuItems, id.value, props.menuLabel),
              ),
            ],
          );
        }
        if (kind === 'help-panel' || kind === 'tutorial-panel') {
          const activeTab = props.activeTab ?? props.tabs[0]?.value ?? props.tabs[0]?.id;
          return create(
            'div',
            {
              ...attrs,
              class: ['krds-help-panel', open.value ? 'expand' : undefined, className],
            },
            [
              create('div', { class: 'help-panel-wrap', tabindex: 0 }, [
                create('div', { class: 'help-conts-area' }, [
                  create('div', { class: ['krds-tab-area', 'layer'] }, [
                    create('div', { class: ['tab', 'line'] }, [
                      create(
                        'ul',
                        { role: 'tablist' },
                        props.tabs.map((tab) => {
                          const tabValue = tab.value ?? tab.id;
                          const panelId = tab.panelId ?? `${id.value}-${tab.id}-panel`;
                          const isActive = tabValue === activeTab;
                          return create(
                            'li',
                            { key: tab.id, role: 'none' },
                            create(
                              'button',
                              {
                                id: tab.id,
                                type: 'button',
                                role: 'tab',
                                class: ['btn-tab', isActive ? 'active' : undefined],
                                'aria-selected': isActive,
                                'aria-controls': panelId,
                                tabIndex: isActive ? 0 : -1,
                                onClick: () => setSelected(tabValue),
                              },
                              [
                                tab.label,
                                isActive
                                  ? create(
                                      'i',
                                      { class: ['sr-only', 'created'] },
                                      props.selectedLabel,
                                    )
                                  : null,
                              ],
                            ),
                          );
                        }),
                      ),
                    ]),
                    create('div', { class: 'tab-conts-wrap' }, [
                      props.tabs.map((tab) => {
                        const tabValue = tab.value ?? tab.id;
                        const isActive = tabValue === activeTab;
                        const panelId = tab.panelId ?? `${id.value}-${tab.id}-panel`;
                        const isHelp = tabValue === 'help';
                        return create(
                          'section',
                          {
                            key: panelId,
                            id: panelId,
                            role: 'tabpanel',
                            class: ['tab-conts', isActive ? 'active' : undefined],
                            'aria-labelledby': tab.id,
                          },
                          [
                            create('h3', { class: 'sr-only' }, tab.label),
                            isHelp
                              ? create('div', { class: 'help-conts-area-inner' }, [
                                  create('div', { class: ['conts-area', 'help-conts'] }, [
                                    create('div', { class: 'conts-wrap' }, [
                                      create('h4', { class: 'help-title' }, [
                                        props.helpTitle,
                                        create(
                                          'span',
                                          { class: ['krds-btn', 'icon', 'medium'] },
                                          [
                                            create('span', { class: 'sr-only' }, props.label),
                                            create('i', { class: ['svg-icon', 'ico-help'] }),
                                          ],
                                        ),
                                      ]),
                                      create('div', { class: 'conts-desc' }, [
                                        create('p', props.helpDescription),
                                      ]),
                                      create(
                                        'ul',
                                        { class: 'link-list' },
                                        props.downloadLinks.map((link) =>
                                          create('li', { key: link.label }, [
                                            create(
                                              'a',
                                              {
                                                class: ['krds-btn', 'xsmall', 'basic', 'link'],
                                                href: link.href,
                                                target: link.target,
                                                title: link.title,
                                              },
                                              [
                                                link.label,
                                                create('i', {
                                                  class: ['svg-icon', 'ico-go'],
                                                }),
                                              ],
                                            ),
                                          ]),
                                        ),
                                      ),
                                    ]),
                                  ]),
                                  create(
                                    'div',
                                    { class: ['conts-area', 'related-service'] },
                                    props.relatedGroups.map((group) =>
                                      create('div', { key: group.title, class: 'conts-wrap' }, [
                                        create('h4', { class: 'help-title' }, group.title),
                                        create(
                                          'ul',
                                          { class: 'link-list' },
                                          group.links.map((link) =>
                                            create('li', { key: link.label }, [
                                              create(
                                                'a',
                                                {
                                                  class: ['krds-btn', 'xsmall', 'basic', 'link'],
                                                  href: link.href,
                                                },
                                                [
                                                  link.icon
                                                    ? create('i', {
                                                        class: [
                                                          'svg-icon',
                                                          `ico-${link.icon}`,
                                                        ],
                                                      })
                                                    : null,
                                                  link.label,
                                                  link.icon
                                                    ? null
                                                    : create('i', {
                                                        class: [
                                                          'svg-icon',
                                                          'ico-angle',
                                                          'right',
                                                        ],
                                                      }),
                                                ],
                                              ),
                                            ]),
                                          ),
                                        ),
                                      ]),
                                    ),
                                  ),
                                ])
                              : create('div', { class: 'help-conts-area-inner' }, [
                                  create('div', { class: 'conts-area' }, [
                                    create('h4', { class: 'help-title' }, [
                                      create(
                                        'a',
                                        { href: '#;', title: props.tutorialBackTitle },
                                        props.tutorialTitle,
                                      ),
                                    ]),
                                    create(
                                      'ul',
                                      { class: 'coach-help-process' },
                                      props.tasks.map((task, taskIndex) => {
                                        const taskPanelId = `${id.value}-task-${taskIndex}`;
                                        return create('li', { key: task.title }, [
                                          create(
                                            'h4',
                                            { class: ['tit', task.current ? 'current' : undefined] },
                                            task.title,
                                          ),
                                          create(
                                            'div',
                                            {
                                              class: [
                                                'krds-disclosure',
                                                'conts-expand-area',
                                              ],
                                            },
                                            [
                                              create(
                                                'button',
                                                {
                                                  type: 'button',
                                                  class: 'btn-conts-expand',
                                                  'aria-expanded': false,
                                                  'aria-controls': taskPanelId,
                                                },
                                                task.summary,
                                              ),
                                              create(
                                                'div',
                                                {
                                                  id: taskPanelId,
                                                  class: 'expand-wrap',
                                                  inert: '',
                                                },
                                                create('div', { class: 'expand-in' }, [
                                                  create(
                                                    'ul',
                                                    {
                                                      class: [
                                                        'krds-info-list',
                                                        'decimal',
                                                      ],
                                                      role: 'list',
                                                    },
                                                    task.steps.map((step, stepIndex) =>
                                                      create(
                                                        'li',
                                                        {
                                                          key: stepIndex,
                                                          role: 'listitem',
                                                        },
                                                        step,
                                                      ),
                                                    ),
                                                  ),
                                                ]),
                                              ),
                                            ],
                                          ),
                                        ]);
                                      }),
                                    ),
                                  ]),
                                  create('div', { class: 'help-panel-action' }, [
                                    create(
                                      'button',
                                      {
                                        type: 'button',
                                        class: [
                                          'krds-btn',
                                          'medium',
                                          'secondary',
                                          'coach-btn-stop',
                                        ],
                                        onClick: () => emit('close'),
                                      },
                                      props.stopLabel,
                                    ),
                                  ]),
                                ]),
                          ],
                        );
                      }),
                    ]),
                  ]),
                ]),
                create(
                  'button',
                  {
                    type: 'button',
                    class: ['krds-btn', 'small', 'tertiary', 'btn-help-panel', 'fold'],
                    onClick: () => {
                      setOpen(false);
                      emit('close');
                    },
                  },
                  [
                    create('span', { class: 'sr-only' }, props.label),
                    props.collapseLabel,
                    create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
                  ],
                ),
              ]),
            ],
          );
        }
        if (kind === 'identifier')
          return create('div', { ...attrs, class: ['krds-identifier', className] }, [
            create('span', { class: 'logo' }, [
              create('span', { class: 'sr-only' }, props.organization),
            ]),
            create(
              'span',
              { class: 'ban-txt' },
              props.description ?? props.organization,
            ),
          ]);
        if (kind === 'in-page-navigation') {
          const navigationItems = props.items as KrdsNavItem[];
          return create(
            'div',
            {
              ...attrs,
              class: ['krds-in-page-navigation-area', className],
            },
            [
              create('div', { class: 'in-page-navigation-header' }, [
                create('p', { class: 'quick-caption' }, props.title),
                props.pageTitle
                  ? create('p', { class: 'quick-title' }, props.pageTitle)
                  : null,
              ]),
              create('nav', { class: 'in-page-navigation-list' }, [
                create(
                  'ul',
                  navigationItems.map((item) =>
                    create('li', { key: item.id ?? item.label }, [
                      create(
                        'a',
                        {
                          href: item.href,
                          class: item.current ? 'active' : undefined,
                        },
                        item.label,
                      ),
                    ]),
                  ),
                ),
              ]),
              create('div', { class: 'in-page-navigation-action' }, [
                create(
                  'button',
                  { type: 'button', class: ['krds-btn', 'medium'] },
                  props.actionLabel,
                ),
                props.actionInfo || props.actionCount
                  ? create('p', { class: 'quick-info' }, [
                      props.actionInfo,
                      props.actionCount ? create('strong', props.actionCount) : null,
                    ])
                  : null,
              ]),
            ],
          );
        }
        if (kind === 'language-switcher' || kind === 'language-switcher-page') {
          const languages: AdditionalLanguage[] = props.languages.length
            ? props.languages
            : props.options;
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-language', 'krds-drop-wrap', className],
            },
            [
              create(
                'button',
                {
                  ...withoutClass(attrs),
                  type: 'button',
                  class: ['krds-btn', 'small', 'text', 'drop-btn'],
                  'aria-expanded': open.value,
                  onClick: () => setOpen(!open.value),
                },
                [
                  create('i', { class: ['svg-icon', 'ico-global'] }),
                  props.label,
                  create('i', { class: ['svg-icon', 'ico-toggle'] }),
                ],
              ),
              create('div', { class: 'drop-menu' }, [
                create('div', { class: 'drop-in' }, [
                  kind === 'language-switcher-page'
                    ? create('div', { class: 'drop-top' }, [
                        create('p', { class: 'current-laguage' }, [
                          create('span', props.title),
                          create(
                            'strong',
                            languages.find((language) => language.value === selected.value)?.label,
                          ),
                        ]),
                      ])
                    : null,
                  create(
                    'ul',
                    { class: 'drop-list' },
                    languages.map((language) =>
                      create('li', { key: language.value }, [
                        create(
                          'a',
                          {
                            class: [
                              'item-link',
                              kind === 'language-switcher' && language.value === selected.value
                                ? 'active'
                                : undefined,
                            ],
                            href: language.href ?? '#',
                            lang: language.lang ?? language.value,
                            target:
                              kind === 'language-switcher-page' || language.external
                                ? '_blank'
                                : undefined,
                            title:
                              kind === 'language-switcher-page' || language.external
                                ? props.text
                                : undefined,
                            onClick: (event: Event) => {
                              event.preventDefault();
                              setSelected(language.value);
                            },
                          },
                          [
                            language.label,
                            kind === 'language-switcher-page'
                              ? create('i', { class: ['svg-icon', 'ico-go'] })
                              : null,
                            create(
                              'span',
                              { class: 'sr-only' },
                              language.value === selected.value ? '선택됨' : '',
                            ),
                          ],
                        ),
                      ]),
                    ),
                  ),
                ]),
              ]),
            ],
          );
        }
        if (kind === 'link')
          return create(
            'a',
            {
              ...attrs,
              href: props.href,
              class: ['krds-btn', 'link', props.size, className],
              target: props.external ? '_blank' : attrs.target,
              title: props.title,
            },
            [
              create(
                'span',
                { class: 'underline' },
                slotChildren.length ? slotChildren : props.label,
              ),
              props.external || attrs.target
                ? create('i', { class: ['svg-icon', 'ico-go'] })
                : null,
            ],
          );
        if (kind === 'masthead')
          return create('div', { ...attrs, id: id.value, class: className }, [
            create('div', { class: 'toggle-wrap' }, [
              create('div', { class: 'toggle-head' }, [
                create('div', { class: 'inner' }, [
                  create(
                    'span',
                    { class: 'nuri-txt' },
                    props.message || props.description,
                  ),
                ]),
              ]),
            ]),
          ]);
        if (kind === 'modal' || kind === 'modal-sample')
          return create(
            'section',
            {
              ...withoutNativeEvents(attrs),
              ref: modalElement,
              id: id.value,
              class: [
                'krds-modal',
                'fade',
                kind === 'modal-sample' && open.value ? ['in', 'shown'] : undefined,
                className,
              ],
              role: 'dialog',
              'aria-labelledby': `${id.value}-title`,
            },
            [
              create('div', { class: 'modal-dialog' }, [
                create('div', { class: 'modal-content' }, [
                  create('div', { class: 'modal-header' }, [
                    create(
                      'h2',
                      { id: `${id.value}-title`, class: 'modal-title' },
                      props.title,
                    ),
                  ]),
                  create('div', { class: 'modal-conts' }, [
                    create(
                      'div',
                      { class: 'conts-area' },
                      slotChildren.length ? slotChildren : props.description,
                    ),
                  ]),
                  create('div', { class: ['btn-wrap', 'modal-btn'] }, [
                    create(
                      'button',
                      {
                        type: 'button',
                        class: ['krds-btn', 'medium', 'tertiary', 'close-modal'],
                        onClick: () => {
                          setOpen(false);
                          emit('close');
                        },
                      },
                      '아니요',
                    ),
                    create(
                      'button',
                      {
                        type: 'button',
                        class: ['krds-btn', 'medium', 'primary', 'close-modal'],
                        onClick: () => {
                          setOpen(false);
                          emit('close');
                        },
                      },
                      '예',
                    ),
                  ]),
                  create(
                    'button',
                    {
                      type: 'button',
                      class: ['krds-btn', 'icon', 'medium', 'btn-close', 'close-modal'],
                      onClick: () => {
                        setOpen(false);
                        emit('close');
                      },
                    },
                    [
                      create('span', { class: 'sr-only' }, '닫기'),
                      create('i', { class: ['svg-icon', 'ico-popup-close'] }),
                    ],
                  ),
                ]),
              ]),
              create('div', { class: 'modal-back' }),
            ],
          );
        if (kind === 'pagination') {
          const pages = props.items.length ? props.items : [];
          return create(
            'div',
            { ...attrs, class: ['krds-pagination', className], role: 'navigation' },
            [
              props.previousDisabled
                ? create(
                    'span',
                    { class: ['page-navi', 'prev', 'disabled'], href: '#' },
                    props.previousLabel,
                  )
                : create(
                    'a',
                    {
                      class: ['page-navi', 'prev'],
                      href: '#',
                      onClick: (event: Event) => {
                        event.preventDefault();
                        setPage(currentPage.value - 1);
                      },
                    },
                    props.previousLabel,
                  ),
              create(
                'div',
                { class: 'page-links' },
                pages.map((item, itemIndex) => {
                  if (item === 'ellipsis')
                    return create('span', {
                      key: itemIndex,
                      class: ['page-link', 'link-dot'],
                    });
                  const page = typeof item === 'number' ? item : Number(itemLabel(item));
                  return create(
                    'a',
                    {
                      key: itemIndex,
                      href: '#',
                      class: ['page-link', page === currentPage.value ? 'active' : undefined],
                      onClick: (event: Event) => {
                        event.preventDefault();
                        if (Number.isFinite(page)) setPage(page);
                      },
                    },
                    [
                      page === currentPage.value
                        ? create('span', { class: 'sr-only' }, props.message)
                        : null,
                      String(page),
                    ],
                  );
                }),
              ),
              create(
                'a',
                {
                  class: ['page-navi', 'next'],
                  href: '#',
                  onClick: (event: Event) => {
                    event.preventDefault();
                    setPage(currentPage.value + 1);
                  },
                },
                props.nextLabel,
              ),
            ],
          );
        }
        if (kind === 'resize')
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-resize', 'krds-drop-wrap', className],
              'data-adjust': 'scale',
            },
            [
              create(
                'button',
                {
                  ...withoutClass(attrs),
                  type: 'button',
                  class: ['krds-btn', 'small', 'text', 'drop-btn'],
                  'aria-expanded': open.value,
                  onClick: () => setOpen(!open.value),
                },
                [props.label, create('i', { class: ['svg-icon', 'ico-toggle'] })],
              ),
              create('div', { class: 'drop-menu' }, [
                create('div', { class: 'drop-in' }, [
                  create(
                    'ul',
                    { class: 'drop-list' },
                    props.options.map((option) =>
                      create('li', { key: option.value }, [
                        create(
                          'button',
                          {
                            type: 'button',
                            class: [
                              'item-link',
                              option.value,
                              value.value === option.value ? 'active' : undefined,
                            ],
                            'data-adjust-scale': option.value,
                            onClick: () => setValue(option.value),
                          },
                          [
                            option.label,
                            create(
                              'span',
                              { class: 'sr-only' },
                              value.value === option.value ? props.selectedLabel : '',
                            ),
                          ],
                        ),
                      ]),
                    ),
                  ),
                  create('div', { class: 'drop-bottom' }, [
                    create(
                      'button',
                      {
                        type: 'button',
                        class: ['krds-btn', 'medium', 'text'],
                        'data-adjust-scale': props.defaultValue ?? '',
                        onClick: () => setValue(String(props.defaultValue ?? '')),
                      },
                      [
                        create('i', { class: ['svg-icon', 'ico-reset'] }),
                        props.resetLabel,
                      ],
                    ),
                  ]),
                ]),
              ]),
            ],
          );
        if (
          kind === 'select' ||
          kind === 'select-size' ||
          kind === 'select-state' ||
          kind === 'select-sorting'
        )
          return create(
            'select',
            {
              ...attrs,
              id: id.value,
              name: props.name,
              value: selected.value,
              disabled: props.disabled,
              required: props.required,
              title: attrs.title ?? props.title ?? props.label,
              class:
                kind === 'select-sorting'
                  ? ['krds-form-select-sort', className]
                  : [
                      'krds-form-select',
                      kind === 'select-state' && props.state === 'error'
                        ? 'is-error'
                        : undefined,
                      kind === 'select-size' ? props.size : undefined,
                      className,
                    ],
              onChange: (event: Event) => {
                invokeNativeEvent(attrs.onChange, event);
                setSelected((event.target as HTMLSelectElement).value);
                emit('change', event);
              },
            },
            props.options.map((option, optionIndex) =>
              create(
                'option',
                {
                  key: optionIndex,
                  value: option.value,
                  disabled: option.disabled,
                  selected: kind === 'select-size' && optionIndex === 0 ? '' : undefined,
                },
                option.label,
              ),
            ),
          );
        if (kind === 'side-navigation') {
          const navigationItems = (props.items.length ? props.items : props.links) as KrdsNavItem[];
          return create(
            'nav',
            {
              ...attrs,
              class: ['krds-side-navigation', className],
            },
            [
              create('h2', { class: 'lnb-tit' }, props.title ?? props.label),
              sideNavigationList(navigationItems, id.value),
            ],
          );
        }
        if (kind === 'skip-link')
          return create(
            'a',
            { ...attrs, href: props.href, class: className },
            slotChildren.length ? slotChildren : props.label,
          );
        if (kind === 'spinner')
          return create(
            'div',
            { ...attrs, class: ['krds-spinner', className], role: 'status' },
            create('span', { class: 'sr-only' }, props.label),
          );
        if (kind === 'step-indicator')
          return create(
            'ol',
            { ...attrs, class: ['krds-step-wrap', className] },
            props.steps.map((step, stepIndex) => {
              const stepNumber = stepIndex + 1;
              const currentStepIndex = props.current ?? props.defaultCurrent ?? 0;
              const isCurrent = stepIndex === currentStepIndex;
              return create(
                'li',
                {
                  key: step.id,
                  class: [
                    stepIndex < currentStepIndex ? 'done' : undefined,
                    isCurrent ? 'active' : undefined,
                  ],
                },
                create('span', [
                  isCurrent ? create('em', { class: 'sr-only' }, props.message) : null,
                  create('i', { class: 'step' }, `${stepNumber}${props.label}`),
                  create('span', { class: 'step-tit' }, step.label),
                ]),
              );
            }),
          );
        if (kind === 'structured-list')
          return create(
            'ul',
            { ...attrs, class: ['krds-structured-list', 'type-full', className] },
            props.items.map((item, itemIndex) => {
              const listItem = item as AdditionalStructuredListItem;
              return create('li', { key: listItem.id ?? itemIndex, class: 'structured-item' }, [
                create('div', { class: 'in' }, [
                  listItem.badge
                    ? create('div', { class: 'card-top' }, [
                        create(
                          'span',
                          { class: ['krds-badge', listItem.tone] },
                          listItem.badge,
                        ),
                      ])
                    : null,
                  create('div', { class: 'card-body' }, [
                    create('a', { class: 'c-text', href: listItem.href }, [
                      create('p', { class: 'c-tit' }, [
                        create('span', { class: 'span' }, listItem.title),
                      ]),
                      listItem.description
                        ? create('p', { class: 'c-txt' }, listItem.description)
                        : null,
                      listItem.date || listItem.dateLabel || props.dateValue || props.dateLabel
                        ? create('p', { class: 'c-date' }, [
                            create('strong', { class: 'key' }, listItem.dateLabel ?? props.dateLabel),
                            create('span', { class: 'value' }, listItem.date ?? props.dateValue),
                          ])
                        : null,
                    ]),
                    listItem.actionLabel || props.actionLabel
                      ? create('div', { class: 'c-btn' }, [
                          create(
                            'a',
                            { class: ['krds-btn', 'secondary'], href: listItem.href },
                            listItem.actionLabel ?? props.actionLabel,
                          ),
                        ])
                      : null,
                  ]),
                  (listItem.tags?.length ?? props.tags.length) > 0
                    ? create(
                        'div',
                        { class: 'card-btm' },
                        (listItem.tags?.length ? listItem.tags : props.tags).map((tag) =>
                          create('span', { class: 'tag' }, tag),
                        ),
                      )
                    : null,
                  create('div', { class: 'card-btn' }, [
                    create(
                      'button',
                      { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                      create('i', { class: ['svg-icon', 'ico-share'] }),
                    ),
                    create(
                      'button',
                      { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                      create('i', { class: ['svg-icon', 'ico-like'] }),
                    ),
                  ]),
                ]),
              ]);
            }),
          );
        if (kind === 'structured-list-table' || kind === 'table')
          return create(
            'table',
            { ...attrs, class: ['tbl', 'data', 'col'] },
            [
              create('caption', props.caption ?? props.title),
              create('colgroup', [
                ...props.columns.map((column, columnIndex) =>
                  create('col', {
                    key: column.key ?? columnIndex,
                    style: column.width ? `width: ${column.width};` : undefined,
                  }),
                ),
                kind === 'structured-list-table' ? create('col') : null,
              ]),
              create(
                'thead',
                create(
                  'tr',
                  props.columns.length
                    ? props.columns.map((column) =>
                        create('th', { key: column.key, scope: 'col' }, [
                          column.visuallyHidden
                            ? create('span', { class: 'sr-only' }, column.label)
                            : column.label,
                        ]),
                      )
                    : create(
                        'th',
                        { scope: 'col' },
                        create(
                          'span',
                          { class: 'sr-only' },
                          props.caption ?? props.title ?? '표',
                        ),
                      ),
                ),
              ),
              create(
                'tbody',
                props.rows.map((row, rowIndex) =>
                  create(
                    'tr',
                    { key: String(row.id ?? rowIndex) },
                    props.columns.map((column, columnIndex) => {
                      if (kind === 'structured-list-table' && columnIndex === 0) {
                        const checkboxId = `${id.value}-${row.id ?? rowIndex}`;
                        const rowLabel = String(row[column.key] ?? row.id ?? `행 ${rowIndex + 1}`);
                        return create('th', { scope: 'row' }, [
                          create('div', { class: 'krds-form-check' }, [
                            create('input', {
                              id: checkboxId,
                              class: 'chk',
                              type: 'checkbox',
                              checked: Boolean(row[column.key]),
                              'aria-label': `${rowLabel} 선택`,
                            }),
                            create('label', { for: checkboxId, class: 'sr-only' }, rowLabel),
                          ]),
                        ]);
                      }
                      if (kind === 'structured-list-table' && column.key === 'download')
                        return create('td', [
                          create(
                            'button',
                            { type: 'button', class: ['krds-btn', 'medium', 'text'] },
                            [
                              create('i', { class: ['svg-icon', 'ico-down'] }),
                              String(row[column.key] ?? ''),
                            ],
                          ),
                        ]);
                      return columnIndex === 0
                        ? create('th', { scope: 'row' }, String(row[column.key] ?? ''))
                        : create('td', String(row[column.key] ?? ''));
                    }),
                  ),
                ),
              ),
            ],
          );
        if (kind === 'tab') {
          const active = selected.value;
          const enabledTabs = props.tabs.filter((tab) => !tab.disabled);
          const moveTab = (event: KeyboardEvent, tabId: string) => {
            const currentIndex = enabledTabs.findIndex((tab) => tab.id === tabId);
            if (currentIndex < 0 || !enabledTabs.length) return;
            let nextIndex = currentIndex;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              nextIndex = (currentIndex + 1) % enabledTabs.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
            } else if (event.key === 'Home') {
              nextIndex = 0;
            } else if (event.key === 'End') {
              nextIndex = enabledTabs.length - 1;
            } else {
              return;
            }
            event.preventDefault();
            const nextTab = enabledTabs[nextIndex];
            if (nextTab) setSelected(nextTab.id);
          };
          return create(
            'div',
            { ...withoutNativeEvents(attrs), class: ['krds-tab-area', className] },
            [
              create(
                'ul',
                { role: 'tablist', 'aria-label': props.label ?? '탭' },
                props.tabs.map((tab) => {
                  const tabId = `${id.value}-tab-${tab.id}`;
                  const panelId = `${id.value}-panel-${tab.id}`;
                  const isActive = active === tab.id;
                  return create(
                    'li',
                    { key: tab.id, role: 'none' },
                    create(
                      'button',
                      {
                        id: tabId,
                        type: 'button',
                        role: 'tab',
                        class: ['btn-tab', isActive ? 'active' : undefined],
                        'aria-selected': isActive,
                        'aria-controls': panelId,
                        tabIndex: isActive ? 0 : -1,
                        disabled: tab.disabled,
                        onClick: () => setSelected(tab.id),
                        onKeydown: (event: KeyboardEvent) => moveTab(event, tab.id),
                      },
                      [
                        tab.label,
                        isActive
                          ? create('i', { class: ['sr-only', 'created'] }, '선택됨')
                          : null,
                      ],
                    ),
                  );
                }),
              ),
              create(
                'div',
                { class: 'tab-panels' },
                props.tabs.map((tab) => {
                  const tabId = `${id.value}-tab-${tab.id}`;
                  const panelId = `${id.value}-panel-${tab.id}`;
                  return create(
                    'section',
                    {
                      key: panelId,
                      id: panelId,
                      role: 'tabpanel',
                      'aria-labelledby': tabId,
                      hidden: active !== tab.id,
                      tabIndex: 0,
                    },
                    props.panels[tab.id] ?? (tab.id === active ? slotChildren : ''),
                  );
                }),
              ),
            ],
          );
        }
        if (kind === 'tag' || kind === 'tag-link')
          return kind === 'tag-link'
            ? create(
                'a',
                { ...attrs, href: props.href, class: ['krds-btn-tag', 'link', className] },
                slotChildren.length ? slotChildren : props.label,
              )
            : create(
                'span',
                { ...attrs, class: ['krds-btn-tag', className] },
                [
                  slotChildren.length ? slotChildren : props.label,
                  props.removable
                    ? create(
                        'button',
                        {
                          type: 'button',
                          class: 'btn-delete',
                          onClick: () => emit('close'),
                        },
                        create('span', { class: 'sr-only' }, props.message),
                      )
                    : null,
                ],
              );
        if (kind === 'textarea')
          return create('textarea', {
            ...attrs,
            id: id.value,
            name: props.name,
            value: value.value,
            maxlength: attrs.maxlength ?? attrs.maxLength,
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: props.readonly,
            required: props.required,
            onInput: (event: Event) => {
              invokeNativeEvent(attrs.onInput, event);
              setValue((event.target as HTMLTextAreaElement).value);
            },
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              emit('change', event);
            },
            class: ['krds-input', className],
          });
        if (kind === 'text-input-icon')
          return create('input', {
            ...attrs,
            id: id.value,
            name: props.name,
            type: props.type ?? 'text',
            value: value.value,
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: props.readonly,
            required: props.required,
            class: ['krds-input', className],
            onInput: (event: Event) => {
              invokeNativeEvent(attrs.onInput, event);
              setValue((event.target as HTMLInputElement).value);
            },
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              emit('change', event);
            },
          });
        if (kind === 'text-list' || kind === 'text-list-ordered')
          return textList(props.items, kind === 'text-list-ordered', 1, {
            ...attrs,
            class: className,
          });
        if (kind === 'tooltip' || kind === 'tooltip-box' || kind === 'tooltip-vertical') {
          const tooltipId = `${id.value}-tooltip`;
          return create(Fragment, null, [
            create(
              'button',
              {
                ...attrs,
                id: props.id,
                type: props.type ?? 'button',
                name: props.name,
                disabled: props.disabled,
                class: [
                  'krds-btn',
                  'small',
                  'text',
                  'krds-tooltip',
                  kind === 'tooltip-box'
                    ? 'tooltip-box'
                    : kind === 'tooltip-vertical'
                      ? 'tooltip-vertical'
                      : undefined,
                  className,
                ],
                'aria-labelledby':
                  typeof attrs['aria-labelledby'] === 'string'
                    ? `${attrs['aria-labelledby']} ${tooltipId}`
                    : tooltipId,
                'data-tooltip': props.message,
              },
              [
                slotChildren.length ? slotChildren : props.label,
                create('i', { class: ['svg-icon', 'ico-angle', 'right'] }),
              ],
            ),
            create(
              'div',
              {
                id: tooltipId,
                class: 'krds-tooltip-popover',
                'aria-hidden': 'true',
              },
              [
                create('span', { class: 'sr-only' }, props.label),
                props.message,
              ],
            ),
          ]);
        }
        if (kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size') {
          const isPlaying = props.playing ?? checked.value;
          return create(
            'button',
            {
              ...attrs,
              type: 'button',
              disabled: props.disabled,
              class: ['krds-tts', props.size ?? 'medium', className],
              'aria-pressed':
                props.playing !== undefined || props.checked !== undefined
                  ? isPlaying
                  : undefined,
              onClick: (event: MouseEvent) => {
                invokeNativeEvent(attrs.onClick, event);
                setChecked(!isPlaying);
              },
            },
            [
              create(
                'span',
                { class: 'krds-tts-icon', 'aria-hidden': 'true' },
                create('i', {
                  class: ['svg-icon', isPlaying ? 'ico-stop' : 'ico-volume'],
                }),
              ),
              kind === 'tts-icon' || props.iconOnly
                ? null
                : create(
                    'span',
                    { class: 'krds-tts-text' },
                    slotChildren.length ? slotChildren : props.text,
                  ),
            ],
          );
        }
        if (kind === 'toggle-switch' || kind === 'toggle-switch-size')
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-form-toggle-switch', props.size, className],
            },
            [
              create('input', {
                ...withoutClass(attrs),
                id: id.value,
                name: props.name,
                type: 'checkbox',
                checked: checked.value,
                disabled: props.disabled,
                required: props.required,
                onChange: (event: Event) => {
                  invokeNativeEvent(attrs.onChange, event);
                  setChecked((event.target as HTMLInputElement).checked);
                  emit('change', event);
                },
              }),
              create('label', { for: id.value }, [
                create('span', { class: 'switch-toggle' }, create('i')),
                props.label,
              ]),
            ],
          );
        if (kind === 'radio-button' || kind === 'radio-size') {
          const radioValue = props.value ?? 'on';
          const input = create('input', {
            ...withoutClass(attrs),
            id: id.value,
            type: 'radio',
            name: props.name,
            value: props.value,
            checked:
              props.modelValue !== undefined
                ? props.modelValue === radioValue
                : selected.value === String(radioValue),
            disabled: props.disabled,
            required: props.required,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              if (props.modelValue === undefined) localSelected.value = String(radioValue);
              emit('update:modelValue', radioValue);
              emit('change', event);
            },
          });
          return create(
            'div',
            {
              ...withoutNativeEvents(attrs),
              class: ['krds-form-check', kind === 'radio-size' ? props.size : undefined, className],
            },
            [
              input,
              create(
                'label',
                { for: id.value },
                slotChildren.length ? slotChildren : props.label,
              ),
            ],
          );
        }
        return create('div', { ...attrs, class: className }, slotChildren);
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
