import {
  useId,
  useState,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cx } from "@krds-community/recipes";
import type { BoxProps } from "./_utils.js";

export interface DisclosureProps
  extends
    Omit<BoxProps, "id" | "items" | "open">,
    Omit<HTMLAttributes<HTMLDivElement>, "children" | "title" | "onToggle" | "className"> {
  title: ReactNode;
  items?: ReactNode[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onToggle?: MouseEventHandler<HTMLButtonElement>;
}
export function Disclosure({
  title,
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onToggle,
  children,
  id: providedId,
  className,
  ...props
}: DisclosureProps) {
  const generatedId = useId();
  const panelId = providedId ?? `krds-disclosure-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  return (
    <div {...props} className={cx("krds-disclosure", "conts-expand-area", open && "active", className)}>
      <button
        id={`${panelId}-trigger`}
        type="button"
        className="btn-conts-expand"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={(event) => {
          const next = !open;
          onToggle?.(event);
          if (event.defaultPrevented) return;
          if (controlledOpen === undefined) setUncontrolledOpen(next);
          onOpenChange?.(next);
        }}
      >
        {title}
      </button>
      <div
        id={panelId}
        className="expand-wrap"
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        inert={!open}
      >
        <div className="expand-in">
          {items ? (
            <ul className="krds-info-list dash" role="list">
              {items.map((item, index) => (
                <li role="listitem" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
