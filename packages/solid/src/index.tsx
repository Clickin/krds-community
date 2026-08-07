import {
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
  type JSX,
} from "solid-js";
import { buttonRecipe } from "@krds-community/recipes";
import type {
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from "@krds-community/recipes";

export interface ButtonProps
  extends ButtonContractProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {}
export function Button(rawProps: ButtonProps) {
  const merged = mergeProps({ size: "medium" as const, type: "button" as const }, rawProps);
  const [props, nativeProps] = splitProps(merged, [
    "variant",
    "size",
    "type",
    "class",
    "disabled",
    "children",
  ]);
  const recipe = () =>
    buttonRecipe({
      variant: props.variant,
      size: props.size,
      disabled: props.disabled,
      className: props.class,
    });
  return (
    <button {...nativeProps} type={props.type} disabled={props.disabled} class={recipe().className}>
      {props.children}
    </button>
  );
}

export interface TextInputProps
  extends
    Omit<TextInputContractProps, "label" | "hint">,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "disabled"> {
  label?: string;
  hint?: string;
  error?: string;
}
export function TextInput(rawProps: TextInputProps) {
  const merged = mergeProps(
    {
      state: "default" as const,
      type: "text" as const,
      id: `krds-input-${createUniqueId()}`,
    },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    "state",
    "size",
    "id",
    "label",
    "hint",
    "error",
    "class",
    "value",
    "onInput",
    "ref",
  ]);
  const [localValue, setLocalValue] = createSignal("");
  const hintClass = () => {
    if (props.state === "error") return "form-hint-invalid";
    if (props.state === "success") return "form-hint-success";
    if (props.state === "information") return "form-hint-information";
    return "form-hint";
  };
  const ariaInvalid = () => {
    if (props.state === "error") return "true";
    return nativeProps["aria-invalid"];
  };
  const updateValue = (
    event: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement },
  ) => {
    if (props.value === undefined) setLocalValue(event.currentTarget.value);
    const handler = props.onInput;
    if (typeof handler === "function") handler(event);
    else if (Array.isArray(handler) && typeof handler[0] === "function")
      handler[0](handler[1], event);
  };
  return (
    <div class="form-group">
      <div class="form-tit">
        <label for={props.id}>{props.label}</label>
      </div>
      <div class={props.state === "default" ? "form-conts" : `form-conts is-${props.state}`}>
        <input
          {...nativeProps}
          id={props.id}
          ref={(element) => {
            const callerRef = props.ref;
            if (typeof callerRef === "function") callerRef(element);
            createEffect(() => {
              const controlledValue = props.value;
              if (controlledValue !== undefined) {
                const serializedValue = String(controlledValue);
                element.value = serializedValue;
                element.setAttribute("value", serializedValue);
              }
            });
          }}
          value={props.value === undefined ? localValue() : String(props.value ?? "")}
          class={`krds-input${props.size ? ` ${props.size}` : ""}${props.class ? ` ${props.class}` : ""}`}
          aria-invalid={ariaInvalid()}
          aria-describedby={
            nativeProps["aria-describedby"] ?? (props.hint ? `${props.id}-hint` : undefined)
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
    Omit<ChoiceContractProps, "label" | "description">,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled"> {
  label: string;
  description?: string;
}
export function Checkbox(rawProps: CheckboxProps) {
  const merged = mergeProps({ id: `krds-checkbox-${createUniqueId()}` }, rawProps);
  const [props, nativeProps] = splitProps(merged, ["size", "id", "label", "description", "class"]);
  return (
    <div
      class={`krds-form-check${props.size ? ` ${props.size}` : ""}${props.class ? ` ${props.class}` : ""}`}
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
    Omit<RadioContractProps, "label" | "description" | "value">,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled" | "value"> {
  label: string;
  value?: string;
  description?: string;
}
export function Radio(rawProps: RadioProps) {
  const merged = mergeProps({ id: `krds-radio-${createUniqueId()}` }, rawProps);
  const [props, nativeProps] = splitProps(merged, [
    "size",
    "id",
    "label",
    "description",
    "class",
    "value",
  ]);
  return (
    <div
      class={`krds-form-check${props.size ? ` ${props.size}` : ""}${props.class ? ` ${props.class}` : ""}`}
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
    Omit<ChoiceContractProps, "label" | "description">,
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "disabled"> {
  label: string;
}
export function Switch(rawProps: SwitchProps) {
  const merged = mergeProps({ id: `krds-switch-${createUniqueId()}` }, rawProps);
  const [props, nativeProps] = splitProps(merged, ["size", "id", "label", "class"]);
  return (
    <div
      class={`krds-form-toggle-switch${props.size ? ` ${props.size}` : ""}${props.class ? ` ${props.class}` : ""}`}
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

export type { AccordionItem, AccordionProps } from "./components/Accordion.js";
export { AccordionLine } from "./components/AccordionLine.js";
export { Alert } from "./components/Alert.js";
export const TextInputSize = TextInput;
export const TextInputState = TextInput;
export { Badge, BadgeNumber, BadgeSize } from "./components/Badge.js";
export { Breadcrumb } from "./components/Breadcrumb.js";
export { BottomSheet } from "./components/BottomSheet.js";
export { ButtonHierarchy, ButtonSize } from "./components/ButtonHierarchy.js";
export { ButtonIcon } from "./components/ButtonIcon.js";
export { ButtonText, ButtonWithIcon } from "./components/ButtonText.js";
export { Calendar, CalendarRange, DateInput } from "./components/Calendar.js";
export { Card } from "./components/Card.js";
export { Carousel, CarouselBanner } from "./components/Carousel.js";
export { CheckboxChip } from "./components/CheckboxChip.js";
export { CheckboxSize } from "./components/CheckboxSize.js";
export { Chip } from "./components/Chip.js";
export { CoachMark } from "./components/CoachMark.js";
export { ContextualHelp } from "./components/ContextualHelp.js";
export { CriticalAlerts } from "./components/CriticalAlerts.js";
export { Disclosure } from "./components/Disclosure.js";
export { Favicon } from "./components/Favicon.js";
export { FileUpload } from "./components/FileUpload.js";
export { Footer } from "./components/Footer.js";
export { Header } from "./components/Header.js";
export { HelpPanel, TutorialPanel } from "./components/HelpPanel.js";
export { Identifier } from "./components/Identifier.js";
export { Infobox } from "./components/Infobox.js";
export { InPageNavigation } from "./components/InPageNavigation.js";
export { Accordion } from "./components/Accordion.js";
export { Link } from "./components/Link.js";
export { MainMenuMobile } from "./components/MainMenuMobile.js";
export { MainMenuPc } from "./components/MainMenuPc.js";
export { Masthead } from "./components/Masthead.js";
export { LanguageSwitcher, LanguageSwitcherPage } from "./components/LanguageSwitcher.js";
export { Modal, ModalSample } from "./components/Modal.js";
export { Pagination } from "./components/Pagination.js";
export { ProgressBar } from "./components/ProgressBar.js";
export { RadioButton } from "./components/RadioButton.js";
export { RadioChip } from "./components/RadioChip.js";
export { RadioSize } from "./components/RadioSize.js";
export { Resize } from "./components/Resize.js";
export { Search } from "./components/Search.js";
export { Select, SelectSize, SelectState } from "./components/Select.js";
export { SelectSorting } from "./components/SelectSorting.js";
export { Snackbar } from "./components/Snackbar.js";
export { SideNavigation } from "./components/SideNavigation.js";
export { SkipLink } from "./components/SkipLink.js";
export { Spinner } from "./components/Spinner.js";
export { StepIndicator } from "./components/StepIndicator.js";
export { StructuredList } from "./components/StructuredList.js";
export { StructuredListTable } from "./components/StructuredListTable.js";
export { Tab } from "./components/Tab.js";
export { TabBar } from "./components/TabBar.js";
export { Table } from "./components/Table.js";
export { Tag, TagLink } from "./components/Tag.js";
export { Textarea } from "./components/Textarea.js";
export { TextInputIcon } from "./components/TextInputIcon.js";
export { TextList, TextListOrdered } from "./components/TextList.js";
export { ToggleSwitch, ToggleSwitchSize } from "./components/ToggleSwitch.js";
export { Toast } from "./components/Toast.js";
export { Tooltip, TooltipBox, TooltipVertical } from "./components/Tooltip.js";
export { TopButton } from "./components/TopButton.js";
export { Tts, TtsIcon, TtsSize } from "./components/Tts.js";
export { UserFeedback } from "./components/UserFeedback.js";
export type {
  AdditionalProps,
  HeaderMobileMenu,
  HeaderMyMenu,
  MenuBanner,
  MenuDescriptionItem,
  MenuItem,
} from "./types.js";
