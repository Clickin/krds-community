---
"@krds-community/react": patch
"@krds-community/vue": patch
"@krds-community/svelte": patch
"@krds-community/solid": patch
"@krds-community/angular": patch
"@krds-community/astro": patch
---

HelpPanel/TutorialPanel fold button no longer renders a redundant `aria-label`: the accessible name already comes from the sr-only label plus the fold text. TtsIcon omits the `sr-only` span / `aria-label` when the label is empty (matches the React reference). Angular breadcrumb default `aria-label` is now `현재 경로`, and in-page navigation items with `current: true` render `class="active"`. Astro main menu nav falls back to `menuLabel` for its `aria-label`. Svelte Tooltip appends the trailing space before the angle icon for plain-string children, matching the React reference.
