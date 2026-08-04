export type KrdsTone =
  | "primary"
  | "secondary"
  | "gray"
  | "point"
  | "danger"
  | "warning"
  | "success"
  | "information"
  | "disabled";

export type KrdsOption = { value: string; label: string; disabled?: boolean };
export type KrdsNavItem = {
  id?: string;
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  children?: KrdsNavItem[];
};
export type KrdsTabItem = { id: string; label: string; disabled?: boolean };
export type KrdsStep = { id: string; label: string; description?: string };
export type KrdsTableColumn = { key: string; label: string };
export type KrdsTableRow = Record<string, string | number>;
export type KrdsListItem = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  badge?: string;
};
export type KrdsCarouselSlide = { id: string; title: string; description?: string; href?: string };
export type KrdsPaginationItem = number | "ellipsis";

/** Framework-neutral data and state props. Framework event/ref/children props stay local. */
export interface KrdsAdditionalProps {
  kind?: string;
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  hint?: string;
  tone?: KrdsTone;
  appearance?: "outline" | "solid" | "light";
  size?: string;
  number?: boolean;
  href?: string;
  message?: string;
  position?: string;
  open?: boolean;
  disabled?: boolean;
  value?: string | number | boolean;
  modelValue?: string | number | boolean | string[];
  name?: string;
  required?: boolean;
  readonly?: boolean;
  organization?: string;
  current?: number;
  selected?: string;
  checked?: boolean;
  playing?: boolean;
  options?: KrdsOption[];
  items?: (KrdsNavItem | KrdsListItem | string)[];
  links?: KrdsNavItem[];
  slides?: KrdsCarouselSlide[];
  tabs?: KrdsTabItem[];
  panels?: Record<string, string>;
  steps?: KrdsStep[];
  columns?: KrdsTableColumn[];
  rows?: KrdsTableRow[];
  className?: string;
}
