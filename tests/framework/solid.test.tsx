import { render } from "solid-js/web";
import { createSignal, type JSX } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";
import {
  Accordion,
  Calendar,
  CalendarRange,
  Carousel,
  Checkbox,
  ContextualHelp,
  DateInput,
  CriticalAlerts,
  FileUpload,
  Footer,
  Disclosure,
  Header,
  HelpPanel,
  InPageNavigation,
  LanguageSwitcher,
  LanguageSwitcherPage,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Modal,
  RadioSize,
  Resize,
  Select,
  SelectSorting,
  SelectSize,
  SelectState,
  Spinner,
  StructuredList,
  StructuredListTable,
  StepIndicator,
  Tab,
  Tag,
  TagLink,
  TextInput,
  TextInputIcon,
  TextList,
  Tooltip,
  Tts,
  TutorialPanel,
} from "@krds-community/solid";

let dispose: (() => void) | undefined;
let host: HTMLDivElement;

function mount(view: () => JSX.Element) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(view, host);
}

afterEach(() => {
  dispose?.();
  dispose = undefined;
  host?.remove();
});

describe("Solid core component contracts", () => {
  it("tracks signal props after mount and serializes native form state", async () => {
    const [value, setValue] = createSignal("one");
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    const [submitted, setSubmitted] = createSignal("");

    mount(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(new FormData(event.currentTarget).get("query")?.toString() ?? "");
        }}
      >
        <TextInput
          id="query"
          name="query"
          label="Query"
          hint="Required"
          state="error"
          value={value()}
        />
        <Checkbox
          id="accepted"
          name="accepted"
          label="Accept"
          checked={checked()}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled()}
        />
        <output data-testid="count">{value().length}</output>
        <output data-testid="submitted">{submitted()}</output>
        <button
          type="button"
          onClick={() => {
            setValue("updated");
            setDisabled(true);
          }}
        >
          Parent update
        </button>
        <button type="submit">Submit</button>
      </form>
    ));

    const input = host.querySelector<HTMLInputElement>("#query")!;
    const checkbox = host.querySelector<HTMLInputElement>("#accepted")!;
    const update = Array.from(host.querySelectorAll("button")).find(
      (button) => button.textContent === "Parent update",
    )!;

    expect(input.value).toBe("one");
    expect(input.getAttribute("value")).toBe("one");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("query-hint");
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("3");
    expect(new FormData(host.querySelector("form")!).get("query")).toBe("one");

    checkbox.click();
    expect(checkbox.checked).toBe(true);
    expect(new FormData(host.querySelector("form")!).get("accepted")).toBe("on");

    setValue("user input");
    expect(input.value).toBe("user input");
    expect(input.getAttribute("value")).toBe("user input");
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("10");

    update.click();
    expect(input.value).toBe("updated");
    expect(input.getAttribute("value")).toBe("updated");
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("7");

    host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe("updated");
  });

  it("keeps accordion expanded state and derived item content reactive", () => {
    const [items, setItems] = createSignal([
      { id: "first", title: "First", content: "First content" },
      { id: "second", title: "Second", content: "Second content" },
    ]);

    mount(() => <Accordion items={items()} defaultOpen={["first"]} />);
    const firstTrigger = () => host.querySelector<HTMLButtonElement>("button[aria-controls]")!;
    const firstPanel = () => host.querySelector<HTMLElement>('[role="region"]')!;
    const firstItem = () => firstTrigger().closest<HTMLElement>(".accordion-item")!;

    expect(firstTrigger().getAttribute("aria-expanded")).toBe("true");
    expect(firstPanel().hidden).toBe(false);
    expect(firstPanel().textContent).toBe("First content");
    expect(firstItem().classList.contains("active")).toBe(true);
    expect(firstTrigger().classList.contains("active")).toBe(true);

    firstTrigger().click();
    expect(firstTrigger().getAttribute("aria-expanded")).toBe("false");
    expect(firstPanel().hidden).toBe(true);
    expect(firstItem().classList.contains("active")).toBe(false);
    expect(firstTrigger().classList.contains("active")).toBe(false);

    setItems([
      { id: "first", title: "Renamed", content: "Updated content" },
      { id: "second", title: "Second", content: "Second content" },
    ]);
    expect(firstTrigger().textContent).toBe("Renamed");
    expect(firstPanel().textContent).toBe("Updated content");
    expect(firstTrigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps spread props live instead of snapshotting destructured core and additional values", () => {
    const [fieldProps, setFieldProps] = createSignal({
      id: "spread-query",
      name: "spread-query",
      label: "Before label",
      hint: "Before hint",
      state: "default" as "default" | "error",
      value: "before",
      disabled: false,
    });
    const [tabProps, setTabProps] = createSignal({
      id: "reactive-tabs",
      tabs: [
        { id: "first", label: "First" },
        { id: "second", label: "Second" },
      ],
      modelValue: "first",
      message: "selected",
    });
    const changes: string[] = [];
    const selectFirst = () => {
      changes.push("first");
      setTabProps((current) => ({ ...current, modelValue: "first" }));
    };

    mount(() => (
      <section>
        <TextInput {...fieldProps()} />
        <Tab {...tabProps()} onChange={selectFirst} />
      </section>
    ));

    const input = host.querySelector<HTMLInputElement>("#spread-query")!;
    const tabs = () => Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
    expect(input.value).toBe("before");
    expect(input.disabled).toBe(false);
    expect(host.querySelector('label[for="spread-query"]')?.textContent).toBe("Before label");
    expect(tabs()[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("false");

    setFieldProps((current) => ({
      ...current,
      label: "After label",
      hint: "After hint",
      state: "error",
      value: "after",
      disabled: true,
    }));
    setTabProps((current) => ({
      ...current,
      tabs: [
        { id: "first", label: "First renamed" },
        { id: "second", label: "Second renamed" },
      ],
      modelValue: "second",
      message: "selected now",
    }));

    expect(input.value).toBe("after");
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(host.querySelector('label[for="spread-query"]')?.textContent).toBe("After label");
    expect(host.querySelector("#spread-query-hint")?.textContent).toBe("After hint");
    expect(tabs().map((tab) => tab.textContent)).toEqual([
      "First renamed",
      "Second renamedselected now",
    ]);
    expect(tabs()[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");

    (tabs()[0] as HTMLButtonElement).click();
    expect(changes).toEqual(["first"]);
    expect(tabs()[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("false");
  });
  it("keeps Select and Tab recipe classes reactive", () => {
    const [selectSize, setSelectSize] = createSignal<"small" | "large">("small");
    const [selectState, setSelectState] = createSignal<"success" | "error">("success");
    const [activeTab, setActiveTab] = createSignal("first");

    mount(() => (
      <section>
        <SelectSize
          id="recipe-select"
          label="Recipe select"
          size={selectSize()}
          state={selectState()}
          class="consumer-select"
          options={[
            { label: "First", value: "first" },
            { label: "Second", value: "second" },
          ]}
        />
        <SelectState
          id="recipe-state-select"
          label="State recipe select"
          state={selectState()}
          options={[{ label: "First", value: "first" }]}
        />
        <Tab
          tabs={[
            { id: "first", label: "First" },
            { id: "second", label: "Second" },
          ]}
          panels={{ first: "First panel", second: "Second panel" }}
          modelValue={activeTab()}
          class="consumer-tabs"
        />
      </section>
    ));

    const select = host.querySelector<HTMLSelectElement>("#recipe-select")!;
    const stateSelect = host.querySelector<HTMLSelectElement>("#recipe-state-select")!;
    const tabRoot = host.querySelector<HTMLElement>(".krds-tab-area")!;
    const tabItems = () =>
      Array.from(tabRoot.querySelectorAll<HTMLLIElement>('li[role="presentation"]'));
    const tabTriggers = () =>
      Array.from(tabRoot.querySelectorAll<HTMLButtonElement>('button[role="tab"]'));

    expect(select.className).toBe("krds-form-select small is-success consumer-select");
    expect(stateSelect.className).toBe("krds-form-select is-success");
    expect(tabRoot.className).toBe("krds-tab-area layer consumer-tabs");
    expect(tabRoot.querySelector(":scope > .tab")?.className).toBe("tab line full");
    expect(tabItems().map((item) => item.className)).toEqual(["active", ""]);
    expect(tabTriggers().map((trigger) => trigger.className)).toEqual(["btn-tab", "btn-tab"]);
    expect(tabTriggers().map((trigger) => trigger.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
    ]);

    setSelectSize("large");
    setSelectState("error");
    setActiveTab("second");

    expect(select.className).toBe("krds-form-select large is-error consumer-select");
    expect(stateSelect.className).toBe("krds-form-select is-error");
    expect(tabItems().map((item) => item.className)).toEqual(["", "active"]);
    expect(tabTriggers().map((trigger) => trigger.getAttribute("aria-selected"))).toEqual([
      "false",
      "true",
    ]);
  });
  it("renders pinned select surfaces while preserving native form and event behavior", () => {
    const [value, setValue] = createSignal("second");
    const [disabled, setDisabled] = createSignal(false);
    const changes: string[] = [];
    let forwarded: HTMLElement | undefined;

    mount(() => (
      <form>
        <span id="external-description">External description</span>
        <Select
          id="solid-select"
          name="choice"
          label="Choice"
          title="Choose"
          hint="Hint"
          value={value()}
          disabled={disabled()}
          required
          class="consumer-select"
          aria-describedby="external-description"
          ref={(element) => {
            forwarded = element;
          }}
          onChange={(event) => {
            const next = (event.currentTarget as HTMLSelectElement).value;
            changes.push(next);
            setValue(next);
          }}
          options={[
            { label: "First", value: "first" },
            { label: "Second", value: "second" },
          ]}
        />
        <SelectSize
          id="size-select"
          name="size-choice"
          label="Size"
          title="Choose size"
          hint="Size hint"
          size="large"
          defaultValue="large"
          options={[
            { label: "Large", value: "large" },
            { label: "Medium", value: "medium" },
            { label: "Small", value: "small" },
          ]}
        />
        <SelectState
          id="state-select"
          name="state-choice"
          label="State"
          title="Choose state"
          error="State error"
          state="error"
          disabled
          options={[
            { label: "First", value: "first" },
            { label: "Second", value: "second" },
          ]}
        />
        <SelectSorting
          id="sorting-select"
          name="sort"
          title="Sort"
          defaultValue="newest"
          required
          class="consumer-sort"
          options={[
            { label: "Newest", value: "newest" },
            { label: "Oldest", value: "oldest" },
          ]}
        />
      </form>
    ));

    const form = host.querySelector("form")!;
    const select = host.querySelector<HTMLSelectElement>("#solid-select")!;
    const sizeSelect = host.querySelector<HTMLSelectElement>("#size-select")!;
    const stateSelect = host.querySelector<HTMLSelectElement>("#state-select")!;
    const sortingSelect = host.querySelector<HTMLSelectElement>("#sorting-select")!;

    expect(forwarded).toBe(select);
    for (const control of [select, sizeSelect, stateSelect]) {
      const group = control.closest<HTMLElement>(".form-group")!;
      expect(group.className).toBe("form-group");
      expect(group.querySelector(":scope > .form-tit > label")?.getAttribute("for")).toBe(
        control.id,
      );
      expect(control.parentElement?.className).toBe("form-conts");
      expect(group.querySelector(`:scope > p[id="${control.id}-hint"]`)).not.toBeNull();
      expect(control.getAttribute("aria-describedby")?.split(" ")).toContain(`${control.id}-hint`);
    }
    expect(select.className).toBe("krds-form-select consumer-select");
    expect(select.closest(".form-group")?.classList.contains("consumer-select")).toBe(false);
    expect(select.getAttribute("aria-describedby")).toBe("external-description solid-select-hint");
    expect(stateSelect.className).toBe("krds-form-select is-error");
    expect(stateSelect.getAttribute("aria-invalid")).toBe("true");
    expect(host.querySelector("#state-select-hint")?.className).toBe("form-hint-invalid");
    expect(host.querySelector("#state-select-hint")?.textContent).toBe("State error");

    expect(Array.from(select.options, (option) => option.hasAttribute("selected"))).toEqual([
      false,
      false,
    ]);
    expect(Array.from(sizeSelect.options, (option) => option.hasAttribute("selected"))).toEqual([
      true,
      false,
      false,
    ]);
    expect(Array.from(stateSelect.options, (option) => option.hasAttribute("selected"))).toEqual([
      false,
      false,
    ]);
    expect(Array.from(sortingSelect.options, (option) => option.hasAttribute("selected"))).toEqual([
      false,
      false,
    ]);

    expect(sortingSelect.parentElement).toBe(form);
    expect(sortingSelect.closest(".form-group")).toBeNull();
    expect(sortingSelect.className).toBe("krds-form-select-sort consumer-sort");
    expect(sortingSelect.name).toBe("sort");
    expect(sortingSelect.required).toBe(true);

    expect(select.name).toBe("choice");
    expect(select.title).toBe("Choose");
    expect(select.value).toBe("second");
    expect(select.disabled).toBe(false);
    expect(select.required).toBe(true);
    expect(stateSelect.disabled).toBe(true);
    expect(new FormData(form).get("choice")).toBe("second");
    expect(new FormData(form).get("size-choice")).toBe("large");
    expect(new FormData(form).has("state-choice")).toBe(false);
    expect(new FormData(form).get("sort")).toBe("newest");

    setValue("first");
    setDisabled(true);
    expect(select.value).toBe("first");
    expect(select.disabled).toBe(true);
    expect(new FormData(form).has("choice")).toBe(false);

    setDisabled(false);
    select.value = "second";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(changes).toEqual(["second"]);
    expect(value()).toBe("second");
    expect(select.value).toBe("second");
    expect(new FormData(form).get("choice")).toBe("second");
  });
  it("keeps critical alerts as alert regions with native list descendants", () => {
    mount(() => (
      <CriticalAlerts
        id="critical-alerts"
        items={[
          {
            id: "critical",
            title: "서비스 점검 안내",
            badge: "danger",
            badgeLabel: "긴급",
            href: "#critical",
            linkLabel: "자세히 보기",
          },
        ]}
      />
    ));

    const region = host.querySelector<HTMLElement>(".main-urgent-wrap")!;
    expect(region.getAttribute("role")).toBe("alert");
    const list = region.querySelector<HTMLUListElement>(":scope > .krds-critical-alerts")!;
    expect(list.tagName).toBe("UL");
    expect(list.querySelectorAll(":scope > li[role]")).toHaveLength(0);
    expect(region.querySelector('a[href="#critical"]')?.textContent).toContain("자세히 보기");
    expect(region.querySelector('a[href="#critical"]')?.textContent).toBe("자세히 보기 ");
  });
  it("preserves every pinned inline icon and label space", () => {
    mount(() => (
      <div>
        <Footer id="footer-spaces" links={[{ id: "footer-link", label: "푸터 링크", href: "#" }]} />
        <Header
          id="header-spaces"
          utilityItems={[
            { id: "header-drop", kind: "dropdown", label: "드롭다운", items: [] },
            { id: "header-link", kind: "link", label: "바로가기", href: "#" },
            {
              id: "header-resize",
              kind: "resize",
              label: "크기",
              resetLabel: "초기화",
              items: [],
            },
          ]}
          myMenu={{
            label: "내 메뉴",
            userName: "사용자",
            timeLabel: "시간",
            time: "10:00",
            extendLabel: "연장",
            items: [],
            logoutLabel: "로그아웃",
          }}
        />
        <HelpPanel
          id="help-spaces"
          open
          title="도움말 패널"
          tabs={[{ id: "help-space-tab", label: "도움", panelId: "help-space-panel" }]}
          activeTab="help"
          helpTitle="도움말"
          helpDescription="도움말 내용"
          downloadLinks={[{ id: "download", label: "다운로드", href: "#" }]}
          relatedGroups={[
            {
              title: "관련 서비스",
              links: [
                { id: "leading", label: "전화 문의", href: "#", icon: "call" },
                { id: "trailing", label: "자주 묻는 질문", href: "#", icon: "ico-angle right" },
              ],
            },
          ]}
          collapseLabel="접기"
        />
        <Resize
          id="resize-spaces"
          open
          label="화면 크기"
          resetLabel="초기화"
          options={[{ value: "md", label: "보통" }]}
        />
        <StructuredList
          id="structured-spaces"
          items={[
            {
              id: "structured-item",
              title: "구조화 항목",
              href: "#",
              shareLabel: "공유하기",
              favoriteLabel: "찜하기",
            },
          ]}
        />
        <StructuredListTable
          id="structured-table-spaces"
          selectAllLabel="전체 선택"
          countLabel="표시 개수"
          countOptions={["10개"]}
          sortLabel="정렬 기준"
          sortOptions={["최신순"]}
          caption="게시물 목록"
          actions={[{ label: "선택 삭제", icon: "delete" }]}
          columns={[
            { key: "selected", label: "선택" },
            { key: "download", label: "첨부 파일" },
          ]}
          rows={[
            {
              id: "download-row",
              selectionLabel: "행 선택",
              selected: false,
              download: "다운로드",
            },
          ]}
        />
      </div>
    ));

    expect(host.querySelector("#footer-spaces .link-go a")?.textContent).toBe("푸터 링크 ");

    const header = host.querySelector<HTMLElement>("#header-spaces")!;
    expect(header.querySelector(".utility-list > li:nth-child(1) .drop-btn")?.textContent).toBe(
      "드롭다운 ",
    );
    expect(header.querySelector(".utility-list > li:nth-child(2) > a")?.textContent).toBe(
      "바로가기 ",
    );
    expect(header.querySelector(".utility-list > li:nth-child(3) .drop-btn")?.textContent).toBe(
      "크기 ",
    );
    expect(
      header.querySelector(".utility-list > li:nth-child(3) .drop-bottom button")?.textContent,
    ).toBe(" 초기화");
    expect(header.querySelector(".my-drop .drop-bottom button")?.textContent).toBe(" 로그아웃");

    const help = host.querySelector<HTMLElement>(".krds-help-panel")!;
    expect(help.querySelector(".help-conts .help-title")?.textContent).toBe("도움말 도움말 패널");
    expect(
      Array.from(help.querySelectorAll(".help-conts .help-title")[0]?.childNodes ?? []).find(
        (node) => node.nodeType === Node.TEXT_NODE,
      )?.nodeValue,
    ).toBe("도움말 ");
    expect(
      Array.from(help.querySelectorAll(".help-conts .link-list a")[0]?.childNodes ?? []).find(
        (node) => node.nodeType === Node.TEXT_NODE,
      )?.nodeValue,
    ).toBe("다운로드 ");
    expect(
      Array.from(help.querySelectorAll(".related-service .link-list a")).map(
        (link) =>
          Array.from(link.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim(),
          )?.nodeValue,
      ),
    ).toEqual([" 전화 문의", "자주 묻는 질문 "]);
    const collapse = help.querySelector(".btn-help-panel")!;
    expect(
      Array.from(collapse.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)?.nodeValue,
    ).toBe(" 접기 ");
    expect(collapse.textContent).toBe("도움말 패널 접기 ");

    const resize = host.querySelector<HTMLElement>('.krds-resize[data-adjust="scale"]')!;
    expect(resize.querySelector(":scope > .drop-btn")?.textContent).toBe("화면 크기 ");
    expect(resize.querySelector(".drop-bottom button")?.textContent).toBe(" 초기화");
    expect(
      Array.from(
        host.querySelectorAll(".krds-structured-list .card-btn button"),
        (button) => button.textContent,
      ),
    ).toEqual([" 공유하기", " 찜하기"]);
    expect(
      host.querySelector(".krds-structured-list-table .side-line-ul button")?.textContent,
    ).toBe(" 선택 삭제");
    expect(host.querySelector(".krds-structured-list-table tbody .krds-btn")?.textContent).toBe(
      " 다운로드",
    );
  });
  it("preserves upstream visual contexts and inline text boundaries", () => {
    mount(() => (
      <div>
        <Tag id="tag" label="태그" removable message="삭제" />
        <TagLink id="tag-link" href="#" label="태그" />
        <Spinner id="spinner" label="로딩 중" />
        <InPageNavigation
          id="in-page"
          title="이 페이지의 구성"
          pageTitle="장애아동수당"
          actionLabel="온라인 신청하기"
          actionInfo="장애아동수당 외"
          actionCount="1건"
          items={[{ id: "overview", label: "서비스 개요", href: "#overview", current: true }]}
        />
        <RadioSize id="radio-medium" name="rdo-size" size="medium" label="사이즈 : medium" />
        <Link
          id="external-link"
          href="https://example.com"
          label="기본 링크"
          external
          target="_blank"
          title="새 창 열림"
          size="small"
        />
        <Tts id="tts" label="레이블" />
      </div>
    ));

    const tag = host.querySelector<HTMLElement>(".krds-btn-tag:not(.link)")!;
    const tagLink = host.querySelector<HTMLAnchorElement>("a.krds-btn-tag.link")!;
    expect(tag.parentElement?.className).toBe("krds-tag-wrap large");
    expect(tagLink.parentElement?.className).toBe("krds-tag-wrap large");

    const spinner = host.querySelector<HTMLElement>(".form-spinner > .krds-spinner")!;
    const spinnerInput = spinner.previousElementSibling as HTMLInputElement;
    expect(spinnerInput.matches('input.krds-input[placeholder="placeholder"]')).toBe(true);
    expect(spinner.closest(".form-group")?.querySelector("label")?.htmlFor).toBe(spinnerInput.id);

    const inPageArea = host.querySelector<HTMLElement>(".krds-in-page-navigation-area")!;
    expect(inPageArea.parentElement?.className).toBe("krds-in-page-navigation-type");

    const radioArea = host.querySelector<HTMLElement>(".krds-check-area")!;
    const radioChecks = Array.from(
      radioArea.querySelectorAll<HTMLElement>(":scope > .krds-form-check"),
    );
    expect(radioChecks.map((check) => check.className)).toEqual([
      "krds-form-check medium",
      "krds-form-check large",
    ]);
    expect(radioChecks.map((check) => check.querySelector("label")?.textContent)).toEqual([
      "사이즈 : medium",
      "사이즈 : large",
    ]);
    expect(
      radioChecks.map((check) => check.querySelector<HTMLInputElement>("input")?.name),
    ).toEqual(["rdo-size", "rdo-size"]);

    const link = host.querySelector<HTMLAnchorElement>("a.krds-btn.link")!;
    expect(link.textContent).toBe("기본 링크 ");
    expect(link.lastElementChild?.className).toBe("svg-icon ico-go");
    const tts = host.querySelector<HTMLButtonElement>("button.krds-tts")!;
    expect(tts.textContent).toBe(" 레이블");
    expect(tts.querySelector(".krds-tts-icon + .krds-tts-text")).not.toBeNull();
  });
  it("exposes native tab controls and linked panels without nested interactive roles", () => {
    mount(() => (
      <Tab
        id="tabs"
        tabs={[
          { id: "first", label: "First" },
          { id: "second", label: "Second" },
        ]}
        panels={{ first: "First panel", second: "Second panel" }}
        selected="first"
        panelTitle="Tab panel"
        message="selected"
      />
    ));

    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === "BUTTON")).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(host.querySelectorAll('li[role="presentation"]')).toHaveLength(2);
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].tabIndex).toBe(-1);

    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      const panel = host.querySelector<HTMLElement>(`#${panelId}`)!;
      expect(panel.getAttribute("role")).toBe("tabpanel");
      expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
      expect(panel.getAttribute("data-quick-nav")).toBe("false");
    }
    expect(host.querySelector("#panel-first")?.textContent).toContain("First panel");
  });
  it("updates TextList DOM when its reactive item array is replaced", () => {
    const [items, setItems] = createSignal(["Before"]);
    mount(() => <TextList items={items()} />);

    expect(
      Array.from(host.querySelectorAll('ul[role="list"] li')).map((item) => item.textContent),
    ).toEqual(["Before"]);

    setItems(["After", "Added"]);

    expect(
      Array.from(host.querySelectorAll('ul[role="list"] li')).map((item) => item.textContent),
    ).toEqual(["After", "Added"]);
  });
  it("forwards the public ref callback while controlled values update the same input", () => {
    let forwarded: HTMLInputElement | undefined;
    const [value, setValue] = createSignal("before");

    mount(() => (
      <TextInput
        id="ref-query"
        label="Query"
        value={value()}
        ref={(element) => {
          forwarded = element;
        }}
      />
    ));

    const input = host.querySelector<HTMLInputElement>("#ref-query")!;
    expect(forwarded).toBe(input);
    expect(input.value).toBe("before");

    setValue("after");

    expect(forwarded).toBe(input);
    expect(input.value).toBe("after");
  });

  it("lets uncontrolled native input state stay local while controlled state follows the parent", () => {
    const [checked, setChecked] = createSignal(false);
    mount(() => (
      <form>
        <Checkbox id="uncontrolled" label="Uncontrolled" checked={undefined} />
        <Checkbox
          id="controlled"
          label="Controlled"
          checked={checked()}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      </form>
    ));
    const uncontrolled = host.querySelector<HTMLInputElement>("#uncontrolled")!;
    const controlled = host.querySelector<HTMLInputElement>("#controlled")!;

    expect(uncontrolled.checked).toBe(false);
    expect(controlled.checked).toBe(false);
    uncontrolled.click();
    expect(uncontrolled.checked).toBe(true);
    controlled.click();
    expect(checked()).toBe(true);
    expect(controlled.checked).toBe(true);
  });
  it("keeps standalone sample menus literal and free of runtime disclosure state", () => {
    mount(() => (
      <div>
        <MainMenuPc
          id="sample-pc"
          sample
          menuLabel="메인 메뉴"
          items={[
            {
              id: "sample-main",
              label: "1Depth",
              active: true,
              children: [
                {
                  id: "sample-sub",
                  label: "2Depth",
                  active: true,
                  title: "2Depth title",
                  titleHref: "#sample-title",
                  titleLinkLabel: "바로가기",
                  children: [{ id: "sample-leaf", label: "Last depth", href: "#" }],
                },
              ],
            },
          ]}
        />
        <MainMenuMobile
          id="sample-mobile"
          sample
          utilityItems={[]}
          loginLabel="로그인"
          serviceItems={[]}
          searchPlaceholder="메뉴 검색"
          searchTitle="메뉴 검색 제목"
          searchLabel="검색"
          items={[
            {
              id: "sample-mobile-panel",
              label: "1Depth",
              children: [
                {
                  id: "sample-mobile-sub",
                  label: "2Depth",
                  href: "#",
                  children: [{ id: "sample-mobile-depth3", label: "3Depth", href: "#" }],
                },
              ],
            },
          ]}
          previousLabel="이전화면"
          closeLabel="전체메뉴 닫기"
          bottomItems={[{ label: "메뉴", href: "#" }]}
        />
      </div>
    ));

    const samplePc = host.querySelector<HTMLElement>(".krds-main-menu.sample")!;
    const sampleMain = samplePc.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const sampleMainPanel = samplePc.querySelector<HTMLElement>(".gnb-toggle-wrap")!;
    const sampleSub = samplePc.querySelector<HTMLButtonElement>(".gnb-sub-trigger")!;
    expect(samplePc.querySelector(".gnb-menu")?.hasAttribute("aria-label")).toBe(false);
    expect(sampleMain.hasAttribute("aria-controls")).toBe(false);
    expect(sampleMain.hasAttribute("aria-expanded")).toBe(false);
    expect(sampleMain.hasAttribute("aria-haspopup")).toBe(false);
    expect(sampleMainPanel.hasAttribute("id")).toBe(false);
    expect(sampleSub.hasAttribute("aria-controls")).toBe(false);
    expect(sampleSub.hasAttribute("aria-expanded")).toBe(false);
    expect(sampleSub.hasAttribute("aria-haspopup")).toBe(false);
    expect(samplePc.querySelector(".gnb-sub-list")?.hasAttribute("id")).toBe(false);
    expect(
      Array.from(samplePc.querySelector(".sub-title")?.children ?? []).map(
        (element) => element.tagName,
      ),
    ).toEqual(["A"]);
    sampleMain.click();
    expect(sampleMain.classList.contains("active")).toBe(true);
    expect(sampleMainPanel.classList.contains("is-open")).toBe(true);

    const sampleMobile = host.querySelector<HTMLElement>("#sample-mobile")!;
    const sampleTabList = sampleMobile.querySelector<HTMLElement>(".menu-wrap > ul")!;
    const sampleTab = sampleMobile.querySelector<HTMLAnchorElement>(
      ".menu-wrap .gnb-main-trigger",
    )!;
    const sampleDepth3 = sampleMobile.querySelector<HTMLAnchorElement>(".has-depth3")!;
    expect(sampleTabList.hasAttribute("role")).toBe(false);
    expect(sampleTab.parentElement?.hasAttribute("role")).toBe(false);
    expect(sampleTab.hasAttribute("id")).toBe(false);
    expect(sampleTab.hasAttribute("role")).toBe(false);
    expect(sampleTab.hasAttribute("aria-selected")).toBe(false);
    expect(sampleTab.hasAttribute("aria-controls")).toBe(false);
    expect(sampleDepth3.hasAttribute("aria-expanded")).toBe(false);
    expect(sampleDepth3.hasAttribute("aria-controls")).toBe(false);
    expect(sampleDepth3.nextElementSibling?.hasAttribute("id")).toBe(false);
    expect(sampleMobile.querySelector(".gnb-login button")?.textContent).toBe(" 로그인");
    expect(sampleMobile.querySelector(".gnb-bottom a")?.textContent).toBe("메뉴 ");
    expect(sampleMobile.querySelector("#close-nav")).not.toBeNull();
    sampleTab.click();
    sampleDepth3.click();
    expect(sampleTab.classList.contains("active")).toBe(false);
    expect(sampleDepth3.classList.contains("active")).toBe(false);
    expect(sampleDepth3.nextElementSibling?.classList.contains("is-open")).toBe(false);
  });

  it("initializes header desktop and mobile menu relationships without generic search naming", () => {
    mount(() => (
      <Header
        id="header-navigation"
        menuLabel="메인 메뉴"
        utilityItems={[
          {
            id: "utility-dropdown",
            kind: "dropdown",
            label: "이용 안내",
            items: [{ id: "utility-item", label: "메뉴명", href: "#" }],
          },
        ]}
        myMenu={{
          label: "나의 GOV",
          userName: "사용자",
          timeLabel: "남은 시간",
          time: "10:00",
          extendLabel: "연장",
          items: [],
          logoutLabel: "로그아웃",
        }}
        desktopItems={[
          {
            id: "header-main",
            label: "1Depth",
            children: [
              {
                id: "header-sub",
                label: "2Depth",
                title: "2Depth title",
                titleHref: "#header-title",
                titleLinkLabel: "바로가기",
                children: [{ id: "header-leaf", label: "Last depth", href: "#" }],
              },
            ],
          },
        ]}
        mobileMenu={{
          utilityItems: [],
          loginLabel: "로그인",
          serviceItems: [],
          searchPlaceholder: "메뉴 검색",
          searchTitle: "찾고자 하는 메뉴명 입력",
          searchLabel: "검색",
          items: [
            {
              id: "header-mobile-panel",
              label: "1Depth",
              children: [
                {
                  id: "header-mobile-sub",
                  label: "2Depth",
                  href: "#",
                  children: [{ id: "header-mobile-depth3", label: "3Depth", href: "#" }],
                },
              ],
            },
          ],
          previousLabel: "이전화면",
          closeLabel: "전체메뉴 닫기",
          bottomItems: [],
        }}
      />
    ));

    const header = host.querySelector<HTMLElement>("#header-navigation")!;
    const myMenuTrigger = header.querySelector<HTMLButtonElement>(".my-drop > .drop-btn")!;
    expect(myMenuTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(myMenuTrigger.getAttribute("aria-controls")).toBe("header-my-menu-drop");
    expect(myMenuTrigger.nextElementSibling?.id).toBe("header-my-menu-drop");
    const allMenuTrigger = header.querySelector<HTMLButtonElement>(".btn-navi.all")!;
    expect(allMenuTrigger.getAttribute("aria-controls")).toBe("mobile-nav");
    expect(allMenuTrigger.hasAttribute("aria-expanded")).toBe(false);
    const utilityOption = header.querySelector<HTMLAnchorElement>(
      ".header-utility .drop-list .item-link",
    )!;
    expect(utilityOption.querySelector(".sr-only")?.textContent).toBe("");

    const desktop = header.querySelector<HTMLElement>(".krds-main-menu")!;
    expect(desktop.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBe("메인 메뉴");
    const mainTrigger = desktop.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const mainPanelId = mainTrigger.getAttribute("aria-controls")!;
    const mainPanel = desktop.querySelector<HTMLElement>(`[id="${mainPanelId}"]`)!;
    expect(mainTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(mainTrigger.getAttribute("aria-haspopup")).toBe("true");
    expect(mainPanel).not.toBeNull();
    mainTrigger.click();
    expect(mainTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(mainPanel.classList.contains("is-open")).toBe(true);

    const subTrigger = desktop.querySelector<HTMLButtonElement>(".gnb-sub-trigger")!;
    const subPanelId = subTrigger.getAttribute("aria-controls")!;
    const subPanel = desktop.querySelector<HTMLElement>(`[id="${subPanelId}"]`)!;
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subTrigger.getAttribute("aria-haspopup")).toBe("true");
    expect(subPanel.classList.contains("active")).toBe(true);
    expect(
      Array.from(subPanel.querySelector(".sub-title")?.children ?? []).map(
        (element) => element.tagName,
      ),
    ).toEqual(["A"]);

    const mobile = header.querySelector<HTMLElement>("#mobile-nav")!;
    const tabList = mobile.querySelector<HTMLElement>(".menu-wrap > ul")!;
    const firstTab = mobile.querySelector<HTMLAnchorElement>(".menu-wrap .gnb-main-trigger")!;
    const firstPanel = mobile.querySelector<HTMLElement>("#header-mobile-panel")!;
    expect(tabList.getAttribute("role")).toBe("tablist");
    expect(firstTab.parentElement?.getAttribute("role")).toBe("none");
    expect(firstTab.id).toBe("tab-0");
    expect(firstTab.getAttribute("role")).toBe("tab");
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(firstTab.getAttribute("aria-controls")).toBe(firstPanel.id);
    expect(firstTab.classList.contains("active")).toBe(true);
    expect(firstPanel.getAttribute("role")).toBe("tabpanel");
    expect(firstPanel.getAttribute("aria-labelledby")).toBe(firstTab.id);

    const searchInput = mobile.querySelector<HTMLInputElement>(".sch-input input")!;
    expect(searchInput.title).toBe("찾고자 하는 메뉴명 입력");
    expect(searchInput.getAttribute("aria-label")).toBe("검색");
    const depth3Trigger = mobile.querySelector<HTMLAnchorElement>(".has-depth3")!;
    expect(depth3Trigger.getAttribute("aria-expanded")).toBe("false");
    expect(depth3Trigger.getAttribute("aria-controls")).toBe("header-mobile-sub-depth3");
    expect(depth3Trigger.nextElementSibling?.id).toBe("header-mobile-sub-depth3");
    depth3Trigger.click();
    expect(depth3Trigger.getAttribute("aria-expanded")).toBe("true");
    expect(depth3Trigger.nextElementSibling?.classList.contains("is-open")).toBe(true);
  });

  it("relates expanded controls and labels their inventory inputs", () => {
    mount(() => (
      <div>
        <ContextualHelp
          id="help"
          open
          label="도움말"
          title="도움말 제목"
          description="도움말 내용"
          closeLabel="닫기"
        />
        <LanguageSwitcher
          id="language"
          open
          label="언어 변경"
          options={[{ value: "ko", label: "한국어" }]}
        />
        <Resize id="resize" open label="화면 크기" options={[{ value: "md", label: "보통" }]} />
        <Header
          id="header"
          utilityItems={[{ id: "utility", kind: "dropdown", label: "이용 안내", items: [] }]}
          myMenu={{
            label: "내 메뉴",
            userName: "사용자",
            timeLabel: "시간",
            time: "10:00",
            extendLabel: "연장",
            items: [],
            logoutLabel: "로그아웃",
          }}
        />
        <MainMenuMobile
          id="mobile"
          open
          searchPlaceholder="메뉴 검색"
          searchTitle="메뉴 검색"
          searchLabel="검색"
          utilityItems={[]}
          serviceItems={[]}
          items={[]}
        />
        <Select
          id="select"
          label="정렬 기준"
          title="정렬"
          options={[{ value: "recent", label: "최신순" }]}
        />
        <StructuredListTable
          id="table"
          selectAllLabel="전체 선택"
          countLabel="표시 개수"
          countOptions={["10개"]}
          sortLabel="정렬 기준"
          sortOptions={["최신순"]}
          caption="게시물 목록"
          columns={[
            { key: "selected", label: "선택" },
            { key: "title", label: "제목" },
          ]}
          rows={[
            {
              id: "1",
              selectionLabel: "첫 번째 행 선택",
              selected: false,
              title: "첫 번째 행",
            },
          ]}
        />
      </div>
    ));

    for (const control of Array.from(
      host.querySelectorAll<HTMLElement>("[aria-expanded][aria-controls]"),
    )) {
      const targetId = control.getAttribute("aria-controls");
      expect(targetId).toBeTruthy();
      expect(host.querySelector(`[id="${targetId}"]`)).not.toBeNull();
    }
    const contextualPopover = host.querySelector<HTMLElement>(
      ".krds-contextual-help .tooltip-popover",
    )!;
    expect(contextualPopover.style.width).toBe("");
    expect(contextualPopover.style.display).toBe("block");
    expect(host.querySelector<HTMLElement>(".krds-language .drop-menu")?.style.display).toBe(
      "block",
    );
    expect(host.querySelector<HTMLElement>(".krds-resize .drop-menu")?.style.display).toBe("block");
    expect(host.querySelector('input[title="메뉴 검색"]')?.getAttribute("aria-label")).toBe("검색");
    expect(host.querySelector<HTMLSelectElement>("#select")?.hasAttribute("aria-label")).toBe(
      false,
    );
    expect(host.querySelector<HTMLLabelElement>('label[for="select"]')?.textContent).toBe(
      "정렬 기준",
    );
    expect(host.querySelector(".krds-language .ico-global")).not.toBeNull();
    const languageTrigger = host.querySelector<HTMLButtonElement>(".krds-language > .drop-btn")!;
    expect(Array.from(languageTrigger.children).map((element) => element.className)).toEqual([
      "svg-icon ico-global",
      "svg-icon ico-toggle",
    ]);
    expect(languageTrigger.textContent).toBe(" 언어 변경 ");
    expect(host.querySelector(".krds-language .drop-list a.item-link")?.textContent).toBe("한국어");
    const tableRowCheckbox = host.querySelector<HTMLInputElement>("#table-row-1")!;
    const tableRowLabel = host.querySelector<HTMLLabelElement>('label[for="table-row-1"]')!;
    expect(tableRowCheckbox.getAttribute("aria-label")).toBe("첫 번째 행 선택");
    expect(tableRowLabel.htmlFor).toBe(tableRowCheckbox.id);
    expect(tableRowLabel.childNodes).toHaveLength(0);
  });
  it("matches initialized language status text and labels icon inputs", () => {
    const languages = [
      { value: "ko", label: "한국어" },
      { value: "en", label: "English (영어)" },
    ];
    mount(() => (
      <div>
        <LanguageSwitcher
          id="language-status"
          label="언어 변경"
          selected="ko"
          selectedLabel="선택됨"
          options={languages}
        />
        <LanguageSwitcherPage
          id="language-page-status"
          label="언어 변경"
          currentLabel="현재 언어"
          externalTitle="새 창 열림"
          selected="ko"
          selectedLabel="선택됨"
          options={languages}
        />
        <TextInputIcon
          id="password-icon"
          label="레이블"
          type="password"
          value="1234567890"
          placeholder="8-12자의 영문자, 숫자, 특수문자 조합"
        />
      </div>
    ));

    const menus = Array.from(host.querySelectorAll<HTMLElement>(".krds-language"));
    const standardLinks = Array.from(menus[0].querySelectorAll<HTMLAnchorElement>(".item-link"));
    expect(standardLinks.map((link) => link.querySelector(".sr-only")?.textContent)).toEqual([
      "선택됨",
      "",
    ]);
    expect(standardLinks.every((link) => link.lastElementChild?.className === "sr-only")).toBe(
      true,
    );

    const pageLinks = Array.from(menus[1].querySelectorAll<HTMLAnchorElement>(".item-link"));
    expect(pageLinks).toHaveLength(1);
    expect(pageLinks[0].querySelector(".sr-only")?.textContent).toBe("");
    expect(pageLinks[0].lastElementChild?.className).toBe("sr-only");

    const input = host.querySelector<HTMLInputElement>("#password-icon")!;
    const label = host.querySelector<HTMLLabelElement>('label[for="password-icon"]')!;
    expect(label.htmlFor).toBe(input.id);
    expect(label.textContent).toBe("레이블");
    expect(
      input.closest(".form-group")?.querySelector(":scope > .form-conts.btn-ico-wrap > input"),
    ).toBe(input);
    const passwordToggle = input.nextElementSibling as HTMLButtonElement;
    expect(passwordToggle.type).toBe("button");
    expect(passwordToggle.className).toBe("krds-btn medium icon");
    expect(passwordToggle.querySelector(".sr-only")?.textContent).toBe("입력한 비밀번호 보기");
    expect(passwordToggle.lastElementChild?.className).toBe("svg-icon ico-pw-visible");
  });
  it("does not autofocus an initially open modal but focuses, traps, and restores later", async () => {
    const opener = document.createElement("button");
    opener.type = "button";
    document.body.append(opener);
    opener.focus();
    const [open, setOpen] = createSignal(true);

    try {
      mount(() => (
        <Modal
          id="focus-modal"
          open={open()}
          title="모달 제목"
          description="모달 내용"
          cancelLabel="취소"
          confirmLabel="확인"
          closeLabel="닫기"
        />
      ));
      await Promise.resolve();
      expect(document.activeElement).toBe(opener);

      setOpen(false);
      await Promise.resolve();
      opener.focus();
      setOpen(true);
      await Promise.resolve();

      const modal = host.querySelector<HTMLElement>("#focus-modal")!;
      const first = modal.querySelector<HTMLButtonElement>(".modal-btn button")!;
      const last = modal.querySelector<HTMLButtonElement>(".btn-close")!;
      expect(document.activeElement).toBe(first);

      last.focus();
      last.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
      expect(document.activeElement).toBe(first);

      setOpen(false);
      await Promise.resolve();
      expect(document.activeElement).toBe(opener);
    } finally {
      opener.remove();
    }
  });
  it("derives calendar vectors while preserving display and selected values", () => {
    mount(() => (
      <div>
        <Calendar
          id="calendar"
          displayYear={2024}
          displayMonth={12}
          selectedYear={2002}
          selectedMonth={2}
          years={[2001, 2002]}
          disabledYears={[2001]}
          disabledMonths={[2]}
          leadingDays={5}
          previousMonthDayCount={30}
          dayCount={31}
          rangeStartDay={7}
          rangeEndDay={7}
          todayDay={30}
          eventDays={[8]}
          disabledDays={[13]}
          calendarLabel="달력"
          previousLabel="이전 달"
          nextLabel="다음 달"
          yearSelectLabel="연도 선택"
          monthSelectLabel="월 선택"
          todayLabel="오늘"
          eventLabel="일정있음"
          weekdays={["일", "월", "화", "수", "목", "금", "토"]}
        />
        <CalendarRange id="range" displayYear={2024} displayMonth={12} />
        <DateInput id="date" label="날짜" hint="도움말" calendarLabel="달력" />
      </div>
    ));

    const calendar = host.querySelector<HTMLElement>(".krds-calendar-area")!;
    expect(calendar.hasAttribute("displayyear")).toBe(false);
    expect(calendar.querySelector<HTMLButtonElement>(".btn-cal-switch.year")?.textContent).toBe(
      "2024년",
    );
    expect(
      calendar.querySelector<HTMLButtonElement>(".calendar-year-wrap button.active")?.textContent,
    ).toBe("2002년");
    expect(
      calendar.querySelector<HTMLButtonElement>(".calendar-mon-wrap button.active")?.textContent,
    ).toBe("02월");
    expect(calendar.querySelector('[data-date="2024.12.07"]')?.className).toContain("period");
    expect(
      calendar
        .querySelector<HTMLButtonElement>('[data-date="2024.12.08"] button')
        ?.getAttribute("aria-label"),
    ).toBe("8 일정있음");
    expect(
      calendar
        .querySelector<HTMLButtonElement>('[data-date="2024.12.13"] button')
        ?.getAttribute("disabled"),
    ).toBe("");
    expect(host.querySelectorAll(".calendar-wrap:not(.single)")).toHaveLength(2);

    expect(host.querySelector<HTMLLabelElement>('label[for="date"]')?.textContent).toBe("날짜");
    expect(host.querySelector<HTMLInputElement>("#date")?.type).toBe("number");
    const dateInputGroup = host
      .querySelector<HTMLInputElement>("#date")!
      .closest<HTMLElement>(".form-group")!;
    const dateInputContents = dateInputGroup.children[1] as HTMLElement;
    expect(dateInputContents.className).toBe("form-conts");
    expect(dateInputContents.children).toHaveLength(1);
    const calendarContents = dateInputContents.firstElementChild as HTMLElement;
    expect(calendarContents.className).toBe("form-conts calendar-conts");
    expect(calendarContents.querySelector(":scope > .calendar-input > #date")).not.toBeNull();
    expect(calendarContents.querySelector(":scope > .krds-calendar-area")).not.toBeNull();
    expect(host.querySelector(".form-group .form-hint")?.textContent).toBe("도움말");
  });

  it("serializes fixture text and stable tooltip relationships without leaking adapter props", () => {
    mount(() => (
      <div>
        <FileUpload
          id="upload"
          title="첨부파일"
          description="설명"
          prompt="파일을 선택하세요"
          inputId="upload-input"
          selectLabel="파일 선택"
          currentCount={3}
          maxCount={10}
          countSuffix="개"
          files={[
            { id: "uploading", name: "업로드 파일", status: "uploading", statusLabel: "업로드 중" },
            { id: "complete", name: "완료 파일", status: "complete", statusLabel: "업로드 완료" },
            { id: "deletable", name: "삭제 파일", status: "deletable", deleteLabel: "삭제" },
            {
              id: "error",
              name: "오류 파일",
              status: "error",
              deleteLabel: "삭제",
              errors: ["용량을 초과하였습니다.", "작은 파일을 선택하세요."],
            },
            {
              id: "downloadable",
              name: "다운로드 파일",
              status: "downloadable",
              downloadLabel: "다운로드",
              previewLabel: "바로보기",
            },
          ]}
          deleteAllLabel="전체 삭제"
        />
        <StepIndicator
          id="steps"
          current={1}
          label="단계"
          steps={[{ id: "first", label: "첫 단계" }]}
        />
        <Tooltip id="tooltip" label="tooltip-horizontal" message="툴팁의 기본 설정입니다" />
        <SelectSorting
          id="sorting"
          label="레이블"
          title="선택"
          options={[{ value: "", label: "항목1" }]}
        />
        <Carousel
          id="carousel"
          slides={[
            { id: "first", title: "첫 슬라이드", description: "첫 설명", href: "#first" },
            { id: "second", title: "둘째 슬라이드", description: "둘째 설명", href: "#second" },
          ]}
          actionLabel="바로가기"
          imageLabel="배너 이미지"
          previousLabel="이전"
          nextLabel="다음"
          moreLabel="더보기"
        />
      </div>
    ));

    const upload = host.querySelector<HTMLElement>(".krds-file-upload");
    expect(upload?.hasAttribute("countsuffix")).toBe(false);
    expect(upload?.querySelector(".total .current")).not.toBeNull();
    expect(upload?.querySelector(".total")?.textContent).toBe("3개 / 10개");
    const uploadInput = host.querySelector<HTMLInputElement>(".file-upload-btn-wrap > input")!;
    const uploadButton = host.querySelector<HTMLButtonElement>(".file-upload-btn-wrap > button")!;
    expect(uploadButton.previousElementSibling).toBe(uploadInput);
    let uploadInputClicks = 0;
    uploadInput.addEventListener("click", () => uploadInputClicks++);
    uploadButton.click();
    expect(uploadInputClicks).toBe(1);
    const uploadRows = Array.from(
      upload?.querySelectorAll<HTMLLIElement>(".upload-list > li") ?? [],
    );
    expect(uploadRows).toHaveLength(5);
    expect(uploadRows.map((row) => row.querySelector(".file-info")?.className)).toEqual([
      "file-info",
      "file-info",
      "file-info",
      "file-info",
      "file-info m-column",
    ]);
    expect(uploadRows[0]?.querySelector('.krds-spinner[role="status"]')).not.toBeNull();
    expect(uploadRows[1]?.querySelector(".ico-invalid.complete")).not.toBeNull();
    expect(uploadRows[3]?.className).toBe("is-error");
    expect(uploadRows[3]?.querySelectorAll(".file-hint-invalid br")).toHaveLength(1);
    expect(
      Array.from(
        uploadRows[4]?.querySelectorAll<HTMLButtonElement>(".btn-wrap > button") ?? [],
      ).map((button) => button.textContent),
    ).toEqual(["다운로드 ", "바로보기 "]);
    expect(host.querySelector(".step")?.textContent).toBe("1단계");
    const tooltip = host.querySelector<HTMLButtonElement>(".krds-tooltip")!;
    expect(tooltip.getAttribute("aria-labelledby")).toBe("tooltip-tooltip");
    expect(tooltip.textContent).toBe("tooltip-horizontal ");
    expect(tooltip.lastElementChild?.className).toBe("svg-icon ico-angle right");
    expect(host.querySelector('#tooltip-tooltip[role="tooltip"]')?.textContent).toBe(
      "tooltip-horizontal 툴팁의 기본 설정입니다",
    );
    expect(host.querySelector("#sorting")?.getAttribute("aria-label")).toBe("레이블");
    const slides = Array.from(host.querySelectorAll<HTMLElement>(".main-vban-wrap .swiper-slide"));
    expect(slides.map((slide) => slide.className)).toEqual(["swiper-slide", "swiper-slide"]);
    host.querySelector<HTMLButtonElement>(".main-vban-wrap .swiper-button-next")?.click();
    expect(slides[1]?.className).toContain("swiper-slide-active");
    expect(slides[1]?.getAttribute("aria-current")).toBe("true");
  });

  it("keeps disclosure and help surfaces linked to native controls", () => {
    mount(() => (
      <div>
        <Disclosure id="disclosure" title="상세 보기" description="상세 내용" />
        <HelpPanel
          id="help-panel"
          open
          tabs={[
            { id: "help-tab", label: "도움", panelId: "help-panel-content" },
            {
              id: "help-tutorial-tab",
              label: "따라하기",
              panelId: "help-tutorial-content",
            },
          ]}
          activeTab="help"
          helpTitle="도움말"
          helpDescription="도움말 내용"
          tutorialBackTitle="이전으로"
          relatedGroups={[
            {
              title: "문의",
              links: [
                { label: "전화 문의", href: "#", icon: "call" },
                { label: "자주 묻는 질문", href: "#", icon: "faq" },
              ],
            },
          ]}
        />
        <TutorialPanel
          id="tutorial-panel"
          open
          tabs={[
            { id: "tutorial-help-tab", label: "도움", panelId: "tutorial-help-content" },
            { id: "tutorial-tab", label: "따라하기", panelId: "tutorial-content" },
          ]}
          activeTab="tutorial"
          tutorialTitle="따라하기"
          tutorialBackTitle="이전으로"
          tasks={[
            {
              title: "첫 번째 작업",
              current: true,
              summary: "전체 2단계",
              steps: ["단계 1", "단계 2"],
            },
            {
              title: "두 번째 작업",
              summary: "전체 1단계",
              steps: ["단계 1"],
            },
          ]}
        />
      </div>
    ));

    const trigger = host.querySelector<HTMLButtonElement>("#disclosure-trigger")!;
    const panel = host.querySelector<HTMLElement>("#disclosure-content")!;
    expect(trigger.getAttribute("aria-controls")).toBe("disclosure-content");
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe("disclosure-trigger");
    expect(host.querySelector(".help-panel-wrap")?.getAttribute("tabindex")).toBe("0");

    const drawers = Array.from(host.querySelectorAll<HTMLElement>(".krds-help-panel"));
    expect(drawers).toHaveLength(2);
    for (const drawer of drawers) {
      expect(drawer.classList.contains("expand")).toBe(true);
      expect(drawer.querySelector(":scope > .help-panel-wrap > .help-conts-area")).not.toBeNull();
      expect(drawer.querySelectorAll('[role="tablist"] > li[role="presentation"]')).toHaveLength(2);
    }

    const helpDrawer = drawers[0]!;
    const tutorialDrawer = drawers[1]!;
    const helpPanels = Array.from(
      helpDrawer.querySelectorAll<HTMLElement>('.tab-conts-wrap > [role="tabpanel"]'),
    );
    const tutorialPanels = Array.from(
      tutorialDrawer.querySelectorAll<HTMLElement>('.tab-conts-wrap > [role="tabpanel"]'),
    );
    expect(helpPanels.map((tabPanel) => tabPanel.hasAttribute("hidden"))).toEqual([false, true]);
    expect(tutorialPanels.map((tabPanel) => tabPanel.hasAttribute("hidden"))).toEqual([
      true,
      false,
    ]);
    expect(helpDrawer.querySelector(".related-service .svg-icon.ico-call")).not.toBeNull();
    expect(helpDrawer.querySelector(".related-service .svg-icon.ico-faq")).not.toBeNull();
    expect(
      tutorialDrawer.querySelector<HTMLAnchorElement>(".help-title > a")?.getAttribute("href"),
    ).toBe("#;");

    const taskDisclosures = Array.from(
      tutorialDrawer.querySelectorAll<HTMLElement>(".coach-help-process > li > .krds-disclosure"),
    );
    expect(taskDisclosures).toHaveLength(2);
    for (const disclosure of taskDisclosures) {
      const taskTrigger = disclosure.querySelector<HTMLButtonElement>(
        ":scope > .btn-conts-expand",
      )!;
      const taskPanel = disclosure.querySelector<HTMLElement>(":scope > .expand-wrap")!;
      expect(taskTrigger.getAttribute("aria-expanded")).toBe("false");
      expect(taskTrigger.getAttribute("aria-controls")).toBe(taskPanel.id);
      expect(taskPanel.id).not.toBe("");
      expect(taskPanel.hasAttribute("inert")).toBe(true);
      expect(taskPanel.hasAttribute("hidden")).toBe(false);
      expect(taskPanel.hasAttribute("aria-hidden")).toBe(false);
    }

    const stepLists = Array.from(
      tutorialDrawer.querySelectorAll<HTMLUListElement>(".krds-info-list.decimal"),
    );
    expect(stepLists.map((list) => list.getAttribute("role"))).toEqual(["list", "list"]);
    expect(
      stepLists.flatMap((list) => Array.from(list.children, (item) => item.getAttribute("role"))),
    ).toEqual(["listitem", "listitem", "listitem"]);
    expect(host.querySelector(".krds-help-panel")?.hasAttribute("tutorialbacktitle")).toBe(false);
  });
});
