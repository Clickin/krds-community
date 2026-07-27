import type { Framework } from '@krds-community/conformance';

export interface ConformanceAdapter {
  framework: Framework;
  renderScenario(id: string, props?: unknown): Promise<void>;
  setProps(props: unknown): Promise<void>;
  reset(): Promise<void>;
  getRoot(): HTMLElement;
}

export const verticalSliceScenarios = [
  'button.primary.medium.default',
  'text-input.default.medium',
  'checkbox.default.medium',
  'radio.default.medium',
  'switch.default.medium',
  'accordion.default.single',
] as const;

export type VerticalSliceScenario = (typeof verticalSliceScenarios)[number];

export const keyboardContracts = {
  button: ['Tab', 'Enter', 'Space'],
  textInput: ['Tab', 'character-entry'],
  checkbox: ['Tab', 'Space'],
  radio: ['Tab', 'ArrowUp', 'ArrowDown', 'Space'],
  switch: ['Tab', 'Space'],
  accordion: ['Tab', 'Enter', 'Space'],
} as const;

export const accessibilityContracts = {
  accordion: ['aria-expanded', 'aria-controls', 'aria-labelledby', 'role=region'],
  textInput: ['label-for-id', 'aria-invalid-for-error', 'aria-describedby-for-message'],
  choices: ['label-for-id', 'native-checked-state', 'native-disabled-state'],
} as const;
