import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { captureVisualSignature as captureVisualSignatureTree } from "./browser-harness.mjs";
import { evaluateWith } from "./browser-eval.mjs";

const captureVisualSignatureAtCurrentOrigin = async (locator) =>
  evaluateWith(locator, captureVisualSignatureTree);

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
