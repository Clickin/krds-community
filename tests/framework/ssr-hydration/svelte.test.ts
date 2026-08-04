import { hydrate, tick, unmount } from "svelte";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ViteDevServer } from "vite";
import SvelteHydrationFixture from "./fixtures/SvelteHydrationFixture.svelte";
import { captureHydrationWarnings } from "./console-capture.ts";
import { createFrameworkSsrServer } from "./server-loader.ts";

let ssrServer: ViteDevServer;

beforeAll(async () => {
  ssrServer = await createFrameworkSsrServer("svelte");
});

afterAll(async () => {
  await ssrServer.close();
});

describe("Svelte server rendering and hydration", () => {
  it("hydrates server markup in place and preserves stateful form and widget behavior", async () => {
    const serverModule = (await ssrServer.ssrLoadModule(
      "/tests/framework/ssr-hydration/fixtures/svelte-server.ts",
    )) as { renderSvelteFixture: () => string };
    const consoleCapture = captureHydrationWarnings();
    const host = document.createElement("div");
    document.body.append(host);
    let instance: Record<string, unknown> | undefined;

    try {
      const serverMarkup = serverModule.renderSvelteFixture();
      expect(serverMarkup.length).toBeGreaterThan(0);
      host.innerHTML = serverMarkup;
      const serverInput = host.querySelector<HTMLInputElement>("#svelte-query")!;
      expect(serverInput.value).toBe("server value");

      instance = hydrate(SvelteHydrationFixture, { target: host });
      await tick();
      const input = host.querySelector<HTMLInputElement>("#svelte-query")!;
      const checkbox = host.querySelector<HTMLInputElement>("#svelte-accepted")!;
      const form = host.querySelector<HTMLFormElement>("form")!;
      expect(input).toBe(serverInput);
      expect(new FormData(form).get("query")).toBe("server value");

      input.value = "hydrated value";
      input.dispatchEvent(new InputEvent("input", { bubbles: true }));
      checkbox.click();
      await tick();
      expect(host.querySelector('[data-testid="value-length"]')?.textContent).toBe("14");
      expect(new FormData(form).get("query")).toBe("hydrated value");
      expect(new FormData(form).get("accepted")).toBe("on");

      const accordionTrigger = host.querySelector<HTMLButtonElement>(".btn-accordion")!;
      accordionTrigger.click();
      const tabNodes = host.querySelectorAll<HTMLElement>('[role="tab"]');
      const secondTab = tabNodes[1]!;
      (secondTab.matches("button")
        ? secondTab
        : secondTab.querySelector<HTMLButtonElement>("button")!
      ).click();
      await tick();
      expect(accordionTrigger.getAttribute("aria-expanded")).toBe("false");
      expect(secondTab.getAttribute("aria-selected")).toBe("true");
      expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.lastChild?.textContent).toBe(
        "Second panel",
      );

      host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      await tick();
      expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe("hydrated value");
      expect(consoleCapture.messages).toEqual([]);
    } finally {
      if (instance) await unmount(instance);
      host.remove();
      consoleCapture.restore();
    }
  });
});
