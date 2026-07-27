import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Accordion, Button, Checkbox, Radio, Switch, TextInput } from '@krds-community/vue';

const meta = {
  title: 'Vue/기본 구성',
  render: () => ({
    components: { Accordion, Button, Checkbox, Radio, Switch, TextInput },
    setup() {
      return () =>
        h('div', { style: 'display:grid;gap:1rem;max-width:30rem' }, [
          h(Button, null, { default: () => '버튼' }),
          h(TextInput, { label: '이름', hint: '실명을 입력하세요.' }),
          h(Checkbox, { label: '약관에 동의합니다.', name: 'terms' }),
          h(Radio, { label: '첫 번째 선택지', name: 'choice', value: 'one' }),
          h(Switch, { label: '알림 받기', name: 'notifications' }),
          h(Accordion, {
            items: [{ id: 'one', title: '방문 안내', content: '서비스 이용 안내입니다.' }],
          }),
        ]);
    },
  }),
} satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = {
  name: '기본 예시',
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: ['button.primary.medium.default', 'text-input.default.medium', 'checkbox.default.medium', 'radio.default.medium', 'switch.default.medium', 'accordion.default.single'],
  },
};
