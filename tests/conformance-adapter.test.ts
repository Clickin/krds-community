import { describe, expect, it } from 'vitest';
import { frameworks } from '@krds-community/conformance';
import {
  conformanceScenarioIds,
  conformanceScenarioMatrix,
  runConformanceMatrix,
  runConformanceScenario,
  type ConformanceAdapter,
  type ConformanceScenarioId,
  type ConformanceScenarioKind,
} from '../packages/test-utils/src/index';

class FakeElement {
  readonly tagName: string;
  readonly children: FakeElement[] = [];
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Array<(event: { type: string }) => void>>();
  parent: FakeElement | null = null;
  textContent = '';
  value = '';
  checked = false;
  disabled = false;
  hidden = false;

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  append(child: FakeElement): void {
    child.parent = this;
    this.children.push(child);
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  addEventListener(type: string, listener: (event: { type: string }) => void): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  dispatchEvent(event: { type: string }): boolean {
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
    return true;
  }

  click(): void {
    if (this.disabled) return;
    if (this.tagName === 'INPUT' && this.getAttribute('type') === 'checkbox') {
      this.checked = !this.checked;
      this.dispatchEvent({ type: 'change' });
    } else {
      this.dispatchEvent({ type: 'click' });
    }
  }

  closest(selector: string): FakeElement | null {
    if (this.matches(selector)) return this;
    return this.parent?.closest(selector) ?? null;
  }

  querySelector(selector: string): FakeElement | null {
    for (const child of this.children) {
      if (child.matches(selector)) return child;
      const descendant = child.querySelector(selector);
      if (descendant) return descendant;
    }
    return null;
  }

  private matches(selector: string): boolean {
    const withoutNot = selector.replace(/:not\(\[([^\]=]+)(?:="([^"]*)")?\]\)/g, '');
    for (const [, name, expected] of withoutNot.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)) {
      const actual = this.getAttribute(name);
      if (actual === null || (expected !== undefined && actual !== expected)) return false;
    }
    const id = withoutNot.match(/^#([\w-]+)$/)?.[1];
    if (id && this.getAttribute('id') !== id) return false;
    const tag = withoutNot.match(/^[a-z]+/i)?.[0];
    if (tag && this.tagName.toLowerCase() !== tag.toLowerCase()) return false;
    return !withoutNot.includes(':not') || !this.matchesExcludedTypes(selector);
  }

  private matchesExcludedTypes(selector: string): boolean {
    for (const [, type] of selector.matchAll(/:not\(\[type="([^"]+)"\]\)/g)) {
      if (this.getAttribute('type') === type) return false;
    }
    return true;
  }
}

const element = (tag: string, text = ''): FakeElement => {
  const result = new FakeElement(tag);
  result.textContent = text;
  return result;
};

const rootFor = (kind: ConformanceScenarioKind, props: Record<string, unknown>): FakeElement => {
  const root = element('div');
  if (kind === 'button') {
    const button = element('button', String(props.label));
    button.setAttribute('type', 'button');
    button.disabled = props.disabled === true;
    root.append(button);
    return root;
  }

  if (kind === 'text-input') {
    const label = element('label', String(props.label));
    const input = element('input');
    input.setAttribute('id', 'text-input');
    input.setAttribute('type', 'text');
    input.value = String(props.value);
    label.setAttribute('for', 'text-input');
    if (props.invalid === true) input.setAttribute('aria-invalid', 'true');
    const hint = element('span', String(props.hint));
    hint.setAttribute('id', 'text-input-hint');
    input.setAttribute('aria-describedby', 'text-input-hint');
    input.addEventListener('input', () => undefined);
    label.append(input);
    root.append(label);
    root.append(hint);
    return root;
  }

  if (kind === 'checkbox' || kind === 'switch') {
    const input = element('input');
    const label = element('label', String(props.label));
    input.setAttribute('id', kind);
    input.setAttribute('type', 'checkbox');
    input.checked = props.checked === true;
    input.disabled = props.disabled === true;
    label.setAttribute('for', kind);
    label.addEventListener('change', () => undefined);
    root.append(input);
    root.append(label);
    return root;
  }

  const trigger = element('button', '방문 안내');
  const panel = element('div', '서비스 이용 안내입니다.');
  trigger.setAttribute('id', 'header-one');
  trigger.setAttribute('aria-expanded', props.open === true ? 'true' : 'false');
  trigger.setAttribute('aria-controls', 'panel-one');
  panel.setAttribute('id', 'panel-one');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'header-one');
  if (props.open === true) {
    panel.hidden = false;
  } else {
    panel.hidden = true;
    panel.setAttribute('hidden', '');
  }
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
    if (open) panel.setAttribute('hidden', '');
    else panel.attributes.delete('hidden');
  });
  root.append(trigger);
  root.append(panel);
  return root;
};

class FakeAdapter implements ConformanceAdapter {
  readonly framework: ConformanceAdapter['framework'];
  root: FakeElement = element('div');
  scenario: ConformanceScenarioId | null = null;
  props: Record<string, unknown> = {};
  readonly mutant: boolean;

  constructor(framework: ConformanceAdapter['framework'], mutant = false) {
    this.framework = framework;
    this.mutant = mutant;
  }

  async renderScenario(id: string, props?: unknown): Promise<void> {
    this.scenario = id as ConformanceScenarioId;
    this.props = { ...((props ?? {}) as Record<string, unknown>) };
    this.render();
  }

  async setProps(props: unknown): Promise<void> {
    if (this.mutant) return;
    this.props = { ...((props ?? {}) as Record<string, unknown>) };
    this.render();
  }

  async reset(): Promise<void> {
    this.root = element('div');
    this.scenario = null;
    this.props = {};
  }

  getRoot(): HTMLElement {
    return this.root as unknown as HTMLElement;
  }

  getModel(): unknown {
    if (this.scenario?.startsWith('text-input')) return { value: this.props.value };
    if (this.scenario?.startsWith('checkbox') || this.scenario?.startsWith('switch')) {
      return { checked: this.props.checked };
    }
    if (this.scenario?.startsWith('accordion')) return { open: this.props.open };
    return undefined;
  }

  private render(): void {
    const scenario = conformanceScenarioMatrix.find((item) => item.id === this.scenario);
    if (!scenario) throw new Error(`unknown ${this.scenario}`);
    this.root = rootFor(scenario.kind, this.props);
    if (scenario.kind === 'text-input') {
      const input = this.root.querySelector('input');
      input?.addEventListener('input', () => {
        if (input) this.props.value = input.value;
      });
    }
    if (scenario.kind === 'checkbox' || scenario.kind === 'switch') {
      const input = this.root.querySelector('input[type="checkbox"]');
      input?.addEventListener('change', () => {
        if (input) this.props.checked = input.checked;
      });
    }
    if (scenario.kind === 'accordion') {
      const trigger = this.root.querySelector('[aria-expanded]');
      trigger?.addEventListener('click', () => {
        if (trigger) this.props.open = trigger.getAttribute('aria-expanded') === 'true';
      });
    }
  }
}

describe('shared conformance adapter contract', () => {
  it('uses stable scenario IDs and marks every missing framework unverified', async () => {
    expect(conformanceScenarioIds).toEqual([
      'button.reactivity.props',
      'text-input.reactivity.model-state',
      'checkbox.reactivity.model',
      'switch.reactivity.model',
      'accordion.reactivity.props-toggle',
    ]);

    const evidence = await runConformanceMatrix({});
    expect(evidence).toHaveLength(frameworks.length);
    expect(evidence.every((framework) => framework.status === 'unverified')).toBe(true);
    expect(evidence.every((framework) => framework.fixtureResults.every((result) => result.status === 'unverified'))).toBe(true);
  });

  it('fails a stale setProps mutant instead of cloning a passing result', async () => {
    const result = await runConformanceScenario(
      new FakeAdapter('react', true),
      'text-input.reactivity.model-state',
    );
    expect(result.status).toBe('failing');
    expect(result.assertions?.some((assertion) => assertion.name === 'updated: value' && assertion.status === 'failing')).toBe(true);
  });

  it('executes each framework independently when adapters expose model state', async () => {
    const adapters = Object.fromEntries(
      frameworks.map((framework) => [
        framework,
        new FakeAdapter(framework),
      ]),
    );
    const evidence = await runConformanceMatrix(adapters);
    expect(evidence).toHaveLength(frameworks.length);
    expect(evidence.every((framework) => framework.status === 'passing')).toBe(true);
    expect(evidence.every((framework) => framework.fixtureResults.every((result) => result.status === 'passing'))).toBe(true);
  });
});
