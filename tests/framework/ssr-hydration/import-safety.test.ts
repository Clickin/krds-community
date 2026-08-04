// @vitest-environment node

import { describe, expect, it } from "vitest";
import { createFrameworkSsrServer } from "./server-loader.ts";

type FrameworkImport = {
  name: string;
  load: () => Promise<object>;
};

// Dynamic imports are intentional: the test must observe entry-module evaluation
// only after confirming that the worker exposes no browser globals.
const frameworkImports: FrameworkImport[] = [
  {
    name: "React",
    load: () => import("../../../packages/react/src/index.ts"),
  },
  {
    name: "Vue",
    load: () => import("../../../packages/vue/src/index.ts"),
  },
  {
    name: "Svelte",
    load: () => import("../../../packages/svelte/src/index.js"),
  },
  {
    name: "Solid",
    load: async () => {
      const server = await createFrameworkSsrServer("solid");
      try {
        return await server.ssrLoadModule("/packages/solid/src/index.tsx");
      } finally {
        await server.close();
      }
    },
  },
  {
    name: "Angular",
    load: async () => {
      await import("@angular/compiler");
      return import("../../../packages/angular/src/index.ts");
    },
  },
];

describe.each(frameworkImports)("$name package server import", ({ load }) => {
  it("evaluates its public entry module without browser globals", async () => {
    expect(Reflect.has(globalThis, "window")).toBe(false);
    expect(Reflect.has(globalThis, "document")).toBe(false);
    expect(Reflect.has(globalThis, "HTMLElement")).toBe(false);

    const packageModule = await load();

    expect(Object.keys(packageModule).length).toBeGreaterThan(0);
    expect(Reflect.has(globalThis, "window")).toBe(false);
    expect(Reflect.has(globalThis, "document")).toBe(false);
  });
});
