import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

const alertIcons = {
  danger: "ico-error-fill",
  warning: "ico-error-fill",
  success: "ico-success-fill",
  information: "ico-information-fill",
} as const;

export interface AlertProps extends BoxProps {
  state?: "danger" | "warning" | "success" | "information";
  size?: "with-title" | "slim";
  title?: ReactNode;
  message: ReactNode;
}

export function Alert({ state = "danger", size = "slim", title, message, className }: AlertProps) {
  return (
    <div className={cx("krds-alert", state, size, className)} role="status">
      <i className={cx("svg-icon alert-icon", alertIcons[state])} aria-hidden="true" />
      {title ? <strong className="alert-title">{title}</strong> : null}
      <p className="alert-body">{message}</p>
    </div>
  );
}
