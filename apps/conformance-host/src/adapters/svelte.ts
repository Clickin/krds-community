import * as Components from "@krds-community/svelte";
import * as ExtraComponents from "@krds-community/svelte/extra";
import { createClassComponent } from "svelte/legacy";
import { createRawSnippet, tick, type Component } from "svelte";
import type { FrameworkAdapter } from "../protocol";

const exportName = (componentId: string): string =>
  componentId
    .split("-")
    .map((part) => `${part.charAt(0).toLocaleUpperCase("en-US")}${part.slice(1)}`)
    .join("");

const componentFor = (componentId: string): Component<Record<string, unknown>> => {
  const name = exportName(componentId);
  const candidate: unknown =
    (Components as Record<string, unknown>)[name] ??
    (ExtraComponents as Record<string, unknown>)[name];
  if (typeof candidate !== "function") {
    throw new Error(`Svelte package export is missing: ${name}`);
  }
  return candidate as Component<Record<string, unknown>>;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderProps = (props: Record<string, unknown>): Record<string, unknown> => {
  const children = props.children;
  if (children === undefined) return props;
  return {
    ...props,
    children: createRawSnippet(() => ({ render: () => escapeHtml(String(children)) })),
  };
};

export const adapter: FrameworkAdapter = {
  async mount(target, componentId, initialProps) {
    const component = componentFor(componentId);
    let instance:
      | {
          $set: (props: Record<string, unknown>) => void;
          $destroy: () => void;
        }
      | undefined;

    instance = createClassComponent({
      component,
      target,
      props: renderProps(initialProps),
    });
    await tick();

    return {
      async update(props) {
        instance?.$set(renderProps(props));
        await tick();
      },
      async dispose() {
        const current = instance;
        instance = undefined;
        current?.$destroy();
        target.replaceChildren();
      },
    };
  },
};
