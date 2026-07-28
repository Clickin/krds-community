import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourcePath = join(root, 'src/index.css');
const outputPath = join(root, 'dist/index.css');
const tokenCssPath = fileURLToPath(new URL('../../tokens/src/krds.css', import.meta.url));
const declarationPattern =
  /(?:^|[;{])\s*(--[a-z0-9-]+|[a-z][a-z0-9-]*)\s*:\s*([^;{}]+?)\s*(?=;)/gim;
const krdsDeclarationPattern = /(--krds-[a-z0-9-]+)\s*:/gi;
const krdsReferencePattern = /var\(\s*(--krds-[a-z0-9-]+)/gi;
const canonicalAliasPattern = /^var\(\s*--krds-[a-z0-9-]+\s*\)$/i;
const literalDesignValuePattern =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(|(?:^|[^a-z0-9_-])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?(?:%|[a-z]+)?(?![a-z0-9_-])/i;

function names(css, pattern) {
  return new Set([...css.matchAll(pattern)].map((match) => match[1]));
}

function declarations(css) {
  return [...css.matchAll(declarationPattern)].map((match) => ({
    name: match[1],
    value: match[2].trim(),
  }));
}

export function validateThemeCss(themeCss, tokenCss) {
  if (!/@import\s+['"]@krds-community\/tokens\/css['"]\s*;/.test(themeCss)) {
    throw new Error('Tailwind theme must import @krds-community/tokens/css');
  }
  if (!/@theme\s+inline\s*\{/.test(themeCss)) {
    throw new Error('Tailwind theme must use @theme inline');
  }

  const tokenDeclarations = names(tokenCss, krdsDeclarationPattern);
  if (tokenDeclarations.size === 0) {
    throw new Error('Tracked KRDS token CSS does not declare any variables');
  }

  const missingTokenReferences = [...names(tokenCss, krdsReferencePattern)].filter(
    (name) => !tokenDeclarations.has(name),
  );
  if (missingTokenReferences.length > 0) {
    throw new Error(
      `Tracked KRDS token CSS has unresolved KRDS variables: ${missingTokenReferences.sort().join(', ')}`,
    );
  }

  const localDeclarations = names(themeCss, krdsDeclarationPattern);
  const availableDeclarations = new Set([...tokenDeclarations, ...localDeclarations]);
  const missingThemeReferences = [...names(themeCss, krdsReferencePattern)].filter(
    (name) => !availableDeclarations.has(name),
  );
  if (missingThemeReferences.length > 0) {
    throw new Error(
      `Tailwind theme has unresolved KRDS variables: ${missingThemeReferences.sort().join(', ')}`,
    );
  }

  const fallbacks = [...themeCss.matchAll(/var\(\s*(--[a-z0-9-]+)\s*,/gi)].map(
    (match) => match[1],
  );
  if (fallbacks.length > 0) {
    throw new Error(`Tailwind theme must not use variable fallbacks: ${[...new Set(fallbacks)].join(', ')}`);
  }

  const themeDeclarations = declarations(themeCss);
  const invalidAliases = themeDeclarations.filter(
    ({ name, value }) =>
      (name.startsWith('--krds-tailwind-') ||
        name.startsWith('--color-') ||
        name.startsWith('--radius-') ||
        name.startsWith('--font-')) &&
      !canonicalAliasPattern.test(value),
  );
  if (invalidAliases.length > 0) {
    throw new Error(
      `Tailwind aliases must directly reference KRDS variables: ${invalidAliases
        .map(({ name }) => name)
        .join(', ')}`,
    );
  }

  const literalDesignValues = themeDeclarations.filter(({ value }) =>
    literalDesignValuePattern.test(value),
  );
  if (literalDesignValues.length > 0) {
    throw new Error(
      `Tailwind theme must not contain literal design values: ${literalDesignValues
        .map(({ name }) => name)
        .join(', ')}`,
    );
  }
}

const [source, tokenCss] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(tokenCssPath, 'utf8'),
]);
validateThemeCss(source, tokenCss);

if (process.argv.includes('--check')) {
  console.log('tailwind theme references tracked KRDS tokens without literal fallbacks');
} else {
  await mkdir(join(root, 'dist'), { recursive: true });
  await copyFile(sourcePath, outputPath);
}
