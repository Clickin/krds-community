import { clsx } from 'clsx';
export const buttonVariants = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariant = (typeof buttonVariants)[number];
export const buttonSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
export type ButtonSize = (typeof buttonSizes)[number];
export const inputStates = ['default', 'error', 'success', 'information'] as const;
export type InputState = (typeof inputStates)[number];
export const choiceSizes = ['medium', 'large'] as const;
export type ChoiceSize = (typeof choiceSizes)[number];

export type RecipeResult = {
  className: string;
  data: Record<string, string | undefined>;
};

export const cx = (...parts: Parameters<typeof clsx>): string => clsx(...parts);

export const buttonRecipe = (
  options: {
    variant?: ButtonVariant | undefined;
    size?: ButtonSize | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
  } = {},
): RecipeResult => ({
  className: cx(
    'krds-btn',
    options.variant,
    options.size === 'medium' ? undefined : options.size,
    options.className,
  ),
  data: {
    variant: options.variant ?? 'primary',
    size: options.size ?? 'medium',
    disabled: options.disabled ? '' : undefined,
  },
});

export const inputRecipe = (
  options: {
    state?: InputState | undefined;
    size?: Exclude<ButtonSize, 'xsmall' | 'xlarge'> | undefined;
    className?: string | undefined;
  } = {},
): RecipeResult => ({
  className: cx('krds-input', options.size, options.className),
  data: { state: options.state ?? 'default', size: options.size ?? 'medium' },
});
export const fieldRecipe = (className?: string): RecipeResult => ({
  className: cx('krds-field', className),
  data: {},
});

export const choiceRecipe = (
  options: {
    size?: ChoiceSize | undefined;
    className?: string | undefined;
  } = {},
): RecipeResult => ({
  className: cx('krds-form-check', options.size, options.className),
  data: { size: options.size ?? 'medium' },
});

export const switchRecipe = (
  options: { size?: ChoiceSize | undefined; className?: string | undefined } = {},
): RecipeResult => ({
  className: cx('krds-form-toggle-switch', options.size, options.className),
  data: { size: options.size ?? 'medium' },
});

export const accordionRecipe = (
  options: { type?: 'default' | 'line' | undefined; className?: string | undefined } = {},
): RecipeResult => ({
  className: cx(
    'krds-accordion',
    options.type === 'line' ? 'type-line' : undefined,
    options.className,
  ),
  data: { type: options.type ?? 'default' },
});

export const accordionState = (open: boolean): { expanded: 'true' | 'false'; hidden: boolean } => ({
  expanded: open ? 'true' : 'false',
  hidden: !open,
});

export { clsx };
export type {
  AccordionContractProps,
  AccordionItemContract,
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from './props.js';
export type {
  KrdsAdditionalProps,
  KrdsCarouselSlide,
  KrdsListItem,
  KrdsNavItem,
  KrdsOption,
  KrdsPaginationItem,
  KrdsStep,
  KrdsTableColumn,
  KrdsTableRow,
  KrdsTabItem,
  KrdsTone,
} from './components.js';
