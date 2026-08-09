import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { mobileMenuMarkup } from "../shared.js";

import type { AdditionalMenuItem, AdditionalMobileMenu } from "../types.js";

export const MainMenuMobile = defineComponent({
  name: "KrdsMainMenuMobile",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    utilityItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    loginLabel: { type: String, default: undefined },
    serviceItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    searchPlaceholder: { type: String, default: undefined },
    searchTitle: { type: String, default: undefined },
    searchLabel: { type: String, default: undefined },
    items: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    previousLabel: { type: String, default: undefined },
    closeLabel: { type: String, default: undefined },
    bottomItems: { type: Array as PropType<AdditionalMenuItem[]>, default: () => [] },
    sample: Boolean,
    standalone: { type: Boolean, default: true },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
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
    const generatedId = `krds-main-menu-mobile-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      const menuItems = props.items as AdditionalMenuItem[];
      const mobileData: AdditionalMobileMenu = {
        utilityItems: props.utilityItems,
        loginLabel: props.loginLabel ?? "",
        serviceItems: props.serviceItems,
        searchPlaceholder: props.searchPlaceholder ?? "",
        searchTitle: props.searchTitle ?? "",
        searchLabel: props.searchLabel ?? "",
        items: menuItems,
        previousLabel: props.previousLabel ?? "",
        closeLabel: props.closeLabel ?? "",
        bottomItems: props.bottomItems,
      };
      return mobileMenuMarkup(
        mobileData,
        id.value,
        attrs,
        className,
        props.sample,
        closeMenu,
        false,
        props.standalone,
      );
    };
  },
});
