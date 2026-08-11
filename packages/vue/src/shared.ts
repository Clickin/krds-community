import { h, type VNode } from "vue";
import type { KrdsNavItem, KrdsTone } from "@krds-community/recipes";
import type {
  AdditionalMenuBanner,
  AdditionalMenuItem,
  AdditionalMobileMenu,
  AdditionalMyMenu,
  AnyItem,
  CalendarRenderData,
} from "./types.js";

export const create = h as unknown as (...args: unknown[]) => VNode;

let vueInstanceId = 0;
type VueGlobal = typeof globalThis & { __krdsVueInstanceId?: number };

export const createVueInstanceId = (prefix: string) => {
  // Each `client:only="vue"` preview is mounted as a separate Vue app and
  // therefore gets its own module instance. Keep the browser-side suffix in
  // global scope so labels and controls from sibling islands cannot collide.
  if (typeof window !== "undefined") {
    const globalObject = globalThis as VueGlobal;
    globalObject.__krdsVueInstanceId = (globalObject.__krdsVueInstanceId ?? 0) + 1;
    return `${prefix}-${globalObject.__krdsVueInstanceId}`;
  }
  return `${prefix}-${++vueInstanceId}`;
};

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

export function withoutNativeEvents(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith("on")));
}

export function withoutClass(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class"));
}

export function invokeNativeEvent(listener: unknown, event: Event): void {
  if (typeof listener === "function") {
    (listener as (event: Event) => unknown)(event);
  } else if (Array.isArray(listener)) {
    listener.forEach((candidate) => {
      if (typeof candidate === "function") (candidate as (event: Event) => unknown)(event);
    });
  }
}

export function children(slots: { default?: () => unknown[] }): VNode[] {
  return (slots.default?.() ?? []) as VNode[];
}

export function itemLabel(item: AnyItem): string {
  if (typeof item === "string" || typeof item === "number") return String(item);
  const candidate = item as { label?: string; title?: string; id?: string };
  return candidate.label ?? candidate.title ?? candidate.id ?? "";
}

export const hasCurrentNavigationItem = (item: KrdsNavItem): boolean =>
  Boolean(item.current || item.children?.some(hasCurrentNavigationItem));

export function sideNavigationList(items: KrdsNavItem[], idPrefix: string, depth = 1): VNode {
  return create(
    "ul",
    {
      id: depth === 2 ? `${idPrefix}-menu` : undefined,
      class: depth === 1 ? "lnb-list" : undefined,
      role: depth === 1 ? "menubar" : depth === 2 ? "menu" : undefined,
    },
    items.map((item, itemIndex) => {
      const itemId = `${idPrefix}-${item.id ?? itemIndex}`;
      const controlId = `${itemId}-menu`;
      const hasChildren = Boolean(item.children?.length);
      const current = hasCurrentNavigationItem(item);
      const nestedTitle =
        (item as KrdsNavItem & { description?: string }).description ?? item.label;
      return create(
        "li",
        {
          key: item.id ?? item.label,
          class: [depth === 1 ? "lnb-item" : "lnb-subitem", current ? "active" : undefined],
          role: "none",
        },
        [
          hasChildren
            ? create(
                "button",
                {
                  type: "button",
                  class: [
                    "lnb-btn",
                    depth === 1 ? "lnb-toggle" : "lnb-toggle-popup",
                    depth === 1 && current ? "active" : undefined,
                  ],
                  role: "menuitem",
                  "aria-controls": depth === 1 ? `${itemId}-menu` : controlId,
                  "aria-expanded": depth === 1 ? current : false,
                  "aria-haspopup": depth > 1 ? true : undefined,
                },
                item.label,
              )
            : create(
                "a",
                {
                  href: item.href,
                  class: ["lnb-btn", "lnb-link"],
                  role: "menuitem",
                  "aria-current": item.current ? "page" : undefined,
                },
                item.label,
              ),
          hasChildren
            ? depth === 1
              ? create(
                  "div",
                  { class: "lnb-submenu" },
                  sideNavigationList(item.children ?? [], itemId, 2),
                )
              : create("div", { id: controlId, class: "lnb-submenu-lv2", role: "menu" }, [
                  create("button", { type: "button", class: "lnb-btn-tit" }, nestedTitle),
                  create(
                    "ul",
                    (item.children ?? []).map((child) =>
                      create("li", { key: child.id ?? child.label, role: "none" }, [
                        create(
                          "a",
                          {
                            href: child.href,
                            class: "lnb-btn",
                            role: "menuitem",
                          },
                          child.label,
                        ),
                      ]),
                    ),
                  ),
                ])
            : null,
        ],
      );
    }),
  );
}

export function textList(
  items: AnyItem[],
  ordered: boolean,
  depth = 1,
  rootAttrs?: Record<string, unknown>,
): VNode {
  const unorderedStyles = ["decimal", "dash", "hollow"];
  return create(
    ordered ? "ol" : "ul",
    {
      ...(depth === 1 ? rootAttrs : undefined),
      class: [
        "krds-info-list",
        ordered ? "ordered" : unorderedStyles[Math.min(depth - 1, unorderedStyles.length - 1)],
        depth === 1 ? rootAttrs?.class : undefined,
      ],
      role: "list",
    },
    items.map((item, itemIndex) => {
      const nestedItems =
        typeof item === "object" && item !== null && "children" in item
          ? ((item as KrdsNavItem).children ?? [])
          : [];
      const marker =
        depth === 1
          ? `${itemIndex + 1}.`
          : depth === 2
            ? `${String.fromCharCode(97 + itemIndex)}.`
            : String.fromCodePoint(0x2460 + itemIndex);
      return create("li", { key: itemIndex, role: "listitem" }, [
        ordered ? create("span", { class: "num" }, marker) : null,
        itemLabel(item),
        nestedItems.length ? textList(nestedItems, ordered, depth + 1) : null,
      ]);
    }),
  );
}

export function desktopMenuBanner(banner: AdditionalMenuBanner | undefined): VNode | null {
  if (!banner) return null;
  return create("div", { class: "gnb-sub-banner" }, [
    create("span", { class: ["krds-badge", "bg-secondary"] }, banner.badge),
    create("button", { type: "button", class: ["krds-btn", "medium", "text"] }, [
      banner.label,
      create("i", { class: ["svg-icon", "ico-angle", "right"] }),
    ]),
  ]);
}

export function desktopMenuSubList(
  item: AdditionalMenuItem,
  single = false,
  panelId?: string,
  active = item.active ?? false,
  between = single,
): VNode {
  return create(
    "div",
    {
      id: single ? undefined : panelId,
      class: [
        "gnb-sub-list",
        active ? "active" : undefined,
        between ? "between" : undefined,
        single ? "single-list" : undefined,
      ],
    },
    [
      create("div", { class: "gnb-sub-content" }, [
        item.title
          ? create("h2", { class: "sub-title" }, [
              item.titleHref ? item.title : create("span", item.title),
              item.titleHref
                ? create(
                    "a",
                    {
                      class: ["krds-btn", "small", "basic", "link"],
                      href: item.titleHref,
                    },
                    [
                      create("span", { class: "underline" }, item.titleLinkLabel ?? item.title),
                      create("i", { class: ["svg-icon", "ico-angle", "right"] }),
                    ],
                  )
                : null,
            ])
          : null,
        item.descriptionItems?.length
          ? create(
              "ul",
              { class: "type-description" },
              item.descriptionItems.map((description) =>
                create("li", { key: description.title }, [
                  create("h3", { class: "tit" }, [
                    create(
                      "a",
                      {
                        href: description.href,
                        target: description.target,
                        title: description.externalTitle,
                      },
                      [description.title, create("i", { class: ["svg-icon", "ico-go"] })],
                    ),
                  ]),
                  create("p", { class: "txt" }, description.description),
                ]),
              ),
            )
          : create(
              "ul",
              (item.children ?? []).map((child) =>
                create("li", { key: child.id ?? child.label }, [
                  child.href
                    ? create(
                        "a",
                        {
                          href: child.href,
                          target: child.target,
                          title: child.title,
                        },
                        child.label,
                      )
                    : create("button", { type: "button", disabled: child.disabled }, child.label),
                ]),
              ),
            ),
      ]),
      desktopMenuBanner(item.banner),
    ],
  );
}

export function desktopMainMenu(
  items: AdditionalMenuItem[],
  rootId: string,
  listLabel?: string,
  initializeSubmenus = false,
): VNode {
  return create(
    "ul",
    {
      class: "gnb-menu",
      "aria-label": initializeSubmenus ? listLabel : undefined,
    },
    items.map((item, itemIndex) => {
      const panelId = `${rootId}-main-${itemIndex}`;
      return create("li", { key: item.id ?? item.label }, [
        item.children?.length
          ? create(
              "button",
              {
                type: "button",
                class: ["gnb-main-trigger", item.active ? "active" : undefined],
                "data-trigger": "gnb",
                "aria-haspopup": initializeSubmenus ? "true" : undefined,
                "aria-expanded": initializeSubmenus ? (item.active ? "true" : "false") : undefined,
                "aria-controls": initializeSubmenus ? panelId : undefined,
              },
              item.label,
            )
          : item.button
            ? create(
                "button",
                {
                  type: "button",
                  class: ["gnb-main-trigger", "is-link"],
                  "data-trigger": "gnb",
                },
                item.label,
              )
            : create(
                "a",
                {
                  href: item.href,
                  target: item.target,
                  title: item.title,
                  class: ["gnb-main-trigger", "is-link", item.target ? "external-link" : undefined],
                  "data-trigger": "gnb",
                },
                item.label,
              ),
        item.children?.length
          ? create(
              "div",
              {
                id: initializeSubmenus ? panelId : undefined,
                class: ["gnb-toggle-wrap", item.active ? "is-open" : undefined],
              },
              create(
                "div",
                {
                  class: "gnb-main-list",
                  "data-has-submenu": item.banner ? undefined : "true",
                },
                item.banner
                  ? desktopMenuSubList(item, true)
                  : create(
                      "ul",
                      item.children.map((child, childIndex) => {
                        const childPanelId = `${rootId}-sub-${itemIndex}-${childIndex}`;
                        const childActive =
                          child.active ?? (initializeSubmenus && childIndex === 0);
                        const childIsLink =
                          child.href && !child.children?.length && !child.descriptionItems?.length;
                        return create("li", { key: child.id ?? child.label }, [
                          childIsLink
                            ? create(
                                "a",
                                {
                                  href: child.href,
                                  target: child.target,
                                  title: child.title,
                                  class: [
                                    "gnb-sub-trigger",
                                    "is-link",
                                    child.target ? "external-link" : undefined,
                                  ],
                                  "data-trigger": "gnb",
                                },
                                child.label,
                              )
                            : create(
                                "button",
                                {
                                  type: "button",
                                  class: ["gnb-sub-trigger", childActive ? "active" : undefined],
                                  "data-trigger": "gnb",
                                  "aria-haspopup": initializeSubmenus ? "true" : undefined,
                                  "aria-expanded": initializeSubmenus
                                    ? childActive
                                      ? "true"
                                      : "false"
                                    : undefined,
                                  "aria-controls": initializeSubmenus ? childPanelId : undefined,
                                },
                                child.label,
                              ),
                          childIsLink
                            ? null
                            : desktopMenuSubList(
                                child,
                                false,
                                initializeSubmenus ? childPanelId : undefined,
                                childActive,
                                childIndex > 0,
                              ),
                        ]);
                      }),
                    ),
              ),
            )
          : null,
      ]);
    }),
  );
}

export function headerUtilityItem(item: AdditionalMenuItem, controlId?: string): VNode {
  if (item.kind === "link")
    return create(
      "a",
      {
        class: ["krds-btn", "small", "text"],
        href: item.href,
        target: item.target,
        title: item.title,
      },
      [`${item.label} `, create("i", { class: ["svg-icon", "ico-go"] })],
    );
  const resize = item.kind === "resize";
  return create("div", { class: ["krds-drop-wrap", resize ? "krds-resize" : undefined] }, [
    create(
      "button",
      {
        type: "button",
        class: ["krds-btn", "small", "text", "drop-btn"],
        "aria-expanded": false,
        "aria-controls": controlId,
      },
      [`${item.label} `, create("i", { class: ["svg-icon", "ico-toggle"] })],
    ),
    create("div", { id: controlId, class: "drop-menu" }, [
      create("div", { class: "drop-in" }, [
        create(
          "ul",
          { class: "drop-list" },
          (item.items ?? []).map((option) =>
            create("li", { key: option.id ?? option.label }, [
              resize
                ? create(
                    "button",
                    {
                      type: "button",
                      class: [
                        "item-link",
                        option.className,
                        option.selected ? "active" : undefined,
                      ],
                    },
                    [
                      option.label,
                      create(
                        "span",
                        { class: "sr-only" },
                        option.selected ? item.selectedLabel : undefined,
                      ),
                    ],
                  )
                : create(
                    "a",
                    {
                      class: ["item-link", option.className],
                      href: option.href,
                      target: option.target,
                      title: option.title,
                    },
                    [option.label, create("span", { class: "sr-only" })],
                  ),
            ]),
          ),
        ),
        resize
          ? create("div", { class: "drop-bottom" }, [
              create("button", { type: "button", class: ["krds-btn", "medium", "text"] }, [
                create("i", { class: ["svg-icon", "ico-reset"] }),
                " ",
                item.resetLabel,
              ]),
            ])
          : null,
      ]),
    ]),
  ]);
}

export function headerMyMenu(menu: AdditionalMyMenu, controlId?: string): VNode {
  return create("div", { class: ["krds-drop-wrap", "my-drop"] }, [
    create(
      "button",
      {
        type: "button",
        class: ["btn-navi", "drop-btn", "my"],
        "aria-expanded": false,
        "aria-controls": controlId,
      },
      menu.label,
    ),
    create("div", { id: controlId, class: "drop-menu" }, [
      create("div", { class: "drop-in" }, [
        create("div", { class: "drop-top" }, [
          create("p", { class: "my-name" }, menu.userName),
          create("dl", { class: "my-time" }, [
            create("dt", menu.timeLabel),
            create("dd", [
              create("span", { class: "time" }, menu.time),
              create(
                "button",
                { type: "button", class: ["krds-btn", "medium", "text"] },
                menu.extendLabel,
              ),
            ]),
          ]),
        ]),
        create(
          "ul",
          { class: "drop-list" },
          (menu.items ?? []).map((item) =>
            create("li", { key: item.id ?? item.label }, [
              create("a", { class: "item-link", href: item.href }, [
                item.label,
                create("span", { class: "sr-only" }),
              ]),
            ]),
          ),
        ),
        create("div", { class: "drop-bottom" }, [
          create("button", { type: "button", class: ["krds-btn", "medium", "text"] }, [
            create("i", { class: ["svg-icon", "ico-logout"] }),
            " ",
            menu.logoutLabel,
          ]),
        ]),
      ]),
    ]),
  ]);
}

export function mobileNestedMenu(
  items: AdditionalMenuItem[],
  previousLabel: string | undefined,
  closeLabel: string | undefined,
): VNode {
  return create(
    "ul",
    items.map((item) =>
      create("li", { key: item.id ?? item.label }, [
        create(
          "a",
          {
            href: item.href,
            class: ["depth3-trigger", item.children?.length ? "has-depth4" : undefined],
          },
          item.label,
        ),
        item.children?.length
          ? create("div", { class: "depth4-wrap" }, [
              create("div", { class: "depth4-head" }, [
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "icon", "trigger-prev"],
                  },
                  [
                    create("span", { class: "sr-only" }, previousLabel),
                    create("i", { class: ["svg-icon", "ico-angle", "left"] }),
                  ],
                ),
                create(
                  "button",
                  {
                    type: "button",
                    class: ["krds-btn", "icon", "trigger-close"],
                  },
                  [
                    create("span", { class: "sr-only" }, closeLabel),
                    create("i", { class: ["svg-icon", "ico-popup-close"] }),
                  ],
                ),
              ]),
              create("ul", { class: "depth4-body" }, [
                item.title ? create("h4", { class: "sub-title" }, item.title) : null,
                create(
                  "ul",
                  { class: "depth4-ul" },
                  item.children.map((child) =>
                    create("li", { key: child.id ?? child.label }, [
                      create("a", { href: child.href }, child.label),
                    ]),
                  ),
                ),
              ]),
            ])
          : null,
      ]),
    ),
  );
}

export function mobileMenuMarkup(
  data: AdditionalMobileMenu,
  rootId: string,
  attrs: Record<string, unknown>,
  className: string | undefined,
  visible: boolean,
  onClose: () => void,
  enhanced: boolean,
  standalone = false,
): VNode {
  return create(
    "div",
    {
      ...attrs,
      id: rootId,
      class: [
        "krds-main-menu-mobile",
        !enhanced && visible && !className?.split(/\s+/).includes("sample") ? "sample" : undefined,
        className,
      ],
      role: visible ? "navigation" : undefined,
      "aria-label": data.menuLabel ?? attrs["aria-label"] ?? attrs.menuLabel ?? "전체 메뉴",
      style: standalone
        ? "display: block; position: static; visibility: visible;"
        : visible
          ? attrs.style
          : "display: none;",
    },
    [
      create("div", { class: "gnb-wrap" }, [
        create("div", { class: "gnb-header" }, [
          create("div", { class: "gnb-utils" }, [
            create(
              "ul",
              { class: "utility-list" },
              data.utilityItems.map((item) =>
                create("li", { key: item.id ?? item.label }, [
                  create(
                    "button",
                    { type: "button", class: ["krds-btn", "xsmall", "text"] },
                    item.label,
                  ),
                ]),
              ),
            ),
          ]),
          create("div", { class: "gnb-login" }, [
            create("button", { type: "button", class: ["krds-btn", "large", "text"] }, [
              create("i", { class: ["svg-icon", "ico-log"] }),
              " ",
              data.loginLabel,
            ]),
          ]),
          create(
            "div",
            { class: "gnb-service-menu" },
            data.serviceItems.map((item) =>
              create(
                "a",
                { key: item.id ?? item.label, class: "link", href: item.href },
                item.label,
              ),
            ),
          ),
          create("div", { class: "sch-input" }, [
            create("input", {
              type: "text",
              class: "krds-input",
              placeholder: data.searchPlaceholder,
              title: data.searchTitle,
              "aria-label": data.searchLabel || data.searchTitle,
            }),
            create(
              "button",
              { type: "button", class: ["krds-btn", "medium", "icon", "ico-search"] },
              [
                create("span", { class: "sr-only" }, data.searchLabel),
                create("i", { class: ["svg-icon", "ico-sch"] }),
              ],
            ),
          ]),
        ]),
        create("div", { class: "gnb-body" }, [
          create("div", { class: "gnb-menu" }, [
            create("div", { class: "menu-wrap" }, [
              create(
                "ul",
                { role: enhanced ? "tablist" : undefined },
                data.items.map((item, itemIndex) => {
                  const triggerId = `${rootId}-trigger-${itemIndex}`;
                  const panelId = item.id ?? `${rootId}-panel-${itemIndex}`;
                  return create(
                    "li",
                    {
                      key: item.id ?? item.label,
                      role: enhanced ? "none" : undefined,
                    },
                    [
                      create(
                        "a",
                        {
                          id: enhanced ? triggerId : undefined,
                          class: [
                            "gnb-main-trigger",
                            enhanced && itemIndex === 0 ? "active" : undefined,
                          ],
                          href: item.href ?? `#${panelId}`,
                          role: enhanced ? "tab" : undefined,
                          "aria-selected": enhanced
                            ? itemIndex === 0
                              ? "true"
                              : "false"
                            : undefined,
                          "aria-controls": enhanced ? panelId : undefined,
                        },
                        item.label,
                      ),
                    ],
                  );
                }),
              ),
            ]),
            create(
              "div",
              { class: "submenu-wrap" },
              data.items.map((item, itemIndex) => {
                const triggerId = `${rootId}-trigger-${itemIndex}`;
                const panelId = item.id ?? `${rootId}-panel-${itemIndex}`;
                return create(
                  "div",
                  {
                    key: item.id ?? item.label,
                    id: panelId,
                    class: "gnb-sub-list",
                    role: enhanced ? "tabpanel" : undefined,
                    "aria-labelledby": enhanced ? triggerId : undefined,
                  },
                  [
                    create("h2", { class: "sub-title" }, item.label),
                    create(
                      "ul",
                      (item.children ?? []).map((child, childIndex) => {
                        const depth3Id = `${rootId}-depth3-${itemIndex}-${childIndex}`;
                        return create("li", { key: child.id ?? child.label }, [
                          create(
                            "a",
                            {
                              class: [
                                "gnb-sub-trigger",
                                child.children?.length ? "has-depth3" : undefined,
                              ],
                              href: child.href,
                              "aria-expanded":
                                enhanced && child.children?.length ? "false" : undefined,
                              "aria-controls":
                                enhanced && child.children?.length ? depth3Id : undefined,
                            },
                            child.label,
                          ),
                          child.children?.length
                            ? create(
                                "div",
                                { id: depth3Id, class: "depth3-wrap" },
                                mobileNestedMenu(
                                  child.children,
                                  data.previousLabel,
                                  data.closeLabel,
                                ),
                              )
                            : null,
                        ]);
                      }),
                    ),
                  ],
                );
              }),
            ),
          ]),
          create(
            "div",
            { class: "gnb-bottom" },
            data.bottomItems.map((item) =>
              create(
                "a",
                {
                  key: item.id ?? item.label,
                  class: ["krds-btn", enhanced ? "medium" : "small", "text"],
                  href: item.href,
                  target: item.target,
                  title: item.title,
                },
                [
                  item.label,
                  " ",
                  create("i", {
                    class: [
                      "svg-icon",
                      item.target ? "ico-go" : "ico-angle",
                      item.target ? undefined : "right",
                    ],
                  }),
                ],
              ),
            ),
          ),
        ]),
        create(
          "button",
          {
            id: visible ? "close-nav" : `${rootId}-close`,
            type: "button",
            class: ["krds-btn", "medium", "icon"],
            onClick: onClose,
          },
          [
            create("span", { class: "sr-only" }, data.closeLabel),
            create("i", { class: ["svg-icon", "ico-popup-close"] }),
          ],
        ),
      ]),
    ],
  );
}

export function calendarMarkup(
  data: CalendarRenderData,
  kind: string,
  rootId: string,
  attrs: Record<string, unknown>,
  className: string | undefined,
): VNode {
  const currentDate = new Date();
  const defaultYear = currentDate.getFullYear();
  const defaultMonth = currentDate.getMonth() + 1;
  const year = data.displayYear ?? data.year ?? data.years[0] ?? defaultYear;
  const month = data.displayMonth ?? data.month ?? defaultMonth;
  const selectedYear = data.selectedYear ?? data.year ?? year;
  const selectedMonth = data.selectedMonth ?? data.month ?? month;
  const yearListId = `${rootId}-year`;
  const monthListId = `${rootId}-month`;
  const pad = (value: number) => String(value).padStart(2, "0");
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const leadingDays = data.leadingDays ?? new Date(year, month - 1, 1).getDay();
  const previousMonthDayCount =
    data.previousMonthDayCount ?? new Date(year, month - 1, 0).getDate();
  const dayCount = data.dayCount ?? new Date(year, month, 0).getDate();
  const years = data.years.length ? data.years : [year];
  const weekdays = data.weekdays.length
    ? data.weekdays
    : ["일", "월", "화", "수", "목", "금", "토"];
  const cells = Array.from({ length: 42 }, (_, cellIndex) => {
    const currentOffset = cellIndex - leadingDays;
    const old = currentOffset < 0;
    const next = currentOffset >= dayCount;
    const day = old
      ? previousMonthDayCount + currentOffset + 1
      : next
        ? currentOffset - dayCount + 1
        : currentOffset + 1;
    const cellYear = old ? previousYear : next ? nextYear : year;
    const cellMonth = old ? previousMonth : next ? nextMonth : month;
    const current = !old && !next;
    const period =
      current &&
      cellYear === selectedYear &&
      cellMonth === selectedMonth &&
      data.rangeStartDay !== undefined &&
      data.rangeEndDay !== undefined &&
      day >= data.rangeStartDay &&
      day <= data.rangeEndDay;
    const event = current && data.eventDays.includes(day);
    const today = current && day === data.todayDay;
    const unavailable = current && data.disabledDays.includes(day);
    const classNames = [
      cellIndex % 7 === 0 ? "day-off" : undefined,
      old ? "old" : undefined,
      next ? "new" : undefined,
      period ? "period" : undefined,
      period && day === data.rangeStartDay ? "start" : undefined,
      period && day === data.rangeEndDay ? "end" : undefined,
      event ? "day-event" : undefined,
      today ? "today" : undefined,
      unavailable ? "disabled" : undefined,
    ].filter(Boolean);
    const outside = old || next;
    return create(
      "td",
      {
        key: cellIndex,
        class: classNames.length ? classNames : undefined,
        "data-date": `${cellYear}.${pad(cellMonth)}.${pad(day)}`,
      },
      [
        create(
          "button",
          {
            type: "button",
            class: "btn-set-date",
            disabled: outside ? true : unavailable,
            "aria-pressed": period ? "true" : undefined,
            "aria-label": today
              ? `${day} ${data.todayLabel}`
              : event
                ? `${day} ${data.eventLabel}`
                : undefined,
            onVnodeMounted: outside
              ? (vnode: VNode) => {
                  (vnode.el as HTMLButtonElement).setAttribute("disabled", "true");
                }
              : undefined,
          },
          create("span", String(day)),
        ),
      ],
    );
  });
  return create(
    "div",
    { ...attrs, id: data.id, class: ["krds-calendar-area", className] },
    create(
      "div",
      {
        class: ["calendar-wrap", "bottom", kind === "calendar" ? "single" : undefined],
        tabindex: 0,
        "aria-label": data.calendarLabel,
      },
      [
        create("div", { class: "calendar-head" }, [
          create("button", { type: "button", class: ["btn-cal-move", "prev"] }, [
            create("span", { class: "sr-only" }, data.previousMonthLabel),
          ]),
          create("div", { class: "calendar-switch-wrap" }, [
            create("div", { class: "calendar-drop-down" }, [
              create(
                "button",
                {
                  type: "button",
                  class: ["btn-cal-switch", "year"],
                  role: "combobox",
                  "aria-expanded": "false",
                  "aria-controls": yearListId,
                  "aria-haspopup": "listbox",
                  "aria-label": data.yearSelectLabel,
                },
                `${year}년`,
              ),
              create("div", { class: ["calendar-select", "calendar-year-wrap"] }, [
                create(
                  "ul",
                  { id: yearListId, class: ["sel", "year"], role: "listbox" },
                  years.map((optionYear) =>
                    create("li", { key: optionYear, role: "none" }, [
                      create(
                        "button",
                        {
                          type: "button",
                          role: "option",
                          class: optionYear === year ? "active" : undefined,
                          disabled: data.disabledYears.includes(optionYear),
                          "aria-selected": optionYear === year ? "true" : "false",
                        },
                        `${optionYear}년`,
                      ),
                    ]),
                  ),
                ),
              ]),
            ]),
            create("div", { class: "calendar-drop-down" }, [
              create(
                "button",
                {
                  type: "button",
                  class: ["btn-cal-switch", "month"],
                  role: "combobox",
                  "aria-expanded": "false",
                  "aria-controls": monthListId,
                  "aria-haspopup": "listbox",
                  "aria-label": data.monthSelectLabel,
                },
                `${pad(month)}월`,
              ),
              create("div", { class: ["calendar-select", "calendar-mon-wrap"] }, [
                create(
                  "ul",
                  { id: monthListId, class: ["sel", "month"], role: "listbox" },
                  Array.from({ length: 12 }, (_, monthIndex) => monthIndex + 1).map((optionMonth) =>
                    create("li", { key: optionMonth, role: "none" }, [
                      create(
                        "button",
                        {
                          type: "button",
                          role: "option",
                          class: optionMonth === month ? "active" : undefined,
                          disabled: data.disabledMonths.includes(optionMonth),
                          "aria-selected": optionMonth === month ? "true" : "false",
                        },
                        `${pad(optionMonth)}월`,
                      ),
                    ]),
                  ),
                ),
              ]),
            ]),
          ]),
          create("button", { type: "button", class: ["btn-cal-move", "next"] }, [
            create("span", { class: "sr-only" }, data.nextMonthLabel),
          ]),
        ]),
        create("div", { class: "calendar-body" }, [
          create("div", { class: "calendar-table-wrap" }, [
            create("table", { class: "calendar-tbl" }, [
              create("caption", `${year}년 ${pad(month)}월`),
              create(
                "thead",
                create(
                  "tr",
                  weekdays.map((weekday) => create("th", { key: weekday }, weekday)),
                ),
              ),
              create(
                "tbody",
                Array.from({ length: 6 }, (_, rowIndex) =>
                  create("tr", { key: rowIndex }, cells.slice(rowIndex * 7, rowIndex * 7 + 7)),
                ),
              ),
            ]),
          ]),
        ]),
        create("div", { class: "calendar-footer" }, [
          create("div", { class: "calendar-btn-wrap" }, [
            create(
              "button",
              {
                id: `${rootId}-today`,
                type: "button",
                class: ["krds-btn", "small", "text"],
              },
              data.todayLabel,
            ),
            create(
              "button",
              {
                type: "button",
                class: ["krds-btn", "small", "tertiary"],
              },
              data.cancelLabel,
            ),
            create(
              "button",
              {
                type: "button",
                class: ["krds-btn", "small", "primary"],
              },
              data.confirmLabel,
            ),
          ]),
        ]),
      ],
    ),
  );
}
