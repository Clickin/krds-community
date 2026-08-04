import { type HTMLAttributes, type ReactNode, type Ref } from "react";
import { SvgIcon } from "./_utils.js";

export interface FooterLink {
  id?: string;
  label: ReactNode;
  href?: string;
  target?: string;
  title?: string;
  icon?: string;
  emphasis?: boolean;
}
export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  relatedSites?: FooterLink[];
  logoLabel?: ReactNode;
  address?: ReactNode;
  contacts?: Array<{ title: ReactNode; description?: ReactNode }>;
  links?: FooterLink[];
  socialLinks?: FooterLink[];
  policyLinks?: FooterLink[];
  copyright?: ReactNode;
  organization?: ReactNode;
  description?: ReactNode;
  onRelatedSite?: (item: FooterLink) => void;
}
export function Footer({
  relatedSites = [],
  logoLabel,
  address,
  contacts = [],
  links = [],
  socialLinks = [],
  policyLinks = [],
  copyright,
  organization,
  description,
  onRelatedSite,
  id = "krds-footer",
  className,
  ref,
  ...props
}: FooterProps & { ref?: Ref<HTMLElement> }) {
  return (
    <footer {...props} ref={ref} id={id} className={className}>
      <div className="foot-quick">
        <div className="inner">
          {relatedSites.map((item) => (
            <button
              type="button"
              className="link"
              title={item.title}
              onClick={() => onRelatedSite?.(item)}
              key={item.id ?? String(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="inner">
        <div className="f-logo">
          <span className="sr-only">{logoLabel}</span>
        </div>
        <div className="f-cnt">
          <div className="f-info">
            <p className="info-addr">{address}</p>
            <ul className="info-cs">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <strong className="strong">{contact.title}</strong>
                  <span className="span">{contact.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="f-link">
            <div className="link-go">
              {links.map((item) => (
                <a
                  href={item.href ?? "#"}
                  className="krds-btn medium text"
                  target={item.target}
                  title={item.title}
                  key={item.id ?? String(item.label)}
                >
                  {item.label} <SvgIcon name="ico-angle right" />
                </a>
              ))}
            </div>
            <div className="link-sns">
              {socialLinks.map((item) => (
                <a
                  href={item.href ?? "#"}
                  className="krds-btn xlarge icon border"
                  target={item.target}
                  title={item.title}
                  key={item.id ?? String(item.label)}
                >
                  <span className="sr-only">{item.label}</span>
                  <SvgIcon name={`ico-${item.icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="f-btm">
          <div className="f-btm-text">
            <div className="f-menu">
              {policyLinks.map((item) => (
                <a
                  href={item.href ?? "#"}
                  className={item.emphasis ? "point" : undefined}
                  key={item.id ?? String(item.label)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <p className="f-copy">{copyright}</p>
          </div>
          <div className="krds-identifier">
            <span className="logo">
              <span className="sr-only">{organization}</span>
            </span>
            <span className="ban-txt">{description}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
