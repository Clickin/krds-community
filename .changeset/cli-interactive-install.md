---
"@krds-community/krds-cli": minor
---

Add an interactive wizard in Korean (`krds` with no arguments). `component copy` now installs
missing `@krds-community` dependencies automatically (@krds-community/styles,
@krds-community/recipes; extra components also include the framework package);
`--exclude-required-component` opts out, and `--package-manager` selects the install package
manager (pnpm, npm, yarn, bun, deno).
