<script>
  import Accordion from '../../../packages/svelte/src/Accordion.svelte';
  import Badge from '../../../packages/svelte/src/Badge.svelte';
  import Breadcrumb from '../../../packages/svelte/src/Breadcrumb.svelte';
  import Button from '../../../packages/svelte/src/Button.svelte';
  import ButtonHierarchy from '../../../packages/svelte/src/ButtonHierarchy.svelte';
  import ButtonSize from '../../../packages/svelte/src/ButtonSize.svelte';
  import ButtonIcon from '../../../packages/svelte/src/ButtonIcon.svelte';
  import ButtonText from '../../../packages/svelte/src/ButtonText.svelte';
  import ButtonWithIcon from '../../../packages/svelte/src/ButtonWithIcon.svelte';
  import Calendar from '../../../packages/svelte/src/Calendar.svelte';
  import Carousel from '../../../packages/svelte/src/Carousel.svelte';
  import Checkbox from '../../../packages/svelte/src/Checkbox.svelte';
  import CheckboxChip from '../../../packages/svelte/src/CheckboxChip.svelte';
  import CheckboxSize from '../../../packages/svelte/src/CheckboxSize.svelte';
  import CoachMark from '../../../packages/svelte/src/CoachMark.svelte';
  import ContextualHelp from '../../../packages/svelte/src/ContextualHelp.svelte';
  import CriticalAlerts from '../../../packages/svelte/src/CriticalAlerts.svelte';
  import Disclosure from '../../../packages/svelte/src/Disclosure.svelte';
  import Favicon from '../../../packages/svelte/src/Favicon.svelte';
  import FileUpload from '../../../packages/svelte/src/FileUpload.svelte';
  import Footer from '../../../packages/svelte/src/Footer.svelte';
  import Header from '../../../packages/svelte/src/Header.svelte';
  import HelpPanel from '../../../packages/svelte/src/HelpPanel.svelte';
  import Identifier from '../../../packages/svelte/src/Identifier.svelte';
  import InPageNavigation from '../../../packages/svelte/src/InPageNavigation.svelte';
  import LanguageSwitcher from '../../../packages/svelte/src/LanguageSwitcher.svelte';
  import Link from '../../../packages/svelte/src/Link.svelte';
  import MainMenuMobile from '../../../packages/svelte/src/MainMenuMobile.svelte';
  import MainMenuPc from '../../../packages/svelte/src/MainMenuPc.svelte';
  import Masthead from '../../../packages/svelte/src/Masthead.svelte';
  import Modal from '../../../packages/svelte/src/Modal.svelte';
  import Pagination from '../../../packages/svelte/src/Pagination.svelte';
  import RadioButton from '../../../packages/svelte/src/RadioButton.svelte';
  import RadioChip from '../../../packages/svelte/src/RadioChip.svelte';
  import RadioSize from '../../../packages/svelte/src/RadioSize.svelte';
  import Resize from '../../../packages/svelte/src/Resize.svelte';
  import Select from '../../../packages/svelte/src/Select.svelte';
  import SelectSorting from '../../../packages/svelte/src/SelectSorting.svelte';
  import SideNavigation from '../../../packages/svelte/src/SideNavigation.svelte';
  import SkipLink from '../../../packages/svelte/src/SkipLink.svelte';
  import Spinner from '../../../packages/svelte/src/Spinner.svelte';
  import StepIndicator from '../../../packages/svelte/src/StepIndicator.svelte';
  import StructuredList from '../../../packages/svelte/src/StructuredList.svelte';
  import StructuredListTable from '../../../packages/svelte/src/StructuredListTable.svelte';
  import Tab from '../../../packages/svelte/src/Tab.svelte';
  import Table from '../../../packages/svelte/src/Table.svelte';
  import Tag from '../../../packages/svelte/src/Tag.svelte';
  import TagLink from '../../../packages/svelte/src/TagLink.svelte';
  import Textarea from '../../../packages/svelte/src/Textarea.svelte';
  import TextInput from '../../../packages/svelte/src/TextInput.svelte';
  import TextInputIcon from '../../../packages/svelte/src/TextInputIcon.svelte';
  import TextList from '../../../packages/svelte/src/TextList.svelte';
  import TextListOrdered from '../../../packages/svelte/src/TextListOrdered.svelte';
  import ToggleSwitch from '../../../packages/svelte/src/ToggleSwitch.svelte';
  import Tooltip from '../../../packages/svelte/src/Tooltip.svelte';
  import Tts from '../../../packages/svelte/src/Tts.svelte';
  import TutorialPanel from '../../../packages/svelte/src/TutorialPanel.svelte';

  let { kind, ...rest } = $props();
</script>

{#if kind === 'accordion'}
  <Accordion {...rest} />
{:else if kind === 'accordion-line'}
  <Accordion {...rest} />
{:else if kind === 'badge'}
  <Badge {...rest} />
{:else if kind === 'badge-number'}
  <Badge {...rest} />
{:else if kind === 'badge-size'}
  <Badge {...rest} />
{:else if kind === 'breadcrumb'}
  <Breadcrumb {...rest} />
{:else if kind === 'button' || kind === 'button-icon'}
  <Button {...rest} />
{:else if kind === 'button-hierarchy'}
  <ButtonHierarchy {...rest} />
{:else if kind === 'button-size'}
  <ButtonSize {...rest} />
{:else if kind === 'button-text'}
  <ButtonText {...rest} />
{:else if kind === 'button-with-icon'}
  <ButtonWithIcon {...rest} />
{:else if kind === 'calendar'}
  <Calendar {...rest} />
{:else if kind === 'calendar-range'}
  <Calendar kind="calendar-range" {...rest} />
{:else if kind === 'carousel'}
  <Carousel {...rest} />
{:else if kind === 'carousel-banner'}
  <Carousel {...rest} />
{:else if kind === 'checkbox'}
  <Checkbox {...rest} />
{:else if kind === 'checkbox-chip'}
  <CheckboxChip {...rest} />
{:else if kind === 'checkbox-size'}
  <CheckboxSize {...rest} />
{:else if kind === 'coach-mark'}
  <CoachMark {...rest} />
{:else if kind === 'contextual-help'}
  <ContextualHelp {...rest} />
{:else if kind === 'critical-alerts'}
  <CriticalAlerts {...rest} />
{:else if kind === 'date-input'}
  <Calendar kind="date-input" {...rest} />
{:else if kind === 'disclosure'}
  <Disclosure {...rest} />
{:else if kind === 'favicon'}
  <Favicon {...rest} />
{:else if kind === 'file-upload'}
  <FileUpload {...rest} />
{:else if kind === 'footer'}
  <Footer {...rest} />
{:else if kind === 'header'}
  <Header {...rest} />
{:else if kind === 'help-panel'}
  <HelpPanel {...rest} />
{:else if kind === 'identifier'}
  <Identifier {...rest} />
{:else if kind === 'in-page-navigation'}
  <InPageNavigation {...rest} />
{:else if kind === 'language-switcher'}
  <LanguageSwitcher {...rest} />
{:else if kind === 'language-switcher-page'}
  <LanguageSwitcher {...rest} />
{:else if kind === 'link'}
  <Link {...rest} />
{:else if kind === 'main-menu-pc'}
  <MainMenuPc {...rest} />
{:else if kind === 'main-menu-mobile'}
  <MainMenuMobile {...rest} />
{:else if kind === 'masthead'}
  <Masthead {...rest} />
{:else if kind === 'modal'}
  <Modal {...rest} />
{:else if kind === 'modal-sample'}
  <Modal {...rest} />
{:else if kind === 'pagination'}
  <Pagination {...rest} />
{:else if kind === 'radio'}
  <Button {...rest} />
{:else if kind === 'radio-button'}
  <RadioButton {...rest} />
{:else if kind === 'radio-chip'}
  <RadioChip {...rest} />
{:else if kind === 'radio-size'}
  <RadioSize {...rest} />
{:else if kind === 'resize'}
  <Resize {...rest} />
{:else if kind === 'select'}
  <Select {...rest} />
{:else if kind === 'select-size'}
  <Select {...rest} />
{:else if kind === 'select-sorting'}
  <SelectSorting {...rest} />
{:else if kind === 'select-state'}
  <Select {...rest} />
{:else if kind === 'side-navigation'}
  <SideNavigation {...rest} />
{:else if kind === 'skip-link'}
  <SkipLink {...rest} />
{:else if kind === 'spinner'}
  <Spinner {...rest} />
{:else if kind === 'step-indicator'}
  <StepIndicator {...rest} />
{:else if kind === 'structured-list'}
  <StructuredList {...rest} />
{:else if kind === 'structured-list-table'}
  <StructuredListTable {...rest} />
{:else if kind === 'switch'}
  <ToggleSwitch {...rest} />
{:else if kind === 'tab'}
  <Tab {...rest} />
{:else if kind === 'table'}
  <Table {...rest} />
{:else if kind === 'tag'}
  <Tag {...rest} />
{:else if kind === 'tag-link'}
  <TagLink {...rest} />
{:else if kind === 'textarea'}
  <Textarea {...rest} />
{:else if kind === 'text-input'}
  <TextInput {...rest} />
{:else if kind === 'text-input-icon'}
  <TextInputIcon {...rest} />
{:else if kind === 'text-input-size'}
  <TextInput {...rest} />
{:else if kind === 'text-input-state'}
  <TextInput {...rest} />
{:else if kind === 'text-list'}
  <TextList {...rest} />
{:else if kind === 'text-list-ordered'}
  <TextListOrdered {...rest} />
{:else if kind === 'toggle-switch'}
  <ToggleSwitch {...rest} />
{:else if kind === 'toggle-switch-size'}
  <ToggleSwitch {...rest} />
{:else if kind === 'tooltip'}
  <Tooltip {...rest} />
{:else if kind === 'tooltip-box'}
  <Tooltip {...rest} />
{:else if kind === 'tooltip-vertical'}
  <Tooltip {...rest} />
{:else if kind === 'tts'}
  <Tts {...rest} />
{:else if kind === 'tts-icon'}
  <Tts {...rest} />
{:else if kind === 'tts-size'}
  <Tts {...rest} />
{:else if kind === 'tutorial-panel'}
  <TutorialPanel {...rest} />
{/if}