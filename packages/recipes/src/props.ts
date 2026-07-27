import type { ButtonSize, ButtonVariant, ChoiceSize, InputState } from './index.js';

/** Pure TypeScript contracts shared by adapters; framework event and ref types stay local. */
export interface ButtonContractProps {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  disabled?: boolean | undefined;
}

export interface TextInputContractProps {
  value?: string | number | undefined;
  state?: InputState | undefined;
  size?: 'small' | 'medium' | 'large' | undefined;
  label?: string | undefined;
  hint?: string | undefined;
  disabled?: boolean | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
}

export interface ChoiceContractProps {
  size?: ChoiceSize | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
  label?: string | undefined;
  description?: string | undefined;
}

export interface RadioContractProps extends ChoiceContractProps {
  value?: string | number | boolean;
}

export interface AccordionItemContract {
  id: string;
  title: string;
  content: string;
  disabled?: boolean | undefined;
}

export interface AccordionContractProps {
  items: AccordionItemContract[];
  type?: 'default' | 'line';
  multiple?: boolean;
}
