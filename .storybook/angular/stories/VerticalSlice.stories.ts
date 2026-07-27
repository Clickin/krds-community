import type { Meta, StoryObj } from '@storybook/angular';
import {
  KrdsAccordionComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
} from '@krds-community/angular';

const meta = {
  title: 'Angular/기본 구성',
  component: KrdsButtonComponent,
  render: () => ({
    template: `<div style="display:grid;gap:1rem;max-width:30rem">
      <krds-button>버튼</krds-button>
      <krds-text-input label="이름" hint="실명을 입력하세요."></krds-text-input>
      <krds-checkbox label="약관에 동의합니다." name="terms"></krds-checkbox>
      <krds-radio label="첫 번째 선택지" name="choice" value="one"></krds-radio>
      <krds-switch label="알림 받기" name="notifications"></krds-switch>
      <krds-accordion [items]="[{ id: 'one', title: '방문 안내', content: '서비스 이용 안내입니다.' }]"></krds-accordion>
    </div>`,
  }),
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: {
        imports: [
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
} satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = { name: '기본 예시' };
