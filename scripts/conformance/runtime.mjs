import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { chromium } from 'playwright';
import { parse as parseYaml } from 'yaml';
import { captureDom, compareDom, inspectSemantics } from './dom.mjs';
import { createConformanceServer } from './server.mjs';
import { comparePixels } from './visual.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const frameworkIds = ['react', 'vue', 'svelte', 'solid', 'angular', 'astro'];
const arguments_ = process.argv.slice(2);
const option = (name) => {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
};
const fixtureFilter = option('--fixture');
const frameworkFilter = option('--framework');
const outputPath = resolve(
  repositoryRoot,
  option('--output') ?? 'reports/conformance-runtime.json',
);
const diffDirectory = resolve(
  option('--diff-directory') ?? resolve(dirname(outputPath), 'conformance-diffs'),
);
const visualEnabled = !arguments_.includes('--no-visual');
const selectedFrameworks = frameworkFilter ? [frameworkFilter] : frameworkIds;
if (selectedFrameworks.some((framework) => !frameworkIds.includes(framework))) {
  throw new Error(`Unknown framework: ${frameworkFilter}`);
}

const catalog = JSON.parse(
  await readFile(resolve(repositoryRoot, 'apps/conformance-host/dist/fixtures.json'), 'utf8'),
);
const fixtures = fixtureFilter
  ? catalog.fixtures.filter((fixture) => fixture.id === fixtureFilter)
  : catalog.fixtures;
if (!fixtures.length) throw new Error(`No fixtures matched ${fixtureFilter ?? 'catalog'}`);
const errataDirectory = resolve(repositoryRoot, 'conformance/errata');
const errataEntries = new Map(
  await Promise.all(
    (await readdir(errataDirectory))
      .filter((name) => name.endsWith('.yaml'))
      .map(async (name) => {
        const erratum = parseYaml(await readFile(resolve(errataDirectory, name), 'utf8'));
        return [erratum.id, erratum];
      }),
  ),
);
const fixtureNormalization = (fixture) =>
  fixture.errata.flatMap(
    (id) => errataEntries.get(id)?.normalization?.whitelist ?? [],
  );


const upstreamLocator = async (page, fixture) => {
  const source = page.locator(fixture.sourceSelector).nth(fixture.sourceIndex ?? 0);
  if (!fixture.sourceAncestorSelector) return source;
  const found = await source.evaluate((element, selector) => {
    const ancestor = element.closest(selector);
    if (!ancestor) return false;
    ancestor.setAttribute('data-conformance-source-root', '');
    return true;
  }, fixture.sourceAncestorSelector);
  if (!found) {
    throw new Error(
      `${fixture.id}: ${fixture.sourceSelector} has no ${fixture.sourceAncestorSelector} ancestor`,
    );
  }
  return page.locator('[data-conformance-source-root]');
};

const interactiveSelector =
  'button, input, select, textarea, a[href], summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
const resolveTarget = async (root, target, action) => {
  if (target && target !== 'fixture') return root.locator(target).first();
  if (['keyboard-focus', 'press', 'fill', 'select-option', 'check', 'uncheck'].includes(action)) {
    const rootIsInteractive = await root.evaluate(
      (element, selector) => element.matches(selector),
      interactiveSelector,
    );
    return rootIsInteractive ? root : root.locator(interactiveSelector).first();
  }
  return root;
};
let visualMarkerSequence = 0;
const resolveVisualRoot = async (page, root, visualSelector, visualAncestorSelector) => {
  const selected = visualSelector ? root.locator(visualSelector).first() : root;
  if (visualSelector && (await selected.count()) !== 1) {
    throw new Error(`Visual selector did not resolve exactly one element: ${visualSelector}`);
  }
  if (!visualAncestorSelector) return { locator: selected };
  const marker = `visual-${++visualMarkerSequence}`;
  const found = await selected.evaluate(
    (element, data) => {
      const ancestor = element.closest(data.selector);
      if (!ancestor) return false;
      ancestor.setAttribute('data-conformance-visual-root', data.marker);
      return true;
    },
    { selector: visualAncestorSelector, marker },
  );
  if (!found) {
    throw new Error(
      `Visual ancestor selector did not resolve an ancestor: ${visualAncestorSelector}`,
    );
  }
  return {
    locator: page.locator(`[data-conformance-visual-root="${marker}"]`).first(),
    marker,
  };
};

const applyActions = async (page, root, actions) => {
  let pointerDown = false;
  for (const step of actions) {
    const target = await resolveTarget(root, step.target, step.action);
    if (step.action === 'hover') await target.hover();
    else if (step.action === 'keyboard-focus') {
      // Some upstream visual fixtures declare a focus state despite having no
      // focusable descendant. Preserve that literal state without timing out.
      if ((await target.count()) > 0) await target.focus();
    }
    else if (step.action === 'click') await target.click();
    else if (step.action === 'press') await target.press(String(step.key ?? 'Enter'));
    else if (step.action === 'fill') await target.fill(String(step.value ?? ''));
    else if (step.action === 'select-option') await target.selectOption(String(step.value ?? ''));
    else if (step.action === 'check') await target.check();
    else if (step.action === 'uncheck') await target.uncheck();
    else if (step.action === 'submit') {
      await target.evaluate((element) => {
        const form = element instanceof HTMLFormElement ? element : element.closest('form');
        form?.requestSubmit();
      });
    } else if (step.action === 'open') {
      await target.evaluate((element) => {
        if (element instanceof HTMLDetailsElement) element.open = true;
        else element.setAttribute('open', '');
      });
    } else if (step.action === 'close') {
      await target.evaluate((element) => {
        if (element instanceof HTMLDetailsElement) element.open = false;
        else element.removeAttribute('open');
      });
    } else if (step.action === 'pointer-down') {
      await target.hover();
      await page.mouse.down();
      pointerDown = true;
    } else if (step.action === 'pointer-up') {
      await page.mouse.up();
      pointerDown = false;
    } else if (step.action === 'add-class') {
      await target.evaluate((element, value) => element.classList.add(String(value)), step.value);
    } else if (step.action === 'remove-class') {
      await target.evaluate((element, value) => element.classList.remove(String(value)), step.value);
    } else if (step.action === 'set-attribute') {
      await target.evaluate(
        (element, pair) => element.setAttribute(String(pair.key), String(pair.value)),
        { key: step.key, value: step.value },
      );
    } else if (step.action === 'remove-attribute') {
      await target.evaluate((element, value) => element.removeAttribute(String(value)), step.value);
    } else {
      throw new Error(`Unsupported fixture action: ${step.action}`);
    }
  }
  return async () => {
    if (pointerDown) await page.mouse.up();
  };
};

const stateActions = (state) => {
  const actions = [...(state.setup ?? [])];
  if (state.id === 'hover' && !actions.some((step) => step.action === 'hover')) {
    actions.push({ action: 'hover', target: 'fixture' });
  }
  if (state.id === 'focus-visible' && !actions.some((step) => step.action === 'keyboard-focus')) {
    actions.push({ action: 'keyboard-focus', target: 'fixture' });
  }
  if (state.id === 'active' && !actions.some((step) => step.action === 'pointer-down')) {
    actions.push({ action: 'pointer-down', target: 'fixture' });
  }
  return actions;
};

const applyStateProps = async (root, props = {}) => {
  const rootIsInteractive = await root.evaluate(
    (element, selector) => element.matches(selector),
    interactiveSelector,
  );
  const control = rootIsInteractive ? root : root.locator(interactiveSelector).first();
  if ((await control.count()) === 0) return;
  await control.evaluate((element, state) => {
    if ('disabled' in state && 'disabled' in element) {
      element.disabled = Boolean(state.disabled);
      element.toggleAttribute('disabled', Boolean(state.disabled));
    }
    const readOnly = state.readOnly ?? state.readonly;
    if (readOnly !== undefined && 'readOnly' in element) {
      element.readOnly = Boolean(readOnly);
      element.toggleAttribute('readonly', Boolean(readOnly));
    }
    if ('checked' in state && 'checked' in element) {
      element.checked = Boolean(state.checked);
      element.toggleAttribute('checked', Boolean(state.checked));
    }
    if (state.value !== undefined && 'value' in element) {
      element.value = String(state.value);
      element.setAttribute('value', String(state.value));
    }
  }, props);
};


const capture = async (
  page,
  root,
  state,
  actions,
  framework,
  ignoredAttributes,
  contractSemanticElement,
  visualSelector,
  visualAncestorSelector,
) => {
  const viewport = page.viewportSize();
  if (viewport) await page.mouse.move(viewport.width - 1, viewport.height - 1);
  await applyStateProps(root, state.props);
  const cleanup = await applyActions(page, root, actions);
  let visualMarker;
  try {
    await page.evaluate(() => document.fonts.ready);
    for (const step of actions.filter((candidate) => candidate.action === 'add-class')) {
      const target = await resolveTarget(root, step.target, step.action);
      await target.evaluate((element, value) => element.classList.add(String(value)), step.value);
    }
    const rootIsInteractive = await root.evaluate(
      (element, selector) => element.matches(selector),
      interactiveSelector,
    );
    const interactiveDescendant = root.locator(interactiveSelector).first();
    const semanticRoot =
      rootIsInteractive || (await interactiveDescendant.count()) === 0
        ? root
        : interactiveDescendant;
    const contractSelector =
      {
        alert: '[role="alert"]',
        button: 'button, [role="button"]',
        contentinfo: 'footer, [role="contentinfo"]',
        dialog: 'dialog, [role="dialog"]',
        'details-summary': 'details',
        link: 'a[href], [role="link"]',
        list: 'ul, ol, [role="list"]',
        navigation: 'nav, [role="navigation"]',
        table: 'table, [role="table"]',
      }[contractSemanticElement] ??
      (contractSemanticElement.includes('-and-') ||
      contractSemanticElement.startsWith('input[')
        ? interactiveSelector
        : undefined);
    const contractDescendant = contractSelector
      ? root.locator(contractSelector).first()
      : root;
    const rootMatchesContract = contractSelector
      ? await root.evaluate((element, selector) => element.matches(selector), contractSelector)
      : true;
    const contractRoot =
      rootMatchesContract || (await contractDescendant.count()) === 0
        ? root
        : contractDescendant;
    const visualState = await resolveVisualRoot(
      page,
      root,
      visualSelector,
      visualAncestorSelector,
    );
    visualMarker = visualState.marker;
    const visualRoot = visualState.locator;
    const [dom, semantics, contractSemantics, accessibility, visualSemantics, screenshot] =
      await Promise.all([
        captureDom(root, ignoredAttributes),
        inspectSemantics(semanticRoot),
        inspectSemantics(contractRoot),
        root.ariaSnapshot(),
        inspectSemantics(visualRoot),
        visualEnabled ? visualRoot.screenshot({ animations: 'disabled', caret: 'hide' }) : null,
      ]);
    const events = framework
      ? await page.evaluate(() => window.__KRDS_CONFORMANCE__?.getEvents() ?? [])
      : [];
    return { dom, semantics, contractSemantics, visualSemantics, accessibility, screenshot, events };
  } finally {
    if (visualMarker) {
      const markerRoot = page.locator(`[data-conformance-visual-root="${visualMarker}"]`).first();
      if ((await markerRoot.count()) > 0) {
        await markerRoot.evaluate((element) =>
          element.removeAttribute('data-conformance-visual-root'),
        );
      }
    }
    await cleanup();
  }
};

const contractChecks = (fixture, semantics) => {
  const errors = [];
  const semanticTags = {
    'label-and-input': ['input'],
    'label-and-checkbox': ['input'],
    'label-and-radio': ['input'],
    'label-and-select': ['select'],
    'label-and-textarea': ['textarea'],
    'details-summary': ['details'],
  };
  const expectedRoles = {
    alert: 'alert',
    button: 'button',
    contentinfo: 'contentinfo',
    dialog: 'dialog',
    link: 'link',
    list: 'list',
    navigation: 'navigation',
    table: 'table',
  };
  const nativeRole = (() => {
    if (semantics.tag === 'button') return 'button';
    if (semantics.tag === 'a' && semantics.attributes.href) return 'link';
    if (semantics.tag === 'nav') return 'navigation';
    if (semantics.tag === 'footer') return 'contentinfo';
    if (semantics.tag === 'ul' || semantics.tag === 'ol') return 'list';
    if (semantics.tag === 'table') return 'table';
    if (semantics.tag === 'select') return 'combobox';
    if (semantics.tag === 'textarea') return 'textbox';
    if (semantics.tag === 'input') {
      const type = semantics.attributes.type ?? 'text';
      if (type === 'checkbox' || type === 'radio') return type;
      if (!['button', 'submit', 'reset', 'hidden'].includes(type)) return 'textbox';
    }
    return undefined;
  })();
  const actualRole = semantics.role ?? nativeRole;
  const expectedRole = expectedRoles[fixture.contract.semanticElement];
  const expectedTags = semanticTags[fixture.contract.semanticElement];
  if (expectedRole && actualRole !== expectedRole) {
    errors.push(
      `semantic element: expected ${fixture.contract.semanticElement}, received ${actualRole ?? semantics.tag}`,
    );
  } else if (expectedTags && !expectedTags.includes(semantics.tag)) {
    errors.push(
      `semantic element: expected ${fixture.contract.semanticElement}, received ${semantics.tag}`,
    );
  }
  if (
    fixture.contract.semanticElement === 'input[type=checkbox]' &&
    (semantics.tag !== 'input' || semantics.attributes.type !== 'checkbox')
  ) {
    errors.push('semantic element: expected input[type=checkbox]');
  }
  if (fixture.contract.accessibleRole && actualRole !== fixture.contract.accessibleRole) {
    errors.push(`accessible role: expected ${fixture.contract.accessibleRole}`);
  }
  for (const [rawName, expected] of Object.entries(fixture.contract.requiredAttributes ?? {})) {
    if (typeof expected === 'object') continue;
    const [name, inlineExpected] = rawName.split('=', 2);
    const actual = semantics.attributes[name];
    if (expected === true) {
      if (actual === undefined || actual === '') {
        errors.push(`required attribute ${name} is missing`);
      }
      continue;
    }
    const expectedValue = String(inlineExpected ?? expected);
    if (actual !== expectedValue) {
      errors.push(
        `required attribute ${name}: expected ${expectedValue}, received ${actual ?? '<missing>'}`,
      );
    }
  }
  for (const requirement of fixture.contract.forbiddenAttributes ?? []) {
    const [name, forbiddenValue] = requirement.split('=', 2);
    const actual = semantics.attributes[name];
    if (actual !== undefined && (forbiddenValue === undefined || actual === forbiddenValue)) {
      errors.push(`forbidden attribute present: ${requirement}`);
    }
  }
  return errors;
};

const server = await createConformanceServer(repositoryRoot);
const frameworkHostUrl = (framework, fixtureId, stateId) =>
  framework === 'astro'
    ? `${server.baseUrl}/apps/conformance-host-astro/dist/${encodeURIComponent(fixtureId)}/${encodeURIComponent(stateId)}/`
    : `${server.baseUrl}/host/${framework}.html?fixture=${encodeURIComponent(fixtureId)}`;
const waitForFrameworkReady = (page, framework, fixtureId, stateId) =>
  page.waitForFunction(
    (expected) => {
      const runtime = window.__KRDS_CONFORMANCE__;
      return (
        runtime?.ready === true &&
        runtime.framework === expected.framework &&
        runtime.fixture.id === expected.fixtureId &&
        (expected.framework !== 'astro' || runtime.stateId === expected.stateId)
      );
    },
    { framework, fixtureId, stateId },
    { timeout: 10_000 },
  );
const openFrameworkState = async (page, framework, fixtureId, stateId) => {
  const url = frameworkHostUrl(framework, fixtureId, stateId);
  const response = await page.goto(url, { waitUntil: 'load' });
  if (!response?.ok()) {
    throw new Error(
      `${framework}/${fixtureId}/${stateId}: host request failed (${response?.status() ?? 'no response'})`,
    );
  }
  await waitForFrameworkReady(page, framework, fixtureId, stateId);
};
const prepareUpstreamPage = async (page, sourceHtml) => {
  await page.setContent(
    `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${server.baseUrl}/packages/styles/dist/index.css"><style>*,*::before,*::after{animation:none!important;transition:none!important}</style></head><body>${sourceHtml}<script src="${server.baseUrl}/upstream/krds-html/resources/cdn/krds.min.js"></script></body></html>`,
    { waitUntil: 'load' },
  );
  await page.evaluate(() => document.fonts.ready);
};
const browser = await chromium.launch({ headless: true });
const results = [];
const browserVersion = browser.version();
try {
  for (const fixture of fixtures) {
    const upstreamHtml = await readFile(resolve(repositoryRoot, fixture.sourcePath), 'utf8');
    const upstreamPage = await browser.newPage({
      viewport: { width: fixture.viewport.width, height: fixture.viewport.height },
      reducedMotion: 'reduce',
    });
    upstreamPage.setDefaultTimeout(3_000);
    await prepareUpstreamPage(upstreamPage, upstreamHtml);
    const upstreamRoot = await upstreamLocator(upstreamPage, fixture);
    if ((await upstreamRoot.count()) !== 1) {
      throw new Error(`${fixture.id}: upstream selector resolved ${(await upstreamRoot.count())} roots`);
    }
    frameworkLoop: for (const framework of selectedFrameworks) {
      const frameworkPage = await browser.newPage({
        viewport: { width: fixture.viewport.width, height: fixture.viewport.height },
        reducedMotion: 'reduce',
      });
      frameworkPage.setDefaultTimeout(3_000);
      const runtimeErrors = [];
      frameworkPage.on('pageerror', (error) => runtimeErrors.push(error.message));
      frameworkPage.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });
      try {
        await openFrameworkState(
          frameworkPage,
          framework,
          fixture.id,
          fixture.states[0].id,
        );
      } catch (error) {
        const cause = error instanceof Error ? error.message : String(error);
        const details = [cause, ...runtimeErrors].filter(Boolean).join(' | ');
        const message = `${framework}/${fixture.id}: fixture host failed to become ready: ${details}`;
        for (const state of fixture.states) {
          results.push({
            fixtureId: fixture.id,
            componentId: fixture.componentId,
            framework,
            state: state.id,
            status: 'failing',
            checks: {
              render: { passed: false, errors: [message] },
              dom: { passed: false, errors: [message] },
              accessibility: { passed: false, errors: [message] },
              behavior: { passed: false, errors: [message], events: [] },
              form: { passed: false, errors: [message] },
              visual: { passed: false, errors: [message] },
              contract: { passed: false, errors: [message] },
            },
          });
        }
        await frameworkPage.close();
        continue frameworkLoop;
      }
      const frameworkRoot = frameworkPage.locator('#fixture-root > *').first();
      for (const [stateIndex, state] of fixture.states.entries()) {
        const runtimeErrorStart = stateIndex === 0 ? 0 : runtimeErrors.length;
        try {
          if (stateIndex > 0) {
            const resetFramework =
              framework === 'astro'
                ? openFrameworkState(frameworkPage, framework, fixture.id, state.id)
                : framework === 'angular'
                  ? frameworkPage
                      .reload({ waitUntil: 'load' })
                      .then(() =>
                        frameworkPage.waitForFunction(
                          () => window.__KRDS_CONFORMANCE__?.ready === true,
                          undefined,
                          { timeout: 10_000 },
                        ),
                      )
                  : frameworkPage.evaluate(async () => {
                      await window.__KRDS_CONFORMANCE__?.reset();
                    });
            await Promise.all([
              prepareUpstreamPage(upstreamPage, upstreamHtml),
              resetFramework,
            ]);
          }
          if (framework !== 'astro') {
            await frameworkPage.evaluate(async (stateId) => {
              await window.__KRDS_CONFORMANCE__?.setState(stateId);
            }, state.id);
          }
        const actions = stateActions(state);
        const currentUpstreamRoot = await upstreamLocator(upstreamPage, fixture);
        const ignoredAttributes = fixtureNormalization(fixture);
        const upstream = await capture(
          upstreamPage,
          currentUpstreamRoot,
          state,
          actions,
          false,
          ignoredAttributes,
          fixture.contract.semanticElement,
          fixture.visualSelector,
          fixture.visualAncestorSelector,
        );
        const frameworkSnapshot = await capture(
          frameworkPage,
          frameworkRoot,
          state,
          actions,
          true,
          ignoredAttributes,
          fixture.contract.semanticElement,
          fixture.visualSelector,
          fixture.visualAncestorSelector,
        );
        if (framework === 'astro') {
          const stateRuntimeErrors = runtimeErrors.slice(runtimeErrorStart);
          if (stateRuntimeErrors.length) {
            throw new Error(
              `${framework}/${fixture.id}/${state.id}: ${stateRuntimeErrors.join(' | ')}`,
            );
          }
        }
        const dom = compareDom(upstream.dom, frameworkSnapshot.dom);
        const literalAccessibilityMatch =
          upstream.accessibility === frameworkSnapshot.accessibility;
        const accessibility = {
          passed:
            literalAccessibilityMatch ||
            (fixture.errata.length > 0 && dom.passed),
          expected: upstream.accessibility,
          actual: frameworkSnapshot.accessibility,
          ...(literalAccessibilityMatch || fixture.errata.length === 0
            ? {}
            : { correctedByErrata: fixture.errata }),
        };
        const behavior = {
          passed: actions.length === 0 || dom.passed,
          actions,
          events: frameworkSnapshot.events,
        };
        const form = {
          passed: isDeepStrictEqual(
            upstream.semantics.form,
            frameworkSnapshot.semantics.form,
          ),
          expected: upstream.semantics.form,
          actual: frameworkSnapshot.semantics.form,
        };
        const pixelResult = visualEnabled
          ? comparePixels(upstream.screenshot, frameworkSnapshot.screenshot)
          : { passed: true, differingPixels: 0, skipped: true };
        const visual = {
          ...pixelResult,
          expectedStyle: upstream.visualSemantics.computedStyle,
          actualStyle: frameworkSnapshot.visualSemantics.computedStyle,
        };
        if (visualEnabled && !pixelResult.passed && arguments_.includes('--save-diffs')) {
          const basename = `${fixture.id}-${framework}-${state.id}`.replace(/[^a-z0-9.-]+/gi, '-');
          await mkdir(diffDirectory, { recursive: true });
          await Promise.all([
            writeFile(resolve(diffDirectory, `${basename}-expected.png`), upstream.screenshot),
            writeFile(resolve(diffDirectory, `${basename}-actual.png`), frameworkSnapshot.screenshot),
          ]);
        }
        const literalUpstreamContractErrors = contractChecks(
          fixture,
          upstream.contractSemantics,
        );
        const frameworkContractErrors = contractChecks(
          fixture,
          frameworkSnapshot.contractSemantics,
        );
        const contractErrors = [
          ...frameworkContractErrors.map((error) => `framework: ${error}`),
          ...(fixture.errata.length === 0
            ? literalUpstreamContractErrors.map((error) => `upstream: ${error}`)
            : []),
        ];
        const passed =
          dom.passed &&
          accessibility.passed &&
          behavior.passed &&
          form.passed &&
          visual.passed &&
          !contractErrors.length;
        results.push({
          fixtureId: fixture.id,
          componentId: fixture.componentId,
          framework,
          state: state.id,
          status: passed ? 'passing' : 'failing',
          checks: {
            render: { passed: true },
            dom,
            accessibility,
            behavior,
            form,
            visual,
            contract: {
              passed: contractErrors.length === 0,
              errors: contractErrors,
              literalUpstreamErrors: literalUpstreamContractErrors,
              ...(literalUpstreamContractErrors.length > 0 && fixture.errata.length > 0
                ? { correctedByErrata: fixture.errata }
                : {}),
            },
          },
        });
        } catch (error) {
          const cause = error instanceof Error ? error.message : String(error);
          const browserErrors =
            framework === 'astro'
              ? runtimeErrors
                  .slice(runtimeErrorStart)
                  .filter((runtimeError) => !cause.includes(runtimeError))
              : [];
          const message = [cause, ...browserErrors].join(' | ');
          results.push({
            fixtureId: fixture.id,
            componentId: fixture.componentId,
            framework,
            state: state.id,
            status: 'failing',
            checks: {
              render: { passed: false, errors: [message] },
              dom: { passed: false, errors: [message] },
              accessibility: { passed: false, errors: [message] },
              behavior: { passed: false, errors: [message], events: [] },
              form: { passed: false, errors: [message] },
              visual: { passed: false, errors: [message] },
              contract: { passed: false, errors: [message] },
            },
          });
        }
      }
      await frameworkPage.close();
    }
    await upstreamPage.close();
    console.log(`Checked ${fixture.id} across ${selectedFrameworks.length} framework(s).`);
  }
} finally {
  await browser.close();
  await server.close();
}

const frameworkEvidence = selectedFrameworks.map((framework) => {
  const frameworkResults = results.filter((result) => result.framework === framework);
  const fixtureResults = fixtures.map((fixture) => {
    const states = frameworkResults.filter((result) => result.fixtureId === fixture.id);
    const errors = states
      .filter((state) => state.status !== 'passing')
      .map((state) =>
        `${state.state}: ${Object.entries(state.checks)
          .filter(([, check]) => check.passed === false)
          .map(([name]) => name)
          .join(', ')}`,
      );
    return {
      fixtureId: fixture.id,
      status: errors.length ? 'failing' : 'passing',
      ...(errors.length ? { errors } : {}),
    };
  });
  const errors = fixtureResults.flatMap((result) => result.errors ?? []);
  return {
    framework,
    status: errors.length ? 'failing' : 'passing',
    fixtureResults,
    unresolvedSelectors: [],
    errata: [],
    errors,
    source: 'scripts/conformance/runtime.mjs',
  };
});
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  upstream: catalog.upstream,
  browser: { name: 'chromium', version: browserVersion },
  fixtureCount: fixtures.length,
  stateCount: results.length,
  frameworks: selectedFrameworks,
  results,
  evidence: frameworkEvidence,
  strictConformance: frameworkEvidence.every((evidence) => evidence.status === 'passing'),
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `Runtime conformance ${report.strictConformance ? 'passed' : 'failed'}: ${results.filter((result) => result.status === 'passing').length}/${results.length} states.`,
);
if (!report.strictConformance && !process.argv.includes('--no-exit-code')) process.exitCode = 1;
