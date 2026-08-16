---
"@krds-community/react": patch
"@krds-community/vue": patch
"@krds-community/svelte": patch
"@krds-community/solid": patch
"@krds-community/angular": patch
"@krds-community/astro": patch
---

Docs framework parity convergence (all 106 routes now pass the docs parity suite):

- React: structured list table pagination sr-only current-page label ends with a space, matching the upstream fixture.
- Vue: text input icon family uses instance-scoped ids (prevents cross-island id collisions) and wires `aria-describedby`/hint ids; `Badge` renders the `bg-light-*` class for `appearance="light"`; `ValidatedInput` ids are instance-scoped; `CriticalAlerts` derives the badge tone from `badge` when `tone` is absent; `ButtonText`/`ButtonWithIcon` honor `className`; `HelpPanel` fold renders the label as a single text node.
- Svelte: `Snackbar`, `Alert`, and `ProgressBar` templates no longer emit stray whitespace text nodes between inline elements; `CriticalAlerts` badge tone falls back to `badge`; structured list table pagination sr-only space.
- Solid: `Badge` light appearance; `CriticalAlerts` badge tone fallback; `HelpPanel` passes `label` through so the title-based accessible name wins, and download/related links render the label as a single text node; structured list table pagination sr-only space.
- Angular: `Switch` and `TextInput` forward `aria-label`; text input family omits an empty `placeholder` attribute and defaults to no size class (matching React); tooltip labels always include the trailing space before the icon; `CriticalAlerts` tone falls back to `badge`; structured list table pagination sr-only space.
- Astro: `ModalSample` defaults `closeLabel` to `닫기`; `Switch` always renders its label; `Select` renders the hint only when a hint prop is present; `Textarea` no longer renders an internal character counter (the docs supply their own) and the hint paragraph carries no `form-hint` class; file upload input forwards `aria-label`; `Header` my-menu button gains `aria-controls` and the drop-top is unconditional; `BadgeNumber` defaults to the outline appearance; structured list table pagination sr-only space.
