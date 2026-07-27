import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { coreComponents } from '../apps/docs/src/data/components';
import { allPatterns } from '../apps/docs/src/data/patterns';

const root = resolve(import.meta.dirname, '..');
const docsRoot = resolve(root, 'apps/docs/src');

const internalLinkPattern = /\]\(\/(?:storybook|conformance|components|service-patterns|basic-patterns|guides|getting-started)/;

describe('docs API and route coverage', () => {
  it('publishes one API page for every documented core component', async () => {
    const files = await readdir(resolve(docsRoot, 'content/docs/components'));
    const pages = new Set(files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx')));

    for (const component of coreComponents) {
      expect(pages.has(`${component.id}.md`) || pages.has(`${component.id}.mdx`)).toBe(true);
      expect(component.props.length).toBeGreaterThan(0);
      expect(component.events.length).toBeGreaterThan(0);
      expect(component.forms.length).toBeGreaterThan(0);
      expect(component.accessibility.length).toBeGreaterThan(0);
      for (const snippet of Object.values(component.snippets)) {
        expect(snippet).toContain('@krds-community/source-hash:');
        expect(snippet).toContain('@krds-community/source-version:');
        expect(snippet).toMatch(/@krds-community\/(react|vue|svelte|solid|angular|astro)/);
      }
    }
  });

  it('keeps every pattern linked to an official checklist and stage', () => {
    expect(allPatterns.length).toBe(18);
    for (const pattern of allPatterns) {
      expect(pattern.officialChecklist).toMatch(/^https:\/\//);
      expect(pattern.officialStageLinks.length).toBeGreaterThan(0);
      expect(pattern.officialVersionBoundary).toContain('snapshot');
    }
  });

  it('does not emit root-relative internal links that bypass the configured base', async () => {
    const files = [
      resolve(docsRoot, 'content/docs/index.md'),
      resolve(docsRoot, 'content/docs/components/index.mdx'),
      resolve(docsRoot, 'content/docs/service-patterns/index.md'),
      resolve(docsRoot, 'content/docs/basic-patterns/index.md'),
      resolve(docsRoot, 'content/docs/getting-started/installation.md'),
    ];
    const contents = await Promise.all(files.map((file) => readFile(file, 'utf8')));
    expect(contents.some((content) => internalLinkPattern.test(content))).toBe(false);
  });
});
