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

export const inspectSemantics = async (locator) =>
  locator.evaluate((element) => {
    const label = element.getAttribute('aria-label') ?? '';
    const style = getComputedStyle(element);
    return {
      tag: element.tagName.toLocaleLowerCase('en-US'),
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
      form: {
        name: 'name' in element ? String(element.name ?? '') : '',
        value: 'value' in element ? String(element.value ?? '') : '',
        checked: 'checked' in element ? Boolean(element.checked) : undefined,
        disabled: 'disabled' in element ? Boolean(element.disabled) : undefined,
        required: 'required' in element ? Boolean(element.required) : undefined,
        readOnly: 'readOnly' in element ? Boolean(element.readOnly) : undefined,
      },
    };
  });
