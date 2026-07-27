// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  createAstroSsrServer,
  renderAstroComponentToString,
} from './server-loader.ts';

describe('Astro server rendering', () => {
  it('renders native form semantics and linked accordion disclosures', async () => {
    const server = await createAstroSsrServer();
    let dom: JSDOM | undefined;

    try {
      const { default: Fixture } = await server.ssrLoadModule(
        '/tests/framework/ssr-hydration/fixtures/AstroSsrFixture.astro',
      );
      const html = await renderAstroComponentToString(Fixture);
      dom = new JSDOM(html);
      const { document, FormData, HTMLInputElement } = dom.window;

      const form = document.querySelector<HTMLFormElement>('form');
      expect(form).not.toBeNull();
      expect(form?.getAttribute('action')).toBe('/search');
      expect(form?.method).toBe('post');

      const query = form?.elements.namedItem('query');
      expect(query).toBeInstanceOf(HTMLInputElement);
      expect(query).toMatchObject({
        id: 'astro-query',
        name: 'query',
        required: true,
        type: 'text',
        value: 'server value',
      });
      expect(document.querySelector('label[for="astro-query"]')?.textContent?.trim()).toBe(
        'Search query',
      );

      const accepted = form?.elements.namedItem('accepted');
      expect(accepted).toBeInstanceOf(HTMLInputElement);
      expect(accepted).toMatchObject({
        checked: true,
        id: 'astro-accepted',
        name: 'accepted',
        type: 'checkbox',
        value: 'yes',
      });
      expect(document.querySelector('label[for="astro-accepted"]')?.textContent?.trim()).toBe(
        'Accept terms',
      );

      const updates = form?.elements.namedItem('updates');
      expect(updates).toBeInstanceOf(HTMLInputElement);
      expect(updates).toMatchObject({
        checked: false,
        id: 'astro-updates',
        name: 'updates',
        type: 'checkbox',
        value: 'weekly',
      });
      expect(document.querySelector('label[for="astro-updates"]')?.textContent?.trim()).toBe(
        'Receive updates',
      );

      expect(Array.from(new FormData(form!).entries())).toEqual([
        ['query', 'server value'],
        ['accepted', 'yes'],
      ]);

      const accordion = document.querySelector<HTMLElement>('[data-krds-accordion]');
      expect(accordion).not.toBeNull();
      const buttons = Array.from(
        accordion!.querySelectorAll<HTMLButtonElement>('button.btn-accordion'),
      );
      expect(buttons).toHaveLength(2);
      expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual([
        'true',
        'false',
      ]);

      const controlledIds = buttons.map((button) => button.getAttribute('aria-controls'));
      expect(controlledIds.every(Boolean)).toBe(true);
      expect(new Set(controlledIds).size).toBe(buttons.length);

      const panels = buttons.map((button) => {
        expect(button.id).not.toBe('');
        expect(button.type).toBe('button');

        const panel = document.getElementById(button.getAttribute('aria-controls')!);
        expect(panel).not.toBeNull();
        expect(panel?.getAttribute('aria-labelledby')).toBe(button.id);
        expect(panel?.getAttribute('role')).toBe('region');
        return panel!;
      });
      expect(panels[0].hidden).toBe(false);
      expect(panels[1].hidden).toBe(true);
      expect(document.querySelector('astro-island')).toBeNull();
    } finally {
      dom?.window.close();
      await server.close();
    }
  });
});
