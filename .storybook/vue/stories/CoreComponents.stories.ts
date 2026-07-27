import { expect, userEvent, within } from 'storybook/test';
import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  Accordion,
  Button,
  Checkbox,
  Modal,
  Radio,
  Switch,
  Tab,
  TextInput,
} from '@krds-community/vue';

const meta = {
  title: 'Vue/핵심 컴포넌트',
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    state: { control: 'select', options: ['default', 'error', 'success', 'information'] },
  },
} satisfies Meta;

export default meta;
type StoryArgs = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'error' | 'success' | 'information';
};
type Story = StoryObj<StoryArgs>;


export const ButtonPrimary: Story = {
  name: 'Button · primary / medium',
  args: { variant: 'primary', size: 'medium' },
  render: (args) => ({ setup: () => () => h(Button, args, { default: () => '저장' }) }),
  parameters: {
    fixtureId: 'button.primary.medium.default',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue template에서 Button public props를 사용합니다.' } },
  },
};

export const ButtonSecondary: Story = {
  name: 'Button · secondary / medium',
  render: () => ({ setup: () => () => h(Button, { variant: 'secondary' }, { default: () => '보조 작업' }) }),
  parameters: {
    fixtureId: 'button.secondary.medium.default',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 secondary 버튼을 직접 렌더링합니다.' } },
  },
};

export const ButtonTertiary: Story = {
  name: 'Button · tertiary / medium',
  render: () => ({ setup: () => () => h(Button, { variant: 'tertiary' }, { default: () => '취소' }) }),
  parameters: {
    fixtureId: 'button.tertiary.medium.default',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 tertiary 버튼을 직접 렌더링합니다.' } },
  },
};

export const ButtonStates: Story = {
  name: 'Button · disabled state',
  render: () => ({ setup: () => () =>
    h('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' }, [
      h(Button, null, { default: () => '활성 버튼' }),
      h(Button, { disabled: true }, { default: () => '비활성 버튼' }),
    ]),
  }),
  parameters: {
    fixtureId: 'button.primary.medium.default',
    fixtureState: 'disabled',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue public API에서 native disabled semantics를 확인합니다.' } },
  },
};

export const TextInputDefault: Story = {
  name: 'TextInput · default / medium',
  args: { state: 'default', size: 'medium' },
  render: (args) => ({ setup: () => () =>
    h(TextInput, { ...args, id: 'vue-text-input-default', label: '이름', hint: '실명을 입력하세요.' }),
  }),
  parameters: {
    fixtureId: 'text-input.default.medium',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue public props로 label/hint relation을 확인합니다.' } },
  },
};

export const TextInputError: Story = {
  name: 'TextInput · error',
  render: () => ({
    setup: () =>
      h(TextInput, {
        id: 'vue-text-input-error',
        label: '이메일',
        hint: '이메일 주소를 확인하세요.',
        state: 'error',
      }),
  }),
  parameters: {
    fixtureId: 'text-input.error.medium',
    fixtureState: 'invalid',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 state="error"와 hint를 직접 전달합니다.' } },
  },
};
 
export const TextInputSuccess: Story = {
  name: 'TextInput · success',
  render: () => ({
    setup: () =>
      h(TextInput, {
        id: 'vue-text-input-success',
        label: '아이디',
        hint: '사용할 수 있는 아이디입니다.',
        state: 'success',
        defaultValue: 'community',
      }),
  }),
  parameters: {
    fixtureId: 'text-input.success.medium',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 success 상태와 메시지를 함께 표시합니다.' } },
  },
};


export const TextInputInformation: Story = {
  name: 'TextInput · information',
  render: () => ({
    setup: () =>
      h(TextInput, {
        id: 'vue-text-input-information',
        label: '알림 수신 주소',
        hint: '업데이트 소식을 받을 주소를 입력하세요.',
        state: 'information',
      }),
  }),
  parameters: {
    fixtureId: 'text-input.information.medium',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 information 상태를 직접 지정합니다.' } },
  },
};

export const TextInputStates: Story = {
  name: 'TextInput · placeholder / readonly / disabled',
  render: () => ({
    setup: () =>
      h('div', { style: 'display:grid;gap:1rem;max-width:30rem' }, [
        h(TextInput, { id: 'vue-text-input-placeholder', label: '검색', placeholder: '검색어를 입력하세요.' }),
        h(TextInput, { id: 'vue-text-input-readonly', label: '읽기 전용', defaultValue: '고정 값', readonly: true }),
        h(TextInput, { id: 'vue-text-input-disabled', label: '비활성', defaultValue: '입력할 수 없음', disabled: true }),
      ]),
  }),
  parameters: {
    fixtureId: 'text-input.default.medium',
    fixtureState: 'placeholder-readonly-disabled',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue native input props로 placeholder/readonly/disabled 상태를 확인합니다.' } },
  },
};

export const CheckboxMedium: Story = {
  name: 'Checkbox · medium states',
  render: () => ({
    setup: () =>
      h('fieldset', { style: 'display:grid;gap:.5rem' }, [
        h('legend', '약관 동의'),
        h(Checkbox, { id: 'vue-checkbox-medium-default', label: '선택 안 함', name: 'vue-checkbox-medium' }),
        h(Checkbox, { id: 'vue-checkbox-medium-checked', label: '선택됨', name: 'vue-checkbox-medium', defaultChecked: true }),
        h(Checkbox, { id: 'vue-checkbox-medium-disabled', label: '비활성', name: 'vue-checkbox-medium', disabled: true }),
        h(Checkbox, { id: 'vue-checkbox-medium-disabled-checked', label: '비활성 선택됨', name: 'vue-checkbox-medium', disabled: true, defaultChecked: true }),
      ]),
  }),
  parameters: {
    fixtureId: 'checkbox.default.medium',
    fixtureStates: ['default', 'checked', 'disabled', 'disabled-checked', 'focus-visible'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue public API에서 checkbox 상태와 native label relation을 확인합니다.' } },
  },
};


export const CheckboxLarge: Story = {
  name: 'Checkbox · large',
  render: () => ({ setup: () => () => h(Checkbox, { id: 'vue-checkbox-large', label: '큰 체크박스', name: 'vue-checkbox-large', size: 'large' }) }),
  parameters: {
    fixtureId: 'checkbox.default.large',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 size="large" public prop을 사용합니다.' } },
  },
};

export const RadioMedium: Story = {
  name: 'Radio · medium states',
  render: () => ({ setup: () => () =>
    h('fieldset', { style: 'display:grid;gap:.5rem' }, [
      h('legend', '알림 빈도'),
      h(Radio, { id: 'vue-radio-medium-daily', label: '매일', name: 'vue-radio-medium', value: 'daily', defaultValue: 'daily' }),
      h(Radio, { id: 'vue-radio-medium-weekly', label: '매주', name: 'vue-radio-medium', value: 'weekly' }),
      h(Radio, { id: 'vue-radio-medium-disabled', label: '사용 안 함', name: 'vue-radio-medium', value: 'none', disabled: true }),
    ]),
  }),
  parameters: {
    fixtureId: 'radio.default.medium',
    fixtureStates: ['default', 'checked', 'disabled', 'focus-visible'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 같은 name을 공유하는 radio group을 사용합니다.' } },
  },
};

export const RadioLarge: Story = {
  name: 'Radio · large',
  render: () => ({ setup: () => () => h(Radio, { id: 'vue-radio-large', label: '큰 라디오', name: 'vue-radio-large', value: 'large', size: 'large' }) }),
  parameters: {
    fixtureId: 'radio.default.large',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 size="large" 라디오를 직접 렌더링합니다.' } },
  },
};

export const SwitchMedium: Story = {
  name: 'Switch · medium states',
  render: () => ({
    setup: () =>
      h('div', { style: 'display:grid;gap:1rem;max-width:30rem' }, [
        h(Switch, { id: 'vue-switch-medium-default', label: '알림 받기', name: 'vue-switch-medium' }),
        h(Switch, { id: 'vue-switch-medium-checked', label: '자동 저장', name: 'vue-switch-medium', defaultChecked: true }),
        h(Switch, { id: 'vue-switch-medium-disabled', label: '비활성', name: 'vue-switch-medium', disabled: true }),
      ]),
  }),
  parameters: {
    fixtureId: 'switch.default.medium',
    fixtureStates: ['default', 'checked', 'disabled', 'focus-visible'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 native checkbox 기반 switch 상태를 확인합니다.' } },
  },
};

export const SwitchLarge: Story = {
  name: 'Switch · large',
  render: () => ({ setup: () => h(Switch, { id: 'vue-switch-large', label: '큰 스위치', name: 'vue-switch-large', size: 'large' }) }),
  parameters: {
    fixtureId: 'switch.default.large',
    fixtureState: 'default',
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 size="large" 스위치를 직접 렌더링합니다.' } },
  },
};


export const AccordionDefault: Story = {
  name: 'Accordion · default / single',
  render: () => ({
    setup: () =>
      h(Accordion, {
        items: [
          { id: 'vue-accordion-one', title: '기본 아코디언', content: '첫 번째 안내 내용입니다.' },
          { id: 'vue-accordion-two', title: '두 번째 항목', content: '두 번째 안내 내용입니다.' },
        ],
      }),
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '기본 아코디언' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('region', { name: '기본 아코디언' })).toBeVisible();
  },
  parameters: {
    fixtureId: 'accordion.default.single',
    fixtureStates: ['collapsed', 'expanded', 'focus-visible', 'keyboard-toggle'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue render function에서 Accordion items를 public API로 전달합니다.' } },
  },
};

export const AccordionLine: Story = {
  name: 'Accordion · line / single',
  render: () => ({
    setup: () =>
      h(Accordion, { type: 'line', items: [{ id: 'vue-accordion-line', title: '라인 아코디언', content: '라인 안내 내용입니다.' }] }),
  }),
  parameters: {
    fixtureId: 'accordion.line.single',
    fixtureStates: ['collapsed', 'expanded', 'focus-visible', 'keyboard-toggle'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue에서 type="line" variant를 직접 지정합니다.' } },
  },
};

export const TabDefault: Story = {
  name: 'Tab · default',
  render: () => ({
    setup: () =>
      h(Tab, {
        tabs: [{ id: 'vue-tab-one', label: '첫 탭' }, { id: 'vue-tab-two', label: '두 번째 탭' }],
        panels: { 'vue-tab-one': '첫 번째 패널', 'vue-tab-two': '두 번째 패널' },
      }),
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const secondTab = canvas.getByRole('tab', { name: '두 번째 탭' });
    await userEvent.click(secondTab);
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('두 번째 패널');
  },
  parameters: {
    fixtureId: 'tab.default',
    fixtureStates: ['default', 'focus-visible'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue render function에서 Tab tabs/panels와 선택 상태를 확인합니다.' } },
  },
};

export const FormInteraction: Story = {
  name: 'Form · input and checkbox interaction',
  render: () => {
    const submitted = ref(false);
    return {
      setup: () => () =>
        h('form', {
          'aria-label': '프로필 입력',
          style: 'display:grid;gap:1rem;max-width:30rem',
          onSubmit: (event: Event) => {
            event.preventDefault();
            submitted.value = true;
          },
        }, [
          h(TextInput, { id: 'vue-form-name', label: '이름', hint: '실명을 입력하세요.', name: 'name' }),
          h(Checkbox, { id: 'vue-form-terms', label: '약관에 동의합니다.', name: 'terms' }),
          h(Button, { type: 'submit' }, { default: () => '제출' }),
          h('p', { role: 'status', hidden: !submitted.value }, '제출되었습니다.'),
        ]),
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: '이름' }), '홍길동');
    await userEvent.click(canvas.getByRole('checkbox', { name: '약관에 동의합니다.' }));
    await userEvent.click(canvas.getByRole('button', { name: '제출' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('제출되었습니다.');
  },
  parameters: {
    fixtureIds: ['text-input.default.medium', 'checkbox.default.medium'],
    fixtureStates: ['default', 'focus-visible', 'checked'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue render function에서 native form 이벤트와 submit 흐름을 검증합니다.' } },
  },
};

export const ModalDefault: Story = {
  name: 'Modal · default',
  render: () => {
    const open = ref(true);
    return {
      setup: () => () =>
        h('div', [
          h(Button, { onClick: () => (open.value = true) }, { default: () => '모달 열기' }),
          h(Modal, {
            id: 'vue-modal-default',
            open: open.value,
            title: '확인 모달',
            onOpenChange: (value: boolean) => (open.value = value),
          }, { default: () => '저장하시겠습니까?' }),
        ]),
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog', { name: '확인 모달' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }));
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }));
    await expect(canvas.getByRole('dialog', { name: '확인 모달' })).toBeVisible();
  },
  parameters: {
    fixtureId: 'modal.default',
    fixtureStates: ['default', 'focus-visible'],
    a11y: { test: 'error' },
    docs: { description: { story: 'Vue render function에서 Modal openChange와 dialog accessible name을 확인합니다.' } },
  },
};
