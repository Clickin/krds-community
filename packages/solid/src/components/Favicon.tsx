import { mergeProps, splitProps } from "solid-js";

export interface FaviconProps {
  class?: string;
  className?: string;
  href?: string;
  size?: string;
  type?: string;
  [key: string]: unknown;
}

export function Favicon(rawProps: FaviconProps) {
  const merged = mergeProps({ size: "32x32", type: "image/png" }, rawProps);
  const [props, native] = splitProps(merged, ["class", "className", "href", "size", "type"]);
  return (
    <link
      {...(native as Record<string, any>)}
      rel="icon"
      href={props.href}
      sizes={props.size}
      type={props.type}
    />
  );
}
