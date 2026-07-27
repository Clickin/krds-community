import { computed, defineComponent, h, useId, ref, type PropType } from 'vue';
import {
  accordionRecipe,
  buttonRecipe,
  choiceRecipe,
  fieldRecipe,
  inputRecipe,
  switchRecipe,
} from '@krds-community/recipes';
import type {
  AccordionContractProps,
  AccordionItemContract,
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from '@krds-community/recipes';

export interface ButtonProps extends ButtonContractProps {
  type?: 'button' | 'submit' | 'reset';
}
export interface TextInputProps extends Omit<TextInputContractProps, 'label' | 'hint'> {
  modelValue?: string | number;
  label?: string;
  hint?: string;
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
}
export interface CheckboxProps extends Omit<ChoiceContractProps, 'label' | 'description'> {
  modelValue?: boolean;
  label: string;
  description?: string;
}
export interface RadioProps extends Omit<RadioContractProps, 'label' | 'description' | 'value'> {
  modelValue?: string | number | boolean;
  value: string | number | boolean;
  label: string;
  description?: string;
  name: string;
}
export interface SwitchProps extends Omit<ChoiceContractProps, 'label' | 'description'> {
  modelValue?: boolean;
  label: string;
}
export const Button = defineComponent<ButtonProps>({
  name: 'KrdsButton',
  props: {
    variant: { type: String as PropType<'primary' | 'secondary' | 'tertiary'>, default: 'primary' },
    size: {
      type: String as PropType<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'>,
      default: 'medium',
    },
    type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
    disabled: Boolean,
  },
  emits: ['click'],
  setup(props, { emit, slots, attrs }) {
    return () => {
      const recipe = buttonRecipe({
        variant: props.variant,
        size: props.size,
        disabled: props.disabled,
        className: attrs.class as string | undefined,
      });
      return h(
        'button',
        {
          ...attrs,
          type: props.type,
          disabled: props.disabled,
          class: recipe.className,
          'data-variant': recipe.data.variant,
          'data-size': recipe.data.size,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      );
    };
  },
});

export const TextInput = defineComponent<TextInputProps>({
  name: 'KrdsTextInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
    state: {
      type: String as PropType<'default' | 'error' | 'success' | 'information'>,
      default: 'default',
    },
    size: { type: String as PropType<'small' | 'medium' | 'large'>, default: 'medium' },
    id: { type: String, default: undefined },
    type: { type: String, default: 'text' },
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur'],
  setup(props, { emit, attrs }) {
    const generatedId = `krds-input-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const hintId = computed(() => (props.hint ? `${id.value}-hint` : undefined));
    return () => {
      const recipe = inputRecipe({
        state: props.state,
        size: props.size,
        className: attrs.class as string | undefined,
      });
      return h('label', { class: fieldRecipe().className }, [
        props.label ? h('span', { class: 'krds-field-label' }, props.label) : null,
        h('input', {
          ...attrs,
          id: id.value,
          type: props.type,
          name: props.name,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          readonly: props.readonly,
          required: props.required,
          class: recipe.className,
          'data-state': recipe.data.state,
          'data-size': recipe.data.size,
          'aria-invalid': props.state === 'error' ? 'true' : undefined,
          'aria-describedby': hintId.value,
          onInput: (event: Event) => {
            emit('update:modelValue', (event.target as HTMLInputElement).value);
            emit('input', event);
          },
          onChange: (event: Event) => emit('change', event),
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event),
        }),
        props.hint
          ? h(
              'span',
              { id: hintId.value, class: 'krds-field-message', 'data-state': props.state },
              props.hint,
            )
          : null,
      ]);
    };
  },
});

const choiceId = (prefix: string, id?: string) => id ?? `krds-${prefix}-${useId()}`;

export const Checkbox = defineComponent<CheckboxProps>({
  name: 'KrdsCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    label: { type: String, required: true },
    description: { type: String, default: undefined },
    size: { type: String as PropType<'medium' | 'large'>, default: 'medium' },
    id: { type: String, default: undefined },
    disabled: Boolean,
    name: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const id = choiceId('checkbox', props.id);
    return () =>
      h(
        'div',
        {
          class: choiceRecipe({ size: props.size, className: attrs.class as string | undefined })
            .className,
          'data-size': props.size,
        },
        [
          h('input', {
            ...attrs,
            id,
            name: props.name,
            type: 'checkbox',
            checked: props.modelValue,
            disabled: props.disabled,
            onChange: (event: Event) =>
              emit('update:modelValue', (event.target as HTMLInputElement).checked),
          }),
          h('label', { for: id }, props.label),
          props.description ? h('span', { class: 'krds-field-message' }, props.description) : null,
        ],
      );
  },
});

export const Radio = defineComponent<RadioProps>({
  name: 'KrdsRadio',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
      default: '',
    },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
      required: true,
    },
    label: { type: String, required: true },
    description: { type: String, default: undefined },
    size: { type: String as PropType<'medium' | 'large'>, default: 'medium' },
    id: { type: String, default: undefined },
    name: { type: String, required: true },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const id = choiceId('radio', props.id);
    return () =>
      h(
        'div',
        {
          class: choiceRecipe({ size: props.size, className: attrs.class as string | undefined })
            .className,
          'data-size': props.size,
        },
        [
          h('input', {
            ...attrs,
            id,
            name: props.name,
            type: 'radio',
            value: String(props.value),
            checked: props.modelValue === props.value,
            disabled: props.disabled,
            onChange: () => emit('update:modelValue', props.value),
          }),
          h('label', { for: id }, props.label),
          props.description ? h('span', { class: 'krds-field-message' }, props.description) : null,
        ],
      );
  },
});

export const Switch = defineComponent<SwitchProps>({
  name: 'KrdsSwitch',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    label: { type: String, required: true },
    size: { type: String as PropType<'medium' | 'large'>, default: 'medium' },
    id: { type: String, default: undefined },
    disabled: Boolean,
    name: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const id = choiceId('switch', props.id);
    return () =>
      h(
        'div',
        {
          class: switchRecipe({ size: props.size, className: attrs.class as string | undefined })
            .className,
          'data-size': props.size,
        },
        [
          h('input', {
            ...attrs,
            id,
            name: props.name,
            type: 'checkbox',
            checked: props.modelValue,
            disabled: props.disabled,
            onChange: (event: Event) =>
              emit('update:modelValue', (event.target as HTMLInputElement).checked),
          }),
          h('label', { for: id }, [
            h('span', { class: 'switch-toggle', 'aria-hidden': 'true' }, [h('i')]),
            props.label,
          ]),
        ],
      );
  },
});

export interface AccordionItem extends AccordionItemContract {}
export interface AccordionProps extends Omit<AccordionContractProps, 'items'> {
  items: AccordionItem[];
  modelValue?: string[];
}
export const Accordion = defineComponent<AccordionProps>({
  name: 'KrdsAccordion',
  props: {
    items: { type: Array as PropType<AccordionItem[]>, required: true },
    type: { type: String as PropType<'default' | 'line'>, default: 'default' },
    multiple: Boolean,
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const localOpen = ref<string[]>([...(props.modelValue ?? [])]);
    const openItems = computed(() =>
      props.modelValue?.length ? props.modelValue : localOpen.value,
    );
    const toggle = (id: string) => {
      const current = openItems.value;
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : props.multiple
          ? [...current, id]
          : [id];
      localOpen.value = next;
      emit('update:modelValue', next);
    };
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: accordionRecipe({ type: props.type, className: attrs.class as string | undefined })
            .className,
          'data-type': props.type,
        },
        props.items.map((item) => {
          const open = openItems.value.includes(item.id);
          const headerId = `krds-accordion-header-${item.id}`;
          const panelId = `krds-accordion-panel-${item.id}`;
          return h('div', { class: `krds-accordion-item${open ? ' is-open' : ''}`, key: item.id }, [
            h(
              'h5',
              { class: 'krds-accordion-heading' },
              h(
                'button',
                {
                  type: 'button',
                  class: 'krds-accordion-trigger',
                  id: headerId,
                  'aria-expanded': open,
                  'aria-controls': panelId,
                  disabled: item.disabled,
                  onClick: () => toggle(item.id),
                },
                item.title,
              ),
            ),
            h(
              'div',
              {
                id: panelId,
                class: 'krds-accordion-panel',
                role: 'region',
                'aria-labelledby': headerId,
                hidden: !open,
              },
              item.content,
            ),
          ]);
        }),
      );
  },
});

export const AccordionLine = Accordion;
export const TextInputSize = TextInput;
export const TextInputState = TextInput;

export {
  Badge,
  BadgeNumber,
  BadgeSize,
  Breadcrumb,
  ButtonHierarchy,
  ButtonIcon,
  ButtonSize,
  ButtonText,
  ButtonWithIcon,
  Calendar,
  CalendarRange,
  Carousel,
  CarouselBanner,
  CheckboxChip,
  CheckboxSize,
  CoachMark,
  ContextualHelp,
  CriticalAlerts,
  DateInput,
  Disclosure,
  Favicon,
  FileUpload,
  Footer,
  Header,
  HelpPanel,
  Identifier,
  InPageNavigation,
  LanguageSwitcher,
  LanguageSwitcherPage,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Masthead,
  Modal,
  ModalSample,
  Pagination,
  RadioButton,
  RadioChip,
  RadioSize,
  Resize,
  Select,
  SelectSize,
  SelectSorting,
  SelectState,
  SideNavigation,
  SkipLink,
  Spinner,
  StepIndicator,
  StructuredList,
  StructuredListTable,
  Tab,
  Table,
  Tag,
  TagLink,
  Textarea,
  TextInputIcon,
  TextList,
  TextListOrdered,
  ToggleSwitch,
  ToggleSwitchSize,
  Tooltip,
  TooltipBox,
  TooltipVertical,
  Tts,
  TtsIcon,
  TtsSize,
  TutorialPanel,
} from './additional.js';

export type { ButtonVariant, InputState } from '@krds-community/recipes';
