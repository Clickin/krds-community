import { clsx } from 'clsx';
export const buttonVariants = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariant = (typeof buttonVariants)[number];
export const buttonSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
export type ButtonSize = (typeof buttonSizes)[number];
export const inputStates = ['default', 'error', 'success', 'information'] as const;
export type InputState = (typeof inputStates)[number];
export const choiceSizes = ['medium', 'large'] as const;
export type ChoiceSize = (typeof choiceSizes)[number];

export const selectRecipeVariants = ['default', 'size', 'state', 'sorting'] as const;
export type SelectRecipeVariant = (typeof selectRecipeVariants)[number];
export const selectRecipeSizes = ['small', 'medium', 'large'] as const;
export type SelectRecipeSize = (typeof selectRecipeSizes)[number];

export type SelectRecipeOptions =
  | {
      variant?: Exclude<SelectRecipeVariant, 'sorting'> | undefined;
      size?: SelectRecipeSize | undefined;
      state?: InputState | undefined;
    }
  | {
      variant: 'sorting';
      size?: never;
      state?: Extract<InputState, 'default' | 'error'> | undefined;
    };

export type SelectRecipeResult = {
  control: string;
};

export type TabRecipeOptions = {
  full?: boolean | undefined;
  active?: boolean | undefined;
};

export type TabRecipeResult = {
  root: string;
  listContainer: string;
  item: string | undefined;
  trigger: string;
};

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

const selectStateModifiers = {
  default: undefined,
  error: 'is-error',
  success: 'is-success',
  information: 'is-information',
} satisfies Record<InputState, string | undefined>;

export const selectRecipe = (options: SelectRecipeOptions = {}): SelectRecipeResult => {
  if (options.variant === 'sorting') {
    return {
      control: cx('krds-form-select-sort', selectStateModifiers[options.state ?? 'default']),
    };
  }

  return {
    control: cx(
      'krds-form-select',
      options.size,
      selectStateModifiers[options.state ?? 'default'],
    ),
  };
};

export const tabRecipe = (options: TabRecipeOptions = {}): TabRecipeResult => ({
  root: 'krds-tab-area layer',
  listContainer: cx('tab', 'line', options.full !== false && 'full'),
  item: options.active ? 'active' : undefined,
  trigger: 'btn-tab',
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
