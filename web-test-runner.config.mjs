import { chromeLauncher } from "@web/test-runner-chrome";
import { vitePlugin } from "@remcovaes/web-test-runner-vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import solid from "vite-plugin-solid";

// Same style-suppression react.vue/prop.svelte/solid plugin set as
// apps/conformance-host/vite.config.ts so framework packages load in-browser.
const normativeStylesOnly = {
  name: "conformance-normative-styles-only",
  enforce: "pre",
  transform(_code, id) {
    if (/\/packages\/react\/(?:src|dist)\/styles\.css$/.test(id)) return "";
  },
};

export default {
  plugins: [
    vitePlugin({
      root: new URL(".", import.meta.url).pathname,
      plugins: [normativeStylesOnly, svelte(), solid()],
    }),
  ],
  files: [
    "tests/web-test-runner/conformance-wtr-*.test.mjs",
    "tests/web-test-runner/conformance-visual-wtr.test.mjs",
  ],
  nodeResolve: false,
  esbuildTarget: "chrome120",
  concurrency: 5,
  concurrentBrowsers: 5,
  // The capture sweep mounts every catalog fixture; this is intentionally
  // generous so the run is bounded by capture work rather than a timer.
  testsFinishTimeout: 900000,
  browsers: [
    chromeLauncher({
      concurrency: 6,
      launchOptions: {
        headless: true,
        args: [
          "--no-first-run",
          "--disable-background-networking",
          "--disable-component-update",
          "--disable-default-apps",
          "--disable-extensions",
          "--disable-sync",
        ],
      },
    }),
  ],
  testFramework: {
    config: {
      timeout: 30000,
    },
  },
};
