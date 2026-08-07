import Accordion from "./Accordion.svelte";
export { Accordion };
const withProps =
  (component, forcedProps) =>
  (anchor, props = {}) => {
    const presetProps = Object.create(Object.getPrototypeOf(props));
    Object.defineProperties(presetProps, Object.getOwnPropertyDescriptors(props));
    for (const [key, value] of Object.entries(forcedProps)) {
      Object.defineProperty(presetProps, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });
    }
    return component(anchor, presetProps);
  };
export const AccordionLine = withProps(Accordion, { kind: "accordion-line" });
export { default as Button } from "./Button.svelte";
export { default as Checkbox } from "./Checkbox.svelte";
export { default as Radio } from "./Radio.svelte";
export { default as Switch } from "./Switch.svelte";
export { default as TextInput } from "./TextInput.svelte";
export { default as TextInputSize } from "./TextInput.svelte";
export { default as TextInputState } from "./TextInput.svelte";

import Badge from "./Badge.svelte";
export { Badge };
export const BadgeNumber = withProps(Badge, { number: true });
export const BadgeSize = withProps(Badge, {});

export { default as Breadcrumb } from "./Breadcrumb.svelte";
export { default as ButtonHierarchy } from "./ButtonHierarchy.svelte";
export { default as ButtonIcon } from "./ButtonIcon.svelte";
export { default as ButtonSize } from "./ButtonSize.svelte";
export { default as ButtonText } from "./ButtonText.svelte";
export { default as ButtonWithIcon } from "./ButtonWithIcon.svelte";

import Calendar from "./Calendar.svelte";
export { Calendar };
export const CalendarRange = withProps(Calendar, { kind: "calendar-range" });
export { default as DateInput } from "./DateInput.svelte";

import Carousel from "./Carousel.svelte";
export { Carousel };
export const CarouselBanner = withProps(Carousel, { kind: "banner" });

export { default as CheckboxChip } from "./CheckboxChip.svelte";
export { default as CheckboxSize } from "./CheckboxSize.svelte";
export { default as CoachMark } from "./CoachMark.svelte";
export { default as ContextualHelp } from "./ContextualHelp.svelte";
export { default as CriticalAlerts } from "./CriticalAlerts.svelte";
export { default as Disclosure } from "./Disclosure.svelte";
export { default as Favicon } from "./Favicon.svelte";
export { default as FileUpload } from "./FileUpload.svelte";
export { default as Footer } from "./Footer.svelte";
export { default as Header } from "./Header.svelte";
export { default as HelpPanel } from "./HelpPanel.svelte";
export { default as Identifier } from "./Identifier.svelte";
export { default as InPageNavigation } from "./InPageNavigation.svelte";

import LanguageSwitcher from "./LanguageSwitcher.svelte";
export { LanguageSwitcher };
export const LanguageSwitcherPage = withProps(LanguageSwitcher, { kind: "page" });

export { default as Link } from "./Link.svelte";
export { default as MainMenuMobile } from "./MainMenuMobile.svelte";
export { default as MainMenuPc } from "./MainMenuPc.svelte";
export { default as Masthead } from "./Masthead.svelte";

import Modal from "./Modal.svelte";
export { Modal };
export const ModalSample = Modal;

export { default as Pagination } from "./Pagination.svelte";
export { default as RadioButton } from "./RadioButton.svelte";
export { default as RadioChip } from "./RadioChip.svelte";
export { default as RadioSize } from "./RadioSize.svelte";
export { default as Resize } from "./Resize.svelte";

import Select from "./Select.svelte";
export { Select };
export const SelectSize = Select;
export const SelectState = Select;

export { default as SelectSorting } from "./SelectSorting.svelte";
export { default as SideNavigation } from "./SideNavigation.svelte";
export { default as SkipLink } from "./SkipLink.svelte";
export { default as Spinner } from "./Spinner.svelte";
export { default as StepIndicator } from "./StepIndicator.svelte";
export { default as StructuredList } from "./StructuredList.svelte";
export { default as StructuredListTable } from "./StructuredListTable.svelte";
export { default as Tab } from "./Tab.svelte";
export { default as Table } from "./Table.svelte";
export { default as Tag } from "./Tag.svelte";
export { default as TagLink } from "./TagLink.svelte";
export { default as Textarea } from "./Textarea.svelte";
export { default as TextInputIcon } from "./TextInputIcon.svelte";
export { default as TextList } from "./TextList.svelte";
export { default as TextListOrdered } from "./TextListOrdered.svelte";

import ToggleSwitch from "./ToggleSwitch.svelte";
export { ToggleSwitch };
export const ToggleSwitchSize = ToggleSwitch;

import Tooltip from "./Tooltip.svelte";
export { Tooltip };
export const TooltipBox = withProps(Tooltip, { kind: "box" });
export const TooltipVertical = withProps(Tooltip, { kind: "vertical" });

import Tts from "./Tts.svelte";
import TtsIcon from "./TtsIcon.svelte";
import TtsSize from "./TtsSize.svelte";
export { Tts };
export { TtsIcon, TtsSize };

import TutorialPanel from "./TutorialPanel.svelte";
export { TutorialPanel };

export { default as Toast } from "./Toast.svelte";
export { default as Snackbar } from "./Snackbar.svelte";
export { default as Alert } from "./Alert.svelte";
export { default as Infobox } from "./Infobox.svelte";
export { default as ProgressBar } from "./ProgressBar.svelte";
export { default as Search } from "./Search.svelte";
export { default as Chip } from "./Chip.svelte";
export { default as TopButton } from "./TopButton.svelte";
export { default as UserFeedback } from "./UserFeedback.svelte";
export { default as Card } from "./Card.svelte";
export { default as BottomSheet } from "./BottomSheet.svelte";
export { default as TabBar } from "./TabBar.svelte";
