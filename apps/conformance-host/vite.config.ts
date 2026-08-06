import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import solid from "vite-plugin-solid";
import { defineConfig, type PluginOption, type ViteDevServer } from "vite";

const normativeStylesOnly = {
  name: "conformance-normative-styles-only",
  enforce: "pre" as const,
  transform(_code: string, id: string) {
    if (/\/packages\/react\/(?:src|dist)\/styles\.css$/.test(id)) return "";
  },
};
const pages = ["react", "vue", "svelte", "solid", "angular"] as const;
const repositoryRoot = resolve(import.meta.dirname, "../..");

/** Dev-only middleware: rewrite repo-root asset paths (/upstream, /packages,
 * /scripts) that live outside the host's own root, so the side-by-side compare
 * viewer can load the upstream fixture HTML and shared styles. */
const rootAssetServe = (): PluginOption => ({
  name: "conformance-host-root-assets",
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      async (
        req: import("node:http").IncomingMessage,
        res: import("node:http").ServerResponse,
        next: (err?: unknown) => void,
      ) => {
        const url = req.url ?? "";
        const targets = ["/upstream/", "/packages/", "/scripts/", "/apps/"];
        if (!targets.some((t) => url.startsWith(t))) return next();
        const { existsSync, createReadStream } = await import("node:fs");
        const file = resolve(repositoryRoot, url.replace(/^\/+/, ""));
        if (!existsSync(file)) return next();
        res.setHeader("Content-Type", contentTypeFor(url));
        const { pipeline } = await import("node:stream/promises");
        try {
          await pipeline(createReadStream(file), res);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ERR_STREAM_PREMATURE_CLOSE") {
            next(error as Error);
          }
        }
      },
    );
  },
});

function contentTypeFor(url: string): string {
  if (url.endsWith(".css")) return "text/css; charset=utf-8";
  if (url.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (url.endsWith(".json")) return "application/json; charset=utf-8";
  if (url.endsWith(".html")) return "text/html; charset=utf-8";
  return "application/octet-stream";
}

export default defineConfig({
  base: process.env.KRDS_CONFORMANCE_HOST_BASE ?? "/host/",
  plugins: [normativeStylesOnly, svelte(), solid(), rootAssetServe()],
  server: {
    fs: { allow: [import.meta.dirname, repositoryRoot] },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        ...Object.fromEntries(
          pages.map((framework) => [framework, resolve(import.meta.dirname, `${framework}.html`)]),
        ),
        compare: resolve(import.meta.dirname, "compare.html"),
      },
    },
  },
});
