import { For, Show, mergeProps, splitProps, type JSX } from "solid-js";
import { Badge } from "./Badge.js";

export interface CardAction {
  label: string;
  onClick?: () => void;
}

export interface CardCheckboxProps {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (event: Event) => void;
}

export interface CardProps {
  class?: string;
  className?: string;
  type?: "vertical" | "horizontal";
  image?: string;
  imageAlt?: string;
  title: JSX.Element;
  description?: JSX.Element;
  badges?: string[];
  actions?: CardAction[];
  checkbox?: CardCheckboxProps;
  [key: string]: unknown;
}

export function Card(rawProps: CardProps) {
  const merged = mergeProps({ type: "vertical" as const, imageAlt: "" }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "type",
    "image",
    "imageAlt",
    "title",
    "description",
    "badges",
    "actions",
    "checkbox",
  ]);

  const className = () => props.class ?? props.className ?? "";
  return (
    <article
      {...(native as Record<string, any>)}
      class={`krds-card ${props.type}${className() ? ` ${className()}` : ""}`}
    >
      <Show when={props.image || props.badges?.length}>
        <div class="card-top">
          <Show when={props.image}>
            <img class="card-image" src={props.image} alt={props.imageAlt} />
          </Show>
          <For each={props.badges}>
            {(badge) => (
              <Badge class="card-badge" appearance="solid">
                {badge}
              </Badge>
            )}
          </For>
        </div>
      </Show>
      <div class="card-conts">
        <Show when={props.checkbox}>
          <div class="krds-form-check">
            <input
              type="checkbox"
              name={props.checkbox?.name}
              value={props.checkbox?.value}
              checked={props.checkbox?.checked}
              disabled={props.checkbox?.disabled}
              onChange={props.checkbox?.onChange}
            />
            <label>{props.checkbox?.label}</label>
          </div>
        </Show>
        <h3 class="card-title">{props.title}</h3>
        <Show when={props.description}>
          <p class="card-description">{props.description}</p>
        </Show>
        <Show when={props.actions?.length}>
          <div class="card-actions">
            <For each={props.actions}>
              {(action) => (
                <button type="button" class="krds-btn small primary" onClick={action.onClick}>
                  {action.label}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </article>
  );
}
