import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureManifests } from '../../../packages/conformance/dist/index.js';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(appRoot, '../..');
const manifests = await loadFixtureManifests(resolve(repositoryRoot, 'conformance/manifests'));
const upstreamLock = JSON.parse(
  await readFile(resolve(repositoryRoot, 'upstream/upstream.lock.json'), 'utf8'),
);
const fixtures = manifests.flatMap((manifest) =>
  manifest.fixtures.map((fixture) => ({
    ...fixture,
    componentId: manifest.id,
    sourcePath: fixture.sourceFile,
    contract: manifest.contract,
    errata: manifest.errata,
  })),
);
const output = {
  upstream: {
    repository: upstreamLock.repository,
    ref: upstreamLock.ref,
    commit: upstreamLock.commit,
    packageVersion: upstreamLock.packageVersion,
    snapshotIntegrity: upstreamLock.tarballIntegrity,
  },
  fixtures,
};
const publicDirectory = resolve(appRoot, 'public');
await mkdir(publicDirectory, { recursive: true });
await writeFile(resolve(publicDirectory, 'fixtures.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Prepared ${fixtures.length} executable fixtures.`);
