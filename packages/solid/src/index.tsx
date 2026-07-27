import { For, Show, createEffect, createSignal, mergeProps, splitProps, type JSX } from 'solid-js';
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

export interface ButtonProps
  extends ButtonContractProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {}
export function Button(rawProps: ButtonProps) {
  const merged = mergeProps(
    { variant: 'primary' as const, size: 'medium' as const, type: 'button' as const },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    'variant',
    'size',
    'type',
    'class',
    'disabled',
    'children',
  ]);
  const recipe = () =>
    buttonRecipe({
      variant: props.variant,
      size: props.size,
      disabled: props.disabled,
      className: props.class,
    });
  return (
    <button
      {...nativeProps}
      type={props.type}
      disabled={props.disabled}
      class={recipe().className}
      data-variant={recipe().data.variant}
      data-size={recipe().data.size}
    >
      {props.children}
    </button>
  );
}

export interface TextInputProps
  extends
    Omit<TextInputContractProps, 'label' | 'hint'>,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'disabled'> {
  label?: string;
  hint?: string;
}
export function TextInput(rawProps: TextInputProps) {
  const merged = mergeProps(
    { state: 'default' as const, size: 'medium' as const, id: 'krds-input' },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    'state',
    'size',
    'id',
    'label',
    'hint',
    'class',
    'value',
  ]);
  const [value, setValue] = createSignal(String(props.value ?? ''));
  createEffect(() => setValue(String(props.value ?? '')));
  const hintId = () => {
    if (props.hint) return `${props.id}-hint`;
    return undefined;
  };
  const ariaInvalid = () => {
    if (props.state === 'error') return 'true';
    return nativeProps['aria-invalid'];
  };
  const recipe = () =>
    inputRecipe({ state: props.state, size: props.size, className: props.class });
  return (
    <label class={fieldRecipe().className}>
      <Show when={props.label}>
        <span class="krds-field-label">{props.label}</span>
      </Show>
      <input
        {...nativeProps}
        id={props.id}
        value={value()}
        class={recipe().className}
        data-state={recipe().data.state}
        data-size={recipe().data.size}
        aria-invalid={ariaInvalid()}
        aria-describedby={nativeProps['aria-describedby'] ?? hintId()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <Show when={props.hint}>
        <span id={hintId()} class="krds-field-message" data-state={props.state}>
          {props.hint}
        </span>
      </Show>
    </label>
  );
}

export interface CheckboxProps
  extends
    Omit<ChoiceContractProps, 'label' | 'description'>,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled'> {
  label: string;
  description?: string;
}
export function Checkbox(rawProps: CheckboxProps) {
  const merged = mergeProps({ size: 'medium' as const, id: 'krds-checkbox' }, rawProps);
  const [props, nativeProps] = splitProps(merged, ['size', 'id', 'label', 'description', 'class']);
  return (
    <div
      class={choiceRecipe({ size: props.size, className: props.class }).className}
      data-size={props.size}
    >
      <input {...nativeProps} id={props.id} type="checkbox" />
      <label for={props.id}>{props.label}</label>
      <Show when={props.description}>
        <span class="krds-field-message">{props.description}</span>
      </Show>
    </div>
  );
}

export interface RadioProps
  extends
    Omit<RadioContractProps, 'label' | 'description' | 'value'>,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled' | 'value'> {
  label: string;
  value: string;
  description?: string;
}
export function Radio(rawProps: RadioProps) {
  const merged = mergeProps({ size: 'medium' as const, id: 'krds-radio' }, rawProps);
  const [props, nativeProps] = splitProps(merged, [
    'size',
    'id',
    'label',
    'description',
    'class',
    'value',
  ]);
  return (
    <div
      class={choiceRecipe({ size: props.size, className: props.class }).className}
      data-size={props.size}
    >
      <input {...nativeProps} id={props.id} type="radio" value={props.value} />
      <label for={props.id}>{props.label}</label>
      <Show when={props.description}>
        <span class="krds-field-message">{props.description}</span>
      </Show>
    </div>
  );
}

export interface SwitchProps
  extends
    Omit<ChoiceContractProps, 'label' | 'description'>,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled'> {
  label: string;
}
export function Switch(rawProps: SwitchProps) {
  const merged = mergeProps({ size: 'medium' as const, id: 'krds-switch' }, rawProps);
  const [props, nativeProps] = splitProps(merged, ['size', 'id', 'label', 'class']);
  return (
    <div
      class={switchRecipe({ size: props.size, className: props.class }).className}
      data-size={props.size}
    >
      <input {...nativeProps} id={props.id} type="checkbox" />
      <label for={props.id}>
        <span class="switch-toggle" aria-hidden="true">
          <i />
        </span>
        {props.label}
      </label>
    </div>
  );
}

export interface AccordionItem extends AccordionItemContract {}
export interface AccordionProps
  extends Omit<AccordionContractProps, 'items'>, JSX.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  defaultOpen?: string[];
}
export function Accordion(rawProps: AccordionProps) {
  const merged = mergeProps(
    { type: 'default' as const, multiple: false, defaultOpen: [] as string[] },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    'type',
    'multiple',
    'defaultOpen',
    'items',
    'class',
    'children',
  ]);
  const [openItems, setOpenItems] = createSignal(props.defaultOpen);
  const toggle = (id: string) => {
    const current = openItems();
    if (current.includes(id)) setOpenItems(current.filter((item) => item !== id));
    else if (props.multiple) setOpenItems([...current, id]);
    else setOpenItems([id]);
  };
  const recipe = () => accordionRecipe({ type: props.type, className: props.class });
  return (
    <div {...nativeProps} class={recipe().className} data-type={props.type}>
      <For each={props.items}>
        {(item) => {
          const open = () => openItems().includes(item.id);
          const headerId = `krds-accordion-header-${item.id}`;
          const panelId = `krds-accordion-panel-${item.id}`;
          return (
            <div class="krds-accordion-item" classList={{ 'is-open': open() }}>
              <h5 class="krds-accordion-heading">
                <button
                  type="button"
                  class="krds-accordion-trigger"
                  id={headerId}
                  aria-expanded={open()}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => toggle(item.id)}
                >
                  {item.title}
                </button>
              </h5>
              <div
                id={panelId}
                class="krds-accordion-panel"
                role="region"
                aria-labelledby={headerId}
                hidden={!open()}
              >
                {item.content}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

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
export type { AdditionalProps } from './additional.js';
