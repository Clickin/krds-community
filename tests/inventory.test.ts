import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { frameworks, loadFixtureManifests, loadManifests } from "@krds-community/conformance";
import { fixtureRootAttributes } from "../apps/conformance-host/src/protocol";

const root = resolve(import.meta.dirname, "..");
const inventoryNames = [
  "Accordion",
  "AccordionLine",
  "Alert",
  "Badge",
  "BadgeNumber",
  "BadgeSize",
  "Breadcrumb",
  "BottomSheet",
  "Button",
  "ButtonHierarchy",
  "ButtonIcon",
  "ButtonSize",
  "ButtonText",
  "ButtonWithIcon",
  "Calendar",
  "CalendarRange",
  "Card",
  "Carousel",
  "CarouselBanner",
  "Checkbox",
  "CheckboxChip",
  "CheckboxSize",
  "Chip",
  "CoachMark",
  "ContextualHelp",
  "CriticalAlerts",
  "DateInput",
  "Disclosure",
  "Favicon",
  "FileUpload",
  "Footer",
  "Header",
  "HelpPanel",
  "Identifier",
  "Infobox",
  "InPageNavigation",
  "LanguageSwitcher",
  "LanguageSwitcherPage",
  "Link",
  "MainMenuMobile",
  "MainMenuPc",
  "Masthead",
  "Modal",
  "ModalSample",
  "Pagination",
  "ProgressBar",
  "Radio",
  "RadioButton",
  "RadioChip",
  "RadioSize",
  "Resize",
  "Search",
  "Select",
  "SelectSize",
  "SelectSorting",
  "SelectState",
  "SideNavigation",
  "SkipLink",
  "Snackbar",
  "Spinner",
  "StepIndicator",
  "StructuredList",
  "StructuredListTable",
  "Switch",
  "Tab",
  "TabBar",
  "Table",
  "Tag",
  "TagLink",
  "TextInput",
  "TextInputIcon",
  "TextInputSize",
  "TextInputState",
  "TextList",
  "TextListOrdered",
  "Textarea",
  "Toast",
  "ToggleSwitch",
  "ToggleSwitchSize",
  "Tooltip",
  "TooltipBox",
  "TooltipVertical",
  "TopButton",
  "Tts",
  "TtsIcon",
  "TtsSize",
  "TutorialPanel",
  "UserFeedback",
] as const;

describe("KRDS component inventory", () => {
  it("keeps every upstream manifest mapped to a mandatory fixture", async () => {
    const manifests = await loadManifests(resolve(root, "conformance/manifests"));
    expect(manifests).toHaveLength(86);
    const assessable = manifests.filter((manifest) => manifest.status !== "no-upstream");
    expect(assessable).toHaveLength(74);
    expect(assessable.every((manifest) => manifest.status !== "unmapped")).toBe(true);
    expect(assessable.every((manifest) => manifest.fixtureCount > 0)).toBe(true);
    expect(assessable.every((manifest) => manifest.mandatoryFixtureCount > 0)).toBe(true);
    expect(assessable.every((manifest) => manifest.accessibilityRequirements.length > 0)).toBe(
      true,
    );
    expect(
      manifests
        .filter((manifest) => manifest.status === "no-upstream")
        .map((manifest) => manifest.id)
        .sort(),
    ).toEqual([
      "alert",
      "bottom-sheet",
      "card",
      "chip",
      "infobox",
      "progress-bar",
      "search",
      "snackbar",
      "tab-bar",
      "toast",
      "top-button",
      "user-feedback",
    ]);
    expect(
      manifests
        .filter((manifest) => manifest.status === "no-upstream")
        .every((manifest) => manifest.fixtureCount === 0),
    ).toBe(true);
  });
  it("loads executable fixture states with deterministic viewport and comparisons", async () => {
    const manifests = await loadFixtureManifests(resolve(root, "conformance/manifests"));
    const fixtures = manifests.flatMap((manifest) => manifest.fixtures);
    expect(fixtures).toHaveLength(82);
    expect(new Set(fixtures.map((fixture) => fixture.id)).size).toBe(fixtures.length);
    expect(
      fixtures.every(
        (fixture) =>
          fixture.states.length > 0 &&
          fixture.viewport.width > 0 &&
          fixture.viewport.height > 0 &&
          fixture.comparisons.dom === "strict" &&
          (fixture.comparisons.visual === "exact" || fixture.id === "favicon.default") &&
          fixture.comparisons.accessibility === "strict",
      ),
    ).toBe(true);

    const primaryButton = fixtures.find(
      (fixture) => fixture.id === "button.primary.medium.default",
    );
    expect(primaryButton).toMatchObject({
      sourceSelector: ".krds-btn.primary",
      sourceIndex: 0,
      viewport: { name: "desktop", width: 1280, height: 800 },
      props: { variant: "primary", size: "medium" },
    });
    expect(primaryButton?.states.map((state) => state.id)).toEqual([
      "default",
      "hover",
      "focus-visible",
      "active",
      "disabled",
    ]);
  });

  it("keeps every extra state strict across all six frameworks", async () => {
    const manifests = await loadFixtureManifests(resolve(root, "extra/manifests"));
    const fixtures = manifests.flatMap((manifest) => manifest.fixtures);
    expect(manifests).toHaveLength(3);
    expect(fixtures).toHaveLength(9);
    expect(fixtures.flatMap((fixture) => fixture.states)).toHaveLength(9);
    expect(
      fixtures.every(
        (fixture) =>
          fixture.mandatory &&
          fixture.comparisons.dom === "strict" &&
          fixture.comparisons.accessibility === "strict",
      ),
    ).toBe(true);
    expect(fixtures.length * frameworks.length).toBe(54);
  });
  it("keeps calendar fixture roots paired with the calendar visual surface", async () => {
    const fixtures = (await loadFixtureManifests(resolve(root, "conformance/manifests"))).flatMap(
      (manifest) => manifest.fixtures,
    );
    for (const fixtureId of ["calendar.default", "calendar-range.default"]) {
      expect(fixtures.find((fixture) => fixture.id === fixtureId)).toMatchObject({
        sourceSelector: ".krds-calendar-area",
        visualSelector: ".calendar-wrap",
      });
    }
    expect(fixtures.find((fixture) => fixture.id === "date-input.default")).toMatchObject({
      sourceSelector: ".form-group",
      visualSelector: ".calendar-wrap",
    });
    expect(fixtures.find((fixture) => fixture.id === "modal.default")).toMatchObject({
      sourceSelector: '.krds-modal[role="dialog"]',
      visualSelector: ".modal-dialog",
    });
  });
  it("captures select labels and descriptions with their native controls", async () => {
    const fixtures = (await loadFixtureManifests(resolve(root, "conformance/manifests"))).flatMap(
      (manifest) => manifest.fixtures,
    );
    for (const fixtureId of ["select.default", "select-size.default", "select-state.default"]) {
      expect(fixtures.find((fixture) => fixture.id === fixtureId)).toMatchObject({
        sourceSelector: ".krds-form-select",
        sourceAncestorSelector: ".form-group",
      });
    }
  });

  it("declares the exact shared layout context applied by both fixture hosts", async () => {
    const fixtures = (await loadFixtureManifests(resolve(root, "conformance/manifests"))).flatMap(
      (manifest) => manifest.fixtures,
    );
    expect(fixtures.filter((fixture) => fixture.layoutContext)).toHaveLength(2);

    const carousel = fixtures.find((fixture) => fixture.id === "carousel-banner.default")!;
    expect(carousel.layoutContext).toBe("content-inner");
    expect(fixtureRootAttributes(carousel)).toEqual({
      class: "inner",
      "data-layout-context": "content-inner",
    });

    const mobileMenu = fixtures.find((fixture) => fixture.id === "main-menu-mobile.default")!;
    expect(mobileMenu.layoutContext).toBe("viewport-height");
    expect(fixtureRootAttributes(mobileMenu)).toEqual({
      "data-layout-context": "viewport-height",
    });

    const button = fixtures.find((fixture) => fixture.id === "button.primary.medium.default")!;
    expect(fixtureRootAttributes(button)).toEqual({});
  });

  it("keeps native focus in wrapper focus-proxy states", async () => {
    const fixtures = (await loadFixtureManifests(resolve(root, "conformance/manifests"))).flatMap(
      (manifest) => manifest.fixtures,
    );
    for (const fixtureId of [
      "checkbox-chip.default",
      "toggle-switch.default",
      "toggle-switch-size.default",
    ]) {
      const focusState = fixtures
        .find((fixture) => fixture.id === fixtureId)
        ?.states.find((state) => state.id === "focus-visible");
      expect(focusState?.setup).toEqual([
        { action: "keyboard-focus", target: "fixture" },
        { action: "add-class", target: "fixture", value: "focus" },
      ]);
    }
  });

  it("treats every official HTML fixture as mapped before runtime evidence", async () => {
    const inventory = JSON.parse(
      await readFile(resolve(root, "conformance/generated/source-inventory.json"), "utf8"),
    ) as { components?: Array<{ source?: string; status?: string }> };
    const officialFiles = (await readdir(resolve(root, "upstream/krds-html/html/code"))).filter(
      (entry) => entry.endsWith(".html"),
    );
    expect(inventory.components).toHaveLength(officialFiles.length);
    expect(inventory.components?.every((component) => component.status === "mapped")).toBe(true);
    expect(new Set(inventory.components?.map((component) => component.source)).size).toBe(
      officialFiles.length,
    );
  });

  it("publishes the common props contract from recipes", async () => {
    const source = await readFile(resolve(root, "packages/recipes/src/components.ts"), "utf8");
    expect(source).toContain("export interface KrdsAdditionalProps");
    for (const prop of [
      "label",
      "title",
      "description",
      "disabled",
      "modelValue",
      "options",
      "items",
    ]) {
      expect(source).toContain(`  ${prop}?`);
    }
  });

  it("keeps the public component names aligned across framework packages", async () => {
    const sources = await Promise.all([
      readFile(resolve(root, "packages/react/src/index.ts"), "utf8"),
      readFile(resolve(root, "packages/vue/src/index.ts"), "utf8"),
      readFile(resolve(root, "packages/svelte/src/index.js"), "utf8"),
      readFile(resolve(root, "packages/solid/src/index.tsx"), "utf8"),
      readFile(resolve(root, "packages/angular/src/index.ts"), "utf8"),
      readFile(resolve(root, "packages/astro/src/index.js"), "utf8"),
    ]);
    for (const name of inventoryNames) {
      expect(sources[0]).toContain(name);
      expect(sources[1]).toContain(name);
      expect(sources[2]).toContain(name);
      expect(sources[3]).toContain(name);
      expect(sources[4]).toContain(`Krds${name}Component`);
    }
    const astroExports = [...sources[5]!.matchAll(/^export \{ default as (\w+) \}/gm)].map(
      (match) => match[1],
    );
    expect(astroExports).toHaveLength(inventoryNames.length);
    expect(new Set(astroExports)).toEqual(new Set(inventoryNames));
  });

  it("keeps manifest accessibility errata references traceable", async () => {
    const [manifestEntries, errataEntries] = await Promise.all([
      readdir(resolve(root, "conformance/manifests")),
      readdir(resolve(root, "conformance/errata")),
    ]);
    const [manifestTexts, errataTexts] = await Promise.all([
      Promise.all(
        manifestEntries
          .filter((entry) => entry.endsWith(".yaml"))
          .map((entry) => readFile(resolve(root, "conformance/manifests", entry), "utf8")),
      ),
      Promise.all(
        errataEntries
          .filter((entry) => entry.endsWith(".yaml"))
          .map((entry) => readFile(resolve(root, "conformance/errata", entry), "utf8")),
      ),
    ]);
    const references = manifestTexts.flatMap((text) => {
      const section = text.match(/^errata:\n((?:  - [^\n]+\n?)+)/m)?.[1] ?? "";
      return [...section.matchAll(/^  - ([^\s]+)$/gm)].map((match) => match[1]!);
    });
    const errataIds = new Set(
      errataTexts
        .map((text) => text.match(/^id:\s*(\S+)$/m)?.[1])
        .filter((id): id is string => Boolean(id)),
    );
    expect(references.length).toBeGreaterThan(0);
    expect(references.every((reference) => errataIds.has(reference))).toBe(true);
  });
});
