import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { captureDom, compareDom } from '../scripts/conformance/dom.mjs';

type EvaluateLocator = {
  evaluate: (callback: (root: Element, argument: unknown) => unknown, argument: unknown) => Promise<unknown>;
};

const locatorFor = (element: Element): EvaluateLocator => ({
  evaluate: async (callback, argument) => callback(element, argument),
});

describe('conformance DOM capture normalization', () => {
  it('rewrites corrected values only in the upstream snapshot', async () => {
    document.body.innerHTML =
      '<button class="active" role="tab" aria-selected="false" data-listener-attached="">탭</button>';
    const locator = locatorFor(document.querySelector('button')!);
    const rules = [
      {
        selector: '[role="tab"].active',
        attribute: 'aria-selected',
        operation: 'rewrite',
        rewriteValue: 'true',
      },
      {
        selector: '[role="tab"]',
        attribute: 'data-listener-attached',
        rule: 'non-semantic-runtime-bookkeeping',
      },
    ];

    const upstream = await captureDom(locator, rules, 'upstream');
    const framework = await captureDom(locator, rules, 'framework');

    expect(upstream.attributes).toContainEqual(['aria-selected', 'true']);
    expect(framework.attributes).toContainEqual(['aria-selected', 'false']);
    expect(upstream.attributes).not.toContainEqual(['data-listener-attached', '']);
    expect(framework.attributes).not.toContainEqual(['data-listener-attached', '']);
    expect(compareDom(upstream, framework).passed).toBe(false);
  });

  it('splices ignored elements and drops ignored subtrees deterministically', async () => {
    document.body.innerHTML =
      '<div class="root"><span class="wrapper"><b>first</b><i>second</i></span><span class="drop"><em>hidden</em></span><strong>last</strong></div>';
    const root = document.querySelector('.root')!;
    const snapshot = await captureDom(locatorFor(root), [
      { selector: '.wrapper', ignoreElement: true },
      { selector: '.drop', ignoreSubtree: true },
    ]);

    expect(snapshot.children).toEqual([
      { tag: 'b', attributes: [], children: [{ text: 'first' }] },
      { tag: 'i', attributes: [], children: [{ text: 'second' }] },
      { tag: 'strong', attributes: [], children: [{ text: 'last' }] },
    ]);
  });

  it('keeps accessibility comparison independent from DOM normalization', async () => {
    document.body.innerHTML = '<button role="tab" aria-selected="false">탭</button>';
    const locator = locatorFor(document.querySelector('button')!);
    const normalized = await captureDom(locator, [
      {
        selector: '[role="tab"]',
        attribute: 'aria-selected',
        operation: 'rewrite',
        rewriteValue: 'true',
      },
    ], 'upstream');
    const raw = await captureDom(locator, [], 'framework');

    expect(normalized.attributes).toContainEqual(['aria-selected', 'true']);
    expect(raw.attributes).toContainEqual(['aria-selected', 'false']);
  });
});

describe('favicon conformance policy', () => {
  it('declares favicon as non-visual and uses the explicit metadata contract', async () => {
    const manifest = parseYaml(
      await readFile('conformance/manifests/favicon.yaml', 'utf8'),
    ) as {
      fixtures: Array<{ comparisons?: { visual?: string } }>;
      contract: { semanticElement: string };
    };
    expect(manifest.fixtures[0]?.comparisons?.visual).toBe('none');
    expect(manifest.contract.semanticElement).toBe('link[rel=icon]');
  });
});
