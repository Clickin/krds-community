import { useId, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon } from "./_utils.js";
import { CalendarSurface } from "./Calendar.js";

export function DateInput({
  ref,
  ...props
}: import("./Calendar.js").CalendarProps & { ref?: Ref<HTMLDivElement> }) {
  const inputId = `krds-date-${useId()}`;
  const {
    label,
    hint,
    value,
    calendarOpenLabel = "달력 열기",
    className,
    ...calendarProps
  } = props;
  return (
    <div ref={ref} className={cx("form-group", className)}>
      <div className="form-tit">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <div className="form-conts">
        <div className="form-conts calendar-conts">
          <div className="calendar-input">
            <input
              id={inputId}
              type="number"
              className="krds-input datepicker cal"
              placeholder="YYYY.MM.DD"
              value={value || undefined}
            />
            <button type="button" className="krds-btn medium icon form-btn-datepicker">
              <span className="sr-only">{calendarOpenLabel}</span>
              <SvgIcon name="ico-calendar" />
            </button>
          </div>
          <CalendarSurface {...calendarProps} value={value ?? ""} single={false} />
        </div>
      </div>
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}
