import { describe, expect, it } from 'vitest';
import { buildReport, toHtml, toMarkdown, type ManifestSummary } from '@krds-community/conformance';

const manifests: ManifestSummary[] = [
  {
    id: 'button',
    status: 'implemented',
    fixtureCount: 1,
    mandatoryFixtureCount: 1,
    sourceFiles: ['button.html'],
    accessibilityRequirements: ['native-button-keyboard'],
  },
  {
    id: 'remaining',
    status: 'unmapped',
    fixtureCount: 1,
    mandatoryFixtureCount: 1,
    sourceFiles: ['remaining.html'],
    accessibilityRequirements: [],
  },
];

describe('conformance status accounting', () => {
  it('does not count implemented or unmapped manifests as strict passing', () => {
    const report = buildReport(manifests, {
      repository: 'KRDS-uiux/krds-uiux',
      ref: '1.1.0',
      commit: 'commit',
      packageVersion: '1.1.0',
    });
    expect(report.strictConformance).toBe(false);
    expect(report.frameworks[0]).toMatchObject({
      inventory: 2,
      implemented: 1,
      strictPassing: 0,
      waived: 0,
    });
  });

  it('counts only explicit passing statuses', () => {
    const report = buildReport([{ ...manifests[0]!, status: 'passing' }], {
      repository: 'KRDS-uiux/krds-uiux',
      ref: '1.1.0',
      commit: 'commit',
      packageVersion: '1.1.0',
    });
    expect(report.strictConformance).toBe(true);
    expect(report.frameworks[0]?.strictPassing).toBe(1);
  });

  it('renders human-readable reports in Korean', () => {
    const report = buildReport(manifests, {
      repository: 'KRDS-uiux/krds-uiux',
      ref: '1.1.0',
      commit: 'commit',
      packageVersion: '1.1.0',
    });
    expect(toMarkdown(report)).toContain('# KRDS conformance 리포트');
    expect(toHtml(report)).toContain('<html lang="ko">');
    expect(toHtml(report)).toContain('프레임워크');
  });
});
