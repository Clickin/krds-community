import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { iconSvg } from '../packages/icons/dist/index.js';

const root = process.cwd();
const outputRoot = join(root, 'storybook-static');
const projects = [
  { id: 'react', label: 'React', icon: 'react', config: '.storybook/react', port: 6006 },
  { id: 'vue', label: 'Vue', icon: 'vue', config: '.storybook/vue', port: 6007 },
  { id: 'svelte', label: 'Svelte', icon: 'svelte', config: '.storybook/svelte', port: 6008 },
  { id: 'solid', label: 'SolidJS', icon: 'solid', config: '.storybook/solid', port: 6009 },
  { id: 'angular', label: 'Angular', icon: 'angular', config: '.storybook/angular', port: 6010 },
];

const command = process.argv[2] ?? 'dev';
const storybook = join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'storybook.cmd' : 'storybook',
);
const angularCli = join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'ng.cmd' : 'ng',
);

const run = (executable, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd: root, stdio: 'inherit', env: process.env });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Storybook exited with ${signal ?? code}`));
    });
  });

const writePortal = async () => {
  const links = projects
    .map(
      ({ id, label, icon }) =>
        `<li><a href="./${id}/"><span class="framework-icon" aria-hidden="true">${iconSvg(icon)}</span><span>${label} Storybook</span></a><span>프레임워크 네이티브 예제와 상호작용 확인</span></li>`,
    )
    .join('');
  await writeFile(
    join(outputRoot, 'index.html'),
    `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KRDS Community Storybook</title>
<style>body{font-family:system-ui,sans-serif;max-width:56rem;margin:0 auto;padding:4rem 1.5rem;color:#171719}h1{margin-bottom:.5rem}p{color:#58616a}ul{display:grid;gap:1rem;padding:0;list-style:none}li{border:1px solid #b1b8be;border-radius:.5rem;padding:1rem}a{display:flex;align-items:center;gap:.5rem;font-weight:700;color:#0b50d0;text-decoration:none}a>span:last-child{margin:0;color:inherit;font-size:1rem}.framework-icon{display:inline-flex;margin:0;color:currentColor}.framework-icon svg{width:1.25rem;height:1.25rem}li>span{display:block;margin-top:.4rem;color:#58616a;font-size:.9rem}</style></head>
<body><main><p>KRDS Community</p><h1>프레임워크별 Storybook</h1><p>각 프레임워크의 렌더러와 생명주기를 보존한 독립 Storybook을 하나의 프로젝트 포털에서 제공합니다.</p><ul>${links}</ul></main></body></html>
`,
  );
};

if (command === 'build') {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  for (const project of projects) {
    if (project.id === 'angular') {
      await run(angularCli, ['run', 'krds-storybook:build-storybook']);
    } else {
      await run(storybook, [
        'build',
        '--config-dir',
        project.config,
        '--output-dir',
        join(outputRoot, project.id),
      ]);
    }
  }
  await writePortal();
  console.log(`Built ${projects.length} framework Storybooks in ${outputRoot}.`);
} else if (command === 'dev') {
  const children = projects.map((project) => {
    if (project.id === 'angular') {
      return spawn(angularCli, ['run', 'krds-storybook:storybook'], {
        cwd: root,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      });
    }
    const child = spawn(
      storybook,
      ['dev', '--config-dir', project.config, '--port', String(project.port), '--no-open'],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], env: process.env },
    );
    child.stdout.on('data', (data) => process.stdout.write(`[${project.label}] ${data}`));
    child.stderr.on('data', (data) => process.stderr.write(`[${project.label}] ${data}`));
    return child;
  });
  const stop = () => children.forEach((child) => child.kill('SIGTERM'));
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  await new Promise((resolve) => children.at(-1)?.once('exit', resolve));
} else {
  throw new Error(`Unknown Storybook command: ${command}. Use dev or build.`);
}
