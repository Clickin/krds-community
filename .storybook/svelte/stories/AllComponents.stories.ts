import type { Meta, StoryObj } from '@storybook/svelte-vite';
import AllComponents from './AllComponents.svelte';

const meta = {
  title: 'Svelte/전체 컴포넌트',
  component: AllComponents,
  parameters: { layout: 'padded' },
} satisfies Meta<AllComponents>;
export default meta;
export const Inventory: StoryObj<typeof meta> = { name: '전체 인벤토리' };
