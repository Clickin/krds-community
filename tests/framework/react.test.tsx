import { act, createElement, createRef, useState, type FormEvent, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { CoachMark } from "../../packages/react/src/components/CoachMark.js";
import {
  Accordion,
  Button,
  Checkbox,
  Switch,
  TextInput,
} from "../../packages/react/src/components.tsx";
import {
  Calendar,
  ContextualHelp,
  CriticalAlerts,
  DateInput,
  FileUpload,
  Footer,
  Header,
  InPageNavigation,
  LanguageSwitcher,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Modal,
  Pagination,
  RadioSize,
  Resize,
  SkipLink,
  Spinner,
  StepIndicator,
  StructuredListTable,
  StructuredList,
  Select,
  SelectSize,
  SelectSorting,
  SelectState,
  Tab,
  Tag,
  TagLink,
  TextList,
  TextInputState,
  TextInputIcon,
  Tooltip,
  Tts,
  HelpPanel,
  TutorialPanel,
} from "../../packages/react/src/additional.tsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const h = createElement;
let root: Root | undefined;
let host: HTMLDivElement;

function render(node: ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  return act(async () => {
    root?.render(node);
  });
}

afterEach(() => {
  if (root) {
    act(() => root?.unmount());
    root = undefined;
  }
  host?.remove();
});

describe("React core component contracts", () => {
  it("keeps parent-controlled values, native state, derived count, and form data reactive", async () => {
    function FormHarness() {
      const [value, setValue] = useState("one");
      const [checked, setChecked] = useState(false);
      const [disabled, setDisabled] = useState(false);
      const [submitted, setSubmitted] = useState("");
      const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).get("query")?.toString() ?? "");
      };

      return h(
        "form",
        { onSubmit: submit },
        h(TextInput, {
          id: "query",
          name: "query",
          label: "Query",
          hint: "Required",
          value,
          onChange: (event) => setValue(event.currentTarget.value),
          "aria-label": "Query input",
        }),
        h(Checkbox, {
          id: "accepted",
          name: "accepted",
          label: "Accept",
          checked,
          onChange: (event) => setChecked(event.currentTarget.checked),
          disabled,
        }),
        h("output", { "data-testid": "count" }, value.length),
        h("output", { "data-testid": "submitted" }, submitted),
        h(
          Button,
          {
            type: "button",
            onClick: () => {
              setValue("updated");
              setDisabled(true);
            },
          },
          "Parent update",
        ),
        h("button", { type: "submit" }, "Submit"),
      );
    }

    await render(h(FormHarness));
    const input = host.querySelector<HTMLInputElement>("#query")!;
    const checkbox = host.querySelector<HTMLInputElement>("#accepted")!;
    const update = Array.from(host.querySelectorAll("button")).find(
      (button) => button.textContent === "Parent update",
    )!;

    expect(input.value).toBe("one");
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("3");
    expect(new FormData(host.querySelector("form")!).get("query")).toBe("one");
    expect(new FormData(host.querySelector("form")!).has("accepted")).toBe(false);

    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(
        input,
        "user input",
      );
      input.dispatchEvent(new Event("input", { bubbles: true }));
      checkbox.click();
    });
    expect(input.value).toBe("user input");
    expect(checkbox.checked).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("10");
    expect(new FormData(host.querySelector("form")!).get("query")).toBe("user input");
    expect(new FormData(host.querySelector("form")!).get("accepted")).toBe("on");

    await act(async () => update.click());
    expect(input.value).toBe("updated");
    expect(checkbox.disabled).toBe(true);
    expect(host.querySelector('[data-testid="count"]')?.textContent).toBe("7");

    await act(async () => host.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(host.querySelector('[data-testid="submitted"]')?.textContent).toBe("updated");
  });

  it("preserves ARIA state and native event/ref composition across rerenders", async () => {
    const ref = createRef<HTMLButtonElement>();
    const events: string[] = [];
    function Harness() {
      const [state, setState] = useState<"default" | "error">("error");
      return h(
        "section",
        null,
        h(TextInput, {
          id: "invalid-input",
          label: "Invalid field",
          hint: "Explain the error",
          state,
          onBlur: () => events.push("blur"),
        }),
        h(
          Button,
          {
            ref,
            onClick: () => {
              events.push("click");
              setState("default");
            },
          },
          "clear error",
        ),
        h(Accordion, {
          items: [
            { id: "first", title: "First", content: "First content" },
            { id: "second", title: "Second", content: "Second content" },
          ],
          defaultOpen: ["first"],
        }),
      );
    }

    await render(h(Harness));
    const invalidInput = host.querySelector<HTMLInputElement>("#invalid-input")!;
    const firstPanel = host.querySelector<HTMLElement>('[role="region"]')!;
    const firstTrigger = host.querySelector<HTMLButtonElement>(
      `button[aria-controls="${firstPanel.id}"]`,
    )!;
    const clearError = Array.from(host.querySelectorAll("button")).find(
      (button) => button.textContent === "clear error",
    )!;

    expect(invalidInput.getAttribute("aria-invalid")).toBe("true");
    expect(invalidInput.getAttribute("aria-describedby")).toBe("invalid-input-hint");
    expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(firstTrigger.classList.contains("active")).toBe(true);
    expect(firstTrigger.closest(".accordion-item")?.classList.contains("active")).toBe(true);
    expect(firstPanel.hidden).toBe(false);
    expect(ref.current).toBe(clearError);

    await act(async () => {
      invalidInput.focus();
      invalidInput.blur();
      clearError.click();
      firstTrigger.click();
    });
    expect(events).toEqual(["blur", "click"]);
    expect(invalidInput.getAttribute("aria-invalid")).toBe(null);
    expect(firstTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(firstTrigger.classList.contains("active")).toBe(false);
    expect(firstTrigger.closest(".accordion-item")?.classList.contains("active")).toBe(false);
    expect(firstPanel.hidden).toBe(true);
  });

  it("keeps uncontrolled ownership with native defaults while controlled ownership follows parent state", async () => {
    await render(
      h(
        "form",
        null,
        h(Checkbox, {
          id: "uncontrolled",
          label: "Uncontrolled",
          defaultChecked: true,
          name: "uncontrolled",
        }),
        h(Switch, {
          id: "controlled-switch",
          label: "Controlled",
          checked: false,
          name: "controlled",
        }),
      ),
    );
    const uncontrolled = host.querySelector<HTMLInputElement>("#uncontrolled")!;
    const controlled = host.querySelector<HTMLInputElement>("#controlled-switch")!;

    expect(uncontrolled.checked).toBe(true);
    expect(controlled.checked).toBe(false);
    await act(async () => uncontrolled.click());
    expect(uncontrolled.checked).toBe(false);
    await act(async () => controlled.click());
    expect(controlled.checked).toBe(false);
  });
  it("keeps select surfaces native while wiring DOM, form, ref, and state relationships", async () => {
    const selectRef = createRef<HTMLSelectElement>();
    const sortingRef = createRef<HTMLSelectElement>();
    const changes: string[] = [];

    function Harness() {
      const [value, setValue] = useState("application");
      return h(
        "form",
        { id: "select-contract-form" },
        h("span", { id: "consumer-description" }, "Consumer description"),
        h(Select, {
          ref: selectRef,
          id: "service",
          name: "service",
          label: "Service",
          hint: "Choose a service",
          title: "Service selection",
          className: "consumer-select",
          required: true,
          value,
          "aria-describedby": "consumer-description",
          "data-owner": "consumer",
          onChange: (event) => {
            changes.push(event.currentTarget.value);
            setValue(event.currentTarget.value);
          },
          options: [
            { value: "all", label: "All" },
            { value: "application", label: "Application" },
          ],
        }),
        h(SelectSize, {
          id: "sized",
          name: "sized",
          label: "Size",
          hint: "Size hint",
          options: [
            { value: "large", label: "Large" },
            { value: "small", label: "Small" },
          ],
        }),
        h(SelectState, {
          id: "invalid",
          name: "invalid",
          label: "Invalid selection",
          hint: "Fix the selection",
          disabled: true,
          required: true,
          options: [
            { value: "", label: "Choose" },
            { value: "valid", label: "Valid" },
          ],
        }),
        h(SelectSorting, {
          ref: sortingRef,
          id: "sort",
          name: "sort",
          label: "Ignored sorting label",
          hint: "Ignored sorting hint",
          title: "Sort results",
          className: "consumer-sort",
          required: true,
          defaultValue: "oldest",
          "aria-describedby": "consumer-description",
          options: [
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ],
        }),
      );
    }

    await render(h(Harness));
    const form = host.querySelector<HTMLFormElement>("#select-contract-form")!;
    const service = host.querySelector<HTMLSelectElement>("#service")!;
    const serviceGroup = service.closest<HTMLElement>(".form-group")!;
    const serviceHint = host.querySelector<HTMLParagraphElement>("#service-hint")!;

    expect(Array.from(serviceGroup.children).map((child) => child.getAttribute("class"))).toEqual([
      "form-tit",
      "form-conts",
      "form-hint",
    ]);
    expect(serviceGroup.querySelector<HTMLLabelElement>(".form-tit > label")?.htmlFor).toBe(
      "service",
    );
    expect(serviceGroup.querySelector(".form-conts > select")).toBe(service);
    expect(serviceGroup.querySelector(".form-conts")?.className).toBe("form-conts");
    expect(serviceHint.className).toBe("form-hint");
    expect(service.getAttribute("aria-describedby")).toBe("consumer-description service-hint");
    expect(selectRef.current).toBe(service);
    expect(service.className).toBe("krds-form-select consumer-select");
    expect(serviceGroup.classList.contains("consumer-select")).toBe(false);
    expect(service.name).toBe("service");
    expect(service.value).toBe("application");
    expect(service.disabled).toBe(false);
    expect(service.required).toBe(true);
    expect(service.title).toBe("Service selection");
    expect(service.dataset.owner).toBe("consumer");
    expect(Array.from(service.options).some((option) => option.hasAttribute("selected"))).toBe(
      false,
    );

    const sized = host.querySelector<HTMLSelectElement>("#sized")!;
    const sizedGroup = sized.closest<HTMLElement>(".form-group")!;
    expect(sizedGroup.querySelector<HTMLLabelElement>(".form-tit > label")?.htmlFor).toBe("sized");
    expect(sizedGroup.querySelector(".form-conts")?.className).toBe("form-conts");
    expect(sized.className).toBe("krds-form-select large");
    expect(sized.options[0]?.getAttribute("selected")).toBe("");
    expect(sized.getAttribute("aria-describedby")).toBe("sized-hint");
    expect(host.querySelector("#sized-hint")?.className).toBe("form-hint");

    const invalid = host.querySelector<HTMLSelectElement>("#invalid")!;
    const invalidGroup = invalid.closest<HTMLElement>(".form-group")!;
    const invalidHint = host.querySelector<HTMLParagraphElement>("#invalid-hint")!;
    expect(invalidGroup.querySelector<HTMLLabelElement>(".form-tit > label")?.htmlFor).toBe(
      "invalid",
    );
    expect(invalidGroup.querySelector(".form-conts")?.className).toBe("form-conts");
    expect(invalid.className).toBe("krds-form-select is-error");
    expect(invalid.getAttribute("aria-invalid")).toBe("true");
    expect(invalid.getAttribute("aria-describedby")).toBe("invalid-hint");
    expect(invalidHint.className).toBe("form-hint-invalid");
    expect(invalid.disabled).toBe(true);
    expect(invalid.required).toBe(true);
    expect(invalid.options[0]?.hasAttribute("selected")).toBe(false);

    const sorting = host.querySelector<HTMLSelectElement>("#sort")!;
    expect(sortingRef.current).toBe(sorting);
    expect(sorting.parentElement).toBe(form);
    expect(sorting.closest(".form-group")).toBeNull();
    expect(host.querySelector('label[for="sort"]')).toBeNull();
    expect(host.querySelector("#sort-hint")).toBeNull();
    expect(sorting.className).toBe("krds-form-select-sort consumer-sort");
    expect(sorting.getAttribute("aria-describedby")).toBe("consumer-description");
    expect(sorting.title).toBe("Sort results");
    expect(sorting.required).toBe(true);

    const initialData = new FormData(form);
    expect(initialData.get("service")).toBe("application");
    expect(initialData.get("sized")).toBe("large");
    expect(initialData.has("invalid")).toBe(false);
    expect(initialData.get("sort")).toBe("oldest");

    await act(async () => {
      service.value = "all";
      service.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(changes).toEqual(["all"]);
    expect(service.value).toBe("all");
    expect(new FormData(form).get("service")).toBe("all");
    expect(serviceHint.id).toBe("service-hint");
    expect(service.getAttribute("aria-describedby")).toBe("consumer-description service-hint");
  });

  it("recomputes Select recipe variants without stale or misplaced consumer classes", async () => {
    function Harness() {
      const [mode, setMode] = useState<"size" | "error" | "sorting">("size");
      return h(
        "section",
        null,
        h("span", { id: "external-description" }, "External description"),
        h(Select, {
          id: "recipe-select",
          label: "Recipe select",
          hint: "Recipe hint",
          className: "consumer-select",
          variant: mode === "size" ? "size" : mode === "error" ? "state" : "sorting",
          size: mode === "size" ? "small" : undefined,
          state: mode === "sorting" ? "default" : "error",
          "aria-describedby": "external-description",
          options: [{ value: "one", label: "One" }],
        }),
        h(
          "button",
          {
            type: "button",
            onClick: () =>
              setMode((current) =>
                current === "size" ? "error" : current === "error" ? "sorting" : "size",
              ),
          },
          "Change select variant",
        ),
      );
    }

    await render(h(Harness));
    let select = host.querySelector<HTMLSelectElement>("#recipe-select")!;
    const changeVariant = host.querySelector<HTMLButtonElement>("button")!;
    expect(select.className).toBe("krds-form-select small is-error consumer-select");
    expect(select.closest(".form-group")?.querySelector(".form-conts")?.className).toBe(
      "form-conts",
    );
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.getAttribute("aria-describedby")).toBe("external-description recipe-select-hint");
    expect(select.querySelector("option")?.getAttribute("selected")).toBe("");

    await act(async () => changeVariant.click());
    select = host.querySelector<HTMLSelectElement>("#recipe-select")!;
    expect(select.className).toBe("krds-form-select is-error consumer-select");
    expect(select.closest(".form-group")?.querySelector(".form-conts")?.className).toBe(
      "form-conts",
    );
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.querySelector("option")?.hasAttribute("selected")).toBe(false);

    await act(async () => changeVariant.click());
    select = host.querySelector<HTMLSelectElement>("#recipe-select")!;
    expect(select.className).toBe("krds-form-select-sort consumer-select");
    expect(select.closest(".form-group")).toBeNull();
    expect(host.querySelector('label[for="recipe-select"]')).toBeNull();
    expect(host.querySelector("#recipe-select-hint")).toBeNull();
    expect(select.getAttribute("aria-invalid")).toBeNull();
    expect(select.getAttribute("aria-describedby")).toBe("external-description");
    expect(select.querySelector("option")?.hasAttribute("selected")).toBe(false);
  });

  it("moves the Tab recipe active class after interaction without stale item classes", async () => {
    await render(
      h(Tab, {
        tabs: [
          { id: "first", label: "First" },
          { id: "second", label: "Second" },
        ],
        panels: {
          first: "First panel",
          second: "Second panel",
        },
        defaultTab: "first",
        full: false,
        className: "consumer-tabs",
      }),
    );

    const tabRoot = host.querySelector<HTMLDivElement>(".krds-tab-area")!;
    const listContainer = host.querySelector<HTMLDivElement>(".krds-tab-area > .tab")!;
    const items = () =>
      Array.from(
        host.querySelectorAll<HTMLLIElement>('ul[role="tablist"] > li[role="presentation"]'),
      );
    expect(tabRoot.className).toBe("krds-tab-area layer consumer-tabs");
    expect(listContainer.className).toBe("tab line");
    expect(items().map((item) => item.className)).toEqual(["active", ""]);
    expect(items()[1].hasAttribute("class")).toBe(false);
    expect(items().map((item) => item.querySelector("button")?.className)).toEqual([
      "btn-tab",
      "btn-tab",
    ]);

    await act(async () => items()[1].querySelector<HTMLButtonElement>("button")!.click());
    expect(items().map((item) => item.className)).toEqual(["", "active"]);
    expect(items()[0].hasAttribute("class")).toBe(false);
  });
  it("keeps additional tabs reactive to external and interaction-driven parent updates", async () => {
    const changes: string[] = [];
    function Harness() {
      const [selected, setSelected] = useState("first");
      const [updated, setUpdated] = useState(false);
      const tabs = updated
        ? [
            { id: "first", label: "First renamed" },
            { id: "second", label: "Second renamed" },
          ]
        : [
            { id: "first", label: "First" },
            { id: "second", label: "Second" },
          ];
      const panels = updated
        ? { first: "First panel updated", second: "Second panel updated" }
        : { first: "First panel", second: "Second panel" };

      return h(
        "section",
        null,
        h(Tab, {
          tabs,
          panels,
          selected,
          onTabChange: (next) => {
            changes.push(next);
            setSelected(next);
          },
        }),
        h(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelected("second");
              setUpdated(true);
            },
          },
          "Parent tab update",
        ),
      );
    }

    await render(h(Harness));
    const tabs = () => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const parentUpdate = Array.from(host.querySelectorAll("button")).find(
      (button) => button.textContent === "Parent tab update",
    )!;
    expect(tabs()[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("false");
    expect(tabs().every((tab) => tab.tagName === "BUTTON")).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1]);

    await act(async () => parentUpdate.click());
    expect(tabs().map((tab) => tab.textContent)).toEqual(["First renamed", "Second renamed"]);
    expect(tabs()[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, 0]);
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      "Second panel updated",
    );

    await act(async () => tabs()[0].click());
    expect(changes).toEqual(["first"]);
    expect(tabs()[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs()[1].getAttribute("aria-selected")).toBe("false");
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      "First panel updated",
    );

    await act(async () => {
      tabs()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });
    expect(changes).toEqual(["first", "second"]);
    expect(document.activeElement).toBe(tabs()[1]);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, 0]);
    expect(host.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      "Second panel updated",
    );
  });
  it("labels pagination navigation landmarks from the public prop", async () => {
    await render(
      h(Pagination, {
        current: 2,
        navigationLabel: "Inventory pages",
      }),
    );
    expect(host.querySelector('[role="navigation"]')?.getAttribute("aria-label")).toBe(
      "Inventory pages",
    );
  });
  it("keeps help panel tab roles on focusable controls", async () => {
    await render(
      h(HelpPanel, {
        open: true,
        title: "Help",
        label: "Help panel",
        tabs: [
          { id: "help", value: "help", label: "Help", panelId: "help-panel" },
          { id: "tutorial", value: "tutorial", label: "Tutorial", panelId: "tutorial-panel" },
        ],
        defaultActiveTab: "help",
        selectedLabel: "selected",
        helpTitle: "How it works",
        helpDescription: "Follow these steps.",
        tasks: [
          { id: "first", title: "First task", summary: "First details", steps: ["One", "Two"] },
          { id: "second", title: "Second task", summary: "Second details", steps: ["Three"] },
        ],
        collapseLabel: "Close",
      }),
    );
    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs).toHaveLength(2);
    expect(tabs.every((tab) => tab.tagName === "BUTTON")).toBe(true);
    expect(host.querySelectorAll('[role="tab"] button')).toHaveLength(0);
    const tabItems = Array.from(
      host.querySelectorAll<HTMLLIElement>(".krds-tab-area > .tab > ul > li"),
    );
    expect(tabItems.map((item) => item.getAttribute("role"))).toEqual([
      "presentation",
      "presentation",
    ]);
    expect(tabItems.map((item) => item.className)).toEqual(["active", ""]);
    const panels = Array.from(host.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true]);
    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(panelId ? host.querySelector(`#${panelId}`) : null).not.toBeNull();
    }
    await act(async () => tabs[1].click());
    expect(tabItems.map((item) => item.className)).toEqual(["", "active"]);
    expect(panels.map((panel) => panel.hidden)).toEqual([true, false]);
    expect(
      host.querySelectorAll('.coach-help-process .krds-info-list.decimal[role="list"]'),
    ).toHaveLength(2);
    expect(
      host.querySelectorAll('.coach-help-process .krds-info-list.decimal > li[role="listitem"]'),
    ).toHaveLength(3);
  });
  it("keeps contextual ownership while matching native dropdown and menu markup", async () => {
    await render(
      h(
        "div",
        null,
        h(ContextualHelp, {
          label: "도움말",
          title: "도움말",
          closeLabel: "닫기",
        }),
        h(LanguageSwitcher, {
          languages: [{ value: "ko", label: "한국어" }],
          label: "언어 선택",
        }),
        h(Resize, {
          options: [{ value: "default", label: "기본" }],
          label: "화면 크기",
        }),
        h(Header, {
          logoLabel: "로고",
          logoHref: "#",
          nav: [],
          menuLabel: "주 메뉴",
          utilityItems: [{ id: "utility", kind: "dropdown", label: "도구", items: [] }],
          myMenu: {
            label: "내 메뉴",
            userName: "사용자",
            timeLabel: "남은 시간",
            time: "10분",
            extendLabel: "연장",
            logoutLabel: "로그아웃",
            items: [],
          },
        }),
        h(MainMenuPc, { items: [], menuLabel: "보조 메뉴" }),
        h(MainMenuMobile, {
          id: "mobile-menu",
          items: [],
          searchTitle: "모바일 검색",
          searchLabel: "검색",
          loginLabel: "로그인",
          bottomItems: [{ label: "메뉴", href: "#" }],
        }),
      ),
    );

    const expandedControls = Array.from(
      host.querySelectorAll<HTMLButtonElement>("[aria-expanded]"),
    );
    expect(expandedControls).toHaveLength(5);
    expect(
      expandedControls.every((control) => control.getAttribute("aria-expanded") === "false"),
    ).toBe(true);
    const contextualTrigger = host.querySelector<HTMLButtonElement>(
      ".krds-contextual-help .tooltip-btn",
    )!;
    const contextualPanelId = contextualTrigger.getAttribute("aria-controls");
    expect(contextualPanelId).toBeTruthy();
    expect(
      contextualPanelId ? host.ownerDocument.getElementById(contextualPanelId) : null,
    ).not.toBeNull();
    expect(
      expandedControls
        .filter((control) => control !== contextualTrigger)
        .every((control) => !control.hasAttribute("aria-controls")),
    ).toBe(true);
    expect(host.querySelector("nav.krds-main-menu")?.getAttribute("aria-label")).toBeNull();
    expect(host.querySelector("nav.krds-main-menu .gnb-menu")?.getAttribute("aria-label")).toBe(
      "주 메뉴",
    );
    expect(
      host.querySelector("nav.krds-main-menu.sample .gnb-menu")?.getAttribute("aria-label"),
    ).toBeNull();
    const mobileSearch = host.querySelector<HTMLInputElement>("#mobile-menu input")!;
    expect(mobileSearch.getAttribute("aria-label")).toBeNull();
    expect(mobileSearch.title).toBe("모바일 검색");
    const sampleMobile = host.querySelector<HTMLElement>("#mobile-menu")!;
    expect(sampleMobile.querySelector(".gnb-login button")?.textContent).toBe(" 로그인");
    expect(sampleMobile.querySelector(".gnb-bottom a")?.textContent).toBe("메뉴 ");
    expect(sampleMobile.querySelector("#close-nav")).not.toBeNull();

    await act(async () => contextualTrigger.click());
    const contextualPopover = host.ownerDocument.getElementById(contextualPanelId!)!;
    expect(contextualTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(contextualPopover.style.display).toBe("block");
    expect(contextualPopover.style.width).toBe("360px");
  });

  it("matches pinned desktop and mobile header menu runtime relationships", async () => {
    await render(
      h(
        "div",
        null,
        h(MainMenuPc, {
          sample: false,
          menuLabel: "메인 메뉴",
          items: [
            {
              id: "desktop-top",
              label: "1Depth",
              children: [
                {
                  id: "desktop-sub",
                  label: "2Depth",
                  title: "2Depth title",
                  children: [{ id: "desktop-last", label: "Last depth", href: "#" }],
                },
                {
                  id: "desktop-sub-2",
                  label: "2Depth",
                  title: "2Depth title",
                  children: [{ id: "desktop-last-2", label: "Last depth", href: "#" }],
                },
              ],
            },
          ],
        }),
        h(MainMenuMobile, {
          id: "mobile-header",
          sample: false,
          standalone: false,
          style: { display: "none" },
          searchTitle: "찾고자 하는 메뉴명을 입력해 주세요",
          searchLabel: "검색",
          items: [
            {
              id: "mobile-panel-1",
              label: "1Depth",
              children: [
                {
                  id: "mobile-depth-2",
                  label: "2Depth",
                  children: [{ id: "mobile-depth-3", label: "3Depth", href: "#" }],
                },
              ],
            },
            { id: "mobile-panel-2", label: "Other 1Depth", children: [] },
          ],
        }),
      ),
    );

    const desktop = host.querySelector<HTMLElement>("nav.krds-main-menu:not(.sample)")!;
    expect(desktop.getAttribute("aria-label")).toBeNull();
    expect(desktop.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBe("메인 메뉴");
    const topTrigger = desktop.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const topPanel = host.ownerDocument.getElementById(topTrigger.getAttribute("aria-controls")!)!;
    expect(topTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(topTrigger.getAttribute("aria-haspopup")).toBe("true");
    expect(topPanel.classList.contains("is-open")).toBe(false);
    const subTriggers = Array.from(desktop.querySelectorAll<HTMLButtonElement>(".gnb-sub-trigger"));
    const subPanels = subTriggers.map((trigger) =>
      host.ownerDocument.getElementById(trigger.getAttribute("aria-controls")!)!,
    );
    expect(subTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
      "true",
      "false",
    ]);
    expect(subPanels.map((panel) => panel.classList.contains("active"))).toEqual([true, false]);

    await act(async () => topTrigger.click());
    expect(topTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(topPanel.classList.contains("is-open")).toBe(true);
    await act(async () => subTriggers[1].click());
    expect(subTriggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
      "false",
      "true",
    ]);
    expect(subPanels.map((panel) => panel.classList.contains("active"))).toEqual([false, true]);

    const mobile = host.querySelector<HTMLElement>("#mobile-header")!;
    expect(mobile.getAttribute("role")).toBeNull();
    expect(mobile.style.display).toBe("none");
    expect(mobile.querySelector(".menu-wrap > ul")?.getAttribute("role")).toBe("tablist");
    const mobileTriggers = Array.from(
      mobile.querySelectorAll<HTMLAnchorElement>(".gnb-main-trigger"),
    );
    expect(mobileTriggers.map((trigger) => trigger.getAttribute("role"))).toEqual(["tab", "tab"]);
    expect(mobileTriggers.map((trigger) => trigger.classList.contains("active"))).toEqual([
      true,
      false,
    ]);
    expect(mobileTriggers.map((trigger) => trigger.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
    ]);
    const mobilePanel = host.ownerDocument.getElementById(
      mobileTriggers[0].getAttribute("aria-controls")!,
    )!;
    expect(mobilePanel.getAttribute("role")).toBe("tabpanel");
    expect(mobilePanel.getAttribute("aria-labelledby")).toBe(mobileTriggers[0].id);
    expect(mobile.querySelector(".gnb-sub-trigger.has-depth3")?.getAttribute("aria-expanded")).toBe(
      "false",
    );
    expect(mobile.querySelector("input")?.getAttribute("aria-label")).toBeNull();
  });

  it("keeps critical alerts as named alert regions", async () => {
    await render(
      h(CriticalAlerts, {
        items: [{ id: "service", badgeLabel: "긴급", message: "서비스 점검 안내" }],
      }),
    );

    const alertList = host.querySelector<HTMLElement>(".krds-critical-alerts")!;
    expect(alertList.tagName).toBe("UL");
    expect(alertList.hasAttribute("role")).toBe(false);
    expect(alertList.parentElement).toMatchObject({
      className: "main-urgent-wrap",
    });
    expect(alertList.parentElement?.getAttribute("role")).toBe("alert");
    expect(alertList.querySelector(":scope > li")).not.toBeNull();
  });

  it("gives table row checkboxes unique names without duplicating visible text", async () => {
    await render(
      h(StructuredListTable, {
        columns: [
          { key: "selected", label: "선택" },
          { key: "name", label: "이름" },
        ],
        rows: [
          {
            id: "service",
            selected: false,
            selectionLabel: "서비스 선택",
            name: "서비스",
          },
          {
            id: "account",
            selected: false,
            selectionLabel: "계정 선택",
            name: "계정",
          },
        ],
        caption: "서비스 목록",
      }),
    );

    const masterCheckbox = host.querySelector<HTMLInputElement>(".krds-check-area input")!;
    expect(masterCheckbox.labels?.[0]?.textContent).toBe("전체선택");
    const checkboxes = Array.from(
      host.querySelectorAll<HTMLInputElement>('.krds-table-wrap input[type="checkbox"]'),
    );
    const accessibleNames = checkboxes.map((checkbox) => checkbox.getAttribute("aria-label"));
    expect(accessibleNames).toEqual(["서비스 선택", "계정 선택"]);
    expect(new Set(accessibleNames).size).toBe(checkboxes.length);
    expect(checkboxes.map((checkbox) => checkbox.labels?.[0]?.textContent)).toEqual(["", ""]);
    expect(host.querySelector(".krds-table-wrap")?.textContent).not.toContain("서비스 선택");
    expect(host.querySelector(".krds-table-wrap")?.textContent).not.toContain("계정 선택");
  });

  it("keeps calendar display values separate from selected options", async () => {
    await render(
      h(Calendar, {
        displayYear: 2024,
        selectedYear: 2002,
        displayMonth: 12,
        selectedMonth: 2,
        years: [2001, 2002, 2024],
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      }),
    );

    expect(host.querySelector(".btn-cal-switch.year")?.textContent).toBe("2024년");
    expect(host.querySelector(".sel.year button.active")?.textContent).toBe("2002년");
    expect(host.querySelector(".sel.month button.active")?.textContent).toBe("02월");
    expect(host.querySelector('td[class=""]')).toBeNull();
  });

  it("keeps zero-based current steps and reproduces the pinned step node structure", async () => {
    await render(
      h(StepIndicator, {
        current: 3,
        label: "단계",
        message: "현재단계",
        steps: Array.from({ length: 5 }, (_, index) => ({
          id: String(index + 1),
          label: "단계 레이블",
        })),
      }),
    );

    const items = Array.from(host.querySelectorAll<HTMLLIElement>(".krds-step-wrap > li"));
    expect(items.map((item) => item.getAttribute("class"))).toEqual([
      "done",
      "done",
      "done",
      "active",
      null,
    ]);
    const stepNumbers = items.map((item) => item.querySelector<HTMLElement>(".step")!);
    expect(stepNumbers.map((step) => step.textContent)).toEqual([
      "1단계",
      "2단계",
      "3단계",
      "4단계",
      "5단계",
    ]);
    expect(stepNumbers.every((step) => step.childNodes.length === 1)).toBe(true);
    const activeStep = items[3];
    expect(activeStep.querySelector(".sr-only")?.textContent).toBe("현재단계");
    expect(stepNumbers[3].nextSibling).toBe(activeStep.querySelector(".step-tit"));
  });

  it("associates text input error state and message with the native input", async () => {
    await render(
      h(TextInputState, {
        id: "error-field",
        label: "레이블",
        error: "에러 메시지",
        placeholder: "플레이스홀더",
        state: "error",
        type: "text",
        defaultValue: "에러",
      }),
    );

    const input = host.querySelector<HTMLInputElement>("#error-field")!;
    const message = host.querySelector<HTMLElement>(".form-hint-invalid")!;
    expect(input.labels?.[0]?.textContent).toBe("레이블");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(message.id).toBe("error-field-hint");
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
  });

  it("keeps the file upload count and suffix in one pinned text node", async () => {
    await render(
      h(FileUpload, {
        currentCount: 3,
        maxCount: 10,
        countSuffix: "개",
        selectLabel: "파일선택",
      }),
    );

    const current = host.querySelector<HTMLElement>(".file-list > .total > .current")!;
    expect(current.childNodes).toHaveLength(1);
    expect(current.firstChild?.nodeValue).toBe("3개");
    const input = host.querySelector<HTMLInputElement>(".file-upload-btn-wrap > input")!;
    const button = host.querySelector<HTMLButtonElement>(".file-upload-btn-wrap > button")!;
    expect(button.previousElementSibling).toBe(input);
    expect(button.textContent).toBe("파일선택");
    let inputClicks = 0;
    input.addEventListener("click", () => inputClicks++);
    button.click();
    expect(inputClicks).toBe(1);
  });

  it("renders date input controls and hint in the complete form root", async () => {
    await render(
      h(DateInput, {
        label: "레이블",
        hint: "도움말",
        displayYear: 2002,
        selectedYear: 2002,
        displayMonth: 12,
        selectedMonth: 12,
        years: [2001, 2002],
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      }),
    );

    expect(host.querySelector('input[placeholder="YYYY.MM.DD"]')).not.toBeNull();
    expect(host.querySelector(".form-btn-datepicker .ico-calendar")).not.toBeNull();
    expect(host.querySelector(".form-hint")?.textContent).toBe("도움말");
  });

  it("reproduces the pinned wrapper contexts without moving native refs", async () => {
    const tagLinkRef = createRef<HTMLAnchorElement>();
    const spinnerRef = createRef<HTMLDivElement>();
    await render(
      h(
        "div",
        null,
        h(Tag, { label: "태그" }),
        h(TagLink, { ref: tagLinkRef, href: "#tag", label: "태그" }),
        h(Spinner, { ref: spinnerRef, label: "로딩 중" }),
        h(InPageNavigation, { title: "이 페이지의 구성", items: [] }),
        h(RadioSize, {
          label: "사이즈 : medium",
          name: "rdo_2-1",
          size: "medium",
        }),
      ),
    );

    const tagWraps = Array.from(host.querySelectorAll<HTMLElement>(".krds-tag-wrap"));
    expect(tagWraps.map((wrapper) => wrapper.className)).toEqual([
      "krds-tag-wrap large",
      "krds-tag-wrap large",
    ]);
    expect(tagWraps[0].querySelector(":scope > span.krds-btn-tag")).not.toBeNull();
    expect(tagWraps[1].querySelector(":scope > a.krds-btn-tag.link")).toBe(tagLinkRef.current);

    const spinner = host.querySelector<HTMLElement>(".form-spinner > .krds-spinner")!;
    const spinnerInput = spinner.previousElementSibling as HTMLInputElement;
    const spinnerGroup = spinner.closest<HTMLElement>(".form-group")!;
    expect(spinner).toBe(spinnerRef.current);
    expect(spinnerInput.matches('input.krds-input[type="text"][placeholder="placeholder"]')).toBe(
      true,
    );
    expect(spinnerGroup.querySelector("label")?.htmlFor).toBe(spinnerInput.id);
    expect(spinner.parentElement?.parentElement?.className).toBe("form-conts");

    const navigationArea = host.querySelector<HTMLElement>(".krds-in-page-navigation-area")!;
    expect(navigationArea.parentElement?.className).toBe("krds-in-page-navigation-type");

    const radioControls = Array.from(
      host.querySelectorAll<HTMLElement>(".krds-check-area > .krds-form-check"),
    );
    expect(radioControls.map((control) => control.className)).toEqual([
      "krds-form-check medium",
      "krds-form-check large",
    ]);
    expect(radioControls.map((control) => control.querySelector("label")?.textContent)).toEqual([
      "사이즈 : medium",
      "사이즈 : large",
    ]);
    expect(
      radioControls.map((control) => control.querySelector("input")?.getAttribute("name")),
    ).toEqual(["rdo_2-1", "rdo_2-1"]);
  });

  it("keeps help and tutorial surfaces in the exact drawer wrapper hierarchy", async () => {
    await render(h("div", null, h(HelpPanel, { open: true }), h(TutorialPanel, { open: true })));

    const drawers = Array.from(host.querySelectorAll<HTMLElement>(".krds-help-panel"));
    expect(drawers).toHaveLength(2);
    expect(drawers.map((drawer) => drawer.className)).toEqual([
      "krds-help-panel expand",
      "krds-help-panel expand",
    ]);
    for (const drawer of drawers) {
      expect(drawer.children).toHaveLength(1);
      expect(drawer.firstElementChild?.className).toBe("help-panel-wrap");
      expect(drawer.querySelector(":scope > .help-panel-wrap > .help-conts-area")).not.toBeNull();
    }
  });

  it("does not leak label props and preserves explicit text-list roles", async () => {
    await render(
      h(
        "div",
        null,
        h(LanguageSwitcher, {
          languages: [{ value: "ko", label: "한국어" }],
          label: "언어 선택",
        }),
        h(Tooltip, { label: "툴팁", message: "설명", children: "도움말" }),
        h(Link, { label: "링크", href: "#" }, "링크"),
        h(SkipLink, { label: "건너뛰기", href: "#main" }, "본문 바로가기"),
        h(Tts, { label: "읽기", text: "읽기" }),
        h(FileUpload, {
          currentCount: 3,
          maxCount: 10,
          countSuffix: "개",
        }),
        h(TextList, {
          items: [{ id: "one", label: "하나", children: [{ id: "two", label: "둘" }] }],
        }),
      ),
    );

    const tooltipTrigger = host.querySelector<HTMLButtonElement>(".krds-tooltip")!;
    const tooltipId = tooltipTrigger.getAttribute("aria-labelledby");
    const tooltipPopover = tooltipId ? host.ownerDocument.getElementById(tooltipId) : null;
    expect(tooltipPopover?.className).toBe("krds-tooltip-popover");
    expect(tooltipPopover?.getAttribute("role")).toBe("tooltip");
    expect(tooltipPopover?.getAttribute("aria-hidden")).toBe("true");
    expect(tooltipPopover?.querySelector(".sr-only")?.textContent).toBe("툴팁");
    expect(tooltipPopover?.textContent).toBe("툴팁설명");

    await act(async () => tooltipTrigger.focus());
    expect(tooltipPopover?.classList.contains("active")).toBe(true);
    expect(tooltipPopover?.getAttribute("aria-hidden")).toBe("false");
    expect(tooltipPopover?.style.top).not.toBe("");
    expect(tooltipPopover?.style.left).not.toBe("");
    await act(async () => tooltipTrigger.blur());
    expect(tooltipPopover?.classList.contains("active")).toBe(false);
    expect(tooltipPopover?.getAttribute("aria-hidden")).toBe("true");
    expect(tooltipPopover?.style.top).toBe("");
    expect(tooltipPopover?.style.left).toBe("");

    const directText = (element: Element) =>
      Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent ?? "")
        .join("");
    const languageTrigger = host.querySelector<HTMLButtonElement>(".krds-language > .drop-btn")!;
    const link = host.querySelector<HTMLAnchorElement>("a.krds-btn.small.link")!;
    const tts = host.querySelector<HTMLButtonElement>(".krds-tts")!;
    expect(directText(languageTrigger)).toBe(" 언어 선택 ");
    expect(languageTrigger.firstElementChild?.className).toBe("svg-icon ico-global");
    expect(languageTrigger.lastElementChild?.className).toBe("svg-icon ico-toggle");
    expect(directText(tooltipTrigger)).toBe("도움말 ");
    expect(tooltipTrigger.lastElementChild?.className).toBe("svg-icon ico-angle right");
    expect(directText(link)).toBe(" ");
    expect(link.children[0]?.className).toBe("underline");
    expect(link.children[1]?.className).toBe("svg-icon ico-angle right");
    expect(directText(tts)).toBe(" ");
    expect(tts.children[0]?.className).toBe("krds-tts-icon");
    expect(tts.children[1]?.className).toBe("krds-tts-text");

    const uploadCount = host.querySelector<HTMLElement>(".file-list > .total")!;
    expect(uploadCount.firstElementChild?.textContent).toBe("3개");
    expect(uploadCount.firstElementChild?.nextSibling?.nodeType).toBe(Node.TEXT_NODE);
    expect(uploadCount.firstElementChild?.nextSibling?.textContent).toBe(" / 10개");
    expect(uploadCount.textContent).toBe("3개 / 10개");
    expect(host.querySelectorAll("[label]")).toHaveLength(0);
    expect(host.querySelector("ul.krds-info-list")?.getAttribute("role")).toBe("list");
    expect(host.querySelectorAll('li[role="listitem"]')).toHaveLength(2);
  });
  it("preserves pinned collapsed spaces at inline icon and label boundaries", async () => {
    await render(
      h(
        "div",
        null,
        h(CriticalAlerts, {
          items: [{ id: "alert", message: "공지", linkLabel: "자세히" }],
        }),
        h(FileUpload, {
          files: [
            {
              id: "file",
              name: "파일",
              deleteLabel: "삭제",
              downloadLabel: "다운로드",
              previewLabel: "바로보기",
            },
          ],
        }),
        h(Footer, {
          links: [{ id: "directions", label: "찾기" }],
        }),
        h(Header, {
          utilityItems: [
            { id: "external", kind: "link", label: "외부", href: "#" },
            { id: "dropdown", kind: "dropdown", label: "메뉴" },
            {
              id: "resize",
              kind: "resize",
              label: "화면",
              resetLabel: "초기화",
            },
          ],
          nav: [],
          myMenu: { label: "내 메뉴", logoutLabel: "로그아웃" },
        }),
        h(HelpPanel, {
          open: true,
          tabs: [{ id: "help-tab", panelId: "help-panel", value: "help", label: "도움" }],
          defaultActiveTab: "help",
          label: "도움말",
          helpTitle: "제목",
          downloadLinks: [{ id: "download", label: "다운로드" }],
          relatedGroups: [
            {
              id: "leading-icon",
              title: "연락",
              links: [{ id: "phone", label: "전화", icon: "call" }],
            },
            {
              id: "trailing-icon",
              title: "서비스",
              links: [{ id: "service", label: "서비스" }],
            },
          ],
          collapseLabel: "접기",
        }),
        h(Resize, {
          id: "standalone-resize",
          label: "화면크기",
          resetLabel: "초기화",
          options: [{ value: "md", label: "보통" }],
        }),
        h(StructuredList, {
          items: [{ id: "item", title: "타이틀", href: "#" }],
          shareLabel: "공유하기",
          favoriteLabel: "찜하기",
        }),
        h(StructuredListTable, {
          columns: [
            { key: "name", label: "이름" },
            { key: "download", label: "다운로드" },
          ],
          rows: [{ id: "row", name: "행", download: "다운로드" }],
          actions: [{ id: "action", label: "핵심버튼", icon: "down" }],
        }),
      ),
    );

    expect(host.querySelector(".krds-critical-alerts a")?.textContent).toBe("자세히 ");
    expect(
      Array.from(host.querySelectorAll(".krds-file-upload .btn-wrap button")).map(
        (button) => button.textContent,
      ),
    ).toEqual(["삭제 ", "다운로드 ", "바로보기 "]);
    expect(host.querySelector("footer .link-go a")?.textContent).toBe("찾기 ");
    expect(
      Array.from(
        host.querySelectorAll(
          "header .utility-list > li > * > .drop-btn, header .utility-list > li > a",
        ),
      ).map((item) => item.firstChild?.nodeValue),
    ).toEqual(["외부 ", "메뉴 ", "화면 "]);
    expect(host.querySelector("header .krds-resize .drop-bottom button")?.textContent).toBe(
      " 초기화",
    );
    expect(host.querySelector("header .my-drop .drop-bottom button")?.textContent).toBe(
      " 로그아웃",
    );
    expect(host.querySelector(".krds-help-panel .help-conts .help-title")?.textContent).toBe(
      "제목 도움말",
    );
    expect(
      host.querySelector(".krds-help-panel .help-conts .help-title")?.firstChild?.nodeValue,
    ).toBe("제목 ");
    expect(
      host.querySelector(".krds-help-panel .help-conts .link-list a")?.firstChild?.nodeValue,
    ).toBe("다운로드 ");
    expect(
      host.querySelector(".krds-help-panel .related-service .conts-wrap:first-child a")?.lastChild
        ?.nodeValue,
    ).toBe(" 전화");
    expect(
      host.querySelector(".krds-help-panel .related-service .conts-wrap:last-child a")?.firstChild
        ?.nodeValue,
    ).toBe("서비스 ");
    const collapse = host.querySelector(".krds-help-panel .btn-help-panel")!;
    expect(collapse.childNodes[1]?.nodeValue).toBe(" 접기 ");
    expect(collapse.textContent).toBe("도움말 접기 ");
    expect(host.querySelector("#standalone-resize > .drop-btn")?.textContent).toBe("화면크기 ");
    expect(host.querySelector("#standalone-resize .drop-bottom button")?.textContent).toBe(
      " 초기화",
    );
    expect(
      Array.from(host.querySelectorAll(".krds-structured-list .card-btn button")).map(
        (button) => button.textContent,
      ),
    ).toEqual([" 공유하기", " 찜하기"]);
    expect(
      host.querySelector(".krds-structured-list-table .side-line-ul button")?.textContent,
    ).toBe(" 핵심버튼");
    expect(host.querySelector(".krds-structured-list-table tbody .krds-btn")?.textContent).toBe(
      " 다운로드",
    );
  });

  it("does not autofocus an initially open modal but focuses, traps, and restores later opens", async () => {
    function ModalHarness() {
      const [open, setOpen] = useState(true);
      return h(
        "div",
        null,
        h("button", { id: "modal-trigger", type: "button", onClick: () => setOpen(true) }, "열기"),
        h(Modal, {
          open,
          title: "모달 제목",
          cancelLabel: "취소",
          confirmLabel: "확인",
          closeLabel: "닫기",
          onOpenChange: setOpen,
        }),
      );
    }

    await render(h(ModalHarness));
    const trigger = host.querySelector<HTMLButtonElement>("#modal-trigger")!;
    const modal = host.querySelector<HTMLElement>(".krds-modal")!;
    const modalButtons = Array.from(
      modal.querySelectorAll<HTMLButtonElement>(".modal-content button"),
    );
    expect(host.contains(document.activeElement)).toBe(false);

    await act(async () => modalButtons[0]?.click());
    trigger.focus();
    await act(async () => trigger.click());
    expect(document.activeElement).toBe(modalButtons[0]);

    modalButtons.at(-1)?.focus();
    await act(async () => {
      modalButtons
        .at(-1)
        ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    });
    expect(document.activeElement).toBe(modalButtons[0]);

    await act(async () => modalButtons[0]?.click());
    expect(document.activeElement).toBe(trigger);
  });

  it("renders TextInputIcon as the pinned native input and eye-button form group", async () => {
    const inputRef = createRef<HTMLInputElement>();
    await render(
      h(TextInputIcon, {
        ref: inputRef,
        id: "password",
        label: "레이블",
        type: "password",
        defaultValue: "1234567890",
        placeholder: "8-12자의 영문자, 숫자, 특수문자 조합",
      }),
    );

    const group = host.querySelector<HTMLElement>(".form-group")!;
    const contents = group.querySelector<HTMLElement>(":scope > .form-conts.btn-ico-wrap")!;
    const input = contents.querySelector<HTMLInputElement>(":scope > input.krds-input")!;
    const button = contents.querySelector<HTMLButtonElement>(
      ":scope > button.krds-btn.medium.icon",
    )!;
    expect(group.querySelector(".form-tit > label")?.getAttribute("for")).toBe("password");
    expect(inputRef.current).toBe(input);
    expect(input.type).toBe("password");
    expect(button.type).toBe("button");
    expect(button.querySelector(".sr-only")?.textContent).toBe("입력한 비밀번호 보기");
    expect(button.querySelector(".svg-icon.ico-pw-visible")).not.toBeNull();
  });

  it("renders fixture-provided CoachMark screen-reader labels", async () => {
    await render(
      h(CoachMark, {
        step: "2/5",
        currentStep: "2",
        totalSteps: "5",
        currentStepLabel: "Current step",
        totalStepsLabel: "Total steps",
      }),
    );
    expect(Array.from(host.querySelectorAll(".num .sr-only"), (node) => node.textContent)).toEqual([
      "Current step",
      "Total steps",
    ]);
  });
});
