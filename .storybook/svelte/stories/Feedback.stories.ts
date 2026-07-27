import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import AdditionalShowcase from './AdditionalShowcase.svelte';

const meta = {
  title: 'Svelte/피드백·도움말',
  component: AdditionalShowcase,
  parameters: { layout: 'padded', a11y: { test: 'error' } },
  argTypes: {
    component: {
      control: 'select',
      options: [
        'CoachMark',
        'ContextualHelp',
        'CriticalAlerts',
        'Disclosure',
        'FileUpload',
        'HelpPanel',
        'ModalSample',
        'Tooltip',
        'TooltipBox',
        'TooltipVertical',
        'Tts',
        'TtsIcon',
        'TtsSize',
        'TutorialPanel',
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

export const CoachMark: Story = {
  name: 'Coach mark · step 1 of 4',
  args: {
    component: 'CoachMark',
    componentProps: {
      id: 'svelte-coach-mark',
      title: '따라하기 가이드',
      stepTitle: '1단계 : 코치 마크',
      description: '1단계 코치 마크 내용입니다.',
      contentTitle: '코치 마크 내용',
      step: '1/4',
      currentStep: '1',
      totalSteps: '4',
      stopLabel: '그만보기',
      nextLabel: '다음으로',
      label: '코치 마크 내용',
    },
    snippetText: '코치 마크 내용',
    eventLabel: '코치 마크',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '그만보기' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('click');
  },
  parameters: { ...fixtureParameters('coach-mark.default', ['default', 'focus-visible']) },
};

export const ContextualHelp: Story = {
  name: 'Contextual help · top left',
  args: {
    component: 'ContextualHelp',
    componentProps: {
      id: 'svelte-contextual-help',
      position: 'top-left',
      label: '도움말',
      caption: '예시이미지(상단 왼쪽)',
      message: '도움말',
      title: '도움말 제목',
      description: '컴포넌트 주변에서 상세 정보를 제공하는 도움말입니다.',
      linkLabel: '바로가기',
      href: '#help',
      closeLabel: '닫기',
    },
    eventLabel: '맥락적 도움말',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '도움말' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('tooltip')).toBeVisible();
  },
  parameters: { ...fixtureParameters('contextual-help.default', ['default', 'focus-visible']) },
};

export const CriticalAlerts: Story = {
  name: 'Critical alerts · danger / safe / info',
  args: {
    component: 'CriticalAlerts',
    componentProps: {
      id: 'svelte-critical-alerts',
      items: [
        {
          id: 'danger',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'danger',
          tone: 'danger',
          badgeLabel: '긴급',
          linkLabel: '자세히 보기',
        },
        {
          id: 'ok',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'ok',
          tone: 'ok',
          badgeLabel: '안전',
          linkLabel: '자세히 보기',
        },
        {
          id: 'info',
          title: '긴급 공지 내용 표시',
          text: '긴급 공지 내용 표시',
          href: '#',
          badge: 'info',
          tone: 'info',
          badgeLabel: '안내',
          linkLabel: '자세히 보기',
        },
      ],
    },
    eventLabel: '긴급 알림',
  },
  parameters: { ...fixtureParameters('critical-alerts.default', ['default', 'focus-visible']) },
};

export const Disclosure: Story = {
  name: 'Disclosure · collapsed to expanded',
  args: {
    component: 'Disclosure',
    componentProps: {
      id: 'svelte-disclosure',
      title: '신청 서비스안내',
      items: [
        '하나의 아이디로 안전하고 편리하게 여러 전자정부 서비스를 이용할 수 있는 서비스입니다.',
        '디지털원패스 이용문의 : 1533-3713 (평일9~18시, 공휴일제외)',
      ],
      open: false,
    },
    eventLabel: '디스클로저',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '신청 서비스안내' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
  parameters: { ...fixtureParameters('disclosure.default', ['default', 'focus-visible']) },
};

export const FileUpload: Story = {
  name: 'File upload · multiple PDF',
  args: {
    component: 'FileUpload',
    componentProps: {
      id: 'svelte-file-upload',
      label: '파일 첨부',
      title: '첨부파일',
      hint: 'PDF 파일을 선택해 주세요.',
      accept: '.pdf',
      multiple: true,
      items: [{ label: '신청서.pdf', status: '업로드 완료' }],
    },
    eventLabel: '파일 업로드',
  },
  parameters: { ...fixtureParameters('file-upload.default', ['default', 'focus-visible']) },
};

const helpTabs = [
  { id: 'helperTab01', label: '도움', panelId: 'helperTabpanel01', value: 'help' },
  { id: 'helperTab02', label: '따라하기', panelId: 'helperTabpanel02', value: 'tutorial' },
];

const helpDescription =
  '전자문서지갑에서는 전자증명서 출력기능을 제공하지 않으며, 스마트폰 화면을 캡쳐하여 사용할 수 없습니다. 다만, 발급받은 전자증명서를 열람용으로 다운로드할 수는 있습니다.';

const helpPanelProps = {
  id: 'svelte-help-panel',
  open: true,
  activeTab: 'help',
  tabs: helpTabs,
  helpTitle: '전자문서지갑',
  helpDescription,
  downloadLinks: [
    { label: '안드로이드 애플리케이션 다운로드', href: '#', target: '_blank', title: '새 창 열림' },
    { label: 'iOS애플리케이션 다운로드', href: '#', target: '_blank', title: '새 창 열림' },
  ],
  relatedGroups: [
    {
      title: '관련서비스/민원',
      links: [
        { label: '영문 주민등록표등본', href: '#' },
        { label: '영문 주민등록표초본', href: '#' },
        { label: '주민등록표등본', href: '#' },
      ],
    },
    {
      title: '기타 문의/도움말',
      links: [
        { label: '민원신청 관련 문의 전화 번호 찾기', href: '#' },
        { label: '자주 묻는 질문 확인하기', href: '#' },
      ],
    },
  ],
  collapseLabel: '접어두기',
  label: '도움말',
  title: '도움말',
};

export const HelpPanel: Story = {
  name: 'Help panel · help tab',
  args: { component: 'HelpPanel', componentProps: helpPanelProps, eventLabel: '도움말 패널' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '접어두기' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('click');
  },
  parameters: { ...fixtureParameters('help-panel.default', ['default', 'focus-visible']) },
};

export const TutorialPanel: Story = {
  name: 'Tutorial panel · guided steps',
  args: {
    component: 'TutorialPanel',
    componentProps: {
      ...helpPanelProps,
      id: 'svelte-tutorial-panel',
      activeTab: 'tutorial',
      tutorialTitle: '이사 전 살던 곳 정보 입력하기',
      tasks: [
        {
          title: 'Task 1: 이사 전에 살던 곳 주소 확인',
          label: '단계 안내',
          steps: ['단계1 : 주소조회', '단계2 : 조회 결과 확인'],
        },
        {
          title: 'Task 2: 이사 갈 가족 구성원 선택하기',
          label: '단계 안내',
          steps: ['단계1 : 주소조회'],
        },
      ],
      stopLabel: '그만 따라하기',
    },
    eventLabel: '튜토리얼 패널',
  },
  parameters: { ...fixtureParameters('tutorial-panel.default', ['default', 'focus-visible']) },
};

export const ModalSample: Story = {
  name: 'Modal sample · dialog close',
  args: {
    component: 'ModalSample',
    componentProps: {
      id: 'svelte-modal-sample',
      open: true,
      title: '모달 제목',
      description: '대화 상자는 사용자에게 작업을 알리고 결정을 요청합니다.',
      previousLabel: '아니요',
      nextLabel: '예',
      label: '닫기',
    },
    snippetText: '대화 상자는 사용자에게 작업을 알리고 결정을 요청합니다.',
    eventLabel: '모달 샘플',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog', { name: '모달 제목' });
    await expect(dialog).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: '아니요' }));
    await expect(dialog).not.toBeVisible();
  },
  parameters: { ...fixtureParameters('modal-sample.default', ['default', 'focus-visible']) },
};

const tooltipProps = {
  id: 'svelte-tooltip',
  label: 'tooltip-horizontal',
  message: '툴팁의 기본 설정입니다',
};

export const Tooltip: Story = {
  name: 'Tooltip · horizontal',
  args: { component: 'Tooltip', componentProps: tooltipProps, eventLabel: '툴팁' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'tooltip-horizontal' }));
    await expect(canvas.getByRole('tooltip')).toBeVisible();
  },
  parameters: { ...fixtureParameters('tooltip.default', ['default', 'focus-visible']) },
};

export const TooltipBox: Story = {
  name: 'Tooltip · box',
  args: {
    component: 'TooltipBox',
    componentProps: {
      ...tooltipProps,
      id: 'svelte-tooltip-box',
      label: 'tooltip-box',
      message: 'tooltip-box 툴팁은 150자 내외의 텍스트만 제공되어야 합니다.',
    },
    eventLabel: '박스 툴팁',
  },
  parameters: { ...fixtureParameters('tooltip-box.default', ['default', 'focus-visible']) },
};

export const TooltipVertical: Story = {
  name: 'Tooltip · vertical',
  args: {
    component: 'TooltipVertical',
    componentProps: {
      ...tooltipProps,
      id: 'svelte-tooltip-vertical',
      label: 'tooltip-vertical',
      message: 'tooltip-vertical 옵션입니다',
    },
    eventLabel: '세로 툴팁',
  },
  parameters: { ...fixtureParameters('tooltip-vertical.default', ['default', 'focus-visible']) },
};

export const Tts: Story = {
  name: 'TTS · text and pressed state',
  args: {
    component: 'Tts',
    componentProps: {
      id: 'svelte-tts',
      label: '레이블',
      text: '화면에 표시된 주요 안내를 음성으로 읽어주는 보조 기능입니다.',
    },
    snippetText: '레이블',
    eventLabel: '음성 읽기',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '레이블' });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
  parameters: { ...fixtureParameters('tts.default', ['default', 'focus-visible']) },
};

export const TtsIcon: Story = {
  name: 'TTS · icon only',
  args: {
    component: 'TtsIcon',
    componentProps: { id: 'svelte-tts-icon', label: '음성 듣기', text: '읽을 내용입니다.' },
    eventLabel: '아이콘 음성 읽기',
  },
  parameters: { ...fixtureParameters('tts-icon.default', ['default', 'focus-visible']) },
};

export const TtsSize: Story = {
  name: 'TTS · xsmall',
  args: {
    component: 'TtsSize',
    componentProps: { id: 'svelte-tts-size', size: 'xsmall', label: 'Xsmall TTS', text: '읽을 내용입니다.' },
    snippetText: 'Xsmall TTS',
    eventLabel: '작은 음성 읽기',
  },
  parameters: { ...fixtureParameters('tts-size.default', ['default', 'focus-visible']) },
};
