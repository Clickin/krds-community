// @vitest-environment node

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { createAstroSsrServer, renderAstroComponentToString } from "./server-loader.ts";

describe("Astro server rendering", () => {
  it("renders recipe classes, native form semantics, and linked disclosures", async () => {
    const server = await createAstroSsrServer();
    let dom: JSDOM | undefined;

    try {
      const { default: Fixture } = await server.ssrLoadModule(
        "/tests/framework/ssr-hydration/fixtures/AstroSsrFixture.astro",
      );
      const html = await renderAstroComponentToString(Fixture);
      dom = new JSDOM(html);
      const { document, FormData, HTMLInputElement } = dom.window;

      const form = document.querySelector<HTMLFormElement>("form");
      expect(form).not.toBeNull();
      expect(form?.getAttribute("action")).toBe("/search");
      expect(form?.method).toBe("post");

      const query = form?.elements.namedItem("query");
      expect(query).toBeInstanceOf(HTMLInputElement);
      expect(query).toMatchObject({
        id: "astro-query",
        name: "query",
        required: true,
        type: "text",
        value: "server value",
      });
      expect(document.querySelector('label[for="astro-query"]')?.textContent?.trim()).toBe(
        "Search query",
      );

      const accepted = form?.elements.namedItem("accepted");
      expect(accepted).toBeInstanceOf(HTMLInputElement);
      expect(accepted).toMatchObject({
        checked: true,
        id: "astro-accepted",
        name: "accepted",
        type: "checkbox",
        value: "yes",
      });
      expect(document.querySelector('label[for="astro-accepted"]')?.textContent?.trim()).toBe(
        "Accept terms",
      );

      const updates = form?.elements.namedItem("updates");
      expect(updates).toBeInstanceOf(HTMLInputElement);
      expect(updates).toMatchObject({
        checked: false,
        id: "astro-updates",
        name: "updates",
        type: "checkbox",
        value: "weekly",
      });
      expect(document.querySelector('label[for="astro-updates"]')?.textContent?.trim()).toBe(
        "Receive updates",
      );

      expect(Array.from(new FormData(form!).entries())).toEqual([
        ["query", "server value"],
        ["accepted", "yes"],
        ["selection", "second"],
      ]);

      const select = document.querySelector<HTMLSelectElement>("#astro-select");
      expect(select?.className).toBe("krds-form-select large is-error consumer-select");
      expect(select?.value).toBe("second");

      const sortingError = document.querySelector<HTMLSelectElement>("#astro-sorting-error");
      expect(sortingError?.className).toBe("krds-form-select-sort is-error");
      expect(sortingError?.className).not.toMatch(/\b(?:small|medium|large)\b/);

      const sortingDefault = document.querySelector<HTMLSelectElement>("#astro-sorting-default");
      expect(sortingDefault?.className).toBe("krds-form-select-sort");
      expect(sortingDefault?.className).not.toMatch(/\b(?:small|medium|large)\b/);

      const tabArea = document.querySelector<HTMLElement>("#astro-tabs");
      expect(tabArea?.className).toBe("krds-tab-area layer consumer-tabs");
      expect(tabArea?.querySelector(":scope > .tab")?.className).toBe("tab line full");
      const tabItems = Array.from(
        tabArea!.querySelectorAll<HTMLButtonElement>('button[role="tab"]'),
      );
      expect(tabItems.every((item) => item.tagName === "BUTTON")).toBe(true);
      expect(tabItems.map((item) => item.className)).toEqual(["btn-tab", "btn-tab"]);
      expect(tabItems.map((item) => item.getAttribute("aria-selected"))).toEqual(["true", "false"]);
      expect(tabItems.map((item) => item.tabIndex)).toEqual([0, -1]);
      const tabListItems = Array.from(tabArea!.querySelectorAll<HTMLElement>("li"));
      expect(tabListItems.map((item) => item.getAttribute("role"))).toEqual([
        "presentation",
        "presentation",
      ]);
      expect(tabListItems.map((item) => item.className)).toEqual(["active", ""]);
      expect(tabListItems[0]?.getAttribute("class")).toBe("active");
      expect(tabListItems[1]?.hasAttribute("class")).toBe(false);
      const tabPanels = Array.from(tabArea!.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
      expect(tabPanels.map((panel) => panel.className)).toEqual(["tab-conts active", "tab-conts"]);
      expect(tabPanels.map((panel) => panel.hidden)).toEqual([false, true]);
      expect(tabPanels.map((panel) => panel.getAttribute("aria-labelledby"))).toEqual(
        tabItems.map((item) => item.id),
      );

      const accordion = document.querySelector<HTMLElement>(".krds-accordion");
      expect(accordion).not.toBeNull();
      expect(accordion?.hasAttribute("data-krds-accordion")).toBe(false);
      const buttons = Array.from(
        accordion!.querySelectorAll<HTMLButtonElement>("button.btn-accordion"),
      );
      expect(buttons).toHaveLength(2);
      expect(buttons.map((button) => button.getAttribute("aria-expanded"))).toEqual([
        "true",
        "false",
      ]);

      const controlledIds = buttons.map((button) => button.getAttribute("aria-controls"));
      expect(controlledIds.every(Boolean)).toBe(true);
      expect(new Set(controlledIds).size).toBe(buttons.length);

      const panels = buttons.map((button) => {
        expect(button.id).not.toBe("");
        expect(button.type).toBe("button");

        const panel = document.getElementById(button.getAttribute("aria-controls")!);
        expect(panel).not.toBeNull();
        expect(panel?.getAttribute("aria-labelledby")).toBe(button.id);
        expect(panel?.getAttribute("role")).toBe("region");
        return panel!;
      });
      expect(panels[0].hidden).toBe(false);
      expect(panels[1].hidden).toBe(true);
      expect(document.querySelector("astro-island")).toBeNull();
      const firstBody = panels[0].querySelector<HTMLElement>(".accordion-body");
      expect(firstBody?.textContent).toBe("<img src=x onerror=alert(1)>literal");
      expect(firstBody?.querySelector("img")).toBeNull();
      expect(firstBody?.innerHTML).toContain("&lt;img");
    } finally {
      dom?.window.close();
      await server.close();
    }
  });

  it("preserves upstream visual-context wrappers and inline text boundaries", async () => {
    const server = await createAstroSsrServer();
    let dom: JSDOM | undefined;

    try {
      const { default: Fixture } = await server.ssrLoadModule(
        "/tests/framework/ssr-hydration/fixtures/AstroSsrFixture.astro",
      );
      const html = await renderAstroComponentToString(Fixture);
      dom = new JSDOM(html);
      const { document, Node } = dom.window;
      const directText = (element: Element) =>
        Array.from(element.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? "")
          .join("");

      const tag = document.querySelector<HTMLElement>("#astro-tag");
      const tagLink = document.querySelector<HTMLAnchorElement>("#astro-tag-link");
      expect(tag?.parentElement?.className).toBe("krds-tag-wrap large");
      expect(tagLink?.parentElement?.className).toBe("krds-tag-wrap large");

      const spinner = document.querySelector<HTMLElement>("#astro-spinner");
      const spinnerForm = spinner?.closest<HTMLElement>(".form-group");
      expect(Array.from(spinnerForm?.children ?? []).map((element) => element.className)).toEqual([
        "form-tit",
        "form-conts",
      ]);
      expect(
        spinnerForm?.querySelector(
          ":scope > .form-tit + .form-conts > .form-spinner > #astro-spinner",
        ),
      ).toBe(spinner);
      const spinnerInput = spinner?.previousElementSibling as HTMLInputElement | null;
      expect(spinnerInput?.matches('input.krds-input[type="text"]')).toBe(true);
      expect(spinnerInput?.id).toBe("consult_name");
      expect(spinnerForm?.querySelector<HTMLLabelElement>(".form-tit > label")?.htmlFor).toBe(
        spinnerInput?.id,
      );

      const inPageNavigation = document.querySelector<HTMLElement>("#astro-in-page-navigation");
      expect(inPageNavigation?.parentElement?.className).toBe("krds-in-page-navigation-type");

      const radioArea = document
        .querySelector<HTMLInputElement>("#astro-radio-medium")
        ?.closest<HTMLElement>(".krds-check-area");
      expect(Array.from(radioArea?.children ?? []).map((element) => element.className)).toEqual([
        "krds-form-check medium",
        "krds-form-check large",
      ]);
      expect(radioArea?.querySelectorAll(":scope > .krds-form-check > input")).toHaveLength(2);

      for (const panelId of ["astro-help-panel", "astro-tutorial-panel"]) {
        const panel = document.querySelector<HTMLElement>(`#${panelId}`);
        const panelWrap = panel?.querySelector<HTMLElement>(":scope > .help-panel-wrap");
        expect(panel?.classList.contains("expand")).toBe(true);
        expect(panel?.hidden).toBe(false);
        expect(panelWrap?.tabIndex).toBe(0);
      }

      const helpTriggerIcon = document.querySelector<HTMLElement>(
        '[aria-controls="astro-help-panel"] > .svg-icon.ico-fold',
      );
      const helpFoldIcon = document.querySelector<HTMLElement>(
        "#astro-help-panel .btn-help-panel.fold > .svg-icon.ico-angle.right",
      );
      expect(helpTriggerIcon?.nextSibling?.nodeType).toBe(Node.TEXT_NODE);
      expect(helpTriggerIcon?.nextSibling?.textContent).toBe(" Help");
      expect(helpFoldIcon?.previousSibling?.nodeType).toBe(Node.TEXT_NODE);
      expect(helpFoldIcon?.previousSibling?.textContent).toBe(" Collapse ");

      const tooltip = document.querySelector<HTMLButtonElement>("#astro-tooltip");
      const language = document.querySelector<HTMLElement>("#astro-language");
      const languagePage = document.querySelector<HTMLElement>("#astro-language-page");
      const link = document.querySelector<HTMLAnchorElement>("#astro-link");
      const tts = document.querySelector<HTMLButtonElement>("#astro-tts");
      expect(directText(tooltip!)).toBe("Tooltip label ");
      expect(directText(language!.querySelector(":scope > button")!)).toBe(" Language ");
      expect(directText(languagePage!.querySelector(":scope > button")!)).toBe(" Language ");
      expect(directText(link!)).toBe(" ");
      expect(directText(tts!)).toBe(" ");
      expect(language?.hasAttribute("currentlabel")).toBe(false);
      expect(language?.hasAttribute("externaltitle")).toBe(false);

      const alerts = document.querySelector<HTMLElement>("#astro-critical-alerts");
      expect(alerts?.tagName).toBe("UL");
      expect(alerts?.className).toBe("krds-critical-alerts");
      expect(alerts?.parentElement?.className).toBe("main-urgent-wrap");
      expect(alerts?.parentElement?.getAttribute("role")).toBe("alert");
      const alertIcon = alerts?.querySelector<HTMLElement>(
        ".critical-ban > a > .svg-icon.ico-angle.right",
      );
      expect(alertIcon?.previousSibling?.nodeType).toBe(Node.TEXT_NODE);
      expect(alertIcon?.previousSibling?.textContent).toBe(" ");

      const upload = document.querySelector<HTMLElement>("#astro-file-upload");
      expect(upload?.querySelector(".file-list > .total")?.textContent).toBe("2개 / 10개");
      expect(
        upload?.querySelector<HTMLInputElement>('input[type="file"]')?.hasAttribute("countsuffix"),
      ).toBe(false);
      const uploadRows = Array.from(
        upload?.querySelectorAll<HTMLElement>(".upload-list > li") ?? [],
      );
      expect(
        uploadRows.map((row) => Array.from(row.children).map((child) => child.className)),
      ).toEqual([["file-info"], ["file-info", "file-hint-invalid"]]);
      const uploadData = upload?.nextElementSibling as HTMLScriptElement | null;
      expect(uploadData?.className).toBe("krds-file-upload-data");
      expect(JSON.parse(uploadData?.textContent ?? "{}")).toEqual({
        fileIds: ["uploading", "error"],
      });
    } finally {
      dom?.window.close();
      await server.close();
    }
  });

  it("renders unique structured-list row checkbox names without invalid disabled links", async () => {
    const server = await createAstroSsrServer();
    let dom: JSDOM | undefined;

    try {
      const { default: StructuredListTable } = await server.ssrLoadModule(
        "/packages/astro/src/StructuredListTable.astro",
      );
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const html = await container.renderToString(StructuredListTable, {
        props: {
          id: "astro-structured-table",
          columns: [
            { key: "selected", label: "선택", visuallyHidden: true },
            { key: "title", label: "제목" },
            { key: "download", label: "다운로드" },
          ],
          rows: [
            {
              id: "first",
              selectionLabel: "첫 번째 행 선택",
              title: "첫 번째 행",
              download: "다운로드",
            },
            {
              id: "second",
              selectionLabel: "두 번째 행 선택",
              title: "두 번째 행",
              download: "다운로드",
            },
          ],
          caption: "구조화 목록",
          selectAllLabel: "전체 선택",
          actions: [{ id: "download-selected", label: "선택 다운로드", icon: "down" }],
          countLabel: "목록 표시 개수",
          countOptions: ["10개"],
          countValue: "10개",
          sortLabel: "정렬",
          sortOptions: ["최신순"],
          sortValue: "최신순",
          pagination: {
            current: 1,
            items: [1],
            previousDisabled: true,
            previousLabel: "이전",
            nextLabel: "다음",
            currentLabel: "현재 페이지",
            hrefs: { 1: "/page/1", next: "/page/2" },
          },
          selectionName: "selectedRows",
        },
      });
      dom = new JSDOM(html);
      const { document, Node } = dom.window;
      const rowCheckboxes = Array.from(
        document.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'),
      );
      const accessibleNames = rowCheckboxes.map((checkbox) => checkbox.getAttribute("aria-label"));

      expect(accessibleNames).toEqual(["첫 번째 행 선택", "두 번째 행 선택"]);
      expect(new Set(accessibleNames).size).toBe(rowCheckboxes.length);
      rowCheckboxes.forEach((checkbox) => {
        const label = document.querySelector<HTMLLabelElement>(`label[for="${checkbox.id}"]`);
        expect(label).not.toBeNull();
        expect(label?.htmlFor).toBe(checkbox.id);
        expect(label?.control).toBe(checkbox);
        expect(label?.textContent).toBe("");
      });

      const iconButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          "button.krds-btn.medium.text:has(> .svg-icon)",
        ),
      );
      expect(iconButtons).toHaveLength(3);
      expect(
        iconButtons.map((button) => {
          const icon = button.querySelector<HTMLElement>(":scope > .svg-icon");
          expect(icon?.nextSibling?.nodeType).toBe(Node.TEXT_NODE);
          return icon?.nextSibling?.textContent;
        }),
      ).toEqual([" 선택 다운로드", " 다운로드", " 다운로드"]);

      const disabledPrevious = document.querySelector<HTMLElement>(
        ".krds-pagination .page-navi.prev.disabled",
      );
      expect(disabledPrevious?.tagName).toBe("SPAN");
      expect(disabledPrevious?.hasAttribute("href")).toBe(false);
      expect(document.querySelector(".page-navi.prev.disabled[href]")).toBeNull();
    } finally {
      dom?.window.close();
      await server.close();
    }
  });

  it("matches initialized calendar and date-input SSR semantics", async () => {
    const server = await createAstroSsrServer();
    const doms: JSDOM[] = [];

    try {
      const [{ default: Calendar }, { default: DateInput }] = await Promise.all([
        server.ssrLoadModule("/packages/astro/src/Calendar.astro"),
        server.ssrLoadModule("/packages/astro/src/DateInput.astro"),
      ]);
      // Astro is package-scoped, so its container cannot be imported from the test root.
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const render = async (component: unknown, props: Record<string, unknown>) => {
        const html = await container.renderToString(component, { props });
        const dom = new JSDOM(html);
        doms.push(dom);
        return dom.window.document;
      };
      const commonProps = {
        year: 2024,
        month: 10,
        years: Array.from({ length: 24 }, (_, index) => 2001 + index),
        disabledYears: [2003],
        leadingDays: 5,
        previousMonthDayCount: 30,
        dayCount: 31,
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
        calendarLabel: "달력",
        previousMonthLabel: "이전 달",
        nextMonthLabel: "다음 달",
        yearSelectLabel: "연도 선택",
        monthSelectLabel: "월 선택",
        todayLabel: "오늘",
        cancelLabel: "취소",
        confirmLabel: "확인",
        eventLabel: "일정있음",
      };
      const assertSwitchRelationships = (
        document: Document,
        displayYear: number,
        displayMonth: number,
        selectedYear = displayYear,
        selectedMonth = displayMonth,
      ) => {
        const assertSwitch = (selector: string, displayText: string, selectedText: string) => {
          const trigger = document.querySelector<HTMLButtonElement>(selector);
          expect(trigger?.textContent?.trim()).toBe(displayText);
          expect(trigger?.getAttribute("role")).toBe("combobox");
          expect(trigger?.getAttribute("aria-haspopup")).toBe("listbox");
          expect(trigger?.getAttribute("aria-expanded")).toBe("false");

          const listId = trigger?.getAttribute("aria-controls");
          expect(listId).toBeTruthy();
          const list = document.getElementById(listId!);
          expect(list?.getAttribute("role")).toBe("listbox");
          expect(
            Array.from(list?.querySelectorAll<HTMLElement>(":scope > li") ?? []).every(
              (item) => item.getAttribute("role") === "none",
            ),
          ).toBe(true);
          const options = Array.from(
            list?.querySelectorAll<HTMLButtonElement>(":scope > li > button") ?? [],
          );
          expect(options.length).toBeGreaterThan(0);
          expect(options.every((option) => option.getAttribute("role") === "option")).toBe(true);
          expect(
            options.every((option) =>
              ["true", "false"].includes(option.getAttribute("aria-selected") ?? ""),
            ),
          ).toBe(true);
          const selectedOptions = options.filter(
            (option) => option.getAttribute("aria-selected") === "true",
          );
          expect(selectedOptions.map((option) => option.textContent?.trim())).toEqual([
            selectedText,
          ]);
          expect(selectedOptions[0]?.classList.contains("active")).toBe(true);
          return listId;
        };

        const yearListId = assertSwitch(
          ".btn-cal-switch.year",
          `${displayYear}년`,
          `${selectedYear}년`,
        );
        const monthListId = assertSwitch(
          ".btn-cal-switch.month",
          `${String(displayMonth).padStart(2, "0")}월`,
          `${String(selectedMonth).padStart(2, "0")}월`,
        );
        expect(yearListId).not.toBe(monthListId);
      };
      const cellFor = (document: Document, date: string) => {
        const cell = document.querySelector<HTMLTableCellElement>(`td[data-date="${date}"]`);
        expect(cell).not.toBeNull();
        return cell!;
      };

      const calendarDocument = await render(Calendar, {
        ...commonProps,
        surfaceOnly: true,
        selectionMode: "single",
        displayYear: 2002,
        displayMonth: 12,
        selectedYear: 2002,
        selectedMonth: 12,
        disabledMonths: [2],
        rangeStartDay: 7,
        rangeEndDay: 7,
        todayDay: 30,
        eventDays: [8],
        disabledDays: [13],
        calendarId: "astro-calendar-default",
      });
      const calendarWrap = calendarDocument.querySelector<HTMLElement>(".calendar-wrap");
      expect(calendarWrap?.className).toBe("calendar-wrap bottom single");
      expect(calendarWrap?.tabIndex).toBe(0);
      expect(calendarDocument.querySelector("caption")?.textContent?.trim()).toBe("2002년 12월");
      assertSwitchRelationships(calendarDocument, 2002, 12);
      expect(
        calendarDocument.querySelector(".btn-cal-switch.year")?.getAttribute("aria-controls"),
      ).toBe("astro-calendar-default-year-list");
      expect(
        calendarDocument.querySelector(".btn-cal-switch.month")?.getAttribute("aria-controls"),
      ).toBe("astro-calendar-default-month-list");
      expect(calendarDocument.querySelectorAll(".calendar-tbl td[data-date]")).toHaveLength(42);
      expect(
        Array.from(
          calendarDocument.querySelectorAll<HTMLButtonElement>("td.old button, td.new button"),
        ).map((button) => button.getAttribute("disabled")),
      ).toEqual(Array(11).fill(""));
      const selectedDay = cellFor(calendarDocument, "2002.12.07");
      expect(selectedDay.className).toBe("period start end");
      expect(selectedDay.querySelector("button")?.getAttribute("aria-pressed")).toBe("true");
      expect(
        cellFor(calendarDocument, "2002.12.08").querySelector("button")?.getAttribute("aria-label"),
      ).toBe("8 일정있음");
      expect(
        cellFor(calendarDocument, "2002.12.30").querySelector("button")?.getAttribute("aria-label"),
      ).toBe("30 오늘");
      const disabledDay = cellFor(calendarDocument, "2002.12.13").querySelector("button");
      expect(disabledDay?.getAttribute("disabled")).toBe("");
      expect(cellFor(calendarDocument, "2002.11.26").classList.contains("old")).toBe(true);
      expect(cellFor(calendarDocument, "2003.01.06").classList.contains("new")).toBe(true);

      const rangeDocument = await render(Calendar, {
        ...commonProps,
        surfaceOnly: true,
        selectionMode: "range",
        displayYear: 2011,
        displayMonth: 2,
        selectedYear: 2011,
        selectedMonth: 2,
        disabledMonths: [1],
        rangeStartDay: 7,
        rangeEndDay: 16,
        todayDay: 20,
        eventDays: [6],
        calendarId: "astro-calendar-range-default",
      });
      expect(rangeDocument.querySelector(".calendar-wrap")?.classList.contains("single")).toBe(
        false,
      );
      expect(rangeDocument.querySelector<HTMLElement>(".calendar-wrap")?.tabIndex).toBe(0);
      expect(rangeDocument.querySelector("caption")?.textContent?.trim()).toBe("2011년 02월");
      assertSwitchRelationships(rangeDocument, 2011, 2);
      const rangeCells = Array.from(
        rangeDocument.querySelectorAll<HTMLTableCellElement>("td.period"),
      );
      expect(rangeCells.map((cell) => cell.dataset.date)).toEqual(
        Array.from({ length: 10 }, (_, index) => `2011.02.${String(index + 7).padStart(2, "0")}`),
      );
      expect(
        rangeCells.every(
          (cell) => cell.querySelector("button")?.getAttribute("aria-pressed") === "true",
        ),
      ).toBe(true);
      expect(cellFor(rangeDocument, "2011.02.07").classList.contains("start")).toBe(true);
      expect(cellFor(rangeDocument, "2011.02.16").classList.contains("end")).toBe(true);
      expect(
        cellFor(rangeDocument, "2011.02.06").querySelector("button")?.getAttribute("aria-label"),
      ).toBe("6 일정있음");
      expect(
        cellFor(rangeDocument, "2011.02.20").querySelector("button")?.getAttribute("aria-label"),
      ).toBe("20 오늘");

      const distinctSelectionDocument = await render(DateInput, {
        ...commonProps,
        id: "astro-date-input-distinct-selection",
        displayYear: 2002,
        displayMonth: 12,
        calendarId: "astro-date-input-distinct-selection-calendar",
      });
      assertSwitchRelationships(distinctSelectionDocument, 2002, 12, 2024, 10);
      expect(distinctSelectionDocument.querySelector("caption")?.textContent?.trim()).toBe(
        "2002년 12월",
      );

      const dateInputDocument = await render(DateInput, {
        ...commonProps,
        id: "astro-date-input",
        label: "레이블",
        hint: "도움말",
        displayYear: 2002,
        displayMonth: 12,
        selectedYear: 2002,
        selectedMonth: 12,
        disabledMonths: [1],
        rangeStartDay: 7,
        rangeEndDay: 16,
        todayDay: 25,
        eventDays: [26],
        calendarId: "astro-date-input-calendar",
      });
      const dateInputRoot = dateInputDocument.querySelector<HTMLElement>(".form-group");
      expect(Array.from(dateInputRoot?.children ?? []).map((element) => element.className)).toEqual(
        ["form-tit", "form-conts", "form-hint"],
      );
      const dateInput = dateInputRoot?.querySelector<HTMLInputElement>("#astro-date-input");
      const dateLabel = dateInputRoot?.querySelector<HTMLLabelElement>(".form-tit > label");
      expect(dateLabel?.htmlFor).toBe(dateInput?.id);
      expect(dateLabel?.control).toBe(dateInput);
      expect(dateInput).toMatchObject({
        className: "krds-input datepicker cal",
        placeholder: "YYYY.MM.DD",
        type: "number",
        value: "",
      });
      expect(dateInput?.hasAttribute("aria-describedby")).toBe(false);
      const formContents = dateInputRoot?.querySelector<HTMLElement>(":scope > .form-conts");
      const calendarContents = formContents?.querySelector<HTMLElement>(
        ":scope > .form-conts.calendar-conts",
      );
      expect(calendarContents?.parentElement).toBe(formContents);
      expect(calendarContents?.querySelector(":scope > .calendar-input > input")).toBe(dateInput);
      expect(calendarContents?.querySelector(":scope > .krds-calendar-area")).not.toBeNull();
      const hint = dateInputRoot?.querySelector<HTMLElement>(":scope > .form-hint");
      expect(hint?.textContent?.trim()).toBe("도움말");
      expect(hint?.hasAttribute("id")).toBe(false);
      expect(dateInputDocument.querySelector<HTMLElement>(".calendar-wrap")?.tabIndex).toBe(0);
      assertSwitchRelationships(dateInputDocument, 2002, 12);
      expect(
        cellFor(dateInputDocument, "2002.12.25")
          .querySelector("button")
          ?.getAttribute("aria-label"),
      ).toBe("25 오늘");
      expect(
        cellFor(dateInputDocument, "2002.12.26")
          .querySelector("button")
          ?.getAttribute("aria-label"),
      ).toBe("26 일정있음");
    } finally {
      doms.forEach((dom) => dom.window.close());
      await server.close();
    }
  });

  it("renders pinned panel and disclosure accessibility state", async () => {
    const server = await createAstroSsrServer();
    const doms: JSDOM[] = [];

    try {
      const [{ default: HelpPanel }, { default: TutorialPanel }, { default: Disclosure }] =
        await Promise.all([
          server.ssrLoadModule("/packages/astro/src/HelpPanel.astro"),
          server.ssrLoadModule("/packages/astro/src/TutorialPanel.astro"),
          server.ssrLoadModule("/packages/astro/src/Disclosure.astro"),
        ]);
      // Astro is package-scoped, so its container cannot be imported from the test root.
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const panelProps = {
        open: true,
        tabs: [
          { id: "help", label: "Help", panelId: "help-content", value: "help" },
          {
            id: "tutorial",
            label: "Tutorial",
            panelId: "tutorial-content",
            value: "tutorial",
          },
        ],
        selectedLabel: "Selected",
        helpTitle: "Help title",
        helpDescription: "Help body",
        downloadLinks: [],
        relatedGroups: [
          {
            title: "Related services",
            links: [
              { label: "Call", href: "#call", icon: "call" },
              { label: "FAQ", href: "#faq", icon: "faq" },
            ],
          },
        ],
        tutorialTitle: "Tutorial title",
        tasks: [
          {
            id: "first",
            title: "First task",
            current: true,
            summary: "First task summary",
            steps: ["First step", "Second step"],
          },
          {
            id: "second",
            title: "Second task",
            summary: "Second task summary",
            steps: ["Third step"],
          },
        ],
        stopLabel: "Stop",
        collapseLabel: "Collapse",
        label: "Help",
      };

      const helpHtml = await container.renderToString(HelpPanel, {
        props: { ...panelProps, activeTab: "help" },
      });
      const tutorialHtml = await container.renderToString(TutorialPanel, {
        props: { ...panelProps, activeTab: "tutorial" },
      });
      const disclosureHtml = await container.renderToString(Disclosure, {
        props: {
          title: "Disclosure",
          items: ["First item", "Second item"],
        },
      });
      const helpDom = new JSDOM(helpHtml);
      const tutorialDom = new JSDOM(tutorialHtml);
      const disclosureDom = new JSDOM(disclosureHtml);
      doms.push(helpDom, tutorialDom, disclosureDom);

      const panelCases = [
        { dom: helpDom, idPattern: /^krds-help-panel-/, activeIndex: 0 },
        { dom: tutorialDom, idPattern: /^krds-tutorial-panel-/, activeIndex: 1 },
      ] as const;

      for (const { dom, idPattern, activeIndex } of panelCases) {
        const { document } = dom.window;
        const root = document.querySelector<HTMLElement>(".krds-help-panel");
        const trigger = root?.previousElementSibling as HTMLButtonElement | null;
        const panelWrap = root?.querySelector<HTMLElement>(":scope > .help-panel-wrap");

        // The generated root ID is retained so the trigger always controls a real panel.
        expect(root?.id).toMatch(idPattern);
        expect(trigger?.id).toBe(`${root?.id}-trigger`);
        expect(trigger?.getAttribute("aria-controls")).toBe(root?.id);
        expect(trigger?.getAttribute("aria-expanded")).toBe("true");
        expect(root?.classList.contains("expand")).toBe(true);
        expect(root?.hidden).toBe(false);
        expect(root?.hasAttribute("style")).toBe(false);
        expect(panelWrap?.tabIndex).toBe(0);
        expect(panelWrap?.hasAttribute("style")).toBe(false);

        const tabs = Array.from(root!.querySelectorAll<HTMLButtonElement>('button[role="tab"]'));
        expect(tabs.map((tab) => tab.parentElement?.getAttribute("role"))).toEqual([
          "presentation",
          "presentation",
        ]);
        expect(tabs.map((tab) => tab.tabIndex)).toEqual(activeIndex === 0 ? [0, -1] : [-1, 0]);
        expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(
          activeIndex === 0 ? ["true", "false"] : ["false", "true"],
        );

        const panels = Array.from(root!.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
        expect(panels.map((panel) => panel.hidden)).toEqual(
          activeIndex === 0 ? [false, true] : [true, false],
        );
        expect(root?.querySelector(".help-title > a")?.getAttribute("href")).toBe("#;");
        expect(root?.querySelector(".related-service i.ico-call.svg-icon")).not.toBeNull();
        expect(root?.querySelector(".related-service i.ico-faq.svg-icon")).not.toBeNull();

        const taskDisclosures = Array.from(
          root!.querySelectorAll<HTMLElement>(".coach-help-process > li > .krds-disclosure"),
        );
        expect(taskDisclosures).toHaveLength(2);
        for (const taskDisclosure of taskDisclosures) {
          const button = taskDisclosure.querySelector<HTMLButtonElement>(".btn-conts-expand");
          const content = taskDisclosure.querySelector<HTMLElement>(".expand-wrap");
          expect(content).not.toBeNull();
          expect(button?.getAttribute("aria-expanded")).toBe("false");
          expect(button?.getAttribute("aria-controls")).toBe(content?.id);
          expect(content?.hasAttribute("inert")).toBe(true);
          expect(content?.hasAttribute("hidden")).toBe(false);
          expect(content?.hasAttribute("aria-hidden")).toBe(false);
          expect(content?.hasAttribute("style")).toBe(false);
        }

        const stepLists = Array.from(
          root!.querySelectorAll<HTMLElement>(".krds-info-list.decimal"),
        );
        const stepItems = Array.from(
          root!.querySelectorAll<HTMLElement>(".krds-info-list.decimal > li"),
        );
        expect(stepLists.map((list) => list.getAttribute("role"))).toEqual(["list", "list"]);
        expect(stepItems.map((item) => item.getAttribute("role"))).toEqual([
          "listitem",
          "listitem",
          "listitem",
        ]);
      }

      const disclosureRoot =
        disclosureDom.window.document.querySelector<HTMLElement>(".krds-disclosure");
      const disclosureButton =
        disclosureRoot?.querySelector<HTMLButtonElement>(".btn-conts-expand");
      const disclosureRegion = disclosureRoot?.querySelector<HTMLElement>(".expand-wrap");
      expect(disclosureButton?.getAttribute("aria-expanded")).toBe("false");
      expect(disclosureButton?.getAttribute("aria-controls")).toBe(disclosureRegion?.id);
      expect(disclosureRegion?.getAttribute("role")).toBe("region");
      expect(disclosureRegion?.hasAttribute("inert")).toBe(true);
      expect(disclosureRegion?.querySelector(".krds-info-list")?.getAttribute("role")).toBe("list");
      expect(
        Array.from(disclosureRegion?.querySelectorAll(".krds-info-list > li") ?? []).map((item) =>
          item.getAttribute("role"),
        ),
      ).toEqual(["listitem", "listitem"]);
    } finally {
      doms.forEach((dom) => dom.window.close());
      await server.close();
    }
  });
  it("renders exact modal SSR state without runtime-only attributes", async () => {
    const server = await createAstroSsrServer();
    const doms: JSDOM[] = [];

    try {
      const { default: Modal } = await server.ssrLoadModule("/packages/astro/src/Modal.astro");
      // Astro is package-scoped, so its container cannot be imported from the test root.
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const modalProps = {
        id: "astro-modal-state",
        title: "Modal title",
        description: "Modal body",
        cancelLabel: "Cancel",
        confirmLabel: "Confirm",
        closeLabel: "Close",
      };

      const closedHtml = await container.renderToString(Modal, {
        props: modalProps,
      });
      const openHtml = await container.renderToString(Modal, {
        props: { ...modalProps, open: true },
      });
      const closedDom = new JSDOM(closedHtml);
      const openDom = new JSDOM(openHtml);
      doms.push(closedDom, openDom);

      const closedModal =
        closedDom.window.document.querySelector<HTMLElement>("#astro-modal-state");
      const closedBackdrop = closedModal?.querySelector<HTMLElement>(":scope > .modal-back");
      expect(closedModal?.tagName).toBe("SECTION");
      expect(closedModal?.getAttribute("role")).toBe("dialog");
      expect(closedModal?.className).toBe("krds-modal fade");
      expect(closedModal?.hidden).toBe(true);
      expect(closedModal?.getAttributeNames().sort()).toEqual([
        "aria-labelledby",
        "class",
        "hidden",
        "id",
        "role",
      ]);
      expect(closedBackdrop?.className).toBe("modal-back");
      expect(closedBackdrop?.getAttributeNames()).toEqual(["class"]);

      const openModal = openDom.window.document.querySelector<HTMLElement>("#astro-modal-state");
      const openBackdrop = openModal?.querySelector<HTMLElement>(":scope > .modal-back");
      const openTitle = openModal?.querySelector<HTMLElement>(".modal-title");
      expect(openModal?.tagName).toBe("SECTION");
      expect(openModal?.getAttribute("role")).toBe("dialog");
      expect(openModal?.getAttribute("aria-labelledby")).toBe(openTitle?.id);
      expect(openModal?.className).toBe("krds-modal fade in shown");
      expect(openModal?.hidden).toBe(false);
      expect(openModal?.getAttributeNames().sort()).toEqual([
        "aria-labelledby",
        "class",
        "id",
        "role",
      ]);
      expect(openBackdrop?.className).toBe("modal-back in");
      expect(openBackdrop?.getAttributeNames()).toEqual(["class"]);
      expect(
        Array.from(openModal?.querySelectorAll<HTMLButtonElement>("button") ?? []).map(
          (button) => button.type,
        ),
      ).toEqual(["button", "button", "button"]);
    } finally {
      doms.forEach((dom) => dom.window.close());
      await server.close();
    }
  });

  it("matches pinned sample and initialized header navigation SSR semantics", async () => {
    const server = await createAstroSsrServer();
    const doms: JSDOM[] = [];

    try {
      const [{ default: Header }, { default: MainMenuMobile }, { default: MainMenuPc }] =
        await Promise.all([
          server.ssrLoadModule("/packages/astro/src/Header.astro"),
          server.ssrLoadModule("/packages/astro/src/MainMenuMobile.astro"),
          server.ssrLoadModule("/packages/astro/src/MainMenuPc.astro"),
        ]);
      // Astro is package-scoped, so its container cannot be imported from the test root.
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const render = async (component: unknown, props: Record<string, unknown>) => {
        const html = await container.renderToString(component, { props });
        const dom = new JSDOM(html);
        doms.push(dom);
        return dom.window.document;
      };
      const mobileItems = [
        {
          id: "mGnb-anchor1",
          label: "First depth",
          href: "#mGnb-anchor1",
          children: [
            {
              id: "mobile-second",
              label: "Second depth",
              href: "#",
              children: [
                {
                  id: "mobile-third",
                  label: "Third depth",
                  href: "#",
                  title: "Fourth depth",
                  children: [{ id: "mobile-fourth", label: "Fourth item", href: "#" }],
                },
              ],
            },
          ],
        },
        {
          id: "mGnb-anchor2",
          label: "Second tab",
          href: "#mGnb-anchor2",
          children: [],
        },
      ];
      const mobileProps = {
        utilityItems: [{ id: "mobile-utility", label: "Utility" }],
        loginLabel: "Login",
        serviceItems: [{ id: "mobile-service", label: "Service", href: "#" }],
        searchPlaceholder: "Search menus",
        searchTitle: "Specific menu search",
        searchLabel: "Search",
        items: mobileItems,
        previousLabel: "Previous",
        closeLabel: "Close",
        bottomItems: [],
      };
      const desktopItems = ["one", "two"].map((group) => ({
        id: `desktop-${group}`,
        label: `Main ${group}`,
        children: [
          {
            id: `desktop-${group}-first`,
            label: "First submenu",
            title: "First title",
            children: [{ id: `desktop-${group}-leaf`, label: "Leaf", href: "#" }],
          },
          {
            id: `desktop-${group}-second`,
            label: "Second submenu",
            title: "Second title",
            children: [],
          },
        ],
      }));
      const sampleDesktopItems = [
        {
          ...desktopItems[0],
          active: true,
          children: desktopItems[0]!.children.map((item, index) => ({
            ...item,
            active: index === 0,
          })),
        },
      ];

      const sampleMobileDocument = await render(MainMenuMobile, {
        ...mobileProps,
        sample: true,
        standalone: true,
        className: "consumer-mobile",
        style: { display: "block", position: "static", visibility: "visible" },
      });
      const sampleMobile =
        sampleMobileDocument.querySelector<HTMLElement>(".krds-main-menu-mobile");
      expect(sampleMobile?.className).toBe("krds-main-menu-mobile sample consumer-mobile");
      expect(sampleMobile?.getAttribute("style")).toBe(
        "display: block; position: static; visibility: visible;",
      );
      expect(sampleMobile?.querySelector(".gnb-utils > ul")?.className).toBe("utility-list");
      const sampleMobileList = sampleMobile?.querySelector<HTMLElement>(".menu-wrap > ul");
      const sampleMobileTabs = Array.from(
        sampleMobile?.querySelectorAll<HTMLAnchorElement>(".menu-wrap .gnb-main-trigger") ?? [],
      );
      expect(sampleMobileList?.hasAttribute("role")).toBe(false);
      expect(
        Array.from(sampleMobileList?.children ?? []).map((item) => item.hasAttribute("role")),
      ).toEqual([false, false]);
      expect(
        sampleMobileTabs.map((tab) => ({
          id: tab.getAttribute("id"),
          role: tab.getAttribute("role"),
          selected: tab.getAttribute("aria-selected"),
          controls: tab.getAttribute("aria-controls"),
        })),
      ).toEqual([
        { id: null, role: null, selected: null, controls: null },
        { id: null, role: null, selected: null, controls: null },
      ]);
      expect(sampleMobileTabs.map((tab) => tab.getAttribute("href"))).toEqual([
        "#mGnb-anchor1",
        "#mGnb-anchor2",
      ]);
      const sampleDepth3 = sampleMobile?.querySelector<HTMLAnchorElement>(".has-depth3");
      const sampleDepth4 = sampleMobile?.querySelector<HTMLAnchorElement>(".has-depth4");
      expect(sampleDepth3?.getAttribute("aria-expanded")).toBeNull();
      expect(sampleDepth3?.getAttribute("aria-controls")).toBeNull();
      expect(sampleDepth3?.nextElementSibling?.hasAttribute("id")).toBe(false);
      expect(sampleDepth4?.getAttribute("aria-expanded")).toBeNull();
      expect(sampleDepth4?.getAttribute("aria-controls")).toBeNull();
      expect(sampleDepth4?.nextElementSibling?.hasAttribute("id")).toBe(false);
      expect(sampleMobile?.querySelector(".depth4-body")?.tagName).toBe("UL");
      expect(sampleMobile?.querySelector("div.depth4-body")).toBeNull();
      const sampleSearch = sampleMobile?.querySelector<HTMLInputElement>(".sch-input .krds-input");
      expect(sampleSearch?.title).toBe("Specific menu search");
      expect(sampleSearch?.getAttribute("aria-label")).toBe("Search");

      const initializedMobileDocument = await render(MainMenuMobile, {
        ...mobileProps,
        sample: false,
        standalone: false,
      });
      const initializedMobile =
        initializedMobileDocument.querySelector<HTMLElement>(".krds-main-menu-mobile");
      expect(initializedMobile?.hasAttribute("role")).toBe(false);
      expect(initializedMobile?.hasAttribute("aria-hidden")).toBe(false);
      expect(initializedMobile?.hasAttribute("style")).toBe(false);
      expect(initializedMobile?.querySelector(".menu-wrap > ul")?.getAttribute("role")).toBe(
        "tablist",
      );
      const initializedTabs = Array.from(
        initializedMobile?.querySelectorAll<HTMLAnchorElement>(".menu-wrap .gnb-main-trigger") ??
          [],
      );
      expect(initializedTabs.map((tab) => tab.id)).toEqual(["tab-0", "tab-1"]);
      expect(initializedTabs.map((tab) => tab.parentElement?.getAttribute("role"))).toEqual([
        "none",
        "none",
      ]);
      expect(initializedTabs.map((tab) => tab.getAttribute("role"))).toEqual(["tab", "tab"]);
      expect(initializedTabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual([
        "true",
        "false",
      ]);
      expect(initializedTabs.map((tab) => tab.getAttribute("aria-controls"))).toEqual([
        "mGnb-anchor1",
        "mGnb-anchor2",
      ]);
      expect(initializedTabs.map((tab) => tab.classList.contains("active"))).toEqual([true, false]);
      const initializedPanels = Array.from(
        initializedMobile?.querySelectorAll<HTMLElement>(".submenu-wrap > .gnb-sub-list") ?? [],
      );
      expect(initializedPanels.map((panel) => panel.getAttribute("role"))).toEqual([
        "tabpanel",
        "tabpanel",
      ]);
      expect(initializedPanels.map((panel) => panel.getAttribute("aria-labelledby"))).toEqual([
        "tab-0",
        "tab-1",
      ]);
      const initializedDepth3 = initializedMobile?.querySelector<HTMLAnchorElement>(".has-depth3");
      expect(initializedDepth3?.getAttribute("aria-expanded")).toBe("false");
      expect(initializedDepth3?.hasAttribute("aria-controls")).toBe(false);
      expect(initializedDepth3?.nextElementSibling?.hasAttribute("id")).toBe(false);

      const samplePcDocument = await render(MainMenuPc, {
        sample: true,
        className: "consumer-pc",
        menuLabel: "Main menu",
        items: sampleDesktopItems,
      });
      const samplePc = samplePcDocument.querySelector<HTMLElement>("nav.krds-main-menu");
      expect(samplePc?.className).toBe("krds-main-menu sample consumer-pc");
      expect(samplePc?.querySelector(".gnb-menu")?.hasAttribute("aria-label")).toBe(false);
      const sampleMainTrigger = samplePc?.querySelector<HTMLButtonElement>(".gnb-main-trigger");
      const sampleMainPanel = sampleMainTrigger?.nextElementSibling as HTMLElement | null;
      const sampleSubTrigger = samplePc?.querySelector<HTMLButtonElement>(".gnb-sub-trigger");
      const sampleSubPanel = sampleSubTrigger?.nextElementSibling as HTMLElement | null;
      expect(sampleMainTrigger?.classList.contains("active")).toBe(true);
      expect(sampleMainPanel?.classList.contains("is-open")).toBe(true);
      expect(sampleSubTrigger?.classList.contains("active")).toBe(true);
      expect(sampleSubPanel?.classList.contains("active")).toBe(true);
      for (const trigger of [sampleMainTrigger, sampleSubTrigger]) {
        expect(trigger?.hasAttribute("aria-controls")).toBe(false);
        expect(trigger?.hasAttribute("aria-expanded")).toBe(false);
        expect(trigger?.hasAttribute("aria-haspopup")).toBe(false);
      }
      expect(sampleMainPanel?.hasAttribute("id")).toBe(false);
      expect(sampleSubPanel?.hasAttribute("id")).toBe(false);

      const initializedPcDocument = await render(MainMenuPc, {
        sample: false,
        menuLabel: "Main menu",
        items: desktopItems,
      });
      const initializedPc = initializedPcDocument.querySelector<HTMLElement>("nav.krds-main-menu");
      expect(initializedPc?.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBe(
        "Main menu",
      );
      const initializedMainTriggers = Array.from(
        initializedPc?.querySelectorAll<HTMLButtonElement>(
          ".gnb-menu > li > .gnb-main-trigger:not(.is-link)",
        ) ?? [],
      );
      expect(
        initializedMainTriggers.map((trigger) => trigger.getAttribute("aria-controls")),
      ).toEqual(["gnb-main-menu-desktop-one", "gnb-main-menu-desktop-two"]);
      expect(
        initializedMainTriggers.map((trigger) => trigger.getAttribute("aria-expanded")),
      ).toEqual(["false", "false"]);
      expect(
        initializedMainTriggers.map((trigger) => trigger.getAttribute("aria-haspopup")),
      ).toEqual(["true", "true"]);
      const initializedGroups = Array.from(
        initializedPc?.querySelectorAll<HTMLElement>('.gnb-main-list[data-has-submenu="true"]') ??
          [],
      );
      expect(initializedGroups).toHaveLength(2);
      for (const group of initializedGroups) {
        const subTriggers = Array.from(
          group.querySelectorAll<HTMLButtonElement>(".gnb-sub-trigger"),
        );
        expect(subTriggers.map((trigger) => trigger.classList.contains("active"))).toEqual([
          true,
          false,
        ]);
        expect(subTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
          "true",
          "false",
        ]);
        expect(subTriggers.map((trigger) => trigger.getAttribute("aria-haspopup"))).toEqual([
          "true",
          "true",
        ]);
        for (const trigger of subTriggers) {
          const panel = trigger.nextElementSibling as HTMLElement | null;
          expect(trigger.getAttribute("aria-controls")).toBe(panel?.id);
        }
      }

      const headerDocument = await render(Header, {
        menuLabel: "Main menu",
        utilityItems: [
          {
            id: "utility-link",
            kind: "link",
            label: "External link",
            href: "#",
            target: "_blank",
            title: "New window",
          },
          {
            id: "utility-dropdown",
            kind: "dropdown",
            label: "Dropdown",
            items: Array.from({ length: 2 }, (_, index) => ({
              id: `utility-option-${index}`,
              label: "Option",
              href: "#",
            })),
          },
          {
            id: "utility-resize",
            kind: "resize",
            label: "Resize",
            items: ["sm", "md", "lg", "xlg", "xxlg"].map((className) => ({
              id: `resize-${className}`,
              label: "Size",
              className,
              selected: className === "md",
            })),
            selectedLabel: "Selected",
            resetLabel: "Reset",
          },
          {
            id: "utility-external",
            kind: "dropdown",
            label: "External",
            items: Array.from({ length: 3 }, (_, index) => ({
              id: `external-option-${index}`,
              label: "External option",
              href: "#",
              target: "_blank",
              title: "New window",
              className: "ico-go",
            })),
          },
        ],
        logoLabel: "KRDS",
        logoHref: "#",
        searchLabel: "Site search",
        searchTitle: "Site search layer",
        loginLabel: "Login",
        joinLabel: "Join",
        allMenuLabel: "All menus",
        myMenu: {
          label: "My GOV",
          items: Array.from({ length: 4 }, (_, index) => ({
            id: `my-option-${index}`,
            label: "My option",
            href: "#",
          })),
          logoutLabel: "Logout",
        },
        desktopItems,
        mobileMenu: mobileProps,
      });
      const header = headerDocument.querySelector<HTMLElement>("header");
      const headerUtilityIcon = header?.querySelector<HTMLElement>(
        '.header-utility a[target="_blank"] > .svg-icon.ico-go',
      );
      expect(headerUtilityIcon?.previousSibling?.nodeName).toBe("#text");
      expect(headerUtilityIcon?.previousSibling?.textContent).toBe("External link ");
      expect(header?.querySelector(".krds-main-menu .gnb-menu")?.getAttribute("aria-label")).toBe(
        "Main menu",
      );
      const initializedOnlySpans = Array.from(
        header?.querySelectorAll<HTMLElement>(
          ".header-utility .krds-drop-wrap:not(.krds-resize) .item-link > .sr-only, .header-actions .my-drop .item-link > .sr-only",
        ) ?? [],
      );
      expect(initializedOnlySpans).toHaveLength(9);
      expect(initializedOnlySpans.every((span) => span.textContent === "")).toBe(true);
      const resizeOptions = Array.from(
        header?.querySelectorAll<HTMLButtonElement>(
          ".header-utility .krds-resize .drop-list .item-link",
        ) ?? [],
      );
      expect(resizeOptions.map((option) => option.className)).toEqual([
        "item-link sm",
        "item-link md active",
        "item-link lg",
        "item-link xlg",
        "item-link xxlg",
      ]);
      expect(resizeOptions.map((option) => option.querySelector(".sr-only")?.textContent)).toEqual([
        "",
        "Selected",
        "",
        "",
        "",
      ]);
      expect(header?.querySelector("[data-adjust], [data-adjust-scale]")).toBeNull();
      const allMenuButton = header?.querySelector<HTMLButtonElement>(
        ".header-actions .btn-navi.all",
      );
      expect(allMenuButton?.getAttribute("aria-controls")).toBe("mobile-nav");
      expect(allMenuButton?.hasAttribute("aria-expanded")).toBe(false);
      const embeddedMobile = header?.querySelector<HTMLElement>(".krds-main-menu-mobile");
      expect(embeddedMobile?.hasAttribute("role")).toBe(false);
      expect(embeddedMobile?.hasAttribute("aria-hidden")).toBe(false);
      expect(embeddedMobile?.hasAttribute("style")).toBe(false);
      expect(embeddedMobile?.querySelector(".gnb-utils > ul")?.className).toBe("utility-list");
      const embeddedTabs = Array.from(
        embeddedMobile?.querySelectorAll<HTMLAnchorElement>(".menu-wrap .gnb-main-trigger") ?? [],
      );
      expect(embeddedTabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual([
        "true",
        "false",
      ]);
      expect(embeddedTabs.map((tab) => tab.id)).toEqual(["tab-0", "tab-1"]);
      const embeddedSearch =
        embeddedMobile?.querySelector<HTMLInputElement>(".sch-input .krds-input");
      expect(embeddedSearch?.title).toBe("Specific menu search");
      expect(embeddedSearch?.getAttribute("aria-label")).toBe("Search");
    } finally {
      doms.forEach((dom) => dom.window.close());
      await server.close();
    }
  });

  it("matches pinned runtime residual markup and accessibility relationships", async () => {
    const server = await createAstroSsrServer();
    const doms: JSDOM[] = [];

    try {
      const [
        { default: Accordion },
        { default: AccordionLine },
        { default: FileUpload },
        { default: InPageNavigation },
        { default: LanguageSwitcherPage },
        { default: ModalSample },
        { default: Pagination },
        { default: Select },
        { default: SelectSize },
        { default: SelectState },
        { default: StepIndicator },
        { default: TextInputState },
        { default: Textarea },
      ] = await Promise.all([
        server.ssrLoadModule("/packages/astro/src/Accordion.astro"),
        server.ssrLoadModule("/packages/astro/src/AccordionLine.astro"),
        server.ssrLoadModule("/packages/astro/src/FileUpload.astro"),
        server.ssrLoadModule("/packages/astro/src/InPageNavigation.astro"),
        server.ssrLoadModule("/packages/astro/src/LanguageSwitcherPage.astro"),
        server.ssrLoadModule("/packages/astro/src/ModalSample.astro"),
        server.ssrLoadModule("/packages/astro/src/Pagination.astro"),
        server.ssrLoadModule("/packages/astro/src/Select.astro"),
        server.ssrLoadModule("/packages/astro/src/SelectSize.astro"),
        server.ssrLoadModule("/packages/astro/src/SelectState.astro"),
        server.ssrLoadModule("/packages/astro/src/StepIndicator.astro"),
        server.ssrLoadModule("/packages/astro/src/TextInputState.astro"),
        server.ssrLoadModule("/packages/astro/src/Textarea.astro"),
      ]);
      // Astro is package-scoped, so its container cannot be imported statically from the test root.
      const astroRequire = createRequire(resolve(process.cwd(), "packages/astro/package.json"));
      const astroContainerUrl = pathToFileURL(astroRequire.resolve("astro/container")).href;
      const { experimental_AstroContainer } = await import(/* @vite-ignore */ astroContainerUrl);
      const container = await experimental_AstroContainer.create();
      const render = async (component: unknown, props: Record<string, unknown>) => {
        const html = await container.renderToString(component, { props });
        const dom = new JSDOM(html);
        doms.push(dom);
        return dom.window.document;
      };

      const accordionProps = {
        items: [
          { id: "one", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
          { id: "two", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
        ],
        defaultOpen: ["one"],
      };
      for (const [component, rootClass] of [
        [Accordion, "krds-accordion"],
        [AccordionLine, "krds-accordion type-line"],
      ] as const) {
        const document = await render(component, accordionProps);
        const root = document.querySelector<HTMLElement>(".krds-accordion");
        expect(root?.className).toBe(rootClass);
        expect(
          Array.from(root?.querySelectorAll<HTMLElement>(".accordion-item") ?? []).map(
            (item) => item.className,
          ),
        ).toEqual(["accordion-item active", "accordion-item"]);
        expect(
          Array.from(root?.querySelectorAll<HTMLButtonElement>(".btn-accordion") ?? []).map(
            (button) => ({
              className: button.className,
              expanded: button.getAttribute("aria-expanded"),
            }),
          ),
        ).toEqual([
          { className: "btn-accordion active", expanded: "true" },
          { className: "btn-accordion", expanded: "false" },
        ]);
        expect(
          Array.from(root?.querySelectorAll<HTMLElement>(".accordion-collapse") ?? []).map(
            (panel) => ({
              className: panel.className,
              hidden: panel.hidden,
              role: panel.getAttribute("role"),
            }),
          ),
        ).toEqual([
          { className: "accordion-collapse collapse show", hidden: false, role: "region" },
          { className: "accordion-collapse collapse", hidden: true, role: "region" },
        ]);
      }

      const uploadDocument = await render(FileUpload, {
        rootAttributes: { id: "astro-runtime-upload" },
        inputId: "astro-runtime-file",
        name: "myFile",
        title: "타이틀영역",
        description: "컨텐츠 영역",
        prompt: "파일을 선택해주세요.",
        selectLabel: "파일선택",
        label: "파일 첨부",
      });
      const uploadRoot = uploadDocument.querySelector<HTMLElement>("#astro-runtime-upload");
      const uploadInput = uploadRoot?.querySelector<HTMLInputElement>('input[type="file"]');
      expect(uploadRoot?.className).toBe("krds-file-upload line");
      expect(uploadInput).toMatchObject({
        hidden: true,
        id: "astro-runtime-file",
        name: "myFile",
        type: "file",
      });
      expect(uploadInput?.hasAttribute("aria-label")).toBe(true);
      expect(uploadInput?.getAttribute("aria-label")).toBe("파일선택");
      const uploadButton = uploadRoot?.querySelector<HTMLButtonElement>(
        ".file-upload-btn-wrap > button",
      );
      expect(uploadButton?.previousElementSibling).toBe(uploadInput);
      expect(uploadButton?.className).toBe("krds-btn medium");
      expect(uploadRoot?.querySelector(".file-upload-btn-wrap > label")).toBeNull();

      const inPageDocument = await render(InPageNavigation, {
        title: "이 페이지의 구성",
        pageTitle: "장애아동수당",
        items: [{ id: "section_01", label: "서비스 개요", href: "#section_01", current: true }],
        actionLabel: "온라인 신청하기",
      });
      const currentSection = inPageDocument.querySelector<HTMLAnchorElement>(
        ".in-page-navigation-list a",
      );
      expect(currentSection?.className).toBe("active");
      expect(currentSection?.getAttribute("href")).toBe("#section_01");
      expect(currentSection?.hasAttribute("aria-current")).toBe(false);

      const languageDocument = await render(LanguageSwitcherPage, {
        label: "언어 변경",
        currentLabel: "현재 언어",
        selected: "ko",
        externalTitle: "새 창 열림",
        languages: [
          { value: "ko", label: "한국어", href: "#", lang: "ko" },
          { value: "en", label: "English (영어)", href: "#", lang: "en" },
        ],
      });
      const currentLanguage = languageDocument.querySelector<HTMLElement>(
        ".current-laguage > strong",
      );
      const externalLanguage =
        languageDocument.querySelector<HTMLAnchorElement>(".drop-list .item-link");
      expect(currentLanguage?.textContent).toBe("한국어");
      expect(currentLanguage?.hasAttribute("lang")).toBe(false);
      expect(externalLanguage?.getAttribute("lang")).toBe("en");
      expect(externalLanguage?.getAttribute("target")).toBe("_blank");
      expect(externalLanguage?.getAttribute("title")).toBe("새 창 열림");
      expect(externalLanguage?.querySelector(".sr-only")?.textContent).toBe("");

      const modalDocument = await render(ModalSample, {
        id: "astro-runtime-modal",
        open: true,
        title: "모달 제목",
        description: "모달 내용",
        cancelLabel: "아니요",
        confirmLabel: "예",
        closeLabel: "닫기",
      });
      const modal = modalDocument.querySelector<HTMLElement>("#astro-runtime-modal");
      const backdrop = modal?.querySelector<HTMLElement>(":scope > .modal-back");
      expect(modal?.className).toBe("krds-modal fade in shown");
      expect(modal?.hasAttribute("style")).toBe(false);
      expect(backdrop?.className).toBe("modal-back in");
      expect(backdrop?.hasAttribute("style")).toBe(false);

      const paginationDocument = await render(Pagination, {
        current: 4,
        items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
        previousDisabled: true,
        previousLabel: "이전",
        nextLabel: "다음",
        message: "현재페이지",
        navigationLabel: "페이지 이동",
      });
      const pagination = paginationDocument.querySelector<HTMLElement>(".krds-pagination");
      expect(pagination?.getAttribute("role")).toBe("navigation");
      expect(pagination?.getAttribute("aria-label")).toBe("페이지 이동");
      expect(pagination?.querySelector(".page-navi.prev.disabled")?.getAttribute("href")).toBe("#");
      expect(pagination?.querySelector(".page-link.active .sr-only")?.textContent?.trim()).toBe(
        "현재페이지",
      );

      const stepDocument = await render(StepIndicator, {
        current: 3,
        label: "단계",
        message: "현재단계",
        steps: Array.from({ length: 5 }, (_, index) => ({
          id: String(index + 1),
          label: "단계 레이블",
        })),
      });
      const stepItems = Array.from(
        stepDocument.querySelectorAll<HTMLElement>(".krds-step-wrap > li"),
      );
      expect(stepItems.map((item) => item.className)).toEqual([
        "done",
        "done",
        "done",
        "active",
        "",
      ]);
      expect(stepItems.every((item) => !item.hasAttribute("aria-current"))).toBe(true);
      expect(stepItems[3]?.querySelector(".sr-only")?.textContent).toBe("현재단계");

      const options = [
        { value: "", label: "항목1" },
        { value: "", label: "항목2" },
        { value: "", label: "항목3" },
        { value: "", label: "항목4" },
      ];
      const selectDocuments = [
        await render(Select, {
          id: "astro-runtime-select",
          label: "레이블",
          hint: "도움말",
          title: "선택",
          options,
        }),
        await render(SelectSize, {
          id: "astro-runtime-select-size",
          label: "레이블",
          hint: "도움말",
          title: "선택",
          size: "large",
          options: [
            { value: "", label: "large" },
            { value: "", label: "medium" },
            { value: "", label: "small" },
          ],
        }),
        await render(SelectState, {
          id: "astro-runtime-select-state",
          label: "레이블",
          hint: "도움말",
          title: "선택",
          state: "error",
          options,
        }),
      ] as const;
      for (const [index, document] of selectDocuments.entries()) {
        const id = [
          "astro-runtime-select",
          "astro-runtime-select-size",
          "astro-runtime-select-state",
        ][index]!;
        const select = document.querySelector<HTMLSelectElement>(`#${id}`);
        const group = select?.closest<HTMLElement>(".form-group");
        const hint = group?.querySelector<HTMLElement>(
          index === 2 ? ".form-hint-invalid" : ".form-hint",
        );
        expect(group?.querySelector("label")?.textContent).toBe("레이블");
        expect(hint?.textContent).toBe("도움말");
        expect(hint?.parentElement).toBe(group);
        expect(select?.getAttribute("aria-describedby")).toBe(hint?.id);
        expect(select?.title).toBe("선택");
      }
      expect(
        selectDocuments[1].querySelector<HTMLSelectElement>("#astro-runtime-select-size")
          ?.className,
      ).toBe("krds-form-select large");
      expect(
        selectDocuments[2]
          .querySelector<HTMLSelectElement>("#astro-runtime-select-state")
          ?.getAttribute("aria-invalid"),
      ).toBe("true");

      const inputStateDocument = await render(TextInputState, {
        id: "astro-runtime-input-state",
        label: "레이블",
        error: "에러 메시지",
        placeholder: "플레이스홀더",
        state: "error",
        type: "text",
        value: "에러",
      });
      const inputState = inputStateDocument.querySelector<HTMLInputElement>(
        "#astro-runtime-input-state",
      );
      const inputStateGroup = inputState?.closest<HTMLElement>(".form-group");
      const inputStateMessage = inputStateGroup?.querySelector<HTMLElement>(".form-hint-invalid");
      expect(inputStateGroup?.querySelector("label")?.textContent).toBe("레이블");
      expect(inputStateMessage?.textContent).toBe("에러 메시지");
      expect(inputStateMessage?.parentElement).toBe(inputStateGroup);
      expect(inputState?.getAttribute("aria-describedby")).toBe(inputStateMessage?.id);
      expect(inputState?.getAttribute("aria-invalid")).toBe("true");

      const textareaDocument = await render(Textarea, {
        id: "astro-runtime-textarea",
        label: "레이블",
        hint: "도움말",
        placeholder: "플레이스홀더",
      });
      const textarea =
        textareaDocument.querySelector<HTMLTextAreaElement>("#astro-runtime-textarea");
      expect(textarea?.getAttribute("aria-describedby")).toBe("astro-runtime-textarea-hint");
      expect(
        textareaDocument.querySelector('label[for="astro-runtime-textarea"]')?.textContent,
      ).toBe("레이블");
      expect(
        textareaDocument.querySelector("#astro-runtime-textarea-hint")?.textContent,
      ).toBe("도움말");
    } finally {
      doms.forEach((dom) => dom.window.close());
      await server.close();
    }
  });
});
