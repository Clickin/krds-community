import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";
import type { MainMenuItem } from "./MainMenuPc.js";

export interface MainMenuMobileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  utilityItems?: MainMenuItem[];
  loginLabel?: ReactNode;
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
  bottomSize?: "small" | "medium";
  menuLabel?: string;
  sample?: boolean;
  standalone?: boolean;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPrevious?: () => void;
  onClose?: () => void;
}
export function MainMenuMobile({
  utilityItems = [],
  loginLabel,
  serviceItems = [],
  searchPlaceholder,
  searchTitle,
  searchLabel,
  searchValue: controlledSearchValue,
  defaultSearchValue = "",
  items = [],
  bottomItems = [],
  previousLabel,
  closeLabel,
  bottomSize = "small",
  menuLabel,
  sample = true,
  standalone = true,
  onSearchChange,
  onSearch,
  onPrevious,
  onClose,
  id = "mobile-nav",
  role,
  "aria-label": ariaLabel,
  style,
  className,
  ref,
  ...props
}: MainMenuMobileProps & { ref?: Ref<HTMLDivElement> }) {
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(defaultSearchValue);
  const searchValue = controlledSearchValue ?? uncontrolledSearchValue;
  return (
    <div
      {...props}
      ref={ref}
      id={id}
      role={standalone ? (role ?? "navigation") : role}
      aria-label={standalone ? (ariaLabel ?? menuLabel ?? "전체 메뉴") : ariaLabel}
      className={cx("krds-main-menu-mobile", sample && "sample", className)}
      style={
        standalone
          ? { display: "block", position: "static", visibility: "visible", ...style }
          : style
      }
    >
      <div className="gnb-wrap">
        <div className="gnb-header">
          <div className="gnb-utils">
            <ul className="utility-list">
              {utilityItems.map((item) => (
                <li key={item.id ?? item.label}>
                  <button type="button" className="krds-btn xsmall text">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="gnb-login">
            <button type="button" className="krds-btn large text">
              <SvgIcon name="ico-log" /> {loginLabel}
            </button>
          </div>
          <div className="gnb-service-menu">
            {serviceItems.map((item) => (
              <a href={item.href ?? "#"} className="link" key={item.id ?? item.label}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="sch-input">
            <input
              type="text"
              className="krds-input"
              placeholder={searchPlaceholder}
              title={searchTitle}
              aria-label={typeof searchLabel === "string" ? searchLabel : searchTitle}
              value={controlledSearchValue}
              defaultValue={
                controlledSearchValue === undefined && defaultSearchValue
                  ? defaultSearchValue
                  : undefined
              }
              onChange={(event) => {
                const next = event.currentTarget.value;
                if (controlledSearchValue === undefined) setUncontrolledSearchValue(next);
                onSearchChange?.(next);
              }}
            />
            <button
              type="button"
              className="krds-btn medium icon ico-search"
              onClick={() => onSearch?.(searchValue)}
            >
              <span className="sr-only">{searchLabel}</span>
              <SvgIcon name="ico-sch" />
            </button>
          </div>
        </div>
        <div className="gnb-body">
          <div className="gnb-menu">
            <div className="menu-wrap">
              <ul role={standalone ? undefined : "tablist"}>
                {items.map((item, index) => (
                  <li role={standalone ? undefined : "none"} key={item.id ?? item.label}>
                    <a
                      id={standalone ? undefined : `tab-${index}`}
                      href={`#${item.id}`}
                      className={cx("gnb-main-trigger", !standalone && index === 0 && "active")}
                      role={standalone ? undefined : "tab"}
                      aria-selected={standalone ? undefined : index === 0}
                      aria-controls={standalone ? undefined : item.id}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="submenu-wrap">
              {items.map((item, index) => (
                <div
                  className="gnb-sub-list"
                  id={item.id}
                  role={standalone ? undefined : "tabpanel"}
                  aria-labelledby={standalone ? undefined : `tab-${index}`}
                  key={item.id ?? item.label}
                >
                  <h2 className="sub-title">{item.label}</h2>
                  <ul>
                    {item.children?.map((second) => (
                      <li key={second.id ?? second.label}>
                        <a
                          href={second.href ?? "#"}
                          className={cx("gnb-sub-trigger", second.children?.length && "has-depth3")}
                          aria-expanded={standalone || !second.children?.length ? undefined : false}
                          aria-controls={
                            standalone || !second.children?.length
                              ? undefined
                              : `${item.id}-${second.id}-depth3`
                          }
                        >
                          {second.label}
                        </a>
                        {second.children?.length ? (
                          <div
                            id={standalone ? undefined : `${item.id}-${second.id}-depth3`}
                            className="depth3-wrap"
                          >
                            <ul>
                              {second.children.map((third) => (
                                <li key={third.id ?? third.label}>
                                  <a
                                    href={third.href ?? "#"}
                                    className={cx(
                                      "depth3-trigger",
                                      third.children?.length && "has-depth4",
                                    )}
                                  >
                                    {third.label}
                                  </a>
                                  {third.children?.length ? (
                                    <div className="depth4-wrap">
                                      <div className="depth4-head">
                                        <button
                                          type="button"
                                          className="krds-btn icon trigger-prev"
                                          onClick={onPrevious}
                                        >
                                          <span className="sr-only">{previousLabel}</span>
                                          <SvgIcon name="ico-angle left" />
                                        </button>
                                        <button
                                          type="button"
                                          className="krds-btn icon trigger-close"
                                          onClick={onClose}
                                        >
                                          <span className="sr-only">{closeLabel}</span>
                                          <SvgIcon name="ico-popup-close" />
                                        </button>
                                      </div>
                                      <ul className="depth4-body">
                                        <h4 className="sub-title">{third.title}</h4>
                                        <ul className="depth4-ul">
                                          {third.children.map((fourth) => (
                                            <li key={fourth.id ?? fourth.label}>
                                              <a href={fourth.href ?? "#"}>{fourth.label}</a>
                                            </li>
                                          ))}
                                        </ul>
                                      </ul>
                                    </div>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="gnb-bottom">
            {bottomItems.map((item, index) => (
              <a
                href={item.href ?? "#"}
                className={cx("krds-btn", bottomSize, "text")}
                target={item.target}
                title={item.title}
                key={item.id ?? index}
              >
                {item.label} <SvgIcon name={item.target ? "ico-go" : "ico-angle right"} />
              </a>
            ))}
          </div>
        </div>
        <button type="button" className="krds-btn medium icon" id="close-nav" onClick={onClose}>
          <span className="sr-only">{closeLabel}</span>
          <SvgIcon name="ico-popup-close" />
        </button>
      </div>
    </div>
  );
}
