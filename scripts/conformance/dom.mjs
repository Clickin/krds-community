export class SelectorResolutionError extends Error {
  constructor({ kind, side, selector, message, cause }) {
    const causeMessage =
      cause instanceof Error ? cause.message : cause === undefined ? '' : String(cause);
    super(causeMessage ? `${message}: ${causeMessage}` : message);
    this.name = 'SelectorResolutionError';
    this.kind = kind;
    this.side = side;
    this.selector = selector;
    if (cause !== undefined) this.cause = cause;
  }

  toEvidence({ fixtureId, framework, stateId }) {
    return [
      ['fixture', fixtureId],
      ['framework', framework],
      ...(stateId === undefined ? [] : [['state', stateId]]),
      ['kind', this.kind],
      ['side', this.side],
      ['selector', this.selector],
      ['error', this.message],
    ]
      .map(([name, value]) => `${name}=${JSON.stringify(String(value))}`)
      .join(' ');
  }
}

const normalizeSnapshot = (value) => JSON.stringify(value);

export const captureDom = async (
  locator,
  ignoredAttributes = [],
  side = 'framework',
) => {
  const normalizationSide =
    typeof ignoredAttributes === 'string' ? ignoredAttributes : side;
  const rules = typeof ignoredAttributes === 'string' ? [] : ignoredAttributes;
  return locator.evaluate(
    (root, { normalizationRules, snapshotSide }) => {
      const generatedAttribute =
        /^(?:data-v-|data-conformance-|_ng(?:content|host)-|ng-reflect-|data-svelte)/;
      const referenceAttributes = new Set([
        'aria-controls',
        'aria-describedby',
        'aria-labelledby',
        'aria-owns',
        'for',
        'headers',
      ]);
      const booleanAttributes = new Set([
        'allowfullscreen',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'inert',
        'ismap',
        'itemscope',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected',
      ]);
      const ids = new Map();
      let nextId = 0;
      root.querySelectorAll('[id]').forEach((element) => {
        const id = element.getAttribute('id');
        if (id && !ids.has(id)) ids.set(id, `generated-${++nextId}`);
      });
      if (root instanceof Element) {
        const id = root.getAttribute('id');
        if (id && !ids.has(id)) ids.set(id, `generated-${++nextId}`);
      }
      const normalizeAttribute = (name, value) => {
        if (booleanAttributes.has(name)) return '';
        if (name === 'id') return ids.get(value) ?? value;
        if (referenceAttributes.has(name)) {
          return value
            .split(/\s+/)
            .map((part) => ids.get(part) ?? part)
            .join(' ');
        }
        if (name === 'href' && value.startsWith('#')) {
          return `#${ids.get(value.slice(1)) ?? value.slice(1)}`;
        }
        if (name === 'class') return value.split(/\s+/).filter(Boolean).sort().join(' ');
        return value;
      };
      const matchesRule = (node, rule) =>
        typeof rule?.selector === 'string' && node.matches(rule.selector);
      const isIgnoreElement = (rule) =>
        rule?.ignoreElement === true || rule?.operation === 'ignore-element';
      const isIgnoreSubtree = (rule) =>
        rule?.ignoreSubtree === true || rule?.operation === 'ignore-subtree';
      const isRewrite = (rule) =>
        rule?.operation === 'rewrite' ||
        Object.prototype.hasOwnProperty.call(rule ?? {}, 'rewriteValue');
      const rewriteValue = (rule) =>
        Object.prototype.hasOwnProperty.call(rule ?? {}, 'rewriteValue')
          ? rule.rewriteValue
          : rule.value;
      const isOmission = (rule) =>
        !isRewrite(rule) &&
        !isIgnoreElement(rule) &&
        !isIgnoreSubtree(rule) &&
        (rule?.operation === 'omit' ||
          (typeof rule?.attribute === 'string' && typeof rule?.rule === 'string'));
      const serialize = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.replace(/\s+/g, ' ').trim();
          return text ? { text } : null;
        }
        if (!(node instanceof Element) || node.matches('script, style')) return null;
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
                typeof rule.attribute === 'string' &&
                isRewrite(rule) &&
                snapshotSide === 'upstream',
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
        if ('value' in control && typeof control.value === 'string') state.value = control.value;
        if ('checked' in control && typeof control.checked === 'boolean') {
          state.checked = control.checked;
        }
        if ('selectedIndex' in control && typeof control.selectedIndex === 'number') {
          state.selectedIndex = control.selectedIndex;
        }
        if (node instanceof HTMLDetailsElement) state.open = node.open;
        return {
          tag: node.tagName.toLocaleLowerCase('en-US'),
          attributes: serializedAttributes,
          ...(Object.keys(state).length ? { state } : {}),
          children: serializeChildren(),
        };
      };
      return serialize(root);
    },
    { normalizationRules: rules, snapshotSide: normalizationSide },
  );
};

export const compareDom = (upstream, framework) => {
  const expected = normalizeSnapshot(upstream);
  const actual = normalizeSnapshot(framework);
  return {
    passed: expected === actual,
    expected,
    actual,
  };
};

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
        ancestor.setAttribute('data-conformance-contract-root', data.marker);
        return true;
      },
      { selector, marker },
    );
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: 'contract-ancestor',
      side,
      selector,
      message: 'Contract ancestor selector could not be evaluated',
      cause,
    });
  }
  if (!found) {
    throw new SelectorResolutionError({
      kind: 'contract-ancestor',
      side,
      selector,
      message: 'Contract ancestor selector did not resolve an ancestor',
    });
  }
  const contractLocator = page.locator(`[data-conformance-contract-root="${marker}"]`);
  let contractCount;
  try {
    contractCount = await contractLocator.count();
  } catch (cause) {
    throw new SelectorResolutionError({
      kind: 'contract-ancestor',
      side,
      selector,
      message: 'Contract ancestor selector result could not be counted',
      cause,
    });
  }
  if (contractCount !== 1) {
    throw new SelectorResolutionError({
      kind: 'contract-ancestor',
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
          'aria-activedescendant',
          'aria-controls',
          'aria-describedby',
          'aria-details',
          'aria-errormessage',
          'aria-flowto',
          'aria-labelledby',
          'aria-owns',
          'for',
          'headers',
        ]);
        const restorations = [];
        window[key] = restorations;
        try {
          const plans = rewrites.flatMap((rule, index) => {
            if (typeof rule?.selector !== 'string' || typeof rule?.attribute !== 'string') {
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
              rule.operation === 'rewrite' ||
              Object.prototype.hasOwnProperty.call(rule, 'rewriteValue');
            const hasValue =
              Object.prototype.hasOwnProperty.call(rule, 'rewriteValue') ||
              Object.prototype.hasOwnProperty.call(rule, 'value');
            if (rewrite && !hasValue) {
              throw new Error(
                `Accessibility correction rewrite has no value: ${rule.selector} [${rule.attribute}]`,
              );
            }
            const expected = rewrite
              ? String(
                  Object.prototype.hasOwnProperty.call(rule, 'rewriteValue')
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
          const candidates = [...element.querySelectorAll('*'), element];

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
          element.ownerDocument.querySelectorAll('[id]').forEach((candidate) => {
            const id = candidate.getAttribute('id');
            if (!id) return;
            const targets = targetsById.get(id) ?? [];
            targets.push(candidate);
            targetsById.set(id, targets);
          });
          for (const { candidate, rule, expected } of plans) {
            if (rule.attribute === 'id' && expected !== null) {
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

export const inspectSemantics = async (locator) =>
  locator.evaluate((element) => {
    const label = element.getAttribute('aria-label') ?? '';
    const style = getComputedStyle(element);
    const tag = element.tagName.toLocaleLowerCase('en-US');
    const isNativeFormControl = element.matches(
      'button, fieldset, input, object, optgroup, option, output, select, textarea',
    );
    const form = {};
    if (isNativeFormControl) {
      form.name = 'name' in element ? String(element.name ?? '') : '';
      form.value = 'value' in element ? String(element.value ?? '') : '';
      form.checked = 'checked' in element ? Boolean(element.checked) : undefined;
      form.disabled = 'disabled' in element ? Boolean(element.disabled) : undefined;
      form.required = 'required' in element ? Boolean(element.required) : undefined;
      form.readOnly = 'readOnly' in element ? Boolean(element.readOnly) : undefined;
    }
    return {
      tag,
      role: element.getAttribute('role'),
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
  });
