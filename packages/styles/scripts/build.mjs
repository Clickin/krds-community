import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const currentWorkingDirectory = process.cwd();
const root = currentWorkingDirectory.endsWith('/packages/styles')
  ? currentWorkingDirectory
  : join(currentWorkingDirectory, 'packages/styles');
const repositoryRoot = join(root, '../..');
const dist = join(root, 'dist');
const iconDirectory = join(dist, 'assets/icons');
const upstreamIconDirectory = join(
  repositoryRoot,
  'upstream/krds-html/resources/img/component/icon',
);
const remoteIconPrefix = 'https://www.krds.go.kr/resources/img/component/icon/';
await mkdir(iconDirectory, { recursive: true });
const upstreamCss = await readFile(
  join(repositoryRoot, 'upstream/krds-html/resources/cdn/krds.min.css'),
  'utf8',
);
const iconNames = [
  ...new Set(
    [...upstreamCss.matchAll(/url\(['"]?(https:\/\/www\.krds\.go\.kr\/resources\/img\/component\/icon\/([^'")]+))['"]?\)/g)].map(
      (match) => match[2],
    ),
  ),
];
for (const iconName of iconNames) {
  await copyFile(join(upstreamIconDirectory, iconName), join(iconDirectory, iconName));
}
await writeFile(join(dist, 'index.css'), upstreamCss.replaceAll(remoteIconPrefix, './assets/icons/'));
await copyFile(join(repositoryRoot, 'upstream/upstream.lock.json'), join(dist, 'provenance.json'));
if (process.argv.includes('--check')) {
  console.log('styles source is generated from the pinned official KRDS CSS snapshot');
}
