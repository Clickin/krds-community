import { computed, defineComponent, ref, useId, type PropType } from "vue";

import {
  create,
  headerMyMenu,
  headerUtilityItem,
  desktopMainMenu,
  mobileMenuMarkup,
} from "../shared.js";
import type {
  AdditionalMenuItem,
  AdditionalMobileMenu,
  AdditionalMyMenu,
  KrdsNavItem,
} from "../types.js";

export const Header = defineComponent({
  name: "KrdsHeader",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    utilityItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    logoHref: { type: String, default: undefined },
    logoLabel: { type: String, default: undefined },
    searchTitle: { type: String, default: undefined },
    searchLabel: { type: String, default: undefined },
    loginHref: { type: String, default: undefined },
    loginLabel: { type: String, default: undefined },
    joinLabel: { type: String, default: undefined },
    myMenu: { type: Object as PropType<AdditionalMyMenu | undefined>, default: undefined },
    allMenuLabel: { type: String, default: undefined },
    desktopItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    title: { type: String, default: undefined },
    links: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    nav: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    menuLabel: { type: String, default: undefined },
    mobileMenu: { type: Object as PropType<AdditionalMobileMenu | undefined>, default: undefined },
  },
  emits: {
    close: () => true,
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, emit }) {
    const localOpen = ref(false);
    const setOpen = (next: boolean) => {
      if (props.open === undefined) localOpen.value = next;
      emit("openChange", next);
    };
    const closeMenu = () => {
      setOpen(false);
      emit("close");
    };
    const generatedId = `krds-header-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      const mobileId = props.mobileMenu?.id ?? "mobile-nav";
      const headerItems = props.desktopItems.length
        ? props.desktopItems
        : (props.nav as AdditionalMenuItem[]);
      return create("header", { ...attrs, id: props.id ?? "krds-header", class: className }, [
        create("div", { class: "header-in" }, [
          create("div", { class: "header-container" }, [
            create("div", { class: "inner" }, [
              create("div", { class: "header-utility" }, [
                create(
                  "ul",
                  { class: "utility-list" },
                  props.utilityItems.map((item, itemIndex) =>
                    create(
                      "li",
                      { key: item.id ?? item.label },
                      headerUtilityItem(item, `${id.value}-utility-${itemIndex}`),
                    ),
                  ),
                ),
              ]),
              create("div", { class: "header-branding" }, [
                create("h2", { class: "logo" }, [
                  create("a", { href: props.logoHref }, [
                    create("span", { class: "sr-only" }, props.logoLabel),
                  ]),
                ]),
                create("div", { class: "header-actions" }, [
                  create(
                    "button",
                    {
                      type: "button",
                      class: ["btn-navi", "sch"],
                      title: props.searchTitle,
                    },
                    props.searchLabel,
                  ),
                  create(
                    "a",
                    { class: ["btn-navi", "login"], href: props.loginHref },
                    props.loginLabel,
                  ),
                  create(
                    "button",
                    { type: "button", class: ["btn-navi", "join"] },
                    props.joinLabel,
                  ),
                  props.myMenu ? headerMyMenu(props.myMenu, `${id.value}-my-menu`) : null,
                  create(
                    "button",
                    {
                      type: "button",
                      class: ["btn-navi", "all"],
                      "aria-controls": mobileId,
                    },
                    props.allMenuLabel,
                  ),
                ]),
              ]),
            ]),
          ]),
          create("nav", { class: "krds-main-menu", "aria-label": props.menuLabel }, [
            create(
              "div",
              { class: "inner" },
              desktopMainMenu(headerItems, id.value, props.menuLabel, true),
            ),
          ]),
        ]),
        props.mobileMenu
          ? mobileMenuMarkup(
              {
                ...props.mobileMenu,
                ...((props.mobileMenu.menuLabel ?? props.menuLabel)
                  ? { menuLabel: props.mobileMenu.menuLabel ?? props.menuLabel }
                  : {}),
              },
              mobileId,
              {},
              undefined,
              false,
              closeMenu,
              true,
            )
          : null,
      ]);
    };
  },
});
