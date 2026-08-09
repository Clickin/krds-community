import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { componentExamples } from "../apps/docs/src/data/example-catalog";
import { componentNavigation } from "../apps/docs/src/data/component-meta";
import { allPatterns } from "../apps/docs/src/data/patterns";
import remarkFrameworkPreview from "../apps/docs/remark-framework-preview.mjs";

const root = resolve(import.meta.dirname, "..");
const docsRoot = resolve(root, "apps/docs/src");

const internalLinkPattern =
  /\]\(\/(?:storybook|conformance|components|service-patterns|basic-patterns|guides|getting-started)/;

describe("docs route coverage", () => {
  it("assigns deterministic unique preview ids per document occurrence", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "FrameworkPreview",
          attributes: [{ type: "mdxJsxAttribute", name: "title", value: "반복 예제" }],
          children: [],
        },
        {
          type: "mdxJsxFlowElement",
          name: "FrameworkPreview",
          attributes: [{ type: "mdxJsxAttribute", name: "title", value: "반복 예제" }],
          children: [],
        },
      ],
    } as any;
    const transform = remarkFrameworkPreview();
    transform(tree);
    const ids = tree.children.map(
      (node) => node.attributes.find((attribute) => attribute.name === "previewId").value,
    );
    expect(ids).toEqual(["fp-반복-예제-1", "fp-반복-예제-2"]);
  });

  it("publishes one fixture-backed page for every upstream catalog component", () => {
    expect(componentNavigation.length).toBe(88);
    expect(componentExamples.length).toBe(76);
    const upstreamIds = new Set(componentExamples.map((component) => component.id));
    expect(
      componentNavigation
        .filter((component) => !upstreamIds.has(component.id))
        .map((component) => component.id)
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
    for (const component of componentExamples) {
      expect(component.fixture.states.length).toBeGreaterThan(0);
    }
  });

  it("keeps every pattern linked to an official checklist and stage", () => {
    expect(allPatterns.length).toBe(18);
    for (const pattern of allPatterns) {
      expect(pattern.officialChecklist).toMatch(/^https:\/\//);
      expect(pattern.officialStageLinks.length).toBeGreaterThan(0);
      expect(pattern.officialVersionBoundary).toContain("snapshot");
    }
  });

  it("publishes a content page for every pattern", () => {
    for (const pattern of allPatterns) {
      const dir = pattern.category === "서비스 패턴" ? "service-patterns" : "basic-patterns";
      const page = resolve(docsRoot, `content/docs/${dir}/${pattern.slug}.mdx`);
      expect(existsSync(page), `missing pattern page: ${dir}/${pattern.slug}.mdx`).toBe(true);
    }
  });

  it("keeps every pattern example mdx-owned: PatternReference inline, no workbench dispatch", async () => {
    for (const pattern of allPatterns) {
      const dir = pattern.category === "서비스 패턴" ? "service-patterns" : "basic-patterns";
      const page = resolve(docsRoot, `content/docs/${dir}/${pattern.slug}.mdx`);
      const content = await readFile(page, "utf8");
      expect(content).toContain("<PatternReference patternId=");
      expect(content).not.toContain("PatternWorkbench");
      expect(content).not.toContain("pattern-examples");
    }
  });

  it("does not emit root-relative internal links that bypass the configured base", async () => {
    const files = [
      resolve(docsRoot, "content/docs/index.mdx"),
      resolve(docsRoot, "content/docs/components/index.mdx"),
      resolve(docsRoot, "content/docs/service-patterns/index.md"),
      resolve(docsRoot, "content/docs/basic-patterns/index.md"),
      resolve(docsRoot, "content/docs/getting-started/installation.mdx"),
    ];
    const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
    expect(contents.some((content) => internalLinkPattern.test(content))).toBe(false);
  });
});
