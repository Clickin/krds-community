import { For, Show, mergeProps, splitProps } from "solid-js";
import { labelOf } from "../shared.js";
import type { AlertItem } from "../shared.js";

export interface CriticalAlertsProps {
  class?: string;
  className?: string;
  items: AlertItem[];
  actionLabel?: string;
  [key: string]: unknown;
}

export function CriticalAlerts(rawProps: CriticalAlertsProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "items", "actionLabel"]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`main-urgent-wrap${className() ? ` ${className()}` : ""}`}
      role="alert"
    >
      <ul class="krds-critical-alerts">
        <For each={props.items}>
          {(item) => {
            const alert = () =>
              typeof item === "string" || typeof item === "number"
                ? undefined
                : (item as AlertItem);
            const badge = () => alert()?.badge;
            const href = () => alert()?.href;
            return (
              <li>
                <div class="critical-ban">
                  <Show when={badge()}>
                    <span class={`critical-badge ${badge()}`}>{alert()?.badgeLabel}</span>
                  </Show>
                  <p class="critical-txt">{alert()?.message ?? alert()?.text ?? labelOf(item)}</p>
                  <Show when={href()}>
                    <a class="krds-btn medium basic link" href={href()}>
                      <span class="m-hide">{alert()?.linkLabel ?? props.actionLabel}</span>{" "}
                      <i class="svg-icon ico-angle right" />
                    </a>
                  </Show>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}
