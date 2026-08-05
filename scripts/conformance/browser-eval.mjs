// Node-side helper: invoke a pure browser function inside a Playwright page.
//
// The capture functions in browser-harness.mjs are self-contained (they only
// use browser globals), so their serialized source can be re-instantiated in
// the page via eval. This lets the legacy Playwright wrappers (captureDom,
// inspectSemantics, captureVisualSignature) keep working by delegating to the
// same harness code the in-browser @web/test-runner path imports directly.

export const evaluateWith = async (locator, fn, arg) =>
  locator.evaluate(
    (element, { source, arg: argValue }) => {
      const invoke = (0, eval)(`(${source})`);
      return argValue === undefined ? invoke(element) : invoke(element, argValue);
    },
    { source: fn.toString(), arg },
  );
