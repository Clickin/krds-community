import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, Button, Checkbox, Radio, Switch, TextInput } from '@krds-community/react';

const meta = {
  title: 'React/기본 구성',
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
      <Button>버튼</Button>
      <TextInput label="이름" hint="실명을 입력하세요." />
      <Checkbox label="약관에 동의합니다." name="terms" />
      <Radio label="첫 번째 선택지" name="choice" value="one" />
      <Switch label="알림 받기" name="notifications" />
      <Accordion items={[{ id: 'one', title: '방문 안내', content: '서비스 이용 안내입니다.' }]} />
    </div>
  ),
} satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = { name: '기본 예시' };
