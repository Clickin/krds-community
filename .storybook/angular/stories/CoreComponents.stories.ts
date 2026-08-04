import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/angular";
import {
  KrdsAccordionComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
} from "@krds-community/angular";
import { KrdsAdditionalComponent } from "../../../tests/framework/fixtures/additional-test.component";

const sharedImports = [
  CommonModule,
  ReactiveFormsModule,
  KrdsAdditionalComponent,
  KrdsAccordionComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
];

export type CoreArgs = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  state?: "default" | "error" | "success" | "information";
  disabled?: boolean;
  label?: string;
  onClicked?: (...event: unknown[]) => unknown;
};
const meta = {
  title: "Angular/핵심 컴포넌트",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    state: { control: "select", options: ["default", "error", "success", "information"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: { imports: sharedImports },
    }),
  ],
} satisfies Meta<CoreArgs>;

export default meta;

type Story = StoryObj<CoreArgs>;
type EventHandler = (...event: unknown[]) => unknown;
type OutputArgs = {
  buttonVariant: "primary" | "secondary" | "tertiary";
  checkboxId: string;
  checkboxLabel: string;
  radioId: string;
  radioLabel: string;
  radioName: string;
  radioValue: string;
  switchId: string;
  switchLabel: string;
  selectKind: "select";
  selectId: string;
  selectLabel: string;
  textareaKind: "textarea";
  textareaId: string;
  textareaLabel: string;
  options: Array<{ value: string; label: string }>;
  onButtonClicked: EventHandler;
  onCheckboxChanged: EventHandler;
  onRadioSelected: EventHandler;
  onSwitchChanged: EventHandler;
  onSelectChanged: EventHandler;
  onValueChanged: EventHandler;
};

export const ButtonPrimary: Story = {
  name: "Button · primary / medium",
  args: { variant: "primary", size: "medium", disabled: false, label: "저장", onClicked: fn() },
  render: (args) => ({
    template:
      '<krds-button [variant]="variant" [size]="size" [disabled]="disabled" (clicked)="onClicked($event)">{{ label }}</krds-button>',
    props: { ...args, onClicked: args.onClicked ?? fn() },
  }),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "저장" }));
    await expect(args.onClicked).toHaveBeenCalled();
  },
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "Angular template에서 Button public inputs와 clicked output을 property binding으로 사용합니다.",
      },
    },
  },
};

export const ButtonSecondary: Story = {
  name: "Button · secondary / medium",
  args: { variant: "secondary", size: "medium", label: "보조 작업" },
  render: (args) => ({
    template: '<krds-button [variant]="variant" [size]="size">{{ label }}</krds-button>',
    props: args,
  }),
  parameters: {
    fixtureId: "button.secondary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: { story: "secondary variant를 Angular property binding으로 전달합니다." },
    },
  },
};

export const ButtonTertiary: Story = {
  name: "Button · tertiary / medium",
  args: { variant: "tertiary", size: "medium", label: "취소" },
  render: (args) => ({
    template: '<krds-button [variant]="variant" [size]="size">{{ label }}</krds-button>',
    props: args,
  }),
  parameters: {
    fixtureId: "button.tertiary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: "tertiary variant를 Angular property binding으로 전달합니다." } },
  },
};

export const ButtonStates: Story = {
  name: "Button · official state matrix",
  render: () => ({
    template: `
      <div style="display:grid;gap:1rem">
        <krds-button [variant]="primaryVariant" [size]="mediumSize">활성 버튼</krds-button>
        <krds-button [variant]="primaryVariant" [size]="mediumSize" [disabled]="true">비활성 버튼</krds-button>
        <krds-button [variant]="secondaryVariant" [size]="smallSize">보조 버튼</krds-button>
      </div>
    `,
    props: {
      primaryVariant: "primary",
      secondaryVariant: "secondary",
      mediumSize: "medium",
      smallSize: "small",
    },
  }),
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureStates: ["default", "hover", "focus-visible", "active", "disabled"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "공식 button fixture state를 활성/비활성 및 variant matrix로 탐색합니다.",
      },
    },
  },
};

export const TextInputDefault: Story = {
  name: "TextInput · default / medium",
  args: { state: "default", size: "medium" },
  render: (args) => ({
    template:
      '<krds-text-input [id]="id" [label]="label" [hint]="hint" [state]="state" [size]="size" [placeholder]="placeholder" [name]="name" [required]="required"></krds-text-input>',
    props: {
      ...args,
      id: "angular-text-input-default",
      label: "이름",
      hint: "실명을 입력하세요.",
      placeholder: "이름을 입력하세요.",
      name: "name",
      required: true,
    },
  }),
  parameters: {
    fixtureId: "text-input.default.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: {
        story: "Angular public inputs로 label/hint/name/required를 연결한 기본 CVA 입력입니다.",
      },
    },
  },
};

export const TextInputStates: Story = {
  name: "TextInput · official state matrix",
  render: () => ({
    template: `
      <div style="display:grid;gap:1rem">
        <krds-text-input [id]="defaultField.id" [label]="defaultField.label" [hint]="defaultField.hint" [placeholder]="defaultField.placeholder" [state]="defaultField.state"></krds-text-input>
        <krds-text-input [id]="errorField.id" [label]="errorField.label" [hint]="errorField.hint" [state]="errorField.state"></krds-text-input>
        <krds-text-input [id]="successField.id" [label]="successField.label" [hint]="successField.hint" [state]="successField.state" [value]="successField.value"></krds-text-input>
        <krds-text-input [id]="informationField.id" [label]="informationField.label" [hint]="informationField.hint" [state]="informationField.state"></krds-text-input>
        <krds-text-input [id]="readonlyField.id" [label]="readonlyField.label" [value]="readonlyField.value" [readonly]="true"></krds-text-input>
        <krds-text-input [id]="disabledField.id" [label]="disabledField.label" [value]="disabledField.value" [disabled]="true"></krds-text-input>
      </div>
    `,
    props: {
      defaultField: {
        id: "angular-text-default",
        label: "검색",
        hint: "검색어를 입력하세요.",
        placeholder: "검색",
        state: "default",
      },
      errorField: {
        id: "angular-text-error",
        label: "이메일",
        hint: "이메일 주소를 확인하세요.",
        state: "error",
      },
      successField: {
        id: "angular-text-success",
        label: "아이디",
        hint: "사용할 수 있는 아이디입니다.",
        state: "success",
        value: "community",
      },
      informationField: {
        id: "angular-text-information",
        label: "알림 주소",
        hint: "업데이트 소식을 받을 주소입니다.",
        state: "information",
      },
      readonlyField: { id: "angular-text-readonly", label: "읽기 전용", value: "고정 값" },
      disabledField: { id: "angular-text-disabled", label: "비활성", value: "입력할 수 없음" },
    },
  }),
  parameters: {
    fixtureIds: [
      "text-input.default.medium",
      "text-input.error.medium",
      "text-input.success.medium",
      "text-input.information.medium",
    ],
    fixtureStates: ["default", "placeholder", "readonly", "disabled", "invalid", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "default/placeholder/readonly/disabled/error/success/information 상태를 한 matrix에서 확인합니다.",
      },
    },
  },
};

export const CheckboxStates: Story = {
  name: "Checkbox · medium and large states",
  render: () => ({
    template: `
      <fieldset style="display:grid;gap:.5rem">
        <legend>약관 동의</legend>
        <krds-checkbox [id]="defaultId" [label]="defaultLabel" [name]="name"></krds-checkbox>
        <krds-checkbox [id]="checkedId" [label]="checkedLabel" [name]="name" [checked]="true"></krds-checkbox>
        <krds-checkbox [id]="disabledId" [label]="disabledLabel" [name]="name" [disabled]="true"></krds-checkbox>
        <krds-checkbox [id]="disabledCheckedId" [label]="disabledCheckedLabel" [name]="name" [disabled]="true" [checked]="true"></krds-checkbox>
        <krds-checkbox [id]="largeId" [label]="largeLabel" [name]="largeName" [size]="largeSize"></krds-checkbox>
      </fieldset>
    `,
    props: {
      defaultId: "angular-checkbox-default",
      checkedId: "angular-checkbox-checked",
      disabledId: "angular-checkbox-disabled",
      disabledCheckedId: "angular-checkbox-disabled-checked",
      largeId: "angular-checkbox-large",
      defaultLabel: "선택 안 함",
      checkedLabel: "선택됨",
      disabledLabel: "비활성",
      disabledCheckedLabel: "비활성 선택됨",
      largeLabel: "큰 체크박스",
      name: "angular-checkbox-medium",
      largeName: "angular-checkbox-large",
      largeSize: "large",
    },
  }),
  parameters: {
    fixtureIds: ["checkbox.default.medium", "checkbox.default.large"],
    fixtureStates: ["default", "checked", "disabled", "disabled-checked", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "Angular native checkbox semantics와 medium/large state matrix를 확인합니다.",
      },
    },
  },
};

export const RadioStates: Story = {
  name: "Radio · medium and large states",
  render: () => ({
    template: `
      <fieldset style="display:grid;gap:.5rem">
        <legend>알림 빈도</legend>
        <krds-radio [id]="dailyId" [label]="dailyLabel" [name]="name" [value]="dailyValue" [checked]="true"></krds-radio>
        <krds-radio [id]="weeklyId" [label]="weeklyLabel" [name]="name" [value]="weeklyValue"></krds-radio>
        <krds-radio [id]="disabledId" [label]="disabledLabel" [name]="name" [value]="disabledValue" [disabled]="true"></krds-radio>
        <krds-radio [id]="largeId" [label]="largeLabel" [name]="largeName" [value]="largeValue" [size]="largeSize"></krds-radio>
      </fieldset>
    `,
    props: {
      dailyId: "angular-radio-daily",
      weeklyId: "angular-radio-weekly",
      disabledId: "angular-radio-disabled",
      largeId: "angular-radio-large",
      dailyLabel: "매일",
      weeklyLabel: "매주",
      disabledLabel: "사용 안 함",
      largeLabel: "큰 라디오",
      name: "angular-radio-medium",
      largeName: "angular-radio-large",
      dailyValue: "daily",
      weeklyValue: "weekly",
      disabledValue: "none",
      largeValue: "large",
      largeSize: "large",
    },
  }),
  parameters: {
    fixtureIds: ["radio.default.medium", "radio.default.large"],
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "같은 name을 공유하는 radio group과 large variant를 Angular property binding으로 사용합니다.",
      },
    },
  },
};

export const SwitchStates: Story = {
  name: "Switch · medium and large states",
  render: () => ({
    template: `
      <div style="display:grid;gap:.5rem">
        <krds-switch [id]="defaultId" [label]="defaultLabel" [name]="name"></krds-switch>
        <krds-switch [id]="checkedId" [label]="checkedLabel" [name]="name" [checked]="true"></krds-switch>
        <krds-switch [id]="disabledId" [label]="disabledLabel" [name]="name" [disabled]="true"></krds-switch>
        <krds-switch [id]="largeId" [label]="largeLabel" [name]="largeName" [size]="largeSize"></krds-switch>
      </div>
    `,
    props: {
      defaultId: "angular-switch-default",
      checkedId: "angular-switch-checked",
      disabledId: "angular-switch-disabled",
      largeId: "angular-switch-large",
      defaultLabel: "알림 받기",
      checkedLabel: "자동 저장",
      disabledLabel: "비활성",
      largeLabel: "큰 스위치",
      name: "angular-switch-medium",
      largeName: "angular-switch-large",
      largeSize: "large",
    },
  }),
  parameters: {
    fixtureIds: ["switch.default.medium", "switch.default.large"],
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: { story: "native checkbox 기반 switch의 official state matrix를 확인합니다." },
    },
  },
};

export const AccordionDefault: Story = {
  name: "Accordion · default / single",
  render: () => ({
    template: '<krds-accordion [items]="items"></krds-accordion>',
    props: {
      items: [
        {
          id: "angular-accordion-one",
          title: "기본 아코디언",
          content: "첫 번째 안내 내용입니다.",
        },
        { id: "angular-accordion-two", title: "두 번째 항목", content: "두 번째 안내 내용입니다." },
      ],
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "기본 아코디언" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("region", { name: "기본 아코디언" })).toBeVisible();
  },
  parameters: {
    fixtureId: "accordion.default.single",
    fixtureStates: ["collapsed", "expanded", "focus-visible", "keyboard-toggle"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "items input과 click/keyboard expanded-state interaction을 검증합니다.",
      },
    },
  },
};

export const AccordionLine: Story = {
  name: "Accordion · line / single",
  render: () => ({
    template: '<krds-accordion [type]="accordionType" [items]="items"></krds-accordion>',
    props: {
      accordionType: "line",
      items: [
        { id: "angular-accordion-line", title: "라인 아코디언", content: "라인 안내 내용입니다." },
      ],
    },
  }),
  parameters: {
    fixtureId: "accordion.line.single",
    fixtureStates: ["collapsed", "expanded", "focus-visible", "keyboard-toggle"],
    a11y: { test: "error" },
    docs: { description: { story: "라인 fixture variant를 공식 item contract로 렌더링합니다." } },
  },
};

export const TabDefault: Story = {
  name: "Tab · default",
  render: () => ({
    template: `
      <krds-additional [kind]="kind" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel"></krds-additional>
      <section id="panel_angular-tab-one" role="tabpanel" aria-labelledby="tab_angular-tab-one">첫 번째 패널</section>
      <section id="panel_angular-tab-two" role="tabpanel" aria-labelledby="tab_angular-tab-two">두 번째 패널</section>
    `,
    props: {
      kind: "tab",
      tabs: [
        { id: "angular-tab-one", label: "첫 탭" },
        { id: "angular-tab-two", label: "두 번째 탭" },
      ],
      panels: { "angular-tab-one": "첫 번째 패널", "angular-tab-two": "두 번째 패널" },
      selectedLabel: "선택됨",
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const secondTab = canvas.getByRole("tab", { name: "두 번째 탭" });
    await userEvent.click(secondTab);
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("두 번째 패널");
  },
  parameters: {
    fixtureId: "tab.default",
    fixtureStates: ["default", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "tabs/panels input과 selected state를 Angular template에서 확인합니다.",
      },
    },
  },
};

export const OutputEvents: StoryObj<OutputArgs> = {
  name: "Outputs · clicked / checkedChange / selected / valueChange",
  args: {
    buttonVariant: "primary",
    checkboxId: "angular-output-checkbox",
    checkboxLabel: "약관 동의",
    radioId: "angular-output-radio",
    radioLabel: "주간 알림",
    radioName: "angular-output-radio-group",
    radioValue: "weekly",
    switchId: "angular-output-switch",
    switchLabel: "알림 받기",
    selectKind: "select",
    selectId: "angular-output-select",
    selectLabel: "분류",
    textareaKind: "textarea",
    textareaId: "angular-output-textarea",
    textareaLabel: "메모",
    options: [
      { value: "one", label: "첫 번째" },
      { value: "two", label: "두 번째" },
    ],
    onButtonClicked: fn(),
    onCheckboxChanged: fn(),
    onRadioSelected: fn(),
    onSwitchChanged: fn(),
    onSelectChanged: fn(),
    onValueChanged: fn(),
  },
  render: (args) => ({
    template: `
      <div style="display:grid;gap:1rem">
        <krds-button [variant]="buttonVariant" (clicked)="onButtonClicked($event)">저장</krds-button>
        <krds-checkbox [id]="checkboxId" [label]="checkboxLabel" (checkedChange)="onCheckboxChanged($event)"></krds-checkbox>
        <krds-radio [id]="radioId" [label]="radioLabel" [name]="radioName" [value]="radioValue" (selected)="onRadioSelected($event)"></krds-radio>
        <krds-switch [id]="switchId" [label]="switchLabel" (checkedChange)="onSwitchChanged($event)"></krds-switch>
        <krds-additional [kind]="selectKind" [id]="selectId" [label]="selectLabel" [options]="options" (selectedChange)="onSelectChanged($event)"></krds-additional>
        <krds-additional [kind]="textareaKind" [id]="textareaId" [label]="textareaLabel" (valueChange)="onValueChanged($event)"></krds-additional>
      </div>
    `,
    props: args,
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "저장" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "약관 동의" }));
    await userEvent.click(canvas.getByRole("radio", { name: "주간 알림" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "알림 받기" }));
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "분류" }), "two");
    await userEvent.type(canvas.getByRole("textbox", { name: "메모" }), "변경");
    await expect(args.onButtonClicked).toHaveBeenCalled();
    await expect(args.onCheckboxChanged).toHaveBeenCalledWith(true);
    await expect(args.onRadioSelected).toHaveBeenCalledWith("weekly");
    await expect(args.onSwitchChanged).toHaveBeenCalledWith(true);
    await expect(args.onSelectChanged).toHaveBeenCalledWith("two");
    await expect(args.onValueChanged).toHaveBeenCalled();
  },
  parameters: {
    fixtureIds: [
      "button.primary.medium.default",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "select.default",
      "textarea.default",
    ],
    fixtureStates: ["default", "checked", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "Angular EventEmitter outputs를 template event binding과 Storybook fn으로 관찰합니다.",
      },
    },
  },
};

export const ReactiveForms: Story = {
  name: "Reactive Forms · ControlValueAccessor",
  render: () => {
    const form = new FormGroup({
      name: new FormControl("홍길동", { nonNullable: true, validators: [Validators.required] }),
      terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
      frequency: new FormControl("daily", { nonNullable: true }),
      notifications: new FormControl(true, { nonNullable: true }),
      category: new FormControl("one", { nonNullable: true }),
    });
    const formState = { submitted: false };
    return {
      template: `
        <form [formGroup]="form" aria-label="프로필 입력" (ngSubmit)="onSubmit()">
          <krds-text-input [id]="nameId" [label]="nameLabel" [hint]="nameHint" [name]="nameName" formControlName="name"></krds-text-input>
          <fieldset>
            <legend>알림 빈도</legend>
            <krds-radio [id]="dailyId" [label]="dailyLabel" [name]="frequencyName" [value]="dailyValue" formControlName="frequency"></krds-radio>
            <krds-radio [id]="weeklyId" [label]="weeklyLabel" [name]="frequencyName" [value]="weeklyValue" formControlName="frequency"></krds-radio>
          </fieldset>
          <krds-checkbox [id]="termsId" [label]="termsLabel" [name]="termsName" formControlName="terms"></krds-checkbox>
          <krds-switch [id]="notificationsId" [label]="notificationsLabel" [name]="notificationsName" formControlName="notifications"></krds-switch>
          <krds-additional [kind]="selectKind" [id]="categoryId" [label]="categoryLabel" [options]="options" formControlName="category"></krds-additional>
          <krds-button [type]="submitType" [variant]="submitVariant">제출</krds-button>
          <p role="status" [hidden]="!formState.submitted">제출되었습니다.</p>
          <p role="alert" [hidden]="form.valid || !formState.submitted">입력값을 확인하세요.</p>
        </form>
      `,
      props: {
        form,
        formState,
        onSubmit: () => {
          formState.submitted = true;
        },
        nameId: "angular-form-name",
        nameLabel: "이름",
        nameHint: "실명을 입력하세요.",
        nameName: "name",
        dailyId: "angular-form-daily",
        weeklyId: "angular-form-weekly",
        dailyLabel: "매일",
        weeklyLabel: "매주",
        frequencyName: "frequency",
        dailyValue: "daily",
        weeklyValue: "weekly",
        termsId: "angular-form-terms",
        termsLabel: "약관에 동의합니다.",
        termsName: "terms",
        notificationsId: "angular-form-notifications",
        notificationsLabel: "알림 받기",
        notificationsName: "notifications",
        selectKind: "select",
        categoryId: "angular-form-category",
        categoryLabel: "분류",
        options: [
          { value: "one", label: "첫 번째" },
          { value: "two", label: "두 번째" },
        ],
        submitType: "submit",
        submitVariant: "primary",
      },
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("textbox", { name: "이름" });
    await userEvent.clear(name);
    await userEvent.type(name, "김하늘");
    await userEvent.click(canvas.getByRole("checkbox", { name: "약관에 동의합니다." }));
    await userEvent.click(canvas.getByRole("radio", { name: "매주" }));
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "분류" }), "two");
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("제출되었습니다.");
  },
  parameters: {
    fixtureIds: [
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "select.default",
    ],
    fixtureStates: ["default", "focus-visible", "checked"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "ReactiveFormsModule로 TextInput/Checkbox/Radio/Switch/Select ControlValueAccessor를 하나의 FormGroup에 연결합니다.",
      },
    },
  },
};

export const ModalDefault: Story = {
  name: "Modal · default",
  render: () => ({
    template:
      '<krds-additional [kind]="kind" [id]="id" [title]="title" [description]="description" [open]="open" [closeLabel]="closeLabel"></krds-additional>',
    props: {
      kind: "modal",
      id: "angular-modal",
      title: "확인 모달",
      description: "저장하시겠습니까?",
      open: true,
      closeLabel: "닫기",
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("dialog", { name: "확인 모달" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
  parameters: {
    fixtureId: "modal.default",
    fixtureStates: ["default", "focus-visible"],
    a11y: { test: "error" },
    docs: { description: { story: "dialog accessible name과 close interaction을 확인합니다." } },
  },
};
