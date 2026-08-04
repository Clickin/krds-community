import { computed, defineComponent, ref, useId, type PropType } from "vue";

import { create } from "../shared.js";

import type {
  AdditionalLinkItem,
  AdditionalRelatedGroup,
  AdditionalTabItem,
  AdditionalTutorialTask,
} from "../types.js";

export const HelpPanel = defineComponent({
  name: "KrdsHelpPanel",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    label: { type: String, default: undefined },
    tabs: { type: Array as PropType<AdditionalTabItem[]>, default: () => [] },
    activeTab: { type: String, default: undefined },
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
    helpTitle: { type: String, default: undefined },
    title: { type: String, default: undefined },
    backTitle: { type: String, default: undefined },
    externalTitle: { type: String, default: undefined },
    helpDescription: { type: String, default: undefined },
    downloadLinks: { type: Array as PropType<AdditionalLinkItem[]>, default: () => [] },
    relatedGroups: { type: Array as PropType<AdditionalRelatedGroup[]>, default: () => [] },
    collapseLabel: { type: String, default: undefined },
    tutorialTitle: { type: String, default: undefined },
    tutorialBackTitle: { type: String, default: undefined },
    tasks: { type: Array as PropType<AdditionalTutorialTask[]>, default: () => [] },
    stopLabel: { type: String, default: undefined },
  },
  emits: {
    "update:modelValue": (_value: string | number | boolean | string[]) => true,
    openChange: (_open: boolean) => true,
    close: () => true,
    valueChange: (_value: string | number | boolean) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-help-panel-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const localOpen = ref(props.defaultOpen);
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
      props.tabs[0]?.id ??
      "";
    const localSelected = ref(initialSelected);
    const setSelected = (next: string) => {
      if (props.selected === undefined && typeof props.modelValue !== "string") {
        localSelected.value = next;
      }
      emit("update:modelValue", next);
      emit("valueChange", next);
    };

    return () => {
      const className = attrs.class as string | undefined;
      const activeTab = props.activeTab ?? props.tabs[0]?.value ?? props.tabs[0]?.id;
      return create(
        "div",
        {
          ...attrs,
          class: ["krds-help-panel", open.value ? "expand" : undefined, className],
        },
        [
          create("div", { class: "help-panel-wrap", tabindex: 0 }, [
            create("div", { class: "help-conts-area" }, [
              create("div", { class: ["krds-tab-area", "layer"] }, [
                create("div", { class: ["tab", "line"] }, [
                  create(
                    "ul",
                    { role: "tablist" },
                    props.tabs.map((tab) => {
                      const tabValue = tab.value ?? tab.id;
                      const panelId = tab.panelId ?? `${id.value}-${tab.id}-panel`;
                      const isActive = tabValue === activeTab;
                      return create(
                        "li",
                        {
                          key: tab.id,
                          role: "presentation",
                          class: isActive ? "active" : undefined,
                        },
                        create(
                          "button",
                          {
                            id: tab.id,
                            type: "button",
                            role: "tab",
                            class: "btn-tab",
                            "aria-selected": isActive,
                            "aria-controls": panelId,
                            tabIndex: isActive ? 0 : -1,
                            onClick: () => setSelected(tabValue),
                          },
                          [
                            tab.label,
                            isActive
                              ? create("i", { class: ["sr-only", "created"] }, props.selectedLabel)
                              : null,
                          ],
                        ),
                      );
                    }),
                  ),
                ]),
                create("div", { class: "tab-conts-wrap" }, [
                  props.tabs.map((tab) => {
                    const tabValue = tab.value ?? tab.id;
                    const isActive = tabValue === activeTab;
                    const panelId = tab.panelId ?? `${id.value}-${tab.id}-panel`;
                    const isHelp = tabValue === "help";
                    return create(
                      "section",
                      {
                        key: panelId,
                        id: panelId,
                        role: "tabpanel",
                        class: ["tab-conts", isActive ? "active" : undefined],
                        "aria-labelledby": tab.id,
                        hidden: !isActive,
                      },
                      [
                        tab.label ? create("h3", { class: "sr-only" }, tab.label) : null,
                        isHelp
                          ? create("div", { class: "help-conts-area-inner" }, [
                              create("div", { class: ["conts-area", "help-conts"] }, [
                                create("div", { class: "conts-wrap" }, [
                                  create("h4", { class: "help-title" }, [
                                    props.helpTitle === undefined
                                      ? undefined
                                      : `${props.helpTitle} `,
                                    create("span", { class: ["krds-btn", "icon", "medium"] }, [
                                      create("span", { class: "sr-only" }, props.label),
                                      create("i", { class: ["svg-icon", "ico-help"] }),
                                    ]),
                                  ]),
                                  create("div", { class: "conts-desc" }, [
                                    create("p", props.helpDescription),
                                  ]),
                                  create(
                                    "ul",
                                    { class: "link-list" },
                                    props.downloadLinks.map((link) =>
                                      create("li", { key: link.label }, [
                                        create(
                                          "a",
                                          {
                                            class: ["krds-btn", "xsmall", "basic", "link"],
                                            href: link.href,
                                            target: link.target,
                                            title: link.title,
                                          },
                                          [
                                            `${link.label} `,
                                            create("i", {
                                              class: ["svg-icon", "ico-go"],
                                            }),
                                          ],
                                        ),
                                      ]),
                                    ),
                                  ),
                                ]),
                              ]),
                              create(
                                "div",
                                { class: ["conts-area", "related-service"] },
                                props.relatedGroups.map((group) =>
                                  create("div", { key: group.title, class: "conts-wrap" }, [
                                    create("h4", { class: "help-title" }, group.title),
                                    create(
                                      "ul",
                                      { class: "link-list" },
                                      group.links.map((link) =>
                                        create("li", { key: link.label }, [
                                          create(
                                            "a",
                                            {
                                              class: ["krds-btn", "xsmall", "basic", "link"],
                                              href: link.href,
                                            },
                                            [
                                              link.icon
                                                ? create("i", {
                                                    class: ["svg-icon", `ico-${link.icon}`],
                                                  })
                                                : null,
                                              link.icon ? ` ${link.label}` : `${link.label} `,
                                              link.icon
                                                ? null
                                                : create("i", {
                                                    class: ["svg-icon", "ico-angle", "right"],
                                                  }),
                                            ],
                                          ),
                                        ]),
                                      ),
                                    ),
                                  ]),
                                ),
                              ),
                            ])
                          : create("div", { class: "help-conts-area-inner" }, [
                              create("div", { class: "conts-area" }, [
                                create("h4", { class: "help-title" }, [
                                  create(
                                    "a",
                                    { href: "#;", title: props.tutorialBackTitle },
                                    props.tutorialTitle,
                                  ),
                                ]),
                                create(
                                  "ul",
                                  { class: "coach-help-process" },
                                  props.tasks.map((task, taskIndex) => {
                                    const taskPanelId = `${id.value}-task-${taskIndex}`;
                                    return create("li", { key: task.title }, [
                                      create(
                                        "h4",
                                        { class: ["tit", task.current ? "current" : undefined] },
                                        task.title,
                                      ),
                                      create(
                                        "div",
                                        {
                                          class: ["krds-disclosure", "conts-expand-area"],
                                        },
                                        [
                                          create(
                                            "button",
                                            {
                                              type: "button",
                                              class: "btn-conts-expand",
                                              "aria-expanded": false,
                                              "aria-controls": taskPanelId,
                                            },
                                            task.summary,
                                          ),
                                          create(
                                            "div",
                                            {
                                              id: taskPanelId,
                                              class: "expand-wrap",
                                              inert: "",
                                            },
                                            create("div", { class: "expand-in" }, [
                                              create(
                                                "ul",
                                                {
                                                  class: ["krds-info-list", "decimal"],
                                                  role: "list",
                                                },
                                                task.steps.map((step, stepIndex) =>
                                                  create(
                                                    "li",
                                                    {
                                                      key: stepIndex,
                                                      role: "listitem",
                                                    },
                                                    step,
                                                  ),
                                                ),
                                              ),
                                            ]),
                                          ),
                                        ],
                                      ),
                                    ]);
                                  }),
                                ),
                              ]),
                              create("div", { class: "help-panel-action" }, [
                                create(
                                  "button",
                                  {
                                    type: "button",
                                    class: ["krds-btn", "medium", "secondary", "coach-btn-stop"],
                                    onClick: () => emit("close"),
                                  },
                                  props.stopLabel,
                                ),
                              ]),
                            ]),
                      ],
                    );
                  }),
                ]),
              ]),
              create(
                "button",
                {
                  type: "button",
                  class: ["krds-btn", "small", "tertiary", "btn-help-panel", "fold"],
                  onClick: () => {
                    setOpen(false);
                    emit("close");
                  },
                },
                [
                  create("span", { class: "sr-only" }, props.label),
                  props.collapseLabel === undefined ? undefined : ` ${props.collapseLabel} `,
                  create("i", { class: ["svg-icon", "ico-angle", "right"] }),
                ],
              ),
            ]),
          ]),
        ],
      );
    };
  },
});
