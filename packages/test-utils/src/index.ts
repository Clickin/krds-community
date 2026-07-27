import {
  frameworks,
  type Framework,
  type FrameworkEvidence,
  type FixtureResult,
  type FixtureResultStatus,
} from '@krds-community/conformance';

/**
 * A browser mounted implementation of one framework's conformance fixture.
 *
 * The adapter deliberately exposes only operations that can be observed from a
 * browser fixture. In particular, `setProps` is not a test double for a
 * framework's state: callers must mount the real component and let the
 * framework update its DOM.
 */
export interface ConformanceAdapter {
  framework: Framework;
  renderScenario(id: string, props?: unknown): Promise<void>;
  setProps(props: unknown): Promise<void>;
  reset(): Promise<void>;
  getRoot(): HTMLElement;
  /**
   * Optional model observation used by the controlled-input round-trip
   * assertions. Adapters without it are reported as `unverified`, never as
   * a passing fixture.
   */
  getModel?(): unknown | Promise<unknown>;
}

export type ConformanceScenarioKind = 'button' | 'text-input' | 'checkbox' | 'switch' | 'accordion';

export type ConformanceScenarioId =
  | 'button.reactivity.props'
  | 'text-input.reactivity.model-state'
  | 'checkbox.reactivity.model'
  | 'switch.reactivity.model'
  | 'accordion.reactivity.props-toggle';

export interface ConformanceScenarioDefinition {
  id: ConformanceScenarioId;
  kind: ConformanceScenarioKind;
  initialProps: Readonly<Record<string, unknown>>;
  updatedProps: Readonly<Record<string, unknown>>;
}

/**
 * The only scenario IDs used by the shared adapter runner. Every framework
 * receives this exact ordered matrix; a missing adapter yields five
 * `unverified` results rather than copying another framework's result.
 */
export const conformanceScenarioMatrix = [
  {
    id: 'button.reactivity.props',
    kind: 'button',
    initialProps: { label: '초기 버튼', children: '초기 버튼', disabled: false },
    updatedProps: { label: '변경 버튼', children: '변경 버튼', disabled: true },
  },
  {
    id: 'text-input.reactivity.model-state',
    kind: 'text-input',
    initialProps: {
      label: '이름',
      hint: '실명을 입력하세요.',
      value: '초기값',
      invalid: false,
    },
    updatedProps: {
      label: '이름',
      hint: '입력값을 확인하세요.',
      value: '변경값',
      invalid: true,
    },
  },
  {
    id: 'checkbox.reactivity.model',
    kind: 'checkbox',
    initialProps: { label: '약관에 동의합니다.', checked: false, disabled: false },
    updatedProps: { label: '약관에 동의합니다.', checked: true, disabled: false },
  },
  {
    id: 'switch.reactivity.model',
    kind: 'switch',
    initialProps: { label: '알림 받기', checked: false, disabled: false },
    updatedProps: { label: '알림 받기', checked: true, disabled: false },
  },
  {
    id: 'accordion.reactivity.props-toggle',
    kind: 'accordion',
    initialProps: {
      items: [{ id: 'one', title: '방문 안내', content: '서비스 이용 안내입니다.' }],
      open: false,
    },
    updatedProps: {
      items: [{ id: 'one', title: '방문 안내', content: '서비스 이용 안내입니다.' }],
      open: true,
    },
  },
] as const satisfies readonly ConformanceScenarioDefinition[];

export const sharedConformanceScenarios = conformanceScenarioMatrix;
export const conformanceScenarioIds: readonly ConformanceScenarioId[] = conformanceScenarioMatrix.map(
  (scenario) => scenario.id,
);

export const verticalSliceScenarios = conformanceScenarioIds;

export type VerticalSliceScenario = ConformanceScenarioId;

export const keyboardContracts = {
  button: ['Tab', 'Enter', 'Space'],
  textInput: ['Tab', 'character-entry'],
  checkbox: ['Tab', 'Space'],
  radio: ['Tab', 'ArrowUp', 'ArrowDown', 'Space'],
  switch: ['Tab', 'Space'],
  accordion: ['Tab', 'Enter', 'Space'],
} as const;

export const accessibilityContracts = {
  accordion: ['aria-expanded', 'aria-controls', 'aria-labelledby', 'role=region'],
  textInput: ['label-for-id', 'aria-invalid-for-error', 'aria-describedby-for-message'],
  choices: ['label-for-id', 'native-checked-state', 'native-disabled-state'],
} as const;

export type FixtureAssertionStatus = Exclude<FixtureResultStatus, 'implemented'>;

export interface FixtureAssertion {
  name: string;
  status: FixtureAssertionStatus;
  expected?: unknown;
  actual?: unknown;
  selector?: string;
}

/**
 * This is intentionally structurally compatible with conformance's
 * `FixtureResult`: the extra assertion/observation fields are optional so
 * evidence can be passed directly to `buildReport`.
 */
export interface ConformanceFixtureResult
  extends Omit<FixtureResult, 'fixtureId' | 'status'> {
  fixtureId: ConformanceScenarioId;
  status: FixtureResultStatus;
  assertions?: FixtureAssertion[];
  observed?: Record<string, unknown>;
}

/**
 * A framework evidence result that can be passed directly to conformance's
 * `buildReport` or `createStrictEvidence` without status cloning.
 */
export interface ConformanceFrameworkEvidence extends Omit<FrameworkEvidence, 'fixtureResults'> {
  fixtureResults: ConformanceFixtureResult[];
}

export interface ConformanceMatrixOptions {
  scenarios?: readonly ConformanceScenarioId[];
  sourceByFramework?: Partial<Record<Framework, string>>;
}

export interface BrowserConformanceRuntime {
  navigate(url: string): Promise<void>;
  setProps(props: unknown): Promise<void>;
  reset(): Promise<void>;
  getRoot(): HTMLElement;
}

export interface BrowserConformanceAdapterOptions {
  framework: Framework;
  runtime: BrowserConformanceRuntime;
  route?: (framework: Framework, scenarioId: string) => string;
}

export const conformanceRoute = (framework: Framework, scenarioId: string): string =>
  `/conformance/${framework}/${scenarioId}`;

/**
 * Wrap a deterministic browser fixture route in the common adapter contract.
 * Constructing this object does not claim evidence; `runConformanceMatrix`
 * must invoke it for every result to become anything other than unverified.
 */
export const createBrowserConformanceAdapter = ({
  framework,
  runtime,
  route = conformanceRoute,
}: BrowserConformanceAdapterOptions): ConformanceAdapter => ({
  framework,
  async renderScenario(id, props) {
    await runtime.navigate(route(framework, id));
    if (props !== undefined) await runtime.setProps(props);
  },
  setProps: (props) => runtime.setProps(props),
  reset: () => runtime.reset(),
  getRoot: () => runtime.getRoot(),
});

const scenarioById = new Map(
  conformanceScenarioMatrix.map((scenario) => [scenario.id, scenario] as const),
);

const textOf = (element: Element): string => (element.textContent ?? '').replace(/\s+/g, ' ').trim();

const attr = (element: Element, name: string): string | null => element.getAttribute(name);

const asBoolean = (value: string | null): boolean | null => {
  if (value === null) return null;
  if (value === 'true' || value === '') return true;
  if (value === 'false') return false;
  return null;
};

const cloneProps = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(cloneProps);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneProps(child)]),
    );
  }
  return value;
};

const selectorEscape = (value: string): string => value.replace(/(["\\])/g, '\\$1');

const first = (root: HTMLElement, selectors: readonly string[]): Element | null => {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) return element;
  }
  return null;
};

const hasLabelRelation = (root: HTMLElement, control: Element): boolean => {
  const id = control.getAttribute('id');
  if (id) {
    const escapedId = selectorEscape(id);
    if (root.querySelector(`label[for="${escapedId}"]`)) return true;
  }
  return typeof control.closest === 'function' && Boolean(control.closest('label'));
};

const panelFor = (root: HTMLElement, trigger: Element): Element | null => {
  const controls = attr(trigger, 'aria-controls');
  if (!controls) return null;
  const escapedControls = selectorEscape(controls);
  return (
    root.querySelector(`#${escapedControls}`) ??
    root.querySelector(`[id="${escapedControls}"]`) ??
    root.ownerDocument?.getElementById(controls) ??
    null
  );
};

const isHTMLElement = (element: Element): element is HTMLElement =>
  typeof HTMLElement !== 'undefined' && element instanceof HTMLElement;


const hiddenState = (panel: Element): boolean =>
  isHTMLElement(panel) ? Boolean(panel.hidden) || panel.hasAttribute('hidden') : panel.hasAttribute('hidden');

const modelValue = (model: unknown, key: string): unknown => {
  if (model && typeof model === 'object' && key in model) {
    return (model as Record<string, unknown>)[key];
  }
  return model;
};

const modelKey = (kind: ConformanceScenarioKind): 'value' | 'checked' | 'open' | null => {
  if (kind === 'text-input') return 'value';
  if (kind === 'checkbox' || kind === 'switch') return 'checked';
  if (kind === 'accordion') return 'open';
  return null;
};

const addAssertion = (
  assertions: FixtureAssertion[],
  name: string,
  status: FixtureAssertionStatus,
  expected?: unknown,
  actual?: unknown,
  selector?: string,
): void => {
  const assertion: FixtureAssertion = { name, status };
  if (expected !== undefined) assertion.expected = expected;
  if (actual !== undefined) assertion.actual = actual;
  if (selector !== undefined) assertion.selector = selector;
  assertions.push(assertion);
};

const click = (element: Element): void => {
  if (isHTMLElement(element)) {
    element.click();
    return;
  }
  const clickMethod = (element as Element & { click?: () => void }).click;
  if (clickMethod) clickMethod.call(element);
};

const settle = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

const resultStatus = (
  assertions: readonly FixtureAssertion[],
  errors: readonly string[],
): FixtureAssertionStatus => {
  if (errors.length || assertions.some((assertion) => assertion.status === 'failing')) {
    return 'failing';
  }
  if (assertions.some((assertion) => assertion.status === 'unverified')) return 'unverified';
  return 'passing';
};

const assertLabel = (
  root: HTMLElement,
  control: Element,
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): void => {
  const selector = 'label[for] or wrapping label';
  const pass = hasLabelRelation(root, control);
  addAssertion(assertions, 'label relation', pass ? 'passing' : 'failing', true, pass, selector);
  if (!pass) unresolvedSelectors.push(selector);
};

const assertButton = (
  root: HTMLElement,
  props: Readonly<Record<string, unknown>>,
  phase: string,
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): void => {
  const selector = 'button';
  const button = root.querySelector(selector);
  if (!button) {
    addAssertion(assertions, `${phase}: native button`, 'failing', true, false, selector);
    unresolvedSelectors.push(selector);
    return;
  }
  const expectedLabel = String(props.label ?? props.children ?? '');
  const actualLabel = textOf(button);
  addAssertion(
    assertions,
    `${phase}: native button`,
    button.tagName.toLowerCase() === 'button' ? 'passing' : 'failing',
    'button',
    button.tagName.toLowerCase(),
    selector,
  );
  addAssertion(
    assertions,
    `${phase}: label`,
    actualLabel === expectedLabel ? 'passing' : 'failing',
    expectedLabel,
    actualLabel,
    selector,
  );
  const expectedDisabled = props.disabled === true;
  const actualDisabled = (button as HTMLButtonElement).disabled;
  addAssertion(
    assertions,
    `${phase}: disabled`,
    actualDisabled === expectedDisabled ? 'passing' : 'failing',
    expectedDisabled,
    actualDisabled,
    selector,
  );
  const redundantRole = attr(button, 'role') === 'button';
  addAssertion(assertions, `${phase}: no redundant role`, redundantRole ? 'failing' : 'passing', false, redundantRole, selector);
};

const assertTextInput = (
  root: HTMLElement,
  props: Readonly<Record<string, unknown>>,
  phase: string,
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): Element | null => {
  const selector = 'input text control';
  const input = first(root, [
    'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"])',
    'textarea',
  ]);
  if (!input) {
    addAssertion(assertions, `${phase}: input`, 'failing', true, false, selector);
    unresolvedSelectors.push(selector);
    return null;
  }
  const value = (input as HTMLInputElement).value;
  const expectedValue = String(props.value ?? '');
  addAssertion(
    assertions,
    `${phase}: value`,
    value === expectedValue ? 'passing' : 'failing',
    expectedValue,
    value,
    selector,
  );
  assertLabel(root, input, assertions, unresolvedSelectors);
  const expectedInvalid = props.invalid === true;
  const invalid = asBoolean(attr(input, 'aria-invalid')) === true;
  addAssertion(
    assertions,
    `${phase}: aria-invalid`,
    invalid === expectedInvalid ? 'passing' : 'failing',
    expectedInvalid,
    invalid,
    selector,
  );
  const hint = props.hint;
  const describedBy = attr(input, 'aria-describedby');
  const described = describedBy
    ? describedBy
        .split(/\s+/)
        .filter(Boolean)
        .every((id) => Boolean(root.querySelector(`#${selectorEscape(id)}`)))
    : hint === undefined || hint === null || hint === '';
  addAssertion(
    assertions,
    `${phase}: aria-describedby`,
    described ? 'passing' : 'failing',
    true,
    described,
    selector,
  );
  return input;
};

const assertChoice = (
  root: HTMLElement,
  props: Readonly<Record<string, unknown>>,
  phase: string,
  kind: 'checkbox' | 'switch',
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): Element | null => {
  const selector = 'input[type="checkbox"]';
  const input = root.querySelector(selector);
  if (!input) {
    addAssertion(assertions, `${phase}: ${kind} input`, 'failing', true, false, selector);
    unresolvedSelectors.push(selector);
    return null;
  }
  const expectedChecked = props.checked === true;
  const checked = (input as HTMLInputElement).checked;
  addAssertion(
    assertions,
    `${phase}: checked`,
    checked === expectedChecked ? 'passing' : 'failing',
    expectedChecked,
    checked,
    selector,
  );
  const expectedDisabled = props.disabled === true;
  const disabled = (input as HTMLInputElement).disabled;
  addAssertion(
    assertions,
    `${phase}: disabled`,
    disabled === expectedDisabled ? 'passing' : 'failing',
    expectedDisabled,
    disabled,
    selector,
  );
  assertLabel(root, input, assertions, unresolvedSelectors);
  return input;
};

const assertAccordion = (
  root: HTMLElement,
  props: Readonly<Record<string, unknown>>,
  phase: string,
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): Element | null => {
  const selector = '[aria-expanded]';
  const trigger = root.querySelector(selector);
  if (!trigger) {
    addAssertion(assertions, `${phase}: trigger`, 'failing', true, false, selector);
    unresolvedSelectors.push(selector);
    return null;
  }
  const expectedOpen = props.open === true;
  const expanded = asBoolean(attr(trigger, 'aria-expanded')) === true;
  addAssertion(
    assertions,
    `${phase}: aria-expanded`,
    expanded === expectedOpen ? 'passing' : 'failing',
    expectedOpen,
    expanded,
    selector,
  );
  const controls = attr(trigger, 'aria-controls');
  addAssertion(
    assertions,
    `${phase}: aria-controls`,
    controls ? 'passing' : 'failing',
    true,
    Boolean(controls),
    selector,
  );
  const panel = panelFor(root, trigger);
  if (!panel) {
    addAssertion(assertions, `${phase}: controlled panel`, 'failing', true, false, selector);
    unresolvedSelectors.push('aria-controls target');
    return trigger;
  }
  const labelledBy = attr(panel, 'aria-labelledby');
  const labelled = labelledBy === attr(trigger, 'id');
  addAssertion(
    assertions,
    `${phase}: aria-labelledby`,
    labelled ? 'passing' : 'failing',
    attr(trigger, 'id'),
    labelledBy,
    '[role="region"]',
  );
  const region = attr(panel, 'role') === 'region';
  addAssertion(
    assertions,
    `${phase}: region role`,
    region ? 'passing' : 'failing',
    'region',
    attr(panel, 'role'),
    '[role="region"]',
  );
  const hidden = hiddenState(panel);
  addAssertion(
    assertions,
    `${phase}: hidden`,
    hidden === !expectedOpen ? 'passing' : 'failing',
    !expectedOpen,
    hidden,
    '[role="region"]',
  );
  return trigger;
};

const assertPhase = (
  root: HTMLElement,
  scenario: ConformanceScenarioDefinition,
  props: Readonly<Record<string, unknown>>,
  phase: string,
  assertions: FixtureAssertion[],
  unresolvedSelectors: string[],
): Element | null => {
  if (scenario.kind === 'button') {
    assertButton(root, props, phase, assertions, unresolvedSelectors);
    return root.querySelector('button');
  }
  if (scenario.kind === 'text-input') {
    return assertTextInput(root, props, phase, assertions, unresolvedSelectors);
  }
  if (scenario.kind === 'checkbox' || scenario.kind === 'switch') {
    return assertChoice(root, props, phase, scenario.kind, assertions, unresolvedSelectors);
  }
  return assertAccordion(root, props, phase, assertions, unresolvedSelectors);
};

const interactionProps = (
  scenario: ConformanceScenarioDefinition,
): { props: Record<string, unknown>; expected: unknown; key: 'value' | 'checked' | 'open' | null } => {
  const props = { ...scenario.updatedProps };
  if (scenario.kind === 'text-input') {
    props.value = '왕복값';
    return { props, expected: '왕복값', key: 'value' };
  }
  if (scenario.kind === 'checkbox' || scenario.kind === 'switch') {
    props.checked = false;
    return { props, expected: false, key: 'checked' };
  }
  if (scenario.kind === 'accordion') {
    props.open = false;
    return { props, expected: false, key: 'open' };
  }
  return { props, expected: undefined, key: null };
};

const readModel = async (
  adapter: ConformanceAdapter,
  scenario: ConformanceScenarioDefinition,
  expected: unknown,
  assertions: FixtureAssertion[],
): Promise<void> => {
  const key = modelKey(scenario.kind);
  if (!key) return;
  if (!adapter.getModel) {
    addAssertion(assertions, 'model round-trip', 'unverified', expected, undefined);
    return;
  }
  const model = await adapter.getModel();
  const actual = modelValue(model, key);
  addAssertion(
    assertions,
    'model round-trip',
    Object.is(actual, expected) ? 'passing' : 'failing',
    expected,
    actual,
  );
};

/**
 * Execute one fixture against the supplied mounted implementation.
 *
 * A passing result requires the adapter to render, accept updated props, expose
 * a root, and satisfy every DOM assertion. Controlled fixtures additionally
 * require `getModel`; otherwise their result is explicitly `unverified`.
 */
export const runConformanceScenario = async (
  adapter: ConformanceAdapter,
  scenarioId: ConformanceScenarioId,
): Promise<ConformanceFixtureResult> => {
  const scenario = scenarioById.get(scenarioId);
  if (!scenario) {
    return {
      fixtureId: scenarioId,
      status: 'failing',
      errors: [`Unknown conformance scenario: ${scenarioId}`],
    };
  }

  const assertions: FixtureAssertion[] = [];
  const errors: string[] = [];
  const unresolvedSelectors: string[] = [];
  let observed: Record<string, unknown> = { framework: adapter.framework, scenario: scenario.id };
  try {
    await adapter.reset();
    await adapter.renderScenario(scenario.id, cloneProps(scenario.initialProps));
    await settle();
    const root = adapter.getRoot();
    const initialRoot = assertPhase(
      root,
      scenario,
      scenario.initialProps,
      'initial',
      assertions,
      unresolvedSelectors,
    );

    await adapter.setProps(cloneProps(scenario.updatedProps));
    await settle();
    const updatedRoot = adapter.getRoot();
    const updatedControl = assertPhase(
      updatedRoot,
      scenario,
      scenario.updatedProps,
      'updated',
      assertions,
      unresolvedSelectors,
    );

    const control = updatedControl ?? initialRoot;
    if (control && scenario.kind !== 'button') {
      click(control);
      await settle();
      let interactionRoot = adapter.getRoot();
      const interaction = interactionProps(scenario);
      if (scenario.kind === 'text-input') {
        const input = first(interactionRoot, [
          'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"])',
          'textarea',
        ]) as HTMLInputElement | null;
        if (input) {
          input.value = String(interaction.expected);
          if (typeof input.dispatchEvent === 'function' && typeof Event === 'function') {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          await settle();
          interactionRoot = adapter.getRoot();
        }
      }
      assertPhase(
        interactionRoot,
        scenario,
        interaction.props,
        'interaction',
        assertions,
        unresolvedSelectors,
      );
      await readModel(adapter, scenario, interaction.expected, assertions);
      await adapter.setProps(cloneProps(interaction.props));
      await settle();
      const roundTripRoot = adapter.getRoot();
      assertPhase(
        roundTripRoot,
        scenario,
        interaction.props,
        'round-trip',
        assertions,
        unresolvedSelectors,
      );
    }

    observed = {
      ...observed,
      unresolvedSelectors: [...new Set(unresolvedSelectors)],
      assertionCount: assertions.length,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  const status = resultStatus(assertions, errors);
  return {
    fixtureId: scenario.id,
    status,
    assertions,
    observed,
    ...(errors.length ? { errors } : {}),
  };
};

const missingEvidence = (
  framework: Framework,
  scenarios: readonly ConformanceScenarioId[],
  source?: string,
): ConformanceFrameworkEvidence => ({
  framework,
  status: 'unverified',
  fixtureResults: scenarios.map((fixtureId) => ({
    fixtureId,
    status: 'unverified',
    errors: [`${framework}: ConformanceAdapter is not registered`],
  })),
  unresolvedSelectors: [],
  errata: [],
  errors: [`${framework}: ConformanceAdapter is not registered`],
  ...(source ? { source } : {}),
});

/**
 * Run the same matrix for every framework. Missing, mis-labelled, or
 * throwing adapters stay isolated to their framework and are never replaced
 * by another framework's result.
 */
export const runConformanceMatrix = async (
  adapters: Partial<Record<Framework, ConformanceAdapter>>,
  options: ConformanceMatrixOptions = {},
): Promise<ConformanceFrameworkEvidence[]> => {
  const scenarios = options.scenarios ?? conformanceScenarioIds;
  const unknownScenarios = scenarios.filter((id) => !scenarioById.has(id));
  if (unknownScenarios.length) {
    throw new Error(`Unknown conformance scenarios: ${unknownScenarios.join(', ')}`);
  }

  const evidence: ConformanceFrameworkEvidence[] = [];
  for (const framework of frameworks) {
    const adapter = adapters[framework];
    const source = options.sourceByFramework?.[framework];
    if (!adapter) {
      evidence.push(missingEvidence(framework, scenarios, source));
      continue;
    }
    if (adapter.framework !== framework) {
      const error = `${framework}: adapter framework is ${adapter.framework}`;
      evidence.push({
        framework,
        status: 'failing',
        fixtureResults: scenarios.map((fixtureId) => ({
          fixtureId,
          status: 'failing',
          errors: [error],
        })),
        unresolvedSelectors: [],
        errata: [],
        errors: [error],
        ...(source ? { source } : {}),
      });
      continue;
    }

    const fixtureResults: ConformanceFixtureResult[] = [];
    for (const scenario of scenarios) {
      fixtureResults.push(await runConformanceScenario(adapter, scenario));
    }
    const unresolvedSelectors = [
      ...new Set(
        fixtureResults.flatMap(
          (result) =>
            result.assertions?.flatMap((assertion) =>
              assertion.status === 'failing' && assertion.selector ? [assertion.selector] : [],
            ) ?? [],
        ),
      ),
    ];
    const errors = fixtureResults.flatMap((result) => result.errors ?? []);
    const status: FixtureAssertionStatus = errors.length
      ? 'failing'
      : fixtureResults.some((result) => result.status === 'failing')
        ? 'failing'
        : fixtureResults.some((result) => result.status === 'unverified')
          ? 'unverified'
          : 'passing';
    evidence.push({
      framework,
      status,
      fixtureResults,
      unresolvedSelectors,
      errata: [],
      errors,
      ...(source ? { source } : {}),
    });
  }
  return evidence;
};
