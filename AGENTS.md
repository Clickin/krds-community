# AGENTS.md

## Project mission

This repository provides community-maintained, framework-native implementations of KRDS for React, Vue, Svelte, SolidJS, and Angular.

The official KRDS HTML Component Kit is the normative source of truth. Framework packages are implementations of that specification, not independent reinterpretations.

## Non-negotiable rules

1. Never edit `upstream/krds-html/**` manually.
2. Never use a framework implementation as the normative specification.
3. Never describe this project as an official government implementation.
4. Never describe KRDS source materials as public domain.
5. Preserve KRDS attribution required by KOGL Type 1.
6. Original community code is licensed under Apache-2.0.
7. Never mark a component conformant without a passing conformance manifest.
8. Never weaken an accessibility requirement to make a screenshot or DOM comparison pass.
9. Never duplicate design-token values manually inside framework packages.
10. Never build framework packages on top of Web Components.
11. Never hide incomplete work behind skipped tests, broad snapshot updates, or undocumented waivers.
12. Never publish packages manually as the normal release process.

## Source-of-truth hierarchy

When sources conflict, use this precedence:

1. official KRDS component guidance and accessibility requirements
2. pinned official KRDS HTML Component Kit snapshot
3. official KRDS design tokens
4. declared conformance contracts and approved errata
5. shared recipes and behavioral test vectors
6. framework implementations
7. examples and documentation

An apparent upstream defect must not be silently corrected.

Instead:

1. record it in `conformance/errata/`,
2. preserve the original upstream fixture,
3. add a narrowly scoped patch contract,
4. explain whether the implementation follows the literal source or the accessibility-corrected behavior,
5. link the relevant upstream report or issue when available.

## Repository boundaries

### Generated and immutable

Do not hand-edit:

* `upstream/krds-html/**`
* generated token files
* generated source inventories
* generated conformance reports
* generated API matrices
* lockfiles except through package-manager commands

### Shared packages

`@krds-community/tokens`

* owns primitive, semantic, and component tokens
* owns token metadata and provenance
* contains no framework code

`@krds-community/styles`

* owns opt-in foundation CSS and shared CSS variables
* must not unexpectedly reset consumer applications

`@krds-community/tailwind`

* owns Tailwind CSS theme integration
* must use stable, statically discoverable class definitions

`@krds-community/recipes`

* owns typed class recipes
* contains no DOM access, component state, JSX, templates, or framework imports

`@krds-community/conformance`

* owns manifest schemas, normalization rules, test orchestration, and reports
* must not special-case a framework merely to produce a passing score

### Framework packages

Framework packages own:

* native component markup
* framework-native state and lifecycle
* event adaptation
* refs
* slots or children
* forms integration
* SSR and hydration integration

Framework packages must not own canonical token values or redefine KRDS requirements.

## Framework-native requirements

### React

* forward supported native attributes
* preserve native event behavior
* expose useful native element refs
* support controlled and uncontrolled modes where appropriate
* do not access browser globals at import time

### Vue

* use typed props, emits, and slots
* support idiomatic model binding
* forward attributes intentionally
* avoid unnecessary watchers

### Svelte

* use current stable Svelte conventions
* expose bindable values only where semantically valid
* preserve native event and form behavior
* avoid module-evaluation browser access

### SolidJS

* preserve fine-grained reactivity
* do not destructure reactive props directly when it loses tracking
* prefer derived accessors over synchronized duplicate state
* expose native refs
* clean up all listeners and effects

### Angular

* use standalone components
* implement `ControlValueAccessor` for applicable form controls
* support Angular reactive forms
* use signals only where they improve the public or internal model
* guard browser-only APIs for SSR

## Component workflow

Before changing or adding a component:

1. Read its upstream manifest.
2. Inspect every associated official fixture.
3. Inspect its states, variants, responsive behavior, and accessibility guidance.
4. Inspect existing implementations in all frameworks.
5. Identify whether the change belongs in tokens, styles, recipes, contracts, or a specific framework.
6. Add or update tests before claiming completion.

A component implementation is complete only when:

* all mandatory fixtures are mapped,
* required variants and states are implemented,
* semantic tests pass,
* keyboard and focus tests pass,
* form tests pass where applicable,
* visual tests pass,
* all supported framework packages pass,
* documentation and the capability matrix are updated.

## HTML conformance

Do not compare serialized HTML strings.

Normalize only explicitly non-semantic differences such as:

* generated IDs
* attribute order
* framework bookkeeping attributes
* comments
* approved harmless wrappers

Do not normalize:

* native element selection
* accessible roles
* accessible names
* heading levels
* label relationships
* focus order
* `aria-*` state
* form submission behavior
* keyboard behavior
* visible component hierarchy

Prefer native HTML semantics over redundant ARIA.

Do not add `role="button"` to a native `<button>`.

Do not implement custom Enter or Space activation for a native `<button>` unless a verified browser defect requires it.

## Styling rules

All canonical design values originate from tokens.

Framework components consume shared recipes and may append consumer classes to the intended native element.

The public API must make class placement explicit when a component has multiple meaningful elements:

```ts
classes?: {
  root?: string;
  control?: string;
  label?: string;
  description?: string;
  error?: string;
}
```

Do not rely on undocumented internal selectors.

Do not concatenate arbitrary Tailwind utility fragments such as:

```ts
`bg-${color}-${shade}`
```

Use complete static class mappings.

Consumer overrides must not accidentally remove required focus indicators or accessible states.

## Accessibility

Accessibility is a functional requirement.

At minimum, verify:

* semantic element choice
* accessible name
* label and description relationships
* keyboard operation
* focus visibility
* focus order
* focus restoration
* disabled semantics
* invalid and error semantics
* expanded, selected, checked, and pressed states
* reduced motion
* forced-colors behavior
* touch target behavior where specified

Automated axe checks are necessary but insufficient.

## Testing rules

Do not update snapshots without reviewing the rendered difference.

Do not use arbitrary visual thresholds to hide regressions.

Every interaction test must assert observable outcomes.

Every fixed bug requires a regression test in the narrowest appropriate layer.

Cross-framework tests must use the same conformance scenario identifiers.

Required local validation before finishing a change:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:conformance
pnpm build
```

Run visual and cross-browser suites when the change affects markup, styling, focus, animation, responsive behavior, or browser APIs.

## Dependencies

Before adding a dependency:

1. verify that the platform or existing workspace dependency cannot solve the problem,
2. check maintenance and license,
3. estimate runtime and package-size impact,
4. prefer development-only dependencies for build and test tooling,
5. avoid framework dependencies in shared packages,
6. declare frontend frameworks as peer dependencies.

Do not introduce a runtime abstraction merely to eliminate a few lines of framework-specific markup.

## Versioning

Use Changesets for user-visible changes.

Treat these as potentially breaking:

* public prop or event changes
* changed native element refs
* class placement changes
* DOM changes consumers may reasonably depend on
* removed token names
* changed form behavior
* changed default accessibility behavior
* changed package exports

Conformance fixes may still be breaking changes. Describe them accurately.

## Upstream updates

When updating KRDS:

1. run `pnpm upstream:check`,
2. sync the exact source snapshot,
3. inspect the generated upstream diff,
4. regenerate inventories and manifests,
5. review token changes,
6. update affected contracts,
7. run every framework conformance suite,
8. publish an upstream-impact report.

Do not combine an upstream update with unrelated refactoring.

## Reporting

Final work reports must separate:

* completed and verified
* implemented but not fully verified
* incomplete
* blocked by upstream ambiguity
* intentionally deferred

Never state “100% conformant” without citing the generated conformance report and its upstream source revision.

