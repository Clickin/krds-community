import { computed, defineComponent, useId, type PropType } from "vue";

import { create, invokeNativeEvent, withoutClass, withoutNativeEvents } from "../shared.js";
import type { AdditionalFileItem } from "../types.js";

export const FileUpload = defineComponent({
  name: "KrdsFileUpload",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    prompt: { type: String, default: undefined },
    hint: { type: String, default: undefined },
    inputId: { type: String, default: undefined },
    name: { type: String, default: undefined },
    multiple: Boolean,
    disabled: Boolean,
    required: Boolean,
    selectLabel: { type: String, default: undefined },
    label: { type: String, default: undefined },
    currentCount: { type: Number, default: undefined },
    maxCount: { type: Number, default: undefined },
    countSuffix: { type: String, default: undefined },
    files: { type: Array as PropType<AdditionalFileItem[]>, default: () => [] },
    deleteAllLabel: { type: String, default: undefined },
  },
  emits: {
    change: (_event: Event) => true,
    filesChange: (_files: File[]) => true,
  },
  setup(props, { attrs, emit, slots: _slots }) {
    const generatedId = `krds-file-upload-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    return () => {
      const className = attrs.class as string | undefined;
      const inputId = props.inputId ?? id.value;
      return create(
        "div",
        {
          ...withoutNativeEvents(attrs),
          class: ["krds-file-upload", "line", className],
        },
        [
          create("div", { class: "file-head" }, [
            create("h3", { class: "tit" }, props.title),
            create("div", [create("p", props.description)]),
          ]),
          create("div", { class: "file-upload" }, [
            create("p", { class: "txt" }, props.prompt ?? props.hint),
            create("div", { class: "file-upload-btn-wrap" }, [
              create("input", {
                ...withoutClass(attrs),
                id: inputId,
                type: "file",
                name: props.name,
                hidden: "",
                multiple: props.multiple,
                disabled: props.disabled,
                required: props.required,
                "aria-label": props.selectLabel ?? props.label,
                onChange: (event: Event) => {
                  invokeNativeEvent(attrs.onChange as unknown, event);
                  emit("change", event);
                  emit("filesChange", Array.from((event.target as HTMLInputElement).files ?? []));
                },
              }),
              create(
                "button",
                {
                  type: "button",
                  class: ["krds-btn", "medium"],
                  disabled: props.disabled,
                  onClick: () => {
                    const input = document.getElementById(inputId);
                    if (input instanceof HTMLInputElement) input.click();
                  },
                },
                [
                  create("i", { class: ["svg-icon", "ico-upload"] }),
                  props.selectLabel,
                ],
              ),
            ]),
          ]),
          create("div", { class: "file-list" }, [
            create("div", { class: "total" }, [
              create(
                "span",
                { class: "current" },
                `${props.currentCount ?? props.files.length}${props.countSuffix ?? ""}`,
              ),
              ` / ${props.maxCount ?? ""}${props.countSuffix ?? ""}`,
            ]),
            create(
              "ul",
              { class: "upload-list" },
              props.files.map((file) =>
                create(
                  "li",
                  {
                    key: file.id,
                    class: file.status === "error" ? "is-error" : undefined,
                  },
                  [
                    create(
                      "div",
                      {
                        class: [
                          "file-info",
                          file.status === "downloadable" ? "m-column" : undefined,
                        ],
                      },
                      [
                        create("div", { class: "file-name" }, file.name),
                        create("div", { class: "btn-wrap" }, [
                          file.status === "uploading"
                            ? create("span", { class: "krds-spinner", role: "status" }, [
                                create("span", { class: "sr-only" }, file.statusLabel),
                              ])
                            : file.status === "complete"
                              ? create("span", { class: ["complete", "ico-invalid"] }, [
                                  create("em", { class: "sr-only" }, file.statusLabel),
                                ])
                              : null,
                          file.deleteLabel
                            ? create(
                                "button",
                                {
                                  type: "button",
                                  class: ["krds-btn", "medium", "text"],
                                },
                                [
                                  file.deleteLabel,
                                  " ",
                                  create("i", {
                                    class: ["svg-icon", "ico-delete-fill"],
                                  }),
                                ],
                              )
                            : null,
                          file.downloadLabel
                            ? create(
                                "button",
                                { type: "button", class: ["krds-btn", "medium", "text"] },
                                [
                                  file.downloadLabel,
                                  " ",
                                  create("i", { class: ["svg-icon", "ico-down"] }),
                                ],
                              )
                            : null,
                          file.previewLabel
                            ? create(
                                "button",
                                { type: "button", class: ["krds-btn", "medium", "text"] },
                                [
                                  file.previewLabel,
                                  " ",
                                  create("i", {
                                    class: ["svg-icon", "ico-angle", "right"],
                                  }),
                                ],
                              )
                            : null,
                        ]),
                      ],
                    ),
                    file.errors?.length
                      ? create(
                          "p",
                          { class: "file-hint-invalid" },
                          file.errors.flatMap((error: string, errorIndex: number) =>
                            errorIndex ? [create("br"), error] : [error],
                          ),
                        )
                      : null,
                  ],
                ),
              ),
            ),
            create("div", { class: "upload-delete-btn" }, [
              create("button", { type: "button", class: ["krds-btn", "tertiary", "xsmall"] }, [
                props.deleteAllLabel,
                create("i", { class: ["svg-icon", "ico-angle", "right"] }),
              ]),
            ]),
          ]),
        ],
      );
    };
  },
});
