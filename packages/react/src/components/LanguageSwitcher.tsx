import { useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx, type KrdsOption } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";

export interface LanguageOption extends KrdsOption {
  href?: string;
  lang?: string;
  target?: string;
  title?: string;
  external?: boolean;
}
export interface LanguageSwitcherProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  languages?: LanguageOption[];
  options?: LanguageOption[];
  value?: string;
  selected?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  label?: ReactNode;
  currentLabel?: ReactNode;
  selectedLabel?: ReactNode;
  externalTitle?: string;
  text?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export function LanguageMenu({
  page,
  languages,
  options,
  value,
  selected,
  defaultValue,
  open: controlledOpen,
  defaultOpen = false,
  label,
  currentLabel,
  selectedLabel,
  externalTitle,
  text,
  onChange,
  onOpenChange,
  className,
  ref,
  ...props
}: LanguageSwitcherProps & { page: boolean } & { ref?: Ref<HTMLDivElement> }) {
  const items = languages?.length ? languages : (options ?? []);
  const controlledValue = value ?? selected;
  const valueControlled = value !== undefined || selected !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items[0]?.value ?? "");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropId = useId();
  const selectedValue = controlledValue ?? uncontrolledValue;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const select = (next: string) => {
    if (!valueControlled) setUncontrolledValue(next);
    onChange?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const current = items.find((language) => language.value === selectedValue);
  const links = page ? items.filter((language) => language.value !== selectedValue) : items;
  return (
    <div {...props} ref={ref} className={cx("krds-drop-wrap", "krds-language", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cx("krds-btn", "small", "text", "drop-btn", open && "active")}
        aria-expanded={open}
        aria-controls={dropId}
        onClick={() => setOpen(!open)}
      >
        <SvgIcon name="ico-global" /> {label} <SvgIcon name="ico-toggle" />
      </button>
      <div id={dropId} className="drop-menu">
        <div className="drop-in">
          {page ? (
            <div className="drop-top">
              <p className="current-laguage">
                <span>{currentLabel}</span>
                <strong>{current?.label}</strong>
              </p>
            </div>
          ) : null}
          <ul className="drop-list">
            {links.map((language) => {
              const external = page || language.external || language.target === "_blank";
              const active = !page && selectedValue === language.value;
              return (
                <li key={language.value}>
                  <a
                    href={language.href ?? "#"}
                    className={cx("item-link", active && "active")}
                    lang={language.lang ?? language.value}
                    target={language.target ?? (external ? "_blank" : undefined)}
                    title={language.title ?? (external ? (externalTitle ?? text) : undefined)}
                    aria-disabled={language.disabled || undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (!language.disabled) select(language.value);
                    }}
                  >
                    {language.label}
                    {page ? <SvgIcon name="ico-go" /> : null}
                    <span className="sr-only">{active ? selectedLabel : null}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function LanguageSwitcher({
  ref,
  ...props
}: LanguageSwitcherProps & { ref?: Ref<HTMLDivElement> }) {
  return <LanguageMenu {...props} {...(ref !== undefined ? { ref } : {})} page={false} />;
}
