import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";

const normativeStylesOnly = {
  name: "conformance-normative-styles-only",
  enforce: "pre" as const,
  transform(_code: string, id: string) {
    if (/\/packages\/react\/(?:src|dist)\/styles\.css$/.test(id)) return "";
  },
};
const frameworks = ["react", "vue", "svelte", "solid", "angular"] as const;
const plugins = [normativeStylesOnly, svelte(), solid()];

// Standalone ESM adapter bundles consumed by the @web/test-runner conformance
// workers. Each framework is built in lib mode so the `adapter` named export
// survives minification with a stable name the worker can import directly,
// without vite dev-transforming the host source per request.
export default defineConfig({
  plugins,
  build: {
    outDir: "dist/assets",
    emptyOutDir: false,
    lib: {
      entry: Object.fromEntries(
        frameworks.map((framework) => [
          framework,
          resolve(import.meta.dirname, `src/entries/${framework}.ts`),
        ]),
      ),
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}-adapter.mjs`,
    },
  },
});
