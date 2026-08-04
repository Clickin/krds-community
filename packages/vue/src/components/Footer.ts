import { defineComponent, type PropType } from "vue";

import { create } from "../shared.js";
import type { AdditionalFooterContact, AdditionalFooterLink, KrdsNavItem } from "../types.js";

export const Footer = defineComponent({
  name: "KrdsFooter",
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    relatedSites: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
    logoLabel: { type: String, default: undefined },
    address: { type: String, default: undefined },
    contacts: { type: Array as PropType<AdditionalFooterContact[]>, default: () => [] },
    links: { type: Array as PropType<KrdsNavItem[]>, default: () => [] },
    socialLinks: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
    policyLinks: { type: Array as PropType<AdditionalFooterLink[]>, default: () => [] },
    copyright: { type: String, default: undefined },
    organization: { type: String, default: "KRDS Community" },
    description: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const className = attrs.class as string | undefined;
      return create("footer", { ...attrs, id: props.id ?? "krds-footer", class: className }, [
        create("div", { class: "foot-quick" }, [
          create(
            "div",
            { class: "inner" },
            props.relatedSites.map((site) =>
              create(
                "button",
                {
                  key: site.id ?? site.label,
                  type: "button",
                  class: "link",
                  title: site.title,
                },
                site.label,
              ),
            ),
          ),
        ]),
        create("div", { class: "inner" }, [
          create("div", { class: "f-logo" }, [
            create("span", { class: "sr-only" }, props.logoLabel),
          ]),
          create("div", { class: "f-cnt" }, [
            create("div", { class: "f-info" }, [
              create("p", { class: "info-addr" }, props.address),
              create(
                "ul",
                { class: "info-cs" },
                props.contacts.map((contact) =>
                  create("li", { key: contact.title }, [
                    create("strong", { class: "strong" }, contact.title),
                    create("span", { class: "span" }, contact.description),
                  ]),
                ),
              ),
            ]),
            create("div", { class: "f-link" }, [
              create(
                "div",
                { class: "link-go" },
                props.links.map((link) =>
                  create(
                    "a",
                    {
                      key: link.id ?? link.label,
                      class: ["krds-btn", "medium", "text"],
                      href: link.href,
                    },
                    [link.label, " ", create("i", { class: ["svg-icon", "ico-angle", "right"] })],
                  ),
                ),
              ),
              create(
                "div",
                { class: "link-sns" },
                props.socialLinks.map((link) =>
                  create(
                    "a",
                    {
                      key: link.id ?? link.label,
                      class: ["krds-btn", "icon", "xlarge", "border"],
                      href: link.href,
                      target: link.target,
                      title: link.title,
                    },
                    [
                      create("span", { class: "sr-only" }, link.label),
                      create("i", { class: ["svg-icon", `ico-${link.icon}`] }),
                    ],
                  ),
                ),
              ),
            ]),
          ]),
          create("div", { class: "f-btm" }, [
            create("div", { class: "f-btm-text" }, [
              create(
                "div",
                { class: "f-menu" },
                props.policyLinks.map((link) =>
                  create(
                    "a",
                    {
                      key: link.id ?? link.label,
                      class: link.emphasis ? "point" : undefined,
                      href: link.href,
                    },
                    link.label,
                  ),
                ),
              ),
              create("p", { class: "f-copy" }, props.copyright),
            ]),
            create("div", { class: "krds-identifier" }, [
              create("span", { class: "logo" }, [
                create("span", { class: "sr-only" }, props.organization),
              ]),
              create("span", { class: "ban-txt" }, props.description),
            ]),
          ]),
        ]),
      ]);
    };
  },
});
