import type { Meta, StoryObj } from "@storybook/svelte-vite";
import AllComponents from "./AllComponents.svelte";

const meta = {
  title: "Svelte/전체 컴포넌트",
  component: AllComponents,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
  },
} satisfies Meta<AllComponents>;
export default meta;
export const Inventory: StoryObj<typeof meta> = {
  name: "전체 인벤토리",
  parameters: {
    a11y: { test: "error" },
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
  },
};
