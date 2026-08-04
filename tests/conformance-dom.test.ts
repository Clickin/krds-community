import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import {
  SelectorResolutionError,
  captureDom,
  compareDom,
  inspectSemantics,
  resolveContractRoot,
  withCorrectedAttributes,
} from "../scripts/conformance/dom.mjs";

type EvaluateLocator = {
  evaluate: (
    callback: (root: Element, argument: unknown) => unknown,
    argument: unknown,
  ) => Promise<unknown>;
};

const locatorFor = (element: Element): EvaluateLocator => ({
  evaluate: async (callback, argument) => callback(element, argument),
});

type RuntimeLocator = EvaluateLocator & {
  count: () => Promise<number>;
  first: () => RuntimeLocator;
  nth: (index: number) => RuntimeLocator;
};

const runtimeLocatorFor = (element: Element | null): RuntimeLocator => {
  const locator: RuntimeLocator = {
    evaluate: async (callback, argument) => {
      if (!element) throw new Error("Cannot evaluate a missing element");
      return callback(element, argument);
    },
    count: async () => (element ? 1 : 0),
    first: () => locator,
    nth: () => locator,
  };
  return locator;
};

describe("conformance DOM capture normalization", () => {
  it("rewrites corrected values only in the upstream snapshot", async () => {
    document.body.innerHTML =
      '<button class="active" role="tab" aria-selected="false" data-listener-attached="">탭</button>';
    const locator = locatorFor(document.querySelector("button")!);
    const rules = [
      {
        selector: '[role="tab"].active',
        attribute: "aria-selected",
        operation: "rewrite",
        rewriteValue: "true",
      },
      {
        selector: '[role="tab"]',
        attribute: "data-listener-attached",
        rule: "non-semantic-runtime-bookkeeping",
      },
    ];

    const upstream = await captureDom(locator, rules, "upstream");
    const framework = await captureDom(locator, rules, "framework");

    expect(upstream.attributes).toContainEqual(["aria-selected", "true"]);
    expect(framework.attributes).toContainEqual(["aria-selected", "false"]);
    expect(upstream.attributes).not.toContainEqual(["data-listener-attached", ""]);
    expect(framework.attributes).not.toContainEqual(["data-listener-attached", ""]);
    expect(compareDom(upstream, framework).passed).toBe(false);
  });

  it("canonicalizes boolean attributes by presence without equating absence", async () => {
    document.body.innerHTML = `
      <button id="literal" disabled="true">저장</button>
      <button id="empty" disabled="">저장</button>
      <button id="absent">저장</button>
    `;
    const literal = await captureDom(locatorFor(document.querySelector("#literal")!));
    const empty = await captureDom(locatorFor(document.querySelector("#empty")!));
    const absent = await captureDom(locatorFor(document.querySelector("#absent")!));

    expect(literal.attributes).toContainEqual(["disabled", ""]);
    expect(compareDom(literal, empty).passed).toBe(true);
    expect(compareDom(literal, absent).passed).toBe(false);
  });

  it("splices ignored elements and drops ignored subtrees deterministically", async () => {
    document.body.innerHTML =
      '<div class="root"><span class="wrapper"><b>first</b><i>second</i></span><span class="drop"><em>hidden</em></span><strong>last</strong></div>';
    const root = document.querySelector(".root")!;
    const snapshot = await captureDom(locatorFor(root), [
      { selector: ".wrapper", ignoreElement: true },
      { selector: ".drop", ignoreSubtree: true },
    ]);

    expect(snapshot.children).toEqual([
      { tag: "b", attributes: [], children: [{ text: "first" }] },
      { tag: "i", attributes: [], children: [{ text: "second" }] },
      { tag: "strong", attributes: [], children: [{ text: "last" }] },
    ]);
  });

  it("keeps accessibility comparison independent from DOM normalization", async () => {
    document.body.innerHTML = '<button role="tab" aria-selected="false">탭</button>';
    const locator = locatorFor(document.querySelector("button")!);
    const normalized = await captureDom(
      locator,
      [
        {
          selector: '[role="tab"]',
          attribute: "aria-selected",
          operation: "rewrite",
          rewriteValue: "true",
        },
      ],
      "upstream",
    );
    const raw = await captureDom(locator, [], "framework");

    expect(normalized.attributes).toContainEqual(["aria-selected", "true"]);
    expect(raw.attributes).toContainEqual(["aria-selected", "false"]);
  });

  it("normalizes literal tab role relocation while retaining raw ownership evidence", async () => {
    const erratum = parseYaml(
      await readFile("conformance/errata/errata.tab.runtime-state-semantics.yaml", "utf8"),
    ) as { normalization: { whitelist: Array<Record<string, unknown>> } };
    document.body.innerHTML =
      '<div class="krds-tab-area layer"><div class="tab line"><ul role="tablist"><li id="tab-one" role="tab" aria-selected="true" aria-controls="panel-one" class="active"><button type="button" class="btn-tab">One</button></li><li id="tab-two" role="tab" aria-selected="false" aria-controls="panel-two"><button type="button" class="btn-tab">Two</button></li></ul></div><div class="tab-conts-wrap"><section id="panel-one" aria-labelledby="tab-one" role="tabpanel" class="tab-conts active">One panel</section><section id="panel-two" aria-labelledby="tab-two" role="tabpanel" class="tab-conts">Two panel</section></div></div>';
    const literal = document.querySelector(".krds-tab-area")!;
    const normalizedLiteral = await captureDom(
      locatorFor(literal),
      erratum.normalization.whitelist,
      "upstream",
    );
    const rawLiteral = await captureDom(locatorFor(literal));

    document.body.innerHTML =
      '<div class="krds-tab-area layer"><div class="tab line"><ul role="tablist"><li role="presentation" class="active"><button id="tab-one" type="button" role="tab" aria-selected="true" aria-controls="panel-one" tabindex="0" class="btn-tab">One</button></li><li role="presentation"><button id="tab-two" type="button" role="tab" aria-selected="false" aria-controls="panel-two" tabindex="-1" class="btn-tab">Two</button></li></ul></div><div class="tab-conts-wrap"><section id="panel-one" aria-labelledby="tab-one" role="tabpanel" class="tab-conts active">One panel</section><section id="panel-two" aria-labelledby="tab-two" role="tabpanel" class="tab-conts" hidden>Two panel</section></div></div>';
    const corrected = document.querySelector(".krds-tab-area")!;
    const normalizedCorrected = await captureDom(
      locatorFor(corrected),
      erratum.normalization.whitelist,
      "framework",
    );
    const rawCorrected = await captureDom(locatorFor(corrected));

    expect(compareDom(normalizedLiteral, normalizedCorrected).passed).toBe(true);
    expect(compareDom(rawLiteral, rawCorrected).passed).toBe(false);
  });

  it("normalizes only the generated contextual-help control reference", async () => {
    const erratum = parseYaml(
      await readFile("conformance/errata/errata.contextual-help.control-relationship.yaml", "utf8"),
    ) as { normalization: { whitelist: Array<Record<string, unknown>> } };
    document.body.innerHTML =
      '<div class="krds-contextual-help"><div class="tooltip-action"><button type="button" class="tooltip-btn" aria-expanded="false">Help</button><div class="tooltip-popover" role="tooltip">Details</div></div></div>';
    const literal = document.querySelector(".krds-contextual-help")!;
    const normalizedLiteral = await captureDom(
      locatorFor(literal),
      erratum.normalization.whitelist,
      "upstream",
    );
    const rawLiteral = await captureDom(locatorFor(literal));

    document.body.innerHTML =
      '<div class="krds-contextual-help"><div class="tooltip-action"><button type="button" class="tooltip-btn" aria-expanded="false" aria-controls="help-popover">Help</button><div id="help-popover" class="tooltip-popover" role="tooltip">Details</div></div></div>';
    const corrected = document.querySelector(".krds-contextual-help")!;
    const trigger = corrected.querySelector<HTMLButtonElement>(".tooltip-btn")!;
    const popover = corrected.querySelector<HTMLElement>(".tooltip-popover")!;
    const normalizedCorrected = await captureDom(
      locatorFor(corrected),
      erratum.normalization.whitelist,
      "framework",
    );
    const rawCorrected = await captureDom(locatorFor(corrected));

    expect(document.getElementById(trigger.getAttribute("aria-controls")!)).toBe(popover);
    expect(compareDom(normalizedLiteral, normalizedCorrected).passed).toBe(true);
    expect(compareDom(rawLiteral, rawCorrected).passed).toBe(false);
  });
});

describe("accessibility correction transactions", () => {
  it("skips absent alternatives and rewrites every matching element transactionally", async () => {
    document.body.innerHTML =
      '<div class="root"><button class="duplicate">One</button><button class="duplicate">Two</button></div>';
    const root = runtimeLocatorFor(document.querySelector(".root"));
    const duplicates = Array.from(document.querySelectorAll(".duplicate"));
    let capturedValues: Array<string | null> = [];

    await withCorrectedAttributes(
      root,
      {
        accessibilityRules: [
          {
            selector: ".missing",
            attribute: "aria-expanded",
            operation: "rewrite",
            rewriteValue: "false",
          },
          {
            selector: ".duplicate",
            attribute: "aria-expanded",
            operation: "rewrite",
            rewriteValue: "true",
          },
        ],
      },
      async () => {
        capturedValues = duplicates.map((element) => element.getAttribute("aria-expanded"));
      },
    );

    expect(capturedValues).toEqual(["true", "true"]);
    expect(duplicates.map((element) => element.getAttribute("aria-expanded"))).toEqual([
      null,
      null,
    ]);
  });

  it("validates rewritten, removed, and referenced attributes before capturing evidence", async () => {
    document.body.innerHTML =
      '<div class="root"><button class="trigger" aria-describedby="panel-old">Open</button><section class="panel" id="panel-old">Panel</section></div>';
    const root = runtimeLocatorFor(document.querySelector(".root"));
    const trigger = document.querySelector(".trigger")!;
    const panel = document.querySelector(".panel")!;

    const result = await withCorrectedAttributes(
      root,
      {
        accessibilityRules: [
          {
            selector: ".trigger",
            attribute: "aria-controls",
            operation: "rewrite",
            rewriteValue: "generated-1",
          },
          {
            selector: ".trigger",
            attribute: "aria-describedby",
            rule: "remove-invalid-reference",
          },
          {
            selector: ".panel",
            attribute: "id",
            operation: "rewrite",
            rewriteValue: "generated-1",
          },
        ],
      },
      async () => {
        expect(trigger.getAttribute("aria-controls")).toBe("generated-1");
        expect(trigger.hasAttribute("aria-describedby")).toBe(false);
        expect(document.getElementById(trigger.getAttribute("aria-controls")!)).toBe(panel);
        return "captured";
      },
    );

    expect(result).toBe("captured");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(trigger.getAttribute("aria-describedby")).toBe("panel-old");
    expect(panel.getAttribute("id")).toBe("panel-old");
  });

  it("rejects and restores an unresolved rewritten reference", async () => {
    document.body.innerHTML = '<div class="root"><button class="trigger">Open</button></div>';
    const root = runtimeLocatorFor(document.querySelector(".root"));
    const trigger = document.querySelector(".trigger")!;
    let captureCalled = false;

    await expect(
      withCorrectedAttributes(
        root,
        {
          accessibilityRules: [
            {
              selector: ".trigger",
              attribute: "aria-controls",
              operation: "rewrite",
              rewriteValue: "missing-panel",
            },
          ],
        },
        async () => {
          captureCalled = true;
        },
      ),
    ).rejects.toThrow(
      'Accessibility correction left unresolved aria-controls reference "missing-panel" (0)',
    );

    expect(captureCalled).toBe(false);
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
  });
  it("keeps unrelated ids and fragment references literal during correction", async () => {
    document.body.innerHTML =
      '<nav class="root" aria-labelledby="mGnb-anchor1"><a href="#mGnb-anchor1">Menu</a><span id="mGnb-anchor1">Main menu</span></nav>';
    const root = runtimeLocatorFor(document.querySelector(".root"));
    const navigation = document.querySelector(".root")!;
    const link = document.querySelector("a")!;
    const label = document.querySelector("span")!;

    await withCorrectedAttributes(
      root,
      {
        accessibilityRules: [
          {
            selector: ".root",
            attribute: "role",
            operation: "rewrite",
            rewriteValue: "navigation",
          },
        ],
      },
      async () => {
        expect(navigation.getAttribute("role")).toBe("navigation");
        expect(navigation.getAttribute("aria-labelledby")).toBe("mGnb-anchor1");
        expect(link.getAttribute("href")).toBe("#mGnb-anchor1");
        expect(label.getAttribute("id")).toBe("mGnb-anchor1");
      },
    );

    expect(navigation.hasAttribute("role")).toBe(false);
    expect(navigation.getAttribute("aria-labelledby")).toBe("mGnb-anchor1");
    expect(link.getAttribute("href")).toBe("#mGnb-anchor1");
    expect(label.getAttribute("id")).toBe("mGnb-anchor1");
  });
});

describe("semantic form-state capture", () => {
  it("ignores expando form fields on generic elements while retaining native control state", async () => {
    document.body.innerHTML =
      '<div class="calendar-wrap"></div><button type="button">날짜 선택</button>';
    const calendar = document.querySelector(".calendar-wrap") as HTMLDivElement & {
      disabled: boolean;
    };
    calendar.disabled = false;
    const [calendarSemantics, buttonSemantics] = await Promise.all([
      inspectSemantics(runtimeLocatorFor(calendar)),
      inspectSemantics(runtimeLocatorFor(document.querySelector("button"))),
    ]);

    expect(Object.hasOwn(calendarSemantics, "form")).toBe(true);
    expect(Object.keys(calendarSemantics.form)).toEqual([]);
    expect(calendarSemantics.form).toEqual({});
    expect(buttonSemantics.form.disabled).toBe(false);
  });
});

describe("side-aware contract root resolution", () => {
  it("selects the nearest semantic ancestor per capture side without changing the source root", async () => {
    const manifest = parseYaml(
      await readFile("conformance/manifests/critical-alerts.yaml", "utf8"),
    ) as {
      fixtures: Array<{
        contractAncestorSelector: { upstream: string; framework: string };
      }>;
    };
    const selectors = manifest.fixtures[0]!.contractAncestorSelector;
    document.body.innerHTML = `
      <div class="main-urgent-wrap"><ul id="upstream-list"></ul></div>
      <div role="alert"><ul id="framework-list"></ul></div>
    `;
    const page = {
      locator: (selector: string) => runtimeLocatorFor(document.querySelector(selector)),
    };
    const upstreamSource = runtimeLocatorFor(document.querySelector("#upstream-list"));
    const frameworkSource = runtimeLocatorFor(document.querySelector("#framework-list"));

    const upstream = await resolveContractRoot(page, upstreamSource, selectors, "upstream");
    const framework = await resolveContractRoot(page, frameworkSource, selectors, "framework");

    expect(
      await upstream.locator.evaluate((element: Element) => element.className, undefined),
    ).toBe("main-urgent-wrap");
    expect(
      await framework.locator.evaluate(
        (element: Element) => element.getAttribute("role"),
        undefined,
      ),
    ).toBe("alert");
    expect(document.querySelector("#framework-list")?.hasAttribute("role")).toBe(false);
  });

  it("exposes missing contract ancestors as actionable selector evidence", async () => {
    document.body.innerHTML = '<div class="source"></div>';
    const page = {
      locator: (selector: string) => runtimeLocatorFor(document.querySelector(selector)),
    };
    const source = runtimeLocatorFor(document.querySelector(".source"));
    const error = await resolveContractRoot(
      page,
      source,
      { upstream: ".upstream-contract", framework: ".framework-contract" },
      "framework",
    ).then(
      () => undefined,
      (reason) => reason,
    );

    expect(error).toBeInstanceOf(SelectorResolutionError);
    expect(error).toMatchObject({
      kind: "contract-ancestor",
      side: "framework",
      selector: ".framework-contract",
    });
    const evidence = error.toEvidence({
      fixtureId: "fixture.example",
      framework: "solid",
      stateId: "default",
    });
    expect(evidence).toContain('fixture="fixture.example"');
    expect(evidence).toContain('framework="solid"');
    expect(evidence).toContain('state="default"');
    expect(evidence).toContain('selector=".framework-contract"');
    expect(evidence).toContain('error="Contract ancestor selector did not resolve an ancestor"');
  });
});

describe("favicon conformance policy", () => {
  it("declares favicon as non-visual and uses the explicit metadata contract", async () => {
    const manifest = parseYaml(await readFile("conformance/manifests/favicon.yaml", "utf8")) as {
      fixtures: Array<{ comparisons?: { visual?: string } }>;
      contract: { semanticElement: string };
    };
    expect(manifest.fixtures[0]?.comparisons?.visual).toBe("none");
    expect(manifest.contract.semanticElement).toBe("link[rel=icon]");
  });
});
