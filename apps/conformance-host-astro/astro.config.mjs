import { defineConfig } from 'astro/config';

export default defineConfig({
  base: '/apps/conformance-host-astro/dist',
  build: {
    format: 'directory',
  },
  output: 'static',
  trailingSlash: 'always',
});
