import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  plugins: [solid({ generate: 'dom', hydratable: false })],
  build: {
    outDir: resolve(packageRoot, 'dist'),
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(packageRoot, 'src/index.tsx'),
        additional: resolve(packageRoot, 'src/additional.tsx'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [/^solid-js(?:\/.*)?$/, /^@krds-community\//],
    },
  },
});
