import { computed, defineComponent, h, ref, useId, type Component, type PropType } from 'vue';
import { accordionRecipe, buttonRecipe } from '@krds-community/recipes';
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
  defaultValue?: string | number;
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
}
export interface CheckboxProps extends Omit<ChoiceContractProps, 'label' | 'description'> {
  modelValue?: boolean;
  defaultChecked?: boolean;
  label: string;
  description?: string;
  required?: boolean;
  readonly?: boolean;
}
export interface RadioProps extends Omit<RadioContractProps, 'label' | 'description' | 'value'> {
  modelValue?: string | number | boolean;
  defaultValue?: string | number | boolean;
  value: string | number | boolean;
  label: string;
  description?: string;
  name: string;
  required?: boolean;
  readonly?: boolean;
}
export interface SwitchProps extends Omit<ChoiceContractProps, 'label' | 'description'> {
  modelValue?: boolean;
  defaultChecked?: boolean;
  label: string;
  required?: boolean;
  readonly?: boolean;
}
export const Button = defineComponent<ButtonProps>({
  name: 'KrdsButton',
  props: {
    variant: String as PropType<'primary' | 'secondary' | 'tertiary'>,
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
    modelValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    value: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
    error: { type: String, default: undefined },
    state: {
      type: String as PropType<'default' | 'error' | 'success' | 'information'>,
      default: 'default',
    },
    size: { type: String as PropType<'small' | 'medium' | 'large'>, default: undefined },
    id: { type: String, default: undefined },
    type: { type: String, default: 'text' },
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_value: string | number) => true,
    input: (_event: Event) => true,
    change: (_event: Event) => true,
    focus: (_event: FocusEvent) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { emit, attrs }) {
    const generatedId = `krds-input-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const message = computed(() =>
      props.state === 'error' ? (props.error ?? props.hint) : props.hint,
    );
    const hintId = computed(() => (message.value ? `${id.value}-hint` : undefined));
    const localValue = ref<string | number>(props.defaultValue ?? props.value ?? '');
    const value = computed<string | number>({
      get: () => props.modelValue ?? props.value ?? localValue.value,
      set: (next) => {
        if (props.modelValue === undefined && props.value === undefined) {
          localValue.value = next;
        }
        emit('update:modelValue', next);
      },
    });
    return () => {
      const formContsClass =
        props.state === 'default' ? 'form-conts' : `form-conts is-${props.state}`;
      const hintClass =
        props.state === 'error'
          ? 'form-hint-invalid'
          : props.state === 'success'
            ? 'form-hint-success'
            : props.state === 'information'
              ? 'form-hint-information'
              : 'form-hint';
      const describedBy =
        [
          typeof attrs['aria-describedby'] === 'string'
            ? attrs['aria-describedby']
            : undefined,
          hintId.value,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

      return h('div', { class: 'form-group' }, [
        props.label
          ? h('div', { class: 'form-tit' }, [
              h('label', { for: id.value }, props.label),
            ])
          : null,
        h('div', { class: formContsClass }, [
          h('input', {
            ...attrs,
            id: id.value,
            type: props.type,
            name: props.name,
            value: value.value,
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: props.readonly,
            required: props.required,
            class: ['krds-input', props.size, attrs.class],
            'aria-invalid': props.state === 'error' ? 'true' : attrs['aria-invalid'],
            'aria-readonly': attrs['aria-readonly'],
            'aria-describedby': describedBy,
            onInput: (event: Event) => {
              value.value = (event.target as HTMLInputElement).value;
              emit('input', event);
            },
            onChange: (event: Event) => emit('change', event),
            onFocus: (event: FocusEvent) => emit('focus', event),
            onBlur: (event: FocusEvent) => emit('blur', event),
          }),
        ]),
        message.value
          ? h('p', { id: hintId.value, class: hintClass }, message.value)
          : null,
      ]);
    };
  },
});

type NativeEventHandler = (event: Event) => unknown;
const invokeNativeEvent = (listener: unknown, event: Event) => {
  if (typeof listener === 'function') {
    (listener as NativeEventHandler)(event);
  } else if (Array.isArray(listener)) {
    listener.forEach((candidate) => {
      if (typeof candidate === 'function') (candidate as NativeEventHandler)(event);
    });
  }
};

export const Checkbox = defineComponent<CheckboxProps>({
  name: 'KrdsCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    defaultChecked: { type: Boolean, default: false },
    label: { type: String, required: true },
    description: { type: String, default: undefined },
    size: { type: String as PropType<'medium' | 'large'>, default: undefined },
    id: { type: String, default: undefined },
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
    name: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_value: boolean) => true,
  },
  setup(props, { emit, attrs }) {
    const generatedId = `krds-checkbox-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const descriptionId = computed(() =>
      props.description ? `${id.value}-description` : undefined,
    );
    const localChecked = ref(Boolean(props.defaultChecked));
    const checked = computed<boolean>({
      get: (): boolean =>
        props.modelValue === undefined ? localChecked.value : props.modelValue === true,
      set: (next: boolean) => {
        if (props.modelValue === undefined) localChecked.value = next;
        emit('update:modelValue', next);
      },
    });
    return () => {
      const { class: rootClass, ...inputAttrs } = attrs;
      const describedBy =
        [
          typeof attrs['aria-describedby'] === 'string'
            ? attrs['aria-describedby']
            : undefined,
          descriptionId.value,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

      return h(
        'div',
        {
          class: ['krds-form-check', props.size, rootClass],
        },
        [
          h('input', {
            ...inputAttrs,
            id: id.value,
            name: props.name,
            type: 'checkbox',
            checked: checked.value,
            disabled: props.disabled,
            required: props.required,
            readonly: props.readonly,
            'aria-readonly': props.readonly ? 'true' : attrs['aria-readonly'],
            'aria-describedby': describedBy,
            onClick: props.readonly
              ? (event: MouseEvent) => {
                  invokeNativeEvent(attrs.onClick, event);
                  event.preventDefault();
                }
              : attrs.onClick,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              const target = event.target as HTMLInputElement;
              if (props.readonly) {
                target.checked = checked.value;
                return;
              }
              checked.value = target.checked;
            },
          }),
          h('label', { for: id.value }, props.label),
          props.description
            ? h('div', { class: 'krds-form-check-cnt' }, [
                h(
                  'p',
                  { id: descriptionId.value, class: 'krds-form-check-p' },
                  props.description,
                ),
              ])
            : null,
        ],
      );
    };
  },
});

export const Radio = defineComponent<RadioProps>({
  name: 'KrdsRadio',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    value: {
      type: null as unknown as PropType<string | number | boolean | undefined>,
      default: undefined,
    },
    label: { type: String, required: true },
    description: { type: String, default: undefined },
    size: { type: String as PropType<'medium' | 'large'>, default: undefined },
    id: { type: String, default: undefined },
    name: { type: String, required: true },
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
  },
  emits: {
    'update:modelValue': (_value: string | number | boolean) => true,
  },
  setup(props, { emit, attrs }) {
    const generatedId = `krds-radio-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const descriptionId = computed(() =>
      props.description ? `${id.value}-description` : undefined,
    );
    const localValue = ref<string | number | boolean | undefined>(props.defaultValue);
    const selected = computed<string | number | boolean | undefined>({
      get: () => props.modelValue ?? localValue.value,
      set: (next) => {
        if (props.modelValue === undefined) localValue.value = next;
        emit('update:modelValue', next);
      },
    });
    return () => {
      const { class: rootClass, ...inputAttrs } = attrs;
      const describedBy =
        [
          typeof attrs['aria-describedby'] === 'string'
            ? attrs['aria-describedby']
            : undefined,
          descriptionId.value,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

      return h(
        'div',
        {
          class: ['krds-form-check', props.size, rootClass],
        },
        [
          h('input', {
            ...inputAttrs,
            id: id.value,
            name: props.name,
            type: 'radio',
            value: props.value === undefined ? undefined : String(props.value),
            checked: props.value !== undefined && selected.value === props.value,
            disabled: props.disabled,
            required: props.required,
            readonly: props.readonly,
            'aria-readonly': props.readonly ? 'true' : attrs['aria-readonly'],
            'aria-describedby': describedBy,
            onClick: props.readonly
              ? (event: MouseEvent) => {
                  invokeNativeEvent(attrs.onClick, event);
                  event.preventDefault();
                }
              : attrs.onClick,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              const target = event.target as HTMLInputElement;
              if (props.readonly) {
                target.checked = selected.value === props.value;
                return;
              }
              selected.value = props.value;
            },
          }),
          h('label', { for: id.value }, props.label),
          props.description
            ? h('div', { class: 'krds-form-check-cnt' }, [
                h(
                  'p',
                  { id: descriptionId.value, class: 'krds-form-check-p' },
                  props.description,
                ),
              ])
            : null,
        ],
      );
    };
  },
});

export const Switch = defineComponent<SwitchProps>({
  name: 'KrdsSwitch',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    defaultChecked: { type: Boolean, default: false },
    label: { type: String, required: true },
    size: { type: String as PropType<'medium' | 'large'>, default: undefined },
    id: { type: String, default: undefined },
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
    name: { type: String, default: undefined },
  },
  emits: {
    'update:modelValue': (_value: boolean) => true,
  },
  setup(props, { emit, attrs }) {
    const generatedId = `krds-switch-${useId()}`;
    const id = computed(() => props.id ?? generatedId);
    const localChecked = ref(Boolean(props.defaultChecked));
    const checked = computed<boolean>({
      get: (): boolean =>
        props.modelValue === undefined ? localChecked.value : props.modelValue === true,
      set: (next: boolean) => {
        if (props.modelValue === undefined) localChecked.value = next;
        emit('update:modelValue', next);
      },
    });
    return () => {
      const { class: rootClass, ...inputAttrs } = attrs;
      return h(
        'div',
        {
          class: ['krds-form-toggle-switch', props.size, rootClass],
        },
        [
          h('input', {
            ...inputAttrs,
            id: id.value,
            name: props.name,
            type: 'checkbox',
            checked: checked.value,
            disabled: props.disabled,
            required: props.required,
            readonly: props.readonly,
            'aria-readonly': props.readonly ? 'true' : attrs['aria-readonly'],
            onClick: props.readonly
              ? (event: MouseEvent) => {
                  invokeNativeEvent(attrs.onClick, event);
                  event.preventDefault();
                }
              : attrs.onClick,
            onChange: (event: Event) => {
              invokeNativeEvent(attrs.onChange, event);
              const target = event.target as HTMLInputElement;
              if (props.readonly) {
                target.checked = checked.value;
                return;
              }
              checked.value = target.checked;
            },
          }),
          h('label', { for: id.value }, [
            h('span', { class: 'switch-toggle' }, [h('i')]),
            props.label,
          ]),
        ],
      );
    };
  },
});

export interface AccordionItem extends AccordionItemContract {}
export interface AccordionProps extends Omit<AccordionContractProps, 'items'> {
  items: AccordionItem[];
  modelValue?: string[];
  defaultOpen?: string[];
}
export const Accordion = defineComponent<AccordionProps>({
  name: 'KrdsAccordion',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<AccordionItem[]>, required: true },
    type: { type: String as PropType<'default' | 'line'>, default: 'default' },
    multiple: Boolean,
    modelValue: { type: Array as PropType<string[] | undefined>, default: undefined },
    defaultOpen: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: {
    'update:modelValue': (_value: string[]) => true,
  },
  setup(props, { emit, attrs }) {
    const generatedId = `krds-accordion-${useId()}`;
    const localOpen = ref<string[]>([...(props.defaultOpen ?? [])]);
    const openItems = computed(() => props.modelValue ?? localOpen.value);
    const toggle = (id: string) => {
      const current = openItems.value;
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : props.multiple
          ? [...current, id]
          : [id];
      if (props.modelValue === undefined) localOpen.value = next;
      emit('update:modelValue', next);
    };
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: [accordionRecipe({ type: props.type }).className, attrs.class],
        },
        props.items.map((item) => {
          const open = openItems.value.includes(item.id);
          const itemId = encodeURIComponent(item.id);
          const headerId = `${generatedId}-header-${itemId}`;
          const panelId = `${generatedId}-panel-${itemId}`;
          return h('div', { class: 'accordion-item', key: item.id }, [
            h(
              'h5',
              { class: 'accordion-header' },
              h(
                'button',
                {
                  type: 'button',
                  class: 'btn-accordion',
                  id: headerId,
                  'aria-expanded': open ? 'true' : 'false',
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
                class: ['accordion-collapse', 'collapse', open ? 'show' : undefined],
                role: 'region',
                'aria-labelledby': headerId,
                hidden: !open,
              },
              h('div', { class: 'accordion-body' }, item.content),
            ),
          ]);
        }),
      );
  },
});

export const AccordionLine = defineComponent({
  name: 'KrdsAccordionLine',
  inheritAttrs: false,
  props: Accordion.props,
  emits: {
    'update:modelValue': (_value: string[]) => true,
  },
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        Accordion as unknown as Component,
        {
          ...props,
          ...attrs,
          type: 'line',
          onUpdateModelValue: (value: string[]) => emit('update:modelValue', value),
        },
        slots,
      );
  },
});
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
export type { AdditionalProps, AdditionalValue } from './additional.js';
