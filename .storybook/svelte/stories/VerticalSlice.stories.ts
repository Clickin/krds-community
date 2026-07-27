import type { Meta, StoryObj } from '@storybook/svelte-vite';
import VerticalSlice from './VerticalSlice.svelte';

const meta = {
  title: 'Svelte/기본 구성',
  component: VerticalSlice,
} satisfies Meta<VerticalSlice>;

export default meta;
export const Default: StoryObj<typeof meta> = {
  name: '기본 예시',
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'],
  },
};
