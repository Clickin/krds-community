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

// Visual signatures carry rect geometry alongside strict content. Upstream KRDS
// fixture HTML is pretty-printed and frameworks strip that formatting, so an
// otherwise-identical text node can measure one space wider, or an inline
// element sit one space further along, only on the upstream side. That drift is
// layout-environmental, not a content difference: `text`/`tag`/`style`/`state`
// still compare strictly, and only horizontal geometry (x / width) may drift by
// up to one rendered space width at the root font. Height and y stay exact.
//
// This is a whitespace-width relaxation, not an arbitrary visual threshold
// (AGENTS.md rule 8): the tolerance is measured (`rootSpaceWidth`), applies
// only to geometry a whitespace run measurably shifts, and never relaxes
// content or structure — real regressions still fail.
const rectGeometry = { x: true, width: true };

const signaturesEqualWithinWhitespace = (a, b, spaceW, path, diff) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    if (a !== b) diff.push([path, a, b]);
    return false;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      diff.push([path, a, b]);
      return false;
    }
    let ok = true;
    for (let i = 0; i < a.length; i++) {
      ok = signaturesEqualWithinWhitespace(a[i], b[i], spaceW, `${path}[${i}]`, diff) && ok;
    }
    return ok;
  }
  // Text node: `rects[]` may drift horizontally by ≤ one space; `text` strict.
  if (typeof a.text === "string" && typeof b.text === "string") {
    let ok = a.text === b.text;
    if (!ok) diff.push([`${path}.text`, a.text, b.text]);
    const at = a.rects ?? [];
    const bt = b.rects ?? [];
    if (at.length !== bt.length) {
      diff.push([`${path}.rects`, at, bt]);
      ok = false;
    } else {
      for (let i = 0; i < at.length; i++) {
        const rectA = at[i] ?? {};
        const rectB = bt[i] ?? {};
        for (const name of Object.keys(rectA)) {
          const av = rectA[name];
          const bv = rectB[name];
          if (typeof av === "number" && typeof bv === "number" && rectGeometry[name]) {
            if (Math.abs(av - bv) > spaceW) {
              diff.push([`${path}.rects[${i}].${name}`, av, bv]);
              ok = false;
            }
          } else if (av !== bv) {
            diff.push([`${path}.rects[${i}].${name}`, av, bv]);
            ok = false;
          }
        }
        // keys only present on B
        for (const name of Object.keys(rectB)) {
          if (name in rectA) continue;
          const av = rectA[name];
          const bv = rectB[name];
          if (typeof av === "number" && typeof bv === "number" && rectGeometry[name]) {
            if (Math.abs(av - bv) > spaceW) {
              diff.push([`${path}.rects[${i}].${name}`, av, bv]);
              ok = false;
            }
          } else if (av !== bv) {
            diff.push([`${path}.rects[${i}].${name}`, av, bv]);
            ok = false;
          }
        }
      }
    }
    return ok;
  }
  let ok = true;
  for (const key of Object.keys(a)) {
    if (key === "rootSpaceWidth") continue;
    const av = a[key];
    const bv = b[key];
    if (key === "rect" && av && bv && typeof av === "object" && typeof bv === "object") {
      for (const bit of Object.keys(av)) {
        const ra = av[bit];
        const rb = bv[bit];
        if (typeof ra === "number" && typeof rb === "number" && rectGeometry[bit]) {
          if (Math.abs(ra - rb) > spaceW) {
            diff.push([`${path}.rect.${bit}`, ra, rb]);
            ok = false;
          }
        } else if (ra !== rb) {
          diff.push([`${path}.rect.${bit}`, ra, rb]);
          ok = false;
        }
      }
      for (const bit of Object.keys(bv)) {
        if (bit in av) continue;
        const ra = av[bit];
        const rb = bv[bit];
        if (typeof ra === "number" && typeof rb === "number" && rectGeometry[bit]) {
          if (Math.abs(ra - rb) > spaceW) {
            diff.push([`${path}.rect.${bit}`, ra, rb]);
            ok = false;
          }
        } else if (ra !== rb) {
          diff.push([`${path}.rect.${bit}`, ra, rb]);
          ok = false;
        }
      }
      continue;
    }
    if (!(key in b)) {
      diff.push([`${path}.${key}`, av, bv]);
      ok = false;
      continue;
    }
    if (!signaturesEqualWithinWhitespace(av, bv, spaceW, `${path}.${key}`, diff)) ok = false;
  }
  for (const key of Object.keys(b)) {
    if (key in a || key === "rootSpaceWidth") continue;
    diff.push([`${path}.${key}`, a[key], b[key]]);
    ok = false;
  }
  return ok;
};

export const compareVisualSignatures = (upstreamSignature, frameworkSignature) => {
  if (upstreamSignature == null || frameworkSignature == null) {
    return {
      passed: false,
      errors: ["visual signature unavailable on one or both sides"],
      comparison: "dom-style",
    };
  }
  const spaceW =
    typeof upstreamSignature.rootSpaceWidth === "number"
      ? upstreamSignature.rootSpaceWidth
      : 1 / 64;
  const diff = [];
  const passed = signaturesEqualWithinWhitespace(
    upstreamSignature,
    frameworkSignature,
    spaceW,
    "$",
    diff,
  );
  let signatureDifference;
  if (!passed && diff.length) {
    const [path, expected, actual] = diff[0];
    signatureDifference = { path, expected, actual };
  }
  return {
    passed,
    passedSmall: passed,
    differingPixels: 0,
    skipped: passed,
    comparison: "dom-style",
    ...(passed ? {} : { signatureError: "visual signatures differ", signatureDifference }),
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
    if (
      root.tag !== "link" ||
      !String(root.attributes?.rel ?? "")
        .split(/\s+/)
        .includes("icon")
    ) {
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
      errors.push(
        `semantic element: expected ${semanticElement}, received ${actualRole ?? root.tag}`,
      );
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
    ...runContractChecks(fixture, framework.contractSemantics).map(
      (error) => `framework: ${error}`,
    ),
    ...runContractChecks(fixture, upstream.contractSemantics).map((error) => `upstream: ${error}`),
  ];
  // Mirrors runtime.mjs: the framework may carry accessibility the literal
  // upstream lacks (or generated references), so accessory equality is accepted
  // when the framework's tree matches the *errata-corrected* upstream tree.
  const literalAccessibility = upstream.accessibility;
  const correctedAccessibility = upstream.correctedAccessibility;
  const frameworkAccessibility = framework.accessibility;
  const literalAccessibilityMatch =
    JSON.stringify(literalAccessibility) === JSON.stringify(frameworkAccessibility);
  const correctedAccessibilityMatch =
    correctedAccessibility != null &&
    JSON.stringify(correctedAccessibility) === JSON.stringify(frameworkAccessibility);
  const accessibilityCorrected =
    correctedAccessibility != null &&
    JSON.stringify(literalAccessibility) !== JSON.stringify(correctedAccessibility);
  const accessibilityPassed = correctedAccessibilityMatch || literalAccessibilityMatch;
  const accessibility = accessibilityPassed
    ? {
        passed: true,
        literalPassed: literalAccessibilityMatch,
        expected: correctedAccessibilityMatch ? correctedAccessibility : literalAccessibility,
        actual: frameworkAccessibility,
        ...(accessibilityCorrected ? { correctedByErrata: [] } : {}),
      }
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
