import { computed, defineComponent, ref, useId } from "vue";

import { calendarMarkup, create, withoutClass } from "../shared.js";

export const DateInput = defineComponent({
  name: "KrdsDateInput",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    name: { type: String, default: undefined },
    disabled: Boolean,
    required: Boolean,
    value: { type: [String, Number], default: undefined },
    defaultValue: { type: [String, Number], default: undefined },
    modelValue: { type: [String, Number, Boolean, Array], default: undefined },
    displayYear: { type: Number, default: undefined },
    displayMonth: { type: Number, default: undefined },
    selectedYear: { type: Number, default: undefined },
    selectedMonth: { type: Number, default: undefined },
    years: { type: Array as any, default: () => [] },
    disabledYears: { type: Array as any, default: () => [] },
    leadingDays: { type: Number, default: undefined },
    previousMonthDayCount: { type: Number, default: undefined },
    dayCount: { type: Number, default: undefined },
    calendarLabel: { type: String, default: undefined },
    calendarOpenLabel: { type: String, default: undefined },
    previousMonthLabel: { type: String, default: undefined },
    nextMonthLabel: { type: String, default: undefined },
    yearSelectLabel: { type: String, default: undefined },
    monthSelectLabel: { type: String, default: undefined },
    weekdays: { type: Array as any, default: () => [] },
    todayLabel: { type: String, default: undefined },
    cancelLabel: { type: String, default: undefined },
    confirmLabel: { type: String, default: undefined },
    eventLabel: { type: String, default: undefined },
    year: { type: Number, default: undefined },
    month: { type: Number, default: undefined },
    disabledMonths: { type: Array as any, default: () => [] },
    rangeStartDay: { type: Number, default: undefined },
    rangeEndDay: { type: Number, default: undefined },
    todayDay: { type: Number, default: undefined },
    eventDays: { type: Array as any, default: () => [] },
    disabledDays: { type: Array as any, default: () => [] },
  },
  emits: {
    "update:modelValue": (_value: any) => true,
    change: (_event: Event) => true,
    valueChange: (_value: any) => true,
  },
  setup(props, { attrs, emit: _emit }) {
    const generatedId = `krds-date-input-${useId()}`;
    const id = computed(() => props.id ?? generatedId);

    const initialValue =
      props.defaultValue ??
      props.value ??
      (typeof props.modelValue === "string" || typeof props.modelValue === "number"
        ? props.modelValue
        : "");
    const localValue = ref(String(initialValue));
    const value = computed(() => {
      if (props.value !== undefined) return String(props.value);
      if (typeof props.modelValue === "string" || typeof props.modelValue === "number") {
        return String(props.modelValue);
      }
      return localValue.value;
    });

    return () => {
      const className = attrs.class as string | undefined;
      const calendar = calendarMarkup(props as any, "date-input", id.value, attrs, className);
      const inputId = `${id.value}-input`;
      const inputHasValue =
        props.value !== undefined ||
        props.defaultValue !== undefined ||
        props.modelValue !== undefined;
      return create("div", { class: ["form-group", className] }, [
        create("div", { class: "form-tit" }, create("label", { for: inputId }, props.label)),
        create("div", { class: "form-conts" }, [
          create("div", { class: ["form-conts", "calendar-conts"] }, [
            create("div", { class: "calendar-input" }, [
              create("input", {
                ...withoutClass(attrs),
                id: inputId,
                type: "number",
                class: ["krds-input", "datepicker", "cal"],
                name: props.name,
                placeholder: (attrs.placeholder as string) ?? "YYYY.MM.DD",
                value: inputHasValue || value.value ? value.value : undefined,
                disabled: props.disabled,
                required: props.required,
              }),
              create(
                "button",
                {
                  type: "button",
                  class: ["form-btn-datepicker", "icon", "krds-btn", "medium"],
                },
                [
                  create("span", { class: "sr-only" }, "달력 열기"),
                  create("i", { class: ["ico-calendar", "svg-icon"] }),
                ],
              ),
            ]),
            calendar,
          ]),
        ]),
        props.hint ? create("p", { class: "form-hint" }, props.hint) : null,
      ]);
    };
  },
});
