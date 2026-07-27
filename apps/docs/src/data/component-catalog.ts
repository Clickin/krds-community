import manifestData from './component-manifests.json';
import exportData from './public-exports.json';
import { pinnedKrdsSnapshot } from './provenance';

export type RawStateSetup = {
  action: string;
  target?: string;
  key?: string;
  value?: string;
};

export type RawFixtureState = {
  id: string;
  setup?: RawStateSetup[];
};

export type RawFixture = {
  id: string;
  sourceFile?: string;
  sourceSelector: string;
  viewport: string;
  props: Record<string, unknown>;
  states: RawFixtureState[];
};

export type RawContract = {
  semanticElement?: string;
  accessibleRole?: string;
  requiredAttributes?: unknown;
  forbiddenAttributes?: string[];
  accessibility?: string[];
  referenceImplementationNotes?: string;
};

export type RawManifest = {
  id: string;
  files: string[];
  fixtures: RawFixture[];
  contract: RawContract;
  errata: string[];
};

export type RawExportInventory = {
  generatedFrom: {
    package: string;
    sourceFile: string;
    note: string;
    sourceHash: string;
  };
  exports: string[];
};

const manifests = manifestData as RawManifest[];
const exportInventory = exportData as RawExportInventory;

export const componentManifests: readonly RawManifest[] = manifests;
export const publicExportInventory = exportInventory;

export type FixtureCatalogEntry = {
  id: string;
  componentId: string;
  source: {
    files: readonly string[];
    file: string;
    selector: string;
    snapshot: string;
  };
  viewport: string;
  props: Readonly<Record<string, unknown>>;
  states: readonly string[];
  behavior: readonly {
    state: string;
    setup: readonly RawStateSetup[];
  }[];
  events: readonly string[];
  api: {
    semanticElement?: string;
    accessibleRole?: string;
    requiredAttributes?: unknown;
    forbiddenAttributes: readonly string[];
  };
  forms: {
    declared: boolean;
    props: Readonly<Record<string, unknown>>;
    source: string;
  };
  accessibility: readonly string[];
  provenance: {
    manifest: string;
    errata: readonly string[];
    referenceImplementationNotes?: string;
  };
};

export type PublicComponentExport = {
  name: string;
  id: string;
  packageName: '@krds-community/astro';
  importPath: string;
  sourceFile: string;
  manifest: RawManifest | undefined;
  fixtures: readonly FixtureCatalogEntry[];
};

const manifestById = new Map(manifests.map((manifest) => [manifest.id, manifest]));
const toComponentId = (exportName: string) => exportName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '');
const manifestFixture = (manifest: RawManifest, fixture: RawFixture): FixtureCatalogEntry => ({
  id: fixture.id,
  componentId: manifest.id,
  source: {
    files: manifest.files,
    file: fixture.sourceFile ?? manifest.files[0]!,
    selector: fixture.sourceSelector,
    snapshot: pinnedKrdsSnapshot.ref,
  },
  viewport: fixture.viewport,
  props: fixture.props,
  states: fixture.states.map((state) => state.id),
  behavior: fixture.states.map((state) => ({
    state: state.id,
    setup: state.setup ?? [],
  })),
  events: [...new Set(fixture.states.flatMap((state) => (state.setup ?? []).map((step) => step.action)))],
  api: {
    semanticElement: manifest.contract.semanticElement,
    accessibleRole: manifest.contract.accessibleRole,
    requiredAttributes: manifest.contract.requiredAttributes,
    forbiddenAttributes: manifest.contract.forbiddenAttributes ?? [],
  },
  forms: {
    declared: Object.keys(fixture.props).some((key) => ['name', 'required', 'disabled', 'checked'].includes(key)),
    props: fixture.props,
    source: `conformance/manifests/${manifest.id}.yaml`,
  },
  accessibility: manifest.contract.accessibility ?? [],
  provenance: {
    manifest: `conformance/manifests/${manifest.id}.yaml`,
    errata: manifest.errata,
    referenceImplementationNotes: manifest.contract.referenceImplementationNotes,
  },
});

export const fixtureCatalog: readonly FixtureCatalogEntry[] = manifests.flatMap((manifest) =>
  manifest.fixtures.map((fixture) => manifestFixture(manifest, fixture)),
);

const fixturesByComponent = new Map<string, readonly FixtureCatalogEntry[]>();
for (const manifest of manifests) {
  fixturesByComponent.set(
    manifest.id,
    fixtureCatalog.filter((fixture) => fixture.componentId === manifest.id),
  );
}

export const publicComponentExports: readonly PublicComponentExport[] = exportInventory.exports.map((name) => {
  const id = toComponentId(name);
  const manifest = manifestById.get(id);
  return {
    name,
    id,
    packageName: '@krds-community/astro',
    importPath: `import { ${name} } from '@krds-community/astro';`,
    sourceFile: `packages/astro/src/${name}.astro`,
    manifest,
    fixtures: fixturesByComponent.get(id) ?? [],
  };
});

export const componentCatalog = publicComponentExports;

const fixtureIds = fixtureCatalog.map((fixture) => fixture.id);
const exportNames = publicComponentExports.map((component) => component.name);
const uniqueFixtureIds = new Set(fixtureIds);
const uniqueExportNames = new Set(exportNames);

export const coverageSummary = {
  fixtures: {
    expected: fixtureIds.length,
    discovered: uniqueFixtureIds.size,
    covered: fixtureCatalog.filter(
      (fixture) =>
        fixture.source.file.length > 0 &&
        fixture.source.selector.length > 0 &&
        fixture.states.length > 0 &&
        fixture.accessibility.length > 0,
    ).length,
    ids: fixtureIds,
  },
  exports: {
    expected: exportNames.length,
    discovered: uniqueExportNames.size,
    covered: publicComponentExports.filter(
      (component) => component.manifest !== undefined && component.fixtures.length > 0,
    ).length,
    names: exportNames,
  },
  source: {
    fixtures: 'apps/docs/src/data/component-manifests.json',
    exports: 'apps/docs/src/data/public-exports.json',
    exportSource: exportInventory.generatedFrom.sourceFile,
    exportHash: exportInventory.generatedFrom.sourceHash,
    snapshot: pinnedKrdsSnapshot.ref,
  },
} as const;

export const fixtureCoverage = coverageSummary.fixtures;
export const exportCoverage = coverageSummary.exports;

export function findFixture(id: string): FixtureCatalogEntry {
  const fixture = fixtureCatalog.find((entry) => entry.id === id);
  if (!fixture) throw new Error(`알 수 없는 KRDS fixture: ${id}`);
  return fixture;
}
