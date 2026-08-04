import * as Components from "@krds-community/vue";
import { createApp, h, nextTick, shallowReactive, type Component } from "vue";
import type { FrameworkAdapter } from "../protocol";

const CORE_EXPORTS: Readonly<Record<string, string>> = {
  button: "Button",
  checkbox: "Checkbox",
  radio: "Radio",
  switch: "Switch",
  "text-input": "TextInput",
  accordion: "Accordion",
};

const toPascalCase = (componentId: string): string =>
  componentId
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");

const resolveComponent = (componentId: string): Component => {
  const exportName = CORE_EXPORTS[componentId] ?? toPascalCase(componentId);
  const component: unknown = Components[exportName as keyof typeof Components];

  if (component === null || (typeof component !== "object" && typeof component !== "function")) {
    throw new Error(`Unknown Vue component: ${componentId}`);
  }

  return component as Component;
};

export const adapter: FrameworkAdapter = {
  mount(target, componentId, props) {
    const component = resolveComponent(componentId);
    const currentProps = shallowReactive<Record<string, unknown>>({ ...props });

    target.replaceChildren();
    const app = createApp({
      render: () => {
        const renderProps = { ...currentProps };
        const children = renderProps.children;
        delete renderProps.children;
        const className = renderProps.className;
        delete renderProps.className;
        if (className !== undefined) {
          renderProps.class = [renderProps.class, className];
        }
        return h(
          component,
          renderProps,
          children === undefined ? undefined : { default: () => String(children) },
        );
      },
    });
    app.mount(target);

    return {
      async update(nextProps) {
        for (const key of Object.keys(currentProps)) {
          if (!Object.hasOwn(nextProps, key)) delete currentProps[key];
        }
        Object.assign(currentProps, nextProps);
        await nextTick();
      },
      dispose() {
        app.unmount();
      },
    };
  },
};
