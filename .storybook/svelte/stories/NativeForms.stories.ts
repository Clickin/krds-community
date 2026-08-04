import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import NativeForms from "./NativeForms.svelte";

const meta = {
  title: "Svelte/폼·선택 컨트롤",
  component: NativeForms,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    fixtureIds: ["text-input.default.medium", "checkbox.default.medium", "switch.default.medium"],
    fixtureStates: ["default", "focus-visible", "checked"],
  },
} satisfies Meta<NativeForms>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BindableForm: Story = {
  name: "Svelte 5 · bindable values + native submit",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "이름" }), "홍길동");
    await userEvent.click(canvas.getByRole("checkbox", { name: "약관에 동의합니다." }));
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("홍길동");
    await expect(canvas.getByRole("status")).toHaveTextContent("약관 동의");
  },
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        story:
          "Svelte 5의 bind:value와 bind:checked를 native form submit과 함께 사용합니다. 컴포넌트는 snippet으로 버튼 콘텐츠를 받으며 제출 상태는 aria-live status로 전달됩니다.",
      },
    },
  },
};
