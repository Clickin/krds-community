import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import AdditionalShowcase from './AdditionalShowcase.svelte';

const meta = {
  title: 'Svelte/기초·상호작용',
  component: AdditionalShowcase,
  parameters: { layout: 'padded', a11y: { test: 'error' } },
  argTypes: {
    component: {
      control: 'select',
      options: [
        'AccordionLine',
        'Badge',
        'BadgeNumber',
        'BadgeSize',
        'ButtonHierarchy',
        'ButtonIcon',
        'ButtonSize',
        'ButtonText',
        'ButtonWithIcon',
        'Favicon',
        'Identifier',
        'Link',
        'Masthead',
        'SkipLink',
        'Spinner',
        'Tag',
        'TagLink',
      ],
    },
    componentProps: { control: 'object' },
    snippetText: { control: 'text' },
    eventLabel: { control: 'text' },
  },
} satisfies Meta<AdditionalShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixtureParameters = (fixtureId: string, fixtureStates: string[]) => ({
  fixtureIds: [fixtureId],
  fixtureId,
  fixtureStates,
  a11y: { test: 'error' },
});

export const AccordionLine: Story = {
  name: 'Accordion · line variant',
  args: {
    component: 'AccordionLine',
    componentProps: {
      id: 'svelte-accordion-line',
      type: 'line',
      multiple: false,
      items: [
        { id: 'svelte-accordion-line-one', title: '라인 아코디언', content: '라인 안내 내용입니다.' },
      ],
    },
    eventLabel: '라인 아코디언',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '라인 아코디언' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
  parameters: { ...fixtureParameters('accordion-line.default', ['default', 'focus-visible']) },
};

export const Badge: Story = {
  name: 'Badge · 기본 배지',
  args: {
    component: 'Badge',
    componentProps: { id: 'svelte-badge', label: 'Label', tone: 'primary', appearance: 'outline' },
    eventLabel: '배지',
  },
  parameters: { ...fixtureParameters('badge.default', ['default']) },
};

export const BadgeNumber: Story = {
  name: 'Badge · 숫자 배지',
  args: {
    component: 'BadgeNumber',
    componentProps: { id: 'svelte-badge-number', label: '5', appearance: 'solid', number: true },
    eventLabel: '숫자 배지',
  },
  parameters: { ...fixtureParameters('badge-number.default', ['default']) },
};

export const BadgeSize: Story = {
  name: 'Badge · large',
  args: {
    component: 'BadgeSize',
    componentProps: { id: 'svelte-badge-large', label: 'Label', size: 'large' },
    eventLabel: '큰 배지',
  },
  parameters: { ...fixtureParameters('badge-size.default', ['default']) },
};

export const ButtonHierarchy: Story = {
  name: 'Button · hierarchy / primary',
  args: {
    component: 'ButtonHierarchy',
    componentProps: { id: 'svelte-button-hierarchy', variant: 'primary', label: '기본 작업' },
    snippetText: '기본 작업',
    eventLabel: '계층 버튼',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '기본 작업' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('click');
  },
  parameters: { ...fixtureParameters('button-hierarchy.default', ['default', 'focus-visible']) },
};

export const ButtonIcon: Story = {
  name: 'Button · icon / search',
  args: {
    component: 'ButtonIcon',
    componentProps: { id: 'svelte-button-icon', label: '검색', size: 'medium' },
    eventLabel: '아이콘 버튼',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '검색' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('click');
  },
  parameters: { ...fixtureParameters('button-icon.default', ['default', 'focus-visible']) },
};

export const ButtonSize: Story = {
  name: 'Button · xsmall size',
  args: {
    component: 'ButtonSize',
    componentProps: { id: 'svelte-button-size', size: 'xsmall', label: 'x-small 버튼' },
    snippetText: 'x-small 버튼',
    eventLabel: '크기 버튼',
  },
  parameters: { ...fixtureParameters('button-size.default', ['default', 'focus-visible']) },
};

export const ButtonText: Story = {
  name: 'Button · text style',
  args: {
    component: 'ButtonText',
    componentProps: { id: 'svelte-button-text', className: 'small', label: '텍스트 버튼' },
    snippetText: '텍스트 버튼',
    eventLabel: '텍스트 버튼',
  },
  parameters: { ...fixtureParameters('button-text.default', ['default', 'focus-visible']) },
};

export const ButtonWithIcon: Story = {
  name: 'Button · with icon',
  args: {
    component: 'ButtonWithIcon',
    componentProps: { id: 'svelte-button-with-icon', className: 'xsmall', label: '검색' },
    snippetText: '검색',
    eventLabel: '아이콘 포함 버튼',
  },
  parameters: { ...fixtureParameters('button-with-icon.default', ['default', 'focus-visible']) },
};

export const Link: Story = {
  name: 'Link · external',
  args: {
    component: 'Link',
    componentProps: {
      id: 'svelte-link',
      href: 'https://www.site_name.com/',
      label: '기본 링크',
      target: '_blank',
      rel: 'noopener noreferrer',
      title: '새 창 열림',
      size: 'small',
    },
    snippetText: '기본 링크',
    eventLabel: '링크',
  },
  parameters: { ...fixtureParameters('link.default', ['default', 'focus-visible']) },
};

export const SkipLink: Story = {
  name: 'Skip link · 본문 바로가기',
  args: {
    component: 'SkipLink',
    componentProps: { id: 'svelte-skip-link', href: '#main-content', label: '본문 바로가기' },
    snippetText: '본문 바로가기',
    eventLabel: '건너뛰기 링크',
  },
  parameters: { ...fixtureParameters('skip-link.default', ['default', 'focus-visible']) },
};

export const Tag: Story = {
  name: 'Tag · removable',
  args: {
    component: 'Tag',
    componentProps: { id: 'svelte-tag', label: '태그', removable: true, actionLabel: '삭제' },
    eventLabel: '태그',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '삭제' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('click');
  },
  parameters: { ...fixtureParameters('tag.default', ['default', 'focus-visible']) },
};

export const TagLink: Story = {
  name: 'Tag · link',
  args: {
    component: 'TagLink',
    componentProps: { id: 'svelte-tag-link', href: '#tag', label: '태그' },
    eventLabel: '태그 링크',
  },
  parameters: { ...fixtureParameters('tag-link.default', ['default', 'focus-visible']) },
};

export const Spinner: Story = {
  name: 'Spinner · loading status',
  args: {
    component: 'Spinner',
    componentProps: { id: 'svelte-spinner', label: '로딩 중' },
    eventLabel: '로딩 상태',
  },
  parameters: { ...fixtureParameters('spinner.default', ['default']) },
};

export const Favicon: Story = {
  name: 'Favicon · 32px',
  args: {
    component: 'Favicon',
    componentProps: {
      id: 'svelte-favicon',
      href: '/favicon-32x32.png',
      type: 'image/png',
      size: '32x32',
      sizes: '32x32',
    },
    eventLabel: '파비콘',
  },
  parameters: { ...fixtureParameters('favicon.default', ['default']) },
};

export const Identifier: Story = {
  name: 'Identifier · organization',
  args: {
    component: 'Identifier',
    componentProps: {
      id: 'svelte-identifier',
      organization: 'KRDS - Korea Design System',
      description: '이 누리집은 보건복지부 누리집입니다.',
    },
    eventLabel: '기관 식별자',
  },
  parameters: { ...fixtureParameters('identifier.default', ['default']) },
};

export const Masthead: Story = {
  name: 'Masthead · government notice',
  args: {
    component: 'Masthead',
    componentProps: {
      id: 'svelte-masthead',
      message: '이 누리집은 대한민국 공식 전자정부 누리집입니다.',
    },
    eventLabel: '마스트헤드',
  },
  parameters: { ...fixtureParameters('masthead.default', ['default']) },
};
