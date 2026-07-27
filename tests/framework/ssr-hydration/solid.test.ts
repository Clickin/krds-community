import { createComponent } from 'solid-js';
import { hydrate } from 'solid-js/web';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ViteDevServer } from 'vite';
import { SolidHydrationFixture } from './fixtures/SolidHydrationFixture.tsx';
import { captureHydrationWarnings } from './console-capture.ts';
import { createFrameworkSsrServer } from './server-loader.ts';

let ssrServer: ViteDevServer;

beforeAll(async () => {
  ssrServer = await createFrameworkSsrServer('solid');
});

afterAll(async () => {
  await ssrServer.close();
});

describe('Solid server rendering and hydration', () => {
  it('hydrates server markup in place and preserves stateful form and widget behavior', async () => {
    const serverModule = (await ssrServer.ssrLoadModule(
      '/tests/framework/ssr-hydration/fixtures/solid-server.tsx',
    )) as { renderSolidFixture: () => string };
    const consoleCapture = captureHydrationWarnings();
    const host = document.createElement('div');
    document.body.append(host);
    let dispose: (() => void) | undefined;

    try {
      const serverMarkup = serverModule.renderSolidFixture();
      expect(serverMarkup.length).toBeGreaterThan(0);
      host.innerHTML = serverMarkup;
      const hydrationScript = host.querySelector<HTMLScriptElement>('script');
      expect(hydrationScript).not.toBeNull();
      window.eval(hydrationScript?.textContent ?? '');
      hydrationScript?.remove();
      const hydrationMarker = Array.from(host.childNodes).find(
        (node) => node.nodeType === Node.COMMENT_NODE && node.nodeValue === 'xs',
      );
      hydrationMarker?.remove();
      const serverInput = host.querySelector<HTMLInputElement>('#solid-query')!;
      expect(serverInput.value).toBe('server value');

      dispose = hydrate(() => createComponent(SolidHydrationFixture, {}), host);
      const input = host.querySelector<HTMLInputElement>('#solid-query')!;
      const checkbox = host.querySelector<HTMLInputElement>('#solid-accepted')!;
      const form = host.querySelector<HTMLFormElement>('form')!;
      expect(input).toBe(serverInput);
      expect(new FormData(form).get('query')).toBe('server value');

      input.value = 'hydrated value';
      input.dispatchEvent(new InputEvent('input', { bubbles: true }));
      checkbox.click();
      expect(host.querySelector('[data-testid="value-length"]')?.textContent).toBe('14');
      expect(new FormData(form).get('query')).toBe('hydrated value');
      expect(new FormData(form).get('accepted')).toBe('on');

      const accordionTrigger = host.querySelector<HTMLButtonElement>('.btn-accordion')!;
      accordionTrigger.click();
      const tabNodes = host.querySelectorAll<HTMLElement>('[role="tab"]');
      const secondTab = tabNodes[1]!;
      (secondTab.matches('button')
        ? secondTab
        : secondTab.querySelector<HTMLButtonElement>('button')!
      ).click();
      expect(accordionTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(secondTab.getAttribute('aria-selected')).toBe('true');

      host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe(
        'hydrated value',
      );
      expect(consoleCapture.messages).toEqual([]);
    } finally {
      dispose?.();
      host.remove();
      consoleCapture.restore();
    }
  });
});
