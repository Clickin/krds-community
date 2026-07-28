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

const recipesUrl = import.meta.resolve('@krds-community/recipes');
const additionalSource = await readFile('src/Additional.svelte', 'utf8');
const additionalServer = compile(additionalSource, {
  generate: 'server',
  filename: 'Additional.svelte',
}).js.code
  .replaceAll(
    "'svelte/internal/server'",
    `'${pathToFileURL(`${process.cwd()}/node_modules/svelte/src/internal/server/index.js`).href}'`,
  )
  .replaceAll("'@krds-community/recipes'", `'${recipesUrl}'`);
const { default: Additional } = await import(
  `data:text/javascript;base64,${Buffer.from(additionalServer).toString('base64')}`,
);
const badgeMarkup = render(Additional, { props: { kind: 'badge', label: 'check' } }).body;
const modalMarkup = render(Additional, { props: { kind: 'modal', open: true, title: 'check' } }).body;
const selectMarkup = render(Additional, {
  props: {
    kind: 'select',
    class: 'consumer-select',
    modelValue: 'second',
    state: 'error',
    options: [
      { value: 'first', label: 'First' },
      { value: 'second', label: 'Second' },
    ],
  },
}).body;
const tabMarkup = render(Additional, {
  props: {
    kind: 'tab',
    class: 'consumer-tabs',
    defaultValue: 'first',
    tabs: [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
    ],
  },
}).body;
if (!badgeMarkup.includes('krds-badge')) throw new Error('Additional SSR badge branch failed');
if (
  !modalMarkup.includes('<section') ||
  !modalMarkup.includes('krds-modal fade in shown') ||
  !modalMarkup.includes('role="dialog"')
)
  throw new Error('Additional SSR modal state failed');
if (!selectMarkup.includes('value="second" selected=""')) throw new Error('Additional SSR select state failed');
if (!selectMarkup.includes('class="krds-form-select is-error consumer-select"'))
  throw new Error('Additional SSR select recipe failed');
if (
  !tabMarkup.includes('class="krds-tab-area layer consumer-tabs"') ||
  !tabMarkup.includes('class="tab line full"') ||
  !tabMarkup.includes('class="active"') ||
  !tabMarkup.includes('class="btn-tab"')
)
  throw new Error('Additional SSR tab recipe failed');

console.log(`Compiled ${files.length} Svelte rune components for client and SSR.`);
