import type { KrdsListItem, KrdsNavItem, KrdsTabItem, KrdsTone } from "@krds-community/recipes";

// ====== Calendar types ======
export interface CalendarChoice {
  label: string;
  value?: string;
  active?: boolean;
  disabled?: boolean;
}
export interface CalendarDay {
  label: string;
  value?: string;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  ariaLabel?: string;
}
export interface CalendarAction {
  label: string;
  variant?: string;
  id?: string;
  icon?: string;
}
export type CalendarChoiceInput = CalendarChoice | number;

// ====== Table types ======
export interface TableColumn {
  label: string;
  key: string;
  width?: string;
  visuallyHidden?: boolean;
}
export interface TableRow extends Record<string, string | number | boolean | undefined> {
  id?: string | number;
  selected?: boolean;
  selectionLabel?: string;
}
export interface TablePagination {
  current: number;
  items: (number | "ellipsis")[];
  previousDisabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  currentLabel: string;
}

// ====== Additional item types ======
export interface AlertItem extends KrdsListItem {
  badgeLabel?: string;
  linkLabel?: string;
  message?: string;
  text?: string;
}
export interface StructuredItem extends KrdsListItem {
  badgeClass?: string;
  dateLabel?: string;
  dateValue?: string;
  tags?: string[];
  actionLabel?: string;
  shareLabel?: string;
  favoriteLabel?: string;
}
export interface HelpTab extends KrdsTabItem {
  panelId: string;
}
export interface HelpLink extends KrdsNavItem {
  icon?: string;
  title?: string;
}
export interface HelpRelatedGroup {
  title: string;
  links: HelpLink[];
}
export interface TutorialTask {
  title: string;
  steps: string[];
  current?: boolean;
  summary?: string;
}

// ====== Menu types ======
export interface MenuDescriptionItem {
  title: string;
  description: string;
  href?: string;
  target?: string;
  externalTitle?: string;
}
export interface MenuBanner {
  badge: string;
  label: string;
}
export interface MenuItem extends Omit<KrdsNavItem, "children"> {
  active?: boolean;
  title?: string;
  titleHref?: string;
  titleLinkLabel?: string;
  target?: string;
  icon?: string;
  emphasis?: boolean;
  kind?: "link" | "dropdown" | "resize";
  className?: string;
  selected?: boolean;
  selectedLabel?: string;
  resetLabel?: string;
  items?: MenuItem[];
  button?: boolean;
  descriptionItems?: MenuDescriptionItem[];
  banner?: MenuBanner;
  children?: MenuItem[];
}

// ====== Footer types ======
export interface FooterContact {
  title: string;
  description: string;
}

// ====== File upload types ======
export interface UploadFile {
  id: string;
  name: string;
  status: "uploading" | "complete" | "deletable" | "error" | "downloadable";
  statusLabel?: string;
  deleteLabel?: string;
  errors?: string[];
  downloadLabel?: string;
  previewLabel?: string;
}

// ====== Header types ======
export interface HeaderMyMenu {
  label: string;
  userName: string;
  timeLabel: string;
  time: string;
  extendLabel: string;
  items: MenuItem[];
  logoutLabel: string;
}
export interface HeaderMobileMenu {
  utilityItems: MenuItem[];
  loginLabel: string;
  serviceItems: MenuItem[];
  searchPlaceholder: string;
  searchTitle: string;
  searchLabel: string;
  items: MenuItem[];
  previousLabel: string;
  closeLabel: string;
  bottomItems: MenuItem[];
}

// ====== Helper functions ======

export const numberValue = (value: unknown, fallback: number): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const choiceNumber = (choice: CalendarChoiceInput, fallback: number): number => {
  if (typeof choice === "number") return choice;
  return numberValue(choice.value ?? choice.label.replace(/[^\d-]/g, ""), fallback);
};

export const padCalendarPart = (value: number) => String(value).padStart(2, "0");

export const tones: Record<KrdsTone, string> = {
  primary: "primary",
  secondary: "secondary",
  gray: "gray",
  point: "point",
  danger: "danger",
  warning: "warning",
  success: "success",
  information: "information",
  disabled: "disabled",
};

export const labelOf = (item: unknown) =>
  typeof item === "string" || typeof item === "number"
    ? String(item)
    : typeof item === "object" && item !== null && "label" in item
      ? (item as { label: string }).label
      : typeof item === "object" && item !== null && "title" in item
        ? (item as { title: string }).title
        : String(item);

export const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const trapTabFocus = (event: KeyboardEvent, container: HTMLElement) => {
  if (event.key !== "Tab") return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("hidden") && element.tabIndex >= 0,
  );
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === container)
  ) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
};
