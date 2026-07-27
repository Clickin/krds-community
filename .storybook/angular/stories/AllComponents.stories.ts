import type { Meta, StoryObj } from '@storybook/angular';
import {
  KrdsAccordionComponent,
  KrdsAdditionalComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
} from '@krds-community/angular';

const kinds = [
  'badge',
  'badge-number',
  'badge-size',
  'breadcrumb',
  'button-hierarchy',
  'button-icon',
  'button-size',
  'button-text',
  'button-with-icon',
  'calendar',
  'calendar-range',
  'carousel',
  'carousel-banner',
  'checkbox-chip',
  'checkbox-size',
  'coach-mark',
  'contextual-help',
  'critical-alerts',
  'date-input',
  'disclosure',
  'favicon',
  'file-upload',
  'footer',
  'header',
  'help-panel',
  'identifier',
  'in-page-navigation',
  'language-switcher',
  'language-switcher-page',
  'link',
  'main-menu-mobile',
  'main-menu-pc',
  'masthead',
  'modal',
  'modal-sample',
  'pagination',
  'radio-button',
  'radio-chip',
  'radio-size',
  'resize',
  'select',
  'select-size',
  'select-sorting',
  'select-state',
  'side-navigation',
  'skip-link',
  'spinner',
  'step-indicator',
  'structured-list',
  'structured-list-table',
  'tab',
  'table',
  'tag',
  'tag-link',
  'text-input-icon',
  'text-input-size',
  'text-input-state',
  'text-list',
  'text-list-ordered',
  'textarea',
  'toggle-switch',
  'toggle-switch-size',
  'tooltip',
  'tooltip-box',
  'tooltip-vertical',
  'tts',
  'tts-icon',
  'tts-size',
  'tutorial-panel',
];

const meta = {
  title: 'Angular/전체 컴포넌트',
  component: KrdsAdditionalComponent,
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
export const Inventory: StoryObj<typeof meta> = {
  name: '전체 인벤토리',
  render: () => ({
    template: `<main aria-label="컴포넌트 인벤토리" style="display:grid;gap:1rem;max-width:45rem">
      <krds-button>기본 버튼</krds-button>
      <krds-text-input label="기본 텍스트" hint="도움말"></krds-text-input>
      <krds-checkbox label="체크박스" name="check"></krds-checkbox>
      <krds-radio label="라디오" name="radio" value="one"></krds-radio>
      <krds-switch label="스위치" name="switch"></krds-switch>
      <krds-accordion [items]="items"></krds-accordion>
      ${kinds.map((kind) => `<krds-additional kind="${kind}" [items]="items" [links]="links" [options]="options" [slides]="slides" [steps]="steps" [tabs]="tabs" [panels]="panels" [columns]="columns" [rows]="rows" [open]="true" label="${kind}" title="${kind}" description="설명입니다." message="도움말입니다." href="#example"></krds-additional>`).join('')}
    </main>`,
    props: {
      items: [
        { id: 'one', label: '첫 항목', title: '첫 항목', content: '내용' },
        { id: 'two', label: '두 번째', title: '두 번째', content: '내용' },
      ],
      links: [
        { id: 'one', label: '첫 항목', href: '#one' },
        { id: 'two', label: '두 번째', href: '#two' },
      ],
      options: [
        { value: 'one', label: '첫 번째' },
        { value: 'two', label: '두 번째' },
      ],
      slides: [
        { id: 'one', title: '첫 슬라이드', description: '캐러셀 내용' },
        { id: 'two', title: '두 번째 슬라이드' },
      ],
      steps: [
        { id: 'one', label: '첫 단계' },
        { id: 'two', label: '두 번째 단계' },
      ],
      tabs: [
        { id: 'one', label: '첫 탭' },
        { id: 'two', label: '두 번째 탭' },
      ],
      panels: { one: '첫 패널', two: '두 번째 패널' },
      columns: [
        { key: 'name', label: '이름' },
        { key: 'status', label: '상태' },
      ],
      rows: [{ name: '서비스', status: '운영 중' }],
    },
  }),
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: {
        imports: [
          KrdsAdditionalComponent,
          KrdsAccordionComponent,
          KrdsButtonComponent,
          KrdsCheckboxComponent,
          KrdsRadioComponent,
          KrdsSwitchComponent,
          KrdsTextInputComponent,
        ],
      },
    }),
  ],
};
