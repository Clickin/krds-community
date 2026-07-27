import { compile } from 'svelte/compiler';
import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { render } from 'svelte/server';

const files = (await readdir('src')).filter((file) => file.endsWith('.svelte'));
for (const file of files) {
  const source = await readFile(`src/${file}`, 'utf8');
  compile(source, { generate: 'client', filename: file });
  compile(source, { generate: 'server', filename: file });
}

const additionalSource = await readFile('src/Additional.svelte', 'utf8');
const additionalServer = compile(additionalSource, {
  generate: 'server',
  filename: 'Additional.svelte',
}).js.code.replaceAll(
  "'svelte/internal/server'",
  `'${pathToFileURL(`${process.cwd()}/node_modules/svelte/src/internal/server/index.js`).href}'`,
);
const { default: Additional } = await import(
  `data:text/javascript;base64,${Buffer.from(additionalServer).toString('base64')}`,
);
const badgeMarkup = render(Additional, { props: { kind: 'badge', label: 'check' } }).body;
const modalMarkup = render(Additional, { props: { kind: 'modal', open: true, title: 'check' } }).body;
const selectMarkup = render(Additional, {
  props: {
    kind: 'select',
    modelValue: 'second',
    options: [
      { value: 'first', label: 'First' },
      { value: 'second', label: 'Second' },
    ],
  },
}).body;
if (!badgeMarkup.includes('krds-badge')) throw new Error('Additional SSR badge branch failed');
if (!modalMarkup.includes('<dialog') || !modalMarkup.includes('open=""')) throw new Error('Additional SSR modal state failed');
if (!selectMarkup.includes('value="second" selected=""')) throw new Error('Additional SSR select state failed');

console.log(`Compiled ${files.length} Svelte rune components for client and SSR.`);
