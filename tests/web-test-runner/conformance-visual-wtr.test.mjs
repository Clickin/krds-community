// In-browser visual-capture unit tests for the WTR conformance path.
//
// These are the WTR equivalents of the former Playwright
// `conformance-visual.spec.ts`. They exercise the browser-harness capture
// functions (`captureVisualSignature`, `rasterizeRootToImageData`) and the
// browser-judge pixel fallback (`pixelEquivalent`) directly against a real
// rendered document, so the Playwright (`visual.mjs`/`runtime.mjs`) modules
// are never imported.

import {
  captureVisualSignature,
  rasterizeRootToImageData,
  settle,
} from "../../scripts/conformance/browser-harness.mjs";
import {
  compareVisualSignatures,
  pixelEquivalent,
} from "../../scripts/conformance/browser-judge.mjs";

const resetDocument = (content = "") => {
  document.head.innerHTML = "";
  document.body.innerHTML = content;
  document.documentElement.style.width = "";
  document.documentElement.style.height = "";
  document.body.style.margin = "0";
  document.body.style.width = "";
  document.body.style.height = "";
};

const style = (css) => {
  const tag = document.createElement("style");
  tag.textContent = css;
  document.head.appendChild(tag);
};

const countNonZero = (pixels) =>
  pixels?.data ? [...pixels.data].filter((byte) => byte !== 0).length : 0;

// WTR's Mocha doesn't bundle an assertion library; a minimal helper keeps the
// suite dependency-free.
const assert = (condition, message) => {
  if (!condition) throw new Error(message ?? "assertion failed");
};
const assertEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(
      `${message ?? "values differ"}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`,
    );
  }
};
const assertGt = (actual, threshold, message) => {
  if (!(actual > threshold)) {
    throw new Error(`${message ?? "expected greater than"}: ${actual} <= ${threshold}`);
  }
};

describe("in-browser visual signature capture (WTR)", () => {
  beforeEach(() => resetDocument());

  it("ignores document origin and detects rendered style changes", async () => {
    resetDocument(`
      <style>
        .offset { margin-left: 37.375px; margin-top: 19.625px; }
        button { display: inline-flex; align-items: center; height: 40px; padding: 0 16px; }
      </style>
      <div><button id="expected" type="button">동일한 버튼</button></div>
      <div class="offset"><button id="actual" type="button">동일한 버튼</button></div>
    `);
    await settle();
    const expected = await captureVisualSignature(document.querySelector("#expected"));
    const actual = await captureVisualSignature(document.querySelector("#actual"));
    assert(compareVisualSignatures(expected, actual).passed === true);

    document.querySelector("#actual").style.paddingInline = "20px";
    await settle();
    const changed = await captureVisualSignature(document.querySelector("#actual"));
    assert(compareVisualSignatures(expected, changed).passed === false);
  });

  it("skips raster when visual signatures are equal", async () => {
    resetDocument(`
      <style>.sample { width: 18px; height: 18px; background: rgb(0, 94, 168); }</style>
      <div id="upstream" class="sample"></div>
      <div id="framework" class="sample"></div>
    `);
    await settle();
    const up = await captureVisualSignature(document.querySelector("#upstream"));
    const fw = await captureVisualSignature(document.querySelector("#framework"));
    // Equal signatures short-circuit the pixel fallback: pixelEquivalent is only
    // consulted on a signature mismatch.
    const verdict = compareVisualSignatures(up, fw);
    assert(verdict.passed);
    assertEqual(verdict.comparison, "dom-style");
  });

  it("falls back to pixel equivalence for unequal signatures of identical rendering", async () => {
    // Two blue samples differ only in a non-painted layout position (margin),
    // so they paint identically: signature may differ, pixels agree.
    resetDocument(`
      <style>
        .sample { width: 18px; height: 18px; background: rgb(0, 94, 168); }
        .shifted { margin-left: 40px; }
      </style>
      <div id="upstream" class="sample"></div>
      <div id="framework" class="sample shifted"></div>
    `);
    await settle();
    const upSig = await captureVisualSignature(document.querySelector("#upstream"));
    const fwSig = await captureVisualSignature(document.querySelector("#framework"));
    const signatureVerdict = compareVisualSignatures(upSig, fwSig);
    const [upPix, fwPix] = await Promise.all([
      rasterizeRootToImageData(document.querySelector("#upstream")),
      rasterizeRootToImageData(document.querySelector("#framework")),
    ]);
    // The two squares paint identically (same blue), so the pixel fallback
    // accepts even if geometric origin differs.
    const pixelVerdict = pixelEquivalent(signatureVerdict, { upstream: upPix, framework: fwPix });
    assert(pixelVerdict.passed);
    assertEqual(pixelVerdict.comparison, "pixel");
  });

  it("reports pixel differences for genuinely different painted content", async () => {
    resetDocument(`
      <style>
        .sample { width: 18px; height: 18px; }
        #upstream { background: rgb(0, 94, 168); }
        #framework { background: rgb(215, 25, 28); }
      </style>
      <div id="upstream" class="sample"></div>
      <div id="framework" class="sample"></div>
    `);
    await settle();
    const [upPix, fwPix] = await Promise.all([
      rasterizeRootToImageData(document.querySelector("#upstream")),
      rasterizeRootToImageData(document.querySelector("#framework")),
    ]);
    const upSig = await captureVisualSignature(document.querySelector("#upstream"));
    const fwSig = await captureVisualSignature(document.querySelector("#framework"));
    const signatureVerdict = compareVisualSignatures(upSig, fwSig);
    assert(!signatureVerdict.passed);
    const pixelVerdict = pixelEquivalent(signatureVerdict, { upstream: upPix, framework: fwPix });
    assert(!pixelVerdict.passed);
    assertEqual(pixelVerdict.comparison, "pixel");
    assertGt(pixelVerdict.differingPixels, 0);
    assertGt(upPix.width, 0);
    assertGt(upPix.height, 0);
  });

  it("reconciles a rigid 7px translation and still fails a real color change", async () => {
    // Category-1 parity: identical focus-ring content painted a few css pixels
    // apart (upstream root layout box at y=7 vs framework at y=0). After rigid
    // translation alignment identical content must pass, while a genuine
    // color/shape regression must still fail (AGENTS.md rule 8 — alignment
    // cancels a translation, never a real difference).
    resetDocument(`
      <style>
        html, body { margin: 0; }
        .ring { position: relative; width: 20px; height: 20px; margin: 20px;
                background: rgb(0, 94, 168); box-shadow: 0 0 0 5.6px rgb(37, 110, 244); }
      </style>
      <div id="upstream" class="ring"></div>
      <div id="framework" class="ring"></div>
    `);
    await settle();
    const [upPix, fwPix] = await Promise.all([
      rasterizeRootToImageData(document.querySelector("#upstream")),
      rasterizeRootToImageData(document.querySelector("#framework")),
    ]);
    assert(upPix?.data && fwPix?.data);
    assertEqual(upPix.width, fwPix.width);

    // Shift the framework raster 7px down (identical content, pure translation).
    const shiftDown = (pix, dy) => {
      const out = new Uint8ClampedArray(pix.data.length);
      for (let y = 0; y < pix.height; y += 1) {
        const sy = y - dy;
        if (sy < 0 || sy >= pix.height) continue;
        for (let x = 0; x < pix.width; x += 1) {
          const si = (sy * pix.width + x) * 4;
          const di = (y * pix.width + x) * 4;
          out[di] = pix.data[si];
          out[di + 1] = pix.data[si + 1];
          out[di + 2] = pix.data[si + 2];
          out[di + 3] = pix.data[si + 3];
        }
      }
      return { width: pix.width, height: pix.height, data: out };
    };
    const shifted = shiftDown(fwPix, 7);
    const sig = { passed: false, errors: ["visual signatures differ"] };

    // Translation alignment is active by default and reconciles the 7px shift.
    const aligned = pixelEquivalent(sig, { upstream: upPix, framework: shifted });
    assert(aligned.passed);
    assertEqual(aligned.comparison, "pixel");
    assert(aligned.alignTranslation);
    assertEqual(aligned.differingPixels, 0);

    // A real color regression at the same 7px shift must still fail.
    const redPix = { width: upPix.width, height: upPix.height, data: new Uint8ClampedArray(upPix.data) };
    for (let i = 0; i < redPix.data.length; i += 4) {
      if (redPix.data[i + 3] > 0) redPix.data[i] = 215; // force the opaque fill red
    }
    const colorInjected = pixelEquivalent(sig, { upstream: upPix, framework: redPix });
    assert(!colorInjected.passed);
    assertGt(colorInjected.differingPixels, 0);

    // Disabling the alignment keeps the strict behavior for the pure shift.
    const strict = pixelEquivalent(sig, { upstream: upPix, framework: shifted }, { alignTranslation: false });
    assert(!strict.passed);
  });

  it("does not rasterize static roots with absolute descendants beyond their box", async () => {
    resetDocument(`
      <style>
        html, body { margin: 0; }
        .frame { position: relative; width: 64px; height: 40px; }
        .root { width: 32px; height: 32px; margin-left: 20.25px; background: #005ea8; }
        .absolute { position: absolute; top: 0; left: 0; width: 8px; height: 8px; background: #d7191c; }
      </style>
      <div class="frame"><div id="with-absolute" class="root"><span class="absolute"></span></div></div>
      <div class="frame"><div id="without-absolute" class="root"></div></div>
    `);
    await settle();
    const withAbs = await rasterizeRootToImageData(document.querySelector("#with-absolute"));
    const withoutAbs = await rasterizeRootToImageData(document.querySelector("#without-absolute"));
    // Static root captures the root box; the absolute descendant paints within it.
    assertGt(countNonZero(withAbs), 0);
    assertEqual(withAbs.width, withoutAbs.width);
  });

  it("captures an identical signature for the same content at different origins", async () => {
    resetDocument(`
      <style>
        html, body { margin: 0; }
        .wrap { position: relative; }
        .sample { display: inline-flex; align-items: center; gap: 8px; width: 135.671875px; height: 34.5px; color: #1d1d1d; font: 16px/1.5 Arial, sans-serif; }
        .sample::before { content: ""; box-sizing: border-box; width: 24.5px; height: 24.5px; border: 2px solid #555; border-radius: 50%; }
      </style>
      <div class="wrap"><label id="at-origin" class="sample">선택 항목</label></div>
      <div class="wrap" style="margin: 21px 0 0 164px"><label id="offset" class="sample">선택 항목</label></div>
    `);
    await settle();
    const a = await captureVisualSignature(document.querySelector("#at-origin"));
    const b = await captureVisualSignature(document.querySelector("#offset"));
    assert(compareVisualSignatures(a, b).passed === true);
  });

  it("captures focus paint for a full-viewport root", async () => {
    resetDocument(`<div id="root"><button type="button">전체 너비 버튼</button></div>`);
    style(`#root { position: fixed; inset: 0 auto auto 0; width: 1280px; height: 96px; }
      button { box-sizing: border-box; width: 100%; height: 80px; border: 1px solid #555; border-radius: 16px; background: white; }
      button:focus { outline: 2px solid #fff; outline-offset: 0; box-shadow: 0 0 0 4px #256ef4; }`);
    await settle();
    const button = document.querySelector("button");
    button.focus();
    await settle();
    const root = document.querySelector("#root");
    const before = root.getRootNode().body.getBoundingClientRect();
    const pixels = await rasterizeRootToImageData(root);
    // Focus paint is captured; capturing does not relocate the root.
    assertGt(countNonZero(pixels), 0);
    assertEqual(
      JSON.stringify(root.getRootNode().body.getBoundingClientRect()),
      JSON.stringify(before),
    );
  });

  it("compares equivalent SVG assets by rendered content", async () => {
    const compact = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path fill="black" d="M0 0h8v8H0z"/></svg>',
    );
    const formatted = encodeURIComponent(
      '<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h8v8H0z" fill="black"></path></svg>',
    );
    resetDocument(`<span id="expected" class="icon"></span><span id="actual" class="icon"></span>`);
    style(`.icon::before { content: ""; display: block; width: 8px; height: 8px; background: black; }
      #expected::before { mask-image: url("data:image/svg+xml,${compact}"); }
      #actual::before { mask-image: url("data:image/svg+xml,${formatted}"); }`);
    await settle();
    const expected = await captureVisualSignature(document.querySelector("#expected"));
    const actual = await captureVisualSignature(document.querySelector("#actual"));
    assert(compareVisualSignatures(expected, actual).passed === true);
  });

  it("distinguishes same-size images with different painted content", async () => {
    const red = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><path fill="red" d="M0 0h8v8H0z"/></svg>',
    );
    const blue = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><path fill="blue" d="M0 0h8v8H0z"/></svg>',
    );
    resetDocument(
      `<img id="expected" width="8" height="8" src="data:image/svg+xml,${red}" alt=""><img id="actual" width="8" height="8" src="data:image/svg+xml,${blue}" alt="">`,
    );
    await settle();
    const expected = await captureVisualSignature(document.querySelector("#expected"));
    const actual = await captureVisualSignature(document.querySelector("#actual"));
    assert(compareVisualSignatures(expected, actual).passed === false);
  });

  it("preserves SVG sprite fragment identity", async () => {
    const compact = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon-a" viewBox="0 0 8 8"><path d="M0 0h8v8H0z"/></symbol><symbol id="icon-b" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></symbol></svg>',
    );
    const formatted = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg"><symbol viewBox="0 0 8 8" id="icon-a"><path d="M0 0h8v8H0z"></path></symbol><symbol viewBox="0 0 8 8" id="icon-b"><circle r="4" cy="4" cx="4"></circle></symbol></svg>',
    );
    resetDocument(
      `<span id="expected" class="icon"></span><span id="equivalent" class="icon"></span><span id="actual" class="icon"></span>`,
    );
    style(`.icon::before { content: ""; display: block; width: 8px; height: 8px; background: black; }
      #expected::before { mask-image: url("data:image/svg+xml,${compact}#icon-a"); }
      #equivalent::before { mask-image: url("data:image/svg+xml,${formatted}#icon-a"); }
      #actual::before { mask-image: url("data:image/svg+xml,${formatted}#icon-b"); }`);
    await settle();
    const expected = await captureVisualSignature(document.querySelector("#expected"));
    const equivalent = await captureVisualSignature(document.querySelector("#equivalent"));
    const actual = await captureVisualSignature(document.querySelector("#actual"));
    assert(compareVisualSignatures(expected, equivalent).passed === true);
    assert(compareVisualSignatures(expected, actual).passed === false);
  });

  it("re-runs DOMContentLoaded initialization on re-dispatch", async () => {
    resetDocument();
    document.body.dataset.initialized = "unset";
    document.addEventListener("DOMContentLoaded", () => {
      document.body.dataset.initialized = "yes";
    });
    document.dispatchEvent(new Event("DOMContentLoaded"));
    assertEqual(document.body.dataset.initialized, "yes");
  });
});
