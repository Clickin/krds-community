import { useId, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx, type KrdsNavItem } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";

interface MainMenuDescriptionItem {
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  target?: string;
  externalTitle?: string;
}
interface MainMenuBanner {
  badge?: ReactNode;
  label?: ReactNode;
}
export interface MainMenuItem extends Omit<KrdsNavItem, "children" | "title"> {
  active?: boolean;
  button?: boolean;
  target?: string;
  title?: string;
  titleHref?: string;
  titleLinkLabel?: ReactNode;
  descriptionItems?: MainMenuDescriptionItem[];
  banner?: MainMenuBanner;
  children?: MainMenuItem[];
}

function MainMenuBannerView({ banner }: { banner?: MainMenuBanner }) {
  return banner ? (
    <div className="gnb-sub-banner">
      {banner.badge ? <span className="krds-badge bg-secondary">{banner.badge}</span> : null}
      {banner.label ? (
        <button type="button" className="krds-btn medium text">
          {banner.label}
          <SvgIcon name="ico-angle right" />
        </button>
      ) : null}
    </div>
  ) : null;
}
export interface MainMenuPcProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items?: MainMenuItem[];
  menuLabel?: string;
  sample?: boolean;
  onItemChange?: (id: string) => void;
}
export function MainMenuPc({
  items = [],
  menuLabel,
  sample = true,
  className,
  onItemChange,
  "aria-label": ariaLabel,
  ref,
  ...props
}: MainMenuPcProps & { ref?: Ref<HTMLElement> }) {
  const generatedId = useId();
  const [openTop, setOpenTop] = useState<number | undefined>(() => {
    const activeIndex = items.findIndex((item) => item.active);
    return activeIndex >= 0 ? activeIndex : undefined;
  });
  const [openSubs, setOpenSubs] = useState<Record<string, number | undefined>>(() =>
    Object.fromEntries(
      items.map((item, index) => {
        const activeIndex = item.children?.findIndex((child) => child.active) ?? -1;
        const firstTriggerIndex = item.children?.findIndex((child) => !child.href) ?? -1;
        const initialIndex = activeIndex >= 0 ? activeIndex : sample ? -1 : firstTriggerIndex;
        return [item.id ?? String(index), initialIndex >= 0 ? initialIndex : undefined];
      }),
    ),
  );
  const renderSubContent = (item: MainMenuItem) => (
    <>
      <div className="gnb-sub-content">
        {item.title ? (
          <h2 className="sub-title">
            {item.titleHref ? (
              <>
                {item.title}
                <a href={item.titleHref} className="krds-btn link basic small">
                  <span className="underline">{item.titleLinkLabel}</span>
                  <SvgIcon name="ico-angle right" />
                </a>
              </>
            ) : (
              <span>{item.title}</span>
            )}
          </h2>
        ) : null}
        {item.descriptionItems?.length ? (
          <ul className="type-description">
            {item.descriptionItems.map((description, index) => (
              <li key={index}>
                <h3 className="tit">
                  <a
                    href={description.href ?? "#"}
                    target={description.target}
                    title={description.externalTitle}
                  >
                    {description.title}
                    {description.target ? <SvgIcon name="ico-go" /> : null}
                  </a>
                </h3>
                {description.description ? <p className="txt">{description.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : item.children?.length ? (
          <ul>
            {item.children.map((child) => (
              <li key={child.id ?? child.label}>
                {child.href ? (
                  <a href={child.href}>{child.label}</a>
                ) : (
                  <button type="button">{child.label}</button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {item.banner ? <MainMenuBannerView banner={item.banner} /> : null}
    </>
  );
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? (sample ? undefined : menuLabel)}
      className={cx("krds-main-menu", sample && "sample", className)}
    >
      <div className="inner">
        <ul className="gnb-menu" aria-label={sample ? undefined : menuLabel}>
          {items.map((item, topIndex) => {
            if (item.href) {
              return (
                <li key={item.id ?? item.label}>
                  <a
                    href={item.href}
                    className="gnb-main-trigger is-link"
                    data-trigger="gnb"
                    target={item.target}
                    title={item.title}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            if (item.button) {
              return (
                <li key={item.id ?? item.label}>
                  <button type="button" className="gnb-main-trigger is-link" data-trigger="gnb">
                    {item.label}
                  </button>
                </li>
              );
            }
            const topKey = item.id ?? String(topIndex);
            const topOpen = openTop === topIndex;
            const single = Boolean(item.title);
            const mainPanelId = `${generatedId}-main-${topIndex}`;
            return (
              <li key={item.id ?? item.label}>
                <button
                  type="button"
                  className={cx("gnb-main-trigger", topOpen && "active")}
                  data-trigger="gnb"
                  aria-controls={sample ? undefined : mainPanelId}
                  aria-expanded={sample ? undefined : topOpen}
                  aria-haspopup={sample ? undefined : true}
                  onClick={() => {
                    const next = topOpen ? undefined : topIndex;
                    setOpenTop(next);
                    if (next !== undefined) onItemChange?.(topKey);
                  }}
                >
                  {item.label}
                </button>
                <div
                  id={sample ? undefined : mainPanelId}
                  className={cx("gnb-toggle-wrap", topOpen && "is-open")}
                >
                  <div className="gnb-main-list" data-has-submenu={single ? undefined : "true"}>
                    {single ? (
                      <div className="gnb-sub-list single-list between">
                        {renderSubContent(item)}
                      </div>
                    ) : (
                      <ul>
                        {item.children?.map((subItem, subIndex) => {
                          if (subItem.href) {
                            return (
                              <li key={subItem.id ?? subItem.label}>
                                <a
                                  href={subItem.href}
                                  className={cx(
                                    "gnb-sub-trigger",
                                    "is-link",
                                    subItem.target && "external-link",
                                  )}
                                  data-trigger="gnb"
                                  target={subItem.target}
                                  title={subItem.title}
                                >
                                  {subItem.label}
                                </a>
                              </li>
                            );
                          }
                          const subOpen = openSubs[topKey] === subIndex;
                          const subPanelId = `${generatedId}-sub-${topIndex}-${subIndex}`;
                          return (
                            <li key={subItem.id ?? subItem.label}>
                              <button
                                type="button"
                                className={cx("gnb-sub-trigger", subOpen && "active")}
                                data-trigger="gnb"
                                aria-controls={sample ? undefined : subPanelId}
                                aria-expanded={sample ? undefined : subOpen}
                                aria-haspopup={sample ? undefined : true}
                                onClick={() => {
                                  setOpenSubs((current) => ({
                                    ...current,
                                    [topKey]: subIndex,
                                  }));
                                  onItemChange?.(subItem.id ?? String(subIndex));
                                }}
                              >
                                {subItem.label}
                              </button>
                              <div
                                id={sample ? undefined : subPanelId}
                                className={cx(
                                  "gnb-sub-list",
                                  subOpen && "active",
                                  subIndex > 0 && "between",
                                )}
                              >
                                {renderSubContent(subItem)}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
