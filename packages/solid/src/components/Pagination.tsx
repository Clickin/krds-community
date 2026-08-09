import { For, Show, createSignal, mergeProps, splitProps } from "solid-js";

export interface PaginationProps {
  class?: string;
  className?: string;
  title?: string;
  label?: string;
  message?: string;
  navigationLabel?: string;
  previousDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  items?: (number | "ellipsis" | string)[];
  current?: number;
  modelValue?: number;
  value?: string;
  selected?: string;
  defaultValue?: string;
  [key: string]: unknown;
}

export function Pagination(rawProps: PaginationProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "label",
    "message",
    "navigationLabel",
    "previousDisabled",
    "previousLabel",
    "nextLabel",
    "items",
    "current",
    "modelValue",
    "value",
    "selected",
    "defaultValue",
  ]);
  const [localSelected, setLocalSelected] = createSignal<string>();
  const selected = () => {
    const mv = props.modelValue;
    if (typeof mv === "number") return String(mv);
    if (typeof mv === "string") return mv;
    return props.selected ?? localSelected() ?? props.defaultValue ?? "";
  };
  const setSelected = (next: string) => {
    if (props.modelValue === undefined) setLocalSelected(next);
  };
  const paginationPage = () => {
    const page = Number(props.modelValue ?? props.current ?? selected());
    return Number.isFinite(page) && page > 0 ? page : 1;
  };
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-pagination${className() ? ` ${className()}` : ""}`}
      role="navigation"
      aria-label={props.navigationLabel || "페이지 이동"}
    >
      <Show
        when={!props.previousDisabled}
        fallback={
          <span {...({ href: "#" } as Record<string, string>)} class="page-navi prev disabled">
            {props.previousLabel ?? "이전"}
          </span>
        }
      >
        <a
          class="page-navi prev"
          href="#"
          onClick={() => setSelected(String(Math.max(1, paginationPage() - 1)))}
        >
          {props.previousLabel ?? "이전"}
        </a>
      </Show>
      <div class="page-links">
        <For each={props.items ?? [1, 2, 3, 4, 5]}>
          {(item) =>
            typeof item === "number" ? (
              <a
                href="#"
                class="page-link"
                classList={{ active: item === paginationPage() }}
                onClick={() => setSelected(String(item))}
              >
                <Show when={item === paginationPage()}>
                  <span class="sr-only">{props.message}</span>
                </Show>
                {item}
              </a>
            ) : (
              <span class="page-link link-dot" />
            )
          }
        </For>
      </div>
      <a class="page-navi next" href="#" onClick={() => setSelected(String(paginationPage() + 1))}>
        {props.nextLabel ?? "다음"}
      </a>
    </div>
  );
}
