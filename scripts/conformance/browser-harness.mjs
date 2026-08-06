// Browser-side capture harness.
//
// The capture bodies that used to run inside Playwright `locator.evaluate`
// callbacks live here as pure functions that take a `root` DOM element
// directly. The in-browser @web/test-runner conformance path imports this
// module as a plain ESM script and calls the functions directly, with no Node
// middle layer or CDP round-trip.
//
// This file must remain importable both in Node and in the browser as a
// `<script type="module">`, so it must not import any Node built-ins and must
// only touch `window`/`document` at call time.

export const settle = async () => {
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};

/**
 * Serialize the DOM under `root` into the same shape `captureDom` produced.
 * `root` must be an actual DOM element (not a locator).
 */
export const captureDomTree = async (
  root,
  { normalizationRules = [], snapshotSide = "framework" } = {},
) => {
  const generatedAttribute =
    /^(?:data-v-|data-conformance-|_ng(?:content|host)-|ng-reflect-|data-svelte)/;
  const referenceAttributes = new Set([
    "aria-controls",
    "aria-describedby",
    "aria-labelledby",
    "aria-owns",
    "for",
    "headers",
  ]);
  const booleanAttributes = new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
  ]);
  const matchesRule = (node, rule) =>
    typeof rule?.selector === "string" && node.matches(rule.selector);
  const isIgnoreElement = (rule) =>
    rule?.ignoreElement === true || rule?.operation === "ignore-element";
  const isIgnoreSubtree = (rule) =>
    rule?.ignoreSubtree === true || rule?.operation === "ignore-subtree";
  const isRewrite = (rule) =>
    rule?.operation === "rewrite" ||
    Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue");
  const rewriteValue = (rule) =>
    Object.prototype.hasOwnProperty.call(rule ?? {}, "rewriteValue")
      ? rule.rewriteValue
      : rule.value;
  const isOmission = (rule) =>
    !isRewrite(rule) &&
    !isIgnoreElement(rule) &&
    !isIgnoreSubtree(rule) &&
    (rule?.operation === "omit" ||
      (typeof rule?.attribute === "string" && typeof rule?.rule === "string"));
  const ids = new Map();
  let nextId = 0;
  // Ids whose id attribute is omitted by a normalization rule must not
  // shift the generated numbering of the remaining ids, or every shared id
  // after them would get a different token on each side.
  const omittedIdRules = normalizationRules.filter(
    (rule) => isOmission(rule) && rule.attribute === "id",
  );
  root.querySelectorAll("[id]").forEach((element) => {
    if (omittedIdRules.some((rule) => element.matches(rule.selector))) return;
    const id = element.getAttribute("id");
    if (id && !ids.has(id)) ids.set(id, `generated-${++nextId}`);
  });
  if (root instanceof Element) {
    const id = root.getAttribute("id");
    if (id && !ids.has(id)) ids.set(id, `generated-${++nextId}`);
  }
  const normalizeAttribute = (name, value) => {
    if (booleanAttributes.has(name)) return "";
    if (name === "id") return ids.get(value) ?? value;
    if (referenceAttributes.has(name)) {
      return value
        .split(/\s+/)
        .map((part) => ids.get(part) ?? part)
        .join(" ");
    }
    if (name === "href" && value.startsWith("#")) {
      return `#${ids.get(value.slice(1)) ?? value.slice(1)}`;
    }
    if (name === "class") return value.split(/\s+/).filter(Boolean).sort().join(" ");
    return value;
  };
  const serialize = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      return text ? { text } : null;
    }
    if (!(node instanceof Element) || node.matches("script, style")) return null;
    const matchingRules = normalizationRules.filter((rule) => matchesRule(node, rule));
    if (matchingRules.some(isIgnoreSubtree)) return null;
    const serializeChildren = () =>
      [...node.childNodes]
        .flatMap((child) => {
          const serialized = serialize(child);
          return Array.isArray(serialized) ? serialized : [serialized];
        })
        .filter(Boolean);
    if (matchingRules.some(isIgnoreElement)) return serializeChildren();
    const omittedAttributes = new Set(
      matchingRules.filter(isOmission).map(({ attribute }) => attribute),
    );
    const rewrites = new Map(
      matchingRules
        .filter(
          (rule) =>
            typeof rule.attribute === "string" && isRewrite(rule) && snapshotSide === "upstream",
        )
        .map((rule) => [rule.attribute, String(rewriteValue(rule))]),
    );
    const attributes = new Map(
      [...node.attributes]
        .filter(({ name }) => !generatedAttribute.test(name))
        .filter(({ name }) => !omittedAttributes.has(name) || rewrites.has(name))
        .map(({ name, value }) => [name, rewrites.get(name) ?? value]),
    );
    for (const [name, value] of rewrites) {
      if (!generatedAttribute.test(name) && !omittedAttributes.has(name)) {
        attributes.set(name, value);
      }
    }
    const serializedAttributes = [...attributes]
      .map(([name, value]) => [name, normalizeAttribute(name, value)])
      .sort(([left], [right]) => left.localeCompare(right));
    const control = node;
    const state = {};
    if ("value" in control && typeof control.value === "string") state.value = control.value;
    if ("checked" in control && typeof control.checked === "boolean") {
      state.checked = control.checked;
    }
    if ("selectedIndex" in control && typeof control.selectedIndex === "number") {
      state.selectedIndex = control.selectedIndex;
    }
    if (node instanceof HTMLDetailsElement) state.open = node.open;
    return {
      tag: node.tagName.toLocaleLowerCase("en-US"),
      attributes: serializedAttributes,
      ...(Object.keys(state).length ? { state } : {}),
      children: serializeChildren(),
    };
  };
  return serialize(root);
};

/**
 * Capture the semantics object `inspectSemantics` produced.
 */
export const captureSemantics = async (root) => {
  const element = root;
  const label = element.getAttribute("aria-label") ?? "";
  const style = getComputedStyle(element);
  const tag = element.tagName.toLocaleLowerCase("en-US");
  const isNativeFormControl = element.matches(
    "button, fieldset, input, object, optgroup, option, output, select, textarea",
  );
  const form = {};
  if (isNativeFormControl) {
    form.name = "name" in element ? String(element.name ?? "") : "";
    form.value = "value" in element ? String(element.value ?? "") : "";
    form.checked = "checked" in element ? Boolean(element.checked) : undefined;
    form.disabled = "disabled" in element ? Boolean(element.disabled) : undefined;
    form.required = "required" in element ? Boolean(element.required) : undefined;
    form.readOnly = "readOnly" in element ? Boolean(element.readOnly) : undefined;
  }
  return {
    tag,
    role: element.getAttribute("role"),
    label,
    attributes: Object.fromEntries([...element.attributes].map(({ name, value }) => [name, value])),
    computedStyle: {
      boxSizing: style.boxSizing,
      display: style.display,
      width: style.width,
      height: style.height,
      padding: style.padding,
      border: style.border,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    },
    form,
  };
};

const captureVisualSignatureTree = async (root) => {
  const rootRect = root.getBoundingClientRect();
  const round = (value) => Math.round(value * 64) / 64;
  const rectValue = (rect) => ({
    x: round(rect.x - rootRect.x),
    y: round(rect.y - rootRect.y),
    width: round(rect.width),
    height: round(rect.height),
  });
  const excludedProperties = /^(?:--|animation|transition)/;
  const excludedNames = new Set([
    "caret-color",
    "cursor",
    "pointer-events",
    "scroll-behavior",
    "touch-action",
    "user-select",
    "will-change",
  ]);
  const rootContextProperties = new Set([
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
  ]);
  const contextDependentPositionProperties = new Set([
    "bottom",
    "inset-block-end",
    "inset-block-start",
    "inset-inline-end",
    "inset-inline-start",
    "left",
    "right",
    "top",
  ]);
  const assetHashes = new Map();
  const unmodeledPaintTags = new Set(["AUDIO", "CANVAS", "EMBED", "IFRAME", "OBJECT", "VIDEO"]);
  let captureToken;
  let fallbackIndex = 0;
  const pixelFallback = (kind) => {
    captureToken ??= [...crypto.getRandomValues(new Uint32Array(4))]
      .map((value) => value.toString(16).padStart(8, "0"))
      .join("");
    return `${kind}:${captureToken}:${fallbackIndex++}`;
  };
  const hashAsset = async (source) => {
    const assetUrl = new URL(source, document.baseURI);
    const fragment = assetUrl.hash;
    assetUrl.hash = "";
    const absolute = assetUrl.href;
    if (!assetHashes.has(absolute)) {
      assetHashes.set(
        absolute,
        (async () => {
          const response = await fetch(absolute);
          if (!response.ok) throw new Error(`Asset unavailable: ${response.status}`);
          if (response.headers.get("content-type")?.includes("image/svg+xml")) {
            const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
            const canonicalize = (node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent?.trim() || null;
              }
              if (!(node instanceof Element)) return null;
              return {
                tag: node.tagName,
                attributes: [...node.attributes]
                  .map(({ name, value }) => [name, value])
                  .sort(([left], [right]) => left.localeCompare(right)),
                children: [...node.childNodes].map(canonicalize).filter(Boolean),
              };
            };
            return `svg:${JSON.stringify(canonicalize(svg.documentElement))}`;
          }
          const bytes = new Uint8Array(await response.arrayBuffer());
          let binary = "";
          for (let offset = 0; offset < bytes.length; offset += 0x8000) {
            binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
          }
          return `binary:${btoa(binary)}`;
        })().catch((error) =>
          pixelFallback(`asset-error:${error instanceof Error ? error.message : String(error)}`),
        ),
      );
    }
    return {
      content: await assetHashes.get(absolute),
      ...(fragment ? { fragment } : {}),
    };
  };
  const normalizeAssetUrls = async (value) => {
    if (!value.includes("url(")) return value;
    const matches = [...value.matchAll(/url\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/g)];
    let normalized = value;
    for (const match of matches) {
      const source = (match[1] ?? match[2] ?? match[3] ?? "").trim();
      const token = JSON.stringify(await hashAsset(source));
      normalized = normalized.replace(match[0], `url(asset-${token})`);
    }
    return normalized;
  };
  const styleValue = async (style, normalizeRootContext = false) => {
    const clippedOut = style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)";
    const positionDoesNotPaint =
      style.position === "static" || (style.position === "absolute" && clippedOut);
    const result = [];
    for (const property of [...style].sort()) {
      if (
        excludedProperties.test(property) ||
        excludedNames.has(property) ||
        (normalizeRootContext && rootContextProperties.has(property)) ||
        (positionDoesNotPaint && contextDependentPositionProperties.has(property))
      ) {
        continue;
      }
      let value = await normalizeAssetUrls(style.getPropertyValue(property));
      if (normalizeRootContext && property === "display") {
        value =
          {
            "inline-block": "block",
            "inline-flex": "flex",
            "inline-grid": "grid",
          }[value] ?? value;
      }
      result.push([property, value]);
    }
    return result;
  };
  const pseudoValue = async (element, selector) => {
    const style = getComputedStyle(element, selector);
    if (
      selector !== "::marker" &&
      (style.content === "none" || style.content === "normal") &&
      style.display === "none"
    ) {
      return null;
    }
    return styleValue(style);
  };
  const imageValue = async (element) => {
    const imageInput = element instanceof HTMLInputElement && element.type === "image";
    if (!(element instanceof HTMLImageElement) && !imageInput) return null;
    const source = element instanceof HTMLImageElement ? element.currentSrc : element.src;
    return {
      complete: element.complete,
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
      alt: element.alt,
      content: source && element.complete ? await hashAsset(source) : pixelFallback("image"),
    };
  };
  const serialize = async (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (!text) return null;
      const range = node.ownerDocument.createRange();
      range.selectNodeContents(node);
      return {
        text,
        rects: [...range.getClientRects()].map(rectValue),
      };
    }
    if (!(node instanceof Element) || node.matches("script, style")) return null;
    const nodeDisplay = getComputedStyle(node).display;
    const state = {};
    if ("value" in node && typeof node.value === "string") state.value = node.value;
    if ("checked" in node && typeof node.checked === "boolean") state.checked = node.checked;
    if ("selectedIndex" in node && typeof node.selectedIndex === "number") {
      state.selectedIndex = node.selectedIndex;
    }
    if (node instanceof HTMLDetailsElement) state.open = node.open;
    const component = await Promise.all([
      Promise.all([...node.childNodes].map(serialize)).then((items) => items.filter(Boolean)),
      pseudoValue(node, "::before"),
      pseudoValue(node, "::after"),
      getComputedStyle(node).display === "list-item" ? pseudoValue(node, "::marker") : null,
      node instanceof HTMLInputElement && node.placeholder
        ? pseudoValue(node, "::placeholder")
        : null,
      node instanceof HTMLInputElement && node.type === "file"
        ? pseudoValue(node, "::file-selector-button")
        : null,
      styleValue(getComputedStyle(node), node === root),
      imageValue(node),
    ]);
    const [children, before, after, marker, placeholder, fileSelectorButton, style, image] =
      component;
    return {
      tag: node.tagName.toLocaleLowerCase("en-US"),
      // A `display:none` element has no laid-out position; `getBoundingClientRect`
      // returns all zeros and `rectValue` would report a phantom -rootRect.x
      // offset. Report a zero rect so the pixel fallback (not phantom geometry)
      // decides visual equivalence for non-painting collapsed content.
      rect:
        nodeDisplay === "none" && node !== root
          ? { x: 0, y: 0, width: 0, height: 0 }
          : rectValue(node.getBoundingClientRect()),
      scroll: [node.scrollLeft, node.scrollTop, node.scrollWidth, node.scrollHeight],
      style,
      ...(Object.keys(state).length ? { state } : {}),
      ...(image ? { image } : {}),
      ...(unmodeledPaintTags.has(node.tagName)
        ? { paintedContent: pixelFallback(node.tagName.toLocaleLowerCase("en-US")) }
        : {}),
      pseudo: {
        before,
        after,
        ...(marker ? { marker } : {}),
        ...(placeholder ? { placeholder } : {}),
        ...(fileSelectorButton ? { fileSelectorButton } : {}),
      },
      children,
    };
  };
  // Measure the rendered width of a single space at the root font. Text nodes
  // carry normalized `text` content, but leading/trailing whitespace in the
  // upstream source can shift the measured rect by one space width that the
  // frameworks do not reproduce. The comparator uses this as the maximum
  // allowable horizontal drift for rect width/position on identical text.
  const measureRootSpace = () => {
    try {
      const style = getComputedStyle(root);
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;pointer-events:none;font:${style.font};`;
      probe.textContent = "\u00a0";
      document.body.appendChild(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return Math.round(width * 64) / 64;
    } catch {
      return 1 / 64;
    }
  };
  const signature = await serialize(root);
  if (signature && typeof signature === "object") {
    signature.rootSpaceWidth = measureRootSpace();
  }
  return signature;
};

/**
 * Visual signature capture for a DOM element. Mirrors
 * `captureVisualSignatureAtCurrentOrigin` in the Playwright visual module but
 * operates on a real element directly.
 */
export const captureVisualSignature = captureVisualSignatureTree;

const ariaBooleanState = (element, name) => {
  const value = element.getAttribute(`aria-${name}`);
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const implicitRole = (element, tag, type) => {
  const explicitly = element.getAttribute("role");
  if (explicitly) return explicitly;
  if (tag === "button") return "button";
  if (tag === "a" && element.getAttribute("href")) return "link";
  if (tag === "input") {
    if (type === "checkbox") return "checkbox";
    if (type === "radio") return "radio";
    if (["button", "submit", "reset"].includes(type)) return "button";
    return "textbox";
  }
  if (tag === "select") return "combobox";
  if (tag === "textarea") return "textbox";
  if (tag === "nav") return "navigation";
  if (tag === "main") return "main";
  if (tag === "footer") return "contentinfo";
  if (tag === "header") return "banner";
  if (tag === "ul" || tag === "ol") return "list";
  if (tag === "li") return "listitem";
  if (tag === "table") return "table";
  if (tag === "h1") return "heading";
  if (tag === "h2") return "heading";
  if (tag === "h3") return "heading";
  if (tag === "h4") return "heading";
  if (tag === "h5") return "heading";
  if (tag === "h6") return "heading";
  if (tag === "img") return "img";
  if (tag === "dialog") return "dialog";
  return "generic";
};

const accessibleNameFrom = (element) => {
  if (element.getAttribute("aria-label")) return element.getAttribute("aria-label");
  if (element.getAttribute("aria-labelledby")) {
    const parts = element
      .getAttribute("aria-labelledby")
      .split(/\s+/)
      .map((id) => element.ownerDocument?.getElementById(id)?.textContent)
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (parts) return parts;
  }
  if (element.matches("button, [role=button], a[href], summary")) {
    // The accessible name recites distinct inline text runs (e.g. a title
    // `<span>` followed by a description) as space-separated, mirroring the
    // browser's accname computation (and Playwright's ariaSnapshot). A plain
    // `textContent` concatenates them without a space, so collect text runs
    // and join them the way an assistive technology hears them.
    const runs = [];
    const collect = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) runs.push(node.textContent);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node instanceof HTMLSlotElement) return;
      for (const child of node.childNodes) collect(child);
    };
    collect(element);
    if (runs.length) return runs.join(" ").replace(/\s+/g, " ").trim();
  }
  for (const attributeName of ["alt", "title", "placeholder", "value"]) {
    if (element.getAttribute(attributeName)) return element.getAttribute(attributeName);
  }
  return undefined;
};

const hiddenFromAccessibility = (element) => {
  if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "true") {
    return true;
  }
  const style = getComputedStyle(element);
  return style.display === "none" || style.visibility === "hidden";
};

/**
 * Deterministic accessibility-tree serializer used for conformance comparison.
 * Mirrors the surface Playwright's `ariaSnapshot()` exposes (role + name + key
 * ARIA states) so upstream and framework renders can be compared in-browser.
 * This is a structural approximation of the computed accessibility tree, not a
 * substitute for a full a11y audit engine.
 */
export const captureAccessibilityTree = async (root) => {
  const serialize = (element) => {
    if (!(element instanceof Element)) return [];
    if (element.matches("script, style, meta, link, title")) return [];
    if (hiddenFromAccessibility(element)) return [];
    const tag = element.tagName.toLocaleLowerCase("en-US");
    const type = element.getAttribute("type");
    const role = implicitRole(element, tag, type);
    const name = accessibleNameFrom(element);
    const state = {};
    const checked =
      ariaBooleanState(element, "checked") ??
      (type === "checkbox" || type === "radio"
        ? Boolean("checked" in element ? element.checked : undefined)
        : undefined);
    if (checked !== undefined) state.checked = checked;
    const disabled =
      ariaBooleanState(element, "disabled") ?? ("disabled" in element && Boolean(element.disabled));
    if (disabled) state.disabled = true;
    const expanded = ariaBooleanState(element, "expanded");
    if (expanded !== undefined) state.expanded = expanded;
    const selected = ariaBooleanState(element, "selected");
    if (selected !== undefined) state.selected = selected;
    const pressed = ariaBooleanState(element, "pressed");
    if (pressed !== undefined) state.pressed = pressed;
    const level =
      element.getAttribute("aria-level") ?? (tag.match(/^h[1-6]$/) ? tag[1] : undefined);
    if (level !== undefined) state.level = Number(level);
    const node = { role };
    if (name) node.name = name;
    if (Object.keys(state).length) node.state = state;

    let children = [];
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      children.push(...serialize(child));
    }
    // Pure structure containers (no role/name of their own) expose only their
    // children, mirroring how Playwright's ariaSnapshot flattens generic nodes.
    if (
      role === "generic" &&
      !name &&
      tag !== "ul" &&
      tag !== "ol" &&
      children.every((child) => child.children !== undefined)
    ) {
      return children;
    }
    node.children = children;
    return [node];
  };
  return serialize(root);
};

/**
 * Rasterize a rendered DOM root to RGBA pixel data. Used as a visual-
 * equivalence fallback when the geometric visual signature differs (sub-pixel
 * noise, `display:none` panels that still paint) — two roots pass if ≥ 99% of
 * their pixels agree, mirroring the Playwright pixel fallback the runtime path
 * previously used.
 *
 * Implementation note: the SVG is fed to the canvas as a same-origin
 * `data:` URL (not a Blob URL) — Blob URLs taint the canvas for foreignObject
 * content and `getImageData` throws `SecurityError`; `data:` URLs render and
 * stay untainted in headless Chromium. Returns `null` on any load/render
 * failure so callers keep their strict judgment rather than guessing.
 */
export const rasterizeRootToImageData = async (root, { scale = 1 } = {}) => {
  const inlineComputedStyles = (clone) => {
    const originals = [root];
    const copied = [clone];
    let oi = 0;
    while (oi < originals.length) {
      const original = originals[oi];
      const copy = copied[oi];
      oi += 1;
      const computed = getComputedStyle(original);
      for (const property of computed) {
        copy.style.setProperty(property, computed.getPropertyValue(property));
      }
      for (let i = 0; i < original.childElementCount; i += 1) {
        originals.push(original.children[i]);
        copied.push(copy.children[i]);
      }
    }
  };
  const rect = root.getBoundingClientRect();
  const innerWidth = Math.max(1, Math.round(rect.width * scale));
  const innerHeight = Math.max(1, Math.round(rect.height * scale));
  if (innerWidth === 0 || innerHeight === 0) return null;
  await document.fonts.ready;
  const clone = root.cloneNode(true);
  inlineComputedStyles(clone);
  // The root's focus ring / box-shadow paints ~4px outside its border box. If
  // we crop exactly to the border box, the ring's anti-aliased edge lands on
  // the canvas boundary and rounds differently for upstream vs framework.
  // Snap the root AND its outlines to a whole-pixel origin by rendering into a
  // slightly larger grid with a clean gutter around the border box.
  const ringGutter = 8;
  const width = innerWidth + ringGutter * 2;
  const height = innerHeight + ringGutter * 2;
  clone.style.margin = "0";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.position = "absolute";
  clone.style.width = `${innerWidth}px`;
  clone.style.height = `${innerHeight}px`;
  clone.style.boxSizing = "border-box";
  const wrapper = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
  wrapper.style.position = "relative";
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.margin = "0";
  wrapper.style.padding = "0";
  // Box-shadow is relative to the border box, so any fractional border-box
  // offset would alias the ring edge. anchor is the whole-pixel placement of
  // the clone's origin inside the gutter, zeroing the sub-pixel page offset.
  clone.style.top = `${ringGutter}px`;
  clone.style.left = `${ringGutter}px`;
  wrapper.appendChild(clone);
  const html = new XMLSerializer().serializeToString(wrapper);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">` +
    `${html}</foreignObject></svg>`;
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  try {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return { width, height, data: context.getImageData(0, 0, width, height).data };
  } catch {
    return null;
  }
};
