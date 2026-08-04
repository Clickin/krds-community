import { For, mergeProps, splitProps } from "solid-js";
import type { MenuItem, FooterContact } from "../shared.js";

export interface FooterProps {
  class?: string;
  className?: string;
  id?: string;
  relatedSites?: MenuItem[];
  logoLabel?: string;
  address?: string;
  contacts?: FooterContact[];
  links?: MenuItem[];
  socialLinks?: MenuItem[];
  policyLinks?: MenuItem[];
  copyright?: string;
  organization?: string;
  description?: string;
  [key: string]: unknown;
}

export function Footer(rawProps: FooterProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "id",
    "relatedSites",
    "logoLabel",
    "address",
    "contacts",
    "links",
    "socialLinks",
    "policyLinks",
    "copyright",
    "organization",
    "description",
  ]);
  const className = () => props.class ?? props.className ?? "";
  return (
    <footer
      {...(native as Record<string, any>)}
      id={props.id ?? "krds-footer"}
      class={className() || undefined}
    >
      <div class="foot-quick">
        <div class="inner">
          <For each={props.relatedSites ?? []}>
            {(item) => (
              <button type="button" class="link" title={item.title}>
                {item.label}
              </button>
            )}
          </For>
        </div>
      </div>
      <div class="inner">
        <div class="f-logo">
          <span class="sr-only">{props.logoLabel}</span>
        </div>
        <div class="f-cnt">
          <div class="f-info">
            <p class="info-addr">{props.address}</p>
            <ul class="info-cs">
              <For each={props.contacts ?? []}>
                {(contact) => (
                  <li>
                    <strong class="strong">{contact.title}</strong>
                    <span class="span">{contact.description}</span>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div class="f-link">
            <div class="link-go">
              <For each={(props.links ?? []) as MenuItem[]}>
                {(item) => (
                  <a href={item.href ?? "#"} class="krds-btn medium text">
                    {item.label} <i class="svg-icon ico-angle right" />
                  </a>
                )}
              </For>
            </div>
            <div class="link-sns">
              <For each={props.socialLinks ?? []}>
                {(item) => (
                  <a
                    href={item.href ?? "#"}
                    class="krds-btn xlarge icon border"
                    target={item.target}
                    title={item.title}
                  >
                    <span class="sr-only">{item.label}</span>
                    <i class={`svg-icon ico-${item.icon}`} />
                  </a>
                )}
              </For>
            </div>
          </div>
        </div>
        <div class="f-btm">
          <div class="f-btm-text">
            <div class="f-menu">
              <For each={(props.policyLinks ?? []) as MenuItem[]}>
                {(item) => (
                  <a href={item.href ?? "#"} classList={{ point: item.emphasis }}>
                    {item.label}
                  </a>
                )}
              </For>
            </div>
            <p class="f-copy">{props.copyright}</p>
          </div>
          <div class="krds-identifier">
            <span class="logo">
              <span class="sr-only">{props.organization}</span>
            </span>
            <span class="ban-txt">{props.description}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
