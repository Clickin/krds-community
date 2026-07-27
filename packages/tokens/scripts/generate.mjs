import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(packageRoot, '../..');
const sourcePath = join(root, 'upstream/krds-html/tokens/transformed_tokens.json');
const out = join(packageRoot, 'src');
const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const leaves = [];

const visit = (value, path) => {
  if (value && typeof value === 'object' && 'value' in value) {
    const raw = String(value.value);
    leaves.push({
      path,
      value: raw.replace(/^\{(.+)\}$/, (_, token) => `var(--krds-${token.replace(/[./]/g, '-')})`),
    });
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) visit(child, [...path, key]);
};
visit(source, []);

const variableName = (path) =>
  `--krds-${path
    .map((segment) => segment.replace(/[^a-zA-Z0-9]+/g, '-'))
    .join('-')
    .toLowerCase()}`;
const tokenObject = Object.fromEntries(leaves.map(({ path, value }) => [path.join('.'), value]));
const css = [
  '/* GENERATED FILE. Source: upstream/krds-html/tokens/transformed_tokens.json. */',
  ':root {',
  ...leaves.map(({ path, value }) => `  ${variableName(path)}: ${value};`),
  '}',
  '',
].join('\n');
const ts = `/** GENERATED FILE. Source: upstream/krds-html/tokens/transformed_tokens.json. */\nexport const krdsTokens = ${JSON.stringify(tokenObject, null, 2)} as const;\n\nexport type KrdsTokenName = keyof typeof krdsTokens;\n`;
const provenance = {
  source: 'upstream/krds-html/tokens/transformed_tokens.json',
  repository: 'KRDS-uiux/krds-uiux',
  ref: '1.1.0',
  commit: 'd6bb184c823e4757f05807ea4646a23e3133b6e6',
  generatedAt: new Date().toISOString(),
};
await mkdir(out, { recursive: true });
await writeFile(join(out, 'generated.ts'), ts);
await writeFile(join(out, 'krds.css'), css);
await writeFile(join(out, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Generated ${leaves.length} KRDS tokens.`);
