import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { create, withoutClass, withoutNativeEvents } from "../shared.js";
import type { AdditionalLanguage, KrdsOption } from "../types.js";

export const LanguageSwitcherPage = defineComponent({
  name: "KrdsLanguageSwitcherPage",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    languages: { type: Array as PropType<AdditionalLanguage[]>, default: () => [] },
    options: { type: Array as PropType<KrdsOption[]>, default: () => [] },
    selected: { type: String, default: undefined },
    defaultSelected: { type: String, default: undefined },
    defaultValue: {
      type: [String, Number, Boolean, Array] as PropType<
        string | number | boolean | string[] | undefined
      >,
      default: undefined,
    },
    modelValue: {
      type: [String, Number, Boolean, Array] as PropType<
        string | number | boolean | string[] | undefined
      >,
      default: undefined,
    },
    selectedLabel: { type: String, default: undefined },
    currentLabel: { type: String, default: undefined },
    externalTitle: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: string | number | boolean | string[]) => true,
    openChange: (_open: boolean) => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit }) {
    const generatedId = `krds-language-switcher-page-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const localOpen = ref(false);
    const setOpen = (next: boolean) => {
      if (props.open === undefined) localOpen.value = next;
      emit("openChange", next);
    };
    const open = computed<boolean>({
      get: () => props.open ?? localOpen.value,
      set: setOpen,
    });
    const initialSelected =
      props.defaultSelected ??
      (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
      (typeof props.defaultValue === "string" ? props.defaultValue : undefined) ??
      props.languages[0]?.value ??
      props.options[0]?.value ??
      "";
    const localSelected = ref(initialSelected);
    const setSelected = (next: string) => {
      if (props.selected === undefined && typeof props.modelValue !== "string") {
        localSelected.value = next;
      }
      emit("update:modelValue", next);
      emit("valueChange", next);
    };
    const selected = computed<string>({
      get: () =>
        props.selected ??
        (typeof props.modelValue === "string" ? props.modelValue : undefined) ??
        localSelected.value,
      set: setSelected,
    });
    return () => {
      const className = attrs.class as string | undefined;
      const languages: AdditionalLanguage[] = props.languages.length
        ? props.languages
        : (props.options as AdditionalLanguage[]);
      const displayedLanguages = languages.filter((language) => language.value !== selected.value);
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-language", "krds-drop-wrap", className],
        },
        [
          create(
            "button",
            {
              ...withoutClass(attrs),
              type: "button",
              class: ["krds-btn", "small", "text", "drop-btn"],
              "aria-expanded": open.value,
              "aria-controls": `${id.value}-drop-menu`,
              onClick: () => setOpen(!open.value),
            },
            [
              create("i", { class: ["svg-icon", "ico-global"] }),
              " ",
              props.label,
              " ",
              create("i", { class: ["svg-icon", "ico-toggle"] }),
            ],
          ),
          create("div", { id: `${id.value}-drop-menu`, class: "drop-menu" }, [
            create("div", { class: "drop-in" }, [
              create("div", { class: "drop-top" }, [
                create("p", { class: "current-laguage" }, [
                  create("span", props.currentLabel),
                  create(
                    "strong",
                    languages.find((language) => language.value === selected.value)?.label,
                  ),
                ]),
              ]),
              create(
                "ul",
                { class: "drop-list" },
                displayedLanguages.map((language) =>
                  create("li", { key: language.value }, [
                    create(
                      "a",
                      {
                        class: ["item-link"],
                        href: language.href ?? "#",
                        lang: language.lang ?? language.value,
                        target: "_blank",
                        title: props.externalTitle,
                      },
                      [
                        language.label,
                        create("i", { class: ["svg-icon", "ico-go"] }),
                        create(
                          "span",
                          { class: "sr-only" },
                          language.value === selected.value ? props.selectedLabel : "",
                        ),
                      ],
                    ),
                  ]),
                ),
              ),
            ]),
          ]),
        ],
      );
    };
  },
});
