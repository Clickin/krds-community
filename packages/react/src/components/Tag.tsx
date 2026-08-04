import type { ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import type { KrdsTone } from "@krds-community/recipes";
import { toneClass } from "./_utils.js";

export function Tag({
  label,
  tone,
  removable = true,
  onRemove,
  className,
}: {
  label: ReactNode;
  tone?: KrdsTone;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <div className="krds-tag-wrap large">
      <span className={cx("krds-btn-tag", tone && `bg-${toneClass[tone]}`, className)}>
        {label}
        {removable ? (
          <button type="button" className="btn-delete" onClick={onRemove}>
            <span className="sr-only">삭제</span>
          </button>
        ) : null}
      </span>
    </div>
  );
}
