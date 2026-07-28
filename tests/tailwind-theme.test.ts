import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { beforeAll, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const tailwindRoot = resolve(root, 'packages/tailwind');
const sourcePath = resolve(tailwindRoot, 'src/index.css');
const distPath = resolve(tailwindRoot, 'dist/index.css');
const tokenCssPath = resolve(root, 'packages/tokens/src/krds.css');
const packagePath = resolve(tailwindRoot, 'package.json');
const krdsDeclarationPattern = /(--krds-[a-z0-9-]+)\s*:/gi;
const krdsReferencePattern = /var\(\s*(--krds-[a-z0-9-]+)/gi;
const declarationPattern =
  /(?:^|[;{])\s*(--[a-z0-9-]+|[a-z][a-z0-9-]*)\s*:\s*([^;{}]+?)\s*(?=;)/gim;
const literalDesignValuePattern =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(|(?:^|[^a-z0-9_-])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?(?:%|[a-z]+)?(?![a-z0-9_-])/i;


let sourceCss = '';
let distCss = '';
let tokenCss = '';

function cssBlock(css: string, marker: string): string {
  const markerIndex = css.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing CSS block: ${marker}`);
  const openIndex = css.indexOf('{', markerIndex);
  let depth = 0;
  for (let index = openIndex; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') depth -= 1;
    if (depth === 0) return css.slice(openIndex + 1, index);
  }
  throw new Error(`Unclosed CSS block: ${marker}`);
}

function declarationMap(css: string): Record<string, string> {
  return Object.fromEntries(
    [...css.matchAll(declarationPattern)].map((match) => [match[1]!, match[2]!.trim()]),
  );
}

function validateMutation(from: string, to: string) {
  const validationScript = `
    import { readFile } from 'node:fs/promises';
    import { validateThemeCss } from ${JSON.stringify(
      pathToFileURL(resolve(tailwindRoot, 'scripts/build.mjs')).href,
    )};
    const [themeCss, tokenCss] = await Promise.all([
      readFile(${JSON.stringify(sourcePath)}, 'utf8'),
      readFile(${JSON.stringify(tokenCssPath)}, 'utf8'),
    ]);
    validateThemeCss(
      themeCss.replace(${JSON.stringify(from)}, ${JSON.stringify(to)}),
      tokenCss,
    );
  `;
  return execFileAsync(process.execPath, ['--input-type=module', '--eval', validationScript], {
    cwd: root,
  });
}

beforeAll(async () => {
  await execFileAsync(process.execPath, [resolve(tailwindRoot, 'scripts/build.mjs')], {
    cwd: root,
  });
  [sourceCss, distCss, tokenCss] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readFile(distPath, 'utf8'),
    readFile(tokenCssPath, 'utf8'),
  ]);
});

describe('@krds-community/tailwind theme', () => {
  it('builds the public Tailwind v4 aliases from tracked KRDS tokens', () => {
    expect(distCss).toBe(sourceCss);
    expect(sourceCss).toContain('@theme inline');
    expect(sourceCss).not.toContain('--font-family-krds');

    expect(declarationMap(cssBlock(sourceCss, '@theme inline'))).toEqual({
      '--color-krds-primary': 'var(--krds-tailwind-color-primary)',
      '--color-krds-primary-strong': 'var(--krds-tailwind-color-primary-strong)',
      '--color-krds-secondary': 'var(--krds-tailwind-color-secondary)',
      '--color-krds-danger': 'var(--krds-tailwind-color-danger)',
      '--radius-krds': 'var(--krds-semantic-radius-medium2)',
      '--font-krds': 'var(--krds-primitive-typo-font-type)',
    });

    expect(sourceCss).toContain(':root,\n[data-krds-mode="light"]');
    expect(declarationMap(cssBlock(sourceCss, '[data-krds-mode="light"]'))).toEqual({
      '--krds-tailwind-color-primary': 'var(--krds-mode-light-color-element-primary)',
      '--krds-tailwind-color-primary-strong': 'var(--krds-mode-light-color-text-primary)',
      '--krds-tailwind-color-secondary': 'var(--krds-mode-light-color-element-secondary)',
      '--krds-tailwind-color-danger': 'var(--krds-mode-light-color-element-danger)',
      '--krds-tailwind-focus-ring-color': 'var(--krds-mode-light-color-border-primary)',
      '--krds-tailwind-focus-ring-width':
        'var(--krds-mode-light-border-width-variable-medium)',
      '--krds-tailwind-focus-ring-offset': 'var(--krds-primitive-number-2)',
    });

    const highContrastDeclarations = {
      '--krds-tailwind-color-primary':
        'var(--krds-mode-high-contrast-color-element-primary)',
      '--krds-tailwind-color-primary-strong':
        'var(--krds-mode-high-contrast-color-text-primary)',
      '--krds-tailwind-color-secondary':
        'var(--krds-mode-high-contrast-color-element-secondary)',
      '--krds-tailwind-color-danger': 'var(--krds-mode-high-contrast-color-element-danger)',
      '--krds-tailwind-focus-ring-color':
        'var(--krds-mode-high-contrast-color-border-primary)',
      '--krds-tailwind-focus-ring-width':
        'var(--krds-mode-high-contrast-border-width-variable-medium)',
      '--krds-tailwind-focus-ring-offset': 'var(--krds-primitive-number-2)',
    };
    expect(
      declarationMap(cssBlock(sourceCss, '[data-krds-mode="high-contrast"]')),
    ).toEqual(highContrastDeclarations);

    const darkMedia = cssBlock(sourceCss, '@media (prefers-color-scheme: dark)');
    expect(declarationMap(cssBlock(darkMedia, '[data-krds-mode="theme"]'))).toEqual(
      highContrastDeclarations,
    );
    expect(sourceCss).not.toContain('data-krds-theme');

    expect(declarationMap(cssBlock(sourceCss, '@utility krds-focus-ring'))).toEqual({
      outline:
        'var(--krds-tailwind-focus-ring-width) solid var(--krds-tailwind-focus-ring-color)',
      'outline-offset': 'var(--krds-tailwind-focus-ring-offset)',
    });

    const availableVariables = new Set([
      ...[...tokenCss.matchAll(krdsDeclarationPattern)].map((match) => match[1]),
      ...[...sourceCss.matchAll(krdsDeclarationPattern)].map((match) => match[1]),
    ]);
    const unresolvedVariables = [
      ...new Set([...sourceCss.matchAll(krdsReferencePattern)].map((match) => match[1])),
    ].filter((name) => !availableVariables.has(name));
    expect(unresolvedVariables).toEqual([]);

    const declarations = [...sourceCss.matchAll(declarationPattern)].map((match) => ({
      name: match[1]!,
      value: match[2]!.trim(),
    }));
    expect(sourceCss).not.toMatch(/var\(\s*--[a-z0-9-]+\s*,/i);
    expect(
      declarations.filter(({ value }) => literalDesignValuePattern.test(value)),
    ).toEqual([]);
  });

  it('rejects unresolved variables and literal design fallbacks during build validation', async () => {
    await expect(
      validateMutation(
        '--krds-mode-light-color-element-primary',
        '--krds-token-that-does-not-exist',
      ),
    ).rejects.toThrow(/unresolved KRDS variables/i);

    await expect(
      validateMutation(
        'var(--krds-semantic-radius-medium2)',
        'var(--krds-semantic-radius-medium2, 0.25rem)',
      ),
    ).rejects.toThrow(/must not use variable fallbacks/i);

    await expect(
      validateMutation('var(--krds-primitive-typo-font-type)', 'system-ui, sans-serif'),
    ).rejects.toThrow(/must directly reference KRDS variables/i);
  });

  it('rejects invalid declarations written inline with their block', async () => {
    await expect(
      validateMutation(
        '@theme inline {\n  --color-krds-primary: var(--krds-tailwind-color-primary);',
        '@theme inline { --color-krds-primary: #fff;',
      ),
    ).rejects.toThrow(/must directly reference KRDS variables/i);
  });

  it.each([
    ['font weight', 'font-weight: 700;'],
    ['opacity', 'opacity: .5;'],
  ])('rejects unitless literal %s declarations', async (_label, declaration) => {
    await expect(
      validateMutation(
        '@utility krds-focus-ring {\n  outline:',
        `@utility krds-focus-ring {\n  ${declaration}\n  outline:`,
      ),
    ).rejects.toThrow(/must not contain literal design values/i);
  });

  it('publishes the CSS entry without a Tailwind runtime dependency', async () => {
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8')) as {
      dependencies?: Record<string, string>;
      exports?: Record<string, string>;
      sideEffects?: string[];
      style?: string;
    };
    expect(packageJson.exports?.['.']).toBe('./dist/index.css');
    expect(packageJson.style).toBe('./dist/index.css');
    expect(packageJson.sideEffects).toEqual(['./dist/index.css']);
    expect(packageJson.dependencies).toEqual({ '@krds-community/tokens': 'workspace:*' });
  });
});
