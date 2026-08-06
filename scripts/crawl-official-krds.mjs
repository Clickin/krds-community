import { mkdir, writeFile, stat, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { JSDOM } from "jsdom";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = join(ROOT_DIR, "audit-input", "krds-official-html");

const SEED_CONFIGS = [
  {
    section: "root",
    url: "https://www.krds.go.kr/html/site/index.html",
    defaultFile: "index.html",
  },
  {
    section: "guide",
    url: "https://www.krds.go.kr/html/site/style/style_01.html",
    defaultFile: "style_01.html",
  },
  {
    section: "components",
    url: "https://www.krds.go.kr/html/site/component/component_summary.html",
    defaultFile: "component_summary.html",
  },
  {
    section: "service-patterns",
    url: "https://www.krds.go.kr/html/site/service/service_summary.html",
    defaultFile: "service_summary.html",
  },
  {
    section: "basic-patterns",
    url: "https://www.krds.go.kr/html/site/global/global_summary.html",
    defaultFile: "global_summary.html",
  },
];

function sanitizeFilename(name) {
  return name.replace(/[?#].*$/, "").replace(/[^a-zA-Z0-9_.-]/g, "_");
}

function isAssetUrl(urlString) {
  if (!urlString) return false;
  if (urlString.includes("google-analytics.com") || urlString.includes("googletagmanager.com"))
    return false;
  if (
    urlString.includes("github.com") ||
    urlString.includes("naver.com") ||
    urlString.includes("mois.go.kr")
  ) {
    // Only capture static media/font/css/js from external domains
    return /\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|otf|pdf|mp4)$/i.test(
      urlString.split("?")[0],
    );
  }
  return true;
}

function urlToLocalAssetPath(urlString) {
  try {
    const parsed = new URL(urlString);
    let pathname = decodeURIComponent(parsed.pathname);

    let filename = sanitizeFilename(pathname.split("/").pop() || "asset");
    if (!filename.includes(".")) {
      filename += ".asset";
    }
    const pathParts = pathname.split("/").slice(0, -1).filter(Boolean);

    if (parsed.hostname === "www.krds.go.kr") {
      if (pathParts[0] === "resources") {
        return ["assets", "resources", ...pathParts.slice(1), filename].join("/");
      } else {
        return ["assets", "site", ...pathParts, filename].join("/");
      }
    } else {
      return ["assets", "external", parsed.hostname, ...pathParts, filename].join("/");
    }
  } catch {
    const safeName = sanitizeFilename(urlString.slice(-30));
    return `assets/misc/${safeName}`;
  }
}

function urlToLocalPagePath(urlString) {
  try {
    const parsed = new URL(urlString);
    const pathname = parsed.pathname;
    const filename = pathname.split("/").pop();

    if (pathname.endsWith("/index.html")) {
      return "index.html";
    } else if (pathname.includes("/style/")) {
      return `guide/${filename}`;
    } else if (pathname.includes("/component/")) {
      return `components/${filename}`;
    } else if (pathname.includes("/service/")) {
      return `service-patterns/${filename}`;
    } else if (pathname.includes("/global/")) {
      return `basic-patterns/${filename}`;
    }
  } catch {}
  return null;
}

function getRelativePath(fromPath, toPath) {
  const fromDir = dirname(fromPath);
  let rel = relative(fromDir, toPath);
  if (!rel.startsWith(".")) {
    rel = "./" + rel;
  }
  return rel;
}

async function safeMkdirAndWrite(fullPath, content) {
  const dir = dirname(fullPath);
  // Ensure ancestor path segments aren't existing files
  const parts = dir.split("/");
  let current = "";
  for (const part of parts) {
    if (!part) continue;
    current += "/" + part;
    try {
      const s = await stat(current);
      if (s.isFile()) {
        // If an intermediate segment is a file, remove it or append .dir
        await rm(current);
        await mkdir(current, { recursive: true });
      }
    } catch {}
  }

  await mkdir(dir, { recursive: true });
  await writeFile(fullPath, content);
}

async function main() {
  console.log("Starting KRDS official HTML crawler...");
  await mkdir(join(OUTPUT_DIR, "guide"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "components"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "service-patterns"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "basic-patterns"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "assets"), { recursive: true });

  const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  const pageMap = new Map(); // originalUrl -> { section, localPath, title, status, rawHtml }
  const assetMap = new Map(); // originalUrl -> { localPath, buffer, mimeType, sizeBytes, status }

  // Step 1: Discover all target pages from seed URLs
  console.log("--- Step 1: Discovering pages ---");
  for (const seed of SEED_CONFIGS) {
    console.log(`Loading seed page [${seed.section}]: ${seed.url}`);
    await page.goto(seed.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const localPath = urlToLocalPagePath(seed.url);
    if (localPath && !pageMap.has(seed.url)) {
      pageMap.set(seed.url, { section: seed.section, localPath, status: 200 });
    }

    const navHrefs = await page.$$eval("#container > div.inner.in-between > nav a", (els) =>
      els.map((el) => el.href).filter(Boolean),
    );

    for (const rawHref of navHrefs) {
      const cleanUrl = rawHref.split("#")[0].split("?")[0];
      if (!cleanUrl) continue;
      const targetLocalPath = urlToLocalPagePath(cleanUrl);
      if (targetLocalPath && !pageMap.has(cleanUrl)) {
        let section = seed.section;
        if (targetLocalPath.startsWith("guide/")) section = "guide";
        else if (targetLocalPath.startsWith("components/")) section = "components";
        else if (targetLocalPath.startsWith("service-patterns/")) section = "service-patterns";
        else if (targetLocalPath.startsWith("basic-patterns/")) section = "basic-patterns";

        pageMap.set(cleanUrl, { section, localPath: targetLocalPath, status: 200 });
      }
    }
  }

  console.log(`Total target HTML pages discovered: ${pageMap.size}`);

  // Step 2: Fetch and render each page, capturing all network responses for assets
  console.log("--- Step 2: Crawling pages and capturing network assets ---");

  page.on("response", async (response) => {
    try {
      const resUrl = response.url();
      const status = response.status();
      if (status !== 200) return;

      if (!isAssetUrl(resUrl)) return;

      const parsedUrl = new URL(resUrl);
      // If it's a page in pageMap, ignore as asset
      if (pageMap.has(resUrl.split("#")[0].split("?")[0]) && parsedUrl.pathname.endsWith(".html"))
        return;

      // Check if it's an asset (CSS, JS, Image, Font, Media, SVG, etc.)
      const contentType = response.headers()["content-type"] || "";
      const isAssetType =
        contentType.includes("css") ||
        contentType.includes("javascript") ||
        contentType.includes("image") ||
        contentType.includes("font") ||
        contentType.includes("video") ||
        contentType.includes("audio") ||
        contentType.includes("pdf") ||
        /\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|otf|pdf|mp4)$/i.test(
          parsedUrl.pathname,
        );

      if (isAssetType && !assetMap.has(resUrl)) {
        try {
          const buffer = await response.body();
          const localPath = urlToLocalAssetPath(resUrl);
          assetMap.set(resUrl, {
            localPath,
            buffer,
            mimeType: contentType,
            sizeBytes: buffer.length,
            status: 200,
          });
        } catch {
          // Response body might fail if aborted or streaming
        }
      }
    } catch {
      // Ignore response errors
    }
  });

  for (const [pageUrl, pageInfo] of pageMap.entries()) {
    console.log(`Crawling [${pageInfo.section}] ${pageUrl}...`);
    try {
      const res = await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);

      pageInfo.title = await page.title();
      pageInfo.rawHtml = await page.content();
      pageInfo.status = res ? res.status() : 200;
    } catch (err) {
      console.error(`Failed to load ${pageUrl}:`, err.message);
      pageInfo.status = 500;
    }
  }

  // Step 3: Deep inspection of HTML and CSS to fetch missing assets (fonts, background images, icons)
  console.log("--- Step 3: Extracting additional assets from HTML and CSS ---");

  const assetsToFetch = new Set();

  function extractCssUrls(cssText, baseUrl) {
    const matches = [...cssText.matchAll(/url\((?:['"]?)([^'")]+)(?:['"]?)\)/g)];
    for (const match of matches) {
      let rawUrl = match[1].trim();
      if (!rawUrl || rawUrl.startsWith("data:")) continue;
      try {
        const absoluteUrl = new URL(rawUrl, baseUrl).href;
        if (isAssetUrl(absoluteUrl)) {
          assetsToFetch.add(absoluteUrl);
        }
      } catch {}
    }
  }

  // Inspect raw HTML for links/srcs
  for (const [_, pageInfo] of pageMap.entries()) {
    if (!pageInfo.rawHtml) continue;
    const dom = new JSDOM(pageInfo.rawHtml);
    const doc = dom.window.document;

    const elements = doc.querySelectorAll("[src], [href], [srcset], [poster], [data-src]");
    elements.forEach((el) => {
      ["src", "href", "poster", "data-src"].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val && !val.startsWith("#") && !val.startsWith("javascript:")) {
          try {
            const absoluteUrl = new URL(val, "https://www.krds.go.kr/html/site/").href;
            if (!pageMap.has(absoluteUrl.split("#")[0].split("?")[0]) && isAssetUrl(absoluteUrl)) {
              assetsToFetch.add(absoluteUrl);
            }
          } catch {}
        }
      });
      const srcset = el.getAttribute("srcset");
      if (srcset) {
        srcset.split(",").forEach((part) => {
          const urlCandidate = part.trim().split(/\s+/)[0];
          if (urlCandidate) {
            try {
              const absoluteUrl = new URL(urlCandidate, "https://www.krds.go.kr/html/site/").href;
              if (isAssetUrl(absoluteUrl)) {
                assetsToFetch.add(absoluteUrl);
              }
            } catch {}
          }
        });
      }
    });

    doc.querySelectorAll("style").forEach((styleEl) => {
      extractCssUrls(styleEl.textContent || "", "https://www.krds.go.kr/html/site/");
    });
  }

  console.log(`Assets identified for verification/download: ${assetsToFetch.size}`);
  for (const assetUrl of assetsToFetch) {
    if (!isAssetUrl(assetUrl)) continue;
    const cleanAssetUrl = assetUrl.split("#")[0];
    if (assetMap.has(cleanAssetUrl)) continue;

    try {
      const res = await fetch(cleanAssetUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const contentType = res.headers.get("content-type") || "";
        const localPath = urlToLocalAssetPath(cleanAssetUrl);
        assetMap.set(cleanAssetUrl, {
          localPath,
          buffer,
          mimeType: contentType,
          sizeBytes: buffer.length,
          status: 200,
        });
      }
    } catch {
      // Ignore fetch failures
    }
  }

  // Parse all CSS assets in assetMap for sub-resources
  console.log("--- Step 4: Parsing CSS files for nested font/image assets ---");
  let newCssSubAssetsFound = true;
  while (newCssSubAssetsFound) {
    newCssSubAssetsFound = false;
    const currentAssets = Array.from(assetMap.entries());

    for (const [cssUrl, assetData] of currentAssets) {
      const isCss = assetData.localPath.endsWith(".css") || assetData.mimeType.includes("css");
      if (!isCss) continue;

      const cssText = assetData.buffer.toString("utf-8");
      const matches = [...cssText.matchAll(/url\((?:['"]?)([^'")]+)(?:['"]?)\)/g)];

      for (const match of matches) {
        let subUrl = match[1].trim();
        if (!subUrl || subUrl.startsWith("data:")) continue;
        try {
          const absSubUrl = new URL(subUrl, cssUrl).href.split("#")[0];
          if (!assetMap.has(absSubUrl) && isAssetUrl(absSubUrl)) {
            const res = await fetch(absSubUrl);
            if (res.ok) {
              const arrayBuf = await res.arrayBuffer();
              const buffer = Buffer.from(arrayBuf);
              const contentType = res.headers.get("content-type") || "";
              const localPath = urlToLocalAssetPath(absSubUrl);
              assetMap.set(absSubUrl, {
                localPath,
                buffer,
                mimeType: contentType,
                sizeBytes: buffer.length,
                status: 200,
              });
              newCssSubAssetsFound = true;
            }
          }
        } catch {}
      }
    }
  }

  console.log(`Total captured assets: ${assetMap.size}`);

  // Step 5: Save assets and rewrite internal CSS url() references
  console.log("--- Step 5: Writing assets to disk ---");
  for (const [assetUrl, assetData] of assetMap.entries()) {
    const fullDiskPath = join(OUTPUT_DIR, assetData.localPath);

    if (assetData.localPath.endsWith(".css")) {
      let cssText = assetData.buffer.toString("utf-8");
      cssText = cssText.replace(/url\((?:['"]?)([^'")]+)(?:['"]?)\)/g, (match, rawUrl) => {
        if (!rawUrl || rawUrl.startsWith("data:")) return match;
        try {
          const absTarget = new URL(rawUrl, assetUrl).href.split("#")[0];
          const targetAsset = assetMap.get(absTarget);
          if (targetAsset) {
            const relFromCssToAsset = getRelativePath(assetData.localPath, targetAsset.localPath);
            return `url("${relFromCssToAsset}")`;
          }
        } catch {}
        return match;
      });
      await safeMkdirAndWrite(fullDiskPath, cssText);
    } else {
      await safeMkdirAndWrite(fullDiskPath, assetData.buffer);
    }
  }

  // Step 6: Rewrite HTML files for offline access and write to disk
  console.log("--- Step 6: Rewriting HTML files and saving to disk ---");
  for (const [pageUrl, pageInfo] of pageMap.entries()) {
    if (!pageInfo.rawHtml) continue;

    const dom = new JSDOM(pageInfo.rawHtml);
    const doc = dom.window.document;
    const pageLocalPath = pageInfo.localPath;

    const rewriteAttributeUrl = (el, attr) => {
      const val = el.getAttribute(attr);
      if (!val || val.startsWith("#") || val.startsWith("javascript:")) return;

      try {
        const absUrl = new URL(val, pageUrl).href;
        const cleanAbsUrl = absUrl.split("#")[0].split("?")[0];
        const hash = absUrl.includes("#") ? "#" + absUrl.split("#")[1] : "";

        if (pageMap.has(cleanAbsUrl)) {
          const targetPageInfo = pageMap.get(cleanAbsUrl);
          const relPath = getRelativePath(pageLocalPath, targetPageInfo.localPath);
          el.setAttribute(attr, relPath + hash);
          return;
        }

        if (assetMap.has(absUrl) || assetMap.has(cleanAbsUrl)) {
          const targetAsset = assetMap.get(absUrl) || assetMap.get(cleanAbsUrl);
          const relPath = getRelativePath(pageLocalPath, targetAsset.localPath);
          el.setAttribute(attr, relPath + hash);
          return;
        }

        if (cleanAbsUrl.startsWith("https://www.krds.go.kr/resources/")) {
          const expectedAssetLocalPath = urlToLocalAssetPath(cleanAbsUrl);
          const relPath = getRelativePath(pageLocalPath, expectedAssetLocalPath);
          el.setAttribute(attr, relPath + hash);
        }
      } catch {}
    };

    doc.querySelectorAll("a").forEach((a) => rewriteAttributeUrl(a, "href"));
    doc.querySelectorAll("link").forEach((link) => rewriteAttributeUrl(link, "href"));
    doc.querySelectorAll("script").forEach((script) => {
      if (script.getAttribute("src")) rewriteAttributeUrl(script, "src");
    });
    doc.querySelectorAll("img").forEach((img) => {
      rewriteAttributeUrl(img, "src");
      if (img.getAttribute("data-src")) rewriteAttributeUrl(img, "data-src");
    });
    doc
      .querySelectorAll("source, iframe, video, audio")
      .forEach((el) => rewriteAttributeUrl(el, "src"));

    doc.querySelectorAll("[style]").forEach((el) => {
      let styleText = el.getAttribute("style");
      if (styleText && styleText.includes("url(")) {
        styleText = styleText.replace(/url\((?:['"]?)([^'")]+)(?:['"]?)\)/g, (match, rawUrl) => {
          if (!rawUrl || rawUrl.startsWith("data:")) return match;
          try {
            const absUrl = new URL(rawUrl, pageUrl).href.split("#")[0];
            const targetAsset = assetMap.get(absUrl);
            if (targetAsset) {
              const relPath = getRelativePath(pageLocalPath, targetAsset.localPath);
              return `url("${relPath}")`;
            }
          } catch {}
          return match;
        });
        el.setAttribute("style", styleText);
      }
    });

    const rewrittenHtml = dom.serialize();
    const diskPath = join(OUTPUT_DIR, pageLocalPath);
    await safeMkdirAndWrite(diskPath, rewrittenHtml);
  }

  // Step 7: Write manifest.json
  console.log("--- Step 7: Creating manifest.json ---");
  const manifestData = {
    crawledAt: new Date().toISOString(),
    sourceUrl: "https://www.krds.go.kr/html/site/index.html",
    summary: {
      totalPages: pageMap.size,
      totalAssets: assetMap.size,
      totalAssetSizeBytes: Array.from(assetMap.values()).reduce((sum, a) => sum + a.sizeBytes, 0),
    },
    sections: {
      root: Array.from(pageMap.values()).filter((p) => p.section === "root").length,
      guide: Array.from(pageMap.values()).filter((p) => p.section === "guide").length,
      components: Array.from(pageMap.values()).filter((p) => p.section === "components").length,
      "service-patterns": Array.from(pageMap.values()).filter(
        (p) => p.section === "service-patterns",
      ).length,
      "basic-patterns": Array.from(pageMap.values()).filter((p) => p.section === "basic-patterns")
        .length,
    },
    pages: Array.from(pageMap.entries()).map(([url, data]) => ({
      originalUrl: url,
      section: data.section,
      localPath: data.localPath,
      title: data.title || "",
      status: data.status,
    })),
    assets: Array.from(assetMap.entries()).map(([url, data]) => ({
      originalUrl: url,
      localPath: data.localPath,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      status: data.status,
    })),
  };

  await writeFile(
    join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifestData, null, 2),
    "utf-8",
  );
  console.log("Crawl completed successfully!");
  console.log(`Manifest saved to ${join(OUTPUT_DIR, "manifest.json")}`);

  await browser.close();
}

main().catch((err) => {
  console.error("Crawler failed:", err);
  process.exit(1);
});
