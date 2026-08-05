export class SelectorResolutionError extends Error {
  constructor({ kind, side, selector, message, cause }) {
    const causeMessage =
      cause instanceof Error ? cause.message : cause === undefined ? "" : String(cause);
    super(causeMessage ? `${message}: ${causeMessage}` : message);
    this.name = "SelectorResolutionError";
    this.kind = kind;
    this.side = side;
    this.selector = selector;
    if (cause !== undefined) this.cause = cause;
  }

  toEvidence({ fixtureId, framework, stateId }) {
    return [
      ["fixture", fixtureId],
      ["framework", framework],
      ...(stateId === undefined ? [] : [["state", stateId]]),
      ["kind", this.kind],
      ["side", this.side],
      ["selector", this.selector],
      ["error", this.message],
    ]
      .map(([name, value]) => `${name}=${JSON.stringify(String(value))}`)
      .join(" ");
  }
}

import { captureDomTree, captureSemantics } from "./browser-harness.mjs";
import { evaluateWith } from "./browser-eval.mjs";
import { compareDom } from "./browser-judge.mjs";

export const captureDom = async (locator, ignoredAttributes = [], side = "framework") => {
  const normalizationSide = typeof ignoredAttributes === "string" ? ignoredAttributes : side;
  const rules = typeof ignoredAttributes === "string" ? [] : ignoredAttributes;
  return evaluateWith(locator, captureDomTree, {
    normalizationRules: rules,
    snapshotSide: normalizationSide,
  });
};

export { compareDom };

let contractMarkerSequence = 0;
export const resolveContractRoot = async (page, root, selectors, side) => {
  const selector = selectors?.[side];
  if (!selector) return { locator: root };
  const marker = `contract-${++contractMarkerSequence}`;
  let found;
  try {
    found = await root.evaluate(
      (element, data) => {
        const ancestor = element.closest(data.selector);
        if (!ancestor) return false;
        ancestor.setAttribute("data-conformance-contract-root", data.marker);
        return true;
      },
      { selector, marker },
    );
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: "contract-ancestor",
      side,
      selector,
      message: "Contract ancestor selector could not be evaluated",
      cause,
    });
  }
  if (!found) {
    throw new SelectorResolutionError({
      kind: "contract-ancestor",
      side,
      selector,
      message: "Contract ancestor selector did not resolve an ancestor",
    });
  }
  const contractLocator = page.locator(`[data-conformance-contract-root="${marker}"]`);
  let contractCount;
  try {
    contractCount = await contractLocator.count();
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: "contract-ancestor",
      side,
      selector,
      message: "Contract ancestor selector result could not be counted",
      cause,
    });
  }
  if (contractCount !== 1) {
    throw new SelectorResolutionError({
      kind: "contract-ancestor",
      side,
      selector,
      message: `Contract ancestor selector did not resolve exactly one element (${contractCount})`,
    });
  }
  return { locator: contractLocator.nth(0), marker };
};

let correctionSequence = 0;
export const withCorrectedAttributes = async (root, rules, captureCorrectedEvidence) => {
  const correctionRules = rules.accessibilityRules ?? [];
  if (correctionRules.length === 0) return captureCorrectedEvidence();
  const restorationKey = `__KRDS_CONFORMANCE_RESTORE_${++correctionSequence}`;
  let transactionStarted = false;
  try {
    const correctionError = await root.evaluate(
      (element, { key, rewrites }) => {
        const referenceAttributes = new Set([
          "aria-activedescendant",
          "aria-controls",
          "aria-describedby",
          "aria-details",
          "aria-errormessage",
          "aria-flowto",
          "aria-labelledby",
          "aria-owns",
          "for",
          "headers",
        ]);
        const restorations = [];
        window[key] = restorations;
        try {
          const plans = rewrites.flatMap((rule, index) => {
            if (typeof rule?.selector !== "string" || typeof rule?.attribute !== "string") {
              throw new Error(
                `Accessibility correction rule ${index + 1} requires a selector and attribute`,
              );
            }
            let matches;
            try {
              matches = [
                ...(element.matches(rule.selector) ? [element] : []),
                ...element.querySelectorAll(rule.selector),
              ];
            } catch (error) {
              throw new Error(
                `Accessibility correction selector is invalid: ${rule.selector} (${error instanceof Error ? error.message : String(error)})`,
              );
            }
            const rewrite =
              rule.operation === "rewrite" ||
              Object.prototype.hasOwnProperty.call(rule, "rewriteValue");
            const hasValue =
              Object.prototype.hasOwnProperty.call(rule, "rewriteValue") ||
              Object.prototype.hasOwnProperty.call(rule, "value");
            if (rewrite && !hasValue) {
              throw new Error(
                `Accessibility correction rewrite has no value: ${rule.selector} [${rule.attribute}]`,
              );
            }
            const expected = rewrite
              ? String(
                  Object.prototype.hasOwnProperty.call(rule, "rewriteValue")
                    ? rule.rewriteValue
                    : rule.value,
                )
              : null;
            return matches.map((candidate) => ({ rule, candidate, expected }));
          });
          if (plans.length === 0) return null;

          const updateAttribute = (candidate, name, value) => {
            restorations.push({
              candidate,
              name,
              existed: candidate.hasAttribute(name),
              value: candidate.getAttribute(name),
            });
            if (value === null) candidate.removeAttribute(name);
            else candidate.setAttribute(name, value);
          };
          const candidates = [...element.querySelectorAll("*"), element];

          for (const { candidate, rule, expected } of plans) {
            updateAttribute(candidate, rule.attribute, expected);
          }

          for (const { candidate, rule, expected } of plans) {
            const actual = candidate.getAttribute(rule.attribute);
            if (actual !== expected) {
              throw new Error(
                `Accessibility correction did not produce ${rule.attribute}=${JSON.stringify(expected)} for ${rule.selector}; received ${JSON.stringify(actual)}`,
              );
            }
          }

          const targetsById = new Map();
          element.ownerDocument.querySelectorAll("[id]").forEach((candidate) => {
            const id = candidate.getAttribute("id");
            if (!id) return;
            const targets = targetsById.get(id) ?? [];
            targets.push(candidate);
            targetsById.set(id, targets);
          });
          for (const { candidate, rule, expected } of plans) {
            if (rule.attribute === "id" && expected !== null) {
              const targets = targetsById.get(expected) ?? [];
              if (targets.length !== 1 || targets[0] !== candidate) {
                throw new Error(
                  `Accessibility correction did not produce a unique id reference target: ${rule.selector} [id=${JSON.stringify(expected)}] (${targets.length})`,
                );
              }
            }
          }
          for (const candidate of candidates) {
            for (const attribute of referenceAttributes) {
              const value = candidate.getAttribute(attribute);
              if (value === null) continue;
              const references = value.split(/\s+/).filter(Boolean);
              if (references.length === 0) {
                throw new Error(`Accessibility correction left an empty ${attribute} reference`);
              }
              for (const reference of references) {
                const targets = targetsById.get(reference) ?? [];
                if (targets.length !== 1) {
                  throw new Error(
                    `Accessibility correction left unresolved ${attribute} reference ${JSON.stringify(reference)} (${targets.length})`,
                  );
                }
              }
            }
          }
          return null;
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      },
      { key: restorationKey, rewrites: correctionRules },
    );
    transactionStarted = true;
    if (correctionError) throw new Error(correctionError);
    return await captureCorrectedEvidence();
  } finally {
    if (transactionStarted) {
      await root.evaluate((_, key) => {
        const restorations = window[key] ?? [];
        for (const restoration of restorations.reverse()) {
          if (restoration.existed) {
            restoration.candidate.setAttribute(restoration.name, restoration.value);
          } else {
            restoration.candidate.removeAttribute(restoration.name);
          }
        }
        delete window[key];
      }, restorationKey);
    }
  }
};

export const inspectSemantics = async (locator) => evaluateWith(locator, captureSemantics);
