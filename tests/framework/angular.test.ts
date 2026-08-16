import "@angular/compiler";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  KrdsAccordionComponent,
  KrdsCheckboxComponent,
  KrdsTextInputComponent,
} from "../../packages/angular/dist/components.js";
import {
  KrdsTabComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectStateComponent,
  KrdsSelectSortingComponent,
  KrdsTtsIconComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonWithIconComponent,
  KrdsDisclosureComponent,
  KrdsAccordionLineComponent,
  KrdsMainMenuMobileComponent,
  KrdsDateInputComponent,
  KrdsTooltipBoxComponent,
} from "../../packages/angular/dist/index.js";
import { KrdsAdditionalComponent } from "./fixtures/additional-test.component.js";

const formHarnessMetadata = {
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KrdsAccordionComponent,
    KrdsCheckboxComponent,
    KrdsTextInputComponent,
  ],
  template: `
    <form [formGroup]="form" (submit)="submit($event)">
      <krds-text-input
        id="query"
        name="query"
        label="Query"
        hint="Required"
        state="error"
        formControlName="query"
      />
      <krds-checkbox
        id="accepted"
        name="accepted"
        label="Accept"
        formControlName="accepted"
      />
      <krds-checkbox id="local" name="local" label="Local" />
      <krds-accordion [items]="items" [defaultOpen]="openItems" />
      <button type="button" data-testid="replace-accordion" (click)="replaceAccordionContent()">
        Update accordion content
      </button>
      <output data-testid="count">{{ form.controls.query.value.length }}</output>
      <output data-testid="submitted">{{ submitted }}</output>
      <button type="submit">Submit</button>
    </form>
  `,
};
const FormHarnessComponent = Component(formHarnessMetadata)(
  class FormHarnessComponent {
    form = new FormGroup({
      query: new FormControl("one", { nonNullable: true }),
      accepted: new FormControl(false, { nonNullable: true }),
    });
    items = [
      { id: "first", title: "First", content: "First content" },
      { id: "second", title: "Second", content: "Second content" },
    ];
    openItems: string[] = [];
    replaceAccordionContent() {
      this.items = [
        { id: "first", title: "First renamed", content: "Updated first content" },
        { id: "second", title: "Second", content: "Second content" },
      ];
    }
    submitted = "";
    submit(event: Event) {
      event.preventDefault();
      this.submitted = new FormData(event.target as HTMLFormElement).get("query")?.toString() ?? "";
    }
  },
);

const additionalHarnessMetadata = {
  standalone: true,
  imports: [CommonModule, KrdsTabComponent, KrdsSelectSizeComponent, KrdsTtsIconComponent],
  template: `
    <krds-tab
      [tabs]="tabs"
      [selected]="selected"
      [selectedLabel]="selectedLabel"
      (selectedChange)="select($event)"
    />
    <krds-select-size
      kind="select-size"
      [options]="selectOptions"
      [size]="selectSize"
      [state]="selectState"
    />
    <krds-tts-icon kind="tts-icon" label="Icon speech" />
    <button type="button" (click)="replaceProps()">Parent additional update</button>
  `,
};
const AdditionalHarnessComponent = Component(additionalHarnessMetadata)(
  class AdditionalHarnessComponent {
    selected = "first";
    selectedLabel = "selected";
    changes: string[] = [];
    selectSize = "small";
    selectState: "default" | "error" = "default";
    selectOptions = [{ value: "one", label: "One" }];
    tabs = [
      { id: "first", label: "First" },
      { id: "second", label: "Second" },
    ];

    select(value: string) {
      this.selected = value;
      this.changes.push(value);
    }

    replaceProps() {
      this.tabs = [
        { id: "first", label: "First renamed" },
        { id: "second", label: "Second renamed" },
      ];
      this.selectedLabel = "current";
      this.selectSize = "large";
      this.selectState = "error";
    }
  },
);

const selectHarnessMetadata = {
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KrdsSelectComponent,
    KrdsSelectSizeComponent,
    KrdsSelectStateComponent,
    KrdsSelectSortingComponent,
  ],
  template: `
    <form>
      <krds-select
        id="default-select"
        name="default-choice"
        title="Consumer title"
        label="Default label"
        hint="Default hint"
        className="consumer-select"
        [options]="defaultOptions"
        [required]="true"
        [formControl]="selection"
        (change)="nativeChanges.push($event)"
        (selectedChange)="selectedChanges.push($event)"
      />
      <krds-select-size
        id="size-select"
        name="size-choice"
        title="Size title"
        label="Size label"
        hint="Size hint"
        className="consumer-size"
        size="large"
        [options]="sizeOptions"
      />
      <krds-select-state
        id="state-select"
        name="state-choice"
        title="State title"
        label="State label"
        hint="State error"
        className="consumer-state"
        state="error"
        [options]="emptyValueOptions"
      />
      <krds-select-sorting
        id="sorting-select"
        name="sorting-choice"
        title="Sorting title"
        label="Sorting label"
        hint="Sorting hint"
        className="consumer-sorting"
        [options]="emptyValueOptions"
        [disabled]="true"
        [required]="true"
      />
    </form>
  `,
};
const SelectHarnessComponent = Component(selectHarnessMetadata)(
  class SelectHarnessComponent {
    selection = new FormControl("second", { nonNullable: true });
    defaultOptions = [
      { value: "first", label: "First" },
      { value: "second", label: "Second" },
    ];
    sizeOptions = ["large", "medium", "small"].map((label) => ({ value: "", label }));
    emptyValueOptions = ["항목1", "항목2", "항목3"].map((label) => ({ value: "", label }));
    nativeChanges: Event[] = [];
    selectedChanges: string[] = [];
  },
);

beforeAll(() => {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
});
afterEach(() => TestBed.resetTestingModule());

describe("Angular core component contracts", () => {
  it("updates CVA values, disabled state, derived count, and serialized form data after mount", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormHarnessComponent],
    }).createComponent(FormHarnessComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="query"]')!;
    const checkbox = fixture.nativeElement.querySelector<HTMLInputElement>('input[id="accepted"]')!;
    const form = fixture.nativeElement.querySelector<HTMLFormElement>("form")!;

    expect(input.value).toBe("one");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("query-hint");
    expect(checkbox.checked).toBe(false);
    expect(input.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe(
      "3",
    );
    expect(new FormData(form).get("query")).toBe("one");

    input.value = "user input";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.query.value).toBe("user input");
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe(
      "10",
    );
    expect(new FormData(form).get("query")).toBe("user input");

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.accepted.value).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(new FormData(form).get("accepted")).toBe("on");

    fixture.componentInstance.form.setValue({ query: "updated", accepted: true });
    fixture.componentInstance.form.controls.accepted.disable();
    fixture.detectChanges();
    expect(input.value).toBe("updated");
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent?.trim()).toBe(
      "7",
    );

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.submitted).toBe("updated");
  });

  it("keeps OnPush accordion ARIA state and content current through user transitions", async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormHarnessComponent],
    }).createComponent(FormHarnessComponent);
    fixture.componentInstance.openItems = ["first"];
    fixture.detectChanges();
    const trigger = () =>
      fixture.nativeElement.querySelector<HTMLButtonElement>(
        'button[aria-controls="krds-accordion-panel-first"]',
      )!;
    const panel = () =>
      fixture.nativeElement.querySelector<HTMLElement>(
        '[id="krds-accordion-panel-first"][role="region"]',
      )!;
    const item = () => trigger().closest<HTMLElement>(".accordion-item")!;

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
    expect(panel().textContent?.trim()).toBe("First content");
    expect(item().classList.contains("active")).toBe(true);
    expect(trigger().classList.contains("active")).toBe(true);
    expect(panel().classList.contains("show")).toBe(true);

    trigger().click();
    await fixture.whenStable();
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
    expect(item().classList.contains("active")).toBe(false);
    expect(trigger().classList.contains("active")).toBe(false);
    expect(panel().classList.contains("show")).toBe(false);

    fixture.nativeElement
      .querySelector<HTMLButtonElement>('[data-testid="replace-accordion"]')!
      .click();
    await fixture.whenStable();
    expect(trigger().textContent?.trim()).toBe("First renamed");
    expect(panel().textContent?.trim()).toBe("Updated first content");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);

    trigger().click();
    await fixture.whenStable();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
    expect(panel().textContent?.trim()).toBe("Updated first content");
    expect(item().classList.contains("active")).toBe(true);
    expect(trigger().classList.contains("active")).toBe(true);
    expect(panel().classList.contains("show")).toBe(true);
  });

  it("keeps an unbound checkbox local while a controlled CVA follows external form state", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormHarnessComponent],
    }).createComponent(FormHarnessComponent);
    fixture.detectChanges();
    const controlled =
      fixture.nativeElement.querySelector<HTMLInputElement>('input[id="accepted"]')!;
    const uncontrolled =
      fixture.nativeElement.querySelector<HTMLInputElement>('input[id="local"]')!;
    const form = fixture.nativeElement.querySelector<HTMLFormElement>("form")!;
    const control = fixture.componentInstance.form.controls.accepted;

    expect(control.value).toBe(false);
    expect(controlled.checked).toBe(false);
    expect(uncontrolled.checked).toBe(false);

    uncontrolled.click();
    fixture.detectChanges();
    expect(uncontrolled.checked).toBe(true);
    expect(control.value).toBe(false);
    expect(new FormData(form).get("local")).toBe("on");

    control.setValue(true);
    fixture.detectChanges();
    expect(controlled.checked).toBe(true);
    expect(uncontrolled.checked).toBe(true);

    control.setValue(false);
    fixture.detectChanges();
    expect(controlled.checked).toBe(false);
    expect(uncontrolled.checked).toBe(true);
  });
  it("updates additional component inputs after mount and emits user selection outcomes", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AdditionalHarnessComponent],
    }).createComponent(AdditionalHarnessComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".krds-tab-area .tab.line.full")).not.toBeNull();
    const select = fixture.nativeElement.querySelector<HTMLSelectElement>("select")!;
    expect(select.className).toBe("krds-form-select small");
    const tabItems = () =>
      Array.from(fixture.nativeElement.querySelectorAll<HTMLLIElement>(".krds-tab-area li"));
    expect(tabItems()[0].className).toBe("active");
    expect(tabItems()[1].getAttribute("class")).toBeNull();
    const tabs = () =>
      Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]'));
    const parentUpdate = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.trim() === "Parent additional update")!;
    const ttsButton = fixture.nativeElement.querySelector<HTMLButtonElement>("button.krds-tts")!;

    expect(tabs()[0].textContent).toContain("First");
    expect(tabs()[1].textContent).toContain("Second");
    expect(fixture.nativeElement.querySelectorAll('li[role="tab"]')).toHaveLength(0);
    expect(ttsButton.getAttribute("aria-label")).toBeNull();
    expect(ttsButton.querySelector(".sr-only")?.textContent).toBe("Icon speech");

    parentUpdate.click();
    fixture.detectChanges();
    expect(tabs()[0].textContent).toContain("First renamed");
    expect(tabs()[0].textContent).toContain("current");
    expect(tabs()[1].textContent).toContain("Second renamed");
    expect(select.className).toBe("krds-form-select large is-error");

    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual(["second"]);
    expect(fixture.componentInstance.selected).toBe("second");
    expect(
      fixture.nativeElement.querySelector('[data-testid="selected-tab"]')?.textContent?.trim(),
    ).toBe("second");
    expect(tabItems()[0].getAttribute("class")).toBeNull();
    expect(tabItems()[1].className).toBe("active");
  });

  it("renders each select alias with the pinned ancestor and selected-option surface", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SelectHarnessComponent],
    }).createComponent(SelectHarnessComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const defaultGroup = root.querySelector<HTMLElement>("krds-select > .form-group")!;
    const defaultSelect = defaultGroup.querySelector<HTMLSelectElement>("select")!;
    const defaultHint = defaultGroup.querySelector<HTMLElement>(":scope > p")!;
    expect(
      defaultGroup.querySelector<HTMLLabelElement>(":scope > .form-tit > label")?.htmlFor,
    ).toBe("default-select");
    expect(defaultSelect.parentElement?.className).toBe("form-conts");
    expect(defaultSelect.className).toBe("krds-form-select consumer-select");
    expect(defaultSelect.getAttribute("aria-describedby")).toBe("default-select-hint");
    expect(defaultHint.id).toBe("default-select-hint");
    expect(defaultHint.className).toBe("form-hint");
    expect(defaultHint.textContent?.trim()).toBe("Default hint");
    expect(
      Array.from(defaultSelect.options).map((option) => option.getAttribute("selected")),
    ).toEqual([null, null]);

    const sizeGroup = root.querySelector<HTMLElement>("krds-select-size > .form-group")!;
    const sizeSelect = sizeGroup.querySelector<HTMLSelectElement>("select")!;
    expect(sizeGroup.querySelector<HTMLLabelElement>(":scope > .form-tit > label")?.htmlFor).toBe(
      "size-select",
    );
    expect(sizeSelect.parentElement?.className).toBe("form-conts");
    expect(sizeSelect.className).toBe("krds-form-select large consumer-size");
    expect(sizeSelect.getAttribute("aria-describedby")).toBe("size-select-hint");
    expect(sizeGroup.querySelector<HTMLElement>(":scope > p")?.className).toBe("form-hint");
    expect(Array.from(sizeSelect.options).map((option) => option.getAttribute("selected"))).toEqual(
      ["", null, null],
    );

    const stateGroup = root.querySelector<HTMLElement>("krds-select-state > .form-group")!;
    const stateSelect = stateGroup.querySelector<HTMLSelectElement>("select")!;
    const stateHint = stateGroup.querySelector<HTMLElement>(":scope > p")!;
    expect(stateGroup.querySelector<HTMLLabelElement>(":scope > .form-tit > label")?.htmlFor).toBe(
      "state-select",
    );
    expect(stateSelect.parentElement?.className).toBe("form-conts");
    expect(stateSelect.className).toBe("krds-form-select is-error consumer-state");
    expect(stateSelect.getAttribute("aria-invalid")).toBe("true");
    expect(stateSelect.getAttribute("aria-describedby")).toBe("state-select-hint");
    expect(stateHint.id).toBe("state-select-hint");
    expect(stateHint.className).toBe("form-hint-invalid");
    expect(
      Array.from(stateSelect.options).map((option) => option.getAttribute("selected")),
    ).toEqual([null, null, null]);

    const sortingHost = root.querySelector<HTMLElement>("krds-select-sorting")!;
    const sortingSelect = sortingHost.querySelector<HTMLSelectElement>(":scope > select")!;
    expect(sortingSelect.parentElement).toBe(sortingHost);
    expect(sortingHost.querySelector(".form-group")).toBeNull();
    expect(sortingHost.querySelector("label")).toBeNull();
    expect(sortingHost.querySelector("p")).toBeNull();
    expect(sortingSelect.className).toBe("krds-form-select-sort consumer-sorting");
    expect(sortingSelect.getAttribute("aria-describedby")).toBeNull();
    expect(
      Array.from(sortingSelect.options).map((option) => option.getAttribute("selected")),
    ).toEqual([null, null, null]);
  });

  it("keeps select CVA, native change and blur, form data, and consumer attributes on the control", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SelectHarnessComponent],
    }).createComponent(SelectHarnessComponent);
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector<HTMLFormElement>("form")!;
    const select = fixture.nativeElement.querySelector<HTMLSelectElement>("krds-select select")!;
    let nativeBlurs = 0;
    select.addEventListener("blur", () => {
      nativeBlurs += 1;
    });

    expect(select.id).toBe("default-select");
    expect(select.name).toBe("default-choice");
    expect(select.title).toBe("Consumer title");
    expect(select.required).toBe(true);
    expect(select.disabled).toBe(false);
    expect(select.value).toBe("second");
    expect(new FormData(form).get("default-choice")).toBe("second");

    select.value = "first";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.value).toBe("first");
    expect(fixture.componentInstance.selectedChanges).toEqual(["first"]);
    expect(fixture.componentInstance.nativeChanges).toHaveLength(1);
    expect(fixture.componentInstance.nativeChanges[0]?.target).toBe(select);
    expect(new FormData(form).get("default-choice")).toBe("first");

    select.dispatchEvent(new Event("blur"));
    fixture.detectChanges();
    expect(nativeBlurs).toBe(1);
    expect(fixture.componentInstance.selection.touched).toBe(true);

    fixture.componentInstance.selection.disable();
    fixture.detectChanges();
    expect(select.disabled).toBe(true);

    const sorting = fixture.nativeElement.querySelector<HTMLSelectElement>(
      "krds-select-sorting > select",
    )!;
    expect(sorting.id).toBe("sorting-select");
    expect(sorting.name).toBe("sorting-choice");
    expect(sorting.title).toBe("Sorting title");
    expect(sorting.required).toBe(true);
    expect(sorting.disabled).toBe(true);
  });
  it("gives structured-list-table row checkboxes unique names without duplicate label text", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    fixture.componentRef.setInput("kind", "structured-list-table");
    fixture.componentRef.setInput("caption", "Document list");
    fixture.componentRef.setInput("columns", [
      { key: "selected", label: "Select" },
      { key: "title", label: "Title" },
    ]);
    fixture.componentRef.setInput("rows", [
      {
        id: "first",
        selected: false,
        title: "First document",
        selectionLabel: "Select first document",
      },
      {
        id: "second",
        selected: true,
        title: "Second document",
        selectionLabel: "Select second document",
      },
    ]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const checkboxes = Array.from(
      root.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'),
    );
    const names = checkboxes.map((checkbox) => checkbox.getAttribute("aria-label"));
    const labels = checkboxes.map((checkbox) =>
      root.querySelector<HTMLLabelElement>(`label[for="${checkbox.id}"]`),
    );

    expect(names).toEqual(["Select first document", "Select second document"]);
    expect(new Set(names).size).toBe(checkboxes.length);
    expect(labels.map((label) => label?.htmlFor)).toEqual(
      checkboxes.map((checkbox) => checkbox.id),
    );
    expect(labels.map((label) => label?.textContent)).toEqual(["", ""]);
    expect(root.querySelectorAll("tbody label .sr-only")).toHaveLength(0);
    expect(root.textContent).not.toContain("Select first document");
    expect(root.textContent).not.toContain("Select second document");
  });

  it("reproduces upstream wrapper contexts for tags, spinner, in-page navigation, and radio sizes", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    const update = (inputs: Record<string, unknown>): void => {
      for (const [name, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(name, value);
      }
      fixture.detectChanges();
    };

    update({ kind: "tag", label: "태그", message: "삭제" });
    const tag = fixture.nativeElement.querySelector<HTMLElement>(".krds-btn-tag")!;
    expect(tag.parentElement?.className).toBe("krds-tag-wrap large");

    update({ kind: "tag-link", href: "#" });
    const tagLink = fixture.nativeElement.querySelector<HTMLAnchorElement>("a.krds-btn-tag.link")!;
    expect(tagLink.parentElement?.className).toBe("krds-tag-wrap large");

    update({ kind: "spinner", id: "spinner", label: "로딩 중" });
    const formSpinner = fixture.nativeElement.querySelector<HTMLElement>(
      ".form-group > .form-conts > .form-spinner",
    )!;
    const spinnerInput = formSpinner.querySelector<HTMLInputElement>(
      ':scope > input[type="text"].krds-input',
    )!;
    const spinner = formSpinner.querySelector<HTMLElement>(
      ':scope > .krds-spinner[role="status"]',
    )!;
    expect(formSpinner.previousElementSibling).toBeNull();
    expect(spinnerInput.id).toBe("spinner-input");
    expect(spinnerInput.placeholder).toBe("placeholder");
    expect(spinnerInput.nextElementSibling).toBe(spinner);
    expect(spinner.textContent?.trim()).toBe("로딩 중");

    update({
      kind: "in-page-navigation",
      title: "이 페이지의 구성",
      pageTitle: "장애아동수당",
      actionLabel: "온라인 신청하기",
      items: [{ id: "overview", label: "서비스 개요", href: "#overview" }],
    });
    const navigationArea = fixture.nativeElement.querySelector<HTMLElement>(
      ".krds-in-page-navigation-area",
    )!;
    expect(navigationArea.parentElement?.className).toBe("krds-in-page-navigation-type");

    update({
      kind: "radio-size",
      id: "radio-size",
      label: "사이즈 : medium",
      name: "rdo_2-1",
      value: "",
    });
    const radioArea = fixture.nativeElement.querySelector<HTMLElement>(".krds-check-area")!;
    const radioControls = Array.from(
      radioArea.querySelectorAll<HTMLElement>(":scope > .krds-form-check"),
    );
    const radioInputs = Array.from(
      radioArea.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );
    const radioLabels = Array.from(radioArea.querySelectorAll<HTMLLabelElement>("label"));
    expect(radioControls.map((control) => control.className)).toEqual([
      "krds-form-check medium",
      "krds-form-check large",
    ]);
    expect(radioInputs.map((input) => input.name)).toEqual(["rdo_2-1", "rdo_2-1"]);
    expect(radioLabels.map((label) => label.textContent)).toEqual([
      "사이즈 : medium",
      "사이즈 : large",
    ]);
    expect(radioLabels.map((label) => label.htmlFor)).toEqual(radioInputs.map((input) => input.id));
  });

  it("preserves one literal text separator at inline icon boundaries", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    const update = (inputs: Record<string, unknown>): void => {
      for (const [name, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(name, value);
      }
      fixture.detectChanges();
    };
    const directText = (element: Element): string =>
      Array.from(element.childNodes)
        .filter((node) => node.nodeType === 3)
        .map((node) => node.textContent ?? "")
        .join("");

    update({
      kind: "language-switcher",
      label: "언어 변경",
      options: [{ value: "ko", label: "한국어" }],
      selected: "ko",
    });
    const languageTrigger = fixture.nativeElement.querySelector<HTMLButtonElement>(
      ".krds-language > .drop-btn",
    )!;
    expect(directText(languageTrigger)).toBe(" 언어 변경 ");
    expect(Array.from(languageTrigger.children).map((child) => child.className)).toEqual([
      "svg-icon ico-global",
      "svg-icon ico-toggle",
    ]);

    update({ kind: "link", label: "기본 링크", href: "#" });
    const link = fixture.nativeElement.querySelector<HTMLAnchorElement>("a.krds-btn.link")!;
    expect(directText(link)).toBe(" ");
    expect(Array.from(link.children).map((child) => child.className)).toEqual([
      "underline",
      "svg-icon ico-angle right",
    ]);

    update({
      kind: "critical-alerts",
      items: [
        {
          id: "danger",
          title: "긴급 공지 내용 표시",
          href: "#",
          tone: "danger",
          badgeLabel: "긴급",
          linkLabel: "자세히 보기",
        },
      ],
    });
    const criticalLink =
      fixture.nativeElement.querySelector<HTMLAnchorElement>(".critical-ban > a")!;
    expect(directText(criticalLink)).toBe(" ");
    expect(Array.from(criticalLink.children).map((child) => child.className)).toEqual([
      "m-hide",
      "svg-icon ico-angle right",
    ]);

    update({
      kind: "structured-list-table",
      id: "structured-spacing",
      caption: "Document list",
      actions: [
        { id: "first-action", icon: "down", label: "첫 번째 핵심버튼" },
        { id: "second-action", icon: "down", label: "두 번째 핵심버튼" },
      ],
      columns: [
        { key: "title", label: "Title" },
        { key: "download", label: "Download" },
      ],
      rows: [
        { title: "First document", download: "첫 번째 다운로드" },
        { title: "Second document", download: "두 번째 다운로드" },
      ],
    });
    const tableActions = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>(".side-line-ul button"),
    );
    const tableDownloads = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>(".krds-table-wrap tbody button"),
    );
    expect(tableActions.map(directText)).toEqual([" 첫 번째 핵심버튼 ", " 두 번째 핵심버튼 "]);
    expect(tableDownloads.map(directText)).toEqual([" 첫 번째 다운로드 ", " 두 번째 다운로드 "]);
    expect(
      [...tableActions, ...tableDownloads].every(
        (button) => button.firstElementChild?.tagName === "I",
      ),
    ).toBe(true);

    update({
      kind: "tooltip",
      id: "tooltip-boundary",
      label: "tooltip-horizontal",
      message: "툴팁의 기본 설정입니다",
    });
    const tooltip = fixture.nativeElement.querySelector<HTMLButtonElement>("button.krds-tooltip")!;
    expect(directText(tooltip).trimStart()).toBe("tooltip-horizontal ");
    expect(tooltip.lastElementChild?.className).toBe("svg-icon ico-angle right");

    update({ kind: "tts", label: "레이블", size: "medium" });
    const tts = fixture.nativeElement.querySelector<HTMLButtonElement>("button.krds-tts")!;
    expect(directText(tts).replace(/\s+/g, " ")).toBe(" ");
    expect(Array.from(tts.children).map((child) => child.className)).toEqual([
      "krds-tts-icon",
      "krds-tts-text",
    ]);

    update({ kind: "tts-size", label: "Xsmall TTS", size: "xsmall" });
    const sizedTts = fixture.nativeElement.querySelector<HTMLButtonElement>("button.krds-tts")!;
    expect(directText(sizedTts).replace(/\s+/g, " ")).toBe(" ");
  });

  it("preserves corrected control metadata when dropdown and contextual-help triggers receive focus", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    const update = (inputs: Record<string, unknown>): void => {
      for (const [name, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(name, value);
      }
      fixture.detectChanges();
    };
    const focus = (selector: string): HTMLButtonElement => {
      const trigger = fixture.nativeElement.querySelector<HTMLButtonElement>(selector)!;
      trigger.dispatchEvent(new Event("focus"));
      fixture.detectChanges();
      return trigger;
    };

    update({ kind: "contextual-help", id: "contextual", label: "도움말" });
    const contextualTrigger = focus(".krds-contextual-help .tooltip-btn");
    const contextualPopover = fixture.nativeElement.querySelector<HTMLElement>(
      '.krds-contextual-help [role="tooltip"]',
    )!;
    expect(contextualTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(contextualTrigger.getAttribute("aria-controls")).toBe(contextualPopover.id);

    const languages = [
      { value: "ko", label: "한국어" },
      { value: "en", label: "English" },
    ];
    update({
      kind: "language-switcher",
      label: "언어 변경",
      options: languages,
      selected: "ko",
      selectedLabel: "선택됨",
    });
    const languageTrigger = focus(".krds-language .drop-btn");
    const languageStatus = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".krds-language .item-link .sr-only"),
    );
    expect(languageTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(languageStatus).toHaveLength(2);
    expect(languageStatus.map((status) => status.textContent?.trim())).toEqual(["선택됨", ""]);

    update({ kind: "language-switcher-page" });
    const pageTrigger = focus(".krds-language .drop-btn");
    const pageLinks = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLAnchorElement>(".krds-language .item-link"),
    );
    expect(pageTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(pageLinks).toHaveLength(1);
    expect(pageLinks.every((link) => link.querySelector(".sr-only") !== null)).toBe(true);

    update({
      kind: "resize",
      label: "화면크기",
      options: [
        { value: "sm", label: "작게" },
        { value: "md", label: "보통" },
      ],
      selected: "md",
      selectedLabel: "선택됨",
    });
    const resizeTrigger = focus(".krds-resize .drop-btn");
    const resizeStatus = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".krds-resize .item-link .sr-only"),
    );
    expect(resizeTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(resizeStatus).toHaveLength(2);
    expect(resizeStatus.map((status) => status.textContent?.trim())).toEqual(["", "선택됨"]);
  });

  it("names the pagination landmark and connects text-input hints and error state", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    const update = (inputs: Record<string, unknown>): void => {
      for (const [name, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(name, value);
      }
      fixture.detectChanges();
    };

    update({
      kind: "pagination",
      navigationLabel: "페이지 이동",
      items: [1, 2],
      current: 1,
      previousLabel: "이전",
      nextLabel: "다음",
    });
    const pagination = fixture.nativeElement.querySelector<HTMLElement>(".krds-pagination")!;
    expect(pagination.getAttribute("role")).toBe("navigation");
    expect(pagination.getAttribute("aria-label")).toBe("페이지 이동");

    update({
      kind: "text-input-size",
      id: "sized-input",
      label: "레이블",
      hint: "도움말",
      placeholder: "플레이스홀더",
      size: "small",
      state: "default",
      type: "text",
      value: "",
    });
    const sizedInput = fixture.nativeElement.querySelector<HTMLInputElement>("#sized-input")!;
    const sizedHint = fixture.nativeElement.querySelector<HTMLElement>("#sized-input-hint")!;
    expect(sizedInput.getAttribute("aria-describedby")).toBe(sizedHint.id);
    expect(sizedInput.getAttribute("aria-invalid")).toBeNull();
    expect(sizedHint.className).toBe("form-hint");

    update({
      kind: "text-input-state",
      id: "error-input",
      hint: "에러 메시지",
      state: "error",
      value: "에러",
    });
    const errorInput = fixture.nativeElement.querySelector<HTMLInputElement>("#error-input")!;
    const errorHint = fixture.nativeElement.querySelector<HTMLElement>("#error-input-hint")!;
    expect(errorInput.getAttribute("aria-describedby")).toBe(errorHint.id);
    expect(errorInput.getAttribute("aria-invalid")).toBe("true");
    expect(errorHint.className).toBe("form-hint-invalid");
  });

  it("renders the pinned text-input-icon wrapper and password action", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    fixture.componentRef.setInput("kind", "text-input-icon");
    fixture.componentRef.setInput("id", "login_pw");
    fixture.componentRef.setInput("label", "레이블");
    fixture.componentRef.setInput("type", "password");
    fixture.componentRef.setInput("value", "1234567890");
    fixture.componentRef.setInput("placeholder", "8-12자의 영문자, 숫자, 특수문자 조합");
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector<HTMLElement>(".form-group")!;
    const contents = group.querySelector<HTMLElement>(":scope > .form-conts.btn-ico-wrap")!;
    const input = contents.querySelector<HTMLInputElement>(":scope > input.krds-input")!;
    const button = contents.querySelector<HTMLButtonElement>(
      ":scope > button.krds-btn.medium.icon",
    )!;
    const label = group.querySelector<HTMLLabelElement>(":scope > .form-tit > label")!;

    expect(Array.from(group.children).map((child) => child.className)).toEqual([
      "form-tit",
      "form-conts btn-ico-wrap",
    ]);
    expect(
      Array.from(contents.children).map((child) => `${child.tagName}:${child.className}`),
    ).toEqual(["INPUT:krds-input", "BUTTON:krds-btn medium icon"]);
    expect(label.htmlFor).toBe(input.id);
    expect(label.textContent).toBe("레이블");
    expect(input.type).toBe("password");
    expect(input.value).toBe("1234567890");
    expect(input.placeholder).toBe("8-12자의 영문자, 숫자, 특수문자 조합");
    expect(button.type).toBe("button");
    expect(button.querySelector(".sr-only")?.textContent).toBe("입력한 비밀번호 보기");
    expect(button.querySelector("i")?.className).toBe("svg-icon ico-pw-visible");
  });

  it("keeps the critical-alert list native and file-upload rows and count spacing exact", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    const update = (inputs: Record<string, unknown>): void => {
      for (const [name, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(name, value);
      }
      fixture.detectChanges();
    };

    update({
      kind: "critical-alerts",
      items: [
        {
          id: "danger",
          title: "긴급 공지 내용 표시",
          href: "#",
          tone: "danger",
          badgeLabel: "긴급",
          linkLabel: "자세히 보기",
        },
      ],
    });
    const alerts = fixture.nativeElement.querySelector<HTMLElement>(".krds-critical-alerts")!;
    expect(alerts.tagName).toBe("UL");
    expect(fixture.nativeElement.querySelector("div.krds-critical-alerts")).toBeNull();
    expect(alerts.querySelectorAll(":scope > li")).toHaveLength(1);
    expect(alerts.getAttribute("role")).toBeNull();
    expect(alerts.parentElement?.className).toBe("main-urgent-wrap");
    expect(alerts.parentElement?.getAttribute("role")).toBe("alert");

    const commonName = "위임장(주민등록법 시행령 별지 제15호의2호서식) [hwp, 17KB] ";
    update({
      kind: "file-upload",
      inputId: "fileu-upload",
      name: "myFile",
      currentCount: 3,
      maxCount: 10,
      countSuffix: "개",
      files: [
        { id: "uploading", name: commonName, status: "uploading", statusLabel: "업로드 중" },
        { id: "complete", name: commonName, status: "complete", statusLabel: "업로드 완료" },
        { id: "deletable", name: commonName, status: "deletable", deleteLabel: "삭제" },
        {
          id: "error",
          name: "전입재등록신고서 [hwp, 17KB]",
          status: "error",
          deleteLabel: "삭제",
          errors: [
            "등록 가능한 파일 용량을 초과하였습니다.",
            "20MB 미만의 파일만 등록할 수 있습니다.",
          ],
        },
        {
          id: "downloadable",
          name: commonName,
          status: "downloadable",
          downloadLabel: "다운로드",
          previewLabel: "바로보기",
        },
      ],
    });
    const total = fixture.nativeElement.querySelector<HTMLElement>(".file-list > .total")!;
    const rows = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLLIElement>(".upload-list > li"),
    );
    expect(total.textContent?.trimEnd()).toBe("3개 / 10개");
    expect(total.querySelector(".current")?.nextSibling?.textContent?.trimEnd()).toBe(" / 10개");
    const uploadInput = fixture.nativeElement.querySelector<HTMLInputElement>(
      ".file-upload-btn-wrap > input",
    )!;
    const uploadButton = fixture.nativeElement.querySelector<HTMLButtonElement>(
      ".file-upload-btn-wrap > button",
    )!;
    expect(uploadButton.previousElementSibling).toBe(uploadInput);
    let uploadInputClicks = 0;
    uploadInput.addEventListener("click", () => uploadInputClicks++);
    uploadButton.click();
    expect(uploadInputClicks).toBe(1);
    expect(rows).toHaveLength(5);
    expect(rows[3].className).toBe("is-error");
    expect(rows[4].querySelector(".file-info")?.className).toBe("file-info m-column");
    expect(
      rows.slice(0, 3).every((row) => row.querySelector(".file-name")?.textContent?.endsWith(" ")),
    ).toBe(true);
    expect(rows[3].querySelectorAll(".file-hint-invalid br")).toHaveLength(1);
  });
  it("keeps calendar display state distinct from selected options and native disabled state", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    Object.assign(fixture.componentInstance, {
      kind: "calendar",
      id: "calendar",
      displayYear: 2024,
      displayMonth: 12,
      selectedYear: 2002,
      selectedMonth: 12,
      years: [2001, 2002, 2003],
      disabledYears: [2003],
      disabledMonths: [2],
      leadingDays: 5,
      previousMonthDayCount: 30,
      dayCount: 31,
      disabledDays: [13],
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      calendarLabel: "달력",
      previousMonthLabel: "이전 달",
      nextMonthLabel: "다음 달",
      yearSelectLabel: "연도 선택",
      monthSelectLabel: "월 선택",
      todayLabel: "오늘",
      cancelLabel: "취소",
      confirmLabel: "확인",
    });
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector<HTMLElement>(".krds-calendar-area")!;
    const yearSwitch = root.querySelector<HTMLButtonElement>(".btn-cal-switch.year")!;
    const monthSwitch = root.querySelector<HTMLButtonElement>(".btn-cal-switch.month")!;
    const yearOptions = Array.from(
      root.querySelectorAll<HTMLButtonElement>(".calendar-year-wrap button"),
    );
    const monthOptions = Array.from(
      root.querySelectorAll<HTMLButtonElement>(".calendar-mon-wrap button"),
    );

    expect(yearSwitch.textContent?.trim()).toBe("2024년");
    expect(monthSwitch.textContent?.trim()).toBe("12월");
    expect(
      yearOptions.find((option) => option.classList.contains("active"))?.textContent?.trim(),
    ).toBe("2002년");
    expect(monthOptions.every((option) => option.getAttribute("role") === "option")).toBe(true);
    expect(
      yearOptions
        .find((option) => option.textContent?.trim() === "2003년")
        ?.getAttribute("disabled"),
    ).toBe("");
    expect(
      monthOptions
        .find((option) => option.textContent?.trim() === "02월")
        ?.getAttribute("disabled"),
    ).toBe("");
    expect(root.querySelector<HTMLTableCellElement>("td.old")?.classList.contains("disabled")).toBe(
      false,
    );
    expect(root.querySelector<HTMLButtonElement>("td.old .btn-set-date")?.disabled).toBe(true);
    expect(root.querySelector<HTMLButtonElement>("td.new .btn-set-date")?.disabled).toBe(true);
    expect(
      root.querySelector<HTMLButtonElement>('[data-date="2024.12.13"] .btn-set-date')?.disabled,
    ).toBe(true);

    monthSwitch.click();
    fixture.detectChanges();
    expect(monthSwitch.getAttribute("aria-expanded")).toBe("true");
    monthOptions.find((option) => option.textContent?.trim() === "11월")!.click();
    fixture.detectChanges();
    expect(root.querySelector("caption")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "2024년 11월",
    );
    expect(
      root
        .querySelector<HTMLButtonElement>(".calendar-mon-wrap button.active")
        ?.textContent?.trim(),
    ).toBe("11월");
  });

  it("keeps date input label, hint, calendar hierarchy, and CVA value synchronized", () => {
    const harness = Component({
      standalone: true,
      imports: [ReactiveFormsModule, KrdsDateInputComponent],
      template: `
        <krds-date-input
          id="cal"
          label="레이블"
          hint="도움말"
          [formControl]="date"
          [displayYear]="2024"
          [displayMonth]="12"
          [selectedYear]="2002"
          [selectedMonth]="12"
          [years]="years"
          [weekdays]="weekdays"
        />
      `,
    })(
      class {
        date = new FormControl("20241225", { nonNullable: true });
        years = [2001, 2002, 2003];
        weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      },
    );
    const fixture = TestBed.configureTestingModule({ imports: [harness] }).createComponent(harness);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector<HTMLElement>(".form-group")!;
    const input = group.querySelector<HTMLInputElement>("input.krds-input.datepicker.cal")!;
    expect(group.querySelector<HTMLLabelElement>(":scope > .form-tit label")?.htmlFor).toBe("cal");
    expect(
      group.querySelector(":scope > .form-conts > .form-conts.calendar-conts > .calendar-input"),
    ).not.toBeNull();
    expect(group.querySelector(":scope > .form-hint")?.textContent?.trim()).toBe("도움말");
    expect(input.value).toBe("20241225");

    input.value = "20241226";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.date.value).toBe("20241226");
  });

  it("owns tab roles on native buttons and synchronizes panels through selection", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    Object.assign(fixture.componentInstance, {
      kind: "tab",
      selected: "first",
      message: "선택됨",
      panelTitle: "탭 영역 타이틀",
      tabs: [
        { id: "first", label: "첫 번째" },
        { id: "second", label: "두 번째" },
      ],
      panels: { first: "첫 번째 영역", second: "두 번째 영역" },
    });
    fixture.detectChanges();

    const items = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLLIElement>(".krds-tab-area li"),
    );
    const tabs = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
        '.krds-tab-area button[role="tab"]',
      ),
    );
    const panels = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>('.krds-tab-area [role="tabpanel"]'),
    );
    expect(items.map((item) => item.getAttribute("role"))).toEqual([
      "presentation",
      "presentation",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["0", "-1"]);
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["true", "false"]);
    expect(tabs[0].textContent).toContain("선택됨");
    expect(panels).toHaveLength(2);
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[0].getAttribute("aria-labelledby")).toBe(tabs[0].id);
    expect(panels[0].querySelector("h3")?.textContent?.trim()).toBe("탭 영역 타이틀");
    expect(panels[0].textContent).toContain("첫 번째 영역");

    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toBe("second");
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["-1", "0"]);
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  it("keeps help and tutorial drawer structure, tabs, hidden panels, disclosures, and collapse state synchronized", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    Object.assign(fixture.componentInstance, {
      kind: "help-panel",
      open: true,
      activeTab: "help",
      label: "도움말",
      selectedLabel: "선택됨",
      collapseLabel: "접어두기",
      tabs: [
        { id: "helperTab01", label: "도움", panelId: "helperTabpanel01", value: "help" },
        {
          id: "helperTab02",
          label: "따라하기",
          panelId: "helperTabpanel02",
          value: "tutorial",
        },
      ],
      tasks: [{ title: "Task 1", summary: "전체 1단계", steps: ["단계1"] }],
    });
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector<HTMLElement>(".krds-help-panel")!;
    const wrap = root.querySelector<HTMLElement>(".help-panel-wrap")!;
    expect(
      root.querySelector(":scope > .help-panel-wrap > .help-conts-area > .krds-tab-area.layer"),
    ).not.toBeNull();
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(".btn-tab"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const disclosure = root.querySelector<HTMLButtonElement>(".btn-conts-expand")!;
    const disclosurePanel = root.querySelector<HTMLElement>(".expand-wrap")!;
    expect(root.classList.contains("expand")).toBe(true);
    expect(wrap.getAttribute("tabindex")).toBe("0");
    expect(tabs.map((tab) => tab.parentElement?.getAttribute("role"))).toEqual([
      "presentation",
      "presentation",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["0", "-1"]);
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true]);
    expect(disclosure.getAttribute("aria-expanded")).toBe("false");
    expect(disclosure.getAttribute("aria-controls")).toBe(disclosurePanel.id);
    expect(disclosurePanel.hasAttribute("inert")).toBe(true);
    expect(disclosurePanel.querySelector('[role="listitem"]')?.textContent?.trim()).toBe("단계1");

    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab).toBe("tutorial");
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["false", "true"]);
    expect(panels.map((panel) => panel.hidden)).toEqual([true, false]);

    root.querySelector<HTMLButtonElement>(".btn-help-panel.fold")!.click();
    fixture.detectChanges();
    expect(root.classList.contains("expand")).toBe(false);
    expect(wrap.hasAttribute("tabindex")).toBe(false);

    fixture.componentRef.setInput("kind", "tutorial-panel");
    fixture.componentRef.setInput("open", true);
    fixture.componentRef.setInput("activeTab", "tutorial");
    fixture.detectChanges();
    const tutorialRoot = fixture.nativeElement.querySelector<HTMLElement>(".krds-help-panel")!;
    expect(tutorialRoot.className).toBe("krds-help-panel expand");
    expect(
      tutorialRoot.querySelector(
        ":scope > .help-panel-wrap > .help-conts-area > .krds-tab-area.layer",
      ),
    ).not.toBeNull();
    expect(tutorialRoot.querySelector<HTMLElement>(".tab-conts.active")?.id).toBe(
      "helperTabpanel02",
    );
  });

  it("initializes header menu relationships without changing the pinned root class", () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KrdsAdditionalComponent],
    }).createComponent(KrdsAdditionalComponent);
    Object.assign(fixture.componentInstance, {
      kind: "header",
      id: "header-test",
      menuLabel: "메인 메뉴",
      utilityItems: [
        {
          id: "resize",
          kind: "resize",
          label: "메뉴명",
          selectedLabel: "선택됨",
          items: [
            { id: "sm", label: "메뉴명", className: "sm" },
            { id: "md", label: "메뉴명", className: "md", selected: true },
          ],
        },
      ],
      desktopItems: [
        {
          id: "main",
          label: "1Depth",
          children: [
            {
              id: "sub",
              label: "2Depth",
              title: "2Depth title",
              children: [{ id: "leaf", label: "Last depth", href: "#" }],
            },
          ],
        },
      ],
      myMenu: {
        label: "나의 GOV",
        userName: "홍길동님",
        timeLabel: "로그아웃까지 남은 시간",
        time: "12:00",
        extendLabel: "시간 연장",
        items: [{ id: "home", label: "나의 GOV 홈", href: "#" }],
        logoutLabel: "로그아웃",
      },
      mobileMenu: {
        utilityItems: [],
        loginLabel: "로그인을 해주세요",
        serviceItems: [],
        searchPlaceholder: "메뉴명",
        searchTitle: "메뉴명 입력",
        searchLabel: "검색",
        items: [{ id: "mobile-one", label: "1Depth", href: "#mobile-one", children: [] }],
        previousLabel: "이전화면",
        closeLabel: "전체메뉴 닫기",
        bottomItems: [],
      },
    });
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector<HTMLElement>("header")!;
    const desktopNav = header.querySelector<HTMLElement>("nav.krds-main-menu")!;
    const mainTrigger = desktopNav.querySelector<HTMLButtonElement>(".gnb-main-trigger")!;
    const mainPanel = header.querySelector<HTMLElement>(
      `#${mainTrigger.getAttribute("aria-controls")}`,
    )!;
    const subTrigger = mainPanel.querySelector<HTMLButtonElement>(".gnb-sub-trigger")!;
    const subPanel = header.querySelector<HTMLElement>(
      `#${subTrigger.getAttribute("aria-controls")}`,
    )!;
    const mobile = header.querySelector<HTMLElement>(".krds-main-menu-mobile")!;
    const mobileTab = mobile.querySelector<HTMLAnchorElement>('[role="tab"]')!;
    const mobilePanel = mobile.querySelector<HTMLElement>('[role="tabpanel"]')!;
    expect(header.getAttribute("class")).toBeNull();
    expect(desktopNav.getAttribute("aria-label")).toBe("메인 메뉴");
    expect(desktopNav.querySelector(".gnb-menu")?.getAttribute("aria-label")).toBe("메인 메뉴");
    expect(header.querySelector(".header-utility .drop-btn")?.getAttribute("aria-expanded")).toBe(
      "false",
    );
    expect(
      header.querySelector(".header-utility .item-link.active .sr-only")?.textContent?.trim(),
    ).toBe("선택됨");
    expect(mainTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(mainTrigger.getAttribute("aria-haspopup")).toBe("true");
    expect(subTrigger.classList.contains("active")).toBe(true);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subPanel.classList.contains("active")).toBe(true);
    expect(mobile.style.display).toBe("none");
    expect(mobile.querySelector(".menu-wrap ul")?.getAttribute("role")).toBe("tablist");
    expect(mobileTab.getAttribute("aria-selected")).toBe("true");
    expect(mobileTab.getAttribute("aria-controls")).toBe(mobilePanel.id);
    expect(mobilePanel.getAttribute("aria-labelledby")).toBe(mobileTab.id);
  });

  it("connects tooltip aliases to a stable external tooltip description", () => {
    const harness = Component({
      standalone: true,
      imports: [KrdsTooltipBoxComponent],
      template: `<krds-tooltip-box id="tip" label="tooltip-box" message="상세 도움말" kind="tooltip-box" />`,
    })(class {});
    const fixture = TestBed.configureTestingModule({ imports: [harness] }).createComponent(harness);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector<HTMLButtonElement>("button.krds-tooltip")!;
    const tooltipId = trigger.getAttribute("aria-labelledby")!;
    const tooltip = fixture.nativeElement.querySelector<HTMLElement>(`#${tooltipId}`)!;
    expect(trigger.classList.contains("tooltip-box")).toBe(true);
    expect(trigger.getAttribute("data-tooltip")).toBe("상세 도움말");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(tooltip.getAttribute("aria-hidden")).toBe("true");
    expect(tooltip.className).toBe("krds-tooltip-popover");
    expect(tooltip.querySelector(".sr-only")?.textContent?.trim()).toBe("tooltip-box");
    expect(tooltip.textContent?.replace(/\s+/g, " ").trim()).toBe("tooltip-box 상세 도움말");
  });
  it("projects button content and preserves disclosure and navigation semantics", () => {
    const harness = Component({
      standalone: true,
      imports: [
        KrdsButtonHierarchyComponent,
        KrdsButtonWithIconComponent,
        KrdsDisclosureComponent,
        KrdsAccordionLineComponent,
        KrdsTabComponent,
        KrdsMainMenuMobileComponent,
      ],
      template: `
        <krds-button-hierarchy variant="primary">Projected hierarchy</krds-button-hierarchy>
        <krds-button-size size="xsmall">Projected size</krds-button-size>
        <krds-button-with-icon size="xsmall">Projected icon</krds-button-with-icon>
        <krds-disclosure id="disclosure" title="Details" [items]="['First']" />
        <krds-accordion-line type="line" [items]="items" />
        <krds-tab [tabs]="tabs" />
        <krds-main-menu-mobile menuLabel="Menu" />
      `,
    })(
      class {
        items = ["First"];
        tabs = [
          { id: "first", label: "First" },
          { id: "second", label: "Second" },
        ];
      },
    );
    const fixture = TestBed.configureTestingModule({ imports: [harness] }).createComponent(harness);
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector<HTMLButtonElement>("button.krds-btn.primary")
        ?.textContent?.trim(),
    ).toBe("Projected hierarchy");
    expect(
      fixture.nativeElement.querySelector("krds-button-size button")?.textContent?.trim(),
    ).toBe("Projected size");
    expect(
      fixture.nativeElement.querySelector("krds-button-with-icon button")?.textContent?.trim(),
    ).toBe("Projected icon");
    const disclosureTrigger =
      fixture.nativeElement.querySelector<HTMLButtonElement>("#disclosure-trigger")!;
    const disclosurePanel =
      fixture.nativeElement.querySelector<HTMLElement>("#disclosure-contents")!;
    expect(disclosureTrigger.getAttribute("aria-controls")).toBe("disclosure-contents");
    expect(disclosureTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(disclosurePanel.getAttribute("role")).toBe("region");
    expect(disclosurePanel.getAttribute("aria-labelledby")).toBe("disclosure-trigger");
    expect(
      fixture.nativeElement.querySelector('.krds-main-menu-mobile[role="navigation"]'),
    ).not.toBeNull();
    const accordion = fixture.nativeElement.querySelector<HTMLElement>("krds-accordion-line")!;
    const accordionRoot = accordion.querySelector<HTMLElement>(".krds-accordion")!;
    const accordionItem = accordion.querySelector<HTMLElement>(".accordion-item")!;
    const accordionTrigger = accordion.querySelector<HTMLButtonElement>("button.btn-accordion")!;
    const accordionPanel = accordion.querySelector<HTMLElement>('[role="region"]')!;
    expect(accordionRoot.className).toBe("krds-accordion type-line");
    expect(accordionTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(accordionTrigger.getAttribute("aria-controls")).toBe(accordionPanel.id);
    expect(accordionPanel.getAttribute("aria-labelledby")).toBe(accordionTrigger.id);
    expect(accordionPanel.hidden).toBe(true);

    accordionTrigger.click();
    fixture.detectChanges();
    expect(accordionItem.classList.contains("active")).toBe(true);
    expect(accordionTrigger.classList.contains("active")).toBe(true);
    expect(accordionTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(accordionPanel.classList.contains("show")).toBe(true);
    expect(accordionPanel.hidden).toBe(false);
    const tabRoot = fixture.nativeElement.querySelector(".krds-tab-area")!;
    expect(tabRoot.classList.contains("layer")).toBe(true);
    expect(tabRoot.querySelector('button[role="tab"]')).not.toBeNull();
  });
});
