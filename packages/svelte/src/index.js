import Additional from './Additional.svelte';
import Accordion from './Accordion.svelte';
const createAdditional = (kind) => {
  return (anchor, props = {}) => {
    const presetProps = Object.create(Object.getPrototypeOf(props));
    Object.defineProperties(presetProps, Object.getOwnPropertyDescriptors(props));
    Object.defineProperty(presetProps, 'kind', {
      configurable: true,
      enumerable: true,
      value: kind,
      writable: true,
    });
    return Additional(anchor, presetProps);
  };
};

export { Accordion };
export const AccordionLine = (anchor, props = {}) => {
  const presetProps = Object.create(Object.getPrototypeOf(props));
  Object.defineProperties(presetProps, Object.getOwnPropertyDescriptors(props));
  Object.defineProperty(presetProps, 'kind', {
    configurable: true,
    enumerable: true,
    value: 'accordion-line',
    writable: true,
  });
  return Accordion(anchor, presetProps);
};
export { default as Button } from './Button.svelte';
export { default as Checkbox } from './Checkbox.svelte';
export { default as Radio } from './Radio.svelte';
export { default as Switch } from './Switch.svelte';
export { default as TextInput } from './TextInput.svelte';
export { default as TextInputSize } from './TextInput.svelte';
export { default as TextInputState } from './TextInput.svelte';
export const Badge = createAdditional('badge');
export const BadgeNumber = createAdditional('badge-number');
export const BadgeSize = createAdditional('badge-size');
export const Breadcrumb = createAdditional('breadcrumb');
export const ButtonHierarchy = createAdditional('button-hierarchy');
export const ButtonIcon = createAdditional('button-icon');
export const ButtonSize = createAdditional('button-size');
export const ButtonText = createAdditional('button-text');
export const ButtonWithIcon = createAdditional('button-with-icon');
export const Calendar = createAdditional('calendar');
export const CalendarRange = createAdditional('calendar-range');
export const Carousel = createAdditional('carousel');
export const CarouselBanner = createAdditional('carousel-banner');
export const CheckboxChip = createAdditional('checkbox-chip');
export const CheckboxSize = createAdditional('checkbox-size');
export const CoachMark = createAdditional('coach-mark');
export const ContextualHelp = createAdditional('contextual-help');
export const CriticalAlerts = createAdditional('critical-alerts');
export const DateInput = createAdditional('date-input');
export const Disclosure = createAdditional('disclosure');
export const Favicon = createAdditional('favicon');
export const FileUpload = createAdditional('file-upload');
export const Footer = createAdditional('footer');
export const Header = createAdditional('header');
export const HelpPanel = createAdditional('help-panel');
export const Identifier = createAdditional('identifier');
export const InPageNavigation = createAdditional('in-page-navigation');
export const LanguageSwitcher = createAdditional('language-switcher');
export const LanguageSwitcherPage = createAdditional('language-switcher-page');
export const Link = createAdditional('link');
export const MainMenuMobile = createAdditional('main-menu-mobile');
export const MainMenuPc = createAdditional('main-menu-pc');
export const Masthead = createAdditional('masthead');
export const Modal = createAdditional('modal');
export const ModalSample = createAdditional('modal-sample');
export const Pagination = createAdditional('pagination');
export const RadioButton = createAdditional('radio-button');
export const RadioChip = createAdditional('radio-chip');
export const RadioSize = createAdditional('radio-size');
export const Resize = createAdditional('resize');
export const Select = createAdditional('select');
export const SelectSize = createAdditional('select-size');
export const SelectSorting = createAdditional('select-sorting');
export const SelectState = createAdditional('select-state');
export const SideNavigation = createAdditional('side-navigation');
export const SkipLink = createAdditional('skip-link');
export const Spinner = createAdditional('spinner');
export const StepIndicator = createAdditional('step-indicator');
export const StructuredList = createAdditional('structured-list');
export const StructuredListTable = createAdditional('structured-list-table');
export const Tab = createAdditional('tab');
export const Table = createAdditional('table');
export const Tag = createAdditional('tag');
export const TagLink = createAdditional('tag-link');
export const Textarea = createAdditional('textarea');
export const TextInputIcon = createAdditional('text-input-icon');
export const TextList = createAdditional('text-list');
export const TextListOrdered = createAdditional('text-list-ordered');
export const ToggleSwitch = createAdditional('toggle-switch');
export const ToggleSwitchSize = createAdditional('toggle-switch-size');
export const Tooltip = createAdditional('tooltip');
export const TooltipBox = createAdditional('tooltip-box');
export const TooltipVertical = createAdditional('tooltip-vertical');
export const Tts = createAdditional('tts');
export const TtsIcon = createAdditional('tts-icon');
export const TtsSize = createAdditional('tts-size');
export const TutorialPanel = createAdditional('tutorial-panel');
