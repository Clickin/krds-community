import { createComponent, createSignal, type Component } from "solid-js";
import { render } from "solid-js/web";
import * as Components from "@krds-community/solid";
import * as ExtraComponents from "@krds-community/solid/extra";
import type { FrameworkAdapter } from "../protocol";

const coreExports = {
  button: "Button",
  checkbox: "Checkbox",
  radio: "Radio",
  switch: "Switch",
  "text-input": "TextInput",
  accordion: "Accordion",
} as const;

type FixtureComponent = Component<Record<string, unknown>>;

const toPascalCase = (componentId: string): string =>
  componentId
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => `${part[0]!.toUpperCase()}${part.slice(1)}`)
    .join("");

const resolveComponent = (componentId: string): FixtureComponent => {
  const coreExport = coreExports[componentId as keyof typeof coreExports];
  const exportName = coreExport ?? toPascalCase(componentId);
  const candidate: unknown =
    Reflect.get(Components, exportName) ?? Reflect.get(ExtraComponents, exportName);
  if (typeof candidate !== "function") {
    throw new Error(`Unknown Solid component: ${componentId} (${exportName})`);
  }
  return candidate as FixtureComponent;
};

const createReactiveProps = (
  props: Record<string, unknown>,
): [Record<string, unknown>, (props: Record<string, unknown>) => void] => {
  const [currentProps, setCurrentProps] = createSignal(props, { equals: false });
  const reactiveProps = new Proxy(Object.create(null) as Record<string, unknown>, {
    get: (_target, property) => Reflect.get(currentProps(), property),
    has: (_target, property) => Reflect.has(currentProps(), property),
    ownKeys: () => Reflect.ownKeys(currentProps()),
    getOwnPropertyDescriptor: (_target, property) => {
      if (!Reflect.has(currentProps(), property)) return undefined;
      return {
        configurable: true,
        enumerable: true,
        get: () => Reflect.get(currentProps(), property),
      };
    },
  });

  return [reactiveProps, (nextProps) => setCurrentProps(nextProps)];
};

export const adapter: FrameworkAdapter = {
  mount(target, componentId, props) {
    target.replaceChildren();
    const component = resolveComponent(componentId);
    const [reactiveProps, setProps] = createReactiveProps(props);
    const disposeRender = render(() => createComponent(component, reactiveProps), target);

    return {
      async update(nextProps) {
        setProps(nextProps);
        await Promise.resolve();
      },
      dispose() {
        disposeRender();
        target.replaceChildren();
      },
    };
  },
};
