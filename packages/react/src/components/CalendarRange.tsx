import { useState, type Ref } from "react";
import { CalendarSurface } from "./Calendar.js";

export interface CalendarRangeProps extends Omit<
  import("./Calendar.js").CalendarProps,
  "value" | "defaultValue" | "onValueChange" | "onChange"
> {
  start?: string;
  end?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onChange?: (range: { start: string; end: string }) => void;
}

export function CalendarRange({
  start,
  end,
  defaultStart = "",
  defaultEnd = "",
  onChange,
  rangeStartDay,
  rangeEndDay,
  ref,
  ...props
}: CalendarRangeProps & { ref?: Ref<HTMLDivElement> }) {
  const [uncontrolledRange, setUncontrolledRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const range = {
    start: start ?? uncontrolledRange.start,
    end: end ?? uncontrolledRange.end,
  };
  const update = (date: string) => {
    const next =
      !range.start || range.end ? { start: date, end: "" } : { start: range.start, end: date };
    if (start === undefined || end === undefined) setUncontrolledRange(next);
    onChange?.(next);
  };
  return (
    <CalendarSurface
      {...props}
      {...(ref !== undefined ? { ref } : {})}
      single={false}
      {...(rangeStartDay === undefined ? {} : { rangeStartDay })}
      {...(rangeEndDay === undefined ? {} : { rangeEndDay })}
      onValueChange={update}
    />
  );
}
