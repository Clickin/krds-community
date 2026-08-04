import { For, Show, createEffect, createSignal, mergeProps, onCleanup, splitProps } from "solid-js";
import type { MenuItem, HeaderMyMenu, HeaderMobileMenu } from "../shared.js";
import { MainMenuPc } from "./MainMenuPc.js";
import { MainMenuMobile } from "./MainMenuMobile.js";

export interface HeaderProps {
  class?: string;
  className?: string;
  id?: string;
  open?: boolean;
  utilityItems?: MenuItem[];
  logoHref?: string;
  logoLabel?: string;
  searchTitle?: string;
  searchLabel?: string;
  loginHref?: string;
  loginLabel?: string;
  joinLabel?: string;
  allMenuLabel?: string;
  myMenu?: HeaderMyMenu;
  desktopItems?: MenuItem[];
  menuLabel?: string;
  mobileMenu?: HeaderMobileMenu;
  [key: string]: unknown;
}

export function Header(rawProps: HeaderProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "links",
    "title",
    "nav",
    "class",
    "className",
    "id",
    "open",
    "utilityItems",
    "logoHref",
    "logoLabel",
    "searchTitle",
    "searchLabel",
    "loginHref",
    "loginLabel",
    "joinLabel",
    "allMenuLabel",
    "myMenu",
    "desktopItems",
    "menuLabel",
    "mobileMenu",
  ]);

  const className = () => props.class ?? props.className ?? "";

  // Dropdown state for utility items and my-menu
  const [activeHeaderDropdown, setActiveHeaderDropdown] = createSignal<string>();

  // Mobile menu open/close state (controlled or local)
  const [localOpen, setLocalOpen] = createSignal(false);
  const open = () => (props.open === undefined ? localOpen() : Boolean(props.open));
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
  };

  // Refs for focus management
  let headerMobileTrigger: HTMLButtonElement | undefined;
  let headerMobileMenu: HTMLElement | undefined;
  let restoreFocus: HTMLElement | undefined;
  let wasFocusSurfaceOpen = false;

  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };

  // Focus management: trap focus inside mobile menu when open, restore on close
  createEffect(() => {
    const currentOpen = open();
    if (currentOpen && !wasFocusSurfaceOpen) {
      if (typeof document !== "undefined") {
        const activeElement = document.activeElement;
        restoreFocus =
          activeElement instanceof HTMLElement &&
          activeElement !== document.body &&
          !headerMobileMenu?.contains(activeElement)
            ? activeElement
            : undefined;
      }
      queueMicrotask(() => {
        if (!open() || !headerMobileMenu?.isConnected) return;
        const focusTarget = headerMobileMenu.querySelector<HTMLElement>(".gnb-wrap");
        focusTarget?.focus();
      });
    } else if (!currentOpen && wasFocusSurfaceOpen) {
      const focusTarget = headerMobileTrigger ?? restoreFocus;
      queueMicrotask(() => {
        if (focusTarget?.isConnected) focusTarget.focus();
      });
      restoreFocus = undefined;
    }
    wasFocusSurfaceOpen = currentOpen;
  });

  onCleanup(() => {
    if (wasFocusSurfaceOpen && restoreFocus?.isConnected) restoreFocus.focus();
  });

  return (
    <header
      {...(native as Record<string, any>)}
      id={props.id ?? "krds-header"}
      class={className() || undefined}
      onClick={(event) => {
        invokeHandler(native.onClick, event);
        if (!(event.target as Element).closest(".krds-drop-wrap")) {
          setActiveHeaderDropdown(undefined);
        }
      }}
      onFocusOut={(event) => {
        invokeHandler(native.onFocusOut, event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setActiveHeaderDropdown(undefined);
        }
      }}
      onKeyDown={(event) => {
        invokeHandler(native.onKeyDown, event);
        if (
          !event.defaultPrevented &&
          (event.key === "Escape" || event.key === "Esc") &&
          activeHeaderDropdown()
        ) {
          event.preventDefault();
          const trigger = (event.target as Element)
            .closest(".krds-drop-wrap")
            ?.querySelector<HTMLButtonElement>(".drop-btn");
          setActiveHeaderDropdown(undefined);
          queueMicrotask(() => trigger?.focus());
        }
      }}
    >
      <div class="header-in">
        <div class="header-container">
          <div class="inner">
            <div class="header-utility">
              <ul class="utility-list">
                <For each={props.utilityItems}>
                  {(item) => (
                    <li>
                      <Show
                        when={item.kind === "link"}
                        fallback={
                          <div
                            class="krds-drop-wrap"
                            classList={{ "krds-resize": item.kind === "resize" }}
                          >
                            <button
                              type="button"
                              class="krds-btn small text drop-btn"
                              classList={{ active: activeHeaderDropdown() === item.id }}
                              aria-expanded={activeHeaderDropdown() === item.id}
                              aria-controls={`${item.id}-menu`}
                              onClick={() =>
                                setActiveHeaderDropdown((current) =>
                                  current === item.id ? undefined : item.id,
                                )
                              }
                            >
                              {item.label + " "}
                              <i class="svg-icon ico-toggle" />
                            </button>
                            <div
                              class="drop-menu"
                              id={`${item.id}-menu`}
                              style={
                                activeHeaderDropdown() === item.id ? "display: block;" : undefined
                              }
                            >
                              <div class="drop-in">
                                <ul class="drop-list">
                                  <For each={item.items}>
                                    {(dropItem) => (
                                      <li>
                                        <Show
                                          when={item.kind === "resize"}
                                          fallback={
                                            <a
                                              href={dropItem.href ?? "#"}
                                              class={["item-link", dropItem.className]
                                                .filter(Boolean)
                                                .join(" ")}
                                              target={dropItem.target}
                                              title={dropItem.title}
                                            >
                                              {dropItem.label}
                                              <span class="sr-only" />
                                            </a>
                                          }
                                        >
                                          <button
                                            type="button"
                                            class={["item-link", dropItem.className]
                                              .filter(Boolean)
                                              .join(" ")}
                                            classList={{ active: dropItem.selected }}
                                          >
                                            {dropItem.label}
                                            <span class="sr-only">
                                              {dropItem.selected ? item.selectedLabel : undefined}
                                            </span>
                                          </button>
                                        </Show>
                                      </li>
                                    )}
                                  </For>
                                </ul>
                                <Show when={item.kind === "resize"}>
                                  <div class="drop-bottom">
                                    <button type="button" class="krds-btn medium text">
                                      <i class="svg-icon ico-reset" /> {item.resetLabel}
                                    </button>
                                  </div>
                                </Show>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <a
                          href={item.href ?? "#"}
                          class="krds-btn small text"
                          target={item.target}
                          title={item.title}
                        >
                          {item.label + " "}
                          <i class="svg-icon ico-go" />
                        </a>
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="header-branding">
              <h2 class="logo">
                <a href={props.logoHref}>
                  <span class="sr-only">{props.logoLabel}</span>
                </a>
              </h2>
              <div class="header-actions">
                <button type="button" class="btn-navi sch" title={props.searchTitle}>
                  {props.searchLabel}
                </button>
                <a href={props.loginHref} class="btn-navi login">
                  {props.loginLabel}
                </a>
                <button type="button" class="btn-navi join">
                  {props.joinLabel}
                </button>
                <div class="krds-drop-wrap my-drop">
                  <button
                    type="button"
                    class="btn-navi my drop-btn"
                    aria-expanded={activeHeaderDropdown() === "header-my-menu"}
                    aria-controls="header-my-menu-drop"
                    onClick={() =>
                      setActiveHeaderDropdown((current) =>
                        current === "header-my-menu" ? undefined : "header-my-menu",
                      )
                    }
                  >
                    {props.myMenu?.label}
                  </button>
                  <div
                    class="drop-menu"
                    id="header-my-menu-drop"
                    style={
                      activeHeaderDropdown() === "header-my-menu" ? "display: block;" : undefined
                    }
                  >
                    <div class="drop-in">
                      <div class="drop-top">
                        <p class="my-name">{props.myMenu?.userName}</p>
                        <dl class="my-time">
                          <dt>{props.myMenu?.timeLabel}</dt>
                          <dd>
                            <span class="time">{props.myMenu?.time}</span>
                            <button type="button" class="krds-btn medium text">
                              {props.myMenu?.extendLabel}
                            </button>
                          </dd>
                        </dl>
                      </div>
                      <ul class="drop-list">
                        <For each={props.myMenu?.items}>
                          {(item) => (
                            <li>
                              <a href={item.href ?? "#"} class="item-link">
                                {item.label}
                                <span class="sr-only" />
                              </a>
                            </li>
                          )}
                        </For>
                      </ul>
                      <div class="drop-bottom">
                        <button type="button" class="krds-btn medium text">
                          <i class="svg-icon ico-logout" /> {props.myMenu?.logoutLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  ref={(element) => {
                    headerMobileTrigger = element;
                  }}
                  type="button"
                  class="btn-navi all"
                  aria-controls="mobile-nav"
                  onClick={() => setOpen(!open())}
                >
                  {props.allMenuLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
        <MainMenuPc
          {...(props.desktopItems === undefined ? {} : { items: props.desktopItems })}
          {...(props.menuLabel === undefined ? {} : { menuLabel: props.menuLabel })}
        />
      </div>
      <MainMenuMobile
        id="mobile-nav"
        ref={(element) => {
          headerMobileMenu = element;
        }}
        open={open()}
        style={`display: ${open() ? "block" : "none"};`}
        navigationRole={false}
        bottomSize="medium"
        {...(props.mobileMenu === undefined
          ? {}
          : {
              utilityItems: props.mobileMenu.utilityItems,
              loginLabel: props.mobileMenu.loginLabel,
              serviceItems: props.mobileMenu.serviceItems,
              searchPlaceholder: props.mobileMenu.searchPlaceholder,
              searchTitle: props.mobileMenu.searchTitle,
              searchLabel: props.mobileMenu.searchLabel,
              items: props.mobileMenu.items,
              previousLabel: props.mobileMenu.previousLabel,
              closeLabel: props.mobileMenu.closeLabel,
              bottomItems: props.mobileMenu.bottomItems,
            })}
        onClose={(event: Event) => {
          setOpen(false);
          invokeHandler(native.onClose, event);
        }}
      />
    </header>
  );
}
