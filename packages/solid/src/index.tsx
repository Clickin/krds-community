import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
  type JSX,
} from 'solid-js';
import { accordionRecipe, buttonRecipe } from '@krds-community/recipes';
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
    { size: 'medium' as const, type: 'button' as const },
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
  error?: string;
}
export function TextInput(rawProps: TextInputProps) {
  const merged = mergeProps(
    {
      state: 'default' as const,
      type: 'text' as const,
      id: `krds-input-${createUniqueId()}`,
    },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    'state',
    'size',
    'id',
    'label',
    'hint',
    'error',
    'class',
    'value',
    'onInput',
    'ref',
  ]);
  const [localValue, setLocalValue] = createSignal('');
  const hintClass = () => {
    if (props.state === 'error') return 'form-hint-invalid';
    if (props.state === 'success') return 'form-hint-success';
    if (props.state === 'information') return 'form-hint-information';
    return 'form-hint';
  };
  const ariaInvalid = () => {
    if (props.state === 'error') return 'true';
    return nativeProps['aria-invalid'];
  };
  const updateValue = (
    event: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement },
  ) => {
    if (props.value === undefined) setLocalValue(event.currentTarget.value);
    const handler = props.onInput;
    if (typeof handler === 'function') handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === 'function')
      handler[0](handler[1], event);
  };
  return (
    <div class="form-group">
      <div class="form-tit">
        <label for={props.id}>{props.label}</label>
      </div>
      <div
        class={
          props.state === 'default' ? 'form-conts' : `form-conts is-${props.state}`
        }
      >
        <input
          {...nativeProps}
          id={props.id}
          ref={(element) => {
            const callerRef = props.ref;
            if (typeof callerRef === 'function') callerRef(element);
            createEffect(() => {
              const controlledValue = props.value;
              if (controlledValue !== undefined)
                element.value = String(controlledValue);
            });
          }}
          value={
            props.value === undefined ? localValue() : String(props.value ?? '')
          }
          class={`krds-input${props.size ? ` ${props.size}` : ''}${props.class ? ` ${props.class}` : ''}`}
          aria-invalid={ariaInvalid()}
          aria-describedby={
            nativeProps['aria-describedby'] ??
            (props.hint ? `${props.id}-hint` : undefined)
          }
          onInput={updateValue}
        />
      </div>
      <Show when={props.hint}>
        <p id={`${props.id}-hint`} class={hintClass()}>
          {props.hint}
        </p>
      </Show>
    </div>
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
  const merged = mergeProps({ id: `krds-checkbox-${createUniqueId()}` }, rawProps);
  const [props, nativeProps] = splitProps(merged, [
    'size',
    'id',
    'label',
    'description',
    'class',
  ]);
  return (
    <div
      class={`krds-form-check${props.size ? ` ${props.size}` : ''}${props.class ? ` ${props.class}` : ''}`}
    >
      <input {...nativeProps} id={props.id} type="checkbox" />
      <label for={props.id}>{props.label}</label>
      <Show when={props.description}>
        <div class="krds-form-check-cnt">
          <p class="krds-form-check-p">{props.description}</p>
        </div>
      </Show>
    </div>
  );
}

export interface RadioProps
  extends
    Omit<RadioContractProps, 'label' | 'description' | 'value'>,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled' | 'value'> {
  label: string;
  value?: string;
  description?: string;
}
export function Radio(rawProps: RadioProps) {
  const merged = mergeProps({ id: `krds-radio-${createUniqueId()}` }, rawProps);
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
      class={`krds-form-check${props.size ? ` ${props.size}` : ''}${props.class ? ` ${props.class}` : ''}`}
    >
      <input {...nativeProps} id={props.id} type="radio" value={props.value} />
      <label for={props.id}>{props.label}</label>
      <Show when={props.description}>
        <div class="krds-form-check-cnt">
          <p class="krds-form-check-p">{props.description}</p>
        </div>
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
  const merged = mergeProps({ id: `krds-switch-${createUniqueId()}` }, rawProps);
  const [props, nativeProps] = splitProps(merged, ['size', 'id', 'label', 'class']);
  return (
    <div
      class={`krds-form-toggle-switch${props.size ? ` ${props.size}` : ''}${props.class ? ` ${props.class}` : ''}`}
    >
      <input {...nativeProps} id={props.id} type="checkbox" />
      <label for={props.id}>
        <span class="switch-toggle">
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
  const instanceId = createUniqueId();
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
  return (
    <div
      {...nativeProps}
      class={accordionRecipe({ type: props.type, className: props.class }).className}
    >
      <For each={props.items}>
        {(item) => {
          const open = () => openItems().includes(item.id);
          return (
            <div class="accordion-item">
              <h5 class="accordion-header">
                <button
                  type="button"
                  class="btn-accordion"
                  id={`krds-accordion-${instanceId}-header-${item.id}`}
                  aria-expanded={open()}
                  aria-controls={`krds-accordion-${instanceId}-panel-${item.id}`}
                  disabled={item.disabled}
                  onClick={() => toggle(item.id)}
                >
                  {item.title}
                </button>
              </h5>
              <div
                id={`krds-accordion-${instanceId}-panel-${item.id}`}
                class="accordion-collapse collapse"
                classList={{ show: open() }}
                role="region"
                aria-labelledby={`krds-accordion-${instanceId}-header-${item.id}`}
                hidden={!open()}
              >
                <div class="accordion-body">{item.content}</div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

export function AccordionLine(props: Omit<AccordionProps, 'type'>) {
  return <Accordion {...props} type="line" />;
}
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
export type {
  AdditionalProps,
  HeaderMobileMenu,
  HeaderMyMenu,
  MenuBanner,
  MenuDescriptionItem,
  MenuItem,
} from './additional.js';
