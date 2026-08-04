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
const pages = ["react", "vue", "svelte", "solid", "angular"] as const;

export default defineConfig({
  base: process.env.KRDS_CONFORMANCE_HOST_BASE ?? "/host/",
  plugins: [normativeStylesOnly, svelte(), solid()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((framework) => [framework, resolve(import.meta.dirname, `${framework}.html`)]),
      ),
    },
  },
});
