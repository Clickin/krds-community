import { For, Show, createSignal, createUniqueId, mergeProps, splitProps } from "solid-js";
import type { KrdsOption } from "@krds-community/recipes";

export interface LanguageSwitcherProps {
  class?: string;
  className?: string;
  label?: string;
  open?: boolean;
  currentLabel?: string;
  selected?: string;
  selectedLabel?: string;
  externalTitle?: string;
  defaultValue?: string;
  value?: string;
  modelValue?: string;
  options?: KrdsOption[];
  languages?: KrdsOption[];
  [key: string]: unknown;
}

function LanguageSwitcherInner(rawProps: LanguageSwitcherProps, isPage: boolean) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "label",
    "open",
    "currentLabel",
    "selected",
    "selectedLabel",
    "externalTitle",
    "defaultValue",
    "value",
    "modelValue",
    "options",
    "languages",
  ]);
  const [localOpen, setLocalOpen] = createSignal(false);
  const open = () => (props.open !== undefined ? Boolean(props.open) : localOpen());
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
  };
  const [localSelected, setLocalSelected] = createSignal<string>();
  const selected = () => {
    const mv = props.modelValue;
    if (typeof mv === "string" || typeof mv === "number") return String(mv);
    return props.selected ?? localSelected() ?? props.defaultValue ?? optionItems()[0]?.value ?? "";
  };
  const setSelected = (next: string) => {
    if (props.modelValue === undefined) setLocalSelected(next);
  };
  const className = () => props.class ?? props.className ?? "";
  const optionItems = () => props.languages ?? props.options ?? [];
  const dropMenuId = `krds-language-drop-${createUniqueId()}`;
  return (
    <div
      {...(native as Record<string, any>)}
      class={["krds-drop-wrap", "krds-language", className()].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        class="krds-btn small text drop-btn"
        aria-expanded={open()}
        aria-controls={dropMenuId}
        onClick={() => setOpen(!open())}
      >
        <i class="svg-icon ico-global" /> {props.label} <i class="svg-icon ico-toggle" />
      </button>
      <div class="drop-menu" id={dropMenuId} style={{ display: open() ? "block" : undefined }}>
        <div class="drop-in">
          <Show when={isPage}>
            <div class="drop-top">
              <p class="current-laguage">
                <span>{props.currentLabel}</span>
                <strong>
                  {optionItems().find((option) => option.value === selected())?.label}
                </strong>
              </p>
            </div>
          </Show>
          <ul class="drop-list">
            <For
              each={
                isPage
                  ? optionItems().filter((option) => option.value !== selected())
                  : optionItems()
              }
            >
              {(option) => {
                const language = option as KrdsOption & {
                  href?: string;
                  lang?: string;
                  target?: string;
                  title?: string;
                };
                return (
                  <li>
                    <a
                      href={language.href ?? "#"}
                      class="item-link"
                      classList={{ active: !isPage && selected() === language.value }}
                      lang={language.lang ?? language.value}
                      target={isPage ? (language.target ?? "_blank") : language.target}
                      title={isPage ? (language.title ?? props.externalTitle) : language.title}
                      onClick={(event) => {
                        setSelected(language.value);
                        (native as Record<string, any>).onChange?.(event);
                      }}
                    >
                      {language.label}
                      <Show when={isPage}>
                        <i class="svg-icon ico-go" />
                      </Show>
                      <span class="sr-only">
                        {!isPage && selected() === language.value ? props.selectedLabel : undefined}
                      </span>
                    </a>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function LanguageSwitcher(rawProps: LanguageSwitcherProps) {
  return LanguageSwitcherInner(rawProps, false);
}

export function LanguageSwitcherPage(rawProps: LanguageSwitcherProps) {
  return LanguageSwitcherInner(rawProps, true);
}
