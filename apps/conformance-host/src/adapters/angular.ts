import "@angular/compiler";
import {
  createComponent,
  reflectComponentType,
  type ApplicationRef,
  type EnvironmentInjector,
  type Type,
} from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import * as Components from "@krds-community/angular";
import type { FrameworkAdapter } from "../protocol";

const coreExports: Readonly<Record<string, string>> = {
  button: "KrdsButtonComponent",
  checkbox: "KrdsCheckboxComponent",
  radio: "KrdsRadioComponent",
  switch: "KrdsSwitchComponent",
  "text-input": "KrdsTextInputComponent",
  accordion: "KrdsAccordionComponent",
};

const toPascalCase = (componentId: string): string =>
  componentId
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");

const isComponentType = (candidate: unknown): candidate is Type<unknown> =>
  typeof candidate === "function";

const resolveComponent = (
  componentId: string,
): { component: Type<unknown>; inputNames: ReadonlySet<string> } => {
  const coreExport = coreExports[componentId];
  const exportName = coreExport ?? `Krds${toPascalCase(componentId)}Component`;
  const candidate: unknown = Reflect.get(Components, exportName);

  if (!isComponentType(candidate)) {
    throw new Error(`Unknown Angular component: ${componentId} (${exportName})`);
  }

  const metadata = reflectComponentType(candidate);
  if (metadata === null || !metadata.isStandalone) {
    throw new Error(`Angular package export is not a standalone component: ${exportName}`);
  }

  return {
    component: candidate,
    inputNames: new Set(metadata.inputs.map((input) => input.templateName)),
  };
};

export const adapter: FrameworkAdapter = {
  async mount(target, componentId, initialProps) {
    const { component, inputNames } = resolveComponent(componentId);
    target.replaceChildren();

    const application: ApplicationRef = await createApplication();
    const environmentInjector: EnvironmentInjector = application.injector;
    const projectedText =
      typeof initialProps.children === "string"
        ? document.createTextNode(initialProps.children)
        : undefined;
    const componentRef = createComponent(component, {
      environmentInjector,
      hostElement: target,
      ...(projectedText ? { projectableNodes: [[projectedText]] } : {}),
    });
    application.attachView(componentRef.hostView);

    let currentInputNames = new Set<string>();
    const commit = async (props: Record<string, unknown>): Promise<void> => {
      if (inputNames.has("kind")) componentRef.setInput("kind", componentId);
      const nextInputNames = new Set<string>();

      for (const [name, value] of Object.entries(props)) {
        if (name === "children" || name === "kind") continue;
        if (!inputNames.has(name)) continue;
        componentRef.setInput(name, value);
        nextInputNames.add(name);
      }
      for (const name of currentInputNames) {
        if (!nextInputNames.has(name)) componentRef.setInput(name, undefined);
      }

      currentInputNames = nextInputNames;
      application.tick();
      await application.whenStable();
      application.tick();
    };

    await commit(initialProps);

    return {
      update: commit,
      dispose() {
        componentRef.destroy();
        application.destroy();
        target.replaceChildren();
      },
    };
  },
};
