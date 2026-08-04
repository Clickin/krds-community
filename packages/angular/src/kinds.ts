import type { KrdsNavItem, KrdsTableRow } from "@krds-community/recipes";

export type AngularNavItem = Omit<KrdsNavItem, "children"> & {
  id: string;
  label: string;
  href?: string;
  target?: string;
  title?: string;
  active?: boolean;
  button?: boolean;
  children?: AngularNavItem[];
  className?: string;
  selected?: boolean;
  titleHref?: string;
  titleLinkLabel?: string;
  banner?: { badge: string; label: string };
  descriptionItems?: Array<{
    title: string;
    href: string;
    description: string;
    target?: string;
    externalTitle?: string;
  }>;
};

export type HeaderUtilityItem = {
  id: string;
  kind?: "link" | "dropdown" | "resize";
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
  menuLabel?: string;
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

export type AngularTableRow = KrdsTableRow;

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

export const CALENDAR_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

let nextKindId = 0;

export function createStableId(prefix: string): string {
  nextKindId += 1;
  return `${prefix}-${nextKindId.toString(36)}`;
}

export const ANGULAR_ADDITIONAL_KINDS = [
  "surface",
  "badge",
  "badge-number",
  "badge-size",
  "breadcrumb",
  "accordion",
  "accordion-line",
  "button-icon",
  "button-text",
  "button-with-icon",
  "button-hierarchy",
  "button-size",
  "calendar",
  "calendar-range",
  "date-input",
  "carousel",
  "carousel-banner",
  "checkbox-chip",
  "checkbox-size",
  "radio-chip",
  "radio-size",
  "radio-button",
  "coach-mark",
  "contextual-help",
  "critical-alerts",
  "disclosure",
  "favicon",
  "file-upload",
  "footer",
  "header",
  "help-panel",
  "tutorial-panel",
  "identifier",
  "in-page-navigation",
  "language-switcher",
  "language-switcher-page",
  "link",
  "main-menu-mobile",
  "main-menu-pc",
  "masthead",
  "modal",
  "modal-sample",
  "pagination",
  "resize",
  "select",
  "select-size",
  "select-sorting",
  "select-state",
  "side-navigation",
  "skip-link",
  "spinner",
  "step-indicator",
  "structured-list",
  "structured-list-table",
  "tab",
  "table",
  "tag",
  "tag-link",
  "textarea",
  "text-input-icon",
  "text-input-size",
  "text-input-state",
  "text-list",
  "text-list-ordered",
  "toggle-switch",
  "toggle-switch-size",
  "tooltip",
  "tooltip-box",
  "tooltip-vertical",
  "tts",
  "tts-icon",
  "tts-size",
] as const;

export type AngularAdditionalKind = (typeof ANGULAR_ADDITIONAL_KINDS)[number];

export type AngularImplementedAdditionalKind =
  | "calendar"
  | "calendar-range"
  | "checkbox-chip"
  | "date-input"
  | "header"
  | "language-switcher"
  | "radio-button"
  | "radio-chip"
  | "select"
  | "structured-list-table"
  | "textarea"
  | "text-input-icon"
  | "toggle-switch";

export type AngularUnverifiedAdditionalKind = Exclude<
  AngularAdditionalKind,
  AngularImplementedAdditionalKind
>;

export type AngularAdditionalSupport =
  | { readonly status: "implemented"; readonly kind: AngularImplementedAdditionalKind }
  | { readonly status: "unverified"; readonly kind: AngularUnverifiedAdditionalKind };

export const ADDITIONAL_ALIAS_KINDS: Record<string, AngularAdditionalKind> = {
  "krds-badge": "badge",
  "krds-badge-number": "badge-number",
  "krds-badge-size": "badge-size",
  "krds-accordion-line": "accordion-line",
  "krds-breadcrumb": "breadcrumb",
  "krds-button-hierarchy": "button-hierarchy",
  "krds-button-icon": "button-icon",
  "krds-button-size": "button-size",
  "krds-button-text": "button-text",
  "krds-button-with-icon": "button-with-icon",
  "krds-calendar": "calendar",
  "krds-calendar-range": "calendar-range",
  "krds-carousel": "carousel",
  "krds-carousel-banner": "carousel-banner",
  "krds-checkbox-chip": "checkbox-chip",
  "krds-checkbox-size": "checkbox-size",
  "krds-coach-mark": "coach-mark",
  "krds-contextual-help": "contextual-help",
  "krds-critical-alerts": "critical-alerts",
  "krds-date-input": "date-input",
  "krds-disclosure": "disclosure",
  "krds-favicon": "favicon",
  "krds-file-upload": "file-upload",
  "krds-footer": "footer",
  "krds-header": "header",
  "krds-help-panel": "help-panel",
  "krds-identifier": "identifier",
  "krds-in-page-navigation": "in-page-navigation",
  "krds-language-switcher": "language-switcher",
  "krds-language-switcher-page": "language-switcher-page",
  "krds-link": "link",
  "krds-main-menu-mobile": "main-menu-mobile",
  "krds-main-menu-pc": "main-menu-pc",
  "krds-masthead": "masthead",
  "krds-modal": "modal",
  "krds-modal-sample": "modal-sample",
  "krds-pagination": "pagination",
  "krds-radio-button": "radio-button",
  "krds-radio-chip": "radio-chip",
  "krds-radio-size": "radio-size",
  "krds-resize": "resize",
  "krds-select": "select",
  "krds-select-size": "select-size",
  "krds-select-sorting": "select-sorting",
  "krds-select-state": "select-state",
  "krds-side-navigation": "side-navigation",
  "krds-skip-link": "skip-link",
  "krds-spinner": "spinner",
  "krds-step-indicator": "step-indicator",
  "krds-structured-list": "structured-list",
  "krds-structured-list-table": "structured-list-table",
  "krds-tab": "tab",
  "krds-table": "table",
  "krds-tag": "tag",
  "krds-tag-link": "tag-link",
  "krds-textarea": "textarea",
  "krds-text-input-icon": "text-input-icon",
  "krds-text-input-size": "text-input-size",
  "krds-text-input-state": "text-input-state",
  "krds-text-list": "text-list",
  "krds-text-list-ordered": "text-list-ordered",
  "krds-toggle-switch": "toggle-switch",
  "krds-toggle-switch-size": "toggle-switch-size",
  "krds-tooltip": "tooltip",
  "krds-tooltip-box": "tooltip-box",
  "krds-tooltip-vertical": "tooltip-vertical",
  "krds-tts": "tts",
  "krds-tts-icon": "tts-icon",
  "krds-tts-size": "tts-size",
  "krds-tutorial-panel": "tutorial-panel",
};

export const KIND_ALIASES: Partial<Record<AngularAdditionalKind, AngularAdditionalKind>> = {};
