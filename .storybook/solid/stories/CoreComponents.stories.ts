import { expect, userEvent, within } from "storybook/test";
import { createComponent, type Component } from "solid-js";
import { render as solidRender } from "solid-js/web";
import type { Meta, StoryObj } from "@storybook/html-vite";
import {
  Accordion,
  Button,
  Checkbox,
  Modal,
  Radio,
  Switch,
  Tab,
  TextInput,
} from "@krds-community/solid";

const meta = {
  title: "SolidJS/핵심 컴포넌트",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    state: { control: "select", options: ["default", "error", "success", "information"] },
  },
} satisfies Meta;

export default meta;
type StoryArgs = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  state?: "default" | "error" | "success" | "information";
};
type Story = StoryObj<StoryArgs>;

const mount = (
  component: unknown,
  props: Record<string, unknown> = {},
  root: HTMLElement = document.createElement("div"),
) => {
  const target = document.createElement("div");
  root.append(target);
  solidRender(
    () => createComponent(component as Component<Record<string, unknown>>, props),
    target,
  );
  return root;
};

const grid = (...children: HTMLElement[]) => {
  const root = document.createElement("div");
  root.style.cssText = "display:grid;gap:1rem;max-width:30rem";
  children.forEach((child) => root.append(child));
  return root;
};

const coreUsage = (story: string) => ({ description: { story } });

export const ButtonPrimary: Story = {
  name: "Button · primary / medium",
  args: { variant: "primary", size: "medium" },
  render: (args) => mount(Button, { ...args, children: "저장" }),
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: coreUsage("Solid JSX에서 Button public props를 사용합니다.").description },
  },
};

export const ButtonSecondary: Story = {
  name: "Button · secondary / medium",
  render: () => mount(Button, { variant: "secondary", children: "보조 작업" }),
  parameters: {
    fixtureId: "button.secondary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid JSX에서 secondary 버튼을 직접 렌더링합니다.").description,
    },
  },
};

export const ButtonTertiary: Story = {
  name: "Button · tertiary / medium",
  render: () => mount(Button, { variant: "tertiary", children: "취소" }),
  parameters: {
    fixtureId: "button.tertiary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid JSX에서 tertiary 버튼을 직접 렌더링합니다.").description,
    },
  },
};

export const ButtonStates: Story = {
  name: "Button · disabled state",
  render: () =>
    grid(
      mount(Button, { children: "활성 버튼" }),
      mount(Button, { children: "비활성 버튼", disabled: true }),
    ),
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureState: "disabled",
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid public component에서 native disabled semantics를 확인합니다.")
        .description,
    },
  },
};

export const TextInputDefault: Story = {
  name: "TextInput · default / medium",
  args: { state: "default", size: "medium" },
  render: (args) =>
    mount(TextInput, {
      ...args,
      id: "solid-text-input-default",
      label: "이름",
      hint: "실명을 입력하세요.",
    }),
  parameters: {
    fixtureId: "text-input.default.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: coreUsage("Solid JSX에서 label/hint relation을 확인합니다.").description },
  },
};

export const TextInputError: Story = {
  name: "TextInput · error",
  render: () =>
    mount(TextInput, {
      id: "solid-text-input-error",
      label: "이메일",
      hint: "이메일 주소를 확인하세요.",
      state: "error",
    }),
  parameters: {
    fixtureId: "text-input.error.medium",
    fixtureState: "invalid",
    a11y: { test: "error" },
    docs: {
      description: coreUsage('Solid JSX에서 state="error"와 hint를 직접 지정합니다.').description,
    },
  },
};

export const TextInputSuccess: Story = {
  name: "TextInput · success",
  render: () =>
    mount(TextInput, {
      id: "solid-text-input-success",
      label: "아이디",
      hint: "사용할 수 있는 아이디입니다.",
      state: "success",
      value: "community",
    }),
  parameters: {
    fixtureId: "text-input.success.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: coreUsage("Solid JSX에서 success 상태를 직접 지정합니다.").description },
  },
};

export const TextInputInformation: Story = {
  name: "TextInput · information",
  render: () =>
    mount(TextInput, {
      id: "solid-text-input-information",
      label: "알림 수신 주소",
      hint: "업데이트 소식을 받을 주소를 입력하세요.",
      state: "information",
    }),
  parameters: {
    fixtureId: "text-input.information.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid JSX에서 information 상태를 직접 지정합니다.").description,
    },
  },
};

export const TextInputStates: Story = {
  name: "TextInput · placeholder / readonly / disabled",
  render: () =>
    grid(
      mount(TextInput, {
        id: "solid-text-input-placeholder",
        label: "검색",
        placeholder: "검색어를 입력하세요.",
      }),
      mount(TextInput, {
        id: "solid-text-input-readonly",
        label: "읽기 전용",
        value: "고정 값",
        readOnly: true,
      }),
      mount(TextInput, {
        id: "solid-text-input-disabled",
        label: "비활성",
        value: "입력할 수 없음",
        disabled: true,
      }),
    ),
  parameters: {
    fixtureId: "text-input.default.medium",
    fixtureState: "placeholder-readonly-disabled",
    a11y: { test: "error" },
    docs: {
      description: coreUsage(
        "Solid native input props로 placeholder/readonly/disabled 상태를 확인합니다.",
      ).description,
    },
  },
};

export const CheckboxMedium: Story = {
  name: "Checkbox · medium states",
  render: () => {
    const root = document.createElement("fieldset");
    root.style.cssText = "display:grid;gap:.5rem";
    const legend = document.createElement("legend");
    legend.textContent = "약관 동의";
    root.append(legend);
    mount(
      Checkbox,
      { id: "solid-checkbox-default", label: "선택 안 함", name: "solid-checkbox-medium" },
      root,
    );
    mount(
      Checkbox,
      {
        id: "solid-checkbox-checked",
        label: "선택됨",
        name: "solid-checkbox-medium",
        checked: true,
      },
      root,
    );
    mount(
      Checkbox,
      {
        id: "solid-checkbox-disabled",
        label: "비활성",
        name: "solid-checkbox-medium",
        disabled: true,
      },
      root,
    );
    mount(
      Checkbox,
      {
        id: "solid-checkbox-disabled-checked",
        label: "비활성 선택됨",
        name: "solid-checkbox-medium",
        disabled: true,
        checked: true,
      },
      root,
    );
    return root;
  },
  parameters: {
    fixtureId: "checkbox.default.medium",
    fixtureStates: ["default", "checked", "disabled", "disabled-checked", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid JSX에서 native checkbox 상태와 label relation을 확인합니다.")
        .description,
    },
  },
};

export const CheckboxLarge: Story = {
  name: "Checkbox · large",
  render: () =>
    mount(Checkbox, {
      id: "solid-checkbox-large",
      label: "큰 체크박스",
      name: "solid-checkbox-large",
      size: "large",
    }),
  parameters: {
    fixtureId: "checkbox.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage('Solid JSX에서 size="large" checkbox를 직접 렌더링합니다.')
        .description,
    },
  },
};

export const RadioMedium: Story = {
  name: "Radio · medium states",
  render: () => {
    const root = document.createElement("fieldset");
    root.style.cssText = "display:grid;gap:.5rem";
    const legend = document.createElement("legend");
    legend.textContent = "알림 빈도";
    root.append(legend);
    mount(
      Radio,
      {
        id: "solid-radio-daily",
        label: "매일",
        name: "solid-radio-medium",
        value: "daily",
        checked: true,
      },
      root,
    );
    mount(
      Radio,
      { id: "solid-radio-weekly", label: "매주", name: "solid-radio-medium", value: "weekly" },
      root,
    );
    mount(
      Radio,
      {
        id: "solid-radio-disabled",
        label: "사용 안 함",
        name: "solid-radio-medium",
        value: "none",
        disabled: true,
      },
      root,
    );
    return root;
  },
  parameters: {
    fixtureId: "radio.default.medium",
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid JSX에서 같은 name을 공유하는 radio group을 사용합니다.")
        .description,
    },
  },
};

export const RadioLarge: Story = {
  name: "Radio · large",
  render: () =>
    mount(Radio, {
      id: "solid-radio-large",
      label: "큰 라디오",
      name: "solid-radio-large",
      value: "large",
      size: "large",
    }),
  parameters: {
    fixtureId: "radio.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage('Solid JSX에서 size="large" radio를 직접 렌더링합니다.').description,
    },
  },
};

export const SwitchMedium: Story = {
  name: "Switch · medium states",
  render: () =>
    grid(
      mount(Switch, {
        id: "solid-switch-default",
        label: "알림 받기",
        name: "solid-switch-medium",
      }),
      mount(Switch, {
        id: "solid-switch-checked",
        label: "자동 저장",
        name: "solid-switch-medium",
        checked: true,
      }),
      mount(Switch, {
        id: "solid-switch-disabled",
        label: "비활성",
        name: "solid-switch-medium",
        disabled: true,
      }),
    ),
  parameters: {
    fixtureId: "switch.default.medium",
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: coreUsage("Solid native checkbox 기반 switch 상태를 확인합니다.").description,
    },
  },
};

export const SwitchLarge: Story = {
  name: "Switch · large",
  render: () =>
    mount(Switch, {
      id: "solid-switch-large",
      label: "큰 스위치",
      name: "solid-switch-large",
      size: "large",
    }),
  parameters: {
    fixtureId: "switch.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: coreUsage('Solid JSX에서 size="large" switch를 직접 렌더링합니다.').description,
    },
  },
};

export const AccordionDefault: Story = {
  name: "Accordion · default / single",
  render: () =>
    mount(Accordion, {
      items: [
        { id: "solid-accordion-one", title: "기본 아코디언", content: "첫 번째 안내 내용입니다." },
        { id: "solid-accordion-two", title: "두 번째 항목", content: "두 번째 안내 내용입니다." },
      ],
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
      description: coreUsage(
        "Solid JSX에서 Accordion items를 전달하며 keyboard/click 상태를 확인합니다.",
      ).description,
    },
  },
};

export const AccordionLine: Story = {
  name: "Accordion · line / single",
  render: () =>
    mount(Accordion, {
      type: "line",
      items: [
        { id: "solid-accordion-line", title: "라인 아코디언", content: "라인 안내 내용입니다." },
      ],
    }),
  parameters: {
    fixtureId: "accordion.line.single",
    fixtureStates: ["collapsed", "expanded", "focus-visible", "keyboard-toggle"],
    a11y: { test: "error" },
    docs: {
      description: coreUsage('Solid JSX에서 type="line" variant를 직접 지정합니다.').description,
    },
  },
};

export const TabDefault: Story = {
  name: "Tab · default",
  render: () =>
    mount(Tab, {
      tabs: [
        { id: "solid-tab-one", label: "첫 탭" },
        { id: "solid-tab-two", label: "두 번째 탭" },
      ],
      panels: { "solid-tab-one": "첫 번째 패널", "solid-tab-two": "두 번째 패널" },
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
      description: coreUsage("Solid JSX에서 Tab tabs/panels와 선택 상태를 확인합니다.").description,
    },
  },
};

export const FormInteraction: Story = {
  name: "Form · input and checkbox interaction",
  render: () => {
    const form = document.createElement("form");
    form.ariaLabel = "프로필 입력";
    form.style.cssText = "display:grid;gap:1rem;max-width:30rem";
    mount(
      TextInput,
      { id: "solid-form-name", label: "이름", hint: "실명을 입력하세요.", name: "name" },
      form,
    );
    mount(Checkbox, { id: "solid-form-terms", label: "약관에 동의합니다.", name: "terms" }, form);
    mount(Button, { type: "submit", children: "제출" }, form);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = document.createElement("p");
      status.setAttribute("role", "status");
      status.textContent = "제출되었습니다.";
      form.append(status);
    });
    return form;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "이름" }), "홍길동");
    await userEvent.click(canvas.getByRole("checkbox", { name: "약관에 동의합니다." }));
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("제출되었습니다.");
  },
  parameters: {
    fixtureIds: ["text-input.default.medium", "checkbox.default.medium"],
    fixtureStates: ["default", "focus-visible", "checked"],
    a11y: { test: "error" },
    docs: {
      description: coreUsage(
        "Solid DOM API에서 native form event와 submit 흐름을 play test로 검증합니다.",
      ).description,
    },
  },
};

export const ModalDefault: Story = {
  name: "Modal · default",
  render: () => {
    const root = document.createElement("div");
    mount(
      Modal,
      { id: "solid-modal", title: "확인 모달", open: true, children: "저장하시겠습니까?" },
      root,
    );
    return root;
  },
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
    docs: {
      description: coreUsage(
        "Solid JSX에서 Modal open/close와 dialog accessible name을 확인합니다.",
      ).description,
    },
  },
};
