import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import AdditionalShowcase from './AdditionalShowcase.svelte';

const meta = {
  title: 'Svelte/폼·선택 컨트롤',
  component: AdditionalShowcase,
  parameters: { layout: 'padded', a11y: { test: 'error' } },
  argTypes: {
    component: {
      control: 'select',
      options: [
        'CheckboxChip',
        'CheckboxSize',
        'RadioButton',
        'RadioChip',
        'RadioSize',
        'TextInputIcon',
        'TextInputSize',
        'TextInputState',
        'Textarea',
        'TextList',
        'TextListOrdered',
        'ToggleSwitch',
        'ToggleSwitchSize',
      ],
    },
    componentProps: { control: 'object' },
    snippetText: { control: 'text' },
    eventLabel: { control: 'text' },
    formLabel: { control: 'text' },
  },
} satisfies Meta<AdditionalShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixtureParameters = (fixtureId: string, fixtureStates: string[]) => ({
  fixtureId,
  fixtureIds: [fixtureId],
  fixtureStates,
  a11y: { test: 'error' },
});

export const CheckboxChip: Story = {
  name: 'Checkbox · chip',
  args: {
    component: 'CheckboxChip',
    componentProps: {
      id: 'svelte-checkbox-chip',
      label: '서비스 알림',
      name: 'svelte-chip',
      value: 'notice',
      modelValue: ['notice'],
    },
    eventLabel: '체크 칩',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: '서비스 알림' });
    await userEvent.click(checkbox);
    await expect(canvas.getByRole('status')).toHaveTextContent('change');
  },
  parameters: { ...fixtureParameters('checkbox-chip.default', ['default', 'focus-visible']) },
};

export const CheckboxSize: Story = {
  name: 'Checkbox · large size',
  args: {
    component: 'CheckboxSize',
    componentProps: {
      id: 'svelte-checkbox-size',
      label: '큰 체크박스',
      name: 'svelte-checkbox-size',
      size: 'large',
    },
    eventLabel: '큰 체크박스',
  },
  parameters: { ...fixtureParameters('checkbox-size.default', ['default', 'focus-visible']) },
};

export const RadioButton: Story = {
  name: 'Radio · button',
  args: {
    component: 'RadioButton',
    componentProps: {
      id: 'svelte-radio-button',
      label: '기본 선택지',
      name: 'svelte-radio-button',
      value: 'one',
      modelValue: 'one',
    },
    eventLabel: '라디오 버튼',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '기본 선택지' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('change');
  },
  parameters: { ...fixtureParameters('radio-button.default', ['default', 'focus-visible']) },
};

export const RadioChip: Story = {
  name: 'Radio · chip',
  args: {
    component: 'RadioChip',
    componentProps: {
      id: 'svelte-radio-chip',
      label: '칩 선택지',
      name: 'svelte-radio-chip',
      value: 'chip-one',
      modelValue: 'chip-one',
    },
    eventLabel: '라디오 칩',
  },
  parameters: { ...fixtureParameters('radio-chip.default', ['default', 'focus-visible']) },
};

export const RadioSize: Story = {
  name: 'Radio · medium size',
  args: {
    component: 'RadioSize',
    componentProps: {
      id: 'svelte-radio-size',
      label: '중간 라디오',
      name: 'svelte-radio-size',
      value: 'medium',
      size: 'medium',
    },
    eventLabel: '라디오 크기',
  },
  parameters: { ...fixtureParameters('radio-size.default', ['default', 'focus-visible']) },
};

export const ToggleSwitch: Story = {
  name: 'Toggle switch · default',
  args: {
    component: 'ToggleSwitch',
    componentProps: {
      id: 'svelte-toggle-switch',
      label: '자동 저장',
      name: 'svelte-toggle-switch',
      checked: true,
    },
    eventLabel: '토글 스위치',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: '자동 저장' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('change');
  },
  parameters: { ...fixtureParameters('toggle-switch.default', ['default', 'focus-visible']) },
};

export const ToggleSwitchSize: Story = {
  name: 'Toggle switch · large',
  args: {
    component: 'ToggleSwitchSize',
    componentProps: {
      id: 'svelte-toggle-switch-size',
      label: '큰 스위치',
      name: 'svelte-toggle-switch-size',
      size: 'large',
    },
    eventLabel: '큰 토글 스위치',
  },
  parameters: { ...fixtureParameters('toggle-switch-size.default', ['default', 'focus-visible']) },
};

export const TextInputIcon: Story = {
  name: 'Text input · icon / password',
  args: {
    component: 'TextInputIcon',
    componentProps: {
      id: 'svelte-text-input-icon',
      label: '비밀번호',
      type: 'password',
      value: '1234567890',
      placeholder: '8-12자의 영문자, 숫자, 특수문자 조합',
      hint: '비밀번호를 입력하세요.',
    },
    eventLabel: '아이콘 입력',
    formLabel: '비밀번호 입력',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'x');
    await userEvent.click(canvas.getByRole('button', { name: '제출' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('submit');
  },
  parameters: { ...fixtureParameters('text-input-icon.default', ['default', 'focus-visible']) },
};

export const TextInputSize: Story = {
  name: 'Text input · small size',
  args: {
    component: 'TextInputSize',
    componentProps: {
      id: 'svelte-text-input-size',
      label: '레이블',
      hint: '도움말',
      placeholder: '플레이스홀더',
      size: 'small',
      type: 'text',
    },
    eventLabel: '입력 크기',
  },
  parameters: { ...fixtureParameters('text-input-size.default', ['default', 'focus-visible']) },
};

export const TextInputState: Story = {
  name: 'Text input · error state',
  args: {
    component: 'TextInputState',
    componentProps: {
      id: 'svelte-text-input-state',
      label: '레이블',
      hint: '에러 메시지',
      state: 'error',
      value: '에러',
      placeholder: '플레이스홀더',
      type: 'text',
    },
    eventLabel: '입력 상태',
  },
  parameters: { ...fixtureParameters('text-input-state.default', ['default', 'focus-visible']) },
};

export const Textarea: Story = {
  name: 'Textarea · hint and placeholder',
  args: {
    component: 'Textarea',
    componentProps: {
      id: 'svelte-textarea',
      label: '문의 내용',
      hint: '문의 내용을 입력하세요.',
      placeholder: '플레이스홀더',
      value: '입력 예시',
      maxLength: 200,
    },
    eventLabel: '텍스트 영역',
    formLabel: '문의 작성',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('문의 내용'), ' 추가');
    await expect(canvas.getByRole('status')).toHaveTextContent('input');
  },
  parameters: { ...fixtureParameters('textarea.default', ['default', 'focus-visible']) },
};

const listItems = [
  {
    id: 'level-1-1',
    label: '텍스트 목록 레벨1',
  },
  {
    id: 'level-1-2',
    label: '텍스트 목록 레벨1',
    children: [
      { id: 'level-2-1', label: '텍스트 목록 레벨2' },
      {
        id: 'level-2-2',
        label: '텍스트 목록 레벨2',
        children: [
          { id: 'level-3-1', label: '텍스트 목록 레벨3' },
          { id: 'level-3-2', label: '텍스트 목록 레벨3' },
        ],
      },
      { id: 'level-2-3', label: '텍스트 목록 레벨2' },
    ],
  },
  { id: 'level-1-3', label: '텍스트 목록 레벨1' },
];

export const TextList: Story = {
  name: 'Text list · nested',
  args: {
    component: 'TextList',
    componentProps: { id: 'svelte-text-list', items: listItems },
    eventLabel: '텍스트 목록',
  },
  parameters: { ...fixtureParameters('text-list.default', ['default']) },
};

export const TextListOrdered: Story = {
  name: 'Text list · ordered and nested',
  args: {
    component: 'TextListOrdered',
    componentProps: { id: 'svelte-text-list-ordered', items: listItems },
    eventLabel: '순서 있는 목록',
  },
  parameters: { ...fixtureParameters('text-list-ordered.default', ['default']) },
};
