# Deferred work

## KRDS practice wireframes as framework source (필수)

**Status:** completed (2026-08-04).

Every practice section in the docs renders real framework source with a live
preview AND per-framework code — composed from existing canonical package
components (the shown source doubles as the "compose it like this" example).
No image assets were added.

### Coverage

- **68 component pages** (components/*, design/*): 413 practice labels →
  413 `<PracticeExample kind="good|bad" title="…">` blocks, 6 framework slots
  each. Design/live-only pages compose existing package components wherever
  one exists (Button/Modal/TextInput/Spinner/…); native semantic markup only
  where the package has no component (range slider, tab bar, media).
- **18 basic/service pattern pages** (basic-patterns/*, service-patterns/*):
  129 practice labels → 129 PracticeExample blocks (6 slots + 6 `fw=` code
  fences), plus official description copies (구조/유형/사용성 가이드라인 with
  필수/권장/우수 levels) from the pinned official snapshot, keeping the
  `<PatternReference>` official links.
- **`PracticeExample` now renders source code**: the remark plugin
  (apps/docs/remark-framework-preview.mjs) collects `fw=` fenced blocks inside
  PracticeExample into a `code` prop; the component renders a code panel under
  the active framework tab, synced with the preview. Existing blocks without
  fences render preview-only (backward compatible).

### Verified

- 413 + 129 = 542 practice blocks; every block has 6 preview slots and
  (where authored) 6 code fences; labels == blocks per file; no bare labels.
- No `![](...)`/`src=`/`krds-official` image references in docs content.
- `pnpm docs:build` passes: 134 pages; `pnpm lint` (astro check) and
  `pnpm format:check` clean.
- Browser spot-check: service-patterns/login, basic-patterns/detail,
  components/live-only/back, design/colors — badges/titles match labels,
  6 framework tabs, code panel follows the selected tab, no console errors.
