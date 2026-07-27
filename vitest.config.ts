import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import solid from 'vite-plugin-solid';
const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@krds-community/recipes': `${root}packages/recipes/src/index.ts`,
      '@krds-community/conformance': `${root}packages/conformance/src/index.ts`,
    },
  },
  plugins: [
    solid({
      include:
        /(?:packages\/solid\/src\/.*|tests\/framework\/solid\.test|tests\/framework\/ssr-hydration\/fixtures\/.*)\.tsx$/,
      solid: { hydratable: true },
    }),
    svelte({
      include:
        /(?:packages\/svelte\/src|tests\/framework\/(?:fixtures|ssr-hydration\/fixtures))\/.*\.svelte$/,
    }),
  ],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    passWithNoTests: false,
  },
});
