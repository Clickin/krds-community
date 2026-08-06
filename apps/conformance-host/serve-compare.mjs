// Minimal static server for the side-by-side conformance comparison viewer.
//
// Serves the built conformance host at /host/** (apps/conformance-host/dist)
// and the shared/upstream assets at the repo root (/packages, /upstream,
// /scripts, /apps) so compare.html can load the KRDS stylesheet, krds.min.js,
// and upstream fixture HTML. Run: node apps/conformance-host/serve-compare.mjs
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const hostDist = resolve(repoRoot, "apps/conformance-host/dist");
const port = Number(process.env.PORT ?? 5174);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const contentType = (url) => mime[extname(url).toLowerCase()] ?? "application/octet-stream";

const send = (res, file, status = 200) => {
  const stream = createReadStream(file);
  res.writeHead(status, {
    "Content-Type": contentType(file),
    "Cache-Control": "no-store",
  });
  stream.pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  // /host/** -> built host dist (base is /host/)
  let candidate;
  if (pathname === "/host/" || pathname === "/host") {
    candidate = join(hostDist, "react.html");
  } else if (pathname.startsWith("/host/")) {
    candidate = resolve(hostDist, pathname.slice("/host/".length));
  } else {
    candidate = resolve(repoRoot, pathname.replace(/^\/+/, ""));
  }
  const safe = normalize(candidate);
  const docRoot = pathname.startsWith("/host/") ? hostDist : repoRoot;
  if (!safe.startsWith(docRoot)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  if (existsSync(safe) && statSync(safe).isFile()) {
    return send(res, safe);
  }
  if (existsSync(safe)) {
    return send(res, join(safe, "index.html"));
  }
  res.writeHead(404).end("not found");
}).listen(port, () => {
  console.log(`compare viewer: http://localhost:${port}/host/compare.html`);
  console.log(`example: http://localhost:${port}/host/compare.html?framework=react&fixture=button-icon.default`);
});
