import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export const frameworks = ["react", "vue", "svelte", "solid", "angular", "astro"] as const;
export type Framework = (typeof frameworks)[number];
export const statuses = [
  "unmapped",
  "mapped",
  "implementing",
  "implemented",
  "passing",
  "deviating",
  "blocked-upstream",
  "waived",
  "not-applicable",
  "no-upstream",
] as const;
export type ConformanceStatus = (typeof statuses)[number];

export const evidenceStatuses = ["unverified", "implemented", "passing", "failing"] as const;
export type EvidenceStatus = (typeof evidenceStatuses)[number];
export type FixtureResultStatus = EvidenceStatus;
export const fixtureActionTypes = [
  "click",
  "hover",
  "pointer-down",
  "pointer-up",
  "keyboard-focus",
  "press",
  "fill",
  "select-option",
  "check",
  "uncheck",
  "submit",
  "open",
  "close",
  "add-class",
  "remove-class",
  "set-attribute",
  "remove-attribute",
] as const;
export type FixtureActionType = (typeof fixtureActionTypes)[number];

export interface FixtureAction {
  action: FixtureActionType;
  target?: string;
  key?: string;
  value?: string | number | boolean;
}

export interface FixtureState {
  id: string;
  setup: FixtureAction[];
  props: Record<string, unknown>;
  expectations: Record<string, unknown>;
}

export interface FixtureViewport {
  name: "mobile" | "tablet" | "desktop";
  width: number;
  height: number;
}

export interface FixtureComparisons {
  dom: "strict" | "semantic" | "none";
  visual: "exact" | "none";
  accessibility: "strict" | "none";
}
export const fixtureLayoutContexts = ["content-inner", "viewport-height"] as const;
export type FixtureLayoutContext = (typeof fixtureLayoutContexts)[number];

export interface FixtureSideAwareSelector {
  upstream: string;
  framework: string;
}

export interface ConformanceFixture {
  id: string;
  sourceSelector: string;
  sourceFile: string;
  sourceIndex: number;
  sourceAncestorSelector?: string;
  contractAncestorSelector?: FixtureSideAwareSelector;
  visualSelector?: string;
  visualAncestorSelector?: string;
  layoutContext?: FixtureLayoutContext;
  mandatory: boolean;
  viewport: FixtureViewport;
  props: Record<string, unknown>;
  errata: string[];
  states: FixtureState[];
  expectations: Record<string, unknown>;
  comparisons: FixtureComparisons;
}

export interface ConformanceContract {
  semanticElement: string;
  accessibleRole?: string;
  requiredAttributes: Record<string, unknown>;
  forbiddenAttributes: string[];
  accessibility: string[];
}

export interface ConformanceManifest extends ManifestSummary {
  upstreamVersion: string;
  fixtures: ConformanceFixture[];
  contract: ConformanceContract;
  fixtureIds: string[];
  errata: string[];
  schemaValid: boolean;
  statusConsistent: boolean;
  validationErrors: string[];
  unresolvedSelectors: string[];
}

export interface FixtureResult {
  fixtureId: string;
  status: FixtureResultStatus;
  errors?: string[];
}

export interface FrameworkEvidence {
  framework: Framework;
  status: EvidenceStatus;
  fixtureResults: FixtureResult[];
  unresolvedSelectors: string[];
  errata: string[];
  errors: string[];
  source?: string;
}

export interface ManifestSummary {
  id: string;
  status: ConformanceStatus;
  fixtureCount: number;
  mandatoryFixtureCount: number;
  sourceFiles: string[];
  accessibilityRequirements: string[];
  fixtureIds?: string[];
  errata?: string[];
  schemaValid?: boolean;
  statusConsistent?: boolean;
  validationErrors?: string[];
  unresolvedSelectors?: string[];
}

export interface FrameworkSummary {
  framework: Framework;
  inventory: number;
  implemented: number;
  strictPassing: number;
  waived: number;
  fixtureCount: number;
  mandatoryFixtureCount: number;
  evidenceCount: number;
  passingEvidenceCount: number;
  failingEvidenceCount: number;
  unverifiedEvidenceCount: number;
  evidenceStatus: EvidenceStatus;
  unresolvedCount: number;
  errataCount: number;
  validationErrorCount: number;
}

export interface StrictEvidenceReport {
  schemaVersion: 1;
  reportType: "runtime-strict-evidence";
  upstream: ConformanceReport["upstream"];
  frameworks: FrameworkEvidence[];
  fixtureCount: number;
  evidenceCount: number;
  unresolvedCount: number;
  errataCount: number;
  failures: string[];
}

export interface ConformanceReport {
  generatedAt: string;
  reportType: "catalog" | "runtime-strict";
  upstream: {
    repository: string;
    ref: string;
    commit: string;
    packageVersion: string;
  };
  manifests: ManifestSummary[];
  frameworks: FrameworkSummary[];
  evidence: FrameworkEvidence[];
  fixtureCount: number;
  evidenceCount: number;
  unresolvedCount: number;
  errataCount: number;
  strictConformance: boolean;
  notes: string[];
}

export interface BuildReportOptions {
  evidence?: readonly FrameworkEvidence[];
  generatedAt?: string;
}

const selectorTokens = (selector: string): string[] => {
  const tokens = new Set<string>();
  const tag = selector.match(/^[a-z][a-z0-9-]*/i)?.[0];
  if (tag) tokens.add(tag);
  for (const match of selector.matchAll(/[.#]([a-z][a-z0-9_-]*)/gi)) tokens.add(match[1]!);
  for (const match of selector.matchAll(/\[([a-z][a-z0-9_-]*)(?:\s*[~|^$*]?=\s*([^\]]+))?\]/gi)) {
    tokens.add(match[1]!);
    if (match[2]) tokens.add(match[2].trim().replace(/^['"]|['"]$/g, ""));
  }
  return [...tokens].filter(Boolean);
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringValue = (value: unknown): string => (typeof value === "string" ? value : "");

const stringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const recordValue = (value: unknown): UnknownRecord => (isRecord(value) ? value : {});
const parseSideAwareSelector = (
  value: unknown,
  fixtureId: string,
  field: string,
  validationErrors: string[],
): FixtureSideAwareSelector | undefined => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    validationErrors.push(`${fixtureId}: ${field} must declare upstream and framework selectors`);
    return undefined;
  }
  const upstream = stringValue(value.upstream);
  const framework = stringValue(value.framework);
  const unexpected = Object.keys(value).filter((key) => key !== "upstream" && key !== "framework");
  if (!upstream || !framework || unexpected.length > 0) {
    validationErrors.push(
      `${fixtureId}: ${field} must contain only non-empty upstream and framework selectors`,
    );
    return undefined;
  }
  return { upstream, framework };
};

const viewportPresets: Record<FixtureViewport["name"], Omit<FixtureViewport, "name">> = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

const parseViewport = (
  value: unknown,
  fixtureId: string,
  validationErrors: string[],
): FixtureViewport => {
  if (typeof value === "string" && value in viewportPresets) {
    const name = value as FixtureViewport["name"];
    return { name, ...viewportPresets[name] };
  }
  const viewport = recordValue(value);
  const rawName = stringValue(viewport.name);
  const name = rawName in viewportPresets ? (rawName as FixtureViewport["name"]) : "desktop";
  const width = typeof viewport.width === "number" ? viewport.width : viewportPresets[name].width;
  const height =
    typeof viewport.height === "number" ? viewport.height : viewportPresets[name].height;
  if (!(rawName in viewportPresets) || width <= 0 || height <= 0) {
    validationErrors.push(`${fixtureId}: viewport is missing or invalid`);
  }
  return { name, width, height };
};

const parseAction = (
  value: unknown,
  fixtureId: string,
  stateId: string,
  validationErrors: string[],
): FixtureAction | undefined => {
  const action = recordValue(value);
  const actionType = stringValue(action.action);
  if (!(fixtureActionTypes as readonly string[]).includes(actionType)) {
    validationErrors.push(`${fixtureId}/${stateId}: unknown action=${actionType || "<missing>"}`);
    return undefined;
  }
  const target = stringValue(action.target);
  const key = stringValue(action.key);
  const rawValue = action.value;
  return {
    action: actionType as FixtureActionType,
    ...(target ? { target } : {}),
    ...(key ? { key } : {}),
    ...(typeof rawValue === "string" ||
    typeof rawValue === "number" ||
    typeof rawValue === "boolean"
      ? { value: rawValue }
      : {}),
  };
};

const legacyState = (id: string): Omit<FixtureState, "id"> => {
  if (id === "hover") {
    return { setup: [{ action: "hover", target: "fixture" }], props: {}, expectations: {} };
  }
  if (id === "focus-visible") {
    return {
      setup: [{ action: "keyboard-focus", target: "fixture" }],
      props: {},
      expectations: {},
    };
  }
  if (id === "active") {
    return {
      setup: [{ action: "pointer-down", target: "fixture" }],
      props: {},
      expectations: {},
    };
  }
  if (id === "checked") return { setup: [], props: { checked: true }, expectations: {} };
  if (id === "disabled") return { setup: [], props: { disabled: true }, expectations: {} };
  if (id === "disabled-checked") {
    return { setup: [], props: { disabled: true, checked: true }, expectations: {} };
  }
  if (id === "readonly") return { setup: [], props: { readonly: true }, expectations: {} };
  if (id === "expanded") {
    return {
      setup: [],
      props: { open: ["one"], modelValue: ["one"], defaultOpen: ["one"] },
      expectations: {},
    };
  }
  if (id === "collapsed" || id === "keyboard-toggle") {
    return {
      setup: id === "keyboard-toggle" ? [{ action: "press", target: "fixture", key: "Enter" }] : [],
      props: { open: [], modelValue: [], defaultOpen: [] },
      expectations: {},
    };
  }
  return { setup: [], props: {}, expectations: {} };
};

const parseStates = (
  value: unknown,
  fixtureId: string,
  validationErrors: string[],
): FixtureState[] => {
  if (!Array.isArray(value)) {
    validationErrors.push(`${fixtureId}: states must contain at least one state`);
    return [];
  }
  const states = value.flatMap((rawState): FixtureState[] => {
    if (typeof rawState === "string") {
      return [{ id: rawState, ...legacyState(rawState) }];
    }
    const state = recordValue(rawState);
    const id = stringValue(state.id);
    if (!id) {
      validationErrors.push(`${fixtureId}: state id is missing`);
      return [];
    }
    const setup = Array.isArray(state.setup)
      ? state.setup
          .map((action) => parseAction(action, fixtureId, id, validationErrors))
          .filter((action): action is FixtureAction => Boolean(action))
      : [];
    return [
      {
        id,
        setup,
        props: recordValue(state.props),
        expectations: recordValue(state.expectations),
      },
    ];
  });
  if (!states.length) validationErrors.push(`${fixtureId}: states must contain at least one state`);
  if (new Set(states.map((state) => state.id)).size !== states.length) {
    validationErrors.push(`${fixtureId}: state ids must be unique`);
  }
  return states;
};

const parseComparisons = (value: unknown): FixtureComparisons => {
  const comparisons = recordValue(value);
  const dom = comparisons.dom;
  const visual = comparisons.visual;
  const accessibility = comparisons.accessibility;
  return {
    dom: dom === "semantic" || dom === "none" ? dom : "strict",
    visual: visual === "none" ? "none" : "exact",
    accessibility: accessibility === "none" ? "none" : "strict",
  };
};

const isStatus = (value: string): value is ConformanceStatus =>
  (statuses as readonly string[]).includes(value);

const isEvidenceStatus = (value: string): value is EvidenceStatus =>
  (evidenceStatuses as readonly string[]).includes(value);

const isFixtureLayoutContext = (value: string): value is FixtureLayoutContext =>
  (fixtureLayoutContexts as readonly string[]).includes(value);

const parseManifest = async (path: string, projectRoot: string): Promise<ConformanceManifest> => {
  const text = await readFile(path, "utf8");
  const validationErrors: string[] = [];
  let parsed: unknown;
  try {
    parsed = parseYaml(text);
  } catch (error) {
    parsed = {};
    validationErrors.push(
      `YAML parse failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const document = recordValue(parsed);
  const id = stringValue(document.id);
  const rawStatus = stringValue(document.status) || "unmapped";
  const status = isStatus(rawStatus) ? rawStatus : "unmapped";
  const exemptFromUpstream = status === "no-upstream";
  const upstream = recordValue(document.upstream);
  const upstreamVersion = stringValue(upstream.version);
  const sourceFiles = stringList(upstream.files);
  const errata = stringList(document.errata);
  const rawFixtures = Array.isArray(document.fixtures) ? document.fixtures : [];

  const fixtures = rawFixtures.flatMap((rawFixture, index): ConformanceFixture[] => {
    const fixture = recordValue(rawFixture);
    const sourceFile =
      stringValue(fixture.sourceFile) || (sourceFiles.length === 1 ? sourceFiles[0]! : "");
    const fixtureId = stringValue(fixture.id) || `${id || "<unknown>"}#${index + 1}`;
    const sourceSelector = stringValue(fixture.sourceSelector);
    const sourceIndex =
      typeof fixture.sourceIndex === "number" && Number.isInteger(fixture.sourceIndex)
        ? fixture.sourceIndex
        : 0;
    const sourceAncestorSelector = stringValue(fixture.sourceAncestorSelector);
    const contractAncestorSelector = parseSideAwareSelector(
      fixture.contractAncestorSelector,
      fixtureId,
      "contractAncestorSelector",
      validationErrors,
    );
    const visualSelector = stringValue(fixture.visualSelector);
    const visualAncestorSelector = stringValue(fixture.visualAncestorSelector);
    const rawLayoutContext = stringValue(fixture.layoutContext);
    const layoutContext = isFixtureLayoutContext(rawLayoutContext) ? rawLayoutContext : undefined;
    const mandatory = fixture.mandatory === true;

    if (!sourceFile)
      validationErrors.push(`${fixtureId}: sourceFile is required for multi-file manifests`);
    else if (!sourceFiles.includes(sourceFile)) {
      validationErrors.push(`${fixtureId}: sourceFile is not declared in upstream.files`);
    }
    if (!stringValue(fixture.id)) validationErrors.push(`${fixtureId}: id is missing`);
    if (!sourceSelector) validationErrors.push(`${fixtureId}: sourceSelector is missing`);
    if (typeof fixture.mandatory !== "boolean") {
      validationErrors.push(`${fixtureId}: mandatory is missing`);
    }
    if (sourceIndex < 0) validationErrors.push(`${fixtureId}: sourceIndex must be non-negative`);
    if ("visualSelector" in fixture && !visualSelector) {
      validationErrors.push(`${fixtureId}: visualSelector must be a non-empty string`);
    }
    if ("visualAncestorSelector" in fixture && !visualAncestorSelector) {
      validationErrors.push(`${fixtureId}: visualAncestorSelector must be a non-empty string`);
    }
    if ("layoutContext" in fixture && !layoutContext) {
      validationErrors.push(`${fixtureId}: layoutContext must be content-inner or viewport-height`);
    }

    return [
      {
        id: fixtureId,
        sourceSelector,
        sourceIndex,
        sourceFile,
        ...(sourceAncestorSelector ? { sourceAncestorSelector } : {}),
        ...(contractAncestorSelector ? { contractAncestorSelector } : {}),
        ...(visualSelector ? { visualSelector } : {}),
        ...(visualAncestorSelector ? { visualAncestorSelector } : {}),
        ...(layoutContext ? { layoutContext } : {}),
        mandatory,
        viewport: parseViewport(fixture.viewport, fixtureId, validationErrors),
        props: recordValue(fixture.props),
        errata,
        states: parseStates(fixture.states, fixtureId, validationErrors),
        expectations: recordValue(fixture.expectations),
        comparisons: parseComparisons(fixture.comparisons),
      },
    ];
  });

  const contractRecord = recordValue(document.contract);
  const semanticElement = stringValue(contractRecord.semanticElement);
  const contract: ConformanceContract = {
    semanticElement,
    ...(stringValue(contractRecord.accessibleRole)
      ? { accessibleRole: stringValue(contractRecord.accessibleRole) }
      : {}),
    requiredAttributes: recordValue(contractRecord.requiredAttributes),
    forbiddenAttributes: stringList(contractRecord.forbiddenAttributes),
    accessibility: stringList(contractRecord.accessibility),
  };
  const accessibilityRequirements = contract.accessibility;
  const fixtureIds = fixtures.map((fixture) => fixture.id);
  const fixtureCount = fixtures.length;
  const mandatoryFixtureCount = fixtures.filter((fixture) => fixture.mandatory).length;

  if (!id || !/^[a-z0-9-]+$/.test(id)) validationErrors.push("id is missing or invalid");
  if (!isStatus(rawStatus)) validationErrors.push(`unknown status=${rawStatus}`);
  if (!upstreamVersion && !exemptFromUpstream) validationErrors.push("upstream.version is missing");
  if (!sourceFiles.length && !exemptFromUpstream) validationErrors.push("upstream.files is missing");
  if (!fixtureCount && !exemptFromUpstream)
    validationErrors.push("fixtures must contain at least one fixture");
  if (new Set(fixtureIds).size !== fixtureIds.length) {
    validationErrors.push("fixture ids must be unique within a manifest");
  }
  if (!semanticElement) validationErrors.push("contract.semanticElement is missing");
  if (
    rawStatus === "passing" &&
    (validationErrors.length > 0 || mandatoryFixtureCount !== fixtureCount)
  ) {
    validationErrors.push("status=passing is inconsistent with manifest contract");
  }

  const unresolvedSelectors: string[] = [];
  const sourceText: string[] = [];
  for (const relativePath of sourceFiles) {
    try {
      sourceText.push(await readFile(join(projectRoot, relativePath), "utf8"));
    } catch {
      validationErrors.push(`upstream source is missing: ${relativePath}`);
    }
  }
  const combinedSource = sourceText.join("\n");
  for (const fixture of fixtures) {
    if (
      !fixture.sourceSelector ||
      selectorTokens(fixture.sourceSelector).some((token) => !combinedSource.includes(token))
    ) {
      unresolvedSelectors.push(`${fixture.id}:${fixture.sourceSelector || "<missing>"}`);
    }
  }

  const errataDirectory = join(dirname(path), "..", "errata");
  for (const erratum of errata) {
    if (!/^[a-z0-9._-]+$/.test(erratum)) {
      validationErrors.push(`invalid errata selector: ${erratum}`);
      continue;
    }
    try {
      const errataDocument = recordValue(
        parseYaml(await readFile(join(errataDirectory, `${erratum}.yaml`), "utf8")),
      );
      if (stringValue(errataDocument.id) !== erratum) {
        validationErrors.push(`errata id mismatch: ${erratum}`);
      }
      const errataComponent = stringValue(errataDocument.component);
      const errataFixtureIds = stringList(errataDocument.fixtures);
      if (!errataComponent) {
        validationErrors.push(`errata component is missing: ${erratum}`);
      } else if (
        errataComponent !== (id || path) &&
        !(id && id.startsWith(`${errataComponent}-`)) &&
        !errataFixtureIds.some((fixtureId) => fixtureIds.includes(fixtureId))
      ) {
        validationErrors.push(`errata component mismatch: ${erratum}`);
      }
      for (const requiredSection of [
        "upstream",
        "defect",
        "correction",
        "fixtures",
        "normalization",
        "evidence",
      ]) {
        if (!(requiredSection in errataDocument)) {
          validationErrors.push(`errata ${requiredSection} is missing: ${erratum}`);
        }
      }
    } catch {
      validationErrors.push(`errata record is missing or invalid: ${erratum}`);
    }
  }

  const statusConsistent =
    isStatus(rawStatus) &&
    (rawStatus !== "passing" ||
      (validationErrors.length === 0 && unresolvedSelectors.length === 0));
  return {
    id: id || path,
    status,
    upstreamVersion,
    fixtureCount,
    mandatoryFixtureCount,
    sourceFiles,
    accessibilityRequirements,
    fixtureIds,
    fixtures,
    contract,
    errata,
    schemaValid: validationErrors.length === 0,
    statusConsistent,
    validationErrors,
    unresolvedSelectors,
  };
};

const manifestSummary = (manifest: ConformanceManifest): ManifestSummary => ({
  id: manifest.id,
  status: manifest.status,
  fixtureCount: manifest.fixtureCount,
  mandatoryFixtureCount: manifest.mandatoryFixtureCount,
  sourceFiles: manifest.sourceFiles,
  accessibilityRequirements: manifest.accessibilityRequirements,
  fixtureIds: manifest.fixtureIds,
  errata: manifest.errata,
  schemaValid: manifest.schemaValid,
  statusConsistent: manifest.statusConsistent,
  validationErrors: manifest.validationErrors,
  unresolvedSelectors: manifest.unresolvedSelectors,
});

const manifestPaths = async (manifestDirectory: string): Promise<string[]> =>
  (await readdir(manifestDirectory))
    .filter((entry) => entry.endsWith(".yaml"))
    .sort()
    .map((entry) => join(manifestDirectory, entry));

export const loadFixtureManifests = async (
  manifestDirectory: string,
): Promise<ConformanceManifest[]> => {
  const projectRoot = resolve(manifestDirectory, "../..");
  const paths = await manifestPaths(manifestDirectory);
  const manifests = await Promise.all(paths.map((path) => parseManifest(path, projectRoot)));
  const fixtureIds = manifests.flatMap((manifest) => manifest.fixtureIds ?? []);
  if (new Set(fixtureIds).size !== fixtureIds.length) {
    throw new Error("Fixture ids must be unique across conformance manifests");
  }
  return manifests;
};

export const loadManifests = async (manifestDirectory: string): Promise<ManifestSummary[]> =>
  (await loadFixtureManifests(manifestDirectory)).map(manifestSummary);

const uniqueSorted = (values: readonly string[]): string[] => [...new Set(values)].sort();

const normalizeFrameworkEvidence = (
  framework: Framework,
  evidence?: Partial<FrameworkEvidence>,
): FrameworkEvidence => {
  const rawResults = evidence?.fixtureResults ?? [];
  const fixtureResults = rawResults
    .filter((result): result is FixtureResult => Boolean(result?.fixtureId))
    .map((result) => ({
      fixtureId: result.fixtureId,
      status: isEvidenceStatus(result.status) ? result.status : "unverified",
      ...(result.errors?.length ? { errors: uniqueSorted(result.errors) } : {}),
    }))
    .sort((left, right) => left.fixtureId.localeCompare(right.fixtureId));
  const status =
    evidence?.status && isEvidenceStatus(evidence.status) ? evidence.status : "unverified";
  return {
    framework,
    status,
    fixtureResults,
    unresolvedSelectors: uniqueSorted(evidence?.unresolvedSelectors ?? []),
    errata: uniqueSorted(evidence?.errata ?? []),
    errors: uniqueSorted(evidence?.errors ?? []),
    ...(evidence?.source ? { source: evidence.source } : {}),
  };
};

const expectedFixtureIds = (manifest: ManifestSummary): string[] =>
  manifest.fixtureIds?.length
    ? manifest.fixtureIds
    : Array.from({ length: manifest.fixtureCount }, (_, index) => `${manifest.id}#${index + 1}`);

const manifestCanPass = (manifest: ManifestSummary): boolean =>
  manifest.status === "passing" &&
  manifest.schemaValid !== false &&
  manifest.statusConsistent !== false &&
  !manifest.validationErrors?.length &&
  !manifest.unresolvedSelectors?.length;

type EvidenceInput = readonly FrameworkEvidence[] | StrictEvidenceReport;

export const buildReport = (
  manifests: ManifestSummary[],
  upstream: ConformanceReport["upstream"],
  input?: EvidenceInput | BuildReportOptions,
): ConformanceReport => {
  const options: BuildReportOptions =
    input === undefined
      ? {}
      : "frameworks" in (input as object)
        ? { evidence: (input as StrictEvidenceReport).frameworks }
        : "evidence" in (input as object)
          ? (input as BuildReportOptions)
          : { evidence: input as readonly FrameworkEvidence[] };
  const evidenceUpstream =
    input && "frameworks" in (input as object)
      ? (input as StrictEvidenceReport).upstream
      : undefined;
  const upstreamMatches =
    !evidenceUpstream ||
    (evidenceUpstream.repository === upstream.repository &&
      evidenceUpstream.ref === upstream.ref &&
      evidenceUpstream.commit === upstream.commit &&
      evidenceUpstream.packageVersion === upstream.packageVersion);
  const providedEvidence = upstreamMatches ? options.evidence : undefined;
  const evidence = frameworks.map((framework) =>
    normalizeFrameworkEvidence(
      framework,
      providedEvidence?.find((candidate) => candidate.framework === framework),
    ),
  );
  const assessable = manifests.filter((manifest) => manifest.status !== "no-upstream");
  const fixtureCount = assessable.reduce((sum, manifest) => sum + manifest.fixtureCount, 0);
  const mandatoryFixtureCount = assessable.reduce(
    (sum, manifest) => sum + manifest.mandatoryFixtureCount,
    0,
  );
  const catalogErrata = uniqueSorted(assessable.flatMap((manifest) => manifest.errata ?? []));
  const catalogUnresolvedSelectors = uniqueSorted(
    assessable.flatMap((manifest) => manifest.unresolvedSelectors ?? []),
  );
  const errataCount = catalogErrata.length;
  const unresolvedCount = catalogUnresolvedSelectors.length;
  const summaries = evidence.map((frameworkEvidence) => {
    const resultsById = new Map(
      frameworkEvidence.fixtureResults.map((result) => [result.fixtureId, result]),
    );
    const expected = assessable.flatMap((manifest) =>
      expectedFixtureIds(manifest).map((fixtureId) => ({ fixtureId, manifest })),
    );
    const passingEvidenceCount = frameworkEvidence.fixtureResults.filter(
      (result) => result.status === "passing",
    ).length;
    const failingEvidenceCount = frameworkEvidence.fixtureResults.filter(
      (result) => result.status === "failing",
    ).length;
    const unverifiedEvidenceCount =
      frameworkEvidence.fixtureResults.length - passingEvidenceCount - failingEvidenceCount;
    const hasMissingEvidence = expected.some((fixture) => !resultsById.has(fixture.fixtureId));
    const hasCatalogFailure = assessable.some(
      (manifest) => !manifestCanPass(manifest) && manifest.status === "passing",
    );
    const hasFailure =
      frameworkEvidence.status === "failing" ||
      frameworkEvidence.errors.length > 0 ||
      frameworkEvidence.unresolvedSelectors.length > 0 ||
      failingEvidenceCount > 0 ||
      hasCatalogFailure;
    const completePassingEvidence =
      expected.length > 0 &&
      !hasMissingEvidence &&
      expected.every((fixture) => resultsById.get(fixture.fixtureId)?.status === "passing");
    const evidenceStatus: EvidenceStatus =
      !providedEvidence ||
      (!frameworkEvidence.fixtureResults.length && !frameworkEvidence.errors.length)
        ? "unverified"
        : hasFailure
          ? "failing"
          : completePassingEvidence && frameworkEvidence.status === "passing"
            ? "passing"
            : "implemented";
    const strictPassing = assessable.filter((manifest) => {
      const expectedIds = expectedFixtureIds(manifest);
      return (
        manifestCanPass(manifest) &&
        expectedIds.length > 0 &&
        expectedIds.every((fixtureId) => resultsById.get(fixtureId)?.status === "passing")
      );
    }).length;
    return {
      framework: frameworkEvidence.framework,
      inventory: assessable.length,
      implemented: assessable.filter((manifest) =>
        ["implemented", "passing", "deviating", "waived"].includes(manifest.status),
      ).length,
      strictPassing: evidenceStatus === "passing" ? strictPassing : 0,
      waived: manifests.filter((manifest) => manifest.status === "waived").length,
      fixtureCount,
      mandatoryFixtureCount,
      evidenceCount: frameworkEvidence.fixtureResults.length,
      passingEvidenceCount,
      failingEvidenceCount,
      unverifiedEvidenceCount,
      evidenceStatus,
      unresolvedCount: uniqueSorted([
        ...catalogUnresolvedSelectors,
        ...frameworkEvidence.unresolvedSelectors,
      ]).length,
      errataCount: uniqueSorted([...catalogErrata, ...frameworkEvidence.errata]).length,
      validationErrorCount: manifests.reduce(
        (sum, manifest) => sum + (manifest.validationErrors?.length ?? 0),
        0,
      ),
    } satisfies FrameworkSummary;
  });
  const strictConformance =
    providedEvidence !== undefined &&
    assessable.length > 0 &&
    summaries.every(
      (summary) =>
        summary.evidenceStatus === "passing" &&
        summary.strictPassing === summary.inventory &&
        summary.unresolvedCount === 0 &&
        summary.validationErrorCount === 0,
    );
  return {
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    reportType: providedEvidence === undefined ? "catalog" : "runtime-strict",
    upstream,
    manifests,
    frameworks: summaries,
    evidence,
    fixtureCount,
    evidenceCount: evidence.reduce((sum, item) => sum + item.fixtureResults.length, 0),
    unresolvedCount,
    errataCount,
    strictConformance,
    notes: [
      "catalog report는 manifest status를 inventory로 표시하지만 runtime evidence를 주장하지 않습니다.",
      "framework별 fixture evidence가 없거나 unverified이면 엄격 conformance는 false입니다.",
      "implemented, waived, deviating, unresolved fixture는 엄격 통과로 계산하지 않습니다.",
      "Accordion 접근성에는 KRDS Vue 참고 구현과 동일하게 aria-expanded, aria-controls, aria-labelledby 관계가 포함됩니다.",
      "no-upstream 컴포넌트(toast, snackbar, alert, infobox, progress-bar, search, chip, top-button, user-feedback, card, bottom-sheet, tab-bar)는 upstream HTML이 없어 conformance 측정에서 제외됩니다.",
      ...(upstreamMatches
        ? []
        : ["runtime evidence upstream revision mismatch; evidence is unverified."]),
    ],
  };
};

export const createStrictEvidence = (
  upstream: ConformanceReport["upstream"],
  frameworkEvidence: readonly FrameworkEvidence[],
  failures: readonly string[] = [],
): StrictEvidenceReport => {
  const normalized = frameworks.map((framework) =>
    normalizeFrameworkEvidence(
      framework,
      frameworkEvidence.find((candidate) => candidate.framework === framework),
    ),
  );
  return {
    schemaVersion: 1,
    reportType: "runtime-strict-evidence",
    upstream,
    frameworks: normalized,
    fixtureCount: normalized.reduce((sum, item) => sum + item.fixtureResults.length, 0),
    evidenceCount: normalized.reduce((sum, item) => sum + item.fixtureResults.length, 0),
    unresolvedCount: uniqueSorted(normalized.flatMap((item) => item.unresolvedSelectors)).length,
    errataCount: uniqueSorted(normalized.flatMap((item) => item.errata)).length,
    failures: uniqueSorted(failures),
  };
};

export const writeEvidence = async (
  evidence: StrictEvidenceReport,
  outputPath: string,
): Promise<void> => {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
};

export const readEvidence = async (path: string): Promise<StrictEvidenceReport> => {
  const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as { schemaVersion?: unknown }).schemaVersion !== 1 ||
    (parsed as { reportType?: unknown }).reportType !== "runtime-strict-evidence"
  ) {
    throw new Error(`Invalid runtime strict evidence contract: ${path}`);
  }
  const candidate = parsed as StrictEvidenceReport;
  if (!candidate.upstream || !Array.isArray(candidate.frameworks)) {
    throw new Error(`Invalid runtime strict evidence fields: ${path}`);
  }
  return createStrictEvidence(candidate.upstream, candidate.frameworks, candidate.failures ?? []);
};

export const toMarkdown = (report: ConformanceReport): string => {
  const rows = report.frameworks
    .map(
      (summary) =>
        `| ${summary.framework} | ${summary.inventory} | ${summary.fixtureCount} | ${summary.evidenceCount} | ${summary.evidenceStatus} | ${summary.strictPassing} | ${summary.unresolvedCount} | ${summary.errataCount} |`,
    )
    .join("\n");
  return `# KRDS conformance 리포트

- Report type: **${report.reportType}**
- Upstream: ${report.upstream.repository}@${report.upstream.ref}
- 커밋: ${report.upstream.commit}
- 패키지: ${report.upstream.packageVersion}
- 생성 시각: ${report.generatedAt}
- 전체 fixture: ${report.fixtureCount}
- 전체 evidence: ${report.evidenceCount}
- unresolved selector: ${report.unresolvedCount}
- errata: ${report.errataCount}
- 엄격 conformance: **${report.strictConformance ? "통과" : "미통과"}**

| 프레임워크 | 인벤토리 | fixture | evidence | evidence 상태 | 엄격 통과 | unresolved | errata |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: |
${rows}

## 규칙

${report.notes.map((note) => `- ${note}`).join("\n")}
`;
};

const xmlEscape = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export const toJUnit = (report: ConformanceReport): string => {
  const tests = report.frameworks.flatMap((summary) => {
    const frameworkEvidence = report.evidence.find(
      (evidence) => evidence.framework === summary.framework,
    );
    const resultsById = new Map(
      frameworkEvidence?.fixtureResults.map((result) => [result.fixtureId, result]) ?? [],
    );
    const expectedIds = report.manifests.flatMap((manifest) => expectedFixtureIds(manifest));
    const expected = expectedIds.map((fixtureId) => ({
      fixtureId,
      status: resultsById.get(fixtureId)?.status ?? ("unverified" as const),
      errors: resultsById.get(fixtureId)?.errors ?? [],
    }));
    const expectedSet = new Set(expectedIds);
    const extras =
      frameworkEvidence?.fixtureResults
        .filter((result) => !expectedSet.has(result.fixtureId))
        .map((result) => ({
          fixtureId: result.fixtureId,
          status: result.status,
          errors: result.errors ?? [],
        })) ?? [];
    return [...expected, ...extras].map((test) => ({
      framework: summary.framework,
      ...test,
    }));
  });
  const failures = tests.filter((test) => test.status !== "passing");
  const testCases = tests
    .map((test) => {
      if (test.status === "passing") {
        return `  <testcase classname="${xmlEscape(test.framework)}" name="${xmlEscape(test.fixtureId)}" />`;
      }
      const message = `status=${test.status}${test.errors.length ? `; ${test.errors.join("; ")}` : ""}`;
      return `  <testcase classname="${xmlEscape(test.framework)}" name="${xmlEscape(test.fixtureId)}"><failure message="${xmlEscape(message)}" /></testcase>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites tests="${tests.length}" failures="${failures.length}">\n${testCases}\n</testsuites>\n`;
};

const htmlEscape = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const toHtml = (report: ConformanceReport): string => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>KRDS conformance 리포트</title><style>body{font:16px system-ui;max-width:1100px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:.5rem;text-align:left}.pass{color:#067d17}.unverified{color:#996c00}.fail{color:#a40000}</style></head>
<body><h1>KRDS conformance 리포트</h1><p>Report type <code>${report.reportType}</code>; upstream <code>${htmlEscape(report.upstream.repository)}@${htmlEscape(report.upstream.ref)}</code>, 커밋 <code>${htmlEscape(report.upstream.commit)}</code></p><p class="${report.strictConformance ? "pass" : "fail"}">엄격 conformance: ${report.strictConformance ? "통과" : "미통과"}</p><p>Fixture ${report.fixtureCount}, evidence ${report.evidenceCount}, unresolved ${report.unresolvedCount}, errata ${report.errataCount}</p><table><thead><tr><th>프레임워크</th><th>인벤토리</th><th>fixture</th><th>evidence</th><th>상태</th><th>엄격 통과</th><th>unresolved</th><th>errata</th></tr></thead><tbody>${report.frameworks.map((summary) => `<tr><td>${summary.framework}</td><td>${summary.inventory}</td><td>${summary.fixtureCount}</td><td>${summary.evidenceCount}</td><td class="${summary.evidenceStatus === "passing" ? "pass" : summary.evidenceStatus === "unverified" ? "unverified" : "fail"}">${summary.evidenceStatus}</td><td>${summary.strictPassing}</td><td>${summary.unresolvedCount}</td><td>${summary.errataCount}</td></tr>`).join("")}</tbody></table><h2>참고</h2><ul>${report.notes.map((note) => `<li>${htmlEscape(note)}</li>`).join("")}</ul></body></html>`;

export const writeReport = async (
  report: ConformanceReport,
  outputDirectory: string,
  prefix = "conformance",
): Promise<void> => {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, `${prefix}.json`), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(join(outputDirectory, `${prefix}.md`), toMarkdown(report));
  await writeFile(join(outputDirectory, `${prefix}.xml`), toJUnit(report));
  await writeFile(join(outputDirectory, `${prefix}.html`), toHtml(report));
};
