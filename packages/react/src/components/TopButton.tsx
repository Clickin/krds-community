import { cx } from "@krds-community/recipes";
import { SvgIcon, type BoxProps } from "./_utils.js";

export interface TopButtonProps extends BoxProps {
  type?: "basic" | "label";
  onClick: () => void;
  ariaLabel?: string;
  label?: string;
}

export function TopButton({
  type = "basic",
  onClick,
  ariaLabel,
  label = "TOP",
  className,
}: TopButtonProps) {
  return (
    <div className={cx("krds-top-button", className)}>
      <button
        type="button"
        className="krds-btn medium icon"
        aria-label={ariaLabel ?? "맨 위로"}
        onClick={onClick}
      >
        <SvgIcon name="ico-go-top" />
        {type === "label" ? <span>{label}</span> : null}
      </button>
    </div>
  );
}
