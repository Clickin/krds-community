import { useId, type ComponentProps, type ReactNode, type Ref } from "react";
import { SvgIcon, cx, joinAriaIds } from "./_utils.js";
import { TextInput } from "./TextInput.js";

export interface TextInputIconProps extends Omit<ComponentProps<typeof TextInput>, "ref"> {
  icon?: ReactNode;
  error?: ReactNode;
  passwordLabel?: ReactNode;
}

export function TextInputIcon({
  icon,
  label,
  hint,
  error: _error,
  state: _state,
  size,
  readonly,
  readOnly,
  id: providedId,
  className,
  passwordLabel = "입력한 비밀번호 보기",
  "aria-describedby": ariaDescribedBy,
  ref,
  ...props
}: TextInputIconProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const id = providedId ?? `krds-input-icon-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="form-conts btn-ico-wrap">
        <input
          {...props}
          ref={ref}
          id={id}
          readOnly={readonly ?? readOnly}
          className={cx("krds-input", size, className)}
          aria-describedby={joinAriaIds(ariaDescribedBy, hintId)}
        />
        <button type="button" className="krds-btn medium icon">
          <span className="sr-only">{passwordLabel}</span>
          {icon ?? <SvgIcon name="ico-pw-visible" />}
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
