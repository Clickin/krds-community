import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const captureVisualSignatureAtCurrentOrigin = async (locator) =>
  locator.evaluate(async (root) => {
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
      const clippedOut =
        style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)";
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
      const state = {};
      if ("value" in node && typeof node.value === "string") state.value = node.value;
      if ("checked" in node && typeof node.checked === "boolean") state.checked = node.checked;
      if ("selectedIndex" in node && typeof node.selectedIndex === "number") {
        state.selectedIndex = node.selectedIndex;
      }
      if (node instanceof HTMLDetailsElement) state.open = node.open;
      const [children, before, after, marker, placeholder, fileSelectorButton, style, image] =
        await Promise.all([
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
      return {
        tag: node.tagName.toLocaleLowerCase("en-US"),
        rect: rectValue(node.getBoundingClientRect()),
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
    return serialize(root);
  });

const visualCoordinateTolerance = 1 / 64;
const sameCoordinate = (left, right) => Math.abs(left - right) <= visualCoordinateTolerance;
const sameBounds = (left, right) =>
  sameCoordinate(left.x, right.x) &&
  sameCoordinate(left.y, right.y) &&
  sameCoordinate(left.width, right.width) &&
  sameCoordinate(left.height, right.height);
const withCanonicalVisualOrigin = async (locator, origin, operation) => {
  await locator.scrollIntoViewIfNeeded();
  const initialBounds = await locator.boundingBox();
  if (!initialBounds) throw new Error("Visual root has no screenshot bounds");
  if (
    !origin ||
    (sameCoordinate(initialBounds.x, origin.x) && sameCoordinate(initialBounds.y, origin.y))
  ) {
    return operation();
  }

  const wasHovered = await locator
    .evaluate((element) => element.matches(":hover"))
    .catch(() => false);
  const transaction = await locator.evaluate((root, target) => {
    const context = root.ownerDocument.body;
    const before = root.getBoundingClientRect();
    const deltaX = target.x - before.x;
    const deltaY = target.y - before.y;
    const tolerance = 1 / 64;
    const preservesGeometry = (bounds) =>
      Math.abs(bounds.x - target.x) <= tolerance &&
      Math.abs(bounds.y - target.y) <= tolerance &&
      Math.abs(bounds.width - before.width) <= tolerance &&
      Math.abs(bounds.height - before.height) <= tolerance;
    const restoreStyle = (element, style) => {
      if (style === null) element.removeAttribute("style");
      else element.setAttribute("style", style);
    };

    if (context && context !== root) {
      const contextBounds = context.getBoundingClientRect();
      const contextStyle = getComputedStyle(context);
      const numericStyle = (property) => Number.parseFloat(contextStyle.getPropertyValue(property));
      const marginLeft = numericStyle("margin-left");
      const marginTop = numericStyle("margin-top");
      const paddingLeft = numericStyle("padding-left");
      const paddingTop = numericStyle("padding-top");
      if ([marginLeft, marginTop, paddingLeft, paddingTop].every(Number.isFinite)) {
        const originalStyle = context.getAttribute("style");
        context.style.setProperty("box-sizing", "border-box", "important");
        if (deltaX >= 0) {
          context.style.setProperty("width", `${contextBounds.width + deltaX}px`, "important");
          context.style.setProperty("padding-left", `${paddingLeft + deltaX}px`, "important");
        } else {
          context.style.setProperty("width", `${contextBounds.width}px`, "important");
          context.style.setProperty("margin-left", `${marginLeft + deltaX}px`, "important");
        }
        if (deltaY >= 0) {
          context.style.setProperty("height", `${contextBounds.height + deltaY}px`, "important");
          context.style.setProperty("padding-top", `${paddingTop + deltaY}px`, "important");
        } else {
          context.style.setProperty("margin-top", `${marginTop + deltaY}px`, "important");
        }
        if (preservesGeometry(root.getBoundingClientRect())) {
          return {
            mode: "context",
            originalStyle,
            before: {
              x: before.x,
              y: before.y,
              width: before.width,
              height: before.height,
            },
          };
        }
        restoreStyle(context, originalStyle);
      }
    }

    const originalStyle = root.getAttribute("style");
    const computedTransform = getComputedStyle(root).transform;
    const translatedTransform = `translate(${deltaX}px, ${deltaY}px)${
      computedTransform === "none" ? "" : ` ${computedTransform}`
    }`;
    root.style.setProperty("transform", translatedTransform, "important");
    if (!preservesGeometry(root.getBoundingClientRect())) {
      restoreStyle(root, originalStyle);
      throw new Error("Visual layout transaction did not preserve root geometry");
    }
    return {
      mode: "root",
      originalStyle,
      before: {
        x: before.x,
        y: before.y,
        width: before.width,
        height: before.height,
      },
    };
  }, origin);

  let result;
  let operationError;
  try {
    // The canonical-origin translate moves the root; if the mouse was
    // hovering it (e.g. a :hover fixture state), follow it so the
    // hovered computed style and pixels are captured.
    if (wasHovered && (origin.x !== transaction.before.x || origin.y !== transaction.before.y)) {
      const box = await locator.boundingBox();
      if (box) {
        await locator.page().mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
    }
    result = await operation();
  } catch (error) {
    operationError = error;
  }

  let restorationError;
  try {
    const restoredBounds = await locator.evaluate((root, state) => {
      const element = state.mode === "context" ? root.ownerDocument.body : root;
      if (state.originalStyle === null) element.removeAttribute("style");
      else element.setAttribute("style", state.originalStyle);
      const bounds = root.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
    }, transaction);
    if (!sameBounds(restoredBounds, transaction.before)) {
      restorationError = new Error("Visual layout transaction did not restore root geometry");
    }
  } catch (error) {
    restorationError = error;
  }
  if (operationError) throw operationError;
  if (restorationError) throw restorationError;
  return result;
};

export const captureVisualSignature = (locator, context = {}) =>
  withCanonicalVisualOrigin(locator, context.origin, () =>
    captureVisualSignatureAtCurrentOrigin(locator),
  );

export const captureCanonicalScreenshot = async (locator, options = {}, context = {}) =>
  withCanonicalVisualOrigin(locator, context.origin, async () => {
    const box = await locator.boundingBox();
    if (!box) throw new Error("Visual root has no screenshot bounds");
    const horizontalGutter = Math.max(0, Number(context.gutter) || 0);
    const clipX = Math.max(0, Math.round(box.x - horizontalGutter));
    const clipRight = Math.round(box.x + box.width + horizontalGutter);
    const clip = {
      x: clipX,
      y: Math.round(box.y),
      width: Math.max(1, clipRight - clipX),
      height: Math.max(1, Math.round(box.height)),
    };
    const page = locator.page();
    const viewport = page.viewportSize();
    const expandedViewport =
      viewport && (clip.x + clip.width > viewport.width || clip.y + clip.height > viewport.height)
        ? {
            width: Math.max(viewport.width, clip.x + clip.width),
            height: Math.max(viewport.height, clip.y + clip.height),
          }
        : null;

    let screenshot;
    let screenshotError;
    try {
      if (expandedViewport) {
        await page.setViewportSize(expandedViewport);
        const expandedBounds = await locator.boundingBox();
        if (!expandedBounds || !sameBounds(expandedBounds, box)) {
          throw new Error("Visual screenshot viewport expansion changed root geometry");
        }
      }
      screenshot = await page.screenshot({
        ...options,
        captureBeyondViewport: true,
        scale: "css",
        clip,
      });
    } catch (error) {
      screenshotError = error;
    }

    let restorationError;
    if (expandedViewport && viewport) {
      try {
        await page.setViewportSize(viewport);
        const restoredBounds = await locator.boundingBox();
        if (!restoredBounds || !sameBounds(restoredBounds, box)) {
          restorationError = new Error(
            "Visual screenshot viewport expansion did not restore root geometry",
          );
        }
      } catch (error) {
        restorationError = error;
      }
    }
    if (screenshotError) throw screenshotError;
    if (restorationError) throw restorationError;
    return screenshot;
  });

export const comparePixels = (upstreamBuffer, frameworkBuffer) => {
  const upstream = PNG.sync.read(upstreamBuffer);
  const framework = PNG.sync.read(frameworkBuffer);
  if (upstream.width !== framework.width || upstream.height !== framework.height) {
    return {
      passed: false,
      differingPixels: Math.max(
        upstream.width * upstream.height,
        framework.width * framework.height,
      ),
      expectedSize: { width: upstream.width, height: upstream.height },
      actualSize: { width: framework.width, height: framework.height },
    };
  }
  const differingPixels = pixelmatch(
    upstream.data,
    framework.data,
    null,
    upstream.width,
    upstream.height,
    { includeAA: true, threshold: 0 },
  );
  return {
    passed: differingPixels === 0,
    differingPixels,
    expectedSize: { width: upstream.width, height: upstream.height },
    actualSize: { width: framework.width, height: framework.height },
  };
};
