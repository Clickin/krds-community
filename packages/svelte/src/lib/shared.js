import { selectRecipe, tabRecipe } from "@krds-community/recipes";

export { selectRecipe, tabRecipe };

export const toneClass = {
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

export const zoomOptions = [
  { value: "sm", label: "작게" },
  { value: "md", label: "보통" },
  { value: "lg", label: "조금 크게" },
  { value: "xlg", label: "크게" },
  { value: "xxlg", label: "가장크게" },
];

export const labelOf = (item) => {
  if (typeof item === "string" || typeof item === "number") return String(item);
  if (!item || typeof item !== "object") return "";
  if ("label" in item && typeof item.label === "string") return item.label;
  if ("title" in item && typeof item.title === "string") return item.title;
  return "";
};

export const fieldOf = (item, field) => {
  if (!item || typeof item !== "object" || !(field in item)) return "";
  const entry = item[field];
  return typeof entry === "string" || typeof entry === "number" ? String(entry) : "";
};

export const flagOf = (item, field) =>
  Boolean(item && typeof item === "object" && field in item && item[field]);

export const hrefOf = (item) => fieldOf(item, "href") || "#";

export const childrenOf = (item) => {
  if (!item || typeof item !== "object" || !("children" in item) || !Array.isArray(item.children))
    return [];
  return item.children;
};

export const listOf = (item, field) => {
  if (!item || typeof item !== "object" || !(field in item)) return [];
  const entry = item[field];
  return Array.isArray(entry) ? entry : [];
};

export const recordOf = (item, field) => {
  if (!item || typeof item !== "object" || !(field in item)) return undefined;
  const entry = item[field];
  return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : undefined;
};

export const invoke = (handler, event) => {
  if (typeof handler === "function") handler(event);
};

export const reflectValueAttribute = (node, reflectedValue) => {
  const reflect = (nextValue) => {
    if (nextValue) node.setAttribute("value", nextValue);
    else node.removeAttribute("value");
  };
  reflect(reflectedValue);
  return { update: reflect };
};

export const inertWhen = (node, value) => {
  const sync = (next) => node.toggleAttribute("inert", next);
  sync(value);
  return { update: sync };
};
