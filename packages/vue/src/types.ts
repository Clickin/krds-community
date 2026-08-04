import type {
  KrdsAdditionalProps,
  KrdsListItem,
  KrdsStep,
  KrdsTableColumn,
  KrdsTabItem,
  InputState,
  KrdsNavItem,
  KrdsOption,
} from "@krds-community/recipes";
export type { InputState, KrdsNavItem, KrdsOption };

export type AdditionalValue = string | number | boolean | string[];

type AdditionalButtonVariant = "primary" | "secondary" | "tertiary";

export type AdditionalLanguage = KrdsOption & {
  href?: string;
  lang?: string;
  external?: boolean;
};

export interface AdditionalAlertItem {
  id?: string;
  badge: string;
  tone: "danger" | "ok" | "info";
  text: string;
  message?: string;
  title?: string;
  href?: string;
  linkLabel?: string;
  badgeLabel?: string;
  label?: string;
}

export interface AdditionalStructuredListItem extends KrdsListItem {
  tone?: string;
  badgeClass?: string;
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
  kind?: "link" | "dropdown" | "resize";
  items?: AdditionalMenuItem[];
  className?: string;
  selected?: boolean;
  resetLabel?: string;
  selectedLabel?: string;
}

export interface AdditionalFileItem {
  id: string;
  name: string;
  status: "uploading" | "complete" | "deletable" | "error" | "downloadable";
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

export interface AdditionalTableRow extends Record<string, string | number | boolean | undefined> {
  selectionLabel?: string;
}

export interface AdditionalAction {
  id?: string;
  label: string;
  icon?: string;
}

export interface AdditionalPagination {
  current: number;
  items: (number | "ellipsis")[];
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
  menuLabel?: string;
}

type AdditionalPropsExtension = {
  variant?: AdditionalButtonVariant;
  languages?: AdditionalLanguage[];
  nav?: KrdsNavItem[];
  error?: string;
  state?: InputState;
  step?: string;
  type?: string;
  previousLabel?: string;
  nextLabel?: string;
  navigationLabel?: string;
  moreLabel?: string;
  imageLabel?: string;
  actionLabel?: string;
  playLabel?: string;
  stopLabel?: string;
  removable?: boolean;
  panelTitle?: string;
  external?: boolean;
  selectedLabel?: string;
  currentLabel?: string;
  externalTitle?: string;
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
  currentStepLabel?: string;
  totalStepsLabel?: string;
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
  backTitle?: string;
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
  countSuffix?: string;
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
  displayYear?: number;
  displayMonth?: number;
  selectedYear?: number;
  selectedMonth?: number;
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
  ordered?: boolean;
};

export type AdditionalProps = Omit<KrdsAdditionalProps, "className" | "items" | "modelValue"> &
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

export type AnyItem =
  | NonNullable<KrdsAdditionalProps["items"]>[number]
  | AdditionalAlertItem
  | AdditionalStructuredListItem
  | AdditionalMenuItem
  | KrdsOption
  | KrdsStep
  | KrdsTabItem
  | number;

export type NativeEventHandler = (event: Event) => unknown;

export interface CalendarRenderData {
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
  displayYear?: number | undefined;
  displayMonth?: number | undefined;
  selectedYear?: number | undefined;
  selectedMonth?: number | undefined;
  year?: number | undefined;
  month?: number | undefined;
  disabledMonths: number[];
  rangeStartDay?: number | undefined;
  rangeEndDay?: number | undefined;
  todayDay?: number | undefined;
  eventDays: number[];
  disabledDays: number[];
}
