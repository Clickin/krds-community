import { type LinkHTMLAttributes, type Ref } from "react";

export interface FaviconProps extends Omit<
  LinkHTMLAttributes<HTMLLinkElement>,
  "href" | "rel" | "size" | "sizes" | "type"
> {
  href?: string;
  size?: string;
  sizes?: string;
  type?: string;
}
export function Favicon({
  href,
  size,
  sizes,
  type,
  ref,
  ...props
}: FaviconProps & { ref?: Ref<HTMLLinkElement> }) {
  return <link {...props} ref={ref} rel="icon" href={href} sizes={sizes ?? size} type={type} />;
}
