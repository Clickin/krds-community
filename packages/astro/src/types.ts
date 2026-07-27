import type { HTMLAttributes } from 'astro/types';
import type {
  AccordionContractProps,
  AccordionItemContract,
  ButtonContractProps,
  ChoiceContractProps,
  KrdsAdditionalProps,
  RadioContractProps,
  TextInputContractProps,
} from '@krds-community/recipes';

export type NativeButtonAttributes = HTMLAttributes<'button'>;
export type NativeInputAttributes = HTMLAttributes<'input'>;
export type NativeElementAttributes = HTMLAttributes<'div'>;

export interface ButtonProps
  extends ButtonContractProps,
    Omit<NativeButtonAttributes, keyof ButtonContractProps | 'class' | 'class:list' | 'type'> {
  class?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface AccordionProps extends AccordionContractProps, NativeElementAttributes {
  items: AccordionItemContract[];
  class?: string;
}

export interface ChoiceProps
  extends ChoiceContractProps,
    Omit<NativeInputAttributes, keyof ChoiceContractProps | 'checked' | 'class' | 'class:list' | 'type'> {
  class?: string;
}

export interface RadioProps
  extends RadioContractProps,
    Omit<NativeInputAttributes, keyof RadioContractProps | 'checked' | 'class' | 'class:list' | 'type'> {
  class?: string;
}

export interface TextInputProps
  extends TextInputContractProps,
    Omit<NativeInputAttributes, keyof TextInputContractProps | 'class' | 'class:list' | 'type'> {
  class?: string;
  type?: NativeInputAttributes['type'];
}

export interface AdditionalProps
  extends KrdsAdditionalProps,
    Omit<NativeElementAttributes, keyof KrdsAdditionalProps | 'class' | 'class:list'> {
  class?: string;
  kind?: string;
  [key: string]: unknown;
}
