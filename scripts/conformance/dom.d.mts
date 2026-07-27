export type DomSnapshot = {
  tag: string;
  attributes: [string, string][];
  state?: Record<string, unknown>;
  children: Array<DomSnapshot | { text: string }>;
};

export type DomNormalizationRule = Record<string, unknown>;

export function captureDom(
  locator: unknown,
  ignoredAttributes?: string | DomNormalizationRule[],
  side?: 'upstream' | 'framework',
): Promise<DomSnapshot>;

export function compareDom(
  upstream: DomSnapshot,
  framework: DomSnapshot,
): { passed: boolean; expected: string; actual: string };

export function inspectSemantics(locator: unknown): Promise<Record<string, unknown>>;
