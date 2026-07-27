import { defineConfig } from 'astro/config';
import angular from '@analogjs/astro-angular';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';

const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [
    mdx(),
    react({ include: ['**/src/components/patterns/ReactPatternExample.tsx'] }),
    vue({ include: ['**/src/components/patterns/VuePatternExample.vue'] }),
    angular({
      strictStylePlacement: true,
      vite: { transformFilter: (_code, id) => id.includes('/src/components/angular/') },
    }),
    svelte({ include: ['**/src/components/patterns/SveltePatternExample.svelte'] }),
    solid({ include: ['**/src/components/patterns/SolidPatternExample.tsx'] }),
  ],
});
