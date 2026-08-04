export type DomSnapshot = {
  tag: string;
  attributes: [string, string][];
  state?: Record<string, unknown>;
  children: Array<DomSnapshot | { text: string }>;
};

export type DomNormalizationRule = Record<string, unknown>;

export type SemanticSnapshot = Record<string, unknown> & {
  form: Record<string, unknown> & { disabled?: boolean };
};

export class SelectorResolutionError extends Error {
  constructor(details: {
    kind: string;
    side: "upstream" | "framework";
    selector?: string;
    message: string;
  });
  toEvidence(context: {
    fixtureId: string;
    framework: string;
    stateId: string;
  }): Record<string, unknown>;
}

export type EvaluatedLocator = {
  evaluate: (
    callback: (root: Element, argument: unknown) => unknown,
    argument: unknown,
  ) => Promise<unknown>;
};

export type ContractLocator = EvaluatedLocator & {
  count: () => Promise<number>;
  nth: (index: number) => ContractLocator;
};

export type ContractAncestorSelectors = Partial<Record<"upstream" | "framework", string>>;

export function captureDom(
  locator: unknown,
  ignoredAttributes?: string | DomNormalizationRule[],
  side?: "upstream" | "framework",
): Promise<DomSnapshot>;

export function compareDom(
  upstream: DomSnapshot,
  framework: DomSnapshot,
): { passed: boolean; expected: string; actual: string };

export function resolveContractRoot(
  page: { locator: (selector: string) => ContractLocator },
  root: EvaluatedLocator,
  selectors: ContractAncestorSelectors | undefined,
  side: "upstream" | "framework",
): Promise<{ locator: ContractLocator; marker?: string }>;

export function inspectSemantics(locator: unknown): Promise<SemanticSnapshot>;

export function withCorrectedAttributes<T>(
  root: EvaluatedLocator,
  rules: DomNormalizationRule[] | { accessibilityRules?: DomNormalizationRule[] },
  captureCorrectedEvidence: () => Promise<T>,
): Promise<T>;
