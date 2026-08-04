import { useId, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import type { MainMenuItem } from "./MainMenuPc.js";
import { SvgIcon } from "./_utils.js";
import { MainMenuMobile } from "./MainMenuMobile.js";
import { MainMenuPc } from "./MainMenuPc.js";
import { Resize } from "./Resize.js";

export interface HeaderUtilitySubItem extends Omit<MainMenuItem, "children"> {
  className?: string;
  selected?: boolean;
}
export interface HeaderUtilityItem extends Omit<MainMenuItem, "children"> {
  kind: "link" | "dropdown" | "resize";
  items?: HeaderUtilitySubItem[];
  selectedLabel?: ReactNode;
  resetLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (id: string) => void;
  onReset?: () => void;
}
export interface HeaderMyMenu {
  label?: ReactNode;
  userName?: ReactNode;
  timeLabel?: ReactNode;
  time?: ReactNode;
  extendLabel?: ReactNode;
  items?: MainMenuItem[];
  logoutLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExtend?: () => void;
  onLogout?: () => void;
}
export interface HeaderMobileMenu {
  id?: string;
  utilityItems?: MainMenuItem[];
  loginLabel?: ReactNode;
  loginHref?: string;
  serviceItems?: MainMenuItem[];
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: ReactNode;
  searchValue?: string;
  defaultSearchValue?: string;
  items?: MainMenuItem[];
  bottomItems?: MainMenuItem[];
  previousLabel?: ReactNode;
  closeLabel?: ReactNode;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPrevious?: () => void;
  onClose?: () => void;
}
export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  utilityItems?: HeaderUtilityItem[];
  logoLabel?: ReactNode;
  logoHref?: string;
  searchLabel?: ReactNode;
  searchTitle?: string;
  loginLabel?: ReactNode;
  loginHref?: string;
  joinLabel?: ReactNode;
  allMenuLabel?: ReactNode;
  myMenu?: HeaderMyMenu;
  desktopItems?: MainMenuItem[];
  nav?: MainMenuItem[];
  links?: MainMenuItem[];
  menuLabel?: string;
  mobileMenu?: HeaderMobileMenu;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

function HeaderUtilityMenu({ item }: { item: HeaderUtilityItem }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(item.defaultOpen ?? false);
  const dropId = useId();
  const open = item.open ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (item.open === undefined) setUncontrolledOpen(next);
    item.onOpenChange?.(next);
  };
  if (item.kind === "resize") {
    return (
      <Resize
        dataAdjust={false}
        label={item.label}
        selectedLabel={item.selectedLabel}
        resetLabel={item.resetLabel}
        open={open}
        value={item.items?.find((option) => option.selected)?.id ?? item.items?.[0]?.id ?? ""}
        options={(item.items ?? []).map((option) => ({
          value: option.id ?? option.label,
          label: option.label,
          ...(option.className === undefined ? {} : { className: option.className }),
          ...(option.disabled === undefined ? {} : { disabled: option.disabled }),
        }))}
        onChange={(value) => item.onSelect?.(value)}
        {...(item.onReset ? { onReset: item.onReset } : {})}
        {...(item.onOpenChange ? { onOpenChange: item.onOpenChange } : {})}
      />
    );
  }
  if (item.kind === "link") {
    return (
      <a
        href={item.href ?? "#"}
        className="krds-btn small text"
        target={item.target}
        title={item.title}
      >
        {item.label + " "}
        <i className="svg-icon ico-go" />
      </a>
    );
  }
  return (
    <div className={cx("krds-drop-wrap", open && "active")}>
      <>
        <button
          type="button"
          className="drop-btn krds-btn small text"
          aria-expanded={open}
          aria-controls={dropId}
          onClick={() => setOpen(!open)}
        >
          {item.label + " "}
          <i className="svg-icon ico-toggle" />
        </button>
        <div id={dropId} className="drop-menu">
          <div className="drop-in">
            <ul className="drop-list">
              {item.items?.map((sub) => (
                <li key={sub.id}>
                  <a
                    href={sub.href ?? "#"}
                    className={cx("item-link", sub.selected && "active", sub.target && "ico-go")}
                    target={sub.target}
                    title={sub.title}
                    onClick={() => {
                      item.onSelect?.(sub.id ?? "");
                      setOpen(false);
                    }}
                  >
                    {sub.label}
                    <span className="sr-only" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    </div>
  );
}

export function Header({
  id = "krds-header",
  children: _children,
  title: _title,
  utilityItems = [],
  logoLabel,
  logoHref,
  searchLabel,
  searchTitle,
  loginLabel,
  loginHref,
  joinLabel,
  allMenuLabel,
  myMenu,
  desktopItems,
  nav,
  links,
  menuLabel,
  mobileMenu,
  mobileOpen: controlledMobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  ref,
  ...props
}: HeaderProps & { ref?: Ref<HTMLElement> }) {
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen);
  const [uncontrolledMyMenuOpen, setUncontrolledMyMenuOpen] = useState(
    myMenu?.defaultOpen ?? false,
  );
  const mobileOpen = controlledMobileOpen ?? uncontrolledMobileOpen;
  const myMenuOpen = myMenu?.open ?? uncontrolledMyMenuOpen;
  const menuItems = desktopItems ?? nav ?? links ?? [];
  const mobileId = mobileMenu?.id ?? "mobile-nav";
  const setMobileOpen = (next: boolean) => {
    if (controlledMobileOpen === undefined) setUncontrolledMobileOpen(next);
    onMobileOpenChange?.(next);
  };
  const setMyMenuOpen = (next: boolean) => {
    if (myMenu?.open === undefined) setUncontrolledMyMenuOpen(next);
    myMenu?.onOpenChange?.(next);
  };
  return (
    <header {...props} ref={ref} id={id} className={className}>
      <div className="header-in">
        <div className="header-container">
          <div className="inner">
            <div className="header-utility">
              <ul className="utility-list">
                {utilityItems.map((item, index) => (
                  <li key={item.id ?? index}>
                    <HeaderUtilityMenu item={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="header-branding">
              <h2 className="logo">
                <a href={logoHref}>
                  <span className="sr-only">{logoLabel}</span>
                </a>
              </h2>
              <div className="header-actions">
                <button type="button" className="btn-navi sch" title={searchTitle}>
                  {searchLabel}
                </button>
                <a href={loginHref} className="btn-navi login">
                  {loginLabel}
                </a>
                <button type="button" className="btn-navi join">
                  {joinLabel}
                </button>
                {myMenu ? (
                  <div className="krds-drop-wrap my-drop">
                    <button
                      type="button"
                      className={cx("btn-navi", "my", "drop-btn", myMenuOpen && "active")}
                      aria-expanded={myMenuOpen}
                      aria-controls={`${id}-my-menu`}
                      onClick={() => setMyMenuOpen(!myMenuOpen)}
                    >
                      {myMenu.label}
                    </button>
                    <div id={`${id}-my-menu`} className="drop-menu">
                      <div className="drop-in">
                        <div className="drop-top">
                          <p className="my-name">{myMenu.userName}</p>
                          <dl className="my-time">
                            <dt>{myMenu.timeLabel}</dt>
                            <dd>
                              <span className="time">{myMenu.time}</span>
                              <button
                                type="button"
                                className="krds-btn medium text"
                                onClick={myMenu.onExtend}
                              >
                                {myMenu.extendLabel}
                              </button>
                            </dd>
                          </dl>
                        </div>
                        <ul className="drop-list">
                          {myMenu.items?.map((item, index) => (
                            <li key={item.id ?? index}>
                              <a href={item.href ?? "#"} className="item-link">
                                {item.label}
                                <span className="sr-only" />
                              </a>
                            </li>
                          ))}
                        </ul>
                        <div className="drop-bottom">
                          <button
                            type="button"
                            className="krds-btn medium text"
                            onClick={myMenu.onLogout}
                          >
                            <SvgIcon name="ico-logout" /> {myMenu.logoutLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="btn-navi all"
                  aria-controls={mobileId}
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {allMenuLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
        <MainMenuPc
          items={menuItems}
          {...(menuLabel !== undefined ? { menuLabel } : {})}
          sample={false}
        />
      </div>
      {mobileMenu ? (
        <MainMenuMobile
          id={mobileId}
          style={{ display: mobileOpen ? "block" : "none" }}
          {...(mobileMenu.utilityItems !== undefined
            ? { utilityItems: mobileMenu.utilityItems }
            : {})}
          {...(mobileMenu.loginLabel !== undefined ? { loginLabel: mobileMenu.loginLabel } : {})}
          {...(mobileMenu.serviceItems !== undefined
            ? { serviceItems: mobileMenu.serviceItems }
            : {})}
          {...(mobileMenu.searchPlaceholder !== undefined
            ? { searchPlaceholder: mobileMenu.searchPlaceholder }
            : {})}
          {...(mobileMenu.searchTitle !== undefined ? { searchTitle: mobileMenu.searchTitle } : {})}
          {...(mobileMenu.searchLabel !== undefined ? { searchLabel: mobileMenu.searchLabel } : {})}
          {...(mobileMenu.items !== undefined ? { items: mobileMenu.items } : {})}
          {...(mobileMenu.bottomItems !== undefined ? { bottomItems: mobileMenu.bottomItems } : {})}
          {...(mobileMenu.previousLabel !== undefined
            ? { previousLabel: mobileMenu.previousLabel }
            : {})}
          {...(mobileMenu.closeLabel !== undefined ? { closeLabel: mobileMenu.closeLabel } : {})}
          sample={false}
          standalone={false}
          bottomSize="medium"
          {...(mobileOpen ? { className: "is-open" } : {})}
          {...(mobileMenu.onSearchChange !== undefined
            ? { onSearchChange: mobileMenu.onSearchChange }
            : {})}
          {...(mobileMenu.onSearch !== undefined ? { onSearch: mobileMenu.onSearch } : {})}
          {...(mobileMenu.onPrevious !== undefined ? { onPrevious: mobileMenu.onPrevious } : {})}
          onClose={() => {
            mobileMenu.onClose?.();
            setMobileOpen(false);
          }}
        />
      ) : null}
    </header>
  );
}
