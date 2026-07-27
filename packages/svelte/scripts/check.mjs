import { compile } from 'svelte/compiler';
import { readdir, readFile } from 'node:fs/promises';
const files = (await readdir('src')).filter((file) => file.endsWith('.svelte'));
for (const file of files)
  compile(await readFile(`src/${file}`, 'utf8'), { generate: 'client', filename: file });
console.log(`Compiled ${files.length} Svelte rune components.`);
