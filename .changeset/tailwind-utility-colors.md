---
"@krds-community/styles": minor
---

Wrap the shipped KRDS component CSS in `@layer components` so Tailwind CSS
utilities (loaded in `@layer utilities`, which sorts after components) can
override component styles. Consumers can now recolor components with standard
Tailwind color classes — `bg-red-500`, `text-blue-500`, arbitrary values like
`bg-[#ff00aa]` — instead of being locked to the built-in variants.

Behavior notes:

- Components without utility classes render identically (verified: control
  button keeps the primary fill).
- Rules the upstream CSS protects with `!important` keep winning over
  utilities: the `:focus` outline (a11y), screen-reader helpers, and icon
  color rules. Remove those with your own unlayered CSS, not utilities.
- Layer order is fixed by first appearance, so utilities win regardless of
  whether the component CSS or `@import "tailwindcss"` loads first.
- Browser support: CSS cascade layers require Chrome 99+, Safari 15.4+,
  Firefox 97+ (2022).
