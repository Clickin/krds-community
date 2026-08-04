import { Show, createSignal, mergeProps, splitProps, type JSX } from "solid-js";

export interface ContextualHelpProps {
  id?: string;
  label?: string;
  position?: string;
  caption?: string;
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  closeLabel?: string;
  message?: string;
  class?: string;
  className?: string;
  children?: JSX.Element;
  open?: boolean;
}

export function ContextualHelp(rawProps: ContextualHelpProps) {
  const merged = mergeProps(
    {
      closeLabel: "닫기",
    },
    rawProps,
  );
  const [localOpen, setLocalOpen] = createSignal(false);
  const [props, native] = splitProps(merged, [
    "id",
    "label",
    "open",
    "position",
    "caption",
    "title",
    "description",
    "href",
    "linkLabel",
    "closeLabel",
    "message",
    "class",
    "className",
    "children",
  ]);
  const open = () => (props.open !== undefined ? Boolean(props.open) : localOpen());
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setLocalOpen(next);
  };

  const className = () => props.class ?? props.className ?? "";
  const children = () => props.children;

  return (
    <div
      {...(native as Record<string, any>)}
      class={[
        "krds-contextual-help",
        props.position === "top-left" ? "left top" : props.position?.replace("-", " "),
        className(),
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p class="tooltip-txt">{props.caption}</p>
      <div class="tooltip-action">
        <button
          type="button"
          class="krds-btn medium icon tooltip-btn"
          aria-expanded={open()}
          aria-controls={`${props.id}-popover`}
          onClick={() => setOpen(!open())}
        >
          <span class="sr-only">{props.label}</span>
          <i class="svg-icon ico-tooltip" />
        </button>
        <div
          id={`${props.id}-popover`}
          class="tooltip-popover"
          role="tooltip"
          style={{ display: open() ? "block" : undefined }}
        >
          <h4 class="tooltip-title">{props.title}</h4>
          <div class="tooltip-contents">
            <p>{props.description ?? children()}</p>
            <Show when={props.href}>
              <div class="btn-wrap">
                <a class="krds-btn xsmall basic link" href={props.href}>
                  {props.linkLabel}
                  <i class="svg-icon ico-angle right" />
                </a>
              </div>
            </Show>
          </div>
          <button
            type="button"
            class="krds-btn xsmall icon tooltip-close"
            onClick={() => setOpen(false)}
          >
            <span class="sr-only">{props.closeLabel}</span>
            <i class="svg-icon ico-modal-close" />
          </button>
        </div>
      </div>
    </div>
  );
}
