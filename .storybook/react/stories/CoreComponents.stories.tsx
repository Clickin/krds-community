import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Modal,
  Radio,
  Switch,
  Tab,
  TextInput,
} from "@krds-community/react";

const meta = {
  title: "React/핵심 컴포넌트",
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
  children?: string;
};
type Story = StoryObj<StoryArgs>;

export const ButtonPrimary: Story = {
  name: "Button · primary / medium",
  args: { variant: "primary", size: "medium", children: "저장" },
  render: (args) => <Button {...args}>저장</Button>,
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: {
        story: "React JSX에서 Button의 public API와 variant/size props를 사용합니다.",
      },
    },
  },
};

export const ButtonSecondary: Story = {
  name: "Button · secondary / medium",
  render: () => <Button variant="secondary">보조 작업</Button>,
  parameters: {
    fixtureId: "button.secondary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: {
      description: { story: "React JSX에서 보조 작업용 secondary 버튼을 직접 렌더링합니다." },
    },
  },
};

export const ButtonTertiary: Story = {
  name: "Button · tertiary / medium",
  render: () => <Button variant="tertiary">취소</Button>,
  parameters: {
    fixtureId: "button.tertiary.medium.default",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: "React JSX에서 tertiary 버튼을 직접 렌더링합니다." } },
  },
};

export const ButtonStates: Story = {
  name: "Button · disabled state",
  render: () => (
    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
      <Button>활성 버튼</Button>
      <Button disabled>비활성 버튼</Button>
    </div>
  ),
  parameters: {
    fixtureId: "button.primary.medium.default",
    fixtureState: "disabled",
    a11y: { test: "error" },
    docs: {
      description: { story: "동일한 public API에서 native disabled semantics를 확인합니다." },
    },
  },
};

export const TextInputDefault: Story = {
  name: "TextInput · default / medium",
  args: { state: "default", size: "medium" },
  render: (args) => (
    <TextInput {...args} id="react-text-input-default" label="이름" hint="실명을 입력하세요." />
  ),
  parameters: {
    fixtureId: "text-input.default.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: "React JSX에서 label과 hint를 연결한 기본 입력 필드입니다." } },
  },
};

export const TextInputError: Story = {
  name: "TextInput · error",
  render: () => (
    <TextInput
      id="react-text-input-error"
      label="이메일"
      hint="이메일 주소를 확인하세요."
      state="error"
    />
  ),
  parameters: {
    fixtureId: "text-input.error.medium",
    fixtureState: "invalid",
    a11y: { test: "error" },
    docs: {
      description: {
        story: 'React JSX에서 state="error"를 사용해 invalid와 설명 관계를 확인합니다.',
      },
    },
  },
};

export const TextInputSuccess: Story = {
  name: "TextInput · success",
  render: () => (
    <TextInput
      id="react-text-input-success"
      label="아이디"
      hint="사용할 수 있는 아이디입니다."
      state="success"
      defaultValue="community"
    />
  ),
  parameters: {
    fixtureId: "text-input.success.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: "React JSX에서 성공 상태와 설명 메시지를 함께 표시합니다." } },
  },
};

export const TextInputInformation: Story = {
  name: "TextInput · information",
  render: () => (
    <TextInput
      id="react-text-input-information"
      label="알림 수신 주소"
      hint="업데이트 소식을 받을 주소를 입력하세요."
      state="information"
    />
  ),
  parameters: {
    fixtureId: "text-input.information.medium",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: "React JSX에서 information 상태를 직접 지정합니다." } },
  },
};

export const TextInputStates: Story = {
  name: "TextInput · placeholder / readonly / disabled",
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 480 }}>
      <TextInput
        id="react-text-input-placeholder"
        label="검색"
        placeholder="검색어를 입력하세요."
      />
      <TextInput id="react-text-input-readonly" label="읽기 전용" defaultValue="고정 값" readOnly />
      <TextInput
        id="react-text-input-disabled"
        label="비활성"
        defaultValue="입력할 수 없음"
        disabled
      />
    </div>
  ),
  parameters: {
    fixtureId: "text-input.default.medium",
    fixtureState: "placeholder-readonly-disabled",
    a11y: { test: "error" },
    docs: {
      description: {
        story: "React의 native input props로 placeholder, readonly, disabled 상태를 확인합니다.",
      },
    },
  },
};

export const CheckboxMedium: Story = {
  name: "Checkbox · medium states",
  render: () => (
    <fieldset style={{ display: "grid", gap: ".5rem" }}>
      <legend>약관 동의</legend>
      <Checkbox
        id="react-checkbox-medium-default"
        label="선택 안 함"
        name="react-checkbox-medium"
      />
      <Checkbox
        id="react-checkbox-medium-checked"
        label="선택됨"
        name="react-checkbox-medium"
        defaultChecked
      />
      <Checkbox
        id="react-checkbox-medium-disabled"
        label="비활성"
        name="react-checkbox-medium"
        disabled
      />
      <Checkbox
        id="react-checkbox-medium-disabled-checked"
        label="비활성 선택됨"
        name="react-checkbox-medium"
        disabled
        defaultChecked
      />
    </fieldset>
  ),
  parameters: {
    fixtureId: "checkbox.default.medium",
    fixtureStates: ["default", "checked", "disabled", "disabled-checked", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "React JSX에서 native checkbox의 checked/disabled 상태를 한 fixture 묶음으로 확인합니다.",
      },
    },
  },
};

export const CheckboxLarge: Story = {
  name: "Checkbox · large",
  render: () => (
    <Checkbox
      id="react-checkbox-large"
      label="큰 체크박스"
      name="react-checkbox-large"
      size="large"
    />
  ),
  parameters: {
    fixtureId: "checkbox.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: 'React JSX에서 size="large" public prop을 사용합니다.' } },
  },
};

export const RadioMedium: Story = {
  name: "Radio · medium states",
  render: () => (
    <fieldset style={{ display: "grid", gap: ".5rem" }}>
      <legend>알림 빈도</legend>
      <Radio
        id="react-radio-medium-daily"
        label="매일"
        name="react-radio-medium"
        value="daily"
        defaultChecked
      />
      <Radio id="react-radio-medium-weekly" label="매주" name="react-radio-medium" value="weekly" />
      <Radio
        id="react-radio-medium-disabled"
        label="사용 안 함"
        name="react-radio-medium"
        value="none"
        disabled
      />
    </fieldset>
  ),
  parameters: {
    fixtureId: "radio.default.medium",
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: { story: "React JSX에서 같은 name을 공유하는 native radio group을 사용합니다." },
    },
  },
};

export const RadioLarge: Story = {
  name: "Radio · large",
  render: () => (
    <Radio
      id="react-radio-large"
      label="큰 라디오"
      name="react-radio-large"
      value="large"
      size="large"
    />
  ),
  parameters: {
    fixtureId: "radio.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: 'React JSX에서 size="large" 라디오를 직접 렌더링합니다.' } },
  },
};

export const SwitchMedium: Story = {
  name: "Switch · medium states",
  render: () => (
    <div style={{ display: "grid", gap: ".5rem" }}>
      <Switch id="react-switch-medium-default" label="알림 받기" name="react-switch-medium" />
      <Switch
        id="react-switch-medium-checked"
        label="자동 저장"
        name="react-switch-medium"
        defaultChecked
      />
      <Switch
        id="react-switch-medium-disabled"
        label="비활성"
        name="react-switch-medium"
        disabled
      />
    </div>
  ),
  parameters: {
    fixtureId: "switch.default.medium",
    fixtureStates: ["default", "checked", "disabled", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: { story: "React JSX에서 native checkbox 기반 switch 상태를 확인합니다." },
    },
  },
};

export const SwitchLarge: Story = {
  name: "Switch · large",
  render: () => (
    <Switch id="react-switch-large" label="큰 스위치" name="react-switch-large" size="large" />
  ),
  parameters: {
    fixtureId: "switch.default.large",
    fixtureState: "default",
    a11y: { test: "error" },
    docs: { description: { story: 'React JSX에서 size="large" 스위치를 직접 렌더링합니다.' } },
  },
};

export const AccordionDefault: Story = {
  name: "Accordion · default / single",
  render: () => (
    <Accordion
      items={[
        { id: "react-accordion-one", title: "기본 아코디언", content: "첫 번째 안내 내용입니다." },
        { id: "react-accordion-two", title: "두 번째 항목", content: "두 번째 안내 내용입니다." },
      ]}
    />
  ),
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
        story:
          "React JSX에서 Accordion items를 public API로 전달하며 클릭/키보드 상태를 검증합니다.",
      },
    },
  },
};

export const AccordionLine: Story = {
  name: "Accordion · line / single",
  render: () => (
    <Accordion
      type="line"
      items={[
        { id: "react-accordion-line", title: "라인 아코디언", content: "라인 안내 내용입니다." },
      ]}
    />
  ),
  parameters: {
    fixtureId: "accordion.line.single",
    fixtureStates: ["collapsed", "expanded", "focus-visible", "keyboard-toggle"],
    a11y: { test: "error" },
    docs: { description: { story: 'React JSX에서 type="line" variant를 직접 지정합니다.' } },
  },
};

export const TabDefault: Story = {
  name: "Tab · default",
  render: () => (
    <Tab
      tabs={[
        { id: "react-tab-one", label: "첫 탭" },
        { id: "react-tab-two", label: "두 번째 탭" },
      ]}
      panels={{ "react-tab-one": "첫 번째 패널", "react-tab-two": "두 번째 패널" }}
    />
  ),
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
      description: { story: "React JSX에서 Tab tabs/panels public API와 선택 상태를 확인합니다." },
    },
  },
};

export const FormInteraction: Story = {
  name: "Form · input and checkbox interaction",
  render: () => {
    function FormExample() {
      const [submitted, setSubmitted] = useState(false);
      return (
        <form
          aria-label="프로필 입력"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
          style={{ display: "grid", gap: "1rem", maxWidth: 480 }}
        >
          <TextInput id="react-form-name" label="이름" hint="실명을 입력하세요." name="name" />
          <Checkbox id="react-form-terms" label="약관에 동의합니다." name="terms" />
          <Button type="submit">제출</Button>
          {submitted ? <p role="status">제출되었습니다.</p> : null}
        </form>
      );
    }
    return <FormExample />;
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
      description: {
        story: "React JSX form에서 native input event와 submit 흐름을 play test로 확인합니다.",
      },
    },
  },
};

export const ModalDefault: Story = {
  name: "Modal · default",
  render: () => {
    function ModalExample() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <Button onClick={() => setOpen(true)}>모달 열기</Button>
          <Modal
            id="react-modal-default"
            open={open}
            title="확인 모달"
            onClose={() => setOpen(false)}
          >
            저장하시겠습니까?
          </Modal>
        </div>
      );
    }
    return <ModalExample />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("dialog", { name: "확인 모달" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "모달 열기" }));
    await expect(canvas.getByRole("dialog", { name: "확인 모달" })).toBeVisible();
  },
  parameters: {
    fixtureId: "modal.default",
    fixtureStates: ["default", "focus-visible"],
    a11y: { test: "error" },
    docs: {
      description: {
        story: "React JSX에서 Modal open/onClose 흐름과 dialog accessible name을 확인합니다.",
      },
    },
  },
};
