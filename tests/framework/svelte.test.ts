import { mount, tick, unmount, type Component } from "svelte";
import { afterEach, describe, expect, it } from "vitest";
import { createClassComponent } from "svelte/legacy";
import Accordion from "../../packages/svelte/src/Accordion.svelte";
import Additional from "../../packages/svelte/src/Additional.svelte";
import Checkbox from "../../packages/svelte/src/Checkbox.svelte";
import TextInput from "../../packages/svelte/src/TextInput.svelte";
import CoachMark from "../../packages/svelte/src/CoachMark.svelte";
import DateInput from "../../packages/svelte/src/DateInput.svelte";
import Identifier from "../../packages/svelte/src/Identifier.svelte";
import Spinner from "../../packages/svelte/src/Spinner.svelte";
import TextInputIcon from "../../packages/svelte/src/TextInputIcon.svelte";
import ReactiveForm from "./fixtures/ReactiveForm.svelte";
import {
  BadgeNumber,
  BadgeSize,
  CalendarRange,
  CarouselBanner,
  LanguageSwitcherPage,
  TooltipBox,
  TooltipVertical,
  TtsIcon,
  TtsSize,
} from "../../packages/svelte/src/index.js";

let mounted: Record<string, any> | undefined;
let host: HTMLDivElement;

function mountInHost(
  component: Component<Record<string, unknown>>,
  props: Record<string, unknown> = {},
) {
  if (mounted) unmount(mounted);
  host?.remove();
  host = document.createElement("div");
  document.body.append(host);
  mounted = mount(component, { target: host, props });
}

afterEach(() => {
  if (mounted) unmount(mounted);
  mounted = undefined;
  host?.remove();
});

describe("Svelte core component contracts", () => {
  it("keeps bindable parent state, native form state, derived count, and ARIA state reactive", async () => {
    mountInHost(ReactiveForm);
    const input = host.querySelector<HTMLInputElement>("#query")!;
    const checkbox = host.querySelector<HTMLInputElement>("#accepted")!;
    const update = Array.from(host.querySelectorAll("button")).find(
      (button) => button.textContent === "Parent update",
    )!;

    expect(input.value).toBe("one");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("query-hint");
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("3");
    expect(new FormData(host.querySelector("form")!).get("query")).toBe("one");

    input.value = "user input";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(input.value).toBe("user input");
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("10");
    expect(new FormData(host.querySelector("form")!).get("query")).toBe("user input");
    const select = host.querySelector<HTMLSelectElement>("#reactive-select")!;
    const sortingSelect = host.querySelector<HTMLSelectElement>("#reactive-sorting-select")!;
    expect(select.className).toBe("krds-form-select is-error consumer-select");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.hasAttribute("state")).toBe(false);
    expect(select.hasAttribute("kind")).toBe(false);
    expect(select.hasAttribute("options")).toBe(false);
    expect(sortingSelect.className).toBe("krds-form-select-sort is-error");
    expect(sortingSelect.getAttribute("aria-invalid")).toBe("true");

    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(host.querySelector(".krds-tab-area")?.className).toBe(
      "krds-tab-area layer consumer-tabs",
    );
    expect(tabs[0].closest("li")?.className).toBe("active");
    expect(tabs[1].closest("li")?.className).toBe("");
    expect(tabs[1].closest("li")?.hasAttribute("class")).toBe(false);

    checkbox.click();
    await tick();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(host.querySelector("form")!).get("accepted")).toBe("on");

    update.click();
    await tick();
    expect(input.value).toBe("updated");
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("7");
    expect(select.className).toBe("krds-form-select consumer-select");
    expect(select.classList.contains("is-error")).toBe(false);
    expect(select.getAttribute("aria-invalid")).toBeNull();
    expect(sortingSelect.className).toBe("krds-form-select-sort");
    expect(sortingSelect.classList.contains("is-error")).toBe(false);
    expect(sortingSelect.getAttribute("aria-invalid")).toBeNull();

    expect(tabs[0].textContent).toContain("First tab renamed");
    expect(tabs[1].textContent).toContain("Second tab renamed");
    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].closest("li")?.className).toBe("");
    expect(tabs[1].closest("li")?.className).toBe("active");
    expect(tabs[0].closest("li")?.hasAttribute("class")).toBe(false);
    expect(host.querySelector('[data-testid="selected-tab"]')?.textContent).toBe("second");
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toContain(
      "Second panel updated",
    );

    tabs[0].click();
    await tick();
    expect(host.querySelector('[data-testid="selected-tab"]')?.textContent).toBe("first");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].closest("li")?.className).toBe("active");
    expect(tabs[1].closest("li")?.className).toBe("");
    expect(tabs[1].closest("li")?.hasAttribute("class")).toBe(false);
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toContain(
      "First panel updated",
    );

    const firstTrigger = host.querySelector<HTMLButtonElement>("#krds-accordion-header-first")!;
    const firstPanel = host.querySelector<HTMLElement>("#krds-accordion-panel-first")!;
    expect(firstTrigger.getAttribute("aria-expanded")).toBe("false");
    firstTrigger.click();
    await tick();
    expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(firstPanel.hidden).toBe(false);
    expect(firstPanel.textContent).toBe("Updated content");

    host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await tick();
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe("updated");
  });

  it("supports uncontrolled native ownership and preserves initial value and ARIA state", async () => {
    mountInHost(Checkbox, { id: "uncontrolled", label: "Uncontrolled" });
    const checkbox = host.querySelector<HTMLInputElement>("#uncontrolled")!;
    expect(checkbox.checked).toBe(false);
    checkbox.click();
    expect(checkbox.checked).toBe(true);

    mountInHost(TextInput, {
      id: "initial-input",
      value: "server value",
      label: "Server field",
      hint: "Server hint",
      state: "error",
    });
    await tick();
    const input = host.querySelector<HTMLInputElement>("#initial-input")!;
    expect(input.value).toBe("server value");
    expect(input.getAttribute("value")).toBe("server value");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("initial-input-hint");
    expect(host.textContent).toContain("Server hint");
  });

  it("keeps uncontrolled accordion state local after user interaction", async () => {
    const items = [
      { id: "first", title: "First", content: "First content" },
      { id: "second", title: "Second", content: "Second content" },
    ];
    const openItems = ["first"];
    mountInHost(Accordion, { items, openItems });
    const trigger = host.querySelector<HTMLButtonElement>("#krds-accordion-header-first")!;
    const panel = host.querySelector<HTMLElement>("#krds-accordion-panel-first")!;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.textContent).toBe("First content");

    trigger.click();
    await tick();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(true);
  });

  it("synchronizes upstream active classes for default and line accordion state", async () => {
    for (const kind of [undefined, "accordion-line"]) {
      mountInHost(Accordion, {
        kind,
        items: [{ id: "first", title: "First", content: "First content" }],
      });
      const root = host.querySelector<HTMLElement>(".krds-accordion")!;
      const item = host.querySelector<HTMLElement>(".accordion-item")!;
      const trigger = host.querySelector<HTMLButtonElement>(".btn-accordion")!;
      const panel = host.querySelector<HTMLElement>(".accordion-collapse")!;

      expect(root.classList.contains("type-line")).toBe(kind === "accordion-line");
      expect(item.className).toBe("accordion-item");
      expect(trigger.className).toBe("btn-accordion");

      trigger.click();
      await tick();
      expect(item.classList.contains("active")).toBe(true);
      expect(trigger.classList.contains("active")).toBe(true);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(panel.hidden).toBe(false);
    }
  });

  it("renders the file picker as a sibling native button control", async () => {
    mountInHost(Additional, {
      kind: "file-upload",
      id: "file-upload-contract",
      inputId: "file-upload-input",
      title: "타이틀영역",
      prompt: "파일을 선택해주세요.",
      selectLabel: "파일선택",
      currentCount: 3,
      maxCount: 10,
      countSuffix: "개",
    });
    await tick();

    const input = host.querySelector<HTMLInputElement>("#file-upload-input")!;
    const button = host.querySelector<HTMLButtonElement>(".file-upload-btn-wrap > button")!;
    expect(button.previousElementSibling).toBe(input);
    expect(button.className).toBe("krds-btn medium");
    expect(button.querySelector(":scope > .svg-icon.ico-upload")).not.toBeNull();
    expect(button.textContent).toBe("파일선택");
    expect(input.hidden).toBe(true);
    let inputClicks = 0;
    input.addEventListener("click", () => inputClicks++);
    button.click();
    expect(inputClicks).toBe(1);
    expect(host.querySelector(".file-list .total .current")?.textContent).toBe("3개");
  });

  it("names the pagination landmark without leaking props or redundant current-page state", async () => {
    mountInHost(Additional, {
      kind: "pagination",
      current: 4,
      items: [1, 2, 3, 4, 5],
      message: "현재페이지",
      navigationLabel: "페이지 이동",
      previousDisabled: true,
      previousLabel: "이전",
      nextLabel: "다음",
    });
    await tick();

    const navigation = host.querySelector<HTMLElement>(".krds-pagination")!;
    const currentPage = navigation.querySelector<HTMLAnchorElement>(".page-link.active")!;
    expect(navigation.getAttribute("role")).toBe("navigation");
    expect(navigation.getAttribute("aria-label")).toBe("페이지 이동");
    expect(navigation.hasAttribute("navigationlabel")).toBe(false);
    expect(currentPage.getAttribute("aria-current")).toBeNull();
    expect(currentPage.textContent).toBe("현재페이지 4");
  });
  it("keeps help panel tabs as native tab controls without nested interactive roles", async () => {
    mountInHost(Additional, {
      kind: "help-panel",
      id: "svelte-help",
      open: true,
      activeTab: "help",
      tabs: [
        { id: "help-tab", label: "Help", panelId: "help-panel" },
        { id: "tutorial-tab", label: "Tutorial", panelId: "tutorial-panel" },
      ],
    });
    await tick();

    const drawer = host.querySelector<HTMLElement>(".krds-help-panel")!;
    expect(Array.from(drawer.classList)).toEqual(["krds-help-panel", "expand"]);
    expect(
      drawer.querySelector(":scope > .help-panel-wrap > .help-conts-area > .krds-tab-area"),
    ).not.toBeNull();
    expect(drawer.querySelector(".help-panel-wrap")?.getAttribute("tabindex")).toBe("0");
    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === "BUTTON")).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(host.querySelectorAll('li[role="presentation"]')).toHaveLength(2);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["0", "-1"]);
    const panels = host.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels[0].getAttribute("aria-labelledby")).toBe("help-tab");
    expect(panels[0].hidden).toBe(false);
    tabs[1].click();
    await tick();
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["-1", "0"]);
  });
  it("renders structured-list date labels from component props", async () => {
    mountInHost(Additional, {
      kind: "structured-list",
      dateLabel: "신청 기간",
      dateValue: "2023.00.00-2024.00.00",
      items: [{ title: "타이틀 영역", href: "#" }],
    });
    await tick();

    expect(host.querySelector(".c-date .key")?.textContent).toBe("신청 기간");
    expect(host.querySelector(".c-date .value")?.textContent).toBe("2023.00.00-2024.00.00");
  });

  it("preserves one collapsed space between structured-list icons and labels", async () => {
    mountInHost(Additional, {
      kind: "structured-list",
      items: [{ title: "타이틀 영역", href: "#" }],
      shareLabel: "공유하기",
      favoriteLabel: "찜하기",
    });
    await tick();
    expect(
      Array.from(
        host.querySelectorAll<HTMLButtonElement>(".card-btn button"),
        (button) => button.textContent,
      ),
    ).toEqual([" 공유하기", " 찜하기"]);

    mountInHost(Additional, {
      kind: "structured-list-table",
      id: "structured-spacing",
      actions: [{ label: "핵심버튼", icon: "down" }],
      columns: [{ key: "download", label: "다운로드" }],
      rows: [{ download: "다운로드" }],
    });
    await tick();
    expect(host.querySelector(".side-line-ul button")?.textContent).toBe(" 핵심버튼");
    expect(host.querySelector("tbody button")?.textContent).toBe(" 다운로드");
  });

  it("renders text-input-icon in the pinned form and eye-button context", async () => {
    mountInHost(Additional, {
      kind: "text-input-icon",
      id: "password-field",
      label: "레이블",
      type: "password",
      value: "1234567890",
      placeholder: "8-12자의 영문자, 숫자, 특수문자 조합",
    });
    await tick();

    const root = host.querySelector<HTMLElement>(".form-group")!;
    const input = root.querySelector<HTMLInputElement>(
      ":scope > .form-conts.btn-ico-wrap > input.krds-input",
    )!;
    const button = root.querySelector<HTMLButtonElement>(
      ":scope > .form-conts.btn-ico-wrap > button.krds-btn.medium.icon",
    )!;
    expect(root.querySelector<HTMLLabelElement>(":scope > .form-tit > label")?.htmlFor).toBe(
      input.id,
    );
    expect(input.type).toBe("password");
    expect(input.value).toBe("1234567890");
    expect(button.type).toBe("button");
    expect(button.previousElementSibling).toBe(input);
    expect(button.querySelector(".sr-only")?.textContent).toBe("입력한 비밀번호 보기");
    expect(button.querySelector("i")?.className).toBe("svg-icon ico-pw-visible");
  });
  it("passes explicit accessibility labels and spinner fixture text through Svelte props", async () => {
    mountInHost(CoachMark, {
      open: true,
      step: "2/5",
      currentStepLabel: "Current step",
      totalStepsLabel: "Total steps",
    });
    await tick();
    const coachLabels = Array.from(
      host.querySelectorAll(".num .sr-only"),
      (node) => node.textContent,
    );
    expect(coachLabels).toEqual(["Current step", "Total steps"]);

    mountInHost(DateInput, { id: "date-prop", calendarOpenLabel: "Open date" });
    await tick();
    expect(host.querySelector(".form-btn-datepicker .sr-only")?.textContent).toBe("Open date");

    mountInHost(TextInputIcon, {
      id: "password-prop",
      type: "password",
      passwordLabel: "Show password",
    });
    await tick();
    expect(host.querySelector(".btn-ico-wrap .sr-only")?.textContent).toBe("Show password");

    mountInHost(Identifier, { organization: "Example organization" });
    await tick();
    expect(host.querySelector(".logo .sr-only")?.textContent).toBe("Example organization");

    mountInHost(Spinner, {
      id: "spinner-prop",
      inputLabel: "Input label",
      label: "Loading label",
      placeholder: "Loading placeholder",
    });
    await tick();
    expect(host.querySelector(".form-tit label")?.textContent).toBe("Input label");
    expect(host.querySelector<HTMLInputElement>(".form-spinner input")?.placeholder).toBe(
      "Loading placeholder",
    );
    expect(host.querySelector(".krds-spinner .sr-only")?.textContent).toBe("Loading label");
    mountInHost(Additional, {
      kind: "coach-mark",
      open: true,
      currentStepLabel: "Fixture current",
      totalStepsLabel: "Fixture total",
    });
    await tick();
    expect(Array.from(host.querySelectorAll(".num .sr-only"), (node) => node.textContent)).toEqual([
      "Fixture current",
      "Fixture total",
    ]);

    mountInHost(Additional, { kind: "identifier", organization: "Fixture organization" });
    await tick();
    expect(host.querySelector(".logo .sr-only")?.textContent).toBe("Fixture organization");
  });

  it("preserves native node identity, listener, and edited value across Svelte prop updates", async () => {
    host = document.createElement("div");
    document.body.append(host);
    const instance = createClassComponent({
      component: TextInputIcon,
      target: host,
      props: { id: "stable-input", value: "initial", type: "password" },
    });
    await tick();
    const input = host.querySelector<HTMLInputElement>("#stable-input")!;
    let events = 0;
    input.addEventListener("input", () => events++);
    input.value = "edited";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    instance.$set({ placeholder: "updated" });
    await tick();
    expect(host.querySelector("#stable-input")).toBe(input);
    expect(input.value).toBe("edited");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(events).toBe(2);
    instance.$destroy();
  });

  it("skips initial modal autofocus, then traps focus and restores it on later transitions", async () => {
    const trigger = document.createElement("button");
    trigger.type = "button";
    document.body.append(trigger);
    trigger.focus();
    host = document.createElement("div");
    document.body.append(host);
    const instance = createClassComponent({
      component: Additional,
      target: host,
      props: {
        kind: "modal",
        id: "modal-focus",
        open: true,
        title: "모달 제목",
        cancelLabel: "아니요",
        confirmLabel: "예",
        closeLabel: "닫기",
      },
    });

    try {
      await tick();
      await Promise.resolve();
      const firstModalControl = host.querySelector<HTMLButtonElement>(".krds-modal button")!;
      expect(document.activeElement).toBe(trigger);

      instance.$set({ open: false });
      await tick();
      trigger.focus();
      instance.$set({ open: true });
      await tick();
      await Promise.resolve();
      expect(document.activeElement).toBe(firstModalControl);
      const modalControls = Array.from(
        host.querySelectorAll<HTMLButtonElement>(".krds-modal button"),
      );
      const lastModalControl = modalControls[modalControls.length - 1];
      lastModalControl.focus();
      const forwardTab = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      lastModalControl.dispatchEvent(forwardTab);
      expect(forwardTab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(firstModalControl);

      const backwardTab = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      firstModalControl.dispatchEvent(backwardTab);
      expect(backwardTab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(lastModalControl);

      instance.$set({ open: false });
      await tick();
      expect(document.activeElement).toBe(trigger);
    } finally {
      instance.$destroy();
      trigger.remove();
    }
  });

  it("matches native calendar, date-input, disclosure, table, and tab semantics", async () => {
    mountInHost(Additional, {
      kind: "calendar",
      id: "calendar-contract",
      displayYear: 2024,
      displayMonth: 12,
      disabledDays: [3],
      dayCount: 31,
    });
    await tick();
    expect(
      host.querySelector<HTMLButtonElement>(".btn-set-date[disabled]")?.getAttribute("disabled"),
    ).toBe("");

    mountInHost(Additional, {
      kind: "date-input",
      id: "date-contract",
      label: "레이블",
      hint: "도움말",
      calendarLabel: "달력",
    });
    await tick();
    const dateRoot = host.querySelector<HTMLElement>(".form-group")!;
    expect(
      dateRoot.querySelector(":scope > .form-conts > .form-conts.calendar-conts"),
    ).not.toBeNull();
    expect(dateRoot.querySelector(".form-hint")?.textContent).toBe("도움말");
    expect(dateRoot.querySelector(".form-btn-datepicker")?.textContent).toContain("달력 열기");
    const dateInput = dateRoot.querySelector<HTMLInputElement>(".krds-input.datepicker")!;
    const dateCalendar = dateRoot.querySelector<HTMLElement>(".calendar-wrap")!;
    expect(dateInput.hasAttribute("title")).toBe(false);
    expect(dateCalendar.getAttribute("tabindex")).toBe("0");
    dateInput.focus();
    await tick();
    expect(dateCalendar.getAttribute("tabindex")).toBe("0");

    mountInHost(Additional, {
      kind: "disclosure",
      id: "disclosure-contract",
      title: "신청 서비스안내",
      open: false,
      items: [{ title: "항목" }],
    });
    await tick();
    const disclosureTrigger = host.querySelector<HTMLButtonElement>(".btn-conts-expand")!;
    const disclosurePanel = host.querySelector<HTMLElement>(".expand-wrap")!;
    expect(disclosureTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(disclosurePanel.getAttribute("role")).toBe("region");
    expect(disclosurePanel.getAttribute("aria-labelledby")).toBe(disclosureTrigger.id);
    expect(disclosureTrigger.getAttribute("aria-controls")).toBe(disclosurePanel.id);
    expect(disclosurePanel.hasAttribute("inert")).toBe(true);
    expect(disclosurePanel.hasAttribute("hidden")).toBe(false);
    const disclosureList = disclosurePanel.querySelector<HTMLUListElement>(".krds-info-list")!;
    expect(disclosureList.getAttribute("role")).toBe("list");
    expect(disclosureList.querySelector("li")?.getAttribute("role")).toBe("listitem");

    mountInHost(Additional, {
      kind: "structured-list-table",
      id: "table-contract",
      className: "sample",
      selectAllLabel: "전체선택",
      actions: [{ label: "핵심버튼", icon: "down" }],
      countLabel: "목록 표시 개수",
      countOptions: ["10개"],
      sortLabel: "정렬기준",
      sortOptions: ["관련도순"],
      sortValue: "관련도순",
      columns: [
        { key: "selected", label: "선택" },
        { key: "title", label: "제목" },
        { key: "download", label: "다운로드", visuallyHidden: true },
      ],
      rows: [{ selected: false, title: "타이틀 영역", download: "다운로드" }],
      pagination: {
        current: 1,
        items: [1],
        previousDisabled: true,
        previousLabel: "이전",
        nextLabel: "다음",
      },
    });
    await tick();
    const tableRoot = host.querySelector<HTMLElement>(".krds-structured-list-table")!;
    expect(tableRoot.firstElementChild?.classList.contains("search-list-top")).toBe(true);
    expect(tableRoot.querySelector(".krds-table-wrap table")).not.toBeNull();
    expect(tableRoot.querySelector(".krds-pagination")).not.toBeNull();
    expect(tableRoot.querySelectorAll("colgroup col")).toHaveLength(4);
    expect(tableRoot.hasAttribute("columns")).toBe(false);

    mountInHost(Additional, {
      kind: "tab",
      id: "tab-contract",
      panelTitle: "탭 영역 타이틀",
      tabs: [
        { id: "one", label: "탭 1" },
        { id: "two", label: "탭 2" },
      ],
      panels: { one: "탭 1 영역", two: "탭 2 영역" },
      defaultValue: "one",
    });
    await tick();
    expect(host.querySelector('[role="tabpanel"] h3')?.textContent).toBe("탭 영역 타이틀");
    expect(host.querySelectorAll('button[role="tab"]')).toHaveLength(2);
    expect(host.querySelectorAll('li[role="presentation"]')).toHaveLength(2);
    expect(host.querySelector('[role="tabpanel"]')?.getAttribute("data-quick-nav")).toBe("false");
    expect(host.querySelector('[role="tabpanel"]')?.hasAttribute("tabindex")).toBe(false);
  });

  it("gives table row checkboxes unique names without duplicating visible text", async () => {
    mountInHost(Additional, {
      kind: "structured-list-table",
      id: "table-checkbox-names",
      selectAllLabel: "전체선택",
      columns: [
        { key: "selected", label: "선택" },
        { key: "name", label: "이름" },
      ],
      rows: [
        {
          selected: false,
          selectionLabel: "서비스 선택",
          name: "서비스",
        },
        {
          selected: false,
          selectionLabel: "계정 선택",
          name: "계정",
        },
      ],
      caption: "서비스 목록",
    });
    await tick();

    const masterCheckbox = host.querySelector<HTMLInputElement>(".krds-check-area input")!;
    expect(masterCheckbox.labels?.[0]?.textContent).toBe("전체선택");
    const checkboxes = Array.from(
      host.querySelectorAll<HTMLInputElement>('.krds-table-wrap input[type="checkbox"]'),
    );
    const accessibleNames = checkboxes.map((checkbox) => checkbox.getAttribute("aria-label"));
    expect(accessibleNames).toEqual(["서비스 선택", "계정 선택"]);
    expect(new Set(accessibleNames).size).toBe(checkboxes.length);
    expect(checkboxes.map((checkbox) => checkbox.labels?.[0]?.textContent)).toEqual(["", ""]);
    expect(host.querySelector(".krds-table-wrap .sr-only")).toBeNull();
    expect(host.querySelector(".krds-table-wrap")?.textContent).not.toContain("서비스 선택");
    expect(host.querySelector(".krds-table-wrap")?.textContent).not.toContain("계정 선택");
  });

  it("keeps tag and tag-link controls inside their upstream size scope", async () => {
    mountInHost(Additional, {
      kind: "tag",
      label: "태그",
      removable: true,
      message: "삭제",
    });
    await tick();
    const tagWrap = host.querySelector<HTMLElement>(".krds-tag-wrap")!;
    expect(tagWrap.className).toBe("krds-tag-wrap large");
    expect(tagWrap.querySelector(":scope > span.krds-btn-tag > button.btn-delete")).not.toBeNull();

    mountInHost(Additional, {
      kind: "tag-link",
      label: "태그 링크",
      href: "#tag",
      size: "small",
    });
    await tick();
    const linkWrap = host.querySelector<HTMLElement>(".krds-tag-wrap")!;
    expect(linkWrap.className).toBe("krds-tag-wrap small");
    expect(linkWrap.querySelector(":scope > a.krds-btn-tag.link")?.getAttribute("href")).toBe(
      "#tag",
    );
  });

  it("renders spinner and in-page navigation within their upstream style contexts", async () => {
    mountInHost(Additional, {
      kind: "spinner",
      id: "spinner-context",
      label: "로딩 중",
    });
    await tick();
    const spinner = host.querySelector<HTMLElement>(".krds-spinner")!;
    const spinnerContext = spinner.parentElement!;
    expect(spinnerContext.className).toBe("form-spinner");
    expect(spinnerContext.querySelector(":scope > input.krds-input")).not.toBeNull();
    expect(spinner.closest(".form-group > .form-conts > .form-spinner")).toBe(spinnerContext);

    mountInHost(Additional, {
      kind: "in-page-navigation",
      title: "이 페이지의 구성",
      pageTitle: "페이지",
      items: [{ label: "첫 영역", href: "#first", current: true }],
      actionLabel: "신청",
    });
    await tick();
    const navigation = host.querySelector<HTMLElement>(".krds-in-page-navigation-area")!;
    expect(navigation.parentElement?.className).toBe("krds-in-page-navigation-type");
    expect(navigation.querySelector(".in-page-navigation-list a.active")?.textContent).toBe(
      "첫 영역",
    );
  });

  it("renders radio-size as the upstream medium and large composite", async () => {
    mountInHost(Additional, {
      kind: "radio-size",
      id: "radio-medium",
      name: "radio-size",
      size: "medium",
      label: "사이즈 : medium",
    });
    await tick();

    const area = host.querySelector<HTMLElement>(".krds-check-area")!;
    const controls = Array.from(area.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(Array.from(area.children, (child) => Array.from(child.classList).join(" "))).toEqual([
      "krds-form-check medium",
      "krds-form-check large",
    ]);
    expect(controls).toHaveLength(2);
    expect(controls.map((control) => control.name)).toEqual(["radio-size", "radio-size"]);
    expect(area.querySelector('label[for="radio-medium-large"]')?.textContent).toBe(
      "사이즈 : large",
    );
  });

  it("preserves literal separators at inline label and icon boundaries", async () => {
    mountInHost(Additional, {
      kind: "tooltip",
      id: "tooltip-boundary",
      label: "tooltip-horizontal",
      message: "도움말",
    });
    await tick();
    expect(host.querySelector("button.krds-tooltip")?.textContent).toBe("tooltip-horizontal ");

    mountInHost(Additional, {
      kind: "language-switcher",
      label: "언어 변경",
    });
    await tick();
    expect(host.querySelector("button.drop-btn")?.textContent).toBe(" 언어 변경 ");

    mountInHost(Additional, {
      kind: "link",
      label: "기본 링크",
      href: "#link",
      target: "_blank",
    });
    await tick();
    expect(host.querySelector("a.krds-btn.link")?.textContent).toBe("기본 링크 ");

    mountInHost(Additional, {
      kind: "tts",
      label: "레이블",
    });
    await tick();
    expect(host.querySelector("button.krds-tts")?.textContent).toBe(" 레이블");
  });

  it("keeps the tutorial variant on the expanded KRDS drawer shell", async () => {
    mountInHost(Additional, {
      kind: "tutorial-panel",
      id: "svelte-tutorial",
      open: true,
      tabs: [
        { id: "help-tab", label: "도움", panelId: "help-panel" },
        { id: "tutorial-tab", label: "따라하기", panelId: "tutorial-panel" },
      ],
      tutorialTitle: "이사 전 살던 곳 정보 입력하기",
      tasks: [
        {
          title: "Task 1",
          current: true,
          summary: "전체 2단계",
          steps: ["단계 1", "단계 2"],
        },
        {
          title: "Task 2",
          summary: "전체 1단계",
          steps: ["단계 1"],
        },
      ],
    });
    await tick();

    const drawer = host.querySelector<HTMLElement>(".krds-help-panel")!;
    expect(Array.from(drawer.classList)).toEqual(["krds-help-panel", "expand"]);
    expect(drawer.querySelector(":scope > .help-panel-wrap > .help-conts-area")).not.toBeNull();
    expect(drawer.querySelector(".help-panel-wrap")?.getAttribute("tabindex")).toBe("0");
    expect(
      drawer.querySelector<HTMLButtonElement>("#tutorial-tab")?.getAttribute("aria-selected"),
    ).toBe("true");
    const panelTabs = Array.from(drawer.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(panelTabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["-1", "0"]);
    expect(
      drawer
        .querySelector<HTMLAnchorElement>("#tutorial-panel .help-title a")
        ?.getAttribute("href"),
    ).toBe("#;");

    const taskDisclosures = Array.from(
      drawer.querySelectorAll<HTMLElement>(".coach-help-process .krds-disclosure"),
    );
    expect(taskDisclosures).toHaveLength(2);
    taskDisclosures.forEach((taskDisclosure, index) => {
      const trigger = taskDisclosure.querySelector<HTMLButtonElement>(".btn-conts-expand")!;
      const region = taskDisclosure.querySelector<HTMLElement>(".expand-wrap")!;
      const regionId = `svelte-tutorial-help-disclosure-${index}`;
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(trigger.getAttribute("aria-controls")).toBe(regionId);
      expect(region.id).toBe(regionId);
      expect(region.hasAttribute("inert")).toBe(true);
      expect(region.hasAttribute("hidden")).toBe(false);
      expect(region.hasAttribute("aria-hidden")).toBe(false);
      expect(region.querySelector(".krds-info-list")?.getAttribute("role")).toBe("list");
      expect(
        Array.from(region.querySelectorAll("li")).map((item) => item.getAttribute("role")),
      ).toEqual(Array.from(region.querySelectorAll("li"), () => "listitem"));
    });
  });

  it("keeps standalone main-menu samples literal", async () => {
    const desktopItems = [
      {
        id: "sample-top",
        label: "1Depth",
        active: true,
        children: [
          {
            id: "sample-sub",
            label: "2Depth",
            active: true,
            title: "2Depth title",
            children: [{ id: "sample-leaf", label: "Last depth", href: "#" }],
          },
        ],
      },
    ];
    mountInHost(Additional, {
      kind: "main-menu-pc",
      id: "sample-desktop",
      sample: true,
      menuLabel: "메인 메뉴",
      items: desktopItems,
    });
    await tick();

    const sampleDesktop = host.querySelector<HTMLElement>(".krds-main-menu")!;
    const sampleMain = sampleDesktop.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const sampleMainPanel = sampleMain.nextElementSibling as HTMLElement;
    const sampleSub = sampleDesktop.querySelector<HTMLButtonElement>(".gnb-sub-trigger")!;
    const sampleSubPanel = sampleSub.nextElementSibling as HTMLElement;
    expect(sampleDesktop.classList.contains("sample")).toBe(true);
    expect(sampleDesktop.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBeNull();
    expect([
      sampleMain.getAttribute("aria-controls"),
      sampleMain.getAttribute("aria-expanded"),
      sampleMain.getAttribute("aria-haspopup"),
      sampleSub.getAttribute("aria-controls"),
      sampleSub.getAttribute("aria-expanded"),
      sampleSub.getAttribute("aria-haspopup"),
    ]).toEqual([null, null, null, null, null, null]);
    expect(sampleMainPanel.hasAttribute("id")).toBe(false);
    expect(sampleSubPanel.hasAttribute("id")).toBe(false);
    expect(sampleMain.classList.contains("active")).toBe(true);
    expect(sampleSub.classList.contains("active")).toBe(true);

    const mobileItems = [
      {
        id: "sample-mobile-panel",
        label: "1Depth",
        children: [
          {
            id: "sample-mobile-depth-2",
            label: "2Depth",
            href: "#",
            children: [{ id: "sample-mobile-depth-3", label: "3Depth", href: "#" }],
          },
        ],
      },
    ];
    mountInHost(Additional, {
      kind: "main-menu-mobile",
      id: "sample-mobile",
      sample: true,
      searchLabel: "검색",
      searchTitle: "찾고자 하는 메뉴명 입력",
      items: mobileItems,
    });
    await tick();

    const sampleMobile = host.querySelector<HTMLElement>(".krds-main-menu-mobile")!;
    const sampleSearch = sampleMobile.querySelector<HTMLInputElement>(".sch-input input")!;
    const sampleTabList = sampleMobile.querySelector<HTMLElement>(".menu-wrap > ul")!;
    const sampleTab = sampleTabList.querySelector<HTMLAnchorElement>(".gnb-main-trigger")!;
    const samplePanel = sampleMobile.querySelector<HTMLElement>(".gnb-sub-list")!;
    const sampleDepth3 = sampleMobile.querySelector<HTMLAnchorElement>(".has-depth3")!;
    expect(sampleMobile.classList.contains("sample")).toBe(true);
    expect(sampleMobile.getAttribute("style")).toBe(
      "display: block; position: static; visibility: visible;",
    );
    expect(sampleSearch.closest(".sch-input")?.getAttribute("role")).toBeNull();
    expect(sampleSearch.getAttribute("aria-label")).toBeNull();
    expect(sampleSearch.getAttribute("title")).toBe("찾고자 하는 메뉴명 입력");
    expect(sampleTabList.getAttribute("role")).toBeNull();
    expect([
      sampleTab.closest("li")?.getAttribute("role"),
      sampleTab.getAttribute("id"),
      sampleTab.getAttribute("role"),
      sampleTab.getAttribute("aria-selected"),
      sampleTab.getAttribute("aria-controls"),
      samplePanel.getAttribute("role"),
      samplePanel.getAttribute("aria-labelledby"),
      sampleDepth3.getAttribute("aria-expanded"),
    ]).toEqual([null, null, null, null, null, null, null, null]);
    expect(sampleTab.classList.contains("active")).toBe(false);
    expect(sampleMobile.querySelector("#close-nav")).not.toBeNull();
  });

  it("renders initialized desktop and mobile navigation semantics inside the header", async () => {
    const utilityItems = [
      {
        id: "utility-menu",
        kind: "dropdown",
        label: "메뉴명",
        items: [
          { id: "utility-option-1", label: "메뉴명", href: "#" },
          { id: "utility-option-2", label: "메뉴명", href: "#" },
        ],
      },
      {
        id: "utility-external",
        kind: "dropdown",
        label: "메뉴명",
        items: Array.from({ length: 3 }, (_, index) => ({
          id: `utility-external-${index}`,
          label: "메뉴명",
          href: "#",
          target: "_blank",
          className: "ico-go",
        })),
      },
    ];
    const desktopItems = [
      {
        id: "embedded-top",
        label: "1Depth",
        children: [
          {
            id: "embedded-sub-1",
            label: "2Depth",
            title: "첫 번째 메뉴",
            children: [{ id: "embedded-leaf-1", label: "Last depth", href: "#" }],
          },
          {
            id: "embedded-sub-2",
            label: "2Depth",
            title: "두 번째 메뉴",
            children: [{ id: "embedded-leaf-2", label: "Last depth", href: "#" }],
          },
        ],
      },
    ];
    const mobileItems = [
      {
        id: "embedded-mobile-panel-1",
        label: "1Depth",
        children: [
          {
            id: "embedded-mobile-depth-2",
            label: "2Depth",
            href: "#",
            children: [{ id: "embedded-mobile-depth-3", label: "3Depth", href: "#" }],
          },
        ],
      },
      {
        id: "embedded-mobile-panel-2",
        label: "1Depth",
        children: [{ id: "embedded-mobile-leaf", label: "2Depth", href: "#" }],
      },
    ];
    mountInHost(Additional, {
      kind: "header",
      id: "embedded-header",
      menuLabel: "메인 메뉴",
      utilityItems,
      myMenu: {
        label: "나의 GOV",
        items: Array.from({ length: 4 }, (_, index) => ({
          id: `my-menu-${index}`,
          label: `나의 메뉴 ${index + 1}`,
          href: "#",
        })),
      },
      desktopItems,
      mobileMenu: {
        searchLabel: "검색",
        searchTitle: "찾고자 하는 메뉴명 입력",
        items: mobileItems,
        closeLabel: "전체메뉴 닫기",
      },
    });
    await tick();

    const desktop = host.querySelector<HTMLElement>("header > .header-in .krds-main-menu")!;
    const mainTrigger = desktop.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const mainPanel = mainTrigger.nextElementSibling as HTMLElement;
    const subTriggers = Array.from(
      desktop.querySelectorAll<HTMLButtonElement>(".gnb-sub-trigger:not(.is-link)"),
    );
    expect(desktop.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBe("메인 메뉴");
    expect(mainTrigger.getAttribute("aria-controls")).toBe("embedded-header-desktop-main-0");
    expect(mainTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(mainTrigger.getAttribute("aria-haspopup")).toBe("true");
    expect(mainPanel.id).toBe("embedded-header-desktop-main-0");
    expect(subTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
      "true",
      "false",
    ]);
    expect(subTriggers.map((trigger) => trigger.getAttribute("aria-haspopup"))).toEqual([
      "true",
      "true",
    ]);
    expect(subTriggers.map((trigger) => trigger.classList.contains("active"))).toEqual([
      true,
      false,
    ]);
    subTriggers.forEach((trigger, index) => {
      const panelId = `embedded-header-desktop-sub-0-${index}`;
      expect(trigger.getAttribute("aria-controls")).toBe(panelId);
      expect((trigger.nextElementSibling as HTMLElement).id).toBe(panelId);
      expect((trigger.nextElementSibling as HTMLElement).classList.contains("active")).toBe(
        index === 0,
      );
    });
    expect(host.querySelector(".my-drop > .drop-btn")?.getAttribute("aria-expanded")).toBe("false");
    expect(host.querySelectorAll(".item-link > .sr-only")).toHaveLength(9);

    const embeddedMobile = host.querySelector<HTMLElement>("header > .krds-main-menu-mobile")!;
    const embeddedSearch = embeddedMobile.querySelector<HTMLInputElement>(".sch-input input")!;
    const tabList = embeddedMobile.querySelector<HTMLElement>(".menu-wrap > ul")!;
    const tabItems = Array.from(tabList.querySelectorAll<HTMLLIElement>(":scope > li"));
    const tabs = Array.from(tabList.querySelectorAll<HTMLAnchorElement>(".gnb-main-trigger"));
    const panels = Array.from(
      embeddedMobile.querySelectorAll<HTMLElement>(".submenu-wrap > .gnb-sub-list"),
    );
    expect(embeddedMobile.style.display).toBe("none");
    expect(embeddedSearch.closest(".sch-input")?.getAttribute("role")).toBeNull();
    expect(embeddedSearch.getAttribute("aria-label")).toBe("검색");
    expect(embeddedSearch.getAttribute("title")).toBe("찾고자 하는 메뉴명 입력");
    expect(tabList.getAttribute("role")).toBe("tablist");
    expect(tabItems.map((item) => item.getAttribute("role"))).toEqual(["none", "none"]);
    expect(tabs.map((tab) => tab.id)).toEqual([
      "embedded-header-mobile-tab-0",
      "embedded-header-mobile-tab-1",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("role"))).toEqual(["tab", "tab"]);
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["true", "false"]);
    expect(tabs.map((tab) => tab.classList.contains("active"))).toEqual([true, false]);
    panels.forEach((panel, index) => {
      expect(panel.getAttribute("role")).toBe("tabpanel");
      expect(panel.getAttribute("aria-labelledby")).toBe(tabs[index].id);
      expect(tabs[index].getAttribute("aria-controls")).toBe(panel.id);
    });
    expect(
      embeddedMobile.querySelector(".gnb-sub-trigger.has-depth3")?.getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("renders explicit variant exports with their own props and markup contracts", async () => {
    mountInHost(BadgeNumber, { label: "7" });
    expect(host.querySelector(".krds-badge")?.classList.contains("number")).toBe(true);

    mountInHost(BadgeSize, { label: "Large", size: "large" });
    expect(host.querySelector(".krds-badge")?.classList.contains("large")).toBe(true);

    mountInHost(CalendarRange, { displayYear: 2026, displayMonth: 8 });
    expect(host.querySelector(".krds-calendar-area .calendar-wrap:not(.single)")).not.toBeNull();

    mountInHost(CarouselBanner, {
      slides: [{ title: "Banner", description: "Description" }],
    });
    expect(host.querySelector(".main-d-ban-swiper")).not.toBeNull();
    expect(host.querySelector(".main-vban-wrap")).toBeNull();

    mountInHost(LanguageSwitcherPage, {
      languages: [
        { value: "ko", label: "한국어", href: "/ko" },
        { value: "en", label: "English", href: "/en" },
      ],
      selected: "ko",
      currentLabel: "현재 언어",
      externalTitle: "새 창 열림",
    });
    expect(host.querySelector(".current-laguage")?.textContent).toContain("한국어");
    expect(host.querySelectorAll(".drop-list .item-link")).toHaveLength(1);
    expect(host.querySelector(".drop-list .item-link")?.querySelector(".ico-go")).not.toBeNull();
    expect(host.querySelector(".drop-list .item-link")?.getAttribute("target")).toBe("_blank");

    mountInHost(TooltipBox, { label: "Box", message: "Box help" });
    expect(host.querySelector(".krds-tooltip")?.classList.contains("tooltip-box")).toBe(true);
    mountInHost(TooltipVertical, { label: "Vertical", message: "Vertical help" });
    expect(host.querySelector(".krds-tooltip")?.classList.contains("tooltip-vertical")).toBe(true);

    mountInHost(TtsIcon, { label: "Listen" });
    expect(host.querySelector(".krds-tts-text")).toBeNull();
    expect(host.querySelector(".krds-tts")?.getAttribute("aria-label")).toBe("Listen");
    mountInHost(TtsSize, { label: "Small" });
    expect(host.querySelector(".krds-tts")?.classList.contains("xsmall")).toBe(true);
  });
});
