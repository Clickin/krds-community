import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import CoreComponents from './CoreComponents.svelte';

const meta = {
  title: 'Svelte/핵심 컴포넌트',
  component: CoreComponents,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
  },
  argTypes: {
    view: { control: 'select', options: ['button', 'button-states', 'text-input', 'text-input-states', 'checkbox-medium', 'checkbox-large', 'radio-medium', 'radio-large', 'switch-medium', 'switch-large', 'accordion-default', 'accordion-line', 'tab', 'form', 'modal'] },
    buttonVariant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    buttonSize: { control: 'select', options: ['small', 'medium', 'large'] },
    inputState: { control: 'select', options: ['default', 'error', 'success', 'information'] },
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<CoreComponents>;

export default meta;
type Story = StoryObj<typeof meta>;

const usage = (story: string) => ({ description: { story } });

export const ButtonPrimary: Story = {
  name: 'Button · primary / medium',
  args: { view: 'button', buttonVariant: 'primary', buttonSize: 'medium' },
  parameters: { fixtureId: 'button.primary.medium.default', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 Button public props를 사용합니다.').description } },
};

export const ButtonSecondary: Story = {
  name: 'Button · secondary / medium',
  args: { view: 'button', buttonVariant: 'secondary' },
  parameters: { fixtureId: 'button.secondary.medium.default', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 secondary 버튼을 직접 렌더링합니다.').description } },
};

export const ButtonTertiary: Story = {
  name: 'Button · tertiary / medium',
  args: { view: 'button', buttonVariant: 'tertiary' },
  parameters: { fixtureId: 'button.tertiary.medium.default', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 tertiary 버튼을 직접 렌더링합니다.').description } },
};

export const ButtonStates: Story = {
  name: 'Button · disabled state',
  args: { view: 'button-states' },
  parameters: { fixtureId: 'button.primary.medium.default', fixtureState: 'disabled', a11y: { test: 'error' }, docs: { description: usage('Svelte public component에서 native disabled semantics를 확인합니다.').description } },
};

export const TextInputDefault: Story = {
  name: 'TextInput · default / medium',
  args: { view: 'text-input', inputState: 'default', inputSize: 'medium' },
  parameters: { fixtureId: 'text-input.default.medium', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 label과 hint relation을 확인합니다.').description } },
};

export const TextInputError: Story = {
  name: 'TextInput · error',
  args: { view: 'text-input', inputState: 'error' },
  parameters: { fixtureId: 'text-input.error.medium', fixtureState: 'invalid', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 state="error"와 hint를 직접 지정합니다.').description } },
};

export const TextInputSuccess: Story = {
  name: 'TextInput · success',
  args: { view: 'text-input', inputState: 'success' },
  parameters: { fixtureId: 'text-input.success.medium', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 success 상태를 직접 지정합니다.').description } },
};

export const TextInputInformation: Story = {
  name: 'TextInput · information',
  args: { view: 'text-input', inputState: 'information' },
  parameters: { fixtureId: 'text-input.information.medium', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 information 상태를 직접 지정합니다.').description } },
};

export const TextInputStates: Story = {
  name: 'TextInput · placeholder / readonly / disabled',
  args: { view: 'text-input-states' },
};

export const CheckboxMedium: Story = {
  name: 'Checkbox · medium states',
  args: { view: 'checkbox-medium' },
  parameters: { fixtureId: 'checkbox.default.medium', fixtureStates: ['default', 'checked', 'disabled', 'disabled-checked', 'focus-visible'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 native checkbox 상태와 label relation을 확인합니다.').description } },
};

export const CheckboxLarge: Story = {
  name: 'Checkbox · large',
  args: { view: 'checkbox-large' },
  parameters: { fixtureId: 'checkbox.default.large', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 size="large" checkbox를 직접 렌더링합니다.').description } },
};

export const RadioMedium: Story = {
  name: 'Radio · medium states',
  args: { view: 'radio-medium' },
  parameters: { fixtureId: 'radio.default.medium', fixtureStates: ['default', 'checked', 'disabled', 'focus-visible'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 같은 name을 공유하는 radio group을 사용합니다.').description } },
};

export const RadioLarge: Story = {
  name: 'Radio · large',
  args: { view: 'radio-large' },
  parameters: { fixtureId: 'radio.default.large', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 size="large" radio를 직접 렌더링합니다.').description } },
};

export const SwitchMedium: Story = {
  name: 'Switch · medium states',
  args: { view: 'switch-medium' },
  parameters: { fixtureId: 'switch.default.medium', fixtureStates: ['default', 'checked', 'disabled', 'focus-visible'], a11y: { test: 'error' }, docs: { description: usage('Svelte native checkbox 기반 switch 상태를 확인합니다.').description } },
};

export const SwitchLarge: Story = {
  name: 'Switch · large',
  args: { view: 'switch-large' },
  parameters: { fixtureId: 'switch.default.large', fixtureState: 'default', a11y: { test: 'error' }, docs: { description: usage('Svelte에서 size="large" switch를 직접 렌더링합니다.').description } },
};

export const AccordionDefault: Story = {
  name: 'Accordion · default / single',
  args: { view: 'accordion-default' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '기본 아코디언' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('region', { name: '기본 아코디언' })).toBeVisible();
  },
  parameters: { fixtureId: 'accordion.default.single', fixtureStates: ['collapsed', 'expanded', 'focus-visible', 'keyboard-toggle'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 Accordion items를 전달하며 keyboard/click 상태를 확인합니다.').description } },
};

export const AccordionLine: Story = {
  name: 'Accordion · line / single',
  args: { view: 'accordion-line' },
  parameters: { fixtureId: 'accordion.line.single', fixtureStates: ['collapsed', 'expanded', 'focus-visible', 'keyboard-toggle'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 type="line" variant를 직접 지정합니다.').description } },
};

export const TabDefault: Story = {
  name: 'Tab · default',
  args: { view: 'tab' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const secondTab = canvas.getByRole('tab', { name: '두 번째 탭' });
    await userEvent.click(secondTab);
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('두 번째 패널');
  },
  parameters: { fixtureId: 'tab.default', fixtureStates: ['default', 'focus-visible'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 Tab tabs/panels와 선택 상태를 확인합니다.').description } },
};

export const FormInteraction: Story = {
  name: 'Form · input and checkbox interaction',
  args: { view: 'form' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: '이름' }), '홍길동');
    await userEvent.click(canvas.getByRole('checkbox', { name: '약관에 동의합니다.' }));
    await userEvent.click(canvas.getByRole('button', { name: '제출' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('제출되었습니다.');
  },
  parameters: { fixtureIds: ['text-input.default.medium', 'checkbox.default.medium'], fixtureStates: ['default', 'focus-visible', 'checked'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 native form event와 submit 흐름을 play test로 검증합니다.').description } },
};

export const ModalDefault: Story = {
  name: 'Modal · default',
  args: { view: 'modal' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog', { name: '확인 모달' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }));
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }));
    await expect(canvas.getByRole('dialog', { name: '확인 모달' })).toBeVisible();
  },
  parameters: { fixtureId: 'modal.default', fixtureStates: ['default', 'focus-visible'], a11y: { test: 'error' }, docs: { description: usage('Svelte markup에서 Modal open/close와 dialog accessible name을 확인합니다.').description } },
};
