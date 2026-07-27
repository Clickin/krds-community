import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadManifests } from '../packages/conformance/dist/index.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const frameworkIds = ['react', 'vue', 'svelte', 'solid', 'angular'];
const packageSources = Object.fromEntries(
  frameworkIds.map((framework) => [
    framework,
    join(
      root,
      'packages',
      framework,
      'src',
      framework === 'svelte' ? 'index.js' : framework === 'solid' ? 'index.tsx' : 'index.ts',
    ),
  ]),
);

const pascalCase = (value) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const unquote = (value) => value.trim().replace(/^['"]|['"]$/g, '');

const selectorTokens = (selector) => {
  const tokens = new Set();
  const tag = selector.match(/^[a-z][a-z0-9-]*/i)?.[0];
  if (tag) tokens.add(tag);
  for (const match of selector.matchAll(/[.#]([a-z][a-z0-9_-]*)/gi)) tokens.add(match[1]);
  for (const match of selector.matchAll(/\[([a-z][a-z0-9_-]*)(?:\s*[~|^$*]?=\s*([^\]]+))?\]/gi)) {
    tokens.add(match[1]);
    if (match[2]) tokens.add(unquote(match[2]));
  }
  return [...tokens].filter(Boolean);
};

const parseFixtureBlocks = (text) => {
  const fixturesText = text.split(/^fixtures:\s*$/m)[1]?.split(/^contract:\s*$/m)[0] ?? '';
  const matches = [...fixturesText.matchAll(/^\s+- id:\s*([^\s]+)\s*$/gm)];
  return matches.map((match, index) => {
    const block = fixturesText.slice(match.index, matches[index + 1]?.index ?? fixturesText.length);
    return {
      id: match[1],
      sourceSelector: unquote(block.match(/^\s+sourceSelector:\s*(.+)$/m)?.[1] ?? ''),
      mandatory: /^\s+mandatory:\s*true\s*$/m.test(block),
      viewport: block.match(/^\s+viewport:\s*([^\s]+)\s*$/m)?.[1] ?? '',
      states: (block.match(/^\s+states:\s*\[([^\]]*)\]/m)?.[1] ?? '')
        .split(',')
        .map((state) => state.trim())
        .filter(Boolean),
    };
  });
};

const readFixtureData = async (manifest) => {
  const path = join(root, 'conformance', 'manifests', `${manifest.id}.yaml`);
  const text = await readFile(path, 'utf8');
  return { text, fixtures: parseFixtureBlocks(text) };
};

const assertManifestContracts = async (manifests) => {
  const failures = [];
  const sourceCache = new Map();
  const getSource = async (path) => {
    if (!sourceCache.has(path)) sourceCache.set(path, await readFile(path, 'utf8'));
    return sourceCache.get(path);
  };

  for (const manifest of manifests) {
    const { text, fixtures } = await readFixtureData(manifest);
    if (manifest.status !== 'passing') failures.push(`${manifest.id}: status=${manifest.status}`);
    if (fixtures.length === 0) failures.push(`${manifest.id}: fixture is missing`);
    if (fixtures.some((fixture) => !fixture.mandatory)) {
      failures.push(`${manifest.id}: every fixture must be mandatory`);
    }
    if (
      fixtures.some(
        (fixture) => !fixture.sourceSelector || !fixture.viewport || !fixture.states.length,
      )
    ) {
      failures.push(`${manifest.id}: fixture contract is incomplete`);
    }
    if (!/^contract:\s*$/m.test(text) || !/^\s+semanticElement:\s*\S+/m.test(text)) {
      failures.push(`${manifest.id}: semantic contract is missing`);
    }
    if (!/^\s+accessibility:\s*\[/m.test(text)) {
      failures.push(`${manifest.id}: accessibility contract is missing`);
    }

    const upstreamFiles = [...text.matchAll(/^\s+- (upstream\/[^\n]+)$/gm)].map(
      (match) => match[1],
    );
    const upstreamText = [];
    for (const relativePath of upstreamFiles) {
      const absolutePath = join(root, relativePath);
      try {
        upstreamText.push(await getSource(absolutePath));
      } catch {
        failures.push(`${manifest.id}: upstream source is missing: ${relativePath}`);
      }
    }
    const combinedSource = upstreamText.join('\n');
    for (const fixture of fixtures) {
      const missingSelectorToken = selectorTokens(fixture.sourceSelector).find(
        (token) => !combinedSource.includes(token),
      );
      if (missingSelectorToken) {
        failures.push(
          `${manifest.id}/${fixture.id}: sourceSelector not found upstream: ${fixture.sourceSelector}`,
        );
      }
    }

    const componentName = pascalCase(manifest.id);
    for (const [framework, sourcePath] of Object.entries(packageSources)) {
      const source = await getSource(sourcePath);
      if (!source.includes(componentName)) {
        failures.push(`${manifest.id}: ${framework} export is missing (${componentName})`);
      }
    }
  }
  return failures;
};

const serveStatic = async (directory) => {
  const server = createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
      const relativePath = normalize(requestPath).replace(/^([.][.][\\/])+/, '');
      const candidate = join(directory, relativePath === '/' ? 'index.html' : relativePath);
      const file = await stat(candidate);
      const filePath = file.isDirectory() ? join(candidate, 'index.html') : candidate;
      response.writeHead(200, { 'Content-Type': contentType(extname(filePath)) });
      response.end(await readFile(filePath));
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((resolvePromise) => server.listen(0, '127.0.0.1', resolvePromise));
  const address = server.address();
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
};

const contentType = (extension) =>
  ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
  })[extension] ?? 'application/octet-stream';

const findAxe = async () => {
  const candidates = [
    join(root, 'node_modules', 'axe-core', 'axe.min.js'),
    join(root, 'node_modules', '.pnpm', 'node_modules', 'axe-core', 'axe.min.js'),
  ];
  for (const candidate of candidates) {
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // Continue through the package-manager layouts available in CI and local workspaces.
    }
  }
  throw new Error('axe-core is required for strict conformance checks');
};

const findInventoryStory = async (baseUrl, framework) => {
  const response = await fetch(`${baseUrl}/${framework}/index.json`);
  if (!response.ok) throw new Error(`${framework}: Storybook index is unavailable`);
  const index = await response.json();
  const entry = Object.values(index.entries).find(
    (candidate) =>
      candidate.exportName === 'Inventory' && candidate.importPath.includes('AllComponents'),
  );
  if (!entry) throw new Error(`${framework}: full inventory story is missing`);
  return entry.id;
};

const checkRenderedInventories = async (manifests) => {
  const { server, baseUrl } = await serveStatic(join(root, 'storybook-static'));
  const axePath = await findAxe();
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  try {
    for (const framework of frameworkIds) {
      const storyId = await findInventoryStory(baseUrl, framework);
      const page = await browser.newPage();
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));
      const url = `${baseUrl}/${framework}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;
      console.log(`Checking ${framework}: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForFunction(
          () => document.querySelectorAll('[class*="krds-"]').length > 0,
          null,
          { timeout: 10_000 },
        );
        const bodyText = await page.locator('body').innerText();
        if (/couldn't find story|failed to render|error occurred/i.test(bodyText)) {
          failures.push(`${framework}: Storybook reported a render error`);
        }
        const renderedElements = await page.locator('[class*="krds-"]').count();
        if (renderedElements < manifests.length / 2) {
          failures.push(
            `${framework}: inventory rendered too few KRDS elements (${renderedElements})`,
          );
        }
        const semanticFindings = await page.evaluate(() => {
          const findings = [];
          const nativeButtonRoles = document.querySelectorAll('button[role="button"]').length;
          if (nativeButtonRoles)
            findings.push(`${nativeButtonRoles} native buttons repeat role=button`);

          for (const element of document.querySelectorAll('[aria-expanded]')) {
            const controls = element.getAttribute('aria-controls');
            if (!controls || !document.getElementById(controls)) {
              findings.push('aria-expanded is missing a valid aria-controls target');
            }
          }

          for (const tablist of document.querySelectorAll('[role="tablist"]')) {
            const tabs = tablist.querySelectorAll('[role="tab"]');
            if (!tabs.length) findings.push('tablist has no tab descendants');
            for (const tab of tabs) {
              const controls = tab.getAttribute('aria-controls');
              if (!controls || !document.getElementById(controls)) {
                findings.push('tab is missing a valid aria-controls target');
              }
            }
          }

          for (const table of document.querySelectorAll('table')) {
            if (table.closest('[aria-hidden="true"]')) continue;
            if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
              findings.push('table is missing caption or accessible name');
            }
            if (!table.querySelector('th')) findings.push('table is missing a header cell');
          }

          for (const control of document.querySelectorAll('input, select, textarea')) {
            if (control.type === 'hidden' || control.getAttribute('aria-hidden') === 'true')
              continue;
            const id = control.getAttribute('id');
            const hasLabel = Boolean(
              control.getAttribute('aria-label') ||
              control.getAttribute('aria-labelledby') ||
              (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
              control.closest('label'),
            );
            if (!hasLabel) findings.push(`${control.tagName.toLowerCase()} is missing a label`);
          }
          return findings;
        });
        for (const finding of semanticFindings) failures.push(`${framework}: ${finding}`);

        await page.evaluate(() => {
          document.body.setAttribute('tabindex', '-1');
          document.body.focus();
        });
        const keyboardFindings = [];
        for (let index = 0; index < 12; index += 1) {
          await page.keyboard.press('Tab');
          const focusState = await page.evaluate(() => {
            const active = document.activeElement;
            return {
              isBody: active === document.body,
              isFocusable: Boolean(
                active &&
                (active.matches(
                  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
                ) ||
                  active.matches('[contenteditable="true"]')),
              ),
              isVisible: Boolean(active && active.matches(':focus-visible')),
            };
          });
          if (focusState.isBody || !focusState.isFocusable || !focusState.isVisible) {
            keyboardFindings.push(`tab ${index + 1} did not produce a visible focus target`);
            break;
          }
        }
        for (const finding of keyboardFindings) failures.push(`${framework}: ${finding}`);

        await page.addScriptTag({ path: axePath });
        const violations = await page.evaluate(async () => {
          const result = await window.axe.run(document, { resultTypes: ['violations'] });
          return result.violations.map((violation) => ({
            id: violation.id,
            count: violation.nodes.length,
            targets: violation.nodes.slice(0, 3).map((node) => node.target),
          }));
        });
        if (violations.length)
          failures.push(`${framework}: axe violations ${JSON.stringify(violations)}`);

        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: 'networkidle' });
        const mobileOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        );
        if (mobileOverflow) failures.push(`${framework}: mobile inventory has horizontal overflow`);
      } catch (error) {
        failures.push(`${framework}: ${error instanceof Error ? error.message : String(error)}`);
        const bodyText = await page
          .locator('body')
          .innerText()
          .catch(() => '');
        if (bodyText) failures.push(`${framework}: body=${bodyText.slice(0, 500)}`);
      }
      if (consoleErrors.length)
        failures.push(`${framework}: browser errors ${JSON.stringify(consoleErrors)}`);
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolvePromise) => server.close(resolvePromise));
  }
  return failures;
};

const main = async () => {
  const manifests = await loadManifests(join(root, 'conformance', 'manifests'));
  const failures = [...(await assertManifestContracts(manifests))];
  failures.push(...(await checkRenderedInventories(manifests)));
  if (failures.length) {
    console.error(`Strict conformance failed (${failures.length} findings):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Strict conformance evidence passed for ${manifests.length} manifests across ${frameworkIds.length} frameworks.`,
  );
};

await main();
