import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

type VisualCaptureContext = {
  origin: { x: number; y: number };
  gutter?: number;
};
type DeferredVisualCapture = {
  signature: unknown;
  signatureError?: string;
  captureScreenshot: () => Promise<Buffer>;
};
type DeferredVisualComparison = {
  evidence: {
    differingPixels: number;
    signatureDifference?: unknown;
    expectedSize?: { width: number; height: number };
    actualSize?: { width: number; height: number };
    [key: string]: unknown;
  };
  screenshots: { expected: Buffer | null; actual: Buffer | null };
};
type VisualModule = {
  captureCanonicalScreenshot: (
    locator: Locator,
    options?: Record<string, unknown>,
    context?: VisualCaptureContext,
  ) => Promise<Buffer>;
  captureVisualSignature: (locator: Locator, context?: VisualCaptureContext) => Promise<unknown>;
  comparePixels: (
    expected: Buffer,
    actual: Buffer,
  ) => {
    passed: boolean;
    differingPixels: number;
    expectedSize?: { width: number; height: number };
    actualSize?: { width: number; height: number };
  };
};
type ServerModule = {
  createConformanceServer: (root: string) => Promise<{
    baseUrl: string;
    setRuntimeDocument: (html: string) => void;
    close: () => Promise<void>;
  }>;
};
type RuntimeModule = {
  compareVisualCaptures: (
    upstreamCapture: DeferredVisualCapture,
    frameworkCapture: DeferredVisualCapture,
    enabled?: boolean,
  ) => Promise<DeferredVisualComparison>;
};

const moduleUrl = (path: string) => pathToFileURL(resolve(process.cwd(), path)).href;
const importModule = new Function("specifier", "return import(specifier)") as (
  specifier: string,
) => Promise<unknown>;
const loadVisual = () =>
  importModule(moduleUrl("scripts/conformance/visual.mjs")) as Promise<VisualModule>;
const captureCanonicalScreenshot = async (locator: Locator, context?: VisualCaptureContext) =>
  (await loadVisual()).captureCanonicalScreenshot(locator, undefined, context);
const captureVisualSignature = async (locator: Locator, context?: VisualCaptureContext) =>
  (await loadVisual()).captureVisualSignature(locator, context);
const comparePixels = async (expected: Buffer, actual: Buffer) =>
  (await loadVisual()).comparePixels(expected, actual);
const createConformanceServer = async (root: string) =>
  (
    (await importModule(moduleUrl("scripts/conformance/server.mjs"))) as ServerModule
  ).createConformanceServer(root);
const compareVisualCaptures = async (
  upstreamCapture: DeferredVisualCapture,
  frameworkCapture: DeferredVisualCapture,
  enabled = true,
) =>
  (
    (await importModule(moduleUrl("scripts/conformance/runtime.mjs"))) as RuntimeModule
  ).compareVisualCaptures(upstreamCapture, frameworkCapture, enabled);

test("visual signatures ignore document origin and detect rendered style changes", async ({
  page,
}) => {
  await page.setContent(`
    <style>
      .offset { margin-left: 37.375px; margin-top: 19.625px; }
      button { display: inline-flex; align-items: center; height: 40px; padding: 0 16px; }
      .control-root { display: inline-flex; width: 160px; }
      .hidden-control {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        clip: rect(0, 0, 0, 0);
      }
    </style>
    <div><button id="expected" type="button">동일한 버튼</button></div>
    <div class="offset"><button id="actual" type="button">동일한 버튼</button></div>
    <div>
      <div id="hidden-expected" class="control-root">
        <input id="hidden-input-expected" class="hidden-control" type="checkbox">
        <label for="hidden-input-expected">동일한 체크박스</label>
      </div>
    </div>
    <div class="offset">
      <div id="hidden-actual" class="control-root">
        <input id="hidden-input-actual" class="hidden-control" type="checkbox">
        <label for="hidden-input-actual">동일한 체크박스</label>
      </div>
    </div>
  `);

  const expected = await captureVisualSignature(page.locator("#expected"));
  const actual = await captureVisualSignature(page.locator("#actual"));
  expect(actual).toEqual(expected);
  expect(await captureVisualSignature(page.locator("#hidden-actual"))).toEqual(
    await captureVisualSignature(page.locator("#hidden-expected")),
  );

  await page.locator("#actual").evaluate((element) => {
    element.style.paddingInline = "20px";
  });
  expect(await captureVisualSignature(page.locator("#actual"))).not.toEqual(expected);
});

test("runtime skips exact screenshots when visual signatures are equal", async ({ page }) => {
  await page.setContent(`
    <style>
      .sample { width: 18px; height: 18px; background: rgb(0, 94, 168); }
    </style>
    <div id="upstream" class="sample"></div>
    <div id="framework" class="sample"></div>
  `);
  const upstreamRoot = page.locator("#upstream");
  const frameworkRoot = page.locator("#framework");
  const [upstreamSignature, frameworkSignature] = await Promise.all([
    captureVisualSignature(upstreamRoot),
    captureVisualSignature(frameworkRoot),
  ]);
  let screenshotCalls = 0;

  const comparison = await compareVisualCaptures(
    {
      signature: upstreamSignature,
      captureScreenshot: async () => {
        screenshotCalls += 1;
        return captureCanonicalScreenshot(upstreamRoot);
      },
    },
    {
      signature: frameworkSignature,
      captureScreenshot: async () => {
        screenshotCalls += 1;
        return captureCanonicalScreenshot(frameworkRoot);
      },
    },
  );

  expect(screenshotCalls).toBe(0);
  expect(comparison).toEqual({
    evidence: {
      passed: true,
      differingPixels: 0,
      skipped: true,
      comparison: "dom-style",
    },
    screenshots: { expected: null, actual: null },
  });
});

test("runtime captures exactly two screenshots and records pixel evidence for unequal signatures", async ({
  page,
}) => {
  await page.setContent(`
    <style>
      .sample { width: 18px; height: 18px; }
      #upstream { background: rgb(0, 94, 168); }
      #framework { background: rgb(215, 25, 28); }
    </style>
    <div id="upstream" class="sample"></div>
    <div id="framework" class="sample"></div>
  `);
  const upstreamRoot = page.locator("#upstream");
  const frameworkRoot = page.locator("#framework");
  const [upstreamSignature, frameworkSignature] = await Promise.all([
    captureVisualSignature(upstreamRoot),
    captureVisualSignature(frameworkRoot),
  ]);
  const screenshotCalls: string[] = [];

  const comparison = await compareVisualCaptures(
    {
      signature: upstreamSignature,
      captureScreenshot: async () => {
        screenshotCalls.push("upstream");
        return captureCanonicalScreenshot(upstreamRoot);
      },
    },
    {
      signature: frameworkSignature,
      captureScreenshot: async () => {
        screenshotCalls.push("framework");
        return captureCanonicalScreenshot(frameworkRoot);
      },
    },
  );

  expect(screenshotCalls).toEqual(["upstream", "framework"]);
  expect(comparison.evidence).toMatchObject({ passed: false });
  expect(comparison.evidence.expectedSize).toEqual(comparison.evidence.actualSize);
  expect(comparison.evidence.expectedSize?.width).toBeGreaterThan(0);
  expect(comparison.evidence.expectedSize?.height).toBeGreaterThan(0);
  expect(comparison.evidence.differingPixels).toBeGreaterThan(0);
  expect(comparison.evidence.signatureDifference).toBeDefined();
  expect(Buffer.isBuffer(comparison.screenshots.expected)).toBe(true);
  expect(Buffer.isBuffer(comparison.screenshots.actual)).toBe(true);
});

test("runtime contains signature failures to visual evidence and uses exact pixel fallback", async ({
  page,
}) => {
  await page.setContent(`
    <style>
      .sample { width: 18px; height: 18px; background: rgb(0, 94, 168); }
    </style>
    <div id="upstream" class="sample"></div>
    <div id="framework" class="sample"></div>
  `);
  const upstreamRoot = page.locator("#upstream");
  const frameworkRoot = page.locator("#framework");
  const frameworkSignature = await captureVisualSignature(frameworkRoot);
  let screenshotCalls = 0;

  const comparison = await compareVisualCaptures(
    {
      signature: null,
      signatureError: "signature capture failed",
      captureScreenshot: async () => {
        screenshotCalls += 1;
        return captureCanonicalScreenshot(upstreamRoot);
      },
    },
    {
      signature: frameworkSignature,
      captureScreenshot: async () => {
        screenshotCalls += 1;
        return captureCanonicalScreenshot(frameworkRoot);
      },
    },
  );

  expect(screenshotCalls).toBe(2);
  expect(comparison.evidence).toMatchObject({
    passed: true,
    differingPixels: 0,
    comparison: "pixel-fallback",
    signatureErrors: ["upstream visual signature: signature capture failed"],
  });
  expect(comparison.evidence.expectedSize).toEqual(comparison.evidence.actualSize);
  expect(comparison.evidence.expectedSize?.width).toBeGreaterThan(0);
  expect(comparison.evidence.expectedSize?.height).toBeGreaterThan(0);
  expect(comparison.evidence).not.toHaveProperty("captureScreenshot");
  expect(comparison.evidence).not.toHaveProperty("locator");
  expect(JSON.parse(JSON.stringify(comparison.evidence))).toEqual(comparison.evidence);
});

test("canonical screenshots do not make static roots contain absolute descendants", async ({
  page,
}) => {
  await page.setContent(`
    <style>
      html, body { margin: 0; }
      .frame { position: relative; width: 64px; height: 40px; }
      .root { width: 32px; height: 32px; margin-left: 20.25px; background: #005ea8; }
      .absolute {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        background: #d7191c;
      }
    </style>
    <div class="frame">
      <div id="with-absolute" class="root"><span class="absolute"></span></div>
    </div>
    <div class="frame">
      <div id="without-absolute" class="root"></div>
    </div>
  `);

  const withAbsolute = await captureCanonicalScreenshot(page.locator("#with-absolute"));
  const withoutAbsolute = await captureCanonicalScreenshot(page.locator("#without-absolute"));
  expect(await comparePixels(withAbsolute, withoutAbsolute)).toMatchObject({
    passed: true,
    differingPixels: 0,
  });
});

test("canonical capture aligns equal-size roots from different layout origins transactionally", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 240 });
  const sample = `
    <style>
      html, body { margin: 0; }
      .sample {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: 135.671875px;
        height: 34.5px;
        color: #1d1d1d;
        font: 16px/1.5 Arial, sans-serif;
      }
      .sample::before {
        content: "";
        box-sizing: border-box;
        width: 24.5px;
        height: 24.5px;
        border: 2px solid #555;
        border-radius: 50%;
      }
    </style>
    <label id="root" class="sample">선택 항목</label>
  `;
  await page.setContent(`<body style="margin-left: 163.828125px">${sample}</body>`);
  const sourceRoot = page.locator("#root");
  const sourceBounds = await sourceRoot.boundingBox();
  if (!sourceBounds) throw new Error("source root bounds unavailable");
  const expected = await captureCanonicalScreenshot(sourceRoot);
  const expectedSignature = await captureVisualSignature(sourceRoot);

  await page.setContent(`<body style="margin: 0">${sample}</body>`);
  const frameworkRoot = page.locator("#root");
  const beforeBounds = await frameworkRoot.boundingBox();
  const beforeStyle = await page.locator("body").getAttribute("style");
  if (!beforeBounds) throw new Error("framework root bounds unavailable");
  expect(beforeBounds.x).toBe(0);

  const context = { origin: { x: sourceBounds.x, y: sourceBounds.y } };
  const actualSignature = await captureVisualSignature(frameworkRoot, context);
  const actual = await captureCanonicalScreenshot(frameworkRoot, context);
  const afterBounds = await frameworkRoot.boundingBox();

  expect(actualSignature).toEqual(expectedSignature);
  expect(await comparePixels(expected, actual)).toMatchObject({
    passed: true,
    differingPixels: 0,
    expectedSize: { width: 136, height: 35 },
    actualSize: { width: 136, height: 35 },
  });
  expect(afterBounds).toEqual(beforeBounds);
  expect(await page.locator("body").getAttribute("style")).toBe(beforeStyle);
});

test("canonical capture gives full-viewport focus paint an external gutter without resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 240 });
  const sample = `
    <style>
      html, body { margin: 0; }
      #root { position: fixed; inset: 0 auto auto 0; width: 1280px; height: 96px; }
      button {
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        border: 1px solid #555;
        border-radius: 16px;
        background: white;
      }
      button:focus {
        outline: 2px solid #fff;
        outline-offset: 0;
        box-shadow: 0 0 0 4px #256ef4;
      }
    </style>
    <div id="root"><button type="button">전체 너비 버튼</button></div>
  `;
  const baseline = `<body style="margin: 0; width: 1280px">${sample}</body>`;
  const context = { origin: { x: 4, y: 0 }, gutter: 4 };

  await page.setContent(baseline);
  await page.locator("button").focus();
  const expectedRoot = page.locator("#root");
  const expectedBeforeBounds = await expectedRoot.boundingBox();
  const expectedBeforeStyle = await page.locator("body").getAttribute("style");
  const expectedRootStyle = await expectedRoot.getAttribute("style");
  if (!expectedBeforeBounds) throw new Error("expected root bounds unavailable");
  const expected = await captureCanonicalScreenshot(expectedRoot, context);
  expect(await expectedRoot.boundingBox()).toEqual(expectedBeforeBounds);
  expect(await page.locator("body").getAttribute("style")).toBe(expectedBeforeStyle);
  expect(await expectedRoot.getAttribute("style")).toBe(expectedRootStyle);

  await page.setContent(baseline);
  await page.locator("button").focus();
  const actualRoot = page.locator("#root");
  const actualBeforeBounds = await actualRoot.boundingBox();
  const actualBeforeStyle = await page.locator("body").getAttribute("style");
  const actualRootStyle = await actualRoot.getAttribute("style");
  if (!actualBeforeBounds) throw new Error("actual root bounds unavailable");
  const actual = await captureCanonicalScreenshot(actualRoot, context);

  expect(await comparePixels(expected, actual)).toMatchObject({
    passed: true,
    differingPixels: 0,
    expectedSize: { width: 1288, height: 96 },
    actualSize: { width: 1288, height: 96 },
  });
  expect(await actualRoot.boundingBox()).toEqual(actualBeforeBounds);
  expect(await page.locator("body").getAttribute("style")).toBe(actualBeforeStyle);
  expect(await actualRoot.getAttribute("style")).toBe(actualRootStyle);
});

test("visual signatures compare equivalent SVG assets by rendered content", async ({ page }) => {
  const compact = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path fill="black" d="M0 0h8v8H0z"/></svg>',
  );
  const formatted = encodeURIComponent(`
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h8v8H0z" fill="black"></path>
    </svg>
  `);
  await page.setContent(`
    <style>
      .icon::before {
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        background: black;
      }
      #expected::before { mask-image: url("data:image/svg+xml,${compact}"); }
      #actual::before { mask-image: url("data:image/svg+xml,${formatted}"); }
    </style>
    <span id="expected" class="icon"></span>
    <span id="actual" class="icon"></span>
  `);

  expect(await captureVisualSignature(page.locator("#actual"))).toEqual(
    await captureVisualSignature(page.locator("#expected")),
  );
});

test("visual signatures distinguish same-size images with different painted content", async ({
  page,
}) => {
  const red = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><path fill="red" d="M0 0h8v8H0z"/></svg>',
  );
  const blue = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><path fill="blue" d="M0 0h8v8H0z"/></svg>',
  );
  await page.setContent(`
    <img id="expected" width="8" height="8" src="data:image/svg+xml,${red}" alt="">
    <img id="actual" width="8" height="8" src="data:image/svg+xml,${blue}" alt="">
  `);
  await Promise.all([
    page.locator("#expected").evaluate((element) => (element as HTMLImageElement).decode()),
    page.locator("#actual").evaluate((element) => (element as HTMLImageElement).decode()),
  ]);

  expect(await captureVisualSignature(page.locator("#actual"))).not.toEqual(
    await captureVisualSignature(page.locator("#expected")),
  );
});

test("visual signatures preserve SVG sprite fragment identity", async ({ page }) => {
  const compact = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon-a" viewBox="0 0 8 8"><path d="M0 0h8v8H0z"/></symbol><symbol id="icon-b" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></symbol></svg>',
  );
  const formatted = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol viewBox="0 0 8 8" id="icon-a">
        <path d="M0 0h8v8H0z"></path>
      </symbol>
      <symbol viewBox="0 0 8 8" id="icon-b">
        <circle r="4" cy="4" cx="4"></circle>
      </symbol>
    </svg>
  `);
  await page.setContent(`
    <style>
      .icon::before {
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        background: black;
      }
      #expected::before {
        mask-image: url("data:image/svg+xml,${compact}#icon-a");
      }
      #equivalent::before {
        mask-image: url("data:image/svg+xml,${formatted}#icon-a");
      }
      #actual::before {
        mask-image: url("data:image/svg+xml,${formatted}#icon-b");
      }
    </style>
    <span id="expected" class="icon"></span>
    <span id="equivalent" class="icon"></span>
    <span id="actual" class="icon"></span>
  `);

  const expected = await captureVisualSignature(page.locator("#expected"));
  expect(await captureVisualSignature(page.locator("#equivalent"))).toEqual(expected);
  expect(await captureVisualSignature(page.locator("#actual"))).not.toEqual(expected);
});

test("upstream runtime documents re-run DOMContentLoaded initialization", async ({ page }) => {
  const server = await createConformanceServer(process.cwd());
  try {
    const initializedDocument = (value: string) => `
      <!doctype html>
      <html><body>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            document.body.dataset.initialized = '${value}';
          });
        </script>
      </body></html>
    `;

    server.setRuntimeDocument(initializedDocument("first"));
    await page.goto(`${server.baseUrl}/__upstream-runtime`);
    await expect(page.locator("body")).toHaveAttribute("data-initialized", "first");

    server.setRuntimeDocument(initializedDocument("second"));
    await page.goto(`${server.baseUrl}/__upstream-runtime`);
    await expect(page.locator("body")).toHaveAttribute("data-initialized", "second");
  } finally {
    await server.close();
  }
});
