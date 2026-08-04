import { describe, expect, it } from "vitest";
import {
  buildReport,
  frameworks,
  toHtml,
  toJUnit,
  toMarkdown,
  type ManifestSummary,
} from "@krds-community/conformance";

const manifests: ManifestSummary[] = [
  {
    id: "button",
    status: "implemented",
    fixtureCount: 1,
    mandatoryFixtureCount: 1,
    sourceFiles: ["button.html"],
    accessibilityRequirements: ["native-button-keyboard"],
  },
  {
    id: "remaining",
    status: "unmapped",
    fixtureCount: 1,
    mandatoryFixtureCount: 1,
    sourceFiles: ["remaining.html"],
    accessibilityRequirements: [],
  },
];

describe("conformance status accounting", () => {
  it("includes Astro as the sixth native framework", () => {
    expect(frameworks).toEqual(["react", "vue", "svelte", "solid", "angular", "astro"]);
  });

  it("does not count implemented or unmapped manifests as strict passing", () => {
    const report = buildReport(manifests, {
      repository: "KRDS-uiux/krds-uiux",
      ref: "1.1.0",
      commit: "commit",
      packageVersion: "1.1.0",
    });
    expect(report.strictConformance).toBe(false);
    expect(report.frameworks[0]).toMatchObject({
      inventory: 2,
      implemented: 1,
      strictPassing: 0,
      waived: 0,
    });
  });

  it("does not treat an explicit passing catalog status as runtime evidence", () => {
    const report = buildReport([{ ...manifests[0]!, status: "passing" }], {
      repository: "KRDS-uiux/krds-uiux",
      ref: "1.1.0",
      commit: "commit",
      packageVersion: "1.1.0",
    });
    expect(report.strictConformance).toBe(false);
    expect(report.frameworks.every((summary) => summary.evidenceStatus === "unverified")).toBe(
      true,
    );
    expect(report.frameworks[0]?.strictPassing).toBe(0);
  });

  it("requires complete fixture evidence for every framework to pass strictly", () => {
    const manifest = { ...manifests[0]!, status: "passing" as const, fixtureIds: ["button#1"] };
    const evidence = frameworks.map((framework) => ({
      framework,
      status: "passing" as const,
      fixtureResults: [{ fixtureId: "button#1", status: "passing" as const }],
      unresolvedSelectors: [],
      errata: [],
      errors: [],
    }));
    const report = buildReport(
      [manifest],
      {
        repository: "KRDS-uiux/krds-uiux",
        ref: "1.1.0",
        commit: "commit",
        packageVersion: "1.1.0",
      },
      evidence,
    );
    expect(report.strictConformance).toBe(true);
    expect(report.frameworks.every((summary) => summary.strictPassing === 1)).toBe(true);
  });

  it("keeps Astro unverified when current evidence covers only five frameworks", () => {
    const fixtureIds = Array.from({ length: 85 }, (_, index) => `button#${index + 1}`);
    const evidence = frameworks
      .filter((framework) => framework !== "astro")
      .map((framework) => ({
        framework,
        status: "passing" as const,
        fixtureResults: fixtureIds.map((fixtureId) => ({
          fixtureId,
          status: "passing" as const,
        })),
        unresolvedSelectors: [],
        errata: [],
        errors: [],
      }));
    const report = buildReport(
      [
        {
          ...manifests[0]!,
          status: "passing",
          fixtureCount: fixtureIds.length,
          mandatoryFixtureCount: fixtureIds.length,
          fixtureIds,
        },
      ],
      {
        repository: "KRDS-uiux/krds-uiux",
        ref: "1.1.0",
        commit: "commit",
        packageVersion: "1.1.0",
      },
      evidence,
    );

    expect(report.evidenceCount).toBe(fixtureIds.length * (frameworks.length - 1));
    expect(report.strictConformance).toBe(false);
    expect(report.frameworks.find((summary) => summary.framework === "astro")).toMatchObject({
      evidenceCount: 0,
      evidenceStatus: "unverified",
      strictPassing: 0,
    });
  });

  it("renders human-readable reports in Korean", () => {
    const report = buildReport(manifests, {
      repository: "KRDS-uiux/krds-uiux",
      ref: "1.1.0",
      commit: "commit",
      packageVersion: "1.1.0",
    });
    expect(toMarkdown(report)).toContain("# KRDS conformance 리포트");
    expect(toHtml(report)).toContain('<html lang="ko">');
    expect(toHtml(report)).toContain("프레임워크");
  });
  it("uses expected fixture count, not manifest count, as the JUnit denominator", () => {
    const report = buildReport(
      [
        {
          ...manifests[0]!,
          fixtureCount: 2,
          mandatoryFixtureCount: 2,
          fixtureIds: ["button#1", "button#2"],
        },
      ],
      {
        repository: "KRDS-uiux/krds-uiux",
        ref: "1.1.0",
        commit: "commit",
        packageVersion: "1.1.0",
      },
    );
    expect(toJUnit(report)).toContain('<testsuites tests="12" failures="12">');
  });
});
