import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const immutableExtensions = new Set([".css", ".js", ".mjs", ".svg", ".woff", ".woff2"]);

export const createConformanceServer = async (repositoryRoot) => {
  const hostRoot = resolve(repositoryRoot, "apps/conformance-host/dist");
  let runtimeDocument;
  const roots = [
    { prefix: "/host/", directory: hostRoot },
    { prefix: "/", directory: resolve(repositoryRoot) },
  ];
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    if (pathname === "/__upstream-runtime") {
      if (runtimeDocument === undefined) {
        response.writeHead(404).end("Not Found");
        return;
      }
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes[".html"],
      });
      response.end(runtimeDocument);
      return;
    }
    const mapping = roots.find(({ prefix }) => pathname.startsWith(prefix));
    if (!mapping) {
      response.writeHead(404).end("Not Found");
      return;
    }
    const relativePath = normalize(pathname.slice(mapping.prefix.length)).replace(
      /^(\.\.[/\\])+/,
      "",
    );
    const candidate = resolve(join(mapping.directory, relativePath || "index.html"));
    if (!candidate.startsWith(mapping.directory)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    try {
      const entry = await stat(candidate);
      const filePath = entry.isDirectory() ? join(candidate, "index.html") : candidate;
      const extension = extname(filePath);
      const content = await readFile(filePath);
      response.writeHead(200, {
        "Cache-Control": immutableExtensions.has(extension)
          ? "public, max-age=31536000, immutable"
          : "no-store",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      });
      response.end(content);
    } catch {
      response.writeHead(404).end("Not Found");
    }
  });
  await new Promise((resolvePromise) => server.listen(0, "127.0.0.1", resolvePromise));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Conformance server failed to bind");
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    setRuntimeDocument: (html) => {
      runtimeDocument = html;
    },
    close: () =>
      new Promise((resolvePromise, reject) =>
        server.close((error) => (error ? reject(error) : resolvePromise())),
      ),
  };
};
