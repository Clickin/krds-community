import { type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { Checkbox, type CheckboxProps } from "./Checkbox.js";
import type { BoxProps } from "./_utils.js";

export interface CardAction {
  label: string;
  onClick?: () => void;
}

export interface CardProps extends BoxProps {
  type?: "vertical" | "horizontal";
  image?: string;
  imageAlt?: string;
  title: ReactNode;
  description?: ReactNode;
  badges?: string[];
  actions?: CardAction[];
  checkbox?: CheckboxProps;
}

export function Card({
  type = "vertical",
  image,
  imageAlt = "",
  title,
  description,
  badges,
  actions,
  checkbox,
  className,
}: CardProps) {
  const hasTop = Boolean(image || badges?.length || checkbox);
  return (
    <article className={cx("krds-card", type, className)}>
      {hasTop ? (
        <div className="card-top">
          {checkbox ? <Checkbox {...checkbox} /> : null}
          {image ? <img className="card-image" src={image} alt={imageAlt} /> : null}
          {badges?.length ? (
            <div className="card-badge">
              {badges.map((badge) => (
                <Badge key={badge} tone="primary" appearance="solid">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="card-conts">
        <h3 className="card-title">{title}</h3>
        {description ? <p className="card-description">{description}</p> : null}
        {actions?.length ? (
          <div className="card-actions">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                size="small"
                variant="primary"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
