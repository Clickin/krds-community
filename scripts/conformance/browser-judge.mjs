// Browser-capable conformance judgment.
//
// The comparison/assertion step (DOM, visual signature, form, contract) runs
// directly in the browser worker so only the small `checks` verdict is shipped
// back to Node instead of the full capture snapshots. This module is the
// single source of that judgment and stays importable both as a Node ESM module
// (used by the legacy Playwright runtime for regression parity) and in the
// browser worker.
//
// The checks this module reproduces in-browser are DOM, visual signature,
// form, contract, accessibility (a deterministic accessibility-tree capture
// compared between upstream and framework), and behavior (mirrors the legacy
// runtime verdict: with actions it passes iff the DOM matches, plus the events
// captured on the framework during interaction).

const normalizeSnapshot = (value) => JSON.stringify(value);

export const compareDom = (upstream, framework) => {
  const expected = normalizeSnapshot(upstream);
  const actual = normalizeSnapshot(framework);
  return {
    passed: expected === actual,
    expected,
    actual,
  };
};

export { compareDom as default };

export const compareVisualSignatures = (upstreamSignature, frameworkSignature) => {
  if (upstreamSignature == null || frameworkSignature == null) {
    return {
      passed: false,
      errors: ["visual signature unavailable on one or both sides"],
      comparison: "dom-style",
    };
  }
  const passed = normalizeSnapshot(upstreamSignature) === normalizeSnapshot(frameworkSignature);
  let signatureDifference;
  if (!passed) {
    // A full recursive walk is prohibitively slow on very large signatures
    // (e.g. multi-MB calendar grids). Use an approximate start-of-string diff
    // which is O(n) and deterministic rather than a deep structural walk.
    const expected = normalizeSnapshot(upstreamSignature);
    const actual = normalizeSnapshot(frameworkSignature);
    const limit = Math.min(expected.length, actual.length);
    let offset = 0;
    while (offset < limit && expected[offset] === actual[offset]) offset += 1;
    signatureDifference = {
      path: "$",
      expected: expected.slice(offset, offset + 120),
      actual: actual.slice(offset, offset + 120),
      offset,
    };
  }
  return {
    passed,
    passedSmall: passed,
    differingPixels: 0,
    skipped: passed,
    comparison: "dom-style",
    ...(passed
      ? {}
      : { signatureError: "visual signatures differ", signatureDifference }),
  };
};

export const contractGroupSelectors = {
  button: 'button, [role="button"]',
  panel: '[role="region"], [aria-labelledby], .accordion-collapse, .krds-panel',
  input: "input",
  select: "select",
  label: "label",
  list: 'ul, ol, [role="list"]',
  tooltip: '[role="tooltip"], .krds-tooltip-popover, .krds-tooltip',
  link: 'link[rel~="icon"], a[href], [role="link"]',
  table: 'table, [role="table"]',
  textarea: "textarea",
};

export const contractGroupsFor = (semanticElement) => {
  if (semanticElement === "button-and-region") return ["button", "panel"];
  if (semanticElement === "button-and-tooltip") return ["button", "tooltip"];
  if (semanticElement === "button-and-list") return ["button", "list"];
  if (semanticElement === "label-and-input") return ["label", "input"];
  if (semanticElement === "label-and-checkbox") return ["label", "input"];
  if (semanticElement === "label-and-radio") return ["label", "input"];
  if (semanticElement === "label-and-select") return ["label", "select"];
  if (semanticElement === "label-and-textarea") return ["label", "textarea"];
  if (semanticElement === "link[rel=icon]") return ["link"];
  if (semanticElement === "table") return ["table"];
  return [];
};

// Port of runtime.mjs `contractChecks`: pure check over a contractSemantics
// object ({ root, groups }), all of which are plain serialized semantics.
export const runContractChecks = (fixture, semantics) => {
  const errors = [];
  const root = semantics?.root ?? semantics;
  const groups = semantics?.groups ?? {};
  if (!root) return ["contract semantics unavailable"];
  const nativeRole = (value) => {
    if (value.role) return value.role;
    if (value.tag === "button") return "button";
    if (value.tag === "a" && value.attributes?.href) return "link";
    if (value.tag === "nav") return "navigation";
    if (value.tag === "footer") return "contentinfo";
    if (value.tag === "ul" || value.tag === "ol") return "list";
    if (value.tag === "table") return "table";
    if (value.tag === "select") return "combobox";
    if (value.tag === "textarea") return "textbox";
    if (value.tag === "input") {
      const type = value.attributes?.type ?? "text";
      if (type === "checkbox" || type === "radio") return type;
      if (!["button", "submit", "reset", "hidden"].includes(type)) return "textbox";
    }
    return undefined;
  };
  const actualRole = nativeRole(root);
  const semanticElement = fixture.contract?.semanticElement;
  const expectedRoles = {
    alert: "alert",
    button: "button",
    contentinfo: "contentinfo",
    dialog: "dialog",
    link: "link",
    list: "list",
    navigation: "navigation",
    table: "table",
  };
  const expectedTags = {
    "label-and-input": ["input"],
    "label-and-checkbox": ["input"],
    "label-and-radio": ["input"],
    "label-and-select": ["select"],
    "label-and-textarea": ["textarea"],
    "details-summary": ["details"],
  };
  const compositeContracts = new Set([
    "button-and-region",
    "button-and-tooltip",
    "button-and-list",
    "label-and-input",
    "label-and-checkbox",
    "label-and-radio",
    "label-and-select",
    "label-and-textarea",
  ]);
  if (semanticElement === "link[rel=icon]") {
    if (root.tag !== "link" || !String(root.attributes?.rel ?? "").split(/\s+/).includes("icon")) {
      errors.push("semantic element: expected link[rel=icon]");
    }
    for (const attribute of ["href", "sizes", "type"]) {
      if (!root.attributes?.[attribute]) errors.push(`favicon attribute ${attribute} is missing`);
    }
  } else if (semanticElement === "native-element") {
    if (!root.tag || !root.attributes || typeof root.label !== "string") {
      errors.push("semantic element: native root metadata is missing");
    }
  } else if (!compositeContracts.has(semanticElement)) {
    const expectedRole = expectedRoles[semanticElement];
    const expectedTag = expectedTags[semanticElement];
    if (expectedRole && actualRole !== expectedRole) {
      errors.push(`semantic element: expected ${semanticElement}, received ${actualRole ?? root.tag}`);
    } else if (expectedTag && !expectedTag.includes(root.tag)) {
      errors.push(`semantic element: expected ${semanticElement}, received ${root.tag}`);
    }
    if (
      semanticElement === "input[type=checkbox]" &&
      (root.tag !== "input" || root.attributes?.type !== "checkbox")
    ) {
      errors.push("semantic element: expected input[type=checkbox]");
    }
  }
  if (fixture.contract?.accessibleRole && actualRole !== fixture.contract.accessibleRole) {
    errors.push(`accessible role: expected ${fixture.contract.accessibleRole}`);
  }
  const checkRequirement = (label, target, requirement) => {
    const [name, inlineExpected] = String(requirement).split("=", 2);
    const actual = target.attributes?.[name];
    if (inlineExpected === undefined) {
      if (actual === undefined || actual === "") {
        errors.push(`${label}: required attribute ${name} is missing`);
      }
      return;
    }
    if (actual !== inlineExpected) {
      errors.push(
        `${label}: required attribute ${name}: expected ${inlineExpected}, received ${actual ?? "<missing>"}`,
      );
    }
  };
  for (const [rawName, expected] of Object.entries(fixture.contract?.requiredAttributes ?? {})) {
    const targets = Array.isArray(groups[rawName]) ? groups[rawName] : [root];
    const requirements = Array.isArray(expected)
      ? expected
      : typeof expected === "boolean"
        ? expected
          ? [rawName]
          : []
        : typeof expected === "string" && !expected.includes("=")
          ? [`${rawName}=${expected}`]
          : [expected];
    if (targets.length === 0) {
      errors.push(`${rawName}: required element group is missing`);
      continue;
    }
    for (const [index, target] of targets.entries()) {
      for (const requirement of requirements) {
        checkRequirement(`${rawName}[${index}]`, target, requirement);
      }
    }
  }
  for (const requirement of fixture.contract?.forbiddenAttributes ?? []) {
    const [name, forbiddenValue] = requirement.split("=", 2);
    const actual = root.attributes?.[name];
    if (actual !== undefined && (forbiddenValue === undefined || actual === forbiddenValue)) {
      errors.push(`forbidden attribute present: ${requirement}`);
    }
  }
  return errors;
};

export const requiredChecks = [
  "render",
  "dom",
  "accessibility",
  "behavior",
  "form",
  "visual",
  "contract",
];

// Assemble the full { checks, status } verdict for a state from captured
// upstream + framework snapshots. Runs in the browser. The behaviour check is
// computed from the fixture actions and the framework DOM verdict (mirrors the
// legacy runtime: with actions it passes iff the DOM matches; without actions
// it passes trivially) plus the events captured on the framework.
export const judgeState = (fixture, state, { upstream, framework, frameworkEvents }) => {
  const fullDom = compareDom(upstream.dom, framework.dom);
  // Only ship the normalized expected/actual snapshots when they differ; for a
  // passing comparison they are pure IPC weight.
  const dom = fullDom.passed
    ? { passed: true }
    : { passed: false, expected: fullDom.expected, actual: fullDom.actual };
  const form = {
    passed:
      JSON.stringify(upstream.semantics?.form ?? {}) ===
      JSON.stringify(framework.semantics?.form ?? {}),
    expected: upstream.semantics?.form ?? {},
    actual: framework.semantics?.form ?? {},
  };
  const visual = compareVisualSignatures(upstream.visualSignature, framework.visualSignature);
  const contractErrors = [
    ...runContractChecks(fixture, framework.contractSemantics).map((error) => `framework: ${error}`),
    ...runContractChecks(fixture, upstream.contractSemantics).map((error) => `upstream: ${error}`),
  ];
  const literalAccessibility = upstream.accessibility;
  const frameworkAccessibility = framework.accessibility;
  const accessibilityPassed =
    JSON.stringify(literalAccessibility) === JSON.stringify(frameworkAccessibility);
  const accessibility = accessibilityPassed
    ? { passed: true }
    : {
        passed: false,
        literalPassed: false,
        errors: ["accessibility tree differs between upstream and framework"],
      };
  const actions = stateActionsOf(state);
  const behavior = {
    passed: actions.length === 0 || dom.passed,
    actions,
    events: frameworkEvents ?? [],
  };
  const checks = {
    render: { passed: true },
    dom,
    accessibility,
    behavior,
    form,
    visual,
    contract: { passed: contractErrors.length === 0, errors: contractErrors },
  };
  const passed = requiredChecks.every((check) => checks[check].passed);
  return { status: passed ? "passing" : "failing", checks };
};

// Mirror of runtime.mjs `stateActions`: fixture setup + state-derived actions.
export const stateActionsOf = (state) => {
  const actions = [...(state.setup ?? [])];
  if (state.id === "hover" && !actions.some((step) => step.action === "hover")) {
    actions.push({ action: "hover", target: "fixture" });
  }
  if (state.id === "focus-visible" && !actions.some((step) => step.action === "keyboard-focus")) {
    actions.push({ action: "keyboard-focus", target: "fixture" });
  }
  if (state.id === "active" && !actions.some((step) => step.action === "pointer-down")) {
    actions.push({ action: "pointer-down", target: "fixture" });
  }
  return actions;
};
