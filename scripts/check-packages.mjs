import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const packagesRoot = join(root, 'packages');
const entries = await readdir(packagesRoot);
const failures = [];
for (const entry of entries) {
  const directory = join(packagesRoot, entry);
  if (!(await stat(directory)).isDirectory()) continue;
  const packageJson = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  if (!packageJson.name?.startsWith('@krds-community/'))
    failures.push(`${entry}: invalid package name`);
  if (packageJson.private) continue;
  for (const file of ['LICENSE', 'NOTICE']) {
    try {
      await stat(join(directory, 'dist', file));
    } catch {
      failures.push(`${entry}: dist/${file} is missing; run pnpm build`);
    }
  }
  if (!packageJson.exports) failures.push(`${entry}: exports is missing`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${entries.length} workspace package directories.`);
}
