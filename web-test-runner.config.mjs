import { chromeLauncher } from "@web/test-runner-chrome";
import { vitePlugin } from "@remcovaes/web-test-runner-vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import solid from "vite-plugin-solid";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

// Same style-suppression react.vue/prop.svelte/solid plugin set as
// apps/conformance-host/vite.config.ts so framework packages load in-browser.
const normativeStylesOnly = {
  name: "conformance-normative-styles-only",
  enforce: "pre",
  transform(_code, id) {
    if (/\/packages\/react\/(?:src|dist)\/styles\.css$/.test(id)) return "";
  },
};

// Serves the built docs site (BASE_PATH=/docs output in apps/docs/dist) under
// /docs/ so the docs-parity suite can load routes in same-origin iframes.
// Registered without a mount path: connect strips the mount prefix from
// `request.url`, which would break the "/docs" check below.
const docsDist = fileURLToPath(new URL("apps/docs/dist", import.meta.url));
const docsStatic = {
  name: "docs-static",
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      } catch {
        response.writeHead(400);
        response.end("bad request");
        return;
      }
      if (!pathname.startsWith("/docs")) return next();
      let relative = pathname.slice("/docs".length);
      if (relative === "" || relative.endsWith("/")) relative += "index.html";
      const filePath = normalize(join(docsDist, relative));
      if (!filePath.startsWith(docsDist)) {
        response.writeHead(403);
        response.end("forbidden");
        return;
      }
      try {
        const content = await readFile(filePath);
        const types = {
          ".js": "text/javascript",
          ".css": "text/css",
          ".html": "text/html",
          ".svg": "image/svg+xml",
          ".json": "application/json",
          ".woff2": "font/woff2",
          ".webp": "image/webp",
        };
        response.writeHead(200, {
          "Content-Type": types[extname(filePath)] ?? "application/octet-stream",
        });
        response.end(content);
      } catch {
        response.writeHead(404);
        response.end("not found");
      }
    });
  },
};

export default {
  plugins: [
    vitePlugin({
      root: new URL(".", import.meta.url).pathname,
      plugins: [normativeStylesOnly, svelte(), solid(), docsStatic],
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
