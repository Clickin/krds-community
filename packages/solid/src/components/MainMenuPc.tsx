import { For, Show, createSignal, mergeProps, splitProps } from "solid-js";
import type { KrdsNavItem } from "@krds-community/recipes";
import type { MenuItem, MenuDescriptionItem, MenuBanner } from "../shared.js";

export type { MenuItem as MainMenuItem, MenuDescriptionItem, MenuBanner };

export interface MainMenuPcProps {
  class?: string;
  className?: string;
  id?: string;
  sample?: boolean;
  nav?: KrdsNavItem[];
  links?: KrdsNavItem[];
  items?: (KrdsNavItem | string | number)[];
  menuLabel?: string;
  [key: string]: unknown;
}

export function MainMenuPc(rawProps: MainMenuPcProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "sample",
    "nav",
    "links",
    "items",
    "menuLabel",
  ]);

  const invokeHandler = (handler: unknown, event: Event) => {
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };

  const [localMainMenu, setLocalMainMenu] = createSignal<string | false>();
  const [localSubMenu, setLocalSubMenu] = createSignal<{
    parentId?: string;
    childId?: string;
  }>();

  const navigation = () =>
    (props.nav?.length
      ? props.nav
      : props.links?.length
        ? props.links
        : (props.items ?? []).filter(
            (item): item is KrdsNavItem => typeof item !== "string" && typeof item !== "number",
          )) as KrdsNavItem[];

  const mainMenuIsActive = (item: MenuItem) => {
    const local = localMainMenu();
    return local === undefined ? Boolean(item.active) : local === item.id;
  };

  const subMenuIsActive = (parent: MenuItem, child: MenuItem, childIndex: number) => {
    const local = localSubMenu();
    if (local !== undefined && local.parentId === parent.id) return local.childId === child.id;
    if (child.active !== undefined) return child.active;
    return !props.sample && childIndex === 0;
  };

  const className = () => props.class ?? props.className ?? "";

  return (
    <nav
      {...(native as Record<string, any>)}
      aria-label={props.menuLabel || undefined}
      class={["krds-main-menu", props.sample && "sample", className()].filter(Boolean).join(" ")}
      onFocusOut={(event) => {
        invokeHandler(native.onFocusOut, event);
        if (!props.sample && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setLocalMainMenu(false);
        }
      }}
      onKeyUp={(event) => {
        invokeHandler(native.onKeyUp, event);
        if (
          !props.sample &&
          !event.defaultPrevented &&
          (event.key === "Escape" || event.key === "Esc")
        ) {
          setLocalMainMenu(false);
        }
      }}
      onKeyDown={(event) => {
        invokeHandler(native.onKeyDown, event);
        if (props.sample || event.defaultPrevented) return;
        const target = event.target as HTMLElement;
        if (!target.matches('[data-trigger="gnb"]')) return;
        const mainTriggers = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            '.gnb-menu > li > [data-trigger="gnb"]',
          ),
        );
        let focusTarget: HTMLElement | null | undefined;
        if (event.key === "Home") focusTarget = mainTriggers[0];
        else if (event.key === "End") focusTarget = mainTriggers[mainTriggers.length - 1];
        else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          focusTarget = target
            .closest("li")
            ?.nextElementSibling?.querySelector<HTMLElement>('[data-trigger="gnb"]');
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          focusTarget = target
            .closest("li")
            ?.previousElementSibling?.querySelector<HTMLElement>('[data-trigger="gnb"]');
        }
        if (focusTarget) {
          event.preventDefault();
          focusTarget.focus();
        }
      }}
    >
      <div class="inner">
        <ul class="gnb-menu" aria-label={props.sample ? undefined : props.menuLabel}>
          <For each={navigation() as MenuItem[]}>
            {(item, itemIndex) => (
              <li>
                <Show
                  when={!item.href && !item.button}
                  fallback={
                    item.button ? (
                      <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href ?? "#"}
                        class="gnb-main-trigger is-link"
                        data-trigger="gnb"
                        target={item.target}
                        title={item.title}
                      >
                        {item.label}
                      </a>
                    )
                  }
                >
                  <button
                    type="button"
                    class="gnb-main-trigger"
                    classList={{ active: mainMenuIsActive(item) }}
                    data-trigger="gnb"
                    aria-controls={props.sample ? undefined : `${props.id}-main-${itemIndex()}`}
                    aria-expanded={props.sample ? undefined : mainMenuIsActive(item)}
                    aria-haspopup={props.sample ? undefined : "true"}
                    onClick={
                      props.sample
                        ? undefined
                        : () =>
                            setLocalMainMenu((current) =>
                              current === item.id || (current === undefined && item.active)
                                ? false
                                : item.id,
                            )
                    }
                  >
                    {item.label}
                  </button>
                  <div
                    class="gnb-toggle-wrap"
                    classList={{ "is-open": mainMenuIsActive(item) }}
                    id={props.sample ? undefined : `${props.id}-main-${itemIndex()}`}
                  >
                    <div
                      class="gnb-main-list"
                      data-has-submenu={
                        item.title && item.banner
                          ? undefined
                          : item.children?.length
                            ? "true"
                            : undefined
                      }
                    >
                      <Show
                        when={item.title && item.banner}
                        fallback={
                          <ul>
                            <For each={item.children}>
                              {(child, childIndex) => (
                                <li>
                                  <Show
                                    when={!child.href}
                                    fallback={
                                      <a
                                        href={child.href ?? "#"}
                                        class="gnb-sub-trigger is-link"
                                        classList={{ "external-link": Boolean(child.target) }}
                                        data-trigger="gnb"
                                        target={child.target}
                                        title={child.title}
                                      >
                                        {child.label}
                                      </a>
                                    }
                                  >
                                    <button
                                      type="button"
                                      class="gnb-sub-trigger"
                                      classList={{
                                        active: subMenuIsActive(item, child, childIndex()),
                                      }}
                                      data-trigger="gnb"
                                      aria-controls={
                                        props.sample
                                          ? undefined
                                          : `${props.id}-sub-${itemIndex()}-${childIndex()}`
                                      }
                                      aria-expanded={
                                        props.sample
                                          ? undefined
                                          : subMenuIsActive(item, child, childIndex())
                                      }
                                      aria-haspopup={props.sample ? undefined : "true"}
                                      onClick={
                                        props.sample
                                          ? undefined
                                          : () =>
                                              setLocalSubMenu({
                                                ...(item.id === undefined
                                                  ? {}
                                                  : { parentId: item.id }),
                                                ...(child.id === undefined
                                                  ? {}
                                                  : { childId: child.id }),
                                              })
                                      }
                                    >
                                      {child.label}
                                    </button>
                                    <div
                                      class="gnb-sub-list"
                                      classList={{
                                        active: subMenuIsActive(item, child, childIndex()),
                                        between:
                                          !subMenuIsActive(item, child, childIndex()) &&
                                          childIndex() > 0,
                                      }}
                                      id={
                                        props.sample
                                          ? undefined
                                          : `${props.id}-sub-${itemIndex()}-${childIndex()}`
                                      }
                                    >
                                      <div class="gnb-sub-content">
                                        <h2 class="sub-title">
                                          <Show
                                            when={child.titleHref}
                                            fallback={<span>{child.title}</span>}
                                          >
                                            {child.title}
                                            <a
                                              href={child.titleHref}
                                              class="krds-btn link basic small"
                                            >
                                              <span class="underline">{child.titleLinkLabel}</span>
                                              <i class="svg-icon ico-angle right" />
                                            </a>
                                          </Show>
                                        </h2>
                                        <Show
                                          when={child.descriptionItems?.length}
                                          fallback={
                                            <ul>
                                              <For each={child.children}>
                                                {(leaf) => (
                                                  <li>
                                                    <Show
                                                      when={leaf.href}
                                                      fallback={
                                                        <button type="button">{leaf.label}</button>
                                                      }
                                                    >
                                                      <a href={leaf.href}>{leaf.label}</a>
                                                    </Show>
                                                  </li>
                                                )}
                                              </For>
                                            </ul>
                                          }
                                        >
                                          <ul class="type-description">
                                            <For each={child.descriptionItems}>
                                              {(description) => (
                                                <li>
                                                  <h3 class="tit">
                                                    <a
                                                      href={description.href ?? "#"}
                                                      target={description.target}
                                                      title={description.externalTitle}
                                                    >
                                                      {description.title}
                                                      <i class="svg-icon ico-go" />
                                                    </a>
                                                  </h3>
                                                  <p class="txt">{description.description}</p>
                                                </li>
                                              )}
                                            </For>
                                          </ul>
                                        </Show>
                                      </div>
                                      <Show when={child.banner}>
                                        <div class="gnb-sub-banner">
                                          <span class="krds-badge bg-secondary">
                                            {child.banner?.badge}
                                          </span>
                                          <button type="button" class="krds-btn medium text">
                                            {child.banner?.label}
                                            <i class="svg-icon ico-angle right" />
                                          </button>
                                        </div>
                                      </Show>
                                    </div>
                                  </Show>
                                </li>
                              )}
                            </For>
                          </ul>
                        }
                      >
                        <div class="gnb-sub-list single-list between">
                          <div class="gnb-sub-content">
                            <h2 class="sub-title">
                              <span>{item.title}</span>
                            </h2>
                            <ul>
                              <For each={item.children}>
                                {(leaf) => (
                                  <li>
                                    <a href={leaf.href ?? "#"}>{leaf.label}</a>
                                  </li>
                                )}
                              </For>
                            </ul>
                          </div>
                          <div class="gnb-sub-banner">
                            <span class="krds-badge bg-secondary">{item.banner?.badge}</span>
                            <button type="button" class="krds-btn medium text">
                              {item.banner?.label}
                              <i class="svg-icon ico-angle right" />
                            </button>
                          </div>
                        </div>
                      </Show>
                    </div>
                  </div>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </div>
    </nav>
  );
}
