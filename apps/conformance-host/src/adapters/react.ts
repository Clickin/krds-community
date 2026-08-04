import { createElement, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as Components from "@krds-community/react";
import type { FrameworkAdapter } from "../protocol";

const exportName = (componentId: string): string =>
  componentId
    .split("-")
    .map((part) => `${part.charAt(0).toLocaleUpperCase("en-US")}${part.slice(1)}`)
    .join("");

const componentFor = (componentId: string): ComponentType<Record<string, unknown>> => {
  const candidate = (Components as Record<string, unknown>)[exportName(componentId)];
  if (typeof candidate !== "function" && typeof candidate !== "object") {
    throw new Error(`React package export is missing: ${exportName(componentId)}`);
  }
  return candidate as ComponentType<Record<string, unknown>>;
};

export const adapter: FrameworkAdapter = {
  mount(target, componentId, initialProps) {
    const root = createRoot(target);
    const Component = componentFor(componentId);
    let faviconClone: HTMLLinkElement | undefined;
    const render = (props: Record<string, unknown>) => {
      faviconClone?.remove();
      faviconClone = undefined;
      flushSync(() => root.render(createElement(Component, props)));
      if (componentId !== "favicon" || target.querySelector('link[rel="icon"]')) return;
      const requestedHref = typeof props.href === "string" ? props.href : undefined;
      const hoistedLink = Array.from(
        target.ownerDocument.head.querySelectorAll<HTMLLinkElement>('link[rel="icon"]'),
      )
        .reverse()
        .find((link) => requestedHref === undefined || link.getAttribute("href") === requestedHref);
      if (!hoistedLink) {
        throw new Error("React did not render the favicon link into the target or document head.");
      }
      faviconClone = hoistedLink.cloneNode(true) as HTMLLinkElement;
      target.append(faviconClone);
    };
    render(initialProps);
    return {
      update: render,
      dispose() {
        faviconClone?.remove();
        faviconClone = undefined;
        flushSync(() => root.unmount());
      },
    };
  },
};
