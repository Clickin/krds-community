import { computed, defineComponent, useId } from "vue";

import { calendarMarkup } from "../shared.js";

export const Calendar = defineComponent({
  name: "KrdsCalendar",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
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
  setup(props, { attrs }) {
    const generatedId = `krds-calendar-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    return () => {
      const className = attrs.class as string | undefined;
      return calendarMarkup(props as any, "calendar", id.value, attrs, className);
    };
  },
});
