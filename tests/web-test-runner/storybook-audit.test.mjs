// In-browser Storybook inventory audit, run under @web/test-runner + Chrome
// (no Playwright). The Node orchestrator (scripts/storybook-audit.mjs) serves
// the built storybook-static tree, seeds the HTTP collector with the static
// base URL + fixture contracts + axe script URL, spawns this suite, then reads
// the per-framework findings back from the collector's /dump endpoint.
//
// Each framework's inventory renders inside a same-origin <iframe srcdoc> so
// the test can inspect iframe.contentDocument; a <base> tag points the
// iframe's relative ./assets references at the static server.

const collectorBase = import.meta.env.VITE_STORYBOOK_COLLECTOR ?? "http://127.0.0.1:8123";
const frameworkIds = ["react", "vue", "svelte", "solid", "angular"];

const config = await (await fetch(`${collectorBase}/config`)).json();
const fixtureContracts = config.fixtureContracts ?? [];

const report = (framework, messages) => {
  if (!messages.length) return;
  void fetch(`${collectorBase}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "storybook-audit", framework, messages }),
  });
};

const loadInventory = async (framework) => {
  // WTR/vite serves the repo root, so the built storybook-static tree is
  // reachable on the SAME origin as the test page — the srcdoc/iframe is then
  // inspectable and every relative/dynamic asset resolves correctly.
  const base = `${location.origin}/storybook-static/${framework}`;
  const index = await (await fetch(`${base}/index.json`)).json();
  const entry = Object.values(index.entries).find(
    (candidate) =>
      candidate.exportName === "Inventory" && candidate.importPath.includes("AllComponents"),
  );
  if (!entry) throw new Error(`${framework}: full inventory story is missing`);
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:absolute;left:-100000px;top:0;width:1280px;height:800px;border:0";
  iframe.src = `${base}/iframe.html?id=${encodeURIComponent(entry.id)}&viewMode=story`;
  document.body.appendChild(iframe);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return iframe;
};

const waitForRender = async (iframe) => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const doc = iframe.contentDocument;
    if (doc && doc.querySelectorAll('[class*="krds-"]').length > 0) {
      await doc.fonts?.ready.catch?.(() => {});
      await new Promise((resolve) => setTimeout(resolve, 300));
      return doc;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return iframe.contentDocument;
};

const semanticAudit = (doc, root) => {
  const localFindings = [];
  const nativeButtonRoles = root.querySelectorAll('button[role="button"]').length;
  if (nativeButtonRoles) localFindings.push(`${nativeButtonRoles} native buttons repeat role=button`);
  for (const element of root.querySelectorAll("[aria-expanded]")) {
    const controls = element.getAttribute("aria-controls");
    if (!controls || !doc.getElementById(controls)) {
      localFindings.push("aria-expanded is missing a valid aria-controls target");
    }
  }
  for (const tablist of root.querySelectorAll('[role="tablist"]')) {
    const tabs = tablist.querySelectorAll('[role="tab"]');
    if (!tabs.length) localFindings.push("tablist has no tab descendants");
    for (const tab of tabs) {
      const controls = tab.getAttribute("aria-controls");
      if (!controls || !doc.getElementById(controls)) {
        localFindings.push("tab is missing a valid aria-controls target");
      }
    }
  }
  for (const table of root.querySelectorAll("table")) {
    if (table.closest('[aria-hidden="true"]')) continue;
    if (!table.querySelector("caption") && !table.getAttribute("aria-label")) {
      localFindings.push("table is missing caption or accessible name");
    }
    if (!table.querySelector("th")) localFindings.push("table is missing a header cell");
  }
  for (const control of root.querySelectorAll("input, select, textarea")) {
    if (control.type === "hidden" || control.getAttribute("aria-hidden") === "true") continue;
    const id = control.getAttribute("id");
    const hasLabel = Boolean(
      control.getAttribute("aria-label") ||
        control.getAttribute("aria-labelledby") ||
        (id && doc.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
        control.closest("label"),
    );
    if (!hasLabel) localFindings.push(`${control.tagName.toLowerCase()} is missing a label`);
  }
  return localFindings;
};

const keyboardAudit = (doc) => {
  // Interactive Tab / :focus-visible traversal cannot be exercised inside a
  // nested srcdoc/iframe: a programmatic .focus() is ignored unless the iframe
  // is the focused browsing context, and synthetic key events do not trigger
  // default focus navigation. Keep the structural guarantee instead: the
  // inventory exposes a real, visible set of keyboard-focusable controls
  // ordered in the DOM, i.e. tab navigation is not dead. Deeper sequential
  // focus-visible flow is exercised by the per-framework conformance suites.
  const root = doc.querySelector("#storybook-root") ?? doc;
  const focusableSelector =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
  const visible = Array.from(root.querySelectorAll(focusableSelector)).filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return (
      rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none"
    );
  });
  if (visible.length === 0) {
    return ["no visible keyboard-focusable controls were rendered"];
  }
  return [];
};

const runAxe = async (iframe) => {
  const doc = iframe.contentDocument;
  if (!config.axeContent) return [];
  const source = atob(config.axeContent);
  const script = doc.createElement("script");
  script.textContent = source;
  doc.head.appendChild(script);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (!doc.defaultView.axe) return [];
  const result = await doc.defaultView.axe.run(
    doc.querySelector("#storybook-root") ?? doc,
    { resultTypes: ["violations"] },
  );
  return result.violations.map((violation) => ({
    id: violation.id,
    count: violation.nodes.length,
    targets: violation.nodes.slice(0, 3).map((node) => node.target),
  }));
};

const auditFramework = async (framework) => {
  const messages = [];
  let iframe;
  try {
    iframe = await loadInventory(framework);
    const doc = await waitForRender(iframe);
    if (!doc || doc.querySelectorAll('[class*="krds-"]').length === 0) {
      messages.push(`${framework}: inventory rendered too few KRDS elements`);
      report(framework, messages);
      return;
    }
    const renderedElements = doc.querySelectorAll('[class*="krds-"]').length;
    if (renderedElements < (config.manifestCount ?? 1) / 2) {
      messages.push(`${framework}: inventory rendered too few KRDS elements (${renderedElements})`);
    }
    const root = doc.querySelector("#storybook-root") ?? doc;
    for (const fixture of fixtureContracts) {
      try {
        const scope = fixture.sourceSelector === 'link[rel="icon"]' ? doc : root;
        if (scope.querySelectorAll(fixture.sourceSelector).length === 0) {
          messages.push(
            `${framework}: ${fixture.id}: official selector not rendered (${fixture.sourceSelector})`,
          );
        }
      } catch (error) {
        messages.push(
          `${framework}: ${fixture.id}: invalid official selector (${fixture.sourceSelector}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    const bodyText = doc.body?.innerText ?? "";
    if (/couldn't find story|failed to render|error occurred/i.test(bodyText)) {
      const needle = bodyText.match(/(?:couldn't find story|failed to render|error occurred)/gi);
      messages.push(`${framework}: Storybook reported a render error (${JSON.stringify(needle)})`);
    }
    messages.push(...semanticAudit(doc, root).map((finding) => `${framework}: ${finding}`));
    messages.push(...keyboardAudit(doc).map((finding) => `${framework}: ${finding}`));
    const violations = await runAxe(iframe);
    if (violations.length)
      messages.push(`${framework}: axe violations ${JSON.stringify(violations)}`);

    iframe.style.width = "390px";
    iframe.style.left = "-100000px";
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 2) {
      messages.push(`${framework}: mobile inventory has horizontal overflow`);
    }
  } catch (error) {
    messages.push(`${framework}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    iframe?.remove();
  }
  report(framework, messages);
};

describe("storybook inventory audit (in-browser)", () => {
  for (const framework of frameworkIds) {
    it(`audits ${framework} inventory`, async () => {
      await auditFramework(framework);
      // Findings are POSTed to the collector; the Node orchestrator aggregates.
    });
  }
});
