// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { createAstroSsrServer } from './server-loader.ts';

describe('Astro package server import', () => {
  it('evaluates its public entry module without browser globals', async () => {
    expect(Reflect.has(globalThis, 'window')).toBe(false);
    expect(Reflect.has(globalThis, 'document')).toBe(false);
    expect(Reflect.has(globalThis, 'HTMLElement')).toBe(false);

    const server = await createAstroSsrServer();

    try {
      expect(Reflect.has(globalThis, 'window')).toBe(false);
      expect(Reflect.has(globalThis, 'document')).toBe(false);
      expect(Reflect.has(globalThis, 'HTMLElement')).toBe(false);

      const packageModule = await server.ssrLoadModule('/packages/astro/src/index.js');

      expect(Object.keys(packageModule).length).toBeGreaterThan(0);
      expect(Reflect.has(globalThis, 'window')).toBe(false);
      expect(Reflect.has(globalThis, 'document')).toBe(false);
      expect(Reflect.has(globalThis, 'HTMLElement')).toBe(false);
    } finally {
      await server.close();
    }
  });
});
