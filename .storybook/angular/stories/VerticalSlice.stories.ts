import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/angular";
import {
  KrdsAccordionComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
} from "@krds-community/angular";

export type VerticalSliceArgs = {
  buttonVariant: "primary" | "secondary" | "tertiary";
  buttonSize: "small" | "medium" | "large";
  submitType: "submit" | "button" | "reset";
};
const meta = {
  title: "Angular/기본 구성",
  component: KrdsButtonComponent,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: {
        imports: [
          ReactiveFormsModule,
          KrdsAccordionComponent,
          KrdsButtonComponent,
          KrdsCheckboxComponent,
          KrdsRadioComponent,
          KrdsSwitchComponent,
          KrdsTextInputComponent,
        ],
      },
    }),
  ],
} satisfies Meta<VerticalSliceArgs>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  name: "Angular standalone vertical slice",
  render: () => ({
    template: `
      <main aria-label="Angular KRDS 기본 구성">
        <h1>서비스 신청</h1>
        <form [formGroup]="form" aria-label="서비스 신청" (ngSubmit)="submit()">
          <krds-button [variant]="buttonVariant" [size]="buttonSize" [type]="submitType">다음 단계</krds-button>
          <krds-text-input [id]="nameId" [label]="nameLabel" [hint]="nameHint" [name]="nameName" formControlName="name"></krds-text-input>
          <krds-checkbox [id]="termsId" [label]="termsLabel" [name]="termsName" formControlName="terms"></krds-checkbox>
          <fieldset>
            <legend>선호 연락 방법</legend>
            <krds-radio [id]="emailId" [label]="emailLabel" [name]="contactName" [value]="emailValue" formControlName="contact"></krds-radio>
            <krds-radio [id]="phoneId" [label]="phoneLabel" [name]="contactName" [value]="phoneValue" formControlName="contact"></krds-radio>
          </fieldset>
          <krds-switch [id]="notificationsId" [label]="notificationsLabel" [name]="notificationsName" formControlName="notifications"></krds-switch>
          <krds-accordion [items]="items"></krds-accordion>
          <p role="status" [hidden]="!submitted">다음 단계로 이동합니다.</p>
        </form>
      </main>
    `,
    props: {
      form: new FormGroup({
        name: new FormControl("", { nonNullable: true }),
        terms: new FormControl(false, { nonNullable: true }),
        contact: new FormControl("email", { nonNullable: true }),
        notifications: new FormControl(true, { nonNullable: true }),
      }),
      submitted: false,
      submit() {
        this.submitted = true;
      },
      buttonVariant: "primary",
      buttonSize: "medium",
      submitType: "submit",
      nameId: "angular-slice-name",
      nameLabel: "이름",
      nameHint: "실명을 입력하세요.",
      nameName: "name",
      termsId: "angular-slice-terms",
      termsLabel: "약관에 동의합니다.",
      termsName: "terms",
      emailId: "angular-slice-email",
      phoneId: "angular-slice-phone",
      emailLabel: "이메일",
      phoneLabel: "전화",
      contactName: "contact",
      emailValue: "email",
      phoneValue: "phone",
      notificationsId: "angular-slice-notifications",
      notificationsLabel: "알림 받기",
      notificationsName: "notifications",
      items: [{ id: "slice-one", title: "방문 안내", content: "서비스 이용 안내입니다." }],
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "이름" }), "홍길동");
    await userEvent.click(canvas.getByRole("checkbox", { name: "약관에 동의합니다." }));
    await userEvent.click(canvas.getByRole("button", { name: "다음 단계" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("다음 단계로 이동합니다.");
  },
  parameters: {
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
    fixtureStates: ["default", "focus-visible", "checked", "expanded"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "Angular standalone imports와 ReactiveFormsModule을 이용해 실제 form workflow를 구성합니다. 컴포넌트 입력은 property binding으로 전달하고 submit interaction을 play test로 확인합니다.",
      },
    },
  },
};
