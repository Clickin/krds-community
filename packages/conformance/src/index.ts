import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const frameworks = ['react', 'vue', 'svelte', 'solid', 'angular'] as const;
export type Framework = (typeof frameworks)[number];
export const statuses = [
  'unmapped',
  'mapped',
  'implementing',
  'implemented',
  'passing',
  'deviating',
  'blocked-upstream',
  'waived',
  'not-applicable',
] as const;
export type ConformanceStatus = (typeof statuses)[number];

export interface ManifestSummary {
  id: string;
  status: ConformanceStatus;
  fixtureCount: number;
  mandatoryFixtureCount: number;
  sourceFiles: string[];
  accessibilityRequirements: string[];
}

export interface FrameworkSummary {
  framework: Framework;
  inventory: number;
  implemented: number;
  strictPassing: number;
  waived: number;
  fixtureCount: number;
  mandatoryFixtureCount: number;
}

export interface ConformanceReport {
  generatedAt: string;
  upstream: {
    repository: string;
    ref: string;
    commit: string;
    packageVersion: string;
  };
  manifests: ManifestSummary[];
  frameworks: FrameworkSummary[];
  strictConformance: boolean;
  notes: string[];
}

const parseList = (text: string, key: string): string[] => {
  const match = text.match(new RegExp(`^${key}:\\s*\\[([\\s\\S]*?)\\]`, 'm'));
  return match?.[1]
    ? match[1]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
};

const parseManifest = async (path: string): Promise<ManifestSummary> => {
  const text = await readFile(path, 'utf8');
  const id = text.match(/^id:\s*([^\s]+)/m)?.[1] ?? path;
  const status = (text.match(/^status:\s*([^\s]+)/m)?.[1] ?? 'unmapped') as ConformanceStatus;
  const fixtureCount = (text.match(/^\s+- id:/gm) ?? []).length;
  const mandatoryFixtureCount = (text.match(/^\s+mandatory:\s*true/gm) ?? []).length;
  const sourceFiles = [...text.matchAll(/^\s+- (upstream\/[^\n]+)/gm)].map(
    (match) => match[1] as string,
  );
  const accessibilityRequirements = parseList(text, '  accessibility');
  return {
    id,
    status,
    fixtureCount,
    mandatoryFixtureCount,
    sourceFiles,
    accessibilityRequirements,
  };
};

export const loadManifests = async (manifestDirectory: string): Promise<ManifestSummary[]> => {
  const entries = await readdir(manifestDirectory);
  const paths = entries
    .filter((entry) => entry.endsWith('.yaml'))
    .sort()
    .map((entry) => join(manifestDirectory, entry));
  return Promise.all(paths.map(parseManifest));
};

export const buildReport = (
  manifests: ManifestSummary[],
  upstream: ConformanceReport['upstream'],
): ConformanceReport => {
  const summaries = frameworks.map(
    (framework) =>
      ({
        framework,
        inventory: manifests.length,
        implemented: manifests.filter((manifest) =>
          ['implemented', 'passing', 'deviating', 'waived'].includes(manifest.status),
        ).length,
        strictPassing: manifests.filter((manifest) => manifest.status === 'passing').length,
        waived: manifests.filter((manifest) => manifest.status === 'waived').length,
        fixtureCount: manifests.reduce((sum, manifest) => sum + manifest.fixtureCount, 0),
        mandatoryFixtureCount: manifests.reduce(
          (sum, manifest) => sum + manifest.mandatoryFixtureCount,
          0,
        ),
      }) satisfies FrameworkSummary,
  );
  return {
    generatedAt: new Date().toISOString(),
    upstream,
    manifests,
    frameworks: summaries,
    strictConformance:
      manifests.length > 0 && manifests.every((manifest) => manifest.status === 'passing'),
    notes: [
      '엄격 conformance에는 status가 passing인 manifest만 포함됩니다.',
      'implemented, waived, deviating, unresolved fixture는 엄격 통과로 계산하지 않습니다.',
      'Accordion 접근성에는 KRDS Vue 참고 구현과 동일하게 aria-expanded, aria-controls, aria-labelledby 관계가 포함됩니다.',
    ],
  };
};

export const toMarkdown = (report: ConformanceReport): string => {
  const rows = report.frameworks
    .map(
      (summary) =>
        `| ${summary.framework} | ${summary.inventory}/${report.manifests.length} | ${summary.implemented}/${report.manifests.length} | ${summary.strictPassing}/${report.manifests.length} | ${summary.waived} |`,
    )
    .join('\n');
  return `# KRDS conformance 리포트\n\n- Upstream: ${report.upstream.repository}@${report.upstream.ref}\n- 커밋: ${report.upstream.commit}\n- 패키지: ${report.upstream.packageVersion}\n- 생성 시각: ${report.generatedAt}\n- 엄격 conformance: **${report.strictConformance ? '통과' : '미통과'}**\n\n| 프레임워크 | 인벤토리 | 구현됨 | 엄격 통과 | 유예 |\n| --- | ---: | ---: | ---: | ---: |\n${rows}\n\n## 규칙\n\n${report.notes.map((note) => `- ${note}`).join('\n')}\n`;
};

export const toJUnit = (report: ConformanceReport): string => {
  const tests = report.manifests.flatMap((manifest) =>
    frameworks.map((framework) => ({ framework, manifest })),
  );
  const failures = tests.filter(({ manifest }) => manifest.status !== 'passing');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites tests="${tests.length}" failures="${failures.length}">\n${tests.map(({ framework, manifest }) => `  <testcase classname="${framework}" name="${manifest.id}"${manifest.status === 'passing' ? '' : `><failure message="status=${manifest.status}" /></testcase>`}>${manifest.status === 'passing' ? '</testcase>' : ''}`).join('\n')}\n</testsuites>\n`;
};

export const toHtml = (report: ConformanceReport): string => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>KRDS conformance 리포트</title><style>body{font:16px system-ui;max-width:960px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:.5rem;text-align:left}.pass{color:#067d17}</style></head>
<body><h1>KRDS conformance 리포트</h1><p>Upstream <code>${report.upstream.repository}@${report.upstream.ref}</code>, 커밋 <code>${report.upstream.commit}</code></p><p class="${report.strictConformance ? 'pass' : ''}">엄격 conformance: ${report.strictConformance ? '통과' : '미통과'}</p><table><thead><tr><th>프레임워크</th><th>인벤토리</th><th>구현됨</th><th>엄격 통과</th><th>유예</th></tr></thead><tbody>${report.frameworks.map((summary) => `<tr><td>${summary.framework}</td><td>${summary.inventory}/${report.manifests.length}</td><td>${summary.implemented}/${report.manifests.length}</td><td>${summary.strictPassing}/${report.manifests.length}</td><td>${summary.waived}</td></tr>`).join('')}</tbody></table><h2>참고</h2><ul>${report.notes.map((note) => `<li>${note}</li>`).join('')}</ul></body></html>`;

export const writeReport = async (
  report: ConformanceReport,
  outputDirectory: string,
): Promise<void> => {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    join(outputDirectory, 'conformance.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await writeFile(join(outputDirectory, 'conformance.md'), toMarkdown(report));
  await writeFile(join(outputDirectory, 'conformance.xml'), toJUnit(report));
  await writeFile(join(outputDirectory, 'conformance.html'), toHtml(report));
};
