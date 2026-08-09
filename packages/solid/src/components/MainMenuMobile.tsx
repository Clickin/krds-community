import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  splitProps,
} from "solid-js";
import type { KrdsNavItem } from "@krds-community/recipes";
import { trapTabFocus, type MenuItem } from "../shared.js";

export interface MainMenuMobileProps {
  class?: string;
  className?: string;
  id?: string;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  open?: boolean;
  sample?: boolean;
  navigationRole?: boolean;
  menuLabel?: string;
  bottomSize?: string;
  utilityItems?: MenuItem[];
  loginLabel?: string;
  serviceItems?: MenuItem[];
  searchPlaceholder?: string;
  searchTitle?: string;
  searchLabel?: string;
  items?: (MenuItem | KrdsNavItem | string | number)[];
  nav?: KrdsNavItem[];
  links?: KrdsNavItem[];
  previousLabel?: string;
  closeLabel?: string;
  bottomItems?: MenuItem[];
  selected?: string;
  defaultValue?: string;
  modelValue?: string;
  value?: string;
  onClose?: (event: Event) => void;
  onChange?: (event: Event) => void;
  children?: JSX.Element;
  [key: string]: unknown;
}

export function MainMenuMobile(rawProps: MainMenuMobileProps) {
  const merged = mergeProps(
    { bottomSize: "small", id: `krds-main-menu-mobile-${createUniqueId()}`, standalone: true },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "ref",
    "open",
    "sample",
    "standalone",
    "navigationRole",
    "menuLabel",
    "bottomSize",
    "utilityItems",
    "loginLabel",
    "serviceItems",
    "searchPlaceholder",
    "searchTitle",
    "searchLabel",
    "items",
    "nav",
    "links",
    "previousLabel",
    "closeLabel",
    "bottomItems",
    "selected",
    "defaultValue",
    "modelValue",
    "value",
    "onClose",
    "onChange",
    "children",
  ]);

  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };

  const className = () => props.class ?? props.className ?? "";
  const navigation = () =>
    (props.nav?.length
      ? props.nav
      : props.links?.length
        ? props.links
        : (props.items ?? []).filter(
            (item): item is KrdsNavItem => typeof item !== "string" && typeof item !== "number",
          )) as KrdsNavItem[];

  const [localMobileTab, setLocalMobileTab] = createSignal<string>();
  const [activeMobileDepth3, setActiveMobileDepth3] = createSignal<string>();
  const [activeMobileDepth4, setActiveMobileDepth4] = createSignal<string>();

  let mobileMenuRoot: HTMLDivElement | undefined;
  let mobileDepth4Trigger: HTMLAnchorElement | undefined;

  const setRootRef = (element: HTMLDivElement) => {
    mobileMenuRoot = element;
    const callerRef = props.ref;
    if (typeof callerRef === "function") callerRef(element);
  };

  const mobileTabIsActive = (item: MenuItem, itemIndex: number) => {
    const selectedTab = props.selected ?? localMobileTab();
    if (typeof selectedTab === "string" && selectedTab.length > 0) return selectedTab === item.id;
    const configuredTab = (navigation() as MenuItem[]).find((candidate) => candidate.active);
    return configuredTab ? configuredTab === item : !props.sample && itemIndex === 0;
  };

  const closeMobileMenu = (event: Event) => {
    props.onClose?.(event);
    setActiveMobileDepth3(undefined);
    setActiveMobileDepth4(undefined);
  };

  const closeMobileDepth4 = () => {
    setActiveMobileDepth4(undefined);
    const trigger = mobileDepth4Trigger;
    mobileDepth4Trigger = undefined;
    queueMicrotask(() => {
      if (trigger?.isConnected) trigger.focus();
    });
  };

  createEffect(() => {
    if (props.sample) return;
    if (props.open && mobileMenuRoot) {
      queueMicrotask(() => {
        const target = mobileMenuRoot?.querySelector<HTMLElement>(".gnb-wrap");
        target?.focus();
      });
    }
  });

  return (
    <div
      {...(native as Record<string, any>)}
      ref={setRootRef}
      id={props.id}
      style={
        (props.standalone
          ? typeof native.style === "string"
            ? `display: block; position: static; visibility: visible;${native.style}`
            : {
                display: "block",
                position: "static",
                visibility: "visible",
                ...(native.style as Record<string, string>),
              }
          : native.style) as unknown as Record<string, string> | string
      }
      class={["krds-main-menu-mobile", props.sample && "sample", className()]
        .filter(Boolean)
        .join(" ")}
      classList={{
        "is-backdrop": props.open === true,
        "is-open": props.open === true,
      }}
      role={
        props.navigationRole === false ? undefined : ((props.navigationRole ?? "navigation") as any)
      }
      aria-label={props.navigationRole === false ? undefined : (props.menuLabel ?? "전체 메뉴")}
      onClick={(event) => {
        invokeHandler(native.onClick, event);
        if (
          !props.sample &&
          props.open === true &&
          !(event.target as Element).closest(".gnb-wrap")
        ) {
          event.currentTarget.querySelector<HTMLElement>(".gnb-wrap")?.focus();
        }
      }}
      onKeyDown={(event) => {
        invokeHandler(native.onKeyDown, event);
        if (props.sample) return;
        if (event.defaultPrevented) return;
        if (event.key === "Escape" || event.key === "Esc") {
          event.preventDefault();
          if (activeMobileDepth4()) closeMobileDepth4();
          else if (props.open !== undefined) closeMobileMenu(event);
          return;
        }
        const focusSurface = activeMobileDepth4()
          ? event.currentTarget.querySelector<HTMLElement>(".depth4-wrap.is-open")
          : props.open === true
            ? event.currentTarget
            : undefined;
        if (focusSurface) trapTabFocus(event, focusSurface);
      }}
    >
      <div class="gnb-wrap" tabIndex={!props.sample && props.open === true ? 0 : undefined}>
        <div class="gnb-header">
          <div class="gnb-utils">
            <ul class="utility-list">
              <For each={props.utilityItems}>
                {(item) => (
                  <li>
                    <button type="button" class="krds-btn xsmall text">
                      {item.label}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div class="gnb-login">
            <button type="button" class="krds-btn large text">
              <i class="svg-icon ico-log" /> {props.loginLabel}
            </button>
          </div>
          <div class="gnb-service-menu">
            <For each={props.serviceItems}>
              {(item) => (
                <a href={item.href ?? "#"} class="link">
                  {item.label}
                </a>
              )}
            </For>
          </div>
          <div class="sch-input">
            <input
              type="text"
              class="krds-input"
              placeholder={props.searchPlaceholder}
              title={props.searchTitle}
              aria-label={props.searchLabel}
            />
            <button type="button" class="krds-btn medium icon ico-search">
              <span class="sr-only">{props.searchLabel}</span>
              <i class="svg-icon ico-sch" />
            </button>
          </div>
        </div>
        <div class="gnb-body">
          <div class="gnb-menu">
            <div class="menu-wrap">
              <ul role={props.sample ? undefined : "tablist"}>
                <For each={navigation() as MenuItem[]}>
                  {(item, itemIndex) => (
                    <li role={props.sample ? undefined : "none"}>
                      <a
                        id={props.sample ? undefined : `tab-${itemIndex()}`}
                        role={props.sample ? undefined : "tab"}
                        aria-selected={
                          props.sample ? undefined : mobileTabIsActive(item, itemIndex())
                        }
                        aria-controls={props.sample ? undefined : item.id}
                        href={`#${item.id}`}
                        class="gnb-main-trigger"
                        classList={{
                          active: mobileTabIsActive(item, itemIndex()),
                        }}
                        onClick={
                          props.sample
                            ? undefined
                            : (event) => {
                                event.preventDefault();
                                setLocalMobileTab(item.id);
                                invokeHandler(native.onChange, event);
                              }
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="submenu-wrap">
              <For each={navigation() as MenuItem[]}>
                {(item, itemIndex) => (
                  <div
                    class="gnb-sub-list"
                    id={item.id}
                    role={props.sample ? undefined : "tabpanel"}
                    aria-labelledby={props.sample ? undefined : `tab-${itemIndex()}`}
                  >
                    <h2 class="sub-title">{item.label}</h2>
                    <ul>
                      <For each={item.children}>
                        {(child) => {
                          const depth3Open = () => activeMobileDepth3() === child.id;
                          return (
                            <li>
                              <a
                                href={child.href ?? "#"}
                                class="gnb-sub-trigger"
                                classList={{
                                  "has-depth3": Boolean(child.children?.length),
                                  active: depth3Open(),
                                }}
                                aria-expanded={
                                  !props.sample && child.children?.length ? depth3Open() : undefined
                                }
                                aria-controls={
                                  !props.sample && child.children?.length
                                    ? `${child.id}-depth3`
                                    : undefined
                                }
                                onClick={
                                  props.sample
                                    ? undefined
                                    : (event) => {
                                        if (!child.children?.length) return;
                                        event.preventDefault();
                                        setActiveMobileDepth3((current) =>
                                          current === child.id ? undefined : child.id,
                                        );
                                      }
                                }
                              >
                                {child.label}
                              </a>
                              <Show when={child.children?.length}>
                                <div
                                  class="depth3-wrap"
                                  id={!props.sample ? `${child.id}-depth3` : undefined}
                                  classList={{ "is-open": depth3Open() }}
                                >
                                  <ul>
                                    <For each={child.children}>
                                      {(depth3) => (
                                        <li>
                                          <a
                                            href={depth3.href ?? "#"}
                                            class="depth3-trigger"
                                            classList={{
                                              "has-depth4": Boolean(depth3.children?.length),
                                            }}
                                            onClick={
                                              props.sample
                                                ? undefined
                                                : (event) => {
                                                    if (!depth3.children?.length) return;
                                                    event.preventDefault();
                                                    mobileDepth4Trigger = event.currentTarget;
                                                    setActiveMobileDepth4(depth3.id);
                                                    queueMicrotask(() => {
                                                      mobileMenuRoot
                                                        ?.querySelector<HTMLButtonElement>(
                                                          ".depth4-wrap.is-open .trigger-prev",
                                                        )
                                                        ?.focus();
                                                    });
                                                  }
                                            }
                                          >
                                            {depth3.label}
                                          </a>
                                          <Show when={depth3.children?.length}>
                                            <div
                                              class="depth4-wrap"
                                              classList={{
                                                "is-open": activeMobileDepth4() === depth3.id,
                                              }}
                                              style={
                                                activeMobileDepth4() === depth3.id
                                                  ? "display: block;"
                                                  : undefined
                                              }
                                            >
                                              <div class="depth4-head">
                                                <button
                                                  type="button"
                                                  class="krds-btn icon trigger-prev"
                                                  onClick={
                                                    props.sample ? undefined : closeMobileDepth4
                                                  }
                                                >
                                                  <span class="sr-only">{props.previousLabel}</span>
                                                  <i class="svg-icon ico-angle left" />
                                                </button>
                                                <button
                                                  type="button"
                                                  class="krds-btn icon trigger-close"
                                                  onClick={
                                                    props.sample ? undefined : closeMobileDepth4
                                                  }
                                                >
                                                  <span class="sr-only">{props.closeLabel}</span>
                                                  <i class="svg-icon ico-popup-close" />
                                                </button>
                                              </div>
                                              <ul class="depth4-body">
                                                <h4 class="sub-title">{depth3.title}</h4>
                                                <ul class="depth4-ul">
                                                  <For each={depth3.children}>
                                                    {(depth4) => (
                                                      <li>
                                                        <a href={depth4.href ?? "#"}>
                                                          {depth4.label}
                                                        </a>
                                                      </li>
                                                    )}
                                                  </For>
                                                </ul>
                                              </ul>
                                            </div>
                                          </Show>
                                        </li>
                                      )}
                                    </For>
                                  </ul>
                                </div>
                              </Show>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div class="gnb-bottom">
            <For each={props.bottomItems}>
              {(item) => (
                <a
                  href={item.href ?? "#"}
                  class={`krds-btn ${props.bottomSize ?? "small"} text`}
                  target={item.target}
                  title={item.title}
                >
                  {item.label}{" "}
                  <i class={item.target ? "svg-icon ico-go" : "svg-icon ico-angle right"} />
                </a>
              )}
            </For>
          </div>
        </div>
        <button
          type="button"
          class="krds-btn medium icon"
          id={props.sample || props.id === "mobile-nav" ? "close-nav" : `${props.id}-close`}
          onClick={props.sample ? undefined : closeMobileMenu}
        >
          <span class="sr-only">{props.closeLabel}</span>
          <i class="svg-icon ico-popup-close" />
        </button>
      </div>
    </div>
  );
}
