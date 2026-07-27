#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const components = ['button', 'text-input', 'checkbox', 'radio', 'switch', 'accordion'];
const frameworks = ['react', 'vue', 'svelte', 'solid', 'angular'];
const snippets = {
  react: {
    button: '<Button variant="primary">버튼</Button>',
    'text-input': '<TextInput label="레이블" hint="도움말" />',
    checkbox: '<Checkbox label="선택" name="choice" />',
    radio: '<Radio label="선택" name="choice" value="one" />',
    switch: '<Switch label="사용" name="enabled" />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  vue: {
    button: '<KrdsButton variant="primary">버튼</KrdsButton>',
    'text-input': '<KrdsTextInput v-model="value" label="레이블" hint="도움말" />',
    checkbox: '<KrdsCheckbox v-model="checked" label="선택" />',
    radio: '<KrdsRadio v-model="selected" name="choice" value="one" label="선택" />',
    switch: '<KrdsSwitch v-model="enabled" label="사용" />',
    accordion: "<KrdsAccordion :items=\"[{ id: 'one', title: '제목', content: '내용' }]\" />",
  },
  svelte: {
    button: '<Button variant="primary">버튼</Button>',
    'text-input': '<TextInput label="레이블" hint="도움말" bind:value />',
    checkbox: '<Checkbox label="선택" bind:checked />',
    radio: '<Radio label="선택" name="choice" value="one" bind:checked />',
    switch: '<Switch label="사용" bind:checked />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  solid: {
    button: '<Button variant="primary">버튼</Button>',
    'text-input': '<TextInput label="레이블" hint="도움말" />',
    checkbox: '<Checkbox label="선택" />',
    radio: '<Radio label="선택" name="choice" value="one" />',
    switch: '<Switch label="사용" />',
    accordion: "<Accordion items={[{ id: 'one', title: '제목', content: '내용' }]} />",
  },
  angular: {
    button: '<krds-button variant="primary">버튼</krds-button>',
    'text-input': '<krds-text-input label="레이블" hint="도움말" />',
    checkbox: '<krds-checkbox label="선택" />',
    radio: '<krds-radio label="선택" name="choice" value="one" />',
    switch: '<krds-switch label="사용" />',
    accordion: "<krds-accordion [items]=\"[{ id: 'one', title: '제목', content: '내용' }]\" />",
  },
};

const readClipboard = () => {
  try {
    return execFileSync('pbpaste', { encoding: 'utf8' });
  } catch {
    return '';
  }
};
const writeClipboard = (value) => {
  try {
    execFileSync('pbcopy', { input: value });
    return true;
  } catch {
    return false;
  }
};
const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const command = process.argv[2];
if (command === 'component' && process.argv[3] === 'list') {
  console.log(components.join('\n'));
} else if (command === 'component' && process.argv[3] === 'copy') {
  const component = process.argv[4];
  const framework = option('--framework', 'react');
  if (!components.includes(component) || !frameworks.includes(framework))
    throw new Error(
      `Use a supported component (${components.join(', ')}) and framework (${frameworks.join(', ')}).`,
    );
  const snippet = snippets[framework][component];
  if (process.argv.includes('--clipboard')) writeClipboard(snippet);
  console.log(snippet);
} else if (command === 'component' && process.argv[3] === 'paste') {
  const source = option('--from');
  const output = option('--out');
  const content = source ? await readFile(source, 'utf8') : readClipboard();
  if (!content) throw new Error('No clipboard content. Use --from <file> or copy a snippet first.');
  if (output) await writeFile(output, content);
  else process.stdout.write(content);
} else {
  console.log(
    'krds component list | copy <component> --framework <framework> [--clipboard] | paste [--from <file>] [--out <file>]',
  );
}
