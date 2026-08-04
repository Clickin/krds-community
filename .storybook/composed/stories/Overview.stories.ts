import type { Meta, StoryObj } from "@storybook/html-vite";

const meta = {
  title: "KRDS Community/Overview",
  parameters: {
    layout: "centered",
  },
  render: () => `
    <main style="max-width: 42rem; font-family: system-ui, sans-serif; line-height: 1.6">
      <p style="margin: 0; color: #58616a">KRDS Community</p>
      <h1 style="margin: .25rem 0 1rem">Multi-framework Storybook</h1>
      <p>왼쪽 탐색에서 React, Vue, Svelte, SolidJS, Angular 구현과 예제를 함께 확인할 수 있습니다.</p>
      <p>각 항목은 프레임워크 고유 렌더러와 생명주기를 유지하는 독립 Storybook preview입니다.</p>
    </main>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};
